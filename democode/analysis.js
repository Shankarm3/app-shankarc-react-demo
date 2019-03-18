screens.analysis = {
    selectedProviderPatientDetails: null,
    providerId: null,
	providerName:"",
    providerIndexId: null,
    peerChartLabel: "claim_count",
    peerChartData: null,
    selectedProviderRowData: null,
    chartdata: null,
    filteredMapArray:[],
    currentIndex:1,
	distance: 1,
	daysToVisit: 30,
    initialize: function(param) {
        this.providerId = globalvars.providerPatientDetails[0].providerId;
        if (param.subType != "ANALYSIS") {
            $("#explorer li").removeClass("active");
            $("#explorer li").eq(1).addClass("active");
			this.providerIndexId = param.id;
            this.selectedProviderRowData = param.rowData[param.id - 1];
			//log(this.selectedProviderRowData);
            this.providerId = this.selectedProviderRowData.providerId;
			this.providerName = this.selectedProviderRowData.providerName;
            this.backScreen = param.backScreen;
            var flag = true;
            for (var i = 0; i < globalvars.explorerChartData1.length; i++) {
                if (this.providerId == globalvars.explorerChartData1[i].providerId) {
                    flag = false;
                    break;
                }
            }
			//log(flag);
            if (flag) {
                screens.analysis.selectedProviderPatientDetails = globalvars.providerPatientDetails[0];
                this.providerId = globalvars.providerPatientDetails[0].providerId;
                screens.analysis.selectedProviderRowData = globalvars.heatMapChartData[0];
            }
        } else {
            screens.analysis.selectedProviderPatientDetails = globalvars.providerPatientDetails[0];
            this.providerId = globalvars.providerPatientDetails[0].providerId;
            screens.analysis.selectedProviderRowData = globalvars.heatMapChartData[0];

        }
        this.drawScreen();
        screens.analysis.drawNetworkAnalysisChart();
        screens.analysis.populateChordChart();
        screens.analysis.populateChordHeatMapChart();
        screens.analysis.drawMapChart(this.selectedProviderPatientDetails);
        screens.analysis.peerChartComparision(this.peerChartData);
        screens.analysis.bindFunctionality();
    },
    onFilterUpdate: function(filterParameters) {

    },
    loadData: function(filterParameters) {


    },
    fillScreen: function(filterParameters) {

    },
    drawScreen: function() {

        getSYNC('common/templates/screens/analysis.html', function(data) {
            globalvars.$contentcontainer.append($.nano(data, jQuery.extend(true, {}, screens.analysis.selectedProviderRowData, globalvars.localResourceMap)));
        });
        // var selectedProviderPatientDetails = null;
        for (var i = 0; i < globalvars.providerPatientDetails.length; i++) {
            if (screens.analysis.providerId == globalvars.providerPatientDetails[i].providerId) {
                screens.analysis.selectedProviderPatientDetails = globalvars.providerPatientDetails[i];
                break;
            }
        }
        for (var i = 0; i < globalvars.explorerChartData1.length; i++) {
            if (screens.analysis.providerId == globalvars.explorerChartData1[i].providerId) {
                screens.analysis.chartdata = globalvars.explorerChartData1[i];
                break;
            }
        }
        screens.analysis.drawAllChart(screens.analysis.chartdata);
        if (globalvars.peerLineChartData) {
            for (var i = 0; i < globalvars.peerLineChartData.length; i++)
            {
                if (screens.analysis.providerId == globalvars.peerLineChartData[i].providerId) {
                    screens.analysis.peerChartData = globalvars.peerLineChartData[i];
                    break;
                }

            }
        }
        
        $("#slider-range").slider({
            range: true,
            min: 0,
            max: 1000,
            values: [0, 500],
            slide: function(event, ui) {
                var data = jQuery.extend({}, screens.analysis.selectedProviderPatientDetails);
                var data1 = jQuery.extend({}, screens.analysis.selectedProviderPatientDetails);
                var provArray = [];
                for (var i = 0; i < data.patientDetails.length; i++) {
                    var amount = parseInt(data.patientDetails[i].amount.substring(1));
                    if (amount >= parseInt(ui.values[ 0 ]) && amount <= parseInt(ui.values[ 1 ])) {
                        provArray.push(data.patientDetails[i]);
                    }
                }
                // console.log(provArray);
                data1['patientDetails'] = provArray;
                $("#amount").val("$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ]);
                screens.analysis.drawMapChart(data1);
            }
        });
        
        $("#slider-range1").slider({
            range: false,
            min: 0,
            max: 100,
            values:[30],
            slide: function(event, ui) {
            	$("#days").val("Past " + (ui.values[ 0 ]) + " days");
				screens.analysis.daysToVisit = parseInt(ui.values[0]);
            	screens.analysis.drawMapChart(screens.analysis.filteredMapArray);
            	
            }
        });
		$("#slider-range2").slider({
            range: false,
            min: 0,
            max: 20,
            values: [1],
            slide: function(event, ui) {
                $("#distance").val(" " + (ui.values[ 0 ]) + " mi");
				screens.analysis.distance = ui.values[ 0 ];
                screens.analysis.drawMapChart(screens.analysis.filteredMapArray);
            }
        });

		$("#slider-range1").children("a").css("background", "#A4A4A4");

        $("#slider-range").children("div").css("background", "#F2F2F2");
        $("#slider-range").children("a").css("background", "#A4A4A4");
        $("#amount").val("$" + $("#slider-range").slider("values", 0) + " - $" + $("#slider-range").slider("values", 1));
        $("#days").val("Past " + $("#slider-range1").slider("values", 0) + " days");
		$("#slider-range2").children("a").css("background", "#A4A4A4");
        $("#distance").val(" " + $("#slider-range2").slider("values", 0) + " mi");
		
    },
    bindFunctionality: function() {
        $("#flag").change(function() {
            //  $("div#lineChartDiv").remove();
        	var selectorClass = "analysis_right_top_container";
            var jsonNodeChart = "analysisLineChart";
            var jsonNodeName = "lineChart";
        	if(screens.analysis.currentIndex == 3){
            	selectorClass = "analysis_right_top_container_peer";
            	jsonNodeName = "lineChartForPeer";
                jsonNodeChart = "analysisLinePeerChart";
        	}
            $("."+selectorClass).find("div").remove();
            var obj = screens.analysis.chartdata;
            if ($(this).val() == 'Total Claim Count') {
                $("."+selectorClass).append('<div class="totalCliamCount" style="padding-bottom: 20px;height:300px;width:570px "> </div>');
                charts[jsonNodeChart]({
                    container: $('.totalCliamCount'),
                    value: obj[jsonNodeName].totalCliamCount,
                    title: obj[jsonNodeName].title,
                    categories: obj[jsonNodeName].categories,
                    yAxisTitle: obj[jsonNodeName].yAxisTitle
                });
            } else if ($(this).val() == 'Total Billed Amount') {

                $("."+selectorClass).append('<div class="totalBillAmount" style="padding-bottom: 20px;height:300px;width:570px "> </div>');
                charts[jsonNodeChart]({
                    container: $('.totalBillAmount'),
                    value: obj[jsonNodeName].totalBillAmount,
                    title: obj[jsonNodeName].title,
                    categories: obj[jsonNodeName].categories,
                    yAxisTitle: obj[jsonNodeName].yAxisTitle
                });
            } else if ($(this).val() == 'Total Paid Amount') {
                $("."+selectorClass).append('<div class="totalPaidAmount" style="padding-bottom: 20px;height:300px;width:570px "> </div>');
                charts[jsonNodeChart]({
                    container: $('.totalPaidAmount'),
                    value: obj[jsonNodeName].totalPaidAmount,
                    title: obj[jsonNodeName].title,
                    categories: obj[jsonNodeName].categories,
                    yAxisTitle: obj[jsonNodeName].yAxisTitle
                });
            }

        });
        $(".period").change(function() {
            grids.analysisSummaryGrid.gridDiv.jqGrid('GridUnload');
            grids.analysisSummaryGrid.gridDiv.jqGrid({rowNum: 30, sortname: 'hidden'}).trigger("reloadGrid");
            var peerValue = false;
            if(screens.analysis.currentIndex == 3){
            	peerValue = true;
            }
            grids.analysisSummaryGrid.initialize({
                gridDiv: "#cr_summary_workspace_grid",
                peer : peerValue,
                gridData: screens.analysis.chartdata.griddata.value[$(this).val()]
            });
            grids.analysisSummaryGrid.initialize({
                gridDiv: "#cr_summary_workspace_grid_peer",
                peer : peerValue,
                gridData: screens.analysis.chartdata.griddata.value[$(this).val()]
            });
        });
        $(".bottom_new_image_act").hide();
        $(".bottom_new_image").eq(0).hide();
        $(".bottom_new_image_act").eq(0).show();
        $('div.analysis_right_container_wrapper').hide();
        $('div.analysis_right_container_wrapper').eq(0).show();
        $('div.provider_analysis_header_buttons_div>div').click(function() {
            $('.provider_analysis_header_buttons_div>div').removeClass('selected');
            $(this).addClass('selected');
            $(".bottom_new_image").show();
            $(".bottom_new_image_act").hide();
            $(".bottom_new_image").eq($(this).index()).hide();
            $(".bottom_new_image_act").eq($(this).index()).show();
            $('div.analysis_right_container_wrapper').hide();
            $('div.analysis_right_container_wrapper').eq($(this).index()).show();
            screens.analysis.currentIndex = $(this).index();
            if ($(this).index() == 0 || $(this).index() == 3) {
                $("#flag_div").show();
            } else {
                $("#flag_div").hide();
            }
            
            if($(this).index() == 3){
        		var colPos = 1;
        		grids.analysisSummaryGrid.gridDiv.jqGrid('showCol', grids.analysisSummaryGrid.gridDiv.getGridParam("colModel")[colPos+1].name);
            }
            
            if ($(this).index() == 1) {
                var myLatLng = new google.maps.LatLng(screens.analysis.selectedProviderPatientDetails.geoCodeX, screens.analysis.selectedProviderPatientDetails.geoCodeY);
                var mapOptions = {
                    zoom: 11,
                    center: myLatLng,
                    disableDefaultUI: true,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };
                var map = new google.maps.Map(document.getElementById('map_container'), mapOptions);
                google.maps.event.trigger(map, "resize");
                //google.maps.event.trigger(map, "resize");
				screens.analysis.distance = 1;
				screens.analysis.daysToVisit = 30;
                lastCenter = map.getCenter();
                google.maps.event.trigger(map_container, 'resize');
                map.setCenter(lastCenter);
                var data = jQuery.extend({}, screens.analysis.selectedProviderPatientDetails);
                var data1 = jQuery.extend({}, screens.analysis.selectedProviderPatientDetails);
                var provArray = [];
                for (var i = 0; i < data.patientDetails.length; i++) {
                    var amount = parseInt(data.patientDetails[i].amount.substring(1));
                    var currDate = new Date();
                    var filterDate = currDate.setDate(currDate.getDate() - screens.analysis.daysToVisit);
                    //var distance = parseInt($("#slider-range2").slider("values", 0));
                    var dateArray = data.patientDetails[i].visit_date.split("-");
                    var newDate = new Date(dateArray[2], dateArray[1], dateArray[0]);
                    if (amount >= 0 && amount <= 500 && newDate >= filterDate && parseInt(data.patientDetails[i].distance) >= screens.analysis.distance) {
                        provArray.push(data.patientDetails[i]);
                    }
                }
                
                data1['patientDetails'] = provArray;
				$('#map_patient_count').text(provArray.length);
                screens.analysis.drawMapChart(data1);
            }
        });
       
        
        $("#slider-range").children("div").css("background", "#F2F2F2");
        $("#slider-range").children("a").css("background", "#A4A4A4");
        
        $("#slider-range1").children("a").css("background", "#A4A4A4");
        
        $("#amount").val("$" + $("#slider-range").slider("values", 0) + " - $" + $("#slider-range").slider("values", 1));
		$("#days").val("Past " + $("#slider-range1").slider("values", 0) + " days");

        $("#sort_provider_type").change(function() {
            screens.analysis.peerChartLabel = $(this).val();
            screens.analysis.peerChartComparision();

        });
    },
    drawMapChart: function(abc) {
    	screens.analysis.filteredMapArray = abc;
        // alert(selectedProviderPatientDetails);
        var image1 = 'common/images/Red Ball.png';
        var image2 = 'common/images/Green Ball.png';
        var image3 = 'common/images/Green Ball1.png';
        var image4 = 'common/images/Green Ball2.png';
        var image5 = 'common/images/Green Ball3.png';
        var image6 = 'common/images/Green Ball4.png';
        var data=[];
        var dataProvider = abc;
        
        var provArray = abc.patientDetails;
		var currDate = new Date();
		var filterDate = currDate.setDate(currDate.getDate() - screens.analysis.daysToVisit);
        var distance = parseInt(screens.analysis.distance);
        for (var j = 0; j < provArray.length; j++) {
            var dateArray = provArray[j].visit_date.split("-");
            var newDate = new Date(dateArray[2], dateArray[1], dateArray[0]);
            if (newDate >= filterDate && parseInt(provArray[j].distance) >= distance) {
                data.push(provArray[j]);
            }
        }
        
        $('#map_patient_count').text(data.length);
        var myLatLng = new google.maps.LatLng(dataProvider.geoCodeX, dataProvider.geoCodeY);
        var mapOptions = {
            zoom: 11,
            center: myLatLng,
            disableDefaultUI: true,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById('map_container'), mapOptions);
        google.maps.event.trigger(map, "resize");
        
          
        var contentString = '<div id="contentTootltip" style="width:250px;height:80px">' +
                //'<h1 id="firstHeading" class="firstHeading">Provider 1</h1>' +
                '<div id="bodyContent"><table><tr><td style="width:100px;font-weight:bold;font-family:Arial;font-size:12px;"><b>Provider Id</b>:</td><td>' + dataProvider.providerId + '</td></tr><tr><td\n\
        style="width:100px;font-weight:bold;font-family:Arial;font-size:12px;" ><b>Specialty</b>:</td><td>' + dataProvider.Specialty + '</td></tr><tr><td\n\
        style="width:100px;font-weight:bold;font-family:Arial;font-size:12px;"><b>Risk Amount</b>:</td><td>' + dataProvider.amount + '</td></tr></table>' +
                //'<b>Provider Id</b>:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;93847522<br><b>Specialty</b>:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Oncologist <br><b>Risk Amount</b>:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;$1459.' +
                '</div>' +
                '</div>';
        var infowindow = new google.maps.InfoWindow({
            content: contentString
        });
        var marker = new google.maps.Marker({
            position: myLatLng,
            map: map,
            // title: 'Provider 1: Patient sharing with provider 2 is 343.',
            icon: image1
        });
        google.maps.event.addListener(marker, 'mouseover', function() {
            infowindow.open(map, marker);
        });
        google.maps.event.addListener(marker, 'mouseout', function() {
            infowindow.close();
        });

        for (var i = 0; i < data.length; i++) {
            var myLatLng1 = new google.maps.LatLng(data[i].geoCodeX, data[i].geoCodeY);
            var contentString1 = '<div id="contentTootltip" style="width:300px;height:80px">' +
                    '<div id="bodyContent"><table><tr><td style="width:120px;font-weight:bold;font-family:Arial;font-size:12px;"><b>Patient Name</b>:</td><td>' + data[i].name + '</td></tr><tr><td\n\
        style="width:120px;font-weight:bold;font-family:Arial;font-size:12px;" ><b>Age</b>:</td><td>' + data[i].age + '</td></tr><tr><td\n\
        style="width:120px;font-weight:bold;font-family:Arial;font-size:12px;"><b>Claim Amount</b>:</td><td>' + data[i].amount + '</td></tr></table>' +
                    '</div>' +
                    '</div>';
            var infowindow1 = null;
            var marker1 = null;
            infowindow1 = new google.maps.InfoWindow({
                content: '<div id="contentTootltip" style="width:300px;height:80px">' +
                        '<div id="bodyContent"><table><tr><td style="width:120px;font-weight:bold;font-family:Arial;font-size:12px;"><b>Patient Name</b>:</td><td>' + data[i].name + '</td></tr><tr><td\n\
        style="width:120px;font-weight:bold;font-family:Arial;font-size:12px;" ><b>Age</b>:</td><td>' + data[i].age + '</td></tr><tr><td\n\
        style="width:120px;font-weight:bold;font-family:Arial;font-size:12px;"><b>Claim Amount</b>:</td><td>' + data[i].amount + '</td></tr></table>' +
                        '</div>' +
                        '</div>'
            });
            var image = "";
            var amount = parseInt(data[i].amount.substring(1));
            if (amount <= 50) {
                image = image6;
            } else if (amount > 50 && amount <= 100) {
                image = image5;
            } else if (amount > 100 && amount <= 150) {
                image = image4;
            } else if (amount > 150 && amount <= 200) {
                image = image3;
            } else {
                image = image2;
            }
            marker1 = new google.maps.Marker({
                position: myLatLng1,
                map: map,
                //title: 'Provider 1: Patient sharing with provider 2 is 343.',
                icon: image,
                zIndex: i + 1
            });
            bindInfoWindow(marker1, map, infowindow1, contentString1);
            var flightPlanCoordinates = [myLatLng, myLatLng1];
            var flightPath = new google.maps.Polyline({
                path: flightPlanCoordinates,
                strokeColor: '#FF0000',
                strokeWeight: 3
            });
            flightPath.setMap(map);
        }
        //google.maps.event.addDomListener(window, 'load', initialize);
        lastCenter = map.getCenter();
        google.maps.event.trigger(map_container, 'resize');
        map.setCenter(lastCenter);
    },
    drawAllChart: function(obj) {
//        charts.explorerBarChart({
//            container: $('.analysis_left_top_container'),
//            value: obj.barChart.value,
//            title: obj.barChart.title,
//            categories: obj.barChart.categories
//        });
        grids.analysisSummaryGrid.initialize({
            gridDiv: "#cr_summary_workspace_grid",
            peer: false,
            gridData: obj.griddata.value[3]
        });
        grids.analysisSummaryGrid.initialize({
            gridDiv: "#cr_summary_workspace_grid_peer",
            peer: false,
            gridData: obj.griddata.value[3]
        });
        charts.analysisLineChart({
            container: $('#lineChartDiv'),
            value: obj.lineChart.totalCliamCount,
            title: obj.lineChart.title,
            categories: obj.lineChart.categories,
            yAxisTitle: obj.lineChart.yAxisTitle
        });
        charts.analysisLineChart1({
            container: $('.analysis_left_bottom_container'),
            value: obj.lineChartComp.value,
            title: obj.lineChartComp.title,
            categories: obj.lineChartComp.categories,
            yAxisTitle: obj.lineChartComp.yAxisTitle
        });
        charts.explorerScatterChart({
            container: $('.analysis_right_bottom_container'),
            value: obj.scatterChart.value,
            title: obj.scatterChart.title,
            categories: obj.scatterChart.categories
        });

        charts.analysisLinePeerChart({
            container: $('#lineChartDivPeer'),
            value: obj.lineChartForPeer.totalCliamCount,
            title: obj.lineChartForPeer.title,
            categories: obj.lineChartForPeer.categories,
            yAxisTitle: obj.lineChartForPeer.yAxisTitle
        });
        charts.analysisLinePeerChart1({
            container: $('.analysis_left_bottom_container_peer'),
            value: obj.lineChartCompForPeer.value,
            title: obj.lineChartCompForPeer.title,
            categories: obj.lineChartCompForPeer.categories,
            yAxisTitle: obj.lineChartCompForPeer.yAxisTitle
        });

        charts.explorerScatterPeerChart({
            container: $('.analysis_right_bottom_container_peer'),
            value: obj.scatterChartForPeer.value,
            title: obj.scatterChartForPeer.title,
            categories: obj.scatterChartForPeer.categories
        });

//        charts.explorerPieChart({
//            container: $('.analysis_left_bottom_container'),
//            value: obj.pieChart.value,
//            title: obj.pieChart.title
//        });
//        charts.explorerBarChart({
//            container: $('.analysis_right_bottom_container'),
//            value: obj.barChartSecond.value,
//            title: obj.barChartSecond.title,
//            categories: obj.barChartSecond.categories
//        });

    },
    drawNetworkAnalysisChart: function() {

        var width = 960,
                height = 400;
        var cluster = d3.layout.cluster()
                .size([height, width - 160]);
        var diagonal = d3.svg.diagonal()
                .projection(function(d) {
                    return [d.y, d.x];
                });
        var svg = d3.select("#network_chart_wrapper").append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", "translate(40,0)");
        //log(globalobject.networkData);
        var root = JSON.parse(globalobject.networkData);
        //d3.json(, function(error, root) {
        var nodes = cluster.nodes(root),
                links = cluster.links(nodes);
        var link = svg.selectAll(".link")
                .data(links)
                .enter().append("path")
                .attr("class", "link")
                .attr("d", diagonal);
        var node = svg.selectAll(".node")
                .data(nodes)
                .enter().append("g")
                .attr("class", "node")
                .attr("transform", function(d) {
                    return "translate(" + d.y + "," + d.x + ")";
                });

        node.append("circle")
                .attr("r", 4.5);
        node.append("text")
                .attr("dx", function(d) {
                    return d.children ? -8 : 8;
                })
                .attr("dy", 3)
                .style("text-anchor", function(d) {
                    return d.children ? "end" : "start";
                })
                .text(function(d) {
                    return d.name;
                });
        //	});

        d3.select(self.frameElement).style("height", height + "px");
    },
    populateChordChart: function() {
		//log(this.selectedProviderRowData);
		//log(this.selectedProviderRowData.providerName);
        var selectedProviderId = screens.analysis.providerId;
		//log(selectedProviderId);
		//log(screens.analysis.providerName);
		//log(this.providerName);
        var selectedNetworkChordData = {};

        if (selectedProviderId != "" && selectedProviderId != undefined) {
            for (var j = 0; j < globalvars.networkChartData.length; j++) {
                if (selectedProviderId == globalvars.networkChartData[j].providerId) {
                    selectedNetworkChordData = globalvars.networkChartData[j].networkChordData;
                    break;
                }
            }
        }

        var showProviderIndex = 0;

        if (selectedNetworkChordData) {
            for (var i = 0; i < selectedNetworkChordData.networkChordLabelData.length; i++) {
                if (selectedNetworkChordData.networkChordLabelData[i].name == screens.analysis.providerName) {
                    showProviderIndex = i;
                    break;
                }

            }
        }

		//log(showProviderIndex);




        var matrix_data = selectedNetworkChordData.provider_matirx;
        var labels_data = selectedNetworkChordData.networkChordLabelData;
        var formatPercent = d3.format("r");

        showSelectedChord(showProviderIndex);


        var chord1;
        var w;
        var fill;
        var arc;
        var svg;
        var group;
        var ticks;
        var counter;

        function showSelectedChord(showProviderIndex) {

        	$('#chord_chart').empty();

        	 var chord = d3.layout.chord()
             .padding(.05)
             .sortSubgroups(d3.ascending)
             .matrix(matrix_data);



     w = 680,
             h = 700,
             r0 = Math.min(w, h) * .31,
             r1 = r0 * 1.1;

     fill = d3.scale.category20c();


     arc = d3.svg.arc()
             .innerRadius(r0)
             .outerRadius(r0 + 20);

     svg = d3.select("#chord_chart")
             .append("svg:svg")
             .attr("width", w)
             .attr("height", h)
             .attr("id", "circle")
             .append("svg:g")
             .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")");




     group = svg.append("svg:g")
             .selectAll("path")
             .data(chord.groups)
             .enter().append("svg:path")
             .style("stroke", function(d) {
                 return fill(d.index);
             })
             .style("fill", function(d) {
                 return fill(d.index);
             })
             .attr("d", arc)
             //.on("mouseover", mouseover)
             .on('click', function(d) {
                 showSelectedChord(d.index);
             });





     ticks = svg.append("svg:g")
             .selectAll("g")
             .data(chord.groups)
             .enter().append("svg:g")
             .selectAll("g")
             .data(groupTicks)
             .enter().append("svg:g")
             .attr("transform", function(d) {
                 return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
                         + "translate(" + r1 + ",0)";
             });

     ticks.append("svg:line")
             .attr("x1", 1)
             .attr("y1", 0)
             .attr("x2", 5)
             .attr("y2", 0)
             .style("stroke", "#000");

     ticks.append("svg:title").text(function(d, i) {
         return "test of origins";
     });



     counter = -1;

     ticks.append("svg:text")
             .attr("x", 8)
             .attr("dy", ".35em")
             .attr("text-anchor", function(d) {
                 return d.angle > Math.PI ? "end" : null;
             })
             .attr("transform", function(d) {
                 return d.angle > Math.PI ? "rotate(180)translate(-16)" : null;
             })
             .style("stroke", "000000")
             .text(function(d) {
                 counter++;
                 return labels_data[counter].name;
             });


     // this is for connection lines betw

     var div = d3.select("body").append("div")
             .attr("class", "tooltip")
             .style("opacity", 0);

            chord1 = svg.append("svg:g")
                    .attr("class", "chord")
                    .selectAll("path")
                    .data(chord.chords)
                    .enter().append("svg:path")
                    .style("stroke", function(d) {
                        return d3.rgb(fill(d.source.index)).darker();
                    })
                    .style("fill", function(d) {
                        return fill(d.source.index);
                    })
                    .attr("d", d3.svg.chord().radius(r0))
                    //.style("opacity", 1)
                    //.on('click', onClick)
                    .style("opacity", function(d) {
                        if (d.source.index == showProviderIndex)
                            return 1;
                        else
                            return 0;
                    })
                    .on("mouseover", function(d, i, datam) {
                    	if (d.source.index == showProviderIndex){

                        div.transition()
                                .duration(200)
                                .style("opacity", .9);
                        div.html("<b>Referring Physician: </b>" + labels_data[d.source.index].name
                                + "<br><b>Performing Physician: </b>" + labels_data[d.target.index].name
                                + "<br><b>Claim Amount: </b>" + formatPercent(labels_data[d.target.index].claim_amount)
                                + "<br><b>Total Claims: </b>" + formatPercent(labels_data[d.target.index].total_claim)
                                + "<br><b>Risk Score: </b>" + formatPercent(labels_data[d.target.index].risk_score)
                                )
                                .style("left", (d3.event.pageX) + "px")
                                .style("top", (d3.event.pageY - 28) + "px");
                    	}

                    })
                    .on("mousemove", function(d, i, datam) {
                        //log(d.toSource());
                    	if (d.source.index == showProviderIndex){
                        div.transition()
                                .duration(200)
                                .style("opacity", .9);
                        div.html("<b>Referring Physician: </b>" + labels_data[d.source.index].name
                                + "<br><b>Performing Physician: </b>" + labels_data[d.target.index].name
                                + "<br><b>Claim Amount: </b>" + formatPercent(labels_data[d.target.index].claim_amount)
                                + "<br><b>Total Claims: </b>" + formatPercent(labels_data[d.target.index].total_claim)
                                + "<br><b>Risk Score: </b>" + formatPercent(labels_data[d.target.index].risk_score)
                                )
                                .style("left", (d3.event.pageX) + "px")
                                .style("top", (d3.event.pageY - 28) + "px");
                    	}
                    })
                    .on("mouseout", function(d, i, datam) {
                        div.transition()
                                .duration(500)
                                .style("opacity", 0);
                    });
        }



        /** Returns an array of tick angles and labels, given a group.*/
        function groupTicks(d) {
            var i = 0;

            var k = (d.endAngle - d.startAngle) / d.value;
            return d3.range(0, d.value, 1000).map(function(v, i) {
                return {
                    angle: v * k + d.startAngle,
                };
                i++;
            });
        }


        function showFirst(opacity) {

            return function(g, i) {
                svg.selectAll("g.chord path")
                        .filter(function(d) {

//        	          if(state == "show"){
//        	        	  log(labels_data[i] + ":::::::::::::::" + matrix_data[i]);
//        	        	  //log("color:::::::" + fill(i));
//        	          		//console.log(d3.select(this).text());
//        	          }

                            return d.source.index != 0 && d.target.index != 0;
                        })
                        .transition()
                        .style("stroke-opacity", opacity)
                        .style("opacity", opacity);

            };

        }

        /** Returns an event handler for fading a given chord group. */
        function fade(opacity) {
            return function(g, i) {
                svg.selectAll("g.chord path")
                        .filter(function(d) {

//    	          if(state == "show"){
//    	        	  log(labels_data[i] + ":::::::::::::::" + matrix_data[i]);
//    	        	  //log("color:::::::" + fill(i));
//    	          		//console.log(d3.select(this).text());
//    	          }

                            return d.source.index != i && d.target.index != i;
                        })
                        .transition()
                        .style("stroke-opacity", opacity)
                        .style("opacity", opacity);

            };
        }

        function mouseover(d, i) {
            chord1.classed("fade", function(p) {
                //log("i:::::::" + i);
                return p.source.index != i
                        && p.target.index != i;
            });
        }


        function onClick(d, i)
        {
            log("Source:" + labels_data[d.source.index] + ":->"
                    + ":" + formatPercent(d.source.value) + "\n"
                    + "Target:" + labels_data[d.target.index] + ":->"
                    + ":" + formatPercent(d.target.value));


            $('#source_value_chord').text(labels_data[d.source.index]);
            $('#target_value_chord').text(labels_data[d.target.index]);
            $('#source_value_chord_percent').text(formatPercent(d.source.value));
            $('#target_value_chord_percent').text(formatPercent(d.target.value));
            $('#chord_dg').css('background-color', 'transparent');
            $('#chord_dg').css('background-color', fill(d.source.index));
            $('#chord_dg').css('color', '#FFFFFF');

            $('#chord_dg').show();
            $('#chord_dg_label').show();

            onClickGroupChord(d.source.index);
        }


        function onClickGroup(d, i) {


            $('#chord_dg').hide();
            $('#chord_dg_label').hide();
            $('#group_provider_name').text(labels_data[i]);
            var selectedGroupData = matrix_data[i];
            var totalNetwork = 0;
            var totalTransation = 0;

            var groupObj = {};
            $('#chord_dg_group tr#dynamic_add').remove();

            if (selectedGroupData != undefined) {
                for (var i = 0; i < selectedGroupData.length; i++) {

                    if (selectedGroupData[i] > 0)
                    {
                        totalNetwork++;
                        totalTransation += selectedGroupData[i];
                        groupObj.name = labels_data[i];
                        groupObj.value = selectedGroupData[i];
                        $('#chord_dg_group').append($.nano(screens.analysis.chord_group_temp, groupObj));
                    }

                }
            }


            $('#group_provider_total_transaction').text(totalTransation);
            $('#group_provider_total_network').text(totalNetwork);
            $('#group_provider_dollor_affected').text("$" + numberWithCommasToInt(totalTransation * totalNetwork * 100 / .45));

            $('#chord_dg_group').css('background-color', fill(d.index));
            $('#chord_dg_group').css('color', '#FFFFFF');

        }


        function onClickGroupChord(index) {


            $('#group_provider_name').text(labels_data[index]);
            var selectedGroupData = matrix_data[index];
            var totalNetwork = 0;
            var totalTransation = 0;

            var groupObj = {};
            $('#chord_dg_group tr#dynamic_add').remove();

            if (selectedGroupData != undefined) {
                for (var i = 0; i < selectedGroupData.length; i++) {

                    if (selectedGroupData[i] > 0)
                    {
                        totalNetwork++;
                        totalTransation += selectedGroupData[i];
                        groupObj.name = labels_data[i];
                        groupObj.value = selectedGroupData[i];
                        $('#chord_dg_group').append($.nano(screens.analysis.chord_group_temp, groupObj));
                    }

                }
            }


            $('#group_provider_total_transaction').text(totalTransation);
            $('#group_provider_total_network').text(totalNetwork);
            $('#group_provider_dollor_affected').text("$" + numberWithCommasToInt(totalTransation * totalNetwork * 100 / .45));

            $('#chord_dg_group').css('background-color', fill(index));
            $('#chord_dg_group').css('color', '#FFFFFF');

        }


    },
    populateChordHeatMapChart: function() {

    	 var networkHeatMapPhysicianChartData = globalvars.networkHeatMapPhysicianChartData;
         var refPhysicianList = networkHeatMapPhysicianChartData.mapRefPhysician;
         var perPhysicianList = networkHeatMapPhysicianChartData.mapPerPhysician;

        var selectedProviderId = screens.analysis.providerId;
        var selectedHeatMapData = {};

        if (selectedProviderId != "" && selectedProviderId != undefined) {
            for (var j = 0; j < globalvars.networkHeatMapChartData.length; j++) {
                if (selectedProviderId == globalvars.networkHeatMapChartData[j].providerId) {
                    selectedHeatMapData = globalvars.networkHeatMapChartData[j];
                    break;
                }
            }
        }



        var findRow;
		var findColumn;

		for(var i=0; i<refPhysicianList.length;i++){
			if(refPhysicianList[i]== selectedHeatMapData.providerName){
				findRow = i;
				break;
			}
		}

		for(var i=0; i<perPhysicianList.length;i++){
			if(perPhysicianList[i]== selectedHeatMapData.providerName){
				findColumn = i;
				break;
			}
		}

		//console.log("find row::::" + findRow + "findColumn::::" + findColumn + "::::::" + selectedHeatMapData.providerName);

		var rowIndex =0;
		var dataArray = [];
		for(var m=0; m<8;m++){
			var columIndex=0;
			for(var n=0; n<12;n++){
				var obj = new Object();
				obj.value = 0;
				obj.day = m+1;
				obj.hour = n+1;
				if(m == findRow && rowIndex < 12){
				 	obj.value = selectedHeatMapData.risk_score_matrix_pef[rowIndex];
				 	rowIndex++;
				}
				else{
					obj.value = parseInt(selectedHeatMapData.risk_score_matrix_pef[columIndex] * .65 + ((((m+1)*(n+1))%7) * 4));
					columIndex++;
				}

//				if(n == findColumn){
//					obj.value = selectedHeatMapData.risk_score_matrix_ref[columIndex]
//					columIndex++;
//				}
				dataArray.push(obj);
			}
		}

		var margin = { top: 50, right: 0, bottom: 100, left: 30 },
        width = 1000 - margin.left - margin.right,
        height = 520 - margin.top - margin.bottom,
        gridSize = Math.floor(width / 10),
        legendElementWidth = gridSize*2,
        buckets = 9,
        //colors = ["#909090","#84CC1F","#FDB700","#FF0000"], // alternatively colorbrewer.YlGnBu[9]
		colors = ["#1F4591","#217C9D","#23A996","#25B467","#27C02F","#61CB28","#ABD72A","#E2C72B","#EE832C","#F9362D"],
        legendData=["low traffic","", "","","","","","","","high traffic"],
        days = networkHeatMapPhysicianChartData.mapRefPhysician,//["John Smith", "John Smith john", "John Smith", "John Smith", "John Smith", "John Smith", "John Smith"],
        times = networkHeatMapPhysicianChartData.mapPerPhysician;//["John Smith", "John Smith", "John Smith", "John Smith", "John Smith", "John Smith"];

		var colorScale = d3.scale.threshold()
	   .domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
	   .range([0].concat(colors));

		var svg = d3.select("#matrixView").append("svg")
		  .attr("width", width + margin.left + margin.right)
		  .attr("height", height + margin.top + margin.bottom)
		  .append("g")
		      .attr("transform", "translate(" + margin.left*6 + "," + margin.top + ")");

		var dayLabels = svg.selectAll(".dayLabel")
		  .data(days)
		  .enter().append("text")
		  .text(function (d) { return d; })
		  .attr("x", 0)
		  .attr("y", function (d, i) { return i * gridSize/1.9; })
		  .style("text-anchor", "right")
		  .attr("transform", "translate(-100," + gridSize / 5 + ")")
		  .attr("class", function (d, i) { return ((i==findRow) ? "dayLabel mono axis axis-workweek-bold" : "dayLabel mono axis axis-workweek"); });
		  //.attr("class", function (d, i) { return "dayLabel mono axis axis-workweek"; });

		var timeLabels = svg.selectAll(".timeLabel")
		  .data(times)
		  .enter().append("text")
		  .text(function(d) { return d; })
		  .attr("x", function(d, i) { return i * gridSize/1.9; })
		  .attr("y", function(d, i) { return i * 30 - 4;})
		  .style("text-anchor", "middle")
		  //.style("font-weight", "bold")
		  .attr("transform", "translate(" + gridSize / 2 + ", -20)rotate(-30)")
		  //.attr("class", function(d, i) { return ((i >= 7 && i <= 16) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis"); });
		  .attr("class", function(d, i) { return "timeLabel mono axis axis-worktime"; });

		var heatMap = svg.selectAll(".hour")
		  .data(dataArray)
		  .enter().append("rect")
		  .attr("x", function(d) { return (d.hour - 1) * (gridSize*.6)})
		  .attr("y", function(d) { return (d.day - 1) * (gridSize/2); })
		  .attr("rx", 4)
		  .attr("ry", 4)
		  .attr("class", "bordered")
		  .attr("width", gridSize*.6)
		  .attr("height", gridSize/2)

		  //.style("fill", colors[0])
		  .style("fill", function(d){
		  	if(d.value > 0 && d.value <=10)
		  		return '#1F4591';
		  	else if(d.value > 10 && d.value <=20)
		  		return '#217C9D';
			else if(d.value > 20 && d.value <=30)
		  		return '#23A996';
			else if(d.value > 30 && d.value <=40)
		  		return '#25B467';
			else if(d.value > 40 && d.value <=50)
		  		return '#27C02F';
			else if(d.value > 50 && d.value <=60)
		  		return '#61CB28';
			else if(d.value > 60 && d.value <=70)
		  		return '#ABD72A';
			else if(d.value > 70 && d.value <=80)
		  		return '#E2C72B';
			else if(d.value > 80 && d.value <=90)
		  		return '#EE832C';
		  	else
		  		return '#F9362D';
		  })
		  .on("mouseover", function(d){
		      d3.select(this).attr("class","bordered-active");
		      this.parentNode.appendChild(this);
		  })
		   .on("mouseout", function(d){
		      d3.select(this).attr("class","bordered");
		      this.parentNode.appendChild(this);
		  });

		  heatMap.append("text")
		  .attr("class", "mono")
		  .text(function(d) {d.value;})
		  .attr("x", function(d) { return (d.hour - 1) * (gridSize*.6)})
		  .attr("y", function(d) { return (d.day - 1) * (gridSize/2); })





		//   heatMap.transition().duration(1000)
		//   .style("fill", function(d) { return colorScale(d.value); });

		  heatMap.append("title").text(function(d) { return "Risk Score: " + d.value });


		  var legend = svg.selectAll(".legend")
		    .data(colorScale.domain(), function(d) { return d; })
		    .enter().append("g")
		    .attr("class", "legend");

			legend.append("rect")
			    .attr("x", function(d, i) { return (legendElementWidth/6) * i + 374; })
			    .attr("y", height+60)
			    .attr("width", legendElementWidth/6)
			    .attr("height", gridSize / 6)
			    .style("fill", function(d, i) { return colors[i]; });

			legend.append("text")
		    .attr("class", "mono")
		    .text(function(d,i) { return legendData[i]; })
		    .attr("x", function(d, i) { return ((i==0) ? ((legendElementWidth/6) * i + 374) : ((legendElementWidth/6) * i + 350)); })
			.attr("y", height + 90);


//        if (refPhysicianList != null) {
//
//            row = $('<tr><th></th></tr>');
//            for (var i = 0; i < refPhysicianList.length; i++) {
//                var row1 = $('<th></th>').text(refPhysicianList[i]);
//                row.append(row1);
//            }
//            $('#matrixView').append(row);
//
//
//            if (perPhysicianList != null) {
//                log("test");
//                var row;
//                for (var j = 0; j < perPhysicianList.length; j++) {
//                    row = $('<tr><td style="height:30px;vertical-align:middle">' + perPhysicianList[j] + '</td></tr>');
//
//                    for (var i = 0; i < refPhysicianList.length; i++) {
//                        var row1 = $('<td></td>').addClass('bg_grey');
//                        row.append(row1);
//                    }
//
//                    $('#matrixView').append(row);
//                }
//
//
//            }
//
//            var colorArray_ref = selectedHeatMapData.risk_score_matrix_ref;
//            var colorArray_pef = selectedHeatMapData.risk_score_matrix_pef;
//            var refPhysicianName = selectedHeatMapData.providerName;
//
//            var selectedIndex;
//            var findPhysician = $('#matrixView tr').eq(0);
//
//            $(findPhysician).find('th').each(function(index) {
//
//                if (refPhysicianName == $(this).text())
//                    selectedIndex = index;
//            });
//
//            $('#matrixView tr').each(function(index) {
//                log("test");
//                $(this).find('td').eq(selectedIndex).removeClass('bg_grey');
//                $(this).find('td').eq(selectedIndex).addClass(showColorCode(colorArray_ref[index - 1]));
//                $(this).find('td').eq(selectedIndex).attr('title', "Risk Score: " + colorArray_ref[index - 1]);
//            });
//
//            var selectedRow = $('#matrixView tr').eq(selectedIndex);
//
//            $(selectedRow).find('td').each(function(index) {
//                if ($(this).text() == "") {
//                    $(this).removeClass('bg_grey');
//                    $(this).addClass(showColorCode(colorArray_pef[index - 1]));
//                    $(this).attr('title', "Risk Score: " + colorArray_pef[index - 1]);
//                }
//            });
//
//
//
//        }
//
//
//
//        function showColorCode(code) {
//            if (code > 0 && code <= 50)
//                return "bg_green";
//            else if (code > 50 && code <= 80)
//                return "bg_orange";
//            else
//                return "bg_red";
//        }








    },
    peerChartComparision: function(data) {

        $('#peerChart').empty();
        var selectedProviderId = screens.analysis.providerId;

        var selectedPeerChartData = {};
        var nationalAverageList = [];
        var regionalAverageList = [];
        if (selectedProviderId != "" && selectedProviderId != undefined) {
            for (var j = 0; j < globalvars.peerLineChartDataNew.length; j++) {
                if (selectedProviderId == globalvars.peerLineChartDataNew[j].providerId) {
                    selectedPeerChartData = globalvars.peerLineChartDataNew[j];
                    break;
                }
            }
        }

        var xAxisData = [];
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        var current_date = new Date();
        for (var i = 0; i < 12; i++) {
            var past = new Date(current_date.setMonth(current_date.getMonth() - 1));
            month_value = past.getMonth();
            xAxisData.push(months[month_value] + "-" + past.getFullYear());
            if (screens.analysis.peerChartLabel == "claim_count") {
                nationalAverageList.push(selectedPeerChartData.national_average_count);
                regionalAverageList.push(selectedPeerChartData.regional_average_count);
            }
            else {
                nationalAverageList.push(selectedPeerChartData.national_average_amount);
                regionalAverageList.push(selectedPeerChartData.regional_average_amount);
            }
        }
        xAxisData.reverse();



        charts.peerLineChart({
            container: $('#peerChart'),
            xAxisData: xAxisData,
            barChartData: selectedPeerChartData[screens.analysis.peerChartLabel],
            nationalAverageList: nationalAverageList,
            regionalAverageList: regionalAverageList,
            yAxisLabel: $("#sort_provider_type option:selected").text()

        });
    }
};
function bindInfoWindow(marker, map, infowindow, strDescription) {
    google.maps.event.addListener(marker, 'mouseover', function() {
        infowindow.setContent(strDescription);
        infowindow.open(map, marker);
    });
    google.maps.event.addListener(marker, 'mouseout', function() {
        infowindow.close();
    });
}

