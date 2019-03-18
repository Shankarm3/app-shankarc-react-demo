widgets.centralAuditorfilter = {
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
        this.currentScreenName = params.screen;
        this.showData(params.$targetDiv, params.filters, params.screen);
        this.bindFunctionality();
    },
    checkLoadedAuditors: function () {
        //preBill
        //postBill
        //associationRules
        //cciEdits
        // 

       

        if (globalvars.auditorListPre === undefined) {
            getJSONModel({
                async: false,
                url: globalvars.root.auditorsUri,
                data:{billType:'PRE'},
                targetVar: "auditorListPre"
            });
        };

        if (globalvars.auditorListPost === undefined) {
            getJSONModel({
                async: false,
                url: globalvars.root.auditorsUri,
                data:{billType:'POST'},
                targetVar: "auditorListPost"
            });
        };

        if (globalvars.auditorListEdit === undefined) {
            getJSONModel({
                async: false,
                url: globalvars.root.auditorsUri,
                data:{billType:'EDITS'},
                targetVar: "auditorListEdit"
            });
        };

        
        
        if (globalvars.analysisAuditorList === undefined) {
            getJSONModel({
                async: false,
                url: globalvars.root.getAllAuditor,
                targetVar: "analysisAuditorList"
            });
        };
    },
    loadData: function() {
        if (this.centralAuditorFilterTemplate == "") {
            this.centralAuditorFilterTemplate = getTemplate('common/templates/widgets/centralAuditorFilter.html');
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
            widgets.centralAuditorfilter.allParameters = localStorageParameters;
            if (localStorageParameters && localStorageParameters[widgets.centralAuditorfilter.screenName]) {
                widgets.centralAuditorfilter.currentScreenParameters = localStorageParameters[widgets.centralAuditorfilter.screenName];
            } else {
                widgets.centralAuditorfilter.currentScreenParameters = null;
            };
        };
    },
    showData: function($filterDiv, filters, screen) {
    	
    	
        $filterDiv.empty();
        $filterDiv.append($.nano(widgets.centralAuditorfilter.centralAuditorFilterTemplate, globalvars.localResourceMap));
        

        if (filters.auditorMultiSelect == true) {
        	widgets.centralAuditorfilter.checkLoadedAuditors();
        }
        
        if (filters.auditorMultiSelect == true) {
        	if(widgets.centralAuditorfilter.currentScreenName == "confirmCharges"){
            	fillAuditorAllMultiSelectFilter();

        	}else{

                var selectedBillType ="";
                if(widgets.centralAuditorfilter.screenName == 'preBill' || widgets.centralAuditorfilter.screenName == 'associationRules' || widgets.centralAuditorfilter.screenName == 'editCharges')
                    selectedBillType='PRE'
                else if(widgets.centralAuditorfilter.screenName == 'postBill'){
                    selectedBillType='POST'
                }
                else if(widgets.centralAuditorfilter.screenName == 'cciEdits' || widgets.centralAuditorfilter.screenName == 'editChargesCCIEdits')
                    selectedBillType='EDITS'





        		widgets.centralAuditorfilter.fillAuditorMultiSelectFilter(selectedBillType);
        	}
        	
        	
        }
        
        
        if (this.currentScreenParameters) {
        	
        	if (this.currentScreenParameters.auditorId) {
                $.each(this.currentScreenParameters.auditorId, function (key, value) {
                	var temp = value.replace('.', "");
                    $("input:checkbox[name=auditor]").each(function(index){
                    	if(	$(this).val() == value){
                    		$(this).attr('checked', true);
                    	}
                    	
                	});
                });
        	};
        	
        } else {
           
            if (filters.auditorMultiSelect == true) {
                //$("#filter_auditors_select").val(globalvars.auditorPerformanceAuditorList[0].userId);
            	$("input:checkbox[name=auditor]").attr('checked', true);
            };
           
        };
        
        
        
        if (filters.audit_type !== true) {
            $('#filter_audit_type').hide();
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
        }


        function fillFacilityFilter() {
            var facilityDiv = $("#filter_facilities");
            facilityDiv.append("<ul></ul>");
            var hospitals;
            var billType = $('input:radio[name=billType]:checked').val();
            if (screen == "preBill")
                hospitals = globalvars.preHospitals;
            else if (screen == "postBill")
                hospitals = globalvars.postHospitals;



            if (widgets.centralAuditorfilter.currentScreenName == "preBill" || widgets.centralAuditorfilter.currentScreenName == "postBill") {
                $(hospitals).each(function(i) {
                    facilityDiv.find("ul:last").append($.nano(widgets.centralAuditorfilter.centralAuditorFacilityOptionTemplate, {
                        index: i,
                        data: hospitals[i],
                        checked: (screen == "preBill") ? globalvars.selectedPreHospitalIndex == i ? "checked = 'ckecked'" : "" : globalvars.selectedPostHospitalIndex == i ? "checked = 'checked'" : ""
                    }));
                });
            }

            if (widgets.centralAuditorfilter.currentScreenName == "editCharges") {
                var billType = globalvars.selectedBillTypeForSubmitCharge;
                var pType = globalvars.selectedpTypeForSubmitCharge;
                log("billType:::" + billType);

                if (billType == "PRE") {
                    $('.filter_block input[name=billType]')[0].checked = true;
                    hospitals = globalvars.preHospitals;
                }
                else {
                    $('.filter_block input[name=billType]')[1].checked = true;
                    hospitals = globalvars.postHospitals;
                }
                
                if(pType == "MD")
                	$('.filter_block input[name=pType]')[0].checked = true;
                else if(pType == "RULE")
                	$('.filter_block input[name=pType]')[1].checked = true;
                else if(pType == "OV")
                	$('.filter_block input[name=pType]')[2].checked = true;
                
                
                $(hospitals).each(function(i) {
                    facilityDiv.find("ul:last").append($.nano(widgets.centralAuditorfilter.centralAuditorFacilityOptionTemplate, {
                        index: i,
                        data: hospitals[i],
                        checked: (billType == "PRE") ? globalvars.selectedPreHospitalIndex == i ? "checked = 'ckecked'" : "" : globalvars.selectedPostHospitalIndex == i ? "checked = 'checked'" : ""
                    }));
                });
                widgets.centralAuditorfilter.selectedFacilityCount();

            }
            
            if (widgets.centralAuditorfilter.currentScreenName == "editChargesCCIEdits") {
            	hospitals = globalvars.cciHospitals;
            	
                $(hospitals).each(function(i) {
                    facilityDiv.find("ul:last").append($.nano(widgets.centralAuditorfilter.centralAuditorFacilityOptionTemplate, {
                        index: i,
                        data: hospitals[i],
                        checked: globalvars.selectedCciHospitalIndex == i ? "checked = 'ckecked'":""
                    }));
                });
            }
            
            if(widgets.centralAuditorfilter.currentScreenName == "associationRules") {
            	hospitals = globalvars.preHospitals;
            	
                    $(hospitals).each(function(i) {
                        facilityDiv.find("ul:last").append($.nano(widgets.centralAuditorfilter.centralAuditorFacilityOptionTemplate, {
                            index: i,
                            data: hospitals[i],
                            checked: globalvars.selectedPreHospitalIndex == i ? "checked = 'ckecked'":""
                        }));
                    });
                
            	
            }
            
            if(widgets.centralAuditorfilter.currentScreenName == 'cciEdits'){
            	
            	hospitals = globalvars.cciHospitals;
            	
                $(hospitals).each(function(i) {
                    facilityDiv.find("ul:last").append($.nano(widgets.centralAuditorfilter.centralAuditorFacilityOptionTemplate, {
                        index: i,
                        data: hospitals[i],
                        checked: globalvars.selectedCciHospitalIndex == i ? "checked = 'ckecked'":""
                    }));
                });
            }
            

        };

        fillFacilityFilter();
        
      //   function fillAuditorMultiSelectFilter(billType){
      //       var auditors;
      //       if(billType == "PRE")
      //           auditors = globalvars.auditorListPre;
      //       else if(billType == "POST")
      //           auditors = globalvars.auditorListPost;
      //       else if(billType == "EDITS")
      //           auditors = globalvars.auditorListEdit;

       	
      // 	  var facilityWrapperDiv = $("#outer_filter_wrapper_auditor");
      //     // var auditors = globalvars.auditorPerformanceAuditorList;

      //      var tempDiv = $("<ul></ul>");
      //      $(auditors).each(function(i) {
      //          tempDiv.append($.nano(widgets.centralAuditorfilter.auditorTemplateCheckbox, {
      //         	 auditorId: auditors[i].userId,
      //              data: auditors[i]
      //          }));
      //      });

      //      facilityWrapperDiv.append(tempDiv);
      //      if ($("#outer_filter_wrapper_auditor ul").height() > 350) {
      //          $("#outer_filter_wrapper_auditor ul").addClass("minimized_wrapper_ul");
      //      }

      //      //widgets.analysisFilter.selectedFacilityCount();
      	
      // }
        
        function fillAuditorAllMultiSelectFilter(){
        	
      	  var facilityWrapperDiv = $("#outer_filter_wrapper_auditor");
           var auditors = globalvars.analysisAuditorList;

           var tempDiv = $("<ul></ul>");
           $(auditors).each(function(i) {
               tempDiv.append($.nano(widgets.centralAuditorfilter.auditorTemplateCheckbox, {
              	 auditorId: auditors[i],
                   data: auditors[i]
               }));
           });

           facilityWrapperDiv.append(tempDiv);
           if ($("#outer_filter_wrapper_auditor ul").height() > 350) {
               $("#outer_filter_wrapper_auditor ul").addClass("minimized_wrapper_ul");
           }

           //widgets.analysisFilter.selectedFacilityCount();
      	
      }
    
        widgets.centralAuditorfilter.fillMultiSelectWrapper();
        log("Facility Filters Height:" + $("#filter_facilities").height());

        if ($("#filter_facilities").height() > 350) {
            $("#filter_facilities ul").addClass("minimized_wrapper_ul");
        }

    },

    fillAuditorMultiSelectFilter:function(billType){
            var auditors=[];
            if(billType == "PRE")
                auditors = globalvars.auditorListPre;
            else if(billType == "POST")
                auditors = globalvars.auditorListPost;
            else if(billType == "EDITS")
                auditors = globalvars.auditorListEdit;

        
          var facilityWrapperDiv = $("#outer_filter_wrapper_auditor");
          facilityWrapperDiv.empty();
          // var auditors = globalvars.auditorPerformanceAuditorList;

           var tempDiv = $("<ul></ul>");
           $(auditors).each(function(i) {
               tempDiv.append($.nano(widgets.centralAuditorfilter.auditorTemplateCheckbox, {
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
    bindFunctionality: function() {
    	
    	
    	
    	
    	
        $('.filter_heading').click(function() {
            $(this).next().slideToggle();
            $(this).toggleClass('collapsed');
        });


        $('input:radio[name=billType]').click(function() {
            widgets.centralAuditorfilter.fillMultiSelectWrapper();
            widgets.centralAuditorfilter.fillSingleSelectWrapper();
            if(widgets.centralAuditorfilter.currentScreenName != "confirmCharges")
                widgets.centralAuditorfilter.fillAuditorMultiSelectFilter($('input:radio[name=billType]:checked').val());

            if ($("#filter_facilities").height() > 350) {
                $("#filter_facilities ul").addClass("minimized_wrapper_ul");
            }
        });
        
        
        $('.filter_block input:checkbox[name=ALLAuditor]').change(function () {
            if ($(this).is(':checked') == true) {
               $('.filter_block input[name=auditor]').attr('checked', true);

            } else if ($(this).is(':checked') == false) {
                 $('.filter_block input[name=auditor]').attr('checked', false);
            };

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

        $("#filter_update_button").click(function() {

            if (widgets.centralAuditorfilter.currentScreenName === "preBill") {
                globalvars.selectedPreHospitalIndex = $('input:radio[name=facility]:checked').val();
            } else if (widgets.centralAuditorfilter.currentScreenName === "postBill") {
                globalvars.selectedPostHospitalIndex = $('input:radio[name=facility]:checked').val();
            }
            else if (widgets.centralAuditorfilter.currentScreenName === "editCharges") {

                if (($('input:radio[name=billType]:checked').val() == "PRE"))
                    globalvars.selectedPreHospitalIndex = $('input:radio[name=facility]:checked').val();
                else
                    globalvars.selectedPostHospitalIndex = $('input:radio[name=facility]:checked').val();
            }
            else if (widgets.centralAuditorfilter.currentScreenName === "editChargesCCIEdits") {

                //if (($('input:radio[name=billType]:checked').val() == "PRE"))
                    globalvars.selectedCciHospitalIndex = $('input:radio[name=facility]:checked').val();
                //else
                  //  globalvars.selectedPostHospitalIndex = $('input:radio[name=facility]:checked').val();
            }
            else if (widgets.centralAuditorfilter.currentScreenName === "associationRules") {
            	 globalvars.selectedPreHospitalIndex = $('input:radio[name=facility]:checked').val();
            }
            else if (widgets.centralAuditorfilter.currentScreenName == 'cciEdits') {
           	 globalvars.selectedCciHospitalIndex = $('input:radio[name=facility]:checked').val();
           }
            
            widgets.centralAuditorfilter.updateScreen();
            
           // window["screens"][widgets.centralAuditorfilter.currentScreenName]["onFilterUpdate"]();

        });

        $('.filter_block input:checkbox[name=ALL]').change(function() {
            if ($(this).is(':checked') == true) {
                $('.filter_block input[name=hospital]').attr('checked', true);

            } else if ($(this).is(':checked') == false) {
                $('.filter_block input[name=hospital]').attr('checked', false);
            }
            ;

            widgets.centralAuditorfilter.selectedFacilityCount();
        });

        $('.filter_block input:checkbox[name=hospital]').on('change',function() {
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

            widgets.centralAuditorfilter.selectedFacilityCount();
        });

        $("#startdate").datepicker({
            onSelect: function(date) {
                $("#enddate").datepicker("option", "minDate", date);
                document.getElementById("startdate").value = date;
            },
            dateFormat: 'yy-mm-dd'
        });

        $("#enddate").datepicker({
            onSelect: function(date) {
                $("#startdate").datepicker("option", "maxDate", date);
                document.getElementById("enddate").value = date;
            },
            dateFormat: 'yy-mm-dd'
        });
        
        var defaultMessage = globalvars.localResourceMap.filter_input_text;
        $("#filterAccount").focus(function(){
            if( $(this).val() == defaultMessage){
                $(this).val("");
            }
        }).blur(function(){
            if( $(this).val() == "" ){
                $(this).val(defaultMessage);
            }
        }).val(defaultMessage);
        
        $("#startdate").datepicker('setDate', new Date());
    	$("#enddate").datepicker('setDate', new Date());
    },
    fillMultiSelectWrapper: function() {

        $('.filter_block input[name=ALL]').attr('checked', false);
        $("#outer_filter_wrapper ul").remove();

        var facilityWrapperDiv = $("#outer_filter_wrapper");
        ($('input:radio[name=billType]:checked').val() == "PRE") ? hospitals = globalvars.preHospitals : hospitals = globalvars.postHospitals;

        var tempDiv = $("<ul></ul>");
        $(hospitals).each(function(i) {
            tempDiv.append($.nano(widgets.centralAuditorfilter.facilityTemplate, {
                hospitalId: hospitals[i].hospitalId,
                data: hospitals[i]
            }));
        });

        facilityWrapperDiv.append(tempDiv);
        if ($("#outer_filter_wrapper ul").height() > 350) {
            $("#outer_filter_wrapper ul").addClass("minimized_wrapper_ul");
        }

        widgets.centralAuditorfilter.selectedFacilityCount();

    },
    updateScreen: function() {
    	
    	var selected_auditor_list_array = [];

        $('input[name=auditor]:checked').each(function () {
        	selected_auditor_list_array.push($(this).attr('value'));
        });
        
        var activeFilterParameters = constructURLdata(selected_auditor_list_array);
        if (activeFilterParameters.auditorId && activeFilterParameters.auditorId.length == 0) {
            dialogs.messageDialog.show({ text: 'No Auditor selected. You must select at least one Auditor'});
            return false;
        };
        
        
        
        var allFilterParameters = {
                auditorId:selected_auditor_list_array
               
            };
            
            globalvars.filterParametersAuditor[widgets.centralAuditorfilter.screenName] = allFilterParameters;
            widgets.centralAuditorfilter.allParametersTitles[widgets.centralAuditorfilter.screenName] = constructURLdataTitles(selected_auditor_list_array);
            widgets.centralAuditorfilter.allParameters[widgets.centralAuditorfilter.screenName] = constructURLdata(selected_auditor_list_array);
            localStorage.setItem('filterParametersAuditor', JSON.stringify(widgets.centralAuditorfilter.allParameters));
            window["screens"][widgets.centralAuditorfilter.screenName]["onFilterUpdate"](constructURLdata(selected_auditor_list_array));
    	
            
       function constructURLdata(selected_auditor_list_array) {
    	   var urlData = {};
    	   
    	   if (widgets.centralAuditorfilter.filtersToShow.auditorMultiSelect == true){
               urlData = $.extend(true, urlData, {auditorId: selected_auditor_list_array})
           };
           
           return urlData;
       }
    	
       
       function constructURLdataTitles(selected_auditor_list_array) {
           var urlData = {};
           if (widgets.centralAuditorfilter.filtersToShow.auditorMultiSelect == true) {
               urlData = $.extend(true, urlData, { auditorId: selected_auditor_list_array })
           };
           return urlData;
       }
    },
    selectedFacilityCount: function() {
        var checkedHospitalsCount = $('.filter_block input:checkbox[name=hospital]:checked').length;
        $('#selected_facility_count').text(checkedHospitalsCount + " " + globalvars.localResourceMap.dashboard_filter_selected_facility);
    },
    fillSingleSelectWrapper: function() {
    	
    	
        $("#filter_facilities ul").remove();

        var facilityDiv = $("#filter_facilities");
        facilityDiv.append("<ul></ul>")
        var hospitals;

        ($('input:radio[name=billType]:checked').val() == "PRE") ? hospitals = globalvars.preHospitals : hospitals = globalvars.postHospitals;
        
        
        
        
        if (widgets.centralAuditorfilter.currentScreenName == "preBill" || widgets.centralAuditorfilter.currentScreenName == "postBill") {
            $(hospitals).each(function(i) {
                facilityDiv.find("ul:last").append($.nano(widgets.centralAuditorfilter.centralAuditorFacilityOptionTemplate, {
                    index: i,
                    data: hospitals[i],
                    checked: (screen == "preBill") ? globalvars.selectedPreHospitalIndex == i ? "checked = 'ckecked'" : "" : globalvars.selectedPostHospitalIndex == i ? "checked = 'checked'" : ""
                }));
            });
        }

        if (widgets.centralAuditorfilter.currentScreenName == "editCharges" || widgets.centralAuditorfilter.currentScreenName == "editChargesCCIEdits") {
            var billType = $('input:radio[name=billType]:checked').val();
            (billType == "PRE") ? hospitals = globalvars.preHospitals : hospitals = globalvars.postHospitals;
            
            if(hospitals.length > 0){
	            $(hospitals).each(function(i) {
	                facilityDiv.find("ul:last").append($.nano(widgets.centralAuditorfilter.centralAuditorFacilityOptionTemplate, {
	                    index: i,
	                    data: hospitals[i],
	                    checked: (billType == "PRE") ? globalvars.selectedPreHospitalIndex == i ? "checked = 'ckecked'" : "" : globalvars.selectedPostHospitalIndex == i ? "checked = 'checked'" : ""
	                }));
	            });
	         }
            else
            	{
                dialogs.messageDialog.show({text: globalvars.localResourceMap.central_auditor_no_hospital_assign});
            	}
        }
        if (widgets.centralAuditorfilter.currentScreenName == "editChargesCCIEdits") {
            
            hospitals = globalvars.cciHospitals;
            
            if(hospitals.length > 0){
	            $(hospitals).each(function(i) {
	                facilityDiv.find("ul:last").append($.nano(widgets.centralAuditorfilter.centralAuditorFacilityOptionTemplate, {
	                    index: i,
	                    data: hospitals[i],
	                    checked:globalvars.selectedCciHospitalIndex == i ? "checked = 'ckecked'" : ""
	                }));
	            });
	         }
            else
            	{
                dialogs.messageDialog.show({text: globalvars.localResourceMap.central_auditor_no_hospital_assign});
            	}
        }
        
        if (widgets.centralAuditorfilter.currentScreenName == "associationRules") {
        	
        	$(hospitals).each(function(i) {
                facilityDiv.find("ul:last").append($.nano(widgets.centralAuditorfilter.centralAuditorFacilityOptionTemplate, {
                    index: i,
                    data: hospitals[i],
                    checked: globalvars.selectedPreHospitalIndex == i ? "checked = 'ckecked'":""
                }));
            });
        	
        }
        
        if (widgets.centralAuditorfilter.currentScreenName == 'cciEdits') {
        	
        	$(hospitals).each(function(i) {
                facilityDiv.find("ul:last").append($.nano(widgets.centralAuditorfilter.centralAuditorFacilityOptionTemplate, {
                    index: i,
                    data: hospitals[i],
                    checked: globalvars.selectedPreHospitalIndex == i ? "checked = 'ckecked'":""
                }));
            });
        	
        }



    }

}