let CREATE_OFFLINE_GAME_API_URL = API_URL_BASE + 'api/create_offline_game';

// オフライン対戦ゲームを開始する
function create_offline_game(board_size, depth){
    // 引数の"深さ"を基に、相対パスを作成する
    var back_path = '';
    for(var i = 0; i < depth; i++){
        back_path += '../';
    }

    var user_id = localStorage.getItem('user_id');
    if(user_id == null){
        // ログインしていない場合でもオフライン対戦は可能とする
        localStorage.setItem('game_mode', GAME_MODE_OFFLINE);
        localStorage.removeItem('game_id');
        window.location.href = back_path + '../html/game/play.html';
        return;
    }

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
                window.location.href = back_path + '../html/game/play.html';
            }
        },
        fail: function(response) {
            // 通信に失敗した場合
            alert('サーバ通信に失敗しました。ネットワーク接続環境をご確認ください。');
        },
    });
}
