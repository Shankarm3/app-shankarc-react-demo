screens.accountDetails = {
    id: 0,
    rowData: [],
    accountDetailsEditable: true,
    accountDetailsHidden:true,
    showSubmit: true,
    showSave: true,
    showAddRow: true,
    showDelRow: true,
    backScreen: "",
    admitDate:"",
    dischargeDate:"",
    dateInBetween:true,
    hospShortName:"",
    refreshIntervalId:"",
    amountValueSubmit:false,
    amountFlag:true,
    initialize: function (param) {
        log(param);
        //this.id = getRowIdByValue(param.rowData, param.id);
        this.id = getRowIdByValuePQ(param.rowData, param.id);
        this.rowData = param.rowData;
        this.accountDetailsEditable = param.accountDetailsEditable === false ? param.accountDetailsEditable : true;
        this.accountDetailsHidden = param.accountDetailsHidden === false ? param.accountDetailsHidden : true;
        this.showSave = param.showSave === false ? param.showSave : true;
        this.showSubmit = param.showSubmit === false ? param.showSubmit : true;
        this.showAddRow = param.showAddRow === false ? param.showAddRow : true;
        this.showDelRow = param.showDelRow === false ? param.showDelRow : true;
        globalvars.showPType = param.showPType;
        this.backScreen = param.backScreen;

        screens.accountDetails.admitDate=this.rowData[this.id].admitDate;
        screens.accountDetails.dischargeDate=this.rowData[this.id].dischargeDate;
        screens.accountDetails.loadData(this.rowData[this.id].index,this.backScreen);



    },

    loadNext: function () {
        window.clearInterval(globalvars.refreshIntervalId);
        globalvars.autoSaveCounter=0;
        globalvars.refreshIntervalId = null;
        this.id += 1;
        var accountId = this.rowData[this.id];
        if(accountId != undefined){
        	if(screens.accountDetails.backScreen == "preBill"){
	        	 $.ajax({
	                 type: 'GET',
	                 url: globalvars.preHospitals[globalvars.selectedPreHospitalIndex].accountScoringCheckUri,
	                 datatype: 'json',
	                 success: function(data) {
	                     if (data){
	                         dialogs.messageDialog.show({text: globalvars.localResourceMap.account_scoring_check});
	                     }
	                     else {
	                    	 	globalvars.$contentcontainer.empty();
	                    	 	screens.accountDetails.loadData(screens.accountDetails.rowData[screens.accountDetails.id].index, screens.accountDetails.backScreen);
	                    	 	screens.accountDetails.admitDate=screens.accountDetails.rowData[screens.accountDetails.id].admitDate;
	                            screens.accountDetails.dischargeDate=screens.accountDetails.rowData[screens.accountDetails.id].dischargeDate;
	                     }
	                 }
	             });
	        	}
	        	else if(screens.accountDetails.backScreen == "postBill"){
	        	 	globalvars.$contentcontainer.empty();
	        		screens.accountDetails.loadData(screens.accountDetails.rowData[screens.accountDetails.id].index, screens.accountDetails.backScreen);
	        	 	screens.accountDetails.admitDate=screens.accountDetails.rowData[screens.accountDetails.id].admitDate;
	                screens.accountDetails.dischargeDate=screens.accountDetails.rowData[screens.accountDetails.id].dischargeDate;
	        	}

        	}
        else
        	screens.accountDetails.closeAccountDetails();


    },


    bindFunctionality: function() {
        if (screens.accountDetails.showSubmit == true) {
            screens.accountDetails.createSubmit($("#submit_form_detail_data"), param.id,this.backScreen);
            

        };

        if (screens.accountDetails.showSave == true) {
            screens.accountDetails.createSaveForLater($("#save_form_detail_data"), param.id,this.backScreen);
        };

        //if (screens.accountDetails.showAddRow == true) {
            screens.accountDetails.createAddRow($("#addrow_button"), param.id);
            screens.accountDetails.showOtherDiscoverSearchForm($("img.search_cell_search"), param.id);
            screens.accountDetails.showAssociateCodesSearchForm($("img.searchAssociateCodeImage"), param.id);
            screens.accountDetails.showcciEditsSearchForm($("img.searchcciEditsCodeImage"), param.id);
        //};

        //if (screens.accountDetails.showDelRow == true) {
            screens.accountDetails.createDelRow($("img.search_cell_del"), param.id);
        //};


        if(this.backScreen == "preBill"){
        	$("#account_details_back_wrapper .account_detail_back_text").text(this.rowData[this.id].accountId);
            screens.accountDetails.hospShortName = globalvars.preHospitals[globalvars.selectedPreHospitalIndex].shortName
        }
        else{
            screens.accountDetails.hospShortName = globalvars.postHospitals[globalvars.selectedPostHospitalIndex].shortName
        	$("#account_details_back_wrapper .account_detail_back_text").text(this.rowData[this.id].accountId);
        }

        $("#account_details_back_wrapper .account_detail_back_account").text(this.rowData[this.id].patientId);


        $("#back_account_detail_img").unbind();'Facility'
        $("#back_account_detail_label").unbind();

        $("#back_account_detail_img").bind("click", function () {
        	accountDetailsBack();
        });
        $("#back_account_detail_label").bind("click", function () {
        	accountDetailsBack();
        });


        function accountDetailsBack(){
        	dialogs.confirmAccountListDialog.reInitialize({
        		screenFolder:"screens",
        		screenName:"accountDetails",
        		functionName:"closeAccountDetails"
        	});

        	dialogs.confirmAccountListDialog.open({
                title: globalvars.localResourceMap.confirm_account_details_title,
                message: globalvars.localResourceMap.confirm_account_details_msg

            });
        }


        // $('#alternateBtn button').on('click',function(){

        //     console.log($(this).text());

        //     screens.accountDetails.populateAlternateAccounts();

        // })
        


//
//        $('#other_charges_grid_search_form_dialog').keypress(function(event) {
//		    if (event.which == 13) {
//		        //event.preventDefault();
//		    	dialogs.otherChargesSearchFormDialog.getSearchFormData();
//		    }
//		});


             $(document).on('click','#additionalAccounts li>a',function(){
               // console.log($(this).text());
                    $.ajax({
                            type: 'GET',
                            url: $(this).attr('data-uri'),
                            traditional: true,
                            dataType: 'json',
                            success: function(data){
                                globalvars["confirmChargesGlobal"] = data;
                                dialogs.globalSearchAccountInfo.open({billType:"",showPType:"",title:globalvars.localResourceMap.account_details_heading});
                            }
                        })

            });


             $('.summarizedBtn').on('click', function(){
                if(pqGrids.existingChargesGrid.$gridDiv)
                    pqGrids.existingChargesGrid.$gridDiv.pqGrid("saveEditCell" );

                $(this).prop('disabled', 'disabled');
                $('.detailBtn').prop('disabled', false);

                console.log('summarizedBtn');

                $("#account_details_existing_charges_grid").empty();
                $("#account_details_existing_charges_grid").append('<div id="account_details_existing_charges_grid_table" style="min-height:40px;width:100%;"></div>');

                pqGrids.existingChargesGrid.initialize({
                    data: globalvars.existingChargesGroup,
                    gridDiv: "#account_details_existing_charges_grid_table",
                    isEditable: false,
                    isConfirmCharg: false
                });

                filterData();

             })

              $('.detailBtn').on('click', function(){
                 
                 $(this).prop('disabled', 'disabled');
                 $('.summarizedBtn').prop('disabled', false);

                console.log('detailBtn');

                $("#account_details_existing_charges_grid").empty();
                $("#account_details_existing_charges_grid").append('<div id="account_details_existing_charges_grid_table" style="min-height:40px;width:100%;"></div>');
                


                pqGrids.existingChargesGrid.initialize({
                    data: globalvars.existingCharges,
                    gridDiv: "#account_details_existing_charges_grid_table",
                    isEditable: true,
                    isConfirmCharg: false

                });
                filterData();

             })


             // $('#filterBtn').on('click',function(){

                function filterData(){
                        pqGrids.existingChargesGrid.$gridDiv.pqGrid( "filter", { oper:'replace',attr: 'multiple', data: [] } );
                        var filterDept = ($('#selectFilterDeptType').val())?$('#selectFilterDeptType').val():"";
                        var filterRev = ($('#selectFilterRevType').val())?$('#selectFilterRevType').val():"";
                        var filterChargeDate = ($('#selectFilterChargeType').val())?$('#selectFilterChargeType').val():"";

                        pqGrids.existingChargesGrid.$gridDiv.pqGrid( "filter", { 
                        oper: 'add', 
                        attr: 'multiple',
                            data: [ 
                                { dataIndx: 'dept', condition: 'range', value: filterDept },
                                { dataIndx: 'revenueCode', condition: 'range', value: filterRev },
                                { dataIndx: 'chargeDate', condition: 'range', value: filterChargeDate },
                            ] 
                         });

                        // var filter = pqGrids.existingChargesGrid.$gridDiv.pqGrid("getColumn", { dataIndx: "revenueCode" }).filter;
                        // $.extend(filter, {
                        //     condition: "contain",
                        //     value: [],
                        //     cache: null,
                        //     });

                        // var filter = pqGrids.existingChargesGrid.$gridDiv.pqGrid("getColumn", { dataIndx: "dept" }).filter;
                        // $.extend(filter, {
                        //     condition: "contain",
                        //     value: [],
                        //     cache: null,
                        //     });

                        //  var filter = pqGrids.existingChargesGrid.$gridDiv.pqGrid("getColumn", { dataIndx: "chargeDate" }).filter;
                        // $.extend(filter, {
                        //     condition: "contain",
                        //     value: [],
                        //     cache: null,
                        //     });


                       // pqGrids.existingChargesGrid.$gridDiv.pqGrid("refreshHeader");
                }


             // })

              $('#selectFilterDeptType').change(function(){
                filterData();
              });
              $('#selectFilterChargeType').change(function(){
                filterData();
              });
              $('#selectFilterRevType').change(function(){
                filterData();
              });


              $('#clearFilterBtn').on('click',function(){

                $("#selectFilterDeptType").multiselect('uncheckAll');
                $("#selectFilterChargeType").multiselect('uncheckAll');
                $("#selectFilterRevType").multiselect('uncheckAll');
                pqGrids.existingChargesGrid.$gridDiv.pqGrid( "filter", { oper:'replace',attr: 'multiple', data: [] } );

              })


            //   $('#selectFilterDeptType').change(function(){

            //     var filter = pqGrids.existingChargesGrid.$gridDiv.pqGrid("getColumn", { dataIndx: "revenueCode" }).filter;
            //     var selectedFilterVal=[];

            //     var filterDept = ($('#selectFilterDeptType').val())?$('#selectFilterDeptType').val():"";
            //     var filterRev = ($('#selectFilterRevType').val())?$('#selectFilterRevType').val():"";
            //     var filterChargeDate = ($('#selectFilterChargeType').val())?$('#selectFilterChargeType').val():"";


            // });


              //   if($('#selectFilterDeptType').val()){
              //        { dataIndx: 'dept', condition: 'range', value: $('#selectFilterDeptType').val()}
              //   }
              //   else
              //       filterVal="";

              //   console.log(filterVal);
              //   // $.extend(filter, {
              //   //     type: 'textbox',
              //   //     condition: "contain",
              //   //     value:filterVal,
              //   //     listeners: ['keyup']
                    
              //   // });

              //   pqGrids.existingChargesGrid.$gridDiv.pqGrid( "filter", { 
              //   oper: 'replace', 
              //   attr: 'multiple',
              //       data: [ 
              //           { dataIndx: 'dept', condition: 'range', value: filterVal }
              //       ] 
              //    });

              // })
            
       
    },

    loadData: function (id,screenName) {

    	log("screenName::" + screenName);

    	$.when(

        		$.ajax({
        			type: 'GET',
    				url: globalvars.assignedAccounts[id].uriCharges,
    				traditional: true,
    				dataType: 'json'
        		})

        		

    	).done(function(data1){

    		globalvars["charges"] = data1;
    		

            if(screenName == "preBill"){

            	$.when(
            			
                		$.ajax({
            				type: 'GET',
                            url: globalvars.charges.existingChargesUri,
            				traditional: true,
            				dataType: 'json'
                		}),
                        $.ajax({
                            type: 'GET',
                            url: globalvars.charges.existingGroupChargesUri,
                            traditional: true,
                            dataType: 'json'
                        }),

                		$.ajax({
            				type: 'GET',
                            url: globalvars.charges.possiblyMissingChargesUri,
            				traditional: true,
            				dataType: 'json'
                		}),

                		$.ajax({
            				type: 'GET',
                            url: globalvars.charges.otherDiscoveredChargesUri,
            				traditional: true,
            				dataType: 'json'
                		}),
                        $.ajax({
                                        type: 'GET',
                            url: globalvars.charges.uriDiagnoses,
                                        traditional: true,
                                        dataType: 'json'
                        }),

                        $.ajax({
                             type: 'GET',
                            url: globalvars.charges.uriProcedures,
                            traditional: true,
                            dataType: 'json'
                        }),

                        $.ajax({
                            type: 'GET',
                            url: globalvars.charges.uriHcpcs,
                            traditional: true,
                            dataType: 'json'
                                }),
                        $.ajax({
                            type: 'GET',
                            url: globalvars.charges.uriAdditionalAccount,
                            traditional: true,
                            dataType: 'json'
                                }),
                        $.ajax({
                            type: 'GET',
                            url: globalvars.charges.chargeDateSummaryURI,
                            traditional: true,
                            dataType: 'json'
                                }),
                        $.ajax({
                            type: 'GET',
                            url: globalvars.charges.deptCodeSummaryURI,
                            traditional: true,
                            dataType: 'json'
                                }),
                        $.ajax({
                            type: 'GET',
                            url: globalvars.charges.revCodeSummaryURI,
                            traditional: true,
                            dataType: 'json'
                                })



                        //chargeDateSummaryURI
                        //deptCodeSummaryURI
                        //revCodeSummaryURI
            			
            	).done(function(data1, data2,data3, data4,data5,data6,data7,data8,data9,data10,data11){

                    globalvars["existingCharges"] = data1[0];
                    globalvars["existingChargesGroup"] = data2[0];
                    globalvars["missingCharges"] = data3[0];
                    globalvars["otherCharges"] = data4[0];
                    globalvars["diagnoses"] = data5[0];
                    globalvars["procedures"] = data6[0];
                    globalvars["hcpcs"] = data7[0];
                    globalvars["additionalAccountsData"] = data8[0];

                    globalvars["filterChargeDateData"] = data9[0];
                    globalvars["filterDeptData"] = data10[0];
                    globalvars["filterRevCodeData"] = data11[0];


                    


              
                    if(globalvars.root.enableRule){
                		$.ajax({
            				type: 'GET',
        	                url: globalvars.charges.assocRulesUri,
            				traditional: true,
            				dataType: 'json',
            				success: function(data){
                                globalvars["associateRules"] = data;
                                screens.accountDetails.drawScreen(screens.accountDetails.id, screens.accountDetails.rowData, screens.accountDetails.backScreen);
                                screens.accountDetails.bindFunctionality(screens.accountDetails.id, screens.accountDetails.backScreen);
            				}
                		})
                    }
                    else{
                        screens.accountDetails.drawScreen(screens.accountDetails.id, screens.accountDetails.rowData, screens.accountDetails.backScreen);
                        screens.accountDetails.bindFunctionality(screens.accountDetails.id, screens.accountDetails.backScreen);
                        
                 }
            		
            	})
            	


             }else if(screenName == "postBill"){

            	$.when(
            			
                		$.ajax({
            				type: 'GET',
                            url: globalvars.charges.existingChargesUri,
            				traditional: true,
            				dataType: 'json'
                		}),

                        $.ajax({
                            type: 'GET',
                            url: globalvars.charges.existingGroupChargesUri,
                            traditional: true,
                            dataType: 'json'
                        }),
                  
                		$.ajax({
            				type: 'GET',
                            url: globalvars.charges.possiblyMissingChargesUri,
            				traditional: true,
            				dataType: 'json'
                		}),

                		$.ajax({
            				type: 'GET',
                            url: globalvars.charges.otherDiscoveredChargesUri,
            				traditional: true,
            				dataType: 'json'
                		}),
                                $.ajax({
                                        type: 'GET',
                            url: globalvars.charges.uriDiagnoses,
                                        traditional: true,
                                        dataType: 'json'
                                }),

                                $.ajax({
                                        type: 'GET',
                            url: globalvars.charges.uriProcedures,
                                        traditional: true,
                                        dataType: 'json'
                                }),

                                $.ajax({
                                        type: 'GET',
                            url: globalvars.charges.uriHcpcs,
                                        traditional: true,
                                        dataType: 'json'
                                }),
                                 $.ajax({
                            type: 'GET',
                            url: globalvars.charges.uriAdditionalAccount,
                            traditional: true,
                            dataType: 'json'
                                }),
                        $.ajax({
                            type: 'GET',
                            url: globalvars.charges.chargeDateSummaryURI,
                            traditional: true,
                            dataType: 'json'
                                }),
                        $.ajax({
                            type: 'GET',
                            url: globalvars.charges.deptCodeSummaryURI,
                            traditional: true,
                            dataType: 'json'
                                }),
                        $.ajax({
                            type: 'GET',
                            url: globalvars.charges.revCodeSummaryURI,
                            traditional: true,
                            dataType: 'json'
                                })

            			
            	).done(function(data1, data2, data3,data4,data5,data6,data7,data8,data9,data10,data11){

                    globalvars["existingCharges"] = data1[0];
                    globalvars["existingChargesGroup"] = data2[0];
                    globalvars["missingCharges"] = data3[0];
                    globalvars["otherCharges"] = data4[0];
                    globalvars["diagnoses"] = data5[0];
                    globalvars["procedures"] = data6[0];
                    globalvars["hcpcs"] = data7[0];
                    globalvars["additionalAccountsData"] = data8[0];

                     globalvars["filterChargeDateData"] = data9[0];
                    globalvars["filterDeptData"] = data10[0];
                    globalvars["filterRevCodeData"] = data11[0];
                    screens.accountDetails.drawScreen(screens.accountDetails.id, screens.accountDetails.rowData, screens.accountDetails.backScreen);
                    screens.accountDetails.bindFunctionality(screens.accountDetails.id, screens.accountDetails.backScreen);

            	})

             }
    		
    	})

        globalvars.autoSaveOtherChargeData=null;
        globalvars.autoSaveMissingData = null;
        globalvars.priceKey = "";
        globalvars.missingDropDownData={};

      //  $('#abc').perfectScrollbar();

      //$(document).find('#demo').perfectScrollbar('update');
       

    },

    drawScreen: function (id, rowData, screenName) {
        var clipboard = new Clipboard('.btnImg');

        getSYNC('common/templates/screens/accountDetailsCategory.html', function (data) {
            log('loading account details template');
            globalvars.$contentcontainer.append($.nano(data, globalvars.localResourceMap));
        });

        if(screenName == "postBill"){
        	$('#associate_rule_wrapper').hide();
        	$('.account_details_associate_rules_wrapper').hide();
        	$('#cci_edits_wrapper').hide();
        	$('.account_details_cci_edits_wrapper').hide();

        }
      
        
        if((screenName == "preBill" && globalvars.root.enableRule==false)){
        	$('#associate_rule_wrapper').hide();
        	$('.account_details_associate_rules_wrapper').hide();
        }else if((screenName == "preBill" && globalvars.associateRules.length==0)){
        	$('#associate_rule_wrapper').hide();
        	$('.account_details_associate_rules_wrapper').hide();

        }

        
        


        log('clicked ' + id);

        /* account details table */

       // if(globalvars.existingCharges){
       //  for (var i = 0; i < globalvars.existingCharges.length; i++) {
       //      var groupKey="";
       //      if(globalvars.existingCharges[i].dept != "")
       //          groupKey += globalvars.existingCharges[i].dept + " | ";

       //      if(globalvars.existingCharges[i].chargeCode != "")
       //          groupKey += globalvars.existingCharges[i].chargeCode + " | ";

       //      if(globalvars.existingCharges[i].chargeDate != "")
       //          groupKey += globalvars.existingCharges[i].chargeDate + " | ";

       //      if(globalvars.existingCharges[i].hcpcCode != "")
       //          groupKey += globalvars.existingCharges[i].hcpcCode + " | ";

       //      if(globalvars.existingCharges[i].revenueCode != "")
       //          groupKey += globalvars.existingCharges[i].revenueCode;

       //      globalvars.existingCharges[i].groupKey  = groupKey;

       //      //globalvars.existingCharges[i].groupKey = globalvars.existingCharges[i].dept + " | " + globalvars.existingCharges[i].chargeCode + " | " + globalvars.existingCharges[i].chargeDate + " | " + globalvars.existingCharges[i].hcpcCode + " | " + globalvars.existingCharges[i].revenueCode;
       //  }
       // }

       //“202 – Room & Board ($1,245)”
       //dept-description (amount);
       //chargeDate-amount
       //revenueCode-description (amount)


                    // globalvars["filterChargeDateData"] = data9[0];
                    // globalvars["filterDeptData"] = data10[0];
                    // globalvars["filterRevCodeData"] = data11[0];


       // added code for filter

       //selectFilterDeptType
       //selectFilterChargeType
       //selectFilterRevType



        if(globalvars.filterChargeDateData){
        	$('#selectFilterChargeType').empty();
            for (var i = 0; i < globalvars.filterChargeDateData.length; i++) {
                $('#selectFilterChargeType').append('<option value='+globalvars.filterChargeDateData[i].chargeDate+'>'+ globalvars.filterChargeDateData[i].chargeDate + ' (' + formatNegativeNumber(globalvars.filterChargeDateData[i].amount) + ')'+' </option>');
            }
        }

        if(globalvars.filterRevCodeData){
        	$('#selectFilterRevType').empty();
            for (var i = 0; i < globalvars.filterRevCodeData.length; i++) {
                $('#selectFilterRevType').append('<option value='+globalvars.filterRevCodeData[i].revenueCode+'>'+ globalvars.filterRevCodeData[i].revenueCode + '- '+ globalvars.filterRevCodeData[i].description + ' (' + formatNegativeNumber(globalvars.filterRevCodeData[i].amount) + ')'+' </option>');
            }
        }

        if(globalvars.filterDeptData){
        	$('#selectFilterDeptType').empty();
            for (var i = 0; i < globalvars.filterDeptData.length; i++) {
                $('#selectFilterDeptType').append('<option value='+globalvars.filterDeptData[i].dept+'>'+ globalvars.filterDeptData[i].dept + '- '+ globalvars.filterDeptData[i].description + ' (' + formatNegativeNumber(globalvars.filterDeptData[i].amount) + ')'+' </option>');
            }
        }







        $("#selectFilterDeptType").multiselect({ multiple: true,selectedText:"# of # checked",
                            noneSelectedText: 'Select Dept Code'                      
        })
        $("#selectFilterChargeType").multiselect({ multiple: true,selectedText:"# of # checked",
                            noneSelectedText: 'Select Charge Date'                      
        })
        $("#selectFilterRevType").multiselect({ multiple: true,selectedText:"# of # checked",
                            noneSelectedText: 'Select Revenue Code'                      
        })


        
        $('.ui-multiselect-menu').css('width', 'auto');
        $('#filterRow .ui-multiselect').css('background', '#fff');




        pqGrids.existingChargesGrid.initialize({
            data: globalvars.existingChargesGroup,
            gridDiv: "#account_details_existing_charges_grid_table",
            isEditable: false,
             isConfirmCharg: false

        });

        // pqGrids.existingChargesGridGrouping.initialize({
        //     data: globalvars.existingCharges,
        //     gridDiv: "#account_details_existing_charges_grid_table_group",
        //     isEditable: true,
        // });

        grids.missingChargesGrid.initialize({
            data: globalvars.missingCharges,
            gridDiv: "#account_details_missing_charges_grid_table",
            //isEditable: this.accountDetailsEditable,
            isHidden: this.accountDetailsHidden,
            screenName: (screenName == "preBill")?"PRE":"POST",
            backScreen:screenName,
            isEditable:true
        });

        grids.otherChargesGrid.initialize({
            data: globalvars.otherCharges,
            gridDiv: "#account_details_other_charges_grid_table",
            //isEditable: this.accountDetailsEditable,
            screenName: (screenName == "preBill")?"PRE":"POST",
            backScreen:screenName,
            isEditable:true
        });


        if(screenName == "preBill" && globalvars.root.enableRule){
	        grids.associationRulesGrid.initialize({
	            data:(globalvars.associateRules != undefined)? globalvars.associateRules : null,
	            gridDiv: "#account_details_associate_rules_grid_table",
	            //isEditable: this.accountDetailsEditable,
	            screenName: (screenName == "preBill")?"PRE":"POST",
	            backScreen:screenName,
                isEditable:true
	        });
        }


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

         $.get('common/templates/account_details_category.html?1123', function (data) {
            var selRowData = rowData[id];
            if(!globalvars.showPType)
                selRowData.patTypeWithDescription = selRowData.patSubTypeWithDescription

            selRowData.hospShortName=screens.accountDetails.hospShortName;
            $("#account_details_table").html($.nano(data, jQuery.extend(true, {}, selRowData, globalvars.localResourceMap)));
            var originalHeight = $('#account_details_warpper').height();    
            originalHeight = originalHeight - 5;
           // console.log(originalHeight);
             $('#demo').css('max-height',originalHeight)
             $('#demo1').css('max-height',originalHeight)
             $('#demo2').css('max-height',originalHeight)
            $('#demo').height(originalHeight);
            $('#demo1').height(originalHeight);
            $('#demo2').height(originalHeight);
            screens.accountDetails.populateAdditionalAccounts();

    
        });

         //$(document).find('#demo').perfectScrollbar();
        // screens.accountDetails.populateAdditionalAccounts();


         


         $('#demo').niceScroll({cursorwidth: '7px', autohidemode: true, zindex: 999,cursorcolor:'#E4E4E4',hidecursordelay:200 });
         $('#demo1').niceScroll({cursorwidth: '7px', autohidemode: true, zindex: 999,cursorcolor:'#E4E4E4',hidecursordelay:200 });
         $('#demo2').niceScroll({cursorwidth: '7px', autohidemode: true, zindex: 999,cursorcolor:'#E4E4E4',hidecursordelay:200 });



         $("#demo").mouseover(function() {
          $("#demo").getNiceScroll().resize();
        });

         $("#demo1").mouseover(function() {
          $("#demo1").getNiceScroll().resize();
        });

         $("#demo2").mouseover(function() {
          $("#demo2").getNiceScroll().resize();
        });

        $('.dropdown-toggle').dropdown();

        if(globalvars.user.uType==globalvars.roles.centralAuditor){
            screens.accountDetails.getIdealResume();
        }
    },
    populateAdditionalAccounts:function(){

        if(globalvars.additionalAccountsData && globalvars.additionalAccountsData.length > 0){
            $('#additionalAccounts').empty();
            $("#noAdditionalAccount").remove();
            for (var i = 0; i < globalvars.additionalAccountsData.length; i++) {
                        $('#additionalAccounts').append('<li><a href = "#" data-uri='+globalvars.additionalAccountsData[i].uriCharges +'>'+ globalvars.additionalAccountsData[i].accountId +'</a></li>');
            }
             $(".btn-group button").eq(0).text(globalvars.additionalAccountsData.length);
             $dropdown = $("#additionalAccounts");
              $(".btn-group button").after($dropdown);
             $(".btn-group button").eq(0).dropdown();
        }else{
            $(".btn-group button").eq(0).remove();
        }

    },

    createSaveForLater: function ($saveForLaterDiv, id,screenName) {

        $saveForLaterDiv.show();
        $saveForLaterDiv.unbind();
        $saveForLaterDiv.click(function () {

            //pqGrids.existingChargesGrid.$gridDiv.pqGrid("saveEditCell" );
            //pqGrids.existingChargesGrid.$gridDiv.pqGrid("option" , "dataModel.data")
        	
            // if (grids.existingChargesGrid.selectedRow !== undefined) {
            //     log("submitting + saving row " + grids.existingChargesGrid.selectedRow);
            //     grids.existingChargesGrid.$gridDiv.jqGrid('saveRow', grids.existingChargesGrid.selectedRow);
            // };

            if(pqGrids.existingChargesGrid.$gridDiv.jqGrid)
                    pqGrids.existingChargesGrid.$gridDiv.pqGrid("saveEditCell" );

            //var isValid = pqGrids.existingChargesGrid.pqGrid("isValid", ui).valid;
            //pqGrids.existingChargesGrid.savedSuccessfully = true;

            if (grids.missingChargesGrid.selectedRow !== undefined) {
                log("submitting + saving row " + grids.missingChargesGrid.selectedRow);
                grids.missingChargesGrid.$gridDiv.jqGrid('saveRow', grids.missingChargesGrid.selectedRow);
            };

            if (grids.otherChargesGrid.selectedRow !== undefined) {
                log("submitting + saving row " + grids.otherChargesGrid.selectedRow);
                grids.otherChargesGrid.$gridDiv.jqGrid('saveRow', grids.otherChargesGrid.selectedRow);
            };




            var saveChargesUri;

            if(screenName == "preBill" && globalvars.root.enableRule){
            	 if (grids.associationRulesGrid.selectedRow !== undefined) {
                     log("submitting + saving row " + grids.associationRulesGrid.selectedRow);
                     grids.associationRulesGrid.$gridDiv.jqGrid('saveRow', grids.associationRulesGrid.selectedRow);
                 };
            	saveChargesUri = globalvars.charges.savedChargesUri;
            }
//            if(screenName == "preBill" && globalvars.root.enableCodingEdits){
//	           	 if (grids.cciEditsGrid.selectedRow !== undefined) {
//	                 log("submitting + saving row " + grids.cciEditsGrid.selectedRow);
//	                 grids.cciEditsGrid.$gridDiv.jqGrid('saveRow', grids.cciEditsGrid.selectedRow);
//	             };
//	        	saveChargesUri = globalvars.charges.savedChargesUriPreBill;
//            }
            if(screenName == "postBill"){
            	saveChargesUri = globalvars.charges.savedChargesUri;
            }
            if(screenName == "preBill"){
            	saveChargesUri = globalvars.charges.savedChargesUri;
            }



            if(screenName == "preBill" && globalvars.root.enableRule){
	            if (pqGrids.existingChargesGrid.savedSuccessfully == true && grids.missingChargesGrid.savedSuccessfully == true && grids.otherChargesGrid.savedSuccessfully == true && grids.associationRulesGrid.savedSuccessfully) {
	                dialogs.submitAccountDetailsDialog.open({
	                    url: saveChargesUri,
	                    type: "PUT",
	                    detailId: id,
	                    screen: screenName,
	                    baseScreen:"accountDetails",
	                    title: globalvars.localResourceMap.save_account_details_dialog_title,
	                    message: globalvars.localResourceMap.save_account_details_dialog_msg
	                });
	            };
            }
            else{
            	if (grids.existingChargesGrid.savedSuccessfully == true && grids.missingChargesGrid.savedSuccessfully == true && grids.otherChargesGrid.savedSuccessfully == true) {
	                dialogs.submitAccountDetailsDialog.open({
	                    url: saveChargesUri,
	                    type: "PUT",
	                    detailId: id,
	                    screen: screenName,
	                    baseScreen:"accountDetails",
	                    title: globalvars.localResourceMap.save_account_details_dialog_title,
	                    message: globalvars.localResourceMap.save_account_details_dialog_msg
	                });
	            };

            }
        });
    },

    createSubmit: function ($submitDiv, id,screenName) {
        screens.accountDetails.dateInBetween=true;
        $submitDiv.show();
        $submitDiv.unbind();

        $submitDiv.click(function () {
            // if (grids.existingChargesGrid.selectedRow !== undefined) {
            //     log("submitting + saving row " + grids.existingChargesGrid.selectedRow);
            //     grids.existingChargesGrid.$gridDiv.jqGrid('saveRow', grids.existingChargesGrid.selectedRow);
            // };
            if(pqGrids.existingChargesGrid.$gridDiv.jqGrid)
                    pqGrids.existingChargesGrid.$gridDiv.pqGrid("saveEditCell" );

            if (grids.missingChargesGrid.selectedRow !== undefined) {
                log("submitting + saving row " + grids.missingChargesGrid.selectedRow);
                grids.missingChargesGrid.$gridDiv.jqGrid('saveRow', grids.missingChargesGrid.selectedRow);
            };

            if (grids.otherChargesGrid.selectedRow !== undefined) {
                log("submitting + saving row " + grids.otherChargesGrid.selectedRow);
                grids.otherChargesGrid.$gridDiv.jqGrid('saveRow', grids.otherChargesGrid.selectedRow);
            };

            if(screenName == "preBill" && globalvars.root.enableRule){
            	if (grids.associationRulesGrid.selectedRow !== undefined) {
                    log("submitting + saving row " + grids.associationRulesGrid.selectedRow);
                    grids.associationRulesGrid.$gridDiv.jqGrid('saveRow', grids.associationRulesGrid.selectedRow);
                };
            }


            if(screens.accountDetails.validateMissingCharges() == true){
                if(screens.accountDetails.amountValueSubmit == true){
                 dialogs.messagePriceMoreThen10K.show({
                            text: 'You are adding a charge code having value more than $100,000. Are you sure to proceed?',
                            title: 'Warning',
                            screenName:"accountDetails"
                        })

                }else{
                    screens.accountDetails.validationCheckForDOS();
                }
            }

           





        });
    },
    validationCheckForDOS:function(){

        if(screens.accountDetails.amountFlag == true){

                if(screens.accountDetails.dateInBetween == false){
                    dialogs.messageDOSNotInAdmitAndDischarge.show({
                        text: 'Date of service is out of admit and discharge date range. Do you want to continue?',
                        title: 'Warning',
                        screenName:"accountDetails"
                    })

                }else{
                    screens.accountDetails.submitAccountAfterValidation();
                }

           }else{

                return false;
           }

    },
    validateDOSCheck:function(selDate){

        var sDate = new Date(screens.accountDetails.admitDate);
        var eDate = new Date (screens.accountDetails.dischargeDate);
        var checkDate = new Date(selDate);

       if(checkDate >= sDate && checkDate <= eDate){
           // console.log("Date inside");
       }else{
          //  console.log("Date Out-inside");
            screens.accountDetails.dateInBetween=false;
       }

        //console.log(sDate + "::::" + eDate + ":::::" + checkDate);
    },
    validateMissingCharges:function(){
                 screens.accountDetails.amountValueSubmit = false;
                 screens.accountDetails.amountFlag = true;
                 var screenName =  screens.accountDetails.backScreen; 

                var missingChargesData = screens.accountDetails.getEditableList(grids.missingChargesGrid.$gridDiv.getRowData());
                var otherChargesData = screens.accountDetails.getEditableList(grids.otherChargesGrid.$gridDiv.getRowData());
                var existingChargesData = pqGrids.existingChargesGrid.$gridDiv.pqGrid("option" , "dataModel.data")






                var errorResponses = false;
                var errorChargeCode = false;
                var errorQty = false;
                var errorDateOfService = false;
                var errorTimeOfService = false;
                var errorDateOfServiceOther = false;
                var errorTimeOfServiceOther = false;
                var errorPriceOther = false;
                var errorAssociatedCode=false;
                var errorAssociatedResponse = false;
                var errorAssociatedDOS = false;
                var errorDeptChargeCode = false
                var errorCCIeditsResponse=false;
                var errorCCIDateOfService=false;
                var errorCCIModifierAdd=false;
                var errorCCIQty=false;
                var errorDateInBetween=false;
                var errorExistingQty=false;
                var errorExistingQtyLength=false;

                var errorNdcCodeCode=false;
                var missing_charge_validation_msg=false;
                var missing_charge_validation_msg2=false;
                var missing_charge_validation_msg3=false;
                var missing_charge_price_validation_msg=false;
                var missing_charge_price_validation_msg1=false;


                if(existingChargesData){
                    for (var j = 0; j < existingChargesData.length; j++) {

                        if(existingChargesData[j].qty != null && existingChargesData[j].qty != ""){
                            if(existingChargesData[j].qty == 0){
                                errorExistingQty=true;
                            }


                            if((Math.abs(existingChargesData[j].qty)).toString().length > 3){
                                errorExistingQtyLength=true;
                            }

                            if(((Math.abs(existingChargesData[j].chargeAmount) / Math.abs(existingChargesData[j].quantity)) * Math.abs(existingChargesData[j].qty)) > 100000){
                                screens.accountDetails.amountValueSubmit = true;
                            }
                        }

                    }
                }


                for (var i = 0; i < missingChargesData.length; i++) {
                    if (missingChargesData[i].response == "") {
                        errorResponses = true;
                    };

                    if (!(/^-?\d+$/.test(missingChargesData[i].qty)) || isNaN(missingChargesData[i].qty)) {
                        missing_charge_validation_msg=true;
                    }

                    if (isNaN(missingChargesData[i].price_modified)) {
                    	missing_charge_price_validation_msg1=true;
                    }

                    if (missingChargesData[i].qty > 0 && missingChargesData[i].response != 'Agree') {
                        missing_charge_validation_msg3=true;
                    }

                    if (missingChargesData[i].qty < 1 && missingChargesData[i].response == 'Agree') {
                        missing_charge_validation_msg2=true;
                    }
                    if (missingChargesData[i].price_modified <= 0 && missingChargesData[i].response == 'Agree') {
                    	missing_charge_price_validation_msg=true;
                    }

                    if((missingChargesData[i].qty * missingChargesData[i].price_modified) > 100000){
                        screens.accountDetails.amountValueSubmit = true;
                    }



                    if(missingChargesData[i].response == 'Agree' && ((missingChargesData[i].chargeCode == "" && missingChargesData[i].dept == "") || (missingChargesData[i].chargeCode == "" && missingChargesData[i].dept != "") || (missingChargesData[i].chargeCode != "" && missingChargesData[i].dept == ""))){
                        errorDeptChargeCode = true;
                    }

                    if(missingChargesData[i].response == 'Agree' && missingChargesData[i].isPharmacy == "true" && missingChargesData[i].ndcCode == ""){
                        errorNdcCodeCode = true;
                    }
                    
                    if(missingChargesData[i].response == 'Agree' && missingChargesData[i].qty < 1){
                        errorQty=true;
                    }

                    //missing_charge_validation_msg = Possible missing charge quantity field should only contain Integer value
                    //missing_charge_validation_msg2 = User cannot enter non-positive quantity if Response is Agree
                    //missing_charge_validation_msg3 = User cannot enter positive quantity if Response is not Agree

//                    if (missingChargesData[i].chargeCode == "" && missingChargesData[i].dept != "") {
//                        errorChargeCode = true;
//                    };
//
                   // if (screenName == "postBill"){
                        if(missingChargesData[i].dateOfService =="" && missingChargesData[i].qty != 0)
                        {
                            errorDateOfService=true;
                        }
                   // }
                       if(missingChargesData[i].dosTimeMissing && !(/^[0-9][0-9]:[0-9][0-9]$/.test(missingChargesData[i].dosTimeMissing))){
                            errorTimeOfService=true;
                       }
                        
                        if(missingChargesData[i].response == 'Agree' && missingChargesData[i].dateOfService !="")
                            screens.accountDetails.validateDOSCheck(missingChargesData[i].dateOfService);

                };

                if(screenName == "preBill" && globalvars.root.enableRule){
                    var associateRulesData = screens.accountDetails.getEditableList(grids.associationRulesGrid.$gridDiv.getRowData());

                    for (var i = 0; i < associateRulesData.length; i++) {

                        if (associateRulesData[i].response == "") {
                            errorAssociatedResponse = true;
                        };

                        if(associateRulesData[i].targetCode == "" && associateRulesData[i].response == 'Agree'){
                            errorAssociatedCode=true;
                        }



                        if(associateRulesData[i].dateOfServiceAssocRule =="" && associateRulesData[i].qty != 0)
                        {
                            errorAssociatedDOS=true;
                        }

                        if(associateRulesData[i].response == 'Agree' && associateRulesData[i].dateOfServiceAssocRule !="")
                            screens.accountDetails.validateDOSCheck(associateRulesData[i].dateOfServiceAssocRule);
                    }
                }


                for (var i = 0; i < otherChargesData.length; i++) { 

                	if(otherChargesData[i].dateOfService1 =="" && otherChargesData[i].qty != 0){
                         errorDateOfServiceOther=true;
                     }

                	if(otherChargesData[i].dosTimeOther && !(/^[0-9][0-9]:[0-9][0-9]$/.test(otherChargesData[i].dosTimeOther))){
                        errorTimeOfServiceOther=true;
                    }

                     if((otherChargesData[i].chargeCode == "" && otherChargesData[i].dept == "") || (otherChargesData[i].chargeCode == "" && otherChargesData[i].dept != "") || (otherChargesData[i].chargeCode != "" && otherChargesData[i].dept == "")){
                        errorDeptChargeCode = true;
                     }

                     if(otherChargesData[i].price_modified <= 0){
                         errorPriceOther = true;
                     }

                     if((otherChargesData[i].quantity * otherChargesData[i].price_modified) > 100000){
                        screens.accountDetails.amountValueSubmit = true;
                     }

                     if(otherChargesData[i].dateOfService1 !=""){
                        screens.accountDetails.validateDOSCheck(otherChargesData[i].dateOfService1);
                     }

                };





                if(errorExistingQty){

                    dialogs.messageDialog.show({
                        text: 'Enter a non-zero quantity change in existing charges, or leave the row blank to make no change.',
                        title: globalvars.localResourceMap.error
                    });
                    return false;
                }
                else if(missing_charge_validation_msg){
                    dialogs.messageDialog.show({
                        text: globalvars.localResourceMap.missing_charge_validation_msg,
                        title: 'Missing Charges Grid ' + globalvars.localResourceMap.error
                    });
                    return false;
                }
                else if(missing_charge_price_validation_msg1){
                    dialogs.messageDialog.show({
                        text: globalvars.localResourceMap.missing_charge_price_validation_msg1,
                        title: 'Missing Charges Grid ' + globalvars.localResourceMap.error
                    });
                    return false;
                }
                else if(missing_charge_validation_msg3){
                    dialogs.messageDialog.show({
                        text: globalvars.localResourceMap.missing_charge_validation_msg3,
                        title: 'Missing Charges Grid ' + globalvars.localResourceMap.error
                    });
                    return false;
                }
                else if(missing_charge_validation_msg2){
                    dialogs.messageDialog.show({
                        text: globalvars.localResourceMap.missing_charge_validation_msg2,
                        title: 'Missing Charges Grid ' + globalvars.localResourceMap.error
                    });
                    return false;
                }
                else if(missing_charge_price_validation_msg){
                    dialogs.messageDialog.show({
                        text: globalvars.localResourceMap.missing_charge_price_validation_msg,
                        title: 'Missing Charges Grid ' + globalvars.localResourceMap.error
                    });
                    return false;
                }
                else if(errorExistingQtyLength){
                    dialogs.messageDialog.show({
                        text: 'Enter quantity can not be more than 3 digit in existing charges.',
                        title: globalvars.localResourceMap.error
                    });
                    return false;
                }


                else if(errorCCIDateOfService){
                    dialogs.messageDialog.show({
                        text: 'Select Date of service to all coding edits before submitting',
                        title: globalvars.localResourceMap.error
                    });
                    return false;
                }
                else if(errorCCIeditsResponse){
                    dialogs.messageDialog.show({
                        text: 'Respond to all coding edits before submitting',
                        title: globalvars.localResourceMap.error
                    });
                    return false;
                }
                else if(errorCCIModifierAdd){
                    dialogs.messageDialog.show({
                        text: 'Mod A and Mod B can not remain empty',
                        title: globalvars.localResourceMap.error
                    });
                    return false;
                }
                else if(errorCCIQty){
                    dialogs.messageDialog.show({
                        text: 'Coding edits quantity field should only contain Integer value',
                        title: globalvars.localResourceMap.error
                    });
                    return false;
                }
                else if (errorResponses) {
                    dialogs.messageDialog.show({
                        text: globalvars.localResourceMap.missing_charge_validation_msg5,
                        title: globalvars.localResourceMap.error
                    });
                    return false;
                }
                else if (errorQty) {
                    dialogs.messageDialog.show({
                        text: globalvars.localResourceMap.missing_charge_validation_msg2,
                        title: globalvars.localResourceMap.error
                    });
                    return false;
                }
                else if(errorDeptChargeCode){
                     dialogs.messageDialog.show({
                         text: globalvars.localResourceMap.missing_charge_validation_msg7,
                         title: globalvars.localResourceMap.error
                     });
                     return false;
                }
                else if(errorNdcCodeCode){
                     dialogs.messageDialog.show({
                         text: 'Please select the NDC code before submitting',
                         title: globalvars.localResourceMap.error
                     });
                     return false;
                }
                else if (errorAssociatedResponse) {
                    dialogs.messageDialog.show({
                        text: globalvars.localResourceMap.associate_code_validation_msg5,
                        title: globalvars.localResourceMap.error
                    });
                    return false;
                } else if (errorChargeCode) {
                    dialogs.messageDialog.show({
                        text: globalvars.localResourceMap.missing_charge_validation_msg4,
                        title: globalvars.localResourceMap.error
                    });
                    return false;
                }
                else if (errorDateOfService) {

                    dialogs.messageDialog.show({
                        text: globalvars.localResourceMap.missing_charge_validation_msg6,
                        title: globalvars.localResourceMap.error
                    });
                    return false;
                }
                else if (errorTimeOfService) {

                    dialogs.messageDialog.show({
                        text: globalvars.localResourceMap.missing_charge_time_validation_msg,
                        title: globalvars.localResourceMap.error
                    });
                    return false;
                }
                else if (errorAssociatedDOS) {

                    dialogs.messageDialog.show({
                        text: globalvars.localResourceMap.associate_code_validation_msg6,
                        title: globalvars.localResourceMap.error
                    });
                    return false;
                }
                else if (errorPriceOther) {

                    dialogs.messageDialog.show({
                        text: globalvars.localResourceMap.other_charges_price_validation_msg,
                        title: globalvars.localResourceMap.error
                    });
                    return false;
                }
                else if(errorDateOfServiceOther){
                    dialogs.messageDialog.show({
                        text: globalvars.localResourceMap.other_discoverd_validation_msg6,
                        title: globalvars.localResourceMap.error
                    });
                    return false;
                }
                else if(errorTimeOfServiceOther){
                    dialogs.messageDialog.show({
                        text: globalvars.localResourceMap.missing_charge_time_validation_msg,
                        title: globalvars.localResourceMap.error
                    });
                    return false;
                }else if(errorAssociatedCode){
                    dialogs.messageDialog.show({
                        text: globalvars.localResourceMap.associate_rule_associate_code_search_msg,
                        title: globalvars.localResourceMap.error
                    });
                    return false;
                }
                else {
                    return true;
                }
            





            
            

    },

    submitAccountAfterValidation:function(){
        var screenName =  screens.accountDetails.backScreen;
        var id = screens.accountDetails.id;

         var submitChargesUri;

            if (screenName == "preBill") {
                submitChargesUri = globalvars.charges.submittedChargesUri;
                if (grids.existingChargesGrid.savedSuccessfully == true && grids.missingChargesGrid.savedSuccessfully == true && grids.otherChargesGrid.savedSuccessfully == true && grids.associationRulesGrid.savedSuccessfully) {

                    log(globalvars.localResourceMap.submit_account_details_dialog_title + " " + globalvars.localResourceMap.submit_account_details_dialog_msg);
                    dialogs.submitAccountDetailsDialog.open({
                        url: submitChargesUri,
                        type: 'POST',
                        detailId: id,
                        screen: screenName,
                        baseScreen:"accountDetails",
                        title: globalvars.localResourceMap.submit_account_details_dialog_title,
                        message: globalvars.localResourceMap.submit_account_details_dialog_msg

                    });
                };
            } else{
                submitChargesUri = globalvars.charges.submittedChargesUri;
                if (grids.existingChargesGrid.savedSuccessfully == true && grids.missingChargesGrid.savedSuccessfully == true && grids.otherChargesGrid.savedSuccessfully == true) {

                    log(globalvars.localResourceMap.submit_account_details_dialog_title + " " + globalvars.localResourceMap.submit_account_details_dialog_msg);
                    dialogs.submitAccountDetailsDialog.open({
                        url: submitChargesUri,
                        type: 'POST',
                        detailId: id,
                        screen: screenName,
                        baseScreen:"accountDetails",
                        title: globalvars.localResourceMap.submit_account_details_dialog_title,
                        message: globalvars.localResourceMap.submit_account_details_dialog_msg

                    });
                };
            }

            screens.accountDetails.dateInBetween=true;
    },

    createAddRow: function ($addRowDiv, id) {
        $addRowDiv.show();
        $addRowDiv.unbind();
        $addRowDiv.bind('click', function (e) {

            if (grids.otherChargesGrid.selectedRow !== undefined) {
                log("submitting + saving row " + grids.otherChargesGrid.selectedRow);
                grids.otherChargesGrid.$gridDiv.jqGrid('saveRow', grids.otherChargesGrid.selectedRow);

            };

            if (grids.otherChargesGrid.savedSuccessfully == true) {
            	var searchDiv = '<div class="other_discover_search_wrapper"><img class="search_cell_del" src="common/images/account-details/delete-icon.png"><img class="search_cell_search" src="common/images/account-details/search-icon.png"></div>';

                var otherchargesgrid_data = grids.otherChargesGrid.$gridDiv.jqGrid('getRowData');
                var otherchargesgrid_data_newrow = (otherchargesgrid_data.length) + 1;
                var newrow = { id: otherchargesgrid_data_newrow, search: "", hcpcCode: "", dept: "", chargeCode: "", ndcCode:"",quantity:1, comments: "",method:"",rowEditable:true};
                grids.otherChargesGrid.$gridDiv.jqGrid('addRowData', otherchargesgrid_data_newrow, newrow);
                grids.otherChargesGrid.$gridDiv.jqGrid('setCell', otherchargesgrid_data_newrow, 'search', searchDiv, '');
                log("New Row added to Other Charges Grid as row " + otherchargesgrid_data_newrow);
                grids.otherChargesGrid.$gridDiv.setGridParam({ rowNum: 30 }).trigger("reloadGrid");
                grids.otherChargesGrid.$gridDiv.setSelection(otherchargesgrid_data_newrow, true);
                grids.otherChargesGrid.savedSuccessfully = false;
                $("#account_details_other_charges_grid .ui-jqgrid-bdiv").scrollTop($("#account_details_other_charges_grid .ui-jqgrid-bdiv")[0].scrollHeight);
                $("#account_details_other_charges_grid_table tr td.price_val_other_charges").each(function(){
                	var priceValue = $(this).text();
                	if(priceValue && priceValue.length > 0){
                    	priceValue = priceValue.toString().replace(/(.*?)(\.\d)\d$/,"$1$2");
                    	$(this).text(priceValue);
                	}
                	console.log(priceValue);
                })
            }

            return false;
        });
    },
    showOtherDiscoverSearchForm:function($showSearchForm,id){

    	//$showSearchForm.show();
    	//$showSearchForm.unbind();
    	//$('#account_details_other_charges_grid').die('click').on('click', 'img.search_cell_search',function (e) {

    		//log(" $showSearchForm ::::::test");
    	//onCellSelect: function (rowid, index, contents, event) {
            //if (grids.otherChargesGrid.isEditable == true) {


//                if (grids.otherChargesGrid.savedSuccessfully === true) {


                    // dialogs.otherChargesSearchFormDialog.reset();
                    // grids.loadOtherChargesSearchFormGrid({
                    //     gridDiv: "#account_details_other_charges_grid_search_form_table"
                    // });

                    // dialogs.otherChargesSearchFormDialog.initialize({
                    //     $searchFormDialogDiv: $("#other_charges_grid_search_form_dialog"),
                    //     $searchFormDialogDivSubmit: $("#other_charges_grid_search_form_submit"),
                    //     $searchFormDialogDivReset: $("#other_charges_grid_search_form_reset"),
                    //     $searchFormDialogDivCancel: $("#other_charges_grid_search_form_cancel"),
                    //     billType:grids.otherChargesGrid.billType
                    // });
                    // grids.otherChargesGrid.$gridDiv.jqGrid('saveRow', grids.otherChargesGrid.selectedRow);
                    // dialogs.otherChargesSearchFormDialog.open();

               // };
           // };
          //});
    },
    showAssociateCodesSearchForm:function($showSearchForm,id){

    	$showSearchForm.show();
    	$showSearchForm.unbind();
    	$(document).die('click').on('click', 'img.searchAssociateCodeImage',function (e) {

    		var obj={};
            var selectedRowData = grids.associationRulesGrid.$gridDiv.jqGrid('getRowData', grids.associationRulesGrid.selectedRow);
           // log('clicked ' + id + " " + grids.associationRulesGrid.$gridDiv.getRowData(id).toSource());
            var predValue = selectedRowData.predCode;
            var sourceCodeType = selectedRowData.sourceCodeType;
            var sourceCode = selectedRowData.sourceCode;

            dialogs.associateRulesSearchFormDialog.reset();
            grids.loadAssociateRulesSearchFormGrid.loadGrid({
                gridDiv: "#associate_rules_other_charges_grid_search_form_table"
            });

            dialogs.associateRulesSearchFormDialog.initialize({
                $searchFormDialogDiv: $("#associate_rules_grid_search_form_dialog"),
                $searchFormDialogDivSubmit: $("#associate_codes_grid_search_form_submit"),
                $searchFormDialogDivReset: $("#associate_codes_grid_search_form_reset"),
                $searchFormDialogDivCancel: $("#associate_codes_grid_search_form_cancel"),
                billType:"PRE"
            });
            dialogs.associateRulesSearchFormDialog.open({'pred':predValue,'sourceType':sourceCodeType,'sourceCode':sourceCode});

          });
    },
    showcciEditsSearchForm:function($showSearchForm,id){
    	log('inside showcciEditsSearchForm')
    	$showSearchForm.show();
    	$showSearchForm.unbind();
    	$($showSearchForm).die('click').on('click', function(e) {


    		if (grids.cciEditsGrid.selectedRow !== undefined) {
                log("submitting + saving row " + grids.cciEditsGrid.selectedRow);
                grids.cciEditsGrid.$gridDiv.jqGrid('saveRow', grids.cciEditsGrid.selectedRow);

            };
    		 //e.preventDefault();
    		var obj={};
            var selectedRowData = grids.cciEditsGrid.$gridDiv.jqGrid('getRowData', grids.cciEditsGrid.selectedRow);
           // log('clicked ' + id + " " + grids.associationRulesGrid.$gridDiv.getRowData(id).toSource());
            var predValue = selectedRowData.hcpcCodea;
            var sourceCodeType = selectedRowData.sourceCodeType;
            var sourceCode = selectedRowData.sourceCode;
            var dateOfService = selectedRowData.dateOfServiceCoding

            //dialogs.associateRulesSearchFormDialog.$searchFormDialogDiv.empty().remove();

            dialogs.cciEditsSearchFormDialog.reset();

            grids.loadCciEditsSearchFormGrid.loadGrid({
                gridDiv: "#cci_edits_other_charges_grid_search_form_table"
            });

            dialogs.cciEditsSearchFormDialog.initialize({
                $searchFormDialogDiv: $("#cci_edits_grid_search_form_dialog"),
                $searchFormDialogDivSubmit: $("#cci_edits_grid_search_form_submit"),
                $searchFormDialogDivReset: $("#associate_codes_grid_search_form_reset"),
                $searchFormDialogDivCancel: $("#cci_edits_grid_search_form_cancel"),
                billType:"PRE"
            });
            dialogs.cciEditsSearchFormDialog.open({'pred':predValue,'dateOfService':dateOfService,'sourceCode':sourceCode});

          });
    },
    createDelRow: function ($addDelDiv, id) {
    	log("test");
    	$addDelDiv.show();
    	$addDelDiv.unbind();
    	$('#account_details_other_charges_grid').die('click').on('click', 'img.search_cell_del',function (e) {
    	//$addDelDiv.on('click', function (e) {

    		// options.processing = true - skip the ajax request to 'clientArray'.

    		myDelOptions = {

    		        onclickSubmit: function(options, rowid) {
    		            var grid_id = $.jgrid.jqID(grids.otherChargesGrid.$gridDiv[0].id),
    		                grid_p = grids.otherChargesGrid.$gridDiv[0].p,
    		                newPage = grid_p.page;

    		            options.processing = true;
    		            grids.otherChargesGrid.$gridDiv.delRowData(rowid);
    		            $.jgrid.hideModal("#delmod"+grid_id,
    		                              {gb:"#gbox_"+grid_id,
    		                              jqm:options.jqModal,onClose:options.onClose});

    		            if (grid_p.lastpage > 1) {
    		                if (grid_p.reccount === 0 && newPage === grid_p.lastpage) {
    		                    newPage--;
    		                }
    		                grids.otherChargesGrid.$gridDiv.trigger("reloadGrid", [{page:newPage}]);
    		            }

    		            return true;
    		        },
    		        processing:true
    		    };

            if (grids.otherChargesGrid.selectedRow !== undefined) {
                log("submitting + saving row " + grids.otherChargesGrid.selectedRow);
                var rowid = grids.otherChargesGrid.$gridDiv.jqGrid('getGridParam', 'selrow');
                grids.otherChargesGrid.$gridDiv.jqGrid('delGridRow',rowid,myDelOptions);
                grids.otherChargesGrid.savedSuccessfully = true;

            };

            return false;
        });
    },


    closeAccountDetails: function () {
         app.screenManager.showScreen(this.backScreen, {
             accountDetailsEditable: (globalvars.user.uType == globalvars.roles.centralAuditor)? true : false,
             showSave: (globalvars.user.uType == globalvars.roles.centralAuditor)? true : false,
             showSubmit: (globalvars.user.uType == globalvars.roles.centralAuditor)? true : false,
             showAddRow: (globalvars.user.uType == globalvars.roles.centralAuditor)? true : false,
             showDelRow: (globalvars.user.uType == globalvars.roles.centralAuditor)? true : false,
             showPType:globalvars.showPType,
             accountDetailsHidden:(globalvars.user.uType == globalvars.roles.centralAuditor)? false : true
        })
    },
    
    showTipOffCommentDialog: function(rowDataJson, rowid,isConfirmCharg){
    	dialogs.showTipOffCommentDialog.initialize({
    		$showTipOffCommentDialogDiv : $("#dialog_tip_off_comment"),
    		data:rowDataJson,
    		rowId: rowid,
            isConfirmCharg:isConfirmCharg
    	});
    },
    getEditableList:function(data){
         var newList=[];
         $(data).each(function (i) {
                if(data[i].rowEditable == "false" || data[i].rowEditable == false)
                    console.log('');
                else
                    newList.push(data[i]);
         });

         return newList;

    },
    startTimerStatus:function(){
       

        if(globalvars.autoSaveCounter >= globalvars.root.autoSaveCounter){
            window.clearInterval(globalvars.refreshIntervalId);
            //globalvars.autoSaveCounter = 0;
            globalvars.refreshIntervalId = null;
            return false;
        }else{
             globalvars.autoSaveCounter++;
             console.log('Auto save executed message::::' + globalvars.autoSaveCounter);

        }

        var screenName = screens.accountDetails.backScreen;
        
        roles.centralAuditor.autoSaveAccountDetails({
                url: globalvars.charges.savedChargesUri,
                type: "PUT",
                screen:screenName
        })

    },
    getIdealResume:function(){

        


        if(globalvars.root.accountAutoSaveTime){
            if(globalvars.root.accountAutoSaveTime > 0 && globalvars.autoSaveCounter <= globalvars.root.autoSaveCounter )
                 globalvars.refreshIntervalId = window.setInterval(screens.accountDetails.startTimerStatus, globalvars.root.accountAutoSaveTime);
        }

    }
};