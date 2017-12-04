// Initialize your app
var myApp = new Framework7({
    modalTitle: app_name,
    material: true,
    pushState : true,
    smartSelectOpenIn: 'picker'
});


//login vars

var user_id = sessionStorage.getItem("user_id");
var username = sessionStorage.getItem("username");
var full_name = sessionStorage.getItem("full_name");




// Export selectors engine
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true
});

// Callbacks to run specific code for specific pages, for example for About page:
myApp.onPageInit('login-screen-embedded', function (page) {

    $$("#register-form").on('submit',function(e){
        e.preventDefault();

        var matric = $$("#reg_matric").val();
        var password = $$("#reg_password").val();
        var f_name = $$("#reg_name").val();
        var email = $$("#reg_email").val();
        var gender = "";

        $$('select[name="reg_gender"] option:checked').each(function () {
            gender = this.value;
        });
        myApp.showPreloader("Signing up...");

        $$.ajax({
           url: url,
            data: {
                'register': '',
                'name': f_name,
                'matric' : matric,
                'password' : password,
                'gender': gender,
                'email': email
            },
            type: 'POST',
            dataType: 'json',
            crossDomain : true,
            cache: false,
            success:function(f){
                var ok = f.ok;
                if(ok == 1){
                    $$("#reg_matric").val('');
                    $$("#reg_name").val('');
                    $$("#reg_password").val('');
                    $$("#reg_email").val('');
                    //$$("#phone").val('');
                }
                myApp.hidePreloader();

                myApp.addNotification({
                    message : f.msg
                });
            },
            error:function(err){
                console.log(err.responseText);
                myApp.hidePreloader();
                myApp.alert("Network error, try again");
            },
            timeout: 60000
        });
    });
});

myApp.onPageInit('password', function (page) {

    $$("#password-forms").on('submit',function(e){
        e.preventDefault();
        var pass_matric = $$("#pass_matric").val();

        var pass_email = $$("#pass_email").val();
        myApp.showPreloader("Resetting Password...");

        $$.ajax({
            url: url,
            data: {
                'reset_pass': '',
                'matric' : pass_matric,
                'email': pass_email
            },
            type: 'POST',
            dataType: 'json',
            crossDomain : true,
            cache: false,
            success:function(f){
                var ok = f.ok;
                if(ok == 1){
                    $$("#username").val('');
                    $$("#email").val('');
                }
                myApp.hidePreloader();

                myApp.addNotification({
                    message : f.msg
                });
            },
            error:function(err){
                myApp.hidePreloader();
                myApp.alert("Network error, try again");
                console.log(err.responseText);
            },
            timeout: 60000
        });
    });
});


myApp.onPageInit('main-page', function (page) {
    //console.log("okay");

    var ft = sessionStorage.getItem("ft");
    //console.log(ft);
    if((ft == null) || (ft == "")){
        //show splash
        sessionStorage.setItem("ft",1);
        document.getElementById('splash-page').style.display = "block";

        setTimeout(function(){
                show_main()
            },
            5000);
    }else{
        //show main
        show_main();
    }

    //show_main();


    function show_main()
    {
        //console.log("hello");
        document.getElementById('splash-page').innerHTML = "";
        document.getElementById('splash-page').style.display = "none";
        $$("#splash-page").remove();
        $$("#main-page").removeClass('hide');
        document.getElementById('main-page').style.display = "block";

        //myApp.onPageInit('index');
    }
    if(is_login()){
        $$("#home").click();
    }
    $$("#login-form").on('submit',function(e){
        e.preventDefault();
        var usern = $$("#login_matric").val();
        var password = $$("#login_password").val();
        myApp.showPreloader("Processing,<br/>Please Wait...");

        $$.ajax({
            url: url,
            data: {
                'login': '',
                'matric' : usern,
                'password' : password
            },
            type: 'POST',
            dataType: 'json',
            crossDomain : true,
            cache: false,
            success:function(f){
                var ok = f.ok;
                if(ok == 1){
                    $$("#login_matric").val('');
                    $$("#login_password").val('');


                    var info = f.record;
                    sessionStorage.setItem("matric",info['matric']);
                    sessionStorage.setItem("user_id",info['user_id']);
                    sessionStorage.setItem("full_name",info['name']);
                    sessionStorage.setItem("email",info['email']);
                    sessionStorage.setItem("gender",info['gender']);
                    sessionStorage.setItem("passport",info['passport']);
                    myApp.hidePreloader();
                    $$("#home").click();
                }else {
                    myApp.hidePreloader();

                    myApp.addNotification({
                        message: f.msg
                    });


                }
            },
            error:function(err){
                console.log(err.responseText);
                myApp.hidePreloader();
                myApp.alert("Network error, try again");
            },
            timeout: 60000
        });
    });
}).trigger();


myApp.onPageInit('home', function (page) {
    var matric2 = sessionStorage.getItem("matric");
    if(matric2 == "" || matric2 == null){
        window.location = "main.html";
    }

    update_stat();

    $$("#logout").on('click',function(){
        myApp.confirm('Are you sure you want to logout?', function () {
            sessionStorage.removeItem("user_id");
            sessionStorage.removeItem("username");

            window.location = "main.html";
        });
    });

    //console.log(inbox_l);
});

myApp.onPageAfterAnimation('profile', function (page){
    //Page 3 arrives, we may remove Page 2 from dom and it will
    //be reloaded when you click on back link
    //$$('.page-on-left').remove();
})
myApp.onPageInit('profile',function (page) {
    var home_matric = sessionStorage.getItem("matric");
    var home_email = sessionStorage.getItem("email");
    var home_gender = sessionStorage.getItem("gender");
    var home_name = sessionStorage.getItem("full_name");

    var matric2 = sessionStorage.getItem("matric");
    if(matric2 == "" || matric2 == null){
        window.location = "main.html";
    }

    $("#profile_name").val(home_name);
    $("#profile_matric").val(home_matric);
    $("#profile_email").val(home_email);
    $("#profile_gender").val(home_gender);

    $$("#update-form").on('submit',function (e) {
        e.preventDefault();

        var profile_name = $$("#profile_name").val();
        var profile_email = $$("#profile_email").val();

        var gender = "";

        $$('select[name="reg_gender"] option:checked').each(function () {
            gender = this.value;
        });
        myApp.showPreloader("Updating profile,<br/>Please Wait...");

        $$.ajax({
            url: url,
            data: {
                'update_profile': '',
                'name' : profile_name,
                'email' : profile_email,
                'gender' : gender,
                'user_id' : sessionStorage.getItem("user_id")
            },
            type: 'POST',
            dataType: 'json',
            crossDomain : true,
            cache: false,
            success:function(f){
                var ok = f.ok;
                if(ok == 1){

                    sessionStorage.setItem("full_name",profile_name);
                    sessionStorage.setItem("email",profile_email);
                    sessionStorage.setItem("gender",gender);
                    update_stat();
                    myApp.hidePreloader();
                    myApp.addNotification({
                        message: f.msg
                    });
                }else {
                    myApp.hidePreloader();



                    myApp.addNotification({
                        message: 'Unable to update profile'
                    });


                }
            },
            error:function(err){
                console.log(err.responseText);
                myApp.hidePreloader();
                myApp.alert("Network error, try again");
            },
            timeout: 60000
        });
    });



    $$("#password-form").on('submit',function (e) {
        e.preventDefault();

        var pass = $$("#password").val();
        var c_pass = $$("#confirm_password").val();

        if(pass !== c_pass){
            myApp.alert("Password does not match");
            return false;
        }
        myApp.showPreloader("Updating password,<br/>Please Wait...");

        $$.ajax({
            url: url,
            data: {
                'update_password': '',
                'password' : pass,
                'user_id' : sessionStorage.getItem("user_id")
            },
            type: 'POST',
            dataType: 'json',
            crossDomain : true,
            cache: false,
            success:function(f){
                var ok = f.ok;
                if(ok == 1){
                    myApp.hidePreloader();
                    myApp.addNotification({
                        message: f.msg
                    });
                    $("#password").val('');
                    $("#confirm_password").val('');
                }else {
                    myApp.hidePreloader();

                    myApp.addNotification({
                        message: 'Unable to update password'
                    });


                }
            },
            error:function(err){
                console.log(err.responseText);
                myApp.hidePreloader();
                myApp.alert("Network error, try again");
            },
            timeout: 60000
        });
    })
});

myApp.onPageInit('passport',function () {
    var my_img = sessionStorage.getItem("passport");

    if(my_img == "" || my_img == null || my_img == "null"){
        $("#passport").attr("src","avatar.png");
    }else{
        var src = base_url+"/upload/"+my_img;
        $("#passport").attr("src",src);
    }

    $('#upload-form').JSAjaxFileUploader({
        uploadUrl: base_url+'/upload.php',
        formData:{
            user_id: sessionStorage.getItem("user_id")
        },
        inputText: "Select Image",
        autoSubmit:false,	//to disable auto submit
        uploadTest:'Upload Passport',
        maxFileSize:1024000,	//Max 500 KB file
        allowExt: 'gif|jpg|jpeg|png',	//allowing only images for upload,
        success:function(f){
            var img_src = base_url+"/upload/"+f;
            sessionStorage.setItem("passport",f);
            $("#passport").attr("src",img_src);
            myApp.addNotification("Passport uploaded successfully");
        }
    });

});

myApp.onPageInit('category',function () {
    var home_matric = sessionStorage.getItem("matric");
    var home_email = sessionStorage.getItem("email");
    var home_gender = sessionStorage.getItem("gender");
    var home_name = sessionStorage.getItem("full_name");

    var matric2 = sessionStorage.getItem("matric");
    if(matric2 == "" || matric2 == null){
        window.location = "main.html";
    }

    //myApp.showPreloader("Loading quiz categories...");
    var rand = Math.floor(Math.random() * 3);
    if(rand == 0){
        var class_c = "preloader-blue";
    }else if(rand == 1){
        var class_c = "preloader-amber";
    }else if(rand == 2){
        var class_c = "preloader-green";
    }else{
        var class_c = "preloader-red";
    }

    $(".pre-load").addClass(class_c);

    $$.ajax({
        url: url,
        data: {
            'categories': ''
        },
        type: 'GET',
        dataType: 'json',
        crossDomain : true,
        cache: true,
        success:function(f){
           //console.log(f.ok);
           //console.log(f.result);
           var res = f.result;
           for(var k = 0; k < res.length; k++) {
               var the_id = res[k].id;
               var the_name = res[k].category;
               //console.log(the_id);
               var a = "<li><a href=\"quiz.html\" class='item-link item-content start-quiz' data-quiz-name='"+the_name+"' data-quiz-id='"+the_id+"'>";
               a += "<div class='item-inner'><div class='item-title'>"+the_name+"</div></div></a></li>";

               $$(".the-list").append(a);
           }
           $$(".loader").remove();
           $(".main-cat").removeClass('hide');
        },
        error: function (e) {
            console.log(e.responseText);
            myApp.alert("Network problem");
            $$(".loader").remove();
        },
        timeout:60000
    });

    //console.log(class_c);

    $$("html").on('click','.start-quiz',function (e) {
        var the_id = $$(this).attr("data-quiz-id");
        var the_quiz_name = $$(this).attr("data-quiz-name");

        sessionStorage.setItem("quiz_id",the_id);
        sessionStorage.setItem("quiz_name",the_quiz_name);
    });
});

myApp.onPageInit('quiz',function () {

    $$("#logout").on('click',function(){
        myApp.confirm('Are you sure you want to logout?', function () {
            sessionStorage.removeItem("user_id");
            sessionStorage.removeItem("matric");

            window.location = "main.html";
        });
    });
    // jQuery
    $$("#quiz_name").html(sessionStorage.getItem("quiz_name"));

    //load the quiz

    $.ajax({
       'url': url,
       'type': 'GET',
       'dataType': 'json',
       'data':{
           'load_questions': '',
           'q_cat': sessionStorage.getItem("quiz_id")
       },
        success:function (f) {
           var the_questions = f.question;
           var total_q = the_questions.length;
            var total_q_s = total_q - 1;
           for(var k = 0; k < total_q; k++){
               var n = parseInt(k) +1;
               var p = parseInt(k) - 1;
               if(k == 0){
                   var prev = "<a href='#' class='disabled'>&laquo; Previous</a>";
                   var next = "<a href='#' class='next-q' data-q='"+n+"'>Next &raquo;</a>";
                   var c = "";
               }else if(k == total_q_s){
                   var next = "<a href='#' class='disabled'>&raquo; Next</a>";
                   var prev = "<a href='#' class='next-q' data-q='"+p+"'>&laquo; Previous</a>";
                   var c = "hide";
               }else{
                   var prev = "<a href='#' class='next-q' data-q='"+p+"'>&laquo; Previous</a>";
                   var next = "<a href='#' class='next-q' data-q='"+n+"'>&raquo; Next</a>";
                   var c = "hide";
               }
               var l = parseInt(k)+1;
               var q = '<div class="all-q card '+c+'" data-q-id="'+k+'">' +
                   '<div class="card-header">'+l+' ) '+the_questions[k].question+'</div><div class="card-content" style="border-top: solid 1px #d0d0d0;">' +
                   '<div class="card-content-inner"><div class="list-block"><ul><li><label class="label-checkbox item-content">';
                    q += '<input type="radio" name="q_'+k+'" value="A"><div class="item-media">';
                    q += '<i class="icon icon-form-checkbox"></i></div><div class="item-inner">';
                    q += '<div class="item-title">'+the_questions[k].a+'</div>';
                    q += '</div></label></li><li><label class="label-checkbox item-content">';
                    q += '<input type="radio" name="q_'+k+'" value="B">';
                    q += '<div class="item-media"><i class="icon icon-form-checkbox"></i></div><div class="item-inner">';
                    q += '<div class="item-title">'+the_questions[k].b+'</div>';
                    q += '</div></label></li><li><label class="label-checkbox item-content">';
                    q += '<input type="radio" name="q_'+k+'" value="C">';
                    q += '<div class="item-media"><i class="icon icon-form-checkbox"></i></div>';
                    q += '<div class="item-inner"><div class="item-title">'+the_questions[k].c+'</div>';
                    q += '</div></label></li><li><label class="label-checkbox item-content">';
                    q += '<input type="radio" name="q_'+k+'" value="D">';
                    q += '<div class="item-media"><i class="icon icon-form-checkbox"></i></div>';
                    q += '<div class="item-inner"><div class="item-title">'+the_questions[k].d+'</div>';
                    q += '</div></label></li></ul></div></div></div>';
                    q += '<div class="card-footer">'+prev+' '+next+'</div></div>';
                    q += '<input type="hidden" name="q[]" value="'+the_questions[k].id+'">';

               $$("#the-quiz").append(q);
           }

           $$("#the_user_id").val(sessionStorage.getItem("user_id"));
            $$("#the_cat_id").val(sessionStorage.getItem("quiz_id"));
            //console.log(f);
            $.getScript('js/timer.js', function()
            {
                //myApp.alert("finally here");
                //console.log(time_rem);
                $$(".time-section").removeClass('hide');
            });
        },
        error: function (e) {
            myApp.alert("Network error!");
            console.log(e.responseText);
        }
    });


    $("body").on('click','.next-q',function (e) {
        e.preventDefault();
        var id = $(this).attr("data-q");
        $(".all-q").addClass("hide");
        $("[data-q-id="+id+"]").removeClass('hide');
        console.log(id);
    });

    $("body").on('click','.prev-q',function (e) {
        e.preventDefault();
        var id = $(this).attr("data-q");
        $(".all-q").addClass("hide");
        $("[data-q-id="+id+"]").removeClass('hide');
        console.log(id);
    });

    $$("body").on('submit','#quiz-form',function (e) {
        myApp.confirm('Are you sure you want to submit?', function () {
            var datas = $("#quiz-form").serialize();

            myApp.showPreloader("Submitting your result!!!");
            $$.ajax({
               'url': url+'?'+datas,
               'type': 'GET',
                'dataType': 'json',
               'crossDomain': true,
                success: function (f) {
                    console.log(f);
                    $$(".time-section").addClass('hide');
                    $$(".quiz-page").addClass('hide');
                    var scores = f.correct;
                    var total_q = f.total_q;
                    var answered = f.answered;
                    var not_answered = f.not_answered;
                    var wrong = f.wrong;
                    scores = parseInt(scores);
                    var rem = remark(f);

                    $("#wrong").html(wrong);
                    $("#total_q").html(total_q);
                    $("#total_a").html(answered);
                    $("#total_u").html(not_answered);
                    $(".scores").html(scores);
                    $("#perc").html("("+f.perc+" %)");
                    $("#rem").html(rem);
                    $$(".result-form").removeClass('hide');
                    myApp.hidePreloader();
                },
                error: function (e) {
                   myApp.alert("Network error, please submit again!");
                    console.log(e);
                }
            });
        });

        e.preventDefault();
    })
});

function update_stat(){
    //myApp.alert("I work");
    var u_id = sessionStorage.getItem("user_id");

    var f_name = sessionStorage.getItem("full_name");


    $$("#full-name, .full-name").html(f_name);


    var my_img = sessionStorage.getItem("passport");

    //console.log(my_img);

    if((my_img == "") || (my_img == null) || (my_img == "null")){
        $("#user-img").attr("src","avatar.png");
    }else{
        var src = base_url+"/upload/"+my_img;
        $("#user-img").attr("src",src);
    }

    var home_matric = sessionStorage.getItem("matric");
    var home_email = sessionStorage.getItem("email");
    var home_gender = sessionStorage.getItem("gender");

    $(".home-matric").html(home_matric);
    $(".home-email").html(home_email);
    $(".home-gender").html(home_gender);

}
