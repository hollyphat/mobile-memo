//Settings FILE

var app_name = "Mobile Courseware";
var developer_url = "https://onlinemedia.com.ng";
var developer_email = "admin@onlinemedia.com.ng";
var supervisor = "Mr. Ramoni T.A";


//var url = 'http://app.onlinemedia.com.ng/quiz/api.php';
var url;

var env;
env = "locals";

var base_url;

if(env == "local"){
    url = "http://freelance.in/mc/api.php";
    base_url = "http://freelance.in/mc/";
}else{
    base_url = "http://app.onlinemedia.com.ng/courseware/";
    url = 'http://app.onlinemedia.com.ng/courseware/api.php';
}

$(document).ready(function () {
    //myApp.alert("Hello dude");

    //$(".supervisor").html(supervisor);
});


function is_login() {
    var user_id = sessionStorage.getItem("user_id");
    if(user_id == "" || user_id == null){
        return false;
    }else{
        return true;
    }
}

function show_toast(msg,color) {
    iziToast.show({
        message: msg,
        color: color,
        timeout: 7000
    });
}

