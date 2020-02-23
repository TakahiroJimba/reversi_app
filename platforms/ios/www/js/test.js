let LOGIN_AUTH_API_URL = 'http://127.0.0.1:8001/api/login_auth';

$(function(){
    // サーバ接続テストボタン
    $('#test_server_connection_btn').on('click',function() {
        $.ajax({
            url: LOGIN_AUTH_API_URL,
            type: 'POST',
            data: {'id': 'test_id', 'password': 'password', '_method': 'POST'},
            success: function(response) {
                var json_data = JSON.parse(response);
                if (json_data.is_login == '1') {
                    // 認証成功
                    alert("認証成功");
                } else {
                    // 認証失敗
                    alert("認証失敗");
                }
            },
            fail: function(response) {
               // ajax失敗時の処理
               // TODO: ダイアログにする
               alert("サーバ接続に失敗しました。");
           },
        });
    });
});
