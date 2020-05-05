// --- 定数宣言 ---
// ↓↓↓ リリース版の場合はtrueにする ↓↓↓
let IS_PRODUCTION = false;

let API_URL_BASE;
let GAME_MANAGER_URL_BASE;
let ADMOB_BANNER_ID_FOR_IOS;
let ADMOB_BANNER_ID_FOR_ANDROID;

if(IS_PRODUCTION){
    // 本番環境
    API_URL_BASE          = 'http://104.155.141.249/';
    GAME_MANAGER_URL_BASE = 'https://www.game-collection.jp/';
    ADMOB_BANNER_ID_FOR_IOS     = 'ca-app-pub-9258943917656102/5517707641';
    ADMOB_BANNER_ID_FOR_ANDROID = 'ca-app-pub-9258943917656102/8689885641';
}else{
    // 開発環境(local)
    API_URL_BASE          = 'http://127.0.0.1:8001/';
    GAME_MANAGER_URL_BASE = 'http://127.0.0.1:8002/';
    ADMOB_BANNER_ID_FOR_IOS     = 'ca-app-pub-3940256099942544/2934735716';   // テスト広告
    ADMOB_BANNER_ID_FOR_ANDROID = 'ca-app-pub-3940256099942544/6300978111';   // テスト広告
}

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
        // バナー広告表示
        var admob_banner_id;
        if (cordova) {
            if (cordova.platformId == 'android') {
                // Androidの処理
                admob_banner_id = ADMOB_BANNER_ID_FOR_ANDROID;
            } else if (cordova.platformId == 'ios') {
                // iOSの処理
                admob_banner_id = ADMOB_BANNER_ID_FOR_IOS;
            } else if (cordova.windowsId == 'windows') {
                // Windowsの処理
            }
            admob.banner.config({
                id: admob_banner_id,
                isTesting: !IS_PRODUCTION, // テスト広告ならtrue
                autoShow: true,
            });
            admob.banner.prepare();
        } else {
             // Cordova以外での処理
             // 例：MonacaのプレビューやChromeAppなど
        }
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        if(parentElement == null){
            return;
        }
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
