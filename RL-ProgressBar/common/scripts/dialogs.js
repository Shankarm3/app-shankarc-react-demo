
var dialogs = {
    changePasswordDialog: {
        $changePasswordDialogDiv: {},
        $changePasswordDialogAlertDiv: {},
        showOrHide: true,
        initialize: function (param) {
            this.$changePasswordDialogDiv = param.$changePasswordDialogDiv;
            this.$changePasswordDialogDiv.attr('title', globalvars.localResourceMap.change_password_dialog);
            this.$changePasswordDialogAlertDiv = param.$changePasswordDialogAlertDiv;
            dialogs.changePasswordDialog.bindFunctionality();
            this.$changePasswordDialogDiv.dialog({
                modal: true,
                autoOpen: false,
                width: 340,
                resizable: false,
                position: [550, 200],
            });
            return false;
        },
        bindFunctionality: function () {

            $("#change_password_submit").click(function () {
                changePassword();
            });

            $("#specification_button").click(function () {
                $("#password_specifications").toggle(dialogs.changePasswordDialog.showOrHide);
                if (dialogs.changePasswordDialog.showOrHide == true) {
                    $("#password_specifications").show();
                    dialogs.changePasswordDialog.showOrHide = false;
                } else if (dialogs.changePasswordDialog.showOrHide == false) {
                    $("#password_specifications").hide();
                    dialogs.changePasswordDialog.showOrHide = true;
                }
            });

        },
        open: function () {
            this.$changePasswordDialogAlertDiv.text("");
            log('open dialog');
            $("#password_specifications").hide()
            dialogs.changePasswordDialog.showOrHide = true;
            this.$changePasswordDialogDiv.dialog('open');
        }
    },
    /*User Management Dialog Functionality For Admin*/
    userManagementDialog: {
        $userManagementDialogDiv: {},
        $userManagementScreen: "CREATE",
        auditorTemplate: "",
        userDetails: {},
        /*Initialize all the button labels from external resource*/
        initialize: function (param) {
            this.$userManagementDialogDiv = param.$userManagementDialogDiv;
            this.$userManagementDialogDiv.attr('title', globalvars.localResourceMap.user_management);
            dialogs.userManagementDialog.bindFunctionality();
            this.$userManagementDialogDiv.dialog({
                modal: true,
                autoOpen: false,
                width: 450,
                resizable: false,
                position: [450, 200]
            });
            return false;
        },
        loadData: function () {/*Load List of Available Auditor Roles like Admin,Supervisor,Internal Centralized Auditor*/

            this.auditorTemplate = getTemplate('common/templates/option_item_auditor.html');


            if (globalvars.auditorRoles == undefined) {
                $.ajax({
                    type: 'GET',
                    url: globalvars.root.rolesUri,
                    traditional: true,
                    dataType: 'json',
                    success: function (data) {
                        globalvars["auditorRoles"] = data;
                        $("#user_management_auditor_role").empty();
                        var tempHtml = '<option value="" selected= "selected"></option>';
                        $(globalvars.auditorRoles).each(function (i) {
                            tempHtml += $.nano(dialogs.userManagementDialog.auditorTemplate, {index: globalvars.auditorRoles[i].roleName, data: globalvars.auditorRoles[i].roleName});
                        });
                        $("#user_management_auditor_role").append(tempHtml);

                    }
                })
            } 

            if (globalvars.timeZoneData == undefined) {
                $.ajax({
                    type: 'GET',
                    url: globalvars.root.userTimeZoneUri,
                    traditional: true,
                    dataType: 'json',
                    success: function (data) {
                        globalvars["timeZoneData"] = data;
                        $("#user_management_timezone_type").empty();
                        var tempHtmlTime = '<option value="" selected= "selected"></option>';
                        $(globalvars.timeZoneData).each(function (i) {
                            tempHtmlTime += $.nano(dialogs.userManagementDialog.auditorTemplate, {index: globalvars.timeZoneData[i].code, data: globalvars.timeZoneData[i].name});
                        });
                        $("#user_management_timezone_type").append(tempHtmlTime);
                        $("#user_management_timezone_type").val("EST");
                    }
                })
            } 



           

        },
        drawScreen: function () {/*Draw the Auditor Role Drop Down*/
            $("#user_management_reset_password").hide();
            //$("#user_management_delete").hide();
            $("#user_management_disabled_checkbox_row").hide();
            $("#user_management_reset_button_row").hide();
            $("#user_management_hr_line_row").hide();
            $("#user_management_space_row").hide();
            

            






        },
        open: function () {
            dialogs.userManagementDialog.reset();
            log('open User Management dialog');
            this.$userManagementDialogDiv.dialog('open');
            $("#user_management_reset_password").val(globalvars.localResourceMap.user_management_reset_password);
            $("#user_management_submit").val(globalvars.localResourceMap.user_management_submit);
            $("#user_management_reset").val(globalvars.localResourceMap.user_management_reset);
            //$("#user_management_delete").val(globalvars.localResourceMap.user_management_delete);
            if (globalvars.user.uType == globalvars.roles.administrator || globalvars.user.uType == globalvars.roles.helpdeskUser) {
                dialogs.userManagementDialog.loadData();
                 dialogs.userManagementDialog.drawScreen();
            }
        },
        bindFunctionality: function () {/*Functionality related to tab click, Submit,Reset and Cancel Buttons */

            $("#user_management_main_menu li").eq(0).click(function () {
                $("#user_management_main_menu li.user_management_main_menu_item").removeClass('active');
                $(this).addClass('active');
                $("#user_management_user_name").removeAttr("readonly");
                $("#user_management_auditor_list_row").hide();
                $("#user_management_disabled_checkbox_row").hide();
                $("#user_management_reset_button_row").hide();
                $("#user_management_hr_line_row").hide();
                $("#user_management_space_row").hide();
                $("#user_management_timezone_type").val("EST");

                //$("#user_management_delete").hide();
                $("#user_management_reset_password").hide();
                dialogs.userManagementDialog.$userManagementScreen = "CREATE";
                dialogs.userManagementDialog.reset();
            });

            $("#user_management_main_menu li").eq(1).click(function () {
                $("#user_management_main_menu li.user_management_main_menu_item").removeClass('active');
                $(this).addClass('active');
                $("#user_management_auditor_list_row").show();
                $("#user_management_user_name").attr("readonly", "readonly");
                //$("#user_management_delete").show();
                if (globalvars.authmode != 'rsa') {
                    $("#user_management_reset_password").show();
                }
                $("#user_management_disabled_checkbox_row").show();
                $("#user_management_reset_button_row").show();
                $("#user_management_hr_line_row").show();
                $("#user_management_space_row").show();
                dialogs.userManagementDialog.loadAuditors();
            });

            $("#user_management_submit").click(function () {

                var user_name = $("#user_management_user_name").val();
                var first_name = $("#user_management_first_name").val();
                var last_name = $("#user_management_last_name").val();
                var email = $("#user_management_email").val();
                var manager = $("#user_management_manager").val();
                var phone = $("#user_management_phone").val();
                var role_selected = $("#user_management_auditor_role").val();
                var timeZoneData = $("#user_management_timezone_type").val();

                var isEnabled;

                if ($('#user_management_auditor_list_row input[name=enabled]').is(':checked') == true)
                    isEnabled = false;
                else
                    isEnabled = true;


                log(isEnabled);
                if (dialogs.userManagementDialog.$userManagementScreen === "MODIFY" && user_name == "") {
                    $("#user_management_validation_alert").text(globalvars.localResourceMap.user_management_empty_user);
                }
                if (user_name == "" || first_name == "" || last_name == "" || email == "" || phone == "") {
                    $("#user_management_validation_alert").text(globalvars.localResourceMap.user_management_empty_validation);
                } else if (role_selected == "") {
                    $("#user_management_validation_alert").text(globalvars.localResourceMap.user_management_valid_user_type);
                } else if (!isValidPhone(phone)) {
                    $("#user_management_validation_alert").text(globalvars.localResourceMap.user_management_valid_phone);
                } else if (!validateEmailListComma(email)) {
                    $("#user_management_validation_alert").text(globalvars.localResourceMap.user_management_valid_email);
                } else {
                    $("#user_management_validation_alert").text("");

                    var obj = new Object(); /* Object that has to be sent to Service*/
                    obj.uri = "";
                    obj.userId = user_name;
                    obj.fName = first_name;
                    obj.lName = last_name;
                    obj.uType = role_selected;
                    obj.email = email;
                    obj.phoneNbr = phone;
                    obj.primaryLoc = "";
                    obj.manager = manager;
                    obj.createdBy = "";
                    obj.fullUserName = "";
                    obj.isEnabled = isEnabled;
                    obj.timeZone = timeZoneData;

                    if (dialogs.userManagementDialog.$userManagementScreen === "CREATE") {


                        /* Create a New User*/
                        postJSONModel({
                            url: globalvars.root.usersUri,
                            data: JSON.stringify(obj),
                            async: true,
                            callback: function () {
                                dialogs.messageDialog.show({title: globalvars.localResourceMap.message, text: globalvars.localResourceMap.user_management_success_message});
                                dialogs.userManagementDialog.reset();
                            },
                            errorfunction: function (xhr) {
                                if (xhr.status == 202) {
                                    dialogs.messageDialog.show({title: globalvars.localResourceMap.message, text: globalvars.localResourceMap.user_management_success_message});
                                    dialogs.userManagementDialog.reset();
                                } else {
                                    err_msg = getErrorMessage(xhr, false);
                                    dialogs.messageDialog.show({title: globalvars.localResourceMap.error, text: err_msg});
                                }
                            }
                        });


                    } else if (dialogs.userManagementDialog.$userManagementScreen === "MODIFY") {
                        var selectedUser = $("#user_management_search_auditor").val();
                        log(dialogs.userManagementDialog.userDetails.pwd);
                        if (dialogs.userManagementDialog.userDetails.userId != user_name || dialogs.userManagementDialog.userDetails.fName != first_name ||
                                dialogs.userManagementDialog.userDetails.lName != last_name ||
                                dialogs.userManagementDialog.userDetails.email != email || dialogs.userManagementDialog.userDetails.phoneNbr != phone ||
                                dialogs.userManagementDialog.userDetails.manager != manager || dialogs.userManagementDialog.userDetails.timeZone != timeZoneData ||
                                dialogs.userManagementDialog.userDetails.uType != role_selected || dialogs.userManagementDialog.userDetails.isEnabled != isEnabled) {
                            /* Modify the Existing User*/

                            $.ajax({
                                url: globalvars.root.usersUri + "/" + selectedUser,
                                type: 'PUT',
                                data: JSON.stringify(obj),
                                contentType: 'application/json',
                                success: function (data) {
                                    dialogs.messageDialog.show({title: globalvars.localResourceMap.message, text: globalvars.localResourceMap.user_management_modify_success});
                                    dialogs.userManagementDialog.reset();
                                },
                                error: function (xhr) {
                                    if (xhr.status == 202) {
                                        dialogs.messageDialog.show({title: globalvars.localResourceMap.message, text: globalvars.localResourceMap.user_management_modify_success});
                                        dialogs.userManagementDialog.reset();
                                    }
                                    if (xhr.status == 409) {
                                        dialogs.messageDialog.show({title: globalvars.localResourceMap.message, text: globalvars.localResourceMap.user_management_disable_user_error});
                                    }
                                }
                            });
                        } else {
                            $("#user_management_validation_alert").text(globalvars.localResourceMap.user_management_empty_modification);
                        }
                    }
                }

            });

            $("#user_management_reset").click(function () {
                dialogs.userManagementDialog.reset();
            });

            $("#user_management_cancel").click(function () {

                dialogs.userManagementDialog.reset();
                dialogs.userManagementDialog.$userManagementDialogDiv.dialog('close');
            });

            $("#user_management_reset_password").click(function () {

                if (globalvars.userDetails)
                {
                    if ($("#user_management_user_name").val() != "")
                    {
                        //var password_data = JSON.stringify(globalvars.userDetails.userId);
                        $.ajax({
                            url: globalvars.root.passwordResetUri,
                            type: 'PUT',
                            data: globalvars.userDetails.userId,
                            contentType: 'application/json',
                            success: function (data) {
                                dialogs.messageDialog.show({text: globalvars.localResourceMap.user_management_success_reset_password});
                            }

                        });
                    } else
                    {
                        $("#user_management_validation_alert").text(globalvars.localResourceMap.user_management_empty_user);
                    }

                } else
                {
                    $("#user_management_validation_alert").text(globalvars.localResourceMap.user_management_empty_user);
                }
            });

//		      $("#user_management_delete").click(function(){
//		    	  var userId = $("#user_management_user_name").val();
//		    	  if(userId == ""){
//		    		  $("#user_management_validation_alert").text(globalvars.localResourceMap.user_management_valid_userId);
//		    	  }else{
//		    		  $.ajax({
//		    			  url: globalvars.root.usersUri+"/"+userId,
//		    			  type:'DELETE',
//		    			  async:false,
//		    			  success:function(data){
//		    				  dialogs.messageDialog.show({ title: globalvars.localResourceMap.message, text: globalvars.localResourceMap.user_management_deleted_successfully });
//		    			  },
//		    			  error:function(xhr){
//		    				  if(xhr.status == 409){
//  				            	dialogs.messageDialog.show({ title: globalvars.localResourceMap.error, text: globalvars.localResourceMap.user_management_delete_user_error });
//		    				  }
//		    			  }
//		    		  });
//		    		  dialogs.userManagementDialog.reset();
//		    		  dialogs.userManagementDialog.loadAuditors();
//		    	  }
//
//		      });

            $("#user_management_search_auditor").change(function () { /*Change Function for User Drop down which fetches the details of selected auditor */
                var userName = $("#user_management_search_auditor").val();
                if (userName != undefined) {
                    $.ajax({
                        type: 'GET',
                        url: globalvars.root.usersUri + "/" + userName,
                        traditional: true,
                        dataType: 'json',
                        success: function (data) {
                            globalvars["userDetails"] = data;
                            /*Populate the form with selected user details*/

                            dialogs.userManagementDialog.userDetails = globalvars.userDetails;
                            $("#user_management_user_name").val(globalvars.userDetails.userId);
                            $("#user_management_first_name").val(globalvars.userDetails.fName);
                            $("#user_management_last_name").val(globalvars.userDetails.lName);
                            $("#user_management_email").val(globalvars.userDetails.email);
                            $("#user_management_phone").val(globalvars.userDetails.phoneNbr);
                            $("#user_management_manager").val(globalvars.userDetails.manager);
                            $("#user_management_auditor_role").val(globalvars.userDetails.uType);
                            $("#user_management_timezone_type").val(globalvars.userDetails.timeZone);
                            if (globalvars.userDetails.isEnabled)
                                $('#user_management_auditor_list_row input[name=enabled]').attr('checked', false);
                            else
                                $('#user_management_auditor_list_row input[name=enabled]').attr('checked', true);
                        }
                    })
                }
            });
        },
        reset: function () {
            $("#user_management_form")[0].reset();
            $("#user_management_validation_alert").text("");
            $('#user_management_auditor_list_row input[name=enabled]').attr('checked', false);
        },
        loadAuditors: function () { /*Load the List of Auditors*/

            $.ajax({
                type: 'GET',
                url: globalvars.root.usersUri,
                data: {isUserManagement: true},
                traditional: true,
                dataType: 'json',
                success: function (data) {
                    globalvars["userManagementAuditorsList"] = data;
                    dialogs.userManagementDialog.fillAuditorFilter();
                    dialogs.userManagementDialog.$userManagementScreen = "MODIFY";
                    dialogs.userManagementDialog.reset();
                }
            })

        },
        fillAuditorFilter: function () {/*Draw the User Drop down*/
            $("#user_management_search_auditor").empty();
            var tempHtml = "";
            tempHtml += $.nano(dialogs.userManagementDialog.auditorTemplate, {index: "", data: ""});
            $(globalvars.userManagementAuditorsList).each(function (i) {
                tempHtml += $.nano(dialogs.userManagementDialog.auditorTemplate, {index: globalvars.userManagementAuditorsList[i].userId, data: globalvars.userManagementAuditorsList[i].fullUserName});
            });
            $("#user_management_search_auditor").append(tempHtml);
        }
    },
    submitAccountDetailsDialog: {
        $submitAccountDetailsDialogDiv: {},
        url: "",
        type: "",
        title: "",
        message: "",
        detailId: "",
        screen: "",
        baseScreen: "",
        initialize: function (param) {
            log("initializing submit");
            this.$submitAccountDetailsDialogDiv = param.$submitAccountDetailsDialogDiv;
            this.baseScreen = param.baseScreen;
            this.$submitAccountDetailsDialogDiv.dialog({
                modal: true,
                autoOpen: false,
                width: 500,
                resizable: false,
                position: {my: "center", at: "top", of: window},
                buttons: [{
                        text: globalvars.localResourceMap.account_details_dialog_yes1,
                        click: function () {
                            log('Yes - Account List');
                            roles.centralAuditor.sendAccountDetails({
                                url: dialogs.submitAccountDetailsDialog.url,
                                type: dialogs.submitAccountDetailsDialog.type,
                                screen: dialogs.submitAccountDetailsDialog.screen,
                                callback: function () {
                                    dialogs.submitAccountDetailsDialog.$submitAccountDetailsDialogDiv.dialog("close");
                                    //screens.this.baseScreen.closeAccountDetails();
                                    window["screens"][dialogs.submitAccountDetailsDialog.baseScreen]["closeAccountDetails"]();
                                }
                            });


                        }
                    }, {
                        text: globalvars.localResourceMap.account_details_dialog_yes2,
                        click: function () {
                            log('Yes - Next Account');
                            roles.centralAuditor.sendAccountDetails({
                                url: dialogs.submitAccountDetailsDialog.url,
                                type: dialogs.submitAccountDetailsDialog.type,
                                screen: dialogs.submitAccountDetailsDialog.screen,
                                callback: function () {
                                    dialogs.submitAccountDetailsDialog.$submitAccountDetailsDialogDiv.dialog("close");
                                    window["screens"][dialogs.submitAccountDetailsDialog.baseScreen]["loadNext"]();
                                }
                            });

                        }
                    }, {
                        text: globalvars.localResourceMap.account_details_dialog_no,
                        click: function () {
                            log('No');
                            $(this).dialog("close");
                        }
                    }]
            });
            return false;
        },
        open: function (param) {
            log('open submit dialog ' + this.$submitAccountDetailsDialogDiv + "ID: " + param.detailId);

            this.url = param.url;
            this.type = param.type;
            this.title = param.title;
            this.message = param.message;
            this.detailId = parseInt(param.detailId, 10);
            this.screen = param.screen;
            this.baseScreen = param.baseScreen;
            this.$submitAccountDetailsDialogDiv.dialog('option', 'title', dialogs.submitAccountDetailsDialog.title);
            this.$submitAccountDetailsDialogDiv.children("p").html(dialogs.submitAccountDetailsDialog.message);
            this.$submitAccountDetailsDialogDiv.dialog('open');
        }



    },
    otherChargesSearchFormDialog: {
        $searchFormDialogDiv: {},
        billType: "",
        initialize: function (param) {
            this.$searchFormDialogDiv = param.$searchFormDialogDiv;
            this.$searchFormDialogDiv.attr('title', globalvars.localResourceMap.other_charges_grid_search_form_dialog);
            param.$searchFormDialogDivSubmit.unbind();
            dialogs.otherChargesSearchFormDialog.buttons(param);
            this.$searchFormDialogDiv.dialog({
                modal: true,
                autoOpen: false,
                width: 780,
                resizable: false,
                position: {my: "center", at: "top", of: window}
            });
            return false;
        },
        buttons: function (param) {
            dialogs.otherChargesSearchFormDialog.billType = param.billType;
            param.$searchFormDialogDivSubmit.click(function () {
                log('Other Charges Search Form Submit');
                $("#account_details_other_charges_grid_search_form_table").jqGrid('clearGridData');
                dialogs.otherChargesSearchFormDialog.loadChargeData();
            });

            param.$searchFormDialogDivReset.click(function () {
                dialogs.otherChargesSearchFormDialog.reset();
            });

            param.$searchFormDialogDivCancel.click(function () {
                dialogs.otherChargesSearchFormDialog.reset();
                param.$searchFormDialogDiv.dialog('close');
            });

            this.$searchFormDialogDiv.keypress(function (event) {
                if (event.which == 13) {
                    event.preventDefault();
                    dialogs.otherChargesSearchFormDialog.loadChargeData();
                }
            });



        },
        reset: function () {
            $("#account_details_other_charges_grid_search_form_table").jqGrid('clearGridData');
            $("#other_charges_grid_search_form")[0].reset();
        },
        open: function (param) {
            log('open dialog');
            dialogs.otherChargesSearchFormDialog.$searchFormDialogDiv.dialog('open');
        },
        close: function () {
            dialogs.otherChargesSearchFormDialog.reset();
            dialogs.otherChargesSearchFormDialog.$searchFormDialogDiv.dialog('close');
            dialogs.otherChargesSearchFormDialog.$searchFormDialogDiv.dialog('destroy');
            //$(this).remove();
        },
        loadChargeData: function () {
            var hospitalIdValue;
            if (dialogs.otherChargesSearchFormDialog.billType == 'PRE')
                hospitalIdValue = globalvars.preHospitals[globalvars.selectedPreHospitalIndex].hospitalId
            else if (dialogs.otherChargesSearchFormDialog.billType == 'POST')
                hospitalIdValue = globalvars.postHospitals[globalvars.selectedPostHospitalIndex].hospitalId
            else if (dialogs.otherChargesSearchFormDialog.billType == 'EDIT')
                hospitalIdValue = globalvars.cciHospitals[globalvars.selectedCciHospitalIndex].hospitalId

            $("#account_details_other_charges_grid_search_form_table").jqGrid('clearGridData');
            var searchQueryObject = {
                deptType: $("#search_department_number_type").val(),
                deptValue: $("#search_department_number_value").val(),
                deptDescType: $("#search_department_description_type").val(),
                deptDescValue: $("#search_department_description_value").val(),
                chargeType: $("#search_charge_number_type").val(),
                chargeValue: $("#search_charge_number_value").val(),
                chargeDescType: $("#search_charge_description_type").val(),
                chargeDescValue: $("#search_charge_description_value").val(),
                hcpcType: $("#search_hcpc_type").val(),
                hcpcValue: $("#search_hcpc_value").val(),
                revenueType: $("#search_revenue_code_type").val(),
                revenueValue: $("#search_revenue_code_value").val(),
                hospitalIdValue: hospitalIdValue,
                hospitalIdType: "equals"
            };

            $.ajax({
                type: 'GET',
                url: globalvars.charges.chargesMasterLookupUri,
                data: searchQueryObject,
                traditional: true,
                dataType: 'json',
                success: function (data) {

                    globalvars["otherChargesSearchForm"] = data;
                    if (globalvars.otherChargesSearchForm.length > 0) {
                        var datalength = globalvars.otherChargesSearchForm.length;
                        for (var i = 0; i < datalength; i++) {
                            $("#account_details_other_charges_grid_search_form_table").jqGrid('addRowData', i + 1, globalvars.otherChargesSearchForm[i]);
                        }
                    } else {
                        dialogs.messageDialog.show({text: globalvars.localResourceMap.associates_rule_charge_not_found_msg});
                    }

                }
            })

        }
    },
    otherPhysicianChargesSearchFormDialog: {
        $searchFormDialogDiv: {},
        billType: "",
        initialize: function (param) {
            this.$searchFormDialogDiv = param.$searchFormDialogDiv;
            this.$searchFormDialogDiv.attr('title', globalvars.localResourceMap.other_charges_grid_search_form_dialog);
            param.$searchFormDialogDivSubmit.unbind();
            dialogs.otherPhysicianChargesSearchFormDialog.buttons(param);
            this.$searchFormDialogDiv.dialog({
                modal: true,
                autoOpen: false,
                width: 650,
                height:450,
                resizable: false,
                position: {my: "center", at: "top", of: window}
            });
            return false;
        },
        buttons: function (param) {
            dialogs.otherPhysicianChargesSearchFormDialog.billType = param.billType;
            param.$searchFormDialogDivSubmit.click(function () {
                log('Other Charges Search Form Submit Physician');
                $("#account_details_other_charges_physician_grid_search_form_table").jqGrid('clearGridData');
                dialogs.otherPhysicianChargesSearchFormDialog.loadChargeData();
            });

            param.$searchFormDialogDivReset.click(function () {
                dialogs.otherPhysicianChargesSearchFormDialog.reset();
            });

            param.$searchFormDialogDivCancel.click(function () {
                dialogs.otherPhysicianChargesSearchFormDialog.reset();
                param.$searchFormDialogDiv.dialog('close');
            });

            this.$searchFormDialogDiv.keypress(function (event) {
                if (event.which == 13) {
                    event.preventDefault();
                    dialogs.otherPhysicianChargesSearchFormDialog.loadChargeData();
                }
            });

        },
        reset: function () {
            $("#account_details_other_charges_physician_grid_search_form_table").jqGrid('clearGridData');
            $("#other_charges_grid_physician_search_form")[0].reset();
        },
        open: function (param) {
            log('open dialog');
            dialogs.otherPhysicianChargesSearchFormDialog.$searchFormDialogDiv.dialog('open');
        },
        loadChargeData: function () {

            console.log('Physician.........................');
            var hospitalIdValue;
            //if(dialogs.otherPhysicianChargesSearchFormDialog.billType == 'PRE')
            hospitalIdValue = globalvars.selectedHospitalId;//globalvars.physicianHospitals[globalvars.selectedPreHospitalIndex].hospitalId;

            $("#account_details_other_charges_physician_grid_search_form_table").jqGrid('clearGridData');

            var searchQueryObject = {
                hcpcType: $("#search_hcpc_type_physician").val(),
                hcpcValue: $("#search_hcpc_value_physician").val(),
                hospitalIdValue: hospitalIdValue,
                hospitalIdType: "equals"
            };

            $.ajax({
                type: 'GET',
                url: globalvars.uriCharges.chargesMasterLookupUri,
                data: searchQueryObject,
                traditional: true,
                dataType: 'json',
                success: function (data) {

                    globalvars["otherChargesSearchFormPhysician"] = data;


                    if (globalvars.otherChargesSearchFormPhysician.length > 0) {
                        // $("#account_details_other_charges_physician_grid_search_form_table").jqGrid('clearGridData');

                        // var datalength = globalvars.otherChargesSearchFormPhysician.length;
                        // for (var i = 0; i < datalength; i++) {
                        //     $("#account_details_other_charges_physician_grid_search_form_table").jqGrid('addRowData', i + 1, globalvars.otherChargesSearchFormPhysician[i]);
                        // }
                        

                    } else {
                        dialogs.messageDialog.show({text: globalvars.localResourceMap.associates_rule_charge_not_found_msg});
                    }
                     gridPhysician.loadOtherPhyChargesSearchFormGrid.initialize({
                            data: (globalvars.otherChargesSearchFormPhysician!= null)?globalvars.otherChargesSearchFormPhysician:[],
                            gridDiv: "#account_details_other_charges_physician_grid_search_form_table"
                            
                        });

                }
            })

        }
    },
   
    messageDialog: {
        $messageDialogDiv: {},
        show: function (param) {
            this.$messageDialogDiv = $(document.createElement('div'));
            this.$messageDialogDiv.attr('id', 'messageDialog');
            this.$messageDialogDiv.append('<p>' + param.text + '</p>');
            this.$messageDialogDiv.dialog({
                title: param.title ? param.title : globalvars.localResourceMap.message,
                modal: true,
                resizable: false,
                buttons: {
                    "OK": function () {
                        $(this).dialog("close");
                        dialogs.messageDialog.$messageDialogDiv.remove();
                    }
                }
            });
        }
    },
    messageDialogRule: {
        $messageDialogDiv: {},
        show: function (param) {
            this.$messageDialogDiv = $(document.createElement('div'));
            this.$messageDialogDiv.attr('id', 'messageDialogRule');
            this.$messageDialogDiv.append('<p>' + param.text + '</p>');
            this.$messageDialogDiv.dialog({
                title: param.title ? param.title : globalvars.localResourceMap.message,
                modal: true,
                resizable: false,
                width: 780,
                buttons: {
                    "OK": function () {
                        $(this).dialog("close");
                        dialogs.messageDialogRule.$messageDialogDiv.remove();
                    }
                }
            });
        }
    },
    messageDialogRuleSave: {
        $messageDialogDiv: {},
        show: function (param) {
            this.$messageDialogDiv = $(document.createElement('div'));
            this.$messageDialogDiv.attr('id', 'messageDialog');
            this.$messageDialogDiv.append('<p>' + param.text + '</p>');
            this.$messageDialogDiv.dialog({
                title: param.title ? param.title : globalvars.localResourceMap.message,
                modal: true,
                resizable: false,
                buttons: {
                    "OK": function () {
                        $(this).dialog("close");
                        dialogs.messageDialogRuleSave.$messageDialogDiv.remove();
                          $("#sub_menu #Configuration li.submenu_item").eq(0).click();

                    },
                }
            });
        }
    },
    messageDialogRuleQueueSave: {
        $messageDialogDiv: {},
        show: function (param) {
            this.$messageDialogDiv = $(document.createElement('div'));
            this.$messageDialogDiv.attr('id', 'messageDialog');
            this.$messageDialogDiv.append('<p>' + param.text + '</p>');
            this.$messageDialogDiv.dialog({
                title: param.title ? param.title : globalvars.localResourceMap.message,
                modal: true,
                resizable: false,
                buttons: {
                    "OK": function () {
                        $(this).dialog("close");
                        dialogs.messageDialogRuleQueueSave.$messageDialogDiv.remove();
                          $("#sub_menu #supervisorTools li.submenu_item").eq(2).click();

                    },
                }
            });
        }
    },
    messageDialogNewRuleSave: {
        $messageDialogDiv: {},
        show: function (param) {
            this.$messageDialogDiv = $(document.createElement('div'));
            this.$messageDialogDiv.attr('id', 'messageDialog');
            this.$messageDialogDiv.append('<p>' + param.text + '</p>');
            this.$messageDialogDiv.dialog({
                title: param.title ? param.title : globalvars.localResourceMap.message,
                modal: true,
                resizable: false,
                buttons: {
                    "OK": function () {
                        $(this).dialog("close");
                        dialogs.messageDialogNewRuleSave.$messageDialogDiv.remove();
                        //$("#sub_menu #supervisorTools li.submenu_item").eq(3).click();
                        $("#main_menu li.main_menu_item").eq(4).click();

                    },
                }
            });
        }
    },
    messageDialogReportSave: {
        $messageDialogDiv: {},
        show: function (param) {
            this.$messageDialogDiv = $(document.createElement('div'));
            this.$messageDialogDiv.attr('id', 'messageDialog');
            this.$messageDialogDiv.append('<p>' + param.text + '</p>');
            this.$messageDialogDiv.dialog({
                title: param.title ? param.title : globalvars.localResourceMap.message,
                modal: true,
                resizable: false,
                buttons: {
                    "OK": function () {
                        $(this).dialog("close");
                        dialogs.messageDialogReportSave.$messageDialogDiv.remove();
                        //$("#sub_menu #Configuration li.submenu_item").eq(2).click();

                    },
                }
            });
        }
    },
    messageDialogRuleTableChange: {
        $messageDialogDiv: {},
        show: function (param) {
            this.$messageDialogDiv = $(document.createElement('div'));
            this.$messageDialogDiv.attr('id', 'messageDialog');
            this.$messageDialogDiv.append('<p>' + param.text + '</p>');
            this.$messageDialogDiv.dialog({
                title: param.title ? param.title : globalvars.localResourceMap.message,
                modal: true,
                resizable: false,
                buttons: {
                    "OK": function () {

                        $(this).dialog("close");
                        dialogs.messageDialogRuleTableChange.$messageDialogDiv.remove();
                        screens.newRule.selectedPrevTableValue = screens.newRule.selectedTable;
                        screens.newRule.changeRuleSchema();
                        //$("#sub_menu #Configuration li.submenu_item").eq(0).click();

                    },
                    "CANCEL": function () {
                        $("#filter_table_select").val(screens.newRule.selectedPrevTableValue);
                        $(this).dialog("close");
                        dialogs.messageDialogRuleTableChange.$messageDialogDiv.remove();
                        //$("#sub_menu #Configuration li.submenu_item").eq(0).click();

                    }
                }
            });
        }
    },
    messageDialogRuleRunChange: {
        $messageDialogDiv: {},
        show: function (param) {
            this.$messageDialogDiv = $(document.createElement('div'));
            this.$messageDialogDiv.attr('id', 'messageDialog');
            this.$messageDialogDiv.append('<p>' + param.text + '</p>');
            this.$messageDialogDiv.dialog({
                title: param.title ? param.title : globalvars.localResourceMap.message,
                modal: true,
                resizable: false,
                buttons: {
                    "OK": function () {
                        screens.auditorQueueList.updateRuleAssignRun();
                        $(this).dialog("close");

                    },
                    "CANCEL": function () {
                        $(this).dialog("close");
                    }
                }
            });
        }
    },
    messageDialogAuditorQueueTableChange: {
        $messageDialogDiv: {},
        show: function (param) {
            this.$messageDialogDiv = $(document.createElement('div'));
            this.$messageDialogDiv.attr('id', 'messageDialog');
            this.$messageDialogDiv.append('<p>' + param.text + '</p>');
            this.$messageDialogDiv.dialog({
                title: param.title ? param.title : globalvars.localResourceMap.message,
                modal: true,
                resizable: false,
                buttons: {
                    "OK": function () {

                        $(this).dialog("close");
                        dialogs.messageDialogAuditorQueueTableChange.$messageDialogDiv.remove();
                        screens.newAuditorQueue.selectedPrevTableValue = screens.newAuditorQueue.selectedTable;
                        screens.newAuditorQueue.changeRuleSchema();
                        //$("#sub_menu #Configuration li.submenu_item").eq(0).click();

                    },
                    "CANCEL": function () {
                        $("#filter_table_select").val(screens.newAuditorQueue.selectedPrevTableValue);
                        $(this).dialog("close");
                        dialogs.messageDialogAuditorQueueTableChange.$messageDialogDiv.remove();
                        //$("#sub_menu #Configuration li.submenu_item").eq(0).click();

                    }
                }
            });
        }
    },
    showToDialog: {
        $messageDialogDiv: {},
        show: function (param) {
            this.$messageDialogDiv = $(document.createElement('div'));
            this.$messageDialogDiv.attr('id', 'emailDialog');
            this.$messageDialogDiv.append('<textarea style="width:465px;height:180px">' + param.emailText + '</textarea>');
            this.$messageDialogDiv.dialog({
                title: param.title ? param.title : globalvars.localResourceMap.message,
                modal: true,
                resizable: false,
                width: 500,
                height: 300,
                buttons: {
                    "OK": function () {
                        var textCC = $('#emailDialog').find('textarea').val();

                        if (textCC.length > 0) {

                            if (param.cIndex == 3)
                                grids.configReportGrid.$gridDiv.jqGrid('setCell', param.id, 'toEmail', textCC);
                            else if (param.cIndex == 5)
                                grids.configReportGrid.$gridDiv.jqGrid('setCell', param.id, 'ccEmail', textCC);
                        }

                        $(this).dialog("close");
                        dialogs.showToDialog.$messageDialogDiv.remove();
                        //screens.newRule.selectedPrevTableValue = screens.newRule.selectedTable;
                        //screens.newRule.changeRuleSchema();
                        //$("#sub_menu #Configuration li.submenu_item").eq(0).click();

                    },
                    "CANCEL": function () {
                        // $("#filter_table_select").val(screens.newRule.selectedPrevTableValue);
                        $(this).dialog("close");
                        dialogs.showToDialog.$messageDialogDiv.remove();
                        //$("#sub_menu #Configuration li.submenu_item").eq(0).click();

                    }
                }
            });
        }
    },
    confirmAccountListDialog: {
        $confirmAccountDialogDiv: {},
        initialize: function (param) {
            this.$confirmAccountDialogDiv = param.$confirmAccountDialogDiv;
            this.$confirmAccountDialogDiv.dialog({
                modal: true,
                autoOpen: false,
                width: 340,
                resizable: false,
                position: [550, 200],
                buttons: [{
                        text: globalvars.localResourceMap.confirm_account_dialog_yes,
                        click: function () {
                            $(this).dialog("close");
                        }
                    }, {
                        text: globalvars.localResourceMap.confirm_account_dialog_no,
                        click: function () {
                            $(this).dialog("close");
                        }
                    }]
            });
            return false;
        },
        reInitialize: function (param) {
            log("re-initializing confirmAccountListDialog");
            this.$confirmAccountDialogDiv.dialog({
                modal: true,
                autoOpen: false,
                width: 340,
                resizable: false,
                position: [550, 200],
                buttons: [{
                        text: globalvars.localResourceMap.confirm_account_dialog_yes,
                        click: function () {
                            $(this).dialog("close");
                            window[param.screenFolder][param.screenName][param.functionName]();
                            log("re-initialized Ok");

                        }
                    }, {
                        text: globalvars.localResourceMap.confirm_account_dialog_no,
                        click: function () {
                            $(this).dialog("close");
                        }
                    }]
            });
            return false;
        },
        open: function (param) {
            this.$confirmAccountDialogDiv.dialog('option', 'title', param.title);
            this.$confirmAccountDialogDiv.children("p").html(param.message);
            this.$confirmAccountDialogDiv.dialog('open');
        }
    },
   
    confirmChargesAccountInfo: {
        $confirmChargesDialogDiv: {},
        initialize: function (param) {
            log("initializing submit");
            dialogs.confirmChargesAccountInfo.$confirmChargesDialogDiv = param.$confirmChargesDialogDiv;
            dialogs.confirmChargesAccountInfo.baseScreen = param.baseScreen;
            dialogs.confirmChargesAccountInfo.$confirmChargesDialogDiv.dialog({
                modal: true,
                dialogClass: 'fixedpos',
                autoOpen: false,
                width: 1210,
                height: 600,
                resizable: false,
                position: "center",
            });
            return false;
        },
        open: function (param) {

            dialogs.confirmChargesAccountInfo.loadData(param.data, param.billType, param.showPType);

        },
        loadData: function (accountdata, billType, showPType) {

//    	 $.get('common/templates/account_details.html?1123', function (data) {
//             $("#account_details_table").html($.nano(data, jQuery.extend(true, {}, accountdata, globalvars.localResourceMap)));
//         });

            $.get('common/templates/account_details.html?1123', function (data) {
                var selRowData = accountdata;
                if (!showPType)
                    selRowData.patTypeWithDescription = selRowData.patSubTypeWithDescription

                $("#account_details_table").html($.nano(data, jQuery.extend(true, {}, selRowData, globalvars.localResourceMap)));
            });

            globalvars.confirmSelHosp = {hospitalId: accountdata.hospitalId, shortName: accountdata.shortName};
            //console.log(accountdata.toSource());

            $("#account_details_back_wrapper .account_detail_back_text").text(globalvars.localResourceMap.account_details_coid + " " + accountdata.shortName + ":");
            $("#account_details_back_wrapper .account_detail_back_account").text(globalvars.localResourceMap.account_details_acct + " " + accountdata.accountId);
            $('#associate_rule_wrapper').hide();
            $('.account_details_associate_rules_wrapper').hide();

            if (globalvars.root.enableRule == true) {
                $.when(
                        $.ajax({
                            type: 'GET',
                            url: ((billType == "PRE") ? globalvars.confirmCharges.assocRulesUriPreBill : globalvars.confirmCharges.assocRulesUriPostBill) + "&isSubmitted=true&isConfirm=true",
                            traditional: true,
                            dataType: 'json'
                        })
                        ).done(function (data8) {

                    globalvars["associationRules"] = data8;

                    if (globalvars.root.enableRule == false) {
                        $('#associate_rule_wrapper').hide();
                        $('.account_details_associate_rules_wrapper').hide();
                    } else if (billType == "POST") {
                        $('#associate_rule_wrapper').hide();
                        $('.account_details_associate_rules_wrapper').hide();
                    } else if ((billType == "PRE" && globalvars.associationRules.length == 0)) {
                        $('#associate_rule_wrapper').hide();
                        $('.account_details_associate_rules_wrapper').hide();
                    } else {
                        $('#associate_rule_wrapper').show();
                        $('.account_details_associate_rules_wrapper').show();
                    }



                    console.log(globalvars.associationRules)

                    grids.associationRulesGrid.initialize({
                        data: globalvars.associationRules,
                        gridDiv: "#account_details_associate_rules_grid_table",
                        isEditable: false
                                //screenName: (screenName == "preBill")?"PRE":"POST"
                    });
                    $("img.searchAssociateCodeImage").hide();


                });

            }





















            $.when(
                    $.ajax({
                        type: 'GET',
                        url: accountdata.uriDiagnoses,
                        traditional: true,
                        dataType: 'json'
                    }),
                    $.ajax({
                        type: 'GET',
                        url: accountdata.uriProcedures,
                        traditional: true,
                        dataType: 'json'
                    }),
                    $.ajax({
                        type: 'GET',
                        url: accountdata.uriHcpcs,
                        traditional: true,
                        dataType: 'json'
                    }),
                    $.ajax({
                        type: 'GET',
                        url: ((billType == "PRE") ? globalvars.confirmCharges.existingChargesUriPreBill : globalvars.confirmCharges.existingChargesUriPostBill) + "&isSubmitted=true&isConfirm=true",
                        traditional: true,
                        dataType: 'json'
                    }),
                    $.ajax({
                        type: 'GET',
                        url: ((billType == "PRE") ? globalvars.confirmCharges.possiblyMissingChargesUriPreBill : globalvars.confirmCharges.possiblyMissingChargesUriPostBill) + "&isSubmitted=true&isConfirm=true",
                        traditional: true,
                        dataType: 'json'
                    }),
                    $.ajax({
                        type: 'GET',
                        url: ((billType == "PRE") ? globalvars.confirmCharges.otherDiscoveredChargesUriPreBill : globalvars.confirmCharges.otherDiscoveredChargesUriPostBill) + "&isSubmitted=true&isConfirm=true",
                        traditional: true,
                        dataType: 'json'
                    })

                    ).done(function (data1, data2, data3, data4, data5, data6) {
                globalvars["diagnoses"] = data1[0];
                globalvars["procedures"] = data2[0];
                globalvars["hcpcs"] = data3[0];

                globalvars["existingCharges"] = data4[0];
                globalvars["missingCharges"] = data5[0];
                globalvars["otherCharges"] = data6[0];

                console.log("billType:::" + billType);





                grids.existingChargesGrid.initialize({
                    data: globalvars.existingCharges,
                    gridDiv: "#confirm_charge_existing_charges_grid_table",
                    isEditable: false,
                    isConfirmCharg: true
                });

                grids.missingChargesGrid.initialize({
                    data: globalvars.missingCharges,
                    gridDiv: "#confirm_charge_missing_charges_grid_table",
                    isEditable: false,
                    isHidden: true,
                    isConfirmCharg: true,
                    screenName: "Confirm"
                            //screenName: (screenName == "preBill")?"PRE":"POST"
                });



                grids.otherChargesGrid.initialize({
                    data: globalvars.otherCharges,
                    gridDiv: "#account_details_other_charges_grid_table",
                    isEditable: false,
                    isConfirmCharg: true
                            //screenName: (screenName == "preBill")?"PRE":"POST"
                });






                $.get('common/templates/diagnoses.html', function (data) {
                    $("#account_details_diagnoses_table").empty();
                    var tempHtml = "";
                    $(globalvars.diagnoses).each(function (i) {
                        tempHtml += $.nano(data, globalvars.diagnoses[i]);
                    });
                    $("#account_details_diagnoses_table").append(tempHtml);
                });

                $.get('common/templates/procedures.html', function (data) {
                    $("#account_details_procedures_table").empty();
                    var tempHtml = "";
                    $(globalvars.procedures).each(function (i) {
                        tempHtml += $.nano(data, globalvars.procedures[i]);
                    });
                    $("#account_details_procedures_table").append(tempHtml);
                });

                $.get('common/templates/hcpcs.html', function (data) {
                    $("#account_details_hcpcs_table").empty();
                    var tempHtml = "";
                    $(globalvars.hcpcs).each(function (i) {
                        tempHtml += $.nano(data, globalvars.hcpcs[i]);
                    });
                    $("#account_details_hcpcs_table").append(tempHtml);
                });



                dialogs.confirmChargesAccountInfo.$confirmChargesDialogDiv.dialog('option', 'title', param.title);

                dialogs.confirmChargesAccountInfo.$confirmChargesDialogDiv.dialog('open');
                dialogs.confirmChargesAccountInfo.$confirmChargesDialogDiv.dialog("option", "position", 'center');

                $("img.search_cell_search").hide();
                $("img.search_cell_del").hide();





                if (globalvars.missingCharges.length == 0) {
                    $('#missing_charge_wrapper').hide();
                    $('#account_details_missing_charges_grid').hide();
                } else {
                    $('#missing_charge_wrapper').show();
                    $('#account_details_missing_charges_grid').show();
                }

            })

        }

    },
    confirmChargesAccountInfoPhysician: {
        $confirmChargesDialogDiv: {},
        localDiagnoses: [],
        initialize: function (param) {
            log("initializing submit");
            this.$confirmChargesDialogDiv = param.$confirmChargesDialogDiv;
            this.baseScreen = param.baseScreen;
            this.$confirmChargesDialogDiv.dialog({
                modal: true,
                dialogClass:'fixedpos',
                autoOpen: false,
                width: 1210,
                height: $(window).height() - 10,
                resizable: false,
                position: "center",
                });
            return false;
        },
        open: function (param) {


            dialogs.confirmChargesAccountInfoPhysician.loadData(param.data, param.billType, param.showPType);
            this.$confirmChargesDialogDiv.dialog('option', 'title', param.title);

            this.$confirmChargesDialogDiv.dialog('open');
            this.$confirmChargesDialogDiv.dialog("option", "position", 'center');
            $("img.searchAssociateCodeImage").hide();
            $("img.search_cell_search").hide();
            $("img.search_cell_del").hide();
            pqgridPhysician.existingHospitalChargesGrid.$gridDiv.pqGrid('refresh' );


        },
        loadData: function (accountdata, billType, showPType) {



            
            getJSONModel({
                async: false,
                url: globalvars.confirmChargesPhysician.uriExistingCharges,
                targetVar: "physicianExistingCharges"
            });

            getJSONModel({
                async: false,
                url: globalvars.confirmChargesPhysician.uriExistingPhysicianCharges,
                targetVar: "physicianExistingPhysicianCharges"
            });

            getJSONModel({
                async: false,
                url: globalvars.confirmChargesPhysician.uriMissingPhysicianCharges,
                targetVar: "physicianMissingPhysicianCharges"
            });

            getJSONModel({
                async: false,
                url: globalvars.confirmChargesPhysician.uriOtherDiscoverCharges,
                targetVar: "physicianOtherDiscoverCharges"
            });


            getJSONModel({
                async: false,
                url: globalvars.confirmChargesPhysician.uriPhysicianAccountDetail,
                targetVar: "physician"
            });

            getJSONModel({
                async: false,
                url: globalvars.confirmChargesPhysician.uriPhysicianAccountStatsPanel,
                targetVar: "physicianAccountStatsPanel"
            });

            getJSONModel({
                async: false,
                url: globalvars.confirmChargesPhysician.uriDiagnoses,
                targetVar: "diagnoses"
            });

            getJSONModel({
                async: false,
                url: globalvars.confirmChargesPhysician.uriProcedures,
                targetVar: "procedures"
            });

            getJSONModel({
                async: false,
                url: globalvars.confirmChargesPhysician.uriHcpcs,
                targetVar: "hcpcs"
            });

             

            $.get('common/templates/physician_details.html', function (data) {
                $("#confirm_charge_account_info_physician #account_details_physician_table").empty();
                var tempHtml = "";
                $(globalvars.physician).each(function (i) {
                    tempHtml += $.nano(data, globalvars.physician[i]);
                });
                $("#confirm_charge_account_info_physician #account_details_physician_table").append(tempHtml);
                $('[data-log="true"]').css('color','#0000FF');
                $('.account_details_code').tooltip();
                $('.account_details_code_value').tooltip();
            });

            // gridPhysician.existingHospitalChargesGrid.initialize({
            //     data: (globalvars.physicianExistingCharges != null) ? globalvars.physicianExistingCharges : [],
            //     gridDiv: "#confirm_charge_account_info_physician #account_details_hospital_charges_grid_table",
            //     isEditable: false
            // });

             $("#confirm_charge_account_info_physician #account_details_hospital_charges_grid").empty();
             $("#confirm_charge_account_info_physician #account_details_hospital_charges_grid").append('<div id="account_details_hospital_charges_grid_table"></div>');


            pqgridPhysician.existingHospitalChargesGrid.initialize({
                data: (globalvars.physicianExistingCharges!= null)?globalvars.physicianExistingCharges:[],
                gridDiv: "#account_details_hospital_charges_grid_table",
                isEditable: false
            });

            gridPhysician.existingPhysicianChargesGrid.initialize({
                data: (globalvars.physicianExistingPhysicianCharges != null) ? globalvars.physicianExistingPhysicianCharges : [],
                gridDiv: "#confirm_charge_account_info_physician #account_details_existing_charges_grid_table",
                isEditable: false
            });


            gridPhysician.missingPhysicianChargesGrid.initialize({
                data: (globalvars.physicianMissingPhysicianCharges != null) ? globalvars.physicianMissingPhysicianCharges : [],
                gridDiv: "#confirm_charge_account_info_physician #account_details_missing_charges_grid_table",
                isEditable: false,
                isHidden: false
            });


            gridPhysician.otherPhysicianChargesGrid.initialize({
                data: (globalvars.physicianOtherDiscoverCharges != null) ? globalvars.physicianOtherDiscoverCharges : [],
                gridDiv: "#confirm_charge_account_info_physician #account_details_Physician_other_charges_grid_table",
                isEditable: false,
                isConfirm: true
            });

            $.get('common/templates/diagnoses.html', function (data) {
            $("#confirm_charge_account_info_physician #account_details_diagnoses_table").empty();
            var tempHtml = "";
            $(globalvars.diagnoses).each(function (i) {
                tempHtml += $.nano(data, globalvars.diagnoses[i]);
            });
                $("#confirm_charge_account_info_physician #account_details_diagnoses_table").append(tempHtml);
            });

        $.get('common/templates/procedures.html', function (data) {
            $("#confirm_charge_account_info_physician #account_details_procedures_table").empty();
            var tempHtml = "";
            $(globalvars.procedures).each(function (i) {
                tempHtml += $.nano(data, globalvars.procedures[i]);
            });
            $("#confirm_charge_account_info_physician #account_details_procedures_table").append(tempHtml);
        });

        $.get('common/templates/hcpcs.html', function (data) {
            $("#confirm_charge_account_info_physician #account_details_hcpcs_table").empty();
            var tempHtml = "";
            $(globalvars.hcpcs).each(function (i) {
                tempHtml += $.nano(data, globalvars.hcpcs[i]);
            });
            $("#confirm_charge_account_info_physician #account_details_hcpcs_table").append(tempHtml);
        });


        // $.get('common/templates/physician_account_details.html?1123', function (data) {
        //         var selRowData = accountdata;
        //         $("#account_details_table_physician").html($.nano(data, jQuery.extend(true, {}, selRowData, globalvars.localResourceMap)));
        //     });

        $.get('common/templates/physician_account_details.html?1123', function (data) {
            var selRowData = accountdata
            selRowData.hospShortName = selRowData.shortName;//globalvars.physicianHospitals[globalvars.selectedPreHospitalIndex].shortName;
            selRowData.shortName = selRowData.shortName;//globalvars.physicianHospitals[globalvars.selectedPreHospitalIndex].shortName;
            selRowData.chartdata = globalvars.physicianAccountStatsPanel[0];
            $("#confirm_charge_account_info_physician #account_details_table").html($.nano(data, jQuery.extend(true, {}, selRowData, globalvars.localResourceMap)));
            $('.accountHeader').tooltip();
        })


        $('#confirm_charge_account_info_physician #demo1').niceScroll({cursorwidth: '7px', autohidemode: true, zindex: 999,cursorcolor:'#E4E4E4',hidecursordelay:200 });
         $('#confirm_charge_account_info_physician #demo2').niceScroll({cursorwidth: '7px', autohidemode: true, zindex: 999,cursorcolor:'#E4E4E4',hidecursordelay:200 });
         $('#confirm_charge_account_info_physician #demo3').niceScroll({cursorwidth: '7px', autohidemode: true, zindex: 999,cursorcolor:'#E4E4E4',hidecursordelay:200 });
         $('#confirm_charge_account_info_physician #demo4').niceScroll({cursorwidth: '7px', autohidemode: true, zindex: 999,cursorcolor:'#E4E4E4',hidecursordelay:200 });
         $('#confirm_charge_account_info_physician #demo5').niceScroll({cursorwidth: '7px', autohidemode: true, zindex: 999,cursorcolor:'#E4E4E4',hidecursordelay:200 });



         $("#confirm_charge_account_info_physician #demo1").mouseover(function() {
          $("#confirm_charge_account_info_physician #demo1").getNiceScroll().resize();
        });

         $("#confirm_charge_account_info_physician #demo2").mouseover(function() {
          $("#confirm_charge_account_info_physician #demo2").getNiceScroll().resize();
        });

         $("#confirm_charge_account_info_physician #demo3").mouseover(function() {
          $("#confirm_charge_account_info_physician #demo3").getNiceScroll().resize();
        });

         $("#confirm_charge_account_info_physician #demo4").mouseover(function() {
          $("#confirm_charge_account_info_physician #demo4").getNiceScroll().resize();
        });

         $("#confirm_charge_account_info_physician #demo5").mouseover(function() {
          $("#confirm_charge_account_info_physician #demo5").getNiceScroll().resize();
        });


        pqgridPhysician.existingHospitalChargesGrid.$gridDiv.pqGrid('refresh' );


      }


    },
    physicianSubmitAccountDetailsDialog: {
        $physicianSubmitAccountDetailsDialogDiv: {},
        url: "",
        type: "",
        title: "",
        message: "",
        detailId: "",
        screen: "",
        baseScreen: "",
        initialize: function (param) {
            log("initializing submit");
            this.$physicianSubmitAccountDetailsDialogDiv = param.$physicianSubmitAccountDetailsDialogDiv;
            this.baseScreen = param.baseScreen;
            this.$physicianSubmitAccountDetailsDialogDiv.dialog({
                modal: true,
                autoOpen: false,
                width: 500,
                resizable: false,
                position: {my: "center", at: "top", of: window},
                buttons: [{
                        text: globalvars.localResourceMap.account_details_dialog_yes1,
                        click: function () {
                            log('Yes - Account List');
                            roles.physicianUser.sendAccountDetails({
                                url: dialogs.physicianSubmitAccountDetailsDialog.url,
                                type: dialogs.physicianSubmitAccountDetailsDialog.type,
                                callback: function () {
                                    dialogs.physicianSubmitAccountDetailsDialog.$physicianSubmitAccountDetailsDialogDiv.dialog("close");
                                    //screens.this.baseScreen.closeAccountDetails();
                                    window["screens"][dialogs.physicianSubmitAccountDetailsDialog.baseScreen]["closeAccountDetails"]();
                                }
                            });


                        }
                    }, {
                        text: globalvars.localResourceMap.account_details_dialog_yes2,
                        click: function () {
                            log('Yes - Next Account');
                            roles.physicianUser.sendAccountDetails({
                                url: dialogs.physicianSubmitAccountDetailsDialog.url,
                                type: dialogs.physicianSubmitAccountDetailsDialog.type,
                                callback: function () {
                                    dialogs.physicianSubmitAccountDetailsDialog.$physicianSubmitAccountDetailsDialogDiv.dialog("close");
                                    window["screens"][dialogs.physicianSubmitAccountDetailsDialog.baseScreen]["loadNext"]();
                                }
                            });

                        }
                    }, {
                        text: globalvars.localResourceMap.account_details_dialog_no,
                        click: function () {
                            log('No');
                            $(this).dialog("close");
                        }
                    }]
            });
            return false;
        },
        open: function (param) {
            log('open submit dialog ' + this.$physicianSubmitAccountDetailsDialogDiv + "ID: " + param.detailId);

            this.url = param.url;
            this.type = param.type;
            this.title = param.title;
            this.message = param.message;
            this.detailId = parseInt(param.detailId, 10);
            this.screen = param.screen;
            this.baseScreen = param.baseScreen;
            this.$physicianSubmitAccountDetailsDialogDiv.dialog('option', 'title', dialogs.physicianSubmitAccountDetailsDialog.title);
            this.$physicianSubmitAccountDetailsDialogDiv.children("p").html(dialogs.physicianSubmitAccountDetailsDialog.message);
            this.$physicianSubmitAccountDetailsDialogDiv.dialog('open');
        }



    },

    otherPhysicianMissingDiagDialog: {
        $searchFormDialogDiv: {},
        selected_items:[],
        billType: "",
        screenName:"missing",
        initialize: function (param) {
            dialogs.otherPhysicianMissingDiagDialog.screenName = param.screenName;
            this.$searchFormDialogDiv = param.$searchFormDialogDiv;
            this.$searchFormDialogDiv.attr('title', 'Other Diagnoses codes');
            param.$searchFormDialogDivSubmit.unbind();
            dialogs.otherPhysicianMissingDiagDialog.buttons(param);
            this.$searchFormDialogDiv.dialog({
                modal: true,
                autoOpen: false,
                width: 650,
                height:500,
                resizable: false,
                position: {my: "center", at: "top", of: window}
            });
            return false;
        },
        buttons: function (param) {
            dialogs.otherPhysicianMissingDiagDialog.billType = param.billType;
            param.$searchFormDialogDivSubmit.click(function () {
                log('Other Charges Search Form Submit Physician');
                $("#account_details_missing_diag_physician_grid_search_form_table").jqGrid('clearGridData');
                dialogs.otherPhysicianMissingDiagDialog.loadChargeData();
            });

            param.$searchFormDialogDivReset.click(function () {
                dialogs.otherPhysicianMissingDiagDialog.reset();
            });

            param.$searchFormDialogDivCancel.click(function () {
                dialogs.otherPhysicianMissingDiagDialog.reset();
                param.$searchFormDialogDiv.dialog('close');
                $('#diag_holder').empty();
            });

            param.$searchFormDialogDivAddCodes.click(function () {
                dialogs.otherPhysicianMissingDiagDialog.reset();
                $('#diag_holder').empty();
                param.$searchFormDialogDiv.dialog('close');
                var newData=[];
                if(dialogs.otherPhysicianMissingDiagDialog.selected_items.length > 0){

                    if(dialogs.otherPhysicianMissingDiagDialog.screenName == "missing"){
                        gridPhysician.missingPhysicianChargesGrid.$gridDiv.jqGrid('saveRow', gridPhysician.missingPhysicianChargesGrid.selectedRow);
                        var selectedRowData = gridPhysician.missingPhysicianChargesGrid.$gridDiv.jqGrid('getRowData', gridPhysician.missingPhysicianChargesGrid.selectedRow);
                        var objectKey = "missingData" + "_" +selectedRowData.predKey + "_diag"
                        newData = globalvars.missingDropDownData[objectKey];
                        
                        if(newData)
                            newData = newData.concat(dialogs.otherPhysicianMissingDiagDialog.selected_items)
                        else
                            newData = dialogs.otherPhysicianMissingDiagDialog.selected_items;

                        newData = newData.unique();
                        globalvars.missingDropDownData[objectKey] = newData;
                        
                        var selPopupDiagCodes = dialogs.otherPhysicianMissingDiagDialog.selected_items.join(',');
                        var rowDiagCode;
                        if($.trim(selectedRowData.accountSelectedDiag.length) > 0){
                            rowDiagCode = (selectedRowData.accountSelectedDiag != " ")? $.trim(selectedRowData.accountSelectedDiag) + "," + selPopupDiagCodes : selPopupDiagCodes;
                        }
                        else
                            rowDiagCode = selPopupDiagCodes;
                        
                        rowDiagCode = rowDiagCode.split(',').unique().join(',');
                        selectedRowData.diag =  rowDiagCode                    
                        selectedRowData.accountSelectedDiag = rowDiagCode;
                        gridPhysician.missingPhysicianChargesGrid.$gridDiv.jqGrid('setRowData', gridPhysician.missingPhysicianChargesGrid.selectedRow, selectedRowData);
                        gridPhysician.missingPhysicianChargesGrid.savedSuccessfully = true;
                }else{

                        gridPhysician.otherPhysicianChargesGrid.$gridDiv.jqGrid('saveRow', gridPhysician.otherPhysicianChargesGrid.selectedRow);
                        var selectedRowData = gridPhysician.otherPhysicianChargesGrid.$gridDiv.jqGrid('getRowData', gridPhysician.otherPhysicianChargesGrid.selectedRow);
                        //var objectKey = "missingData" + "_" +selectedRowData.predKey + "_diag"
                        var objectKey = "otherData" + "_" +selectedRowData.hcpcCode + "_" + selectedRowData.id + "_diag";
                        newData = globalvars.otherDropDownData[objectKey];
                        
                        if(newData)
                        newData = newData.concat(dialogs.otherPhysicianMissingDiagDialog.selected_items)
                        else
                        newData =   dialogs.otherPhysicianMissingDiagDialog.selected_items;

                        newData = newData.unique();
                        globalvars.otherDropDownData[objectKey] = newData;
                        
                        var selPopupDiagCodes = dialogs.otherPhysicianMissingDiagDialog.selected_items.join(',');
                        var rowDiagCode;

                        if($.trim(selectedRowData.accountSelectedDiagOther).length > 0)
                            rowDiagCode = (selectedRowData.accountSelectedDiagOther != " ")? $.trim(selectedRowData.accountSelectedDiagOther) + "," + selPopupDiagCodes : selPopupDiagCodes;

                        else
                            rowDiagCode = selPopupDiagCodes;
                        
                        rowDiagCode = rowDiagCode.split(',').unique().join(',');
                        selectedRowData.diag =  rowDiagCode                    
                        selectedRowData.accountSelectedDiagOther = rowDiagCode;
                        gridPhysician.otherPhysicianChargesGrid.$gridDiv.jqGrid('setRowData', gridPhysician.otherPhysicianChargesGrid.selectedRow, selectedRowData);
                        gridPhysician.otherPhysicianChargesGrid.savedSuccessfully = true;
                }
                }
            });

            this.$searchFormDialogDiv.keypress(function (event) {
                if (event.which == 13) {
                    event.preventDefault();
                    dialogs.otherPhysicianMissingDiagDialog.loadChargeData();
                }
            });

        },
        reset: function () {
            $("#account_details_missing_diag_physician_grid_search_form_table").jqGrid('clearGridData');
            $("#missing_diag_grid_physician_search_form")[0].reset();
        },
        open: function (param) {
            log('open dialog');
            dialogs.otherPhysicianMissingDiagDialog.selected_items=[];
            $('#diag_holder').empty();
            $('#diag_holder_label_diag').hide();
            dialogs.otherPhysicianMissingDiagDialog.$searchFormDialogDiv.dialog('open');
        },
        close: function () {
            dialogs.otherPhysicianMissingDiagDialog.reset();
            dialogs.otherPhysicianMissingDiagDialog.selected_items=[];
            $('#diag_holder').empty();
            $('#diag_holder_label_diag').hide();
            dialogs.otherPhysicianMissingDiagDialog.$searchFormDialogDiv.dialog('close');
            dialogs.otherPhysicianMissingDiagDialog.$searchFormDialogDiv.dialog('destroy');
            //$(this).remove();
        },
        loadChargeData: function () {

            console.log('Inside missing diag Physician.........................');
            var hospitalIdValue;
            //if(dialogs.otherPhysicianChargesSearchFormDialog.billType == 'PRE')
            hospitalIdValue = globalvars.selectedHospitalId;//globalvars.physicianHospitals[globalvars.selectedPreHospitalIndex].hospitalId;

            $("#account_details_missing_diag_physician_grid_search_form_table").jqGrid('clearGridData');

            var searchQueryObject = {
                diagCodeType: $("#search_diag_code_type_physician").val(),
                diagCodeValue: $("#search_diag_code_value_physician").val(),
                descriptionType: $("#search_diag_desc_type_physician").val(),
                descriptionValue: $("#search_diag_desc_value_physician").val()
                
            };

            $.ajax({
                type: 'GET',
                url: globalvars.root.diagnosesUri,
                data: searchQueryObject,
                traditional: true,
                dataType: 'json',
                success: function (data) {
                    //var tempDiagData = [{"uri":"http://localhost:8080/phys-recon-web-ui/resources/diagnoses/2395","diagCode":"9999","description":"OTHER GU NEOPLASM NOS"},{"uri":"http://localhost:8080/phys-recon-web-ui/resources/diagnoses/4019","diagCode":"8888","description":"HYPERTENSION NOS"},{"uri":"http://localhost:8080/phys-recon-web-ui/resources/diagnoses/7226","diagCode":"7777","description":"DISC DEGENERATION NOS"},{"uri":"http://localhost:8080/phys-recon-web-ui/resources/diagnoses/591","diagCode":"6666","description":"HYDRONEPHROSIS"}]
                    globalvars["otherChargesSearchFormPhysicianDiag"] = data
                    var searchDiv = '<button class="other_discover_btn_add" type="button"><span class="button_text_add">ADD</span></button>';


                    if (globalvars.otherChargesSearchFormPhysicianDiag.length > 0) {

                        $('#missing_diag_grid_physician_search_form_add_Codes').show();
                       
                    } else {
                        $('#missing_diag_grid_physician_search_form_add_Codes').hide();
                        dialogs.messageDialog.show({text: globalvars.localResourceMap.associates_rule_charge_not_found_msg});
                    }

                    gridPhysician.loadMissingPhyDiagCodePopupGrid.initialize({
                            data: (globalvars.otherChargesSearchFormPhysicianDiag!= null)?globalvars.otherChargesSearchFormPhysicianDiag:[],
                            gridDiv: "#account_details_missing_diag_physician_grid_search_form_table"
                            
                    });

                   // dialogs.otherPhysicianMissingDiagDialog.selected_items;

                    $(document).on('click','.other_discover_btn_add',function(e) {
                      //$(this).prop('disabled',true);
                      log($(e.target).closest("tr.jqgrow").attr("id"));
                      var id=$(e.target).closest("tr.jqgrow").attr("id");
                      //var selRowData = gridPhysician.loadMissingPhyDiagCodePopupGrid.$gridDiv.jqGrid('getRowData', id);
                      var selRowData =  $("#account_details_missing_diag_physician_grid_search_form_table").jqGrid('getRowData', id);
                        if(dialogs.otherPhysicianMissingDiagDialog.selected_items.indexOf(selRowData.diagCode) < 0)
                        {
                          globalvars.appDiagData[selRowData.diagCode] = selRowData.description;
                          $('#diag_holder_label_diag').show();
                          var diag_tile = '<div class="img-wrap"><span class="close">&times;</span><div style="width:auto;padding:4px"><label style="color:#000">' +selRowData.diagCode+ '</label></div></div>';
                            $('#diag_holder').append(diag_tile);
                            dialogs.otherPhysicianMissingDiagDialog.selected_items.push(selRowData.diagCode);
                        }

                    });

                    $(document).on('click','.img-wrap .close', function(e) {
                        var remove_item = $(this).parent().find('label').text();
                        dialogs.otherPhysicianMissingDiagDialog.selected_items.splice($.inArray(remove_item, dialogs.otherPhysicianMissingDiagDialog.selected_items),1);
                        $(this).parent().remove();
                        if(dialogs.otherPhysicianMissingDiagDialog.selected_items.length == 0)
                            $('#diag_holder_label_diag').hide();
                    });

                }
            })

        }
    },

    otherPhysicianMissingModDialog: {
        $searchFormDialogDiv: {},
        selected_items:[],
        billType: "",
        screenName:"missing",
        initialize: function (param) {
            this.screenName = param.screenName;
            this.$searchFormDialogDiv = param.$searchFormDialogDiv;
            this.$searchFormDialogDiv.attr('title', 'Other Modifier codes');
            param.$searchFormDialogDivSubmit.unbind();
            dialogs.otherPhysicianMissingModDialog.buttons(param);
            this.$searchFormDialogDiv.dialog({
                modal: true,
                autoOpen: false,
                width: 650,
                height:500,
                resizable: false,
                position: {my: "center", at: "top", of: window}
            });
            return false;
        },
        buttons: function (param) {
            dialogs.otherPhysicianMissingModDialog.billType = param.billType;
            param.$searchFormDialogDivSubmit.click(function () {
                log('Other Charges Search Form Submit Physician');
                $("#account_details_missing_mod_physician_grid_search_form_table").jqGrid('clearGridData');
                dialogs.otherPhysicianMissingModDialog.loadChargeData();
            });

            param.$searchFormDialogDivReset.click(function () {
                dialogs.otherPhysicianMissingModDialog.reset();
            });

            param.$searchFormDialogDivCancel.click(function () {
                dialogs.otherPhysicianMissingModDialog.reset();
                param.$searchFormDialogDiv.dialog('close');
                $('#diag_holder_Mod').empty();
            });

            param.$searchFormDialogDivAddCodes.click(function () {
                dialogs.otherPhysicianMissingModDialog.reset();
                $('#diag_holder_Mod').empty();
                param.$searchFormDialogDiv.dialog('close');
                
                if(dialogs.otherPhysicianMissingModDialog.selected_items.length > 0){
                    
                    if(dialogs.otherPhysicianMissingModDialog.screenName == "missing"){

                        gridPhysician.missingPhysicianChargesGrid.$gridDiv.jqGrid('saveRow', gridPhysician.missingPhysicianChargesGrid.selectedRow);
                        var selectedRowData = gridPhysician.missingPhysicianChargesGrid.$gridDiv.jqGrid('getRowData', gridPhysician.missingPhysicianChargesGrid.selectedRow);

                        var objectKey = "missingData" + "_" + selectedRowData.hcpcCode + "_" +selectedRowData.predKey + "_mod";
                        var data  = globalvars.missingDropDownData[objectKey];
                        data = data.concat(dialogs.otherPhysicianMissingModDialog.selected_items)
                        data = data.unique();
                        globalvars.missingDropDownData[objectKey] = data;

                 
                        var selPopupModCodes = dialogs.otherPhysicianMissingModDialog.selected_items.join(',');
                        var rowDiagCode;

                        if($.trim(selectedRowData.preBillSelectedAuditor).length > 0)
                            rowDiagCode = (selectedRowData.preBillSelectedAuditor != " ")? $.trim(selectedRowData.preBillSelectedAuditor) + "," + selPopupModCodes : selPopupModCodes;

                        else
                            rowDiagCode = selPopupModCodes;

                        rowDiagCode = rowDiagCode.split(',').unique().join(',');
                        selectedRowData.modifier =  rowDiagCode                    
                        selectedRowData.preBillSelectedAuditor = rowDiagCode;
                        gridPhysician.missingPhysicianChargesGrid.$gridDiv.jqGrid('setRowData', gridPhysician.missingPhysicianChargesGrid.selectedRow, selectedRowData);
                        gridPhysician.missingPhysicianChargesGrid.savedSuccessfully = true;
                }else{

                        gridPhysician.otherPhysicianChargesGrid.$gridDiv.jqGrid('saveRow', gridPhysician.otherPhysicianChargesGrid.selectedRow);
                        var selectedRowData = gridPhysician.otherPhysicianChargesGrid.$gridDiv.jqGrid('getRowData', gridPhysician.otherPhysicianChargesGrid.selectedRow);

                        var objectKey = "otherData" + "_" + selectedRowData.hcpcCode + "_" + selectedRowData.id + "_mod";
                        var data  = globalvars.otherDropDownData[objectKey];
                        if(data)
                            data = data.concat(dialogs.otherPhysicianMissingModDialog.selected_items)
                        else
                            data = dialogs.otherPhysicianMissingModDialog.selected_items;

                        data = data.unique();
                        globalvars.otherDropDownData[objectKey] = data;

                 
                        var selPopupModCodes = dialogs.otherPhysicianMissingModDialog.selected_items.join(',');
                        var rowDiagCode;

                        if($.trim(selectedRowData.preBillSelectedAuditorOther).length > 0)
                            rowDiagCode = (selectedRowData.preBillSelectedAuditorOther != " ")? $.trim(selectedRowData.preBillSelectedAuditorOther) + "," + selPopupModCodes : selPopupModCodes;

                        else
                            rowDiagCode = selPopupModCodes;

                        rowDiagCode = rowDiagCode.split(',').unique().join(',');
                        selectedRowData.modifier =  rowDiagCode                    
                        selectedRowData.preBillSelectedAuditorOther = rowDiagCode;
                        gridPhysician.otherPhysicianChargesGrid.$gridDiv.jqGrid('setRowData', gridPhysician.otherPhysicianChargesGrid.selectedRow, selectedRowData);
                        gridPhysician.otherPhysicianChargesGrid.savedSuccessfully = true;
                    }
                }
            });

            this.$searchFormDialogDiv.keypress(function (event) {
                if (event.which == 13) {
                    event.preventDefault();
                    dialogs.otherPhysicianMissingModDialog.loadChargeData();
                }
            });

        },
        reset: function () {
            $("#account_details_missing_mod_physician_grid_search_form_table").jqGrid('clearGridData');
            $("#missing_mod_grid_physician_search_form")[0].reset();
        },
        open: function (param) {
            log('open dialog');
            dialogs.otherPhysicianMissingModDialog.selected_items=[];
            $('#diag_holder_Mod').empty();
            $('#diag_holder_label_mod').hide();
            dialogs.otherPhysicianMissingModDialog.$searchFormDialogDiv.dialog('open');
        },
        close: function () {
            dialogs.otherPhysicianMissingModDialog.reset();
            dialogs.otherPhysicianMissingModDialog.selected_items=[];
            $('#diag_holder_Mod').empty();
            $('#diag_holder_label_mod').hide();
            dialogs.otherPhysicianMissingModDialog.$searchFormDialogDiv.dialog('close');
            dialogs.otherPhysicianMissingModDialog.$searchFormDialogDiv.dialog('destroy');
            //$(this).remove();
        },
        loadChargeData: function () {

            console.log('Inside missing diag Physician.........................');
            var hospitalIdValue;
            //if(dialogs.otherPhysicianChargesSearchFormDialog.billType == 'PRE')
            hospitalIdValue = globalvars.selectedHospitalId;//globalvars.physicianHospitals[globalvars.selectedPreHospitalIndex].hospitalId;

            $("#account_details_missing_mod_physician_grid_search_form_table").jqGrid('clearGridData');

            var searchQueryObject = {
                modifierType: $("#search_mod_code_type_physician").val(),
                modifierValue: $("#search_mod_code_value_physician").val(),
                descriptionType: $("#search_mod_desc_type_physician").val(),
                descriptionValue: $("#search_mod_desc_value_physician").val()
                
            };

            $.ajax({
                type: 'GET',
                url: globalvars.root.modifierUri,
                data: searchQueryObject,
                traditional: true,
                dataType: 'json',
                success: function (data) {
                    //var tempDiagData = [{"uri":"http://localhost:8080/phys-recon-web-ui/resources/diagnoses/2395","diagCode":"9999","description":"OTHER GU NEOPLASM NOS"},{"uri":"http://localhost:8080/phys-recon-web-ui/resources/diagnoses/4019","diagCode":"8888","description":"HYPERTENSION NOS"},{"uri":"http://localhost:8080/phys-recon-web-ui/resources/diagnoses/7226","diagCode":"7777","description":"DISC DEGENERATION NOS"},{"uri":"http://localhost:8080/phys-recon-web-ui/resources/diagnoses/591","diagCode":"6666","description":"HYDRONEPHROSIS"}]
                    globalvars["otherChargesSearchFormPhysicianMod"] = data;
                   // var searchDiv = '<button class="other_discover_btn_mod_add" type="button"><span class="button_text_add">ADD</span></button>';


                    if (globalvars.otherChargesSearchFormPhysicianMod.length > 0) {
                        $('#missing_mod_grid_physician_search_form_add_Codes').show();

                    } else {

                        $('#missing_mod_grid_physician_search_form_add_Codes').show();
                        dialogs.messageDialog.show({text: globalvars.localResourceMap.associates_rule_charge_not_found_msg});
                    }

                    gridPhysician.loadMissingPhyModCodePopupGrid.initialize({
                            data: (globalvars.otherChargesSearchFormPhysicianMod!= null)?globalvars.otherChargesSearchFormPhysicianMod:[],
                            gridDiv: "#account_details_missing_mod_physician_grid_search_form_table"
                            
                    });


                   // dialogs.otherPhysicianMissingDiagDialog.selected_items;

                    $(document).on('click','.other_discover_btn_mod_add', function(e) {
                      //$(this).prop('disabled',true);
                      log($(e.target).closest("tr.jqgrow").attr("id"));
                      var id=$(e.target).closest("tr.jqgrow").attr("id");
                      //var selRowData = gridPhysician.loadMissingPhyDiagCodePopupGrid.$gridDiv.jqGrid('getRowData', id);
                      var selRowData =  $("#account_details_missing_mod_physician_grid_search_form_table").jqGrid('getRowData', id);
                        if(dialogs.otherPhysicianMissingModDialog.selected_items.indexOf(selRowData.modifier) < 0)
                        {
                          $('#diag_holder_label_mod').show();
                          var diag_tile = '<div class="img-wrap"><span class="close">&times;</span><div style="width:auto;padding:4px"><label style="color:#000">' +selRowData.modifier+ '</label></div></div>';
                            $('#diag_holder_Mod').append(diag_tile);
                            dialogs.otherPhysicianMissingModDialog.selected_items.push(selRowData.modifier);
                            globalvars.appModData[selRowData.modifier] = selRowData.description;
                        }

                    });

                    $(document).on('click','.img-wrap .close', function(e) {
                        var remove_item = $(this).parent().find('label').text();
                        dialogs.otherPhysicianMissingModDialog.selected_items.splice($.inArray(remove_item, dialogs.otherPhysicianMissingModDialog.selected_items),1);
                        $(this).parent().remove();
                        if(dialogs.otherPhysicianMissingModDialog.selected_items.length == 0)
                            $('#diag_holder_label_mod').hide();
                    });

                }
            })

        }
    },
    otherPhysicianMissingNPIDialog: {
        $searchFormDialogDiv: {},
        selected_items:[],
        billType: "",
        screenName:"missing",
        initialize: function (param) {
            this.screenName = param.screenName;
            this.$searchFormDialogDiv = param.$searchFormDialogDiv;
            this.$searchFormDialogDiv.attr('title', 'Adding More Physician');
            param.$searchFormDialogDivSubmit.unbind();
            dialogs.otherPhysicianMissingNPIDialog.buttons(param);
            this.$searchFormDialogDiv.dialog({
                modal: true,
                autoOpen: false,
                width: 650,
                height:500,
                resizable: false,
                position: {my: "center", at: "top", of: window}
            });
            return false;
        },
        buttons: function (param) {
            dialogs.otherPhysicianMissingNPIDialog.billType = param.billType;
            param.$searchFormDialogDivSubmit.click(function () {
                log('Other Charges Search Form Submit Physician');
                $("#account_details_missing_npi_physician_grid_search_form_table").jqGrid('clearGridData');
                dialogs.otherPhysicianMissingNPIDialog.loadChargeData();
            });

            param.$searchFormDialogDivReset.click(function () {
                dialogs.otherPhysicianMissingNPIDialog.reset();
            });

            param.$searchFormDialogDivCancel.click(function () {
                dialogs.otherPhysicianMissingNPIDialog.reset();
                param.$searchFormDialogDiv.dialog('close');
            });

            this.$searchFormDialogDiv.keypress(function (event) {
                if (event.which == 13) {
                    event.preventDefault();
                    dialogs.otherPhysicianMissingNPIDialog.loadChargeData();
                }
            });

        },
        reset: function () {
            $("#account_details_missing_npi_physician_grid_search_form_table").jqGrid('clearGridData');
            $("#missing_npi_grid_physician_search_form")[0].reset();
        },
        open: function (param) {
            log('open dialog');
            dialogs.otherPhysicianMissingNPIDialog.$searchFormDialogDiv.dialog('open');
        },
        close: function () {
            dialogs.otherPhysicianMissingNPIDialog.reset();
            dialogs.otherPhysicianMissingNPIDialog.$searchFormDialogDiv.dialog('close');
            dialogs.otherPhysicianMissingNPIDialog.$searchFormDialogDiv.dialog('destroy');
            //$(this).remove();
        },
        loadChargeData: function () {

            console.log('Inside missing diag Physician.........................');
            var hospitalIdValue;
            //if(dialogs.otherPhysicianChargesSearchFormDialog.billType == 'PRE')
            hospitalIdValue = globalvars.selectedHospitalId;//globalvars.physicianHospitals[globalvars.selectedPreHospitalIndex].hospitalId;

            $("#account_details_missing_npi_physician_grid_search_form_table").jqGrid('clearGridData');

            var searchQueryObject = {
                hospitalIdValue: hospitalIdValue,
                hospitalIdType: "equals",
                npiType: $("div#missing_npi_grid_physician_search_form_dialog #search_npi_type_physician").val(),
                npiValue: $("div#missing_npi_grid_physician_search_form_dialog #search_npi_value_physician").val(),
                codeType: $("div#missing_npi_grid_physician_search_form_dialog #search_code_type_physician").val(),
                codeValue: $("div#missing_npi_grid_physician_search_form_dialog #search_code_value_physician").val(),
                nameType: $("div#missing_npi_grid_physician_search_form_dialog #search_name_type_physician").val(),
                nameValue: $("div#missing_npi_grid_physician_search_form_dialog #search_name_value_physician").val()
                
            };

            $.ajax({
                type: 'GET',
                url: globalvars.root.physicianNpiLookupUri,
                data: searchQueryObject,
                traditional: true,
                dataType: 'json',
                success: function (data) {

                    globalvars["otherChargesSearchFormPhysicianNPIData"] = data;
                    //globalvars["otherChargesSearchFormPhysicianNPI"] = [{"name":"Adam Luies","npi":"11111111","physicianType":"ADMITTING","code":"1602879","terminationDate":null,"startDate":null},{"name":"Albert Eistein","npi":"222222222","physicianType":"ADMITTING","code":"1602830","terminationDate":null,"startDate":null},{"name":"Foggy Ray","npi":"3333333333","physicianType":"PRIMARY_CARE","code":"1008065","terminationDate":null,"startDate":null},{"name":"Mickal Clarke","npi":"444444444","physicianType":"PRIMARY_CARE","code":"1000012","terminationDate":null,"startDate":null}]

                    if (globalvars.otherChargesSearchFormPhysicianNPIData.length > 0) {
                        // var datalength = globalvars.otherChargesSearchFormPhysicianNPI.length;
                        // for (var i = 0; i < datalength; i++) {
                        //     $("#account_details_missing_npi_physician_grid_search_form_table").jqGrid('addRowData', i + 1, globalvars.otherChargesSearchFormPhysicianNPI[i]);
                        // }
                    } else {
                        dialogs.messageDialog.show({text: globalvars.localResourceMap.physician_npi_not_found_msg});
                    }

                    gridPhysician.otherChargesSearchFormPhysicianNPI.initialize({
                            data: (globalvars.otherChargesSearchFormPhysicianNPIData!= null)?globalvars.otherChargesSearchFormPhysicianNPIData:[],
                            gridDiv: "#account_details_missing_npi_physician_grid_search_form_table"
                            
                    });

                   
                }
            })

        }
    },
    otherBillingPhysicianMissingNPIDialog: {
        $searchFormDialogDiv: {},
        selected_items:[],
        billType: "",
        screenName:"missing",
        initialize: function (param) {
            this.screenName = param.screenName;
            this.$searchFormDialogDiv = param.$searchFormDialogDiv;
            this.$searchFormDialogDiv.attr('title', 'Adding More Physician');
            param.$searchFormDialogDivSubmit.unbind();
            dialogs.otherBillingPhysicianMissingNPIDialog.buttons(param);
            this.$searchFormDialogDiv.dialog({
                modal: true,
                autoOpen: false,
                width: 650,
                height:500,
                resizable: false,
                position: {my: "center", at: "top", of: window}
            });
            return false;
        },
        buttons: function (param) {
            dialogs.otherBillingPhysicianMissingNPIDialog.billType = param.billType;
            param.$searchFormDialogDivSubmit.click(function () {
                log('Other Charges Search Form Submit Physician');
                $("#account_details_missing_bill_npi_physician_grid_search_form_table").jqGrid('clearGridData');
                dialogs.otherBillingPhysicianMissingNPIDialog.loadChargeData();
            });

            param.$searchFormDialogDivReset.click(function () {
                dialogs.otherBillingPhysicianMissingNPIDialog.reset();
            });

            param.$searchFormDialogDivCancel.click(function () {
                dialogs.otherBillingPhysicianMissingNPIDialog.reset();
                param.$searchFormDialogDiv.dialog('close');
            });

            this.$searchFormDialogDiv.keypress(function (event) {
                if (event.which == 13) {
                    event.preventDefault();
                    dialogs.otherBillingPhysicianMissingNPIDialog.loadChargeData();
                }
            });

        },
        reset: function () {
            $("#account_details_missing_bill_npi_physician_grid_search_form_table").jqGrid('clearGridData');
            $("#missing_bill_npi_grid_physician_search_form")[0].reset();
        },
        open: function (param) {
            log('open dialog');
            dialogs.otherBillingPhysicianMissingNPIDialog.$searchFormDialogDiv.dialog('open');
        },
        close: function () {
            dialogs.otherBillingPhysicianMissingNPIDialog.reset();
            dialogs.otherBillingPhysicianMissingNPIDialog.$searchFormDialogDiv.dialog('close');
            dialogs.otherBillingPhysicianMissingNPIDialog.$searchFormDialogDiv.dialog('destroy');
            //$(this).remove();
        },
        loadChargeData: function () {

            console.log('Inside missing diag Physician.........................');
            var hospitalIdValue;
            //if(dialogs.otherPhysicianChargesSearchFormDialog.billType == 'PRE')
            hospitalIdValue = globalvars.selectedHospitalId;//globalvars.physicianHospitals[globalvars.selectedPreHospitalIndex].hospitalId;

            $("#account_details_missing_bill_npi_physician_grid_search_form_table").jqGrid('clearGridData');

            var searchQueryObject = {
                hospitalIdValue: hospitalIdValue,
                hospitalIdType: "equals",
                npiType: $("div#missing_bill_npi_grid_physician_search_form_dialog #search_bill_npi_type_physician").val(),
                npiValue: $("div#missing_bill_npi_grid_physician_search_form_dialog #search_bill_npi_value_physician").val(),
                codeType: $("div#missing_bill_npi_grid_physician_search_form_dialog #search_bill_code_type_physician").val(),
                codeValue: $("div#missing_bill_npi_grid_physician_search_form_dialog #search_bill_code_value_physician").val(),
                nameType: $("div#missing_bill_npi_grid_physician_search_form_dialog #search_bill_name_type_physician").val(),
                nameValue: $("div#missing_bill_npi_grid_physician_search_form_dialog #search_bill_name_value_physician").val()
                
            };

            $.ajax({
                type: 'GET',
                url: globalvars.root.physicianNpiLookupUri,
                data: searchQueryObject,
                traditional: true,
                dataType: 'json',
                success: function (data) {

                    globalvars["otherChargesSearchFormPhysicianNPIData"] = data;

                    if (globalvars.otherChargesSearchFormPhysicianNPIData.length > 0) {
                     
                    } else {
                        dialogs.messageDialog.show({text: globalvars.localResourceMap.physician_npi_not_found_msg});
                    }

                    gridPhysician.otherChargesSearchFormPhysicianNPIBilling.initialize({
                            data: (globalvars.otherChargesSearchFormPhysicianNPIData!= null)?globalvars.otherChargesSearchFormPhysicianNPIData:[],
                            gridDiv: "#account_details_missing_bill_npi_physician_grid_search_form_table"
                            
                    });

                   
                }
            })

        }
    },

    globalSearchAccountInfo: {
        $globalSearchDialogDiv: {},
    
    initialize: function (param) {
        log("initializing submit");
        dialogs.globalSearchAccountInfo.$globalSearchDialogDiv = param.$globalSearchDialogDiv;
        dialogs.globalSearchAccountInfo.baseScreen = param.baseScreen;
        dialogs.globalSearchAccountInfo.$globalSearchDialogDiv.dialog({
            modal: true,
            dialogClass:'fixedpos',
            autoOpen: false,
            width: 1210,
            height: $(window).height() - 10,
            resizable: false,
            position: "center",

            
           
        });
        return false;
    },
    open: function (param) {
        
        dialogs.globalSearchAccountInfo.loadData(param.data,param.billType,param.showPType);
        
    },
    loadData:function(accountdata,billType,showPType){
 
         
         
        

         $.when(
            
                $.ajax({
                    type: 'GET',
                    url: globalvars.confirmChargesGlobal.uriDiagnoses,
                    traditional: true,
                    dataType: 'json'
                }),

                $.ajax({
                    type: 'GET',
                     url: globalvars.confirmChargesGlobal.uriProcedures,
                    traditional: true,
                    dataType: 'json'
                }),

                $.ajax({
                    type: 'GET',
                     url: globalvars.confirmChargesGlobal.uriHcpcs,
                    traditional: true,
                    dataType: 'json'
                }),

                $.ajax({
                    type: 'GET',
                    url: globalvars.confirmChargesGlobal.existingChargesUri,
                    traditional: true,
                    dataType: 'json'
                }),

                $.ajax({
                    type: 'GET',
                    url: globalvars.confirmChargesGlobal.possiblyMissingChargesUri,
                    traditional: true,
                    dataType: 'json'
                }),

                
                $.ajax({
                    type: 'GET',
                    url: globalvars.confirmChargesGlobal.otherDiscoveredChargesUri,
                    traditional: true,
                    dataType: 'json'
                }),
                $.ajax({
                    type: 'GET',
                    url: globalvars.confirmChargesGlobal.accountDetailUri,
                    traditional: true,
                    dataType: 'json'
                })

                

         ).done(function(data1, data2, data3, data4, data5,data6,data7){
            globalvars["global_diagnoses"] = data1[0];
            globalvars["global_procedures"] = data2[0];
            globalvars["global_hcpcs"] = data3[0];

            globalvars["global_existingCharges"] = data4[0];
            globalvars["global_missingCharges"] = data5[0];
            globalvars["global_otherCharges"] = data6[0];
            globalvars["global_accountDetailData"] = data7[0];

            
        //  console.log("billType:::" + billType);
            


            $.get('common/templates/diagnoses.html', function (data) {
                 $("#global_search_account_info #account_details_diagnoses_table").empty();
                var tempHtml = "";
                $(globalvars.global_diagnoses).each(function (i) {
                    tempHtml += $.nano(data, globalvars.global_diagnoses[i]);
                });
                $("#global_search_account_info #account_details_diagnoses_table").append(tempHtml);
            });

            $.get('common/templates/procedures.html', function (data) {
                $("#global_search_account_info #account_details_procedures_table").empty();
                var tempHtml = "";
                $(globalvars.global_procedures).each(function (i) {
                    tempHtml += $.nano(data, globalvars.global_procedures[i]);
                });
                $("#global_search_account_info #account_details_procedures_table").append(tempHtml);
            });

            $.get('common/templates/hcpcs.html', function (data) {
                $("#global_search_account_info #account_details_hcpcs_table").empty();
                var tempHtml = "";
                $(globalvars.global_hcpcs).each(function (i) {
                    tempHtml += $.nano(data, globalvars.global_hcpcs[i]);
                });
                $("#global_search_account_info #account_details_hcpcs_table").append(tempHtml);
            });
            

            
         //globalvars.confirmSelHosp = {hospitalId:accountdata.hospitalId,shortName:accountdata.shortName};
        
         $("#global_search_account_info #account_details_back_wrapper .account_detail_back_text").text('ACCT   ' +" "+ globalvars.global_accountDetailData.accountId);  
         $("#global_search_account_info #account_details_back_wrapper .account_detail_back_account").text('MRN   ' + " "  + globalvars.global_accountDetailData.patientId);

            gridsNew.existingChargesGridGlobal.initialize({
                data: globalvars.global_existingCharges,
                gridDiv: "#global_account_details_existing_charges_grid_table",
                isEditable: false,
            });

            
            gridsNew.missingChargesGridGlobal.initialize({
                data: globalvars.global_missingCharges,
                gridDiv: "#global_account_details_missing_charges_grid_table",
                isEditable:false,
                publishAccount:(globalvars.user.uType==globalvars.roles.administrator)?false:true
              
            });
            
            
            
            gridsNew.otherChargesGridGlobal.initialize({
                data: globalvars.global_otherCharges,
                gridDiv: "#global_account_details_other_charges_grid_table",
                isEditable:false
               
            });





            
            



            dialogs.globalSearchAccountInfo.$globalSearchDialogDiv.dialog('option', 'title', param.title);

            dialogs.globalSearchAccountInfo.$globalSearchDialogDiv.dialog('open');
            dialogs.globalSearchAccountInfo.$globalSearchDialogDiv.dialog("option", "position", 'center');
            
            $("img.search_cell_search").hide();
            $("img.search_cell_del").hide();
            
        $('#global_search_account_info #demo').niceScroll({cursorwidth: '7px', autohidemode: true, zindex: 999,cursorcolor:'#E4E4E4',hidecursordelay:200 });
         $('#global_search_account_info #demo1').niceScroll({cursorwidth: '7px', autohidemode: true, zindex: 999,cursorcolor:'#E4E4E4',hidecursordelay:200 });
         $('#global_search_account_info #demo2').niceScroll({cursorwidth: '7px', autohidemode: true, zindex: 999,cursorcolor:'#E4E4E4',hidecursordelay:200 });



         $("#global_search_account_info #demo").mouseover(function() {
          $("#global_search_account_info #demo").getNiceScroll().resize();
        });

         $("#global_search_account_info #demo1").mouseover(function() {
          $("#global_search_account_info #demo1").getNiceScroll().resize();
        });

         $("#global_search_account_info #demo2").mouseover(function() {
          $("#global_search_account_info #demo2").getNiceScroll().resize();
        });


            $.get('common/templates/global_account_details.html?1123', function (data) {
              $("#global_search_account_info #account_details_table").html($.nano(data, jQuery.extend(true, {}, globalvars.global_accountDetailData, globalvars.localResourceMap)));
        
    
                var originalHeight = $('#global_search_account_info #account_details_warpper').height();
                originalHeight = originalHeight - 5;
                //console.log(originalHeight);
                $('#global_search_account_info #demo').css('max-height',originalHeight)
                $('#global_search_account_info #demo1').css('max-height',originalHeight)
                $('#global_search_account_info #demo2').css('max-height',originalHeight)
                $('#global_search_account_info #demo').height(originalHeight);
                $('#global_search_account_info #demo1').height(originalHeight);
                $('#global_search_account_info #demo2').height(originalHeight);
             });
      

         })
         
    }


},

 confirmChargesAccountInfoPhysicianGlobal: {
        $confirmChargesDialogDiv: {},
        localDiagnoses: [],
        initialize: function (param) {
            log("initializing submit");
            this.$confirmChargesDialogDiv = param.$confirmChargesDialogDiv;
            this.baseScreen = param.baseScreen;
            this.$confirmChargesDialogDiv.dialog({
                modal: true,
                dialogClass:'fixedpos',
                autoOpen: false,
                width: 1210,
                height: $(window).height() - 10,
                resizable: false,
                position: "center",
                });
            return false;
        },
        open: function (param) {


            dialogs.confirmChargesAccountInfoPhysicianGlobal.loadData(param.data, param.billType, param.showPType);
            this.$confirmChargesDialogDiv.dialog('option', 'title', param.title);

            this.$confirmChargesDialogDiv.dialog('open');
            this.$confirmChargesDialogDiv.dialog("option", "position", 'center');
            $("img.searchAssociateCodeImage").hide();
            $("img.search_cell_search").hide();
            $("img.search_cell_del").hide();
            pqgridPhysician.existingHospitalChargesGrid.$gridDiv.pqGrid('refresh' );


        },
        loadData: function (accountdata, billType, showPType) {



            
            getJSONModel({
                async: false,
                url: globalvars.confirmChargesPhysician.uriExistingCharges,
                targetVar: "physicianExistingCharges"
            });

            getJSONModel({
                async: false,
                url: globalvars.confirmChargesPhysician.uriExistingPhysicianCharges,
                targetVar: "physicianExistingPhysicianCharges"
            });

            getJSONModel({
                async: false,
                url: globalvars.confirmChargesPhysician.uriMissingPhysicianCharges,
                targetVar: "physicianMissingPhysicianCharges"
            });

            getJSONModel({
                async: false,
                url: globalvars.confirmChargesPhysician.uriOtherDiscoverCharges,
                targetVar: "physicianOtherDiscoverCharges"
            });


            getJSONModel({
                async: false,
                url: globalvars.confirmChargesPhysician.uriPhysicianAccountDetail,
                targetVar: "physician"
            });

            getJSONModel({
                async: false,
                url: globalvars.confirmChargesPhysician.uriPhysicianAccountStatsPanel,
                targetVar: "physicianAccountStatsPanel"
            });

            getJSONModel({
                async: false,
                url: globalvars.confirmChargesPhysician.uriDiagnoses,
                targetVar: "diagnoses"
            });

            getJSONModel({
                async: false,
                url: globalvars.confirmChargesPhysician.uriProcedures,
                targetVar: "procedures"
            });

            getJSONModel({
                async: false,
                url: globalvars.confirmChargesPhysician.uriHcpcs,
                targetVar: "hcpcs"
            });

             

            $.get('common/templates/physician_details.html', function (data) {
                $("#confirm_charge_account_info_physician_global #account_details_physician_table").empty();
                var tempHtml = "";
                $(globalvars.physician).each(function (i) {
                    tempHtml += $.nano(data, globalvars.physician[i]);
                });
                $("#confirm_charge_account_info_physician_global #account_details_physician_table").append(tempHtml);
                $('[data-log="true"]').css('color','#0000FF');
                $('.account_details_code').tooltip();
                $('.account_details_code_value').tooltip();
            });

            // gridPhysician.existingHospitalChargesGrid.initialize({
            //     data: (globalvars.physicianExistingCharges != null) ? globalvars.physicianExistingCharges : [],
            //     gridDiv: "#confirm_charge_account_info_physician_global #account_details_hospital_charges_grid_table",
            //     isEditable: false
            // });

             $("#confirm_charge_account_info_physician_global #account_details_hospital_charges_grid").empty();
             $("#confirm_charge_account_info_physician_global #account_details_hospital_charges_grid").append('<div id="account_details_hospital_charges_grid_table"></div>');


            pqgridPhysician.existingHospitalChargesGrid.initialize({
                data: (globalvars.physicianExistingCharges!= null)?globalvars.physicianExistingCharges:[],
                gridDiv: "#confirm_charge_account_info_physician_global #account_details_hospital_charges_grid_table",
                isEditable: false
            });

            gridPhysicianGlobal.existingPhysicianChargesGrid.initialize({
                data: (globalvars.physicianExistingPhysicianCharges != null) ? globalvars.physicianExistingPhysicianCharges : [],
                gridDiv: "#confirm_charge_account_info_physician_global #account_details_existing_charges_grid_table_global",
                isEditable: false
            });


            gridPhysicianGlobal.missingPhysicianChargesGrid.initialize({
                data: (globalvars.physicianMissingPhysicianCharges != null) ? globalvars.physicianMissingPhysicianCharges : [],
                gridDiv: "#confirm_charge_account_info_physician_global #account_details_missing_charges_grid_table_global",
                isEditable: false,
                isHidden: false
            });


            gridPhysicianGlobal.otherPhysicianChargesGrid.initialize({
                data: (globalvars.physicianOtherDiscoverCharges != null) ? globalvars.physicianOtherDiscoverCharges : [],
                gridDiv: "#confirm_charge_account_info_physician_global #account_details_Physician_other_charges_grid_table_global",
                isEditable: false,
                isConfirm: true
            });

            $.get('common/templates/diagnoses.html', function (data) {
            $("#confirm_charge_account_info_physician_global #account_details_diagnoses_table").empty();
            var tempHtml = "";
            $(globalvars.diagnoses).each(function (i) {
                tempHtml += $.nano(data, globalvars.diagnoses[i]);
            });
                $("#confirm_charge_account_info_physician_global #account_details_diagnoses_table").append(tempHtml);
            });

        $.get('common/templates/procedures.html', function (data) {
            $("#confirm_charge_account_info_physician_global #account_details_procedures_table").empty();
            var tempHtml = "";
            $(globalvars.procedures).each(function (i) {
                tempHtml += $.nano(data, globalvars.procedures[i]);
            });
            $("#confirm_charge_account_info_physician_global #account_details_procedures_table").append(tempHtml);
        });

        $.get('common/templates/hcpcs.html', function (data) {
            $("#confirm_charge_account_info_physician_global #account_details_hcpcs_table").empty();
            var tempHtml = "";
            $(globalvars.hcpcs).each(function (i) {
                tempHtml += $.nano(data, globalvars.hcpcs[i]);
            });
            $("#confirm_charge_account_info_physician_global #account_details_hcpcs_table").append(tempHtml);
        });


        // $.get('common/templates/physician_account_details.html?1123', function (data) {
        //         var selRowData = accountdata;
        //         $("#account_details_table_physician").html($.nano(data, jQuery.extend(true, {}, selRowData, globalvars.localResourceMap)));
        //     });

        $.get('common/templates/physician_account_details.html?1123', function (data) {
            var selRowData = accountdata
            selRowData.hospShortName = selRowData.shortName;//globalvars.physicianHospitals[globalvars.selectedPreHospitalIndex].shortName;
            selRowData.shortName = selRowData.shortName;//globalvars.physicianHospitals[globalvars.selectedPreHospitalIndex].shortName;
            selRowData.chartdata = globalvars.physicianAccountStatsPanel[0];
            $("#confirm_charge_account_info_physician_global #account_details_table").html($.nano(data, jQuery.extend(true, {}, selRowData, globalvars.localResourceMap)));
            $('.accountHeader').tooltip();
        })


        $('#confirm_charge_account_info_physician_global #demo1').niceScroll({cursorwidth: '7px', autohidemode: true, zindex: 999,cursorcolor:'#E4E4E4',hidecursordelay:200 });
         $('#confirm_charge_account_info_physician_global #demo2').niceScroll({cursorwidth: '7px', autohidemode: true, zindex: 999,cursorcolor:'#E4E4E4',hidecursordelay:200 });
         $('#confirm_charge_account_info_physician_global #demo3').niceScroll({cursorwidth: '7px', autohidemode: true, zindex: 999,cursorcolor:'#E4E4E4',hidecursordelay:200 });
         $('#confirm_charge_account_info_physician_global #demo4').niceScroll({cursorwidth: '7px', autohidemode: true, zindex: 999,cursorcolor:'#E4E4E4',hidecursordelay:200 });
         $('#confirm_charge_account_info_physician_global #demo5').niceScroll({cursorwidth: '7px', autohidemode: true, zindex: 999,cursorcolor:'#E4E4E4',hidecursordelay:200 });



         $("#confirm_charge_account_info_physician_global #demo1").mouseover(function() {
          $("#confirm_charge_account_info_physician_global #demo1").getNiceScroll().resize();
        });

         $("#confirm_charge_account_info_physician_global #demo2").mouseover(function() {
          $("#confirm_charge_account_info_physician_global #demo2").getNiceScroll().resize();
        });

         $("#confirm_charge_account_info_physician_global #demo3").mouseover(function() {
          $("#confirm_charge_account_info_physician_global #demo3").getNiceScroll().resize();
        });

         $("#confirm_charge_account_info_physician_global #demo4").mouseover(function() {
          $("#confirm_charge_account_info_physician_global #demo4").getNiceScroll().resize();
        });

         $("#confirm_charge_account_info_physician_global #demo5").mouseover(function() {
          $("#confirm_charge_account_info_physician_global #demo5").getNiceScroll().resize();
        });


        pqgridPhysician.existingHospitalChargesGrid.$gridDiv.pqGrid('refresh' );


      }


    },
    publishCodesSearchFormDialog:{
     $searchFormDialogDiv:{},
     billType:"",
       initialize: function (param) {
            this.$searchFormDialogDiv = param.$searchFormDialogDiv;
            dialogs.publishCodesSearchFormDialog.buttons(param);
            this.$searchFormDialogDiv.dialog({
                modal: true,
                autoOpen: false,
                width: 820,
                resizable: false,
                position: { my: "center", at: "top", of: window }
            });
            return false;
       },
       buttons:function(param){
            

           param.$searchFormDialogDivCancel.click(function(){
               dialogs.publishCodesSearchFormDialog.$searchFormDialogDiv.dialog('close');
               dialogs.publishCodesSearchFormDialog.$searchFormDialogDiv.dialog('destroy');
           });

       },
       reset: function () {
           $("#account_details_other_charges_grid_search_form_table").jqGrid('clearGridData');
           $("#other_charges_grid_search_form")[0].reset();
       },
        open: function (obj) {
            log('open dialog');
            dialogs.publishCodesSearchFormDialog.$searchFormDialogDiv.dialog('open');
            dialogs.publishCodesSearchFormDialog.loadChargeData();
        },
        close: function() {
           //dialogs.publishCodesSearchFormDialog.reset();
           dialogs.publishCodesSearchFormDialog.$searchFormDialogDiv.dialog('close');
           dialogs.publishCodesSearchFormDialog.$searchFormDialogDiv.dialog('destroy');
           //$(this).remove();
       },
       loadChargeData:function(){
                                pqgridPhysician.publishCodeListGridPQ.initialize({
                                                data:globalvars.publishCodePreview,
                                                gridDiv: "#prebill_grid_tablePQ"
                                        })

       }
},
publishAccountsSearchFormDialog:{
    $searchFormDialogDiv:{},
    billType:"",
      initialize: function (param) {
           this.$searchFormDialogDiv = param.$searchFormDialogDiv;
           dialogs.publishAccountsSearchFormDialog.buttons(param);
           this.$searchFormDialogDiv.dialog({
               modal: true,
               autoOpen: false,
               width: 820,
               resizable: false,
               position: { my: "center", at: "top", of: window }
           });
           return false;
      },
      buttons:function(param){
           

          param.$searchFormDialogDivCancel.click(function(){
              dialogs.publishAccountsSearchFormDialog.$searchFormDialogDiv.dialog('close');
              dialogs.publishAccountsSearchFormDialog.$searchFormDialogDiv.dialog('destroy');
          });

      },
      reset: function () {
          $("#account_details_other_charges_grid_search_form_table").jqGrid('clearGridData');
          $("#other_charges_grid_search_form")[0].reset();
      },
       open: function (obj) {
           log('open dialog');
           dialogs.publishAccountsSearchFormDialog.$searchFormDialogDiv.dialog('open');
           dialogs.publishAccountsSearchFormDialog.loadChargeData();
       },
       close: function() {
          //dialogs.publishCodesSearchFormDialog.reset();
          dialogs.publishAccountsSearchFormDialog.$searchFormDialogDiv.dialog('close');
          dialogs.publishAccountsSearchFormDialog.$searchFormDialogDiv.dialog('destroy');
          //$(this).remove();
      },
      loadChargeData:function(){
                               pqgridPhysician.publishAccountsGridPQ.initialize({
                                               data:globalvars.publishCodePreview,
                                               gridDiv: "#prebill_grid_tablePQ"
                                       })

      }
},

messageDialogNewCodesSave: {
    $messageDialogDiv: {},
    show: function (param) {
        this.$messageDialogDiv = $(document.createElement('div'));
        this.$messageDialogDiv.attr('id', 'messageDialog');
        this.$messageDialogDiv.append('<p>' + param.text + '</p>');
        this.$messageDialogDiv.dialog({
            title: param.title ? param.title : globalvars.localResourceMap.message,
                    modal: true,
                    resizable: false,
                    buttons: {
                        "OK": function () {
                            $(this).dialog("close");
                            dialogs.messageDialogNewCodesSave.$messageDialogDiv.remove();
                            $("#sub_menu #Configuration li.submenu_item").eq(2).click();
                            
                        },
                    }
                });
    }
},

messageDialogAccountsSave: {
    $messageDialogDiv: {},
    show: function (param) {
        this.$messageDialogDiv = $(document.createElement('div'));
        this.$messageDialogDiv.attr('id', 'messageDialog');
        this.$messageDialogDiv.append('<p>' + param.text + '</p>');
        this.$messageDialogDiv.dialog({
            title: param.title ? param.title : globalvars.localResourceMap.message,
                    modal: true,
                    resizable: false,
                    buttons: {
                        "OK": function () {
                            $(this).dialog("close");
                            dialogs.messageDialogAccountsSave.$messageDialogDiv.remove();
                            $("#sub_menu #Configuration li.submenu_item").eq(4).click();
                            
                        },
                    }
                });
    }
},

};
    