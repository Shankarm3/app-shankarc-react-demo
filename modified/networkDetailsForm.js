screens.networkDetailsForm = {
    providerId: "",
    memberId: "",
    providerIndexId: null,
    backScreen: "",
    selectedProviderPatientDetails: null,
    gridState: "collapse",
    chord_group_temp: "",
    peerChartData: null,
    providerName: "",
    selectedProviderRowData: null,
    peerChartLabel: "claim_count",
    providerforwardComment: "",
    filteredMapArray: [],
    distance: 1,
    daysToVisit: 30,
    initialize: function(param) {
        this.providerIndexId = param.id;
        this.selectedProviderRowData = param.rowData[param.id - 1];
        this.providerId = this.selectedProviderRowData.provider;
        this.memberId = this.selectedProviderRowData.memberId;
        this.providerName = this.selectedProviderRowData.provider_Name;
        screens.networkDetailsForm.drawScreen(param.id, param.rowData);
        screens.networkDetailsForm.drawNetworkAnalysisChart();
        screens.networkDetailsForm.populateChordChart();
        screens.networkDetailsForm.networkForceDirectedChart();
        screens.networkDetailsForm.populateChordHeatMapChart();
        screens.networkDetailsForm.peerChartComparision();
        screens.networkDetailsForm.drawMapChart(this.selectedProviderPatientDetails);
        screens.networkDetailsForm.bindFunctionality();
        $(".provider_source").html(this.selectedProviderRowData.source);
        $(".scoring_period").html(this.selectedProviderRowData.scoring_period);
        $(".provider_paid_amount_value").html(this.selectedProviderRowData.amount);
        this.backScreen = param.backScreen;
    },
    drawScreen: function(id, rowData, screenName) {

        var selectedProviderDetail = {};
        var selectedMemberDetail = {};
        if (globalvars.providerDataArrayViewArray) {
            for (var i = 0; i < globalvars.providerDataArrayViewArray.length; i++)
            {
                if (screens.networkDetailsForm.providerId == globalvars.providerDataArrayViewArray[i].providerId) {
                    selectedProviderDetail = globalvars.providerDataArrayViewArray[i];
                    break;
                }

            }
        }
        if (globalvars.memberDataArrayViewArray) {
            for (var i = 0; i < globalvars.memberDataArrayViewArray.length; i++)
            {
                if (screens.networkDetailsForm.memberId == globalvars.memberDataArrayViewArray[i].memberId) {
                    selectedMemberDetail = globalvars.memberDataArrayViewArray[i];
                    break;
                }

            }
        }
        if (globalvars.networkPatientDetails) {
            for (var i = 0; i < globalvars.networkPatientDetails.length; i++)
            {
                if (screens.networkDetailsForm.providerId == globalvars.networkPatientDetails[i].providerId) {
                    screens.networkDetailsForm.selectedProviderPatientDetails = globalvars.networkPatientDetails[i];
                    break;
                }

            }
        }
        if (globalvars.peerLineChartData) {
            for (var i = 0; i < globalvars.peerLineChartData.length; i++)
            {
                if (screens.networkDetailsForm.providerId == globalvars.peerLineChartData[i].providerId) {
                    peerChartData = globalvars.peerLineChartData[i];
                    break;
                }

            }
        }
        getSYNC('common/templates/provider_forward_template.html', function(data) {
            screens.networkDetailsForm.providerforwardComment = data;
        });
        getSYNC('common/templates/chord_group_list_template.html', function(data) {
            screens.networkDetailsForm.chord_group_temp = data;
        });
        //console.log(selectedProviderDetail);
        getSYNC('common/templates/screens/networkDetailsForm.html', function(data) {
            //log('loading memberDetailsForm template');
            globalvars.$contentcontainer.append($.nano(data, jQuery.extend(true, {}, selectedProviderDetail, globalvars.localResourceMap)));
        });

        getSYNC('common/templates/screens/networkDetailsFormSecondProvider.html', function(data) {
            log('loading memberDetailsForm template');
            $("#network_info_left").append($.nano(data, jQuery.extend(true, {}, selectedMemberDetail, globalvars.localResourceMap)));
        });

        charts.networkDetailsGuageChart({
            container: $("#risk_guage_chart_wrapper"),
            value: selectedProviderDetail.risk_score,
            title: 'Provider Risk Score'
        });

//        grids.providerFormClaimData.initialize({
//            gridDiv: $("#provider_form_claim_tab_table"),
//            onClick: function(id) {
//
//            }
//        });
        grids.networkFormClaimData.initialize({
            gridDiv: $("#provider_form_claim_tab_table"),
            gridData: globalvars.networkFormDataArray,
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
            max: 2000,
            values: [100, 1000],
            slide: function(event, ui) {
                var data = jQuery.extend({}, screens.networkDetailsForm.selectedProviderPatientDetails);
                var data1 = jQuery.extend({}, screens.networkDetailsForm.selectedProviderPatientDetails);
                var provArray = [];
                provArray.push(data.patientDetails[0]);
                for (var i = 1; i < data.patientDetails.length; i++) {
                    var amount = parseInt(data.patientDetails[i].amount.substring(1));
                    if (amount >= parseInt(ui.values[ 0 ]) && amount <= parseInt(ui.values[ 1 ])) {
                        provArray.push(data.patientDetails[i]);
                    }
                }
                // console.log(provArray);
                data1['patientDetails'] = provArray;
                $("#amount").val("$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ]);
                screens.networkDetailsForm.drawMapChart(data1);
            }
        });

        $("#slider-range1").slider({
            range: false,
            min: 0,
            max: 100,
            values: [30],
            slide: function(event, ui) {
                $("#days").val("Past " + (ui.values[ 0 ]) + " days");
                screens.networkDetailsForm.daysToVisit = parseInt(ui.values[0]);
                screens.networkDetailsForm.drawMapChart(screens.networkDetailsForm.filteredMapArray);

            }
        });
        $("#slider-range2").slider({
            range: false,
            min: 0,
            max: 20,
            values: [1],
            slide: function(event, ui) {
                $("#distance").val(" " + (ui.values[ 0 ]) + " mi");
                screens.networkDetailsForm.distance = ui.values[ 0 ];
                screens.networkDetailsForm.drawMapChart(screens.networkDetailsForm.filteredMapArray);
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

        $("#back_network_detail_img").bind("click", function() {
            screens.networkDetailsForm.closeproviderDetails();
        });
        $("#back_network_detail_label").bind("click", function() {
            screens.networkDetailsForm.closeproviderDetails();
        });


        $('.claim_arrow_right').click(function() {
            $('.display_content_claim').toggleClass('display_content_claim_show');
        });

        $('#create_case').click(function() {
        	var fromPage = "network";
            dialogs.createCaseDialog.open(fromPage);
        });

        $('#release_provider').click(function() {
            dialogs.releaseProviderDialog.open();
        });
        $(document).on("click", "label.expand_view_style", function() {
            var id = $(this).parent().parent().attr('id');
            //console.log(id);
            if (screens.networkDetailsForm.gridState == "collapse") {
                $('#p_' + id + '_t').css('height', 'auto');
                grids.networkFormClaimSubGridData.gridDiv.jqGrid('setGridHeight', 'auto');
                screens.networkDetailsForm.gridState = "expand";
                $('#' + id + '_t_label').text("Collapse to view less");
            }
            else {
                $('#p_' + id + '_t').css('height', '130px');
                grids.networkFormClaimSubGridData.gridDiv.jqGrid('setGridHeight', 85);
                screens.networkDetailsForm.gridState = "collapse";
                $('#' + id + '_t_label').text("Expand to view more");

            }
        });
        $("#forward_provider").click(function() {
            // dialogs.messageDialog.show({"text": "Provider has been forwarded Successfully!"});
            var provider = {};
            provider.providerId = screens.networkDetailsForm.providerId;
            $('#provider_forward_wrapper .claim_decline_row').remove();
            $('#provider_forward_wrapper').append($.nano(screens.networkDetailsForm.providerforwardComment, provider));
            dialogs.providerForwardDialog.open({"refreshView": "forward"});
        });
        $("#link_case").click(function() {
            dialogs.messageDialog.show({"text": "Provider has been linked Successfully!"});
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

        $("#sort_provider_type").change(function() {
            screens.networkDetailsForm.peerChartLabel = $(this).val();
            screens.networkDetailsForm.peerChartComparision();

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
        screens.networkDetailsForm.filteredMapArray = abc;
        // alert(selectedProviderPatientDetails);
        var image1 = 'common/images/Red Ball.png';
        var image2 = 'common/images/Brown Ball.png';
        var image3 = 'common/images/Brown Ball1.png';
        var image4 = 'common/images/Brown Ball2.png';
        var image5 = 'common/images/Brown Ball3.png';
        var image6 = 'common/images/Brown Ball4.png';
        var image7 = 'common/images/Purple Ball.png';
        var data = [];
        var dataProvider = abc;

        var currDate = new Date();
        var filterDate = currDate.setDate(currDate.getDate() - screens.networkDetailsForm.daysToVisit);
        var distance = parseInt(screens.networkDetailsForm.distance);
        var provArray = abc.patientDetails;
        for (var j = 0; j < provArray.length; j++) {
            ;
            var dateArray = provArray[j].visit_date.split("-");
            var newDate = new Date(dateArray[2], dateArray[1], dateArray[0]);
            if (newDate >= filterDate && parseInt(provArray[j].distance) >= distance) {
                data.push(provArray[j]);
            }
        }
        $('#map_patient_count').text(data.length * 7);

        var myLatLng = new google.maps.LatLng(dataProvider.geoCodeX, dataProvider.geoCodeY);
        var mapOptions = {
            zoom: 11,
            center: myLatLng,
            disableDefaultUI: true,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById('map_container'), mapOptions);
        google.maps.event.trigger(map, "resize");
        jQuery('#tabs,#map_container').tabs({
            activate: function(event, ui) {
                //google.maps.event.trigger(map, "resize");
                screens.networkDetailsForm.distance = 1;
                screens.networkDetailsForm.daysToVisit = 30;
                lastCenter = map.getCenter();
                google.maps.event.trigger(map_container, 'resize');
                map.setCenter(lastCenter);
                var data = jQuery.extend({}, screens.networkDetailsForm.selectedProviderPatientDetails);
                var data1 = jQuery.extend({}, screens.networkDetailsForm.selectedProviderPatientDetails);
                var provArray = [];
                for (var i = 0; i < data.patientDetails.length; i++) {
                    var amount = parseInt(data.patientDetails[i].amount.substring(1));
                    var currDate = new Date();
                    var filterDate = currDate.setDate(currDate.getDate() - screens.networkDetailsForm.daysToVisit);
                    //var distance = parseInt($("#slider-range2").slider("values", 0));
                    var dateArray = data.patientDetails[i].visit_date.split("-");
                    var newDate = new Date(dateArray[2], dateArray[1], dateArray[0]);
                    if (amount >= 100 && amount <= 1000 && newDate >= filterDate && parseInt(data.patientDetails[i].distance) >= screens.networkDetailsForm.distance) {
                        provArray.push(data.patientDetails[i]);
                    }
                }
                // console.log(provArray);
                $('#map_patient_count').text(provArray.length * 7);
                data1['patientDetails'] = provArray;
                // $("#amount").val("$" + 155 + " - $" + 300);
                // screens.memberDetailsForm.drawMapChart(data1);
                screens.networkDetailsForm.drawMapChart(data1);
            }
        });

        var contentString = '<div id="contentTootltip" style="width:300px;height:80px">' +
                //'<h1 id="firstHeading" class="firstHeading">Provider 1</h1>' +
                '<div id="bodyContent"><table><tr><td style="width:120px;font-weight:bold;font-family:Arial;font-size:12px;"><b>Provider Id</b>:</td><td>' + dataProvider.providerId + '</td></tr><tr><td\n\
        style="width:120px;font-weight:bold;font-family:Arial;font-size:12px;" ><b>Specialty</b>:</td><td>' + dataProvider.Specialty + '</td></tr><tr><td\n\
        style="width:120px;font-weight:bold;font-family:Arial;font-size:12px;"><b>Risk Amount</b>:</td><td>' + dataProvider.amount + '</td></tr></table>' +
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
                    '<div id="bodyContent"><table><tr><td style="width:120px;font-weight:bold;font-family:Arial;font-size:12px;"><b>Provider Id</b>:</td><td>' + data[i].providerId + '</td></tr><tr><td\n\
        style="width:120px;font-weight:bold;font-family:Arial;font-size:12px;" ><b>Specialty</b>:</td><td>' + data[i].Specialty + '</td></tr><tr><td\n\
        style="width:120px;font-weight:bold;font-family:Arial;font-size:12px;"><b>Claim Amount</b>:</td><td>' + data[i].amount + '</td></tr></table>' +
                    '</div>' +
                    '</div>';
            var infowindow1 = null;
            var marker1 = null;
            infowindow1 = new google.maps.InfoWindow({
                content: '<div id="contentTootltip" style="width:250px;height:80px">' +
                        '<div id="bodyContent"><table><tr><td style="width:120px;font-weight:bold;font-family:Arial;font-size:12px;"><b><b>Provider Id</b>:</td><td>' + data[i].providerId + '</td></tr><tr><td\n\
        style="width:120px;font-weight:bold;font-family:Arial;font-size:12px;" ><b>Specialty</b>:</td><td>' + data[i].Specialty + '</td></tr><tr><td\n\
        style="width:120px;font-weight:bold;font-family:Arial;font-size:12px;"><b>Claim Amount</b>:</td><td>' + data[i].amount + '</td></tr></table>' +
                        '</div>' +
                        '</div>'
            });
            var image = "";
            var amount = parseInt(data[i].amount.substring(1));
            if (i == 0) {
                image = image7;
            } else {
                if (amount <= 200) {
                    image = image6;
                } else if (amount > 200 && amount <= 400) {
                    image = image5;
                } else if (amount > 400 && amount <= 600) {
                    image = image4;
                } else if (amount > 600 && amount <= 800) {
                    image = image3;
                } else {
                    image = image2;
                }
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

        var selectedProviderId = screens.networkDetailsForm.providerId;
        //log(selectedProviderId);
        var selectedNetworkChordData = {};

        if (selectedProviderId != "" && selectedProviderId != undefined) {
            for (var j = 0; j < globalvars.networkChartDataNetworkTab.length; j++) {
                if (selectedProviderId == globalvars.networkChartDataNetworkTab[j].providerId) {
                    selectedNetworkChordData = globalvars.networkChartDataNetworkTab[j].networkChordData;
                    break;
                }
            }
        }

        var showProviderIndex = 0;

        if (selectedNetworkChordData) {
            var pName = screens.networkDetailsForm.providerName.split("<br>");
            for (var i = 0; i < selectedNetworkChordData.networkChordLabelData.length; i++) {
                //log(pName[0]);
                if (selectedNetworkChordData.networkChordLabelData[i].name == pName[0]) {
                    showProviderIndex = i;
                }
            }
        }

        var matrix_data = selectedNetworkChordData.provider_matirx;
        var labels_data = selectedNetworkChordData.networkChordLabelData;
        var formatPercent = d3.format("r");

        // From http://mkweb.bcgsc.ca/circos/guide/tables/




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



        var data = {"provider": {
                "name": "Colin William", "entityType": "Provider", "x": 400, "y": 310, "fixed": true, "speciality": "Psychiatry", "amount": "$29,400", "riskScore": 94, "services":"Internal Medicine",
                "children": [
                    {
                        "name": "1290764", "entityType": "Claim", "amount": "$3,665", "riskScore": 94, "claimChildren": [], "claimDate": "10-02-2013", "children": [{"name": "Clara Smith", "entityType": "Patient", "riskScore": 55,
                                "gender": "F", "age": 39, "children": [
                                    {"name": "1212323", "entityType": "ClaimBlue", "amount": "$120", "riskScore": 45, "claimDate": "10-02-2013", "claimChildren": [], "children": [{"name": "Donald Nan", "size": 1, "entityType": "ProviderBlue", "speciality": "Psychiatry", "amount": "$20,120", "riskScore": 44, "services": "Practitioner"}]},
                                    {"name": "Claims(2)", "entityType": "ClaimBlue", "amount": "$330", "riskScore": 32, "claimDate": "10-02-2013", "claimChildren": [{"name": "1324221", "amount": "$120"}, {"name": "1324321", "amount": "$130"}], "children": [{"name": "Michael E", "size": 3, "entityType": "ProviderBlue", "speciality": "Psychiatry", "amount": "$20,120", "riskScore": 44, "services": "Practitioner"}]},
                                    {"name": "Claims(2)", "entityType": "ClaimBlue", "amount": "$430", "riskScore": 32, "claimDate": "10-07-2013", "claimChildren": [{"name": "2324221", "amount": "$220"}, {"name": "2324321", "amount": "$220"}], "children": [{"name": "Christopher E", "size": 3, "entityType": "ProviderBlue", "speciality": "Psychiatry", "amount": "$13,120", "riskScore": 44, "services": "Practitioner"}]},
                                    {"name": "Claims(2)", "entityType": "ClaimBlue", "amount": "$115", "riskScore": 32, "claimDate": "16-04-2013", "claimChildren": [{"name": "3324221", "amount": "$115"}, {"name": "3324321", "amount": "$115"}], "children": [{"name": "Patrick J", "size": 3, "entityType": "ProviderBlue", "speciality": "Psychiatry", "amount": "$11,090", "riskScore": 44, "services": "Practitioner"}]}									
                                ]
                            }
                        ]
                    },
                    {
                        "name": "2903262", "entityType": "Claim", "amount": "$2,084", "riskScore": 91, "claimChildren": [], "claimDate": "10-03-2013", "children": [{"name": "Tina Ray", "entityType": "Patient", "riskScore": 55,
                                "gender": "F", "age": 39, "children": [
                                    {"name": "1212323", "entityType": "ClaimBlue", "amount": "$450", "riskScore": 42, "claimDate": "10-02-2013", "claimChildren": [], "children": [{"name": "Sharon H", "size": 1, "entityType": "ProviderBlue", "speciality": "Psychiatry", "amount": "$20,120", "riskScore": 44, "services": "Practitioner"}]},
                                    {"name": "1234343", "entityType": "ClaimBlue", "amount": "$450", "riskScore": 45, "claimDate": "10-02-2013", "claimChildren": [], "children": [{"name": "Carlos A", "size": 3, "entityType": "ProviderBlue", "speciality": "Psychiatry", "amount": "$20,120", "riskScore": 44, "services": "Practitioner"}]},
                                    {"name": "1211133", "entityType": "ClaimBlue", "amount": "$450", "riskScore": 34, "claimDate": "10-02-2013", "claimChildren": [], "children": [{"name": "Andrea J", "size": 3, "entityType": "ProviderBlue", "speciality": "Psychiatry", "amount": "$20,120", "riskScore": 44, "services": "Practitioner"}]}
                                ]
                            }
                        ]
                    },
                    {
                        "name": "0992367", "entityType": "Claim", "amount": "$4,090", "riskScore": 90, "claimChildren": [], "claimDate": "10-04-2013", "children": [{"name": "Julian Hale", "entityType": "Patient", "riskScore": 55,
                                "gender": "F", "age": 43, "children": [
                                    {"name": "1212323", "entityType": "ClaimBlue", "amount": "$450", "riskScore": 45, "claimDate": "10-02-2013", "claimChildren": [], "children": [{"name": "Jan Anderson", "size": 1, "entityType": "ProviderBlue", "speciality": "Psychiatry", "amount": "$20,120", "riskScore": 44, "services": "Practitioner"}]},
                                    {"name": "1234343", "entityType": "ClaimBlue", "amount": "$450", "riskScore": 34, "claimDate": "10-02-2013", "claimChildren": [], "children": [{"name": "Josephine C", "size": 3, "entityType": "ProviderBlue", "speciality": "Psychiatry", "amount": "$20,120", "riskScore": 44, "services": "Practitioner"}]},
                                    {"name": "1211133", "entityType": "ClaimBlue", "amount": "$450", "riskScore": 45, "claimDate": "10-02-2013", "claimChildren": [], "children": [{"name": "Emily D", "size": 3, "entityType": "ProviderBlue", "speciality": "Psychiatry", "amount": "$20,120", "riskScore": 44, "services": "Practitioner"}]}
                                ]
                            }
                        ]
                    },
                    {
                        "name": "3278901", "entityType": "Claim", "amount": "$3,822", "riskScore": 89, "claimChildren": [], "claimDate": "10-05-2013", "children": [{"name": "Tina Smith", "entityType": "Patient", "riskScore": 55,
                                "gender": "F", "age": 23, "children": [
                                    {"name": "1212323", "entityType": "ClaimBlue", "amount": "$450", "riskScore": 43, "claimDate": "10-02-2013", "claimChildren": [], "children": [{"name": "Dana James", "size": 1, "entityType": "ProviderBlue", "speciality": "Psychiatry", "amount": "$20,120", "riskScore": 44, "services": "Practitioner"}]},
                                    {"name": "1234343", "entityType": "ClaimBlue", "amount": "$450", "riskScore": 45, "claimDate": "10-02-2013", "claimChildren": [], "children": [{"name": "Catherine K", "size": 3, "entityType": "ProviderBlue", "speciality": "Psychiatry", "amount": "$20,120", "riskScore": 44, "services": "Practitioner"}]},
                                    {"name": "1211133", "entityType": "ClaimBlue", "amount": "$450", "riskScore": 35, "claimDate": "10-02-2013", "claimChildren": [], "children": [{"name": "Marvin M", "size": 3, "entityType": "ProviderBlue", "speciality": "Psychiatry", "amount": "$20,120", "riskScore": 44, "services": "Practitioner"}]}
                                ]
                            }
                        ]
                    },
                    {
                        "name": "0192874", "entityType": "Claim", "amount": "$1,022", "riskScore": 87, "claimChildren": [], "claimDate": "10-06-2013", "children": [{"name": "Tim Ray", "entityType": "Patient", "riskScore": 55,
                                "gender": "F", "age": 39, "children": [
                                    {"name": "1212323", "entityType": "ClaimBlue", "amount": "$450", "riskScore": 45, "claimDate": "10-02-2013", "claimChildren": [], "children": [{"name": "Linda E", "size": 1, "entityType": "ProviderBlue", "speciality": "Psychiatry", "amount": "$20,120", "riskScore": 44, "services": "Practitioner"}]},
                                    {"name": "1234343", "entityType": "ClaimBlue", "amount": "$450", "riskScore": 39, "claimDate": "10-02-2013", "claimChildren": [], "children": [{"name": "Susie T", "size": 3, "entityType": "ProviderBlue", "speciality": "Psychiatry", "amount": "$20,120", "riskScore": 44, "services": "Practitioner"}]},
                                    {"name": "1211133", "entityType": "ClaimBlue", "amount": "$450", "riskScore": 38, "claimDate": "10-02-2013", "claimChildren": [], "children": [{"name": "Shirley W", "size": 3, "entityType": "ProviderBlue", "speciality": "Psychiatry", "amount": "$20,120", "riskScore": 44, "services": "Practitioner"}]}
                                ]
                            }
                        ]
                    },
                    {
                        "name": "4902711", "entityType": "Claim", "amount": "$2,030", "riskScore": 88, "claimChildren": [], "claimDate": "10-07-2013", "children": [{"name": "Hillary Smith", "entityType": "Patient", "riskScore": 55,
                                "gender": "F", "age": 54, "children": [
                                    {"name": "1212323", "entityType": "ClaimBlue", "amount": "$450", "riskScore": 48, "claimDate": "10-02-2013", "claimChildren": [], "children": [{"name": "Greg M", "size": 1, "entityType": "ProviderBlue", "speciality": "Psychiatry", "amount": "$20,120", "riskScore": 44, "services": "Practitioner"}]},
                                    {"name": "1234343", "entityType": "ClaimBlue", "amount": "$450", "riskScore": 38, "claimDate": "10-02-2013", "claimChildren": [], "children": [{"name": "Romona Ray", "size": 3, "entityType": "ProviderBlue", "speciality": "Psychiatry", "amount": "$20,120", "riskScore": 44, "services": "Practitioner"}]},
                                    {"name": "1211133", "entityType": "ClaimBlue", "amount": "$450", "riskScore": 37, "claimDate": "10-02-2013", "claimChildren": [], "children": [{"name": "Ricardo Smith", "size": 3, "entityType": "ProviderBlue", "speciality": "Psychiatry", "amount": "$20,120", "riskScore": 44, "services": "Practitioner"}]}
                                ]
                            }
                        ]
                    },
                    {
                        "name": "0908236", "entityType": "Claim", "amount": "$5,411", "riskScore": 89, "claimChildren": [], "claimDate": "10-08-2013", "children": [{"name": "Cathy Sam", "entityType": "Patient", "riskScore": 55,
                                "gender": "F", "age": 39, "children": [
                                    {"name": "1212323", "entityType": "ClaimBlue", "amount": "$450", "riskScore": 47, "claimDate": "10-02-2013", "claimChildren": [], "children": [{"name": "Andrew H", "size": 1, "entityType": "ProviderBlue", "speciality": "Psychiatry", "amount": "$20,120", "riskScore": 44, "services": "Practitioner"}]},
                                    {"name": "1234343", "entityType": "ClaimBlue", "amount": "$450", "riskScore": 43, "claimDate": "10-02-2013", "claimChildren": [], "children": [{"name": "Carlee Heal", "size": 3, "entityType": "ProviderBlue", "speciality": "Psychiatry", "amount": "$20,120", "riskScore": 44, "services": "Practitioner"}]},
                                    {"name": "1211133", "entityType": "ClaimBlue", "amount": "$450", "riskScore": 34, "claimDate": "10-02-2013", "claimChildren": [], "children": [{"name": "Thomas D", "size": 3, "entityType": "ProviderBlue", "speciality": "Psychiatry", "amount": "$20,120", "riskScore": 44, "services": "Practitioner"}]}
                                ]
                            }
                        ]
                    },
                    {
                        "name": "9146789", "entityType": "Claim", "amount": "$2,246", "riskScore": 90, "claimChildren": [], "claimDate": "10-08-2013", "children": [{"name": "Monica Lee", "entityType": "Patient", "riskScore": 55,
                                "gender": "F", "age": 39, "children": [
                                    {"name": "1212323", "entityType": "ClaimBlue", "amount": "$450", "riskScore": 47, "claimDate": "10-02-2013", "claimChildren": [], "children": [{"name": "Matt Black", "size": 1, "entityType": "ProviderBlue", "speciality": "Psychiatry", "amount": "$20,120", "riskScore": 44, "services": "Practitioner"}]},
                                    {"name": "1234343", "entityType": "ClaimBlue", "amount": "$450", "riskScore": 34, "claimDate": "10-02-2013", "claimChildren": [], "children": [{"name": "Carmen June", "size": 3, "entityType": "ProviderBlue", "speciality": "Psychiatry", "amount": "$20,120", "riskScore": 44, "services": "Practitioner"}]},
                                    {"name": "1211133", "entityType": "ClaimBlue", "amount": "$450", "riskScore": 32, "claimDate": "10-02-2013", "claimChildren": [], "children": [{"name": "Darron Ray", "size": 3, "entityType": "ProviderBlue", "speciality": "Psychiatry", "amount": "$20,120", "riskScore": 44, "services": "Practitioner"}]}
                                ]
                            }
                        ]
                    },
//                    {
//                        "name": "0208652", "entityType": "Claim", "amount": "$1,088", "riskScore": 92, "claimChildren": [], "claimDate": "10-08-2013", "children": [{"name": "Martina Pipkin", "entityType": "Patient", "riskScore": 55,
//                                "gender": "F", "age": 39, "children": [
//                                    {"name": "1212323", "entityType": "ClaimBlue", "amount": "$450", "riskScore": 40, "claimDate": "10-02-2013", "claimChildren": [], "children": [{"name": "Brian Smith", "size": 1, "entityType": "ProviderBlue", "speciality": "Psychiatry", "amount": "$20,120", "riskScore": 44, "services": "Practitioner"}]},
//                                    {"name": "1234343", "entityType": "ClaimBlue", "amount": "$450", "riskScore": 43, "claimDate": "10-02-2013", "claimChildren": [], "children": [{"name": "Mary June", "size": 3, "entityType": "ProviderBlue", "speciality": "Psychiatry", "amount": "$20,120", "riskScore": 44, "services": "Practitioner"}]},
//                                    {"name": "1211133", "entityType": "ClaimBlue", "amount": "$450", "riskScore": 34, "claimDate": "10-02-2013", "claimChildren": [], "children": [{"name": "Chris Samy", "size": 3, "entityType": "ProviderBlue", "speciality": "Psychiatry", "amount": "$20,120", "riskScore": 44, "services": "Practitioner"}]}
//                                ]
//                            }
//                        ]
//                    },
                    {
                        "name": "Claims(2)", "entityType": "Claim", "amount": "$5,110", "riskScore": 91, "claimDate": "10-08-2013", "claimChildren": [{"name": "2789365", "amount": "$120"}, {"name": "2356876", "amount": "$130"}], "children": [{"name": "Christina May", "entityType": "Patient", "riskScore": 55,
                                "gender": "F", "age": 39, "children": [
                                    {"name": "1212323", "entityType": "ClaimBlue", "amount": "$450", "riskScore": 45, "claimDate": "10-02-2014", "claimChildren": [], "children": [{"name": "James S", "size": 1, "entityType": "ProviderBlue", "speciality": "Psychiatry", "amount": "$20,120", "riskScore": 44, "services": "Practitioner"}]},
                                    {"name": "1234343", "entityType": "ClaimBlue", "amount": "$450", "riskScore": 35, "claimDate": "12-02-2013", "claimChildren": [], "children": [{"name": "Otis B", "size": 3, "entityType": "ProviderBlue", "speciality": "Psychiatry", "amount": "$20,120", "riskScore": 44, "services": "Practitioner"}]},
                                    {"name": "1211133", "entityType": "ClaimBlue", "amount": "$450", "riskScore": 30, "claimDate": "10-02-2013", "claimChildren": [], "children": [{"name": "Ron Jacob", "size": 3, "entityType": "ProviderBlue", "speciality": "Psychiatry", "amount": "$20,120", "riskScore": 44, "services": "Practitioner"}]},
                                    {"name": "5211133", "entityType": "ClaimBlue", "amount": "$350", "riskScore": 30, "claimDate": "15-02-2015", "claimChildren": [], "children": [{"name": "Jack H", "size": 3, "entityType": "ProviderBlue", "speciality": "Psychiatry", "amount": "$15,020", "riskScore": 44, "services": "Practitioner"}]},
                                    {"name": "6211133", "entityType": "ClaimBlue", "amount": "$420", "riskScore": 30, "claimDate": "15-02-2016", "claimChildren": [], "children": [{"name": "Freddy William", "size": 3, "entityType": "ProviderBlue", "speciality": "Psychiatry", "amount": "$10,020", "riskScore": 44, "services": "Practitioner"}]}									
                                ]
                            }
                        ]
                    }
                ]},
            "providerRef": {"name": "John Black", "entityType": "ProviderRef", "x": 700, "y": 310, "fixed": true, "speciality": "Psychiatry", "amount": "$29,400","services":"Practitioner","riskScore": 91, "children": [
                    {"name": "1212323", "entityType": "ClaimBlue", "amount": "$450", "riskScore": 47, "claimDate": "10-02-2013", "claimChildren": [], "children": [{"name": "John William", "size": 1, "entityType": "ProviderBlue", "speciality": "Psychiatry"}]},
                    {"name": "1234343", "entityType": "ClaimBlue", "amount": "$450", "riskScore": 43, "claimDate": "10-02-2013", "claimChildren": [], "children": [{"name": "Ray Heal", "size": 3, "entityType": "ProviderBlue", "speciality": "Psychiatry"}]},
                    {"name": "1211133", "entityType": "ClaimBlue", "amount": "$450", "riskScore": 34, "claimDate": "10-02-2013", "claimChildren": [], "children": [{"name": "Mary June", "size": 3, "entityType": "ProviderBlue", "speciality": "Psychiatry"}]}
                ]}
        };
        nodeCollepse(data.provider);
        nodeCollepseRef(data.providerRef);
        var nodes = [];
        var links = [];
        var currentNode = null;

        buildData();
        function nodeCollepseRef(node) {
            if (node.children) {
                $.each(node.children, function(i, item) {
                    nodeCollepse(item);
                    item._children = item.children;
                    item.children = null;
                    item.fixed = true;
                    //console.log(this);
                });
                node._children = node.children;
                node.children = null;
            }
        }
        function nodeCollepse(node) {
            if (node.children) {
                $.each(node.children, function(i, item) {
                    nodeCollepse(item);
                    item._children = item.children;
                    item.children = null;
                    item.fixed = true;
                    //console.log(this);
                });
            }
        }
        function buildData() {
            nodes = [];
            links = [];
            var radius = 40;
            var obj = data.provider;
            obj.iid = 0;
            obj.pId = 0;
            obj.radius = radius;
            nodes.push(obj);
            var obj1 = data.providerRef;
            obj1.iid = 1;
            obj1.pId = 0;
            obj1.radius = radius;
            obj1.type = 3;
            obj1.radius = radius;
            nodes.push(obj1);
            var child = data.provider.children || data.provider._children;
            var n = child.length;
            var mid = (obj.x + obj1.x) / 2;
            var start = obj.y - radius * ((n - 1) / 2);
            for (var i = 0; i < child.length; i++) {
                var obj2 = child[i];
                obj2.iid = i + 2;
                obj2.pId = 0;
                obj2.x = mid;
                obj2.fixed = true;
                obj2.radius = radius;
                obj2.y = start + radius * i;
                obj2.flag = false;
                nodes.push(obj2);
                var link = new Object();
                link.source = 0;
                link.target = obj2.iid;
                link.value = 1;
                links.push(link);
                link = new Object();
                link.source = obj2.iid;
                link.target = 1;
                link.value = 1;
                links.push(link);
            }
        }
//        		var width = 960,
//                height = 1000;

        var realWidth = 960;
        var realHeight = 1000;
        var m = [40, 240, 40, 240];
        var width = realWidth - m[0] - m[0];
        var height = realHeight - m[0] - m[2];


        var force = d3.layout.force()
                .charge(-120)
                .linkDistance(30)
                .size([width, height]);
        var drag = force.drag()
                .on("dragstart", dragstart);
        var svg = d3.select("#graph").append("svg")
                .attr("width", width)
                .attr("height", height)
                .call(d3.behavior.zoom()
                        .scaleExtent([0.4, 3])
                        .on("zoom", function() {
                            svg.attr("transform", "translate(" + d3.event.translate +
                                    ")scale(" + d3.event.scale + ")");
                        }))
                .append('svg:g');
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
        var node = svg.selectAll(".node"),
                link = svg.selectAll(".link");
        update();
        function update() {

            $('.node').find('image').remove();
            // alert(nodes.length + "---" + links.length);
            // Update links.
            link = link.data(links);
            link.exit().remove();
            link.enter().insert("line", ".node")
                    .attr("class", "link").attr("marker-end", "url(#end)");
            //alert(node.toSource())
            node = node.data(nodes);
            node.exit().remove();
            force.nodes(nodes)
                    .links(links)
                    .start();
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
                        if (d.entityType == "Provider" || d.entityType == "Patient" || d.entityType == "ProviderBlue" || d.entityType == "ProviderRef") {
                            return d.name;
                        } else {
                            return d.riskScore + "%";
                        }

                    });
            force.on("tick", function() {
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
            });
            node.append("image")
                    .attr("xlink:href", function(d) {
                        //console.log(d.toSource());
                        if (d.entityType == "Provider" || d.entityType == "ProviderRef")
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
                    }).attr("x", -8)
                    .attr("y", -8)
                    .attr("width", 20)
                    .attr("height", 20)
                    .on('contextmenu', function(data, index) {
                        currentNode = null;
                        currentNode = data;
                        console.log(data);
                        if (data._children == undefined && data.children == null) {
                        }
                        else {
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
            //.call(drag);

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
//Toggle children on click.
        function click(d) {
            if (d.entityType !== 'Provider') {
                // alert(d.toSource());
                if (d3.event.defaultPrevented)
                    return; // ignore drag
                if (d.children) {
                    d._children = d.children;
                    d.children = null;
                    collopse(d);
                } else {
                    d.children = d._children;
                    d._children = null;
                    expand(d);
                }
                update();
            }
        }

        function collapseSingle(d) {
            if (d.entityType !== 'Provider') {
                d._children = d.children;
                d.children = null;
                collopse(d);
            }
            update();
        }

        function expandSingle(d) {

            if (d.entityType !== 'Provider') {
                d.children = d._children;
                d._children = null;
                expand(d);
            }
            update();
        }

        function expandAll(node) {
            //alert("node::" + node.toSource());
            if (node._children) {
                node.children = node._children;
                node._children = null;
                expand(node);
                $.each(node.children, function(i, item) {
                    expandAll(item);
                    //item._children = null;
                    //console.log(this);

                });
            }
            else if (node.children) {
                //alert("hi"+node.toSource());
                $.each(node.children, function(i, item) {
                    expandAll(item);
                });
            }
        }

        function collapseAll(node) {
            //alert("node::" + node.toSource());
            if (node.children) {
                node._children = node.children;
                node.children = null;
                collopse(node);
                $.each(node._children, function(i, item) {
                    collapseAll(item);
                    //item._children = null;
                    //console.log(this);

                });
            }
        }
        function expand(d) {
            if (d.children) {
                if (d.entityType == "Claim" || d.entityType == "ClaimBlue") {
                    var obj2 = d.children[0];
                    obj2.iid = nodes.length;
                    obj2.pId = d.iid;
                    if (d.entityType == "Claim") {
                        if (d.index % 2 == 0) {
                            obj2.x = d.x + d.radius;
                            obj2.type = 0;
                        } else {
                            obj2.type = 1;
                            obj2.x = d.x - d.radius;
                        }
                    } else {
                        if (d.type === 3) {
                            obj2.x = d.x + d.radius;
                            obj2.type = 3;
                        } else
                        if (d.type % 2 == 0) {
                            obj2.x = d.x + d.radius;
                            obj2.type = 0;
                        } else {
                            obj2.type = 1;
                            obj2.x = d.x - d.radius;
                        }
                    }
                    obj2.fixed = true;
                    obj2.radius = d.radius;
                    if (d.type === 3) {
                        obj2.y = d.y;
                    } else
                    if (data.provider.y < d.y) {
                        obj2.y = d.y + d.radius;
                    } else {
                        obj2.y = d.y - d.radius;
                    }
                    nodes.push(obj2);
                    var link = new Object();
                    link.source = d.iid;
                    link.target = obj2.iid;
                    link.value = 1;
                    links.push(link);
                    if (obj2.children) {
                        //   alert(obj2.children.length);
                        recusiveNode(obj2);
                    }

                } else if (d.entityType == "Patient") {
                    for (var i = 0; i < d.children.length; i++) {
                        var obj2 = d.children[i];
                        obj2.iid = nodes.length;
                        obj2.pId = d.iid;
                        if (d.type % 2 == 0) {
                            obj2.x = d.x + d.radius * i;
                            obj2.type = 0;
                        } else {
                            obj2.x = d.x - d.radius * i;
                            obj2.type = 1;
                        }
                        obj2.fixed = true;
                        if (data.provider.y < d.y) {
                            obj2.y = d.y + d.radius;
                        } else {
                            obj2.y = d.y - d.radius;
                        }
                        obj2.radius = d.radius;
                        nodes.push(obj2);
                        var link = new Object();
                        link.source = d.iid;
                        link.target = obj2.iid;
                        link.value = 1;
                        links.push(link);
                        if (obj2.children) {
                            //   alert(obj2.children.length);
                            recusiveNode(obj2);
                        }
                    }
                } else if (d.entityType == "ProviderRef") {
                    for (var i = 0; i < d.children.length; i++) {
                        var obj2 = d.children[i];
                        obj2.iid = nodes.length;
                        obj2.pId = d.iid;
                        obj2.x = d.x + d.radius;
                        obj2.fixed = true;
                        if (data.provider.y < d.y) {
                            obj2.y = d.y + d.radius * i;
                        } else {
                            obj2.y = d.y - d.radius * i;
                        }
                        obj2.type = 3;
                        obj2.radius = d.radius;
                        nodes.push(obj2);
                        var link = new Object();
                        link.source = d.iid;
                        link.target = obj2.iid;
                        link.value = 1;
                        links.push(link);
                        if (obj2.children) {
                            //   alert(obj2.children.length);
                            recusiveNode(obj2);
                        }
                    }
                }
            }
        }
        function collopse(d) {
            buildData();
            var firstObj = data.provider.children || data.provider._children;
            for (var i = 0; i < firstObj.length; i++) {
                var secObj = firstObj[i];
                if (secObj.children) {
                    var obj2 = secObj.children[0];
                    obj2.iid = nodes.length;
                    obj2.pId = secObj.iid;
                    if (secObj.iid % 2 == 0) {
                        obj2.x = secObj.x + secObj.radius;
                        obj2.type = 0;
                    } else {
                        obj2.type = 1;
                        obj2.x = secObj.x - secObj.radius;
                    }

                    obj2.fixed = true;
                    if (data.provider.y < secObj.y) {
                        obj2.y = secObj.y + secObj.radius;
                    } else {
                        obj2.y = secObj.y - secObj.radius;
                    }
                    obj2.radius = secObj.radius;
                    nodes.push(obj2);
                    var link = new Object();
                    link.source = secObj.iid;
                    link.target = obj2.iid;
                    link.value = 1;
                    links.push(link);
                    if (obj2.children) {
                        //   alert(obj2.children.length);
                        recusiveNode(obj2);
                    }
                }
            }
            if (data.providerRef.children) {
                var child = data.providerRef;
                for (var i = 0; i < child.children.length; i++) {
                    var obj2 = child.children[i];
                    obj2.iid = nodes.length;
                    obj2.pId = child.iid;
                    obj2.x = child.x + child.radius;
                    obj2.type = 0;
                    obj2.fixed = true;
                    obj2.y = child.y + child.radius * i;
                    obj2.radius = child.radius;
                    nodes.push(obj2);
                    var link = new Object();
                    link.source = child.iid;
                    link.target = obj2.iid;
                    link.value = 1;
                    links.push(link);
                    if (obj2.children) {
                        recusiveNode(obj2);
                    }
                }
            }
        }
        function recusiveNode(child) {
            if (child.children) {
                if (child.entityType == "Claim" || child.entityType == "ClaimBlue") {
                    var obj2 = child.children[0];
                    obj2.iid = nodes.length;
                    obj2.pId = child.iid;
                    if (child.entityType == "Claim") {
                        if (child.index % 2 == 0) {
                            obj2.x = child.x + child.radius;
                            obj2.type = 0;
                        } else {
                            obj2.type = 1;
                            obj2.x = child.x - child.radius;
                        }
                    } else {
                        if (child.type === 3) {
                            obj2.x = child.x + child.radius;
                            obj2.type = 0;
                        } else
                        if (child.type % 2 == 0) {
                            obj2.x = child.x + child.radius;
                            obj2.type = 0;
                        } else {
                            obj2.type = 1;
                            obj2.x = child.x - child.radius;
                        }
                    }
                    obj2.fixed = true;
                    obj2.radius = child.radius;
                    if (child.type === 3) {
                        obj2.y = child.y;
                    } else
                    if (data.provider.y < child.y) {
                        obj2.y = child.y + child.radius;
                    } else {
                        obj2.y = child.y - child.radius;
                    }
                    nodes.push(obj2);
                    var link = new Object();
                    link.source = child.iid;
                    link.target = obj2.iid;
                    link.value = 1;
                    links.push(link);
                    if (obj2.children) {
                        recusiveNode(obj2);
                    }

                } else if (child.entityType == "Patient") {
                    for (var i = 0; i < child.children.length; i++) {
                        var obj2 = child.children[i];
                        obj2.iid = nodes.length;
                        obj2.pId = child.iid;
                        if (child.type % 2 == 0) {
                            obj2.x = child.x + child.radius * i;
                            obj2.type = 0;
                        } else {
                            obj2.x = child.x - child.radius * i;
                            obj2.type = 1;
                        }
                        obj2.fixed = true;
                        if (data.provider.y < child.y) {
                            obj2.y = child.y + child.radius;
                        } else {
                            obj2.y = child.y - child.radius;
                        }
                        obj2.radius = child.radius;
                        nodes.push(obj2);
                        var link = new Object();
                        link.source = child.iid;
                        link.target = obj2.iid;
                        link.value = 1;
                        links.push(link);
                        if (obj2.children) {
                            recusiveNode(obj2);
                        }
                    }
                } else if (d.entityType == "ProviderRef") {
                    for (var i = 0; i < d.children.length; i++) {
                        var obj2 = d.children[i];
                        obj2.iid = nodes.length;
                        obj2.pId = d.iid;
                        obj2.x = d.x + d.radius;
                        obj2.fixed = true;
                        if (data.provider.y < d.y) {
                            obj2.y = d.y + d.radius * i;
                        } else {
                            obj2.y = d.y - d.radius * i;
                        }
                        obj2.radius = d.radius;
                        nodes.push(obj2);
                        var link = new Object();
                        link.source = d.iid;
                        link.target = obj2.iid;
                        link.value = 1;
                        links.push(link);
                        if (obj2.children) {
                            //   alert(obj2.children.length);
                            recusiveNode(obj2);
                        }
                    }
                }
            }
        }
        function dragstart(d) {
            d3.select(this).classed("fixed", d.fixed = true);
        }
        function mover(d) {
            $("#node_details").show();
            // $("#pop-up").fadeOut(100, function() {
            if (d.entityType == 'Provider' || d.entityType == 'ProviderRef') {
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
            // $("#pop-up").fadeOut(50);
            $("#node_details").hide();
        }


        $('.testContext').click(function() {
            //console.log("test");
            if ($(this).text() == "Expand") {
                expandSingle(currentNode);
            }
            else if ($(this).text() == "Collapse") {
                collapseSingle(currentNode);
                //update();
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
    },
    populateChordHeatMapChart: function() {



        var selectedProviderId = screens.networkDetailsForm.providerId;

        var selectedHeatMapData = {};

        if (selectedProviderId != "" && selectedProviderId != undefined) {
            for (var j = 0; j < globalvars.networkHeatMapChartData2.length; j++) {
                if (selectedProviderId == globalvars.networkHeatMapChartData2[j].providerId) {
                    selectedHeatMapData = globalvars.networkHeatMapChartData2[j];
                    break;
                }
            }
        }

        var networkHeatMapPhysicianChartData = globalvars.networkPhyChartData;
        var refPhysicianList = networkHeatMapPhysicianChartData.mapRefPhysician;
        var perPhysicianList = networkHeatMapPhysicianChartData.mapPerPhysician;




        var findRow;
        var findColumn;

        for (var i = 0; i < refPhysicianList.length; i++) {
            if (refPhysicianList[i] == selectedHeatMapData.providerName) {
                findRow = i;
                break;
            }
        }

        for (var i = 0; i < perPhysicianList.length; i++) {
            if (perPhysicianList[i] == selectedHeatMapData.performerName) {
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
                    obj.value = parseInt(selectedHeatMapData.risk_score_matrix_pef[columIndex] * .60 + ((((m + 1) * (n + 1)) % 7) * 4));
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
                //.attr("class", function (d, i) { return "dayLabel mono axis axis-workweek"; });
                .attr("class", function(d, i) {
                    return ((i == findRow) ? "dayLabel mono axis axis-workweek-bold" : "dayLabel mono axis axis-workweek");
                });

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
                .attr("class", function(d, i) {
                    return ((i == findColumn) ? "timeLabel mono axis axis-worktime-bold" : "timeLabel mono axis axis-worktime");
                });
        //.attr("class", function(d, i) { return  "timeLabel mono axis axis-worktime" ;});

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



//       if (refPhysicianList != null) {
//
//           row = $('<tr><th></th></tr>');
//           for (var i = 0; i < refPhysicianList.length; i++) {
//               var row1 = $('<th></th>').text(refPhysicianList[i]);
//               row.append(row1);
//           }
//           $('#matrixView').append(row);
//
//
//           if (perPhysicianList != null) {
//               log("test");
//               var row;
//               for (var j = 0; j < perPhysicianList.length; j++) {
//                   row = $('<tr><td style="height:30px;vertical-align:middle">' + perPhysicianList[j] + '</td></tr>');
//
//                   for (var i = 0; i < refPhysicianList.length; i++) {
//                       var row1 = $('<td></td>').addClass('bg_grey');
//                       row.append(row1);
//                   }
//
//                   $('#matrixView').append(row);
//               }
//
//
//           }
//
//           var colorArray_ref = selectedHeatMapData.risk_score_matrix_ref;
//           var colorArray_pef = selectedHeatMapData.risk_score_matrix_pef;
//           var refPhysicianName = selectedHeatMapData.providerName;
//
//           var selectedIndex;
//           var findPhysician = $('#matrixView tr').eq(0);
//
//           $(findPhysician).find('th').each(function(index) {
//
//               if (refPhysicianName == $(this).text())
//                   selectedIndex = index;
//           });
//
//           $('#matrixView tr').each(function(index) {
//               log("test");
//               $(this).find('td').eq(selectedIndex).removeClass('bg_grey');
//               $(this).find('td').eq(selectedIndex).addClass(showColorCode(colorArray_ref[index - 1]));
//               $(this).find('td').eq(selectedIndex).attr('title', "Risk Score: " + colorArray_ref[index - 1]);
//           });
//
//           var selectedRow = $('#matrixView tr').eq(selectedIndex);
//
//           $(selectedRow).find('td').each(function(index) {
//               if ($(this).text() == "") {
//                   $(this).removeClass('bg_grey');
//                   $(this).addClass(showColorCode(colorArray_pef[index - 1]));
//                   $(this).attr('title', "Risk Score: " + colorArray_pef[index - 1]);
//               }
//           });
//
//
//
//       }
//
//
//
//       function showColorCode(code) {
//           if (code > 0 && code <= 50)
//               return "bg_green";
//           else if (code > 50 && code <= 80)
//               return "bg_orange";
//           else
//               return "bg_red";
//       }

    },
    peerChartComparision: function() {

        $('#peerChart').empty();
        var selectedProviderId = screens.networkDetailsForm.providerId;

        var selectedPeerChartData = {};
        var nationalAverageList = [];
        var regionalAverageList = [];
        if (selectedProviderId != "" && selectedProviderId != undefined) {
            for (var j = 0; j < globalvars.peerLineChartDataNetwork.length; j++) {
                if (selectedProviderId == globalvars.peerLineChartDataNetwork[j].providerId) {
                    selectedPeerChartData = globalvars.peerLineChartDataNetwork[j];
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
            if (screens.networkDetailsForm.peerChartLabel == "claim_count") {
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
            barChartData: selectedPeerChartData[screens.networkDetailsForm.peerChartLabel],
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
