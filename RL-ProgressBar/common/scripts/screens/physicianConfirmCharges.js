screens.physicianConfirmCharges = {
        initParameters: {},
        showAlert: false,

        drawScreen: function() {
        screens.physicianConfirmCharges.showAlert = false;
        getSYNC('common/templates/screens/physicianConfirmCharges.html?235', function(data) {
            log('loading confirmCharges template');
            globalvars.$contentcontainer.append($.nano(data, globalvars.localResourceMap));
        });

        widgets.physicianConfirmChargeFilter.initialize({
            $targetDiv: $("#filters_wrapper"),
            screen: 'physicianConfirmCharges',
            filters: {
                audit_type: false,
                facility: false,
                multiselectFacility: true,  
                time_period: true,
                rejectedCharge: true,
                inactiveAuditor: (globalvars.user.uType == globalvars.roles.physicianUser)?false:true,
                filter_account_search:true,
                predictionsType:false,
                auditorMultiSelect:(globalvars.user.uType == globalvars.roles.physicianUser)?false:true
            }

        });
        $('.pq-header-outer').css('height','45px');
        $('.ui-widget-header').css('height','45px');

    },
    initialize: function(param) {
        $.when( roles.physicianUser.checkLoadedHospitals() ).then(function(){
            screens.physicianConfirmCharges.initParameters = param;
            screens.physicianConfirmCharges.drawScreen();
            $("#confirm_charges_download_excel").hide();
            screens.physicianConfirmCharges.bindFunctionality();
        });
    },
    onFilterUpdate: function(filterParameters) {
        $("#filterAccount").val(globalvars.localResourceMap.filter_input_text);
        //var selected_billType = $('input:radio[name=billType]:checked').val();
        //var selectedPType = $('input:radio[name=pType]:checked').val();
        var rejectedCharges = 'N';
        if ($('#rejectedCharges').is(':checked')) {
            rejectedCharges = $('#rejectedCharges').val();
        }






        var selected_hospital_list_array = new Array();
        var selected_auditor_list_array = [];
        var selected_start_date = $("#startdate").val();
        var selected_end_date = $("#enddate").val();
        var selected_hospital_string;

          
        // selected_hospital_list_array = $('#selectFilterFacilityType').val()
        // selected_auditor_list_array = $('#selectFilterAudType').val()

        $('input[name=auditor]:checked').each(function () {
                selected_auditor_list_array.push($(this).attr('value'));
        });

        $('input[name=hospital]:checked').each(function () {
                selected_hospital_list_array.push($(this).attr('value'));
        });


        



        if ($('#inactiveAuditor').is(':checked')) {
            if(selected_auditor_list_array)
                selected_auditor_list_array = selected_auditor_list_array.concat(globalvars.inactiveAuditor);
            else
                selected_auditor_list_array = globalvars.inactiveAuditor;
        }


        //if (selected_hospital_list_array == null) {
            if(selected_hospital_list_array.length == 0){
                //if(screens.physicianConfirmCharges.showAlert == true){
                    dialogs.messageDialog.show({text: globalvars.localResourceMap.confirmed_charge_no_coid_select});
                    return;
              }
                //  else{
                //     screens.physicianConfirmCharges.showAlert = true;
                // }
       // }

        if(globalvars.user.uType != globalvars.roles.physicianUser){
            if (selected_auditor_list_array == null) {
                dialogs.messageDialog.show({text: 'Please select at least one Auditor'});
                    return;
            }
        }



        if (selected_start_date == "" || selected_end_date == "") {
            dialogs.messageDialog.show({text: globalvars.localResourceMap.confirmed_charge_no_start_end_date_select});
            return;
        } 

             var $confirmChargesGrid = $("#confirm_charges_grid_table_physician");

            //$confirmChargesGrid.clearGridData();
            //$confirmChargesGrid.jqGrid('GridUnload');

            selected_hospital_string = new String();
            $(selected_hospital_list_array).each(function(i) {
                selected_hospital_string += "hospitalId=" + selected_hospital_list_array[i] + "&";
            });
            var confirmChargesUri = globalvars.root.phyConfirmChargesUri + "?" + selected_hospital_string + "startDate=" + selected_start_date + "&endDate=" + selected_end_date + "&rejectedCharges=" + rejectedCharges;

            $.when(

                    $.ajax({
                        type: 'GET',
                        url: confirmChargesUri,
                        data:filterParameters,
                        traditional: true,
                        dataType: 'json'
                    })
            
            ).done(function(data){
                globalvars["confirmChargesAccountsPhysician"] = data;
                
                // for (var i = 0; i < globalvars.confirmChargesAccountsPhysician.length; i++) {
                //     globalvars.confirmChargesAccountsPhysician[i].chargeAmount = numberWithCommas(globalvars.confirmChargesAccountsPhysician[i].chargeAmount);

                //     // if(i==2 || i==4)
                //     //     globalvars.confirmChargesAccountsPhysician[i].found=true;
                // }

                $("#confirm_charges_grid").empty();
                $("#confirm_charges_grid").append('<div id="confirm_charges_grid_table_physician"></div>');

                //if (globalvars.root.auditLevel == "2") {
                    pqgridPhysician.loadPhysicianConfirmChargesGrid.initialize({
                        data: globalvars.confirmChargesAccountsPhysician,
                        gridDiv: "#confirm_charges_grid_table_physician",
                        showExcel:true,
                        onClick: function(event,ui) {
                            //var rowData = $("#confirm_charges_grid_table_physician").jqGrid('getRowData');
                            var rowDataIndex = $("#confirm_charges_grid_table_physician").pqGrid( "getRowData", {rowIndxPage: ui.rowIndxPage} );
                            //var rowData =  $("#confirm_charges_grid_table_physician").pqGrid("option" , "dataModel.data");
                            //var id = rowDataIndex.index + 1;
                            var uriCharges = rowDataIndex.uriCharges;
                            var rowDataSelected = screens.physicianConfirmCharges.getConfirmChargeRecordByAccountId(uriCharges);

                            $.ajax({
                                type: 'GET',
                                url: rowDataSelected.uriCharges,
                                data:filterParameters,
                                traditional: true,
                                dataType: 'json',
                                success: function(data){
                                    globalvars["confirmChargesPhysician"] = data;
                                    dialogs.confirmChargesAccountInfoPhysician.open({data: rowDataSelected,title:globalvars.localResourceMap.account_details_heading});
                                }
                            }) 

                                                    
                        }

                    });
                
                
            })
        








        var selected_hospital_string = new String();
        $(selected_hospital_list_array).each(function(i) {
            selected_hospital_string += "hospitalId=" + selected_hospital_list_array[i] + "&";
        });
        
        var selected_auditor_string = new String();
        $(selected_auditor_list_array).each(function(i) {
            selected_auditor_string += "auditorId=" + selected_auditor_list_array[i] + "&";
        });
        // Function For Downloading Grid Data
        $("#confirm_charges_download_excel").off().on('click', function (event) {
            var confirmChargesUriexcelURL = globalvars.root.phyConfirmChargesExcelUri + "?rejectedCharges=" + rejectedCharges + "&" + selected_hospital_string + selected_auditor_string + "startDate=" + selected_start_date + "&endDate=" + selected_end_date;
            var $preparingFileModal = $("#preparing-file-modal");
            $preparingFileModal.dialog({ modal: true });
            $.fileDownload(confirmChargesUriexcelURL, {
                successCallback: function (url) {
                    $preparingFileModal.dialog('destroy');
                },
                failCallback: function (responseHtml, url) {
                    $preparingFileModal.dialog('destroy');
                    $("#error-modal").dialog({ modal: true });
                }
            });
        });
        $('.pq-header-outer').css('height','45px');
        $('.ui-widget-header').css('height','45px');

    },
    
    bindFunctionality:function(){
        
         $("#filter_search_button").click(function() {
            
            var searchFiler = $("#filterAccount").val();
            if(searchFiler == "" || searchFiler == globalvars.localResourceMap.filter_input_text || $.trim(searchFiler) == "")
                return
            else{
                var confirmChargesUriSearch = globalvars.root.phyConfirmChargesUri + "/search" + "?accountId=" + searchFiler

                $.ajax({
                    type: 'GET',
                    url: confirmChargesUriSearch,
                    traditional: true,
                    dataType: 'json',
                    success: function(data){
                        globalvars["confirmChargesAccountsPhysician"] = data;
                        populateGrid();
                    }
                })
            }
         });
         
         function populateGrid(){
             
            // var $confirmChargesGrid = $("#confirm_charges_grid_table_physician");
            // $confirmChargesGrid.jqGrid('GridUnload');
            // var selected_billType;
             
                 $("#confirm_charges_grid").empty();
                $("#confirm_charges_grid").append('<div id="confirm_charges_grid_table_physician"></div>');

                //if (globalvars.root.auditLevel == "2") {
                    pqgridPhysician.loadPhysicianConfirmChargesGrid.initialize({
                        data: globalvars.confirmChargesAccountsPhysician,
                        gridDiv: "#confirm_charges_grid_table_physician",
                        showExcel:false,
                        onClick: function(event,ui) {
                            //var rowData = $("#confirm_charges_grid_table_physician").jqGrid('getRowData');
                            var rowDataIndex = $("#confirm_charges_grid_table_physician").pqGrid( "getRowData", {rowIndxPage: ui.rowIndxPage} );
                            //var rowData =  $("#confirm_charges_grid_table_physician").pqGrid("option" , "dataModel.data");
                            //var id = rowDataIndex.index + 1;
                            var uriCharges = rowDataIndex.uriCharges;
                            var rowDataSelected = screens.physicianConfirmCharges.getConfirmChargeRecordByAccountId(uriCharges);

                            $.ajax({
                                type: 'GET',
                                url: rowDataSelected.uriCharges,
                                traditional: true,
                                dataType: 'json',
                                success: function(data){
                                    globalvars["confirmChargesPhysician"] = data;
                                    dialogs.confirmChargesAccountInfoPhysician.open({data: rowDataSelected,title:globalvars.localResourceMap.account_details_heading});
                                }
                            }) 

                                                    
                        }

                    });
         }
         
         $('.pq-header-outer').css('height','45px');
        $('.ui-widget-header').css('height','45px');
        
    },
    getConfirmChargeRecordByAccountId:function(uriCharges){
        if(globalvars.confirmChargesAccountsPhysician){
            
            for(i=0;i<globalvars.confirmChargesAccountsPhysician.length;i++){
                if(uriCharges == globalvars.confirmChargesAccountsPhysician[i].uriCharges){
                    return globalvars.confirmChargesAccountsPhysician[i];
                    break;
                }
            }
        }
        
        
    }
    
}