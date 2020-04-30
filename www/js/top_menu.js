let LOGOUT_API_URL = GAME_MANAGER_URL_BASE + 'api/logout';


$(function(){
    // ルーム作成ボタンクリック
    $('#show_create_room_btn').on('click',function() {
        localStorage.setItem('game_mode', GAME_MODE_ONLINE);
        window.location.href = '../html/room/create_room.html';
    });

    // 2人で対戦(オフライン)ボタンクリック
    $('#off-line_btn').on('click',function() {
        // オフライン対戦ゲームを開始する
        // TODO: ボードサイズを選択できるようにする
        var board_size = 8;
        create_offline_game(board_size, 0);
    });

    //ログアウトボタン押下
    $('#logout_btn').on('click',function() {
        // 連打防止制御
        if(isPosting()){
            return;
        }

        var user_id    = localStorage.getItem('user_id');
        var session_id = localStorage.getItem('session_id');

        if(user_id == null || session_id == null){
            window.location.href = '../html/index.html';
            return;
        }

        // localStorageのデータ削除
        localStorage.removeItem('user_id');
        localStorage.removeItem('session_id');

        // サーバ側ログアウト処理
        $.ajax({
            url: LOGOUT_API_URL,
            type: 'POST',
            data: {'user_id': user_id, 'session_id': session_id, 'app_info_id' : APP_INFO_ID, '_method': 'POST'},
            success: function(response) {
                var json_data = JSON.parse(response);
                if (json_data.is_logout != '1') {
                    // 特に何もしない(サーバ側ログアウトに失敗してもlocalStorageを削除するので問題ない方針)
                    logout();
                } else {
                    // ログアウト成功
                    // 特に何もしない
                    logout();
                }
            },
            fail: function(response) {
                // 特に何もしない(サーバ側ログアウトに失敗してもlocalStorageを削除するので問題ない方針)
                logout();
            },
        });
    });
});

function logout(){
    window.location.href = '../html/index.html';
}
