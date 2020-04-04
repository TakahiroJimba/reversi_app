const IS_DEBUG_MODE = true; // デバッグモードで実行する

// APIパス
const GET_PRIORITY_API_URL = API_URL_BASE + 'api/get_priority';
const SET_TURN_API_URL     = API_URL_BASE + 'api/set_turn';

const canvas = $('#canvas-2d')[0];
const context = canvas.getContext('2d');

// 8方向を示すクラス
class Direction {
  constructor(d_x, d_y) {
    this.d_x = d_x;
    this.d_y = d_y;
  }
}
const direction_array = [];

// マスに対する石の大きさ比率
const STONE_RATIO = 0.8;

// enum代り
const NONE = 0;
const FIRST_COLOR_STONE = 1;
const SECOND_COLOR_STONE = 2;

// 石の配置を1次元配列で表現
var board_stone_array = [];

var board_color;
var board_size;
var grid_size;
var grid_size_half;

// セルの数
var cell_num;

var is_my_turn;
var user_id;
var game_id;

// 自分の石の番号(1 or 2)
var my_stone_number;
var my_color;
var first_color;
var second_color;

$(function(){
    // 石の色を設定
    first_color = 'white';
    second_color = 'black';

    // TODO: localStorageからuser_idを取得して格納
    user_id = "test";

    // TODO: sessionStorageからgame_idを取得して格納
    game_id = "test";

    // 先行/後攻ボタンクリック
    $('#first_btn').on('click', clickFirstOrSecondBtn);
    $('#second_btn').on('click', clickFirstOrSecondBtn);

    board_color = 'rgb(0, 138, 22)';
    board_size = 360;
    cell_num = 8;
    grid_size = board_size / cell_num;
    grid_size_half = grid_size / 2;

    is_my_turn = getPriority(game_id);

    canvas.addEventListener('click', onClick, false);
});

// 先行後攻決定ボタンクリック
function clickFirstOrSecondBtn()
{
    var clicked_id = $(this).attr("id");
    var turn = "";  // 後攻選択時は空白とする
    var opponent_color;
    if (clicked_id == "first_btn"){
        // 先行が選択された
        turn = user_id;
        is_my_turn = true;
        my_color = first_color;
        opponent_color = second_color;
        my_stone_number = FIRST_COLOR_STONE;
        $('#msg').text('あなたのターンです');
    } else {
        is_my_turn = false;
        my_color = second_color;
        opponent_color = first_color;
        my_stone_number = SECOND_COLOR_STONE;
        $('#msg').text('相手のターンです');
    }

    // TODO: API game_idをパラメータとし、自分と対戦相手のニックネームを取得する
    var my_name = "自分test";
    var opponent_name = "対戦相手test";

    // 名前を表示する
    $('#you_info > .name').text(my_name);
    $('#opponent_info > .name').text(opponent_name);

    // 石の表示色を変更する
    $('#you_stone').css('background-color', my_color);
    $('#opponent_stone').css('background-color', opponent_color);

    // turn設定APIを呼ぶ
    $.ajax({
        url: SET_TURN_API_URL,
        type: 'POST',
        data: {'game_id': game_id, 'turn': turn, '_method': 'POST'},
        success: function(response) {
            // 指定の色で範囲内を塗りつぶす
            context.fillStyle = board_color;
            context.fillRect(0, 0, board_size, board_size);

            // 描画処理
            drawCanvas(cell_num, cell_num, board_size / cell_num, board_color);

            $('#selection').css('display', 'none');
            $('#canvas_wrap').css('display', 'block');
            $('.info').css('display', 'block');
            $('#msg').css('display', 'block');

            if(IS_DEBUG_MODE){
                $('#debug_info').css('display', 'block');
            }
        },
        fail: function(response) {
           // ajax失敗時の処理
           //err_msg_ele.text("通信に失敗しました。しばらくしてから再度お試しください。");
        },
    });
}

// 優先権を取得
function getPriority(game_id){
    $.ajax({
        url: GET_PRIORITY_API_URL,
        type: 'POST',
        data: {'game_id': game_id, '_method': 'POST'},
        success: function(response) {
            var json_data = JSON.parse(response);
            if (!json_data.priority) {
                // 優先権なし
                $('#waiting').css('display', 'block');
                return;
            }
            // 先行後攻を決める優先権あり
            $('#selection').css('display', 'block');
        },
        fail: function(response) {
           // ajax失敗時の処理
           //err_msg_ele.text("通信に失敗しました。しばらくしてから再度お試しください。");
        },
    });
}

// 描画処理
function drawCanvas(row_num, col_num, grid_size, color){
    initDirectionArray();
    initBoard(row_num, col_num, grid_size, color);
}

// 方向定数の初期化
function initDirectionArray(){
    for(var x = -1; x <= 1; x++){
        for(var y = -1; y <= 1; y++){
            if(x == 0 && y == 0)
            {
                continue;
            }
            direction_array.push(new Direction(x, y));
        }
    }
}

// 盤面初期化
function initBoard(row_num, col_num, grid_size, color){
    // 石の配置の初期化
    for(var y = 0; y < row_num; y++){
        for(var x = 0; x < col_num; x++){
            board_stone_array[y + x * col_num] = NONE;
        }
    }

    // セルの描画
    for(var y = 0; y < row_num; y++){
        for(var x = 0; x < col_num; x++){
            drawGrid(x, y, grid_size, color);
        }
    }

    // 石を配置
    putStone(3, 3, FIRST_COLOR_STONE);
    putStone(4, 4, FIRST_COLOR_STONE);
    putStone(4, 3, SECOND_COLOR_STONE);
    putStone(3, 4, SECOND_COLOR_STONE);

    // 石の数を表示
    setStoneNum(true, 2);
    setStoneNum(false, 2);

    // 石が置ける場所にマークを描画する
    drawCanPutMark(my_stone_number);
}

// ボードを描画
function drawGrid(x, y, grid_size, color){
    context.clearRect(x * grid_size, y * grid_size, grid_size, grid_size);
    context.fillStyle = color;
    context.strokeStyle = 'black';
    context.fillRect(x * grid_size, y * grid_size, grid_size, grid_size);
    context.strokeRect(x * grid_size, y * grid_size, grid_size, grid_size);
}

// 石を描画(座標は1から始まるので注意)
function drawStone(color, x, y, radius){
    context.beginPath();//円を描くためのパスを一度リセットする。
    context.lineWidth = 0;
    context.arc(x, y, radius, 0, 2 * Math.PI, false);
    context.fillStyle = color;
    context.fill();
    context.strokeStyle = color;
    context.stroke();
}

// マスの描画をリセットする
// function drawStone(color, x, y){
//     context.beginPath();    //パスを一度リセットする。
//     // 面を描画
//     context.fillStyle = board_color;
//     context.fillRect(0, 0, 100, 100);
// }

// クリックイベントハンドラ
function onClick(e) {
    if(!is_my_turn && !IS_DEBUG_MODE){
        // 相手のターン
        return;
    }

    /*
     * rectでcanvasの絶対座標位置を取得し、
     * クリック座標であるe.clientX,e.clientYからその分を引く
     * ※クリック座標はdocumentからの位置を返すため
     * ※rectはスクロール量によって値が変わるので、onClick()内でつど定義
     */
    var rect = e.target.getBoundingClientRect();
    x = e.clientX - rect.left;
    y = e.clientY - rect.top;

    // クリック座標を、石を置く座標に変換
    var loc_x = Math.floor(x / grid_size);
    var loc_y = Math.floor(y / grid_size);

    // 石が置けるか確認
    if (!canPut(loc_x, loc_y, my_stone_number)) {
        return;
    }

    // 石を置く
    putStone(loc_x, loc_y, my_stone_number);

    // 相手の石が置ける場所にマークを描画する
    var opponent_stone_number = my_stone_number == FIRST_COLOR_STONE ? SECOND_COLOR_STONE : FIRST_COLOR_STONE;
    if(drawCanPutMark(opponent_stone_number) != 0){
        // 相手のターンにする
        is_my_turn = !is_my_turn;
        $('#msg').text('相手のターンです');
        if (IS_DEBUG_MODE){
            // デバッグモード 次のターンに相手の石を置けるようにする
            changeMyColor();
        }
    }else{
        // 相手の石を置く場所が無い場合、パスとする
        // TODO: さらに自分も置く場所が無い場合、勝敗判定をする

    }

    // 石の数を数える
    var first_color_num = countStones(FIRST_COLOR_STONE);
    var second_color_num = countStones(SECOND_COLOR_STONE);
    setStoneNum(true, first_color_num);
    setStoneNum(false, second_color_num);

    if(IS_DEBUG_MODE){
        // デバッグ用の情報を出力する
        var html_text = "";
        for(var y = 0; y < cell_num; y++){
            for(var x = 0; x < cell_num; x++){
                 html_text += board_stone_array[y + x * cell_num];
            }
            html_text += "<br>";
        }
        $('#board').html(html_text);
        $('#is_my_turn').text(is_my_turn);
        $('#my_stone_number').text(my_stone_number);
        $('#my_color').text(my_color);
    }
}

// 石が置ける位置にマークを描画する
function drawCanPutMark(stone_number)
{
    var can_put_count = 0;
    for(var y = 0; y < cell_num; y++){
        for(var x = 0; x < cell_num; x++){
            if(getBoardStone(x, y) != NONE){
                continue;
            }
            if(canPut(x, y, stone_number)){
                // マークを描画する
                drawStone("red", grid_size * (x + 1) - grid_size_half, grid_size * (y + 1) - grid_size_half, grid_size_half * 0.15);
                can_put_count++;
            }else{
                // セルの描画をリセットする
                drawGrid(x, y, board_size / cell_num, board_color);
            }
        }
    }
    return can_put_count;
}

// 画面に表示されている石の数を更新する
function setStoneNum(is_my, num){
    var id_name = is_my ? "you_info" : "opponent_info";
    $(`#${id_name} > .stone_num`).text(num);
}

// デバッグ時のみ有効
function changeMyColor(){
    if(my_color == first_color){
        my_color = second_color;
        my_stone_number = SECOND_COLOR_STONE;
    }else{
        my_color = first_color;
        my_stone_number = FIRST_COLOR_STONE;
    }
}

// 石の数を数える
function countStones(stone_number){
    var count = 0;
    for(var y = 0; y < cell_num; y++){
        for(var x = 0; x < cell_num; x++){
            if (board_stone_array[y + x * cell_num] == stone_number) {
                count++;
            }
        }
    }
    return count;
}

// 石を置く
function putStone(x, y, stone_number){
    // クリックされた場所に石を置く
    var put_color = stone_number == FIRST_COLOR_STONE ? first_color : second_color;
    board_stone_array[y + x * cell_num] = stone_number;
    drawStone(put_color, grid_size * (x + 1) - grid_size_half, grid_size * (y + 1) - grid_size_half, grid_size_half * STONE_RATIO);

    // --- 各方向について、挟んだ相手の石をひっくり返す ---
    for(var i = 0; i < direction_array.length; i++)
    {
        // ある方向の挟んでいる石の数を取得
        var turn_over_count = TurnOverCount(x, y, direction_array[i], stone_number);
        for(var step = 1; step <= turn_over_count; step++)
        {
            var now_x = x + step * direction_array[i].d_x;
            var now_y = y + step * direction_array[i].d_y;
            board_stone_array[now_y + now_x * cell_num] = stone_number;
            drawStone(put_color, grid_size * (now_x + 1) - grid_size_half, grid_size * (now_y + 1) - grid_size_half, grid_size_half * STONE_RATIO);
        }
    }
}

// 石が置けるか確認
function canPut(x, y, stone_number){
    var put_target = board_stone_array[y + x * cell_num];
    if (put_target != NONE) {
        // 既に石が置かれている
        return false;
    }
    // 全方向について、相手の石を挟んでいるかチェックする
    return watchLine(x, y, stone_number);
}

// 盤の範囲内であればtrueを返す
function inBoardRange(x, y){
    if (x < 0 || x >= cell_num) {
        return false;
    }
    if (y < 0 || y >= cell_num) {
        return false;
    }
    return true;
}

// 相手の石を挟んでいるかチェックする
function watchLine(x, y, stone_number){
    // 各方向について処理
    var turn_over_count = 0;
    for(var i = 0; i < direction_array.length; i++)
    {
        turn_over_count += TurnOverCount(x, y, direction_array[i], stone_number);
    }
    if (turn_over_count == 0)
    {
        // 全方向について、相手の石を挟んでいない
        return false;
    }
    // 挟んでいる石がある
    return true;
}

// 引数の方向について、挟んでいる相手の石の数を返す
function TurnOverCount(x, y, d, stone_number)
{
    var d_x = d.d_x;
    var d_y = d.d_y;
    var step = 1;   // いくつ隣か
    var exist_opponent_stone = false;   // 相手の石を挟んでいるか

    while (inBoardRange(x + step * d_x, y + step * d_y)) {
        var location = board_stone_array[(y + step * d_y) + (x + step * d_x) * cell_num];
        if (location == NONE) {
            break;
        }
        if (exist_opponent_stone) {
            // 既に相手の石を挟んでいる
            if (location == stone_number) {
                // 自分の石だった場合
                return step - 1;
            }
        } else {
            // まだ相手の石を挟んでいない
            if (location != stone_number) {
                // 相手の石だった場合
                exist_opponent_stone = true;
            }
        }
        step++;
    }
    return 0;
}

// getterとsetter
function getBoardStone(x, y)
{
    return board_stone_array[y + x * cell_num];
}
function setBoardStone(x, y, stone_number)
{
    board_stone_array[y + x * cell_num] = stone_number;
}
