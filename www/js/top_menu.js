$(function(){
    // ルーム作成ボタンクリック
    $('#show_create_room_btn').on('click',function() {
        localStorage.setItem('game_mode', GAME_MODE_ONLINE);
        window.location.href = '../html/room/create_room.html';
    });

    // 2人で対戦(オフライン)ボタンクリック
    $('#off-line_btn').on('click',function() {
        localStorage.setItem('game_mode', GAME_MODE_OFFLINE);
        window.location.href = '../html/game/play.html';
    });
});
