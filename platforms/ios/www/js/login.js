let LOGIN_AUTH_API_URL = API_URL_BASE + 'api/login_auth';
let USER_REGISTRATION_URL = GAME_MANAGER_URL_BASE + '/user/registration';

$(function(){
    // ログインボタン押下
    $('#login_btn').on('click',function() {
        var id = $('#id').val();
        var password = $('#password').val();
        var err_msg_ele = $('#err_msg').children('p');

        // 入力チェック
        if(id == "")
        {
            err_msg_ele.text("IDを入力してください");
            return;
        }
        if(password == "")
        {
            err_msg_ele.text("パスワードを入力してください");
            return;
        }

        // サーバ認証
        $.ajax({
            url: LOGIN_AUTH_API_URL,
            type: 'POST',
            data: {'id': id, 'password': password, '_method': 'POST'},
            success: function(response) {
                var json_data = JSON.parse(response);
                if (json_data.is_login != '1') {
                    // 認証失敗
                    err_msg_ele.text("ID または パスワードが違います");
                } else {
                    // 認証成功
                    // TODO: APIから取得したsession_idをlocalStorageに格納する
                    localStorage.setItem('session_id', 'TODO');
                    window.location.href = '../html/top_menu.html';
                }
            },
            fail: function(response) {
               // ajax失敗時の処理
               err_msg_ele.text("通信に失敗しました。しばらくしてから再度お試しください。");
           },
        });
    });

    // ユーザ登録ボタン押下
    $('#registration_btn').on('click',function() {
        window.location.href = USER_REGISTRATION_URL;
        //window.location.href = '../html/user/registration/new.html';
    });
});
