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
                window.location.href = '../../html/registration/auth.html';
            },
            fail: function(response) {
               // ajax失敗時の処理
               $('#err_msg').html("通信に失敗しました。<br>しばらくしてから再度お試しください。");
            },
        });

    });
});

// ユーザ情報バリデーション
function userValidation(mail_address, name){
    var err_msgs = [];

    // メールアドレス
    if(mail_address == ""){
        err_msgs.push("メールアドレスを入力してください。");
    }else{
        var mail_address_regexp = /^[A-Za-z0-9]{1}[A-Za-z0-9_.+-]*@{1}[A-Za-z0-9_.-]{1,}\.[A-Za-z0-9]{1,}$/;
        if(!mail_address_regexp.test(mail_address)){
            err_msgs.push("メールアドレスに登録できない文字が含まれている、または不正なメールアドレスです。");
        }
    }

    // ニックネーム
    if(name == ""){
        err_msgs.push("ニックネームを入力してください。");
    }else if(name.length > USER_NAME_MAX_LENGTH){
        err_msgs.push("ニックネームは" + USER_NAME_MAX_LENGTH + "文字以内で入力してください。");
    }
    return err_msgs;
}

// パスワードバリデーション
function userPasswordValidation(password, password_confirmation){
    var err_msgs = [];

    // パスワード
    var regexp = new RegExp('[a-z\d]{' + USER_PASSWORD_MIN_LENGTH + ',' + USER_PASSWORD_MAX_LENGTH + '}', 'i');
    if(!regexp.test(password)){
        err_msgs.push("パスワードは半角英数字" + USER_PASSWORD_MIN_LENGTH + "〜" + USER_PASSWORD_MAX_LENGTH + "文字で入力してください。");
    }else if(password != password_confirmation){
        err_msgs.push("確認用パスワードには同じパスワードを入力してください。");
    }
    return err_msgs;
}

// エラーメッセージ配列をHTMLテキストに変換する
function getHTML_Text(err_msgs){
    var err_msg_html = "";
    for(var i = 0; i < err_msgs.length; i++){
        if (i != 0){
            err_msg_html += "<br>";
        }
        err_msg_html += err_msgs[i];
    }
    return err_msg_html;
}
