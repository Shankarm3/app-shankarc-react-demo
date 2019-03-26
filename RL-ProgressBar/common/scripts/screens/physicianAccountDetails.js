screens.physicianAccountDetails = {
    accountsGridDiv: "",
    $accountsGrid: {},
    initParameters: {},
    initialize: function(param) {
        //this.accountsGridDiv = "#prebill_grid_table";
        //this.$accountsGrid = $("#prebill_grid_table");
        this.initParameters = param;

        $.when( roles.physicianUser.checkLoadedHospitals() ).then(function(){
            if (globalvars.physicianHospitals.length > 0) {
                screens.physicianAccountDetails.drawScreen();
                screens.physicianAccountDetails.bindFunctionality();
            }
            else
                dialogs.messageDialog.show({text: globalvars.localResourceMap.central_auditor_no_hospital_assign});
        });
                pqgridPhysician.physicianBillAccountReviewGrid.$gridDiv.pqGrid=undefined;


    },
    loadData: function(filterParameters) {

        var selectedHospId = $('input:radio[name=facility]:checked').val();
        var selectedCostCenter = $('input:radio[name=costCenter]:checked').val();
     
        if(globalvars.user.uType == globalvars.roles.physicianSupervisor || globalvars.user.uType == globalvars.roles.administrator || globalvars.user.uType == globalvars.roles.physicianRPTUser){
            
            $.when(

                $.ajax({
                        type: 'GET',
                        url:globalvars.root.uriPhysicianAccounts + "?hospitalId=" +selectedHospId + "&costCenter=" + selectedCostCenter,                   
                        data:filterParameters,
                        traditional: true,
                        dataType: 'json'
                    }),
                    
                    $.ajax({
                        type: 'GET',
                        url:globalvars.root.uriPhysicianAccountsInfo + "?hospitalId=" +selectedHospId + "&costCenter=" + selectedCostCenter,
                        data:filterParameters,
                        traditional: true,
                        dataType: 'json'
                    })


            ).done(function(data1, data2){

                globalvars["assignedAccounts"] = data1[0];
                globalvars["assignedAccountsInfo"] = data2[0];
                if (globalvars.assignedAccounts.length == 0) {
                    dialogs.messageDialog.show({text: 'No account available for the facility'});
                }
                $('#search_missing_code').hide();
                $('#search_missing_icon').hide();
                screens.physicianAccountDetails.populatePQData();
                
                 if(globalvars.assignedAccounts.length > 0){
                        pqgridPhysician.physicianBillAccountReviewGrid.reloadGrid.call(pqgridPhysician.physicianBillAccountReviewGrid, "");
                    }else{
                        pqgridPhysician.physicianBillAccountReviewGrid.$gridDiv.pqGrid("refreshDataAndView");

                    }

                //pqgridPhysician.physicianBillAccountReviewGrid.reloadGrid.call(pqgridPhysician.physicianBillAccountReviewGrid, "");
                //screens.physicianAccountDetails.bindFunctionality();
                //gridPhysician.physicianBillAccountReviewGrid.reloadGrid.call(gridPhysician.physicianBillAccountReviewGrid, "");

            });
                       
            
        }else{


             /* Load PREBILL JSON resource */
            $.when(
                    
                
                
                    $.ajax({
                        type: 'GET',
                        url:globalvars.root.uriPhysicianAccounts + "?hospitalId=" +selectedHospId + "&costCenter=" + selectedCostCenter,                   
                        traditional: true,
                        dataType: 'json'
                    }),
                    
                    $.ajax({
                        type: 'GET',
                        url:globalvars.root.uriPhysicianAccountsInfo + "?hospitalId=" +selectedHospId + "&costCenter=" + selectedCostCenter,
                        traditional: true,
                        dataType: 'json'
                    })
                    
            ).done(function(data1, data2){
                
                globalvars["assignedAccounts"] = data1[0];
                globalvars["assignedAccountsInfo"] = data2[0];
                if (globalvars.assignedAccounts.length == 0) {
                    dialogs.messageDialog.show({text: globalvars.localResourceMap.no_account_pending_msg});
                }

                    screens.physicianAccountDetails.populatePQData();
                    if(globalvars.assignedAccounts.length > 0){
                        pqgridPhysician.physicianBillAccountReviewGrid.reloadGrid.call(pqgridPhysician.physicianBillAccountReviewGrid, "");
                    }else{
                        pqgridPhysician.physicianBillAccountReviewGrid.$gridDiv.pqGrid("refreshDataAndView");

                    }
               
                        $('#search_missing_code').hide();
                        $('#search_missing_icon').hide();
                  
                

            })
        }
        
        

    },
    showCharts: function() {
        /* Account single bar chart */

        charts.barChart.initialize({
            completed: globalvars.assignedAccountsInfo.currHitRate,
            targetId: 'bill_hit_chart_container',
            total: 100,
            type: 'hit',
            barHeight: 15
        });

        charts.barChart.initialize({
            completed: globalvars.assignedAccountsInfo.currReviewRate,
            targetId: 'bill_review_chart_container',
            total: 100,
            type: 'review',
            barHeight: 15
        });

        charts.barChart.initialize({
            completed: globalvars.assignedAccountsInfo.prevHitRate,
            targetId: 'bill_hit_chart_container_last_month',
            total: 100,
            type: 'hit',
            barHeight: 15
        });

        charts.barChart.initialize({
            completed: globalvars.assignedAccountsInfo.prevReviewRate,
            targetId: 'bill_review_chart_container_last_month',
            total: 100,
            type: 'review',
            barHeight: 15
        });

        charts.barChart.initialize({
            completed: globalvars.assignedAccountsInfo.completed,
            targetId: 'selected_facility_total_account_chart',
            total: (globalvars.assignedAccountsInfo.total != 0) ? globalvars.assignedAccountsInfo.total : $('#selected_facility_total_account_chart').width(),
            type: 'AccountChart'

        });

         var selectedFacilitity = $('.filter_block input:radio[name=facility]:checked').val();
         var selectedFacilitityName = $('.filter_block input:radio[name=facility]:checked').parent().text();

        //selected facility 

        $(".selected_facility_value").text(selectedFacilitity);
        //$(".selected_facility_name").text("( " + selectedFacilitityName + " )");
        $('#selected_total_account_value').text(globalvars.localResourceMap.accounts_total + " " + globalvars.assignedAccountsInfo.total);
        $('#selected_completed_account_value').text(globalvars.localResourceMap.accounts_completed + " " + globalvars.assignedAccountsInfo.completed);
        $('#selected_remaining_account_value').text(globalvars.localResourceMap.accounts_remaining + " " + (globalvars.assignedAccountsInfo.total - globalvars.assignedAccountsInfo.completed));





        // current Month

        $('#amount_value_label_curr_month').text('$' + chartsCurrencyFormatter(globalvars.assignedAccountsInfo.currAmount));
        $('#curr_hit_chart_value').text(globalvars.assignedAccountsInfo.currHitRate + "%");
        $('#curr_review_chart_value').text(globalvars.assignedAccountsInfo.currReviewRate + "%");
        $('#curr_month_date_label').text(globalvars.localResourceMap.account_current_month + " - " + getCurrentDate().monthName + " " + getCurrentDate().year);


        // prev Month
        $('#amount_value_label_prev_month').text('$' + chartsCurrencyFormatter(globalvars.assignedAccountsInfo.prevAmount));
        $('#prev_hit_chart_value').text(globalvars.assignedAccountsInfo.prevHitRate + "%");
        $('#prev_review_chart_value').text(globalvars.assignedAccountsInfo.prevReviewRate + "%");
        $('#last_month_date_label').text(globalvars.localResourceMap.account_last_month + " - " + globalvars.assignedAccountsInfo.predDate);


   // $("#auditor_selected_facility_label").text(globalvars.localResourceMap.dashboard_filter_facility_placeholder + ":" + globalvars.physicianHospitals[globalvars.selectedPreHospitalIndex].shortName);

    },
    drawScreen: function() {

        getSYNC('common/templates/screens/physicianBillAccountReview.html', function(data) {
            globalvars.$contentcontainer.append($.nano(data, globalvars.localResourceMap));
        });

        createHospitalSelector({
            targetSelectId: "#hospital_selector_id",
            screen: "physicianAccountDetails"
        });

        widgets.physicianAuditorFilter.initialize({
            $targetDiv: $("#filters_wrapper"),
            screen:'physicianAccountDetails',
            filters: {
                audit_type: false,
                facility: true,
                multiselectFacility: false,
                time_period: false,
                costCenter:true,
                auditorMultiSelect:(globalvars.user.uType == globalvars.roles.physicianUser)?false:true

            }

        });


        
    },
    populatePQData:function(){
        var start = new Date().getTime();
      
        this.showCharts();
        
        $("#prebill_gridPQ div#prebill_grid_tablePQ").remove();
        $("#prebill_gridPQ").append('<div id="prebill_grid_tablePQ"></div>');

        pqgridPhysician.physicianBillAccountReviewGrid.initialize({
            data:globalvars.assignedAccounts,
            gridDiv: "#prebill_grid_tablePQ",
            showPType : screens.physicianAccountDetails.initParameters.showPType,
            onClick: function(event,ui) {
                    var rowData = $("#prebill_grid_tablePQ").pqGrid( "getRowData", {rowIndxPage: ui.rowIndxPage} );
                            console.log(rowData.index);
                            console.log(rowData);

                            app.screenManager.showScreen("physicianAccountDetailsForm", {
                                id: rowData.index + 1,
                                rowData: $("#prebill_grid_tablePQ").pqGrid("option" , "dataModel.data"),
                                accountDetailsEditable: screens.physicianAccountDetails.initParameters.accountDetailsEditable,
                                accountDetailsHidden: screens.physicianAccountDetails.initParameters.accountDetailsHidden,
                                showSubmit: screens.physicianAccountDetails.initParameters.showSubmit,
                                showSave: screens.physicianAccountDetails.initParameters.showSave,
                                showAddRow: screens.physicianAccountDetails.initParameters.showAddRow,
                                showDelRow: screens.physicianAccountDetails.initParameters.showDelRow,
                                showPType : screens.physicianAccountDetails.initParameters.showPType,
                                backScreen: "preBill"
                            });
            }
        });


        
        },


    
        bindFunctionality:function(){
        
        // var availableMissingCode = new Array();
        
        // for(var i = 0; i< globalvars.assignedAccounts.length; i++){
        //     if(globalvars.assignedAccounts[i].predCode != null)
        //         availableMissingCode.push(globalvars.assignedAccounts[i].serviceLocation);
        // }
        
        // $("#search_missing_code").unbind("keydown");        
        // $("#search_missing_code").bind("keydown", function (event) {
        //     if (event.keyCode === $.ui.keyCode.TAB && $(this).data("ui-autocomplete").menu.active) {
        //         event.preventDefault();
        //     }
        // }).autocomplete({
        //     source: availableMissingCode.unique(),
        // });
        
        // $("#search_missing_code").focus(function(){
        //     $("#search_missing_code").val("");
        // });
        
        // $("#search_missing_code").unbind("keydown"); 
        // $('#search_missing_code').bind('keydown', function(event) {
        //     if (event.keyCode == 13){
        //         screens.physicianAccountDetails.searchMissingCode();

        //     }
        // });

       

        //  $('#search_missing_icon').off('click').on('click',function(){
        //         screens.physicianAccountDetails.searchMissingCode();
        //  });

       

    },
    searchMissingCode:function(){
          // var searchValue = $("#search_missing_code").val(), findText;
          
          // if(searchValue === "Search top Service line"){
          //     dialogs.messageDialog.show({ text: globalvars.localResourceMap.auditor_assignment_search_missing_code_message });
          // }else {
          //     if (searchValue.length === 0) {
          //            dialogs.messageDialog.show({ text: 'Search Service line is empty' });
          //            $("#prebill_grid_table")[0].p.search = false;
          //            $.extend($("#prebill_grid_table")[0].p.postData,{filters:""});
          //            $("#prebill_grid_table").trigger("reloadGrid");
          //     }
          //     findText = {groupOp:"OR",rules:[]};
          //     findText.rules.push({field:"serviceLocation",op:"cn",data:searchValue});
          //     $("#prebill_grid_table")[0].p.search = true;
          //     $.extend($("#prebill_grid_table")[0].p.postData,{filters:JSON.stringify(findText)});
          //     $("#prebill_grid_table").trigger("reloadGrid",[{page:1,current:true}]);
          // }
          
    },
    onFilterUpdate: function(filterParameters) {
        log("changing hospital!!");
        this.loadData(filterParameters);
        //this.populateData();
        //this.bindFunctionality();
        //gridPhysician.physicianBillAccountReviewGrid.reloadGrid.call(gridPhysician.physicianBillAccountReviewGrid, "");
    }

};