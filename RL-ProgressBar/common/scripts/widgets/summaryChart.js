widgets.summaryChart = {
    summaryChartTemplate: "",

    initialize: function (params) {

        log('initializing summary chart widget');

        this.loadData();
        this.drawWidget(params.$targetDiv);
    },

    loadData: function () {
    	if(this.summaryChartTemplate==""){
    		this.summaryChartTemplate = getTemplate('common/templates/widgets/summary_chart.html');
    	}
    },

    drawWidget: function ($summaryDiv) {

        $summaryDiv.append($.nano(widgets.summaryChart.summaryChartTemplate, globalvars.localResourceMap));
        var getLastUpdateObj = getLastUpdateDate();
    	$("#lastupdate_label").text(globalvars.localResourceMap.dashboard_last_update+' '+getLastUpdateObj.monthName+' '+getLastUpdateObj.day+','+getLastUpdateObj.year);
	},

    showData: function (param) {

        log('showing data in summary chart widget');
        
        // current
        
         
        $("#curr_month_label_amount").text("$"+chartsCurrencyFormatter(param.current.total));
        $("#curr_month_chart_review_rate_value").text(param.current.reviewRate + "%");
        $("#curr_month_chart_hit_rate_value").text(param.current.hitRate + "%");
        
        if(param.current.dateLabel =="Month to Date"){
        	$("#curr_month_label").text("Current Month - " + getCurrentDate().monthName + " " + getCurrentDate().year);
        	$("#summary_chart_last_month_label_text").text(globalvars.localResourceMap.dashboard_filter_time_period_selector_value3+" - " + param.last.dateLabel);
        }
        else{
        	$("#curr_month_label").text(param.current.dateLabel);
        	$("#summary_chart_last_month_label_text").text(param.last.dateLabel);
        }
        
        //last
        
        $("#summary_chart_last_month_value_amount").text("$"+(chartsCurrencyFormatter(param.last.total)));
        $("#last_month_chart_review_rate_value").text(param.last.reviewRate + "%");
        $("#last_month_chart_hit_rate_value").text(param.last.hitRate + "%");
        
        
        
        // YearDate
        
        $("#summary_chart_year_date_value_amount").text("$"+(chartsCurrencyFormatter(param.yearDate.total)));
        $("#year_date_chart_review_rate_value").text(param.yearDate.reviewRate + "%");
        $("#year_date_chart_hit_rate_value").text(param.yearDate.hitRate + "%");
               
        
        
        
        // Projected Net Revenue
        
        
        
        // calculate day of the year
        
        var now = new Date();
        var start = new Date(now.getFullYear(), 0, 0);
        var diff = now - start;
        var oneDay = 1000 * 60 * 60 * 24;
        var day = Math.floor(diff / oneDay);
        
        // check leap year
        
        function daysInYear(year) {
            if(year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) {
                return 366;
            } else {
                return 365;
            }
        }
        var leftOverDay=daysInYear(now.getFullYear())-(day-1);
        var projectAmount = ((param.lastWeek.dollarsFoundPerDay*leftOverDay)+param.yearDate.total);
        var impactAmount;
        if(globalvars.user.uType == globalvars.roles.physicianSupervisor || globalvars.user.uType == globalvars.roles.administrator){
            impactAmount= projectAmount * 0.51
        }else{ 
            impactAmount=(globalvars.rlImpact!=undefined)?globalvars.rlImpact*projectAmount:globalvars.rlImpact*0.20;
        }

          
        $("#projected_net_missing_charge_amount_value").text("$"+chartsCurrencyFormatter(projectAmount));
        $("#projected_net_label_amount").text("$"+chartsCurrencyFormatter(impactAmount));
        $("#summary_chart_projected_net").text(globalvars.localResourceMap.summary_chart_projected_net_revenue + ' ' + now.getFullYear())
        

        charts.barChart.initialize({
            completed: param.current.reviewRate,
            targetId: 'curr_month_review_rate',
            total: 100,
            type:'review'
        });

        charts.barChart.initialize({
            completed: param.current.hitRate,
            targetId: 'curr_month_hit_rate',
            total: 100,
            type:'hit'
        });

        charts.barChart.initialize({
            completed: param.last.reviewRate,
            targetId: 'last_month_review_rate',
            total: 100,
            type:'review',
            barHeight:15
        });

        charts.barChart.initialize({
            completed: param.last.hitRate,
            targetId: 'last_month_hit_rate',
            total: 100,
            type:'hit',
            barHeight:15

        });
        
        charts.barChart.initialize({
            completed: param.yearDate.reviewRate,
            targetId: 'year_date_review_rate',
            total: 100,
            type:'review',
            barHeight:15
        });

        charts.barChart.initialize({
            completed: param.yearDate.hitRate,
            targetId: 'year_date_hit_rate',
            total: 100,
            type:'hit',
            barHeight:15
        });

    },
    getProjectedNetAmount:function(projectAmount){
        return chartsCurrencyFormatter((projectAmount*20)/100);

    }
}