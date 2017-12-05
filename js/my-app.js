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
    //var s_id = sessionStorage.getItem("staff_id");
    if(staff_login()){
        $$("#staff-home").click();
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
}).trigger();
//act-btn

myApp.onPageInit('staff-reg',function () {
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

myApp.onPageInit('staff-home',function () {
    if(!staff_login()){
        window.location = "main.html";
    }
    update_staff();
});

myApp.onPageInit('staff-pub-course',function () {
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

myApp.onPageInit('view-staff-material',function () {
    if(!staff_login()){
        window.location = "main.html";
    }
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

myApp.onPageInit('view-staff-outline',function () {
    if(!staff_login()){
        window.location = "main.html";
    }
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
                    tr += "<td><a href='#' class='dl2' data-id='"+rec[i].id+"'>View</a> </td>";
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


function downloadFiles(fname) {
    show_toast("File downloading...","yellow");
    myApp.showIndicator();
    var fileTransfer = new FileTransfer();
    var d_url = base_url+"/upload";
    var uri = encodeURI(d_url+"/"+fname);
    var fileURL =  "///storage/emulated/0/DCIM/"+fname;

    fileTransfer.download(
        uri, fileURL, function(entry) {
            console.log("download complete: " + entry.toURL());
        },

        function(error) {
            console.log("download error source " + error.source);
            console.log("download error target " + error.target);
            console.log("download error code" + error.code);
            myApp.alert("Download fail");
        },

        false, {
            headers: {
                "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
            }
        }
    );
}

function openBrowser(fname) {
    var d_url = base_url+"/upload/"+fname;
    var target = '_blank';
    var options = "location = yes"
    var ref = cordova.InAppBrowser.open(d_url, target, options);

    ref.addEventListener('loadstart', loadstartCallback);
    ref.addEventListener('loadstop', loadstopCallback);
    ref.addEventListener('loadloaderror', loaderrorCallback);
    ref.addEventListener('exit', exitCallback);

    function loadstartCallback(event) {
        //console.log('Loading started: '  + event.url)
    }

    function loadstopCallback(event) {
        //console.log('Loading finished: ' + event.url)
    }

    function loaderrorCallback(error) {
        //console.log('Loading error: ' + error.message)
    }

    function exitCallback() {
        console.log('Browser is closed...')
    }
}