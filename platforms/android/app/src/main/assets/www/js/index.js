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

function testApiCall() {
  alert('hello');
}

$(function(){
    // サーバ接続テストボタン
    $('#test_server_connection_btn').on('click',function() {
        $.ajax({
            url: 'http://127.0.0.1:8001/api/login_auth',
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
