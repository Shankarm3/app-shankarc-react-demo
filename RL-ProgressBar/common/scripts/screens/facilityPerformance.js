screens.facilityPerformance = {
    downloadExcelURI: "",
    downloadPdfURI:"",
    hasData: true,
    reportType: "COST_CENTER",
    reportTypeText:"",
    facilityPerformanceTemplate:"",

    initialize: function (param) {

    	screens.facilityPerformance.reportType = param.subType;
    	
    	log("Facility Sub Type:"+screens.facilityPerformance.reportType);
    	
    	if(param.subType === "COST_CENTER"){
    		screens.facilityPerformance.reportTypeText = globalvars.localResourceMap.facility_performance_reporttype1;
    	}else if(param.subType === "DEPT"){
    		screens.facilityPerformance.reportTypeText = globalvars.localResourceMap.facility_performance_reporttype2;
    	}else if(param.subType === "REGION"){
    		screens.facilityPerformance.reportTypeText = globalvars.localResourceMap.facility_performance_reporttype3;
    	}else if(param.subType === "NPI"){
    		screens.facilityPerformance.reportTypeText = globalvars.localResourceMap.facility_performance_reporttype4;
    	}

        
    	
    	this.drawScreen();
    	this.bindFunctionality();
    	if (param == undefined || param == '' || param.submenuIndex == undefined || param.submenuIndex == '') {
    	    //widgets.physicianFilter.updateScreen();
    	} else {
    	    $("#submenu_wrapper a").eq(param.submenuIndex).click();
    	};
    	
    },

    onFilterUpdate: function (filterParameters) {
    	
    	 	
    	this.loadData(filterParameters);

    },

    drawScreen: function () {

    	this.facilityPerformanceTemplate = getTemplate('common/templates/screens/facilityPerformance.html?235');
        globalvars.$contentcontainer.append($.nano(this.facilityPerformanceTemplate, globalvars.localResourceMap));
        $('#facility_performance_download_excel').hide();
        $('#facility_performance_summary_div').hide();

        widgets.performanceSummaryChart.initialize({
            $targetDiv: $("#summary_chart_wrapper")
        });

        widgets.physicianFilter.initialize({
            $targetDiv: $("#filters_wrapper"),
            screen: 'facilityPerformance',
            filters: {
                audit_type: false,
                time_period: true,
                divisions: true,
                costcenter:true,
                hitType : ((globalvars.user.uType == globalvars.roles.supervisor ||  globalvars.user.uType==globalvars.roles.administrator) && globalvars.root.auditLevel=="2")?true:false
            }
        });

    },
	
    loadData: function (filterParameters) {
    	
    	filterParameters.reportType = screens.facilityPerformance.reportType;   //"DEPT" //PAT
        
        if(screens.facilityPerformance.reportType === "COST_CENTER"){
    		$('#grid_title').text(globalvars.localResourceMap.supervisor_facility_performance_submenu1.toUpperCase());
    	}else if(screens.facilityPerformance.reportType === "DEPT"){
    		$('#grid_title').text(globalvars.localResourceMap.supervisor_facility_performance_submenu2.toUpperCase());
    	}else if(screens.facilityPerformance.reportType === "REGION"){
    		$('#grid_title').text(globalvars.localResourceMap.supervisor_facility_performance_submenu3.toUpperCase());
    	}else if(screens.facilityPerformance.reportType === "NPI"){
    		$('#grid_title').text(globalvars.localResourceMap.supervisor_facility_performance_submenu4.toUpperCase());
    	}
        
        var hospitalString = "";
        var costCenterString = "";

        $(filterParameters.hospitalId).each(function (i) {
            hospitalString += "&hospitalId=" + filterParameters.hospitalId[i];
        });

        $(filterParameters.costCenter).each(function (i) {
        	costCenterString += "&costCenter=" + filterParameters.costCenter[i];
        });
        
        if( (globalvars.user.uType == globalvars.roles.executive || globalvars.user.uType == globalvars.roles.reportUser || globalvars.user.uType == globalvars.roles.supervisor || globalvars.user.uType==globalvars.roles.administrator) && globalvars.root.auditLevel=="2" ){
	        var url = globalvars.root.facilityPerformanceExcelUri + "?period=" + filterParameters.period + hospitalString + costCenterString + "&reportType=" + filterParameters.reportType;        
	        screens.facilityPerformance.downloadExcelURI = globalvars.root.facilityPerformanceExcelUri + "?period=" + filterParameters.period + hospitalString + costCenterString + "&reportType=" + filterParameters.reportType;
	        screens.facilityPerformance.downloadPdfURI = globalvars.root.facilityPerformancePdfUri + "?period=" + filterParameters.period + hospitalString + costCenterString + "&reportType=" + filterParameters.reportType;
	    }
        else{
        	var url = globalvars.root.facilityPerformanceExcelUri + "?period=" + filterParameters.period + hospitalString + costCenterString + "&reportType=" + filterParameters.reportType;        
	        screens.facilityPerformance.downloadExcelURI = globalvars.root.facilityPerformanceExcelUri + "?period=" + filterParameters.period + hospitalString + costCenterString + "&reportType=" + filterParameters.reportType;
	        screens.facilityPerformance.downloadPdfURI = globalvars.root.facilityPerformancePdfUri + "?period=" + filterParameters.period + hospitalString + costCenterString + "&reportType=" + filterParameters.reportType;
        	
        }
        
        
        log(screens.facilityPerformance.downloadExcelURI);

        var tempFilterParameters1 = $.extend(true, {}, filterParameters);
        tempFilterParameters1.period = 3;

        var tempFilterParameters2 = $.extend(true, {}, filterParameters);
        tempFilterParameters2.period = 10;

        $.when(

       		$.ajax({
       			type: 'GET',
	            url: globalvars.root.facilityPerformanceUri,
	            data: filterParameters,
	            traditional: true,
	            dataType: 'json'
       		}),

       		$.ajax({
       			type: 'GET',
	            url: globalvars.root.accountReportsUri,
	            data: filterParameters,
	            traditional: true,
	            dataType: 'json'
       		}),

       		$.ajax({
       			type: 'GET',
	            url: globalvars.root.accountReportsUri,
	            data: tempFilterParameters1,
	            traditional: true,
	            dataType: 'json'
       		}),

       		$.ajax({
       			type: 'GET',
	            url: globalvars.root.accountReportsUri,
	            data: tempFilterParameters2,
	            traditional: true,
	            dataType: 'json'
       		})
             /*$.ajax({
                    type: 'GET',
                    url: globalvars.root.accountReportsImpactUri,
                    data: filterParameters,
                    traditional: true,
                    dataType: 'json'
                })*/

        ).done(function(data1, data2, data3, data4){

        	globalvars["facilityPerformance"] = data1[0];
        	globalvars["summaryChartDataCurrentMonth"] = data2[0];
        	globalvars["summaryChartDataLastMonth"] = data3[0];
        	globalvars["summaryChartDataYearToDate"] = data4[0];
            globalvars["rlImpact"] = []; //data5[0];

            if (screens.facilityPerformance.hasData == true) {
            	screens.facilityPerformance.fillScreen(filterParameters);
            }
            
            if(globalvars.facilityPerformance != undefined){
    	        if (globalvars.facilityPerformance.data.length == 0) {
    	            dialogs.messageDialog.show({ text: globalvars.localResourceMap.facility_performance_no_values });
    	            screens.facilityPerformance.removeData();
    	            return false;
    	        }
            }
            
            
            if(globalvars.facilityPerformance != undefined){
    	        for (var i = 0; i < globalvars.facilityPerformance.data.length; i++) {
    	
    	            if (globalvars.facilityPerformance.data[i].rank1 == null) {
    	                globalvars.facilityPerformance.data[i].rank1 = globalvars.localResourceMap.facility_performance_rank_null;
    	            };
    	            
    	            if (globalvars.facilityPerformance.data[i].rank2 == null) {
    	                globalvars.facilityPerformance.data[i].rank2 = globalvars.localResourceMap.facility_performance_rank_null;
    	            };
    	
    	            if (globalvars.facilityPerformance.data[i].groupType == null) {
    	                globalvars.facilityPerformance.data[i].groupType = globalvars.localResourceMap.facility_performance_rank_null;
    	            };
    	            
    	            if(globalvars.facilityPerformance.data[i].groupType == "Others"){
    	            	globalvars.facilityPerformance.data[i].rank1 = globalvars.localResourceMap.facility_performance_rank_other;
    	            	globalvars.facilityPerformance.data[i].rank2 = globalvars.localResourceMap.facility_performance_rank_other;
    	            }
    	
    	            globalvars.facilityPerformance.data[i].hitValue = numberWithCommas(Math.round(parseFloat(globalvars.facilityPerformance.data[i].hitValue)));
    	        };
            }
        	
        });

    },

    removeData: function () {
    	
        $("#facility_performance_chart_table").jqGrid('GridUnload');
        $('#facility_performance_download_excel').hide();
        
    },

    fillScreen: function (filterParameters) {
    	var hideChargeDesc = true;
        var hideHitCount = false;
        var reportTypeGrid;
        widgets.performanceSummaryChart.showData({
            current: {
                dateLabel: $("input:radio[name=period][value=" + filterParameters.period + "]").parent().text(),
                total: globalvars.summaryChartDataCurrentMonth.hitValue,
                reviewRate: globalvars.summaryChartDataCurrentMonth.reviewRate,
                hitRate: globalvars.summaryChartDataCurrentMonth.hitRate,
                reviewedCount: globalvars.summaryChartDataCurrentMonth.reviewedCount,
                hitCount: globalvars.summaryChartDataCurrentMonth.hitsCount
            },
            lastWeek: {
                dollarsFoundPerDay: globalvars.summaryChartDataLastWeek.dollarsFoundPerDay
            },
            last: {
                dateLabel: globalvars.summaryChartDataLastMonth.month,
                total: globalvars.summaryChartDataLastMonth.hitValue,
                reviewRate: globalvars.summaryChartDataLastMonth.reviewRate,
                hitRate: globalvars.summaryChartDataLastMonth.hitRate,
                reviewedCount: globalvars.summaryChartDataLastMonth.reviewedCount,
                hitCount: globalvars.summaryChartDataLastMonth.hitsCount
            },
            yearDate: {
                dateLabel: globalvars.summaryChartDataYearToDate.month,
                total: globalvars.summaryChartDataYearToDate.hitValue,
                reviewRate: globalvars.summaryChartDataYearToDate.reviewRate,
                hitRate: globalvars.summaryChartDataYearToDate.hitRate,
                reviewedCount: globalvars.summaryChartDataYearToDate.reviewedCount,
                hitCount: globalvars.summaryChartDataYearToDate.hitsCount,
                days:globalvars.summaryChartDataYearToDate.days,
                dollarsFoundPerDayAEW:globalvars.summaryChartDataYearToDate.dollarsFoundPerDayAEW
            }
        });
        
        
        $('#facility_performance_summary_div').show();

        $("#facility_performance_chart_table").jqGrid('GridUnload');
        var columnHeader;
        if(screens.facilityPerformance.reportType === "COST_CENTER"){
        	this.reportTypeGrid = globalvars.localResourceMap.facility_performance_reporttype_label4;
        }
        else if(screens.facilityPerformance.reportType === "DEPT"){
        	this.reportTypeGrid = globalvars.localResourceMap.facility_performance_reporttype_label1;
        }
        else if(screens.facilityPerformance.reportType === "REGION"){
        	this.reportTypeGrid = globalvars.localResourceMap.facility_performance_reporttype_label2;
        	columnHeader = globalvars.localResourceMap.facility_performance_reporttype_label3;
        }
        else if(screens.facilityPerformance.reportType === "NPI"){
        	this.reportTypeGrid = globalvars.localResourceMap.facility_performance_reporttype_label3;
        	columnHeader = globalvars.localResourceMap.facility_performance_grid_group_desc;
        }
        else if(screens.facilityPerformance.reportType === "CHARGE"){
        	this.hideChargeDesc=false;
        	this.hideHitCount=true;
        	this.reportTypeGrid = globalvars.localResourceMap.facility_performance_charge_code;
        	}
        else if(screens.facilityPerformance.reportType === "FSC"){
        	this.hideChargeDesc=true;
        	this.hideHitCount=false;
        	this.reportTypeGrid = screens.facilityPerformance.reportTypeText;
        }
        else
        	{
        	this.hideChargeDesc=true;
        	this.hideHitCount=false;
        	this.reportTypeGrid = screens.facilityPerformance.reportTypeText;
        	}
        
        if(screens.facilityPerformance.reportType == "COST_CENTER"){
        	gridPhysician.loadFacilityPerformanceDeptGrid({
	            gridDiv: "#facility_performance_chart_table",
	            data: (globalvars.facilityPerformance != undefined)? screens.facilityPerformance.populateDataforDepartment(globalvars.facilityPerformance.data) : null,
	            reportType: this.reportTypeGrid,
	            colHeader: columnHeader
	        });
        	
        }
        else{
	        gridPhysician.loadFacilityPerformanceDeptGrid({
	            gridDiv: "#facility_performance_chart_table",
	            data: (globalvars.facilityPerformance != undefined)? screens.facilityPerformance.populateDataforDepartment(globalvars.facilityPerformance.data) : null,
	            hideChargeDesc : this.hideChargeDesc,
	            hideHitCount: this.hideHitCount,
	            reportType: this.reportTypeGrid,
	            colHeader: columnHeader
	        });
        }
        
        
        
        if(globalvars.facilityPerformance.data.length != 0)
        	$('#facility_performance_download_excel').show();
        else
        	$('#facility_performance_download_excel').hide();
        
        
        function transferFilters(sourceScreen, targetScreen, targetTab) {
        	var tempStoredParameters = localStorage.getItem('filterParameters');
            if (tempStoredParameters) {
                tempStoredParameters = JSON.parse(tempStoredParameters);
                 if (tempStoredParameters && tempStoredParameters[targetScreen]) {
                    $.extend(tempStoredParameters[targetScreen],tempStoredParameters[sourceScreen]);
                    localStorage.setItem('filterParameters', JSON.stringify(tempStoredParameters));
                    
                }
            }
            
        } 
        
        transferFilters("facilityPerformance","performanceComparison");
        	
        

    },

    bindFunctionality: function () {

        
        $(".export_div_print").click(function(){
        	
        	$("#export_options").hide();
        	if(screens.facilityPerformance.reportType == "COST_CENTER"){
        		printGrid({
        			container:$("#facility_performance_grid_div"),
        			gridTitle:globalvars.localResourceMap.print_chart_facility_performance_department_grid,
        			screenName:"facilityPerformanceGrid"
        		});
        	}else if(screens.facilityPerformance.reportType == "DEPT"){
        		printGrid({
        			container:$("#facility_performance_grid_div"),
        			gridTitle:globalvars.localResourceMap.print_chart_facility_performance_patient_grid,
        			screenName:"facilityPerformanceGrid"
        		});
        	}else if(screens.facilityPerformance.reportType == "REGION"){
        		printGrid({
        			container:$("#facility_performance_grid_div"),
        			gridTitle:globalvars.localResourceMap.print_chart_facility_performance_charge_grid,
        			screenName:"facilityPerformanceGrid"
        		});
        	}else if(screens.facilityPerformance.reportType == "NPI"){
        		printGrid({
        			container:$("#facility_performance_grid_div"),
        			gridTitle:globalvars.localResourceMap.print_chart_facility_performance_financial_class_grid,
        			screenName:"facilityPerformanceGrid"
        		});
        	}
        	else{
        		printGrid({
        			container:$("#facility_performance_grid_div"),
        			gridTitle:globalvars.localResourceMap.print_chart_facility_performance_auditor_grid,
        			screenName:"facilityPerformanceGrid"
        		});
        	}
        
        });
        

        $(".export_div_download").click(function(){
        	
        	$("#export_options").show();
          	
          	$("#download_pdf").off().on("click", function (event) {
          		$("#export_options").hide();
          		//window.location.href = screens.facilityPerformance.downloadPdfURI;
                var $preparingFileModal = $("#preparing-file-modal");
                $preparingFileModal.dialog({ modal: true });
                $.fileDownload(screens.facilityPerformance.downloadPdfURI, {
                    successCallback: function (url) {
                        $preparingFileModal.dialog('destroy');
                    },
                    failCallback: function (responseHtml, url) {
         
                        $preparingFileModal.dialog('destroy');
                        $("#error-modal").dialog({ modal: true });
                    }
                });

          	});
          	
          	$("#download_excel").off().on("click", function (event) {
          		$("#export_options").hide();
          		//window.location.href = screens.facilityPerformance.downloadExcelURI;
                var $preparingFileModal = $("#preparing-file-modal");
                $preparingFileModal.dialog({ modal: true });
                $.fileDownload(screens.facilityPerformance.downloadExcelURI, {
                    successCallback: function (url) {
                        $preparingFileModal.dialog('destroy');
                    },
                    failCallback: function (responseHtml, url) {
         
                        $preparingFileModal.dialog('destroy');
                        $("#error-modal").dialog({ modal: true });
                    }
                });
          	});
    
        });


    },
    populateDataforDepartment:function(data){
    	
    	
    	var sortedArray=[];

    	if(data){
    		$.each(data, function (i) {
    				if(data[i].groupDesc==null){
    					data[i].groupDesc="";
    				}
    				if(data[i].groupType != "" && data[i].groupDesc == ""){  //parent
    					var objectParent = jQuery.extend(true, {}, data[i]);
    					objectParent.level="0";
    					objectParent.parent="null";
    					objectParent.isLeaf=false;
    					objectParent.expanded=false;
    					objectParent.groupDesc="";
    					objectParent.id = objectParent.groupType.replace(/[^a-zA-Z0-9]/g,'');
    					sortedArray.push(objectParent);
    				}
    				else if(data[i].groupType != "" && data[i].groupDesc != ""){ // child
    					var objectChild = jQuery.extend(true, {}, data[i]);
    					objectChild.id=objectChild.groupType + "_" +  i + "_j";
    					objectChild.parent=objectChild.groupType.replace(/[^a-zA-Z0-9]/g,'');
    					objectChild.groupType="";
    					objectChild.isLeaf=true;
    					objectChild.expanded=false;
    					objectChild.level="";
    	        		
    	        		sortedArray.push(objectChild);
    				}
    			
    		})

    		return sortedArray;
    	}
   	
    },
    populateDataforFacilityDepartment:function(data){
        
        
        var sortedArray=[];
        
        if(data){
            
            $.each(data, function (i) {
                
                    if(data[i].groupType != "" && data[i].groupDesc == ""){  //parent
                        var objectParent = jQuery.extend(true, {}, data[i]);
                        objectParent.level="0";
                        objectParent.parent="null";
                        objectParent.isLeaf=false;
                        objectParent.expanded=false;
                        objectParent.id = objectParent.groupType.replace(/[^a-zA-Z0-9]/g,'');
                        sortedArray.push(objectParent);
                    }
                    else if(data[i].groupType != "" && data[i].groupDesc != ""){ // child
                        var objectChild = jQuery.extend(true, {}, data[i]);
                        objectChild.id=objectChild.groupType + "_" +  i + "_j";
                        objectChild.parent=objectChild.groupType.replace(/[^a-zA-Z0-9]/g,'');
                        objectChild.groupType="";
                        objectChild.rank1 = "";
                        objectChild.rank2 = "";
                        objectChild.isLeaf=true;
                        objectChild.expanded=false;
                        objectChild.level="";
                        
                        sortedArray.push(objectChild);
                    }
                
            })
            
            return sortedArray;
        }
        
        console.log(sortedArray);
    },
    populateDataforFacilityHCPC:function(data){
        
        
        var sortedArray=[];
        
        if(data){
            
            $.each(data, function (i) {
                
                    if(data[i].groupType != "" && data[i].groupDesc == ""){  //parent
                        var objectParent = jQuery.extend(true, {}, data[i]);
                        objectParent.level="0";
                        objectParent.parent="null";
                        objectParent.isLeaf=false;
                        objectParent.expanded=false;
                        objectParent.id = objectParent.groupType.replace(/[^a-zA-Z0-9]/g,'');
                        sortedArray.push(objectParent);
                    }
                    else if(data[i].groupType != "" && data[i].groupDesc != ""){ // child
                        var objectChild = jQuery.extend(true, {}, data[i]);
                        objectChild.id=objectChild.groupType + "_" +  i + "_j";
                        objectChild.parent=objectChild.groupType.replace(/[^a-zA-Z0-9]/g,'');
                        objectChild.groupType="";
                        objectChild.rank1 = "";
                        objectChild.rank2 = "";
                        objectChild.isLeaf=true;
                        objectChild.expanded=false;
                        objectChild.level="";
                        
                        sortedArray.push(objectChild);
                    }
                
            })
            
            return sortedArray;
        }
        
        console.log(sortedArray);
    },
    populateDataforFacilityCategory:function(data){
        
        
        var sortedArray=[];
        
        if(data){
            
            $.each(data, function (i) {
                
                    if(data[i].groupType != "" && data[i].groupDesc == ""){  //parent
                        var objectParent = jQuery.extend(true, {}, data[i]);
                        objectParent.level="0";
                        objectParent.parent="null";
                        objectParent.isLeaf=false;
                        objectParent.expanded=false;
                        objectParent.id = objectParent.groupType.replace(/[^a-zA-Z0-9]/g,'');
                        sortedArray.push(objectParent);
                    }
                    else if(data[i].groupType != "" && data[i].groupDesc != ""){ // child
                        var objectChild = jQuery.extend(true, {}, data[i]);
                        objectChild.id=objectChild.groupType + "_" +  i + "_j";
                        objectChild.parent=objectChild.groupType.replace(/[^a-zA-Z0-9]/g,'');
                        objectChild.groupType="";
                        objectChild.rank1 = "";
                        objectChild.rank2 = "";
                        objectChild.isLeaf=true;
                        objectChild.expanded=false;
                        objectChild.level="";
                        
                        sortedArray.push(objectChild);
                    }
                
            })
            
            return sortedArray;
        }
        
        console.log(sortedArray);
    }


};