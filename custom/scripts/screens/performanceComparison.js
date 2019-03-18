screens.performanceComparison = {
	downloadExcelURI:"",
	downloadPdfURI:"",
    chartsTemplate: "",
    subchartTemplate: "",
    hasData: true,
    viewType: "chartView",
    selectedMetricType: "",

    loadData: function (filterParameters) {
    	
    	
    		
    	 
//        getSYNC('common/templates/performance_comparison_charts.html?126', function (data) {
//            screens.performanceComparison.chartsTemplate = data;
//        });
//
//        getSYNC('common/templates/performance_comparison_subchart.html?126', function (data) {
//            screens.performanceComparison.subchartTemplate = data;
//        });

        var tempFilterParameters1 = $.extend(true, {}, filterParameters);
        tempFilterParameters1.period = 3;
        var tempFilterParameters2 = $.extend(true, {}, filterParameters);
        tempFilterParameters2.period = 10;

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
        		})
        		
        ).done(function(data1, data2, data3){

        	globalvars["summaryChartDataCurrentMonth"] = data1[0];
        	globalvars["summaryChartDataLastMonth"] = data2[0];
        	globalvars["summaryChartDataYearToDate"] = data3[0];
            filterParameters.viewType = screens.performanceComparison.viewType;

            if (screens.performanceComparison.viewType == "listView") {

            		screens.performanceComparison.loadListData(filterParameters);
                    
            }

            if (screens.performanceComparison.viewType == "chartView") {

            	
            	filterParameters.chartType = "heatmap";
            	
            	$.when(
            		$.ajax({
                		type: 'GET',
                		url: globalvars.root.performanceComparisonChartViewUri,
                		data: filterParameters,
                		traditional: true,
                		dataType: 'json'
                	})
            	).done(function(data1){
            		globalvars["performanceComparisonChart"] = data1;
            		if (globalvars.performanceComparisonChart.data.length == 0) {
            			$("#performance_comparison_listview").hide();
            			$("#performance_comparison_chartview").show();
            			dialogs.messageDialog.show({ text: globalvars.localResourceMap.performance_comparison_no_values });
            			screens.performanceComparison.removeChartData();
            			$('.heat_map_gradient_wrapper').hide();
                    }
                    else{
                    	$('.heat_map_gradient_wrapper').show();
                    	screens.performanceComparison.showChartData(filterParameters.metricType);
                    	screens.performanceComparison.selectedMetricType = filterParameters.metricType;
                    }

            	})
            	
            }

        });
    	
    },

   loadListData: function (filterParameters) {

	   $.when(
			   
       		$.ajax({
    			type: 'GET',
	            url: globalvars.root.performanceComparisonListViewUri,
	            data: filterParameters,
	            traditional: true,
	            dataType: 'json'
    		})
			   
			   
	   ).done(function(data1){

		   globalvars["performanceComparisonList"] = data1;
            var hospitalString = "";

            $(filterParameters.hospitalId).each(function (i) {
                hospitalString += "&hospitalId=" + filterParameters.hospitalId[i];
            });
             
            if( (globalvars.user.uType == globalvars.roles.executive || globalvars.user.uType == globalvars.roles.reportUser || globalvars.user.uType == globalvars.roles.supervisor || globalvars.user.uType==globalvars.roles.administrator) && globalvars.root.auditLevel=="2" ){
         	   screens.performanceComparison.downloadExcelURI = globalvars.root.performanceComparisonListViewExcelUri +"?billType="+filterParameters.billType+ hospitalString +"&period="+filterParameters.period+"&hitType=" + filterParameters.hitType;
         	   screens.performanceComparison.downloadPdfURI = globalvars.root.performanceComparisonListViewPdfUri +"?billType="+filterParameters.billType+ hospitalString +"&period="+filterParameters.period+"&hitType=" + filterParameters.hitType;
            }else{
         	   screens.performanceComparison.downloadExcelURI = globalvars.root.performanceComparisonListViewExcelUri +"?billType="+filterParameters.billType+ hospitalString +"&period="+filterParameters.period;
                screens.performanceComparison.downloadPdfURI = globalvars.root.performanceComparisonListViewPdfUri +"?billType="+filterParameters.billType+ hospitalString +"&period="+filterParameters.period;
            }
            
             if (globalvars.performanceComparisonList.data.length == 0) {
                 dialogs.messageDialog.show({ text: globalvars.localResourceMap.performance_comparison_no_values });
                // this.removeListData();
                 return false;
             };
             screens.performanceComparison.showListData();
	   })

    },

    showListData: function () {

    	$('#filter_metric_type').hide();
        $('#performance_comparison_summary_div').show();


        $("#performance_comparison_chartview").hide();
        $("#performance_comparison_listview").show();

        $("#performance_comparison_listview_table").jqGrid('GridUnload');

        var treeListData =  [];
        treeListData = screens.performanceComparison.populateTreeViewData();    
       
        grids.loadPerformanceComparisonGrid({
            gridDiv: "#performance_comparison_listview_table",
            pagerDiv: "#performance_comparison_listview_pager",
            data: treeListData
        });

    },

    removeListData: function () {
        $("#performance_comparison_listview_table").jqGrid('GridUnload');

        $("#performance_comparison_summary_div_totalmissing").text("$0");
        $("#performance_comparison_summary_div_missingperday").text("$0");

        charts.barChart.initialize({
            completed: 0,
            targetId: 'performance_comparison_summary_div_review_chart',
            total: 100
        });

        charts.barChart.initialize({
            completed: 0,
            targetId: 'performance_comparison_summary_div_hit_chart',
            total: 100
        });

        $("#overall_review_rate_text").text("0%");
        $("#overall_hit_rate_text").text("0%");
    },

    loadChartData: function (filterParameters) {

        
    },

    showChartData: function (metricType) {
    	$('#filter_metric_type').show();
        $("#performance_comparison_listview").hide();
        $("#performance_comparison_chartview").show();
        
        $("#heatmap_chart").empty();
        log("Metric:"+metricType);  
        var myTreeMapObj = new Object();
          
        myTreeMapObj.name = "DIVISIONS";
        myTreeMapObj.children = new Array();
          
        var colorArray1 = getColorArray("#6A9ADA","#1153AC",10);
        var colorArray2 = getColorArray("#CCCCCC","#749FD8",10);
        
        log("+ve Variance Color Array"+colorArray1);
        log("-ve Variance Color Array"+colorArray2);
        colorArray2 = colorArray2.reverse();
        log("-ve Variance Color Array Reversed"+colorArray2);
          
        var parentTotalReviewRate=0;
        var parentTotalHitValue =0;
        
        
        var rescaledChildernReviewRate =0;
        
        for(var i=0;i<globalvars.performanceComparisonChart.data.length;i++){
        	parentTotalReviewRate = parentTotalReviewRate + globalvars.performanceComparisonChart.data[i].reviewRate;
        	parentTotalHitValue = parentTotalHitValue + globalvars.performanceComparisonChart.data[i].hitValue;
        }
        
        log("parentTotalReviewRate:"+parentTotalReviewRate+"::parentTotalHitValue"+parentTotalHitValue);
        
        for(var i=0;i<globalvars.performanceComparisonChart.data.length;i++){
        	
        	var currentObj = globalvars.performanceComparisonChart.data[i];
        	if(metricType === "foundPerDay"){
        		currentObj.origValue = currentObj.hitValue;
        		currentObj.addtionalValue = currentObj.reviewRate;
        		if(parentTotalHitValue!=0){
        			// Setting the minimum tile size to 1/100 width of main chart container if it goes below than that
        			if((currentObj.hitValue!=0) && (currentObj.hitValue/parentTotalHitValue<0.01)){
            			currentObj.hitValue = parentTotalHitValue*0.01;
            		}
        		}
        	}else if(metricType === "reviewRate"){
        		currentObj.origValue = currentObj.reviewRate;
        		currentObj.addtionalValue = currentObj.hitValue;
        		if(parentTotalReviewRate!=0){
            		if((currentObj.reviewRate!=0) && (currentObj.reviewRate/parentTotalReviewRate<0.01)){
            			currentObj.reviewRate = parentTotalReviewRate*0.01;
            		}
        		}        		
        	}
        }
        
        for(var i=0;i<globalvars.performanceComparisonChart.data.length;i++){
        	var currentObj = globalvars.performanceComparisonChart.data[i];
        	var currentObjHospitalData = currentObj.hospitalData;
        	var childTotalReviewRate =0;
        	var childTotalHitValue =0;
        	for(var j =0;j<currentObjHospitalData.length;j++){
        		childTotalReviewRate = childTotalReviewRate + currentObjHospitalData[j].reviewRate;
            	childTotalHitValue = childTotalHitValue + currentObjHospitalData[j].hitValue;
        	}
        	
        	for(var k =0;k<currentObjHospitalData.length;k++){
        		if(metricType === "foundPerDay"){
        			currentObjHospitalData[k].origValue = currentObjHospitalData[k].hitValue;
            		currentObjHospitalData[k].addtionalValue = currentObjHospitalData[k].reviewRate;
            		if(childTotalHitValue!=0){
            			if((currentObjHospitalData[k].hitValue!=0) && (currentObjHospitalData[k].hitValue/childTotalHitValue<0.01)){
                			currentObjHospitalData[k].hitValue = childTotalHitValue*0.01;
                		}
            		}
            		
            	}else if(metricType === "reviewRate"){
            		currentObjHospitalData[k].origValue = currentObjHospitalData[k].reviewRate;
            		currentObjHospitalData[k].addtionalValue = currentObjHospitalData[k].hitValue;
            		if(childTotalReviewRate!=0){
            			if((currentObjHospitalData[k].reviewRate!=0) && (currentObjHospitalData[k].reviewRate/childTotalReviewRate<0.01)){
                			currentObjHospitalData[k].reviewRate = childTotalReviewRate*0.01;
                		}
            		}
            	}
        	}
        }
                
        for(var i=0;i<globalvars.performanceComparisonChart.data.length;i++){
        	var currentObj = globalvars.performanceComparisonChart.data[i];  
            var obj = new Object();
            obj.name = currentObj.divisionName;
            
            if(metricType === "foundPerDay"){
       			obj.value = currentObj.hitValue;
       		}else if(metricType === "reviewRate"){
       			obj.value = currentObj.reviewRate;
       		}
            
            obj.origValue = currentObj.origValue;
   			obj.addtionalValue = currentObj.addtionalValue;
   			
   			obj.children = new Array();
   	        
   			obj.variance = Math.round(currentObj.variance);
   			
   	        var varianceValue = currentObj.variance/5;
   	        if(varianceValue>=0 && varianceValue<10 ){
   	        	obj.color = colorArray1[Math.round(varianceValue)];
   	        }else if(varianceValue>=10){
   	        	obj.color = colorArray1[10];
   	        }else if(varianceValue<0 && varianceValue>-10){
   	        	obj.color = colorArray2[Math.abs(Math.round(varianceValue))];
   	        }else if(varianceValue<=-10){
   	        	obj.color = colorArray2[10];
   	        } 
   	        
   	        var currentObjHospitalData = currentObj.hospitalData;
   	        var parentReviewRate = 0;
   	        var parentHitValue = 0;
   	        var totalChildrenReviewRate = 0;
   	        var totalChildrenHitValue = 0; 
   	        
	   	    for(var j =0;j<currentObjHospitalData.length;j++){
	      		totalChildrenReviewRate = totalChildrenReviewRate + currentObjHospitalData[j].reviewRate;
	      		totalChildrenHitValue = totalChildrenHitValue + currentObjHospitalData[j].hitValue;
	      	}
   	        
   	        if(metricType === "reviewRate"){
   	        	parentReviewRate = currentObj.reviewRate;
   	        }else if(metricType === "foundPerDay"){
   	        	parentHitValue = currentObj.hitValue;
   	        }
   	        
   	        var divisionHospitals = currentObjHospitalData.length;
	         for(var j =0;j<currentObjHospitalData.length;j++){
	        	 var obj1 = new Object();
	        	 obj1.name = currentObjHospitalData[j].hospitalShortName;
	        	 if(metricType === "foundPerDay"){
	        		if(totalChildrenHitValue!=0){
	        			obj1.value = currentObjHospitalData[j].hitValue;
	        		} 
	        	 }else if(metricType === "reviewRate"){
	        		 if(totalChildrenReviewRate!=0){
	        			 obj1.value = (currentObjHospitalData[j].reviewRate/totalChildrenReviewRate)*parentReviewRate;
		        	 }
	        	 }
	        	 
	        	obj1.origValue = currentObjHospitalData[j].origValue;
	        	obj1.addtionalValue = currentObjHospitalData[j].addtionalValue;
	        	
	        	var hospitalVarianceValue = currentObjHospitalData[j].variance/5;
		       	 if(hospitalVarianceValue>=0 && hospitalVarianceValue<10 ){
		         	obj1.color = colorArray1[Math.round(hospitalVarianceValue)];
		         }else if(hospitalVarianceValue>=10){
		         	obj1.color = colorArray1[10];
		         }else if(hospitalVarianceValue<0 && hospitalVarianceValue>-10){
		         	obj1.color = colorArray2[Math.abs(Math.round(hospitalVarianceValue))];
		         }else if(hospitalVarianceValue<=-10){
		        	 obj1.color = colorArray2[10];
		         } 
		       	obj1.variance = Math.round(currentObjHospitalData[j].variance);	
		       	 
	        	obj.children.push(obj1);
	         }
	         myTreeMapObj.children.push(obj);  
        }
        this.drawTreeChart(myTreeMapObj,metricType);

    },

    drawTreeChart:function(myTreeMapObj,metricType){
        var margin = {top: 20, right: 0, bottom: 0, left: 0},
        width = 874,
        height = 700 - margin.top - margin.bottom,
        formatNumber = d3.format(",d"),
        transitioning;

    /* create x and y scales */
    var x = d3.scale.linear()
        .domain([0, width])
        .range([0, width]);

    var y = d3.scale.linear()
        .domain([0, height])
        .range([0, height]);

    var treemap = d3.layout.treemap()
        .children(function(d, depth) { return depth ? null : d.children; })
        .sort(function(a, b) { return a.value - b.value; })
        .ratio(height / width * 0.5 * (1 + Math.sqrt(5)))
        .round(false);

    /* create svg */
    var svg = d3.select("#heatmap_chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.bottom + margin.top)
        .style("margin-left", -margin.left + "px")
        .style("margin-right", -margin.right + "px")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .style("shape-rendering", "crispEdges");
    

    var grandparent = svg.append("g")
        .attr("class", "grandparent");

    grandparent.append("rect")
        .attr("y", -margin.top)
        .attr("width", width)
        .attr("height", margin.top);
   	

    grandparent.append("text")
        .attr("x", 6)
        .attr("y", 6 - margin.top)
        .attr("dy", ".75em");
   	

    /* load in data, display root */
    

      initialize(myTreeMapObj);
      accumulate(myTreeMapObj);
      layout(myTreeMapObj);
      display(myTreeMapObj,metricType);

      function initialize(root) {
        root.x = root.y = 0;
        root.dx = width;
        root.dy = height;
        root.depth = 0;
      }

      // Aggregate the values for internal nodes. This is normally done by the
      // treemap layout, but not here because of our custom implementation.
      function accumulate(d) {
        return d.children
            ? d.value = d.children.reduce(function(p, v) { return p + accumulate(v); }, 0)
            : d.value;
      }

      // Compute the treemap layout recursively such that each group of siblings
      // uses the same size (1×1) rather than the dimensions of the parent cell.
      // This optimizes the layout for the current zoom state. Note that a wrapper
      // object is created for the parent node for each group of siblings so that
      // the parent’s dimensions are not discarded as we recurse. Since each group
      // of sibling was laid out in 1×1, we must rescale to fit using absolute
      // coordinates. This lets us use a viewport to zoom.
      function layout(d) {
        if (d.children) {
          treemap.nodes({children: d.children});
          d.children.forEach(function(c) {
            c.x = d.x + c.x * d.dx;
            c.y = d.y + c.y * d.dy;
            c.dx *= d.dx;
            c.dy *= d.dy;
            c.parent = d;
            layout(c);
          });
        }
      }

      /* display show the treemap and writes the embedded transition function */
      function display(d) {
        /* create grandparent bar at top */
        grandparent
            .datum(d.parent)
            .on("click", transition)
            .select("text")
            .text(name(d));

        var g1 = svg.insert("g", ".grandparent")
            .datum(d)
            .attr("class", "depth");
        
        /* add in data */
    	
        var g = g1.selectAll("g")
            .data(d.children)
            .enter().append("g");
        
        /* transition on child click */
        g.filter(function(d) { return d.children; })
            .classed("children", true)
            .on("click", transition);
        
        /* write children rectangles */
        g.selectAll(".child")
            .data(function(d) { return d.children || [d]; })
            .enter().append("rect")
            .attr("class", "child")
            .call(rect);

        /* write parent rectangle */
        	 g.append("rect")
            .attr("class", "parent")
            .call(rect)
            .on("click", function(d) { 
                if(!d.children){
                }
            })
          .append("title")
          .text(function(d){
        	  var formattedReviewRate = " "+formatNumber(d.origValue);
        	  var formattedCharges = " "+formatNumber(d.hitValue);
        	  if(metricType === "foundPerDay"){
          		return d.name +" - $"+chartsCurrencyFormatter(d.origValue)+" ("+Math.round(d.addtionalValue)+"%) "+globalvars.localResourceMap.heat_map_chart_tooltip_text1+" " + d.variance + "%";
         	  }else if(metricType === "reviewRate"){
         			return d.name +" - "+Math.round(d.origValue)+"% ($"+chartsCurrencyFormatter(d.addtionalValue)+") "+globalvars.localResourceMap.heat_map_chart_tooltip_text2+" " + d.variance + "%";
         	  }
    
          }
        		 

      );

        
        /* Adding  text object */
            g.append("text")
            .call(text)
            .on("mouseover", function(d) { 
             })
            .attr("class","foreignobj")
            //.append("text") 
            .attr("align","center")
            .attr("dx", ".50em")
            .attr("dy", "1.25em")
            .attr("class","textdiv")
             .text(function(d) {
            	if(metricType === "foundPerDay"){
            		return d.name +" - $"+chartsCurrencyFormatter(d.origValue)+" ("+Math.round(d.addtionalValue)+"%)";
           		}else if(metricType === "reviewRate"){
           			return d.name +" - "+Math.round(d.origValue)+"% ($"+chartsCurrencyFormatter(d.addtionalValue)+")";
           		}
            	
            }); //textdiv class allows us to style the text easily with CSS

        /* create transition function for transitions */
        function transition(d) {
          if (transitioning || !d) return;
          transitioning = true;
          //rescaleText();

          var g2 = display(d),
              t1 = g1.transition().duration(750),
              t2 = g2.transition().duration(750);

          
          // Update the domain only after entering new elements.
          x.domain([d.x, d.x + d.dx]);
          y.domain([d.y, d.y + d.dy]);

          // Enable anti-aliasing during the transition.
          svg.style("shape-rendering", null);

          // Draw child nodes on top of parent nodes.
          svg.selectAll(".depth").sort(function(a, b) { return a.depth - b.depth; });

          // Fade-in entering text.
          g2.selectAll("text").style("fill-opacity", 0);
          g2.selectAll("foreignObject div").style("display", "none"); /*added*/

          // Transition to the new view.
          t1.selectAll("text").call(text).style("fill-opacity", 0);
          t2.selectAll("text").call(text).style("fill-opacity", 1);
          t1.selectAll("rect").call(rect);
          t2.selectAll("rect").call(rect);
          
          t1.selectAll(".textdiv").style("display", "none"); /* added */
          t1.selectAll(".foreignobj").call(foreign);
          t2.selectAll(".textdiv").style("display", "block"); /* added */
          t2.selectAll(".foreignobj").call(foreign); /* added */      

          // Remove the old node when the transition is finished.
          t1.remove().each("end", function() {
            svg.style("shape-rendering", "crispEdges");
            transitioning = false;               
          });
          
        }//endfunc transition
        
        return g;
      }

      function text(text) {
        text.attr("x", function(d) { return x(d.x); })
            .attr("y", function(d) { return y(d.y) + 6; })
            .attr("width", function(d) { return x(d.x + d.dx-50) - x(d.x); })
        	.style("fill","white");
        
      }

      function rect(rect) {
        rect.attr("x", function(d) { return x(d.x); })
            .attr("y", function(d) { return y(d.y); })
            .attr("width", function(d) { return x(d.x + d.dx) - x(d.x); })
            .style("fill",function(d){return d.color})
            .attr("height", function(d) { return y(d.y + d.dy) - y(d.y); })
            .style("stroke","white");
      }
      
      function rect1(rect){
    	  rect.attr("x", function(d) { return x(d.x); })
          .attr("y", function(d) { return y(d.y); })
          .attr("width", function(d) { return x(d.x + d.dx) - x(d.x); })
          .style("fill","white")
          .attr("height", function(d) { return y(d.y + d.dy) - y(d.y); });
      }
      
      function foreign(foreign){  /* added */
          foreign
          	.attr("x", function(d) { return x(d.x); })
            .attr("y", function(d) { return y(d.y); })
            .attr("width", function(d) { return x(d.x + d.dx) - x(d.x); })
            .style("fill","white")
            .attr("height", function(d) { return y(d.y + d.dy) - y(d.y); });
      }

      function name(d) {
        return d.parent
            ? "< " + d.name
            : d.name;
      }
      
      
      function rescaleText(){
    	  var rectArray = $("rect.parent");
          //log(textArray);
          for(var i=0;i<rectArray.length;i++){
        	  var rectWidth = rectArray[i].getBBox().width;
        	  var tileTextWidth = rectArray[i].nextSibling.getBBox().width;
        	  var tileText = rectArray[i].nextSibling.textContent;
        	  // Setting ellipsis character if text length reaches to 80% of tile width
        	  if(tileTextWidth>rectWidth*0.95){
        		  log("Need Change:::textWidth:"+rectWidth+"::tileText:"+tileText+"tileTextWidth:"+tileTextWidth);
        		  var tileTextLength = tileText.length;
        		  var eachCharacterSize = Math.round(tileTextWidth/tileTextLength);
        		  var characterShown;
        		  if(rectWidth < 30){ 
        			  characterShown = Math.floor((rectWidth*.5)/eachCharacterSize);
        		  }else if(rectWidth < 60){ 
            		  characterShown = Math.floor((rectWidth*.65)/eachCharacterSize);
        		  }else if(rectWidth < 90){
        			  characterShown = Math.floor((rectWidth*.75)/eachCharacterSize); 
        		  }else{
        			  characterShown = Math.floor((rectWidth*.8)/eachCharacterSize); 
        		  }
        		  
        		  log(tileText.substring(0,characterShown));
        		  rectArray[i].nextSibling.textContent = tileText.substring(0,characterShown)+"...";
        	  }
          }
      }
     
      rescaleText();
      $("#heatmap_chart").click(function(){
    	  setTimeout(rescaleText,775);
      });

    },
    removeChartData: function () {
        
    	$("#heatmap_chart").empty();

    },

    bindFunctionality: function () {
    	$("#submenu_wrapper a").eq(0).click(function () {
    		$('.heat_map_gradient_wrapper').show();
            $("#submenu_wrapper a").removeClass("active");
            $("#submenu_wrapper a").eq(0).addClass("active");
            screens.performanceComparison.viewType = "chartView";
            widgets.filter.initialize({
                $targetDiv: $("#filters_wrapper"),
                screen: 'performanceComparison',
                filters: {
                    audit_type: true,
                    time_period: true,
                    metric_type: true,
                    divisions: true,
                    hitType : ((globalvars.user.uType == globalvars.roles.supervisor ||  globalvars.user.uType==globalvars.roles.administrator) && globalvars.root.auditLevel=="2")?true:false
                }
            });
            
            widgets.filter.updateScreen();
            $("#export_options").hide();
        });

        $("#submenu_wrapper a").eq(1).click(function () {
        	$('.heat_map_gradient_wrapper').hide();
            $("#submenu_wrapper a").removeClass("active");
            $("#submenu_wrapper a").eq(1).addClass("active");
            screens.performanceComparison.viewType = "listView"; 
            widgets.filter.initialize({
                $targetDiv: $("#filters_wrapper"),
                screen: 'performanceComparison',
                filters: {
                    audit_type: true,
                    time_period: true,
                    metric_type: true,
                    divisions: true,
                    hitType : ((globalvars.user.uType == globalvars.roles.supervisor ||  globalvars.user.uType==globalvars.roles.administrator) && globalvars.root.auditLevel=="2")?true:false
                }
            });
            widgets.filter.updateScreen();
        });
 
    },
    bindExportFunctionality : function(){
    	
    	$(".export_div_print").click(function(){
    		
    		 if (screens.performanceComparison.viewType == "chartView" && globalvars.performanceComparisonChart.data.length == 0) {
                 dialogs.messageDialog.show({ text: globalvars.localResourceMap.print_chart_no_values });
                 return;
             };
        	$("#export_options").hide();
        	if(screens.performanceComparison.viewType == "chartView"){
        		var chartContainer1 = $("#heatmap_chart");
        		var chartContainer2 = $(".heat_map_gradient_wrapper");
        		var chartContainer1Parent = $("#heatmap_chart").parent();
        		var chartContainer2Parent = $(".heat_map_gradient_wrapper").parent();
        		
        		printPerformanceComparisonChart({
     		    	appendContainer1 : chartContainer1,
     		    	appendContainer2 : chartContainer2,
     		    	container1Parent : chartContainer1Parent,
     		    	container2Parent : chartContainer2Parent,
     		    	chartTitle : globalvars.localResourceMap.print_chart_performance_comparison_chart_title,
     		    	screenName :"performanceComparisonChart"
     		    });
        		
        	}else{
        		printGrid({
        			container:$("#performance_comparison_listview_div"),
        			gridTitle:globalvars.localResourceMap.print_chart_performance_comparison_grid_title,
        			screenName:"performanceComparisonGrid"
        		});
        	}
        
        });
        
        
        $(".export_div_download").click(function(){
        	
        	if (screens.performanceComparison.viewType == "chartView" && globalvars.performanceComparisonChart.data.length == 0) {
                dialogs.messageDialog.show({ text: globalvars.localResourceMap.download_chart_no_values });
                return;
            };
          	if(screens.performanceComparison.viewType == "chartView"){
          		
          		var chart_svg = $("#heatmap_chart")[0].innerHTML;
          		//log(chart_svg);
          		
          		var export_svg = chart_svg
          		.replace(/zIndex="[^"]+"/g, '')
    			.replace(/isShadow="[^"]+"/g, '')
    			.replace(/symbolName="[^"]+"/g, '')
    			.replace(/jQuery[0-9]+="[^"]+"/g, '')
    			.replace(/url\([^#]+#/g, 'url(#')
    			.replace(/<svg /, '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" ')
    			.replace(/ style="/,' style=" font-size:16px;')
    			.replace(/ href=/g, ' xlink:href=')
    			.replace(/\n/, ' ')
    			.replace(/<\/svg>.*?$/, '</svg>') // any HTML added to the container after the SVG (#894)
    			/* This fails in IE < 8
    			.replace(/([0-9]+)\.([0-9]+)/g, function(s1, s2, s3) { // round off to save weight
    				return s2 +'.'+ s3[0];
    			})*/

    			// Replace HTML entities, issue #347
    			.replace(/&nbsp;/g, '\u00A0') // no-break space
    			.replace(/&shy;/g,  '\u00AD') // soft hyphen

    			// IE specific
    			.replace(/<IMG /g, '<image ')
    			.replace(/height=([^" ]+)/g, 'height="$1"')
    			.replace(/width=([^" ]+)/g, 'width="$1"')
    			.replace(/hc-svg-href="([^"]+)">/g, 'xlink:href="$1"/>')
    			.replace(/id=([^" >]+)/g, 'id="$1"')
    			.replace(/class=([^" ]+)/g, 'class="$1"')
    			.replace(/ transform /g, ' ')
    			.replace(/:(path|rect)/g, '$1')
    			.replace(/style="([^"]+)"/g, function (s) {
    				return s.toLowerCase();
    			});	
          		
            	// For IE9.
        		
        		if (export_svg.match(/ xmlns="/g).length === 2) {
        			export_svg = export_svg.replace(/xmlns="[^"]+"/, '');
        		}
          		
        		var userBrowser = $.browser;
        		log(userBrowser);
      		    if(userBrowser.mozilla){
      		    	export_svg = export_svg.replace(/<g class="grandparent"><rect height="20" width="874" y="-20"><\/rect>/,'<g>')
      		    }else if(userBrowser.chrome){
      		    	export_svg = export_svg.replace(/<g class="grandparent"><rect y="-20" width="874" height="20"><\/rect>/,'<g>')
      		    }else{
      		    	export_svg = export_svg.replace(/<g class="grandparent"><rect y="-20" width="874" height="20" \/>/,'<g>')
      		    }
        		
      			if(screens.performanceComparison.selectedMetricType === "foundPerDay"){
      				export_svg = export_svg.replace(/<\/g><\/svg>/,'<g><defs><linearGradient id="Gradient2"><stop offset="20%" stop-color="#003A70"/><stop offset="40%" stop-color="#0067CC"/><stop  offset="70%" stop-color="#689FCF" /><stop offset="100%" stop-color="#CCCCCC" /></linearGradient></defs><text y="700" x="10"> '+globalvars.localResourceMap.heat_map_chart_legend_box_size+' '+globalvars.localResourceMap.heat_map_chart_legent_dollor_found+' </text> <text y="720" x="10"> '+globalvars.localResourceMap.heat_map_chart_legent_dollor_found_ytd+' </text><text x="10" y="740">'+globalvars.localResourceMap.heat_map_chart_legend_more+'</text><rect x="130" y="725"  width="200" height="25" fill="url(#Gradient2)"/><text x="350" y="740"> '+globalvars.localResourceMap.heat_map_chart_legend_less+'</text></g></g></svg>')
           		}else if(screens.performanceComparison.selectedMetricType === "reviewRate"){
           			export_svg = export_svg.replace(/<\/g><\/svg>/,'<g><defs><linearGradient id="Gradient2"><stop offset="20%" stop-color="#003A70"/><stop offset="40%" stop-color="#0067CC"/><stop  offset="70%" stop-color="#689FCF" /><stop offset="100%" stop-color="#CCCCCC" /></linearGradient></defs><text y="700" x="10"> '+globalvars.localResourceMap.heat_map_chart_legend_box_size+' '+globalvars.localResourceMap.heat_map_chart_legent_review_rate+' </text> <text y="720" x="10"> '+globalvars.localResourceMap.heat_map_chart_legent_review_rate_ytd+' </text><text x="10" y="740">'+globalvars.localResourceMap.heat_map_chart_legend_more+'</text><rect x="130" y="725"  width="200" height="25" fill="url(#Gradient2)"/><text x="350" y="740"> '+globalvars.localResourceMap.heat_map_chart_legend_less+'</text></g></g></svg>')
           		}
      		    
        		//export_svg = export_svg.replace(/<\/g><\/svg>/,'<g><defs><linearGradient id="Gradient2"><stop offset="20%" stop-color="#003A70"/><stop offset="40%" stop-color="#0067CC"/><stop  offset="70%" stop-color="#689FCF" /><stop offset="100%" stop-color="#CCCCCC" /></linearGradient></defs><text y="695" x="10"> Box Size = % Review Rate </text><rect x="10" y="700"  width="200" height="25" fill="url(#Gradient2)"/></g></g></svg>')
        		
      			export_svg = export_svg.replace(/ height="700"/,' height="800" ')
          		//log(export_svg);
          		
          			exportCharts = function(options, chartOptions, z){
          			
          			options = Highcharts.merge(Highcharts.getOptions().exporting, options);
          			
          			var name,
          			form;
          			
          		    form = Highcharts.createElement('form', {
          		        method: 'post',
          		        action: options.url,
          		        type: 'application/pdf',
          		        enctype: 'multipart/form-data',
          			    encoding: 'multipart/form-data'
          		       
          		    }, {
          		        display: 'none'
          		    }, document.body);
          		    
          		    //log(export_svg);
          		  
          		    Highcharts.each(['filename', 'type', 'width', 'svg','filter','scale','title'], function(name) {
          		        Highcharts.createElement('input', {
          		            type: 'hidden',
          		            name: name,
          		            value: {
          		                filename: options.filename || 'chart',
          		                type: options.type,
          		                width: 870, // IE8 fails to post undefined correctly, so use 0
          				        scale: 0.6,
          				        title: options.metadata.title,
          		                filter: options.metadata.filter(),
          		                svg: export_svg
          		            }[name]
          		        }, null, form);
          		    });
          		    
          		    form.submit();

          		    // clean up
          		    form.parentNode.removeChild(form);
          			
          		}
          		
          		exportCharts({ filename: 'performanceComparison', sourceWidth: 0, sourceHeight: 0, scale: 1, metadata: { title: globalvars.localResourceMap.dashboard_screen_performance_comparison, filter: formatFiltersForChartExport } }, undefined, export_svg);

          	
          	}else{

        		$("#export_options").show();
        	   	$("#download_pdf").click(function(){
              		$("#export_options").hide();
              		window.location.href = screens.performanceComparison.downloadPdfURI;
              	});
              	
              	$("#download_excel").click(function(){
              		$("#export_options").hide();
              		window.location.href = screens.performanceComparison.downloadExcelURI;
              	});
        		
        	}
    
        });
    	
    },

    initialize: function (param) {
        this.drawScreen();
        this.bindFunctionality();
        this.bindExportFunctionality();
        widgets.filter.updateScreen();
    },
    
    onFilterUpdate: function (filterParameters) {
    	screens.performanceComparison.filterUpdateForFacilityPerformace("performanceComparison","facilityPerformance");
    	screens.performanceComparison.fillScreen(filterParameters);
    	screens.performanceComparison.loadData(filterParameters);
        if (screens.performanceComparison.hasData == true) {
        	screens.performanceComparison.fillScreen(filterParameters);
        };
    },
    
    drawScreen: function () {

        getSYNC('common/templates/screens/performanceComparison.html?289', function (data) {
            log('loading facilityPerformance template');
            globalvars.$contentcontainer.append($.nano(data, globalvars.localResourceMap));
        });

        $("#performance_comparison_listview").hide();
        $("#performance_comparison_chartview").hide();
        
        widgets.summaryChart.initialize({
            $targetDiv: $("#summary_chart_wrapper")
        });


        widgets.filter.initialize({
            $targetDiv: $("#filters_wrapper"),
            screen: 'performanceComparison',
            filters: {
                audit_type: true,
                time_period: true,
                metric_type: true,
                divisions: true,
                hitType : ((globalvars.user.uType == globalvars.roles.supervisor ||  globalvars.user.uType==globalvars.roles.administrator) && globalvars.root.auditLevel=="2")?true:false
            }
        });

        

    },
    
    fillScreen: function (filterParameters) {
    	//alert("test");
    	
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
    	
    	$("#submenu_wrapper a").removeClass("active");
        if(screens.performanceComparison.viewType == "chartView")
        	$("#submenu_wrapper a").eq(0).addClass("active");
        else
        	$("#submenu_wrapper a").eq(1).addClass("active");
        
                
        if(filterParameters.metricType =="reviewRate"){
        	$('#grdient_review_rate').text(globalvars.localResourceMap.heat_map_chart_legent_review_rate);
        	$('#grdient_review_rate_YTD').text(globalvars.localResourceMap.heat_map_chart_legent_review_rate_ytd);
        }
        else
        	{
        	$('#grdient_review_rate').text(globalvars.localResourceMap.heat_map_chart_legent_dollor_found);
        	$('#grdient_review_rate_YTD').text(globalvars.localResourceMap.heat_map_chart_legent_dollor_found_ytd);
        	}
        	
        
        
    },
    
    filterUpdateForFacilityPerformace:function(sourceScreen,targetScreen)
    {
    	var tempStoredParameters = localStorage.getItem('filterParameters');
        if (tempStoredParameters) {
            tempStoredParameters = JSON.parse(tempStoredParameters);
            if (tempStoredParameters && tempStoredParameters[targetScreen]) {
            	$.extend(tempStoredParameters[targetScreen],tempStoredParameters[sourceScreen]);
                localStorage.setItem('filterParameters', JSON.stringify(tempStoredParameters));
                
            }
         else if(tempStoredParameters[targetScreen] == undefined)
        	 {
        	 	var facilityPerformance = $.extend(true, {}, tempStoredParameters[sourceScreen]);
        	 	facilityPerformance.hospitalId = globalvars.filterParameters[sourceScreen].hospitalId;
        	 	var newFilterParamater = $.extend(true, {}, tempStoredParameters);
        	 	newFilterParamater.facilityPerformance = facilityPerformance;
        	 	localStorage.setItem('filterParameters', JSON.stringify(newFilterParamater));
        	 	
        	 }
             
             
        }
    	
    },
    
    populateTreeViewData:function(){
    	
    	if(globalvars.performanceComparisonList.data)
    	{
        	var uniqueHospList=[];
        	$.each(globalvars.performanceComparisonList.data, function (index) {
        		var flag=true;
        		var currItem = this;
        		currItem.level="";
        		currItem.parent="null";
        		currItem.isLeaf=true;
        		currItem.expanded=false;
        		var obj = new Object();
        		for(i=0;i<uniqueHospList.length;i++){
        			if(uniqueHospList[i].hospitalId == currItem.hospitalId){
        				uniqueHospList[i].hospitalList.push(currItem);
	        			flag=false;
	        			break;
	        		}
        		}
        		if(flag==true)
    			{
        			obj.hospitalId = currItem.hospitalId;
        			obj.hospitalList = new Array();
        			obj.hospitalList.push(currItem);
        			uniqueHospList.push(obj);
    			}
        		
        	});
        	
        	var treeListData=[];
        	$.each(uniqueHospList, function (i) {
        		if(uniqueHospList[i].hospitalList.length > 1){
        			var hitRate=0;
        			var reviewRate=0;
        			var hitValue=0;
        			var reviewedCount=0;
        			var totalAccounts=0;
        			var hitCount=0;
        			var hospName;
        			var hospShortName;
        			var hospitalId;
        			var obj = new Object();
        			var tempTreeListData = new Array();
        			$.each(uniqueHospList[i].hospitalList, function (j){
        				var currSel = uniqueHospList[i].hospitalList[j];
        				hospitalId = currSel.hospitalId;
        				hitRate+= currSel.hitRate;
        				reviewRate+= currSel.reviewRate;
        				hitValue= hitValue + parseFloat(currSel.hitValue);
        				reviewedCount+= currSel.reviewedCount;
        				totalAccounts+= currSel.totalAccounts;
        				hitCount+= currSel.hitCount;
        				hospName = currSel.hospitalName;
        				hospShortName = currSel.hospitalShortName;
        				currSel.name=currSel.fullAuditorName;
        				currSel.hospitalName = currSel.fullAuditorName;
        				currSel.parent=hospitalId;
        				currSel.id=hospitalId + "_" + j;
        				currSel.hospitalId="";
        				currSel.hospitalShortName="";
        				tempTreeListData.push(uniqueHospList[i].hospitalList[j]);
        			});
        			obj.hospitalId = hospitalId;
        			obj.fullAuditorName="";
        			obj.hospitalName = hospName;
        			obj.name=hospName;
        			obj.hospitalShortName=hospShortName;
        			obj.hitRate = (reviewedCount!=0)?(hitCount/reviewedCount)*100 : 0;
        			obj.reviewRate = (totalAccounts!=0)?(reviewedCount/totalAccounts)*100 : 0; 
        			obj.hitValue = hitValue;
        			obj.reviewedCount = reviewedCount;
        			obj.totalAccounts = totalAccounts;
        			obj.hitCount = hitCount;
        			obj.level="0";
        			obj.parent="null";
        			obj.isLeaf=false;
        			obj.id=hospitalId;
        			obj.expanded=false;
        			uniqueHospList[i].hospitalList.push(obj);
        			treeListData.push(obj);
        			$.each(tempTreeListData,function(i){
        				treeListData.push(tempTreeListData[i]);
        			});
        				
        			
    			}
        		else{
        			var objectParent = jQuery.extend(true, {}, uniqueHospList[i].hospitalList[0]);
        			var objectChild = jQuery.extend(true, {}, uniqueHospList[i].hospitalList[0]);
        			objectParent.level="0";
        			objectParent.parent="null";
        			objectParent.isLeaf=false;
        			objectParent.expanded=false;
        			objectParent.fullAuditorName="";
        			objectParent.name = objectParent.hospitalName;
        			objectParent.hospitalShortName = objectParent.hospitalShortName;
        			objectParent.id=objectParent.hospitalId;
        			treeListData.push(objectParent);
        			objectChild.hospitalName = objectChild.fullAuditorName;
        			objectChild.name = objectChild.fullAuditorName;
        			objectChild.parent=objectChild.hospitalId;
        			objectChild.id=objectChild.hospitalId + "_1";
        			objectChild.hospitalId="";
        			objectChild.hospitalShortName="";
        			treeListData.push(objectChild);
    			}
        		
        	});
        	
        }
         
         for (var i = 0; i < treeListData.length; i++) {
	    	  treeListData[i].hitValue = numberWithCommas(parseFloat(treeListData[i].hitValue));
	    	  treeListData[i].reviewRate = Math.round(treeListData[i].reviewRate);
	    	  treeListData[i].hitRate = Math.round(treeListData[i].hitRate);
	      };
	      
	      return treeListData;
    	
    }
    
};