screens.auditorPerformance = {
		
		downloadExcelURI: "",
		downloadPdfURI:"",
	    reportType: "TREND",
		
		initialize : function() {
			
			this.drawScreen();
			this.bindFunctionality();

		},
		
	    drawScreen: function () {

	        var auditorPerformanceTemplate = getTemplate('common/templates/screens/auditorPerformance.html?235');
	        globalvars.$contentcontainer.append($.nano(auditorPerformanceTemplate, globalvars.localResourceMap));

	        $("#auditor_comparison_widget").hide();
	        $("#auditor_performance_widget").show();

	        screens.auditorPerformance.reportType = "TREND";

	        widgets.physicianFilter.initialize({
	            $targetDiv: $("#filters_wrapper"),
	            screen: 'auditorPerformance',
	            selectedTab: 'TREND',
	            filters: {
                    audit_type: false,
                    time_period: true,
                    divisions: false,
                    costcenter:true,
                    auditors:true,
	                hitType : ((globalvars.user.uType == globalvars.roles.supervisor ||  globalvars.user.uType==globalvars.roles.administrator) && globalvars.root.auditLevel=="2")?true:false
	            }
	        });

	        widgets.performanceSummaryChart.initialize({
	            $targetDiv: $("#summary_chart_wrapper")
	        });
	    },
	    
	    onFilterUpdate: function (filterParameters) {
	        this.loadData(filterParameters);
	    },
	    
	    loadData : function(filterParameters){
	    	
	    	var tempFilterParameters = $.extend(true, {}, filterParameters);

	    	if(screens.auditorPerformance.reportType === "TREND"){
  		
	    		$.when(

	    			$.ajax({
	    				type: 'GET',
	    				url: globalvars.root.auditorTrendUri,
	    				data: filterParameters,
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
	    			
	    		).done(function(data){
	            	globalvars["auditorPerformanceTrendChartData"] = data;
	            	globalvars["rlImpact"] = []; //data2[0];
    			 	screens.auditorPerformance.loadAdditionalData(filterParameters);
	    		})
	    		  
	    	}else if(screens.auditorPerformance.reportType === "COMPARISON"){
	    		
	    		 var hospitalString = "";
	    		 var costCenterString = "";

		         $(filterParameters.hospitalId).each(function (i) {
		             hospitalString += "&hospitalId=" + filterParameters.hospitalId[i];
		         });
		         
		         $(filterParameters.costCenter).each(function (i) {
		         	costCenterString += "&costCenter=" + filterParameters.costCenter[i];
		         });

		         if( (globalvars.user.uType == globalvars.roles.executive || globalvars.user.uType == globalvars.roles.reportUser || globalvars.user.uType == globalvars.roles.supervisor || globalvars.user.uType==globalvars.roles.administrator) && globalvars.root.auditLevel=="2" ){
		        	 screens.auditorPerformance.downloadExcelURI = globalvars.root.auditorComparisonExcelUri + "?period=" + filterParameters.period + costCenterString + "&auditorId=" + filterParameters.auditorId;
		        	 screens.auditorPerformance.downloadPdfURI =   globalvars.root.auditorComparisonPdfUri + "?period=" + filterParameters.period + costCenterString + "&auditorId=" + filterParameters.auditorId;
		         }else{
		        	 screens.auditorPerformance.downloadExcelURI = globalvars.root.auditorComparisonExcelUri + "?period=" + filterParameters.period + costCenterString +  "&auditorId=" + filterParameters.auditorId;
			         screens.auditorPerformance.downloadPdfURI =   globalvars.root.auditorComparisonPdfUri + "?period=" + filterParameters.period + costCenterString +  "&auditorId=" + filterParameters.auditorId;
			         
		         }

		         tempFilterParameters.isAuditor = false;
	    		
	    		 $.when(

	    				 $.ajax({
	    					 type: 'GET',
	    					 url: globalvars.root.auditorComparisonUri,
	    					 data: filterParameters,
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
			    			
	    		 ).done(function(data){
	    			 	globalvars["auditorPerformanceComparison"] = data;
	    			 	globalvars["rlImpact"] = []; //data2[0];
	    			 	for (var i = 0; i < globalvars.auditorPerformanceComparison.data.length; i++) {
	    			 		globalvars.auditorPerformanceComparison.data[i].hitValue = "$" + numberWithCommas(Math.round(parseFloat(globalvars.auditorPerformanceComparison.data[i].hitValue)));
	    			 		globalvars.auditorPerformanceComparison.data[i].reviewedRate = Math.round(parseFloat(globalvars.auditorPerformanceComparison.data[i].reviewedRate));
	    			 		globalvars.auditorPerformanceComparison.data[i].hitRate = Math.round(parseFloat(globalvars.auditorPerformanceComparison.data[i].hitRate));
	    			 	}
	    			 	screens.auditorPerformance.loadAdditionalData(filterParameters);
	    		 })

	    	}

	    },
	    
	    fillScreen : function(filterParameters){
	    	
	    	if(screens.auditorPerformance.reportType === "TREND"){
	    		var index = screens.auditorPerformance.getAuditorIndex(filterParameters.auditorId);
	    		
		    	$("#auditor_performance_widget_chart_header").text(globalvars.localResourceMap.auditor_performance_trend_chart_title + ' ' + globalvars.analysisAuditorList[index] );
		    	
		    	widgets.performanceSummaryChart.showData({
		            current: {
		                dateLabel: $("input:radio[name=period][value=" + filterParameters.period + "]").parent().text(),
		                total: globalvars.summaryChartDataCurrentMonth.hitValue,
		                reviewRate: globalvars.summaryChartDataCurrentMonth.reviewRate,
		                hitRate: globalvars.summaryChartDataCurrentMonth.hitRate,
		                reviewedCount: globalvars.summaryChartDataYearToDate.reviewedCount,
		                hitCount: globalvars.summaryChartDataYearToDate.hitsCount,
		            },
		            lastWeek: {
		                dollarsFoundPerDay: globalvars.summaryChartDataLastWeek.dollarsFoundPerDay
		            },
		            last: {
		                dateLabel: globalvars.summaryChartDataLastMonth.month,
		                total: globalvars.summaryChartDataLastMonth.hitValue,
		                reviewRate: globalvars.summaryChartDataLastMonth.reviewRate,
		                hitRate: globalvars.summaryChartDataLastMonth.hitRate,
		                reviewedCount: globalvars.summaryChartDataYearToDate.reviewedCount,
		                hitCount: globalvars.summaryChartDataYearToDate.hitsCount,
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

		        var xAxisLabel = "";
		        var xAxisDataAlignment = "right";
		        var xAxisDataRotate = -45;

		        if (filterParameters.period <= 2) {
		            xAxisLabel = globalvars.localResourceMap.overall_trends_chart_xaxis_label_daily;
		        } else if ((filterParameters.period > 2) && (filterParameters.period <= 6)) {
		            xAxisLabel = globalvars.localResourceMap.overall_trends_chart_xaxis_label_weekly;
		        } else {
		            xAxisLabel = globalvars.localResourceMap.overall_trends_chart_xaxis_label_monthly;
		        }

		        function calculateCount(){
		            if(globalvars.auditorPerformanceTrendChartData.yAxis){
		             var reviewCountData = globalvars.auditorPerformanceTrendChartData.yAxis[globalvars.auditorPerformanceTrendChartData.yAxis.length-1];
		             var maxValue=0;
		             if(reviewCountData.name = "reviewedCount"){
		                var dataCount = reviewCountData.data;
		                maxValue = Math.max.apply( Math, dataCount );
		                console.log(maxValue);
		                return maxValue;
		                //return (maxValue < 10)?10:maxValue;
		             }
		            }

		        }
		        // un comment for testing
		        /*globalvars.auditorPerformanceTrendChartData = {"xAxis":["Jul-17","Aug-17","Sep-17","Oct-17","Nov-17","Dec-17","Jan-18","Feb-18","Mar-18","Apr-18","May-18","Jun-18","Jul-18"],"yAxis":[{"name":"missingDollars","data":[0,0,0,0,1059.00,2472.00,26970.00,66467.00,67137.00,125793.00,0,0,0],"type":"column","yAxis":1},{"name":"reviewed","data":[0,0,0,0,10.53,72.50,90.82,76.83,57.84,59.76,0,0,0],"type":"line","yAxis":0},{"name":"hits","data":[0,0,0,0,37.50,13.79,11.91,7.87,9.11,7.62,0,0,0],"type":"line","yAxis":0},{"name":"reviewedCount","data":[0,0,0,0,8.00,87.00,445.00,902.00,966.00,499.00,0,0,0],"type":"line","yAxis":2}]};
		         globalvars.auditorPerformanceTrendChartData.yAxis[0]=[{"name":"Page 1","data":[2,1,6,4,2,5],"type":"column"},{"name":"Page 2","data":[4,3,5,2,2,5],"type":"column"},{"name":"Page 3","data":[2,3,1,6,8,7],"type":"column"},{"name":"Page 4","data":[2,4,3,7,4,6],"type":"column"},{"name":"Page 5","data":[3,4,8,3,6,5],"type":"column"},{"name":"Page 6","data":[5,6,10,12,13,14],"type":"column"}];
		         yaxisData1 = [globalvars.auditorPerformanceTrendChartData.yAxis[0],globalvars.auditorPerformanceTrendChartData.yAxis[2],globalvars.auditorPerformanceTrendChartData.yAxis[3]];
		         yaxisData1 = [{"type":"column","name":"Anesthesia","data":[5,5,5,5,5,5,5,5,5,5,5,5,5]},{"type":"column","name":"Cardiology","data":[3,3,2,6,8,4,5,1,7,8,4,3,2]},{"type":"column","name":"ED OB","data":[2,5,2,6,5,4,5,2,4,8,6,3,5]},{"type":"column","name":"OB","data":[4,8,2,6,8,4,5,2,1,8,7,3,7]},{"type":"column","name":"Pathology","data":[6,3,2,6,4,4,2,2,4,8,7,7,7]},{"type":"column","name":"Radiology","data":[5,3,2,6,5,4,5,2,1,4,7,3,8]},{"name":"hits","data":[0,0,0,0,37.5,13.79,11.91,7.87,9.11,7.62,0,0,0],"type":"line","yAxis":0},{"name":"reviewedCount","data":[0,0,0,0,8,87,445,902,966,499,0,0,0],"type":"line","yAxis":2}];
		        //alert(JSON.stringify(yaxisData1));*/
		        charts.trendsChartAuditPerformance.initialize({
		            chartDiv: "auditor_performance_widget_chart",
		            xAxisLabel: xAxisLabel,
		            xAxisDataAlignment: xAxisDataAlignment,
		            xAxisDataRotate: xAxisDataRotate,
		            xAxisData: globalvars.auditorPerformanceTrendChartData.xAxis,
		            yAxisData: globalvars.auditorPerformanceTrendChartData.yAxis,
		            titleText: globalvars.localResourceMap.auditor_performance_trend_chart_title + filterParameters.auditorId,
                	yMaxreviewedCount:calculateCount(),
                	filename: 'auditorPerformance'
		        });
		        
	    	}else if(screens.auditorPerformance.reportType === "COMPARISON"){
	    		
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
	            
	            var $auditorPerformanceGrid = $("#auditor_comparison_widget_table");
				$auditorPerformanceGrid.jqGrid('GridUnload');
	            
				gridPhysician.loadAuditorPerformanceComparisonGrid({
		    		  data:globalvars.auditorPerformanceComparison.data,
		              gridDiv: "#auditor_comparison_widget_table",
		              pagerDiv: "#auditor_comparison_widget_pager"
		        });
	    		
	    	}
	    	
	    },

	    loadAdditionalData: function(filterParameters){

	        var tempFilterParameters = $.extend(true, {}, filterParameters);
	        tempFilterParameters.period = 3;

	        var tempFilterParameters1 = $.extend(true, {}, filterParameters);
	        tempFilterParameters1.period = 10;

	    	$.when(

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
    				data: tempFilterParameters,
    				traditional: true,
    				dataType: 'json'
	    		}),
	    		
	    		$.ajax({
    				type: 'GET',
    				url: globalvars.root.accountReportsUri,
    				data: tempFilterParameters1,
    				traditional: true,
    				dataType: 'json'
	    		})

	    	).done(function(data1, data2, data3){
	    		globalvars["summaryChartDataCurrentMonth"] = data1[0];
	    		globalvars["summaryChartDataLastMonth"] = data2[0];
	    		globalvars["summaryChartDataYearToDate"] = data3[0];
		        if(screens.auditorPerformance.reportType === "TREND"){
		        	if(globalvars.auditorPerformanceTrendChartData){
		        		
		        	}else{
		        			dialogs.messageDialog.show({ text: globalvars.localResourceMap.overall_trends_no_data_text });
		        	}
		        }
		        else if(screens.auditorPerformance.reportType === "COMPARISON"){
		        	
		        	if(globalvars.auditorPerformanceComparison){
		        		if(globalvars.auditorPerformanceComparison.data.length==0){
		        			dialogs.messageDialog.show({ text: globalvars.localResourceMap.overall_trends_no_data_text });
		        		}
		        	}else{
		        		dialogs.messageDialog.show({ text: globalvars.localResourceMap.overall_trends_no_data_text });
		        	}
		        }
		        screens.auditorPerformance.fillScreen(filterParameters);
	    	})
	    	
//	        if (globalvars.summaryChartDataCurrentMonth.hitRate == 0 && globalvars.summaryChartDataCurrentMonth.dollarsFoundPerDay == 0 && globalvars.summaryChartDataCurrentMonth.reviewRate == 0) {
//	            dialogs.messageDialog.show({ text: globalvars.localResourceMap.overall_trends_no_data_text });
//	        }
	        
	    	
	    },

	    bindFunctionality : function(){
	    	$("#performance_dept_grid thead th").click(function(){
	    		alert('col heade clicked');
	    	})
	        $("#submenu_wrapper a").eq(0).click(function () {
	            $("#submenu_wrapper a").removeClass("active");
	            $("#submenu_wrapper a").eq(0).addClass("active");
	            screens.auditorPerformance.reportType = "TREND";
	            $("#export_options").hide();
	            widgets.physicianFilter.initialize({
	                $targetDiv: $("#filters_wrapper"),
	                screen: 'auditorPerformance',
		            selectedTab: 'TREND',
	                filters: {
	                    audit_type: false,
	                    time_period: true,
	                    divisions: false,
	                    auditors: true,
		                costcenter:true,
						hitType : ((globalvars.user.uType == globalvars.roles.supervisor ||  globalvars.user.uType==globalvars.roles.administrator) && globalvars.root.auditLevel=="2")?true:false
	                }
	            });

	            $("#auditor_comparison_widget").hide();
	            $("#auditor_performance_widget").show();

	        });

	        $("#submenu_wrapper a").eq(1).click(function () {
	            $("#submenu_wrapper a").removeClass("active");
	            $("#submenu_wrapper a").eq(1).addClass("active");
	            screens.auditorPerformance.reportType = "COMPARISON";

	            widgets.physicianFilter.initialize({
	                $targetDiv: $("#filters_wrapper"),
	                screen: 'auditorPerformance',
		            selectedTab: 'COMPARISON',
	                filters: {
	                    audit_type: false,
	                    time_period: true,
	                    divisions: false,
	                    auditors: false,
		                costcenter:true,
						hitType : ((globalvars.user.uType == globalvars.roles.supervisor ||  globalvars.user.uType==globalvars.roles.administrator) && globalvars.root.auditLevel=="2")?true:false
	                }
	            });

	            $("#auditor_performance_widget").hide();
	            $("#auditor_comparison_widget").show();

	        });
	       
	        $("#auditor_performance_download_excel").off().on("click", function (event) {
	        	//window.location.href = screens.auditorPerformance.downloadExcelURI;
                var $preparingFileModal = $("#preparing-file-modal");
                $preparingFileModal.dialog({ modal: true });
                $.fileDownload(screens.auditorPerformance.downloadExcelURI, {
                    successCallback: function (url) {
                        $preparingFileModal.dialog('destroy');
                    },
                    failCallback: function (responseHtml, url) {
         
                        $preparingFileModal.dialog('destroy');
                        $("#error-modal").dialog({ modal: true });
                    }
                });
	        });
	        
	        
	        $(".export_div_print").click(function(){
	        	$("#export_options").hide();
	        	if(screens.auditorPerformance.reportType === "TREND"){
		        	printChart({
		            	chartContainer:$("#auditor_performance_widget_chart"),
		            	chartTitle:globalvars.localResourceMap.print_chart_auditor_performance_chart_title,
		            	screenName:"auditorPerformanceChart"
		            });
	        	}else{
	        		printGrid({
	        			container:$("#auditor_comparison_widget_grid_div"),
	        			gridTitle:globalvars.localResourceMap.print_chart_auditor_performance_grid_title,
	        			screenName:"auditorPerformanceGrid"
	        		});
	        	}
	        
	        });
	        
	        
	        $(".export_div_download").click(function(){
	        	
	          	if(screens.auditorPerformance.reportType === "TREND"){
	          		var chartContainer = $("#auditor_performance_widget_chart").highcharts();
		    		chartContainer.exportChart();
	        	}else{
	           		$("#export_options").show();
	        	   	$("#download_pdf").off().on("click", function (event) {
	              		$("#export_options").hide();
	              		//window.location.href = screens.auditorPerformance.downloadPdfURI;
	                    var $preparingFileModal = $("#preparing-file-modal");
	                    $preparingFileModal.dialog({ modal: true });
	                    $.fileDownload(screens.auditorPerformance.downloadPdfURI, {
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
	              		//window.location.href =  screens.auditorPerformance.downloadExcelURI
	                    var $preparingFileModal = $("#preparing-file-modal");
	                    $preparingFileModal.dialog({ modal: true });
	                    $.fileDownload(screens.auditorPerformance.downloadExcelURI, {
	                        successCallback: function (url) {
	                            $preparingFileModal.dialog('destroy');
	                        },
	                        failCallback: function (responseHtml, url) {
	             
	                            $preparingFileModal.dialog('destroy');
	                            $("#error-modal").dialog({ modal: true });
	                        }
	                    });
	              	});
	        	}
	    
	        });
	    	
	    },
	    
	    getAuditorIndex : function(param){
	    	
	    	for(var i=0;i< globalvars.analysisAuditorList.length; i++){
	    		if(param === globalvars.analysisAuditorList[i]){
	    			return i;
	    		}
	    	}
	    }
    
};