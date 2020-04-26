let LOGIN_AUTH_API_URL = GAME_MANAGER_URL_BASE + 'api/login_auth';
let USER_REGISTRATION_URL = GAME_MANAGER_URL_BASE + 'user/registration';
let PASSWORD_FORGET_URL = GAME_MANAGER_URL_BASE + 'user/pw/reset';

$(function(){
    // ログインボタン押下
    $('#login_btn').on('click',function() {
        // 連打防止制御
        if(isPosting()){
            return;
        }

        $(this).prop('disabled',true);        //ボタンを無効化する
        var mail_address = $('#mail_address').val();
        var password     = $('#password').val();
        var err_msg_ele  = $('#err_msg').children('p');

        // 入力チェック
        if(mail_address == "")
        {
            err_msg_ele.text("メールアドレスを入力してください");
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
            data: {'mail_address': mail_address, 'password': password, 'app_info_id' : APP_INFO_ID, '_method': 'POST'},
            success: function(response) {
                var json_data = JSON.parse(response);
                if (json_data.is_login != '1') {
                    // 認証失敗
                    err_msg_ele.html(json_data.err_msg);
                } else {
                    // 認証成功
                    // APIから取得したuser_idとsession_idをlocalStorageに格納する
                    localStorage.setItem('user_id', json_data.user_id);
                    localStorage.setItem('session_id', json_data.session_id);
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
    });

    // "パスワードを忘れた方"ボタン押下
    $('#pass_forget_btn').on('click',function() {
        window.location.href = PASSWORD_FORGET_URL;
    });
});
