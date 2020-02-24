const canvas = $('#canvas-2d')[0];
const context = canvas.getContext('2d');

$(function(){
    // 指定の色で範囲内を塗りつぶす
    context.fillStyle = 'rgb(0, 138, 22)';
    context.fillRect(0, 0, 360, 360);
});
