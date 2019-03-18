
var dialogs = {
    changePasswordDialog: {
    $changePasswordDialogDiv: {},
    $changePasswordDialogAlertDiv: {},
    showOrHide:true,
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
            position: [550,200],

        });
        return false;
    },
    bindFunctionality:function(){

    	$("#change_password_submit").click(function () {
    		changePassword();
    	});

    	$("#specification_button").click(function(){
    		$("#password_specifications").toggle(dialogs.changePasswordDialog.showOrHide);
        	if ( dialogs.changePasswordDialog.showOrHide == true ) {
        		$("#password_specifications").show();
        		dialogs.changePasswordDialog.showOrHide = false;
        	} else if ( dialogs.changePasswordDialog.showOrHide == false ) {
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
		$userManagementDialogDiv:{},
		$userManagementScreen:"CREATE",
		auditorTemplate:"",
		userDetails:{},
		 /*Initialize all the button labels from external resource*/
		initialize:function(param){
		        this.$userManagementDialogDiv = param.$userManagementDialogDiv;
		        this.$userManagementDialogDiv.attr('title', globalvars.localResourceMap.user_management);
		        dialogs.userManagementDialog.bindFunctionality();
		        this.$userManagementDialogDiv.dialog({
		            modal: true,
		            autoOpen: false,
		            width: 450,
		            resizable: false,
		            position: [450,200]
		        });
		        return false;
		},
		loadData:function(){/*Load List of Available Auditor Roles like Admin,Supervisor,Internal Centralized Auditor*/
			if(globalvars.auditorRoles==undefined){
				 getJSONModel({
			          async: false,
			          url: globalvars.root.rolesUri,
			          targetVar: "auditorRoles"
			     });
			}

		},
		drawScreen:function(){/*Draw the Auditor Role Drop Down*/
		    $("#user_management_reset_password").hide();
		    //$("#user_management_delete").hide();
		    $("#user_management_disabled_checkbox_row").hide();
		    $("#user_management_reset_button_row").hide();
		    $("#user_management_hr_line_row").hide();
		    $("#user_management_space_row").hide();
			this.auditorTemplate = getTemplate('common/templates/option_item_auditor.html');

			 $("#user_management_auditor_role").empty();
        	 var tempHtml = '<option value="" selected= "selected"></option>';
        	 $(globalvars.auditorRoles).each(function (i) {
                 tempHtml+= $.nano(dialogs.userManagementDialog.auditorTemplate, { index: globalvars.auditorRoles[i].roleName, data: globalvars.auditorRoles[i].roleName });
             });
        	 $("#user_management_auditor_role").append(tempHtml);
		},
		open:function () {
			  dialogs.userManagementDialog.reset();
		      log('open User Management dialog');
		      this.$userManagementDialogDiv.dialog('open');
		      $("#user_management_reset_password").val(globalvars.localResourceMap.user_management_reset_password);
		      $("#user_management_submit").val(globalvars.localResourceMap.user_management_submit);
		      $("#user_management_reset").val(globalvars.localResourceMap.user_management_reset);
		      //$("#user_management_delete").val(globalvars.localResourceMap.user_management_delete);
		      if(globalvars.user.uType == globalvars.roles.administrator || globalvars.user.uType == globalvars.roles.helpdeskUser){
		        	dialogs.userManagementDialog.loadData();
			        dialogs.userManagementDialog.drawScreen();
		      }
		},
		bindFunctionality:function(){/*Functionality related to tab click, Submit,Reset and Cancel Buttons */

			  $("#user_management_main_menu li").eq(0).click(function () {
		          $("#user_management_main_menu li.user_management_main_menu_item").removeClass('active');
		          $(this).addClass('active');
		          $("#user_management_user_name").removeAttr("readonly");
		          $("#user_management_auditor_list_row").hide();
		          $("#user_management_disabled_checkbox_row").hide();
				    $("#user_management_reset_button_row").hide();
				    $("#user_management_hr_line_row").hide();
				    $("#user_management_space_row").hide();
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
		          if(globalvars.authmode!='rsa'){
		        	  $("#user_management_reset_password").show();
		           }
		          $("#user_management_disabled_checkbox_row").show();
				    $("#user_management_reset_button_row").show();
				    $("#user_management_hr_line_row").show();
				    $("#user_management_space_row").show();
		          dialogs.userManagementDialog.loadAuditors();
		          dialogs.userManagementDialog.$userManagementScreen = "MODIFY";
		          dialogs.userManagementDialog.reset();
		      });

		      $("#user_management_submit").click(function(){

		    	  var user_name = $("#user_management_user_name").val();
		    	  var first_name = $("#user_management_first_name").val();
		    	  var last_name = $("#user_management_last_name").val();
		    	  var email = $("#user_management_email").val();
		    	  var manager = $("#user_management_manager").val();
		    	  var phone = $("#user_management_phone").val();
		    	  var role_selected =  $("#user_management_auditor_role").val();

		    	  var isEnabled;

		    	  if($('#user_management_auditor_list_row input[name=enabled]').is(':checked') == true)
		    		  isEnabled=false;
		    	  else
		    		  isEnabled=true;


		    	  log(isEnabled);
		    	  if(dialogs.userManagementDialog.$userManagementScreen === "MODIFY" && user_name == ""){
		    		  $("#user_management_validation_alert").text(globalvars.localResourceMap.user_management_empty_user);
		    	  }
		    	  if(user_name == "" || first_name == "" || last_name == ""|| email == "" || phone == ""){
		    		  $("#user_management_validation_alert").text(globalvars.localResourceMap.user_management_empty_validation);
		    	  }else if(role_selected == ""){
		    		  $("#user_management_validation_alert").text(globalvars.localResourceMap.user_management_valid_user_type);
		    	  }else if(!isValidPhone(phone)){
		    		  $("#user_management_validation_alert").text(globalvars.localResourceMap.user_management_valid_phone);
		    	  }else if(!isValidEmailAddress(email)){
		    		  $("#user_management_validation_alert").text(globalvars.localResourceMap.user_management_valid_email);
		    	  }else{
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

		    		  if(dialogs.userManagementDialog.$userManagementScreen === "CREATE"){


		    				  /* Create a New User*/
		    				  postJSONModel({
				    			  url:globalvars.root.usersUri,
				    			  data:JSON.stringify(obj),
				    			  async:false,
				    			  callback:function(){
				    				  dialogs.messageDialog.show({ title: globalvars.localResourceMap.message, text: globalvars.localResourceMap.user_management_success_message });
				    				  dialogs.userManagementDialog.reset();
				    			  },
		    				      errorfunction:function(xhr){
		    				    	  err_msg=getErrorMessage(xhr,false);
		    				    	  dialogs.messageDialog.show({ title: globalvars.localResourceMap.error, text: err_msg });
		    				      }
				    		  });


		    		  }else if(dialogs.userManagementDialog.$userManagementScreen === "MODIFY"){
		    			  var selectedUser = $("#user_management_search_auditor").val();
		    			  log(dialogs.userManagementDialog.userDetails.pwd);
		    			  if(dialogs.userManagementDialog.userDetails.userId != user_name  ||  dialogs.userManagementDialog.userDetails.fName!=first_name ||
		    					  dialogs.userManagementDialog.userDetails.lName!=last_name ||
		    					  dialogs.userManagementDialog.userDetails.email!=email ||  dialogs.userManagementDialog.userDetails.phoneNbr!=phone ||
		    					  dialogs.userManagementDialog.userDetails.manager!=manager ||
		    					  dialogs.userManagementDialog.userDetails.uType!= role_selected || dialogs.userManagementDialog.userDetails.isEnabled != isEnabled){
		    				  /* Modify the Existing User*/

		    				  $.ajax({
		    					  url:globalvars.root.usersUri+"/"+selectedUser,
		    					  type:'PUT',
				    			  data:JSON.stringify(obj),
				    			  contentType: 'application/json',
				    			  async:false,
				    			  success:function(data){
                                                                        dialogs.messageDialog.show({ title: globalvars.localResourceMap.message, text: globalvars.localResourceMap.user_management_modify_success });
                                                                        dialogs.userManagementDialog.reset();
                                                          },
                                                          error:function(xhr){
		    				              if(xhr.status == 409){
                                                                  dialogs.messageDialog.show({ title: globalvars.localResourceMap.message, text: globalvars.localResourceMap.user_management_disable_user_error }); 
                                                              }
                                                          }
                                                         });
		    			  }else{
		    				  $("#user_management_validation_alert").text(globalvars.localResourceMap.user_management_empty_modification);
		    			  }
		    		  }
		    	  }

		      });

		      $("#user_management_reset").click(function(){
		    	  dialogs.userManagementDialog.reset();
		      });

		      $("#user_management_cancel").click(function(){

		    	  dialogs.userManagementDialog.reset();
		    	  dialogs.userManagementDialog.$userManagementDialogDiv.dialog('close');
		      });

		      $("#user_management_reset_password").click(function(){

		    	if(globalvars.userDetails)
		    	{
		    		if($("#user_management_user_name").val() != "")
		    		{
		    		  //var password_data = JSON.stringify(globalvars.userDetails.userId);
			    	  $.ajax({
			  	        url: globalvars.root.passwordResetUri,
			  	        type:'PUT',
			  	        data:globalvars.userDetails.userId,
			  	        async: true,
			  	        contentType: 'application/json',
		  	        	success:  function(data){
		  					dialogs.messageDialog.show({ text: globalvars.localResourceMap.user_management_success_reset_password });
		  				}

			    	  });
		    		}
		    		else
		    			{
		    				$("#user_management_validation_alert").text(globalvars.localResourceMap.user_management_empty_user);
		    			}

		    	}
		    	else
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

		  	  $("#user_management_search_auditor").change(function(){ /*Change Function for User Drop down which fetches the details of selected auditor */
		  		  var userName = $("#user_management_search_auditor").val();
		  		  if(userName!=undefined){
		  			   getJSONModel({
			  	            async: false,
			  	            url: globalvars.root.usersUri+"/"+userName,
			  	            targetVar: "userDetails"
			  	        });

		  			     /*Populate the form with selected user details*/

		  			     dialogs.userManagementDialog.userDetails = globalvars.userDetails;
				  		 $("#user_management_user_name").val(globalvars.userDetails.userId);
				  		 $("#user_management_first_name").val(globalvars.userDetails.fName);
				  		 $("#user_management_last_name").val(globalvars.userDetails.lName);
				  		 $("#user_management_email").val(globalvars.userDetails.email);
				  		 $("#user_management_phone").val(globalvars.userDetails.phoneNbr);
				  		 $("#user_management_manager").val(globalvars.userDetails.manager);
				  		 $("#user_management_auditor_role").val(globalvars.userDetails.uType);
				  		 if(globalvars.userDetails.isEnabled)
				  			 $('#user_management_auditor_list_row input[name=enabled]').attr('checked', false);
				  		 else
				  			$('#user_management_auditor_list_row input[name=enabled]').attr('checked', true);
		  		  }
		  	  });
		},
		reset : function(){
			 $("#user_management_form")[0].reset();
			 $("#user_management_validation_alert").text("");
			 $('#user_management_auditor_list_row input[name=enabled]').attr('checked', false);
		},
		loadAuditors : function(){ /*Load the List of Auditors*/
			  getJSONModel({
		          async: false,
		          url: globalvars.root.usersUri,
		          data: {isUserManagement: true},
		          targetVar: "userManagementAuditorsList"
		      });
	          dialogs.userManagementDialog.fillAuditorFilter();
		},
		fillAuditorFilter : function(){/*Draw the User Drop down*/
			 $("#user_management_search_auditor").empty();
        	 var tempHtml = "";
        	 tempHtml+= $.nano(dialogs.userManagementDialog.auditorTemplate, { index: "", data: "" });
        	 $(globalvars.userManagementAuditorsList).each(function (i) {
                 tempHtml+= $.nano(dialogs.userManagementDialog.auditorTemplate, { index: globalvars.userManagementAuditorsList[i].userId, data: globalvars.userManagementAuditorsList[i].fullUserName });
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
        baseScreen:"",
        initialize: function (param) {
            log("initializing submit");
            this.$submitAccountDetailsDialogDiv = param.$submitAccountDetailsDialogDiv;
            this.baseScreen = param.baseScreen;
            this.$submitAccountDetailsDialogDiv.dialog({
                modal: true,
                autoOpen: false,
                width: 500,
                resizable: false,
                position: { my: "center", at: "top", of: window },
                buttons: [{
                    text: globalvars.localResourceMap.account_details_dialog_yes1,
                    click: function () {
                        log('Yes - Account List');
                        roles.centralAuditor.sendAccountDetails({
                            url: dialogs.submitAccountDetailsDialog.url,
                            type: dialogs.submitAccountDetailsDialog.type,
                            screen:dialogs.submitAccountDetailsDialog.screen,
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
                            screen:dialogs.submitAccountDetailsDialog.screen,
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

otherChargesSearchFormDialog:{
	 $searchFormDialogDiv:{},
	 billType:"",
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
	            position: { my: "center", at: "top", of: window }
	        });
	        return false;
	   },
	   buttons:function(param){
		   dialogs.otherChargesSearchFormDialog.billType = param.billType;
		   	  param.$searchFormDialogDivSubmit.click(function(){
			    log('Other Charges Search Form Submit');
               $("#account_details_other_charges_grid_search_form_table").jqGrid('clearGridData');
               dialogs.otherChargesSearchFormDialog.loadChargeData();
			});

		   param.$searchFormDialogDivReset.click(function(){
			   dialogs.otherChargesSearchFormDialog.reset();
		   });

		   param.$searchFormDialogDivCancel.click(function(){
			   dialogs.otherChargesSearchFormDialog.reset();
			   param.$searchFormDialogDiv.dialog('close');
		   });

		   this.$searchFormDialogDiv.keypress(function(event) {
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
	   loadChargeData:function(){
		   var hospitalIdValue;
		   if(dialogs.otherChargesSearchFormDialog.billType == 'PRE')
			   hospitalIdValue = globalvars.preHospitals[globalvars.selectedPreHospitalIndex].hospitalId
		   else if(dialogs.otherChargesSearchFormDialog.billType == 'POST')
			   hospitalIdValue = globalvars.postHospitals[globalvars.selectedPostHospitalIndex].hospitalId
		   else if(dialogs.otherChargesSearchFormDialog.billType == 'EDIT')
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

           getJSONModel({
               async: false,
               url: globalvars.charges.chargesMasterLookupUri,
               data: searchQueryObject,
               targetVar: "otherChargesSearchForm"
           });

           if (globalvars.otherChargesSearchForm.length > 0) {
               var datalength = globalvars.otherChargesSearchForm.length;
               for (var i = 0; i < datalength; i++) {
                   $("#account_details_other_charges_grid_search_form_table").jqGrid('addRowData', i + 1, globalvars.otherChargesSearchForm[i]);
               }
           }
           else{
                   dialogs.messageDialog.show({text: globalvars.localResourceMap.associates_rule_charge_not_found_msg});
           }

	   }
},
associateRulesSearchFormDialog:{
	 $searchFormDialogDiv:{},
	 billType:"",
	   initialize: function (param) {
	        this.$searchFormDialogDiv = param.$searchFormDialogDiv;
	        this.$searchFormDialogDiv.attr('title',globalvars.localResourceMap.associate_rule_charge_lookup_form_title);
	        param.$searchFormDialogDivSubmit.unbind();
           dialogs.associateRulesSearchFormDialog.buttons(param);
	        this.$searchFormDialogDiv.dialog({
	            modal: true,
	            autoOpen: false,
	            width: 780,
	            resizable: false,
	            position: { my: "center", at: "top", of: window }
	        });
	        return false;
	   },
	   buttons:function(param){
		   dialogs.associateRulesSearchFormDialog.billType = param.billType;
		   	  
		   param.$searchFormDialogDivSubmit.click(function(){
		   
		   		  if($('#search_rev_number_value').val() == "" &&  $('#search_hcpc_number_value').val() == ""){
		   			dialogs.messageDialog.show({text: globalvars.localResourceMap.associate_rule_select_hcpc_rev_code});
		   		  }	
		   		  else{
					    $("#account_details_other_charges_grid_search_form_table").jqGrid('clearGridData');
		              dialogs.associateRulesSearchFormDialog.loadChargeData();
		   		  }
			});
		  

		   param.$searchFormDialogDivReset.click(function(){
			   dialogs.associateRulesSearchFormDialog.reset();
		   });

		   param.$searchFormDialogDivCancel.click(function(){
			   dialogs.associateRulesSearchFormDialog.reset();
			   dialogs.associateRulesSearchFormDialog.$searchFormDialogDiv.dialog('close');
			   //dialogs.associateRulesSearchFormDialog.$searchFormDialogDiv.dialog('destroy');

	         
		   });
		   
		   this.$searchFormDialogDiv.keypress(function(event) {
			    if (event.which == 13) {
			    	event.preventDefault();
			    	
			    	 if($('#search_rev_number_value').val() == "" &&  $('#search_hcpc_number_value').val() == ""){
			    		 dialogs.messageDialog.show({text: globalvars.localResourceMap.associate_rule_select_hcpc_rev_code});
			    	 }else{
			    	dialogs.associateRulesSearchFormDialog.loadChargeData();
			    	 }
			    }
			});
		   
	        $('.chosen-select').trigger('change');



	   },
	   close: function() {
		   dialogs.associateRulesSearchFormDialog.reset();
		   dialogs.associateRulesSearchFormDialog.$searchFormDialogDiv.dialog('close');
		   dialogs.associateRulesSearchFormDialog.$searchFormDialogDiv.dialog('destroy');
           //$(this).remove();
	   },
	   reset: function () {
	       $("#associate_rules_other_charges_grid_search_form_table").jqGrid('clearGridData');
	       //$(".chosen-select").prop('data-option-array-index', 0);
	       $("#associate_codes_grid_search_form")[0].reset();
	       //$(".chosen-results").attr	      
	   },
	    open: function (param) {
	        log('open dialog');
	        
	        $('#selected_dept_id').text(param.sourceCode);
	        $('#associate_codes_grid_search_form #search_associate_code_number').text('Existing ' + param.sourceType + ' Code:');
	        
	        getJSONModel({
	              async: false,
	              url: globalvars.charges.targetCodeLookupUri,
	              data: {predCodes:param.pred},
	              targetVar: "associatePredCodes"
	          });
	        

	        
	        
	        dialogs.associateRulesSearchFormDialog.$searchFormDialogDiv.dialog('open');
	        var config = {
	        	      '.chosen-select'           : {},
	        	      '.chosen-select-deselect'  : {allow_single_deselect:true},
	        	      '.chosen-select-no-single' : {disable_search_threshold:10},
	        	      '.chosen-select-no-results': {no_results_text:'Oops, nothing found!'},
	        	      '.chosen-select-width'     : {width:"95%"}
	        	    }
	        	    for (var selector in config) {
	        	      $(selector).chosen(config[selector]);
	        	    }
	       
	        var auditorTemplate =  getTemplate('common/templates/option_item_auditor.html');
	        
	        function fillAssociatesFill(){
	        	 $(".chosen-select").empty();
	        	 var tempHtml = '<option value="select">'+ globalvars.localResourceMap.associate_rule_select_hcpc_rev + '</option>';
	        	 $(globalvars.associatePredCodes).each(function (i) {
	        		 var codeName = globalvars.associatePredCodes[i].targetCode + "-" + globalvars.associatePredCodes[i].targetCodeType;
	                 tempHtml += $.nano(auditorTemplate, { index: codeName, data: codeName });
	             });
	        	 $('.chosen-select').append(tempHtml);
	        	 $('.chosen-select').trigger("chosen:updated");
	        };
	        
	        fillAssociatesFill();
	        
	        
	        
	        $('.chosen-select').change(function(){
	        	setHCPCorRev($(this).val());
	        
	        })
	        
	        function setHCPCorRev(selectedText){
	        	var selText = selectedText.split("-")
	        	if(selText[1] == "HCPC"){
	        		$('#search_rev_number_value').val("");
	        		$('#search_hcpc_number_value').val(selText[0]);
	        	}
	        	else if(selText[1] == "REV"){
	        		$('#search_hcpc_number_value').val("");
	        		$('#search_rev_number_value').val(selText[0]);
	        	}
	        	else{
	        		$('#search_hcpc_number_value').val("");
	        		$('#search_rev_number_value').val("");
	        	}

	        }
	        
	        
	        
	        
	        
	        
	    },
	   loadChargeData:function(){

		   $("#associate_rules_other_charges_grid_search_form_table").jqGrid('clearGridData');
          var searchQueryObject = {
    		  deptType: $("#search_department_number_type_rule").val(),
              deptValue: $("#search_department_number_value_rule").val(),
              deptDescType: $("#search_department_description_type_rule").val(),
              deptDescValue: $("#search_department_description_value_rule").val(),
              chargeType: $("#search_charge_number_type_rule").val(),
              chargeValue: $("#search_charge_number_value_rule").val(),
              chargeDescType: $("#search_charge_description_type_rule").val(),
              chargeDescValue: $("#search_charge_description_value_rule").val(),
              hcpcType: $("#search_hcpc_number_type").val(),
              hcpcValue: $("#search_hcpc_number_value").val(),
              revenueType: $("#search_rev_number_type").val(),
              revenueValue: $("#search_rev_number_value").val(),
              hospitalIdValue: globalvars.preHospitals[globalvars.selectedPreHospitalIndex].hospitalId,
              hospitalIdType: "equals"
          };

          getJSONModel({
              async: false,
              url: globalvars.charges.chargesMasterLookupUri,
              data: searchQueryObject,
              targetVar: "otherChargesSearchFormRules"
          });

          if (globalvars.otherChargesSearchFormRules.length > 0) {
              var datalength = globalvars.otherChargesSearchFormRules.length;
              var targetText = $('.chosen-select').val().split("-");
              var searchDiv = '<button class="other_discover_btn_add" type="button"><span class="button_text_add">ADD</span></button>';
              //var searchDiv = '<div class="addBth"><input type="button" value="ADD"></div>';
              for (var i = 0; i < datalength; i++) {
            	  globalvars.otherChargesSearchFormRules[i].targetCode = targetText[0];
            	  globalvars.otherChargesSearchFormRules[i].targetCodeType = targetText[1];
                  $("#associate_rules_other_charges_grid_search_form_table").jqGrid('addRowData', i + 1, globalvars.otherChargesSearchFormRules[i]);
                  $("#associate_rules_other_charges_grid_search_form_table").jqGrid('setCell', i + 1,  'search', searchDiv, '');

                  
              }
          }else{
        	  
              dialogs.messageDialog.show({text: globalvars.localResourceMap.associates_rule_charge_not_found_msg});
          }
          
          $('.other_discover_btn_add').die('click').on('click', function(e) {
        	  $(this).prop('disabled',true);
        	  log($(e.target).closest("tr.jqgrow").attr("id"));
        	  var id=$(e.target).closest("tr.jqgrow").attr("id");
              grids.loadAssociateRulesSearchFormGrid.addBthClick(id);
          });

	   }
},
cciEditsSearchFormDialog:{
	 $searchFormDialogDiv:{},
	 billType:"",
	 dateOfService:"",
	   initialize: function (param) {
	        this.$searchFormDialogDiv = param.$searchFormDialogDiv;
	        this.$searchFormDialogDiv.attr('title',globalvars.localResourceMap.cci_edits_charge_lookup_form_title);
	        param.$searchFormDialogDivSubmit.unbind();
          dialogs.cciEditsSearchFormDialog.buttons(param);
	        this.$searchFormDialogDiv.dialog({
	            modal: true,
	            autoOpen: false,
	            width: 780,
	            resizable: false,
	            position: { my: "center", at: "top", of: window }
	        });
	        return false;
	   },
	   buttons:function(param){
		   dialogs.cciEditsSearchFormDialog.billType = param.billType;
		   	  
		   param.$searchFormDialogDivSubmit.click(function(){
		   
		   		  if($('#search_hcpc_number_value_cci').val() == ""){
		   			dialogs.messageDialog.show({text: 'Please select HCPC code from dropdown'});
		   		  }	
		   		  else{
					    $("#account_details_other_charges_grid_search_form_table").jqGrid('clearGridData');
		              dialogs.cciEditsSearchFormDialog.loadChargeData();
		   		  }
			   
			   //$("#account_details_other_charges_grid_search_form_table").jqGrid('clearGridData');
              //dialogs.cciEditsSearchFormDialog.loadChargeData();
			});
		  

		   param.$searchFormDialogDivReset.click(function(){
			   dialogs.cciEditsSearchFormDialog.reset();
		   });

		   param.$searchFormDialogDivCancel.click(function(){
			   dialogs.cciEditsSearchFormDialog.reset();
			   dialogs.cciEditsSearchFormDialog.$searchFormDialogDiv.dialog('close');
			   //dialogs.cciEditsSearchFormDialog.$searchFormDialogDiv.dialog('destroy');

	         
		   });

		   this.$searchFormDialogDiv.keypress(function(event) {
			    if (event.which == 13) {
			    	event.preventDefault();
			    	
//			    	 if($('#search_rev_number_value').val() == "" &&  $('#search_hcpc_number_value').val() == ""){
//			    		 dialogs.messageDialog.show({text: globalvars.localResourceMap.associate_rule_select_hcpc_rev_code});
//			    	 }else{
			    	if($('#search_hcpc_number_value_cci').val() == ""){
			   			dialogs.messageDialog.show({text: 'Please select HCPC code from dropdown'});
			   		  }	
			    	dialogs.cciEditsSearchFormDialog.loadChargeData();
			    	// }
			    }
			});
		   
	        $('.chosen-select1').trigger('change');



	   },
	   close: function() {
		   dialogs.cciEditsSearchFormDialog.reset();
		   dialogs.cciEditsSearchFormDialog.$searchFormDialogDiv.dialog('close');
		   dialogs.cciEditsSearchFormDialog.$searchFormDialogDiv.dialog('destroy');
          //$(this).remove();
	   },
	   reset: function () {
	       $("#cci_edits_other_charges_grid_search_form_table").jqGrid('clearGridData');
	       //$(".chosen-select").prop('data-option-array-index', 0);
	       $("#cci_edit_codes_grid_search_form")[0].reset();
	       //$(".chosen-results").attr	      
	   },
	    open: function (param) {
	        log('open dialog');
	        
	        $('#selected_cci_hcpc_id').text(param.pred);
	        $('#cci_edit_codes_grid_search_form #search_associate_code_number').text('Existing HCPC Code:');
	        
	        dialogs.cciEditsSearchFormDialog.dateOfService = param.dateOfService;
	        getJSONModel({
	              async: false,
	              url: globalvars.charges.codingEditsChargesHcpcCodebUri,
	              data: {hcpcCodea:param.pred,dateOfService:param.dateOfService},
	              targetVar: "associatePredCodes"
	          });
	        
      
	        
	        dialogs.cciEditsSearchFormDialog.$searchFormDialogDiv.dialog('open');
	        var config = {
	        	      '.chosen-select1'           : {},
	        	      '.chosen-select-deselect'  : {allow_single_deselect:true},
	        	      '.chosen-select-no-single' : {disable_search_threshold:10},
	        	      '.chosen-select-no-results': {no_results_text:'Oops, nothing found!'},
	        	      '.chosen-select-width'     : {width:"95%"}
	        	    }
	        	    for (var selector in config) {
	        	      $(selector).chosen(config[selector]);
	        	    }
	       
	        var auditorTemplate =  getTemplate('common/templates/option_item_auditor.html');
	        
	        function fillAssociatesFill(){

	        	 $(".chosen-select1").empty();
	        	 var tempHtml = '<option value="select">'+ 'Select HCPC code' + '</option>';
	        	 $(globalvars.associatePredCodes).each(function (i) {
	        		 var codeName = globalvars.associatePredCodes[i];
	                 tempHtml += $.nano(auditorTemplate, { index: codeName, data: codeName });
	             });
	        	 $('.chosen-select1').append(tempHtml);
	        	 $('.chosen-select1').trigger("chosen:updated");
	        };
	        
	        fillAssociatesFill();
	        
	        
	        
	        $('.chosen-select1').change(function(){
	        	if($(this).val() != 'select')
	        		$('#search_hcpc_number_value_cci').val($(this).val());
	        
	        })
	        
        
	        
	        
	    },
	   loadChargeData:function(){

		   $("#cci_edits_other_charges_grid_search_form_table").jqGrid('clearGridData');
         var searchQueryObject = {
   		  deptType: $("#search_department_number_type_rule").val(),
             deptValue: $("#search_department_number_value_rule_cci").val(),
             deptDescType: $("#search_department_description_type_rule").val(),
             deptDescValue: $("#search_department_description_value_rule_cci").val(),
             chargeType: $("#search_charge_number_type_rule").val(),
             chargeValue: $("#search_charge_number_value_rule_cci").val(),
             chargeDescType: $("#search_charge_description_type_rule").val(),
             chargeDescValue: $("#search_charge_description_value_rule_cci").val(),
             hcpcType: $("#search_hcpc_number_type").val(),
             hcpcValue: $("#search_hcpc_number_value_cci").val(),
             revenueType: $("#search_rev_number_type").val(),
             revenueValue: $("#search_rev_number_value_cci").val(),
             hospitalIdValue: globalvars.cciHospitals[globalvars.selectedCciHospitalIndex].hospitalId,
             hospitalIdType: "equals"
         };

         getJSONModel({
             async: false,
             url: globalvars.charges.chargesMasterLookupUri,
             data: searchQueryObject,
             targetVar: "otherChargesSearchFormRules"
         });

         if (globalvars.otherChargesSearchFormRules.length > 0) {
             var datalength = globalvars.otherChargesSearchFormRules.length;
             var searchDiv = '<button class="addBth_cci_edit" type="button"><span class="button_text_add">ADD</span></button>';
             for (var i = 0; i < datalength; i++) {
            	 globalvars.otherChargesSearchFormRules[i].dateOfService = dialogs.cciEditsSearchFormDialog.dateOfService;
           	     $("#cci_edits_other_charges_grid_search_form_table").jqGrid('addRowData', i + 1, globalvars.otherChargesSearchFormRules[i]);
                 $("#cci_edits_other_charges_grid_search_form_table").jqGrid('setCell', i + 1,  'search', searchDiv, '');
             }
         }else{
       	  
             dialogs.messageDialog.show({text: globalvars.localResourceMap.associates_rule_charge_not_found_msg});
         }
         
         $('.addBth_cci_edit').die('click').on('click', function(e) {
       	  $(this).prop('disabled',true);
       	  log($(e.target).closest("tr.jqgrow").attr("id"));
       	  var id=$(e.target).closest("tr.jqgrow").attr("id");
             grids.loadCciEditsSearchFormGrid.addBthClick(id);
         });

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

confirmAccountListDialog: {

    $confirmAccountDialogDiv: {},
    initialize: function (param) {
        this.$confirmAccountDialogDiv = param.$confirmAccountDialogDiv;
        this.$confirmAccountDialogDiv.dialog({
            modal: true,
            autoOpen: false,
            width: 340,
            resizable: false,
            position: [550,200],
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
    reInitialize : function(param){
    	log("re-initializing confirmAccountListDialog");
        this.$confirmAccountDialogDiv.dialog({
            modal: true,
            autoOpen: false,
            width: 340,
            resizable: false,
            position: [550,200],
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

showTipOffCommentDialog: {

    $showTipOffCommentDialogDiv: {},
    initialize: function (param) {
    	this.$showTipOffCommentDialogDiv = param.$showTipOffCommentDialogDiv;
        dialogs.showTipOffCommentDialog.populateDialog(param.data);
        this.$showTipOffCommentDialogDiv.dialog({
            title: 'Add Comment',
            autoOpen: true,
            width: 450,
            modal: true,
            minHeight: 250,
            buttons : {
                Add: function() {
                	var commentText = $("#additional_comment_text").val();
                	commentText = commentText.replace("Comment...","");
                    $(this).dialog("close"); //closing on Ok click
                    if(commentText.length > 0){
                    	param.data.tipOffComment.newComment = commentText;
                    	var selectedFacilityList = [];
                    	$("#multiple-facilities-container").find("select#multi_select_tip_off").multiselect("widget").find(":checkbox:checked").each(function(){
            				selectedFacilityList.push(this.value);
            			});
            			param.data.tipOffComment.selectedFacilities = selectedFacilityList;
                    }
                    $(this).dialog("close");
                }
			},
          });
          return false;
    },

    populateDialog: function(JSONData){
    	
    	var multiSelectTD = $("#multi-select-facility-list").empty();
    	$("#additional_comment_text").val("");
    	var facilitiesList = ["Bayonne","Cayonne","Dayonne","Eayonne"];
    	var selectList = '<select multiple="multiple" class="multi-select-tipoff" id="multi_select_tip_off">';
    	$("#tip_off_comment_text").empty();

    	$.each(facilitiesList, function(index, val){
    		selectList += '<option>' + val + '</option>';
    	})

    	selectList += '</select>';
    		
    	multiSelectTD.append(selectList);
    		
    	multiSelectTD.find("select#multi_select_tip_off").multiselect({
    		multiple: true,
    		height: 100,
            minWidth: 200,
            selectedList: 40
    	});

    	if(JSONData.tipOffComment){

    		$("#tip_off_comment_text").text(JSONData.tipOffComment.comment);
        	$("#additional_comment_text").val(JSONData.tipOffComment.newComment);
        	multiSelectTD.find("select#multi_select_tip_off").multiselect("widget").find(":checkbox").each(function(){
    		    if(jQuery.inArray(this.value, JSONData.tipOffComment.selectedFacilities) !=-1){
    	            this.click();
    		    }
    		});

    	}
    }

},

confirmChargesAccountInfo: {
	$confirmChargesDialogDiv: {},
    
    initialize: function (param) {
        log("initializing submit");
        this.$confirmChargesDialogDiv = param.$confirmChargesDialogDiv;
        this.baseScreen = param.baseScreen;
        this.$confirmChargesDialogDiv.dialog({
            modal: true,
            dialogClass:'fixedpos',
            autoOpen: false,
            width: 1170,
            height:600,
            resizable: false,
            position: "center",

            
           
        });
        return false;
    },
    open: function (param) {
        

        dialogs.confirmChargesAccountInfo.loadData(param.data,param.billType,param.showPType);
        this.$confirmChargesDialogDiv.dialog('option', 'title', param.title);

        this.$confirmChargesDialogDiv.dialog('open');
        this.$confirmChargesDialogDiv.dialog("option", "position", 'center');
        $("img.searchAssociateCodeImage").hide();
        $("img.search_cell_search").hide();
        $("img.search_cell_del").hide();
        
        if(globalvars.root.enableRule==false){
        	$('#associate_rule_wrapper').hide();
        	$('.account_details_associate_rules_wrapper').hide();
        }else if((param.billType == "PRE" && globalvars.associationRules.length==0)){
        	$('#associate_rule_wrapper').hide();
        	$('.account_details_associate_rules_wrapper').hide();
        	
        }else if(param.billType == "POST"){
        	$('#associate_rule_wrapper').hide();
        	$('.account_details_associate_rules_wrapper').hide();
        }else{
        	$('#associate_rule_wrapper').show();
        	$('.account_details_associate_rules_wrapper').show();
        }
        
        if(globalvars.missingCharges.length == 0){
        	$('#missing_charge_wrapper').hide();
        	$('#account_details_missing_charges_grid').hide();
        }else{
        	$('#missing_charge_wrapper').show();
        	$('#account_details_missing_charges_grid').show();
        }
        
        
        
    },
    loadData:function(accountdata,billType,showPType){
    	 
//    	 $.get('common/templates/account_details.html?1123', function (data) {
//             $("#account_details_table").html($.nano(data, jQuery.extend(true, {}, accountdata, globalvars.localResourceMap)));
//         });
    	 
    	 $.get('common/templates/account_details.html?1123', function (data) {
         	var selRowData = accountdata;
         	if(!showPType)
         		selRowData.patTypeWithDescription = selRowData.patSubTypeWithDescription

             $("#account_details_table").html($.nano(data, jQuery.extend(true, {}, selRowData, globalvars.localResourceMap)));
         });

    	 
    	 $("#account_details_back_wrapper .account_detail_back_text").text(globalvars.localResourceMap.account_details_coid +" "+ accountdata.shortName + ":");	
         $("#account_details_back_wrapper .account_detail_back_account").text(globalvars.localResourceMap.account_details_acct + " " + accountdata.accountId);
    	 
    	
    	 getJSONModel({
             async: false,
             url: accountdata.uriDiagnoses,
             targetVar: "diagnoses"
         });

         getJSONModel({
             async: false,
             url: accountdata.uriProcedures,
             targetVar: "procedures"
         });

         getJSONModel({
             async: false,
             url: accountdata.uriHcpcs,
             targetVar: "hcpcs"
         });
    	 
    	
    	 getJSONModel({
             async: false,
             url: ((billType == "PRE")?globalvars.confirmCharges.existingChargesUriPreBill:globalvars.confirmCharges.existingChargesUriPostBill)+"&isSubmitted=true&isConfirm=true",
             targetVar: "existingCharges"
         });

         getJSONModel({
             async: false,
             url: ((billType == "PRE")?globalvars.confirmCharges.possiblyMissingChargesUriPreBill:globalvars.confirmCharges.possiblyMissingChargesUriPostBill)+"&isSubmitted=true&isConfirm=true",
             targetVar: "missingCharges"
         });
         
         
         if(globalvars.root.enableRule==true){
	         getJSONModel({
	             async: false,
	             url: ((billType == "PRE")?globalvars.confirmCharges.assocRulesUriPreBill:globalvars.confirmCharges.assocRulesUriPostBill)+"&isSubmitted=true&isConfirm=true",
	             targetVar: "associationRules"
	         });
         }
         
         
         
         getJSONModel({
             async: false,
             url: ((billType == "PRE")?globalvars.confirmCharges.otherDiscoveredChargesUriPreBill:globalvars.confirmCharges.otherDiscoveredChargesUriPostBill)+"&isSubmitted=true&isConfirm=true",
             targetVar: "otherCharges"
         });
         
         
         
         grids.existingChargesGrid.initialize({
             data: globalvars.existingCharges,
             gridDiv: "#confirm_charge_existing_charges_grid_table",
             isEditable: false
         });

         grids.missingChargesGrid.initialize({
             data: globalvars.missingCharges,
             gridDiv: "#confirm_charge_missing_charges_grid_table",
             isEditable:false,
             isHidden: true
             //screenName: (screenName == "preBill")?"PRE":"POST"
         });
         
         grids.associationRulesGrid.initialize({
             data: globalvars.associationRules,
             gridDiv: "#account_details_associate_rules_grid_table",
             isEditable:false,
             isHidden: true
             //screenName: (screenName == "preBill")?"PRE":"POST"
         });
         
         grids.otherChargesGrid.initialize({
             data: globalvars.otherCharges,
             gridDiv: "#account_details_other_charges_grid_table",
             isEditable:false,
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
    	
    }
    



}


};
