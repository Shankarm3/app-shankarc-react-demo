widgets.physicianFilter = {
    filterTemplate: "",
    divisionTemplate: "",
    hospitalTemplate: "",
    auditorTemplate:"",
    screenName: "",
    tabName: "",
    filtersToShow: {},
    allParameters: {},
    allParametersTitles: {},
    currentScreenParameters: null,
    auditorTemplateCheckbox:"",

    initialize: function (params) {
        this.screenName = params.screen;
        this.tabName = params.selectedTab;
        this.filtersToShow = params.filters;
        this.loadData(params);
    },

    loadData: function (params) {

    	var filtersToShow = params.filters;
    	
    	if(this.filterTemplate==""){
    		this.filterTemplate = getTemplate('common/templates/widgets/physicianFilter.html');
    	}
    	
    	if(this.divisionTemplate==""){
    		this.divisionTemplate = getTemplate('common/templates/filter_division.html');
    	}
        
    	if(this.hospitalTemplate==""){
    		this.hospitalTemplate = getTemplate('common/templates/filter_facility.html');
    	}
        
    	if(this.auditorTemplate==""){
    		this.auditorTemplate =  getTemplate('common/templates/option_item_auditor.html');
    	}

         if (this.auditorTemplateCheckbox == "") {
            this.auditorTemplateCheckbox = getTemplate('common/templates/filter_auditor_checkbox.html');
        }

        

        var localStorageParameters = localStorage.getItem('filterParameters');

        if (localStorageParameters) {
            localStorageParameters = JSON.parse(localStorageParameters);
            widgets.physicianFilter.allParameters = localStorageParameters;
            if (localStorageParameters && localStorageParameters[widgets.physicianFilter.screenName]) {
                widgets.physicianFilter.currentScreenParameters = localStorageParameters[widgets.physicianFilter.screenName];
            } else {
                widgets.physicianFilter.currentScreenParameters = null;
            };
        };

        var  deferredCollection = [];

    	if(globalvars.divsions === undefined){
    		deferredCollection.push(getDivisions());
        }

        if (filtersToShow.costcenter == true) {
            if (globalvars.costCenterList === undefined){
        		deferredCollection.push(getAllCostCenter());
            }
        }

        if (filtersToShow.auditors == true) {
            if (globalvars.analysisAuditorList === undefined){
        		deferredCollection.push(getAllAuditors());
            }
        }

        $.when.apply($, deferredCollection).done(function(){
            widgets.physicianFilter.showData(params.$targetDiv, params.filters);
            widgets.physicianFilter.bindFunctionality();
            widgets.physicianFilter.updateScreen();
        });        		


        function getDivisions(){
        	var dfd = jQuery.Deferred();
    		$.ajax({
				type: 'GET',
                url: globalvars.root.divisionsUri,
				traditional: true,
				dataType: 'json',
				success: function(data){
	        		globalvars["divsions"] = data;
	    	    	return dfd.resolve();
				}
    		})
        	return dfd.promise();
        }
        

        function getAllCostCenter(){
        	var dfd = jQuery.Deferred();
    		$.ajax({
				type: 'GET',
                url: globalvars.root.costCenterUri,
				traditional: true,
				dataType: 'json',
				success: function(data){
	        		globalvars["costCenterList"] = data;
	    	    	return dfd.resolve();
				}
    		})
        	return dfd.promise();
        }
        
        function getAllAuditors(){
        	var dfd = jQuery.Deferred();
    		$.ajax({
				type: 'GET',
                url: globalvars.root.auditorsUri,
				traditional: true,
				dataType: 'json',
				success: function(response){
					var data = _.map(response, 'userId');
	        		globalvars["analysisAuditorList"] = data;
	    	    	return dfd.resolve();
				}
    		})
        	return dfd.promise();
        }

    },

    showData: function ($filterDiv, filters) {
        $filterDiv.empty();
        $filterDiv.append($.nano(widgets.physicianFilter.filterTemplate, globalvars.localResourceMap));

        fillDivisionFilter();
        fillCostCenterAllMultiSelectFilter();
        if (filters.auditors == true) {
            fillAuditorFilter();
        };
       
        if (this.currentScreenParameters) {
            
            $("input:radio[name=period][value=" + this.currentScreenParameters.period + "]").attr('checked', 'checked');
            $("#filter_auditors_select").val(this.currentScreenParameters.auditorId);
            
            if (this.currentScreenParameters.hospitalId) {
                $.each(this.currentScreenParameters.hospitalId, function (key, value) {
                    $("input:checkbox[name=hospital][value=" + value + "]").attr('checked', true);
                });
            };
        } 
        else {
            $("input:checkbox[name=hospital]").attr('checked', true);
            if (filters.auditors == true) {
                $("#filter_auditors_select").val(globalvars.analysisAuditorList[0]);
            };
        };


        if (this.currentScreenParameters) {
            
            if (this.currentScreenParameters.costCenter) {
            	var totalCostCount = $("input:checkbox[name=auditor]").length;
            	var currentCostCount = this.currentScreenParameters.costCenter.length;
                $.each(this.currentScreenParameters.costCenter, function (key, value) {
                    var temp = value.replace('.', "");
                    $("input:checkbox[name=auditor]").each(function(index){
                        if( $(this).val() == value){
                            $(this).attr('checked', true);
                        }
                        
                    });
                });
                if(totalCostCount == currentCostCount){
                    $("input:checkbox[name=ALLCostCenter]").attr('checked', true)
                }
                else{
                    $("input:checkbox[name=ALLCostCenter]").attr('checked', false)
                }
            };

            
        } else{
           
            if (widgets.physicianFilter.filtersToShow.costcenter == true) {
                //$("#filter_auditors_select").val(globalvars.auditorPerformanceAuditorList[0].userId);
                //$("input:checkbox[name=auditor]").attr('checked', true);
                $("input:checkbox[name=auditor]").each(function(index){
            		/*if(widgets.physicianFilter.tabName == 'TREND'){
	                	if(index<4){
                        	$(this).attr('checked', true);
                		}
                		else{
                        	$(this).attr('checked', false);
                		}
                	}
                	else{
                		$(this).attr('checked', true);
                	}*/
                	
                	$(this).attr('checked', true);

                });
                
                $("input:checkbox[name=ALLCostCenter]").attr('checked', true)
            };
           
        };

       
        drawAuditorMultiSelect();

        this.updateSelectedFacilitiesCounter();

        
        if (filters.time_period !== true) { $('#filter_time_period').hide(); }
        if (filters.divisions !== true) { $('#filter_divisions').hide(); }
        if (filters.auditors !== true) { $('#filter_auditors').hide(); }

        function fillDivisionFilter() {
            var tempDiv = $("<div></div>");
            $.each(globalvars.divsions, function (index) {
                tempDiv.append($.nano(widgets.physicianFilter.divisionTemplate, this)).append("<ul></ul>");
                $.each(this.hospitals, function (subindex) {
                    tempDiv.find("ul:last").append($.nano(widgets.physicianFilter.hospitalTemplate, this));
                });
            });
            tempDiv.find("ul").hide();
            tempDiv.appendTo('#outer_filter_wrapper');
        };

        function fillAuditorFilter(){
        //alert(JSON.stringify(globalvars.analysisAuditorList));
       	 $("#filter_auditors_select").empty();
       	 var tempHtml = "";
       	 $(globalvars.analysisAuditorList).each(function (i) {
                tempHtml += $.nano(widgets.physicianFilter.auditorTemplate, { index: globalvars.analysisAuditorList[i], data: globalvars.analysisAuditorList[i] });
            });
       	 $("#filter_auditors_select").append(tempHtml);
       };

       function drawAuditorMultiSelect(){
	        $("#filter_auditors_select").multiselect({
	         selectedList:1,
	         multiple: false,
	         minWidth: 175
	        });
	        $("#filter_auditors_select").multiselect('refresh');
       };

        // var config = {
        //   '.chosen-select'           : {},
        //   '.chosen-select-deselect'  : {allow_single_deselect:true},
        //   '.chosen-select-no-single' : {disable_search_threshold:10},
        //   '.chosen-select-no-results': {no_results_text:'Oops, nothing found!'},
        //   '.chosen-select-width'     : {width:"95%"}
        //     }
        //     for (var selector in config) {
        //       $(selector).chosen(config[selector]);
        //     }
        
        // function drawCostCenterSelect(){
        // 	 $("#filter_cost_select").empty();
        // 	 var tempHtml = "";
        //      if(widgets.physicianFilter.currentScreenParameters)
        //         var selectedCost = widgets.physicianFilter.currentScreenParameters.costCenter;
        // 	 $(globalvars.costCenterList).each(function (i) {

        //         var flag=false;

        //         if(selectedCost){
        //             for (var j=0;j<selectedCost.length;j++) {
        //                 if(selectedCost[j] == globalvars.costCenterList[i]){
        //                     flag=true;
        //                     break;
        //                 }
        //             }

                
        //         if(flag)
        //              tempHtml += $.nano(widgets.physicianFilter.auditorTemplate, { selected:'selected', index: globalvars.costCenterList[i], data: globalvars.costCenterList[i] });
        //          else
        //             tempHtml += $.nano(widgets.physicianFilter.auditorTemplate, {index: globalvars.costCenterList[i], data: globalvars.costCenterList[i] });
        //         }
        //         else{
        //          tempHtml += $.nano(widgets.physicianFilter.auditorTemplate, {index: globalvars.costCenterList[i], data: globalvars.costCenterList[i] });   
        //         }

        //      });
        // 	 $("#filter_cost_select").append(tempHtml);
        //      $('.chosen-select').trigger("chosen:updated");

        //      //drawAuditorMultiSelect();
        // };
        
        function fillCostCenterAllMultiSelectFilter(){
            
          var facilityWrapperDiv = $("#outer_filter_wrapper_auditor");
           var costcenter = globalvars.costCenterList;

           var tempDiv = $("<ul></ul>");
           $(costcenter).each(function(i) {
               tempDiv.append($.nano(widgets.physicianFilter.auditorTemplateCheckbox, {
                 auditorId: costcenter[i],
                   data: costcenter[i]
               }));
           });

           facilityWrapperDiv.append(tempDiv);
           if ($("#outer_filter_wrapper_auditor ul").height() > 350) {
               $("#outer_filter_wrapper_auditor ul").addClass("minimized_wrapper_ul");
           }

           //widgets.analysisFilter.selectedFacilityCount();
        
            }
            
        
        // function drawAuditorMultiSelect(){
	       //  $("#filter_cost_select").multiselect({	         
	       //   //minWidth: 175
	       //  });
	       // // $("#filter_cost_select").multiselect('refresh');
        // };
    },

    bindFunctionality: function () {

        $('.filter_heading').click(function () {
            $(this).next().slideToggle();
            $(this).toggleClass('collapsed');
        });

        $("#filter_update_button").click(function () {
            widgets.physicianFilter.updateScreen();
        });

        $('.filter_block input:checkbox[name=hospital]').change(function () {
            var checkedHospitalsCount = $(this).parent().parent().find('input:checkbox[name=hospital]:checked').length;
            var hospitalsCount = $(this).parent().parent().find('input:checkbox[name=hospital]').length;

            if (checkedHospitalsCount == 0) {
                $(this).parent().parent().prev(".filter_division").find("input:checkbox[name=division]").prop('indeterminate', false);
                $(this).parent().parent().prev(".filter_division").find("input:checkbox[name=division]").attr('checked', false);

            } else if (checkedHospitalsCount == hospitalsCount) {
                $(this).parent().parent().prev(".filter_division").find("input:checkbox[name=division]").prop('indeterminate', false);
                $(this).parent().parent().prev(".filter_division").find("input:checkbox[name=division]").attr('checked', true);

            } else {
                $(this).parent().parent().prev(".filter_division").find("input:checkbox[name=division]").prop('indeterminate', true);
                $(this).parent().parent().prev(".filter_division").find("input:checkbox[name=division]").attr('checked', false);
            }

            checkSelectAll()
            widgets.physicianFilter.updateSelectedFacilitiesCounter();
        });

        $('input:checkbox[name=hospital]').change();


        $('.filter_block input:checkbox[name=division]').change(function () {
            if ($(this).is(':checked') == true) {
                $(this).parent().next("ul").find('input:checkbox[name=hospital]').attr('checked', true);
            } else if ($(this).is(':checked') == false) {
                $(this).parent().next("ul").find('input:checkbox[name=hospital]').attr('checked', false);
            };

            checkSelectAll()
            widgets.physicianFilter.updateSelectedFacilitiesCounter();
        });

        $('.filter_block input:checkbox[name=ALL]').change(function () {
            if ($(this).is(':checked') == true) {
                $('.filter_block input[name=division]').prop('indeterminate', false);
                $('.filter_block input[name=division]').attr('checked', true);

                $('.filter_block input[name=hospital]').attr('checked', true);

            } else if ($(this).is(':checked') == false) {
                $('.filter_block input[name=division]').attr('checked', false);
                $('.filter_block input[name=division]').prop('indeterminate', false);

                $('.filter_block input[name=hospital]').attr('checked', false);
            };

            widgets.physicianFilter.updateSelectedFacilitiesCounter();
        });




        $('.filter_block input:checkbox[name=auditor]').change(function () {
            var checkedHospitalsCount = $(this).parent().parent().find('input:checkbox[name=auditor]:checked').length;
            var hospitalsCount = $(this).parent().parent().find('input:checkbox[name=auditor]').length;

            if (checkedHospitalsCount == 0) {
                 $('.filter_block input[name=ALLCostCenter]').prop('indeterminate', false);
                 $('.filter_block input[name=ALLCostCenter]').attr('checked', false);

            } else if (checkedHospitalsCount == hospitalsCount) {
               $('.filter_block input[name=ALLCostCenter]').prop('indeterminate', false);
                 $('.filter_block input[name=ALLCostCenter]').attr('checked', true);

            } else {
                $('.filter_block input[name=ALLCostCenter]').prop('indeterminate', true);
                 $('.filter_block input[name=ALLCostCenter]').attr('checked', false);
            }

           // checkSelectAllCostCenter()
            
        });






        $('.filter_block input:checkbox[name=ALLCostCenter]').change(function () {
            if ($(this).is(':checked') == true) {
                $('.filter_block input[name=ALLCostCenter]').prop('indeterminate', false);
                $('.filter_block input[name=ALLCostCenter]').attr('checked', true);

                $('.filter_block input[name=auditor]').attr('checked', true);

            } else if ($(this).is(':checked') == false) {
                $('.filter_block input[name=ALLCostCenter]').attr('checked', false);
                $('.filter_block input[name=ALLCostCenter]').prop('indeterminate', false);

                $('.filter_block input[name=auditor]').attr('checked', false);
            };

           // widgets.physicianFilter.updateSelectedFacilitiesCounter();
        });


        function checkSelectAll() {
            var hospitalsCount = $('.filter_block input:checkbox[name=hospital]').length;
            var checkedHospitalsCount = $('.filter_block input:checkbox[name=hospital]:checked').length;

            if (checkedHospitalsCount == 0) {
                $('.filter_block input[name=ALL]').attr('checked', false);
                $('.filter_block input[name=ALL]').prop('indeterminate', false);
            }
            else if (checkedHospitalsCount > 0 && checkedHospitalsCount < hospitalsCount) {
                $('.filter_block input[name=ALL]').attr('checked', false);
                $('.filter_block input[name=ALL]').prop('indeterminate', true);
            }
            else if (checkedHospitalsCount == hospitalsCount) {
                $('.filter_block input[name=ALL]').attr('checked', true);
                $('.filter_block input[name=ALL]').prop('indeterminate', false);
            };
        };



        $(".division_expand").off().on("click", function () {
            $(this).parent().next("ul").stop(true, true).slideToggle();
            $(this).toggleClass("arrow_right_background").toggleClass("arrow_down_background");
            return false;
        });

    },

    updateSelectedFacilitiesCounter: function () {
        var checkedHospitalsCount = $('.filter_block input:checkbox[name=hospital]:checked').length;
        $('#selected_facility_count').text(checkedHospitalsCount + " " + globalvars.localResourceMap.dashboard_filter_selected_facility);
    },

    updateScreen: function (screen) {

        var selected_hospital_list_array = [];
        var select_cost_center_array=[];

        $('input[name=hospital]:checked').each(function () {
            selected_hospital_list_array.push($(this).attr('value'));
        });

        $('input[name=auditor]:checked').each(function () {
            select_cost_center_array.push($(this).attr('value'));
        });

        var activeFilterParameters = constructURLdata(selected_hospital_list_array);

        if (activeFilterParameters.hospitalId && activeFilterParameters.hospitalId.length == 0) {
            dialogs.messageDialog.show({ text: globalvars.localResourceMap.dashboard_filter_no_facility_message });
            return false;
        };

        if (activeFilterParameters.costCenter && activeFilterParameters.costCenter.length == 0) {
            dialogs.messageDialog.show({ text: 'No Cost Center selected. You must select at least one Cost Center' });
            return false;
        };
        

        var allFilterParameters = {
            // billType: $('input:radio[name=billType]:checked').val(),
            // hitType: $('input:radio[name=hitType]:checked').val(),
            // codeType: $('input:radio[name=codeType]:checked').val(),
            // metricType: $('input:radio[name=metricType]:checked').val(),
            period: $('input:radio[name=period]:checked').val(),
            hospitalId: selected_hospital_list_array,
            costCenter:select_cost_center_array,
            auditorId:$("#filter_auditors_select").multiselect("getChecked").attr("value")
        };
        
        globalvars.filterParameters[widgets.physicianFilter.screenName] = allFilterParameters;
        widgets.physicianFilter.allParametersTitles[widgets.physicianFilter.screenName] = constructURLdataTitles(selected_hospital_list_array);
        widgets.physicianFilter.allParameters[widgets.physicianFilter.screenName] = constructURLdata(selected_hospital_list_array);
        localStorage.setItem('filterParameters', JSON.stringify(widgets.physicianFilter.allParameters));
        window["screens"][widgets.physicianFilter.screenName]["onFilterUpdate"](constructURLdata(selected_hospital_list_array));

        function constructURLdata(selected_hospital_list_array) {

            var urlData = {};

           
            if (widgets.physicianFilter.filtersToShow.time_period == true){
                urlData = $.extend(true, urlData, {period: $('input:radio[name=period]:checked').val()})
            };

            if (widgets.physicianFilter.filtersToShow.divisions == true){
                urlData = $.extend(true, urlData, {hospitalId: selected_hospital_list_array})
            };

            if (widgets.physicianFilter.filtersToShow.costcenter == true){
                urlData = $.extend(true, urlData, {costCenter:select_cost_center_array});
            };

            if (widgets.physicianFilter.filtersToShow.auditors == true){
                urlData = $.extend(true, urlData, {auditorId:$("#filter_auditors_select").multiselect("getChecked").attr("value")})
            };

            return urlData;
        }


        function constructURLdataTitles(selected_hospital_list_array) {

            var urlData = {};

          

            if (widgets.physicianFilter.filtersToShow.time_period == true) {
                urlData = $.extend(true, urlData, { period: $('input:radio[name=period]:checked').val() })
            };

            if (widgets.physicianFilter.filtersToShow.divisions == true) {
                urlData = $.extend(true, urlData, { hospitalId: selected_hospital_list_array })
            };

            if (widgets.physicianFilter.filtersToShow.costcenter == true){
                urlData = $.extend(true, urlData, {costCenter:select_cost_center_array});
            };

            if (widgets.physicianFilter.filtersToShow.auditors == true) {
                urlData = $.extend(true, urlData, { auditorId: $("#filter_auditors_select").multiselect("getChecked").attr("value") })
            };

            return urlData;
        }
    }
};