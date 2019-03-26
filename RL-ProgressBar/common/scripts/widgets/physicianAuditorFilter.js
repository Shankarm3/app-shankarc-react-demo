widgets.physicianAuditorFilter = {
    centralAuditorFilterTemplate: "",
    centralAuditorFacilityOptionTemplate: "",
    centralAuditorCostCenterOptionTemplate:"",
    facilityTemplate: "",
    filtersToShow: {},
    currentScreenName: "",
    auditorTemplateCheckbox: "",
    allParameters: {},
    allParametersTitles: {},
    screenName: "",
    currentScreenParameters: null,
    initialize: function (params) {
        log(globalvars.selectedBillTypeForSubmitCharge);
        this.screenName = params.screen;
        this.filtersToShow = params.filters;
        this.loadData();
        this.currentScreenName = params.screen;
        this.showData(params.$targetDiv, params.filters, params.screen);
        this.bindFunctionality();
    },
    checkLoadedCostCenter:function($filterDiv, filters, screen){
         var dfd = jQuery.Deferred();

        var deferredCollection = [];

       //  if(globalvars.costCenterListAuditor === undefined){
            deferredCollection.push(getAllCostCenterList());
       // }

        $.when.apply($, deferredCollection).done(function () {
            widgets.physicianAuditorFilter.populateFilters($filterDiv, filters, screen);
            widgets.physicianAuditorFilter.updateScreen();
        });

        function getAllCostCenterList() {
            var dfd = jQuery.Deferred();
            $.ajax({
                type: 'GET',
                url: globalvars.root.assignedCostCenter,
                traditional: true,
                dataType: 'json',
                success: function (data) {
                    globalvars["costCenterListAuditor"] = data;
                    return dfd.resolve();
                }
            })
            return dfd.promise();
        }


    },
    checkLoadedAuditors: function ($filterDiv, filters, screen) {


        var dfd = jQuery.Deferred();

        var deferredCollection = [];

        if (globalvars.physicianAuditorList === undefined) {
            deferredCollection.push(getPreAuditorList());
        }

        if (globalvars.physicianAuditorListAll === undefined) {
            deferredCollection.push(getAllAuditorList());
        }

       
         if(globalvars.costCenterListAuditor === undefined){
            deferredCollection.push(getAllCostCenterList());
        }



        $.when.apply($, deferredCollection).done(function () {
            widgets.physicianAuditorFilter.populateFilters($filterDiv, filters, screen);
            widgets.physicianAuditorFilter.updateScreen();
        });

        function getPreAuditorList() {
            var dfd = jQuery.Deferred();
            $.ajax({
                type: 'GET',
                url: globalvars.root.auditorsUri,
                traditional: true,
                dataType: 'json',
                success: function (data) {
                    globalvars["physicianAuditorList"] = data;
                    return dfd.resolve();
                }
            })
            return dfd.promise();
        }

        function getAllAuditorList() {
            var dfd = jQuery.Deferred();
            $.ajax({
                type: 'GET',
                url: globalvars.root.getAllPhysAuditor,
                traditional: true,
                dataType: 'json',
                success: function (data) {
                    globalvars["physicianAuditorListAll"] = data;
                    return dfd.resolve();
                }
            })
            return dfd.promise();
        }

        function getAllCostCenterList() {
            var dfd = jQuery.Deferred();
            $.ajax({
                type: 'GET',
                url: globalvars.root.assignedCostCenter,
                traditional: true,
                dataType: 'json',
                success: function (data) {
                    globalvars["costCenterListAuditor"] = data;
                    return dfd.resolve();
                }
            })
            return dfd.promise();
        }

       

    },
    loadData: function () {
        if (this.centralAuditorFilterTemplate == "") {
            this.centralAuditorFilterTemplate = getTemplate('common/templates/widgets/physicianAuditorFilter.html');
        }

        //if (this.centralAuditorFacilityOptionTemplate == "") {
            this.centralAuditorFacilityOptionTemplate = getTemplate('common/templates/central_auditor_filter_facility.html');
        //}

            this.centralAuditorCostCenterOptionTemplate = getTemplate('common/templates/central_auditor_filter_costCenter.html');


        if(widgets.physicianAuditorFilter.screenName == 'editChargesPhysician' )//|| widgets.centralAuditorfilter.screenName == 'editChargesCCIEdits' || widgets.centralAuditorfilter.currentScreenName == "confirmCharges")
            this.centralAuditorFacilityOptionTemplate = getTemplate('common/templates/central_auditor_filter_facility_edit.html');


        if (this.facilityTemplate == "") {
            this.facilityTemplate = getTemplate('common/templates/central_auditor_filter_facility_checkbox.html');
        }

        if (this.auditorTemplateCheckbox == "") {
            this.auditorTemplateCheckbox = getTemplate('common/templates/filter_auditor_checkbox.html');
        }


        var localStorageParameters = localStorage.getItem('filterParametersAuditor');

        if (localStorageParameters) {
            localStorageParameters = JSON.parse(localStorageParameters);
            widgets.physicianAuditorFilter.allParameters = localStorageParameters;
            if (localStorageParameters && localStorageParameters[widgets.physicianAuditorFilter.screenName]) {
                widgets.physicianAuditorFilter.currentScreenParameters = localStorageParameters[widgets.physicianAuditorFilter.screenName];
            } else {
                widgets.physicianAuditorFilter.currentScreenParameters = null;
            }
            ;
        }
        ;
         
            
        
            
                


    },
    showData: function ($filterDiv, filters, screen) {


        $filterDiv.empty();
        $filterDiv.append($.nano(widgets.physicianAuditorFilter.centralAuditorFilterTemplate, globalvars.localResourceMap));

        if (filters.auditorMultiSelect == true) {
             if(widgets.physicianAuditorFilter.currentScreenName != "physicianConfirmCharges"){
                $('#filter_multiselect_auditor_conf').hide();
                $('#filter_multiselect_auditor').show();
            }else{
                $('#filter_multiselect_auditor_conf').show();
                $('#filter_multiselect_auditor').hide();
            }
            
            widgets.physicianAuditorFilter.checkLoadedAuditors($filterDiv, filters, screen);
        } else {
            $('#filter_multiselect_auditor_conf').hide();
            $('#filter_multiselect_auditor').hide();
           // widgets.physicianAuditorFilter.populateFilters($filterDiv, filters, screen);
           // widgets.physicianAuditorFilter.updateScreen();
            widgets.physicianAuditorFilter.checkLoadedCostCenter($filterDiv, filters, screen);
        }
        
        if(widgets.physicianAuditorFilter.currentScreenName == "physicianAccountDetails"){
            $('.update_button_wrapper').hide();
            $('.update_download_wrapper').show();
        }
        else{
            $('.update_button_wrapper').show();
            $('.update_download_wrapper').hide();
        }

    },
    populateFilters: function ($filterDiv, filters, screen) {
        if (filters.auditorMultiSelect == true) {
            if (widgets.physicianAuditorFilter.currentScreenName == "physicianConfirmCharges") {
                fillAuditorAllMultiSelectFilter();

            } else {

                widgets.physicianAuditorFilter.fillAuditorMultiSelectFilter();
            }


        }


        if (this.currentScreenParameters) {

            if (this.currentScreenParameters.auditorId) {
                $.each(this.currentScreenParameters.auditorId, function (key, value) {
                    var temp = value.replace('.', "");
                    $("input:checkbox[name=auditor]").each(function (index) {
                        if ($(this).val() == value) {
                            $(this).attr('checked', true);
                        }

                    });
                });
            }
            ;

        } else {

            if (filters.auditorMultiSelect == true) {
                //$("#filter_auditors_select").val(globalvars.auditorPerformanceAuditorList[0].userId);
                $("input:checkbox[name=auditor]").attr('checked', true);
            }
            ;

        }
        ;



        if (filters.audit_type !== true) {
            $('#filter_audit_type').hide();
        }
        if(filters.costCenter != true){
             $('#filter_costCenter').hide();
        }
        if (filters.facility !== true) {
            $('#filter_facilities').hide();
        }
        if (filters.multiselectFacility !== true) {
            $('#filter_multiselect_facilities').hide();
        }
        if (filters.time_period !== true) {
            $('#filter_time_period').hide();
        }
        if (filters.rejectedCharge !== true) {
            $('#filter_rejected_charge').hide();
        }
        if (filters.filter_account_search !== true) {
            $('#filter_account_search').hide();
        }
        if (filters.predictionsType !== true) {
            $('#filter_predictions_type').hide();
        }

        if (filters.auditorMultiSelect !== true) {
            $('#filter_multiselect_auditor').hide();
            $('#filter_multiselect_aud').hide();
        }


        function fillFacilityFilter() {
            var facilityDiv = $("#filter_facilities");
            facilityDiv.append("<ul></ul>");
            var hospitals = globalvars.physicianHospitals;

            if(screen == "physicianAccountDetails"){

                if($('input[name=facility]:checked').val() == undefined)
                    facilityDiv.find("ul:last").append("<li><input type='radio' name='facility' value='Overall' checked='checked'>Overall</li>");
                else
                    facilityDiv.find("ul:last").append("<li><input type='radio' name='facility' value='Overall' >Overall</li>");

            }
            // if (widgets.physicianAuditorFilter.currentScreenName == "physicianAccountDetails") {
            $(hospitals).each(function (i) {
                facilityDiv.find("ul:last").append($.nano(widgets.physicianAuditorFilter.centralAuditorFacilityOptionTemplate, {
                    index: i,
                    data: hospitals[i],
                    checked: (screen == "physicianAccountDetails") ? globalvars.selectedPreHospitalIndex == hospitals[i].hospitalId ? "checked = 'ckecked'" : "" : globalvars.selectedPreHospitalIndex == hospitals[i].hospitalId ? "checked = 'checked'" : ""
                }));
            });

            if(globalvars.selectedPreHospitalIndex ==0 && screen == "physicianAccountDetails"){
                 $('.filter_block input[name=facility]').eq(1).attr('checked', true);
            }else if(globalvars.selectedPreHospitalIndex ==0 && screen == "editChargesPhysician"){
                $('.filter_block input[name=facility]').eq(0).attr('checked', true);
            }



           

            if(screen == "editChargesPhysician"){
                if(globalvars.selectedPreHospitalIndex =="Overall"){
                    $('.filter_block input[name=facility]').eq(0).attr('checked', true);
                }
            }

        }
        fillFacilityFilter();

        function fillCostCenterFilter() {
            var costCenterDiv = $("#filter_costCenter");
            costCenterDiv.append("<ul></ul>");

            if($('input[name=costCenter]:checked').val() == undefined)
                costCenterDiv.find("ul:last").append("<li><input type='radio' name='costCenter' value='overall' checked='checked'>Overall</li>");
             else
                costCenterDiv.find("ul:last").append("<li><input type='radio' name='costCenter' value='overall'>Overall</li>");

            
            $(globalvars.costCenterListAuditor).each(function (i) {
                costCenterDiv.find("ul:last").append($.nano(widgets.physicianAuditorFilter.centralAuditorCostCenterOptionTemplate, {
                    index: i,
                    data: globalvars.costCenterListAuditor[i]
                }));
            });

             $('input[name=costCenter][value="' + globalvars.selectedCostCenterValue + '"]').attr('checked', 'checked');

             
           
        }
        
        fillCostCenterFilter();



        function fillAuditorAllMultiSelectFilter() {

            var facilityWrapperDiv = $("#outer_filter_wrapper_auditor");
             var auditors = globalvars.physicianAuditorListAll;

          


            $('#selectFilterAudType').empty();

             if(auditors){
                $(auditors).each(function (i) {
                    $('#selectFilterAudType').append('<option value='+auditors[i]+'>'+ auditors[i] +' </option>');

                });
              
            }

            $("#selectFilterAudType").multiselect({
                            multiple: true,
                            minWidth: 160,
                            selectedText:"# of # checked",
                            noneSelectedText: 'Select'
                            //  selectedText: 'Select'
            })
            ////////////////////////////////////////////////


            //widgets.analysisFilter.selectedFacilityCount();

        }

        widgets.physicianAuditorFilter.fillMultiSelectWrapper();
        log("Facility Filters Height:" + $("#filter_facilities").height());

        if ($("#filter_facilities").height() > 350) {
            $("#filter_facilities ul").addClass("minimized_wrapper_ul");
        }

    },
    fillAuditorMultiSelectFilter: function () {
        var auditors = globalvars.physicianAuditorList;
        var facilityWrapperDiv = $("#outer_filter_wrapper_auditor");
        facilityWrapperDiv.find('ul').empty();
        var tempDiv = $("<ul></ul>");

        $(auditors).each(function (i) {
            tempDiv.append($.nano(widgets.physicianAuditorFilter.auditorTemplateCheckbox, {
                auditorId: auditors[i].userId,
                data: auditors[i]
            }));
        });

        facilityWrapperDiv.append(tempDiv);
        if ($("#outer_filter_wrapper_auditor ul").height() > 350) {
            $("#outer_filter_wrapper_auditor ul").addClass("minimized_wrapper_ul");
        }

       // this.bindFunctionality();
       // $(document).find('input:checkbox[name=auditor]').change();

        //widgets.analysisFilter.selectedFacilityCount();

    },
    bindFunctionality: function () {


        $('.filter_heading').click(function () {
            $(this).next().slideToggle();
            $(this).toggleClass('collapsed');
        });





        $('.filter_block input:checkbox[name=ALLAuditor]').change(function () {
            if ($(this).is(':checked') == true) {
                $('.filter_block input[name=auditor]').attr('checked', true);

            } else if ($(this).is(':checked') == false) {
                $('.filter_block input[name=auditor]').attr('checked', false);
            }
            ;

        });



        $(document).on('change','.filter_block input:checkbox[name=auditor]',function () {
            var checkedHospitalsCount = $(this).parent().parent().find('input:checkbox[name=auditor]:checked').length;
            var hospitalsCount = $(this).parent().parent().find('input:checkbox[name=auditor]').length;

            if (checkedHospitalsCount == 0) {
                $(this).parent().parent().prev().find("input:checkbox[name=ALLAuditor]").prop('indeterminate', false);
                $(this).parent().parent().prev().find("input:checkbox[name=ALLAuditor]").attr('checked', false);

            } else if (checkedHospitalsCount == hospitalsCount) {
                $(this).parent().parent().prev().find("input:checkbox[name=ALLAuditor]").prop('indeterminate', false);
                $(this).parent().parent().prev().find("input:checkbox[name=ALLAuditor]").attr('checked', true);

            } else {
                $(this).parent().parent().prev().find("input:checkbox[name=ALLAuditor]").prop('indeterminate', true);
                $(this).parent().parent().prev().find("input:checkbox[name=ALLAuditor]").attr('checked', false);
            }


        });

        $('input:checkbox[name=auditor]').change();
        
        
        $("#filter_update_button").click(function () {

            if (widgets.physicianAuditorFilter.currentScreenName === "physicianAccountDetails" || widgets.physicianAuditorFilter.currentScreenName === "editChargesPhysician") {
                globalvars.selectedPreHospitalIndex = $('input:radio[name=facility]:checked').val();
                globalvars.selectedCostCenterValue =  $('input:radio[name=costCenter]:checked').val();
            }


            widgets.physicianAuditorFilter.updateScreen();

            // window["screens"][widgets.physicianAuditorFilter.currentScreenName]["onFilterUpdate"]();

        });

        $(".update_download_wrapper>#filter_update_button").click(function () {

            if (widgets.physicianAuditorFilter.currentScreenName === "physicianAccountDetails" || widgets.physicianAuditorFilter.currentScreenName === "editChargesPhysician") {
                globalvars.selectedPreHospitalIndex = $('input:radio[name=facility]:checked').val();
                globalvars.selectedCostCenterValue =  $('input:radio[name=costCenter]:checked').val();
            }


            widgets.physicianAuditorFilter.updateScreen();

            // window["screens"][widgets.physicianAuditorFilter.currentScreenName]["onFilterUpdate"]();

        });
        
        
        $(".update_download_wrapper>#filter_download_excel").off().on("click", function (event) {
            var hospitalId = $('input:radio[name=facility]:checked').val();
            var costCenter = $('input:radio[name=costCenter]:checked').val();
            var excelURL= globalvars.root.uriPhysicianAccountsExcel; 
            var selected_auditor_list_array = [];
            $('input[name=auditor]:checked').each(function () {
                    selected_auditor_list_array.push($(this).attr('value'));
            });
            var selected_auditor_string = new String();
              excelURL=excelURL+"&hospitalId="+ hospitalId+"&costCenter="+costCenter 
            $(selected_auditor_list_array).each(function(i) {
                    selected_auditor_string += "auditorId=" + selected_auditor_list_array[i] + "&";
            });
            excelURL = excelURL + "&" + selected_auditor_string;
            console.log(excelURL);
            if(excelURL){
            event.preventDefault();
            var $preparingFileModal = $("#preparing-file-modal");
            $preparingFileModal.dialog({ modal: true });
         //   console.log(excelURL);
            //var urlLocation = $(this).data("downLoadUrl");
                $.fileDownload(excelURL, {
                    successCallback: function (url) {
                        $preparingFileModal.dialog('destroy');
                    },
                    failCallback: function (responseHtml, url) {
         
                        $preparingFileModal.dialog('destroy');
                        $("#error-modal").dialog({ modal: true });
                    }
                });
            }
            return false; 

        });
        
        

        $('.filter_block input:checkbox[name=ALL]').change(function () {
            if ($(this).is(':checked') == true) {
                $('.filter_block input[name=hospital]').attr('checked', true);

            } else if ($(this).is(':checked') == false) {
                $('.filter_block input[name=hospital]').attr('checked', false);
            }
            ;

            widgets.physicianAuditorFilter.selectedFacilityCount();
        });

        $('.filter_block input:checkbox[name=hospital]').on('change', function () {
            var checkedHospitalsCount = $('.filter_block input:checkbox[name=hospital]:checked').length;
            var hospitalsCount = $('.filter_block input:checkbox[name=hospital]').length;

            if (checkedHospitalsCount == 0) {
                $('.filter_block input:checkbox[name=ALL]').prop('indeterminate', false);
                $('.filter_block input:checkbox[name=ALL]').attr('checked', false);

            } else if (checkedHospitalsCount == hospitalsCount) {
                $('.filter_block input:checkbox[name=ALL]').prop('indeterminate', false);
                $('.filter_block input:checkbox[name=ALL]').attr('checked', true);

            } else {
                $('.filter_block input:checkbox[name=ALL]').prop('indeterminate', true);
                $('.filter_block input:checkbox[name=ALL]').attr('checked', false);
            }

            widgets.physicianAuditorFilter.selectedFacilityCount();
        });

        $("#startdate").datepicker({
            onSelect: function (date) {
                $("#enddate").datepicker("option", "minDate", date);
                document.getElementById("startdate").value = date;
            },
            dateFormat: 'yy-mm-dd'
        });

        $("#enddate").datepicker({
            onSelect: function (date) {
                $("#startdate").datepicker("option", "maxDate", date);
                document.getElementById("enddate").value = date;
            },
            dateFormat: 'yy-mm-dd'
        });

        var defaultMessage = globalvars.localResourceMap.filter_input_text;
        $("#filterAccount").focus(function () {
            if ($(this).val() == defaultMessage) {
                $(this).val("");
            }
        }).blur(function () {
            if ($(this).val() == "") {
                $(this).val(defaultMessage);
            }
        }).val(defaultMessage);

        $("#startdate").datepicker('setDate', new Date());
        $("#enddate").datepicker('setDate', new Date());
    },
    fillMultiSelectWrapper: function () {

        $('.filter_block input[name=ALL]').attr('checked', false);
        $("#outer_filter_wrapper ul").remove();

        var facilityWrapperDiv = $("#outer_filter_wrapper");
        hospitals = globalvars.physicianHospitals

        var tempDiv = $("<ul></ul>");
        $(hospitals).each(function (i) {
            tempDiv.append($.nano(widgets.physicianAuditorFilter.facilityTemplate, {
                hospitalId: hospitals[i].hospitalId,
                data: hospitals[i]
            }));
        });

        facilityWrapperDiv.append(tempDiv);
        if ($("#outer_filter_wrapper ul").height() > 350) {
            $("#outer_filter_wrapper ul").addClass("minimized_wrapper_ul");
        }

        widgets.physicianAuditorFilter.selectedFacilityCount();

    },
    updateScreen: function () {

        var selected_auditor_list_array = [];
        if (widgets.physicianAuditorFilter.currentScreenName == "physicianConfirmCharges") {
            selected_auditor_list_array = $('#selectFilterAudType').val();
        }else{
            $('input[name=auditor]:checked').each(function () {
            selected_auditor_list_array.push($(this).attr('value'));
            });

        }

        

        var activeFilterParameters = constructURLdata(selected_auditor_list_array);
        if (activeFilterParameters.auditorId && activeFilterParameters.auditorId.length == 0) {
            dialogs.messageDialog.show({text: 'No Auditor selected. You must select at least one Auditor'});
            return false;
        }
        ;



        var allFilterParameters = {
            auditorId: selected_auditor_list_array

        };

        globalvars.filterParametersAuditor[widgets.physicianAuditorFilter.screenName] = allFilterParameters;
        widgets.physicianAuditorFilter.allParametersTitles[widgets.physicianAuditorFilter.screenName] = constructURLdataTitles(selected_auditor_list_array);
        widgets.physicianAuditorFilter.allParameters[widgets.physicianAuditorFilter.screenName] = constructURLdata(selected_auditor_list_array);
        localStorage.setItem('filterParametersAuditor', JSON.stringify(widgets.physicianAuditorFilter.allParameters));
        window["screens"][widgets.physicianAuditorFilter.screenName]["onFilterUpdate"](constructURLdata(selected_auditor_list_array));


        function constructURLdata(selected_auditor_list_array) {
            var urlData = {};

            if (widgets.physicianAuditorFilter.filtersToShow.auditorMultiSelect == true) {
                urlData = $.extend(true, urlData, {auditorId: selected_auditor_list_array})
            }
            ;

            return urlData;
        }


        function constructURLdataTitles(selected_auditor_list_array) {
            var urlData = {};
            if (widgets.physicianAuditorFilter.filtersToShow.auditorMultiSelect == true) {
                urlData = $.extend(true, urlData, {auditorId: selected_auditor_list_array})
            }
            ;
            return urlData;
        }
    },
    selectedFacilityCount: function () {
        var checkedHospitalsCount = $('.filter_block input:checkbox[name=hospital]:checked').length;
        $('#selected_facility_count').text(checkedHospitalsCount + " " + globalvars.localResourceMap.dashboard_filter_selected_facility);
},
}