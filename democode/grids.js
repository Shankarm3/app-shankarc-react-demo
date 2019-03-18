var grids = {
    claimListGrid: {
        gridDiv: "",
        gridData: {},
        onClick: {},
        initialize: function(param) {
            this.gridDiv = $(param.gridDiv);
            grids.claimListGrid.gridData = param.gridData;
            this.onClick = param.onClick;
            //alert("hi");
            this.loadGrid();
            this.fillGrid();

        },
        loadGrid: function() {
            grids.claimListGrid.gridDiv.jqGrid({
                datatype: 'local',
                autowidth: true,
                height: 'auto',
                gridview: true,
                viewrecords: true,
                altRows: true,
                altclass: 'alternate_row_color',
                sortname: '',
                colNames: ['Claim ID', 'Patient Name', 'Gender/ Age', 'Claim Type', 'Service Category', 'Provider Region', 'Provider ID',
                    'Provider Type', 'Reason Code', 'Risk Score', 'Opera Overall Score', 'Amount'
                ],
                colModel: [
                    {name: 'acct_id', index: 'acct_id'},
                    {name: 'patient_name', index: 'patient_name', width: 200},
                    {name: 'gender', index: 'gender'},
                    // {name: 'primary_insurer', index: 'primary_insurer',width:50},
                    {name: 'claim_type', index: 'claim_type', width: 200},
                    {name: 'plan_type', index: 'plan_type', width: 250},
                    {name: 'provider_group', index: 'provider_group'},
                    {name: 'provider_id', index: 'provider_id', width: 200},
                    // {name: 'provider_name', index: 'provider_name'},
                    {name: 'provider_type', index: 'provider_type'},
                    {name: 'sub_reason', index: 'sub_reason', width: 250},
                    {name: 'provider_fraud_score', index: 'provider_fraud_score', align: 'center'},
                    {name: 'claim_fraud_score', index: 'claim_fraud_score', align: 'center'},
                    {name: 'claim_value', index: 'claim_value', align: 'center'}
                    //{name:'score_image',index:'score_image',classes:'score_image'}

                ],
                multiselect: true,
                onSelectRow: this.onClick,
                //aption: "Multi Select Example"
            });
        },
        fillGrid: function() {
            grids.claimListGrid.gridDiv.jqGrid('clearGridData');
            var datalength = grids.claimListGrid.gridData.length;

            for (var i = 0; i < datalength; i++) {
                var genderAge = grids.claimListGrid.gridData[i].gender + "/" + grids.claimListGrid.gridData[i].age;
                grids.claimListGrid.gridData[i].gender = genderAge;
                grids.claimListGrid.gridDiv.jqGrid('addRowData', i + 1, grids.claimListGrid.gridData[i]);
                var img_div = '<img alt="" src="common/images/score_images/score' + grids.claimListGrid.gridData[i].score + '.png">';
                grids.claimListGrid.gridDiv.jqGrid('setCell', i + 1, 'score_image', img_div, '');
            }
            ;

            $('#cb_claim_list_table').change(function() {
                if ($(this).is(':checked') == true) {
                    $('#claim_bottom_navigation div img').parent().removeClass('bottom_tile_view_disable');
                    $('#claim_bottom_navigation div img').parent().addClass('bottom_tile_view');
                } else {
                    $('#claim_bottom_navigation div img').parent().removeClass('bottom_tile_view');
                    $('#claim_bottom_navigation div img').parent().addClass('bottom_tile_view_disable');
                }
            });
        }

    },
    workSpaceClaimGrid: {
        gridDiv: "",
        gridData: {},
        initialize: function(param) {
            this.gridDiv = $(param.gridDiv);
            grids.workSpaceClaimGrid.gridData = param.gridData;
            this.loadGrid();
            this.fillGrid();
            this.groupGridColumns();
        },
        loadGrid: function() {
            grids.workSpaceClaimGrid.gridDiv.jqGrid({
                datatype: 'local',
                autowidth: true,
                height: 'auto',
                gridview: true,
                viewrecords: true,
                altRows: true,
                altclass: 'alternate_row_color',
                sortname: '',
                colNames: ['FROM', 'TO', 'PLACE OF SERVICE', 'EMG', 'CPT/HCPCS', '&nbsp;', '&nbsp;', '&nbsp;', '&nbsp;', '&nbsp;', 'DIAGNOSIS POINTER', 'CHARGES', 'DAYS OR UNITS', 'EPSOT', 'ID QUAL', 'RENDERING PROVIDER ID#'],
                colModel: [
                    {name: 'start_date', index: 'start_date'},
                    {name: 'end_date', index: 'end_date'},
                    {name: 'place_of_service', index: 'place_of_service'},
                    {name: 'emg', index: 'emg'},
                    {name: 'cpt_hcpc', index: 'cpt_hcpc'},
                    {name: 'm1', index: 'm1'},
                    {name: 'm2', index: 'm2'},
                    {name: 'm3', index: 'm3'},
                    {name: 'm4', index: 'm4'},
                    {name: 'm5', index: 'm5'},
                    {name: 'dignosis_pointer', index: 'dignosis_pointer'},
                    {name: 'charges', index: 'charges'},
                    {name: 'units', index: 'units'},
                    {name: 'epsot', index: 'epsot'},
                    {name: 'id_qual', index: 'id_qual'},
                    {name: 'provider_id', index: 'provider_id'}

                ]
                        //aption: "Multi Select Example"
            });
        },
        fillGrid: function() {
            var data = [{"start_date": "9/14/2012", "end_date": "9/14/2010", "place_of_service": "08", "emg": "Yes", "cpt_hcpc": "A0021", "m1": "OB", "m2": "OC", "m3": "OD", "m4": "OE", "m5": "OF", "dignosis_pointer": "1", "charges": "122.23", "units": "MJ", "epsot": "E", "id_qual": "", "provider_id": "1497758544"},
                {"start_date": "9/15/2012", "end_date": "9/15/2010", "place_of_service": "08", "emg": "Yes", "cpt_hcpc": "A0022", "m1": "OB", "m2": "OC", "m3": "OD", "m4": "OE", "m5": "OF", "dignosis_pointer": "1", "charges": "76.55", "units": "MJ", "epsot": "E", "id_qual": "", "provider_id": "1497758544"},
                {"start_date": "9/16/2010", "end_date": "9/16/2010", "place_of_service": "08", "emg": "Yes", "cpt_hcpc": "A0023", "m1": "OB", "m2": "OC", "m3": "OD", "m4": "OE", "m5": "OF", "dignosis_pointer": "1", "charges": "34.32", "units": "MJ", "epsot": "E", "id_qual": "", "provider_id": "1497758544"}
            ];

            for (var i = 0; i < data.length; i++) {
                grids.workSpaceClaimGrid.gridDiv.jqGrid('addRowData', i + 1, data[i]);
            }
            ;
        },
        groupGridColumns: function() {
            grids.workSpaceClaimGrid.gridDiv.jqGrid('setGroupHeaders', {
                useColSpanStyle: true,
                groupHeaders: [
                    {startColumnName: 'start_date', numberOfColumns: 2, titleText: '<label style="font-weight:bold;font-size:11px;">Date of Service</label>'},
                    {startColumnName: 'm1', numberOfColumns: 5, titleText: '<label style="font-weight:bold;font-size:11px;"> Procedures, Services or Supplies</label> <br><label style="font-weight:bold;font-size:11px;">(Explain Unusual Circumstances)</label><br><label style="font-weight:bold;font-size:11px;">MODIFIER</label>'}
                ]
            });
        }

    },
    postPayProviderGrid: {
        gridDiv: "",
        gridData: {},
        onClick: {},
        initialize: function(param) {
            this.gridDiv = $(param.gridDiv);
            grids.workSpaceClaimGrid.gridData = param.gridData;
            this.onClick = param.onClick;
            this.loadGrid();
            this.fillGrid(param.gridData);

        },
        loadGrid: function() {

            getColumnIndexByName = function(columnName) {
                var cm = grids.postPayProviderGrid.gridDiv.jqGrid('getGridParam', 'colModel');
                for (var i = 0, l = cm.length; i < l; i++) {
                    if (cm[i].name === columnName) {
                        return i; // return the index
                    }
                }
                return -1;
            };

            grids.postPayProviderGrid.gridDiv.jqGrid({
                datatype: 'local',
                autowidth: true,
                height: 'auto',
                gridview: true,
                viewrecords: true,
                altRows: true,
                altclass: 'alternate_row_color',
                sortname: '',
                colNames: ['Provider ID', 'Source', 'Provider Name', 'Risk Reason', 'Provider Specialty', 'Total Claims', 'Unique Patients', '$Amount', 'Risk Score'],
                colModel: [
                    {name: 'provider', index: 'provider', width: 200},
                    //{name: 'risk_ID', index: 'risk_ID'},
                    {name: 'source', index: 'source', width: 200},
                    {name: 'provider_Name', index: 'provider_Name', classes: 'grid_cell_style', width: 250},
                    {name: 'risk_reason', index: 'risk_reason', classes: 'grid_cell_style', width: 300},
                    {name: 'Specialty', index: 'Specialty', classes: 'testPadding', width: 300},
                    {name: 'total_claims', index: 'total_claims', width: 100, align: 'center'},
                    {name: 'unique_Patients', index: 'unique_Patients', align: 'center'},
                    {name: 'amount', index: 'amount', align: 'center', width: 200},
                    {name: 'risk_score', index: 'risk_score', width: 250, classes: 'testClass'}

                ],
                onSelectRow: this.onClick
                        //aption: "Multi Select Example"
            });
        },
        fillGrid: function(data) {

            //var data = globalvars.providerDataArray;
            var index = getColumnIndexByName('risk_score');
            for (var i = 0; i < data.length; i++) {

                grids.postPayProviderGrid.gridDiv.jqGrid('addRowData', i + 1, data[i]);
                charts.providerGuageChart({
                    container: $('tr.jqgrow td:nth-child(' + (index + 1) + ')').eq(i),
                    value: data[i].risk_score,
                    // backgroundColor: (i % 2 == 0) ? '#fbfbfb' : '#ffffff'
                });

            }
            ;




        },
    },
    activeCaseUpcomingActivitiesGrid: {
        gridDiv: "",
        gridData: {},
        onClick: {},
        initialize: function(param) {
            this.gridDiv = $(param.gridDiv);
            this.onClick = param.onClick;

            this.loadGrid();
            this.emptyGrid();
            this.fillGrid();
        },
        loadGrid: function() {
            grids.activeCaseUpcomingActivitiesGrid.gridDiv.jqGrid({
                datatype: 'local',
                autowidth: true,
                height: 'auto',
                gridview: true,
                viewrecords: true,
                altRows: true,
                altclass: 'alternate_row_color',
                sortname: '',
                colNames: ['Activity', 'Due Date', ' '],
                colModel: [
                    {name: 'activity', index: 'activity'},
                    {name: 'due_date', index: 'due_date'},
                    {name: 'delete_img', index: 'delete_img', width: 50}
                ],
                onSelectRow: this.onClick
            });
        },
        emptyGrid: function() {
            grids.activeCaseUpcomingActivitiesGrid.gridDiv.clearGridData();
        },
        fillGrid: function() {
            var data = globalvars.activeCaseUpcomingActivitiesDataArray;

            for (var i = 0; i < data.length; i++) {
                grids.activeCaseUpcomingActivitiesGrid.gridDiv.jqGrid('addRowData', i + 1, data[i]);
                var trashUpcomingEventIconDiv = $("<div>");
                // trashUpcomingEventIconDiv.append($("<span style='margin-left: 20px;'>" + data[i].delete_img + "</span>"));
                trashUpcomingEventIconDiv.append($("<img class='upcoming_activities_trash_icon_due_date_column' src='common/images/icon-trash.png'>"));
                trashUpcomingEventIconDiv.append($("</div>"));
                grids.activeCaseUpcomingActivitiesGrid.gridDiv.jqGrid('setCell', i + 1, 'delete_img', "<img class='upcoming_activities_trash_icon_due_date_column' src='common/images/icon-trash.png'>", '');


            }
            ;
        },
    },
    activeCasePastActivitiesGrid: {
        gridDiv: "",
        gridData: {},
        onClick: {},
        initialize: function(param) {
            this.gridDiv = $(param.gridDiv);
            this.onClick = param.onClick;

            this.loadGrid();
            this.emptyGrid();
            this.fillGrid();
        },
        loadGrid: function() {
            grids.activeCasePastActivitiesGrid.gridDiv.jqGrid({
                datatype: 'local',
                autowidth: true,
                height: 'auto',
                gridview: true,
                viewrecords: true,
                altRows: true,
                altclass: 'alternate_row_color',
                sortname: '',
                colNames: ['Activities', 'Status', 'Note', 'Action Date', 'Investigator'],
                colModel: [
                    {name: 'activities', index: 'activities'},
                    {name: 'status', index: 'status'},
                    {name: 'note', index: 'note'},
                    {name: 'action_date', index: 'action_date'},
                    {name: 'investigator', index: 'investigator'}
                ],
                onSelectRow: this.onClick
            });
        },
        emptyGrid: function() {
            grids.activeCasePastActivitiesGrid.gridDiv.clearGridData();
        },
        fillGrid: function() {
            var data = globalvars.activeCasePastActivitiesDataArray;
            for (var i = 0; i < data.length; i++) {
                grids.activeCasePastActivitiesGrid.gridDiv.jqGrid('addRowData', i + 1, data[i]);

            }
            ;
        },
    },
    activeCaseHistoryActivitiesGrid: {
        gridDiv: "",
        gridData: {},
        onClick: {},
        initialize: function(param) {
            this.gridDiv = $(param.gridDiv);
            this.onClick = param.onClick;

            this.loadGrid();
            this.emptyGrid();
            this.fillGrid();
        },
        loadGrid: function() {
            grids.activeCaseHistoryActivitiesGrid.gridDiv.jqGrid({
                datatype: 'local',
                autowidth: true,
                height: 'auto',
                gridview: true,
                viewrecords: true,
                altRows: true,
                altclass: 'alternate_row_color',
                sortname: '',
                colNames: ['Activities', 'Status', 'Note', 'Action Date', 'Investigator'],
                colModel: [
                    {name: 'activities', index: 'activities'},
                    {name: 'status', index: 'status'},
                    {name: 'note', index: 'note'},
                    {name: 'action_date', index: 'action_date'},
                    {name: 'investigator', index: 'investigator'}
                ],
                onSelectRow: this.onClick
            });
        },
        emptyGrid: function() {
            grids.activeCaseHistoryActivitiesGrid.gridDiv.clearGridData();
        },
        fillGrid: function() {
            var data = globalvars.activeCaseHistoryActivitiesDataArray;
            for (var i = 0; i < data.length; i++) {
                grids.activeCaseHistoryActivitiesGrid.gridDiv.jqGrid('addRowData', i + 1, data[i]);
            }
            ;
        },
    },
    activeCaseSupportingDocsGrid: {
        gridDiv: "",
        gridData: {},
        onClick: {},
        initialize: function(param) {
            this.gridDiv = $(param.gridDiv);
            this.onClick = param.onClick;

            this.loadGrid();
            this.emptyGrid();
            this.fillGrid();
        },
        loadGrid: function() {
            grids.activeCaseSupportingDocsGrid.gridDiv.jqGrid({
                datatype: 'local',
                autowidth: true,
                height: 'auto',
                gridview: true,
                viewrecords: true,
                altRows: true,
                altclass: 'alternate_row_color',
                sortname: '',
                colNames: ['Type', 'Document Number', 'Title', 'Description', 'Date Created', 'Report By', ''],
                colModel: [
                    {name: 'doc_type', index: 'doc_type'},
                    {name: 'doc_num', index: 'doc_num'},
                    {name: 'doc_title', index: 'doc_title'},
                    {name: 'doc_desc', index: 'doc_desc'},
                    {name: 'doc_date_created', index: 'doc_date_created'},
                    {name: 'doc_report_by', index: 'doc_report_by'},
                    {name: 'dummy_column', index: 'dummy_column'}
                ],
                onSelectRow: this.onClick
            });
        },
        emptyGrid: function() {
            grids.activeCaseSupportingDocsGrid.gridDiv.clearGridData();
        },
        fillGrid: function() {
            var data = globalvars.activeCaseSupportingDocsDataArray;

            for (var i = 0; i < data.length; i++) {
                grids.activeCaseSupportingDocsGrid.gridDiv.jqGrid('addRowData', i + 1, data[i]);
                var download_trash_IconDiv = $("<div style='padding-top:5px;'>");
                download_trash_IconDiv.append($("<span style='margin-left: 10px;text-decoration:underline;'>Download</span>"));
                download_trash_IconDiv.append($("<img class='attached_files_trash_icon_download_link_column' src='common/images/icon-trash.png'>"));
                download_trash_IconDiv.append($("</div>"));
                grids.activeCaseSupportingDocsGrid.gridDiv.jqGrid('setCell', i + 1, 'dummy_column', download_trash_IconDiv[0].outerHTML, '');
            }
            ;
        },
    },
    activeCaseCRsummaryGrid: {
        gridDiv: "",
        gridData: {},
        onClick: {},
        initialize: function(param) {
            this.gridDiv = $(param.gridDiv);
            this.onClick = param.onClick;

            this.loadGrid();
            this.emptyGrid();
            this.fillGrid();
        },
        loadGrid: function() {
            grids.activeCaseCRsummaryGrid.gridDiv.jqGrid({
                datatype: 'local',
                autowidth: true,
                height: 'auto',
                gridview: true,
                viewrecords: true,
                altRows: true,
                altclass: 'alternate_row_color',
                sortname: '',
                colNames: ['Date', 'Description', 'Cost'],
                colModel: [
                    {name: 'cr_date', index: 'cr_date'},
                    {name: 'cr_desc', index: 'cr_desc'},
                    {name: 'cr_cost', index: 'cr_cost'}
                ],
                onSelectRow: this.onClick
            });
        },
        emptyGrid: function() {
            grids.activeCaseCRsummaryGrid.gridDiv.clearGridData();
        },
        fillGrid: function() {
            var data = globalvars.activeCaseCRsummaryDataArray;

            for (var i = 0; i < data.length; i++) {
                grids.activeCaseCRsummaryGrid.gridDiv.jqGrid('addRowData', i + 1, data[i]);
            }
            ;
        }
    },
    activeCaseCRsummaryGrid1: {
        gridDiv: "",
        gridData: {},
        onClick: {},
        initialize: function(param) {
            this.gridDiv = $(param.gridDiv);
            this.onClick = param.onClick;

            this.loadGrid();
            this.emptyGrid();
            this.fillGrid();
        },
        loadGrid: function() {
            grids.activeCaseCRsummaryGrid1.gridDiv.jqGrid({
                datatype: 'local',
                autowidth: true,
                height: 'auto',
                gridview: true,
                viewrecords: true,
                altRows: true,
                altclass: 'alternate_row_color',
                sortname: '',
                colNames: ['Date', 'Description', 'Cost'],
                colModel: [
                    {name: 'cr_date', index: 'cr_date'},
                    {name: 'cr_desc', index: 'cr_desc'},
                    {name: 'cr_cost', index: 'cr_cost'}
                ],
                onSelectRow: this.onClick
            });
        },
        emptyGrid: function() {
            grids.activeCaseCRsummaryGrid1.gridDiv.clearGridData();
        },
        fillGrid: function() {
            var data = globalvars.activeCaseCRsummaryDataArray1;

            for (var i = 0; i < data.length; i++) {
                grids.activeCaseCRsummaryGrid1.gridDiv.jqGrid('addRowData', i + 1, data[i]);
            }
            ;
        }
    },
    postNetworkGrid: {
        gridDiv: "",
        gridData: {},
        onClick: {},
        initialize: function(param) {
            this.gridDiv = $(param.gridDiv);
            grids.workSpaceClaimGrid.gridData = param.gridData;
            this.onClick = param.onClick;
            this.loadGrid();
            this.fillGrid(param.gridData);

        },
        loadGrid: function() {

            getColumnIndexByName = function(columnName) {
                var cm = grids.postNetworkGrid.gridDiv.jqGrid('getGridParam', 'colModel');
                for (var i = 0, l = cm.length; i < l; i++) {
                    if (cm[i].name === columnName) {
                        return i; // return the index
                    }
                }
                return -1;
            };

            grids.postNetworkGrid.gridDiv.jqGrid({
                datatype: 'local',
                autowidth: true,
                height: 'auto',
                gridview: true,
                viewrecords: true,
                altRows: true,
                altclass: 'alternate_row_color',
                sortname: '',
                colNames: ['', '', 'Provider ID', 'Provider Name', 'Source', 'Relationship', "Associated Entities", 'Provider Specialty', 'Total Claims', 'Unique Patients', 'Amount', 'Risk Score'],
                colModel: [
                    {name: 'memberId', index: 'memberId', hidden: true},
                    {name: 'provider', index: 'provider', hidden: true},
                    {name: 'provider_text', index: 'provider_text', class: 'provider_text', width: 250},
                    {name: 'provider_Name', index: 'provider_Name', classes: 'grid_cell_style', width: 250},
                    //{name: 'risk_ID', index: 'risk_ID'},
                    {name: 'source', index: 'source', width: 200},
                    {name: 'relation', index: 'relation', classes: 'grid_cell_style', width: 250},
                    {name: 'associated_entities', index: 'associated_entities', align: 'center', width: 180},
                    {name: 'services', index: 'services', width: 300},
                    {name: 'total_claims', index: 'total_claims', align: 'center'},
                    {name: 'unique_Patients', index: 'unique_Patients', align: 'center'},
                    {name: 'amount', index: 'amount', width: 200, align: 'center'},
                    {name: 'risk_score', index: 'risk_score', width: 250, classes: 'testClass'}

                ],
                onSelectRow: this.onClick
                        //aption: "Multi Select Example"
            });
        },
        fillGrid: function(data) {

            //var data = globalvars.networkDataArray;
            var index = getColumnIndexByName('risk_score');
            for (var i = 0; i < data.length; i++) {

                grids.postNetworkGrid.gridDiv.jqGrid('addRowData', i + 1, data[i]);
                charts.providerGuageChart({
                    container: $('tr.jqgrow td:nth-child(' + (index + 1) + ')').eq(i),
                    value: data[i].risk_score,
                    // backgroundColor: (i % 2 == 0) ? '#fbfbfb' : '#ffffff'
                });
                //var provider_text = '<a href="javascript:providerform(' + (i + 1) + ');">' + data[i].provider + '</a> <a href="javascript:memeberform(' + (i + 1) + ');">' + data[i].memberId + '</a>';
                var provider_text = data[i].provider + '<br>' + data[i].memberId;
                grids.postNetworkGrid.gridDiv.jqGrid('setCell', i + 1, 'provider_text', provider_text, '');

            }
            ;
        }
    },
    providerFormClaimData: {
        gridDiv: "",
        gridData: {},
        onClick: {},
        initialize: function(param) {
            this.gridDiv = $(param.gridDiv);
            grids.providerFormClaimData.gridData = param.gridData;
            this.onClick = param.onClick;
            this.loadGrid();
            this.fillGrid();

        },
        loadGrid: function() {

            grids.providerFormClaimData.gridDiv.jqGrid({
                datatype: 'local',
                autowidth: true,
                height: 'auto',
                gridview: true,
                viewrecords: true,
                altRows: true,
                altclass: 'alternate_row_color',
                sortname: '',
                colNames: ['Claim Number', 'Reason Code', 'Claim Date', 'Review Outcome', 'Referring Provider', 'Paid/Allowed Amount', 'Comments'],
                colModel: [
                    {name: 'claim_no', index: 'claim_no'},
                    {name: 'reason_code', index: 'reason_code'},
                    {name: 'claim_date', index: 'claim_date'},
                    {name: 'review_outcome', index: 'review_outcome', classes: 'grid_cell_style'},
                    {name: 'referring_provider', index: 'referring_provider', classes: 'grid_cell_style'},
                    {name: 'paid_amount', index: 'paid_amount'},
                    {name: 'comments', index: 'comments'}


                ],
                subGrid: true,
                subGridOptions: {"plusicon": "ui-icon-triangle-1-e",
                    "minusicon": "ui-icon-triangle-1-s",
                    "openicon": "ui-icon-arrowreturn-1-e",
                    "reloadOnExpand": true,
                    "selectOnExpand": true},
                subGridRowExpanded: function(subgrid_id, row_id) {
                    log("subgrid_id:::" + subgrid_id + "::::::" + row_id);
                    var subgrid_table_id, pager_id;
                    subgrid_table_id = subgrid_id + "_t";
                    pager_id = "p_" + subgrid_table_id;
                    //$("#"+subgrid_id).append("<div id='"+pager_id+"' class='scroll'>Test The Div Element</div>");
                    $("#" + subgrid_id).empty();
                    var selectedClaimDetails = {};
                    var selectClaimNo = globalvars.providerFormDataArray[row_id - 1].claim_no;
                    var subgrid_table_id = subgrid_id + "_t";
                    var pager_id = "p_" + subgrid_table_id;
                    log("selectClaimNo::::::::" + selectClaimNo);
                    for (var i = 0; i < globalvars.providerFormClaimDetailsDataArray.length; i++) {
                        if (globalvars.providerFormClaimDetailsDataArray[i].claim_no == selectClaimNo) {
                            selectedClaimDetails = globalvars.providerFormClaimDetailsDataArray[i];
                            selectedClaimDetails['sub_grid_wrapper_table_wrapper'] = pager_id;
                            selectedClaimDetails['sub_grid_wrapper_table'] = subgrid_table_id;
                            selectedClaimDetails['expand_view_style_label'] = subgrid_table_id + "_label";

                            break;
                        }
                    }
                    getSYNC('common/templates/grid_expand_row_template.html', function(data) {
                        $("#" + subgrid_id).append($.nano(data, selectedClaimDetails));
                        var id = grids.providerFormClaimData.gridDiv.attr('id');
                        $('#' + id).find('table.grid_form_detail tbody tr td').attr('style', 'border-bottom:0px solid #F0F0F0;text-align: left; font-weight: bold;');
                        $('#' + id).find('table.grid_form_new tbody tr td').attr('style', 'border-bottom:0px solid #F0F0F0;text-align: left;background-color: #FEE6CD;');
                        grids.providerFormClaimSubGridData.initialize({
                            gridDiv: $("#" + subgrid_table_id),
                            onClick: function(id) {

                            }
                        });

                    });

                    screens.providerDetailsForm.gridState = "collapse";
                    //$("#"+subgrid_id).append(gridExpandTemplate);
                },
                subGridRowColapsed: function(subgrid_id, row_id) {
                    $("#" + subgrid_id).empty();
                    grids.providerFormClaimData.gridDiv.jqGrid('resetSelection');
                    screens.providerDetailsForm.gridState = "collapse";
                },
                onSelectRow: this.onClick
                        //aption: "Multi Select Example"
            });
        },
        fillGrid: function() {

            var data = globalvars.providerFormDataArray;
            for (var i = 0; i < data.length; i++) {

                grids.providerFormClaimData.gridDiv.jqGrid('addRowData', i + 1, data[i]);


            }
            ;




        },
    },
    providerFormClaimSubGridData: {
        gridDiv: "",
        gridData: {},
        onClick: {},
        initialize: function(param) {
            this.gridDiv = $(param.gridDiv);
            grids.providerFormClaimSubGridData.gridData = param.gridData;
            this.onClick = param.onClick;
            this.loadGrid();
            this.fillGrid();

        },
        loadGrid: function() {

            grids.providerFormClaimSubGridData.gridDiv.jqGrid({
                datatype: 'local',
                autowidth: true,
                gridview: true,
                viewrecords: true,
                altRows: true,
                height: this.gridDiv.height(),
                altclass: 'alternate_row_color',
                sortname: '',
                scrollerbar: false,
                colNames: ['Service Date', 'CPT/HCPCS Code', 'Description', 'Quantity', 'Billed Amount', 'Paid/Allowed Amount'],
                colModel: [
                    {name: 'service_date', index: 'service_date', sortable: false, class: 'sub_grid_wrapper_table_wrapper'},
                    {name: 'cpt_hcpcs_code', index: 'cpt_hcpcs_code'},
                    {name: 'description', index: 'description'},
                    {name: 'quantity', index: 'quantity', classes: 'grid_cell_style'},
                    {name: 'claim_amount', index: 'claim_amount', classes: 'grid_cell_style'},
                    {name: 'paid_amount', index: 'paid_amount'}


                ],
                onSelectRow: this.onClick
                        //aption: "Multi Select Example"
            });
        },
        fillGrid: function() {
            //console.log('ABC--------' + grids.providerFormClaimSubGridData.gridDiv.attr('id'));
            var id = grids.providerFormClaimSubGridData.gridDiv.attr('id');
            // grids.providerFormClaimSubGridData.gridDiv.find(".ui-jqgrid-htable").find('th').attr('style','background-color: #f0f0f0;  color: #000000;    border: 0px;    border-color: #ffffff;');
            $("#gview_" + id).find(".ui-jqgrid-htable").find('th').attr('style', 'background-color: #f0f0f0;color: #000000;border: 0px;border-color: #ffffff;');
            //   $("#gview_" + id).find(".ui-jqgrid-htable").find('td').attr('style', 'background-color: #f0f0f0;color: #000000;border-bottom:1px;border-color: #ffffff;');
            var data = globalvars.providerFormClaimDescArray;
            for (var i = 0; i < data.length; i++) {

                grids.providerFormClaimSubGridData.gridDiv.jqGrid('addRowData', i + 1, data[i]);


            }
            ;




        },
    },
    networkFormClaimData: {
        gridDiv: "",
        gridData: {},
        onClick: {},
        initialize: function(param) {
            this.gridDiv = $(param.gridDiv);
            grids.networkFormClaimData.gridData = param.gridData;
            this.onClick = param.onClick;
            this.loadGrid();
            this.fillGrid();
        },
        loadGrid: function() {
            grids.networkFormClaimData.gridDiv.jqGrid({
                datatype: 'local',
                autowidth: true,
                height: 'auto',
                gridview: true,
                viewrecords: true,
                altRows: true,
                altclass: 'alternate_row_color',
                sortname: '',
                colNames: ['Claim Number', 'Reason Code', 'Claim Date', 'Review Outcome', 'Referring Provider', 'Paid/Allowed Amount', 'Comments'],
                colModel: [
                    {name: 'claim_no', index: 'claim_no'},
                    {name: 'reason_code', index: 'reason_code'},
                    {name: 'claim_date', index: 'claim_date'},
                    {name: 'review_outcome', index: 'review_outcome', classes: 'grid_cell_style'},
                    {name: 'referring_provider', index: 'referring_provider', classes: 'grid_cell_style'},
                    {name: 'paid_amount', index: 'paid_amount'},
                    {name: 'comments', index: 'comments'}
                ],
                subGrid: true,
                subGridOptions: {"plusicon": "ui-icon-triangle-1-e",
                    "minusicon": "ui-icon-triangle-1-s",
                    "openicon": "ui-icon-arrowreturn-1-e",
                    "reloadOnExpand": true,
                    "selectOnExpand": true},
                subGridRowExpanded: function(subgrid_id, row_id) {
                    log("subgrid_id:::" + subgrid_id + "::::::" + row_id);
                    var subgrid_table_id, pager_id;
                    subgrid_table_id = subgrid_id + "_t";
                    pager_id = "p_" + subgrid_table_id;
                    //$("#"+subgrid_id).append("<div id='"+pager_id+"' class='scroll'>Test The Div Element</div>");
                    $("#" + subgrid_id).empty();
                    var selectedClaimDetails = {};
                    var selectClaimNo = grids.networkFormClaimData.gridData[row_id - 1].claim_no;
                    var subgrid_table_id = subgrid_id + "_t";
                    var pager_id = "p_" + subgrid_table_id;
                    log("selectClaimNo::::::::" + selectClaimNo);
                    for (var i = 0; i < globalvars.networkFormClaimDetailsDataArray.length; i++) {
                        if (globalvars.networkFormClaimDetailsDataArray[i].claim_no == selectClaimNo) {
                            selectedClaimDetails = globalvars.networkFormClaimDetailsDataArray[i];
                            selectedClaimDetails['sub_grid_wrapper_table_wrapper'] = pager_id;
                            selectedClaimDetails['sub_grid_wrapper_table'] = subgrid_table_id;
                            selectedClaimDetails['expand_view_style_label'] = subgrid_table_id + "_label";
                            break;
                        }
                    }
                    getSYNC('common/templates/grid_expand_row_template.html', function(data) {
                        $("#" + subgrid_id).append($.nano(data, selectedClaimDetails));
                        var id = grids.networkFormClaimData.gridDiv.attr('id');
                        $('#' + id).find('table.grid_form_detail tbody tr td').attr('style', 'border-bottom:0px solid #F0F0F0;text-align: left; font-weight: bold;');
                        $('#' + id).find('table.grid_form_new tbody tr td').attr('style', 'border-bottom:0px solid #F0F0F0;text-align: left;background-color: #FEE6CD;');
                        grids.networkFormClaimSubGridData.initialize({
                            gridDiv: $("#" + subgrid_table_id),
                            onClick: function(id) {
                            }
                        });
                    });
                    screens.networkDetailsForm.gridState = "collapse";
                    //$("#"+subgrid_id).append(gridExpandTemplate);
                },
                subGridRowColapsed: function(subgrid_id, row_id) {
                    $("#" + subgrid_id).empty();
                    grids.networkFormClaimData.gridDiv.jqGrid('resetSelection');
                    screens.networkDetailsForm.gridState = "collapse";
                },
                onSelectRow: this.onClick
                        //aption: "Multi Select Example"
            });
        },
        fillGrid: function() {

            var data = grids.networkFormClaimData.gridData;
            for (var i = 0; i < data.length; i++) {
                grids.networkFormClaimData.gridDiv.jqGrid('addRowData', i + 1, data[i]);
            }
            ;
        },
    },
    networkFormClaimSubGridData: {
        gridDiv: "",
        gridData: {},
        onClick: {},
        initialize: function(param) {
            this.gridDiv = $(param.gridDiv);
            grids.networkFormClaimSubGridData.gridData = param.gridData;
            this.onClick = param.onClick;
            this.loadGrid();
            this.fillGrid();

        },
        loadGrid: function() {

            grids.networkFormClaimSubGridData.gridDiv.jqGrid({
                datatype: 'local',
                autowidth: true,
                gridview: true,
                viewrecords: true,
                altRows: true,
                height: this.gridDiv.height(),
                altclass: 'alternate_row_color',
                sortname: '',
                scrollerbar: false,
                colNames: ['Service Date', 'CPT/HCPCS Code', 'Description', 'Quantity', 'Billed Amount', 'Paid/Allowed Amount'],
                colModel: [
                    {name: 'service_date', index: 'service_date', sortable: false, class: 'sub_grid_wrapper_table_wrapper'},
                    {name: 'cpt_hcpcs_code', index: 'cpt_hcpcs_code'},
                    {name: 'description', index: 'description'},
                    {name: 'quantity', index: 'quantity', classes: 'grid_cell_style'},
                    {name: 'claim_amount', index: 'claim_amount', classes: 'grid_cell_style'},
                    {name: 'paid_amount', index: 'paid_amount'}


                ],
                onSelectRow: this.onClick
                        //aption: "Multi Select Example"
            });
        },
        fillGrid: function() {
            //console.log('ABC--------' + grids.providerFormClaimSubGridData.gridDiv.attr('id'));
            var id = grids.networkFormClaimSubGridData.gridDiv.attr('id');
            // grids.providerFormClaimSubGridData.gridDiv.find(".ui-jqgrid-htable").find('th').attr('style','background-color: #f0f0f0;  color: #000000;    border: 0px;    border-color: #ffffff;');
            $("#gview_" + id).find(".ui-jqgrid-htable").find('th').attr('style', 'background-color: #f0f0f0;color: #000000;border: 0px;border-color: #ffffff;');
            //   $("#gview_" + id).find(".ui-jqgrid-htable").find('td').attr('style', 'background-color: #f0f0f0;color: #000000;border-bottom:1px;border-color: #ffffff;');
            var data = globalvars.networkFormClaimDescArray;
            for (var i = 0; i < data.length; i++) {
                grids.networkFormClaimSubGridData.gridDiv.jqGrid('addRowData', i + 1, data[i]);
            }
            ;
        },
    },
    postActiveCaseGrid: {
        gridDiv: "",
        gridData: {},
        onClick: {},
        initialize: function(param) {
            this.gridDiv = $(param.gridDiv);
            grids.workSpaceClaimGrid.gridData = param.gridData;
            this.onClick = param.onClick;
            this.loadGrid();
            this.fillGrid(param.gridData);

        },
        loadGrid: function() {

            getColumnIndexByName = function(columnName) {
                var cm = grids.postActiveCaseGrid.gridDiv.jqGrid('getGridParam', 'colModel');
                for (var i = 0, l = cm.length; i < l; i++) {
                    if (cm[i].name === columnName) {
                        return i; // return the index
                    }
                }
                return -1;
            };

            grids.postActiveCaseGrid.gridDiv.jqGrid({
                datatype: 'local',
                autowidth: true,
                height: 'auto',
                gridview: true,
                viewrecords: true,
                altRows: true,
                altclass: 'alternate_row_color',
                sortname: '',
                colNames: ['Case#', 'Source', 'Provider Name', 'Rejection Reason', 'Provider Specialty', 'Total Claims', '$Amount'],
                colModel: [
                    //{name: 'score_image', index: 'score_image', classes: 'score_image', width: 50},
                    {name: 'caseId', index: 'caseId', align: "center", width: 200},
                    {name: 'source', index: 'source', width: 200},
                    {name: 'provider_Name', index: 'provider_Name', classes: 'grid_cell_style', width: 200},
                    {name: 'risk_reason', index: 'risk_reason', classes: 'grid_cell_style', width: 300},
                    {name: 'provider_Specialty', index: 'provider_Specialty', width: 300},
                    {name: 'total_claims', index: 'total_claims', align: "center", width: 200},
                    {name: 'amount', index: 'amount', align: "center", width: 200}
                ],
                onSelectRow: this.onClick
                        //aption: "Multi Select Example"
            });
        },
        fillGrid: function(data) {

            //var data = globalvars.caseActiveDataArray;
            for (var i = 0; i < data.length; i++) {

                grids.postActiveCaseGrid.gridDiv.jqGrid('addRowData', i + 1, data[i]);
//                var img_div = '<img alt="" height="22px;" src="common/images/link_small.png">';
//                grids.postActiveCaseGrid.gridDiv.jqGrid('setCell', i + 1, 'score_image', img_div, '');

            }
        }
    },
    postPayMemberGrid: {
        gridDiv: "",
        gridData: {},
        onClick: {},
        initialize: function(param) {
            this.gridDiv = $(param.gridDiv);
            grids.workSpaceClaimGrid.gridData = param.gridData;
            this.onClick = param.onClick;
            this.loadGrid();
            this.fillGrid(param.gridData);

        },
        loadGrid: function() {

            getColumnIndexByName = function(columnName) {
                var cm = grids.postPayProviderGrid.gridDiv.jqGrid('getGridParam', 'colModel');
                for (var i = 0, l = cm.length; i < l; i++) {
                    if (cm[i].name === columnName) {
                        return i; // return the index
                    }
                }
                return -1;
            };

            grids.postPayMemberGrid.gridDiv.jqGrid({
                datatype: 'local',
                autowidth: true,
                height: 'auto',
                gridview: true,
                viewrecords: true,
                altRows: true,
                altclass: 'alternate_row_color',
                sortname: '',
                colNames: ['Provider ID', 'Source', 'Provider Name', 'Risk Reason', 'Services', 'Total Claims', 'Unique Patients', '$Amount', 'Risk Score'],
                colModel: [
                    {name: 'provider', index: 'provider', width: 200},
                    //{name: 'risk_ID', index: 'risk_ID'},
                    {name: 'source', index: 'source', width: 200},
                    {name: 'provider_Name', index: 'provider_Name', classes: 'grid_cell_style', width: 250},
                    {name: 'risk_reason', index: 'risk_reason', classes: 'grid_cell_style', width: 250},
                    {name: 'provider_Specialty', index: 'provider_Specialty', width: 250},
                    {name: 'total_claims', index: 'total_claims', align: 'center'},
                    {name: 'unique_Patients', index: 'unique_Patients', align: 'center'},
                    {name: 'amount', index: 'amount', align: 'center'},
                    {name: 'risk_score', index: 'risk_score', width: 250, classes: 'testClass'}

                ],
                onSelectRow: this.onClick
                        //aption: "Multi Select Example"
            });
        },
        fillGrid: function(data) {

            //var data = globalvars.memberDataArray;
            var index = getColumnIndexByName('risk_score');
            for (var i = 0; i < data.length; i++) {

                grids.postPayMemberGrid.gridDiv.jqGrid('addRowData', i + 1, data[i]);
                charts.providerGuageChart({
                    container: $('tr.jqgrow td:nth-child(' + (index + 1) + ')').eq(i),
                    value: data[i].risk_score,
                    // backgroundColor: (i % 2 == 0) ? '#fbfbfb' : '#ffffff'
                });

            }
            ;
        },
    },
    postsearchCaseGrid: {
        gridDiv: "",
        gridData: {},
        onClick: {},
        initialize: function(param) {
            this.gridDiv = $(param.gridDiv);
            grids.workSpaceClaimGrid.gridData = param.gridData;
            this.onClick = param.onClick;
            this.loadGrid();
            this.fillGrid(param.gridData);

        },
        loadGrid: function() {

            getColumnIndexByName = function(columnName) {
                var cm = grids.postsearchCaseGrid.gridDiv.jqGrid('getGridParam', 'colModel');
                for (var i = 0, l = cm.length; i < l; i++) {
                    if (cm[i].name === columnName) {
                        return i; // return the index
                    }
                }
                return -1;
            };

            grids.postsearchCaseGrid.gridDiv.jqGrid({
                datatype: 'local',
                autowidth: true,
                height: 'auto',
                gridview: true,
                viewrecords: true,
                altRows: true,
                altclass: 'alternate_row_color',
                sortname: '',
                colNames: ['Case#', 'Source', 'Provider Name', 'Rejection Reason', 'Status', 'Provider Specialty', 'Total Claims', '$Amount'],
                colModel: [
                    //{name: 'score_image', index: 'score_image', classes: 'score_image', width: 30},
                    {name: 'caseId', index: 'caseId', align: "center", width: 150},
                    {name: 'source', index: 'source', width: 150},
                    {name: 'provider_Name', index: 'provider_Name', classes: 'grid_cell_style'},
                    {name: 'risk_reason', index: 'risk_reason', classes: 'grid_cell_style'},
                    {name: 'status', index: 'status'},
                    {name: 'provider_Specialty', index: 'provider_Specialty'},
                    {name: 'total_claims', index: 'total_claims', align: "center", width: 100},
                    {name: 'amount', index: 'amount', align: "center", width: 150}

                ],
                onSelectRow: this.onClick
                        //aption: "Multi Select Example"
            });
        },
        fillGrid: function(data) {

            // var data = globalvars.caseSearchDataArray;
            for (var i = 0; i < data.length; i++) {

                grids.postsearchCaseGrid.gridDiv.jqGrid('addRowData', i + 1, data[i]);
//                var img_div = '<img alt="" src="common/images/link_small.png">';
//                grids.postsearchCaseGrid.gridDiv.jqGrid('setCell', i + 1, 'score_image', img_div, '');

            }
        }
    },
    explorerSummayGrid: {
        gridDiv: "",
        gridData: {},
        onClick: {},
        initialize: function(param) {
            this.gridDiv = $(param.gridDiv);
            grids.explorerSummayGrid.gridData = param.gridData;
            this.onClick = param.onClick;
            this.loadGrid();
            this.fillGrid(param.gridData);

        },
        loadGrid: function() {

            getColumnIndexByName = function(columnName) {
                var cm = grids.explorerSummayGrid.gridDiv.jqGrid('getGridParam', 'colModel');
                for (var i = 0, l = cm.length; i < l; i++) {
                    if (cm[i].name === columnName) {
                        return i; // return the index
                    }
                }
                return -1;
            };

            grids.explorerSummayGrid.gridDiv.jqGrid({
                datatype: 'local',
                autowidth: true,
                height: 'auto',
                gridview: true,
                viewrecords: true,
                altRows: true,
                altclass: 'alternate_row_color',
                sortname: '',
                colNames: ['Provider ID', 'Provider Name', 'Specialty', 'Risk Score', 'Total Amount', 'Risk Amount','',''],
                colModel: [
                    {name: 'providerId', index: 'providerId', },
                    {name: 'providerName', index: 'providerName'},
                    // {name: 'risk_reason1', index: 'risk_reason1'},
                    {name: 'provider_specialty', index: 'provider_specialty', width: 300, align: 'center'},
                    {name: 'risk_score', index: 'risk_score', align: 'center'},
                    // {name: 'total_Claim', index: 'total_Claim', width: 100},
                    //{name: 'unique_patient', index: 'unique_patient'},
                    {name: 'amount', index: 'amount'},
                    {name: 'risk_amount', index: 'risk_amount'},
                    {name: 'provider_group', index: 'provider_group', hidden: true},
                    {name: 'address', index: 'address', hidden: true}

                ],
                onSelectRow: this.onClick
                        //aption: "Multi Select Example"
            });
        },
        fillGrid: function(data) {
            grids.explorerSummayGrid.gridDiv.jqGrid('clearGridData');
            for (var i = 0; i < data.length; i++) {
                grids.explorerSummayGrid.gridDiv.jqGrid('addRowData', i + 1, data[i]);
            }
        }
    },
    analysisSummaryGrid: {
        gridDiv: "",
        gridData: {},
        onClick: {},
        initialize: function(param) {
            this.gridDiv = $(param.gridDiv);
            this.onClick = param.onClick;
            grids.analysisSummaryGrid.gridData = param.gridData;
            grids.analysisSummaryGrid.gridData.peer = param.peer;
            this.loadGrid();
            this.emptyGrid();
            this.fillGrid();
        },
        loadGrid: function() {
            grids.analysisSummaryGrid.gridDiv.jqGrid({
                datatype: 'local',
                autowidth: false,
                height: 'auto',
                gridview: true,
                viewrecords: true,
                altRows: true,
                altclass: 'alternate_row_color',
                sortname: '',
                colNames: ['Flag', 'Provider value', 'Peer value', '% Diff.'],
                colModel: [
                    {name: 'flag', index: 'flag', width: 200, align: 'center', },
                    {name: 'providerValue', index: 'providerValue'},
                    {name: 'peerAvgValue', index: 'peerAvgValue', hidden: true},
                    {name: 'percentDev', index: 'percentDev', hidden: true}
                ],
                onSelectRow: this.onClick,
                loadComplete: function(){
                	if(grids.analysisSummaryGrid.gridData.peer){
                		var colPos = 1;
                		grids.analysisSummaryGrid.gridDiv.jqGrid('showCol', grids.analysisSummaryGrid.gridDiv.getGridParam("colModel")[colPos+1].name);
                	}
                }
            });
        },
        emptyGrid: function() {
            grids.analysisSummaryGrid.gridDiv.clearGridData();
        },
        fillGrid: function() {
            var data = grids.analysisSummaryGrid.gridData;

            for (var i = 0; i < data.length; i++) {
                grids.analysisSummaryGrid.gridDiv.jqGrid('addRowData', i + 1, data[i]);
            }
            ;
        }
    },
    auditorAssignmentGrid: {
        gridDiv: "",
        gridData: {},
        onClick: {},
        originalAuditorOptions:"",
        initialize: function(param) {
            this.gridDiv = $(param.gridDiv);
            this.originalAuditorOptions = param.originalAuditorOptions;
            this.onClick = param.onClick;
            grids.auditorAssignmentGrid.gridData = param.gridData;
            this.loadGrid();
            this.emptyGrid();
            this.fillGrid();
        },
        loadGrid: function() {
            grids.auditorAssignmentGrid.gridDiv.jqGrid({
                datatype: 'local',
                autowidth: true,
                height: 'auto',
                gridview: true,
                viewrecords: true,
                altRows: true,
                altclass: 'alternate_row_color',
                sortname: '',
                colNames: ['Region', 'Assigned Auditors', 'Assigned Level', 'Clear All Lower Levels','Selected Auditor','Original Assigned Auditor'],
                colModel: [
                    {name: 'regionName', index: 'regionName', width: 200, align: 'center', },
                    {name: 'auditorName', index: 'auditorName',width:350,fixed:true,editable:true,sortable:false,classes:'grid_cell_style'},
                    {name: 'status', index: 'status'},
                    {name: 'count', index: 'count'},
                    { name: 'selectedAuditor', index: 'selectedAuditor',hidden:true,search:true},
                    { name: 'originalAuditorName', index: 'originalAuditorName',hidden:true,search:true},
                ],
                onSelectRow: function(id) {

                    grids.auditorAssignmentGrid.savePreviousRow();
                    grids.auditorAssignmentGrid.selectedRow = id;
                    var auditorNameDropDown = new String();
                    auditorNameDropDown = "<div class='prebill_auditor_selector_div'><select id='prebill_auditor_dropdown" + id + "' multiple='multiple' onchange='grids.auditorAssignmentGrid.preBillAuditorChange(this," + id + ")' style=width:300px;>";
                    auditorNameDropDown += grids.auditorAssignmentGrid.originalAuditorOptions;
                    auditorNameDropDown += "</select></div>";
                    grids.auditorAssignmentGrid.gridDiv.jqGrid('editRow', id, true);
                    grids.auditorAssignmentGrid.gridDiv.jqGrid('setCell', id, 'auditorName', auditorNameDropDown);
                    var preBillSelectedAuditortext = grids.auditorAssignmentGrid.gridDiv.jqGrid('getCell', id, 'selectedAuditor');
                    var preBillRetainAuditorList = preBillSelectedAuditortext.split(",");
                    $("#prebill_auditor_dropdown"+id).val(preBillRetainAuditorList);
                    
//                     var preBillSelectedAuditortext = grids.auditorAssignmentGrid.jqGrid('getCell', id, 'preBillSelectedAuditor');
//                            var preBillRetainAuditorList = preBillSelectedAuditortext.split(",");
//                    $("#prebill_auditor_dropdown" + id).val(preBillRetainAuditorList);
                    $("#prebill_auditor_dropdown" + id).multiselect({
                        multiple: true,
                        minWidth: 250,
                        selectedList: 40
                    }).multiselectfilter();
                },
                editurl: 'clientArray',
                ignoreCase: true,
                loadComplete: function () {
                	grids.auditorAssignmentGrid.gridDiv.jqGrid('setLabel', 'auditorName', '', {'text-align':'left', 'padding-left':'16px', 'width':'336px'});
                	
                }
            });
        },
        preBillAuditorChange : function(selectObj,id){
    		
    		var prebill_auditors = $("#prebill_auditor_dropdown"+id).multiselect("getChecked");
    		var selected_auditor_list_prebill = new Array();
    		//log(prebill_auditors); /*Use the Log statement when required*/
    		for(var i =0; i < prebill_auditors.length; i++){
    			//log($(prebill_auditors[i]).attr('value')); /*Use the Log statement when required*/
    			selected_auditor_list_prebill.push($(prebill_auditors[i]).attr('value'));
    			
    		}
    		grids.auditorAssignmentGrid.gridDiv.jqGrid('setCell', id, 'selectedAuditor',selected_auditor_list_prebill);
    		
    	},
        emptyGrid: function() {
            grids.auditorAssignmentGrid.gridDiv.clearGridData();
        },
        savePreviousRow:function(){
      		if (grids.auditorAssignmentGrid.selectedRow !== undefined) {
      			
    			grids.auditorAssignmentGrid.gridDiv.jqGrid('saveRow', grids.auditorAssignmentGrid.selectedRow);
        	    var prebill_auditors_text = grids.auditorAssignmentGrid.gridDiv.jqGrid('getCell', grids.auditorAssignmentGrid.selectedRow, 'selectedAuditor');
        	    var prebill_auditors_list = prebill_auditors_text.split(",");
                var current_prebill_auditors_text = new String();
                
                var preBillOriginalAuditortext = grids.auditorAssignmentGrid.gridDiv.jqGrid('getCell', grids.auditorAssignmentGrid.selectedRow, 'originalAuditorName');
                var preBillOriginalAuditorList = preBillOriginalAuditortext.split(",");
                
                for(var i =0;i<prebill_auditors_list.length;i++){
                	current_prebill_auditors_text+= prebill_auditors_list[i]+"<br/>";
                }
                grids.auditorAssignmentGrid.gridDiv.jqGrid('setCell', grids.auditorAssignmentGrid.selectedRow,'auditorName',current_prebill_auditors_text);
      		}
    	},
    	
        fillGrid: function() {
            var data = grids.auditorAssignmentGrid.gridData;
            var datalength = data.length;
            var billAuditors;
            var auditorsText;
            var selectedAuditors;
            for(var i =0;i<datalength;i++){
            	
             billAuditors = new Array();  
             billAuditors = data[i].auditors;
   			 auditorsText = new String();
   			 selectedAuditors = new Array();
   			 for(var j = 0;j<billAuditors.length;j++){
   				auditorsText+= billAuditors[j].userId+'<br/>';
   				selectedAuditors.push(billAuditors[j].userId);
   			 }
   			 
   			 grids.auditorAssignmentGrid.gridDiv.jqGrid('addRowData', i + 1, {
   				 regionName :  data[i].regionName,
   				 status :  data[i].status,
   				 count :  data[i].count,
   				 auditorName : auditorsText,
				 selectedAuditor : selectedAuditors,
				 originalAuditorName : selectedAuditors,
				 
			 });
   			 
   			 
            	
            }
            grids.auditorAssignmentGrid.gridDiv.setGridParam({ rowNum: 30 }).trigger("reloadGrid");
            
            
            
        }
    },
    auditorAssignmentSubGrid: {
        gridDiv: "",
        gridData: {},
        onClick: {},
        initialize: function(param) {
            this.gridDiv = $(param.gridDiv);
            this.onClick = param.onClick;
            grids.auditorAssignmentSubGrid.gridData = param.gridData;
            this.loadGrid();
            this.emptyGrid();
            this.fillGrid();
        },
        loadGrid: function() {
            grids.auditorAssignmentSubGrid.gridDiv.jqGrid({
                datatype: 'local',
                autowidth: true,
                height: 'auto',
                gridview: true,
                viewrecords: true,
                altRows: true,
                altclass: 'alternate_row_color',
                sortname: '',
                colNames: ['Risk Reason', 'Assigned Auditors', 'Assigned Level', 'Clear All Lower Levels'],
                colModel: [
                    {name: 'specialty', index: 'specialty', width: 200, align: 'center', },
                    {name: 'auditorName', index: 'auditorName'},
                    {name: 'count', index: 'count'},
                    {name: 'img', index: 'img'}
                ],
                onSelectRow: this.onClick
            });
        },
        emptyGrid: function() {
            grids.auditorAssignmentSubGrid.gridDiv.clearGridData();
        },
        fillGrid: function() {
            var data = grids.auditorAssignmentSubGrid.gridData;
            for (var i = 0; i < data.length; i++) {
                grids.auditorAssignmentSubGrid.gridDiv.jqGrid('addRowData', i + 1, data[i]);
            }
            ;
        }
    },
    
    supervisorTaskClaimAssigmentGrid: {
        gridDiv: "",
        gridData: {},
        onClick: {},
        initialize: function(param) {
            this.gridDiv = $(param.gridDiv);
            this.onClick = param.onClick;
            grids.supervisorTaskClaimAssigmentGrid.gridData = param.gridData;
            this.loadGrid();
            this.emptyGrid();
            this.fillGrid();
        },
        loadGrid: function() {
            grids.supervisorTaskClaimAssigmentGrid.gridDiv.jqGrid({
                datatype: 'local',
                autowidth: true,
                height: 'auto',
                gridview: true,
                viewrecords: true,
                altRows: true,
                altclass: 'alternate_row_color',
                sortname: '',
                colNames: ['Claim ID', 'Facility Name', 'Risk', 'Auditor Assigned To','Amount','Status'],
                colModel: [
                    {name: 'c_id', index: 'c_id', align: 'center', },
                    {name: 'facilityName', index: 'facilityName'},
                    {name: 'risk', index: 'risk'},
                    {name: 'auditorTo', index: 'auditorTo'},
                    {name: 'amount', index: 'amount'},
                    {name: 'status', index: 'status'},
                ],
                onSelectRow: this.onClick
            });
        },
        emptyGrid: function() {
            grids.supervisorTaskClaimAssigmentGrid.gridDiv.clearGridData();
        },
        fillGrid: function() {
        	var a_array = [{"c_id":"2385678","facilityName":"Atlantic Hospital","risk":"Oliver","auditorTo":"Bob","amount":"$567","status":"Pending"},
        	               {"c_id":"2385678","facilityName":"Atlantic Hospital","risk":"Oliver","auditorTo":"Bob","amount":"$567","status":"Pending"},
        	               {"c_id":"2385678","facilityName":"Atlantic Hospital","risk":"Oliver","auditorTo":"Bob","amount":"$567","status":"Pending"},
        	               {"c_id":"2385678","facilityName":"Atlantic Hospital","risk":"Oliver","auditorTo":"Bob","amount":"$567","status":"Pending"},
        	               {"c_id":"2385678","facilityName":"Atlantic Hospital","risk":"Oliver","auditorTo":"Bob","amount":"$567","status":"Pending"}];
        	
        	
            //var data = grids.supervisorTaskClaimAssigmentGrid.gridData;
        	
        	var data = a_array;
            for (var i = 0; i < data.length; i++) {
                grids.supervisorTaskClaimAssigmentGrid.gridDiv.jqGrid('addRowData', i + 1, data[i]);
            }
            ;
        }
    },
    
    supervisorTaskAuditorAssigmentGrid: {
        gridDiv: "",
        gridData: {},
        onClick: {},
        initialize: function(param) {
            this.gridDiv = $(param.gridDiv);
            this.onClick = param.onClick;
            grids.supervisorTaskAuditorAssigmentGrid.gridData = param.gridData;
            this.loadGrid();
            this.emptyGrid();
            this.fillGrid();
        },
        loadGrid: function() {
            grids.supervisorTaskAuditorAssigmentGrid.gridDiv.jqGrid({
                datatype: 'local',
                autowidth: true,
                height: 'auto',
                gridview: true,
                viewrecords: true,
                altRows: true,
                altclass: 'alternate_row_color',
                sortname: '',
                colNames: ['Facility', 'Facility Name', 'Auditor Proposed','Auditor'],
                colModel: [
                    {name: 'f_id', index: 'f_id', align: 'center'},
                    {name: 'facilityName', index: 'facilityName',align: 'center'},
                    {name: 'auditor_proposed', index: 'auditor_proposed',align: 'center'},
                    {name: 'auditor', index: 'auditor',align: 'center'}
                   
                ],
                onSelectRow: this.onClick
            });
        },
        emptyGrid: function() {
            grids.supervisorTaskAuditorAssigmentGrid.gridDiv.clearGridData();
        },
        fillGrid: function() {
        	var a_array = [{"f_id":"101","facilityName":"Atlantic Hospital","auditor_proposed":"Bob","auditor":"Jack"},
        	               {"f_id":"102","facilityName":"Atlantic Hospital","auditor_proposed":"Bob","auditor":"Jack"},
        	               {"f_id":"103","facilityName":"Atlantic Hospital","auditor_proposed":"Bob","auditor":"Jack"},
        	               {"f_id":"104","facilityName":"Atlantic Hospital","auditor_proposed":"Bob","auditor":"Jack"},
        	               {"f_id":"105","facilityName":"Atlantic Hospital","auditor_proposed":"Bob","auditor":"Jack"}];
        	
        	
            //var data = grids.supervisorTaskClaimAssigmentGrid.gridData;
        	
        	var data = a_array;
            for (var i = 0; i < data.length; i++) {
                grids.supervisorTaskAuditorAssigmentGrid.gridDiv.jqGrid('addRowData', i + 1, data[i]);
            }
            ;
        }
    }
    
};