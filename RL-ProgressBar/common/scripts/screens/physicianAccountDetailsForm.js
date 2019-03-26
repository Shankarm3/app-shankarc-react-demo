screens.physicianAccountDetailsForm = {
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
    localDiagnoses:[],
    initialize: function (param) {
        this.id = getRowIdByValue(param.rowData,param.id);
        console.log(this.id);
        this.rowData = param.rowData;
        globalvars.selectedHospitalId = param.rowData.hospitalId;
        this.accountDetailsEditable = param.accountDetailsEditable === false ? param.accountDetailsEditable : true;
        this.accountDetailsHidden = param.accountDetailsHidden === false ? param.accountDetailsHidden : true;
        this.showSave = param.showSave === false ? param.showSave : true;
        this.showSubmit = param.showSubmit === false ? param.showSubmit : true;
        this.showAddRow = param.showAddRow === false ? param.showAddRow : true;
        this.showDelRow = param.showDelRow === false ? param.showDelRow : true;
        globalvars.showPType = param.showPType;
        this.backScreen = param.backScreen;
        
        //screens.physicianAccountDetailsForm.drawScreen(this.id, param.rowData,param.backScreen);
        //screens.physicianAccountDetailsForm.bindFunctionality(this.id,this.backScreen);
        screens.physicianAccountDetailsForm.admitDate=this.rowData[this.id].admitDate;
        screens.physicianAccountDetailsForm.dischargeDate=this.rowData[this.id].dischargeDate;
        screens.physicianAccountDetailsForm.loadData(this.rowData[this.id].index,this.backScreen);
        globalvars.selectedHospitalId = this.rowData[this.id].hospitalId;
    },

    loadNext: function () {
        this.id += 1;
        var accountId = this.rowData[this.id];
        
        console.log(this.id);
        console.log(accountId);
        if(accountId != undefined){
            globalvars.selectedHospitalId = this.rowData[this.id].hospitalId;
            if(screens.physicianAccountDetailsForm.backScreen == "preBill"){
                 // $.ajax({
                 //     type: 'GET',
                 //     url: globalvars.physicianHospitals[globalvars.selectedPreHospitalIndex].accountScoringCheckUri,
                 //     datatype: 'json',
                 //     success: function(data) {
                 //         if (false){
                 //             dialogs.messageDialog.show({text: globalvars.localResourceMap.account_scoring_check});
                 //         }
                 //         else {
                 //                globalvars.$contentcontainer.empty();
                 //                screens.physicianAccountDetailsForm.loadData(screens.physicianAccountDetailsForm.rowData[screens.physicianAccountDetailsForm.id].index, screens.physicianAccountDetailsForm.backScreen);
                 //                //screens.physicianAccountDetailsForm.drawScreen(screens.physicianAccountDetailsForm.id, screens.physicianAccountDetailsForm.rowData,screens.physicianAccountDetailsForm.backScreen);
                 //                //screens.physicianAccountDetailsForm.bindFunctionality(screens.physicianAccountDetailsForm.id, screens.physicianAccountDetailsForm.backScreen);
                 //                screens.physicianAccountDetailsForm.admitDate=screens.physicianAccountDetailsForm.rowData[screens.physicianAccountDetailsForm.id].admitDate;
                 //                screens.physicianAccountDetailsForm.dischargeDate=screens.physicianAccountDetailsForm.rowData[screens.physicianAccountDetailsForm.id].dischargeDate;
                 //         }
                 //     }
                 // });

                                globalvars.$contentcontainer.empty();
                                screens.physicianAccountDetailsForm.loadData(screens.physicianAccountDetailsForm.rowData[screens.physicianAccountDetailsForm.id].index, screens.physicianAccountDetailsForm.backScreen);
                                //screens.physicianAccountDetailsForm.drawScreen(screens.physicianAccountDetailsForm.id, screens.physicianAccountDetailsForm.rowData,screens.physicianAccountDetailsForm.backScreen);
                                //screens.physicianAccountDetailsForm.bindFunctionality(screens.physicianAccountDetailsForm.id, screens.physicianAccountDetailsForm.backScreen);
                                screens.physicianAccountDetailsForm.admitDate=screens.physicianAccountDetailsForm.rowData[screens.physicianAccountDetailsForm.id].admitDate;
                                screens.physicianAccountDetailsForm.dischargeDate=screens.physicianAccountDetailsForm.rowData[screens.physicianAccountDetailsForm.id].dischargeDate;
                }


            }
        else
            screens.physicianAccountDetailsForm.closeAccountDetails();


    },


    bindFunctionality: function() {
        if (screens.physicianAccountDetailsForm.showSubmit == true) {
            screens.physicianAccountDetailsForm.createSubmit($("#submit_form_detail_data"), this.id,this.backScreen);
           

        };

        if (screens.physicianAccountDetailsForm.showSave == true) {
            screens.physicianAccountDetailsForm.createSaveForLater($("#save_form_detail_data"), this.id,this.backScreen);
        };

        if (screens.physicianAccountDetailsForm.showAddRow == true) {
            screens.physicianAccountDetailsForm.createAddRow($("#addrow_button"), param.id);
//            screens.physicianAccountDetailsForm.showOtherDiscoverSearchForm($("img.search_cell_search"), this.id);
        };

        if (screens.physicianAccountDetailsForm.showDelRow == true) {
 //           screens.physicianAccountDetailsForm.createDelRow($("img.search_cell_del"), this.id);
        };

        if(this.backScreen == "preBill")
            $("#account_details_back_wrapper .account_detail_back_text").text('MRN' +" - "+ screens.physicianAccountDetailsForm.rowData[screens.physicianAccountDetailsForm.id].patientId);


        $("#account_details_back_wrapper .account_detail_back_account").text(globalvars.localResourceMap.account_details_acct + " - " + screens.physicianAccountDetailsForm.rowData[screens.physicianAccountDetailsForm.id].accountId);


        $("#back_account_detail_img").unbind();
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
                screenName:"physicianAccountDetailsForm",
                functionName:"closeAccountDetails"
            });

            dialogs.confirmAccountListDialog.open({
                title: globalvars.localResourceMap.confirm_account_details_title,
                message: globalvars.localResourceMap.confirm_account_details_msg

            });
        }



    },

    loadData: function (id,screenName) {



        $.when(
                
                $.ajax({
                    type: 'GET',
                    url: globalvars.assignedAccounts[id].uriCharges,
                    traditional: true,
                    dataType: 'json'
                })
                      
        ).done(function(data1){
            //console.log(data1);
            globalvars["uriCharges"] = data1;

            $.when(
                        
                        $.ajax({
                            type: 'GET',
                            url: globalvars.uriCharges.uriExistingCharges,
                            traditional: true,
                            dataType: 'json'
                        }),

                        $.ajax({
                            type: 'GET',
                            url: globalvars.uriCharges.uriExistingPhysicianCharges,
                            traditional: true,
                            dataType: 'json'
                        }),

                        $.ajax({
                            type: 'GET',
                            url: globalvars.uriCharges.uriMissingPhysicianCharges,
                            traditional: true,
                            dataType: 'json'
                        }),
                        $.ajax({
                            type: 'GET',
                            url: globalvars.uriCharges.uriOtherDiscoverCharges,
                            traditional: true,
                            dataType: 'json'
                        }),
                        $.ajax({
                            type: 'GET',
                            url: globalvars.uriCharges.uriPhysicianAccountDetail,
                            traditional: true,
                            dataType: 'json'
                        }),
                        $.ajax({
                            type: 'GET',
                            url: globalvars.uriCharges.uriPhysicianAccountStatsPanel,
                            traditional: true,
                            dataType: 'json'
                        }),
                        $.ajax({
                                        type: 'GET',
                                        url: globalvars.uriCharges.uriDiagnoses,
                                        traditional: true,
                                        dataType: 'json'
                                }),

                        $.ajax({
                                        type: 'GET',
                                        url: $.trim(globalvars.uriCharges.uriProcedures),
                                        traditional: true,
                                        dataType: 'json'
                                }),

                        $.ajax({
                                        type: 'GET',
                                        url: $.trim(globalvars.uriCharges.uriHcpcs),
                                        traditional: true,
                                        dataType: 'json'
                                })

                        
                ).done(function(data1, data2, data3,data4, data5, data6,data7,data8,data9){

                    globalvars["physicianExistingCharges"] = data1[0];
                    globalvars["physicianExistingPhysicianCharges"] = data2[0];
                    globalvars["physicianMissingPhysicianCharges"] = data3[0];
                    globalvars["physicianOtherDiscoverCharges"] = data4[0];
                    globalvars["physician"] = data5[0];
                    globalvars["physicianAccountStatsPanel"] = data6[0];
                    globalvars["diagnoses"] = data7[0];
                    globalvars["procedures"] = data8[0];
                    globalvars["hcpcs"] = data9[0];

                    // if(globalvars.physician){
                    //     if(globalvars.physician.length>0){
                    // var localDiagnoses = [
                    //             {diagCode:'Admitting Physician:',description:globalvars.physician[0].admitPhys,'NPI':globalvars.physician[0].physDetail['admitPhysCodeDetail'].npi,'TerminationDate':globalvars.physician[0].physDetail['admitPhysCodeDetail'].terminationDate,'StartDate':globalvars.physician[0].physDetail['admitPhysCodeDetail'].startDate,'specility':globalvars.physician[0].physDetail['admitPhysCodeDetail'].type},
                    //             {diagCode:'Attending Physician:',description:globalvars.physician[0].attndPhys,'NPI':globalvars.physician[0].physDetail['attndPhysCodeDetail'].npi,'TerminationDate':globalvars.physician[0].physDetail['attndPhysCodeDetail'].terminationDate,'StartDate':globalvars.physician[0].physDetail['attndPhysCodeDetail'].startDate,'specility':globalvars.physician[0].physDetail['attndPhysCodeDetail'].type},
                    //             {diagCode:'ER Physician:',description:globalvars.physician[0].erPhys,'NPI':globalvars.physician[0].physDetail['erPhysCodeDetail'].npi,'TerminationDate':globalvars.physician[0].physDetail['erPhysCodeDetail'].terminationDate,'StartDate':globalvars.physician[0].physDetail['erPhysCodeDetail'].startDate,'specility':globalvars.physician[0].physDetail['erPhysCodeDetail'].type},
                    //             {diagCode:'Surgery Physician:',description:globalvars.physician[0].surgPhys,'NPI':globalvars.physician[0].physDetail['surgPhysCodeDetail'].npi,'TerminationDate':globalvars.physician[0].physDetail['surgPhysCodeDetail'].terminationDate,'StartDate':globalvars.physician[0].physDetail['surgPhysCodeDetail'].startDate,'specility':globalvars.physician[0].physDetail['surgPhysCodeDetail'].type},
                    //             {diagCode:'Referring Physician:',description:globalvars.physician[0].referPhys,'NPI':globalvars.physician[0].physDetail['referPhysCodeDetail'].npi,'TerminationDate':globalvars.physician[0].physDetail['referPhysCodeDetail'].terminationDate,'StartDate':globalvars.physician[0].physDetail['referPhysCodeDetail'].startDate,'specility':globalvars.physician[0].physDetail['referPhysCodeDetail'].type},

                    //         ];

                    //     screens.physicianAccountDetailsForm.localDiagnoses = localDiagnoses;
                    // }else{
                    //     defaultDataDiagnoses();
                    // }
                    //  }else{
                    //     defaultDataDiagnoses();
                    //  }

                    screens.physicianAccountDetailsForm.drawScreen(screens.physicianAccountDetailsForm.id, screens.physicianAccountDetailsForm.rowData, screens.physicianAccountDetailsForm.backScreen);
                    screens.physicianAccountDetailsForm.bindFunctionality(screens.physicianAccountDetailsForm.id, screens.physicianAccountDetailsForm.backScreen);

                });

                // function defaultDataDiagnoses(){
                //     console.log('test');
                //      var localDiagnoses = [
                //                         {diagCode:'Admitting Physician:',description:'','NPI':'','TerminationDate':'','StartDate':'','specility':''},
                //                         {diagCode:'Attending Physician:',description:'','NPI':'','TerminationDate':'','StartDate':'','specility':''},
                //                         {diagCode:'ER Physician:',description:'','NPI':'','TerminationDate':'','StartDate':'','specility':''},
                //                         {diagCode:'Surgery Physician:',description:'','NPI':'','TerminationDate':'','StartDate':'','specility':''},
                //                         {diagCode:'Referring Physician:',description:'','NPI':'','TerminationDate':'','StartDate':'','specility':''}
                //                         ]
                //     screens.physicianAccountDetailsForm.localDiagnoses = localDiagnoses;
                // }
            

        });


        //globalvars.assignedAccounts.chargesMasterLookupUri=globalvars.assignedAccounts[id].chargesMasterLookupUri;
         

    },



    drawScreen: function (id, rowData, screenName) {
        getSYNC('common/templates/screens/physicianAccountDetailsForm.html', function (data) {
            log('loading account details template');
            globalvars.$contentcontainer.append($.nano(data, globalvars.localResourceMap));
        });


       /* account details table */

       //var data = [{"physicianType":"admit","name":"Dr. michal dicosta", "Employed":"true"},{"physicianType":"admit","name":"Dr. michal dicosta1", "Employed":"false"},{"physicianType":"admit","name":"Dr. michal dicosta2", "Employed":"false"},{"physicianType":"admit","name":"Dr. michal dicosta3", "Employed":"true"},{"physicianType":"admit","name":"Dr. michal dicosta4", "Employed":"true"}]
       // globalvars.physician = data;

        $.get('common/templates/physician_details.html', function (data) {
            $("#account_details_physician_table").empty();
            var tempHtml = "";

            //globalvars.missingPhysicianData=[];
            $(globalvars.physician).each(function (i) {
                tempHtml += $.nano(data, globalvars.physician[i]);
           
            });
            $("#account_details_physician_table").append(tempHtml);

    

            $('[data-log="true"]').css('color','#0000FF');
            $('.account_details_code').tooltip();
            $('.account_details_code_value').tooltip();
        });


        

        $("#account_details_hospital_charges_grid").empty();
        $("#account_details_hospital_charges_grid").append('<div id="account_details_hospital_charges_grid_table"></div>');

        pqgridPhysician.existingHospitalChargesGrid.initialize({
                data: (globalvars.physicianExistingCharges!= null)?globalvars.physicianExistingCharges:[],
                gridDiv: "#account_details_hospital_charges_grid_table",
                isEditable: this.accountDetailsEditable
            });

        // $("#account_details_existing_charges_grid").empty();
        // $("#account_details_existing_charges_grid").append('<div id="account_details_existing_charges_grid_table"></div>');

        gridPhysician.existingPhysicianChargesGrid.initialize({
            data: (globalvars.physicianExistingPhysicianCharges!= null)?globalvars.physicianExistingPhysicianCharges:[],
            gridDiv: "#account_details_existing_charges_grid_table",
            isEditable: this.accountDetailsEditable
        });

        // globalvars.diagnoses = [{"uri":"http://172.20.3.235:10000/rl-cp-web-ui/resources/diagnoses/97081","diagCode":"97081","description":"POISONING BY COCAINE"},{"uri":"http://172.20.3.235:10000/rl-cp-web-ui/resources/diagnoses/72888","diagCode":"72888","description":"RHABDOMYOLYSIS"},{"uri":"http://172.20.3.235:10000/rl-cp-web-ui/resources/diagnoses/34982","diagCode":"34982","description":"TOXIC ENCEPHALOPATHY"},{"uri":"http://172.20.3.235:10000/rl-cp-web-ui/resources/diagnoses/29570","diagCode":"29570","description":"SCHIZOAFFECTIVE DIS NOS"},{"uri":"http://172.20.3.235:10000/rl-cp-web-ui/resources/diagnoses/30560","diagCode":"30560","description":"COCAINE ABUSE-UNSPEC"},{"uri":"http://172.20.3.235:10000/rl-cp-web-ui/resources/diagnoses/V4987","diagCode":"V4987","description":"PHYSICAL RESTRAIN STATUS"},{"uri":"http://172.20.3.235:10000/rl-cp-web-ui/resources/diagnoses/30393","diagCode":"30393","description":"ALCOH DEP NEC/NOS-REMISS"},{"uri":"http://172.20.3.235:10000/rl-cp-web-ui/resources/diagnoses/79431","diagCode":"79431","description":"ABNORM ELECTROCARDIOGRAM"},{"uri":"http://172.20.3.235:10000/rl-cp-web-ui/resources/diagnoses/29690","diagCode":"29690","description":"EPISODIC MOOD DISORD NOS"},{"uri":"http://172.20.3.235:10000/rl-cp-web-ui/resources/diagnoses/V0382","diagCode":"V0382","description":"ND VAC STRPTCS PNEUMNI B"},{"uri":"http://172.20.3.235:10000/rl-cp-web-ui/resources/diagnoses/E8490","diagCode":"E8490","description":"ACCIDENT IN HOME"},{"uri":"http://172.20.3.235:10000/rl-cp-web-ui/resources/diagnoses/E9504","diagCode":"E9504","description":"POISON-DRUG/MEDICIN NEC"}]
        // globalvars.procedures = [{"uri":"http://172.20.3.235:10000/rl-cp-web-ui/resources/procedures/9955","procCode":"9955","description":"VACCINATION NEC"}]
        // globalvars.hcpcs = [{"uri":"http://172.20.3.235:10000/rl-cp-web-ui/resources/hcpcs/82948%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20","hcpcCode":"82948               ","description":"STICK ASSAY OF BLOOD GLUCOSE"},{"uri":"http://172.20.3.235:10000/rl-cp-web-ui/resources/hcpcs/G0463%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20","hcpcCode":"G0463               ","description":"HOSPITAL OUTPATIENT CLINIC VISIT FOR ASSESSMENT AND MANAGEME"}]

        $.get('common/templates/diagnoses.html', function (data) {
            $("#account_details_diagnoses_table").empty();
            var tempHtml = "";
            //globalvars.missingDiagData=[];
            $(globalvars.diagnoses).each(function (i) {
                tempHtml += $.nano(data, globalvars.diagnoses[i]);
               // globalvars.missingDiagData.push(globalvars.diagnoses[i].diagCode)
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


        gridPhysician.missingPhysicianChargesGrid.initialize({
            data: (globalvars.physicianMissingPhysicianCharges!= null)?globalvars.physicianMissingPhysicianCharges:[],
            gridDiv: "#account_details_missing_charges_grid_table",
            isEditable: this.accountDetailsEditable,
            isHidden: this.accountDetailsHidden,
            screenName: (screenName == "preBill")?"PRE":"POST",
            backScreen:screenName
        });


        $('.ui-multiselect-menu').css('width', 'auto');
        $('#filterRow .ui-multiselect').css('background', '#fff');

        gridPhysician.otherPhysicianChargesGrid.initialize({
                data: (globalvars.physicianOtherDiscoverCharges!= null)?globalvars.physicianOtherDiscoverCharges:[],
                gridDiv: "#account_details_other_charges_grid_table",
                isEditable: this.accountDetailsEditable,
                screenName: (screenName == "preBill")?"PRE":"POST",
                backScreen:screenName
            });
        
        // var chartdata=globalvars.physicianAccountStatsPanel[0];
        // charts.physicianAccountsWidgetBarChart.initialize({
        //     //completed: param.current.reviewRate,
        //     yaxis:['OverAll','SSN','DoB','Last Name','First Name'],
        //     xaxis:[chartdata.matchOverall,chartdata.matchSsn,chartdata.matchDob,chartdata.matchLname,chartdata.matchFname],
        //     container: 'physician_last_month_data',
        //     //total: 100,
        //     //type:'review'
        // });



        $('#account_details_hospital_charges_grid_table').css('min-height','40px');

        $.get('common/templates/physician_account_details.html?1123', function (data) {
            var selRowData = rowData[id];
            // if(!globalvars.showPType)
            //     selRowData.patTypeWithDescription = selRowData.patSubTypeWithDescription
            selRowData.hospShortName = selRowData.shortName;//globalvars.physicianHospitals[globalvars.selectedPreHospitalIndex].shortName;
            selRowData.shortName =  selRowData.shortName;//globalvars.physicianHospitals[globalvars.selectedPreHospitalIndex].shortName;
            selRowData.chartdata = globalvars.physicianAccountStatsPanel[0];
            $("#account_details_table").html($.nano(data, jQuery.extend(true, {}, selRowData, globalvars.localResourceMap)));
            
            $('.accountHeader').tooltip();
            //  $('#header_second_row').tooltip({
            //     content: function() {
            //         return "<strong>Hi!</strong>"
            //     }
            //     //"' "<b>Assigned to: </b>" + selRowData.hospShortName+"<br/><b>Submitted on: </b>" + selRowData.shortName;
                
            // })    
           
        });

       

         $('#demo1').niceScroll({cursorwidth: '7px', autohidemode: true, zindex: 999,cursorcolor:'#E4E4E4',hidecursordelay:200 });
         $('#demo2').niceScroll({cursorwidth: '7px', autohidemode: true, zindex: 999,cursorcolor:'#E4E4E4',hidecursordelay:200 });
         $('#demo3').niceScroll({cursorwidth: '7px', autohidemode: true, zindex: 999,cursorcolor:'#E4E4E4',hidecursordelay:200 });
         $('#demo4').niceScroll({cursorwidth: '7px', autohidemode: true, zindex: 999,cursorcolor:'#E4E4E4',hidecursordelay:200 });
         $('#demo5').niceScroll({cursorwidth: '7px', autohidemode: true, zindex: 999,cursorcolor:'#E4E4E4',hidecursordelay:200 });



         $("#demo1").mouseover(function() {
          $("#demo1").getNiceScroll().resize();
        });

         $("#demo2").mouseover(function() {
          $("#demo2").getNiceScroll().resize();
        });

         $("#demo3").mouseover(function() {
          $("#demo3").getNiceScroll().resize();
        });

         $("#demo4").mouseover(function() {
          $("#demo4").getNiceScroll().resize();
        });

         $("#demo5").mouseover(function() {
          $("#demo5").getNiceScroll().resize();
        });
        
         globalvars.missingDropDownData={};
         globalvars.otherDropDownData={};
         globalvars.appModDataPrice={};

    },

    createSaveForLater: function ($saveForLaterDiv, id,screenName) {
        $saveForLaterDiv.show();
        $saveForLaterDiv.unbind();
        $saveForLaterDiv.click(function () {

            if (gridPhysician.existingHospitalChargesGrid.selectedRow !== undefined) {
                log("submitting + saving row " + gridPhysician.existingHospitalChargesGrid.selectedRow);
                gridPhysician.existingHospitalChargesGrid.$gridDiv.jqGrid('saveRow', gridPhysician.existingHospitalChargesGrid.selectedRow);
            };

            if (gridPhysician.existingPhysicianChargesGrid.selectedRow !== undefined) {
                log("submitting + saving row " + gridPhysician.existingPhysicianChargesGrid.selectedRow);
                gridPhysician.existingPhysicianChargesGrid.$gridDiv.jqGrid('saveRow', gridPhysician.existingPhysicianChargesGrid.selectedRow);
            };

            if (gridPhysician.missingPhysicianChargesGrid.selectedRow !== undefined) {
                log("submitting + saving row " + gridPhysician.missingPhysicianChargesGrid.selectedRow);
                gridPhysician.missingPhysicianChargesGrid.$gridDiv.jqGrid('saveRow', gridPhysician.missingPhysicianChargesGrid.selectedRow);
            };

            if (gridPhysician.otherPhysicianChargesGrid.selectedRow !== undefined) {
                log("submitting + saving row " + gridPhysician.otherPhysicianChargesGrid.selectedRow);
                gridPhysician.otherPhysicianChargesGrid.$gridDiv.jqGrid('saveRow', gridPhysician.otherPhysicianChargesGrid.selectedRow);
            };


            var index = screens.physicianAccountDetailsForm.rowData[screens.physicianAccountDetailsForm.id].index

            var saveChargesUri;

            if(screenName == "preBill" ){
                if (gridPhysician.existingHospitalChargesGrid.savedSuccessfully == true && gridPhysician.existingPhysicianChargesGrid.savedSuccessfully == true && gridPhysician.missingPhysicianChargesGrid.savedSuccessfully == true && gridPhysician.otherPhysicianChargesGrid.savedSuccessfully) {
                    dialogs.physicianSubmitAccountDetailsDialog.open({
                        url: globalvars.uriCharges.savedChargesUri,
                        detailId: id,
                        type:'PUT',
                        baseScreen:"physicianAccountDetailsForm",
                        title: globalvars.localResourceMap.save_account_details_dialog_title,
                        message: globalvars.localResourceMap.save_account_details_dialog_msg
                    });
                };
            }

        });
    },

    createSubmit: function ($submitDiv, id,screenName) {

        $submitDiv.show();
        $submitDiv.unbind();

        $submitDiv.click(function () {
            
            if (gridPhysician.existingHospitalChargesGrid.selectedRow !== undefined) {
                log("submitting + saving row " + gridPhysician.existingHospitalChargesGrid.selectedRow);
                gridPhysician.existingHospitalChargesGrid.$gridDiv.jqGrid('saveRow', gridPhysician.existingHospitalChargesGrid.selectedRow);
            };

            if (gridPhysician.existingPhysicianChargesGrid.selectedRow !== undefined) {
                log("submitting + saving row " + gridPhysician.existingPhysicianChargesGrid.selectedRow);
                gridPhysician.existingPhysicianChargesGrid.$gridDiv.jqGrid('saveRow', gridPhysician.existingPhysicianChargesGrid.selectedRow);
            };

            if (gridPhysician.missingPhysicianChargesGrid.selectedRow !== undefined) {
                log("submitting + saving row " + gridPhysician.missingPhysicianChargesGrid.selectedRow);
                gridPhysician.missingPhysicianChargesGrid.$gridDiv.jqGrid('saveRow', gridPhysician.missingPhysicianChargesGrid.selectedRow);
            };

            if (gridPhysician.otherPhysicianChargesGrid.selectedRow !== undefined) {
                log("submitting + saving row " + gridPhysician.otherPhysicianChargesGrid.selectedRow);
                gridPhysician.otherPhysicianChargesGrid.$gridDiv.jqGrid('saveRow', gridPhysician.otherPhysicianChargesGrid.selectedRow);
            };


            function validateMissingCharges() {

                var missingChargesData = screens.physicianAccountDetailsForm.getEditableList(gridPhysician.missingPhysicianChargesGrid.$gridDiv.getRowData());
                var otherChargesData = screens.physicianAccountDetailsForm.getEditableList(gridPhysician.otherPhysicianChargesGrid.$gridDiv.getRowData());
                var errorResponses = false;
                var errorQty = false;
                var errorPos = false;
                var errorPhysician = false;
                
                var errorDiag = false;
                var errorPrimaryDiag = false;
                var errorDateOfService = false;
                var errorDateOfServiceOther = false;
                var errorHcpcOther = false;
                var errorPosOther = false;
                var errorNpiOther= false;
                var errorDiagOther= false;
                var errorPrimaryDiagOther= false;
                var errorhcpcChargeCode = false
                var errorDept = false;
                var errorDeptOther = false;
               
                for (var i = 0; i < missingChargesData.length; i++) {
                    



                    if (missingChargesData[i].response == "" && missingChargesData[i].cenAuditorId == globalvars.user.userId) {
                        errorResponses = true;
                    };




                    var validitor;
                    if(globalvars.client == "CP"){
                        validitor=(missingChargesData[i].responseCode == 'Y' || missingChargesData[i].responseCode == 'C' ||missingChargesData[i].responseCode == 'W'||missingChargesData[i].responseCode == 'T')?true:false;
                    }else{
                        validitor=(missingChargesData[i].responseCode == 'Y')?true:false;
                    }
                    
                    if(validitor && missingChargesData[i].hcpcCode == ""){
                        errorhcpcChargeCode = true;
                    }

                    if(validitor && missingChargesData[i].qty < 1){
                        errorQty=true;
                    }

                    if(validitor && missingChargesData[i].pos == ""){
                        errorPos=true;
                    }

                    if(validitor && missingChargesData[i].deptPhys == ""){
                        if(globalvars.client != "MSH"){
                                errorDept=true;
                        }
                    }

                    if(validitor && missingChargesData[i].npi == ""){
                        errorPhysician=true;
                    }

                    if(validitor && missingChargesData[i].diag == ""){
                        errorDiag=true;
                    }

                    if(validitor && missingChargesData[i].primaryDiag == ""){
                        errorPrimaryDiag=true;
                    }

                    if(validitor && missingChargesData[i].npi == ""){
                        errorPhysician=true;
                    }
                   
                    if(missingChargesData[i].dateOfService =="" && missingChargesData[i].qty != 0 && validitor)
                        {
                            errorDateOfService=true;
                        }
                };

                
                for (var i = 0; i < otherChargesData.length; i++) {
                        
                        if(otherChargesData[i].dateOfService1 =="" && otherChargesData[i].qty != 0)
                        {
                         errorDateOfServiceOther=true;
                        }

                        if(otherChargesData[i].hcpcCode =="" && otherChargesData[i].qty != 0)
                        {
                         errorHcpcOther=true;
                        }

                        if(otherChargesData[i].pos =="" && otherChargesData[i].qty != 0)
                        {
                         errorPosOther=true;
                        }

                        if(otherChargesData[i].deptPhys =="" && otherChargesData[i].qty != 0)
                        {
                            if(globalvars.client != "MSH"){
                                errorDeptOther=true;
                            }
                        }

                        if(otherChargesData[i].diag =="" && otherChargesData[i].qty != 0)
                        {
                         errorDiagOther=true;
                        }

                        if(otherChargesData[i].primaryDiag =="" && otherChargesData[i].qty != 0)
                        {
                         errorPrimaryDiagOther=true;
                        }

                        if(otherChargesData[i].npi =="" && otherChargesData[i].qty != 0)
                        {
                         errorNpiOther=true;
                        }


                     
                };



                if (errorResponses) {
                    dialogs.messageDialog.show({
                        text: globalvars.localResourceMap.missing_physician_validation_msg4,
                        title: globalvars.localResourceMap.error
                    });
                    return false;
                }
                else if(errorhcpcChargeCode){
                     dialogs.messageDialog.show({
                         text: globalvars.localResourceMap.missing_physician_validation_msg6,
                         title: globalvars.localResourceMap.error
                     });
                     return false;
                }

                else if (errorPos) {
                    dialogs.messageDialog.show({
                        text: 'Please select the POS before submitting',
                        title: globalvars.localResourceMap.error
                    });
                    return false;
                }
                else if (errorDept) {
                    dialogs.messageDialog.show({
                        text: 'Please select the Dept before submitting',
                        title: globalvars.localResourceMap.error
                    });
                    return false;
                }

                else if (errorPhysician) {
                    dialogs.messageDialog.show({
                        text: 'Please select the Physician before submitting',
                        title: globalvars.localResourceMap.error
                    });
                    return false;
                }
                 else if (errorDiag) {
                    dialogs.messageDialog.show({
                        text: 'Please select the diagnoses code before submitting',
                        title: globalvars.localResourceMap.error
                    });
                    return false;
                }
                 else if (errorPrimaryDiag) {
                    dialogs.messageDialog.show({
                        text: 'Please select the primary diagnoses code before submitting',
                        title: globalvars.localResourceMap.error
                    });
                    return false;
                }
                 else if (errorQty) {
                    dialogs.messageDialog.show({
                        text: globalvars.localResourceMap.missing_physician_validation_msg2,
                        title: globalvars.localResourceMap.error
                    });
                    return false;
                }
                
                else if (errorDateOfService) {

                    dialogs.messageDialog.show({
                        text: globalvars.localResourceMap.missing_physician_validation_msg5,
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
                else if(errorHcpcOther){
                     dialogs.messageDialog.show({
                         text: 'Select HCPC to all Other Discovered Charges before submitting',
                         title: globalvars.localResourceMap.error
                     });
                     return false;
                }

                else if (errorPosOther) {
                    dialogs.messageDialog.show({
                        text: 'Select Pos to all Other Discovered Charges before submitting',
                        title: globalvars.localResourceMap.error
                    });
                    return false;
                }
                else if (errorDeptOther) {
                    dialogs.messageDialog.show({
                        text: 'Please select the Dept before submitting',
                        title: globalvars.localResourceMap.error
                    });
                    return false;
                }

                 else if (errorNpiOther) {
                    dialogs.messageDialog.show({
                    text: 'Select Physician to all Other Discovered Charges before submitting',
                        title: globalvars.localResourceMap.error
                    });
                    return false;
                }
                else if (errorDiagOther) {
                    dialogs.messageDialog.show({
                    text: 'Select diagnoses code to all Other Discovered Charges before submitting',
                        title: globalvars.localResourceMap.error
                    });
                    return false;
                }
                else if (errorPrimaryDiagOther) {
                    dialogs.messageDialog.show({
                    text: 'Select Primary diagnoses code to all Other Discovered Charges before submitting',
                        title: globalvars.localResourceMap.error
                    });
                    return false;
                }
                else {
                    return true;
                };



            }

            var index = screens.physicianAccountDetailsForm.rowData[screens.physicianAccountDetailsForm.id].index
            var submitChargesUri;

            if (screenName == "preBill") {
                //submitChargesUri = globalvars.charges.submittedChargesUriPreBill;
                if (gridPhysician.existingHospitalChargesGrid.savedSuccessfully == true && gridPhysician.existingPhysicianChargesGrid.savedSuccessfully == true && gridPhysician.missingPhysicianChargesGrid.savedSuccessfully == true && gridPhysician.otherPhysicianChargesGrid.savedSuccessfully ==true &&  validateMissingCharges()){

                    log(globalvars.localResourceMap.submit_account_details_dialog_title + " " + globalvars.localResourceMap.submit_account_details_dialog_msg);
                    dialogs.physicianSubmitAccountDetailsDialog.open({
                        url: globalvars.uriCharges.submittedChargesUri,
                        type: 'POST',
                        detailId: id,
                        baseScreen:"physicianAccountDetailsForm",
                        title: globalvars.localResourceMap.submit_account_details_dialog_title,
                        message: globalvars.localResourceMap.submit_account_details_dialog_msg

                    });
                };
            }



        });


    },

    createAddRow: function ($addRowDiv, id) {
        $addRowDiv.show();
        $addRowDiv.unbind();
        $addRowDiv.bind('click', function (e) {

            if (gridPhysician.otherPhysicianChargesGrid.selectedRow !== undefined) {
                log("submitting + saving row " + gridPhysician.otherPhysicianChargesGrid.selectedRow);
                gridPhysician.otherPhysicianChargesGrid.$gridDiv.jqGrid('saveRow', gridPhysician.otherPhysicianChargesGrid.selectedRow);

            };

            if (gridPhysician.otherPhysicianChargesGrid.savedSuccessfully == true) {
                var searchDiv = '<div class="other_discover_search_wrapper"><img class="search_cell_del" src="common/images/account-details/delete-icon.png"><img class="search_cell_search" src="common/images/account-details/search-icon.png"></div>';

                var otherchargesgrid_data = gridPhysician.otherPhysicianChargesGrid.$gridDiv.jqGrid('getRowData');
                
                var otherchargesgrid_data_newrow;
                if(otherchargesgrid_data.length > 0)
                    otherchargesgrid_data_newrow = parseInt(otherchargesgrid_data[otherchargesgrid_data.length-1].id) + 1;
                else
                    otherchargesgrid_data_newrow = 1

                var costCenter="";
                if(globalvars.physicianMissingPhysicianCharges && globalvars.physicianMissingPhysicianCharges.length >0){
                //    costCenter = globalvars.physicianMissingPhysicianCharges[0].costCenter;
                 //   console.log(costCenter);
                }
                var newrow = { id: otherchargesgrid_data_newrow, search: "", hcpcCode: "", dept: "", chargeCode: "", quantity:1, comments: "",method:"",source:"",costCenter:costCenter,rowEditable:true};
                gridPhysician.otherPhysicianChargesGrid.$gridDiv.jqGrid('addRowData', otherchargesgrid_data_newrow, newrow);
                gridPhysician.otherPhysicianChargesGrid.$gridDiv.jqGrid('setCell', otherchargesgrid_data_newrow, 'search', searchDiv, '');
                log("New Row added to Other Charges Grid as row " + otherchargesgrid_data_newrow);
                gridPhysician.otherPhysicianChargesGrid.$gridDiv.setGridParam({ rowNum: 30 }).trigger("reloadGrid");
                gridPhysician.otherPhysicianChargesGrid.$gridDiv.setSelection(otherchargesgrid_data_newrow, true);
                gridPhysician.otherPhysicianChargesGrid.savedSuccessfully = false;
                $("#account_details_other_charges_grid .ui-jqgrid-bdiv").scrollTop($("#account_details_other_charges_grid .ui-jqgrid-bdiv")[0].scrollHeight);
            }

            return false;
        });
    },
//     showOtherDiscoverSearchForm:function($showSearchForm,id){

//         $('#account_details_other_charges_grid').die('click').on('click', 'img.search_cell_search',function (e) {

//             log(" $showSearchForm ::::::test");
//         //onCellSelect: function (rowid, index, contents, event) {
//             if (gridPhysician.otherPhysicianChargesGrid.isEditable == true) {


// //                if (gridPhysician.otherChargesGrid.savedSuccessfully === true) {


//                     dialogs.otherPhysicianChargesSearchFormDialog.reset();
//                     gridPhysician.loadOtherPhyChargesSearchFormGrid({
//                         gridDiv: "#account_details_other_charges_physician_grid_search_form_table"
//                     });

//                     dialogs.otherPhysicianChargesSearchFormDialog.initialize({
//                         $searchFormDialogDiv: $("#other_charges_grid_physician_search_form_dialog"),
//                         $searchFormDialogDivSubmit: $("#other_charges_grid_physician_search_form_submit"),
//                         $searchFormDialogDivReset: $("#other_charges_grid_physician_search_form_reset"),
//                         $searchFormDialogDivCancel: $("#other_charges_grid_physician_search_form_cancel"),
//                         billType:gridPhysician.otherPhysicianChargesGrid.billType,
//                         screenName:"other"
//                     });
//                     dialogs.otherPhysicianChargesSearchFormDialog.open();

//                // };
//             };
//           });
//     },
    
    // createDelRow: function ($addDelDiv, id) {
    //     log("test");
    //     $addDelDiv.show();
    //     $addDelDiv.unbind();
    //     $('#account_details_other_charges_grid').die('click').on('click', 'img.search_cell_del',function (e) {
    //     //$addDelDiv.on('click', function (e) {

    //         // options.processing = true - skip the ajax request to 'clientArray'.

    //         myDelOptions = {

    //                 onclickSubmit: function(options, rowid) {
    //                     var grid_id = $.jgrid.jqID(gridPhysician.otherPhysicianChargesGrid.$gridDiv[0].id),
    //                         grid_p = gridPhysician.otherPhysicianChargesGrid.$gridDiv[0].p,
    //                         newPage = grid_p.page;

    //                     options.processing = true;
    //                     gridPhysician.otherPhysicianChargesGrid.$gridDiv.delRowData(rowid);
    //                     $.jgrid.hideModal("#delmod"+grid_id,
    //                                       {gb:"#gbox_"+grid_id,
    //                                       jqm:options.jqModal,onClose:options.onClose});

    //                     if (grid_p.lastpage > 1) {
    //                         if (grid_p.reccount === 0 && newPage === grid_p.lastpage) {
    //                             newPage--;
    //                         }
    //                         gridPhysician.otherPhysicianChargesGrid.$gridDiv.trigger("reloadGrid", [{page:newPage}]);
    //                     }
    //                     gridPhysician.otherPhysicianChargesGrid.$gridDiv.trigger("reloadGrid");

    //                     return true;
    //                 },
    //                 processing:true
    //             };

    //         if (gridPhysician.otherPhysicianChargesGrid.selectedRow !== undefined) {
    //             log("submitting + saving row " + gridPhysician.otherPhysicianChargesGrid.selectedRow);
    //             var rowid = gridPhysician.otherPhysicianChargesGrid.$gridDiv.jqGrid('getGridParam', 'selrow');
    //             gridPhysician.otherPhysicianChargesGrid.$gridDiv.jqGrid('delGridRow',rowid,myDelOptions);
    //             gridPhysician.otherPhysicianChargesGrid.savedSuccessfully = true;

    //         };

    //         return false;
    //     });
    // },


    closeAccountDetails: function () {
        pqgridPhysician.physicianBillAccountReviewGrid.$gridDiv.pqGrid=undefined;
         app.screenManager.showScreen('physicianAccountDetails', {
             
             showSave: (globalvars.user.uType == globalvars.roles.physicianUser)? true : false,
             showSubmit: (globalvars.user.uType == globalvars.roles.physicianUser)? true : false,
             accountDetailsHidden:(globalvars.user.uType == globalvars.roles.physicianUser)? false : true
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

    }
};