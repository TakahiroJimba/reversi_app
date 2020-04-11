let USER_AUTH_API_URL = API_URL_BASE + 'api/user_auth';

$(function(){
    // 認証ボタンクリック
    $('#user_auth_btn').on('click',function() {
        var pass_phrase = $('#pass_phrase').val();
        var mail_address = localStorage.getItem('mail_address');

        // localStorageから値が取得できなかった場合
        if(!mail_address){
            // エラー画面に遷移する
            window.location.href = '../../../html/error.html';
            return;
        }
        if(pass_phrase == ""){
            $('#err_msg').html("認証コードを入力してください。");
            return;
        }

        // 認証、本登録処理
        $.ajax({
            url: USER_AUTH_API_URL,
            type: 'POST',
            data: {'mail_address': mail_address, 'pass_phrase': pass_phrase, '_method': 'POST'},
            success: function(response) {
                var json_data = JSON.parse(response);
                if (!json_data.status == 0) {
                    // 登録失敗 statusの値で場合分けする
                    if (json_data.status == 51) {
                        // 認証コード相違 → エラーメッセージ
                        $('#err_msg').html("認証コードが違います。");
                    } else if (json_data.status == 52) {
                        // 認証コード期限切れ → 有効期限切れページへ遷移
                        localStorage.removeItem("mail_address");
                        window.location.href = '../../../html/user/registration/expiration.html';
                    } else if (json_data.status == 53) {
                        // サーバ内部エラー → エラー画面へ遷移
                        localStorage.removeItem("mail_address");
                        window.location.href = '../../../html/error.html';
                    }
                    return;
                }
                // 登録成功時、登録完了画面に遷移する
                localStorage.removeItem("mail_address");
                window.location.href = '../../../html/user/registration/complete.html';
            },
            fail: function(response) {
               // ajax失敗時の処理
               $('#err_msg').html("通信に失敗しました。<br>しばらくしてから再度お試しください。");
            },
        });
    });

});
