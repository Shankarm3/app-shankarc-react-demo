var charts = {
    barChart: {
    	perShapeGradient:{x1:0,y1:0,x2:1,y2:0},
        initialize: function (param) {  // param object with: type, total, completed, targetId  
        	
        	var barColor1;
        	var barColor2;
        	
        	if (param.type == 'auditorChartReview' || param.type == 'auditorChartHit') {
        		$(param.percentTargetId).html(param.completed + "%");
        	}
        	
        	if(param.type =="AccountChart"){
        		var containerWidth = $('#'+param.targetId).width();
                var completed = 0;
                if(param.total!=0){
                	completed = Math.floor((param.completed/param.total)*containerWidth);
                }
                param.completed = completed;
                param.total = containerWidth;
                barColor1 = "#9f9f9f";
        		barColor2 = "#006bcf";
        	}
        	
        	
        	       	
        	if(param.type =="review"){
        		barColor1 = "#9f9f9f";
        		barColor2 = "#249ee7";
        		        	}
        	else if(param.type =="hit"){
        		barColor1 = "#9f9f9f";
        		barColor2 = "#006bcf";
        	}
        	else{
        		barColor1 = "#C6CCCE"
        		barColor2 = param.barColor ? param.barColor : '#3A9BD6';
        		}
        	
        	this.load({
                remaining: (param.total - param.completed),
                completed: param.completed,
                targetId: param.targetId,
                barColor1:barColor1,
        	    barColor2:barColor2,
        	    barHeight:param.barHeight?param.barHeight:20
            }); //launch chart
        },
        load: function (param) {   //param is an object, with required keys : targetId, remaining, completed 

            Highcharts.setOptions({
                colors: [param.barColor1, param.barColor2]
            });
            
            var chart = new Highcharts.Chart({
                chart: {
                    renderTo: param.targetId,
                    backgroundColor: '',
                    type: 'bar',
                    marginTop: 0,
                    marginRight: 0,
                    marginBottom: 0,
                    marginLeft: 0,
                    borderWidth: 0,
                    height:param.barHeight
                },
                legend: { enabled: false },
                credits: { enabled: false },
                exporting: { enabled: false },
                tooltip: { enabled: false },
                title: { text: '' },
                xAxis: {
                    categories: ['']
                },
                yAxis: {
                    min: 0,
                    minPadding: 0,
                    maxPadding: 0,
                    tickColor: 'white',
                    tickWidth: 0,
                    tickLength: 0,
                    gridLineWidth: 0
                },
                plotOptions: {
                    bar: {
                        shadow: false,
                        borderWidth: 1,
                        pointPadding: 0,
                        groupPadding: 0,
                        enableMouseTracking: false
                    },
                    series: {
                        stacking: 'normal'
                    }
                },
                series: [{ data: [param.remaining] },
                         { data: [param.completed] }]
            });
        }
    },
    
    preBillAccountsWidgetBarChart:{
    	
		perShapeGradient:{
	            x1: 0,
	            y1: 0,
	            x2: 1,
	            y2: 0
	    },
	    xAxisData:"",
	    yAxisData:"",
	    chartDiv:"",
    	
    	initialize:function(param){
    	
    		this.xAxisData = param.xaxis;
    		this.yAxisData = param.yaxis;
    		this.chartDiv =  param.container;
    		
    		  Highcharts.setOptions({
                  colors: ["#C6CCCE", '#249ee7']
              });
            var chart = new Highcharts.Chart({
                chart: {
                    renderTo: this.chartDiv,
                    type: 'bar',
                    marginBottom: (param.containerHeight < 70)? 40 : 0,
                    marginRight: 20,
                    backgroundColor: null,
                    height: (param.containerHeight < 70)? param.containerHeight + 50 : param.containerHeight
                },
                legend: { enabled: false },
                credits: { enabled: false },
                exporting: { enabled: false },
                tooltip: { enabled: false },
                title: { text: '' },
                xAxis: {
                    categories: this.xAxisData,
                    tickWidth: 0,
                    labels: {
                        style: {
                        	color: '#333333',
                            font: '14px Arial'
                        }
                    }
                },
                
                yAxis: {
                    gridLineWidth: 0,
                    labels: {
                    	enabled:false
                    },
                    title: {
                        text: ''
                    },
                    stackLabels: {
	                    style: {
	                        color: '#333333',
	                        font: '14px Arial'
	                    },
	                    enabled: true,
	                    verticalAlign:'middle',
	                    align:'right',
	                    formatter: function() {
	                    	return globalvars.dashboardPreBillTotalAccountsInfo.hospitals[this.x].remaining;
	                    	
	                    }
                    }
                },
         
                plotOptions: {
                    bar: {
                        shadow: false,
                        borderWidth: 1,
                        pointPadding: 0,
                        groupPadding: 0,
                        pointWidth:20,
                        stacking: 'normal',
                        cursor: 'pointer',
                        point: {
                            events: {
                                click: function() {

                                	var selectedCategory = this.category;
                                 	log("selectedCategory - sdm :::" + selectedCategory);
                                	
                        	        $.when( roles.centralAuditor.checkLoadedHospitals() ).then(function(){
                                        //$('li.main_menu_item').removeClass('active');
                                        //$('li.main_menu_item').eq(1).addClass('active');
                                        $.each(globalvars.preHospitals,function(i){
                                       	 log("selectedCategory:::" + globalvars.preHospitals[i].hospitalId);
                                       	 if(globalvars.preHospitals[i].shortName == selectedCategory){
                                       		 globalvars.selectedPreHospitalIndex = i;
                                       	 }
                                        });
                                        log("globalvars.selectedPreHospitalIndex::" + globalvars.selectedPreHospitalIndex);
                                        $("#sub_menu #Modules").show();

                               		 	var subMenuItems = $("#sub_menu #Modules li.submenu_item");
                                        if(subMenuItems.length>0){
                                        	$("#sub_menu #Modules li.submenu_item").eq(subMenuItems.length-1).addClass('submenu_last_item');
                                        }
                                        $('#main_menu li.main_menu_item').removeClass('active');
                                        $('#main_menu li.main_menu_item').removeClass('submenuactive');
                                        $('#main_menu li.main_menu_item').eq(1).addClass('submenuactive');
                                        $('#main_menu li.main_menu_item').eq(1).addClass('active');
                                        $('#main_menu li.main_menu_item a').eq(1).addClass('active');
                                        $("#sub_menu #Modules li.submenu_item").eq(0).click();
                        	        });
                                }
                            }
                        }
    	            }
                },
                tooltip : {
   		    	  enabled:true,
   		    	  borderWidth: 1,
                  borderColor: '#a6c9e2',
   		     	  backgroundColor: {
                        linearGradient: [0, 0, 0, 60],
                        stops: [
                            [0, '#F6F6F6'],
                            [1, '#FFFFFF']
                        ]
                    },
                    formatter: function () {
                    	var index;
                    	var selectedHospital = this.x;
                    	$.each(globalvars.dashboardPreBillTotalAccountsInfo.hospitals,function(i){
                    		if(globalvars.dashboardPreBillTotalAccountsInfo.hospitals[i].shortName == selectedHospital){
                    			index = i;
                    		}
                    	});
                  		return  globalvars.localResourceMap.central_auditor_dashboard_facility_tooltip+' ' + this.x +'<br/>'+
                  		        globalvars.localResourceMap.central_auditor_dashboard_total_accounts_tooltip+' ' + globalvars.dashboardPreBillTotalAccountsInfo.hospitals[index].total +'<br/>' +
                  		        globalvars.localResourceMap.central_auditor_dashboard_completed_accounts_tooltip + globalvars.dashboardPreBillTotalAccountsInfo.hospitals[index].completed;
    	            }
                  },
                series: [{
                	data:param.remaining
                },{
                	data:param.completed
                }]
            });
          
    	}

    },
    
    postBillAccountsWidgetBarChart:{
    	
		perShapeGradient:{
	            x1: 0,
	            y1: 0,
	            x2: 1,
	            y2: 0
	    },
	    xAxisData:"",
	    yAxisData:"",
	    chartDiv:"",
    	
    	initialize:function(param){
    	
    		this.xAxisData = param.xaxis;
    		this.yAxisData = param.yaxis;
    		this.chartDiv =  param.container;
    		
    		  Highcharts.setOptions({
                  colors: ["#C6CCCE", '#249ee7']
              });
    		
            var chart = new Highcharts.Chart({
                chart: {
                    renderTo: this.chartDiv,
                    type: 'bar',
                    marginBottom: (param.containerHeight < 70)? 40 : 0,
                    marginRight: 20,
                    backgroundColor: null,
                    height: (param.containerHeight < 70)? param.containerHeight + 50 : param.containerHeight
                },
                legend: { enabled: false },
                credits: { enabled: false },
                exporting: { enabled: false },
                tooltip: { enabled: false },
                title: { text: '' },
                xAxis: {
                    categories: this.xAxisData,
                    tickWidth: 0,
                    labels: {
                        style: {
                        	color: '#333333',
                            font: '14px Arial'
                        }
                    }
                },
                

                yAxis: {
                    gridLineWidth: 0,
                    labels: {
                    	enabled:false
                    },
                    title: {
                        text: ''
                    },
                    stackLabels: {
	                    style: {
	                    	color: '#333333',
	                        font: '14px Arial'
	                    },
	                    enabled: true,
	                    verticalAlign:'middle',
	                    align:'right',
	                    formatter: function() {
	                    	return globalvars.dashboardPostBillTotalAccountsInfo.hospitals[this.x].remaining;
	                    }
                    }
                },
                plotOptions: {
                    bar: {
                    	  shadow: false,
                          borderWidth: 1,
                          pointPadding: 0,
                          groupPadding: 0,
                          pointWidth:20,
                          stacking: 'normal',
                          cursor: 'pointer',
                          point: {
                              events: {
                                  click: function() {
                                    var selectedCategory = this.category;
                          	        $.when( roles.centralAuditor.checkLoadedHospitals() ).then(function(){
                                        // $('li.main_menu_item').removeClass('active');
                                        // $('li.main_menu_item').eq(2).addClass('active');
                                         $.each(globalvars.postHospitals,function(i){
                                        	 if(globalvars.postHospitals[i].shortName == selectedCategory){
                                        		 globalvars.selectedPostHospitalIndex = i;
                                        	 }
                                         });

                                         $("#sub_menu #Modules").show();

                                		 var subMenuItems = $("#sub_menu #Modules li.submenu_item");
                                         if(subMenuItems.length>0){
                                         	$("#sub_menu #Modules li.submenu_item").eq(subMenuItems.length-1).addClass('submenu_last_item');
                                         }
                                         $('#main_menu li.main_menu_item').removeClass('active');
                                         $('#main_menu li.main_menu_item').removeClass('submenuactive');
                                         $('#main_menu li.main_menu_item').eq(1).addClass('submenuactive');
                                         $('#main_menu li.main_menu_item').eq(1).addClass('active');
                                         $('#main_menu li.main_menu_item a').eq(1).addClass('active');
                                         $("#sub_menu #Modules li.submenu_item").eq(1).click();
                          	        });
                                  }
                              }
                          }
    	            }
                },
                tooltip : {
     		    	  enabled:true,
     		    	  borderWidth: 1,
                    borderColor: '#a6c9e2',
     		     	  backgroundColor: {
                          linearGradient: [0, 0, 0, 60],
                          stops: [
                              [0, '#F6F6F6'],
                              [1, '#FFFFFF']
                          ]
                      },
                      formatter: function () {
                      	var index;
                      	var selectedHospital = this.x;
                      	$.each(globalvars.dashboardPostBillTotalAccountsInfo.hospitals,function(i){
                      		if(globalvars.dashboardPostBillTotalAccountsInfo.hospitals[i].shortName == selectedHospital){
                      			index = i;
                      		}
                      	});
                    		return  globalvars.localResourceMap.central_auditor_dashboard_facility_tooltip+' ' + this.x +'<br/>'+
                    		        globalvars.localResourceMap.central_auditor_dashboard_total_accounts_tooltip+' ' + globalvars.dashboardPostBillTotalAccountsInfo.hospitals[index].total +'<br/>' +
                    		        globalvars.localResourceMap.central_auditor_dashboard_completed_accounts_tooltip + globalvars.dashboardPostBillTotalAccountsInfo.hospitals[index].completed;
      	            }
                    },
                series: [{
                	data:param.remaining
                },{
                	data:param.completed
                }]
            });
          
    	}

    },
    
    assocRulesAccountsWidgetBarChart:{
    	
		perShapeGradient:{
	            x1: 0,
	            y1: 0,
	            x2: 1,
	            y2: 0
	    },
	    xAxisData:"",
	    yAxisData:"",
	    chartDiv:"",
    	
    	initialize:function(param){
    	
    		this.xAxisData = param.xaxis;
    		this.yAxisData = param.yaxis;
    		this.chartDiv =  param.container;
    		
    		  Highcharts.setOptions({
                  colors: ["#C6CCCE", '#249ee7']
              });
            var chart = new Highcharts.Chart({
                chart: {
                    renderTo: this.chartDiv,
                    type: 'bar',
                    marginBottom: (param.containerHeight < 70)? 40 : 0,
                    marginRight: 20,
                    backgroundColor: null,
                    height: (param.containerHeight < 70)? param.containerHeight + 50 : param.containerHeight
                },
                legend: { enabled: false },
                credits: { enabled: false },
                exporting: { enabled: false },
                tooltip: { enabled: false },
                title: { text: '' },
                xAxis: {
                    categories: this.xAxisData,
                    tickWidth: 0,
                    labels: {
                        style: {
                        	color: '#333333',
                            font: '14px Arial'
                        }
                    }
                },
                
                yAxis: {
                    gridLineWidth: 0,
                    labels: {
                    	enabled:false
                    },
                    title: {
                        text: ''
                    },
                    stackLabels: {
	                    style: {
	                        color: '#333333',
	                        font: '14px Arial',
		                },
	                    enabled: true,
	                    verticalAlign:'middle',
	                    align:'right',
	                    formatter: function() {
	                    	return globalvars.dashboardAssocRuleTotalAccountsInfo.hospitals[this.x].remaining;
	                    	
	                    }
                    }
                },
         
                plotOptions: {
                    bar: {
                        shadow: false,
                        borderWidth: 1,
                        pointPadding: 0,
                        groupPadding: 0,
                        pointWidth:20,
                        stacking: 'normal',
                        cursor: 'pointer',
                        point: {
                            events: {
                                click: function() {
                                    var selectedCategory = this.category;
                          	        $.when( roles.centralAuditor.checkLoadedHospitals() ).then(function(){
                                        //$('li.main_menu_item').removeClass('active');
                                        //$('li.main_menu_item').eq(3).addClass('active');
                                        
                                        $.each(globalvars.preHospitals,function(i){
                                       	 log("selectedCategory:::" + globalvars.preHospitals[i].hospitalId);
                                       	 if(globalvars.preHospitals[i].shortName == selectedCategory){
                                       		 globalvars.selectedPreHospitalIndex = i;
                                       	 }
                                        });
                                        log("globalvars.selectedPreHospitalIndex::" + globalvars.selectedPreHospitalIndex);
                                        $("#sub_menu #Modules").show();

                               		 var subMenuItems = $("#sub_menu #Modules li.submenu_item");
                                        if(subMenuItems.length>0){
                                        	$("#sub_menu #Modules li.submenu_item").eq(subMenuItems.length-1).addClass('submenu_last_item');
                                        }
                                        $('#main_menu li.main_menu_item').removeClass('active');
                                        $('#main_menu li.main_menu_item').removeClass('submenuactive');
                                        $('#main_menu li.main_menu_item').eq(1).addClass('submenuactive');
                                        $('#main_menu li.main_menu_item').eq(1).addClass('active');
                                        $('#main_menu li.main_menu_item a').eq(1).addClass('active');
                                        $("#sub_menu #Modules li.submenu_item").eq(2).click();
                          	        });
                                }
                            }
                        }
    	            }
                },
                tooltip : {
   		    	  enabled:true,
   		    	  borderWidth: 1,
                  borderColor: '#a6c9e2',
   		     	  backgroundColor: {
                        linearGradient: [0, 0, 0, 60],
                        stops: [
                            [0, '#F6F6F6'],
                            [1, '#FFFFFF']
                        ]
                    },
                    formatter: function () {
                    	var index;
                    	var selectedHospital = this.x;
                    	$.each(globalvars.dashboardAssocRuleTotalAccountsInfo.hospitals,function(i){
                    		if(globalvars.dashboardAssocRuleTotalAccountsInfo.hospitals[i].shortName == selectedHospital){
                    			index = i;
                    		}
                    	});
                  		return  globalvars.localResourceMap.central_auditor_dashboard_facility_tooltip+' ' + this.x +'<br/>'+
                  		        globalvars.localResourceMap.central_auditor_dashboard_total_accounts_tooltip+' ' + globalvars.dashboardAssocRuleTotalAccountsInfo.hospitals[index].total +'<br/>' +
                  		        globalvars.localResourceMap.central_auditor_dashboard_completed_accounts_tooltip + globalvars.dashboardAssocRuleTotalAccountsInfo.hospitals[index].completed;
    	            }
                  },
                series: [{
                	data:param.remaining
                },{
                	data:param.completed
                }]
            });
          
    	}

    },
cciEditsAccountsWidgetBarChart:{
    	
		perShapeGradient:{
	            x1: 0,
	            y1: 0,
	            x2: 1,
	            y2: 0
	    },
	    xAxisData:"",
	    yAxisData:"",
	    chartDiv:"",
    	
    	initialize:function(param){
    	
    		this.xAxisData = param.xaxis;
    		this.yAxisData = param.yaxis;
    		this.chartDiv =  param.container;
    		
    		  Highcharts.setOptions({
                  colors: ["#C6CCCE", '#249ee7']
              });
            var chart = new Highcharts.Chart({
                chart: {
                    renderTo: this.chartDiv,
                    type: 'bar',
                    marginBottom: (param.containerHeight < 70)? 40 : 0,
                    marginRight: 20,
                    backgroundColor: null,
                    height: (param.containerHeight < 70)? param.containerHeight + 50 : param.containerHeight
                },
                legend: { enabled: false },
                credits: { enabled: false },
                exporting: { enabled: false },
                tooltip: { enabled: false },
                title: { text: '' },
                xAxis: {
                    categories: this.xAxisData,
                    tickWidth: 0,
                    labels: {
                        style: {
                        	color: '#333333',
                            font: '14px Arial'
                        }
                    }
                },
                
                yAxis: {
                    gridLineWidth: 0,
                    labels: {
                    	enabled:false
                    },
                    title: {
                        text: ''
                    },
                    stackLabels: {
	                    style: {
	                        color: '#333333',
	                        font: '14px Arial',
		                },
	                    enabled: true,
	                    verticalAlign:'middle',
	                    align:'right',
	                    formatter: function() {
	                    	return globalvars.dashboardCciEditsTotalAccountsInfo.hospitals[this.x].remaining;
	                    	
	                    }
                    }
                },
         
                plotOptions: {
                    bar: {
                        shadow: false,
                        borderWidth: 1,
                        pointPadding: 0,
                        groupPadding: 0,
                        pointWidth:20,
                        stacking: 'normal',
                        cursor: 'pointer',
                        point: {
                            events: {
                                click: function() {
                                    var selectedCategory = this.category;
                          	        $.when( roles.centralAuditor.checkLoadedHospitals() ).then(function(){
                                        //$('li.main_menu_item').removeClass('active');
                                        //$('li.main_menu_item').eq(3).addClass('active');
                                        
                                        $.each(globalvars.cciHospitals,function(i){
                                       	 log("selectedCategory:::" + globalvars.cciHospitals[i].shortName);
                                       	 if(globalvars.cciHospitals[i].shortName == selectedCategory){
                                       		 globalvars.selectedCciHospitalIndex = i;
                                       	 }
                                        });
                                        log("globalvars.selectedPreHospitalIndex::" + globalvars.selectedCciHospitalIndex);
                                        $("#sub_menu #Modules").show();

                               		 var subMenuItems = $("#sub_menu #Modules li.submenu_item");
                                        if(subMenuItems.length>0){
                                        	$("#sub_menu #Modules li.submenu_item").eq(subMenuItems.length-1).addClass('submenu_last_item');
                                        }
                                        $('#main_menu li.main_menu_item').removeClass('active');
                                        $('#main_menu li.main_menu_item').removeClass('submenuactive');
                                        $('#main_menu li.main_menu_item').eq(1).addClass('submenuactive');
                                        $('#main_menu li.main_menu_item').eq(1).addClass('active');
                                        $('#main_menu li.main_menu_item a').eq(1).addClass('active');
                                        $("#sub_menu #Modules li.submenu_item").eq(3).click();
                          	        });
                                }
                            }
                        }
    	            }
                },
                tooltip : {
   		    	  enabled:true,
   		    	  borderWidth: 1,
                  borderColor: '#a6c9e2',
   		     	  backgroundColor: {
                        linearGradient: [0, 0, 0, 60],
                        stops: [
                            [0, '#F6F6F6'],
                            [1, '#FFFFFF']
                        ]
                    },
                    formatter: function () {
                    	var index;
                    	var selectedHospital = this.x;
                    	$.each(globalvars.dashboardCciEditsTotalAccountsInfo.hospitals,function(i){
                    		if(globalvars.dashboardCciEditsTotalAccountsInfo.hospitals[i].shortName == selectedHospital){
                    			index = i;
                    		}
                    	});
                  		return  globalvars.localResourceMap.central_auditor_dashboard_facility_tooltip+' ' + this.x +'<br/>'+
                  		        globalvars.localResourceMap.central_auditor_dashboard_total_accounts_tooltip+' ' + globalvars.dashboardCciEditsTotalAccountsInfo.hospitals[index].total +'<br/>' +
                  		        globalvars.localResourceMap.central_auditor_dashboard_completed_accounts_tooltip + globalvars.dashboardCciEditsTotalAccountsInfo.hospitals[index].completed;
    	            }
                  },
                series: [{
                	data:param.remaining
                },{
                	data:param.completed
                }]
            });
          
    	}

    },
    
    preBillPerformanceWidgetBarChart:{
    	
		perShapeGradient:{
	            x1: 0,
	            y1: 0,
	            x2: 1,
	            y2: 0
	    },
	    xAxisData:"",
	    yAxisData:"",
	    chartDiv:"",
    	
    	initialize:function(param){
    	
    		this.xAxisData = param.xaxis;
    		this.yAxisData = param.yaxis;
    		this.chartDiv =  param.container;
            var chart = new Highcharts.Chart({
                chart: {
                    renderTo: this.chartDiv,
                    type: 'bar',
                    marginBottom: 0,
                    marginRight:100,
                    backgroundColor: null,
                    height:param.containerHeight
                },
                legend: { enabled: false },
                credits: { enabled: false },
                exporting: { enabled: false },
                tooltip: { enabled: false },
                title: { text: '' },
                xAxis: {
                    categories: this.xAxisData,
                    tickWidth: 0,
                    labels: {
                        style: {
                        	color: '#333333',
                            font: '14px Arial'
                        }
                    }
                },
                
         	   colors: [
	                     '#3A9BD6'
	                   ],
                yAxis: {
                    gridLineWidth: 0,
                    stackLabels: {
	                    style: {
	                    	color: '#333333',
	                        font: '14px Arial'
	                    },
	                    enabled: true,
	                    verticalAlign:'middle',
	                    align:'right',
	                    formatter: function() {
	                    	if(globalvars.preBillPerformanceData.hospitalShortNameList[this.x]!="" && this.total !=0){
	                    	    return chartsCurrencyFormatter(this.total)+ '(' + globalvars.preBillPerformanceData.yAxis[this.x].hitRate + '%)';
	                    	}else{
	                    		return "";
	                    	}
	                    	
	                    }
                    },
                    min: 0, 
                    minRange: 0.1
                },
                plotOptions: {
                    bar: {
                        stacking: 'normal',
                        pointWidth:20,
                        cursor: 'pointer',
                        point: {
                            events: {
                                click: function() {
                                    var selectedCategory = this.category;
                          	        $.when( roles.centralAuditor.checkLoadedHospitals() ).then(function(){
                                    	 //$('li.main_menu_item').removeClass('active');
                                        //$('li.main_menu_item').eq(1).addClass('active');
                                        $.each(globalvars.preHospitals,function(i){
                                       	 if(globalvars.preHospitals[i].shortName == selectedCategory){
                                       		 globalvars.selectedPreHospitalIndex = i;
                                       	 }
                                        });
                                        $("#sub_menu #Modules").show();

                               		 var subMenuItems = $("#sub_menu #Modules li.submenu_item");
                                        if(subMenuItems.length>0){
                                        	$("#sub_menu #Modules li.submenu_item").eq(subMenuItems.length-1).addClass('submenu_last_item');
                                        }
                                        $('#main_menu li.main_menu_item').removeClass('active');
                                        $('#main_menu li.main_menu_item').removeClass('submenuactive');
                                        $('#main_menu li.main_menu_item').eq(1).addClass('submenuactive');
                                        $('#main_menu li.main_menu_item').eq(1).addClass('active');
                                        $('#main_menu li.main_menu_item a').eq(1).addClass('active');
                                        $("#sub_menu #Modules li.submenu_item").eq(0).click();
                          	        });
                                }
                            }
                        }
                    }
                },
                series: [{
                	data:this.yAxisData
                }]
            });
          
    	}

    },
    
    postBillPerformanceWidgetBarChart:{
    	
		perShapeGradient:{
	            x1: 0,
	            y1: 0,
	            x2: 1,
	            y2: 0
	    },
	    xAxisData:"",
	    yAxisData:"",
	    chartDiv:"",
    	
    	initialize:function(param){
    	
    		this.xAxisData = param.xaxis;
    		this.yAxisData = param.yaxis;
    		this.chartDiv =  param.container;
            var chart = new Highcharts.Chart({
                chart: {
                    renderTo: this.chartDiv,
                    type: 'bar',
                    marginBottom: 0,
                    marginRight:100,
                    backgroundColor: null,
                    height: param.containerHeight
                },
                legend: { enabled: false },
                credits: { enabled: false },
                exporting: { enabled: false },
                tooltip: { enabled: false },
                title: { text: '' },
                xAxis: {
                    categories: this.xAxisData,
                    tickWidth: 0,
                    labels: {
                        style: {
                        	color: '#333333',
                            font: '14px Arial'
                        }
                    }
                },
                
         	   colors: [
	                     '#3A9BD6' 
	                   ],
                yAxis: {
                    gridLineWidth: 0,
                    stackLabels: {
	                    style: {
	                    	color: '#333333',
	                        font: '14px Arial'
	                    },
	                    enabled: true,
	                    verticalAlign:'middle',
	                    align:'right',
	                    formatter: function() {
	                    	if(globalvars.postBillPerformanceData.hospitalShortNameList[this.x]!="" && this.total !=0){
	                    	    return chartsCurrencyFormatter(this.total) +'('+globalvars.postBillPerformanceData.yAxis[this.x].hitRate+'%)';
	                    	}else{
	                    		return "";
	                    	}
	                    }
                    },
                    min: 0, 
                    minRange: 0.1
                },
                plotOptions: {
                    bar: {
                        stacking: 'normal',
                        pointWidth:20,
                        cursor: 'pointer',
                        point: {
                            events: {
                                click: function() {
                                    var selectedCategory = this.category;
                          	        $.when( roles.centralAuditor.checkLoadedHospitals() ).then(function(){
                                        //$('li.main_menu_item').removeClass('active');
                                        //$('li.main_menu_item').eq(2).addClass('active');
                                        $.each(globalvars.postHospitals,function(i){
                                         	 if(globalvars.postHospitals[i].shortName == selectedCategory){
                                         		 globalvars.selectedPostHospitalIndex = i;
                                         	 }
                                        });
                                        $("#sub_menu #Modules").show();

                               		 var subMenuItems = $("#sub_menu #Modules li.submenu_item");
                                        if(subMenuItems.length>0){
                                        	$("#sub_menu #Modules li.submenu_item").eq(subMenuItems.length-1).addClass('submenu_last_item');
                                        }
                                        $('#main_menu li.main_menu_item').removeClass('active');
                                        $('#main_menu li.main_menu_item').removeClass('submenuactive');
                                        $('#main_menu li.main_menu_item').eq(1).addClass('submenuactive');
                                        $('#main_menu li.main_menu_item').eq(1).addClass('active');
                                        $('#main_menu li.main_menu_item a').eq(1).addClass('active');
                                        $("#sub_menu #Modules li.submenu_item").eq(1).click();
                          	        });
                                }
                            }
                        }
                    }
                },
                series: [{
                	data:this.yAxisData
                }]
            });
          
    	}

    },
 assocRulesPerformanceWidgetBarChart:{
    	
		perShapeGradient:{
	            x1: 0,
	            y1: 0,
	            x2: 1,
	            y2: 0
	    },
	    xAxisData:"",
	    yAxisData:"",
	    chartDiv:"",
    	
    	initialize:function(param){
    	
    		this.xAxisData = param.xaxis;
    		this.yAxisData = param.yaxis;
    		this.chartDiv =  param.container;
            var chart = new Highcharts.Chart({
                chart: {
                    renderTo: this.chartDiv,
                    type: 'bar',
                    marginBottom: 0,
                    marginRight:100,
                    backgroundColor: null,
                    height:param.containerHeight
                },
                legend: { enabled: false },
                credits: { enabled: false },
                exporting: { enabled: false },
                tooltip: { enabled: false },
                title: { text: '' },
                xAxis: {
                    categories: this.xAxisData,
                    tickWidth: 0,
                    labels: {
                        style: {
                        	color: '#333333',
                            font: '14px Arial'
                        }
                    }
                },
                
         	   colors: [
	                     '#3A9BD6'
	                   ],
                yAxis: {
                    gridLineWidth: 0,
                    stackLabels: {
	                    style: {
	                    	color: '#333333',
	                        font: '14px Arial'
	                    },
	                    enabled: true,
	                    verticalAlign:'middle',
	                    align:'right',
	                    formatter: function() {
	                    	if(globalvars.assocRulePerformanceData.hospitalShortNameList[this.x]!="" && this.total !=0){
	                    	    return chartsCurrencyFormatter(this.total)+ '(' + globalvars.assocRulePerformanceData.yAxis[this.x].hitRate + '%)';
	                    	}else{
	                    		return "";
	                    	}
	                    	
	                    }
                    },
                    min: 0, 
                    minRange: 0.1
                },
                plotOptions: {
                    bar: {
                        stacking: 'normal',
                        pointWidth:20,
                        cursor: 'pointer',
                        point: {
                            events: {
                                click: function() {
                                    var selectedCategory = this.category;
                          	        $.when( roles.centralAuditor.checkLoadedHospitals() ).then(function(){
                                     	// $('li.main_menu_item').removeClass('active');
                                        //$('li.main_menu_item').eq(3).addClass('active');
                                        $.each(globalvars.preHospitals,function(i){
                                       	 if(globalvars.preHospitals[i].shortName == selectedCategory){
                                       		 globalvars.selectedPreHospitalIndex = i;
                                       	 }
                                        });
                                        $("#sub_menu #Modules").show();

                               		 var subMenuItems = $("#sub_menu #Modules li.submenu_item");
                                        if(subMenuItems.length>0){
                                        	$("#sub_menu #Modules li.submenu_item").eq(subMenuItems.length-1).addClass('submenu_last_item');
                                        }
                                        $('#main_menu li.main_menu_item').removeClass('active');
                                        $('#main_menu li.main_menu_item').removeClass('submenuactive');
                                        $('#main_menu li.main_menu_item').eq(1).addClass('submenuactive');
                                        $('#main_menu li.main_menu_item').eq(1).addClass('active');
                                        $('#main_menu li.main_menu_item a').eq(1).addClass('active');
                                        $("#sub_menu #Modules li.submenu_item").eq(2).click();
                          	        });
                                }
                            }
                        }
                    }
                },
                series: [{
                	data:this.yAxisData
                }]
            });
          
    	}

    },
cciEditsPerformanceWidgetBarChart:{
    	
		perShapeGradient:{
	            x1: 0,
	            y1: 0,
	            x2: 1,
	            y2: 0
	    },
	    xAxisData:"",
	    yAxisData:"",
	    chartDiv:"",
    	
    	initialize:function(param){
    	
    		this.xAxisData = param.xaxis;
    		this.yAxisData = param.yaxis;
    		this.chartDiv =  param.container;
            var chart = new Highcharts.Chart({
                chart: {
                    renderTo: this.chartDiv,
                    type: 'bar',
                    marginBottom: 0,
                    marginRight:100,
                    backgroundColor: null,
                    height:param.containerHeight
                },
                legend: { enabled: false },
                credits: { enabled: false },
                exporting: { enabled: false },
                tooltip: { enabled: false },
                title: { text: '' },
                xAxis: {
                    categories: this.xAxisData,
                    tickWidth: 0,
                    labels: {
                        style: {
                        	color: '#333333',
                            font: '14px Arial'
                        }
                    }
                },
                
         	   colors: [
	                     '#3A9BD6'
	                   ],
                yAxis: {
                    gridLineWidth: 0,
                    stackLabels: {
	                    style: {
	                    	color: '#333333',
	                        font: '14px Arial'
	                    },
	                    enabled: true,
	                    verticalAlign:'middle',
	                    align:'right',
	                    formatter: function() {
	                    	if(globalvars.cciEditsPerformanceData.hospitalShortNameList[this.x]!="" && this.total !=0){
	                    	    return chartsCurrencyFormatter(this.total)+ '(' + globalvars.cciEditsPerformanceData.yAxis[this.x].hitRate + '%)';
	                    	}else{
	                    		return "";
	                    	}
	                    	
	                    }
                    },
                    min: 0, 
                    minRange: 0.1
                },
                plotOptions: {
                    bar: {
                        stacking: 'normal',
                        pointWidth:20,
                        cursor: 'pointer',
                        point: {
                            events: {
                                click: function() {
                                    var selectedCategory = this.category;
                          	        $.when( roles.centralAuditor.checkLoadedHospitals() ).then(function(){
                                     	// $('li.main_menu_item').removeClass('active');
                                        //$('li.main_menu_item').eq(3).addClass('active');
                                        $.each(globalvars.cciHospitals,function(i){
                                       	 if(globalvars.cciHospitals[i].shortName == selectedCategory){
                                       		 globalvars.selectedCciHospitalIndex = i;
                                       	 }
                                        });
                                        $("#sub_menu #Modules").show();

                               		 	var subMenuItems = $("#sub_menu #Modules li.submenu_item");
                                        if(subMenuItems.length>0){
                                        	$("#sub_menu #Modules li.submenu_item").eq(subMenuItems.length-1).addClass('submenu_last_item');
                                        }
                                        $('#main_menu li.main_menu_item').removeClass('active');
                                        $('#main_menu li.main_menu_item').removeClass('submenuactive');
                                        $('#main_menu li.main_menu_item').eq(1).addClass('submenuactive');
                                        $('#main_menu li.main_menu_item').eq(1).addClass('active');
                                        $('#main_menu li.main_menu_item a').eq(1).addClass('active');
                                        $("#sub_menu #Modules li.submenu_item").eq(3).click();
                          	        });
                                }
                            }
                        }
                    }
                },
                series: [{
                	data:this.yAxisData
                }]
            });
          
    	}

    },
    
    
    topFiveChargeBarChart:{
    	
		perShapeGradient:{
	            x1: 0,
	            y1: 0,
	            x2: 1,
	            y2: 0
	    },
	    xAxisData:"",
	    yAxisData:"",
	    chartDiv:"",
    	
    	initialize:function(param){
    	
    		this.xAxisData = param.xaxis;
    		this.yAxisData = param.yaxis;
    		this.chartDiv =  param.container;
            var chart = new Highcharts.Chart({
                chart: {
                    renderTo: this.chartDiv,
                    width: 426,
                    type: 'bar',
                    marginBottom: 0,
                    marginRight:50,
                    marginLeft:100,
                    marginTop:0,
                    backgroundColor: null
                },
                legend: { enabled: false },
                credits: { enabled: false },
                exporting: {
                    filename: 'top5Charges',
                    enabled: false,
                    sourceWidth: $(this.chartDiv).width(),
                    sourceHeight: $(this.chartDiv).height(),
                    scale: 1.5,
                    metadata: {
                        title: globalvars.localResourceMap.dashboard_screen_top_five_charges,
                        filter: formatFiltersForChartExportPhysician
                    }
                },
                tooltip: { enabled: true },
                title: { text: '' },
                xAxis: {
                    categories: this.xAxisData,
                    tickWidth: 0,
                    style:{
                    	width:'100px'
                    }
                },
                plotOptions: {
                    bar: {
                        pointWidth: 25,
                        stacking: 'normal'
                    }
                },
         	   colors: [
	                     '#3A9BD6' 
	                   ],
                yAxis: {
                    gridLineWidth: 0,
                    min: 0, 
                    minRange: 0.1,
                    stackLabels: {
	                    enabled: true,
	                    verticalAlign:'middle',
	                    align:'right',
	                    formatter: function() {
	                    	log(globalvars.dashboardTopFiveChargesChartData.yAxis[this.x].chargeDescription);
	                    	
	                    	if(globalvars.dashboardTopFiveChargesChartData.xAxis[this.x] != "")
	                    		return chartsCurrencyFormatter(this.total);
	                    	else
	                    		return "";
	                    	
//	                    	if(this.total>0)
//                			{
//                				return chartsCurrencyFormatter(this.total);
//                			}
//                			else 
//                				return "0";
	                    }
                    }
                },
            tooltip : {
 		    	  enabled:true,
 		    	  borderWidth: 1,
            borderColor: '#a6c9e2',
            hideDelay : 0,
 		     	  backgroundColor: {
                      linearGradient: [0, 0, 0, 60],
                      stops: [
                          [0, '#F6F6F6'],
                          [1, '#FFFFFF']
                      ]
                  },
                  formatter: function () {
                	  	              	  
                	  	if(this.x != "")
                	  	{
                	  		return  globalvars.localResourceMap.dashboard_top_five_charges_charge_code_tooltip + ' ' + this.x +'<br/>'+
                		        globalvars.localResourceMap.dashboard_top_five_charges_charge_description_tooltip + ' ' + this.points[0].point.chargeDescription +'<br/>' +
                		        globalvars.localResourceMap.dashboard_top_five_missing_dollars_tooltip + chartsCurrencyFormatter(this.points[0].point.y);
                	  	}
                	  	else
                	  		return false;
  	            },
  	            shared: true
                },
                series: [{
                	data:this.yAxisData
                }]
            });
          
    	}

    },
    
    topFiveDepartmentBarChart:{
    	
		perShapeGradient:{
	            x1: 0,
	            y1: 0,
	            x2: 1,
	            y2: 0
	    },
	    xAxisData:"",
	    yAxisData:"",
	    chartDiv:"",
    	
    	initialize:function(param){
    	
    		this.xAxisData = param.xaxis;
    		this.yAxisData = param.yaxis;
    		this.chartDiv =  param.container;
            var chart = new Highcharts.Chart({
                chart: {
                    renderTo: this.chartDiv,
                    width: 426,
                    type: 'bar',
                    marginBottom: 0,
                    marginRight:10,
                    marginTop:0,
                    backgroundColor: null
                },
                legend: { enabled: false },
                credits: { enabled: false },
                exporting: {
                    filename: 'top5Departments',
                    enabled: false,
                    sourceWidth: $(this.chartDiv).width(),
                    sourceHeight: $(this.chartDiv).height(),
                    scale: 1.5,
                    metadata: {
                        title: globalvars.localResourceMap.dashboard_screen_top_five_departments,
                        filter: formatFiltersForChartExportPhysician
                    }
                },
                tooltip: { enabled: true },
                title: { text: '' },
                xAxis: {
                    categories: this.xAxisData,
                    tickWidth: 0,
                    labels: {
                        style: {
                            width: '150px',
                            'min-width': '150px'
                        },
                        useHTML : false
                    }
                },
                plotOptions: {
                    bar: {
                        pointWidth: 25,
                        stacking: 'normal'
                    }
                },
         	   colors: [
	                     '#3A9BD6' 
	                   ],
                yAxis: {
                    gridLineWidth: 0,
                    min: 0, 
                    minRange: 0.1,
                    stackLabels: {
	                    enabled: true,
	                    verticalAlign:'middle',
	                    align:'right',
	                    formatter: function() {
	                    if(globalvars.dashboardTopFiveDepartmentsChartData.xAxis[this.x] != "")
	                    	return chartsCurrencyFormatter(this.total);
	                    else
                    		return "";
//	                    if(this.total>0)
//                		{
//	                    	return chartsCurrencyFormatter(this.total);
//                		}
//                		else 
//                			return "0";
	                    }
                    }
                },
                tooltip : {
 		    	  enabled:true,
 		    	  borderWidth: 1,
                  borderColor: '#a6c9e2', 
                  hideDelay : 0,
 		     	  backgroundColor: {
                      linearGradient: [0, 0, 0, 60],
                      stops: [
                          [0, '#F6F6F6'],
                          [1, '#FFFFFF']
                      ]
                  },
                  formatter: function () {
                	  	if(this.x != "")
              	  		{
                	  		return 	globalvars.localResourceMap.dashboard_top_five_departments_dept_tooltip + ' ' + this.x + '<br/>'+
                		        globalvars.localResourceMap.dashboard_top_five_departments_hitrate_tooltip + ' ' + Math.round(this.points[0].point.hitRate) + '%<br/>' +
         			   		    globalvars.localResourceMap.dashboard_top_five_missing_dollars_tooltip + chartsCurrencyFormatter(this.points[0].point.y);
              	  		}
                	  	else
                	  		return false;
  	            },
  	            shared: true
                },
                series: [{
                	data:this.yAxisData
                }]
            });
          
    	}

    },
    

    
    
    /*Chart For Populating Overall Trends and Auditor Performance
     * 
     * @Parameters
     * 
     * xAxisLabel --> To show Date Range on XAxis based on Time Period Selected (Daily,Week Starting,Monthly)
     * xAxisLabelRotate --> To Rotates the XAxis Values (Labels are Rotated 65 only for Daily)
     * xAxisLabelAlignment --> Alignment of XAxis Values
     * xAxisData --> Data for Plotting XAxis
     * yAxisData --> Data for Plotting YAxis
     * titleText --> Title of Chart
     * chartDiv --> HTML Chart Div to Populate Chart
     * 
     * */
    
	trendsChart: {
		
		xAxisLabel:"",
		xAxisLabelRotate:"",
		perShapeGradient:{
	            x1: 0,
	            y1: 0,
	            x2: 1,
	            y2: 0
	    },
	    xAxisLabelAlignment:"",
	    xAxisData:"",
	    yAxisData:"",
	    chartOptions:"",
	    chartDiv:"",
        yMaxreviewedCount:"",
	    titleText:"",
	    enableExporting:"",
      filename: "",
		
	    initialize : function(param){
			this.chartDiv = param.chartDiv;
			this.xAxisLabel = param.xAxisLabel;
			this.xAxisDataRotate = param.xAxisDataRotate;
			this.xAxisDataAlignment = param.xAxisDataAlignment;
			this.xAxisData = param.xAxisData;
			this.yAxisData = param.yAxisData;
			this.titleText = param.titleText;
            this.yMaxreviewedCount = param.yMaxreviewedCount;
			this.enableExporting = param.enableExporting;
			this.filename = param.filename;
			this.chartOptions = {
					
					chart:{
						renderTo: this.chartDiv,
					    backgroundColor: '#F6F6F6',
				        defaultSeriesType: 'spline',
				        marginTop:40,
				        backgroundColor: null
					},

					exporting: {
              filename: this.filename,
					    enabled: false,
					    sourceWidth: $('#'+this.chartDiv).width(),
					    sourceHeight: $('#' + this.chartDiv).height(),
                        scale: 1,
					    metadata: {
					        title: this.titleText,
					        filter: formatFiltersForChartExportPhysician
					    }
					},

					plotOptions:{
						series: {
 				            events: {
 				                legendItemClick: function(event) {
 				                    return false;
 				                }
 				            },  
 				            marker: {
 			                    enabled: true,
 			                	states: {
 									hover: {
 										enabled: false,
 										symbol: 'circle',
 										radius: 5,
 										lineWidth: 1
 									}
 								}
 			                }
 				        },
 				       
 				        column: {
				        	stacking: 'normal'
						},
						spline:{
					       lineWidth:3
						}
					},
					
				    title: {
				    	align: 'left',
				    	style:{
				    		 fontWeight: 'bold',
				    		 fontSize: '18px'
				    	},
		                text: "" //this.titleText
		            },
		            credits:{enabled:false},
		            
		    	    xAxis: [{
		                categories: this.xAxisData,
		                labels: {
			    	    	formatter: function() {
				    	    	if(charts.trendsChart.xAxisLabel === globalvars.localResourceMap.overall_trends_chart_xaxis_label_monthly)
				    	    	{
				    	    		return this.value.substring(0,3);
				    	    	}
				    	    	else
				    	    	{
				    	    		return this.value;
				    	    	}
			    	   		},
		                    rotation: this.xAxisDataRotate,      
		                    align:this.xAxisDataAlignment,
		                    style: {
		                        color: '#666666'
		                    }
		                },
						title: {
			                    text: this.xAxisLabel
			            }
		            }],
		            
		            colors: [
		                     '#3A9BD6', 
		                     {linearGradient: this.perShapeGradient,stops: [[0, 'rgb(99, 45, 135)'],[1, 'rgb(99, 45, 135)']]},
		                     {linearGradient: this.perShapeGradient,stops: [[0, 'rgb(221,116,32)'], [1, 'rgb(221,116,32)']]},
		                      '#6d951f'
                            ],
		                    
		            yAxis:[{
		            	
			            	  labels: {
				                    formatter: function() {
				                        return this.value +'%';
				                    },
				                    style: {
				                        color: '#666666'
				                    }
				                },
				                title: {
				                    text: globalvars.localResourceMap.overall_trends_axis_label2
				                },
				                opposite: true,
				                max: 100,
				                min:0,
                                tickInterval:(Math.round(100/10))
		            	
		                   },
		                   { // Secondary yAxis
		    		          
		                	   labels: {
	    		                    formatter: function() {
	    		                        return chartsCurrencyFormatter(this.value);
	    		                    },
	    		                    style: {
	    		                        color: '#666666'
	    		                    }
	    		                },
	    		                stackLabels: {
	    		                    style: {
	    		                        color: '#666666'       
	    		                    },
	    		                    enabled: true,           
	    		                    verticalAlign: 'top', 
	    		                    formatter: function() {
	    		                        return chartsCurrencyFormatter(this.total);
	    		                    }
	    		                },
	    		                title: {
	    		                    text: globalvars.localResourceMap.overall_trends_axis_label1
	    		                }
		    		              
		    		       },
                           { // Secondary yAxis
                              
                               labels: {
                                    formatter: function() {
                                        return this.value;
                                    },
                                    style: {
                                        color: '#666666'
                                    }
                                },
                                title: {
                                    text: 'Review Count'
                                },
                                opposite: true,
                                min:0,
                                max:charts.trendsChart.yMaxreviewedCount,
                                tickInterval:(Math.round(charts.trendsChart.yMaxreviewedCount/10))

                           }],
		    		       
		    		       tooltip : {
		    		    	   
		    		    	   	  backgroundColor: {
	    		                      linearGradient: [0, 0, 0, 60],
	    		                      stops: [
	    		                          [0, '#F6F6F6'],
	    		                          [1, '#FFFFFF']
	    		                      ]
	    		                  },
	    		                  borderWidth: 1,
	    		                  borderColor: '#a6c9e2',
	    		                  hideDelay : 0,
	    		                  formatter : function(){
	    		                	  
	    		                	var xLabel = '<b>'+ this.x +'</b>';
	      		                    var symbol1;
	      		                    var symbol2;
	      		                    $.each(this.points, function(i, point) {
	      		                    	
	      		                    	if(point.series.name == "missingDollars"){ 
	      		                    		symbol1='$';
	      		                    		symbol2='';
	      		                    	}else{
	      		                    		symbol1='';
	      		                    		symbol2='%';
	      		                    	}

	      		                    	if(point.series.name == "missingDollars" ){
	      		                    	    xLabel += '<br/>' + globalvars.localResourceMap.overall_trends_missing_dollars + ': ' +
	      		                    		chartsCurrencyFormatter(point.y);
	      		                    	}else if(point.series.name == "reviewed"){
	      		                    		xLabel += '<br/>'+ globalvars.localResourceMap.overall_trends_review_rate+': '+
	      		                    		symbol1+Math.round(parseFloat(point.y)) +symbol2;
	      		                    	}else if(point.series.name == "hits"){
	      		                    		xLabel += '<br/>'+ globalvars.localResourceMap.overall_trends_hit_rate+': '+
	      		                    		symbol1+Math.round(parseFloat(point.y)) +symbol2;
	      		                    	}
                                        else if(point.series.name == "reviewedCount"){
                                            xLabel += '<br/>'+ 'Review Count'+': '+
                                            symbol1+Math.round(parseFloat(point.y));
                                        }
	      		                       
	      		                    });
	      		                    
	      		                    return xLabel;
	    		                  },
	    		                  shared: true
		    		       },
		    		       
		    		       legend : {
		    		    	      x:0,y:-20,
		    		    	      borderWidth: 0,
	    		            	  align: 'left',
	    		            	  padding:20,
	    		            	  symbolPadding:7,
	    		            	  verticalAlign: 'top',
                                  floating: true,
	    		                  labelFormatter: function() {
	     		            		 if(this.name =="missingDollars"){
	     		            			return globalvars.localResourceMap.overall_trends_missing_dollars;  
	     		            		 }else if(this.name =="reviewed"){
	     		            			 return globalvars.localResourceMap.overall_trends_review_rate;  
	     		            		 }else if(this.name =="hits"){
	     		            			 return globalvars.localResourceMap.overall_trends_hit_rate;
	     		            		 }
                                     else if(this.name =="reviewedCount"){
                                         return 'Review Count';
                                     }
	     		                 }
		    		       },
		    		     
		    		       
		    		       series: []
			};
		this.chartOptions.series = this.yAxisData;
		var chart = new Highcharts.Chart(this.chartOptions);
		}
	},

	trendsChartAuditPerformance: {
		
		xAxisLabel:"",
		xAxisLabelRotate:"",
		perShapeGradient:{
	            x1: 0,
	            y1: 0,
	            x2: 1,
	            y2: 0
	    },
	    xAxisLabelAlignment:"",
	    xAxisData:"",
	    yAxisData:"",
	    chartOptions:"",
	    chartDiv:"",
        yMaxreviewedCount:"",
	    titleText:"",
	    enableExporting:"",
      filename: "",
		
	    initialize : function(param){
			this.chartDiv = param.chartDiv;
			this.xAxisLabel = param.xAxisLabel;
			this.xAxisDataRotate = param.xAxisDataRotate;
			this.xAxisDataAlignment = param.xAxisDataAlignment;
			this.xAxisData = param.xAxisData;
			this.yAxisData = param.yAxisData;
			this.titleText = param.titleText;
            this.yMaxreviewedCount = param.yMaxreviewedCount;
			this.enableExporting = param.enableExporting;
			this.filename = param.filename;
			this.chartOptions = {
					
					chart:{
						renderTo: this.chartDiv,
					    backgroundColor: '#F6F6F6',
				        defaultSeriesType: 'spline',
				        marginTop:40,
				        backgroundColor: null
					},

					exporting: {
              filename: this.filename,
					    enabled: false,
					    sourceWidth: $('#'+this.chartDiv).width(),
					    sourceHeight: $('#' + this.chartDiv).height(),
                        scale: 1,
					    metadata: {
					        title: this.titleText,
					        filter: formatFiltersForChartExportPhysician
					    }
					},

					plotOptions:{
						series: {
 				            events: {
 				                legendItemClick: function(event) {
 				                    return false;
 				                }
 				            },  
 				            marker: {
 			                    enabled: true,
 			                	states: {
 									hover: {
 										enabled: false,
 										symbol: 'circle',
 										radius: 5,
 										lineWidth: 1
 									}
 								}
 			                }
 				        },
 				       
 				        column: {
				        	stacking: 'normal',
				        	dataLabels: {
		                        enabled: false,
		                        color: 'white'
		                    }
						},
						spline:{
					       lineWidth:3
						}
					},
					
				    title: {
				    	align: 'left',
				    	style:{
				    		 fontWeight: 'bold',
				    		 fontSize: '18px'
				    	},
		                text: "" //this.titleText
		            },
		            credits:{enabled:false},
		            
		    	    xAxis: [{
		                categories: this.xAxisData,
		                labels: {
			    	    	formatter: function() {
				    	    	if(charts.trendsChartAuditPerformance.xAxisLabel === globalvars.localResourceMap.overall_trends_chart_xaxis_label_monthly)
				    	    	{
				    	    		return this.value.substring(0,3);
				    	    	}
				    	    	else
				    	    	{
				    	    		return this.value;
				    	    	}
			    	   		},
		                    rotation: this.xAxisDataRotate,      
		                    align:this.xAxisDataAlignment,
		                    style: {
		                        color: '#666666'
		                    }
		                },
						title: {
			                    text: this.xAxisLabel
			            }
		            }],
		            
		            colors: [
		                     '#008080', 
		                     '#737699',
		                     '#b72b34',
		                     '#ffd261',
		                     '#590e1f', 
		                     '#2f9644',
		                     '#6bc8b6',
		                     '#e04050',
		                     '#800000', 
		                     '#06983e',
		                     '#a32453',
		                     '#d8f8f3',
		                     '#590e1f','#2f7ed8', '#0d233a', '#8bbc21', '#910000', '#1aadce',
		                     '#492970', '#f28f43', '#77a1e5', '#c42525', '#a6c96a','#4572A7', '#AA4643', '#89A54E', '#80699B', '#3D96AE',
		                     '#DB843D', '#92A8CD', '#A47D7C', '#B5CA92'
                            ],
		                    
		            yAxis:[{
		            	
			            	  labels: {
				                    formatter: function() {
				                        return this.value +'%';
				                    },
				                    style: {
				                        color: '#666666'
				                    }
				                },
				                title: {
				                    text: globalvars.localResourceMap.overall_trends_axis_label2
				                },
				                opposite: true,
				                
				                //max: 100,
				                //min:0,
                                //tickInterval:(Math.round(100/10))
		            	
		                   },
		                   { // Secondary yAxis
		    		          
		                	   labels: {
	    		                    formatter: function() {
	    		                        return chartsCurrencyFormatter(this.value);
	    		                    },
	    		                    style: {
	    		                        color: '#666666'
	    		                    }
	    		                },
	    		                stackLabels: {
	    		                    style: {
	    		                        color: '#666666'       
	    		                    },
	    		                    enabled: true,           
	    		                    verticalAlign: 'top', 
	    		                    formatter: function() {
	    		                        return chartsCurrencyFormatter(this.total);
	    		                    }
	    		                },
	    		                min:0,
	    		                max:12000,
	    		                title: {
	    		                    text: globalvars.localResourceMap.overall_trends_axis_label1
	    		                }
		    		              
		    		       },
                           { // Secondary yAxis
                              
                               labels: {
                                    formatter: function() {
                                        return this.value;
                                    },
                                    style: {
                                        color: '#666666'
                                    }
                                },
                                title: {
                                    text: 'Review Count'
                                },
                                opposite: true,
                                min:0,
                                max:3000,
                                tickInterval:(Math.round(charts.trendsChartAuditPerformance.yMaxreviewedCount/5))

                           }],
		    		       
		    		       tooltip : {
		    		    	   
		    		    	   	  backgroundColor: {
	    		                      linearGradient: [0, 0, 0, 60],
	    		                      stops: [
	    		                          [0, '#F6F6F6'],
	    		                          [1, '#FFFFFF']
	    		                      ]
	    		                  },
	    		                  borderWidth: 1,
	    		                  borderColor: '#a6c9e2',
	    		                  hideDelay : 0,
	    		                  formatter : function(){
	    		                	  
	    		                	var xLabel = '<b>'+ this.x +'</b>';
	      		                    var symbol1;
	      		                    var symbol2;
	      		                    $.each(this.points, function(i, point) {
	      		                    	
	      		                    	if(point.series.name == "missingDollars"){ 
	      		                    		symbol1='$';
	      		                    		symbol2='';
	      		                    	}else{
	      		                    		symbol1='';
	      		                    		symbol2='%';
	      		                    	}
	      		                    	if(point.series.name == "missingDollars" ){
	      		                    	    xLabel += '<br/>' + globalvars.localResourceMap.overall_trends_missing_dollars + ': ' +
	      		                    		chartsCurrencyFormatter(point.y);
	      		                    	}else if(point.series.name == "hits"){
	      		                    		xLabel += '<br/>'+ globalvars.localResourceMap.overall_trends_hit_rate+': '+
	      		                    		symbol1+Math.round(parseFloat(point.y)) +symbol2;
	      		                    	}
                                        else if(point.series.name == "reviewedCount"){
                                            xLabel += '<br/>'+ 'Review Count'+': '+
                                            symbol1+Math.round(parseFloat(point.y));
                                        }
                                        else{
	      		                    		xLabel += '<br/>'+ point.series.name + ': '+
	      		                    		symbol1+Math.round(parseFloat(point.y));

                                        }
	      		                       
	      		                    });
	      		                    
	      		                    return xLabel;
	    		                  },
	    		                  shared: true
		    		       },
		    		       
		    		       legend : {
		    		    	      x:0,y:-20,
		    		    	      borderWidth: 0,
	    		            	  align: 'left',
	    		            	  padding:20,
	    		            	  symbolPadding:7,
	    		            	  verticalAlign: 'top',
                                  floating: true,
	    		                  labelFormatter: function() {
	     		            		 if(this.name =="missingDollars"){
	     		            			return globalvars.localResourceMap.overall_trends_missing_dollars;  
	     		            		 }/*else if(this.name =="reviewed"){
	     		            			 return globalvars.localResourceMap.overall_trends_review_rate;  
	     		            		 }*/else if(this.name =="hits"){
	     		            			 return globalvars.localResourceMap.overall_trends_hit_rate;
	     		            		 }
                                     else if(this.name =="reviewedCount"){
                                         return 'Review Count';
                                     }
                                     else{
                                    	 return this.name
                                     }
	     		                 }
		    		       },
		    		     
		    		       
		    		       series: []
			};
		this.chartOptions.series = this.yAxisData;
		var chart = new Highcharts.Chart(this.chartOptions);
		}
	},

	showSimplePieChart: function (param) {
	    var pieColor = {};
	    var pieHitRate = "";
	    var subTitleColor;
	    if (param.color == "blue") {
	    	 pieHitRate = "#FF9900";
	    	 pieColor="#3A9BD6";
	    	 subTitleColor = "#FF9900";
//	        pieColor = {
//	            radialGradient: { cx: 0.5, cy: 0.3, r: 0.7 },
//	            stops: [[0, 'rgb(83, 124, 193)'],[1, 'rgb(28, 76, 124)']]
//	        };
	        
	    } else {
	        pieColor = "#bdbdbd";
	        pieHitRate = "#8A8A8A";
	        subTitleColor = "#999999";
	    }

	    var chart = new Highcharts.Chart({
	        chart: {
	            renderTo: param.$chartDiv,
                marginLeft: 10,
                marginRight: 10,
                marginTop: 0,
                marginBottom: 0,
	            plotBackgroundColor: null,
	            plotBorderWidth: null,
	            plotShadow: false,
	            backgroundColor: '#F6F6F6',
	            style: {
	                cursor: 'pointer'
	            }
	        },
	        colors: [
                 pieColor
	        ],
	        title: {
	            text: '',
	            style: {
	                color: 'black',
	            },
	            verticalAlign: 'top'
	        },
	        subtitle: {
	            text: '<span style="font-size:14px; font-weight:bold">'+param.value+'%</span><br><span style="font-size:8px">('+param.subtitle+')</span>',
	            style: {
	                color: subTitleColor
	            },
	            verticalAlign: 'middle',
	            floating: true,
	            y: 0
	        },
	        plotOptions:{
	            pie:{
	                dataLabels: {
	                    enabled: false
//	                    distance: -80,
//	                    color: 'black'
	                },
	                //allowPointSelect: true,
	                cursor: 'pointer',
	                innerSize: '60%'
	                
	            }
	        },
	        tooltip: {
	            enabled: false
	        },
	        exporting: {
	            enabled: false
	        },
	        credits: { enabled: false },
	        series: [{
	            type: 'pie',
	            data: [{color: pieHitRate, name: (param.value + '%'),   y: param.value},
                      { name: '',  y: (100 - param.value)}]
	        }]
	    });

	},

	showPerformanceComparisonColumnChart: function (param) {
	    var perShapeGradient = {
	        x1: 0,
	        y1: 0,
	        x2: 1,
	        y2: 0
	    };
	    
	    var chart = new Highcharts.Chart({
	        chart: {
	            renderTo: param.$chartDiv,
	            type: 'column',
                    width: 872,
	            backgroundColor: null
	        },
	        title: {
	            text: ''
	        },
	        colors: [
		                "#3A9BD6"
	        ],
	        xAxis: {
	            categories: param.xCategoriesArray,
	            labels: {
	                rotation: -45,
	                align: 'right'
	            },
	            title: {
	                text: (globalvars.client=="MERCY")?'Cost Center': globalvars.localResourceMap.performance_comparison_chart_xaxis_label
	            }
	        },
	        yAxis: {
	            labels: {
	                enabled: false
	            },
	            title: {
	                text: globalvars.localResourceMap.performance_comparison_chart_yaxis_label
	            },
	            gridLineWidth: 0,
	            tickWidth: 0,
                min: 0, 
                minRange: 0.1
	        },
	        legend: {
	            enabled: false
	        },
	        exporting: {
	            enabled: false
	        },
	        credits: {
	            enabled: false
	        },
	        plotOptions: {
	            column: {
	                enableMouseTracking: true,
	                shadow: true,
	                animation: true,
                    pointWidth: 30
	            }
	        },
	        tooltip: {
	            enabled: true,
	            backgroundColor: {
	                linearGradient: [0, 0, 0, 60],
	                stops: [
                        [0, '#F6F6F6'],
                        [1, '#FFFFFF']
	                ]
	            },
	            borderWidth: 1,
	            borderColor: '#a6c9e2',
	            hideDelay : 0,
	            formatter: function () {
	            	if(this.y!=undefined && this.y > 0){
	            		   return globalvars.localResourceMap.performance_comparison_chart_facility_name_tooltip + ' ' + this.x + '<br />' +
	            		   globalvars.localResourceMap.performance_comparison_chart_dollar_found_tooltip + ' ' + chartsCurrencyFormatter(this.y) + '<br />' +
	            		   globalvars.localResourceMap.performance_comparison_chart_review_rate_tooltip + ' ' + this.points[0].point.reviewRate + '%<br />';
	            	}else{
	            		return false;
	            		
	            	}
                },
	            shared: true
	        },
	        series: [{
	            data: param.dataArray,
	            dataLabels: {
	                enabled: true,
	                rotation: 0,
	                color: '#000',
	                align: 'center',
	                x: 0,
	                y: 0,
	                formatter: function () {
	                	return '<span style="color:#666666">' + chartsCurrencyFormatter(this.y) + '</span>';
	                    
	                }
	            }
	        }]
	    });
	},
	
dashboardOtherTrendsChart: {
		
		xAxisLabel:"",
		xAxisLabelRotate:"",
		perShapeGradient:{
	            x1: 0,
	            y1: 0,
	            x2: 1,
	            y2: 0
	    },
	    xAxisLabelAlignment:"",
	    xAxisData:"",
	    yAxisData:"",
	    chartOptions:"",
	    chartDiv:"",
	    titleText:"",
		
	    initialize : function(param){
			
			this.chartDiv = param.chartDiv;
			this.xAxisLabel = param.xAxisLabel;
			this.xAxisDataRotate = param.xAxisDataRotate;
			this.xAxisDataAlignment = param.xAxisDataAlignment;
			this.xAxisData = param.xAxisData;
			this.yAxisData = param.yAxisData;
			this.titleText = param.titleText;
			
			this.chartOptions = {
					
					chart:{
						renderTo: this.chartDiv,
					    backgroundColor: 'none',
				        marginTop:6,
				        marginLeft:0,
				        marginRight:0,
				        	        
					},
					
					plotOptions:{
						series: {
 				            marker: {
 			                    enabled: true,
 			                	states: {
 									hover: {
 										enabled: false,
 										symbol: 'circle',
 										radius: 5,
 										lineWidth: 1
 									}
 								}
 			                }
 				        },
 				       
 				        column: {
				        	stacking: 'normal'
						},
						spline:{
					       lineWidth:3
						}
					},
					
				    credits:{enabled:false},
		            legend:{enabled:false},
		            title: {
				    	align: 'left',
				    	style:{
				    		 fontWeight: 'bold',
				    		 fontSize: '18px'
				    	},
		                text: ""
		            },
		            xAxis: [{
		            	   
		            	categories: this.xAxisData,
		    
		            }],
		            
		            colors: [
		                     '#3A9BD6', 
		                     {linearGradient: this.perShapeGradient,stops: [[0, 'rgb(99, 45, 135)'],[1, 'rgb(99, 45, 135)']]}
		                     
		                    ],
		                    tooltip : {
			    		    	   
		    		    	   	  backgroundColor: {
	    		                      linearGradient: [0, 0, 0, 60],
	    		                      stops: [
	    		                          [0, '#F6F6F6'],
	    		                          [1, '#FFFFFF']
	    		                      ]
	    		                  },
	    		                  borderWidth: 1,
	    		                  borderColor: '#a6c9e2',
	    		                  formatter : function(){
	    		                	  
	    		                	var xLabel = '<b>'+ this.x +'</b>';
	      		                    var symbol1;
	      		                    var symbol2;
	      		                    $.each(this.points, function(i, point) {
	      		                    	
	      		                    	if(point.series.name == "missingDollars"){ 
	      		                    		symbol1='$';
	      		                    		symbol2='';
	      		                    	}else{
	      		                    		symbol1='';
	      		                    		symbol2='%';
	      		                    	}
	      		                    	if(point.series.name == "missingDollars" ){
	      		                    	    xLabel += '<br/>' + globalvars.localResourceMap.overall_trends_missing_dollars + ': ' +
	      		                    		chartsCurrencyFormatter(point.y);
	      		                    	}else if(point.series.name == "reviewed"){
	      		                    		xLabel += '<br/>'+ globalvars.localResourceMap.overall_trends_review_rate+': '+
	      		                    		symbol1+Math.round(parseFloat(point.y)) +symbol2;
	      		                    	}
	      		                       
	      		                    });
	      		                    
	      		                    return xLabel;
	    		                  },
	    		                  shared: true
		    		       },

		                    
		            yAxis:[{
		            		
		            	gridLineWidth: 0,
		                minorGridLineWidth: 0,

		            	
			            	  labels: {
				                    formatter: function() {
				                        return this.value +'%';
				                    },
				                    style: {
				                        color: '#000000'
				                    }
				                },
				                title: {
				                    text: globalvars.localResourceMap.overall_trends_axis_label2,
				                    style: {
				                    	fontWeight: 'normal',
				                        color: '#000000'
				                    }
				                },
				                opposite: true,
				                max: 100,
				                min:0
				                
		            	
		                   },
		                   { // Secondary yAxis
		    		          
		                	   gridLineWidth: 0,
				                minorGridLineWidth: 0,
		                	   labels: {
	    		                    formatter: function() {
	    		                        return chartsCurrencyFormatter(this.value);
	    		                    },
	    		                    style: {
	    		                        color: '#000000'
	    		                    }
	    		                },
	    		                stackLabels: {
	    		                    style: {
	    		                        color: 'black',
	    		                        fontSize:'13px'
	    		                    },
	    		                    enabled: true,           
	    		                    verticalAlign: 'top', 
	    		                    formatter: function() {
	    		                        return chartsCurrencyFormatter(this.total);
	    		                    }
	    		                },
	    		                title: {
	    		                    text: globalvars.localResourceMap.overall_trends_axis_label1,
	    		                    style: {
	    		                    	fontWeight: 'normal',
	    		                        color: '#000000'
	    		                    }
	    		                }
		    		              
		    		       }],
		    		       
		    		      series: []
			};
		
		this.chartOptions.series = this.yAxisData;
	    var chart = new Highcharts.Chart(this.chartOptions);
		}
	},
	
	showVolumeColumnChart: function (param) {
	    var perShapeGradient = {
	        x1: 0,
	        y1: 0,
	        x2: 1,
	        y2: 0
	    };
	    
	    var chart = new Highcharts.Chart({
	        chart: {
	            renderTo: param.$chartDiv,
	            type: 'column',
	            backgroundColor: null
	        },
	        title: {
	            text: ''
	        },
	        colors: [
		                "#3A9BD6"
	        ],
	        xAxis: {
	            categories: param.xCategoriesArray,
	            labels: {
	                rotation: -45,
	                align: 'right'
	            },
	            title: {
	                text: param.title
	            }
	        },
	        yAxis: {
	            labels: {
	                enabled: false
	            },
	            title: {
	                //text: globalvars.localResourceMap.performance_comparison_chart_yaxis_label
	            },
	            gridLineWidth: 0,
	            tickWidth: 0,
                min: 0, 
                minRange: 0.1
	        },
	        legend: {
	            enabled: false
	        },
	        exporting: {
	            enabled: false
	        },
	        credits: {
	            enabled: false
	        },
	        plotOptions: {
	            column: {
	                enableMouseTracking: true,
	                shadow: true,
	                animation: true,
                    pointWidth: 30
	            }
	        },
	        tooltip: {
	            enabled: false,
	            
	        },
	        series: [{
	            data: param.dataArray,
	            dataLabels: {
	                enabled: true,
	                rotation: 0,
	                color: '#000',
	                align: 'center',
	                x: 0,
	                y: 0,
	               
	            }
	        }]
	    });
	},
	
	physicianAccountsWidgetBarChart:{
      
		perShapeGradient:{
              x1: 0,
              y1: 0,
              x2: 1,
              y2: 0
      },
      xAxisData:"",
      yAxisData:"",
      chartDiv:"",
      
      initialize:function(param){
      
		this.xAxisData = param.xaxis;
        this.yAxisData = param.yaxis;
        this.chartDiv =  param.container;
        Highcharts.setOptions({
                  colors: ["#6699FF", '#249ee7']
              });
            var chart = new Highcharts.Chart({
                chart: {
                    renderTo: this.chartDiv,
                    type: 'bar',
                    // marginBottom: (param.containerHeight < 70)? 40 : 0,
                     marginLeft: 80
                    // backgroundColor: null,
                    // height: (param.containerHeight < 70)? param.containerHeight + 50 : param.containerHeight
                },
                legend: { enabled: false },
                credits: { enabled: false },
                exporting: { enabled: false },
                tooltip: { enabled: false },
                title: { text: 'Patient Match Confidence',
                style: {
                        color: '#424242',
                         font: 'bold 14px "Arial"'
                        }},
                
                xAxis: {
                //categories: ['Africa', 'America', 'Asia', 'Europe', 'Oceania'],
                categories:this.yAxisData,
                title: {
                    text: null
                  }
                },
				yAxis: {
					min:0,
					gridLineWidth: 0,
					minorGridLineWidth: 0,
					title: {
						text: null
					},
					//                title: {
					//                    text: 'Population (millions)',
					//                    align: 'high'
					//                },
					labels: {
						overflow: 'justify',
						enabled: false,                    
					}
				},
				plotOptions: {
					bar: {
						dataLabels: {
							enabled: true,
							format: '{y}%'
						}
					}
				},
                //                tooltip: {
				//                valueSuffix: ' millions'
				//              },
                series: [{
					name: 'Stats',
					//data: [80, 95, 96, 100, 90]
					data:this.xAxisData
				}]
            });
          
      }

    },
    topFiveProcedureBarChart:{
        
        perShapeGradient:{
                x1: 0,
                y1: 0,
                x2: 1,
                y2: 0
        },
        xAxisData:"",
        yAxisData:"",
        chartDiv:"",
        
        initialize:function(param){
        
            this.xAxisData = param.xaxis;
            this.yAxisData = param.yaxis;
            this.chartDiv =  param.container;
            var chart = new Highcharts.Chart({
                chart: {
                    renderTo: this.chartDiv,
                    width: 426,
                    type: 'bar',
                    marginBottom: 0,
                    marginRight:50,
                    marginLeft:100,
                    marginTop:0,
                    backgroundColor: null
                },
                legend: { enabled: false },
                credits: { enabled: false },
                exporting: {
                    filename: 'top5Charges',
                    enabled: false,
                    sourceWidth: $(this.chartDiv).width(),
                    sourceHeight: $(this.chartDiv).height(),
                    scale: 1.5,
                    metadata: {
                        title: globalvars.localResourceMap.dashboard_screen_top_five_charges,
                        filter: formatFiltersForChartExportPhysician
                    }
                },
                tooltip: { enabled: true },
                title: { text: '' },
                xAxis: {
                    categories: this.xAxisData,
                    tickWidth: 0,
                    style:{
                        width:'100px'
                    }
                },
                plotOptions: {
                    bar: {
                        pointWidth: 25,
                        stacking: 'normal'
                    }
                },
               colors: [
                         '#3A9BD6' 
                       ],
                yAxis: {
                    gridLineWidth: 0,
                    min: 0, 
                    minRange: 0.1,
                    stackLabels: {
                        enabled: true,
                        verticalAlign:'middle',
                        align:'right',
                        formatter: function() {
                            log(globalvars.dashboardTopFiveChargesChartData.yAxis[this.x].procedureDescription);
                            
                            if(globalvars.dashboardTopFiveChargesChartData.xAxis[this.x] != "")
                                return "$" + chartsCurrencyFormatter(this.total);
                            else
                                return "";
                            
//                          if(this.total>0)
//                          {
//                              return chartsCurrencyFormatter(this.total);
//                          }
//                          else 
//                              return "0";
                        }
                    }
                },
            tooltip : {
                  enabled:true,
                  borderWidth: 1,
            borderColor: '#a6c9e2',
            hideDelay : 0,
                  backgroundColor: {
                      linearGradient: [0, 0, 0, 60],
                      stops: [
                          [0, '#F6F6F6'],
                          [1, '#FFFFFF']
                      ]
                  },
                  formatter: function () {
                                          
                        if(this.x != "")
                        {
                            return  'Procedure Code:' + ' ' + this.x +'<br/>'+
                                'Procedure Description:' + ' ' + this.points[0].point.procedureDescription +'<br/>' +
                                globalvars.localResourceMap.dashboard_top_five_missing_dollars_tooltip + chartsCurrencyFormatter(this.points[0].point.y);
                        }
                        else
                            return false;
                },
                shared: true
                },
                series: [{
                    data:this.yAxisData
                }]
            });
          
        }

    },

};