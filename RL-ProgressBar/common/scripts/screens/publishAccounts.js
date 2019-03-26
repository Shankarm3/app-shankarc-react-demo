screens.publishAccounts = {
	
	rowId:"",	
	initialize: function (param) {
		this.drawScreen();
		this.loadData();
		this.bindEvents();
	},

	loadData: function () {

		var getRuleData = 	sessionStorage.getItem('codeSummary');
		if(getRuleData){
    		getRuleData = JSON.parse(getRuleData);

    		$('#selectedQueryRow').text("(" + getRuleData.ruleName + ")");
    		screens.publishAccounts.rowId = getRuleData.rowId;
    		// $("#selectBillType").val(getRuleData.billType);
    		//$("#selectSentFlag").val(getRuleData.sentFlag);
    		//$("input:radio[name=actionType][value=" + getRuleData.codeLevel + "]").attr('checked', 'checked');
    		if(getRuleData.isActive == "1")
				$("input:checkbox[name=ruleActive]").attr('checked', 'checked');

			$('#pred_account_area').val(getRuleData.codeList);
			$(".parse-save-btn").show();

			if(getRuleData.isRun == "1"){
				$("#new_rule_form").find("*").attr("disabled", "disabled");
				
				$(".parse-save-btn").hide();
			}


			sessionStorage.removeItem('codeSummary')
    	}else{
    		screens.publishAccounts.rowId="";
    		$(".parse-save-btn").show();
    		$('#selectedQueryRow').text('');
    	}

	},

	drawScreen: function () {
		
		getSYNC('common/templates/screens/publishAccounts.html', function (data) {
            globalvars.$contentcontainer.append($.nano(data,globalvars.localResourceMap));
        });
		
		
	},
	bindEvents:function(){

		 $('input:radio[name=actionType]').change(function () {
		 	if($(this).val() == "C")
		 		$("#pred_account_area").attr("placeholder", "Enter [Pred_Key] separated by comma.");
			else
				$("#pred_account_area").attr("placeholder", "Enter [Hospital_Id:Account_Id] separated by comma.");
		})

		$('.parse-save-btn').die('click').on('click', function() {

			var obj={};
			// obj.pCodeName = $('#txtRuleName').val();
			if(screens.publishAccounts.rowId != "")
				obj.rowId = screens.publishAccounts.rowId;

			// obj.billType = $('#selectBillType option:selected').val();
			//obj.sentFlag = $('#selectSentFlag option:selected').val();
			//obj.codeLevel  = 	$('input:radio[name=actionType]:checked').val();
			var activeFlag = Number($('input:checkbox[name=ruleActive]:checked').val());
	    		if(activeFlag != 1)
	    			activeFlag=0;
	    	obj.isActive = activeFlag;

	    	obj.codeList = $('#pred_account_area').val();

	    	
	    	console.log(obj);
	    	//return false;

			if(obj.codeList ==""){
				dialogs.messageDialog.show({text: 'Key is Mandatory Field'});
				return false;
			}
			else if(/^([a-z0-9]+:[a-z0-9]+\s*\>\>\s*\-?([0-9\.]+)+\,?)+$/i.test(obj.codeList) != true){
				dialogs.messageDialog.show({text: 'Please enter Data in the Required Format'});
				return false;
			}
			else{


					$.ajax({
				                url: globalvars.root.setEvScoreList,
				                type: 'POST',
				                data: JSON.stringify(obj),
				                contentType: 'application/json',
				                success:function(data){
			                		dialogs.messageDialogAccountsSave.show({ text: 'Accounts Saved Successfully'});
			                	},
			                	error: function (jqXHR, textStatus, errorThrown) {
			                        if (jqXHR.status == 201) {
			                        	dialogs.messageDialogAccountsSave.show({ text: 'Accounts Saved Successfully'});
			                          	//$("#sub_menu #Configuration li.submenu_item").eq(0).click();
			                          	//dialogs.messageDialog.$messageDialogDiv.dialog('destroy');
			                        	
			                        	
			                        }

			                    }
				            });
			}


		});


		$('.parse-preview-btn').die('click').on('click', function() {


					//dialogs.otherChargesSearchFormDialog.reset();

					var obj={};
					// obj.pCodeName = $('#txtRuleName').val();
					// if(screens.publishCodes.rowId != "")
					// 	obj.rowId = screens.publishCodes.rowId;

					// obj.billType = $('#selectBillType option:selected').val();
					//obj.sentFlag = $('#selectSentFlag option:selected').val();
					//obj.codeLevel  = 	$('input:radio[name=actionType]:checked').val();
					var activeFlag = Number($('input:checkbox[name=ruleActive]:checked').val());
			    		if(activeFlag != 1)
			    			activeFlag=0;
			    	obj.isActive = activeFlag;

			    	obj.codeList = $('#pred_account_area').val();
                    
                    
                    if(obj.codeList ==""){
						dialogs.messageDialog.show({text: 'Key is Mandatory Field'});
						return false;
					}else{


						$.ajax({
								type: 'POST',
								url: globalvars.root.setEvScorePreview,
								data: JSON.stringify(obj),
								contentType: 'application/json',
					            traditional: true,
					            success: function(data){

					            	globalvars["publishCodePreview"] = data;

					            	if (globalvars.publishCodePreview.length > 0){

						            	$("#prebill_gridPQ_new").empty();
				        				$("#prebill_gridPQ_new").append('<div id="prebill_grid_tablePQ"></div>');

					                    dialogs.publishAccountsSearchFormDialog.initialize({
					                        $searchFormDialogDiv: $("#public_codegrid_search_form_dialog"),
					                        $searchFormDialogDivCancel: $("#other_charges_grid_search_form_cancel")
					                    });
					                    dialogs.publishAccountsSearchFormDialog.open();
			   
					            	}else{
					                        dialogs.messageDialog.show({text: 'Data is not available'});
					                }
					            	
					            }
							})

						

                }





             });


	}

}