let WATCH_SERVER_API_URL = API_URL_BASE + 'api/watch_room';

$(function(){
    var waiting_room_id = sessionStorage.getItem('waiting_room_id');

    //関数watchServer()を5000ミリ秒間隔で呼び出す
    setInterval("watchServer('waiting_room_id')", 5000);
});

// 対戦者が入場したか確認する
function watchServer(waiting_room_id)
{
    $.ajax({
        url: WATCH_SERVER_API_URL,
        type: 'POST',
        data: {'waiting_room_id': waiting_room_id, '_method': 'POST'},
        timeout: 3000,
        success: function(response) {
            alert("test1");
        },
        fail: function(response) {
           // ajax失敗時の処理
           //err_msg_ele.text("通信に失敗しました。しばらくしてから再度お試しください。");
        },
    });
}
