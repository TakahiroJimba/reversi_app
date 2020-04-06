let USER_UNIQUE_NAME_API_URL = API_URL_BASE + 'api/user_unique_name';
let USER_UNIQUE_MAIL_ADDRESS_API_URL = API_URL_BASE + 'api/user_unique_mail_address';

$(function(){
    // ニックネーム重複チェック
    $('#name').on('blur',function() {
        var name = $('#name').val();
        if(nameValidation(name).length != 0){
            return;
        }
        // バリデーションをクリアした場合に重複チェック
        $.ajax({
            url: USER_UNIQUE_NAME_API_URL,
            type: 'POST',
            data: {'name': name '_method': 'POST'},
            success: function(response) {
                var json_data = JSON.parse(response);
                var msg = "OK";
                if (json_data.is_unique) {
                    // 登録可能
                    $('#name_msg').html(msg);
                } else {
                    // 既に登録済み
                    msg = "すでに登録済みです";
                    $('#name_err_msg').html(msg);
                }
            },
            fail: function(response) {
               // ajax失敗時の処理
               // 何もしない
            },
        });
    });

    // メールアドレス重複チェック
    $('#mail_address').on('blur',function() {
        var mail_address = $('#mail_address').val();
        if(mailAddressValidation(mail_address).length != 0){
            return;
        }
        // バリデーションをクリアした場合に重複チェック
        $.ajax({
            url: USER_UNIQUE_MAIL_ADDRESS_API_URL,
            type: 'POST',
            data: {'mail_address': mail_address, '_method': 'POST'},
            success: function(response) {
                var json_data = JSON.parse(response);
                var msg = "OK";
                if (json_data.is_unique) {
                    // 登録可能
                    $('#mail_address_msg').html(msg);
                } else {
                    // 既に登録済み
                    msg = "すでに登録済みです";
                    $('#mail_address_err_msg').html(msg);
                }
            },
            fail: function(response) {
               // ajax失敗時の処理
               // 何もしない
            },
        });
    });
});

// メールアドレスバリデーション
function mailAddressValidation(mail_address){
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
    return err_msgs;
}

// ニックネームバリデーション
function nameValidation(name){
    var err_msgs = [];

    // ニックネーム
    if(name == ""){
        err_msgs.push("ニックネームを入力してください。");
    }else if(name.length > USER_NAME_MAX_LENGTH){
        err_msgs.push("ニックネームは" + USER_NAME_MAX_LENGTH + "文字以内で入力してください。");
    }
    return err_msgs;
}

// ユーザ情報バリデーション
function userValidation(mail_address, name){
    var err_msgs = [];
    err_msgs = mailAddressValidation(mail_address);
    err_msgs = err_msgs.concat(nameValidation(name));
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
