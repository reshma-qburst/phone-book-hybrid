$(document).ready(function() {

    var pictureSource; // picture source
    var destinationType; // sets the format of returned value

    document.addEventListener("deviceready", onDeviceReady, false);
    //window.openDatabase("databasename", "<version>", "<display_name>",'<size>');
    var db = window.openDatabase("Database", "1.0", "MyContactsDB", 200000);

    /**
     * Check if the device is ready.
     *
     */
    function onDeviceReady() {
        db.transaction(populateDB, errorDatabase, successCB); //Populate the database
        pictureSource = navigator.camera.PictureSourceType;
        destinationType = navigator.camera.DestinationType;
        document.addEventListener('backbutton', onBack, false); //Override the back button functionality
        document.addEventListener('capturePhoto', capturePhoto, false);
        document.addEventListener('getSavedPhoto', getPhoto, false);
    }

    $(".capturePhoto").bind("click", function(event) {
        capturePhoto();
    });

    $(".getSavedPhoto").bind("click", function(event) {
        getPhoto(pictureSource.SAVEDPHOTOALBUM);
    });

    /**
     * Success call back :: Called when a photo is successfully retrieved
     *
     */
    function onPhotoDataSuccess(imageData) {
        var smallImage = document.getElementById('smallImage');
        smallImage.style.display = 'block';
        smallImage.src = "data:image/jpeg;base64," + imageData; //Base64-encoded String
    }

    /**
     * Success call back :: Called when a photo is successfully retrieved
     *
     */
    function onPhotoURISuccess(imageURI) {
        var largeImage = document.getElementById('largeImage');
        largeImage.style.display = 'block';
        largeImage.src = imageURI; //URI for the image file
    }

    /**
     * A button will call this function
     *
     */
    function capturePhoto() {
        // Take picture using device camera and retrieve image as base64-encoded string
        navigator.camera.getPicture(onPhotoDataSuccess, onFail, {
            quality: 50,
            destinationType: destinationType.DATA_URL
        });
    }

    /**
     * A button will call this function
     *
     */
    function getPhoto(source) {
        // Retrieve image file location from specified source
        navigator.camera.getPicture(onPhotoURISuccess, onFail, {
            quality: 20,
            destinationType: destinationType.FILE_URI,
            sourceType: source
        });
    }

    /** 
     * Called if something bad happens.
     *
     */
    function onFail(message) {
        alert('Failed because: ' + message);
    }

    /**
     * Callback for overriding back button.
     *
     */
    function onBack() {
        //If the current page is index page then exit other wise navigate to index page
        if ($.mobile.activePage.is('#index')) {
            navigator.app.exitApp();
        } else {
            db.transaction(queryDB, errorDatabase);
        }
    }

    /**
     * Create DB Table.
     *
     */
    function populateDB(tx) {
        //Create the table
        tx.executeSql('CREATE TABLE IF NOT EXISTS MyContacts (id INTEGER PRIMARY KEY AUTOINCREMENT, \
                            name TEXT NOT NULL, nickName TEXT, mobilePhoneNumber INT, \
                            workPhoneNumber INT, emailId TEXT, website TEXT, happyBirthDay TEXT, groupId INTEGER, groupName TEXT)\
                             ');
        tx.executeSql('SELECT id, name, nickName, groupName FROM MyContacts ORDER BY name', [], querySuccess, errorDatabase);
    }

    function successCB() {
        db.transaction(queryDB, errorDatabase);
    }

    /**
     * Select list data.
     *
     */
    function queryDB(tx) {
        tx.executeSql('SELECT id, name, nickName, groupName FROM MyContacts ORDER BY name', [], querySuccess, errorDatabase);
    }

    /**
     * Display list.
     *
     */
    function querySuccess(tx, results) {
        $.mobile.loading("show");
        var len = results.rows.length;
        $("#userList").html('');
        for (var i = 0; i < len; i++) {
            var row = results.rows.item(i);
            var htmlData = '<li id="' + row["id"] + '"><a href="#"><h2>' + row["name"] + '</h2><p class="ui-li-aside">' + row["nickName"] + '</p></a></li>';
            $("#userList").append(htmlData);
            $("#userList").listview().listview('refresh');
        }
        $.mobile.loading("hide");
        $("body").pagecontainer("change", "#index");
    }

    /**
     * Call back for contact group list.
     *
     */
    function queryGroupSuccess(tx, results, groupid, groupname, id) {
        var row = results.rows.item(0);
        tx.executeSql("UPDATE MyContacts SET name=?, nickName=?, mobilePhoneNumber=?, workPhoneNumber=?, emailId=?, website=?, happyBirthDay=?, groupId=?, groupName=? WHERE id=? ", [row['name'], row['nickName'], row['mobilePhoneNumber'], row['workPhoneNumber'], row['emailId'], row['website'], row['happyBirthDay'], groupid, groupname, id],
            queryDB, errorDatabase);
        db.transaction(queryDB, errorDatabase);
    }

    /**
     * To throw error.
     *
     */
    function errorDatabase(err) {}

    $("#addNewPage .error").html('').hide();

    /**
     * Display form to add data.
     *
     */
    $(".addNew").bind("click", function(event) {
        $("#addNewPage .error").html('').hide();
        $("body").pagecontainer("change", "#addNewPage", { transition: "slide", reverse: true });
        $("#addNewPageHeader").html("Add New");
    });

    /**
     * Save form data.
     *
     */
    $("#save").bind("click", function(event) {
        var name = $.trim($("#name").val()).replace(/[^A-Za-z0-9 ]/g, '');
        var nickName = $.trim($("#nickName").val()).replace(/[^A-Za-z0-9 @]/g, '');
        var mobilePhoneNumber = $.trim($("#mobilePhoneNumber").val()).replace(/[^0-9-]/g, '');
        var workPhoneNumber = $.trim($("#workPhoneNumber").val()).replace(/[^0-9-]/g, '');
        var emailId = $.trim($("#emailId").val());
        var website = $.trim($("#website").val());
        var happyBirthDay = $.trim($("#happyBirthDay").val());
        var groupName = $.trim($("#groupName").val());
        var groupId;
        if (groupName == 'VIP') {
            groupId = 0;
        } else if (groupName == 'Family') {
            groupId = 1;
        } else if (groupName == 'Friends') {
            groupId = 2;
        } else {}

        if (name == '') {
            $("#addNewPage .error").html('Please enter name.').show();
        } else {
            resetForm();

            var id = $("#id").val();
            $("#id").val('');
            if (id == '') { //Save
                db.transaction(function(tx) {
                    tx.executeSql("INSERT INTO MyContacts (name, nickName, mobilePhoneNumber, workPhoneNumber, emailId, website, happyBirthDay, groupId, groupName) VALUES  (?, ?, ?, ?, ?, ?, ?, ? ,?)", [name, nickName, mobilePhoneNumber, workPhoneNumber, emailId, website, happyBirthDay, groupId, groupName],
                        queryDB, errorDatabase);
                });
            } else { //Update
                db.transaction(function(tx) {
                    tx.executeSql("UPDATE MyContacts SET name=?, nickName=?, mobilePhoneNumber=?, workPhoneNumber=?, emailId=?, website=?, happyBirthDay=? , groupId=?, groupName=? WHERE id=? ", [name, nickName, mobilePhoneNumber, workPhoneNumber, emailId, website, happyBirthDay, groupId, groupName, id],
                        queryDB, errorDatabase);
                });
            }
            db.transaction(queryDB, errorDatabase);
        }
    });

    /**
     * Refresh home page.
     *
     */

    $(".refresh").bind("click", function(event) {
        db.transaction(queryDB, errorDatabase);
    });

    /**
     * Reset form data and redirect back to home.
     *
     */
    $(".back").bind("click", function(event) {
        resetForm();
        db.transaction(queryDB, errorDatabase);
    });

    /**
     * Reset form data.
     *
     */
    function resetForm() {
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

    /**
     * Tap to show details view or taphold to show edit/delete options.
     *
     */
    $("#index [data-role='content'] ul").on('tap taphold', 'li', function(event) {
        event.preventDefault(); //Preventing default call of event
        event.stopImmediatePropagation(); //Keeps the rest of the handlers from being executed and prevents the event from bubbling up the DOM tree.
        var liId = this.id;
        if (event.type === 'taphold') { //To show edit/delete options popup
            navigator.notification.vibrate(30); //Vibrates the device for the specified amount of time
            var $popup = $('#actionList-popup');
            $("#actionList").html('');
            $("#actionList").append('<li id="edit&' + liId + '">Edit</li>').listview('refresh');
            $("#actionList").append('<li id="delete&' + liId + '">Delete</li>').listview('refresh');
            $("#actionList").append('<li id="addToGroup&' + liId + '">Add to Group</li>').listview('refresh');
            $popup.popup();
            $popup.popup('open');
            $("#tapHoldCheck").val('true');
        } else if (event.type === 'tap') { //To show contact details view
            if ($("#tapHoldCheck").val() == '') { //Tap will work only if the value of the text box with id 'tapHoldCheck' is blank
                db.transaction(function(tx) {
                    tx.executeSql("SELECT name, nickName, mobilePhoneNumber, workPhoneNumber, emailId, website, happyBirthDay, groupName FROM MyContacts WHERE id=?;", [liId], function(tx, results) {
                        var row = results.rows.item(0);
                        $.mobile.loading("show");
                        $("body").pagecontainer("change", "#displayDataPage", { transition: "slide" });
                        $("#nameHeader").html(row['name']);
                        $("#dataName").html(row['name']);
                        $("#dataNickName").html(row['nickName']);
                        $("#dataMobilePhoneNumber").html(row['mobilePhoneNumber']);
                        $("#dataWorkPhoneNumber").html(row['workPhoneNumber']);
                        $("#dataEmailId").html('<a href="mailto:' + row['emailId'] + '">' + row['emailId'] + '</a>');
                        $("#dataWebsite").html('<a href="' + row['website'] + '" data-role="external">' + row['website'] + '</a>');
                        $("#dataHappyBirthDay").html(row['happyBirthDay']);
                        $("#dataContactGroup").html(row['groupName']);
                        $('#dataList').trigger('create');
                        $('#dataList').listview('refresh');
                        $.mobile.loading("hide");
                    });
                });
            }
        }
    });

    /**
     * Change the hidden field value when the popup is closed.
     *
     */
    $('#actionList-popup').bind({
        popupafterclose: function(event, ui) {
            $("#tapHoldCheck").val('');
        }
    });

    /**
     * Edit and Delete functionality.
     *
     */
    $("#index [data-role='popup'] ul").on('click', 'li', function(event) {
        var action_liId = this.id.split('&');
        var action = action_liId[0];
        var id = action_liId[1];
        if (action == 'edit') { //Edit
            db.transaction(function(tx) {
                tx.executeSql("SELECT name, nickName, mobilePhoneNumber, workPhoneNumber, emailId, website, happyBirthDay, groupName  FROM MyContacts WHERE id=?;", [id], function(tx, results) {
                    var row = results.rows.item(0);
                    $("#name").val(row['name']);
                    $("#nickName").val(row['nickName']);
                    $("#mobilePhoneNumber").val(row['mobilePhoneNumber']);
                    $("#workPhoneNumber").val(row['workPhoneNumber']);
                    $("#emailId").val(row['emailId']);
                    $("#website").val(row['website']);
                    $("#happyBirthDay").val(row['happyBirthDay']);
                    $("#id").val(id);
                    $("#addNewPageHeader").html('Edit');
                    $("body").pagecontainer("change", "#addNewPage", { transition: "slide", reverse: true });
                });
            });
        }
        if (action == 'delete') { //Delete
            navigator.notification.confirm(
                'Are you sure?',
                function(buttonIndex) { onConfirm(buttonIndex, id); },
                'Delete Contact',
                'Ok, Cancel'
            );
        }
        if (action == 'addToGroup') { //Add to Group
            $("body").pagecontainer("change", "#addContactGroupPage", { transition: "slide", reverse: true });
            $("#groupContactData").change(function() {
                var selectedGroupId = $(this).val();
                var selectedGroupName = $(this).find(":selected").text();
                db.transaction(function(tx) {
                    tx.executeSql("SELECT name, nickName, mobilePhoneNumber, workPhoneNumber, emailId, website, happyBirthDay FROM MyContacts WHERE id=?;", [id],
                        function(tx, results) {
                            queryGroupSuccess(tx, results, selectedGroupId, selectedGroupName, id)
                        }, errorDatabase);
                });
            });
        }
    });

    /**
     * Call back for delete confirmation from DB.
     *
     */
    function onConfirm(buttonIndex, id) {
        if (buttonIndex === 1) { //Delete 
            db.transaction(function(tx) { tx.executeSql("DELETE FROM MyContacts WHERE id=?", [id], queryDB, errorDatabase); });
        }
        if (buttonIndex === 2) {
            $("body").pagecontainer("change", "#index", { transition: "slide" });
        }
    }

    /**
     * Group content tap functionality.
     *
     */
    $("#index [data-role='group-content'] ul").on('tap taphold', 'li', function(event) {
        event.preventDefault(); //Preventing default call of event
        event.stopImmediatePropagation(); //Keeps the rest of the handlers from being executed and prevents the event from bubbling up the DOM tree.
        var liId = this.id;
        if (event.type === 'tap') { //To show contact details view
            if ($("#tapHoldCheck").val() == '') { //Tap will work only if the value of the text box with id 'tapHoldCheck' is blank
                db.transaction(function(tx) {
                    tx.executeSql("SELECT id, name, nickName, mobilePhoneNumber, workPhoneNumber, emailId, website, happyBirthDay, groupName FROM MyContacts WHERE groupId=?;", [liId], function(tx, results) {
                        var len = results.rows.length;
                        if (len > 0) {
                            $.mobile.loading("show");
                            $("body").pagecontainer("change", "#contactGroupListPage", { transition: "slide" });
                            $("#groupDataList").html('');
                            for (var i = 0; i < len; i++) {
                                var row = results.rows.item(i);
                                var htmlData = '<li id="' + row["id"] + '"><a href="#"><h2>' + row["name"] + '</h2><p class="ui-li-aside">' + row["nickName"] + '</p></a></li>';
                                $("#groupDataList").append(htmlData);
                                $("#groupDataList").listview().listview('refresh');
                            }
                            $.mobile.loading("hide");
                        } else {

                        }
                    });
                });
            }
        } else if (event.type === 'taphold') { //To show edit/delete options popup
            navigator.notification.vibrate(30); //Vibrates the device for the specified amount of time
            var $popup = $('#actionList-popup');
            $("#actionList").html('');
            $("#actionList").append('<li id="edit&' + liId + '">Edit</li>').listview('refresh');
            $("#actionList").append('<li id="delete&' + liId + '">Delete</li>').listview('refresh');
            $popup.popup();
            $popup.popup('open');
            $("#tapHoldCheck").val('true');
        }
    });
    /**
     * Group content tap functionality.
     *
     */
    $("#contactGroupListPage [data-role='content'] ul").on('tap', 'li', function(event) {
        event.preventDefault(); //Preventing default call of event
        event.stopImmediatePropagation(); //Keeps the rest of the handlers from being executed and prevents the event from bubbling up the DOM tree.
        var liId = this.id;
        if (event.type === 'tap') { //To show contact details view
            if ($("#tapHoldCheck").val() == '') { //Tap will work only if the value of the text box with id 'tapHoldCheck' is blank
                db.transaction(function(tx) {
                    tx.executeSql("SELECT name, nickName, mobilePhoneNumber, workPhoneNumber, emailId, website, happyBirthDay, groupName FROM MyContacts WHERE id=?;", [liId], function(tx, results) {
                        var row = results.rows.item(0);
                        $.mobile.loading("show");
                        $("body").pagecontainer("change", "#displayDataPage", { transition: "slide" });
                        $("#nameHeader").html(row['name']);
                        $("#dataName").html(row['name']);
                        $("#dataNickName").html(row['nickName']);
                        $("#dataMobilePhoneNumber").html(row['mobilePhoneNumber']);
                        $("#dataWorkPhoneNumber").html(row['workPhoneNumber']);
                        $("#dataEmailId").html('<a href="mailto:' + row['emailId'] + '">' + row['emailId'] + '</a>');
                        $("#dataWebsite").html('<a href="' + row['website'] + '" data-role="external">' + row['website'] + '</a>');
                        $("#dataHappyBirthDay").html(row['happyBirthDay']);
                        $("#dataContactGroup").html(row['groupName']);
                        $('#dataList').trigger('create');
                        $('#dataList').listview('refresh');
                        $.mobile.loading("hide");
                    });
                });
            }
        }
    });
});