let LOGOUT_API_URL = GAME_MANAGER_URL_BASE + 'api/logout';
let CREATE_OFFLINE_GAME_API_URL = API_URL_BASE + 'api/create_offline_game';

$(function(){
    // ルーム作成ボタンクリック
    $('#show_create_room_btn').on('click',function() {
        localStorage.setItem('game_mode', GAME_MODE_ONLINE);
        window.location.href = '../html/room/create_room.html';
    });

    // 2人で対戦(オフライン)ボタンクリック
    $('#off-line_btn').on('click',function() {
        var user_id = localStorage.getItem('user_id');
        if(user_id == null){
            // localStorageが削除されていた場合を考慮
            window.location.href = '../html/index.html';
            return;
        }
        // TODO: ボードサイズを選択できるようにする
        var board_size = 8;

        // Gameレコードを作成するAPIを呼ぶ
        $.ajax({
            url: CREATE_OFFLINE_GAME_API_URL,
            type: 'POST',
            data: {'user_id': user_id, 'board_size': board_size, '_method': 'POST'},
            success: function(response) {
                var json_data = JSON.parse(response);
                if (json_data.is_success != '1') {
                    // Gameレコード作成に失敗した場合
                    alert('サーバエラーが発生しました。管理者へお問い合わせください。');
                } else {
                    // Gameレコード作成に成功した場合
                    localStorage.setItem('game_id', json_data.game_id);
                    localStorage.setItem('game_mode', GAME_MODE_OFFLINE);
                    window.location.href = '../html/game/play.html';
                }
            },
            fail: function(response) {
                // 通信に失敗した場合
                alert('サーバ通信に失敗しました。ネットワーク接続環境をご確認ください。');
            },
        });

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
