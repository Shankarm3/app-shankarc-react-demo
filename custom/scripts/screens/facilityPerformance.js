screens.facilityPerformance = {
    downloadExcelURI: "",
    downloadPdfURI:"",
    hasData: true,
    reportType: "DEPT",
    reportTypeText:"",
    facilityPerformanceTemplate:"",

    initialize: function (param) {
    	
    	screens.facilityPerformance.reportType = param.subType;
    	
    	log("Facility Sub Type:"+screens.facilityPerformance.reportType);
    	
    	if(param.subType === "DEPT"){
    		screens.facilityPerformance.reportTypeText = globalvars.localResourceMap.facility_performance_reporttype1;
    	}else if(param.subType === "PAT"){
    		screens.facilityPerformance.reportTypeText = globalvars.localResourceMap.facility_performance_reporttype2;
    	}else if(param.subType === "CHARGE"){
    		screens.facilityPerformance.reportTypeText = globalvars.localResourceMap.facility_performance_reporttype3;
    	}else if(param.subType === "AUDITOR"){
    		screens.facilityPerformance.reportTypeText = globalvars.localResourceMap.facility_performance_reporttype4;
    	}else if(param.subType === "FSC"){
    		screens.facilityPerformance.reportTypeText = globalvars.localResourceMap.facility_performance_reporttype5;
    	}
    	
    	this.drawScreen();
    	this.bindFunctionality();
    	if (param == undefined || param == '' || param.submenuIndex == undefined || param.submenuIndex == '') {
    	    widgets.filter.updateScreen();
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

        widgets.filter.initialize({
            $targetDiv: $("#filters_wrapper"),
            screen: 'facilityPerformance',
            filters: {
                audit_type: true,
                time_period: true,
                divisions: true,
                hitType : ((globalvars.user.uType == globalvars.roles.supervisor ||  globalvars.user.uType==globalvars.roles.administrator) && globalvars.root.auditLevel=="2")?true:false
            }
        });

        widgets.summaryChart.initialize({
            $targetDiv: $("#summary_chart_wrapper")
        });

    },
	
    loadData: function (filterParameters) {
    	
    	filterParameters.reportType = screens.facilityPerformance.reportType;   //"DEPT" //PAT
        
        if(screens.facilityPerformance.reportType === "DEPT"){
    		$('#grid_title').text(globalvars.localResourceMap.facility_performance_reporttype1);
    	}else if(screens.facilityPerformance.reportType === "PAT"){
    		$('#grid_title').text(globalvars.localResourceMap.facility_performance_reporttype2);
    	}else if(screens.facilityPerformance.reportType === "CHARGE"){
    		$('#grid_title').text(globalvars.localResourceMap.facility_performance_reporttype3);
    	}else if(screens.facilityPerformance.reportType === "AUDITOR"){
    		$('#grid_title').text(globalvars.localResourceMap.facility_performance_reporttype4);
    	}else if(screens.facilityPerformance.reportType === "FSC"){
    		$('#grid_title').text(globalvars.localResourceMap.facility_performance_reporttype5);
    	}
        
        var hospitalString = "";

        $(filterParameters.hospitalId).each(function (i) {
            hospitalString += "&hospitalId=" + filterParameters.hospitalId[i];
        });
        
        if( (globalvars.user.uType == globalvars.roles.executive || globalvars.user.uType == globalvars.roles.reportUser || globalvars.user.uType == globalvars.roles.supervisor || globalvars.user.uType==globalvars.roles.administrator) && globalvars.root.auditLevel=="2" ){
	        var url = globalvars.root.facilityPerformanceExcelUri + "?billType=" + filterParameters.billType + "&reportType=" + filterParameters.reportType + hospitalString + "&period=" + filterParameters.period+"&hitType=" + filterParameters.hitType;        
	        screens.facilityPerformance.downloadExcelURI = globalvars.root.facilityPerformanceExcelUri + "?billType=" + filterParameters.billType + "&reportType=" + filterParameters.reportType + hospitalString + "&period=" + filterParameters.period+"&hitType=" + filterParameters.hitType;
	        screens.facilityPerformance.downloadPdfURI = globalvars.root.facilityPerformancePdfUri + "?billType=" + filterParameters.billType + "&reportType=" + filterParameters.reportType + hospitalString + "&period=" + filterParameters.period+"&hitType=" + filterParameters.hitType;
	    }
        else{
        	var url = globalvars.root.facilityPerformanceExcelUri + "?billType=" + filterParameters.billType + "&reportType=" + filterParameters.reportType + hospitalString + "&period=" + filterParameters.period;        
	        screens.facilityPerformance.downloadExcelURI = globalvars.root.facilityPerformanceExcelUri + "?billType=" + filterParameters.billType + "&reportType=" + filterParameters.reportType + hospitalString + "&period=" + filterParameters.period;
	        screens.facilityPerformance.downloadPdfURI = globalvars.root.facilityPerformancePdfUri + "?billType=" + filterParameters.billType + "&reportType=" + filterParameters.reportType + hospitalString + "&period=" + filterParameters.period;
        	
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

        ).done(function(data1, data2, data3, data4){

        	globalvars["facilityPerformance"] = data1[0];
        	globalvars["summaryChartDataCurrentMonth"] = data2[0];
        	globalvars["summaryChartDataLastMonth"] = data3[0];
        	globalvars["summaryChartDataYearToDate"] = data4[0];
            if(globalvars.facilityPerformance != undefined){
    	        if (globalvars.facilityPerformance.data.length == 0) {
    	            dialogs.messageDialog.show({ text: globalvars.localResourceMap.facility_performance_no_values });
    	            screens.facilityPerformance.removeData();
    	            return false;
    	        }
    	        else {
    	        	screens.facilityPerformance.fillScreen(filterParameters);
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
    
        widgets.summaryChart.showData({
            current: {
                dateLabel: $("input:radio[name=period][value=" + filterParameters.period + "]").parent().text(),
                total: globalvars.summaryChartDataCurrentMonth.hitValue,
                reviewRate: globalvars.summaryChartDataCurrentMonth.reviewRate,
                hitRate: globalvars.summaryChartDataCurrentMonth.hitRate
            },
            last: {
                dateLabel: globalvars.summaryChartDataLastMonth.month,
                total: globalvars.summaryChartDataLastMonth.hitValue,
                reviewRate: globalvars.summaryChartDataLastMonth.reviewRate,
                hitRate: globalvars.summaryChartDataLastMonth.hitRate
            },
            yearDate: {
                dateLabel: globalvars.summaryChartDataYearToDate.month,
                total: globalvars.summaryChartDataYearToDate.hitValue,
                reviewRate: globalvars.summaryChartDataYearToDate.reviewRate,
                hitRate: globalvars.summaryChartDataYearToDate.hitRate
            }
        });
        
        
        $('#facility_performance_summary_div').show();

        $("#facility_performance_chart_table").jqGrid('GridUnload');
        
        if(screens.facilityPerformance.reportType === "CHARGE"){
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
        
        if(screens.facilityPerformance.reportType == "DEPT"){
        	grids.loadFacilityPerformanceDeptGrid({
	            gridDiv: "#facility_performance_chart_table",
	            data: (globalvars.facilityPerformance != undefined)? screens.facilityPerformance.populateDataforDepartment(globalvars.facilityPerformance.data) : null,
	            reportType: this.reportTypeGrid,
	            rank1:globalvars.localResourceMap.facility_performance_rank_header_prefix + " " + globalvars.facilityPerformance.previousMonth,
	            rank2:globalvars.localResourceMap.facility_performance_rank_header_prefix + " " + globalvars.facilityPerformance.previousPreviousMonth
	        });
        	
        }
        else{
	        grids.loadFacilityPerformanceGrid({
	            gridDiv: "#facility_performance_chart_table",
	            data: (globalvars.facilityPerformance != undefined)? globalvars.facilityPerformance.data : null,
	            hideChargeDesc : this.hideChargeDesc,
	            hideHitCount: this.hideHitCount,
	            reportType: this.reportTypeGrid,
	            rank1:globalvars.localResourceMap.facility_performance_rank_header_prefix + " " + globalvars.facilityPerformance.previousMonth,
	            rank2:globalvars.localResourceMap.facility_performance_rank_header_prefix + " " + globalvars.facilityPerformance.previousPreviousMonth
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
        	if(screens.facilityPerformance.reportType == "DEPT"){
        		printGrid({
        			container:$("#facility_performance_grid_div"),
        			gridTitle:globalvars.localResourceMap.print_chart_facility_performance_department_grid,
        			screenName:"facilityPerformanceGrid"
        		});
        	}else if(screens.facilityPerformance.reportType == "PAT"){
        		printGrid({
        			container:$("#facility_performance_grid_div"),
        			gridTitle:globalvars.localResourceMap.print_chart_facility_performance_patient_grid,
        			screenName:"facilityPerformanceGrid"
        		});
        	}else if(screens.facilityPerformance.reportType == "CHARGE"){
        		printGrid({
        			container:$("#facility_performance_grid_div"),
        			gridTitle:globalvars.localResourceMap.print_chart_facility_performance_charge_grid,
        			screenName:"facilityPerformanceGrid"
        		});
        	}else if(screens.facilityPerformance.reportType == "FSC"){
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
          	
          	$("#download_pdf").click(function(){
          		$("#export_options").hide();
          		window.location.href = screens.facilityPerformance.downloadPdfURI;
          	});
          	
          	$("#download_excel").click(function(){
          		$("#export_options").hide();
          		window.location.href = screens.facilityPerformance.downloadExcelURI;
          	});
    
        });


    },
    populateDataforDepartment:function(data){
    	
    	
    	var sortedArray=[];
		
    	if(data){
    		
    		$.each(data, function (i) {
    			
    				if(data[i].groupType != "" && data[i].chargeCode == ""){  //parent
    					var objectParent = jQuery.extend(true, {}, data[i]);
    					objectParent.level="0";
    					objectParent.parent="null";
    					objectParent.isLeaf=false;
    					objectParent.expanded=false;
    					objectParent.id = objectParent.groupType.replace(/[^a-zA-Z0-9]/g,'');
    					objectParent.chargeDesc="";
    					sortedArray.push(objectParent);
    				}
    				else if(data[i].groupType != "" && data[i].chargeCode != ""){ // child
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
    	
    }
};