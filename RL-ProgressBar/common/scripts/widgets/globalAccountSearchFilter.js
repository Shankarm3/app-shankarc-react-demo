widgets.globalAccountSearchFilter = {
    centralAuditorFilterTemplate: "",
    centralAuditorFacilityOptionTemplate: "",
    facilityTemplate: "",
    filtersToShow: {},
    currentScreenName: "",
    auditorTemplateCheckbox:"",
    allParameters: {},
    allParametersTitles: {},
    screenName: "",
    currentScreenParameters: null,
    initialize: function(params) {
        log(globalvars.selectedBillTypeForSubmitCharge);
        this.screenName = params.screen;
        this.filtersToShow = params.filters;
        this.loadData();
        this.checkLoadedAuditors();
        this.currentScreenName = params.screen;
        this.showData(params.$targetDiv, params.filters, params.screen);
        this.bindFunctionality();
    },
    checkLoadedAuditors: function () {
       
    //PATSUBTYPE
    //PATTYPE
    // FACILITY

     $('#selectFilterFacility').empty();
     $('#selectFilterPatType').empty();
     $('#selectFilterPatSubType').empty();


        $.when(
            $.ajax({
                type: 'GET',
                url: globalvars.root.getGlobalFilterParametrUri,
                traditional: true,
                dataType: 'json'
            })
          ).done(function(data){
            globalvars.globalSearchFilterData = data
            //selectFilterFacility
            //selectFilterPatType
            //selectFilterPatSubType
            if(data.FACILITY){
                for(catgory in data.FACILITY){
                    $('#selectFilterFacility').append('<option value='+catgory+'>'+ catgory +' </option>');
                }
            }
            $("#selectFilterFacility").multiselect({
                            multiple: true,
                            minWidth: 130,
                            selectedText:"# of # checked",
                            noneSelectedText: 'Select'
                            //  selectedText: 'Select'
            })

            if(data.PATTYPE){
                for(catgory in data.PATTYPE){
                    $('#selectFilterPatType').append('<option value='+catgory+'>'+ catgory +' </option>');
                }
            }

            $("#selectFilterPatType").multiselect({
                            multiple: true,
                            minWidth: 130,
                            selectedText:"# of # checked",
                            noneSelectedText: 'Select'
            });

            if(data.PATSUBTYPE){
                for(catgory in data.PATSUBTYPE){
                    $('#selectFilterPatSubType').append('<option value='+catgory+'>'+ catgory +' </option>');
                }
            }

            $("#selectFilterPatSubType").multiselect({
                            multiple: true,
                            minWidth: 130,
                            selectedText:"# of # checked",
                            noneSelectedText: 'Select'
            });

                            
            });
        	
            $('#filterFacility>.ui-multiselect').css('font-family','arial');
    },
    loadData: function() {
        if (this.centralAuditorFilterTemplate == "") {
            this.centralAuditorFilterTemplate = getTemplate('common/templates/widgets/globalAccountSearchFilter.html');
        }

              
        
        // var localStorageParameters = localStorage.getItem('filterParametersAuditor');

        // if (localStorageParameters) {
        //     localStorageParameters = JSON.parse(localStorageParameters);
        //     widgets.globalAccountSearchFilter.allParameters = localStorageParameters;
        //     if (localStorageParameters && localStorageParameters[widgets.globalAccountSearchFilter.screenName]) {
        //         widgets.globalAccountSearchFilter.currentScreenParameters = localStorageParameters[widgets.globalAccountSearchFilter.screenName];
        //     } else {
        //         widgets.globalAccountSearchFilter.currentScreenParameters = null;
        //     };
        // };


        
    },
    showData: function($filterDiv, filters, screen) {
    	
    	
        $filterDiv.empty();
        $filterDiv.append($.nano(widgets.globalAccountSearchFilter.centralAuditorFilterTemplate, globalvars.localResourceMap));
    
    },
    bindFunctionality: function() {
   
        //  $('#selectFilterFacility').multiselect({
        //     columns: 1,
        //     placeholder: 'Select Facility'
        // });

        

        $("#startADate").datepicker({
            onSelect: function(date) {
                $("#endADate").datepicker("option", "minDate", date);
                document.getElementById("startADate").value = date;
            },
            dateFormat: 'yy-mm-dd'
        });

        $("#endADate").datepicker({
            onSelect: function(date) {
                $("#startADate").datepicker("option", "maxDate", date);
                document.getElementById("endADate").value = date;
            },
            dateFormat: 'yy-mm-dd'
        });

         $("#startDDate").datepicker({
            onSelect: function(date) {
                $("#endDDate").datepicker("option", "minDate", date);
                document.getElementById("startDDate").value = date;
            },
            dateFormat: 'yy-mm-dd'
        });

        $("#endDDate").datepicker({
            onSelect: function(date) {
                $("#startDDate").datepicker("option", "maxDate", date);
                document.getElementById("endDDate").value = date;
            },
            dateFormat: 'yy-mm-dd'
        });

         $("#startTDate").datepicker({
            onSelect: function(date) {
                $("#endTDate").datepicker("option", "minDate", date);
                document.getElementById("startTDate").value = date;
            },
            dateFormat: 'yy-mm-dd'
        });

        $("#endTDate").datepicker({
            onSelect: function(date) {
                $("#startTDate").datepicker("option", "maxDate", date);
                document.getElementById("endTDate").value = date;
            },
            dateFormat: 'yy-mm-dd'
        });
        
        
        
        // $("#startADate").datepicker('setDate', new Date());
    	// $("#endADate").datepicker('setDate', new Date());
        // $("#startDDate").datepicker('setDate', new Date());
    	// $("#endDDate").datepicker('setDate', new Date());
        // $("#startTDate").datepicker('setDate', new Date());
    	// $("#endTDate").datepicker('setDate', new Date());

        var defaultMessage = 'Facility:Account Id/Patient Id';
        $("#filterAccountId").focus(function(){
            if( $(this).val() == defaultMessage){
                $(this).val("");
            }
        }).blur(function(){
            if( $(this).val() == "" ){
                $(this).val(defaultMessage);
            }
        }).val(defaultMessage);

        //  var defaultMessage1 = 'COID:PatientId';
        // $("#filterPatientId").focus(function(){
        //     if( $(this).val() == defaultMessage1){
        //         $(this).val("");
        //     }
        // }).blur(function(){
        //     if( $(this).val() == "" ){
        //         $(this).val(defaultMessage1);
        //     }
        // }).val(defaultMessage1);


        //filterPatientId
    },
   
    
  
    

}