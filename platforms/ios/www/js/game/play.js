const canvas = $('#canvas-2d')[0];
const context = canvas.getContext('2d');
const STONE_RATIO = 0.8;

var board_color;
var board_size;
var cell_num;

$(function(){
    board_color = 'rgb(0, 138, 22)';
    board_size = 360;
    cell_num = 8;

    // 指定の色で範囲内を塗りつぶす
    context.fillStyle = board_color;
    context.fillRect(0, 0, board_size, board_size);

    // 描画処理
    drawCanvas(cell_num, cell_num, board_size / cell_num, board_color);

    canvas.addEventListener('click', onClick, false);
});

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
    drawStone('white', grid_size * 4 - grid_size_half, grid_size * 4 - grid_size_half, grid_size_half * STONE_RATIO);
    drawStone('white', grid_size * 5 - grid_size_half, grid_size * 5 - grid_size_half, grid_size_half * STONE_RATIO);
    drawStone('black', grid_size * 5 - grid_size_half, grid_size * 4 - grid_size_half, grid_size_half * STONE_RATIO);
    drawStone('black', grid_size * 4 - grid_size_half, grid_size * 5 - grid_size_half, grid_size_half * STONE_RATIO);
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
    drawStone('white', grid_size * loc_x - grid_size_half, grid_size * loc_y - grid_size_half, grid_size_half * STONE_RATIO);
}
