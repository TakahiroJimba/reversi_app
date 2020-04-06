$(function(){
    // メニューボタンクリック
    $('#top_menu_form_btn').on('click',function() {
        // TODO: 実装する
        // if(!localStorage.getItem('session_id')){
        //     // ログインしていない場合は、ログイン画面に遷移する
        //     window.location.href = '../html/index.html';
        //     return;
        // }
        window.location.href = '../html/top_menu.html';
    });
});
