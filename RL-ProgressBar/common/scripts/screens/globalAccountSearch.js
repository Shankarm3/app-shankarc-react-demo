screens.globalAccountSearch = {

    initialize: function () {

        this.drawScreen();
        this.bindFunctionality();
    },
    drawScreen:function(){
      
           getSYNC('common/templates/screens/globalAccountSearch.html?236', function(data) {
                log('loading global search template');
                globalvars.$contentcontainer.append($.nano(data, globalvars.localResourceMap));
            });

            widgets.globalAccountSearchFilter.initialize({
                $targetDiv: $("#filters_wrapper"),
                screen: 'globalAccountSearch'
               
    
            });

           
    },
    populateGrid:function(){
          
             var selected_billType;
             

                // if(pqGrids.loadGlobalSearchGrid.gridCreated){
                //     pqGrids.loadGlobalSearchGrid.$gridDiv.pqGrid('destroy');
                //     pqGrids.loadGlobalSearchGrid.gridCreated = false;
                // }

                $("#global_confirm_charges_grid div#global_confirm_charges_grid_table").remove();
                $("#global_confirm_charges_grid").append('<div id="global_confirm_charges_grid_table"></div>');

                 pqgridPhysician.loadGlobalSearchGrid.loadGrid({
                     data: globalvars.globalSearchAccounts,
                     gridDiv: "#global_confirm_charges_grid_table",
                     pagerDiv: "#global_confirm_charges_grid_pager",
                     //showExcel:false,
                     onClick: function(event, ui) {
                        var chargeURI = ui.rowData.uriCharges;
                
                        var rowDataSelected = ui.rowData;
                //        console.log(rowDataSelected);
                        selected_billType =  rowDataSelected.billType == "PRE-BILL"?"PRE":"POST"
                       
                        $.ajax({
                                type: 'GET',
                                url: chargeURI,
                                traditional: true,
                                dataType: 'json',
                                success: function(data){
                                    globalvars["confirmChargesPhysician"] = data;
                                    //dialogs.globalSearchAccountInfo.open({data: rowDataSelected,title:globalvars.localResourceMap.account_details_heading,billType:selected_billType});
                                    dialogs.confirmChargesAccountInfoPhysicianGlobal.open({data: rowDataSelected,title:globalvars.localResourceMap.account_details_heading});

                                }
                            })
                        
                     }

                 });

        
    },
    bindFunctionality:function(){

       

        $("#filter_search_button").click(function() {
            
            var searchFiler = $("#filterAccountId").val();
            var searchFilterPatient = $("#filterPatientId").val();

               var accountFlag = checkValidation(searchFiler,'Facility:Account Id/Patient Id');
               // var patientFlag = checkValidation(searchFilterPatient,'COID:PatientId');
                var confirmChargesUriSearch;
                if(accountFlag)
                    confirmChargesUriSearch = globalvars.root.globalAccountSerachUri + "?accountId=" + searchFiler;
                // else if(patientFlag)
                //     confirmChargesUriSearch = globalvars.root.globalAccountSerachUri + "?accountId=" + searchFilterPatient;
                
                if(accountFlag == false)
                return;

                $.ajax({
                    type: 'GET',
                    url: confirmChargesUriSearch,
                    traditional: true,
                    dataType: 'json',
                    success: function(data){
                        globalvars["globalSearchAccounts"] = data;
                        screens.globalAccountSearch.populateGrid();
                    }
                })

            
            
         });

         function checkValidation(filterText,checkText){
             if(filterText == "" || filterText == checkText || $.trim(filterText) == "")
                 return false

             return true;
         }
         

          $('#filter_rejected_charge input:checkbox[name=rejectedCharges]').change(function () {
        //      console.log($(this).is(':checked'));
              if ($(this).is(':checked') == false) {
                  $('#filter_transfer_type input').prop('disabled',false)
                  $('#filter_transfer_type input').css('opacity','1')
              }else{
                   $('#filter_transfer_type input').val("");
                  $('#filter_transfer_type input').prop('disabled',true)
                  $('#filter_transfer_type input').css('opacity','0.3')
              }

          });


          $('#filterFacility>.ui-multiselect').css('font-family','arial');

         $(".update_button_wrapper").click(function() {

             var selFacility = $('#selectFilterFacility').val();
             var selPatientType = $('#selectFilterPatType').val();
             var selPSubType = $('#selectFilterPatSubType').val();
             
             var startAdmitDate = $('#startADate').val();
             var endAdmitDate = $('#endADate').val();

             var startDischargeDate = $('#startDDate').val();
             var endDischargeDate = $('#endDDate').val();

             var startTransferDate = $('#startTDate').val();
             var endTransferDate = $('#endTDate').val();

             var unbilledAccount = 'N';
             if ($('#rejectedCharges').is(':checked')) {
                unbilledAccount = $('#rejectedCharges').val();
            }
            var selected_hospital_string="";
            $(selFacility).each(function(i) {
                selected_hospital_string += "hospitalId=" + selFacility[i] + "&";
            });

            var selected_Ptype_string="";
            $(selPatientType).each(function(i) {
                selected_Ptype_string += "patType=" + selPatientType[i] + "&";
            });

             var selected_PSubType_string="";
            $(selPSubType).each(function(i) {
                selected_PSubType_string += "patSubType=" + selPSubType[i] + "&";
            });





            var filterUri = globalvars.root.globalFilterSeachUri + "?unBilledAccounts=" + unbilledAccount + "&" +selected_hospital_string + selected_Ptype_string+selected_PSubType_string+
"admitStartDate=" +startAdmitDate+ "&admitEndDate=" +endAdmitDate+ "&dischargeStartDate=" +startDischargeDate+ "&dischargeEndDate=" +endDischargeDate+ "&transferStartDate=" +startTransferDate+ "&transferEndDate=" +endTransferDate;            
                $.ajax({
                    type: 'GET',
                    url: filterUri,
                    traditional: true,
                    dataType: 'json',
                    success: function(data){
                        globalvars["globalSearchAccounts"] = data;
                        screens.globalAccountSearch.populateGrid();
                    }
                })


         });
         


    }

}