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
