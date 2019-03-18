var charts = {
    claimPieChart: {
        initialize: function(param) {

            Highcharts.setOptions({
                colors: ['#e67e0b', "#cccb33", '#2571c1', '#0b5a32', '#bf7cff']
            });

            var chart = new Highcharts.Chart({
                chart: {
                    renderTo: param.container,
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    backgroundColor: null,
                    height: 400,
                    width: 320,
                    marginRight: 0,
                    marginLeft: 0,
                    marginTop: 120


                },
                title: {
                    text: ''
                },
//            subtitle: {
//                text: 'test subtitle'
//            },
                credits: {enabled: false},
                legend: {
                    enabled: true,
                    layout: 'vertical',
                    align: 'left',
                    floating: false,
                    verticalAlign: 'top',
                    borderWidth: 0

                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        showInLegend: true,
                        dataLabels: {
                            enabled: true,
                            inside: true,
                            distance: -40,
                            color: 'white',
                            formatter: function() {
                                return this.y;
                            }
                        }
                    }

                },
                series: [{
                        type: 'pie',
                        name: 'Changes',
                        point: {
                            events: {
                                select: function(e) {
                                    //log(e.currentTarget.name);
                                    globalvars.selectedPieSerries = e.currentTarget.name;
                                    if (e.currentTarget.name == "Unbundling") {
                                        charts.claimSliderChart(globalUnbundlingData1, globalUnbundlingData2);
                                    } else if (e.currentTarget.name == "Provider Specialty - Procedure Mismatch") {
                                        charts.claimSliderChart(globalProvDiagMismatchData1, globalProvDiagMismatchData2);
                                    } else if (e.currentTarget.name == "Duplicate Claims") {
                                        charts.claimSliderChart(globalDuplicateClaimsData1, globalDuplicateClaimsData2);
                                    } else if (e.currentTarget.name == "Procedure - Diagnosis Mismatch") {
                                        charts.claimSliderChart(globalProcDiagMismatchData1, globalProcDiagMismatchData2);
                                    } else if (e.currentTarget.name == "Outlier Charges") {
                                        charts.claimSliderChart(globalRivalProcCodeData1, globalRivalProcCodeData2);
                                    }
                                },
                                unselect: function(e) {
                                    if (e.currentTarget.name == globalvars.selectedPieSerries)
                                        charts.claimSliderChart(globalAllData1, globalAllData2);
                                }
                            }
                        },
                        data: [
                            ['Outlier Charges', 5],
                            ['Provider Specialty - Procedure Mismatch', 30],
                            ['Procedure - Diagnosis Mismatch', 10],
                            ['Duplicate Claims', 20],
                            {
                                name: 'Unbundling',
                                y: 35,
                                sliced: true,
                                selected: true
                            }

                        ]
                    }]


            });

        }

    },
    providerDashPieChart: {
        initialize: function(param) {

            Highcharts.setOptions({
                colors: ['#e67e0b', "#cccb33", '#2571c1', '#0b5a32', '#bf7cff']
            });

            var chart = new Highcharts.Chart({
                chart: {
                    renderTo: param.container,
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    backgroundColor: null,
                    height: 400,
                    width: 320,
                    marginRight: 0,
                    marginLeft: 0,
                    marginTop: 120


                },
                title: {
                    text: ''
                },
//            subtitle: {
//                text: 'test subtitle'
//            },
                credits: {enabled: false},
                legend: {
                    enabled: true,
                    layout: 'vertical',
                    align: 'left',
                    floating: false,
                    verticalAlign: 'top',
                    borderWidth: 0

                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        showInLegend: true,
                        dataLabels: {
                            enabled: true,
                            inside: true,
                            distance: -40,
                            color: 'white',
                            formatter: function() {
                                return this.y;
                            }
                        }
                    }

                },
                series: [{
                        type: 'pie',
                        name: 'Changes',
                        point: {
                            events: {
                                select: function(e) {
                                    log(e.currentTarget.name);
                                    globalvars.selectedPieSerries = e.currentTarget.name;
                                    if (e.currentTarget.name == "Provider Fraud") {
                                        charts.providerSliderChart(globalUnbundlingData1, globalUnbundlingData2);
                                    } else if (e.currentTarget.name == "Network Fraud") {
                                        charts.providerSliderChart(globalProvDiagMismatchData1, globalProvDiagMismatchData2);
                                    } else if (e.currentTarget.name == "Member Fraud") {
                                        charts.providerSliderChart(globalDuplicateClaimsData1, globalDuplicateClaimsData2);
                                    }
                                },
                                unselect: function(e) {
                                    if (e.currentTarget.name == globalvars.selectedPieSerries)
                                        charts.providerSliderChart(globalAllData1, globalAllData2);
                                }
                            }
                        },
                        data: [
                            ['Network Fraud', 35],
                            ['Member Fraud', 25],
                            {
                                name: 'Provider Fraud',
                                y: 40,
                                sliced: true,
                                selected: true
                            }

                        ]
                    }]


            });

        }

    },
    workspacePiechart: {
        initialize: function(param) {

            Highcharts.setOptions({
                colors: ["#4f7eb6", '#b74f4b', '#9fbd61', "#8064a2"]
            });
            var data;
            if (param.value) {
                data = JSON.parse(param.value);
            }
            var chart = new Highcharts.Chart({
                chart: {
                    renderTo: param.container,
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    height: 206,
                    width: 350,
                    marginRight: 0,
                    marginLeft: 150,
                    marginTop: 30,
                    marginBottom: 40
                },
                title: {
                    text: 'Psychiatrist: Top Procedures Performed',
                    style: {
                        fontWeight: 'bold',
                        fontSize: '12px'
                    }
                },
                credits: {enabled: false},
                legend: {
                    enabled: true,
                    layout: 'vertical',
                    align: 'left',
                    floating: true,
                    verticalAlign: 'bottom',
                    borderWidth: 0,
                    itemStyle: {
                        cursor: 'pointer',
                        fontSize: '8px',
                        width: '150px'
                    }

                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        showInLegend: true,
                        dataLabels: {
                            enabled: true,
                            inside: true,
                            distance: -10,
                            color: 'black',
                            formatter: function() {
                                return this.y;
                            }
                        }

                    }

                },
                series: [{
                        type: 'pie',
                        name: 'Changes',
                        data: data
//                                [
//                            {
//                                name: 'Top Prodedure Medication Management',
//                                y: 25,
//                                sliced: true,
//                                selected: true
//                            },
//                            {
//                                name: '2nd Most Frequent Procedure Subsequent Hospital Care',
//                                y: 12,
//                                sliced: true,
//                                selected: true
//                            },
//                            ['All Others', 63],
//                            {
//                                name: 'Chiropractic Manipulation',
//                                y: 0.05,
//                                sliced: true,
//                                selected: true
//                            }
//
//                        ]
                    }]


            });

        }

    },
    claimGuageChart: function(param) {

        param.container.highcharts({
            chart: {
                type: 'gauge',
                plotBackgroundColor: null,
                plotBackgroundImage: null,
                plotBorderWidth: 0,
                plotShadow: false,
                margin: 0
            },
            title: {
                text: ''
            },
            credits: {enabled: false},
            exporting: {enabled: false},
            tooltip: {enabled: false},
            pane: {
                startAngle: -110,
                endAngle: 110,
                size: [10],
                center: ['50%', '50%'],
                background: [{
                        backgroundColor: '#fff',
                        borderWidth: 0
                    }, {
                        backgroundColor: '#fff',
                        borderWidth: 0
                    }, {
                        backgroundColor: '#fff',
                        borderWidth: 0
                    }, {
                        backgroundColor: '#fff',
                        borderWidth: 0
                    }]

            },
            plotOptions: {
                gauge: {
                    dial: {
                        baseWidth: 7,
                        backgroundColor: '#000000',
                        borderColor: '#000000',
                        borderWidth: 1,
                        rearLength: 0,
                        baseLength: 10,
                        radius: 80
                    },
                    pivot: {
                        radius: 5,
                        borderWidth: 2,
                        borderColor: '#000000',
                        backgroundColor: '#000000'
                    }
                }
            },
            // the value axis
            yAxis: {
                min: 0,
                max: 100,
                minorTickInterval: 'auto',
                minorTickWidth: 0,
                minorTickLength: 0,
                tickPixelInterval: 20,
                tickWidth: 0,
                tickPosition: 'inside',
                tickLength: 20,
                tickColor: '#666',
                labels: {
                    step: 2,
                    rotation: 0
                },
                title: {
                    // text: 'km/h'
                },
                plotBands: [{
                        from: 0,
                        to: 20,
                        color: '#779c38', // Blue Shade
                        thickness: '10'
                    },
                    {
                        from: 20,
                        to: 40,
                        color: '#779c38', // Blue Shade
                        thickness: '10'
                    }, {
                        from: 40,
                        to: 60,
                        color: '#DDDF0D', // yellow
                        thickness: '10'
                    },
                    {
                        from: 60,
                        to: 80,
                        color: '#DDDF0D', // yellow
                        thickness: '10'
                    }, {
                        from: 70,
                        to: 80,
                        color: '#DF5353', // red
                        thickness: '10'
                    },
                    {
                        from: 80,
                        to: 100,
                        color: '#DF5353', // red
                        thickness: '10'
                    }],
            },
            series: [{
                    name: 'Speed',
                    data: [param.value],
                    tooltip: {
                        valueSuffix: ' km/h'
                    },
                    dataLabels: {
                        enabled: false
                    }
                }]

        });

    },
    workSpaceGuageChart: function(param) {

        param.container.highcharts({
            chart: {
                type: 'gauge',
                plotBackgroundColor: null,
                plotBackgroundImage: null,
                plotBorderWidth: 0,
                plotShadow: false,
                margin: 0
            },
            title: {
                text: ''
            },
            credits: {enabled: false},
            exporting: {enabled: false},
            tooltip: {enabled: false},
            pane: {
                startAngle: -110,
                endAngle: 110,
                size: [18],
                center: ['50%', '65%'],
                background: [{
                        backgroundColor: '#fff',
                        borderWidth: 0
                    }, {
                        backgroundColor: '#fff',
                        borderWidth: 0
                    }, {
                        backgroundColor: '#fff',
                        borderWidth: 0
                    }, {
                        backgroundColor: '#fff',
                        borderWidth: 0
                    }]

            },
            plotOptions: {
                gauge: {
                    dial: {
                        baseWidth: 7,
                        backgroundColor: '#000000',
                        borderColor: '#000000',
                        borderWidth: 1,
                        rearLength: 0,
                        baseLength: 10,
                        radius: 80
                    },
                    pivot: {
                        radius: 5,
                        borderWidth: 2,
                        borderColor: '#000000',
                        backgroundColor: '#000000'
                    }
                }
            },
            // the value axis
            yAxis: {
                min: 0,
                max: 100,
                minorTickInterval: 'auto',
                minorTickWidth: 0,
                minorTickLength: 0,
                tickPixelInterval: 30,
                tickWidth: 0,
                tickPosition: 'inside',
                tickLength: 20,
                tickColor: '#666',
                labels: {
                    step: 2,
                    rotation: 0
                },
                title: {
                    // text: 'km/h'
                },
                plotBands: [{
                        from: 0,
                        to: 20,
                        color: '#779c38', // Blue Shade
                        thickness: '10'
                    },
                    {
                        from: 20,
                        to: 40,
                        color: '#779c38', // Blue Shade
                        thickness: '10'
                    }, {
                        from: 40,
                        to: 60,
                        color: '#DDDF0D', // yellow
                        thickness: '10'
                    },
                    {
                        from: 60,
                        to: 80,
                        color: '#DDDF0D', // yellow
                        thickness: '10'
                    }, {
                        from: 70,
                        to: 80,
                        color: '#DF5353', // red
                        thickness: '10'
                    },
                    {
                        from: 80,
                        to: 100,
                        color: '#DF5353', // red
                        thickness: '10'
                    }],
            },
            series: [{
                    name: 'Speed',
                    data: [param.value],
                    tooltip: {
                        valueSuffix: ' km/h'
                    },
                    dataLabels: {
                        enabled: false
                    }
                }]

        });

    },
    providerDetailsGuageChart: function(param) {

        param.container.highcharts({
            chart: {
                type: 'gauge',
                plotBackgroundColor: null,
                plotBackgroundImage: null,
                plotBorderWidth: 0,
                plotShadow: false,
                margin: 0,
                backgroundColor: null,
            },
            title: {
                text: ''
            },
            // pane: {background: [{backgroundColor: 'transparent'}]},
            credits: {enabled: false},
            exporting: {enabled: false},
            tooltip: {enabled: false},
            pane: {
                startAngle: -110,
                endAngle: 110,
                size: [18],
                center: ['50%', '65%'],
                background: null
//                background: [{
//                        backgroundColor: '#fbfbfb',
//                        borderWidth: 0
//                    }, {
//                        backgroundColor: '#fbfbfb',
//                        borderWidth: 0
//                    }, {
//                        backgroundColor: '#f2f2f2',
//                        borderWidth: 0
//                    }, {
//                        backgroundColor: '#f2f2f2',
//                        borderWidth: 0
//                    }]

            },
            plotOptions: {
                gauge: {
                    dial: {
                        baseWidth: 7,
                        backgroundColor: '#000000',
                        borderColor: '#000000',
                        borderWidth: 1,
                        rearLength: 0,
                        baseLength: 10,
                        radius: 80
                    },
                    pivot: {
                        radius: 5,
                        borderWidth: 2,
                        borderColor: '#000000',
                        backgroundColor: '#000000'
                    }
                }
            },
            // the value axis
            yAxis: {
                min: 0,
                max: 100,
                minorTickInterval: 'auto',
                minorTickWidth: 0,
                minorTickLength: 0,
                tickPixelInterval: 40,
                tickWidth: 0,
                tickPosition: 'inside',
                tickLength: 20,
                tickColor: '#666',
                labels: {
                    step: 2,
                    rotation: 0
                },
                title: {
                    // text: 'km/h'
                },
                plotBands: [{
                        from: 0,
                        to: 20,
                        color: '#779c38', // Blue Shade
                        thickness: '10'
                    },
                    {
                        from: 20,
                        to: 40,
                        color: '#779c38', // Blue Shade
                        thickness: '10'
                    }, {
                        from: 40,
                        to: 60,
                        color: '#DDDF0D', // yellow
                        thickness: '10'
                    },
                    {
                        from: 60,
                        to: 80,
                        color: '#DDDF0D', // yellow
                        thickness: '10'
                    }, {
                        from: 70,
                        to: 80,
                        color: '#DF5353', // red
                        thickness: '10'
                    },
                    {
                        from: 80,
                        to: 100,
                        color: '#DF5353', // red
                        thickness: '10'
                    }],
            },
            series: [{
                    name: 'Speed',
                    data: [param.value],
                    tooltip: {
                        valueSuffix: ' km/h'
                    },
                    dataLabels: {
                        enabled: false
                    }
                }]

        });

    },
    providerGuageChart: function(param) {

        param.container.highcharts({
            chart: {
                type: 'gauge',
                plotBackgroundColor: null,
                plotBackgroundImage: null,
                plotBorderWidth: 0,
                plotShadow: false,
                margin: 0,
                backgroundColor: param.backgroundColor,
            },
            title: {
                text: ''
            },
            credits: {enabled: false},
            exporting: {enabled: false},
            tooltip: {enabled: false},
            pane: {
                startAngle: -110,
                endAngle: 110,
                size: [7],
                center: ['50%', '70%'],
                background: [{
                        backgroundColor: param.backgroundColor,
                        borderWidth: 0
                    }, {
                        backgroundColor: param.backgroundColor,
                        borderWidth: 0
                    }, {
                        backgroundColor: param.backgroundColor,
                        borderWidth: 0
                    }, {
                        backgroundColor: param.backgroundColor,
                        borderWidth: 0
                    }]

            },
            plotOptions: {
                gauge: {
                    dial: {
                        baseWidth: 6,
                        backgroundColor: '#000000',
                        borderColor: '#000000',
                        borderWidth: 1,
                        rearLength: 0,
                        baseLength: 10,
                        radius: 80
                    },
                    pivot: {
                        radius: 4,
                        borderWidth: 2,
                        borderColor: '#000000',
                        backgroundColor: '#000000'
                    }
                }
            },
            // the value axis
            yAxis: {
                min: 0,
                max: 100,
                minorTickInterval: 'auto',
                minorTickWidth: 0,
                minorTickLength: 0,
                tickPixelInterval: 20,
                tickWidth: 0,
                tickPosition: 'inside',
                tickLength: 20,
                tickColor: '#666',
                labels: {
                    step: 2,
                    rotation: 0,
                    enabled: false
                },
                title: {
                    align: 'middle',
                    text: [param.value],
                    y: 10,
                    style: {
                        fontWeight: 'normal',
                        color: '#333333',
                        fontSize: '11px'
                    }

                },
                plotBands: [{
                        from: 0,
                        to: 20,
                        color: '#779c38', // Blue Shade
                        thickness: '10'
                    },
                    {
                        from: 20,
                        to: 40,
                        color: '#779c38', // Blue Shade
                        thickness: '10'
                    }, {
                        from: 40,
                        to: 60,
                        color: '#DDDF0D', // yellow
                        thickness: '10'
                    },
                    {
                        from: 60,
                        to: 80,
                        color: '#DDDF0D', // yellow
                        thickness: '10'
                    }, {
                        from: 70,
                        to: 80,
                        color: '#DF5353', // red
                        thickness: '10'
                    },
                    {
                        from: 80,
                        to: 100,
                        color: '#DF5353', // red
                        thickness: '10'
                    }],
            },
            series: [{
                    name: 'Speed',
                    data: [param.value],
                    tooltip: {
                        valueSuffix: ' km/h'
                    },
                    dataLabels: {
                        enabled: false
                    }
                }]

        });

    },
    claimSliderChart: function(data1, data2) {





        //$.getJSON('http://www.highcharts.com/samples/data/jsonp.php?filename=aapl-v.json&callback=?', function(data) {

        Highcharts.setOptions({
            colors: ['#249ee7', "#333333"]
        });
        // create the chart
        $('#dashboard_cliam_denials_slider_wrapper').empty();
        $('#dashboard_cliam_denials_slider_wrapper').highcharts('StockChart', {
            chart: {
                alignTicks: false
            },
            rangeSelector: {
                selected: 1,
                inputEnabled: true
            },
            credits: {enabled: false},
            title: {
                text: 'Claims Denials'
            },
            yAxis: [{
                    labels: {
                        formatter: function() {
                            return chartsCurrencyFormatter(this.value);
                        },
                        style: {
                            color: '#666666'
                        }
                    },
                    title: {
                        text: 'Total $$ Denied'
                    },
                    opposite: true,
                    gridLineWidth: 0

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
                    //gridLineWidth: 0,
                    title: {
                        text: '# of Claims'
                    }

                }],
            series: [{
                    type: 'column',
                    name: 'Total $$ Denied',
                    data: data1,
                    yAxis: 0,
                    dataGrouping: {
                        units: [[
                                'week', // unit name
                                [1] // allowed multiples
                            ], [
                                'month',
                                [1, 2, 3, 4, 6]
                            ]]
                    }
                },
                {
                    type: 'line',
                    name: '# of Claims',
                    data: data2,
                    yAxis: 1,
                    dataGrouping: {
                        units: [[
                                'week', // unit name
                                [1] // allowed multiples
                            ], [
                                'month',
                                [1, 2, 3, 4, 6]
                            ]]
                    }
                }
            ]
        });
        //});

    },
    workColumnStackChart: function(param) {
        var data;
        //console.log(param.value);
        if (param.value) {
            data = JSON.parse(param.value);
        }

        param.container.highcharts({
            chart: {
                type: 'column'
            },
            title: {
                text: 'Reimbursement Difference',
                style: {
                    fontWeight: 'bold',
                    fontSize: '12px'
                }
            },
            xAxis: {
                categories: ['Unbundled Procedures', 'Equivalent Parent Procedure'],
                enabled: false,
            },
            legend: {enabled: false},
            credits: {enabled: false},
            exporting: {enabled: false},
            yAxis: {
                min: 0,
                minPadding: 0,
                maxPadding: 0,
                tickColor: 'white',
                tickWidth: 0,
                tickLength: 0,
                gridLineWidth: 0,
                labels:
                        {
                            enabled: false
                        },
                title: {
                    text: ''
                },
                stackLabels: {
                    enabled: true,
                    style: {
                        fontWeight: 'bold',
                        color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                    },
                    formatter: function() {
                        return "$ " + this.total;
                    }
                }
            },
            legend: {
                enabled: false
            },
            tooltip: {
                enabled: false
            },
            plotOptions: {
                column: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: true,
                        color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'
                    }
                }
            },
            series: data
                    //[
//			{
//                //name: 'Unbundled Procedures',
//                data: [17, 17]
//            },
//			{
//                //name: 'Equivalent Parent Procedure',
//                data: [16,0]
//			},
//			{
//                //name: 'Equivalent Parent Procedure',
//                data: [20,0]
//			},
//			{
//                //name: 'Equivalent Parent Procedure',
//                data: [14,0]
//			}
//			]
        });


    },
    topFiveDepartmentBarChart: {
        perShapeGradient: {
            x1: 0,
            y1: 0,
            x2: 1,
            y2: 0
        },
        xAxisData: "",
        yAxisData: "",
        chartDiv: "",
        initialize: function(param) {

            this.xAxisData = param.xaxis;
            this.yAxisData = param.yaxis;
            this.chartDiv = param.container;

            param.container.highcharts({
                chart: {
                    type: 'bar',
                    marginBottom: 0,
                    marginRight: 20,
                    marginTop: 40,
                    backgroundColor: null
                },
                legend: {enabled: false},
                credits: {enabled: false},
                tooltip: {enabled: false},
                title: {
                    text: 'Attribute Risk Score',
                    style: {
                        fontWeight: 'bold',
                        fontSize: '12px'
                    }
                },
                xAxis: {
                    categories: this.xAxisData,
                    tickWidth: 0,
                    style: {
                        width: '150px'
                    }
                },
                plotOptions: {
                    bar: {
                        pointWidth: 12,
                        stacking: 'normal'
                    }
                },
                colors: [
                    '#3A9BD6',
                ],
                yAxis: {
                    gridLineWidth: 0,
                    min: 0,
                    minRange: 0.1,
                    stackLabels: {
                        enabled: true,
                        verticalAlign: 'middle',
                        align: 'right',
                    }
                },
                series: [{
                        data: this.yAxisData
                    }]
            });

        }

    },
    networkDetailsGuageChart: function(param) {

        param.container.highcharts({
            chart: {
                type: 'gauge',
                plotBackgroundColor: null,
                plotBackgroundImage: null,
                plotBorderWidth: 0,
                plotShadow: false,
                marginBottom: 20,
                backgroundColor: null,
            },
            title: {
                text: param.title,
                verticalAlign: 'bottom'
            },
            credits: {enabled: false},
            exporting: {enabled: false},
            tooltip: {enabled: false},
            pane: {
                startAngle: -110,
                endAngle: 110,
                size: [18],
                center: ['50%', '65%'],
                background: null
//                background: [{
//                        backgroundColor: '#fbfbfb',
//                        borderWidth: 0
//                    }, {
//                        backgroundColor: '#fbfbfb',
//                        borderWidth: 0
//                    }, {
//                        backgroundColor: '#f2f2f2',
//                        borderWidth: 0
//                    }, {
//                        backgroundColor: '#f2f2f2',
//                        borderWidth: 0
//                    }]

            },
            plotOptions: {
                gauge: {
                    dial: {
                        baseWidth: 7,
                        backgroundColor: '#000000',
                        borderColor: '#000000',
                        borderWidth: 1,
                        rearLength: 0,
                        baseLength: 12,
                        radius: 80
                    },
                    pivot: {
                        radius: 6,
                        borderWidth: 2,
                        borderColor: '#000000',
                        backgroundColor: '#000000'
                    }
                }
            },
            // the value axis
            yAxis: {
                min: 0,
                max: 100,
                minorTickInterval: 'auto',
                minorTickWidth: 0,
                minorTickLength: 0,
                tickPixelInterval: 40,
                tickWidth: 0,
                tickPosition: 'inside',
                tickLength: 20,
                tickColor: '#666',
                labels: {
                    step: 2,
                    rotation: 0
                },
                title: {
                    // text: 'km/h'
                },
                plotBands: [{
                        from: 0,
                        to: 20,
                        color: '#779c38', // Blue Shade
                        thickness: '10'
                    },
                    {
                        from: 20,
                        to: 40,
                        color: '#779c38', // Blue Shade
                        thickness: '10'
                    }, {
                        from: 40,
                        to: 60,
                        color: '#DDDF0D', // yellow
                        thickness: '10'
                    },
                    {
                        from: 60,
                        to: 80,
                        color: '#DDDF0D', // yellow
                        thickness: '10'
                    }, {
                        from: 70,
                        to: 80,
                        color: '#DF5353', // red
                        thickness: '10'
                    },
                    {
                        from: 80,
                        to: 100,
                        color: '#DF5353', // red
                        thickness: '10'
                    }],
            },
            series: [{
                    name: 'Speed',
                    data: [param.value],
                    tooltip: {
                        valueSuffix: ' km/h'
                    },
                    dataLabels: {
                        enabled: false
                    }
                }]

        });

    },
    bitoolBarChart: function(param) {

        param.container.highcharts({
            chart: {
                type: 'column',
                marginTop: 50
            },
            colors: [
                '#e00000',
                '#fe5e5e'
            ],
            credits: {enabled: false},
            title: {
                text: param.title,
                align: 'left',
                style: {
                    fontSize: '12px',
                    fontWeight: 'bold'
                }
            },
            xAxis: {
                categories: param.categories
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Total Currency'
                }
            },
            legend: {
                itemStyle: {
                    fontSize: '10px'
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                        '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
            series: param.value

        });

    },
    bitoolStackChart: function(param) {

        param.container.highcharts({
            chart: {
                type: 'column',
                marginTop: 50
            },
            title: {
                text: param.title,
                align: 'left',
                style: {
                    fontSize: '12px',
                    fontWeight: 'bold'
                }
            },
            credits: {enabled: false},
            xAxis: {
                categories: param.categories
            },
            colors: [
                '#527bd7',
                '#66cc66',
                '#ef2e41',
                '#ffc703'
            ],
            yAxis: {
                min: 0,
                title: {
                    text: 'MA+ Enc Service Claim Ct'
                },
                stackLabels: {
                    enabled: false,
                    style: {
                        fontWeight: 'bold',
                        color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                    }
                }
            },
            legend: {
                align: 'center',
                verticalAlign: 'bottom',
                backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColorSolid) || 'white',
                borderColor: '#CCC',
                borderWidth: 1,
                shadow: false,
                itemStyle: {
                    fontSize: '10px'
                }
            },
            tooltip: {
                formatter: function() {
                    return '<b>' + this.x + '</b><br/>' +
                            this.series.name + ': ' + this.y + '<br/>' +
                            'Total: ' + this.point.stackTotal;
                }
            },
            plotOptions: {
                column: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: false,
                        color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'
                    }
                }
            },
            series: param.value

        });

    },
    bitoolPieChart: function(param) {

        param.container.highcharts({
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                marginTop: 50
            },
            colors: [
                '#527bd7',
                '#66cc66',
                '#ef2e41',
                '#ffc703'
            ],
            credits: {enabled: false},
            title: {
                text: param.title,
                align: 'left',
                style: {
                    fontSize: '12px',
                    fontWeight: 'bold'
                }
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            legend: {
                itemStyle: {
                    fontSize: '10px'
                }
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: true
                }
            },
            series: [{
                    type: 'pie',
                    name: 'Browser share',
                    data: param.value
                }]

        });

    },
    bitoolLineChart: function(param) {

        param.container.highcharts({
            chart: {
                marginTop: 50
            },
            title: {
                text: param.title,
                align: 'left',
                style: {
                    fontSize: '12px',
                    fontWeight: 'bold'
                }
            },
            colors: [
                '#80cd84',
                '#a3b2ba',
                '#5d7ed2'

            ],
            credits: {enabled: false},
            xAxis: {
                categories: param.categories
            },
            yAxis: {
                title: {
                    text: 'MA Avg Svc Claims/Month '
                },
                plotLines: [{
                        value: 0,
                        width: 0,
                        color: '#808080'
                    }]
            },
            legend: {
                align: 'center',
                verticalAlign: 'bottom',
                borderWidth: 0
            },
            series: param.value

        });

    },
    providerSliderChart: function(data1, data2) {

        //$.getJSON('http://www.highcharts.com/samples/data/jsonp.php?filename=aapl-v.json&callback=?', function(data) {

        Highcharts.setOptions({
            colors: ['#249ee7', "#333333"]
        });
        // create the chart
        $('#dashboard_provider_denials_slider_wrapper').empty();
        $('#dashboard_provider_denials_slider_wrapper').highcharts('StockChart', {
            chart: {
                alignTicks: false
            },
            rangeSelector: {
                selected: 1,
                inputEnabled: true
            },
            credits: {enabled: false},
            title: {
                text: 'Cases Reviewed'
            },
            yAxis: [{
                    labels: {
                        formatter: function() {
                            return chartsCurrencyFormatter(this.value);
                        },
                        style: {
                            color: '#666666'
                        }
                    },
                    title: {
                        text: 'Total $$ Denied'
                    },
                    opposite: true,
                    gridLineWidth: 0

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
                    //gridLineWidth: 0,
                    title: {
                        text: '# of cases'
                    }

                }],
            series: [{
                    type: 'column',
                    name: 'Total $$ Denied',
                    data: data1,
                    yAxis: 0,
                    dataGrouping: {
                        units: [[
                                'week', // unit name
                                [1] // allowed multiples
                            ], [
                                'month',
                                [1, 2, 3, 4, 6]
                            ]]
                    }
                },
                {
                    type: 'line',
                    name: '# of cases',
                    data: data2,
                    yAxis: 1,
                    dataGrouping: {
                        units: [[
                                'week', // unit name
                                [1] // allowed multiples
                            ], [
                                'month',
                                [1, 2, 3, 4, 6]
                            ]]
                    }
                }
            ]
        });
        //});

    },
    explorerScatterChart: function(param) {
        param.container.highcharts({
            chart: {
                marginTop: 50,
                type: 'scatter',
                zoomType: 'xy'
            },
            title: {
                text: param.title,
                align: 'left',
                style: {
                    fontSize: '13px',
                    fontWeight: 'bold'
                }
            },
            legend: {
                enabled: false
            },
            credits: {enabled: false},
            subtitle: {
                text: ''
            },
            xAxis: {
                title: {
                    text: param.categories[0]
                },
                gridLineWidth: 0,
                minorGridLineWidth: 0,
                labels: {
                    enabled: false
                }
            },
            yAxis: {
                title: {
                    text: param.categories[1]
                },
                gridLineWidth: 0,
                minorGridLineWidth: 0,
                labels: {
                    enabled: false
                }
            },
            plotOptions: {
                scatter: {
                    marker: {
                        radius: 5,
                        states: {
                            hover: {
                                enabled: true,
                                lineColor: 'rgb(100,100,100)'
                            }
                        }
                    },
                    states: {
                        hover: {
                            marker: {
                                enabled: false
                            }
                        }
                    },
                    tooltip: {
                        headerFormat: '<b>{series.name}</b><br>',
                        pointFormat: 'Amount: ${point.x} <br>Risk Score: {point.y} '
                    }
                }
            },
            series: param.value
        },
        function(chart) { // on complete

            var width = chart.plotBox.width / 2.0;
            var height = chart.plotBox.height / 2.0 + 1;

            chart.renderer.rect(chart.plotBox.x,
                    chart.plotBox.y, width, height, 1)
                    .attr({
                        'stroke-width': 2,
                        stroke: '#C7C7C7',
                        //fill: '#FFFFFF',
                        zIndex: 0
                    })
                    .add();

            chart.renderer.rect(chart.plotBox.x + width,
                    chart.plotBox.y, width, height, 1)
                    .attr({
                        'stroke-width': 2,
                        stroke: '#C7C7C7',
                        //fill: '#FFFFFF',
                        zIndex: 0
                    })
                    .add();

            chart.renderer.rect(chart.plotBox.x,
                    chart.plotBox.y + height, width, height, 1)
                    .attr({
                        'stroke-width': 2,
                        stroke: '#C7C7C7',
                        //fill: '#FFFFFF',
                        zIndex: 0
                    })
                    .add();

            chart.renderer.rect(chart.plotBox.x + width,
                    chart.plotBox.y + height, width, height, 1)
                    .attr({
                        'stroke-width': 2,
                        stroke: '#C7C7C7',
                        //fill: '#FFFFFF',
                        zIndex: 0
                    })
                    .add();

        });
    },
    explorerScatterPeerChart: function(param) {
    	return false;
        param.container.highcharts({
            chart: {
                marginTop: 50,
                type: 'scatter',
                zoomType: 'xy'
            },
            title: {
                text: param.title,
                align: 'left',
                style: {
                    fontSize: '13px',
                    fontWeight: 'bold'
                }
            },
            legend: {
                enabled: false
            },
            credits: {enabled: false},
            subtitle: {
                text: ''
            },
            xAxis: {
                title: {
                    text: param.categories[0]
                },
                gridLineWidth: 0,
                minorGridLineWidth: 0,
                labels: {
                    enabled: false
                }
            },
            yAxis: {
                title: {
                    text: param.categories[1]
                },
                gridLineWidth: 0,
                minorGridLineWidth: 0,
                labels: {
                    enabled: false
                }
            },
            plotOptions: {
                scatter: {
                    marker: {
                        radius: 5,
                        states: {
                            hover: {
                                enabled: true,
                                lineColor: 'rgb(100,100,100)'
                            }
                        }
                    },
                    states: {
                        hover: {
                            marker: {
                                enabled: false
                            }
                        }
                    },
                    tooltip: {
                        headerFormat: '<b>{series.name}</b><br>',
                        pointFormat: 'Amount: ${point.x} <br>Risk Score: {point.y} '
                    }
                }
            },
            series: param.value
        },
        function(chart) { // on complete
            var width = chart.plotBox.width / 2.0;
            var height = chart.plotBox.height / 2.0 + 1;

            chart.renderer.rect(chart.plotBox.x,
                    chart.plotBox.y, width, height, 1)
                    .attr({
                        'stroke-width': 2,
                        stroke: '#C7C7C7',
                        //fill: '#FFFFFF',
                        zIndex: 0
                    })
                    .add();

            chart.renderer.rect(chart.plotBox.x + width,
                    chart.plotBox.y, width, height, 1)
                    .attr({
                        'stroke-width': 2,
                        stroke: '#C7C7C7',
                        //fill: '#FFFFFF',
                        zIndex: 0
                    })
                    .add();

            chart.renderer.rect(chart.plotBox.x,
                    chart.plotBox.y + height, width, height, 1)
                    .attr({
                        'stroke-width': 2,
                        stroke: '#C7C7C7',
                        //fill: '#FFFFFF',
                        zIndex: 0
                    })
                    .add();

            chart.renderer.rect(chart.plotBox.x + width,
                    chart.plotBox.y + height, width, height, 1)
                    .attr({
                        'stroke-width': 2,
                        stroke: '#C7C7C7',
                        //fill: '#FFFFFF',
                        zIndex: 0
                    })
                    .add();

        });
    },
    explorerBarChart: function(param) {

        param.container.highcharts({
            chart: {
                type: 'column',
                marginTop: 50
            },
            colors: [
                '#e00000',
                '#fe5e5e',
                '#6c7000',
                '#fdff00'
            ],
            credits: {enabled: false},
            title: {
                text: param.title,
                align: 'left',
                style: {
                    fontSize: '12px',
                    fontWeight: 'bold'
                }
            },
            xAxis: {
                categories: param.categories
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Total Currency'
                }
            },
            legend: {
                itemStyle: {
                    fontSize: '10px'
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                        '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
            series: param.value

        });

    },
    explorerPieChart: function(param) {

        param.container.highcharts({
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                marginTop: 50
            },
            colors: [
                '#527bd7',
                '#66cc66',
                '#ef2e41',
                '#ffc703',
                '#53a9f8'
            ],
            credits: {enabled: false},
            title: {
                text: param.title,
                align: 'left',
                style: {
                    fontSize: '12px',
                    fontWeight: 'bold'
                }
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            legend: {
                itemStyle: {
                    fontSize: '8px'
                }
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: true
                }
            },
            series: [{
                    type: 'pie',
                    name: 'Browser share',
                    data: param.value
                }]

        });

    },
    peerLineChart: function(param) {

        param.container.highcharts({
            chart: {
                backgroundColor: '#F6F6F6',
                defaultSeriesType: 'spline',
                marginTop: 40,
                backgroundColor: null
            },
            credits: {enabled: false},
//            title: {
//                text: param.title
//            },
//            xAxis: {
//                categories: param.categories
//            },
//            yAxis: {
//                title: {
//                    text: ''
//                },
//                labels: {
//                    formatter: function() {
//                        return this.value + '%'
//                    }
//                }
//            },
//            tooltip: {
//                crosshairs: true,
//                shared: true
//            },
//            plotOptions: {
//                spline: {
//                    marker: {
//                        radius: 3,
//                        lineColor: '#666666',
//                        lineWidth: 1
//                    }
//                }
//            },
//            series: param.value

            title: {
                text: null
               // x: -10 //center
            },
            xAxis: {
                title: {
                    text: 'Time -> (Month - Year)'
                },
                categories: param.xAxisData
            },
            plotOptions: {
                column: {
                    dataLabels: {
                        enabled: true,
                        formatter: function() {
                            if (this.series.name == "Total Claim Amount")
                                return '$' + this.y;
                            else
                                return this.y;
                        }
                    },
                    pointPadding: 0.1,
                    borderWidth: 0
                },
                spline: {
                    marker: {
                        enabled: false
                    }
                }

            },
            yAxis: {
                gridLineWidth: 0,
                minorGridLineWidth: 0,
                title: {
                    text: 'Metric (' + param.yAxisLabel + ')'
                },
                plotLines: [{
                        value: 0,
                        width: 1

                    }]
            },
            tooltip: {
                formatter: function() {
                    var tooltipText = "";
                    if (this.series.name == "Total Claim Amount")
                        tooltipText = '<b>' + this.series.name + '</b><br/>' + this.x + ': ' + "$" + this.y;
                    else
                        tooltipText = '<b>' + this.series.name + '</b><br/>' + this.x + ': ' + this.y;

                    return tooltipText;
                }
            },
            legend: {
                align: 'right',
                verticalAlign: 'top',
                layout: 'vertical',
                y: 0,
                x:0,
                floating: true,
                borderWidth: 0
            },
            series: [{
                    name: 'National Average',
                    data: param.nationalAverageList,
                    dashStyle: 'dash'
                },
                {
                    name: 'Regional Average',
                    data: param.regionalAverageList,
                    dashStyle: 'ShortDash'
                },
                {
                    name: param.yAxisLabel,
                    data: param.barChartData,
                    type: 'column',
                    color: '#2175ca'
                }]
        });




    },
    analysisLineChart: function(param) {

        param.container.highcharts({
            chart: {
            	type:'column',
                marginTop: 50
            },
            title: {
                text: param.title,
                align: 'left',
                style: {
                    fontSize: '13px',
                    fontWeight: 'bold'
                }
            },
            colors: [
                '#CC3300',
                '#5d7ed2'

            ],
            credits: {enabled: false},
            xAxis: {
                categories: param.categories,
            },
            yAxis: {
                title: {
                    text: param.yAxisTitle
                },
                labels: {
                    formatter: function() {
                        return this.value; // + '%';
                    }
                },
            },
            legend: {
                align: 'center',
                verticalAlign: 'top',
                borderWidth: 0,
                x: 30
            },
            series: param.value

        });

    },
    analysisLineChart1: function(param) {
        param.container.highcharts({
            chart: {
                marginTop: 50,
                zoomType: 'xy'
            },
            title: {
                text: param.title,
                align: 'left',
                style: {
                    fontSize: '13px',
                    fontWeight: 'bold'
                }
            },
            colors: [
                '#0066CC',
                '#CC3300',
                '#5d7ed2'

            ],
            credits: {enabled: false},
            xAxis: [{
                categories: param.categories,
                crosshair: true
            }],
            yAxis: [{
                title: {
                    text: param.yAxisTitle
                },
            },
            {
                title: {
                    text: param.yAxisTitle
                },
                opposite: true
            }],
            legend: {
                align: 'center',
                verticalAlign: 'top',
                x: 50,
                borderWidth: 0
            },
            series: param.value

        });

    },

    analysisLinePeerChart: function(param) {
        param.container.highcharts({
            chart: {
            	type:'column',
                marginTop: 50
            },
            title: {
                text: param.title,
                align: 'left',
                style: {
                    fontSize: '13px',
                    fontWeight: 'bold'
                }
            },
            colors: [
                '#CC3300',
                '#5d7ed2'

            ],
            credits: {enabled: false},
            xAxis: {
                categories: param.categories,
            },
            yAxis: {
                title: {
                    text: param.yAxisTitle
                },
                labels: {
                    formatter: function() {
                        return this.value; // + '%';
                    }
                },
            },
            legend: {
                align: 'center',
                verticalAlign: 'top',
                borderWidth: 0,
                x: 10
            },
            series: param.value

        });

    },
    analysisLinePeerChart1: function(param) {
    	return false;
        param.container.highcharts({
            chart: {
                marginTop: 50,
                zoomType: 'xy'
            },
            title: {
                text: '', //param.title,
                align: 'left',
                style: {
                    fontSize: '13px',
                    fontWeight: 'bold'
                }
            },
            colors: [
                '#0066CC',
                '#CC3300',
                '#669900',
                '#9900FF'

            ],
            credits: {enabled: false},
            xAxis: [{
                categories: param.categories,
                crosshair: true
            }],
            yAxis: [{
                title: {
                    text: param.yAxisTitle
                },
            },
            {
                title: {
                    text: param.yAxisTitle
                },
                opposite: true
                
            },
            {
                title: {
                    text: param.yAxisTitle
                },
            },
            {
                title: {
                    text: param.yAxisTitle
                },
                opposite: true
                
            }],
            legend: {
                align: 'center',
                verticalAlign: 'top',
                x: 20,
                borderWidth: 0
            },
            series: param.value

        });

    },

    dashboardReviewRateAndRisk: function(param) {

        param.container.highcharts({
        	chart: {
                defaultSeriesType: 'spline',
                margin: [ 50, 100, 100, 80],
                backgroundColor: null,
                backgroundColor: '#F6F6F6',
            },
            title: {
            	align: 'right',
                text: 'AUDITOR TRENDS - Bob'
            },
            credits: {enabled: false},
            xAxis: {
                minPadding: .1, // This doesn't work
                categories: [
                    '05/01',
                    '05/02',
                    '05/03',
                    '05/04',
                    '05/05',
                    '05/06',
                    '05/07',
                    '05/08',
                    '05/09'
                ],
                labels: {
                    rotation: -45,
                    style: {
                        fontSize: '13px',
                        fontFamily: 'Arial'
                    }
                },
                 title: {
                    text: 'Daily'
                }
            },
            yAxis: [{
                labels: {
                        formatter: function() {
                            return this.value + "K";
                        },
                        style: {
                            color: '#666666'
                        }
                    },
                min: 0,
                gridLineWidth: 0,
                minorGridLineWidth: 0,
                title: {
                    text: 'Risk Detected ($)'
                }
            },
            {
              labels: {
                        formatter: function() {
                            return this.value + "%";
                        }},
                            min:0,
            lineWidth: 0,
            gridLineWidth: 0,
                minorGridLineWidth: 0,
            opposite: true,
                title: {
                    text: 'Hit/Review Rate'
                }
            }                       
            ],
            plotOptions: { column: {pointPadding: 0}},
            legend: {
                align: 'left',
                x: 80,
                verticalAlign: 'top',
                y: 10,
                floating: true,
                backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColorSolid) || 'white',
                borderColor: '#CCC',
                borderWidth: 1,
                shadow: false
            },
            tooltip: {
                formatter: function() {
                    var tooltipText = "";
                    if (this.series.name == "Risk Dectected ($)")
                        tooltipText = '<b>' + this.series.name + '</b><br/>' + this.x + ': '  + this.y + "K";
                    else
                    	tooltipText = '<b>' + this.series.name + '</b><br/>' + this.x + ': '  + this.y + "%";

                    return tooltipText;
                }
            },
            series: [{
                name: 'Risk Dectected ($)',
                type: 'column',
                data: [30, 5, 40, 60, 20, 35,80,18,35],
                dataLabels: {
                    enabled: true,
                    formatter: function() {
                            return this.y + "K";
                        },         
                    
                    style: {
                        fontSize: '13px',
                        fontFamily: 'Verdana, sans-serif'
                    }
                }
                },
                  {
                    name: 'Hit Rate',
                    data: [0,20,40,80,60,30,20,40,30],
                    color:'#6b398d',
                    yAxis: 1
                  },
                {
                    name: 'Review Rate',
                    data: [20,40,60,80,95,10,15,50,80],
                    color: '#dd741f',
                    yAxis: 1
                }]
        });




    },
    
    dashboardReviewRateAndRiskDenial: function(param) {

        param.container.highcharts({
        	chart: {
                defaultSeriesType: 'spline',
                margin: [ 50, 100, 100, 80],
                backgroundColor: null,
                backgroundColor: '#F6F6F6',
            },
            title: {
            	align: 'right',
                text: 'AUDITOR TRENDS - Bob'
            },
            credits: {enabled: false},
            xAxis: {
                minPadding: .1, // This doesn't work
                categories: [
                    '05/01',
                    '05/02',
                    '05/03',
                    '05/04',
                    '05/05',
                    '05/06',
                    '05/07',
                    '05/08',
                    '05/09'
                ],
                labels: {
                    rotation: -45,
                    style: {
                        fontSize: '13px',
                        fontFamily: 'Arial'
                    }
                },
                 title: {
                    text: 'Daily'
                }
            },
            yAxis: [{
                labels: {
                        formatter: function() {
                            return this.value + "K";
                        },
                        style: {
                            color: '#666666'
                        }
                    },
                min: 0,
                gridLineWidth: 0,
                minorGridLineWidth: 0,
                title: {
                    text: 'Risk Detected ($)'
                }
            },
            {
              labels: {
                        formatter: function() {
                            return this.value + "%";
                        }},
                            min:0,
            lineWidth: 0,
            gridLineWidth: 0,
                minorGridLineWidth: 0,
            opposite: true,
                title: {
                    text: 'Denial/Review Rate'
                }
            }                       
            ],
            plotOptions: { column: {pointPadding: 0}},
            legend: {
                align: 'left',
                x: 80,
                verticalAlign: 'top',
                y: 10,
                floating: true,
                backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColorSolid) || 'white',
                borderColor: '#CCC',
                borderWidth: 1,
                shadow: false
            },
            tooltip: {
                formatter: function() {
                    var tooltipText = "";
                    if (this.series.name == "Risk Dectected ($)")
                        tooltipText = '<b>' + this.series.name + '</b><br/>' + this.x + ': '  + this.y + "K";
                    else
                    	tooltipText = '<b>' + this.series.name + '</b><br/>' + this.x + ': '  + this.y + "%";

                    return tooltipText;
                }
            },
            series: [{
                name: 'Risk Dectected ($)',
                type: 'column',
                data: [30, 5, 40, 60, 20, 35,80,18,35],
                dataLabels: {
                    enabled: true,
                    formatter: function() {
                            return this.y + "K";
                        },         
                    
                    style: {
                        fontSize: '13px',
                        fontFamily: 'Verdana, sans-serif'
                    }
                }
                },
                  {
                    
                	name: 'Review Rate',
                    data: [20,40,60,80,95,10,15,50,80],
                    color: '#6b398d',
                    yAxis: 1
                	
                  },
                {
                	  name: 'Denial Rate',
                      data: [0,20,40,80,60,30,20,40,30],
                      color:'#dd741f',
                      yAxis: 1
                }]
        });




    },
    
    dashboardReviewRateAndReasonChart: function(param) {

        param.container.highcharts({
        	chart: {
                defaultSeriesType: 'spline',
                margin: [ 50, 100, 100, 80],
                backgroundColor: null,
                backgroundColor: '#F6F6F6',
            },
            title: {
            	align: 'right',
                text: 'AUDITOR TRENDS - Bob'
            },
            credits: {enabled: false},
            xAxis: {
                minPadding: .1, // This doesn't work
                categories: [
                    'Overcharging',
                    'Unbundling',
                    'Speciality-Procedure <br> Mismatch',
                    'Procedure-Diagnosis <br> Mismatch',
                    'Duplicate Claims',
                                    ],
                labels: {
                    rotation: -25,
                    style: {
                        fontSize: '12px',
                        fontFamily: 'Arial',
                        fontWeight:'bold'
                    }
                },
                 title: {
                    text: 'Reason Code'
                }
            },
            yAxis: [{
                labels: {
                        formatter: function() {
                            return this.value + "K";
                        },
                        style: {
                            color: '#666666'
                        }
                    },
                min: 0,
                gridLineWidth: 0,
                minorGridLineWidth: 0,
                title: {
                    text: 'Amount ($)'
                }
            }      
            ],
            plotOptions: { column: {pointPadding: 0}},
            legend: {
                align: 'left',
                x: 80,
                verticalAlign: 'top',
                y: 10,
                floating: true,
                backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColorSolid) || 'white',
                borderColor: '#CCC',
                borderWidth: 1,
                shadow: false
            },
            tooltip: {
                //formatter: function() {
//                    var tooltipText = "";
//                    if (this.series.name == "Risk Dectected ($)")
//                        tooltipText = '<b>' + this.series.name + '</b><br/>' + this.x + ': '  + this.y + "K";
//                    else
//                    	tooltipText = '<b>' + this.series.name + '</b><br/>' + this.x + ': '  + this.y + "%";
//
//                    return tooltipText;
               // }
            },
            series: [{
                name: 'Risk Dectected ($)',
                type: 'column',
                data: [25,40,5,17,58],
                dataLabels: {
                    enabled: true,
                    formatter: function() {
                            return this.y + "K";
                        },         
                    
                    style: {
                        fontSize: '13px',
                        fontFamily: 'Arial'
                    }
                }
                }]
        });




    }




    
    
};