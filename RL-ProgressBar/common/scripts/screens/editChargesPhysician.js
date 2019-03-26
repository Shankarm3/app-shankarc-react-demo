screens.editChargesPhysician = {
    accountsGridDiv: "",
    $accountsGrid: {},
    initParameters: {},
    selectedFacility: "",
    selectedFacilitityName:"",
    initialize: function(param) {
    	this.accountsGridDiv = "#prebill_grid_table";
        this.$accountsGrid = $("#prebill_grid_table");
        this.initParameters = param;

        $.when( roles.physicianUser.checkLoadedHospitals() ).then(function(){
            if (globalvars.physicianHospitals.length > 0) {
            	globalvars.selectedBillTypeForSubmitCharge = (param.selectType != undefined)?param.selectType:'PRE';
            	screens.editChargesPhysician.drawScreen();
            }
            
            else
                dialogs.messageDialog.show({text: globalvars.localResourceMap.central_auditor_no_hospital_assign});
        	
        });
        
    },
    loadData: function(filterParameters) {

        var selectedFacilitity = $('.filter_block input:radio[name=facility]:checked').val();
        var selectedFacilitityName = $('.filter_block input:radio[name=facility]:checked').parent().text();

        



        var selected_hospital_string;
        if (globalvars.physicianHospitals.length > 0){
            selected_hospital_string = globalvars.selectedHospitalId;//globalvars.physicianHospitals[globalvars.selectedPreHospitalIndex].hospitalId;
            screens.editChargesPhysician.selectedFacility = selectedFacilitity;//globalvars.selectedHospitalId;//globalvars.physicianHospitals[globalvars.selectedPreHospitalIndex].shortName;
            screens.editChargesPhysician.selectedFacilitityName = selectedFacilitityName;
        }
       

        //screens.editCharges.selectedFacility = selected_hospital_string;
        if( screens.editChargesPhysician.selectedFacility == undefined){
        	 screens.editChargesPhysician.selectedFacility="";
        }
        var editChargesUri = globalvars.root.phySubmittedAccountUri + "?hospitalId=" + selectedFacilitity;

        
	   	 $.ajax({
	         type: 'GET',
	         url: editChargesUri,
	         datatype: 'json',
             data:filterParameters,
   			 traditional: true,
	         success: function(data) {
	        	 
				 globalvars["submittedAccounts"] = data;
				 
	             gridPhysician.submittedAccountReviewGrid.initialize({
	                 data: (globalvars.submittedAccounts != undefined)?globalvars.submittedAccounts:null,
	                 gridDiv: "#editCharges_grid_table",
	                 pagerDiv: "#editCharges_grid_pager",
                         showPType : screens.editChargesPhysician.initParameters.showPType,
	                 onClick: function(id) {
	                        

                            app.screenManager.showScreen("editSubmittedChargesPhysician", {
                                 id: id,
                                 rowData: $("#editCharges_grid_table").jqGrid('getRowData'),
                                 selectedFacility: screens.editChargesPhysician.selectedFacility,
                                 selectedFacilityShortName: screens.editChargesPhysician.selectedFacilitityName,
                                 accountDetailsEditable: screens.editChargesPhysician.initParameters.accountDetailsEditable,
                                 accountDetailsHidden: screens.editChargesPhysician.initParameters.accountDetailsHidden,
                                 showSubmit: screens.editChargesPhysician.initParameters.showSubmit,
                                 showSave: screens.editChargesPhysician.initParameters.showSave,
                                 showAddRow: screens.editChargesPhysician.initParameters.showAddRow,
                                 showDelRow: screens.editChargesPhysician.initParameters.showDelRow,
                                 showPType : screens.editChargesPhysician.initParameters.showPType,
                                 backScreen: "editChargesPhysician",

                             });

	                 
	                 }
	             });
	             $("#auditor_selected_facility_label").text(globalvars.localResourceMap.dashboard_filter_facility_placeholder + ":" + screens.editChargesPhysician.selectedFacilitityName);

	         }
	     });
  
        log("check Value" + globalvars.submittedAccounts);


    },
    drawScreen: function() {

        getSYNC('common/templates/screens/editCharges.html', function(data) {
            globalvars.$contentcontainer.append($.nano(data, globalvars.localResourceMap));
        });

        createHospitalSelector({
            targetSelectId: "#hospital_selector_id",
            screen: "preBill"
        });

        widgets.physicianAuditorFilter.initialize({
            $targetDiv: $("#filters_wrapper"),
            screen: 'editChargesPhysician',
            filters: {
                audit_type: false,
                facility: true,
                multiselectFacility: false,
                time_period: false,
                rejectedCharge: false,
                predictionsType:false,
                auditorMultiSelect:(globalvars.user.uType == globalvars.roles.physicianUser)?false:true
            }

        });



    },
    onFilterUpdate: function(filterParameters) {
        log("changing hospital!!");
        this.loadData(filterParameters);
        $("#auditor_selected_facility_label").text(globalvars.localResourceMap.dashboard_filter_facility_placeholder + ":" + screens.editChargesPhysician.selectedFacilitityName);

        // gridPhysician.billAccountReviewGrid.reloadGrid.call(gridPhysician.billAccountReviewGrid, "");        
    }

};