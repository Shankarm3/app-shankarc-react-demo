screens.preBill = {
    accountsGridDiv: "",
    $accountsGrid: {},
    initParameters: {},
    initialize: function(param) {

        this.accountsGridDiv = "#prebill_grid_table";
        this.$accountsGrid = $("#prebill_grid_table");
        this.initParameters = param;
        $.when( roles.centralAuditor.checkLoadedHospitals() ).then(function(){
            if (globalvars.preHospitals.length > 0) {
            	screens.preBill.drawScreen();
                widgets.centralAuditorfilter.updateScreen();
            }
            else
                dialogs.messageDialog.show({text: globalvars.localResourceMap.central_auditor_no_hospital_assign});
        });

    },
    loadData: function(filterParameters) {

        if(globalvars.user.uType == globalvars.roles.supervisor ||  globalvars.user.uType==globalvars.roles.administrator){
        	
        	$.when(

            		$.ajax({
        				type: 'GET',
                        url: globalvars.preHospitals[globalvars.selectedPreHospitalIndex].uriAssignedAccountsPreBill,
                        data:filterParameters,
        				traditional: true,
        				dataType: 'json'
            		}),
        			
            		$.ajax({
        				type: 'GET',
                        url: globalvars.preHospitals[globalvars.selectedPreHospitalIndex].uriAssignedAccountsInfoPreBill,
                        data:filterParameters,
        				traditional: true,
        				dataType: 'json'
            		})
        			
        	).done(function(data1, data2){
                alert(JSON.stringify(globalvars.preHospitals));

                if (globalvars.preHospitals === undefined){
                	globalvars["assignedAccounts"] = data1;
                }

                if (globalvars.postHospitals === undefined){
                	globalvars["assignedAccountsInfo"] = data2;
                }
                if (globalvars.assignedAccounts.length == 0) {
                    dialogs.messageDialog.show({text: 'No account available for the facility'});
                }

                screens.preBill.populateData();
                screens.preBill.bindFunctionality();
                grids.billAccountReviewGrid.reloadGrid.call(grids.billAccountReviewGrid, "");
                
        	});
        }else{

        	/* Load PREBILL JSON resource */
        	$.when(

            		$.ajax({
        				type: 'GET',
                        url: globalvars.preHospitals[globalvars.selectedPreHospitalIndex].uriAssignedAccountsPreBill,
        				traditional: true,
        				dataType: 'json'
            		}),
        			
            		$.ajax({
        				type: 'GET',
                        url: globalvars.preHospitals[globalvars.selectedPreHospitalIndex].uriAssignedAccountsInfoPreBill,
        				traditional: true,
        				dataType: 'json'
            		})
        			
        	).done(function(data1, data2){

                if (globalvars.preHospitals === undefined){
                	globalvars["assignedAccounts"] = data1;
                }

                if (globalvars.postHospitals === undefined){
                	globalvars["assignedAccountsInfo"] = data2;
                }

                if (globalvars.assignedAccounts.length == 0) {
                    dialogs.messageDialog.show({text: globalvars.localResourceMap.no_account_pending_msg});
                }

                screens.preBill.populateData();
                screens.preBill.bindFunctionality();
                grids.billAccountReviewGrid.reloadGrid.call(grids.billAccountReviewGrid, "");
                
        	});

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


        //selected facility 

        $(".selected_facility_value").text(globalvars.preHospitals[globalvars.selectedPreHospitalIndex].hospitalId);
        $(".selected_facility_name").text("( " + globalvars.preHospitals[globalvars.selectedPreHospitalIndex].hospitalName + " )");
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


        $("#auditor_selected_facility_label").text(globalvars.localResourceMap.dashboard_filter_facility_placeholder + ":" + globalvars.preHospitals[globalvars.selectedPreHospitalIndex].shortName);

    },
    drawScreen: function() {

        getSYNC('common/templates/screens/billAccountReview.html', function(data) {
            globalvars.$contentcontainer.append($.nano(data, globalvars.localResourceMap));
        });

        createHospitalSelector({
            targetSelectId: "#hospital_selector_id",
            screen: "preBill"
        });

        widgets.centralAuditorfilter.initialize({
            $targetDiv: $("#filters_wrapper"),
            screen: 'preBill',
            filters: {
                audit_type: false,
                facility: true,
                multiselectFacility: false,
                time_period: false,
                rejectedCharge: false,
                filter_account_search:false,
                auditorMultiSelect:(globalvars.user.uType == globalvars.roles.supervisor ||  globalvars.user.uType==globalvars.roles.administrator)?true:false,
            }

        });


        
    },
    populateData:function(){
    	
    	screens.preBill.showCharts();

        grids.billAccountReviewGrid.initialize({
            data:globalvars.assignedAccounts,
            gridDiv: "#prebill_grid_table",
            pagerDiv: "#prebill_grid_pager",
            showPType : screens.preBill.initParameters.showPType,
            onClick: function(id) {
                $.ajax({
                    type: 'GET',
                    url: globalvars.preHospitals[globalvars.selectedPreHospitalIndex].accountScoringCheckUri,
                    datatype: 'json',
                    success: function(data) {
                        if (data)
                            dialogs.messageDialog.show({text: globalvars.localResourceMap.account_scoring_check});
                        else {
                            app.screenManager.showScreen("accountDetails", {
                                id: id,
                                rowData: $("#prebill_grid_table").jqGrid('getRowData'),
                                accountDetailsEditable: screens.preBill.initParameters.accountDetailsEditable,
                                accountDetailsHidden: screens.preBill.initParameters.accountDetailsHidden,
                                showSubmit: screens.preBill.initParameters.showSubmit,
                                showSave: screens.preBill.initParameters.showSave,
                                showAddRow: screens.preBill.initParameters.showAddRow,
                                showDelRow: screens.preBill.initParameters.showDelRow,
                                showPType : screens.preBill.initParameters.showPType,
                                backScreen: "preBill"
                            });
                        }
                    }
                });
            }
        });
    },
    bindFunctionality:function(){
		
		var availableMissingCode = new Array();
		
		for(var i = 0; i< globalvars.assignedAccounts.length; i++){
			if(globalvars.assignedAccounts[i].predCode != null)
				availableMissingCode.push(globalvars.assignedAccounts[i].predCode);
		}
		
				
		$("#search_missing_code").bind("keydown", function (event) {
		    if (event.keyCode === $.ui.keyCode.TAB && $(this).data("ui-autocomplete").menu.active) {
		        event.preventDefault();
		    }
		}).autocomplete({
			source: availableMissingCode,
		});
		
		$("#search_missing_code").focus(function(){
			$("#search_missing_code").val("");
		});
		
	
		$('#search_missing_code').bind('keydown', function(event) {
			if (event.keyCode == 13){
				screens.preBill.searchMissingCode();

			}
		});
		
		$('#search_missing_icon').die('click').on('click',function(){
			screens.preBill.searchMissingCode();
		});
    },
    searchMissingCode:function(){
		  var searchValue = $("#search_missing_code").val(), findText;
		  
		  if(searchValue === "Search top Missing code"){
			  dialogs.messageDialog.show({ text: globalvars.localResourceMap.auditor_assignment_search_missing_code_message });
		  }else {
			  if (searchValue.length === 0) {
				  	 dialogs.messageDialog.show({ text: 'Search Missing code is empty' });
		        	 $("#prebill_grid_table")[0].p.search = false;
		             $.extend($("#prebill_grid_table")[0].p.postData,{filters:""});
		             $("#prebill_grid_table").trigger("reloadGrid");
			  }
		      findText = {groupOp:"OR",rules:[]};
		      findText.rules.push({field:"predCode",op:"cn",data:searchValue});
		      $("#prebill_grid_table")[0].p.search = true;
		      $.extend($("#prebill_grid_table")[0].p.postData,{filters:JSON.stringify(findText)});
		      $("#prebill_grid_table").trigger("reloadGrid",[{page:1,current:true}]);
		  }
		  
	},
    onFilterUpdate: function(filterParameters) {
        log("changing hospital!!");
        this.loadData(filterParameters);
    }

};