screens.dashboard = {
		
    initialize: function (param) {
        this.drawScreen();
        widgets.filter.updateScreen();
        this.bindFunctionality();
        this.bindExportFunctionality();
    },


    onFilterUpdate: function(filterParameters) {
        this.loadData(filterParameters);
    },

    
    loadData: function(filterParameters){

        log(filterParameters);

        var tempFilterParameters1 = $.extend(true, {}, filterParameters);
        tempFilterParameters1.period = 3;

        var tempFilterParameters2 = $.extend(true, {}, filterParameters);
        tempFilterParameters2.period = 10;

        var tempFilterParameters3 = $.extend(true, {}, filterParameters);
        tempFilterParameters3.metricType = 'hitRate';
        tempFilterParameters3.chartType = "donut";

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
        		}),

        		$.ajax({
        			type: 'GET',
		            url: globalvars.root.overallTrendsUri,
		            data: filterParameters,
		            traditional: true,
		            dataType: 'json'
        		}),

        		$.ajax({
        			type: 'GET',
		            url: globalvars.root.performanceComparisonChartViewUri,
		            data: tempFilterParameters3,
		            traditional: true,
		            dataType: 'json'
        		}),

        		$.ajax({
        			type: 'GET',
		            url: globalvars.root.dashboardTopFiveChargesUri,
		            data: filterParameters,
		            traditional: true,
		            dataType: 'json'
        		}),

        		$.ajax({
        			type: 'GET',
		            url: globalvars.root.dashboardTopFiveDepartmentsUri,
		            data: filterParameters,
		            traditional: true,
		            dataType: 'json'
        		}),

        		$.ajax({
        			type: 'GET',
		            url: globalvars.root.latestUpdatesUri,
		            data: {"hitType":filterParameters.hitType},
		            traditional: true,
		            dataType: 'json'
        		})

        ).done(function(data1, data2, data3, data4, data5, data6, data7, data8){
        	globalvars["summaryChartDataCurrentMonth"] = data1[0];
        	globalvars["summaryChartDataLastMonth"] = data2[0];
        	globalvars["summaryChartDataYearToDate"] = data3[0];
        	globalvars["dashboardOverallTrendsChartData"] = data4[0];
        	globalvars["performanceComparisonDashboard"] = data5[0];
        	globalvars["dashboardTopFiveChargesChartData"] = data6[0];
        	globalvars["dashboardTopFiveDepartmentsChartData"] = data7[0];
        	globalvars["dashboardLatestUpdates"] = data8[0];
        	screens.dashboard.fillScreen(filterParameters);
        });
        
    },


    fillScreen: function (filterParameters) {
    	
        //summary

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

        //overall trends
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
        charts.trendsChart.initialize({
            chartDiv: "overall_trends_widget_chart",
            xAxisLabel: xAxisLabel,
            xAxisDataAlignment: xAxisDataAlignment,
            xAxisDataRotate: xAxisDataRotate,
            xAxisData: globalvars.dashboardOverallTrendsChartData.xAxis,
            yAxisData: globalvars.dashboardOverallTrendsChartData.yAxis,
            titleText: globalvars.localResourceMap.overall_trends_chart_title,
            enableExporting:false,
            filename: 'overallTrends'
        });
        
        // performance comparison
        var divisionsArray = [];
        $(".performance_comparison_widget_chart").each(function () {
            if ($(this).highcharts()) { $(this).highcharts().destroy(); };
            $(this).empty();
        });
        
        //Empty the Donut Chart Div
        $("#performance_comparison_widget_charts").empty();
        
        
        //Load the Donut chart Template
        var dashboardPerformanceChartTemplate;
	    getSYNC('common/templates/dashboard_performance_comparison_chart_template.html', function (data) {
	    	dashboardPerformanceChartTemplate = data;
	    });

	    // Added the Template dynamically 'N' no.of times based on the result data
	    $.each(globalvars.performanceComparisonDashboard.data, function (index){
	    	 $("#performance_comparison_widget_charts").append(dashboardPerformanceChartTemplate);
	    });
	    
        // Clear all the Performance Chart Title and remove the selected the title CSS
        
        $(".performance_comparison_widget_chart_div_title").removeClass("performance_comparison_widget_chart_div_selected_title");
    	$(".performance_comparison_widget_chart_div_title").text("");
        
        $.each(globalvars.performanceComparisonDashboard.data, function (index) {
        	$(".performance_comparison_widget_chart_div_title").eq(index).text(this.divisionName);
        	$(".performance_comparison_widget_chart_div_title").eq(0).addClass("performance_comparison_widget_chart_div_selected_title");
            var $pieChartDiv = $(".performance_comparison_widget_chart").eq(index);
            charts.showSimplePieChart({
                value: this.reviewRate,
                title: this.divisionName,
                subtitle: chartsCurrencyFormatter(this.hitValue).toString(),
                $chartDiv: $pieChartDiv.get(0),
                color: index == 0 ? "blue" : ""
            });

            var hospitalArray = [];
            var dataArray = [];

            $.each(this.hospitalData, function (subindex) {
                hospitalArray.push(this.hospitalShortName);
                var pushedObject = { hitValue: this.hitValue, reviewRate: Math.round(this.reviewRate), hospitalShortName: this.hospitalShortName, y: this.hitValue };
                dataArray.push(pushedObject);
            });

            divisionsArray.push([hospitalArray, dataArray]);
        });

        if (divisionsArray.length > 0 && divisionsArray[0][1].length > 0) {
            log(divisionsArray[0][0]);
            log(divisionsArray[0][1]);

            if (divisionsArray[0][0].length < 12 || divisionsArray[0][1].length < 12) {
                for (var i = divisionsArray[0][1].length; i < 12; i++) {
                    divisionsArray[0][1].push('');
                    divisionsArray[0][0].push('');
                };
            };

            var columnChartDiv = $("#performance_comparison_widget_mainchart").get(0);
            charts.showPerformanceComparisonColumnChart({
                $chartDiv: columnChartDiv,
                xCategoriesArray: divisionsArray[0][0],
                dataArray: divisionsArray[0][1]
            });

            $("#performance_comparison_widget_charts .highcharts-container").eq(0).css('z-index', 1000).addClass("orange_outline");
            $(".performance_comparison_widget_chart_div img").eq(0).show();
            
        } else {
            var columnChartDiv = $("#performance_comparison_widget_mainchart").get(0);
            charts.showPerformanceComparisonColumnChart({
                $chartDiv: columnChartDiv,
                xCategoriesArray: [],
                dataArray: []
            });
        };

        
	  	 $("#performance_comparison_widget_charts .performance_comparison_widget_chart_div_title").click(function () {
	  		 var index = $("#performance_comparison_widget_charts .performance_comparison_widget_chart_div_title").index(this);
	  		 var element = $("#performance_comparison_widget_charts .highcharts-container").eq(index);
	  		 refreshPerformanceComparisonWidgetData(element);
	  		 bindPerformanceComparisonWidgetFunctionality();
	  	 });

        // on click of piechart


        bindPerformanceComparisonWidgetFunctionality();


        function bindPerformanceComparisonWidgetFunctionality() {

            $("#performance_comparison_widget_charts .highcharts-container").off().on('click', function () {
                refreshPerformanceComparisonWidgetData(this);
                bindPerformanceComparisonWidgetFunctionality();
            });
        };
        

        

        function refreshPerformanceComparisonWidgetData(element) {
            var index = $("#performance_comparison_widget_charts .highcharts-container").index(element);

            $.each(globalvars.performanceComparisonDashboard.data, function (index2) {
                var $chartDiv = $(".performance_comparison_widget_chart").eq(index2);
                if ($chartDiv.highcharts()) {
                    $chartDiv.highcharts().destroy();
                } else {
                    $chartDiv.empty();
                };
                
                charts.showSimplePieChart({
                    value: this.reviewRate,
                    title: this.divisionName,
                    subtitle: chartsCurrencyFormatter(this.hitValue).toString(),
                    $chartDiv: $chartDiv.get(0),
                    color: index2 == index ? "blue" : ""
                });
            });


            $("#performance_comparison_widget_charts .highcharts-container").css('z-index', 0).removeClass("orange_outline");
            $("#performance_comparison_widget_charts .highcharts-container").eq(index).css('z-index', 1000).addClass("orange_outline");
            $(".performance_comparison_widget_chart_div_title").removeClass("performance_comparison_widget_chart_div_selected_title");
            $(".performance_comparison_widget_chart_div_title").eq(index).addClass("performance_comparison_widget_chart_div_selected_title");
            $(".performance_comparison_widget_chart_div img").hide();
            $(".performance_comparison_widget_chart_div img").eq(index).show();
            

            if (divisionsArray[index][0].length < 12 || divisionsArray[index][1].length < 12) {
                for (var i = divisionsArray[index][1].length; i < 12; i++) {
                    divisionsArray[index][1].push('');
                    divisionsArray[index][0].push('');
                };
            };

            charts.showPerformanceComparisonColumnChart({
                $chartDiv: columnChartDiv,
                xCategoriesArray: divisionsArray[index][0],
                dataArray: divisionsArray[index][1]
            });
        };

        //top 5 charges widget
        var dataArray = new Array();
		
		$.each(globalvars.dashboardTopFiveChargesChartData.yAxis,function(i){
			var dataObj = { chargeDescription: this.chargeDescription,y: this.y};
			dataArray.push(dataObj);
		});

		if(globalvars.dashboardTopFiveChargesChartData.yAxis.length>0){
			if(globalvars.dashboardTopFiveChargesChartData.yAxis.length<5){
				for(var i = globalvars.dashboardTopFiveChargesChartData.yAxis.length;i<5;i++){
					globalvars.dashboardTopFiveChargesChartData.xAxis.push("");
					var dataObj = {chargeDescription:0,y:0};
					dataArray.push(dataObj);
					globalvars.dashboardTopFiveChargesChartData.yAxis.push(dataObj);
				}
			}
		}
		
        if (globalvars.dashboardTopFiveChargesChartData.yAxis.length != 0) {
            charts.topFiveChargeBarChart.initialize({
                container: $('.top_five_chart').get(0),
                xaxis: globalvars.dashboardTopFiveChargesChartData.xAxis,
                yaxis: dataArray
            });
        } else {
            charts.topFiveChargeBarChart.initialize({
                container: $('.top_five_chart').get(0),
                xaxis: [],
                yaxis: []
            });
        }

      //top 5 departments widget
        dataArray = new Array();
        $.each(globalvars.dashboardTopFiveDepartmentsChartData.yAxis,function(i){
			var dataObj = { hitRate: this.hitRate,y: this.y};
			dataArray.push(dataObj);
		});

		if(globalvars.dashboardTopFiveDepartmentsChartData.yAxis.length>0){
			if(globalvars.dashboardTopFiveDepartmentsChartData.yAxis.length<5){
				for(var i = globalvars.dashboardTopFiveDepartmentsChartData.yAxis.length;i<5;i++){
					globalvars.dashboardTopFiveDepartmentsChartData.xAxis.push("");
					var dataObj = {hitRate:0,y:0};
					dataArray.push(dataObj);
					globalvars.dashboardTopFiveDepartmentsChartData.yAxis.push(dataObj);
				}
			}
		}
        if (globalvars.dashboardTopFiveDepartmentsChartData.yAxis.length != 0) {
            charts.topFiveDepartmentBarChart.initialize({
                container: $('.top_five_chart').get(1),
                xaxis: globalvars.dashboardTopFiveDepartmentsChartData.xAxis,
                yaxis: globalvars.dashboardTopFiveDepartmentsChartData.yAxis
            });
        } else {
            charts.topFiveDepartmentBarChart.initialize({
                container: $('.top_five_chart').get(1),
                xaxis: [],
                yaxis: []
            });
        }
        
        this.drawAlert();
    },


    drawScreen: function () {

        var filterTemplate = getTemplate('common/templates/screens/dashboard.html?100');

        globalvars.$contentcontainer.append($.nano(filterTemplate, globalvars.localResourceMap));

        widgets.filter.initialize({
            $targetDiv: $("#filters_wrapper"),
            screen: 'dashboard',
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


        this.drawOverallTrends();

        this.drawTopFiveCharts();

    },


    bindFunctionality: function () {


        $('.top_five_view_more').eq(0).click(function () {
            transferFilters('dashboard', 'performanceComparison',"");
            $("#sub_menu #facility").show();
            var subMenuItems = $("#sub_menu #facility li.submenu_item");
            if(subMenuItems.length>0){
            	$("#sub_menu #facility li.submenu_item").eq(subMenuItems.length-1).addClass('submenu_last_item');
            }
            $('#main_menu li.main_menu_item').removeClass('active');
            $('#main_menu li.main_menu_item').removeClass('submenuactive');
            $('#main_menu li.main_menu_item').eq(1).addClass('submenuactive');
            $('#main_menu li.main_menu_item').eq(1).addClass('active');
            $('#main_menu li.main_menu_item a').eq(1).addClass('active');
            $("#sub_menu #facility li.submenu_item").eq(0).click();
        });

        $('.top_five_view_more').eq(1).click(function () {
            transferFilters('dashboard', 'facilityPerformance',"CHARGE");
            $("#sub_menu #facility").show();
            var subMenuItems = $("#sub_menu #facility li.submenu_item");
            if(subMenuItems.length>0){
            	$("#sub_menu #facility li.submenu_item").eq(subMenuItems.length-1).addClass('submenu_last_item');
            }
            $('#main_menu li.main_menu_item').removeClass('active');
            $('#main_menu li.main_menu_item').removeClass('submenuactive');
            $('#main_menu li.main_menu_item').eq(1).addClass('submenuactive');
            $('#main_menu li.main_menu_item').eq(1).addClass('active');
            $('#main_menu li.main_menu_item a').eq(1).addClass('active');
            $("#sub_menu #facility li.submenu_item").eq(3).click();
        });

        $('.top_five_view_more').eq(2).click(function () {
            transferFilters('dashboard', 'facilityPerformance', "DEPT");
            $("#sub_menu #facility").show();
            var subMenuItems = $("#sub_menu #facility li.submenu_item");
            if(subMenuItems.length>0){
            	$("#sub_menu #facility li.submenu_item").eq(subMenuItems.length-1).addClass('submenu_last_item');
            }
            $('#main_menu li.main_menu_item').removeClass('active');
            $('#main_menu li.main_menu_item').removeClass('submenuactive');
            $('#main_menu li.main_menu_item').eq(1).addClass('submenuactive');
            $('#main_menu li.main_menu_item').eq(1).addClass('active');
            $('#main_menu li.main_menu_item a').eq(1).addClass('active');
            $("#sub_menu #facility li.submenu_item").eq(1).click();
        });

        function transferFilters(sourceScreen, targetScreen, targetTab) {
            var tempStoredParameters = localStorage.getItem('filterParameters');
            if (tempStoredParameters) {
                tempStoredParameters = JSON.parse(tempStoredParameters);
                 if (tempStoredParameters && tempStoredParameters[sourceScreen]) {
                    var newParameters = $.extend(true, {}, tempStoredParameters[sourceScreen]);
                    if(targetScreen == "facilityPerformance")
                      	screens.facilityPerformance.reportType = targetTab;
                    tempStoredParameters[targetScreen] = {};
                    $.extend(true, tempStoredParameters[targetScreen], newParameters);
                    localStorage.setItem('filterParameters', JSON.stringify(tempStoredParameters));
                    
                }
            }
            
        }

    },
    
    bindExportFunctionality:function(){
        
        $(".export_div_print").click(function(){
        	
        	var chartType = $(this).parent().parent().parent().find("h3").text();
        	log(chartType);

        	if(chartType == globalvars.localResourceMap.dashboard_screen_performance_comparison){
        		if(globalvars.performanceComparisonDashboard.data.length == 0)
        		{
        			dialogs.messageDialog.show({ text: globalvars.localResourceMap.print_chart_no_values });
                    return;
        		}
        		    var chartContainer1 = $("#performance_comparison_widget_charts").find(".performance_comparison_widget_chart").eq(0).highcharts();
        		    var chartContainer2 = $("#performance_comparison_widget_mainchart").highcharts();
        		    var chartTitle = chartType+" "+globalvars.localResourceMap.print_chart_title_sub_text;
        		    
        		    if(chartContainer1!=undefined){
        		    	printPerformanceComparisonChart({
             		    	appendContainer1 : chartContainer1.container.parentNode.parentNode.parentNode,
             		    	appendContainer2 : chartContainer2.container.parentNode,
             		    	container1Parent : chartContainer1.container.parentNode.parentNode.parentNode.parentNode,
             		    	container2Parent : chartContainer1.container.parentNode.parentNode.parentNode.parentNode,
             		    	chartTitle : chartTitle,
             		    	screenName :"dashboardPerformanceChart"
             		    });
        		    }
        	}else if(chartType == globalvars.localResourceMap.dashboard_screen_overall_trends){
        		printChart({
            		chartContainer:$("#overall_trends_widget_chart"),
            		chartTitle:chartType
            	});
        	}else if(chartType == globalvars.localResourceMap.dashboard_screen_top_five_charges){
        		
        		if(globalvars.dashboardTopFiveChargesChartData.xAxis.length == 0 || globalvars.dashboardTopFiveChargesChartData.yAxis.length == 0)
        		{
        			dialogs.messageDialog.show({ text: globalvars.localResourceMap.print_chart_no_values });
                    return;
        		}
        		printChart({
            		chartContainer:$('#top_five_widget_wrapper').find('.top_five_chart').eq(0),
            		chartTitle:chartType
            	});
        	}else if(chartType == globalvars.localResourceMap.dashboard_screen_top_five_departments){
        		if(globalvars.dashboardTopFiveDepartmentsChartData.xAxis.length == 0 || globalvars.dashboardTopFiveDepartmentsChartData.yAxis.length == 0)
        		{
        			dialogs.messageDialog.show({ text: globalvars.localResourceMap.print_chart_no_values });
                    return;
        		}
        		printChart({
            		chartContainer:$('#top_five_widget_wrapper').find('.top_five_chart').eq(1),
            		chartTitle:chartType
            	});
        	}
        
        });
        
        
        $(".export_div_download").click(function(){          

        	var chartContainer;
        	var divArr = new Array();
          var chartType = $(this).parent().parent().parent().find("h3").text();

        	if (chartType == globalvars.localResourceMap.dashboard_screen_performance_comparison) {
        		
        		if(globalvars.performanceComparisonDashboard.data.length == 0)
        		{
        			dialogs.messageDialog.show({ text: globalvars.localResourceMap.download_chart_no_values });
                    return;
        		}
            var currentlySelectedIndex = $("#performance_comparison_widget_charts .highcharts-container.orange_outline").parent().parent().index();

      	    var i = 0, s = 'svg', p = '.performance_comparison_widget_chart', m = "#performance_comparison_widget_mainchart",
              a = { reportId: 1 }, b = $(p).each(function () {
                  var t = $(this); h = '.highcharts-container'; 
                  if (t.highcharts()) {
                      t.children(h).click(); var d = {
                          exporting: {
                              sourceWidth: t.width(),
                              sourceHeight: t.height()
                          }
                      }; var d2 = {
                          exporting: {
                              sourceWidth: $(m).width(),
                              sourceHeight: $(m).height()
                          }
                      };
                      divArr.push(t.siblings().text());
                      a[s + ++i] = t.highcharts().getSVG(d); 
                      var charSVG2 = $(m).highcharts().getSVG(d2);
                      //charSVG2 = charSVG2.replace(/<defs>/, '<text y="10" x="10" style="font-weight:bold,text-align:center;font-size:12px;color:#000000;fill:#000000;"><tspan>'+t.siblings().text()+'</tspan></text><defs>');
                      a[s + ++i] = charSVG2;
                      log(t.highcharts().getSVG(d));
                  }
              })
      	    c = $(p).children(h).click(),
            d = log(a), e = $(m).highcharts().exportChart({ filename: 'performanceComparison', sourceWidth: 0, sourceHeight: 0, scale: 1, metadata: { title: globalvars.localResourceMap.dashboard_screen_performance_comparison, filter: formatFiltersForChartExport, divArr: JSON.stringify(divArr) } }, undefined, a);
                
            // return back to previously selected division
            //$("#performance_comparison_widget_charts .highcharts-container").eq(currentlySelectedIndex).click();
      	    
        	}else if(chartType == globalvars.localResourceMap.dashboard_screen_overall_trends){
        		chartContainer = $("#overall_trends_widget_chart").highcharts();
        		chartContainer.exportChart();
        	}else if(chartType == globalvars.localResourceMap.dashboard_screen_top_five_charges){
        		if(globalvars.dashboardTopFiveChargesChartData.xAxis.length == 0 || globalvars.dashboardTopFiveChargesChartData.yAxis.length == 0)
        		{
        			dialogs.messageDialog.show({ text: globalvars.localResourceMap.download_chart_no_values });
                    return;
        		}
            	chartContainer = $('#top_five_widget_wrapper').find('.top_five_chart').eq(0).highcharts(),
            	chartContainer.exportChart();
        	}else if(chartType == globalvars.localResourceMap.dashboard_screen_top_five_departments){
        		if(globalvars.dashboardTopFiveDepartmentsChartData.xAxis.length == 0 || globalvars.dashboardTopFiveDepartmentsChartData.yAxis.length == 0)
        		{
        			dialogs.messageDialog.show({ text: globalvars.localResourceMap.download_chart_no_values });
                    return;
        		}
        		chartContainer = $('#top_five_widget_wrapper').find('.top_five_chart').eq(1).highcharts(),
            	chartContainer.exportChart();
        	}
    
        });
    },


    drawAlert: function () {
    	
    	if(globalvars.dashboardLatestUpdates != null)
    		var highlightArr  = populateHighlightWidget(globalvars.dashboardLatestUpdates);
    	//log(highlightArr.length);
    	
    	$("#alert table").empty();
    	
    	if(highlightArr != null){
	    	for(var i=0;i<highlightArr.length;i++){
	    		$("#alert table").append('<tr><td valign="top">'+highlightArr[i].part1+'</td><td valign="top">'+highlightArr[i].part2+'</td></tr>');
	    		
	    	}
    	}

    },


    drawTopFiveCharts: function () {
        var topFiveTemplate = getTemplate('common/templates/top_five.html?100');

        $('#top_five_widget_wrapper').append($.nano(topFiveTemplate, {
            heading1: globalvars.localResourceMap.dashboard_screen_top_five_charges,
            heading2: globalvars.localResourceMap.dashboard_screen_top_five_departments,
            view_more: globalvars.localResourceMap.dashboard_screen_view_more,
            subheading: globalvars.localResourceMap.performance_comparison_header_label_top_five
        }));

        charts.topFiveChargeBarChart.initialize({
            container: $('.top_five_chart').get(0),
            xaxis: [],
            yaxis: []
        });

        charts.topFiveDepartmentBarChart.initialize({
            container: $('.top_five_chart').get(1),
            xaxis: [],
            yaxis: []
        });
        

    },

    
    drawOverallTrends: function() {
        
        charts.trendsChart.initialize({
            chartDiv: "overall_trends_widget_chart",
            xAxisLabel: "",
            xAxisDataRotate: 0,
            xAxisDataAlignment: "center",
            xAxisData: [],
            yAxisData: [],
            titleText: globalvars.localResourceMap.overall_trends_chart_title
        });
    }
};