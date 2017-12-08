// Initialize your app
var myApp = new Framework7({
    modalTitle: app_name,
    material: true,
    pushState : true,
    smartSelectOpenIn: 'picker'
});

// Export selectors engine
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true
});

// Callbacks to run specific code for specific pages, for example for About page:
myApp.onPageInit('main-page-2', function (page) {
    window.screen.unlock();
    //var s_id = sessionStorage.getItem("staff_id");
    if(staff_login()){
        $$("#staff-home").click();
    }else if(student_login()){
        $$("#home").click();
    }

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
        //document.getElementById('main-page').style.display = "block";

        //myApp.onPageInit('index');
    }
    //console.log("hello");
    // run createContentPage func after link was clicked
    $$('.act-btn').on('click', function (e) {
        e.preventDefault();
        var class_n = $$(this).attr("data-class");
        //myApp.alert(class_n,"Class Name");
        $$(".act-btn").removeClass('button-fill');
        $$(this).addClass('button-fill');
        $$(".log-page").addClass('hide');
        $$("."+class_n).removeClass('hide');
    });

    $$("#staff-login-form").on('submit',function (e) {
       e.preventDefault();
       myApp.showIndicator();

       $$.ajax({
          url: url,
          type: 'post',
          dataType: 'json',
          cache: 'false',
          crossDomain: true,
          timeout: 60000,
           data: {
              'staff-login': '',
               'staff_id' : $$("#staff_id").val(),
               'password': $$("#staff_password").val()
           },
           success: function (f) {
               myApp.hideIndicator();
               var ok = f.ok;
               if(ok == 0){
                   show_toast("Invalid login details","red");
               }else if(ok == 1){
                   //save the records
                   sessionStorage.setItem("staff_id",f.rec['staff_id']);
                   sessionStorage.setItem("staff_email",f.rec['email']);
                   sessionStorage.setItem("staff_sname",f.rec['sname']);
                   sessionStorage.setItem("staff_oname",f.rec['oname']);
                   sessionStorage.setItem("staff_level",f.rec['level']);

                   $$("#staff-home").click();
               }
           },
           error: function (e) {
               myApp.hideIndicator();
               myApp.alert("Network error","Error");
               console.log(e.responseText);
           }
       });
    });

    //stu-login-form

    $$("#stu-login-form").on('submit',function (e) {
        e.preventDefault();
        myApp.showIndicator();

        $$.ajax({
            url: url,
            type: 'post',
            dataType: 'json',
            cache: 'false',
            crossDomain: true,
            timeout: 60000,
            data: {
                'student-login': '',
                'matric' : $$("#login_matric").val(),
                'password': $$("#login_password").val()
            },
            success: function (f) {
                myApp.hideIndicator();
                var ok = f.ok;
                if(ok == 0){
                    show_toast("Invalid login details","red");
                }else if(ok == 1){
                    //save the records
                    sessionStorage.setItem("matric",f.rec['matric']);
                    sessionStorage.setItem("student_email",f.rec['email']);
                    sessionStorage.setItem("student_sname",f.rec['sname']);
                    sessionStorage.setItem("student_oname",f.rec['oname']);
                    sessionStorage.setItem("student_level",f.rec['level']);

                    $$("#home").click();
                }
            },
            error: function (e) {
                myApp.hideIndicator();
                myApp.alert("Network error","Error");
                console.log(e.responseText);
            }
        });
    });
}).trigger();
//act-btn

myApp.onPageInit('staff-reg',function () {
    window.screen.unlock();
   //console.log("Hello");
    $$("#staff-register-form").on("submit",function (e) {
       e.preventDefault();
       myApp.showPreloader("Signing up...");
       var staff_id = $$("#reg_staff_id").val();

       console.log(staff_id);
       var sname = $$("#sname").val();
       var oname = $$("#onames").val();
       var level;
        $$('select[name="staff_level"] option:checked').each(function () {
            level = this.value;
        });
        var email = $$("#reg_email").val();
        var password = $$("#reg_password").val();

        $$.ajax({
            url: url,
            type: 'post',
            dataType: 'json',
            data: {
                'staff_id': staff_id,
                'sname': sname,
                'oname': oname,
                'level': level,
                'email': email,
                'password': password,
                'staff-reg': ''
            },
            success:function (f) {
                myApp.hidePreloader();
                console.log(f);
                var ok = f.ok;

                if(ok == 1){
                    $$(".res").click();
                    show_toast(f.msg,"green");
                }else{
                    show_toast(f.msg,"red");
                }
            },
            error:function (e) {
                myApp.hidePreloader();
                myApp.alert("Network, try again","Error");
            },
            timeout: 60000,
            crossDomain: true,
            cache: false
        });
       //show_toast("Registration complete","blue");
    });
});


myApp.onPageInit('student-reg',function () {
    window.screen.unlock();
    //console.log("Hello");
    $$("#register-form").on("submit",function (e) {
        e.preventDefault();
        myApp.showPreloader("Signing up...");
        var matric = $$("#reg_matric").val();

        //console.log(staff_id);
        var sname = $$("#sname").val();
        var oname = $$("#onames").val();
        var level;
        $$('select[name="student_level"] option:checked').each(function () {
            level = this.value;
        });
        var email = $$("#reg_email").val();
        var password = $$("#reg_password").val();

        $$.ajax({
            url: url,
            type: 'post',
            dataType: 'json',
            data: {
                'matric': matric,
                'sname': sname,
                'oname': oname,
                'level': level,
                'email': email,
                'password': password,
                'student-reg': ''
            },
            success:function (f) {
                myApp.hidePreloader();
                console.log(f);
                var ok = f.ok;

                if(ok == 1){
                    $$(".res").click();
                    show_toast(f.msg,"green");
                }else{
                    show_toast(f.msg,"red");
                }
            },
            error:function (e) {
                myApp.hidePreloader();
                myApp.alert("Network, try again","Error");
            },
            timeout: 60000,
            crossDomain: true,
            cache: false
        });
        //show_toast("Registration complete","blue");
    });
});

myApp.onPageInit('staff-home',function () {
    window.screen.unlock();
    if(!staff_login()){
        window.location = "main.html";
    }
    update_staff();

    $$(".staff-logout").on("click",function (e) {
       e.preventDefault();

       myApp.confirm("Are you sure want to logout","Logout",function (e) {
          sessionStorage.clear();
          window.location = "main.html";
       });
    });
});


myApp.onPageInit('student-home',function () {
    window.screen.unlock();
    if(!student_login()){
        window.location = "main.html";
    }
    update_student();

    $$(".staff-logout").on("click",function (e) {
        e.preventDefault();

        myApp.confirm("Are you sure want to logout","Logout",function (e) {
            sessionStorage.clear();
            window.location = "main.html";
        });
    });
});

myApp.onPageInit('staff-pub-course',function () {
    window.screen.unlock();
    if(!staff_login()){
        window.location = "main.html";
    }
    update_staff();

    $('#upload-form').JSAjaxFileUploader({
        uploadUrl: base_url+'/upload.php',
        formData:{
            user_id: sessionStorage.getItem("staff_id")
        },
        inputText: "Select Material",
        maxFileSize:2048000,	//Max 500 KB file
        allowExt: 'doc|docx|pdf',	//allowing only images for upload,
        success:function(f){
            show_toast("Material uploaded successfully","blue");
            $$("[name=sub-mat]").removeAttr("disabled");
            $$("#material").val(f);
        }
    });

    $$("#staff-pub-form").on("submit",function (e) {
       e.preventDefault();

        var level;
        $$('select[name="c_level"] option:checked').each(function () {
            level = this.value;
        });
       myApp.showPreloader("Submitting material...");

       $$.ajax({
          url: url,
          type: 'post',
          dataType: 'json',
          data:{
              'name': $$("#material_name").val(),
              'ccode': $$("#ccode").val(),
              'ctitle': $$("#ctitle").val(),
              'level': level,
              'material': $$("#material").val(),
              'staff_id': sessionStorage.getItem("staff_id"),
              'submit-mat': ''
          },
           cache: false,
           crossDomain: true,
           success:function (f) {
               myApp.hidePreloader();
               show_toast("Material uploaded successfully....","green");
               $$(".res").click();
               console.log(f);
           },
           error:function (e) {
               myApp.hidePreloader();
               myApp.alert("Network error");
               console.log(e.responseText);
           },
           timeout: 60000
       });
    });
});


myApp.onPageInit('staff-pub-outline',function () {
    window.screen.unlock();
    if(!staff_login()){
        window.location = "main.html";
    }
    update_staff();

    $('#upload-form').JSAjaxFileUploader({
        uploadUrl: base_url+'/upload.php',
        formData:{
            user_id: sessionStorage.getItem("staff_id")
        },
        inputText: "Select Course Outline",
        maxFileSize:2048000,	//Max 500 KB file
        allowExt: 'doc|docx|pdf',	//allowing only images for upload,
        success:function(f){
            show_toast("Course Outline uploaded successfully","blue");
            $$("[name=sub-mat]").removeAttr("disabled");
            $$("#material").val(f);
        }
    });

    $$("#staff-pub-form").on("submit",function (e) {
        e.preventDefault();

        var level;
        $$('select[name="c_level"] option:checked').each(function () {
            level = this.value;
        });
        myApp.showPreloader("Submitting course outline...");

        $$.ajax({
            url: url,
            type: 'post',
            dataType: 'json',
            data:{
                'ccode': $$("#ccode").val(),
                'ctitle': $$("#ctitle").val(),
                'level': level,
                'material': $$("#material").val(),
                'staff_id': sessionStorage.getItem("staff_id"),
                'submit-out': ''
            },
            cache: false,
            crossDomain: true,
            success:function (f) {
                myApp.hidePreloader();
                show_toast("Course Outline uploaded successfully....","green");
                $$(".res").click();
                console.log(f);
            },
            error:function (e) {
                myApp.hidePreloader();
                myApp.alert("Network error");
                console.log(e.responseText);
            },
            timeout: 60000
        });
    });
});


myApp.onPageInit('staff-pub-assign',function () {
    window.screen.unlock();
    if(!staff_login()){
        window.location = "main.html";
    }
    update_staff();

    // With custom date format
    var calendarDateFormat = myApp.calendar({
        input: '#ks-calendar-default',
        dateFormat: 'dd-mm-yyyy'
    });

    $('#upload-form').JSAjaxFileUploader({
        uploadUrl: base_url+'/upload.php',
        formData:{
            user_id: sessionStorage.getItem("staff_id")
        },
        inputText: "Select Assignment",
        maxFileSize:2048000,	//Max 500 KB file
        allowExt: 'doc|docx|pdf',	//allowing only images for upload,
        success:function(f){
            show_toast("Assignment uploaded successfully","blue");
            $$("[name=sub-mat]").removeAttr("disabled");
            $$("#material").val(f);
        }
    });

    $$("#staff-pub-form").on("submit",function (e) {
        e.preventDefault();

        var level;
        $$('select[name="c_level"] option:checked').each(function () {
            level = this.value;
        });
        myApp.showPreloader("Submitting assignment...");

        $$.ajax({
            url: url,
            type: 'post',
            dataType: 'json',
            data:{
                'sub-date': $$("#ks-calendar-default").val(),
                'ccode': $$("#ccode").val(),
                'ctitle': $$("#ctitle").val(),
                'level': level,
                'assignment': $$("#material").val(),
                'staff_id': sessionStorage.getItem("staff_id"),
                'submit-assign': ''
            },
            cache: false,
            crossDomain: true,
            success:function (f) {
                myApp.hidePreloader();
                show_toast("Assignment uploaded successfully....","green");
                $$(".res").click();
                console.log(f);
            },
            error:function (e) {
                myApp.hidePreloader();
                myApp.alert("Network error");
                console.log(e.responseText);
            },
            timeout: 60000
        });
    });
});

//STAFF COURSE MATERIAL
myApp.onPageInit('view-staff-material',function () {
    if(!staff_login()){
        window.location = "main.html";
    }

    window.screen.orientation.lock('landscape');
    update_staff();

    myApp.showIndicator();

    $$.ajax({
       url: url,
       type: 'get',
        dataType: 'json',
        data:{
           'load-mat': ''
        },
       cache: true,
       crossDomain: true,
        timeout: 60000,
        success:function (f) {
            var t = f.total;
            //console.log(f.records[0].ctitle);
            if(t== 0){
                show_toast("No course material","red");
            }else{
                var html = "";
                var rec = f.records;
                for(var i = 0; i < rec.length; i++){
                    var tr = "<tr>";
                    tr += "<td>"+rec[i].ccode+"</td>";
                    tr += "<td>"+rec[i].ctitle+"</td>";
                    tr += "<td>"+rec[i].name+"</td>";
                    tr += "<td>"+rec[i].level+"</td>";
                    tr += "<td>"+rec[i].date_added+"</td>";
                    tr += "<td><a href='#' class='button button-raised dl' data-link='"+rec[i].material+"'><i class='fa fa-download'></i></a> </td>";
                    tr += "</tr>";
                    html += tr;
                }

            }
            myApp.hideIndicator();

            $$("#tmat").html(html)
        },
        error: function (e) {
            myApp.hideIndicator();
            myApp.alert("<span style='color: #fd0023;'>Network error...</span>","Fetch Error");
        }
    });

    $$("body").on('click','.dl',function (e) {
        e.preventDefault();
        var f = $(this).attr("data-link");
        //myApp.alert(f);
        //openBrowser(f);
        var file_url = base_url+"upload/"+f;
        //DownloadFile(file_url, "mobile_course", f);
        //myApp.alert(file_url);
        window.open(file_url);
    });
});

//STUDENT COURSE MATERIAL

myApp.onPageInit('view-student-material',function () {
    if(!student_login()){
        window.location = "main.html";
    }

    window.screen.orientation.lock('landscape');
    update_student();

    myApp.showIndicator();

    $$.ajax({
        url: url,
        type: 'get',
        dataType: 'json',
        data:{
            'load-student-mat': sessionStorage.getItem("student_level")
        },
        cache: true,
        crossDomain: true,
        timeout: 60000,
        success:function (f) {
            var t = f.total;
            //console.log(f.records[0].ctitle);
            if(t== 0){
                show_toast("No course material for your level","red");
            }else{
                var html = "";
                var rec = f.records;
                for(var i = 0; i < rec.length; i++){
                    var tr = "<tr>";
                    tr += "<td>"+rec[i].ccode+"</td>";
                    tr += "<td>"+rec[i].ctitle+"</td>";
                    tr += "<td>"+rec[i].name+"</td>";
                    tr += "<td>"+rec[i].staff+"</td>";
                    tr += "<td>"+rec[i].date_added+"</td>";
                    tr += "<td><a href='#' class='button button-raised dl' data-link='"+rec[i].material+"'><i class='fa fa-download'></i></a> </td>";
                    tr += "</tr>";
                    html += tr;
                }

            }
            myApp.hideIndicator();

            $$("#tmat").html(html)
        },
        error: function (e) {
            myApp.hideIndicator();
            myApp.alert("<span style='color: #fd0023;'>Network error...</span>","Fetch Error");
        }
    });

    $$("body").on('click','.dl',function (e) {
        e.preventDefault();
        var f = $(this).attr("data-link");
        //myApp.alert(f);
        //openBrowser(f);
        var file_url = base_url+"upload/"+f;
        //DownloadFile(file_url, "mobile_course", f);
        //myApp.alert(file_url);
        window.open(file_url);
    });
});


myApp.onPageInit('view-staff-outline',function () {
    if(!staff_login()){
        window.location = "main.html";
    }
    window.screen.orientation.lock('landscape');
    update_staff();

    myApp.showIndicator();

    $$.ajax({
        url: url,
        type: 'get',
        dataType: 'json',
        data:{
            'load-out': ''
        },
        cache: true,
        crossDomain: true,
        timeout: 60000,
        success:function (f) {
            var t = f.total;
            //console.log(f.records[0].ctitle);
            if(t== 0){
                show_toast("No course outline","red");
            }else{
                var html = "";
                var rec = f.records;
                for(var i = 0; i < rec.length; i++){
                    var tr = "<tr>";
                    tr += "<td>"+rec[i].ccode+"</td>";
                    tr += "<td>"+rec[i].ctitle+"</td>";
                    tr += "<td>"+rec[i].level+"</td>";
                    tr += "<td>"+rec[i].date_added+"</td>";
                    tr += "<td><a href='#' class='button button-raised dl' data-link='"+rec[i].material+"'><i class='fa fa-download'></i></a> </td>";
                    tr += "</tr>";
                    html += tr;
                }

            }


            $$("#tmat").html(html)
            myApp.hideIndicator();
        },
        error: function (e) {
            myApp.hideIndicator();
            myApp.alert("<span style='color: #fd0023;'>Network error...</span>","Fetch Error");
        }
    });

    $$("body").on('click','.dl',function (e) {
        e.preventDefault();
        var f = $(this).attr("data-link");
        //myApp.alert(f);
        //openBrowser(f);
        var file_url = base_url+"upload/"+f;
        //myApp.alert(file_url);
        window.open(file_url);
        //DownloadFile(file_url, "mobile_course", f);
    });
});


myApp.onPageInit('view-student-outline',function () {
    if(!student_login()){
        window.location = "main.html";
    }

    window.screen.orientation.lock('landscape');
    update_student();

    myApp.showIndicator();

    $$.ajax({
        url: url,
        type: 'get',
        dataType: 'json',
        data:{
            'load-student-out': sessionStorage.getItem("student_level")
        },
        cache: true,
        crossDomain: true,
        timeout: 60000,
        success:function (f) {
            var t = f.total;
            //console.log(f.records[0].ctitle);
            if(t== 0){
                show_toast("No course outline for your level","red");
            }else{
                var html = "";
                var rec = f.records;
                for(var i = 0; i < rec.length; i++){
                    var tr = "<tr>";
                    tr += "<td>"+rec[i].ccode+"</td>";
                    tr += "<td>"+rec[i].ctitle+"</td>";
                    tr += "<td>"+rec[i].date_added+"</td>";
                    tr += "<td><a href='#' class='button button-raised dl' data-link='"+rec[i].material+"'><i class='fa fa-download'></i></a> </td>";
                    tr += "</tr>";
                    html += tr;
                }

            }
            myApp.hideIndicator();

            $$("#tmat").html(html)
        },
        error: function (e) {
            myApp.hideIndicator();
            myApp.alert("<span style='color: #fd0023;'>Network error...</span>","Fetch Error");
        }
    });

    $$("body").on('click','.dl',function (e) {
        e.preventDefault();
        var f = $(this).attr("data-link");
        //myApp.alert(f);
        //openBrowser(f);
        var file_url = base_url+"upload/"+f;
        //myApp.alert(file_url);
        window.open(file_url);
        //DownloadFile(file_url, "mobile_course", f);
    });
});


myApp.onPageInit('view-staff-assign',function () {
    if(!staff_login()){
        window.location = "main.html";
    }

    window.screen.orientation.lock('landscape');
    update_staff();

    myApp.showIndicator();

    $$.ajax({
        url: url,
        type: 'get',
        dataType: 'json',
        data:{
            'load-assign': '',
            'staff_id': sessionStorage.getItem("staff_id")
        },
        cache: true,
        crossDomain: true,
        timeout: 60000,
        success:function (f) {
            var t = f.total;
            //console.log(f.records[0].ctitle);
            if(t== 0){
                show_toast("No assignment","red");
            }else{
                var html = "";
                var rec = f.records;
                for(var i = 0; i < rec.length; i++){
                    var tr = "<tr>";
                    tr += "<td>"+rec[i].ccode+"</td>";
                    tr += "<td>"+rec[i].ctitle+"</td>";
                    tr += "<td>"+rec[i].level+"</td>";
                    tr += "<td>"+rec[i].date_added+"</td>";
                    tr += "<td>"+rec[i].sub_date+"</td>";
                    tr += "<td>"+rec[i].counts+"</td>";
                    tr += "<td><a href='staff-assign-submit.html' class='button button-raised dl2' data-id='"+rec[i].id+"'>View</a> </td>";
                    tr += "</tr>";
                    html += tr;
                }

            }
            myApp.hideIndicator();

            $$("#tmat").html(html)
        },
        error: function (e) {
            myApp.hideIndicator();
            console.log(e.responseText);
            myApp.alert("<span style='color: #fd0023;'>Network error...</span>","Fetch Error");
        }
    });

    $$("body").on("click",".dl2",function (e) {
        var the_id = $$(this).attr("data-id");
        sessionStorage.setItem("assign_id",the_id);
    });
});

myApp.onPageInit('view-student-assign',function () {
    if(!student_login()){
        window.location = "main.html";
    }
    window.screen.orientation.lock('landscape');
    update_student();

    myApp.showIndicator();

    $$.ajax({
        url: url,
        type: 'get',
        dataType: 'json',
        data:{
            'load-student-assign': '',
            'level': sessionStorage.getItem("student_level")
        },
        cache: true,
        crossDomain: true,
        timeout: 60000,
        success:function (f) {
            var t = f.total;
            //console.log(f.records[0].ctitle);
            if(t== 0){
                show_toast("No assignment for your level","red");
            }else{
                var html = "";
                var rec = f.records;
                for(var i = 0; i < rec.length; i++){
                    var tr = "<tr>";
                    tr += "<td>"+rec[i].ccode+"</td>";
                    tr += "<td>"+rec[i].ctitle+"</td>";
                    tr += "<td>"+rec[i].staff+"</td>";
                    tr += "<td>"+rec[i].date_added+"</td>";
                    tr += "<td>"+rec[i].sub_date+"</td>";
                    tr += "<td><a href='student-assign-submit.html' class='button button-raised dl2' data-id='"+rec[i].id+"'>View</a> </td>";
                    tr += "</tr>";
                    html += tr;
                }

            }
            myApp.hideIndicator();

            $$("#tmat").html(html)
        },
        error: function (e) {
            myApp.hideIndicator();
            console.log(e.responseText);
            myApp.alert("<span style='color: #fd0023;'>Network error...</span>","Fetch Error");
        }
    });

    $$("body").on("click",".dl2",function (e) {
        var the_id = $$(this).attr("data-id");
        sessionStorage.setItem("assign_id",the_id);
    });
});

myApp.onPageInit('student-assign-submit',function () {
   if(!student_login()){
       window.location = "main.html";
   }
   window.screen.unlock();

   update_student();
    var assign_id = sessionStorage.getItem("assign_id");
    var assignment_link = "";
   myApp.showIndicator();

   $$.ajax({
      url: url,
      type: 'post',
      dataType: 'json',
      timeout: 60000,
      data:{
          'view-ass-details': '',
          'assign_id': assign_id
      },
       cache: true,
       crossDomain: true,
       success:function (f) {
           $$("#ccode").html(f.ccode);
           $$("#ctitle").html(f.ctitle);
           $$("#level").html(f.level);
           $$("#staff").html(f.staff);
           $$("#up-date").html(f.date_added);
           $$("#deadline").html(f.submit_date);
           assignment_link = base_url+"upload/"+f.assignment;
           myApp.hideIndicator();
           $$(".main-p").removeClass('hide');
       },
       error: function (e) {
           myApp.alert("Network error","Error");
           console.log(e.responseText);
       }
   });



    $('#upload-form').JSAjaxFileUploader({
        uploadUrl: base_url+'/upload.php',
        formData:{
            assignment_id: sessionStorage.getItem("assign_id"),
            matric: sessionStorage.getItem("matric"),
            submit_assignment: ''
        },
        autoSubmit: false,
        inputText: "Select File",
        uploadTest: "Submit Assignment",
        maxFileSize:2048000,	//Max 500 KB file
        allowExt: 'doc|docx|pdf',	//allowing only images for upload,
        success:function(f){
            console.log(f);
            myApp.alert("Assignment submitted successfully");
            show_toast("Assignment submitted successfully","green");
            //$$("[name=sub-mat]").removeAttr("disabled");
            //$$("#material").val(f);
        }
    });

    $$(".dl").on("click",function (e) {
        e.preventDefault();
        window.open(assignment_link);
    });


});


myApp.onPageInit('profile',function () {
    window.screen.unlock();
   if(staff_login()){
       update_staff();
       $$(".staff_id").html(sessionStorage.getItem("staff_id"));
       $$(".ssname").html(sessionStorage.getItem("staff_sname"));
       $$(".soname").html(sessionStorage.getItem("staff_oname"));
       $$(".semail").html(sessionStorage.getItem("staff_email"));
       $$(".slevel").html(sessionStorage.getItem("staff_level"));

       $("#sprofile_sname").val(sessionStorage.getItem("staff_sname"));
       $("#sprofile_oname").val(sessionStorage.getItem("staff_oname"));
       $("#sprofile_matric").val(sessionStorage.getItem("staff_id"));
       $("#sprofile_email").val(sessionStorage.getItem("staff_email"));
       $("#sstudent_level").val(sessionStorage.getItem("staff_level"));


       $$("#staff-update-form").on('submit',function (e) {
           e.preventDefault();

           var profile_sname = $$("#sprofile_sname").val();
           var profile_oname = $$("#sprofile_oname").val();
           var profile_email = $$("#sprofile_email").val();

           var level = $$("#sstudent_level").val();

           myApp.showPreloader("Updating profile,<br/>Please Wait...");

           $$.ajax({
               url: url,
               data: {
                   'update_staff_profile': '',
                   'sname' : profile_sname,
                   'oname' : profile_oname,
                   'email' : profile_email,
                   'level' : level,
                   'staff_id' : sessionStorage.getItem("staff_id")
               },
               type: 'POST',
               dataType: 'json',
               crossDomain : true,
               cache: false,
               success:function(f){
                   var ok = f.ok;
                   if(ok == 1){

                       sessionStorage.setItem("staff_sname",profile_sname);
                       sessionStorage.setItem("staff_oname",profile_oname);
                       sessionStorage.setItem("staff_email",profile_email);
                       sessionStorage.setItem("staff_level",level);
                       //update_stat();
                       myApp.hidePreloader();
                       show_toast(f.msg,"green");
                   }else {
                       myApp.hidePreloader();



                       show_toast("Unable to update profile","red");


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



       $$("#staff-password-form").on('submit',function (e) {
           e.preventDefault();

           var pass = $$("#spassword").val();
           var c_pass = $$("#sconfirm_password").val();

           if(pass !== c_pass){
               myApp.alert("Password does not match");
               return false;
           }
           myApp.showPreloader("Updating password,<br/>Please Wait...");

           $$.ajax({
               url: url,
               data: {
                   'update_staff_password': '',
                   'password' : pass,
                   'staff_id' : sessionStorage.getItem("staff_id")
               },
               type: 'POST',
               dataType: 'json',
               crossDomain : true,
               cache: false,
               success:function(f){
                   var ok = f.ok;
                   if(ok == 1){
                       myApp.hidePreloader();
                       show_toast(f.msg,"green");
                       $("#spassword").val('');
                       $("#sconfirm_password").val('');
                   }else {
                       myApp.hidePreloader();

                       show_toast('Unable to update password',"red");


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


       $$(".staff-page").removeClass('hide');
   } else if(student_login()){
       update_student();

       $$(".matric").html(sessionStorage.getItem("matric"));
       $$(".sname").html(sessionStorage.getItem("student_sname"));
       $$(".oname").html(sessionStorage.getItem("student_oname"));
       $$(".email").html(sessionStorage.getItem("student_email"));
       $$(".level").html(sessionStorage.getItem("student_level"));


       $("#profile_sname").val(sessionStorage.getItem("student_sname"));
       $("#profile_oname").val(sessionStorage.getItem("student_oname"));
       $("#profile_matric").val(sessionStorage.getItem("matric"));
       $("#profile_email").val(sessionStorage.getItem("student_email"));
       $("#student_level").val(sessionStorage.getItem("student_level"));


       $$("#stu-update-form").on('submit',function (e) {
           e.preventDefault();

           var profile_sname = $$("#profile_sname").val();
           var profile_oname = $$("#profile_oname").val();
           var profile_email = $$("#profile_email").val();

           var level = $$("#student_level").val();

           myApp.showPreloader("Updating profile,<br/>Please Wait...");

           $$.ajax({
               url: url,
               data: {
                   'update_stu_profile': '',
                   'sname' : profile_sname,
                   'oname' : profile_oname,
                   'email' : profile_email,
                   'level' : level,
                   'matric' : sessionStorage.getItem("matric")
               },
               type: 'POST',
               dataType: 'json',
               crossDomain : true,
               cache: false,
               success:function(f){
                   var ok = f.ok;
                   if(ok == 1){

                       sessionStorage.setItem("student_sname",profile_sname);
                       sessionStorage.setItem("student_oname",profile_oname);
                       sessionStorage.setItem("student_email",profile_email);
                       sessionStorage.setItem("student_level",level);
                       //update_stat();
                       myApp.hidePreloader();
                       show_toast(f.msg,"green");
                   }else {
                       myApp.hidePreloader();
                       show_toast("Unable to update profile","red");
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


       $$("#stu-password-form").on('submit',function (e) {
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
                   'update_stu_password': '',
                   'password' : pass,
                   'matric' : sessionStorage.getItem("matric")
               },
               type: 'POST',
               dataType: 'json',
               crossDomain : true,
               cache: false,
               success:function(f){
                   var ok = f.ok;
                   if(ok == 1){
                       myApp.hidePreloader();
                       show_toast(f.msg,"green");
                       $("#password").val('');
                       $("#confirm_password").val('');
                   }else {
                       myApp.hidePreloader();
                       show_toast ('Unable to update password',"red");

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


       $$(".student-page").removeClass('hide');
   }else{
       window.location = "main.html";
   }
});

myApp.onPageInit('staff-submitted-assign',function () {
   if(!staff_login()){
       window.location = "main.html";
   }
    window.screen.orientation.lock('landscape');

   update_staff();

    var assign_id = sessionStorage.getItem("assign_id");
    var assignment_link = "";
    myApp.showIndicator();

    $$.ajax({
        url: url,
        type: 'post',
        dataType: 'json',
        timeout: 60000,
        data:{
            'view-ass-details': '',
            'assign_id': assign_id,
            'is_staff': ''
        },
        cache: true,
        crossDomain: true,
        success:function (f) {
            console.log(f);
            $$("#ccode").html(f.ccode);
            $$("#ctitle").html(f.ctitle);
            $$("#level").html(f.level);
            $$("#staff").html(f.staff);
            $$("#up-date").html(f.date_added);
            $$("#deadline").html(f.submit_date);
            assignment_link = base_url+"upload/"+f.assignment;


            var html = "";
            var rec = f.records;
            for(var i = 0; i < rec.length; i++){
                var tr = "<tr>";
                tr += "<td>"+rec[i].matric+"</td>";
                tr += "<td>"+rec[i].name+"</td>";
                tr += "<td>"+rec[i].date_submitted+"</td>";
                tr += "<td><a href='#' class='button button-raised dl2' data-link='"+rec[i].material+"'><i class='fa fa-download'></i></a> </td>";
                tr += "</tr>";
                html += tr;
            }

            $$(".tmat").html(html);

            myApp.hideIndicator();
            $$(".main-p").removeClass('hide');
        },
        error: function (e) {
            myApp.alert("Network error","Error");
            console.log(e.responseText);
        }
    });

    $$(".dl").on("click",function (e) {
        e.preventDefault();
        window.open(assignment_link);
    });

    $$("body").on('click','.dl2',function (e) {
        e.preventDefault();
        var f = $(this).attr("data-link");
        //myApp.alert(f);
        //openBrowser(f);
        var file_url = base_url+"upload/"+f;
        //DownloadFile(file_url, "mobile_course", f);
        //myApp.alert(file_url);
        window.open(file_url);
    });
});

myApp.onPageInit('stu-password', function (page) {
    window.screen.unlock();
    $$("#password-forms").on('submit',function(e){
        e.preventDefault();
        var pass_matric = $$("#pass_matric").val();

        var pass_email = $$("#pass_email").val();
        myApp.showPreloader("Resetting Password...");

        $$.ajax({
            url: url,
            data: {
                'stu_pass': '',
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
                    $$("#pass_matric").val('');
                    $$("#pass_email").val('');
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

myApp.onPageInit('staff-password', function (page) {
    window.screen.unlock();
    $$("#password-forms").on('submit',function(e){
        e.preventDefault();
        var pass_matric = $$("#pass_matric").val();

        var pass_email = $$("#pass_email").val();
        myApp.showPreloader("Resetting Password...");

        $$.ajax({
            url: url,
            data: {
                'staff_pass': '',
                'staff_id' : pass_matric,
                'email': pass_email
            },
            type: 'POST',
            dataType: 'json',
            crossDomain : true,
            cache: false,
            success:function(f){
                var ok = f.ok;
                if(ok == 1){
                    $$("#pass_matric").val('');
                    $$("#pass_email").val('');
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


function update_staff() {
    var f_name = sessionStorage.getItem("staff_sname")+" "+sessionStorage.getItem("staff_oname");
    $$(".staff-name").html(f_name);
}

function staff_login() {
    var staff = sessionStorage.getItem("staff_id");
    if(staff == "" || staff == null){
        return false;
    }else{
        return true;
    }
}

function update_student() {
    var f_name = sessionStorage.getItem("student_sname")+" "+sessionStorage.getItem("student_oname");
    $$(".student-name").html(f_name);
}

function student_login() {
    var staff = sessionStorage.getItem("matric");
    if(staff == "" || staff == null){
        return false;
    }else{
        return true;
    }
}