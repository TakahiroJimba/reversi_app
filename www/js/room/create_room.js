let CREATE_ROOM_API_URL = API_URL_BASE + 'api/create_room';

$(function(){
    // ルーム作成ボタンクリック
    $('#create_room_btn').on('click',function() {
        var name = $('#name').val();
        var password = $('#password').val();

        // ルーム作成
        $.ajax({
            url: CREATE_ROOM_API_URL,
            type: 'POST',
            data: {'name': name, 'password': password, '_method': 'POST'},
            success: function(response) {
                var json_data = JSON.parse(response);
                if (json_data.room_id == '') {
                    // ルーム作成失敗
                    //window.location.href = '../html/top_menu.html';
                    return;
                }
                // ルーム作成成功
                sessionStorage.setItem('waiting_room_id', json_data.room_id);
                window.location.href = '../../html/room/waiting_room.html';
            },
            fail: function(response) {
               // ajax失敗時の処理
               //err_msg_ele.text("通信に失敗しました。しばらくしてから再度お試しください。");
            },
        });

    });

});
