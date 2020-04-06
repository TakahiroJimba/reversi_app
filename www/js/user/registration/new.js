let USER_REGISTRATION_API_URL = API_URL_BASE + 'api/user_registration';

$(function(){
    // 登録ボタンクリック
    $('#registration_btn').on('click',function() {
        var mail_address = $('#mail_address').val();
        var name = $('#name').val();
        var password = $('#password').val();
        var password_confirmation = $('#password_confirmation').val();

        // バリデーション
        var basic_info_err_msg = userValidation(mail_address, name);
        var password_err_msg = userPasswordValidation(password, password_confirmation);
        var err_msgs = basic_info_err_msg.concat(password_err_msg);
        if(err_msgs.length != 0){
            var err_msg_html = getHTML_Text(err_msgs);
            $('#err_msg').html(err_msg_html);
            return;
        }

        // ユーザ登録
        $.ajax({
            url: USER_REGISTRATION_API_URL,
            type: 'POST',
            data: {'mail_address': mail_address, 'name': name, 'password': password, '_method': 'POST'},
            success: function(response) {
                var json_data = JSON.parse(response);
                if (!json_data.is_success) {
                    // 登録失敗(メールアドレス、ニックネーム重複登録など)
                    var err_msgs = json_data.err_msgs;
                    var err_msg_html = getHTML_Text(err_msgs);
                    $('#err_msg').html(err_msg_html);
                    return;
                }
                // 登録成功時、認証コード入力画面に遷移する
                localStorage.setItem('mail_address', mail_address);
                window.location.href = '../../../html/user/registration/auth.html';
            },
            fail: function(response) {
               // ajax失敗時の処理
               $('#err_msg').html("通信に失敗しました。<br>しばらくしてから再度お試しください。");
            },
        });
    });

});
