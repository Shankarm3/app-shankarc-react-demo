widgets.physicianConfirmChargeFilter = {
    centralAuditorFilterTemplate: "",
    centralAuditorFacilityOptionTemplate: "",
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
    checkLoadedAuditors: function ($filterDiv, filters, screen) {


        var dfd = jQuery.Deferred();

        var deferredCollection = [];

        if (globalvars.physicianAuditorList === undefined) {
            deferredCollection.push(getPreAuditorList());
        }

        if (globalvars.physicianAuditorListAllConfirm === undefined) {
            deferredCollection.push(getAllAuditorList());
        }




        $.when.apply($, deferredCollection).done(function () {
            widgets.physicianConfirmChargeFilter.populateFilters($filterDiv, filters, screen);
            //widgets.physicianConfirmChargeFilter.updateScreen();
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
                    globalvars["physicianAuditorListAllConfirm"] = data;
                    var activeAuditor=[];
                    var inactiveAuditor=[];

                    $(globalvars.physicianAuditorListAllConfirm).each(function(i) {
                        if(globalvars.physicianAuditorListAllConfirm[i].isEnabled == true){
                            activeAuditor.push(globalvars.physicianAuditorListAllConfirm[i]);
                        }else{
                            inactiveAuditor.push(globalvars.physicianAuditorListAllConfirm[i].userId);
                        }

                    })
                    globalvars.activeAuditor = activeAuditor;
                    globalvars.inactiveAuditor = inactiveAuditor;

                    return dfd.resolve();
                }
            })
            return dfd.promise();
        }



    },
    loadData: function () {
        if (this.centralAuditorFilterTemplate == "") {
            this.centralAuditorFilterTemplate = getTemplate('common/templates/widgets/physicianConfirmChargeFilter.html');
        }

        if (this.centralAuditorFacilityOptionTemplate == "") {
            this.centralAuditorFacilityOptionTemplate = getTemplate('common/templates/central_auditor_filter_facility.html');
        }

        if (this.facilityTemplate == "") {
            this.facilityTemplate = getTemplate('common/templates/central_auditor_filter_facility_checkbox.html');
        }

        if (this.auditorTemplateCheckbox == "") {
            this.auditorTemplateCheckbox = getTemplate('common/templates/filter_auditor_checkbox.html');
        }


        var localStorageParameters = localStorage.getItem('filterParametersAuditor');

        if (localStorageParameters) {
            localStorageParameters = JSON.parse(localStorageParameters);
            widgets.physicianConfirmChargeFilter.allParameters = localStorageParameters;
            if (localStorageParameters && localStorageParameters[widgets.physicianConfirmChargeFilter.screenName]) {
                widgets.physicianConfirmChargeFilter.currentScreenParameters = localStorageParameters[widgets.physicianConfirmChargeFilter.screenName];
            } else {
                widgets.physicianConfirmChargeFilter.currentScreenParameters = null;
            }
            ;
        }
        ;



    },
    showData: function ($filterDiv, filters, screen) {


        $filterDiv.empty();
        $filterDiv.append($.nano(widgets.physicianConfirmChargeFilter.centralAuditorFilterTemplate, globalvars.localResourceMap));

        


        if (filters.auditorMultiSelect == true) {
            $('#filter_multiselect_auditor').show();
            widgets.physicianConfirmChargeFilter.checkLoadedAuditors($filterDiv, filters, screen);
        } else {
            $('#filter_multiselect_auditor').hide();
            widgets.physicianConfirmChargeFilter.populateFilters($filterDiv, filters, screen);
            //widgets.physicianConfirmChargeFilter.updateScreen();
        }

    },
    populateFilters: function ($filterDiv, filters, screen) {
        if (filters.auditorMultiSelect == true) {
                fillAuditorAllMultiSelectFilter();

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
        if (filters.facility !== true) {
            $('#filter_facilities').hide();
        }
        if (filters.multiselectFacility !== true) {
            $('#filter_multiselect_facilities').hide();
            $('#filter_multiselect_facilities_conf').hide();
        }
        if (filters.time_period !== true) {
            $('#filter_time_period').hide();
        }
        if (filters.rejectedCharge !== true) {
            $('#filter_rejected_charge').hide();
        }

        if (filters.inactiveAuditor !== true) {
            $('#filterInactiveAuditor').hide();
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

            // if (widgets.physicianConfirmChargeFilter.currentScreenName == "physicianAccountDetails") {
            $(hospitals).each(function (i) {
                facilityDiv.find("ul:last").append($.nano(widgets.physicianConfirmChargeFilter.centralAuditorFacilityOptionTemplate, {
                    index: i,
                    data: hospitals[i],
                    checked: (screen == "physicianAccountDetails") ? globalvars.selectedPreHospitalIndex == i ? "checked = 'ckecked'" : "" : globalvars.selectedPreHospitalIndex == i ? "checked = 'checked'" : ""
                }));
            });
            //}


            // if (widgets.physicianConfirmChargeFilter.currentScreenName == "editChargesPhysician") {
            //     $(hospitals).each(function(i) {
            //         facilityDiv.find("ul:last").append($.nano(widgets.physicianConfirmChargeFilter.centralAuditorFacilityOptionTemplate, {
            //             index: i,
            //             data: hospitals[i],
            //             checked: (screen == "editChargesPhysician") ? globalvars.selectedPreHospitalIndex == i ? "checked = 'ckecked'" : "" : globalvars.selectedPostHospitalIndex == i ? "checked = 'checked'" : ""
            //         }));
            //     });
            // }
        }
        ;

        fillFacilityFilter();



        function fillAuditorAllMultiSelectFilter() {

            // var facilityWrapperDiv = $("#outer_filter_wrapper_auditor");
            //  var auditors = globalvars.activeAuditor;

            // $('#selectFilterAudType').empty();

            //  if(auditors){
            //     $(auditors).each(function (i) {
            //         $('#selectFilterAudType').append('<option value='+auditors[i].userId+' >'+ auditors[i].userId +' </option>');

            //     });
              
            // }

            // $("#selectFilterAudType").multiselect({
            //                 multiple: true,
            //                 minWidth: 150,
            //                 selectedText:"# of # checked",
            //                 noneSelectedText: 'Select'
            //                 //  selectedText: 'Select'
            // })

            // $("#selectFilterAudType").multiselect("checkAll");
            // $('.ui-multiselect-menu').css('width', 'auto');


             var facilityWrapperDiv = $("#outer_filter_wrapper_auditor");
             var auditors = globalvars.activeAuditor;

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

            

        }

        widgets.physicianConfirmChargeFilter.fillMultiSelectWrapper();
        log("Facility Filters Height:" + $("#filter_facilities").height());

        if ($("#filter_facilities").height() > 350) {
            $("#filter_facilities ul").addClass("minimized_wrapper_ul");
        }

    },
    fillAuditorMultiSelectFilter: function () {
        var auditors = globalvars.physicianAuditorList;
        var facilityWrapperDiv = $("#outer_filter_wrapper_auditor");
        facilityWrapperDiv.empty();
        var tempDiv = $("<ul></ul>");

        $(auditors).each(function (i) {
            tempDiv.append($.nano(widgets.physicianConfirmChargeFilter.auditorTemplateCheckbox, {
                auditorId: auditors[i].userId,
                data: auditors[i]
            }));
        });

        facilityWrapperDiv.append(tempDiv);
        if ($("#outer_filter_wrapper_auditor ul").height() > 350) {
            $("#outer_filter_wrapper_auditor ul").addClass("minimized_wrapper_ul");
        }

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



        $('.filter_block input:checkbox[name=auditor]').change(function () {
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

            widgets.physicianConfirmChargeFilter.updateScreen();

            // window["screens"][widgets.physicianConfirmChargeFilter.currentScreenName]["onFilterUpdate"]();

        });

        $('.filter_block input:checkbox[name=ALL]').change(function () {
            if ($(this).is(':checked') == true) {
                $('.filter_block input[name=hospital]').attr('checked', true);

            } else if ($(this).is(':checked') == false) {
                $('.filter_block input[name=hospital]').attr('checked', false);
            }
            ;

            widgets.physicianConfirmChargeFilter.selectedFacilityCount();
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

            widgets.physicianConfirmChargeFilter.selectedFacilityCount();
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

            // var hospitals = globalvars.physicianHospitals;

            // $('#selectFilterFacilityType').empty();

            //  if(hospitals){
            //     $(hospitals).each(function (i) {
            //         $('#selectFilterFacilityType').append('<option value='+hospitals[i].hospitalId+'>'+ hospitals[i].hospitalId +' </option>');

            //     });
              
            // }

            // $("#selectFilterFacilityType").multiselect({
            //                 multiple: true,
            //                 minWidth: 150,
            //                 selectedText:"# of # checked",
            //                 noneSelectedText: 'Select'
            //                 //  selectedText: 'Select'
            // })

            // $("#selectFilterFacilityType").multiselect("checkAll");

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
        if (widgets.physicianConfirmChargeFilter.currentScreenName == "physicianConfirmCharges") {
            //selected_auditor_list_array = $('#selectFilterAudType').val();
            $('input[name=auditor]:checked').each(function () {
                selected_auditor_list_array.push($(this).attr('value'));
            });

            if ($('#inactiveAuditor').is(':checked')) {
                if(selected_auditor_list_array){
                    selected_auditor_list_array = selected_auditor_list_array.concat(globalvars.inactiveAuditor);
                }
                else{
                    selected_auditor_list_array = globalvars.inactiveAuditor;
                }
                 
            }
        
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

        globalvars.filterParametersAuditor[widgets.physicianConfirmChargeFilter.screenName] = allFilterParameters;
        widgets.physicianConfirmChargeFilter.allParametersTitles[widgets.physicianConfirmChargeFilter.screenName] = constructURLdataTitles(selected_auditor_list_array);
        widgets.physicianConfirmChargeFilter.allParameters[widgets.physicianConfirmChargeFilter.screenName] = constructURLdata(selected_auditor_list_array);
        localStorage.setItem('filterParametersAuditor', JSON.stringify(widgets.physicianConfirmChargeFilter.allParameters));
        window["screens"][widgets.physicianConfirmChargeFilter.screenName]["onFilterUpdate"](constructURLdata(selected_auditor_list_array));


        function constructURLdata(selected_auditor_list_array) {
            var urlData = {};

            if (widgets.physicianConfirmChargeFilter.filtersToShow.auditorMultiSelect == true) {
                urlData = $.extend(true, urlData, {auditorId: selected_auditor_list_array})
            }
            ;

            return urlData;
        }


        function constructURLdataTitles(selected_auditor_list_array) {
            var urlData = {};
            if (widgets.physicianConfirmChargeFilter.filtersToShow.auditorMultiSelect == true) {
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