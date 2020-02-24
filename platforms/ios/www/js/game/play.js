const canvas = $('#canvas-2d')[0];
const context = canvas.getContext('2d');

$(function(){
    var board_color = 'rgb(0, 138, 22)';
    var board_size = 360;
    var cell_num = 8;

    // 指定の色で範囲内を塗りつぶす
    context.fillStyle = board_color;
    context.fillRect(0, 0, board_size, board_size);

    // 描画処理
    drawCanvas(cell_num, cell_num, board_size / cell_num, board_color);
});

function drawCanvas(row_num, col_num, grid_size, color){
    for(var y = 0; y < row_num; y++){
            for(var x = 0; x < col_num; x++){
                    drawGrid(x, y, grid_size, color);
            }
    }

    var grid_size_half = grid_size / 2;
    var stone_ratio = 0.8;
    drawStone('white', grid_size * 4 - grid_size_half, grid_size * 4 - grid_size_half, grid_size_half * stone_ratio);
    drawStone('white', grid_size * 5 - grid_size_half, grid_size * 5 - grid_size_half, grid_size_half * stone_ratio);
    drawStone('black', grid_size * 5 - grid_size_half, grid_size * 4 - grid_size_half, grid_size_half * stone_ratio);
    drawStone('black', grid_size * 4 - grid_size_half, grid_size * 5 - grid_size_half, grid_size_half * stone_ratio);
}

function drawGrid(x, y, grid_size, color){
    context.clearRect(x * grid_size, y * grid_size, grid_size, grid_size);
    context.fillStyle = color;
    context.strokeStyle = 'black';
    context.fillRect(x * grid_size, y * grid_size, grid_size, grid_size);
    context.strokeRect(x * grid_size, y * grid_size, grid_size, grid_size);
}

 function drawStone(color, x, y, radius){
    context.beginPath();//円を描くためのパスを一度リセットする。
    context.lineWidth = 0;
    context.arc(x, y, radius, 0, 2 * Math.PI, false);
    context.fillStyle = color;
    context.fill();
    context.strokeStyle = color;
    context.stroke();
 }
