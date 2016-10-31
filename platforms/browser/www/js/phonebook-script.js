$(document).ready(function(){
            document.addEventListener("deviceready", onDeviceReady, false);
            //window.openDatabase("databasename", "<version>", "<display_name>",'<size>');
            var db = window.openDatabase("Database", "1.0", "MyContactsDB", 200000);
            function onDeviceReady(){
                db.transaction(populateDB, errorDatabase, successCB);//Populate the database
                document.addEventListener('backbutton', onBack, false);//Override the back button functionality
            }
            function onBack(){
            //If the current page is index page then exit other wise navigate to index page
                if($.mobile.activePage.is('#index')){
                    navigator.app.exitApp();
                }else{
                    db.transaction(queryDB, errorDatabase);
                }
            } 
            function populateDB(tx){
                //Create the table
                tx.executeSql('CREATE TABLE IF NOT EXISTS MyContacts (id INTEGER PRIMARY KEY AUTOINCREMENT, \
                            name TEXT NOT NULL, nickName TEXT, mobilePhoneNumber INT, \
                            workPhoneNumber INT, emailId TEXT, website TEXT, happyBirthDay TEXT)\
                             ');
                tx.executeSql('SELECT id, name, nickName FROM MyContacts ORDER BY name', [], querySuccess, errorDatabase);
            }
 
            function successCB(){
                db.transaction(queryDB, errorDatabase);
            }
 
            //to list contact
            function queryDB(tx){
                tx.executeSql('SELECT id, name, nickName FROM MyContacts ORDER BY name', [], querySuccess, errorDatabase);
            }
 
            function querySuccess(tx, results){
                $.mobile.showPageLoadingMsg(true);
                var len = results.rows.length;
                $("#userList").html('');
                    for (var i=0; i<len; i++){
                        var row= results.rows.item(i);
                        var htmlData = '<li id="'+row["id"]+'"><a href="#"><h2>'+row["name"]+'</h2><p class="ui-li-aside">'+row["nickName"]+'</p></a></li>';
                        //$("#userList").append(htmlData).listview('refresh');
                        $("#userList").append(htmlData);
                        $("#userList").listview().listview('refresh');
                }
                //$.mobile.changePage($("#index"), { transition : "slide"});
                $.mobile.hidePageLoadingMsg();
                $.mobile.changePage($("#index"));
            }
 
            function errorDatabase(err){
            }

            $("#addNewPage .error").html('').hide();
            $(".addNew").bind ("click", function (event){
                $("#addNewPage .error").html('').hide();
                $.mobile.changePage ($("#addNewPage"), { transition : "slide", reverse : true });
                $("#addNewPageHeader").html("Add New");
            });

            $("#save").bind ("click", function (event){
                var name = $.trim($("#name").val()).replace(/[^A-Za-z0-9 ]/g, '');
                var nickName = $.trim($("#nickName").val()).replace(/[^A-Za-z0-9 @]/g, '');
                var mobilePhoneNumber = $.trim($("#mobilePhoneNumber").val()).replace(/[^0-9-]/g, '');
                var workPhoneNumber = $.trim($("#workPhoneNumber").val()).replace(/[^0-9-]/g, '');
                var emailId = $.trim($("#emailId").val());
                var website = $.trim($("#website").val());
                var happyBirthDay = $.trim($("#happyBirthDay").val());
 
                if (name == ''){
                    $("#addNewPage .error").html('Please enter name.').show();
                }
                else{
                    resetForm();
 
                    var id = $("#id").val();
                    $("#id").val('');
                    if (id == ''){  //Save
                        db.transaction(function (tx){ tx.executeSql("INSERT INTO MyContacts (name, nickName, mobilePhoneNumber, workPhoneNumber, emailId, website, happyBirthDay) VALUES  (?, ?, ?, ?, ?, ?, ?)",[name, nickName, mobilePhoneNumber, workPhoneNumber, emailId, website, happyBirthDay],
                            queryDB, errorDatabase); });  
                    }
                    else{   //Update
                            db.transaction(function (tx){ tx.executeSql("UPDATE MyContacts SET name=?, nickName=?, mobilePhoneNumber=?, workPhoneNumber=?, emailId=?, website=?, happyBirthDay=? WHERE id=? ",[name, nickName, mobilePhoneNumber, workPhoneNumber, emailId, website, happyBirthDay, id],
                            queryDB, errorDatabase); });  
                        }
                    db.transaction(queryDB, errorDatabase);
                    }
                });
                 
                $(".refresh").bind("click", function (event){
                    db.transaction(queryDB, errorDatabase);
                });
                 
                $(".back").bind("click", function (event){
                    resetForm();
                    db.transaction(queryDB, errorDatabase);
                });
                 
                function resetForm(){
                    $("#addNewPage .error").html('').hide();
                    $("#addNewPage #name").val('');
                    $("#addNewPage #nickName").val('');
                    $("#addNewPage #mobilePhoneNumber").val('');
                    $("#addNewPage #workPhoneNumber").val('');
                    $("#addNewPage #emailId").val('');
                    $("#addNewPage #website").val('');
                    $("#addNewPage #happyBirthDay").val('');
                    $("#addNewPage #addNewPageHeader").html('');    
                }
        });