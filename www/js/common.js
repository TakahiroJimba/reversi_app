// --- 定数宣言 ---
let API_URL_BASE = 'http://104.155.141.249/';
let GAME_MANAGER_URL_BASE = 'https://www.game-collection.jp/';
// let API_URL_BASE = 'http://127.0.0.1:8001/';
// let GAME_MANAGER_URL_BASE = 'http://127.0.0.1:8002/';
let IS_LOGIN_API_URL = GAME_MANAGER_URL_BASE + 'api/is_login';

var posting_flag = false;

var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();

$(function(){
    // FastClickを使用する
    FastClick.attach(document.body);
});

// 連打防止制御
function isPosting(){
    if(posting_flag){
        return true;
    }else{
        posting_flag = true;
        return false;
    }
}

// カスタムURLでアクセス時に呼ばれるメソッド
function handleOpenURL(url) {
    // window.location.href = '../html/login_auth.html';
    // // ログインしていたらメニュー画面に遷移する
    // // var user_id    = localStorage.getItem('user_id');
    // // var session_id = localStorage.getItem('session_id');
    // // alert(user_id);
    // // alert(session_id);
    // alert(url);
    // var params = url.split('://');
    // params = params[1].split('/');
    // if(params.length != 2){
    //     return;
    // }
    //
    // var user_id = params[0];
    // var session_id = params[1];
    // alert(user_id);
    // alert(session_id);
    //
    // // if(user_id == null || session_id == null){
    // //     return;
    // // }
    //
    // // ログインチェックAPI呼び出し
    // $.ajax({
    //     url: IS_LOGIN_API_URL,
    //     type: 'POST',
    //     data: {'user_id': user_id, 'session_id': session_id, '_method': 'POST'},
    //     success: function(response) {
    //         var json_data = JSON.parse(response);
    //         if (json_data.is_login == '1') {
    //             // ログイン状態時はメニュー画面へ
    //             window.location.href = '../html/top_menu.html';
    //             return;
    //         }
    //         // ログイン画面へ
    //         window.location.href = '../html/index.html';
    //     },
    //     fail: function(response) {
    //        // ajax失敗時の処理
    //        err_msg_ele.text("通信に失敗しました。しばらくしてから再度お試しください。");
    //        window.location.href = '../html/index.html';
    //     },
    // });

}
