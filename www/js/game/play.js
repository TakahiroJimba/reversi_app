const IS_DEBUG_MODE = true; // デバッグモードで実行する

const GET_PRIORITY_API_URL = API_URL_BASE + 'api/get_priority';
const SET_TURN_API_URL     = API_URL_BASE + 'api/set_turn';

const canvas = $('#canvas-2d')[0];
const context = canvas.getContext('2d');
const STONE_RATIO = 0.8;

var board_color;
var board_size;
var cell_num;
var is_my_turn;
var user_id;
var game_id;
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

    is_my_turn = getPriority(game_id);

    // 指定の色で範囲内を塗りつぶす
    context.fillStyle = board_color;
    context.fillRect(0, 0, board_size, board_size);

    // 描画処理
    drawCanvas(cell_num, cell_num, board_size / cell_num, board_color);

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
        $('#msg').text('あなたのターンです');
    } else {
        is_my_turn = false;
        my_color = second_color;
        opponent_color = first_color;
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
            $('#selection').css('display', 'none');
            $('#canvas_wrap').css('display', 'block');
            $('.info').css('display', 'block');
            $('#msg').css('display', 'block');
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
    initBoard(row_num, col_num, grid_size, color);
}

// 盤面初期化
function initBoard(row_num, col_num, grid_size, color){
    for(var y = 0; y < row_num; y++){
            for(var x = 0; x < col_num; x++){
                    drawGrid(x, y, grid_size, color);
            }
    }

    var grid_size_half = grid_size / 2;
    drawStone(first_color, grid_size * 4 - grid_size_half, grid_size * 4 - grid_size_half, grid_size_half * STONE_RATIO);
    drawStone(first_color, grid_size * 5 - grid_size_half, grid_size * 5 - grid_size_half, grid_size_half * STONE_RATIO);
    drawStone(second_color, grid_size * 5 - grid_size_half, grid_size * 4 - grid_size_half, grid_size_half * STONE_RATIO);
    drawStone(second_color, grid_size * 4 - grid_size_half, grid_size * 5 - grid_size_half, grid_size_half * STONE_RATIO);

    setStoneNum(true, 2);
    setStoneNum(false, 2);
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
    var grid_size = board_size / cell_num;
    var grid_size_half = grid_size / 2;
    var loc_x = 1 + Math.floor(x / grid_size);
    var loc_y = 1 + Math.floor(y / grid_size);

    // 石を置く
    drawStone(my_color, grid_size * loc_x - grid_size_half, grid_size * loc_y - grid_size_half, grid_size_half * STONE_RATIO);

    if (!IS_DEBUG_MODE)
    {
        // 相手のターンにする
        is_my_turn = false;
        $('#msg').text('相手のターンです');
    }
}

// 画面に表示されている石の数を更新する
function setStoneNum(is_my, num){
    var id_name = is_my ? "you_info" : "opponent_info";
    $(`#${id_name} > .stone_num`).text(num);
}
