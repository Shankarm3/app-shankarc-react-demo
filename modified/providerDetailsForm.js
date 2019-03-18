screens.providerDetailsForm = {
    providerId: "",
    providerIndexId: null,
    providerName: "",
    backScreen: "",
    gridState: "collapse",
    selectedProviderRowData: null,
    selectedProviderPatientDetails: null,
    chord_group_temp: "",
    peerChartData: null,
    peerChartLabel: "claim_count",
    filteredMapArray: [],
    providerforwardComment: "",
    distance: 1,
    daysToVisit: 30,
    labelType: null,
    useGradients: null,
    nativeTextSupport: null,
    animate: null,
    initialize: function(param) {
        //log(param.rowData[param.id -1].toSource());
        this.providerIndexId = param.id;
        this.selectedProviderRowData = param.rowData[param.id - 1];
        this.providerId = this.selectedProviderRowData.provider;
        this.providerName = this.selectedProviderRowData.provider_Name;
        this.backScreen = param.backScreen;
        screens.providerDetailsForm.drawScreen(param.id, param.rowData);
        screens.providerDetailsForm.networkForceDirectedChart();
        screens.providerDetailsForm.drawNetworkAnalysisChart();
        screens.providerDetailsForm.populateChordChart();
        screens.providerDetailsForm.networkForceChart();
        screens.providerDetailsForm.populateChordHeatMapChart();
        //$("#map_container").empty();
        screens.providerDetailsForm.drawMapChart(this.selectedProviderPatientDetails);
        screens.providerDetailsForm.peerChartComparision(peerChartData);
        screens.providerDetailsForm.bindFunctionality();
        $(".provider_source").html(this.selectedProviderRowData.source);
        $(".scoring_period").html(this.selectedProviderRowData.scoring_period);
        $(".provider_paid_amount_value").html(this.selectedProviderRowData.risk_amount);
        this.backScreen = param.backScreen;
    },
    drawScreen: function(id, rowData, screenName) {
        var selectedProviderDetail = {};
        if (globalvars.providerDataArrayViewArray) {
            for (var i = 0; i < globalvars.providerDataArrayViewArray.length; i++)
            {
                if (screens.providerDetailsForm.providerId == globalvars.providerDataArrayViewArray[i].providerId) {
                    selectedProviderDetail = globalvars.providerDataArrayViewArray[i];
                    break;
                }

            }
        }
        if (globalvars.providerPatientDetails) {
            for (var i = 0; i < globalvars.providerPatientDetails.length; i++)
            {
                if (screens.providerDetailsForm.providerId == globalvars.providerPatientDetails[i].providerId) {
                    screens.providerDetailsForm.selectedProviderPatientDetails = globalvars.providerPatientDetails[i];
                    break;
                }

            }
        }
        if (globalvars.peerLineChartData) {
            for (var i = 0; i < globalvars.peerLineChartData.length; i++)
            {
                if (screens.providerDetailsForm.providerId == globalvars.peerLineChartData[i].providerId) {
                    peerChartData = globalvars.peerLineChartData[i];
                    break;
                }

            }
        }

        var selectedExplorerData = {claimed_amount:"", paid_amount:""};
        
        for (var i = 0; i < globalvars.explorerChartData1.length; i++) {
            if (screens.providerDetailsForm.providerId == globalvars.explorerChartData1[i].providerId) {
            	selectedExplorerData = globalvars.explorerChartData1[i]["griddata"]["value"][3];
            	selectedProviderDetail.claimed_amount = selectedExplorerData[1].providerValue; 
            	selectedProviderDetail.paid_amount = selectedExplorerData[2].providerValue;
                break;
            }
        }
        
        getSYNC('common/templates/provider_forward_template.html', function(data) {
            screens.providerDetailsForm.providerforwardComment = data;
        });
        //console.log(selectedProviderDetail);
        getSYNC('common/templates/screens/providerDetailsForm.html', function(data) {
            //log('loading providerDetailsForm template');
            globalvars.$contentcontainer.append($.nano(data, jQuery.extend(true, {}, selectedProviderDetail, globalvars.localResourceMap)));
        });

        getSYNC('common/templates/chord_group_list_template.html', function(data) {
            screens.providerDetailsForm.chord_group_temp = data;
        });


        charts.providerDetailsGuageChart({
            container: $("#risk_guage_chart_wrapper"),
            value: selectedProviderDetail.risk_score
        });
        grids.providerFormClaimData.initialize({
            gridDiv: $("#provider_form_claim_tab_table"),
            formProvider: "provider",
            onClick: function(id) {

            }
        });
        $("#tabs").tabs();
        getSYNC('common/templates/screens/provider_risk_table_case.html', function(data) {
            for (var j = 0; j < globalvars.providerRiskTableCase.length; j++) {
                $('table#provider_risk_table_case tbody').append($.nano(data, globalvars.providerRiskTableCase[j]));
            }
        });
        getSYNC('common/templates/screens/provider_risk_table_reason.html', function(data) {
            for (var j = 0; j < globalvars.providerRiskTableReason.length; j++) {
                $('table#provider_risk_table_reasons tbody').append($.nano(data, globalvars.providerRiskTableReason[j]));
            }
        });
        $("#slider-range").slider({
            range: true,
            min: 0,
            max: 1000,
            values: [0, 500],
            slide: function(event, ui) {
                var data = jQuery.extend({}, screens.providerDetailsForm.selectedProviderPatientDetails);
                var data1 = jQuery.extend({}, screens.providerDetailsForm.selectedProviderPatientDetails);
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
                screens.providerDetailsForm.drawMapChart(data1);
            }
        });
        $("#slider-range1").slider({
            range: false,
            min: 0,
            max: 100,
            values: [30],
            slide: function(event, ui) {
                $("#days").val("Past " + (ui.values[ 0 ]) + " days");
                screens.providerDetailsForm.daysToVisit = parseInt(ui.values[0]);
                screens.providerDetailsForm.drawMapChart(screens.providerDetailsForm.filteredMapArray);

            }
        });
        $("#slider-range2").slider({
            range: false,
            min: 0,
            max: 40,
            values: [1],
            slide: function(event, ui) {
                $("#distance").val(" " + (ui.values[ 0 ]) + " mi");
                screens.providerDetailsForm.distance = ui.values[ 0 ];
                screens.providerDetailsForm.drawMapChart(screens.providerDetailsForm.filteredMapArray);
            }
        });
        $("#slider-range").children("div").css("background", "#F2F2F2");
        $("#slider-range").children("a").css("background", "#A4A4A4");

        $("#slider-range1").children("a").css("background", "#A4A4A4");
        $("#slider-range2").children("a").css("background", "#A4A4A4");
        $("#amount").val("$" + $("#slider-range").slider("values", 0) + " - $" + $("#slider-range").slider("values", 1));
        $("#days").val("Past " + $("#slider-range1").slider("values", 0) + " days");
        $("#distance").val(" " + $("#slider-range2").slider("values", 0) + " mi");
    },
    bindFunctionality: function() {

        $("#back_provider_detail_img").bind("click", function() {
            screens.providerDetailsForm.closeproviderDetails();
        });
        $("#back_provider_detail_label").bind("click", function() {
            screens.providerDetailsForm.closeproviderDetails();
        });
        $('.claim_arrow_right').click(function() {
            $('.display_content_claim').toggleClass('display_content_claim_show');
        });
        $('#create_case').click(function() {
        	var fromPage = "provider";
            dialogs.createCaseDialog.open(fromPage);
        });
        $('#release_provider').click(function() {
            dialogs.releaseProviderDialog.open();
        });
        $(document).on("click", "label.expand_view_style", function() {
            var id = $(this).parent().parent().attr('id');
            //console.log(id);
            if (screens.providerDetailsForm.gridState == "collapse") {
                $('#p_' + id + '_t').css('height', 'auto');
                grids.providerFormClaimSubGridData.gridDiv.jqGrid('setGridHeight', 'auto');
                screens.providerDetailsForm.gridState = "expand";
                $('#' + id + '_t_label').text("Collapse to view less");
            }
            else {
                $('#p_' + id + '_t').css('height', '130px');
                grids.providerFormClaimSubGridData.gridDiv.jqGrid('setGridHeight', 85);
                screens.providerDetailsForm.gridState = "collapse";
                $('#' + id + '_t_label').text("Expand to view more");
            }
        });
        $(".bottom_new_image_act").hide();
        $(".bottom_new_image").eq(0).hide();
        $(".bottom_new_image_act").eq(0).show();
        $('.provider_analysis_header_buttons_div>div').click(function() {
            $('.provider_analysis_header_buttons_div>div').removeClass('selected');
            $(this).addClass('selected');
            //alert($(this).attr('id'));
            var id = $(this).attr('id');
            $(".bottom_new_image").show();
            $(".bottom_new_image_act").hide();
            $(".bottom_new_image").eq($(this).index()).hide();
            $(".bottom_new_image_act").eq($(this).index()).show();
            //log($(this).index());
            $('#provider_analysis_tab_content>div').hide();
            $('#provider_analysis_tab_content>div').eq($(this).index()).show();



        });
        $("#forward_provider").click(function() {
            // dialogs.messageDialog.show({"text": "Provider has been forwarded Successfully!"});
            var provider = {};
            provider.providerId = screens.providerDetailsForm.providerId;
            $('#provider_forward_wrapper .claim_decline_row').remove();
            $('#provider_forward_wrapper').append($.nano(screens.providerDetailsForm.providerforwardComment, provider));
            dialogs.providerForwardDialog.open({"refreshView": "forward"});
        });
        $("#link_case").click(function() {
            dialogs.messageDialog.show({"text": "Provider has been linked Successfully!"});
        });


        $("#sort_provider_type").change(function() {
            screens.providerDetailsForm.peerChartLabel = $(this).val();
            screens.providerDetailsForm.peerChartComparision();

        });



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
    drawMapChart: function(abc) {
        screens.providerDetailsForm.filteredMapArray = abc;
        // alert(selectedProviderPatientDetails);
        var image1 = 'common/images/Red Ball.png';
        var image2 = 'common/images/Green Ball.png';
        var image3 = 'common/images/Green Ball1.png';
        var image4 = 'common/images/Green Ball2.png';
        var image5 = 'common/images/Green Ball3.png';
        var image6 = 'common/images/Green Ball4.png';
        var data = [];
        var dataProvider = abc;

        var currDate = new Date();
        var filterDate = currDate.setDate(currDate.getDate() - screens.providerDetailsForm.daysToVisit);
        var distance = parseInt(screens.providerDetailsForm.distance);

        var provArray = abc.patientDetails;
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
            zoom: 10,
            center: myLatLng,
            disableDefaultUI: true,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById('map_container'), mapOptions);
        google.maps.event.trigger(map, "resize");
        jQuery('#tabs,#map_container').tabs({
            activate: function(event, ui) {
                //google.maps.event.trigger(map, "resize");
                screens.providerDetailsForm.distance = 1;
                screens.providerDetailsForm.daysToVisit = 30;
                lastCenter = map.getCenter();
                google.maps.event.trigger(map_container, 'resize');
                map.setCenter(lastCenter);
                var data = jQuery.extend({}, screens.providerDetailsForm.selectedProviderPatientDetails);
                var data1 = jQuery.extend({}, screens.providerDetailsForm.selectedProviderPatientDetails);
                var provArray = [];
                for (var i = 0; i < data.patientDetails.length; i++) {
                    var amount = parseInt(data.patientDetails[i].amount.substring(1));
                    var currDate = new Date();
                    var filterDate = currDate.setDate(currDate.getDate() - screens.providerDetailsForm.daysToVisit);
                    //var distance = parseInt($("#slider-range2").slider("values", 0));
                    var dateArray = data.patientDetails[i].visit_date.split("-");
                    var newDate = new Date(dateArray[2], dateArray[1], dateArray[0]);
                    if (amount >= 0 && amount <= 500 && newDate >= filterDate && parseInt(data.patientDetails[i].distance) >= screens.providerDetailsForm.distance) {
                        provArray.push(data.patientDetails[i]);
                    }
                }
                // console.log(provArray);
                data1['patientDetails'] = provArray;
                // $("#amount").val("$" + 0 + " - $" + 500);
                $('#map_patient_count').text(provArray.length);
                screens.providerDetailsForm.drawMapChart(data1);
            }
        });


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

    },
    closeproviderDetails: function() {
        app.screenManager.showScreen(this.backScreen);
    },
    populateChordChart: function() {

        var selectedProviderId = screens.providerDetailsForm.providerId;
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
                if (selectedNetworkChordData.networkChordLabelData[i].name == screens.providerDetailsForm.providerName) {
                    showProviderIndex = i;
                    break;
                }

            }
        }






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
                        if (d.source.index == showProviderIndex) {

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
                        if (d.source.index == showProviderIndex) {
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
                        $('#chord_dg_group').append($.nano(screens.memberDetailsForm.chord_group_temp, groupObj));
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
                        $('#chord_dg_group').append($.nano(screens.memberDetailsForm.chord_group_temp, groupObj));
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

        var selectedProviderId = screens.providerDetailsForm.providerId;

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

        for (var i = 0; i < refPhysicianList.length; i++) {
            if (refPhysicianList[i] == selectedHeatMapData.providerName) {
                findRow = i;
                break;
            }
        }

        for (var i = 0; i < perPhysicianList.length; i++) {
            if (perPhysicianList[i] == selectedHeatMapData.providerName) {
                findColumn = i;
                break;
            }
        }

        //console.log("find row::::" + findRow + "findColumn::::" + findColumn + "::::::" + selectedHeatMapData.providerName);

        var rowIndex = 0;
        var dataArray = [];
        for (var m = 0; m < 8; m++) {
            var columIndex = 0;
            for (var n = 0; n < 12; n++) {
                var obj = new Object();
                obj.value = 0;
                obj.day = m + 1;
                obj.hour = n + 1;
                if (m == findRow && rowIndex < 12) {
                    obj.value = selectedHeatMapData.risk_score_matrix_pef[rowIndex];
                    rowIndex++;
                }
                else {
                    obj.value = parseInt(selectedHeatMapData.risk_score_matrix_pef[columIndex] * .65 + ((((m + 1) * (n + 1)) % 7) * 4));
                    columIndex++;
                }

//				if(n == findColumn){
//					obj.value = selectedHeatMapData.risk_score_matrix_ref[columIndex]
//					columIndex++;
//				}
                dataArray.push(obj);
            }
        }

        var margin = {top: 50, right: 0, bottom: 100, left: 30},
        width = 1000 - margin.left - margin.right,
                height = 520 - margin.top - margin.bottom,
                gridSize = Math.floor(width / 10),
                legendElementWidth = gridSize * 2,
                buckets = 9,
                //colors = ["#909090","#84CC1F","#FDB700","#FF0000"], // alternatively colorbrewer.YlGnBu[9]
                colors = ["#1F4591", "#217C9D", "#23A996", "#25B467", "#27C02F", "#61CB28", "#ABD72A", "#E2C72B", "#EE832C", "#F9362D"],
                legendData = ["low traffic", "", "", "", "", "", "", "", "", "high traffic"],
                days = networkHeatMapPhysicianChartData.mapRefPhysician, //["John Smith", "John Smith john", "John Smith", "John Smith", "John Smith", "John Smith", "John Smith"],
                times = networkHeatMapPhysicianChartData.mapPerPhysician;//["John Smith", "John Smith", "John Smith", "John Smith", "John Smith", "John Smith"];

        var colorScale = d3.scale.threshold()
                .domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
                .range([0].concat(colors));

        var svg = d3.select("#matrixView").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left * 6 + "," + margin.top + ")");

        var dayLabels = svg.selectAll(".dayLabel")
                .data(days)
                .enter().append("text")
                .text(function(d) {
                    return d;
                })
                .attr("x", 0)
                .attr("y", function(d, i) {
                    return i * gridSize / 1.9;
                })
                .style("text-anchor", "right")
                .attr("transform", "translate(-100," + gridSize / 5 + ")")
                .attr("class", function(d, i) {
                    return ((i == findRow) ? "dayLabel mono axis axis-workweek-bold" : "dayLabel mono axis axis-workweek");
                });
        //.attr("class", function (d, i) { return "dayLabel mono axis axis-workweek"; });

        var timeLabels = svg.selectAll(".timeLabel")
                .data(times)
                .enter().append("text")
                .text(function(d) {
                    return d;
                })
                .attr("x", function(d, i) {
                    return i * gridSize / 1.9;
                })
                .attr("y", function(d, i) {
                    return i * 30 - 4;
                })
                .style("text-anchor", "middle")
                //.style("font-weight", "bold")
                .attr("transform", "translate(" + gridSize / 2 + ", -20)rotate(-30)")
                //.attr("class", function(d, i) { return ((i >= 7 && i <= 16) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis"); });
                .attr("class", function(d, i) {
                    return "timeLabel mono axis axis-worktime";
                });

        var heatMap = svg.selectAll(".hour")
                .data(dataArray)
                .enter().append("rect")
                .attr("x", function(d) {
                    return (d.hour - 1) * (gridSize * .6)
                })
                .attr("y", function(d) {
                    return (d.day - 1) * (gridSize / 2);
                })
                .attr("rx", 4)
                .attr("ry", 4)
                .attr("class", "bordered")
                .attr("width", gridSize * .6)
                .attr("height", gridSize / 2)

                //.style("fill", colors[0])
                .style("fill", function(d) {
                    if (d.value > 0 && d.value <= 10)
                        return '#1F4591';
                    else if (d.value > 10 && d.value <= 20)
                        return '#217C9D';
                    else if (d.value > 20 && d.value <= 30)
                        return '#23A996';
                    else if (d.value > 30 && d.value <= 40)
                        return '#25B467';
                    else if (d.value > 40 && d.value <= 50)
                        return '#27C02F';
                    else if (d.value > 50 && d.value <= 60)
                        return '#61CB28';
                    else if (d.value > 60 && d.value <= 70)
                        return '#ABD72A';
                    else if (d.value > 70 && d.value <= 80)
                        return '#E2C72B';
                    else if (d.value > 80 && d.value <= 90)
                        return '#EE832C';
                    else
                        return '#F9362D';
                })
                .on("mouseover", function(d) {
                    d3.select(this).attr("class", "bordered-active");
                    this.parentNode.appendChild(this);
                })
                .on("mouseout", function(d) {
                    d3.select(this).attr("class", "bordered");
                    this.parentNode.appendChild(this);
                });

        heatMap.append("text")
                .attr("class", "mono")
                .text(function(d) {
                    d.value;
                })
                .attr("x", function(d) {
                    return (d.hour - 1) * (gridSize * .6)
                })
                .attr("y", function(d) {
                    return (d.day - 1) * (gridSize / 2);
                })





        //   heatMap.transition().duration(1000)
        //   .style("fill", function(d) { return colorScale(d.value); });

        heatMap.append("title").text(function(d) {
            return "Risk Score: " + d.value
        });


        var legend = svg.selectAll(".legend")
                .data(colorScale.domain(), function(d) {
                    return d;
                })
                .enter().append("g")
                .attr("class", "legend");

        legend.append("rect")
                .attr("x", function(d, i) {
                    return (legendElementWidth / 6) * i + 374;
                })
                .attr("y", height + 60)
                .attr("width", legendElementWidth / 6)
                .attr("height", gridSize / 6)
                .style("fill", function(d, i) {
                    return colors[i];
                });

        legend.append("text")
                .attr("class", "mono")
                .text(function(d, i) {
                    return legendData[i];
                })
                .attr("x", function(d, i) {
                    return ((i == 0) ? ((legendElementWidth / 6) * i + 374) : ((legendElementWidth / 6) * i + 350));
                })
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
        var selectedProviderId = screens.providerDetailsForm.providerId;

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
            if (screens.providerDetailsForm.peerChartLabel == "claim_count") {
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
            barChartData: selectedPeerChartData[screens.providerDetailsForm.peerChartLabel],
            nationalAverageList: nationalAverageList,
            regionalAverageList: regionalAverageList,
            yAxisLabel: $("#sort_provider_type option:selected").text()

        });
    },
    networkForceDirectedChart: function() {

//    	log("Inside networkForceDirectedChart method");
//		var ua = navigator.userAgent,
//		iStuff = ua.match(/iPhone/i) || ua.match(/iPad/i),
//		typeOfCanvas = typeof HTMLCanvasElement,
//		nativeCanvasSupport = (typeOfCanvas == 'object' || typeOfCanvas == 'function'),
//		textSupport = nativeCanvasSupport && (typeof document.createElement('canvas').getContext('2d').fillText == 'function');
//		//I'm setting this based on the fact that ExCanvas provides text support for IE
//		//and that as of today iPhone/iPad current text support is lame
//		screens.providerDetailsForm.labelType = (!nativeCanvasSupport || (textSupport && !iStuff)) ? 'Native' : 'HTML';
//		screens.providerDetailsForm.nativeTextSupport = screens.providerDetailsForm.labelType == 'Native';
//		screens.providerDetailsForm.useGradients = nativeCanvasSupport;
//		screens.providerDetailsForm.animate = !(iStuff || !nativeCanvasSupport);
//
//    	// init data
//    	var json = [{
//    		"adjacencies": [
//    			"Provider0", {
//    				"nodeTo": "claim1",
//    				"nodeFrom": "Provider0",
//    				"data": {
//    					"$color": "#557EAA"
//    				}
//    			}, {
//    				"nodeTo": "claim2",
//    				"nodeFrom": "Provider0",
//    				"data": {
//    					"$color": "#557EAA"
//    				}
//    			}, {
//    				"nodeTo": "claim3",
//    				"nodeFrom": "Provider0",
//    				"data": {
//    					"$color": "#557EAA"
//    				}
//    			}, {
//    				"nodeTo": "claim4",
//    				"nodeFrom": "Provider0",
//    				"data": {
//    					"$color": "#557EAA"
//    				}
//    			}, {
//    				"nodeTo": "claim5",
//    				"nodeFrom": "Provider0",
//    				"data": {
//    					"$color": "#557EAA"
//    				}
//    			}, {
//    				"nodeTo": "claim6",
//    				"nodeFrom": "Provider0",
//    				"data": {
//    					"$color": "#557EAA"
//    				}
//    			}
//    		],
//    		"data": {
//    			"$color": "#83548B",
//    			"$type": "circle",
//    			"$dim": 10
//    		},
//    		"id": "Provider0",
//    		"name": "Provider0",
//    		"image": "Provider.png"
//    	},
//    	{
//    		"adjacencies": [
//    			"claim1", {
//    				"nodeTo": "Patient1",
//    				"nodeFrom": "claim1",
//    				"data": {
//    					"$color": "#557EAA"
//    				},
//    				"id": "Claim1",
//    				"name": "Claim1",
//    				"image": "Claim.png"
//    			}
//    		],
//    		"data": {
//    			"$color": "#FF0000",
//    			"$type": "circle",
//    			"$dim": 10
//    		},
//    		"id": "Patient1",
//    		"name": "Patient1",
//    		"image": "Patient.png"
//    	},
//    	{
//    		"adjacencies": [
//    			"claim2", {
//    				"nodeTo": "Patient1",
//    				"nodeFrom": "claim2",
//    				"data": {
//    					"$color": "#557EAA"
//    				},
//    				"id": "Claim2",
//    				"name": "Claim2",
//    				"image": "Claim.png"
//    			}
//    		],
//    		"data": {
//    			"$color": "#FF0000",
//    			"$type": "circle",
//    			"$dim": 10
//    		},
//    		"id": "Patient1",
//    		"name": "Patient1",
//    		"image": "Patient.png"
//    	},
//    	{
//    		"adjacencies": [
//    			"claim3", {
//    				"nodeTo": "Patient1",
//    				"nodeFrom": "claim3",
//    				"data": {
//    					"$color": "#557EAA"
//    				},
//    				"id": "Claim3",
//    				"name": "Claim3",
//    				"image": "Claim.png"
//    			}
//    		],
//    		"data": {
//    			"$color": "#FF0000",
//    			"$type": "circle",
//    			"$dim": 10
//    		},
//    		"id": "Patient1",
//    		"name": "Patient1",
//    		"image": "Patient.png"
//    	},
//    	{
//    		"adjacencies": [
//    			"claim4", {
//    				"nodeTo": "Patient2",
//    				"nodeFrom": "claim4",
//    				"data": {
//    					"$color": "#557EAA"
//    				},
//    				"id": "Claim4",
//    				"name": "Claim4",
//    				"image": "Claim.png"
//    			}
//    		],
//    		"data": {
//    			"$color": "#FF0000",
//    			"$type": "circle",
//    			"$dim": 10
//    		},
//    		"id": "Patient2",
//    		"name": "Patient2",
//    		"image": "Patient.png"
//    	},
//    	{
//    		"adjacencies": [
//    			"claim5", {
//    				"nodeTo": "Patient2",
//    				"nodeFrom": "claim5",
//    				"data": {
//    					"$color": "#557EAA"
//    				},
//    				"id": "Claim5",
//    				"name": "Claim5",
//    				"image": "Claim.png"
//    			}
//    		],
//    		"data": {
//    			"$color": "#FF0000",
//    			"$type": "circle",
//    			"$dim": 10
//    		},
//    		"id": "Patient2",
//    		"name": "Patient2",
//    		"image": "Patient.png"
//    	}
//
//    	];
//    	// end
//
//    	// init ForceDirected
//    	var fd = new $jit.ForceDirected({
//    		//id of the visualization container
//    		injectInto: 'infovis',
//    		//Enable zooming and panning
//    		//by scrolling and DnD
//    		Navigation: {
//    			enable: true,
//    			//Enable panning events only if we're dragging the empty
//    			//canvas (and not a node).
//    			panning: 'avoid nodes',
//    			zooming: 10 //zoom speed. higher is more sensible
//    		},
//    		// Change node and edge styles such as
//    		// color and width.
//    		// These properties are also set per node
//    		// with dollar prefixed data-properties in the
//    		// JSON structure.
//    		Node: {
//    			overridable: true
//    		},
//    		Edge: {
//    			overridable: true,
//    			color: '#23A4FF',
//    			lineWidth: 0.4
//    		},
//    		//Native canvas text styling
//    		Label: {
//    			type: screens.providerDetailsForm.labelType, //Native or HTML
//    			size: 10,
//    			style: 'bold',
//    			color: '#000000'
//    		},
//    		//Add Tips
//    		Tips: {
//    			enable: true,
//    			onShow: function (tip, node) {
//    				//count connections
//    				var count = 0;
//    				node.eachAdjacency(function () {
//    					count++;
//    				});
//    				//display node info in tooltip
//    				tip.innerHTML = "<div class=\"tip-title\">" + node.name + "</div>" + "<div class=\"tip-text\"><b>connections:</b> " + count + "</div>";
//    			}
//    		},
//    		// Add node events
//    		Events: {
//    			enable: true,
//    			type: 'Native',
//    			//Change cursor style when hovering a node
//    			onMouseEnter: function () {
//    				fd.canvas.getElement().style.cursor = 'move';
//    			},
//    			onMouseLeave: function () {
//    				fd.canvas.getElement().style.cursor = '';
//    			},
//    			//Update node positions when dragged
//    			onDragMove: function (node, eventInfo, e) {
//    				var pos = eventInfo.getPos();
//    				node.pos.setc(pos.x, pos.y);
//    				fd.plot();
//    			},
//    			//Implement the same handler for touchscreens
//    			onTouchMove: function (node, eventInfo, e) {
//    				$jit.util.event.stop(e); //stop default touchmove event
//    				this.onDragMove(node, eventInfo, e);
//    			},
//    			//Add also a click handler to nodes
//    			onClick: function (node) {
//    				if (!node) return;
//    				// Build the right column relations list.
//    				// This is done by traversing the clicked node connections.
//    				var html = "<h4>" + node.name + "</h4><b> connections:</b><ul><li>",
//    					list = [];
//    				node.eachAdjacency(function (adj) {
//    					list.push(adj.nodeTo.name);
//    				});
//    				//append connections information
//    				$jit.id('inner-details').innerHTML = html + list.join("</li><li>") + "</li></ul>";
//    			}
//    		},
//    		//Number of iterations for the FD algorithm
//    		iterations: 200,
//    		//Edge length
//    		levelDistance: 130,
//    		// Add text to the labels. This method is only triggered
//    		// on label creation and only for DOM labels (not native canvas ones).
//    		onCreateLabel: function (domElement, node) {
//    			domElement.innerHTML = node.name;
//    			var style = domElement.style;
//    			style.fontSize = "0.8em";
//    			style.color = "#ddd";
//    			//var imagePath = "/images/" + node.image;
//    			//console.log(imagePath);
//    			//domElement.innerHTML = "<div><img src='" + imagePath + "'/></div>";
//    			//domElement.innerHTML = "<div><img src='/images/Patient.png'/></div>";
//    		},
//    		// Change node styles when DOM labels are placed
//    		// or moved.
//    		onPlaceLabel: function (domElement, node) {
//    			var style = domElement.style;
//    			var left = parseInt(style.left);
//    			var top = parseInt(style.top);
//    			var w = domElement.offsetWidth;
//    			style.left = (left - w / 2) + 'px';
//    			style.top = (top + 10) + 'px';
//    			style.display = '';
//    		}
//    	});
//    	
//    	log("Before loading JSON data");
//
//    	// load JSON data.
//    	fd.loadJSON(json);
//
//    	log("After loading JSON data");
//
//    	// compute positions incrementally and animate.
//    	fd.computeIncremental({
//    		iter: 40,
//    		property: 'end',
//    		onStep: function (perc) {
//    			log(perc + '% loaded...');
//    		},
//    		onComplete: function () {
//    			log('done');
//    			fd.animate({
//    				modes: ['linear'],
//    				transition: $jit.Trans.Elastic.easeOut,
//    				duration: 2500
//    			});
//    		}
//    	});
        // end    	


        var graph = {
            "name": "John Smith", "entityType": "Provider", "x": 500, "y": 300, "fixed": true, "speciality": "Psychiatry", "amount": "$20,120","riskScore": 94,"services":"Practitioner",
            "children": [
                {
                    "name": "2385678", "entityType": "Claim", "amount": "$3,622", "riskScore": 94, "claimChildren": [], "claimDate": "10-02-2013", "children": [{"name": "Clara Smith", "entityType": "Patient","riskScore": 55,
                            "gender": "M", "age": 34, "children": [
                                {"name": "1212323", "entityType": "ClaimBlue", "amount": "$120", "riskScore": 46, "claimDate": "10-02-2013", "claimChildren": [], "children": [{"name": "Kevin Nan", "size": 1, "entityType": "ProviderBlue","speciality": "Psychiatry","amount": "$20,120","riskScore": 44,"services":"Practitioner"}]},
                                {"name": "Claims(2)", "entityType": "ClaimBlue", "amount": "$330", "riskScore": 30, "claimDate": "10-02-2013", "claimChildren": [{"name": "1324221", "amount": "$120"}, {"name": "1324321", "amount": "$130"}], "children": [{"name": "Mary June", "size": 3, "entityType": "ProviderBlue","speciality": "Psychiatry","amount": "$20,120","riskScore": 44,"services":"Practitioner"}]}
                            ]
                        }
                    ]
                },
                {
                    "name": "1120394", "entityType": "Claim", "amount": "$409", "riskScore": 91, "claimChildren": [], "claimDate": "10-02-2013", "children": [{"name": "Tina Ray", "entityType": "Patient","riskScore": 55,
                            "gender": "M", "age": 34, "children": [
                                {"name": "1212323", "entityType": "ClaimBlue", "amount": "$450", "riskScore": 41, "claimDate": "10-02-2013", "claimChildren": [], "children": [{"name": "Tim Lui", "size": 1, "entityType": "ProviderBlue","speciality": "Psychiatry","amount": "$20,120","riskScore": 44,"services":"Practitioner"}]},
                                {"name": "1234343", "entityType": "ClaimBlue", "amount": "$450", "riskScore": 45, "claimDate": "10-02-2013", "claimChildren": [], "children": [{"name": "Richard N", "size": 3, "entityType": "ProviderBlue","speciality": "Psychiatry","amount": "$20,120","riskScore": 44,"services":"Practitioner"}]}/*,
                                {"name": "1211133", "entityType": "ClaimBlue", "amount": "$450", "riskScore": 34, "claimDate": "10-02-2013", "claimChildren": [], "children": [{"name": "Joe Woo", "size": 3, "entityType": "ProviderBlue","speciality": "Psychiatry","amount": "$20,120","riskScore": 44,"services":"Practitioner"}]}*/
                            ]
                        }
                    ]
                },
                {
                    "name": "8927405", "entityType": "Claim", "amount": "$1,001", "riskScore": 90, "claimChildren": [], "claimDate": "10-02-2013", "children": [{"name": "Julian Hale", "entityType": "Patient","riskScore": 55,
                            "gender": "M", "age": 34, "children": [
                                {"name": "1212323", "entityType": "ClaimBlue", "amount": "$450", "riskScore": 45, "claimDate": "10-02-2013", "claimChildren": [], "children": [{"name": "Sharon H", "size": 1, "entityType": "ProviderBlue","speciality": "Psychiatry","amount": "$20,120","riskScore": 44,"services":"Practitioner"}]},
                                {"name": "1234343", "entityType": "ClaimBlue", "amount": "$450", "riskScore": 34, "claimDate": "10-02-2013", "claimChildren": [], "children": [{"name": "Bill Smith", "size": 3, "entityType": "ProviderBlue","speciality": "Psychiatry","amount": "$20,120","riskScore": 44,"services":"Practitioner"}]},
                                {"name": "1211133", "entityType": "ClaimBlue", "amount": "$450", "riskScore": 45, "claimDate": "10-02-2013", "claimChildren": [], "children": [{"name": "Aaron M", "size": 3, "entityType": "ProviderBlue","speciality": "Psychiatry","amount": "$20,120","riskScore": 44,"services":"Practitioner"}]}
                            ]
                        }
                    ]
                },
                {
                    "name": "0035648", "entityType": "Claim", "amount": "$3,680", "riskScore": 89, "claimChildren": [], "claimDate": "10-02-2013", "children": [{"name": "Tina Smith", "entityType": "Patient","riskScore": 55,
                            "gender": "M", "age": 34, "children": [
                                {"name": "1212323", "entityType": "ClaimBlue", "amount": "$450", "riskScore": 43, "claimDate": "10-02-2013", "claimChildren": [], "children": [{"name": "Andrea Bill", "size": 1, "entityType": "ProviderBlue","speciality": "Psychiatry","amount": "$20,120","riskScore": 44,"services":"Practitioner"}]},
                                /*{"name": "1234343", "entityType": "ClaimBlue", "amount": "$450", "riskScore": 45, "claimDate": "10-02-2013", "claimChildren": [], "children": [{"name": "Nancy Much", "size": 3, "entityType": "ProviderBlue","speciality": "Psychiatry","amount": "$20,120","riskScore": 44,"services":"Practitioner"}]},*/
                                {"name": "1211133", "entityType": "ClaimBlue", "amount": "$450", "riskScore": 35, "claimDate": "10-02-2013", "claimChildren": [], "children": [{"name": "Jennifer Geo", "size": 3, "entityType": "ProviderBlue","speciality": "Psychiatry","amount": "$20,120","riskScore": 44,"services":"Practitioner"}]}
                            ]
                        }
                    ]
                },
                {
                    "name": "6787900", "entityType": "Claim", "amount": "$5,424", "riskScore": 87, "claimChildren": [], "claimDate": "10-02-2013", "children": [{"name": "Tim Ray", "entityType": "Patient","riskScore": 55,
                            "gender": "M", "age": 34, "children": [
                                {"name": "1212323", "entityType": "ClaimBlue", "amount": "$450", "riskScore": 45, "claimDate": "10-02-2013", "claimChildren": [], "children": [{"name": "Gayle F", "size": 1, "entityType": "ProviderBlue","speciality": "Psychiatry","amount": "$20,120","riskScore": 44,"services":"Practitioner"}]},
                                {"name": "1234343", "entityType": "ClaimBlue", "amount": "$450", "riskScore": 39, "claimDate": "10-02-2013", "claimChildren": [], "children": [{"name": "Catherine K", "size": 3, "entityType": "ProviderBlue","speciality": "Psychiatry","amount": "$20,120","riskScore": 44,"services":"Practitioner"}]},
                                {"name": "1211133", "entityType": "ClaimBlue", "amount": "$450", "riskScore": 38, "claimDate": "10-02-2013", "claimChildren": [], "children": [{"name": "Christina Smith", "size": 3, "entityType": "ProviderBlue","speciality": "Psychiatry","amount": "$20,120","riskScore": 44,"services":"Practitioner"}]}
                            ]
                        }
                    ]
                },
                {
                    "name": "2345623", "entityType": "Claim", "amount": "$2,217", "riskScore": 88, "claimChildren": [], "claimDate": "10-02-2013", "children": [{"name": "Hillary Smith", "entityType": "Patient","riskScore": 55,
                            "gender": "M", "age": 34, "children": [
                                {"name": "1212323", "entityType": "ClaimBlue", "amount": "$450", "riskScore": 44, "claimDate": "10-02-2013", "claimChildren": [], "children": [{"name": "Sujon Jack", "size": 1, "entityType": "ProviderBlue","speciality": "Psychiatry","amount": "$20,120","riskScore": 44,"services":"Practitioner"}]},
                                {"name": "1234343", "entityType": "ClaimBlue", "amount": "$450", "riskScore": 38, "claimDate": "10-02-2013", "claimChildren": [], "children": [{"name": "Tim Ray", "size": 3, "entityType": "ProviderBlue","speciality": "Psychiatry","amount": "$20,120","riskScore": 44,"services":"Practitioner"}]},
                                {"name": "1211133", "entityType": "ClaimBlue", "amount": "$450", "riskScore": 37, "claimDate": "10-02-2013", "claimChildren": [], "children": [{"name": "Will Smith", "size": 3, "entityType": "ProviderBlue","speciality": "Psychiatry","amount": "$20,120","riskScore": 44,"services":"Practitioner"}]}
                            ]
                        }
                    ]
                },
                {
                    "name": "9876782", "entityType": "Claim", "amount": "$672", "riskScore": 89, "claimChildren": [], "claimDate": "10-02-2013", "children": [{"name": "Cathy Sam", "entityType": "Patient","riskScore": 55,
                            "gender": "M", "age": 34, "children": [
                                {"name": "1212323", "entityType": "ClaimBlue", "amount": "$450", "riskScore": 47, "claimDate": "10-02-2013", "claimChildren": [], "children": [{"name": "Greg M", "size": 1, "entityType": "ProviderBlue","speciality": "Psychiatry","amount": "$20,120","riskScore": 44,"services":"Practitioner"}]},
                                {"name": "1234343", "entityType": "ClaimBlue", "amount": "$450", "riskScore": 43, "claimDate": "10-02-2013", "claimChildren": [], "children": [{"name": "Ray Heal", "size": 3, "entityType": "ProviderBlue","speciality": "Psychiatry","amount": "$20,120","riskScore": 44,"services":"Practitioner"}]},
                                {"name": "1211133", "entityType": "ClaimBlue", "amount": "$450", "riskScore": 34, "claimDate": "10-02-2013", "claimChildren": [], "children": [{"name": "Thomas D", "size": 3, "entityType": "ProviderBlue","speciality": "Psychiatry","amount": "$20,120","riskScore": 44,"services":"Practitioner"}]}
                            ]
                        }
                    ]
                },
                {
                    "name": "2324543", "entityType": "Claim", "amount": "$490", "riskScore": 90, "claimChildren": [], "claimDate": "10-02-2013", "children": [{"name": "Monica Lee", "entityType": "Patient","riskScore": 55,
                            "gender": "M", "age": 34, "children": [
                                {"name": "1212323", "entityType": "ClaimBlue", "amount": "$450", "riskScore": 49, "claimDate": "10-02-2013", "claimChildren": [], "children": [{"name": "Sean Black", "size": 1, "entityType": "ProviderBlue","speciality": "Psychiatry","amount": "$20,120","riskScore": 44,"services":"Practitioner"}]},
                                {"name": "1234343", "entityType": "ClaimBlue", "amount": "$450", "riskScore": 41, "claimDate": "10-02-2013", "claimChildren": [], "children": [{"name": "Robert E", "size": 3, "entityType": "ProviderBlue","speciality": "Psychiatry","amount": "$20,120","riskScore": 44,"services":"Practitioner"}]},
                                {"name": "1211133", "entityType": "ClaimBlue", "amount": "$450", "riskScore": 32, "claimDate": "10-02-2013", "claimChildren": [], "children": [{"name": "Armando C", "size": 3, "entityType": "ProviderBlue","speciality": "Psychiatry","amount": "$20,120","riskScore": 44,"services":"Practitioner"}]}
                            ]
                        }
                    ]
                },
                /*{
                    "name": "2434323", "entityType": "Claim", "amount": "$900", "riskScore": 92, "claimChildren": [], "claimDate": "10-02-2013", "children": [{"name": "Martina Pipkin", "entityType": "Patient","riskScore": 55,
                            "gender": "M", "age": 34, "children": [
                                {"name": "1212323", "entityType": "ClaimBlue", "amount": "$450", "riskScore": 45, "claimDate": "10-02-2013", "claimChildren": [], "children": [{"name": "Brian Smith", "size": 1, "entityType": "ProviderBlue","speciality": "Psychiatry","amount": "$20,120","riskScore": 44,"services":"Practitioner"}]},
                                {"name": "1234343", "entityType": "ClaimBlue", "amount": "$450", "riskScore": 43, "claimDate": "10-02-2013", "claimChildren": [], "children": [{"name": "John G", "size": 3, "entityType": "ProviderBlue","speciality": "Psychiatry","amount": "$20,120","riskScore": 44,"services":"Practitioner"}]},
                                {"name": "1211133", "entityType": "ClaimBlue", "amount": "$450", "riskScore": 31, "claimDate": "10-02-2013", "claimChildren": [], "children": [{"name": "Chris Samy", "size": 3, "entityType": "ProviderBlue","speciality": "Psychiatry","amount": "$20,120","riskScore": 44,"services":"Practitioner"}]}
                            ]
                        }
                    ]
                },*/
                {
                    "name": "Claims(2)", "entityType": "Claim", "amount": "$1702", "riskScore": 91, "claimDate": "10-02-2013", "claimChildren": [{"name": "2356987", "amount": "$750"}, {"name": "2356876", "amount": "$952"}], "children": [{"name": "Christina May", "entityType": "Patient","riskScore": 55,
                            "gender": "M", "age": 34, "children": [
                                {"name": "1212323", "entityType": "ClaimBlue", "amount": "$450", "riskScore": 55, "claimDate": "10-02-2013", "claimChildren": [], "children": [{"name": "Colin W", "size": 1, "entityType": "ProviderBlue","speciality": "Psychiatry","amount": "$20,120","riskScore": 44,"services":"Practitioner"}]},
                                {"name": "1234343", "entityType": "ClaimBlue", "amount": "$450", "riskScore": 35, "claimDate": "10-02-2013", "claimChildren": [], "children": [{"name": "William P", "size": 3, "entityType": "ProviderBlue","speciality": "Psychiatry","amount": "$20,120","riskScore": 44,"services":"Practitioner"}]}/*,
                                {"name": "1211133", "entityType": "ClaimBlue", "amount": "$450", "riskScore": 31, "claimDate": "10-02-2013", "claimChildren": [], "children": [{"name": "Teddy E", "size": 3, "entityType": "ProviderBlue","speciality": "Psychiatry","amount": "$20,120","riskScore": 44,"services":"Practitioner"}]}*/
                            ]
                        }
                    ]
                }
            ]
        };


        var currentNode = null;
        var count = graph.children.length;
        nodePostion(count, graph, 70);

        function nodePostion(count, array, radius) {
            var degree = 360 / count;
            var obj = null;
            for (var i = 0; i < array.children.length; i++) {
                obj = array.children[i];
                //obj.name = name + i;
                // obj.label = name;
                obj.x = array.x + radius * Math.cos(2 * Math.PI - Math.PI * i * degree / 180);
                obj.y = array.y + radius * Math.sin(2 * Math.PI - Math.PI * i * degree / 180);
                obj.fixed = true;
                obj.deg = i * degree;
                //obj.children = [];
                nodePostionSub(obj, radius);
                //array.children.push(obj);
            }
        }

        function nodePostionSub(child, radius) {
            var obj = child.children[0];
            // obj.name = name;
            //obj.label = name;
            obj.x = child.x + radius * Math.cos(2 * Math.PI - Math.PI * child.deg / 180);
            obj.y = child.y + radius * Math.sin(2 * Math.PI - Math.PI * child.deg / 180);
            obj.fixed = true;
            obj.deg = child.deg;
            // obj.children = [];
            if (obj.children) {
                nodePostionChildSub(obj, radius, obj.children.length);
            }

            //child.children.push(obj);
        }

        function nodePostionChildSub(child, radius, count) {
            var degree = 60 / (count - 1);
            var obj = null;
            for (var i = 0; i < child.children.length; i++) {
                obj = child.children[i];

                if (child.deg <= 90) {
                    obj.x = child.x + radius * Math.cos(2 * Math.PI - Math.PI * i * degree / 180);
                    obj.y = child.y + radius * Math.sin(2 * Math.PI - Math.PI * i * degree / 180);
                } else if (child.deg <= 180) {
                    obj.x = child.x - radius * Math.cos(2 * Math.PI - Math.PI * i * degree / 180);
                    obj.y = child.y + radius * Math.sin(2 * Math.PI - Math.PI * i * degree / 180);
                } else if (child.deg <= 270) {
                    obj.x = child.x - radius * Math.cos(2 * Math.PI - Math.PI * i * degree / 180);
                    obj.y = child.y - radius * Math.sin(2 * Math.PI - Math.PI * i * degree / 180);
                } else {
                    obj.x = child.x + radius * Math.cos(2 * Math.PI - Math.PI * i * degree / 180);
                    obj.y = child.y - radius * Math.sin(2 * Math.PI - Math.PI * i * degree / 180);
                }
                obj.fixed = true;
                obj.deg = child.deg;

                if (obj.children) {
                    nodePostionChildSubChild(obj, radius);
                }


            }
        }
        function nodePostionChildSubChild(child, radius) {
            var obj = child.children[0];
            obj.x = child.x + radius * Math.cos(2 * Math.PI - Math.PI * child.deg / 180);
            obj.y = child.y + radius * Math.sin(2 * Math.PI - Math.PI * child.deg / 180);
            obj.fixed = true;
            obj.deg = child.deg;

        }

        var realWidth = 1200;
        var realHeight = 700;
        var m = [40, 240, 40, 240];
        var width = realWidth - m[0] - m[0];
        var height = realHeight - m[0] - m[2];
        var root;
//        var width = 1200,
//                height = 700,
//                root;

        var force = d3.layout.force()
                .charge(-400)
                .linkDistance(40)
                .gravity(.05)
                .size([width, height])
                .on("tick", tick)


        var svg = d3.select("#graph").append("svg:svg")
                .attr("width", width)
                .attr("height", height)
                .call(d3.behavior.zoom()
			      .scaleExtent([0.4, 3])
			      .on("zoom", function() {
			          svg.attr("transform", "translate(" + d3.event.translate +
			              ")scale(" + d3.event.scale + ")");
			      }))
			   .append('svg:g');
        
        
        var drag = force.drag()
                .on("dragstart", dragstart);

         svg.append("svg:defs").selectAll("marker")
                .data(["end"])      // Different link/path types can be defined here
                .enter().append("svg:marker")    // This section adds in the arrows
                .attr("id", String)
                .attr("viewBox", "0 -5 10 10")
                .attr("refX", 16)
                .attr("refY", 0)
                .attr("markerWidth", 6)
                .attr("markerHeight", 6)
                .attr("orient", "auto")
                .append("svg:path")
                .attr("d", "M0,-5L10,0L0,5")
                .attr('fill', '#000');

        var link = svg.selectAll(".link"),
                node = svg.selectAll(".node");

        //d3.json("graph.json", function(error, json) {

        root = graph;
        // root.fixed = true;
        // root.x = width / 2;
        // root.y = 200;

        update();
        nodeCollepse(root);
        update();
        //});   


        function update() {
            var nodes = flatten(root),
                    links = d3.layout.tree().links(nodes);

            // Restart the force layout.
            force
                    .nodes(nodes)
                    .links(links)
                    .start();

            // Update links.
            link = link.data(links, function(d) {
                return d.target.id;
            });

            link.exit().remove();

            link.enter().insert("line", ".node")
                    .attr("class", "link").attr("marker-end", "url(#end)");

            // Update nodes.
            node = node.data(nodes, function(d) {
                return d.id;
            });

            node.exit().remove();

            var nodeEnter = node.enter().append("g")
                    .attr("class", "node")
                    .on("click", click)
                    .on("mouseover", mover)
                    .on("mouseout", mout)
                    .call(drag);
            //nodeEnter.append("circle")
            //  .attr("r", function(d) { return Math.sqrt(d.size) / 10 || 4.5; });

            nodeEnter.append("text")
                    .attr("dy", "-.8em")
                    .text(function(d) {
                        if (d.entityType == "Provider" || d.entityType == "Patient" || d.entityType == "ProviderBlue") {
                            return d.name;
                        } else {
                            return d.riskScore + "%";
                        }

                    });

            //node.select("circle")
            //   .style("fill", color);


            node.append("image")
                    .attr("xlink:href", function(d) {
                        //console.log(d.toSource());
                        if (d.entityType == "Provider")
                            return "common/images/provider_red.png"
                        else if (d.entityType == "Claim")
                            if (d.claimChildren.length == 0) {
                                return "common/images/singleclaim_red.png"
                            } else {
                                return "common/images/multiple icons.png"
                            }
                        else if (d.entityType == "Patient")
                            return "common/images/patient_new.png"
                        else if (d.entityType == "ClaimBlue")
                            if (d.claimChildren.length == 0) {
                                return "common/images/singleclaim.png"
                            } else {
                                return "common/images/multpleicon.png"
                            }
                        else if (d.entityType == "ProviderBlue")
                            return "common/images/provider_blue.png"
                    })
                    .attr("x", -8)
                    .attr("y", -8)
                    .attr("width", 20)
                    .attr("height", 20)
                    .on('contextmenu', function(data, index) {
                        currentNode = null;
                        currentNode = data;
                        console.log(data);
                        if(data._children == undefined && data.children == null){
                        }
                        else{
                        if (d3.event.pageX || d3.event.pageY) {
                            var x = d3.event.pageX;
                            var y = d3.event.pageY;
                        } else if (d3.event.clientX || d3.event.clientY) {
                            var x = d3.event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
                            var y = d3.event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
                        }

                        d3.select('#my_custom_menu')
                                .style('position', 'absolute')
                                .style('left', x + 'px')
                                .style('top', y + 'px')
                                .style('display', 'block');

                        d3.event.preventDefault();
                        }
                    });


        }

        function zoom() {
            var scale = d3.event.scale,
                    translation = d3.event.translate,
                    tbound = -height * scale,
                    bbound = height * scale,
                    lbound = (-width + m[1]) * scale,
                    rbound = (width - m[3]) * scale;
            // limit translation to thresholds
            translation = [
                Math.max(Math.min(translation[0], rbound), lbound),
                Math.max(Math.min(translation[1], bbound), tbound)
            ];
            svg.attr("transform", "translate(" + translation + ")" +
                    " scale(" + scale + ")");
        }

        function mover(d) {
        	$("#node_details").show();
           // $("#pop-up").fadeOut(100, function() {
                if (d.entityType == 'Provider') {
//                    $("#pop-desc1").html("Provider Name: " + d.name);
//                    $("#pop-desc2").html("Speciality: " + d.speciality);
//                    $("#pop-desc3").html("Services: " + d.services);
//                    $("#pop-desc4").html("Risk Score: " + d.riskScore);
//                    $("#pop-desc5").html("Amount: " + d.amount);
//                    
                    $('#e_id').show();
                    $('#e').show();
                    $('#a').text("Provider Name: ");
                    $('#b').text("Speciality: ");
                    $('#c').text("Services: ");
                    $('#d').text("Risk Score: ");
                    $('#e').text("Amount: ");
                    $('#a_id').text(d.name);
                    $('#b_id').text(d.speciality);
                    $('#c_id').text(d.services);
                    $('#d_id').text(d.riskScore);
                    $('#e_id').text(d.amount);
                    
                    
                    
                } else if (d.entityType == 'Claim' || d.entityType == 'ClaimBlue') {
//                    $("#pop-desc1").html("Claim Id: " + d.name);
//                    $("#pop-desc2").html("Claim Date: " + d.claimDate);
//                    $("#pop-desc3").html("Amount: " + d.amount);
//                    $("#pop-desc4").html("Risk Score: " + d.riskScore);
//                    $("#pop-desc5").html("");
//                    
                    $('#a').text("Claim Id: ");
                    $('#b').text("Claim Date: ");
                    $('#c').text("Amount: ");
                    $('#d').text("Risk Score: ");
                    $('#e').hide();
                    $('#a_id').text(d.name);
                    $('#b_id').text(d.claimDate);
                    $('#c_id').text(d.amount);
                    $('#d_id').text(d.riskScore);
                    $('#e_id').hide();
                    
                } else if (d.entityType == 'Patient') {
//                    $("#pop-desc1").html("Patient Name: " + d.name);
//                    $("#pop-desc2").html("Age: " + d.age);
//                    $("#pop-desc3").html("Gender: " + d.gender);
//                    $("#pop-desc4").html("Risk Score: " + d.riskScore);
//                    $("#pop-desc5").html("");
//                    
                    $('#a').text("Patient Name: ");
                    $('#b').text("Age: ");
                    $('#c').text("Gender: ");
                    $('#d').text("Risk Score: ");
                    $('#e').hide();
                    $('#a_id').text(d.name);
                    $('#b_id').text(d.age);
                    $('#c_id').text(d.gender);
                    $('#d_id').text(d.riskScore);
                    $('#e_id').hide();
                } else if (d.entityType == 'ProviderBlue') {
//                   $("#pop-desc1").html("Provider Name: " + d.name);
//                    $("#pop-desc2").html("Speciality: " + d.speciality);
//                    $("#pop-desc3").html("Services: " + d.services);
//                    $("#pop-desc4").html("Risk Score: " + d.riskScore);
//                    $("#pop-desc5").html("Amount: " + d.amount);
//                    
                    $('#e_id').show();
                    $('#e').show();
                    $('#a').text("Provider Name: ");
                    $('#b').text("Speciality: ");
                    $('#c').text("Services: ");
                    $('#d').text("Risk Score: ");
                    $('#e').text("Amount: ");
                    $('#a_id').text(d.name);
                    $('#b_id').text(d.speciality);
                    $('#c_id').text(d.services);
                    $('#d_id').text(d.riskScore);
                    $('#e_id').text(d.amount);
                    
                }
//
//                var popLeft = d.x + 20;//lE.cL[0] + 20;
//                var popTop = d.y + 40;//lE.cL[1] + 70;
//                //console.log(popLeft+"---"+popTop);
//                //alert(popLeft+"---"+popTop);
//                $("#pop-up").css({"left": popLeft, "top": popTop});
//                $("#pop-up").fadeIn(100);
//            });

        }

        function mout(d) {
         //   $("#pop-up").fadeOut(50);
            $("#node_details").hide();
        }
        function nodeCollepse(node) {
        	log("test");
            if (node.children) {
                $.each(node.children, function(i, item) {
                    nodeCollepse(item);
                    item._children = item.children;
                    item.children = null;
                    //console.log(this);

                });
            }
        }
        function tick() {
            link.attr("x1", function(d) {
                return d.source.x;
            })
                    .attr("y1", function(d) {
                        return d.source.y;
                    })
                    .attr("x2", function(d) {
                        return d.target.x;
                    })
                    .attr("y2", function(d) {
                        return d.target.y;
                    });

            node.attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")";
            });
        }

        function color(d) {
            return d._children ? "#3182bd" // collapsed package
                    : d.children ? "#c6dbef" // expanded package
                    : "#fd8d3c"; // leaf node
        }


        $('.testContext').click(function() {
            //console.log("test");
            if ($(this).text() == "Expand") {
                expand(currentNode);
            }
            else if ($(this).text() == "Collapse") {
                collapse(currentNode);
            }
            if ($(this).text() == "Expand All") {
            	expandAll(currentNode);
            	update();
            }
            if ($(this).text() == "Collapse All") {
            	collapseAll(currentNode);
            	update();
            }
            $('#my_custom_menu').css('display', 'none');
        });

        // Toggle children on click.
        function click(d) {
            if (d3.event.defaultPrevented)
                return; // ignore drag
            if (d.children) {
                d._children = d.children;
                d.children = null;
            } else {
                d.children = d._children;
                d._children = null;
            }
            update();
        }

        function collapse(d) {
            if (d.children) {
                d._children = d.children;
                d.children = null;
            }
            update();
        }
        
        
        function collapseAll(node) {
        	//alert("node::" + node.toSource());
        	if (node.children) {
        		node._children = node.children;
        		node.children=null;
                $.each(node._children, function(i, item) {
                	collapseAll(item);
                    //item._children = null;
                    //console.log(this);

                });
            }
        }

        function expand(d) {

            if (!d.children) {
                d.children = d._children;
                d._children = null;
            }
            update();
        }
        
        
        function expandAll(node) {
        	//alert("node::" + node.toSource());
        	if (node._children) {
        		node.children = node._children;
        		node._children=null;
                $.each(node.children, function(i, item) {
                	expandAll(item);
                });
            }else if(node.children){
            	//alert("hi"+node.toSource());
               $.each(node.children, function(i, item) {
                	expandAll(item);
                });
            }

        	
        }
        	
        // Returns a list of all nodes under the root.
        function flatten(root) {
            var nodes = [], i = 0;

            function recurse(node) {
                if (node.children)
                    node.children.forEach(recurse);
                if (!node.id)
                    node.id = ++i;
                nodes.push(node);
            }

            recurse(root);
            return nodes;
        }

        function dragstart(d) {
            d3.select(this).classed("fixed", d.fixed = true);
        }






    },
    networkForceChart: function() {

        var selectedProviderId = screens.providerDetailsForm.providerId;

        var selectedForceData = {};

        if (selectedProviderId != "" && selectedProviderId != undefined) {
            for (var j = 0; j < globalvars.networkForceChartData.length; j++) {
                if (selectedProviderId == globalvars.networkForceChartData[j].providerId) {
                    selectedForceData = globalvars.networkForceChartData[j];
                    break;
                }
            }
        }


        var width = 960,
                height = 600;
        var r = d3.scale.sqrt().domain([0, 1000]).range([10, 30]);
        var color = d3.scale.category10();
        // var color = ["#FF0000", "FF0000", "FF0000"];
        var svg = d3.select("#forceChart").append("svg:svg")
                .attr("width", width)
                .attr("height", height);

        var force = d3.layout.force()
                .linkDistance(100)
                .charge(-2000)
                .size([width, height]);

//    var graph = {
//    "nodes":[{"name":"AP 2 ","group":2,"size":10.5857740586},{"name":"AP 25","group":2,"size":10.0836820084},{"name":"John Smith","group":3,"size":10.0},{"name":"AP 40","group":2,"size":10.0836820084},{"name":"AP 49","group":2,"size":10.0836820084},{"name":"AP 61","group":2,"size":10.0836820084},{"name":"AP 62","group":2,"size":10.0836820084},{"name":"AP 7 ","group":2,"size":10.2510460251},{"name":"AP 72","group":2,"size":10.2510460251},{"name":"AP 74","group":2,"size":10.0836820084},{"name":"AP 75","group":2,"size":10.0836820084},{"name":"AP 76","group":2,"size":10.0836820084},{"name":"AP 77","group":2,"size":10.0836820084},{"name":"AP 78","group":2,"size":10.2510460251},{"name":"AP 79","group":2,"size":10.0836820084},{"name":"AP 80","group":2,"size":10.2510460251},{"name":"AP 81","group":2,"size":10.4184100418},{"name":"AP 82","group":2,"size":10.4184100418},{"name":"AP 83","group":2,"size":10.0836820084},{"name":"AP 84","group":2,"size":10.0836820084},{"name":"AP 85","group":2,"size":10.0836820084},{"name":"AP 86","group":2,"size":10.0836820084},{"name":"AP 87","group":2,"size":10.4184100418},{"name":"AP 89","group":2,"size":10.0836820084},{"name":"AP 90","group":2,"size":10.4184100418},{"name":"AP 91","group":2,"size":10.0836820084},{"name":"AP 92","group":2,"size":10.2510460251},{"name":"AP 93","group":2,"size":10.0836820084},{"name":"AP 94","group":2,"size":10.0836820084},{"name":"AP 95","group":2,"size":10.4184100418},{"name":"AP 96","group":2,"size":10.0836820084},{"name":"ERP 21 ","group":1,"size":14.1841004184},{"name":"ERP 22 ","group":1,"size":12.4267782427},{"name":"ERP 23 ","group":1,"size":14.1841004184},{"name":"ERP 24 ","group":1,"size":10.4184100418},{"name":"ERP 25 ","group":1,"size":10.5857740586},{"name":"ERP 26 ","group":1,"size":12.5941422594},{"name":"ERP 27 ","group":1,"size":11.589958159},{"name":"ERP 28 ","group":1,"size":12.1757322176},{"name":"ERP 29 ","group":1,"size":10.5857740586},{"name":"ERP 34 ","group":1,"size":10.0},{"name":"ERP 39","group":1,"size":10.0},{"name":"ERP 40","group":1,"size":10.0},{"name":"ERP 41","group":1,"size":10.1673640167},{"name":"ERP 43","group":1,"size":10.0}],
//    "links":[{"source":41,"target":2,"value":1,"pcolor":"Temp"},{"source":37,"target":2,"value":6,"pcolor":"Temp"},{"source":32,"target":2,"value":6,"pcolor":"Temp"},{"source":36,"target":2,"value":5,"pcolor":"Temp"},{"source":38,"target":2,"value":6,"pcolor":"Temp"},{"source":33,"target":2,"value":3,"pcolor":"Temp"},{"source":42,"target":2,"value":1,"pcolor":"Temp"},{"source":31,"target":2,"value":4,"pcolor":"Temp"},{"source":39,"target":2,"value":2,"pcolor":"Temp"},{"source":43,"target":2,"value":1,"pcolor":"Temp"},{"source":37,"target":2,"value":9,"pcolor":"Temp"},{"source":32,"target":2,"value":19,"pcolor":"Temp"},{"source":36,"target":2,"value":20,"pcolor":"Temp"},{"source":40,"target":2,"value":1,"pcolor":"Temp"},{"source":38,"target":2,"value":15,"pcolor":"Temp"},{"source":33,"target":2,"value":36,"pcolor":"Temp"},{"source":31,"target":2,"value":39,"pcolor":"Temp"},{"source":35,"target":2,"value":6,"pcolor":"Temp"},{"source":34,"target":2,"value":4,"pcolor":"Temp"},{"source":39,"target":2,"value":6,"pcolor":"Temp"},{"source":43,"target":2,"value":2,"pcolor":"Temp"},{"source":44,"target":29,"value":1,"pcolor":"Temp"},{"source":37,"target":22,"value":2,"pcolor":"Temp"},{"source":37,"target":24,"value":1,"pcolor":"Temp"},{"source":37,"target":26,"value":1,"pcolor":"Temp"},{"source":37,"target":7,"value":1,"pcolor":"Temp"},{"source":32,"target":9,"value":1,"pcolor":"Temp"},{"source":32,"target":17,"value":1,"pcolor":"Temp"},{"source":32,"target":22,"value":1,"pcolor":"Temp"},{"source":32,"target":25,"value":1,"pcolor":"Temp"},{"source":32,"target":0,"value":1,"pcolor":"Temp"},{"source":36,"target":4,"value":1,"pcolor":"Temp"},{"source":36,"target":10,"value":1,"pcolor":"Temp"},{"source":36,"target":15,"value":1,"pcolor":"Temp"},{"source":36,"target":16,"value":1,"pcolor":"Temp"},{"source":36,"target":8,"value":1,"pcolor":"Temp"},{"source":36,"target":3,"value":1,"pcolor":"Temp"},{"source":36,"target":30,"value":1,"pcolor":"Temp"},{"source":38,"target":13,"value":1,"pcolor":"Temp"},{"source":38,"target":14,"value":1,"pcolor":"Temp"},{"source":38,"target":20,"value":1,"pcolor":"Temp"},{"source":38,"target":5,"value":1,"pcolor":"Temp"},{"source":38,"target":23,"value":1,"pcolor":"Temp"},{"source":38,"target":29,"value":1,"pcolor":"Temp"},{"source":33,"target":12,"value":1,"pcolor":"Temp"},{"source":33,"target":16,"value":1,"pcolor":"Temp"},{"source":33,"target":17,"value":2,"pcolor":"Temp"},{"source":33,"target":18,"value":1,"pcolor":"Temp"},{"source":33,"target":8,"value":1,"pcolor":"Temp"},{"source":33,"target":19,"value":1,"pcolor":"Temp"},{"source":33,"target":24,"value":1,"pcolor":"Temp"},{"source":33,"target":6,"value":1,"pcolor":"Temp"},{"source":33,"target":26,"value":1,"pcolor":"Temp"},{"source":33,"target":27,"value":1,"pcolor":"Temp"},{"source":33,"target":7,"value":1,"pcolor":"Temp"},{"source":31,"target":11,"value":1,"pcolor":"Temp"},{"source":31,"target":15,"value":1,"pcolor":"Temp"},{"source":31,"target":16,"value":1,"pcolor":"Temp"},{"source":31,"target":21,"value":1,"pcolor":"Temp"},{"source":31,"target":24,"value":1,"pcolor":"Temp"},{"source":31,"target":0,"value":3,"pcolor":"Temp"},{"source":35,"target":13,"value":1,"pcolor":"Temp"},{"source":35,"target":1,"value":1,"pcolor":"Temp"},{"source":34,"target":28,"value":1,"pcolor":"Temp"},{"source":34,"target":29,"value":1,"pcolor":"Temp"},{"source":4,"target":2,"value":1,"pcolor":"Temp"},{"source":9,"target":2,"value":1,"pcolor":"Temp"},{"source":10,"target":2,"value":1,"pcolor":"Temp"},{"source":11,"target":2,"value":1,"pcolor":"Temp"},{"source":12,"target":2,"value":1,"pcolor":"Temp"},{"source":13,"target":2,"value":2,"pcolor":"Temp"},{"source":14,"target":2,"value":1,"pcolor":"Temp"},{"source":15,"target":2,"value":2,"pcolor":"Temp"},{"source":16,"target":2,"value":3,"pcolor":"Temp"},{"source":17,"target":2,"value":3,"pcolor":"Temp"},{"source":18,"target":2,"value":1,"pcolor":"Temp"},{"source":8,"target":2,"value":2,"pcolor":"Temp"},{"source":19,"target":2,"value":1,"pcolor":"Temp"},{"source":20,"target":2,"value":1,"pcolor":"Temp"},{"source":21,"target":2,"value":1,"pcolor":"Temp"},{"source":22,"target":2,"value":3,"pcolor":"Temp"},{"source":5,"target":2,"value":1,"pcolor":"Temp"},{"source":23,"target":2,"value":1,"pcolor":"Temp"},{"source":24,"target":2,"value":3,"pcolor":"Temp"},{"source":3,"target":2,"value":1,"pcolor":"Temp"},{"source":6,"target":2,"value":1,"pcolor":"Temp"},{"source":25,"target":2,"value":1,"pcolor":"Temp"},{"source":26,"target":2,"value":2,"pcolor":"Temp"},{"source":27,"target":2,"value":1,"pcolor":"Temp"},{"source":0,"target":2,"value":4,"pcolor":"Temp"},{"source":7,"target":2,"value":2,"pcolor":"Temp"},{"source":1,"target":2,"value":1,"pcolor":"Temp"},{"source":28,"target":2,"value":1,"pcolor":"Temp"},{"source":29,"target":2,"value":3,"pcolor":"Temp"},{"source":30,"target":2,"value":1,"pcolor":"Temp"}]
//    };

//    var graph = {
//    	    "nodes":[{"name":"AP 2 ","group":2,"size":10.5857740586},{"name":"AP 25","group":2,"size":10.0836820084},{"name":"John Smith","group":3,"size":25.0},{"name":"AP 40","group":2,"size":10.0836820084},{"name":"AP 49","group":2,"size":10.0836820084},{"name":"AP 61","group":2,"size":10.0836820084},{"name":"AP 62","group":2,"size":10.0836820084},{"name":"AP 7 ","group":2,"size":10.2510460251},{"name":"AP 72","group":2,"size":10.2510460251},{"name":"AP 90","group":2,"size":10.2510460251}],
//    	    "links":[{"source":9,"target":2,"value":1,"pcolor":"Temp"},{"source":9,"target":5,"value":6,"pcolor":"Temp"},{"source":8,"target":2,"value":6,"pcolor":"Temp"},{"source":7,"target":2,"value":5,"pcolor":"Temp"},{"source":6,"target":2,"value":6,"pcolor":"Temp"},{"source":5,"target":2,"value":3,"pcolor":"Temp"},{"source":4,"target":2,"value":1,"pcolor":"Temp"},{"source":3,"target":2,"value":4,"pcolor":"Temp"},{"source":1,"target":2,"value":1,"pcolor":"Temp"},{"source":9,"target":5,"value":9,"pcolor":"Temp"},{"source":9,"target":4,"value":19,"pcolor":"Temp"},{"source":9,"target":3,"value":20,"pcolor":"Temp"},{"source":8,"target":3,"value":1,"pcolor":"Temp"},{"source":8,"target":0,"value":1,"pcolor":"Temp"}]
//    	    };
//

        var graph = selectedForceData;


        var link = svg.selectAll(".link").append("svg:g")
                .data(graph.links)
                .enter().append("line")
                .attr("class", function(d) {
                    return "link " + d.pcolor;
                })
                .attr("marker-end", "url(#arrow)")
                // .style("stroke-width", function(d) { return Math.sqrt(d.value); });
                .style("stroke-width", 1.5);

        // var path = svg.append("svg:g").selectAll("path")
        // .data(force.links())
        // .enter().append("svg:path")
        // .attr("class", "link")
        // .attr("marker-end", "url(#arrow)" )
        // .style("stroke-width", function(d) { return Math.sqrt(d.value); });

        var node = svg.selectAll(".node")
                .data(graph.nodes)
                .enter().append("circle")
                .attr("class", "node")
                .attr("r", function(d) {
                    return (d.size) || 10;
                })
                .style("fill", function(d) {
                    return color(d.group);
                })
                .call(force.drag);

        node.append("title")
                .text(function(d) {
                    return createTooltip(d.name);
                });

//    	 node.append("title")
//         .text(createTooltip(d.name));

        force
                .nodes(graph.nodes)
                .links(graph.links)
                .on("tick", tick)
                .start();

        // Per-type markers, as they don't inherit styles.
        svg.append("svg:defs").selectAll("marker")
                .data(["suit", "licensing", "resolved"])
                .enter().append("svg:marker")
                .attr("id", "arrow")
                .attr("viewBox", "0 -5 10 10")
                .attr("refX", 50)
                .attr("refY", 0)
                .attr("markerWidth", 5)
                .attr("markerHeight", 5)
                .attr("orient", "auto")
                .append("svg:path")
                .attr("d", "M0,-5L10,0L0,5")
                .attr("fill", "#666666");



        var text = svg.append("svg:g").selectAll("g")
                .data(force.nodes())
                .enter().append("svg:g");

        // A copy of the text with a thick white stroke for legibility.
        text.append("svg:text")
                .attr("x", 15)
                .attr("y", ".31em")
                .attr("class", "shadow")
                .text(function(d) {
                    return d.name;
                });

        text.append("svg:text")
                .attr("x", 15)
                .attr("y", ".31em")
                .text(function(d) {
                    return d.name;
                });


        function tick() {

            node.attr("cx", function(d) {
                return d.x;
            })
                    .attr("cy", function(d) {
                        return d.y;
                    });

            text.attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")";
            });

            link.attr("x1", function(d) {
                return d.source.x;
            })
                    .attr("y1", function(d) {
                        return d.source.y;
                    })
                    .attr("x2", function(d) {
                        return d.target.x;
                    })
                    .attr("y2", function(d) {
                        return d.target.y;
                    });

            // path.attr("d", function(d) {
            // var dx = d.target.x - d.source.x,
            // dy = d.target.y - d.source.y,
            // dr = Math.sqrt(dx * dx + dy * dy);
            // return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;});
        }

        function createTooltip(name) {
            var targetIndex = 0;
            var totalAmount = 0;
            var totalLink = 0;

            for (var i = 0; i < graph.nodes.length; i++) {
                if (name == graph.nodes[i].name) {
                    targetIndex = i;
                    break;
                }
            }

            for (var j = 0; j < graph.links.length; j++) {
                if (targetIndex == graph.links[j].target) {
                    totalLink++;
                    totalAmount = totalAmount + graph.links[j].amount;
                }
            }

            return "Name:" + name + "\n" + "Link:" + totalLink + "\n" + "Total Amount:" + totalAmount.toFixed(2);


        }


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