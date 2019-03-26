var grids = {
    billAccountReviewGrid: {
        gridDiv: "",
        $gridDiv: {},
        pagerDiv: "",
        data: {},
        onClick: {},
        highlightedRows: [],
        showPType:'',
        initialize: function(param) {
            log(param);
            this.gridDiv = param.gridDiv;
            this.$gridDiv = $(param.gridDiv);
            this.pagerDiv = param.pagerDiv;
            this.showPType = param.showPType;
            this.data = param.data;
            this.onClick = param.onClick;
            this.loadGrid();
            this.fillGrid();
        },
        reloadGrid: function() {
            this.$gridDiv = $(this.gridDiv);
            this.$gridDiv.jqGrid('GridUnload');
            this.data = window["globalvars"]["assignedAccounts"];
            this.$gridDiv = $(this.gridDiv);
            this.loadGrid();
            this.fillGrid();
            this.$gridDiv.setGridParam({rowNum: 30, sortname: 'hidden'}).trigger("reloadGrid");
        },
        loadGrid: function() {
            this.$gridDiv.jqGrid({
                datatype: "local",
                autowidth: false,
                height: 'auto',
                pager: this.pagerDiv,
                rowNum: 30,
                rowList: [10, 20, 30, 50],
                pagination: true,
                gridview: true,
                viewrecords: true,
                altRows: true,
                altclass: 'alternate_row_color',
                sortname: 'rank',
                viewsortcols: [false, 'vertical', true],
                colNames: ['index', 'Rank','','',globalvars.localResourceMap.bill_accout_review_account, 'Top Missing Code',globalvars.localResourceMap.bill_accout_review_admit_date,
                    globalvars.localResourceMap.bill_accout_review_discharge_date, globalvars.localResourceMap.bill_accout_review_patient_type,globalvars.localResourceMap.bill_accout_review_patient_type,'',
                    globalvars.localResourceMap.bill_accout_review_payer_name, 'isHighlighted','patientId',''],
                colModel: [
                   // {name: 'hidden', width: 10, hidden: true, key: true},
                    {name: 'index', width: 10, hidden: true},
                    {name: 'rank', width: 50,sorttype: "int"},
                    {name: 'age', width: 50, sorttype: "int", align: "center", fixed: true, sorttype: "int", sortable: false,hidden: true},
                    {name: 'gender', width: 60, align: 'center', sortable: false, fixed: true, hidden: true},
                    {name: 'accountId', width: 100, sorttype: "int", fixed: true, classes: 'accountlist-account-cursor', sortable: false},
                    {name: 'predCode', width: 140, sorttype: "int", fixed: true, sortable: false},         
                    {name: 'admitDate', width: 100, sorttype: "date", sortable: false, classes: 'grid_cell_style', fixed: true},
                    {name: 'dischargeDate', width: 90, sorttype: "date", sortable: false, classes: 'grid_cell_style', fixed: true},
                    {name: 'patTypeWithDescription', align: 'center', width: 140, sortable: false, classes: 'grid_cell_style', fixed: true, hidden:(this.showPType?false:true)},
                    {name: 'patSubTypeWithDescription', align: 'center', width: 140, sortable: false, classes: 'grid_cell_style', fixed: true,hidden:(this.showPType?true:false)},
                    {name: 'insurance', width: 80, sortable: false, classes: 'grid_cell_style', fixed: true,hidden: true},
                    {name: 'insuranceName', width: 250, sortable: false, classes: 'grid_cell_style', fixed: true},
                    {name: 'isHighlighted', width: 10, hidden: true, sortable: false},
                    {name: 'patientId', width: 10, hidden: true, sortable: false},
                    {name: 'transferDate', width: 10, hidden: true, sortable: false}

                ],
                onSelectRow: this.onClick,
                loadComplete: function() {

                    var gridRowData = grids.billAccountReviewGrid.$gridDiv.jqGrid('getRowData');
                    var gridRowDataLength = gridRowData.length;
                    for (var i = 0; i < gridRowDataLength; i++) {
                        if (gridRowData[i].isHighlighted == "true") {
                       //     log("isHighlighted " + gridRowData[i].accountId + " : " + (i + 1));
                            $(("#prebill_grid_table tr#" + (parseInt(gridRowData[i].index,10) + 1))).addClass("highlighted_row");
                        }
                        ;
                    }
                    ;
                    grids.billAccountReviewGrid.$gridDiv.jqGrid('setLabel', 'accountId', '', {'text-align': 'left', 'padding-left': '16px', 'width': '86px'});
                    grids.billAccountReviewGrid.$gridDiv.jqGrid('setLabel', 'admitDate', '', {'text-align': 'left', 'padding-left': '16px', 'width': '86px'});
                    grids.billAccountReviewGrid.$gridDiv.jqGrid('setLabel', 'dischargeDate', '', {'text-align': 'left', 'padding-left': '16px', 'width': '96px'});
                    grids.billAccountReviewGrid.$gridDiv.jqGrid('setLabel', 'patTypeWithDescription', '', {'text-align': 'left', 'padding-left': '5px', 'width': '106px'});
                    grids.billAccountReviewGrid.$gridDiv.jqGrid('setLabel', 'patSubTypeWithDescription', '', {'text-align': 'left', 'padding-left': '5px', 'width': '106px'});
                    grids.billAccountReviewGrid.$gridDiv.jqGrid('setLabel', 'insurance', '', {'text-align': 'left', 'padding-left': '16px', 'width': '66px'});
                    grids.billAccountReviewGrid.$gridDiv.jqGrid('setLabel', 'insuranceName', '', {'text-align': 'left', 'padding-left': '16px', 'width': '236px'});

                }
            });
        },
        fillGrid: function() {
            var datalength = this.data.length;

            for (var i = 0; i < datalength; i++) {
                grids.billAccountReviewGrid.data[i].index = i;
                grids.billAccountReviewGrid.$gridDiv.jqGrid('addRowData', i + 1, grids.billAccountReviewGrid.data[i]);
            }
            ;

            grids.billAccountReviewGrid.$gridDiv.setGridParam({rowNum: 30}).trigger("reloadGrid");

           
        }
    },
    billAccountReviewGridRules: {
        gridDiv: "",
        $gridDiv: {},
        pagerDiv: "",
        data: {},
        onClick: {},
        highlightedRows: [],
        showPType:'',
        initialize: function(param) {
            log(param);
            this.gridDiv = param.gridDiv;
            this.$gridDiv = $(param.gridDiv);
            this.pagerDiv = param.pagerDiv;
            this.showPType = param.showPType;
            this.data = param.data;
            this.onClick = param.onClick;
            this.loadGrid();
            this.fillGrid();
        },
        reloadGrid: function() {
            this.$gridDiv = $(this.gridDiv);
            this.$gridDiv.jqGrid('GridUnload');
            this.data = window["globalvars"]["assignedAccounts"];
            this.$gridDiv = $(this.gridDiv);
            this.loadGrid();
            this.fillGrid();
            this.$gridDiv.setGridParam({rowNum: 30, sortname: 'hidden'}).trigger("reloadGrid");
        },
        loadGrid: function() {
            this.$gridDiv.jqGrid({
                datatype: "local",
                autowidth: false,
                height: 'auto',
                pager: this.pagerDiv,
                rowNum: 30,
                rowList: [10, 20, 30, 50],
                pagination: true,
                gridview: true,
                viewrecords: true,
                altRows: true,
                altclass: 'alternate_row_color',
                sortname: '',
                viewsortcols: [false, 'vertical', true],
                colNames: ['index', 'Rank',globalvars.localResourceMap.bill_accout_review_account, 'Top Missing Code',globalvars.localResourceMap.bill_accout_review_age,
                    globalvars.localResourceMap.bill_accout_review_gender, globalvars.localResourceMap.bill_accout_review_admit_date,
                    globalvars.localResourceMap.bill_accout_review_discharge_date, globalvars.localResourceMap.bill_accout_review_patient_type,globalvars.localResourceMap.bill_accout_review_patient_type,
                    globalvars.localResourceMap.bill_accout_review_payer_code,globalvars.localResourceMap.bill_accout_review_payer_name, 'isHighlighted','patientId',''],
                colModel: [
                    //{name: 'hidden', width: 10, hidden: true, key: true},
                    {name: 'index', width: 10, hidden: true},
                    {name: 'rank', width: 60,sorttype: "int"},
                    {name: 'accountId', width: 110, sorttype: "int", fixed: true, classes: 'accountlist-account-cursor', sortable: false},
                    {name: 'predCode', width: 140, sorttype: "int", fixed: true, sortable: false, hidden:true},         
                    {name: 'age', width: 50, sorttype: "int", align: "center", fixed: true, sorttype: "int", sortable: false,hidden: true},
                    {name: 'gender', width: 60, align: 'center', sortable: false, fixed: true, hidden: true},
                    {name: 'admitDate', width: 120, sorttype: "date", sortable: false, classes: 'grid_cell_style', fixed: true},
                    {name: 'dischargeDate', width: 120, sorttype: "date", sortable: false, classes: 'grid_cell_style', fixed: true},
                    {name: 'patTypeWithDescription', align: 'center',width: 160, sortable: false, classes: 'grid_cell_style', fixed: true,hidden:(this.showPType?false:true)},
                    {name: 'patSubTypeWithDescription', align: 'center',width: 160, sortable: false, classes: 'grid_cell_style', fixed: true,hidden:(this.showPType?true:false)},
                    {name: 'insurance', width: 80, sortable: false, classes: 'grid_cell_style', fixed: true,hidden: true},
                    {name: 'insuranceName', width: 300, sortable: false, classes: 'grid_cell_style', fixed: true},
                    {name: 'isHighlighted', width: 10, hidden: true, sortable: false},
                    {name: 'patientId', width: 10, hidden: true, sortable: false},
                    {name: 'transferDate', width: 10, hidden: true, sortable: false}
                ],
                onSelectRow: this.onClick,
                loadComplete: function() {

                    var gridRowData = grids.billAccountReviewGridRules.$gridDiv.jqGrid('getRowData');
                    var gridRowDataLength = gridRowData.length;
                    for (var i = 0; i < gridRowDataLength; i++) {
                        if (gridRowData[i].isHighlighted == "true") {
                        //    log("isHighlighted " + gridRowData[i].accountId + " : " + (i + 1));
                            $(("#prebill_grid_table tr#" + (parseInt(gridRowData[i].index,10) + 1))).addClass("highlighted_row");
                        }
                        ;
                    }
                    ;
                    grids.billAccountReviewGridRules.$gridDiv.jqGrid('setLabel', 'accountId', '', {'text-align': 'left', 'padding-left': '5px', 'width': '86px'});
                    grids.billAccountReviewGridRules.$gridDiv.jqGrid('setLabel', 'admitDate', '', {'text-align': 'left', 'padding-left': '5px', 'width': '86px'});
                    grids.billAccountReviewGridRules.$gridDiv.jqGrid('setLabel', 'dischargeDate', '', {'text-align': 'left', 'padding-left': '30px', 'width': '110px'});
                    grids.billAccountReviewGridRules.$gridDiv.jqGrid('setLabel', 'patTypeWithDescription', '', {'text-align': 'left', 'padding-left': '30px', 'width': '120px'});
                    grids.billAccountReviewGridRules.$gridDiv.jqGrid('setLabel', 'patSubTypeWithDescription', '', {'text-align': 'left', 'padding-left': '30px', 'width': '120px'});
                    grids.billAccountReviewGridRules.$gridDiv.jqGrid('setLabel', 'insurance', '', {'text-align': 'left', 'padding-left': '5px', 'width': '66px'});
                    grids.billAccountReviewGridRules.$gridDiv.jqGrid('setLabel', 'insuranceName', '', {'text-align': 'left', 'padding-left': '16px', 'width': '236px'});

                }
            });
        },
        fillGrid: function() {
            var datalength = this.data.length;

            for (var i = 0; i < datalength; i++) {
                grids.billAccountReviewGridRules.data[i].index = i;
                grids.billAccountReviewGridRules.$gridDiv.jqGrid('addRowData', i + 1, grids.billAccountReviewGridRules.data[i]);
            }
            ;

            grids.billAccountReviewGridRules.$gridDiv.setGridParam({rowNum: 30}).trigger("reloadGrid");

            
            ;
        }
    },
    billAccountReviewGridCCIEdits: {
        gridDiv: "",
        $gridDiv: {},
        pagerDiv: "",
        data: {},
        onClick: {},
        highlightedRows: [],
        showPType:'',
        initialize: function(param) {
            log(param);
            this.gridDiv = param.gridDiv;
            this.$gridDiv = $(param.gridDiv);
            this.pagerDiv = param.pagerDiv;
            this.showPType = param.showPType;
            this.data = param.data;
            this.onClick = param.onClick;
            this.loadGrid();
            this.fillGrid();
        },
        reloadGrid: function() {
            this.$gridDiv = $(this.gridDiv);
            this.$gridDiv.jqGrid('GridUnload');
            this.data = window["globalvars"]["assignedAccounts"];
            this.$gridDiv = $(this.gridDiv);
            this.loadGrid();
            this.fillGrid();
            this.$gridDiv.setGridParam({rowNum: 30, sortname: 'hidden'}).trigger("reloadGrid");
        },
        loadGrid: function() {
            this.$gridDiv.jqGrid({
                datatype: "local",
                autowidth: false,
                height: 'auto',
                pager: this.pagerDiv,
                rowNum: 30,
                rowList: [10, 20, 30, 50],
                pagination: true,
                gridview: true,
                viewrecords: true,
                altRows: true,
                altclass: 'alternate_row_color',
                sortname: '',
                viewsortcols: [false, 'vertical', true],
                colNames: ['index', 'Rank',globalvars.localResourceMap.bill_accout_review_account, 'Top Missing Code',globalvars.localResourceMap.bill_accout_review_age,
                    globalvars.localResourceMap.bill_accout_review_gender, globalvars.localResourceMap.bill_accout_review_admit_date,
                    globalvars.localResourceMap.bill_accout_review_discharge_date, globalvars.localResourceMap.bill_accout_review_patient_type,globalvars.localResourceMap.bill_accout_review_patient_type,
                    globalvars.localResourceMap.bill_accout_review_payer_code,'EDIT TYPE',globalvars.localResourceMap.bill_accout_review_payer_name, 'isHighlighted','','',''],
                colModel: [
                   // {name: 'hidden', width: 10, hidden: true, key: true},
                    {name: 'index', width: 10, hidden: true},
                    {name: 'rank', width: 60,sorttype: "int"},
                    {name: 'accountId', width: 110, sorttype: "int", fixed: true, classes: 'accountlist-account-cursor', sortable: false},
                    {name: 'predCode', width: 140, sorttype: "int", fixed: true, sortable: false, hidden:true},         
                    {name: 'age', width: 50, sorttype: "int", align: "center", fixed: true, sorttype: "int", sortable: false,hidden: true},
                    {name: 'gender', width: 60, align: 'center', sortable: false, fixed: true, hidden: true},
                    {name: 'admitDate', width: 120, sorttype: "date", sortable: false, classes: 'grid_cell_style', fixed: true},
                    {name: 'dischargeDate', width: 120, sorttype: "date", sortable: false, classes: 'grid_cell_style', fixed: true},
                    {name: 'patTypeWithDescription', align: 'center',width: 120, sortable: false, classes: 'grid_cell_style', fixed: true,hidden:(this.showPType?false:true)},
                    {name: 'patSubTypeWithDescription', align: 'center',width: 120, sortable: false, classes: 'grid_cell_style', fixed: true,hidden:(this.showPType?true:false)},
                    {name: 'insurance', width: 80, sortable: false, classes: 'grid_cell_style', fixed: true,hidden: true},
                    {name: 'editType', width: 120, sortable: false, classes: 'grid_cell_style', fixed: true,align: 'center'},
                    {name: 'insuranceName', width: 220, sortable: false, classes: 'grid_cell_style', fixed: true},
                    {name: 'isHighlighted', width: 10, hidden: true, sortable: false},
                    {name: 'transferDate', width: 10, hidden: true, sortable: false},
                    {name: 'patientId', width: 10, hidden: true, sortable: false},
                    {name: 'dob', width: 10, hidden: true, sortable: false}

                ],
                onSelectRow: this.onClick,
                loadComplete: function() {

                    var gridRowData = grids.billAccountReviewGridCCIEdits.$gridDiv.jqGrid('getRowData');
                    var gridRowDataLength = gridRowData.length;
                    for (var i = 0; i < gridRowDataLength; i++) {
                        if (gridRowData[i].isHighlighted == "true") {
                        //    log("isHighlighted " + gridRowData[i].accountId + " : " + (i + 1));
                            $(("#prebill_grid_table tr#" + (parseInt(gridRowData[i].index,10) + 1))).addClass("highlighted_row");
                        }
                        ;
                    }
                    ;
//                    grids.billAccountReviewGridCCIEdits.$gridDiv.jqGrid('setLabel', 'accountId', '', {'text-align': 'left', 'padding-left': '5px', 'width': '86px'});
//                    grids.billAccountReviewGridCCIEdits.$gridDiv.jqGrid('setLabel', 'admitDate', '', {'text-align': 'left', 'padding-left': '5px', 'width': '86px'});
//                    grids.billAccountReviewGridCCIEdits.$gridDiv.jqGrid('setLabel', 'dischargeDate', '', {'text-align': 'left', 'padding-left': '30px', 'width': '110px'});
//                    grids.billAccountReviewGridCCIEdits.$gridDiv.jqGrid('setLabel', 'patTypeWithDescription', '', {'text-align': 'left', 'padding-left': '30px', 'width': '120px'});
//                    grids.billAccountReviewGridCCIEdits.$gridDiv.jqGrid('setLabel', 'patSubTypeWithDescription', '', {'text-align': 'left', 'padding-left': '30px', 'width': '120px'});
//                    grids.billAccountReviewGridCCIEdits.$gridDiv.jqGrid('setLabel', 'insurance', '', {'text-align': 'left', 'padding-left': '5px', 'width': '66px'});
//                    grids.billAccountReviewGridCCIEdits.$gridDiv.jqGrid('setLabel', 'insuranceName', '', {'text-align': 'left', 'padding-left': '16px', 'width': '236px'});

                }
            });
        },
        fillGrid: function() {
            var datalength = this.data.length;

            for (var i = 0; i < datalength; i++) {
                grids.billAccountReviewGridCCIEdits.data[i].index = i;
                grids.billAccountReviewGridCCIEdits.$gridDiv.jqGrid('addRowData', i + 1, grids.billAccountReviewGridCCIEdits.data[i]);
            }
            ;

            grids.billAccountReviewGridCCIEdits.$gridDiv.setGridParam({rowNum: 30}).trigger("reloadGrid");

            
        }
    },

    submittedAccountReviewGrid: {
        gridDiv: "",
        $gridDiv: {},
        pagerDiv: "",
        data: {},
        onClick: {},
        highlightedRows: [],
        showPType:'',
        initialize: function(param) {
            log(param);
            this.gridDiv = param.gridDiv;
            this.$gridDiv = $(param.gridDiv);
            this.pagerDiv = param.pagerDiv;
            this.showPType = param.showPType;
            this.data = param.data;
            this.onClick = param.onClick;
            this.loadGrid();
            this.reloadGrid();
            this.fillGrid();

        },
        reloadGrid: function() {
            this.$gridDiv = $(this.gridDiv);
            this.$gridDiv.jqGrid('GridUnload');
            this.data = window["globalvars"]["submittedAccounts"];
            this.$gridDiv = $(this.gridDiv);
            this.loadGrid();
            //this.fillGrid();
            this.$gridDiv.setGridParam({rowNum: 30, sortname: 'hidden'}).trigger("reloadGrid");
        },
        loadGrid: function() {
            this.$gridDiv.jqGrid({
                datatype: "local",
                autowidth: false,
                height: 'auto',
                pager: this.pagerDiv,
                rowNum: 30,
                rowList: [10, 20, 30, 50],
                pagination: (this.data==null)?false:true,
                gridview: true,
                viewrecords: true,
                altRows: true,
                altclass: 'alternate_row_color',
                sortname: '',
                colNames: ['index', globalvars.localResourceMap.bill_accout_review_account, globalvars.localResourceMap.bill_accout_review_age,
                    globalvars.localResourceMap.bill_accout_review_gender, globalvars.localResourceMap.bill_accout_review_admit_date,
                    globalvars.localResourceMap.bill_accout_review_discharge_date, globalvars.localResourceMap.bill_accout_review_patient_type,globalvars.localResourceMap.bill_accout_review_patient_type,
                    globalvars.localResourceMap.bill_accout_review_payer_code, globalvars.localResourceMap.bill_accout_review_payer_name, 'isHighlighted','patientId','','',''],
                colModel: [
                   // {name: 'hidden', width: 10, hidden: true, key: true},
                    {name: 'index', width: 10, hidden: true},
                    {name: 'accountId', width: 100, sorttype: "int", fixed: true, classes: 'accountlist-account-cursor', sortable: false},
                    {name: 'age', width: 50, sorttype: "int", align: "center", fixed: true, sorttype: "int", sortable: false},
                    {name: 'gender', width: 60, align: 'center', sortable: false, fixed: true, },
                    {name: 'admitDate', width: 100, sorttype: "date", sortable: false, classes: 'grid_cell_style', fixed: true},
                    {name: 'dischargeDate', width: 90, sorttype: "date", sortable: false, classes: 'grid_cell_style', fixed: true},
                    {name: 'patTypeWithDescription', align: 'center',width: 140, sortable: false, classes: 'grid_cell_style', fixed: true, hidden:(this.showPType?false:true)},
                    {name: 'patSubTypeWithDescription', align: 'center',width: 140, sortable: false, classes: 'grid_cell_style', fixed: true,hidden:(this.showPType?true:false)},
                    {name: 'insurance', width: 80, sortable: false, classes: 'grid_cell_style', fixed: true},
                    {name: 'insuranceName', width: 250, sortable: false, classes: 'grid_cell_style', fixed: true},
                    {name: 'isHighlighted', width: 10, hidden: true, sortable: false},
                    {name: 'patientId', width: 10, hidden: true, sortable: false},
                    {name: 'transferDate', width: 10, hidden: true, sortable: false},
                    {name: 'dob', width: 10, hidden: true, sortable: false},
                    {name: 'patType', width: 10, hidden: true, sortable: false}
                ],
                onSelectRow: this.onClick,
                loadComplete: function() {

                    var gridRowData = grids.submittedAccountReviewGrid.$gridDiv.jqGrid('getRowData');
                    var gridRowDataLength = gridRowData.length;
                    for (var i = 0; i < gridRowDataLength; i++) {
                        if (gridRowData[i].isHighlighted == "true") {
                        //    log("isHighlighted " + gridRowData[i].accountId + " : " + (i + 1));
                            $(("#prebill_grid_table tr#" + (parseInt(gridRowData[i].index,10) + 1))).addClass("highlighted_row");
                        }
                        ;
                    }
                    ;
                    grids.submittedAccountReviewGrid.$gridDiv.jqGrid('setLabel', 'accountId', '', {'text-align': 'left', 'padding-left': '16px', 'width': '86px'});
                    grids.submittedAccountReviewGrid.$gridDiv.jqGrid('setLabel', 'admitDate', '', {'text-align': 'left', 'padding-left': '16px', 'width': '86px'});
                    grids.submittedAccountReviewGrid.$gridDiv.jqGrid('setLabel', 'dischargeDate', '', {'text-align': 'left', 'padding-left': '16px', 'width': '96px'});
                    grids.submittedAccountReviewGrid.$gridDiv.jqGrid('setLabel', 'patTypeWithDescription', '', {'text-align': 'left', 'padding-left': '16px', 'width': '106px'});
                    grids.submittedAccountReviewGrid.$gridDiv.jqGrid('setLabel', 'insurance', '', {'text-align': 'left', 'padding-left': '16px', 'width': '66px'});
                    grids.submittedAccountReviewGrid.$gridDiv.jqGrid('setLabel', 'insuranceName', '', {'text-align': 'left', 'padding-left': '16px', 'width': '236px'});

                }
            });
        },
        fillGrid: function() {
            var datalength = this.data.length;
            for (var i = 0; i < datalength; i++) {
                grids.submittedAccountReviewGrid.data[i].index = i;
                grids.submittedAccountReviewGrid.$gridDiv.jqGrid('addRowData', i + 1, grids.submittedAccountReviewGrid.data[i]);
            }
            ;

            this.$gridDiv.setGridParam({rowNum: datalength}).trigger("reloadGrid");

            if (datalength == 0) {
                if(globalvars.user.uType == globalvars.roles.supervisor ||  globalvars.user.uType==globalvars.roles.administrator){
                    dialogs.messageDialog.show({text: 'No account available for the facility'});
                }
                else{
                    dialogs.messageDialog.show({text: globalvars.localResourceMap.no_account_pending_msg});
                }
            }
            ;
        }
    },
    submittedAccountReviewGridCCIEdits: {
        gridDiv: "",
        $gridDiv: {},
        pagerDiv: "",
        data: {},
        onClick: {},
        highlightedRows: [],
        showPType:'',
        initialize: function(param) {
            log(param);
            this.gridDiv = param.gridDiv;
            this.$gridDiv = $(param.gridDiv);
            this.pagerDiv = param.pagerDiv;
            this.showPType = param.showPType;
            this.data = param.data;
            this.onClick = param.onClick;
            this.loadGrid();
            this.reloadGrid();
            this.fillGrid();

        },
        reloadGrid: function() {
            this.$gridDiv = $(this.gridDiv);
            this.$gridDiv.jqGrid('GridUnload');
            this.data = window["globalvars"]["submittedAccountsCCIEdits"];
            this.$gridDiv = $(this.gridDiv);
            this.loadGrid();
            //this.fillGrid();
            this.$gridDiv.setGridParam({rowNum: 30, sortname: 'hidden'}).trigger("reloadGrid");
        },
        loadGrid: function() {

            this.$gridDiv.jqGrid({
                datatype: "local",
                autowidth: false,
                height: 'auto',
                pager: this.pagerDiv,
                rowNum: 30,
                rowList: [10, 20, 30, 50],
                pagination: true,
                gridview: true,
                viewrecords: true,
                altRows: true,
                altclass: 'alternate_row_color',
                sortname: '',
                viewsortcols: [false, 'vertical', true],
                colNames: ['index', 'Rank',globalvars.localResourceMap.bill_accout_review_account, 'Top Missing Code',globalvars.localResourceMap.bill_accout_review_age,
                    globalvars.localResourceMap.bill_accout_review_gender, globalvars.localResourceMap.bill_accout_review_admit_date,
                    globalvars.localResourceMap.bill_accout_review_discharge_date, globalvars.localResourceMap.bill_accout_review_patient_type,globalvars.localResourceMap.bill_accout_review_patient_type,
                    globalvars.localResourceMap.bill_accout_review_payer_code,'EDIT TYPE',globalvars.localResourceMap.bill_accout_review_payer_name, 'isHighlighted','',''],
                colModel: [
                    //{name: 'hidden', width: 10, hidden: true, key: true},
                    {name: 'index', width: 10, hidden: true},
                    {name: 'rank', width: 60,sorttype: "int"},
                    {name: 'accountId', width: 110, sorttype: "int", fixed: true, classes: 'accountlist-account-cursor', sortable: false},
                    {name: 'predCode', width: 140, sorttype: "int", fixed: true, sortable: false, hidden:true},         
                    {name: 'age', width: 50, sorttype: "int", align: "center", fixed: true, sorttype: "int", sortable: false,hidden: true},
                    {name: 'gender', width: 60, align: 'center', sortable: false, fixed: true, hidden: true},
                    {name: 'admitDate', width: 120, sorttype: "date", sortable: false, classes: 'grid_cell_style', fixed: true},
                    {name: 'dischargeDate', width: 120, sorttype: "date", sortable: false, classes: 'grid_cell_style', fixed: true},
                    {name: 'patTypeWithDescription', align: 'center',width: 120, sortable: false, classes: 'grid_cell_style', fixed: true,hidden:(this.showPType?false:true)},
                    {name: 'patSubTypeWithDescription', align: 'center',width: 120, sortable: false, classes: 'grid_cell_style', fixed: true,hidden:(this.showPType?true:false)},
                    {name: 'insurance', width: 80, sortable: false, classes: 'grid_cell_style', fixed: true,hidden: true},
                    {name: 'editType', width: 120, sortable: false, classes: 'grid_cell_style', fixed: true,align: 'center'},
                    {name: 'insuranceName', width: 220, sortable: false, classes: 'grid_cell_style', fixed: true},
                    {name: 'isHighlighted', width: 10, hidden: true, sortable: false},
                    {name: 'transferDate', width: 10, hidden: true, sortable: false},
                    {name: 'patientId', width: 10, hidden: true, sortable: false},
                ],
                onSelectRow: this.onClick,
                loadComplete: function() {

                    var gridRowData = grids.submittedAccountReviewGridCCIEdits.$gridDiv.jqGrid('getRowData');
                    var gridRowDataLength = gridRowData.length;
                    for (var i = 0; i < gridRowDataLength; i++) {
                        if (gridRowData[i].isHighlighted == "true") {
                        //    log("isHighlighted " + gridRowData[i].accountId + " : " + (i + 1));
                            $(("#prebill_grid_table tr#" + (parseInt(gridRowData[i].index,10) + 1))).addClass("highlighted_row");
                        }
                        ;
                    }
                    ;
//                    grids.billAccountReviewGridCCIEdits.$gridDiv.jqGrid('setLabel', 'accountId', '', {'text-align': 'left', 'padding-left': '5px', 'width': '86px'});
//                    grids.billAccountReviewGridCCIEdits.$gridDiv.jqGrid('setLabel', 'admitDate', '', {'text-align': 'left', 'padding-left': '5px', 'width': '86px'});
//                    grids.billAccountReviewGridCCIEdits.$gridDiv.jqGrid('setLabel', 'dischargeDate', '', {'text-align': 'left', 'padding-left': '30px', 'width': '110px'});
//                    grids.billAccountReviewGridCCIEdits.$gridDiv.jqGrid('setLabel', 'patTypeWithDescription', '', {'text-align': 'left', 'padding-left': '30px', 'width': '120px'});
//                    grids.billAccountReviewGridCCIEdits.$gridDiv.jqGrid('setLabel', 'patSubTypeWithDescription', '', {'text-align': 'left', 'padding-left': '30px', 'width': '120px'});
//                    grids.billAccountReviewGridCCIEdits.$gridDiv.jqGrid('setLabel', 'insurance', '', {'text-align': 'left', 'padding-left': '5px', 'width': '66px'});
//                    grids.billAccountReviewGridCCIEdits.$gridDiv.jqGrid('setLabel', 'insuranceName', '', {'text-align': 'left', 'padding-left': '16px', 'width': '236px'});

                }
            });
        },
        fillGrid: function() {
            var datalength = grids.submittedAccountReviewGridCCIEdits.data.length;
            for (var i = 0; i < datalength; i++) {
                grids.submittedAccountReviewGridCCIEdits.data[i].index = i;
                grids.submittedAccountReviewGridCCIEdits.$gridDiv.jqGrid('addRowData', i + 1, grids.submittedAccountReviewGridCCIEdits.data[i]);
            }
            ;

            this.$gridDiv.setGridParam({rowNum: datalength}).trigger("reloadGrid");

            if (datalength == 0) {
                if(globalvars.user.uType == globalvars.roles.supervisor ||  globalvars.user.uType==globalvars.roles.administrator){
                    dialogs.messageDialog.show({text: 'No account available for the facility'});
                }
                else{
                    dialogs.messageDialog.show({text: globalvars.localResourceMap.no_account_pending_msg});
                }
            }
            ;
        }
    },
    existingChargesGrid: {
        $gridDiv: {},
        selectedRow: undefined,
        savedSuccessfully: true,
        isEditable: true,
        isConfirmCharg:false,
        initialize: function(param) {
            this.$gridDiv = $(param.gridDiv);
            grids.existingChargesGrid.isConfirmCharg = param.isConfirmCharg;
            this.isEditable = param.isEditable === false ? false : true;
            this.loadGrid(param.$gridDiv);
            this.fillGrid(param.data);

        },
        loadGrid: function(param) { // param object holds gridDiv, data
            this.selectedRow = undefined;
            this.savedSuccessfully = true;

            this.$gridDiv.jqGrid({
                datatype: "local",
                height: (grids.existingChargesGrid.isConfirmCharg)? '350':'200',
                autowidth: true,
                gridview: true,
                viewrecords: true,
                sortname: 'hcpcCode',
                altRows: true,
                altclass: 'alternate_row_color',
                // sortorder: 'asc',
                colNames: [globalvars.localResourceMap.existing_charge_hcpc_code, globalvars.localResourceMap.existing_charge_dept_code, '', globalvars.localResourceMap.existing_charge_charge_code,
                    globalvars.localResourceMap.existing_charge_unit, globalvars.localResourceMap.existing_charge_change_qty, globalvars.localResourceMap.existing_charge_amount,
                    globalvars.localResourceMap.existing_charge_charge_date,'Rev Code',globalvars.localResourceMap.existing_charge_charge_description, '','','',globalvars.localResourceMap.existing_charge_comment,'POST DATE','','','',''],
                colModel: [
                    {name: 'hcpcCode', index: 'hcpcCode', width: 60, fixed: true, sortable: true, sorttype: "string", align: 'center'},
                    {name: 'dept', index: 'dept', width: 60, fixed: true, sorttype: "int", align: 'center'},
                    {name: 'chargeNumber', index: 'chargeNumber', hidden: true},
                    {name: 'chargeCode', index: 'chargeCode', fixed: true, width: 60, sortable: true, sorttype: "int", align: 'center'},
                    {name: 'quantity', index: 'quantity', width: 50, fixed: true, align: "center", sorttype: "int"},
                    {
                        name: 'qty', index: 'qty', width: 60, fixed: true, align: "center", editable: this.isEditable, sorttype: "int",
                        edittype: "text",
                        editoptions: {
                            size: "3",
                            maxlength: "3",
                        },
                        editrules: {
                            custom: true,
                            custom_func: function(value, colname) {
                                if (value == "") {
                                    return [true, ""];
                                } else if (!(/^-?\d+$/.test(value)) || isNaN(value) || value == 0) {
                                    value = "";
                                    return [false, globalvars.localResourceMap.existing_charge_validation_msg];
                                } else {
                                    return [true, ""];
                                }
                                ;
                            }
                        }
                    },
                    {name: 'chargeAmount', index: 'chargeAmount', width: 60, fixed: true, sorttype: "int", align: 'right'},
                    {name: 'chargeDate', index: 'chargeDate', width: 85, fixed: true, align: "center", sorttype: "date"},
                    {name: 'revenueCode', index: 'revenueCode', width: 50, fixed: true, align: "center", sorttype: "date"},
                    {name: 'chargeDesc', index: 'chargeDesc', width: 125, fixed: true, sorttype: "string", classes: 'grid_cell_style'},
                    {name: 'modifier', index: 'modifier', width: 60, fixed: true, sortable: true, sorttype: "string", align: 'center',hidden: true},
                    {name: 'changeModifier', index: 'changeModifier', width: 50, fixed: true, editable: this.isEditable,sortable: true, sorttype: "string", align: 'center',hidden: true},
                    {name: 'medicareCode', index: 'medicareCode', width: 60, fixed: true, sortable: true, sorttype: "string", align: 'center',hidden: true},
                    {name: 'comments', index: 'comments_xact', width: 120, fixed: true, editable: this.isEditable,
                        editoptions: {
                            size: "17",
                            maxlength: "150",
                        },
                        classes: 'grid_cell_style'},
                    {name: 'postDate', index: 'postDate', width: 110, fixed: true, align: "left", sorttype: "date"},
                    {name: 'predKey', index: 'predKey',hidden:true},
                    {name: 'rowEditable', index: 'rowEditable',hidden:true},
                    {name: 'cenAuditorId', index: 'cenAuditorId',hidden:true},
                    {name: 'cenAuditingTime', index: 'cenAuditingTime',hidden:true}
                ],
                onSelectRow: function(id) {
                    var selectedRowData = grids.existingChargesGrid.$gridDiv.jqGrid('getRowData', id);

                    if(selectedRowData.rowEditable == false || selectedRowData.rowEditable == "false"){
                        return;
                    }

                    if (grids.existingChargesGrid.selectedRow !== undefined) {
                        grids.existingChargesGrid.$gridDiv.jqGrid('saveRow', grids.existingChargesGrid.selectedRow);
                    }
                    ;
                    if (grids.existingChargesGrid.savedSuccessfully == true) {
                        grids.existingChargesGrid.selectedRow = id;
                        //grids.existingChargesGrid.$gridDiv.jqGrid('editRow', id, true,);
                        grids.existingChargesGrid.$gridDiv.jqGrid('editRow',id, true, false, false, false, false, false,false, afterrestorefunc)
                        grids.existingChargesGrid.savedSuccessfully = false;
                    }
                    
                    function afterrestorefunc(e){
                            grids.existingChargesGrid.savedSuccessfully = true;
                    }

                  //  log('Exiting Charges ID clicked ' + id + " " + grids.existingChargesGrid.selectedRow);
                },
                
                editurl: 'clientArray',
                loadComplete: function() {


                    $(("#account_details_existing_charges_grid_table tr")).removeClass('highlighted_row');
                     grids.existingChargesGrid.$gridDiv.trigger("reloadGrid");


                     var gridRowData = grids.existingChargesGrid.$gridDiv.jqGrid('getRowData');
                     var gridRowDataLength = gridRowData.length;

                    grids.existingChargesGrid.$gridDiv.clearGridData();

                     var datalength = gridRowData.length;
                     for (var i = 0; i < datalength; i++) {
                         grids.existingChargesGrid.$gridDiv.jqGrid('addRowData', i + 1, gridRowData[i]);
                     }
                     
                     grids.existingChargesGrid.$gridDiv.setGridParam({rowNum: datalength}).trigger("reloadGrid");


                     var tableGridID = "#account_details_existing_charges_grid_table";
                     if(grids.existingChargesGrid.isConfirmCharg == true){
                         tableGridID = "#confirm_charge_existing_charges_grid_table";
                     }

                     
                     for (var i = 0; i < gridRowDataLength; i++) {
                     //   log("isHighlighted new test " + gridRowData[i].rowEditable + " : " + (i + 1));
                         if (gridRowData[i].rowEditable == "false" || gridRowData[i].rowEditable == false) {
                       //      log("isHighlighted new test " + gridRowData[i].rowEditable + " : " + (i + 1));
                             $(tableGridID).find("tr#" + (i + 1)).addClass("highlighted_row");
                         }
                     }

                     $(tableGridID).find('tr').find('td:eq(16)').each(function(){
                            //console.log($(this).text());

                            if($(this).text() == "false" || $(this).text() == false){

                                $(this).parent().tooltip({
                                content: function(response) {
                                    //console.log(this.parentNode)
                                    if(this.parentNode){
                                        var rowData = grids.existingChargesGrid.$gridDiv.jqGrid('getRowData',this.parentNode.id);
                                        return '<b>Assigned to: </b>' + rowData.cenAuditorId+"<br/><b>Submitted on: </b>" + rowData.cenAuditingTime;
                                    }
                                },
                                open: function() {
                                    $(this).tooltip("widget").stop(false, true).hide().slideDown("fast");
                                },
                                close: function() {
                                    $(this).tooltip("widget").stop(false, true).show().slideUp("fast");
                                }
                            }).tooltip("widget").addClass("ui-state-highlight");
                        }
                    })
                    // grids.existingChargesGrid.$gridDiv.jqGrid('setLabel', 'chargeDesc', '', {'text-align': 'left', 'padding-left': '16px', 'width': '186px'});
                    // grids.existingChargesGrid.$gridDiv.jqGrid('setLabel', 'comments', '', {'text-align': 'left', 'padding-left': '16px', 'width': '186px'});

                     grids.existingChargesGrid.$gridDiv.jqGrid('setLabel', 'postDate', '', {'text-align': 'left', 'padding-left': '-20px', 'width': '110px'});
                }

            });

            this.$gridDiv.bind("jqGridInlineAfterSaveRow", function(rowid) {
             //   log("jqGridInlineAfterSaveRow");
                grids.existingChargesGrid.savedSuccessfully = true;
            });
            
        },
        fillGrid: function(data) {
            this.$gridDiv.clearGridData();
            var datalength = data.length;
            for (var i = 0; i < datalength; i++) {
                this.$gridDiv.jqGrid('addRowData', i + 1, data[i]);
            }
            ;
            this.$gridDiv.setGridParam({rowNum: datalength}).trigger("reloadGrid");
        }
    },
    existingChargesGridCCIEdits: {
        $gridDiv: {},
        selectedRow: undefined,
        savedSuccessfully: true,
        isEditable: true,
        initialize: function(param) {
            this.$gridDiv = $(param.gridDiv);
            this.isEditable = param.isEditable === false ? false : true;
            this.loadGrid(param.$gridDiv);
            this.fillGrid(param.data);

        },
        loadGrid: function(param) { // param object holds gridDiv, data
            this.selectedRow = undefined;
            this.savedSuccessfully = true;
            
            this.$gridDiv.jqGrid({
                datatype: "local",
                height: '200',
                autowidth: true,
                gridview: true,
                viewrecords: true,
                altRows: true,
                altclass: 'alternate_row_color',
                colNames: [globalvars.localResourceMap.existing_charge_hcpc_code, globalvars.localResourceMap.existing_charge_dept_code, '', globalvars.localResourceMap.existing_charge_charge_code,
                    globalvars.localResourceMap.existing_charge_unit, globalvars.localResourceMap.existing_charge_change_qty, globalvars.localResourceMap.existing_charge_amount,
                    globalvars.localResourceMap.existing_charge_charge_date, globalvars.localResourceMap.existing_charge_charge_description, 
                    'Current Mod','Change Mod','Medicare Code','',globalvars.localResourceMap.existing_charge_comment,'',''],
                colModel: [
                    {name: 'hcpcCode', index: 'hcpcCode', width: 50, fixed: true, sortable: true, sorttype: "int", align: 'center'},
                    {name: 'dept', index: 'dept', width: 50, fixed: true, sorttype: "int", align: 'center'},
                    {name: 'chargeNumber', index: 'chargeNumber', hidden: true},
                    {name: 'chargeCode', index: 'chargeCode', fixed: true, width: 50, sortable: true, sorttype: "int", align: 'center'},
                    {name: 'quantity', index: 'quantity', width: 40, fixed: true, align: "center", sorttype: "int"},
                    {
                        name: 'qty', index: 'qty', width: 50, fixed: true, align: "center", editable: this.isEditable, sorttype: "int",
                        edittype: "text",
                        editoptions: {
                            size: "3",
                            maxlength: "3",
                        },
                        editrules: {
                            custom: true,
                            custom_func: function(value, colname) {
                                if (value == "") {
                                    return [true, ""];
                                } else if (!(/^-?\d+$/.test(value)) || isNaN(value) || value == 0) {
                                    value = "";
                                    return [false, globalvars.localResourceMap.existing_charge_validation_msg];
                                } else {
                                    return [true, ""];
                                }
                                ;
                            }
                        }
                    },
                    {name: 'chargeAmount', index: 'chargeAmount', width: 60, fixed: true, sorttype: "int", align: 'right'},
                    {name: 'chargeDate', index: 'chargeDate', width: 85, fixed: true, align: "center", sorttype: "date"},
                    {name: 'chargeDesc', index: 'chargeDesc', width: 130, fixed: true, sorttype: "string", classes: 'grid_cell_style'},
                    {name: 'changeModifier', index: 'changeModifier', width: 60, fixed: true, sortable: true, sorttype: "string", align: 'center'},
                    {name: 'modifier', index: 'modifier', width: 50, fixed: true, editable: this.isEditable,sortable: true, sorttype: "string", align: 'center'},
                    {name: 'medicareCode', index: 'medicareCode', width: 60, fixed: true, sortable: true, sorttype: "string", align: 'center'},
                    {name: 'isExist', index: 'isExist', hidden:true},
                    {name: 'comments', index: 'comments_xact', width: 150, fixed: true, editable: this.isEditable,
                        editoptions: {
                            size: "16",
                            maxlength: "250",
                        },
                        classes: 'grid_cell_style'},
                    {name: 'predKey', index: 'predKey',hidden:true},
                    {name: 'rowEditable', index: 'rowEditable',hidden:true}
                ],
                onSelectRow: function(id) {

                	var selectedRowData = grids.existingChargesGridCCIEdits.$gridDiv.jqGrid('getRowData', id);

                	if(selectedRowData.rowEditable == false || selectedRowData.rowEditable == "false"){
                        return;
                    }

                    if (grids.existingChargesGridCCIEdits.selectedRow !== undefined) {
                        grids.existingChargesGridCCIEdits.$gridDiv.jqGrid('saveRow', grids.existingChargesGridCCIEdits.selectedRow);
                    }
                    ;
                    if (grids.existingChargesGridCCIEdits.savedSuccessfully == true) {
                        grids.existingChargesGridCCIEdits.selectedRow = id;
                        grids.existingChargesGridCCIEdits.$gridDiv.jqGrid('editRow', id, true,false, false, false, false, false,false, afterrestorefunc);
                        $(("tr#" + (id))).removeClass("ui-state-highlight");
                        grids.existingChargesGridCCIEdits.savedSuccessfully = false;
                    }
                    function afterrestorefunc(e){
                        grids.existingChargesGridCCIEdits.savedSuccessfully = true;
                    }

                 //   log('Exiting Charges ID clicked ' + id + " " + grids.existingChargesGridCCIEdits.selectedRow);
                },
                editurl: 'clientArray',
                loadComplete: function() {
                     
                     $(("#account_details_existing_charges_grid_table tr")).removeClass('highlighted_row_yellow');
                     grids.existingChargesGridCCIEdits.$gridDiv.trigger("reloadGrid");

                     var gridRowData = grids.existingChargesGridCCIEdits.$gridDiv.jqGrid('getRowData');
                     //var gridRowData = grids.existingChargesGridCCIEdits.$gridDiv.clearGridData();
                     
                     
                     grids.existingChargesGridCCIEdits.$gridDiv.clearGridData();
                     var datalength = gridRowData.length;
                     for (var i = 0; i < datalength; i++) {
                         grids.existingChargesGridCCIEdits.$gridDiv.jqGrid('addRowData', i + 1, gridRowData[i]);
                     }
                     
                     grids.existingChargesGridCCIEdits.$gridDiv.setGridParam({rowNum: datalength}).trigger("reloadGrid");
                     
                     
                     
                     for (var i = 0; i < gridRowData.length; i++) {
                    //     log("Highlighted found:::" + gridRowData[i].isExist);
                         if (gridRowData[i].isExist == 'true') {
                            // log("Highlighted found" + gridRowData[i].isExist + "::" + (i + 1) + "::::" + gridRowData[i].hcpcCode);
                             $(("tr#" + (i + 1))).addClass("highlighted_row_yellow");
                         }
                          else if(gridRowData[i].rowEditable == "false" || gridRowData[i].rowEditable == false) {
                          //   log("isHighlighted " + gridRowData[i].rowEditable + " : " + (i + 1));
                               $(("tr#"  + (i + 1))).addClass("highlighted_row");
                          }
                         
                     }
                }

            });

            this.$gridDiv.bind("jqGridInlineAfterSaveRow", function(rowid) {
              //  log("jqGridInlineAfterSaveRow");
                grids.existingChargesGridCCIEdits.savedSuccessfully = true;
            });


        },
        fillGrid: function(data) {
            this.$gridDiv.clearGridData();
            var datalength = data.length;
            for (var i = 0; i < datalength; i++) {
                this.$gridDiv.jqGrid('addRowData', i + 1, data[i]);
            }
            ;
            this.$gridDiv.setGridParam({rowNum: datalength}).trigger("reloadGrid");
        }
    },
    missingChargesGrid: {
        $gridDiv: {},
        selectedRow: undefined,
        savedSuccessfully: true,
        isEditable: true,
        isHidden: true,
        isConfirmCharg: false,
        altRows: true,
        backScreen:"",
        altclass: 'alternate_row_color',
        screenName: "",
        initialize: function(param) {
            grids.missingChargesGrid.isConfirmCharg = param.isConfirmCharg;
            this.$gridDiv = $(param.gridDiv);
            this.isEditable = param.isEditable === false ? false : true;
            this.isHidden = param.isHidden === false ? false : true;
            this.backScreen = param.backScreen;
            this.loadGrid(param.$gridDiv);
            this.fillGrid(param.data);
            this.screenName = param.screenName;
        },
        loadGrid: function(param) { // param object holds gridDiv, data
            this.selectedRow = undefined;
            this.savedSuccessfully = true;
            this.$gridDiv.jqGrid({
                datatype: "local",
                autowidth: true,
                height: (grids.missingChargesGrid.isConfirmCharg)? '120':'160',
                gridview: true,
                viewrecords: true,
                altRows: true,
                altclass: 'alternate_row_color',
                sortorder: 'asc',
                colNames: [globalvars.localResourceMap.missing_charge_hcpc_code, globalvars.localResourceMap.missing_charge_dept_code, globalvars.localResourceMap.missing_charge_charge_code, 'ndc code', 'Modifier','',globalvars.localResourceMap.missing_charge_price,
                    globalvars.localResourceMap.missing_charge_add_qty, globalvars.localResourceMap.missing_charge_date_of_service, globalvars.localResourceMap.missing_charge_charge_description,
                    globalvars.localResourceMap.missing_charge_response, globalvars.localResourceMap.missing_charge_response_code, globalvars.localResourceMap.missing_charge_pred_code, globalvars.localResourceMap.missing_charge_comment,'','','','','','','','',''],
                colModel: [
                    {
                        name: 'hcpcCodeDisplay', index: 'hcpcCodeDisplay', width: 90, fixed: true, sortable: true, sorttype: "string", align: "center"
                    },
                    {name: 'dept', index: 'dept', width: 90, fixed: true, sorttype: "int", align: "center"},
                    {name: 'chargeCode', index: 'chargeCode', width: 90, fixed: true, sortable: true, sorttype: "int", align: "center"},
                    {name: 'ndcCode', index: 'ndcCode', width: 90, fixed: true, sortable: true, sorttype: "int", align: "center"},
                    {name: 'modifier', index: 'modifier', fixed: true, width: 80, classes: 'grid_cell_style grid_cell_style_modifier_tooltip',align: "center" , hidden:(globalvars.client=="ARDENT")? false:true},
                    {name: 'price_modified', index: 'price_modified', fixed: true, width: 80,hidden:true},

                    {name: 'price', index: 'price', width: 60, fixed: true, sortable: true, classes: 'price_val_missing_charges', sorttype: "int", align: "right",formatter:'currency',editable:true,edittype:"text",
                     formatoptions: { decimalSeparator: ".", thousandsSeparator: ",", prefix: "$",decimalPlaces: 1, defaultValue: '0.0' },
                     editoptions: {
                         dataInit: function(element) {
                         	$(element).keypress(function(e){
                         		if (e.which > 31 && (e.which < 48 || e.which > 57) && !(e.which == 46 || e.which == 8)){
                         			return false;
                              	}
                         	});
                         	$(element).keyup(function(e){
                         		priceValue = $(this).val();
                         		if(/^(\d+)?(\.\d{2})(\d+)$/.test($(this).val())){
                         			//dialogs.messageDialog.show({ title: globalvars.localResourceMap.price_error_title, text: globalvars.localResourceMap.price_error_message })
                         			priceValue=priceValue.replace(/^(\d+)?(\.\d{1,2})(\d+)$/,"$1$2")
                         			$(this).val(priceValue);
                         		}
                         	})
                         }
                     }
                     
                    },
                    {
                        name: 'qty', index: 'qty', width: 60, fixed: true, sortable: true, sorttype: "int", editable: this.isEditable, align: "center",
                        edittype: "text",
                        editoptions: {
                            size: "3",
                            maxlength: "3",
                            minValue: 1,
                            dataInit: function(element) {
                            	$(element).keypress(function(e){
                                 	if (e.which != 8 && e.which != 0 && e.which != 45 && (e.which < 48 || e.which > 57)) {
                                	 return false;
                                 	}
                            	});
                            }
                        }
                        // editrules: {
                        //     custom: true,
                        //     custom_func: function(value, colname) {
                        //         if(value !== undefined){
                        //             if (!(/^-?\d+$/.test(value)) || isNaN(value)) {
                        //                 return [false, globalvars.localResourceMap.missing_charge_validation_msg];
                        //             } 
                        //         }
                        //         var selectedRowData = grids.missingChargesGrid.$gridDiv.jqGrid('getRowData', grids.missingChargesGrid.selectedRow);
                        //         var currentResponseValue = $("#responseSelect" + grids.missingChargesGrid.selectedRow + " option:selected").val();

                        //         var currentDeptValue = $("#deptSelect" + grids.missingChargesGrid.selectedRow + " option:selected").val();
                        //         var currentChargeCodeValue = $("#chargeCodeSelect" + grids.missingChargesGrid.selectedRow + " option:selected").val();
                        //         if (value > 0 && currentResponseValue != "Y") {
                        //                 return [false, globalvars.localResourceMap.missing_charge_validation_msg3];
                        //             } else if (value < 1 && currentResponseValue == "Y") {
                        //                 return [false, globalvars.localResourceMap.missing_charge_validation_msg2];
                        //             } else {
                        //                 return [true, ""];
                        //             };                                
                        //     }
                        // }
                    },
                    {name: 'dateOfService', index: 'dateOfService', width: 70, fixed: true, sortable: true, sorttype: "date", datefmt: "Y-m-d h:i:s", editable: this.isEditable, align: "center",
                    editoptions:{
                                            readonly: 'readonly'
                                 }},
                    {name: 'chargeDesc', index: 'chargeDesc', fixed: true, width: 150, classes: 'grid_cell_style'},
                    {name: 'response', index: 'response', fixed: true, classes: 'grid_cell_style',width:(globalvars.client=="ARDENT")? 100:140},
                    {name: 'responseCode', hidden: true},
                    {name: 'predCode', hidden: true},
                    {name: 'comments', index: 'comments', fixed: true, editable: this.isEditable,  width:(globalvars.client=="ARDENT")? 140:180, editoptions: {
                            size: "15",
                            maxlength: "200",
                        },
                        classes: 'grid_cell_style'},
                    {name: 'isNew', hidden: true},
                    {name: 'predKey', index: 'predKey',hidden:true},
                    {name: 'rowEditable', index: 'rowEditable',hidden:true},
                    {name: 'cenAuditorId', index: 'cenAuditorId',hidden:true},
                    {name: 'cenAuditingTime', index: 'cenAuditingTime',hidden:true},
                    {name: 'hcpcCode', index: 'hcpcCode', hidden:true},
                    {name: 'isPharmacy', index: 'isPharmacy', hidden:true},
                    {name: 'selectedModifierList', index: 'selectedModifierList', hidden: true, search: true},
                    {name: 'isComment', index: 'isComment', fixed: true, width: 70, classes: 'grid_cell_style',align: "left"},
                    


                    
                ],
                onSelectRow: function(id, status, e) {

                    var formatoptionsObject={truncateDecimal: true, decimalSeparator: ".", thousandsSeparator: ",", prefix: "$",decimalPlaces: 2, defaultValue: "0.00"};
                    grids.missingChargesGrid.$gridDiv.jqGrid('setColProp','price',{formatoptions:formatoptionsObject})

                    var rowData = grids.missingChargesGrid.$gridDiv.jqGrid('getRowData', id);

                    var priceVal = grids.missingChargesGrid.$gridDiv.jqGrid('getCell', id, 'price_modified');
                    
                    if(priceVal > 0){
                        rowData.price = priceVal;
                        grids.missingChargesGrid.$gridDiv.jqGrid('setRowData', id, rowData);
                    }
                    
                    if(rowData.rowEditable == false || rowData.rowEditable == "false"){
                        var colIndex = $(e.target).index();
                        if(colIndex == 21){
                         //if(grids.missingChargesGrid.isEditable == true){
                            var gridData = grids.missingChargesGrid.$gridDiv.jqGrid("getGridParam", "dataNew");
                            screens.accountDetails.showTipOffCommentDialog(gridData[id-1], id,grids.missingChargesGrid.isConfirmCharg);
                         //}
                        }  
                        return;
                    }

                    var colIndex = $(e.target).index();
                    if(colIndex == 21){
                         //if(grids.missingChargesGrid.isEditable == true){
                            var gridData = grids.missingChargesGrid.$gridDiv.jqGrid("getGridParam", "dataNew");
                            screens.accountDetails.showTipOffCommentDialog(gridData[id-1], id,grids.missingChargesGrid.isConfirmCharg);
                         //}
                    }  
                    else{
                        //grids.missingChargesGrid.$gridDiv.jqGrid('saveRow', grids.missingChargesGrid.selectedRow);

                        // if (grids.missingChargesGrid.selectedRow !== undefined && grids.missingChargesGrid.$gridDiv.jqGrid('saveRow', globalvars.saveRowId) == false) {

                        //     grids.missingChargesGrid.$gridDiv.jqGrid('saveRow', grids.missingChargesGrid.selectedRow);
                        //   //  return;
                        // }
                        //else{
                        //     //grids.missingChargesGrid.savedSuccessfully = false;
                        // }
                        if (globalvars.saveRowId != id) {

                            grids.missingChargesGrid.$gridDiv.jqGrid('saveRow', globalvars.saveRowId);
                            //grids.missingChargesGrid.savedSuccessfully = true;
                            globalvars.saveRowId = id;
                        }
                        if (grids.missingChargesGrid.savedSuccessfully == true && grids.missingChargesGrid.isEditable == true) {
                            grids.missingChargesGrid.selectedRow = id;

                            var selectedRowData = grids.missingChargesGrid.$gridDiv.jqGrid('getRowData', id);
                            var newRowData = grids.missingChargesGrid.$gridDiv.jqGrid('getRowData', id);
                            if(priceVal > 0){
                            	selectedRowData.price=priceVal;
                            	newRowData.price=priceVal;
                            }
                            newRowData.response = grids.missingChargesGrid.createResponseDropdown({
                                rowData: selectedRowData,
                                rowId: id,
                                billType: grids.missingChargesGrid.screenName
                            });


                            newRowData.modifier = grids.missingChargesGrid.createModifierDropDown({
                                    rowData: selectedRowData,
                                    rowId: id
                                });

                            if (selectedRowData.hcpcCode != "") {
                                newRowData.dept = grids.missingChargesGrid.createDeptDropdown({
                                    rowData: selectedRowData,
                                    rowId: id
                                });

                                
                            }

                            globalvars.selectedChargeCode = selectedRowData.chargeCode;

                            if (selectedRowData.hcpcCode != "" && selectedRowData.dept != "") {
                                newRowData.chargeCode = grids.missingChargesGrid.createChargeCodeDropdown({
                                    rowData: selectedRowData,
                                    rowId: id
                                });
                            }


                            if (selectedRowData.dept != "" && selectedRowData.chargeCode != "") {
                                newRowData.ndcCode = grids.missingChargesGrid.createNDCCodeDropdown({
                                    rowData: selectedRowData,
                                    rowId: id
                                });
                            }




                            grids.missingChargesGrid.$gridDiv.jqGrid('setRowData', id, newRowData);
                            grids.missingChargesGrid.addSearableDropDown();
                            grids.missingChargesGrid.addMultiSelectModifier({id: id})
                            grids.missingChargesGrid.bindDeptCodeChange({id: id});

                            grids.missingChargesGrid.$gridDiv.jqGrid('editRow',id, true, false, false, false, false, false,false, afterrestorefunc);

                            if(grids.missingChargesGrid.backScreen == "preBill" || grids.missingChargesGrid.backScreen == "postBill")
                                $('#' + id + '_' + 'dateOfService').datepicker({dateFormat: 'yy-mm-dd',defaultDate:screens.accountDetails.admitDate});
                                //,minDate:screens.accountDetails.admitDate,maxDate:screens.accountDetails.dischargeDate});
                            else if(grids.missingChargesGrid.backScreen == "associationRules")
                                $('#' + id + '_' + 'dateOfService').datepicker({dateFormat: 'yy-mm-dd',defaultDate:screens.rulesAccountDetails.admitDate});
                                //,minDate:screens.rulesAccountDetails.admitDate,maxDate:screens.rulesAccountDetails.dischargeDate});
                            else if(grids.missingChargesGrid.backScreen == "editCharges")
                                $('#' + id + '_' + 'dateOfService').datepicker({dateFormat: 'yy-mm-dd',defaultDate:screens.submittedAccountDetails.admitDate});
                                //,minDate:screens.submittedAccountDetails.admitDate,maxDate:screens.submittedAccountDetails.dischargeDate});
                            else if(grids.missingChargesGrid.backScreen == "cciEdits")
                                $('#' + id + '_' + 'dateOfService').datepicker({dateFormat: 'yy-mm-dd',defaultDate:screens.cciEditsAccountDetails.admitDate});
                                //,minDate:screens.submittedAccountDetails.admitDate,maxDate:screens.submittedAccountDetails.dischargeDate});
                                            
                                //$('#' + id + '_' + 'dateOfService').datepicker({dateFormat: 'yy-mm-dd',defaultDate:screens.accountDetails.admitDate,minDate:screens.accountDetails.admitDate,maxDate:screens.accountDetails.dischargeDate
                            grids.missingChargesGrid.savedSuccessfully = false;

                        }
                        
                    }
                    function afterrestorefunc(e){
                        grids.missingChargesGrid.$gridDiv.trigger('jqGridInlineAfterSaveRow');
                    }

                   //  log('missing Charges ID clicked ' + id + " " + grids.missingChargesGrid.selectedRow);
                    
                },
                editurl: 'clientArray',
                loadComplete: function() {
                    $(("#account_details_missing_charges_grid_table tr")).removeClass('highlighted_row');
                     grids.missingChargesGrid.$gridDiv.trigger("reloadGrid");

                     var gridRowData = grids.missingChargesGrid.$gridDiv.jqGrid('getRowData');
                     var gridRowDataLength = gridRowData.length;

                     var gridData = grids.missingChargesGrid.$gridDiv.jqGrid("getGridParam", "dataNew");


                     grids.missingChargesGrid.$gridDiv.clearGridData();
                    
                     var datalength = gridRowData.length;
                     for (var i = 0; i < datalength; i++) {
                         grids.missingChargesGrid.$gridDiv.jqGrid('addRowData', i + 1, gridRowData[i]);
                     }
                     
                     grids.missingChargesGrid.$gridDiv.setGridParam({rowNum: datalength}).trigger("reloadGrid");

                     
                     var tableGridID = "#account_details_missing_charges_grid_table";
                     if(grids.missingChargesGrid.isConfirmCharg == true){
                         tableGridID = "#confirm_charge_missing_charges_grid_table";
                     }
                     
                     for (var i = 0; i < gridRowDataLength; i++) {
                         if (gridRowData[i].rowEditable == "false" || gridRowData[i].rowEditable == false) {
                         //    log("isHighlighted " + gridRowData[i].isNew + " : " + (i + 1));
                             $(tableGridID).find("tr#" + (i + 1)).addClass("highlighted_row");
                         }
                         $(tableGridID).find("tr#" + (i + 1)).find("td:last").text("");
                         //$(("#confirm_charge_missing_charges_grid_table" + "tr#" + (i + 1))).find("td:last").text("");
                         if (gridData[i].isComment == true) {
                             //$(("#account_details_missing_charges_grid_table tr#" + (i + 1))).find("td:last").addClass("lightbulb_on");
                             $(tableGridID).find("tr#" + (i + 1)).find("td:last").addClass("lightbulb_on");
                         }
                         else{
                             //$(("#account_details_missing_charges_grid_table tr#" + (i + 1))).find("td:last").addClass("lightbulb_off");
                             $(tableGridID).find("tr#" + (i + 1)).find("td:last").addClass("lightbulb_off");
                         }
                     }


                     $(tableGridID).find('tr').find('td:eq(15)').each(function(){
                            //console.log($(this).text());
                    	 	
                            if($(this).text() == "false" || $(this).text() == false){

                                $(this).parent().tooltip({
                                content: function(response) {
                                    //console.log(this.parentNode)
                                    if(this.parentNode){
                                        var rowData = grids.missingChargesGrid.$gridDiv.jqGrid('getRowData',this.parentNode.id);
                                        return '<b>Assigned to: </b>' + rowData.cenAuditorId+"<br/><b>Submitted on: </b>" + rowData.cenAuditingTime;
                                    }
                                },
                                open: function() {
                                    $(this).tooltip("widget").stop(false, true).hide().slideDown("fast");
                                },
                                close: function() {
                                    $(this).tooltip("widget").stop(false, true).show().slideUp("fast");
                                }
                            }).tooltip("widget").addClass("ui-state-highlight");
                        }
                    })


                  //  grids.missingChargesGrid.$gridDiv.jqGrid('setLabel', 'chargeDesc', '', {'text-align': 'left', 'padding-left': '8px'});
                  //  grids.missingChargesGrid.$gridDiv.jqGrid('setLabel', 'response', '', {'text-align': 'left', 'padding-left': '8px'});
                  //  grids.missingChargesGrid.$gridDiv.jqGrid('setLabel', 'comments', '', {'text-align': 'left', 'padding-left': '25px'});
                  //  grids.missingChargesGrid.$gridDiv.jqGrid('setLabel', 'isComment', '', {'text-align': 'left', 'padding-left': '0px'});
                }

            });

            this.$gridDiv.unbind("jqGridInlineAfterSaveRow");
            this.$gridDiv.bind("jqGridInlineAfterSaveRow", function(rowid) {

                //console.log("jqGridInlineAfterSaveRow------missisng grid");

                var selectedRowData = grids.missingChargesGrid.$gridDiv.jqGrid('getRowData', grids.missingChargesGrid.selectedRow);
                selectedRowData.responseCode = $("#responseSelect" + grids.missingChargesGrid.selectedRow + " option:selected").val();
                selectedRowData.response = $("#responseSelect" + grids.missingChargesGrid.selectedRow + " option:selected").text();

                selectedRowData.dept = $("#deptSelect" + grids.missingChargesGrid.selectedRow + " option:selected").val();

                selectedRowData.chargeCode = $("#chargeCodeSelect" + grids.missingChargesGrid.selectedRow + " option:selected").val();
                
                selectedRowData.ndcCode = ($("#ndcCodeSelect" + grids.missingChargesGrid.selectedRow + " option:selected").val() != undefined)?$("#ndcCodeSelect" + grids.missingChargesGrid.selectedRow + " option:selected").val():"";

                selectedRowData.modifier =  selectedRowData.selectedModifierList;
             //   log(selectedRowData);
                grids.missingChargesGrid.$gridDiv.jqGrid('setRowData', grids.missingChargesGrid.selectedRow, selectedRowData);

                grids.missingChargesGrid.savedSuccessfully = true;

                var rowid = grids.missingChargesGrid.$gridDiv.getGridParam("selrow");

                if($(grids.missingChargesGrid.$gridDiv.jqGrid("getInd",rowid,true)).attr("editable") === "0")
                        globalvars.autoSaveMissingData = grids.missingChargesGrid.$gridDiv.getRowData();

                var priceCurrentValue = grids.missingChargesGrid.$gridDiv.jqGrid('getCell', grids.missingChargesGrid.selectedRow, 'price');

                grids.missingChargesGrid.$gridDiv.jqGrid('setCell', grids.missingChargesGrid.selectedRow, 'price_modified', priceCurrentValue);
                
                //alert(JSON.stringify(grids.missingChargesGrid.$gridDiv.jqGrid('getRowData', grids.missingChargesGrid.selectedRow)));
                $("#account_details_missing_charges_grid_table tr td.price_val_missing_charges").each(function(){
                	var priceValue = $(this).text();
                	if(priceValue && priceValue.length > 0){
                    	priceValue = priceValue.toString().replace(/(.*?)(\.\d)\d$/,"$1$2");
                    	$(this).text(priceValue);
                	}
                	console.log(priceValue);
                })

            });


        },
        fillGrid: function(data) {
            this.$gridDiv.clearGridData();
            var datalength = data.length;
            //var data = eval([{"hcpcCode":"95819","dept":"","chargeCode":"","qty":0,"chargeDesc":"ELECTROENCEPHALOGRAM (EEG)","response":null,"responseCode":null,"comments":null,"predCode":"95819","dateOfService":null,"chargeNumber":null,"price":2208.72,"isNew":true,"addComment":"","tipOffComment":{"comment":"test","selectedFacilities":["Bayonne","Cayonne"],"newComment":""}},{"hcpcCode":"94002","dept":"","chargeCode":"","qty":0,"chargeDesc":"INITIAL,VENTILATORMANAGEMENT","response":null,"responseCode":null,"comments":null,"predCode":"94002","dateOfService":null,"chargeNumber":null,"price":1411.65,"isNew":true,"addComment":"","tipOffComment":{"comment":"", "selectedFacilities":[],"newComment":""}}]);
            for (var i = 0; i < datalength; i++) {
                data[i].selectedModifierList = data[i].modifier;
                data[i].price_modified = data[i].price;
                if(data[i].price && data[i].price>0){
                    data[i].price = data[i].price.toString().replace(/(.*?)(\.\d)\d$/,"$1$2");
                    data[i].price *= 1; 
                }
                this.$gridDiv.jqGrid('addRowData', i + 1, data[i]);
            }

            this.$gridDiv.setGridParam({dataNew: data});

            this.$gridDiv.setGridParam({rowNum: datalength}).trigger("reloadGrid");
            this.$gridDiv.on('mouseover','.grid_cell_style_modifier_tooltip', function(){
            	var titletext = $(this).find("button.ui-multiselect span:eq(1)").html();
            	titletext = titletext.replace(/<br>/g," / ");
            	$(this).prop("title",titletext);
            })
            
        },
        bindDeptCodeChange: function(param) {

            $("#deptSelect" + param.id).change(function() {

               // log("changing!!");
                grids.missingChargesGrid.$gridDiv.jqGrid('saveRow', param.id);

                if (grids.missingChargesGrid.savedSuccessfully) {
                    log("changing!! succes save");

                    var changingRowData = grids.missingChargesGrid.$gridDiv.jqGrid('getRowData', param.id);
                    var changingNewRowData = grids.missingChargesGrid.$gridDiv.jqGrid('getRowData', param.id);
                //    log(changingRowData);

                    changingNewRowData.response = grids.missingChargesGrid.createResponseDropdown({
                        rowData: changingRowData,
                        rowId: param.id,
                        billType: grids.missingChargesGrid.screenName
                    });

                    changingNewRowData.modifier = grids.missingChargesGrid.createModifierDropDown({
                                    rowData: changingRowData,
                                    rowId: param.id
                                });

                    changingNewRowData.dept = grids.missingChargesGrid.createDeptDropdown({
                        rowData: changingRowData,
                        rowId: param.id
                    });

                    if (changingRowData.dept != "") {
                        changingRowData.chargeCode="";
                        changingNewRowData.chargeCode = grids.missingChargesGrid.createChargeCodeDropdown({
                            rowData: changingRowData,
                            rowId: param.id
                        });
                        changingNewRowData.price = "0.00";
                    } else {
                        changingNewRowData.chargeCode = "";
                        changingNewRowData.price = "0.00";
                    }
                    grids.missingChargesGrid.$gridDiv.jqGrid('setRowData', param.id, changingNewRowData);

                    grids.missingChargesGrid.$gridDiv.jqGrid('editRow', param.id, true);

                    if(grids.missingChargesGrid.backScreen == "preBill" || grids.missingChargesGrid.backScreen == "postBill")
                        $('#' + param.id + '_' + 'dateOfService').datepicker({dateFormat: 'yy-mm-dd',defaultDate:screens.accountDetails.admitDate});//,minDate:screens.accountDetails.admitDate,maxDate:screens.accountDetails.dischargeDate});
                    else if(grids.missingChargesGrid.backScreen == "associationRules")
                        $('#' + param.id + '_' + 'dateOfService').datepicker({dateFormat: 'yy-mm-dd',defaultDate:screens.rulesAccountDetails.admitDate});//,minDate:screens.rulesAccountDetails.admitDate,maxDate:screens.rulesAccountDetails.dischargeDate});
                    else if(grids.missingChargesGrid.backScreen == "editCharges")
                        $('#' + param.id + '_' + 'dateOfService').datepicker({dateFormat: 'yy-mm-dd',defaultDate:screens.submittedAccountDetails.admitDate});//,minDate:screens.submittedAccountDetails.admitDate,maxDate:screens.submittedAccountDetails.dischargeDate});
                    else if(grids.missingChargesGrid.backScreen == "cciEdits")
                        $('#' + param.id + '_' + 'dateOfService').datepicker({dateFormat: 'yy-mm-dd',defaultDate:screens.cciEditsAccountDetails.admitDate});//,minDate:screens.submittedAccountDetails.admitDate,maxDate:screens.submittedAccountDetails.dischargeDate});
                            

                        //$('#' + param.id + '_' + 'dateOfService').datepicker({dateFormat: 'yy-mm-dd',defaultDate:screens.accountDetails.admitDate,minDate:screens.accountDetails.admitDate,maxDate:screens.accountDetails.dischargeDate})
                    grids.missingChargesGrid.addSearableDropDown();
                    grids.missingChargesGrid.addMultiSelectModifier({id: param.id})
                    grids.missingChargesGrid.bindDeptCodeChange({id: param.id});

                    grids.missingChargesGrid.savedSuccessfully = false;
                }
            });
            $("#chargeCodeSelect" + param.id).change(function() {
                if($(this).val() == "More"){

                    dialogs.otherChargesSearchFormMissDialog.reset();
                    // grids.loadOtherChargesSearchFormMissGrid({
                    //     gridDiv: "#account_details_other_charges_grid_search_form_miss_table"
                    // });


                    dialogs.otherChargesSearchFormMissDialog.initialize({
                        $searchFormDialogDiv: $("#other_charges_grid_search_form_miss_dialog"),
                        $searchFormDialogDivSubmit: $("#other_charges_grid_search_form_miss_submit"),
                        $searchFormDialogDivReset: $("#other_charges_grid_search_form_miss_reset"),
                        $searchFormDialogDivCancel: $("#other_charges_grid_search_form_miss_cancel"),
                        billType:grids.otherChargesGrid.billType
                    });

                    $(this).val(globalvars.selectedChargeCode);

                    grids.missingChargesGrid.$gridDiv.jqGrid('saveRow', grids.missingChargesGrid.selectedRow);
                    dialogs.otherChargesSearchFormMissDialog.open();

                }
                else
                {
                    globalvars.selectedChargeCode = $(this).val();
                grids.missingChargesGrid.$gridDiv.jqGrid('saveRow', param.id);

                if (grids.missingChargesGrid.savedSuccessfully) {
                    log("changing!! succes save");

                    var changingRowData = grids.missingChargesGrid.$gridDiv.jqGrid('getRowData', param.id);
                    var changingNewRowData = grids.missingChargesGrid.$gridDiv.jqGrid('getRowData', param.id);

                    changingNewRowData.response = grids.missingChargesGrid.createResponseDropdown({
                        rowData: changingRowData,
                        rowId: param.id,
                        billType: grids.missingChargesGrid.screenName
                    });

                    changingNewRowData.dept = grids.missingChargesGrid.createDeptDropdown({
                        rowData: changingRowData,
                        rowId: param.id
                    });

                    changingNewRowData.modifier = grids.missingChargesGrid.createModifierDropDown({
                                    rowData: changingRowData,
                                    rowId: param.id
                                });

                    var selChargeCode = changingNewRowData.chargeCode;


                    changingNewRowData.chargeCode = grids.missingChargesGrid.createChargeCodeDropdown({
                        rowData: changingRowData,
                        rowId: param.id
                    });

                    if (changingRowData.chargeCode != "") {
                        changingRowData.ndcCode="";
                        changingNewRowData.ndcCode = grids.missingChargesGrid.createNDCCodeDropdown({
                            rowData: changingRowData,
                            rowId: param.id
                        });
                        changingNewRowData.price = "0.00";
                    } else {
                        changingNewRowData.ndcCode = "";
                        //changingNewRowData.price = "";
                    }
                   

                    var selChargeCode = selChargeCode;
                    if($.trim(selChargeCode) != ""){
                            if(globalvars.missingChargesChargeCodes){
                                for(var i=0;i<globalvars.missingChargesChargeCodes.length;i++){
                                    if($.trim(globalvars.missingChargesChargeCodes[i].chargeCode) == $.trim(selChargeCode)){
                                         changingNewRowData.isPharmacy = globalvars.missingChargesChargeCodes[i].isPharmacy;
                                         changingNewRowData.chargeDesc = globalvars.missingChargesChargeCodes[i].chargeDesc;
                                         changingNewRowData.price = globalvars.missingChargesChargeCodes[i].price;
                                         break;
                                    }
                                }
                            }
                            
                    }
                    grids.missingChargesGrid.$gridDiv.jqGrid('setRowData', param.id, changingNewRowData);

                    grids.missingChargesGrid.$gridDiv.jqGrid('editRow', param.id, true);
                        
                    if(grids.missingChargesGrid.backScreen == "preBill" || grids.missingChargesGrid.backScreen == "postBill")
                        $('#' + param.id + '_' + 'dateOfService').datepicker({dateFormat: 'yy-mm-dd',defaultDate:screens.accountDetails.admitDate});//,minDate:screens.accountDetails.admitDate,maxDate:screens.accountDetails.dischargeDate});
                    else if(grids.missingChargesGrid.backScreen == "associationRules")
                        $('#' + param.id + '_' + 'dateOfService').datepicker({dateFormat: 'yy-mm-dd',defaultDate:screens.rulesAccountDetails.admitDate});//,minDate:screens.rulesAccountDetails.admitDate,maxDate:screens.rulesAccountDetails.dischargeDate});
                    else if(grids.missingChargesGrid.backScreen == "editCharges")
                        $('#' + param.id + '_' + 'dateOfService').datepicker({dateFormat: 'yy-mm-dd',defaultDate:screens.submittedAccountDetails.admitDate});//,minDate:screens.submittedAccountDetails.admitDate,maxDate:screens.submittedAccountDetails.dischargeDate});
                    else if(grids.missingChargesGrid.backScreen == "cciEdits")
                        $('#' + id + '_' + 'dateOfService').datepicker({dateFormat: 'yy-mm-dd',defaultDate:screens.cciEditsAccountDetails.admitDate});//,minDate:screens.submittedAccountDetails.admitDate,maxDate:screens.submittedAccountDetails.dischargeDate});
                                
                        //$('#' + param.id + '_' + 'dateOfService').datepicker({dateFormat: 'yy-mm-dd',defaultDate:screens.accountDetails.admitDate,minDate:screens.accountDetails.admitDate,maxDate:screens.accountDetails.dischargeDate});
                         grids.missingChargesGrid.addSearableDropDown();

                    grids.missingChargesGrid.bindDeptCodeChange({id: param.id});
                    grids.missingChargesGrid.addMultiSelectModifier({id: param.id})

                    grids.missingChargesGrid.savedSuccessfully = false;
                }


            }


            });
            //alert($("#ndcCodeSelect" + param.id).html());
            
            $("#ndcCodeSelect" + param.id).change(function() {
             //   log("changing!!");
                grids.missingChargesGrid.$gridDiv.jqGrid('saveRow', param.id);

                if (grids.missingChargesGrid.savedSuccessfully) {
                    log("changing!! succes save");

                    var changingRowData = grids.missingChargesGrid.$gridDiv.jqGrid('getRowData', param.id);
                    var changingNewRowData = grids.missingChargesGrid.$gridDiv.jqGrid('getRowData', param.id);
             //       log(changingRowData);

                    changingNewRowData.response = grids.missingChargesGrid.createResponseDropdown({
                        rowData: changingRowData,
                        rowId: param.id,
                        billType: grids.missingChargesGrid.screenName
                    });

                    changingNewRowData.modifier = grids.missingChargesGrid.createModifierDropDown({
                                    rowData: changingRowData,
                                    rowId: param.id
                                });

                    var objectKey = "missingData" + "_" + grids.missingChargesGrid.screenName + "_" + param.id
                    var data  = globalvars.missingDropDownData[objectKey];
                
                    if(data){
                        changingNewRowData.dept = grids.missingChargesGrid.createDeptDropdown({
                            rowData: changingRowData,
                            rowId: param.id
                        });
                    }else{
                        changingNewRowData.isPharmacy=true;
                    }

                    var selNdcCode = changingNewRowData.ndcCode;

                    changingNewRowData.ndcCode = grids.missingChargesGrid.createNDCCodeDropdown({
                        rowData: changingRowData,
                        rowId: param.id
                    });

                    if(data){
                        changingNewRowData.chargeCode = grids.missingChargesGrid.createChargeCodeDropdown({
                            rowData: changingRowData,
                            rowId: param.id
                        });

                    }



                    //alert($("#ndcCodeSelect" + param.id).html());
                    var selChargeCode =  selNdcCode;
                    console.log(selChargeCode)
                    if($.trim(selChargeCode) != ""){
                        console.log('inside:::' + selChargeCode);
                            if(globalvars.missingNDCChargeCodes){
                                for(var i=0;i<globalvars.missingNDCChargeCodes.length;i++){
                                    if($.trim(globalvars.missingNDCChargeCodes[i].ndcCode) == $.trim(selChargeCode)){
                                        

                                        changingNewRowData.isPharmacy = globalvars.missingNDCChargeCodes[i].isPharmacy;
                                         changingNewRowData.price = globalvars.missingNDCChargeCodes[i].price;
                                         break;
                                    }
                                }
                            }
                            
                    }else{

                            var selChargeCode = changingNewRowData.chargeCode;
                            if($.trim(selChargeCode) != ""){
                                    if(globalvars.missingChargesChargeCodes){
                                        for(var i=0;i<globalvars.missingChargesChargeCodes.length;i++){
                                            if(globalvars.missingChargesChargeCodes[i].chargeCode == $.trim(selChargeCode)){
                                                 changingNewRowData.isPharmacy = globalvars.missingChargesChargeCodes[i].isPharmacy;
                                                 break;
                                            }
                                        }
                                    }
                                    
                            }


                    }

                    // if (changingRowData.dept != "" && changingRowData.chargeCode != "") {

                    //     changingNewRowData.price = grids.missingChargesGrid.createChargePrice({
                    //         rowData: changingRowData,
                    //         rowId: param.id
                    //     });
                        
                    // } else {
                    //     changingNewRowData.price = "";
                        
                    // }


                    grids.missingChargesGrid.$gridDiv.jqGrid('setRowData', param.id, changingNewRowData);

                    grids.missingChargesGrid.$gridDiv.jqGrid('editRow', param.id, true);
                        
                    if(grids.missingChargesGrid.backScreen == "preBill" || grids.missingChargesGrid.backScreen == "postBill")
                        $('#' + param.id + '_' + 'dateOfService').datepicker({dateFormat: 'yy-mm-dd',defaultDate:screens.accountDetails.admitDate});//,minDate:screens.accountDetails.admitDate,maxDate:screens.accountDetails.dischargeDate});
                    else if(grids.missingChargesGrid.backScreen == "associationRules")
                        $('#' + param.id + '_' + 'dateOfService').datepicker({dateFormat: 'yy-mm-dd',defaultDate:screens.rulesAccountDetails.admitDate});//,minDate:screens.rulesAccountDetails.admitDate,maxDate:screens.rulesAccountDetails.dischargeDate});
                    else if(grids.missingChargesGrid.backScreen == "editCharges")
                        $('#' + param.id + '_' + 'dateOfService').datepicker({dateFormat: 'yy-mm-dd',defaultDate:screens.submittedAccountDetails.admitDate});//,minDate:screens.submittedAccountDetails.admitDate,maxDate:screens.submittedAccountDetails.dischargeDate});
                    else if(grids.missingChargesGrid.backScreen == "cciEdits")
                        $('#' + id + '_' + 'dateOfService').datepicker({dateFormat: 'yy-mm-dd',defaultDate:screens.cciEditsAccountDetails.admitDate});//,minDate:screens.submittedAccountDetails.admitDate,maxDate:screens.submittedAccountDetails.dischargeDate});
                                
                        //$('#' + param.id + '_' + 'dateOfService').datepicker({dateFormat: 'yy-mm-dd',defaultDate:screens.accountDetails.admitDate,minDate:screens.accountDetails.admitDate,maxDate:screens.accountDetails.dischargeDate});

                    grids.missingChargesGrid.bindDeptCodeChange({id: param.id});
                    grids.missingChargesGrid.addMultiSelectModifier({id: param.id})

                    grids.missingChargesGrid.savedSuccessfully = false;
                }
            });
        },
        createDeptDropdown: function(param) {

            var dfd = jQuery.Deferred();

            var searchQueryObject = {
                hospitalIdValue: (grids.missingChargesGrid.screenName == 'PRE') ? globalvars.preHospitals[globalvars.selectedPreHospitalIndex].hospitalId : globalvars.postHospitals[globalvars.selectedPostHospitalIndex].hospitalId,
                hospitalIdType: "equals",
                hcpcValue: param.rowData.hcpcCode,
                hcpcType: "equals"
            };

            var objectKey = "missingData" + "_" + grids.missingChargesGrid.screenName + "_" + param.rowId
            var data  = globalvars.missingDropDownData[objectKey];

            if(data){

            }else{
                getJSONModel({
                async: false,
                url: globalvars.charges.chargesLookupUri + "/getDeptLookup",
                data: searchQueryObject,
                targetVar: "missingData"
                });

                globalvars.missingDropDownData[objectKey] = globalvars.missingData;
                data = globalvars.missingDropDownData[objectKey];
            }



            

            var deptDropdown = createSelectBox({
                    index: param.rowId,
                    selectDivId: "deptSelect",
                    values: data,
                    currentValue: param.rowData.dept,
                    valueKey: "dept",
                    textKey: "dept",
                    secondaryTextKey: "deptDesc",
                    addEmptyItem: true,
                    checkForUniqueKeys: true
            });

            return deptDropdown;

        },
        addMultiSelectModifier:function(param){
            var preBillSelectedAuditortext = grids.missingChargesGrid.$gridDiv.jqGrid('getCell', param.id, 'selectedModifierList');
            var preBillRetainAuditorList = preBillSelectedAuditortext.split(",");
            $("#missing_nodifier_dropdown" + param.id).val(preBillRetainAuditorList);
            $("#missing_nodifier_dropdown" + param.id).multiselect({
                multiple: true,
                minWidth: 60,
                selectedList: 40,
                checkAllText: '',
                uncheckAllText: '',
                click: function( event, ui ) {
                    // console.log('click');
                    // if(ui.value === 'addMore'){
                    //     dialogs.otherPhysicianMissingModDialog.reset();
                    //     // gridPhysician.loadMissingPhyModCodePopupGrid({
                    //     //     gridDiv: "#account_details_missing_mod_physician_grid_search_form_table"
                    //     // });

                    //     dialogs.otherPhysicianMissingModDialog.initialize({
                    //         $searchFormDialogDiv: $("#missing_mod_grid_physician_search_form_dialog"),
                    //         $searchFormDialogDivSubmit: $("#missing_mod_grid_physician_search_form_submit"),
                    //         $searchFormDialogDivReset: $("#missing_mod_grid_physician_search_form_reset"),
                    //         $searchFormDialogDivCancel: $("#missing_mod_grid_physician_search_form_cancel"),
                    //         $searchFormDialogDivAddCodes: $("#missing_mod_grid_physician_search_form_add_Codes"),
                    //         screenName:"missing"
                    //     });
                    //     dialogs.otherPhysicianMissingModDialog.open();
                    //     $("#missing_nodifier_dropdown" + param.id).multiselect('close');
                    //     return false;


                    // }
                }
            }).multiselectfilter();

            $('.ui-multiselect-filter input').css('width', 'auto');
                            $('.ui-multiselect-menu').css('width', 'auto');
                            $('.ui-multiselect').css('background','#fff');
                            $('.ui-multiselect-hasfilter ul').css('display','none')
        },
        preBillAuditorChange: function(selectObj, id) {

            var prebill_auditors = $("#missing_nodifier_dropdown" + id).multiselect("getChecked");
            var selected_auditor_list_prebill = new Array();
            //log(prebill_auditors); /*Use the Log statement when required*/
            for (var i = 0; i < prebill_auditors.length; i++) {
                //log($(prebill_auditors[i]).attr('value')); /*Use the Log statement when required*/
                selected_auditor_list_prebill.push($(prebill_auditors[i]).attr('value'));

            }
          
            if(selected_auditor_list_prebill.length == 0){
                grids.missingChargesGrid.$gridDiv.jqGrid('setCell', id, 'selectedModifierList', " ");
                var changingNewRowData = grids.missingChargesGrid.$gridDiv.jqGrid('getRowData', id);
                var hcpc = $(changingNewRowData.hcpcCode + " option:selected").val();
                //grids.missingChargesGrid.$gridDiv.jqGrid('setCell', id, 'price',globalvars.missingChargesRuleCodesPrice[hcpc]);

            }
            else{
                grids.missingChargesGrid.$gridDiv.jqGrid('setCell', id, 'selectedModifierList', selected_auditor_list_prebill.join());
                // if(globalvars.appModDataPrice[selected_auditor_list_prebill[0]] != undefined)
                //     grids.missingChargesGrid.$gridDiv.jqGrid('setCell', id, 'price',globalvars.appModDataPrice[selected_auditor_list_prebill[0]]);

            }


        },
        createModifierDropDown:function(param){
            var ModOptionData="";

            var hospitalIdValue = globalvars.selectedHospitalId;//globalvars.physicianHospitals[globalvars.selectedPreHospitalIndex].hospitalId;

            // var searchQueryObject = {
            //     hcpcType: "equals",
            //     hcpcValue: param.rowData.hcpcCode,
            //     hospitalIdValue: hospitalIdValue,
            //     hospitalIdType: "equals"
            // };

            if(globalvars.client != "ARDENT")
             return;


            var searchQueryObject = {
                modifierType: "",
                modifierValue: "",
                descriptionType: "",
                descriptionValue: ""
                
            };

            var objectKeyMod = "missingData" + "_" + param.rowData.predKey + "_mod";
            var data  = globalvars.missingDropDownData[objectKeyMod];
            if(data){

            }else{

                //if(param.rowData.hcpcCode != ""){
                    getJSONModel({
                        async: false,
                        url: globalvars.root.uriModifier,
                        type: 'GET',
                        data: searchQueryObject,
                        traditional: true,
                        dataType: 'json',
                        targetVar: "missingModifierData"

                    });

                    //globalvars.missingModifierData = [{"hcpcCode":"74020","revenueCode":null,"price":100.00,"modifier":"","description":"PR X-RAY ABDOMEN 2 VW","modDesc":null},{"hcpcCode":"74020","revenueCode":null,"price":200.00,"modifier":"26","description":"PR X-RAY ABDOMEN 2 VW","modDesc":"Professional component"},{"hcpcCode":"74020","revenueCode":null,"price":300.00,"modifier":"TC","description":"PR X-RAY ABDOMEN 2 VW","modDesc":"Technical component only"}]

                    var modCollection=[];
                    $(globalvars.missingModifierData).each(function (i) {
                        modCollection.push(globalvars.missingModifierData[i].modifier)
                        globalvars.appModData[globalvars.missingModifierData[i].modifier] = globalvars.missingModifierData[i].description;
                        //globalvars.appModDataPrice[globalvars.missingModifierData[i].modifier] = globalvars.missingModifierData[i].price
                    })

                    globalvars.missingDropDownData[objectKeyMod] = modCollection;
                    data = globalvars.missingDropDownData[objectKeyMod];
                //}

                
            }

            if(data){
                $(data).each(function (i) {
                    if(data[i] != "")
                        ModOptionData += "<option value='" + data[i]+ "' title='" + globalvars.appModData[data[i]]+ "'>" + data[i] + "</option>"

                })

                //if(ModOptionData != "")
                    //ModOptionData += "<option value='addMore'>Add More...</option>"
            }

            // if(ModOptionData == "")
            //     return "";

            var preBillAuditorDropDown = new String();
            preBillAuditorDropDown = "<div><select class='missingMultiselect' id='missing_nodifier_dropdown" + param.rowId + "' multiple='multiple' onchange='grids.missingChargesGrid.preBillAuditorChange(this," + param.rowId + ")' style=width:60px>";
            preBillAuditorDropDown += ModOptionData;
            preBillAuditorDropDown += "</select></div>";


            return preBillAuditorDropDown;



        },
        createResponseDropdown: function(param) {
            var response=[];
            if(param.billType != "POST"){
                var datalength = globalvars.responses.length;
                for (var i = 0; i < datalength;i++) {
                    if( globalvars.responses[i].value != "LPPB" && globalvars.responses[i].value != "ZNI")
                        response.push(globalvars.responses[i]);
                }

            }else if(param.billType == "POST"){

                var datalength = globalvars.responses.length;
                for (var i = 0; i < datalength;i++) {
                    if( globalvars.responses[i].value != "H")
                        response.push(globalvars.responses[i]);
                }
            }
            else{
                response = globalvars.responses;
            }


            var responseDropdown = createSelectBox({
                index: param.rowId,
                selectDivId: "responseSelect",
                values: response,
                currentValue: param.rowData.responseCode,
                valueKey: "value",
                textKey: "description",
                addEmptyItem: true
            });

            return responseDropdown;
        },
        getChargeData : function(data,param){
            var chargeData = [];
            if(data){
                var datalength = data.length;
                for (var i = 0; i < datalength; i++) {
                    if(data[i].hcpc == param.rowData.hcpcCode && data[i].dept == param.rowData.dept){
                        chargeData.push(data[i]);
                    }
                }
                return chargeData;
            }

        },
        getNDCData : function(data,param){
            var NDCData = [];
            if(data){
                var datalength = data.length;
                for (var i = 0; i < datalength; i++) {
                    if(data[i].dept == param.rowData.dept && data[i].chargeCode == param.rowData.chargeCode){
                        NDCData.push(data[i]);
                    }
                }
                return NDCData;
            }

        },
        createChargeCodeDropdown: function(param) {
            
            var dfd = jQuery.Deferred();

            var searchQueryObject = {
                hospitalIdValue: (grids.missingChargesGrid.screenName == 'PRE') ? globalvars.preHospitals[globalvars.selectedPreHospitalIndex].hospitalId : globalvars.postHospitals[globalvars.selectedPostHospitalIndex].hospitalId,
                hospitalIdType: "equals",
                hcpcValue: param.rowData.hcpcCode,
                hcpcType: "equals",
                deptValue: param.rowData.dept,
                deptType: "equals"
            };

            var objectKey = "missingData" + "_" + grids.missingChargesGrid.screenName + "_"  + param.rowData.dept + "_" + param.rowId
            var missingChargesChargeCodes =[];
            var data=[];
            data  = globalvars.missingDropDownData[objectKey];
            if(data){
                globalvars.missingChargesChargeCodes = data;//grids.missingChargesGrid.getChargeData(data,param)
            }else{

                getJSONModel({
                    async: false,
                    url: globalvars.charges.chargesLookupUri,
                    data: searchQueryObject,
                    targetVar: "missingChargesChargeCodes"
                });

                globalvars.missingDropDownData[objectKey] = globalvars.missingChargesChargeCodes;
                data = globalvars.missingChargesChargeCodes;
            }

            // this is for case of edit submitted and saved account

            if(param.rowData.chargeCode != ""){


            var searchQueryObject = {
                hospitalIdValue: (grids.missingChargesGrid.screenName == 'PRE') ? globalvars.preHospitals[globalvars.selectedPreHospitalIndex].hospitalId : globalvars.postHospitals[globalvars.selectedPostHospitalIndex].hospitalId,
                hospitalIdType: "equals",
                hcpcValue: param.rowData.hcpcCode,
                hcpcType: "equals",
                deptValue: param.rowData.dept,
                deptType: "equals",
                chargeValue: param.rowData.chargeCode,
                chargeType: "equals"
                
                
                
            };

              getJSONModel({
                    async: false,
                    url: globalvars.charges.chargesLookupUri,
                    data: searchQueryObject,
                    targetVar: "missingChargesChargeCodesAdd"
                });

               globalvars.missingChargesChargeCodes = globalvars.missingChargesChargeCodes.concat(globalvars.missingChargesChargeCodesAdd); 
               globalvars.missingDropDownData[objectKey] = globalvars.missingChargesChargeCodes;
          
            //if(param.rowData.ndcCode != ""){

                var objectKeyndc = "missingData" + "_" + grids.missingChargesGrid.screenName + "_" + param.rowData.dept + "_" + param.rowData.chargeCode + "_" + param.rowId
                globalvars.missingNDCChargeCodes = globalvars.missingChargesChargeCodesAdd;
                globalvars.missingDropDownData[objectKeyndc] = globalvars.missingNDCChargeCodes;

            //}



          }




            var listRuleSource=[];
            var newData =[];
            newData = globalvars.missingDropDownData[objectKey]
            
            if(newData){
                if(newData.length > 0){
           
                    $(newData).each(function (i) {
                        var ruleObj={};
                        ruleObj.sourceVal = newData[i].chargeCode;
                        ruleObj.name = newData[i].chargeCode + " - " + newData[i].chargeDesc;
                        listRuleSource.push(ruleObj);
                    })
                }
            }

            var obj={"sourceVal":"More","name":"More..."};
            listRuleSource.push(obj);


         //   log(searchQueryObject);

            var chargeCodeDropdown = createSelectBox({
                    index: param.rowId,
                    selectDivId: "chargeCodeSelect",
                    values: listRuleSource,
                    currentValue: param.rowData.chargeCode,
                    valueKey: "sourceVal",
                    textKey: "name",
                    //secondaryTextKey: "chargeDesc",
                    addEmptyItem: true,
                    checkForUniqueKeys: true
            });
                
            return chargeCodeDropdown;

        },

        createNDCCodeDropdown: function(param) {
            
            var dfd = jQuery.Deferred();

            var searchQueryObject = {
                hospitalIdValue: (grids.missingChargesGrid.screenName == 'PRE') ? globalvars.preHospitals[globalvars.selectedPreHospitalIndex].hospitalId : globalvars.postHospitals[globalvars.selectedPostHospitalIndex].hospitalId,
                hospitalIdType: "equals",
                hcpcValue: param.rowData.hcpcCode,
                hcpcType: "equals",
                deptValue: param.rowData.dept,
                deptType: "equals",
                chargeValue: param.rowData.chargeCode,
                chargeType: "equals"
            };

            var objectKey = "missingData" + "_" + grids.missingChargesGrid.screenName + "_" + param.rowData.dept + "_" + param.rowData.chargeCode + "_" + param.rowId
            globalvars.missingNDCChargeCodes =[];
            var data  = globalvars.missingDropDownData[objectKey];
            if(data){
                globalvars.missingNDCChargeCodes = data//grids.missingChargesGrid.getNDCData(data,param)
            }
            else
            {
                getJSONModel({
                async: false,
                url: globalvars.charges.chargesLookupUri,
                data: searchQueryObject,
                targetVar: "missingNDCChargeCodes"
                });
                globalvars.missingDropDownData[objectKey] = globalvars.missingNDCChargeCodes;

            }

         //   log(searchQueryObject);

            // getJSONModel({
            //     async: false,
            //     url: globalvars.charges.chargesLookupUri,
            //     data: searchQueryObject,
            //     targetVar: "missingNDCChargeCodes"
            // });

            // console.log(param.rowId);

            if(globalvars.missingNDCChargeCodes && globalvars.missingNDCChargeCodes.length ==0){
                grids.missingChargesGrid.$gridDiv.jqGrid('saveRow', param.rowId);
                var changingRowData = grids.missingChargesGrid.$gridDiv.jqGrid('getRowData', param.rowId);
                changingRowData.ndcCode=""
                grids.missingChargesGrid.$gridDiv.jqGrid('setRowData', param.rowId, changingRowData);
                return;
            }

            if(globalvars.missingNDCChargeCodes && globalvars.missingNDCChargeCodes.length ==1){
                if(globalvars.missingNDCChargeCodes[0].ndcCode == ""){
                    grids.missingChargesGrid.$gridDiv.jqGrid('saveRow', param.rowId);
                    var changingRowData = grids.missingChargesGrid.$gridDiv.jqGrid('getRowData', param.rowId);
                    changingRowData.ndcCode=""
                    grids.missingChargesGrid.$gridDiv.jqGrid('setRowData', param.rowId, changingRowData);
                    return;
                }
            }

            if(globalvars.missingNDCChargeCodes && globalvars.missingNDCChargeCodes.length ==2){
                if(globalvars.missingNDCChargeCodes[0].ndcCode == "" && globalvars.missingNDCChargeCodes[1].ndcCode == ""){
                    grids.missingChargesGrid.$gridDiv.jqGrid('saveRow', param.rowId);
                    var changingRowData = grids.missingChargesGrid.$gridDiv.jqGrid('getRowData', param.rowId);
                    changingRowData.ndcCode=""
                    grids.missingChargesGrid.$gridDiv.jqGrid('setRowData', param.rowId, changingRowData);

                    return;
                }
            }

            if(globalvars.missingNDCChargeCodes && globalvars.missingNDCChargeCodes.length > 0){
                var datalength = globalvars.missingNDCChargeCodes.length;
                var flag=false;
                for (var i = 0; i < datalength;i++) {
                    if( $.trim(globalvars.missingNDCChargeCodes[i].ndcCode).length > 0){
                        flag = true;
                        break;
                    }
                }

                if(flag == false){
                    grids.missingChargesGrid.$gridDiv.jqGrid('saveRow', param.rowId);
                    var changingRowData = grids.missingChargesGrid.$gridDiv.jqGrid('getRowData', param.rowId);
                    changingRowData.ndcCode=""
                    grids.missingChargesGrid.$gridDiv.jqGrid('setRowData', param.rowId, changingRowData);
                    return;
                }
            }




            var ndcCodeDropdown = createSelectBox({
                    index: param.rowId,
                    selectDivId: "ndcCodeSelect",
                    values: globalvars.missingNDCChargeCodes,
                    currentValue: param.rowData.ndcCode,
                    valueKey: "ndcCode",
                    textKey: "ndcCode",
                    addEmptyItem: true,
                    secondaryTextKey:"ndcDesc",                    
                    checkForUniqueKeys: true
            });
                
            return ndcCodeDropdown;

        },
         addSearableDropDown:function(){
        	 
             //$('.chargeCodeSelect').select2({dropdownAutoWidth: true});
             
        	 $('.chargeCodeSelect').dropdown();

/*             $('.select2-dropdown').css('width','200px');
             $('.select2-selection--single').css('height','18px');
             $('.select2-selection--single').css('border-radius','0px');
             $('.select2-selection__rendered').css('line-height','18px');
             $('.select2-selection__arrow').css('height','18px');
             $('.select2-results__option').css('padding','2px');
*/

             
                



             
            // select2-dropdown select2-dropdown--below 182px
            
            // $('.chargeCodeSelect').siblings().find('.chosen-results').css('width','150px');




            // $('.chargeCodeSelect').chosen();
            // $('.chargeCodeSelect').css('z-index','9999999')
            // $('.chargeCodeSelect').siblings().find('.chosen-results').css('max-height','100px');
            // $('.chargeCodeSelect').siblings().find('.chosen-results').css('width','150px');
            // $('.chargeCodeSelect').siblings().css('width','150px');
            // $('.chargeCodeSelect').siblings().css('z-index','9999999')
            // $('.chargeCodeSelect').siblings().find('.chosen-single').css('height','16px') 
            // $('.chargeCodeSelect').siblings().find('.chosen-single').css('top','-10px') 
            // $('.chargeCodeSelect').siblings().find('.chosen-single').css('line-height','17px');
            // $('.chargeCodeSelect').siblings().find('.chosen-single').css('position','absolute');
            // $('.chargeCodeSelect').siblings().find('.chosen-single').css('width','70px');
            // $('.chargeCodeSelect').siblings().find('.chosen-single').css('z-index','9999999')
            // $('.chargeCodeSelect').siblings().find('.chosen-single').css('border','1px solid');
            // $('.chargeCodeSelect').siblings().find('.chosen-single').css('border-color','rgb(169, 169, 169)');
            // $('.chargeCodeSelect').siblings().find('.chosen-single').css('background-color','#FFFFFF');
            // $('.chargeCodeSelect').siblings().find('.chosen-single').css('margin-top','1px');
            // $('.chargeCodeSelect').siblings().find('.chosen-single div').css('top','-3px');
            // $('.chargeCodeSelect').siblings().css('position','absolute');
            // $('.chargeCodeSelect').siblings().css('display','block');
            // $('.chargeCodeSelect').siblings().find('.chosen-drop').css('margin-top','10px');
            // $('.chargeCodeSelect').siblings().find('.chosen-drop').css('border-bottom','0');
            // $('.chargeCodeSelect').siblings().find('.chosen-drop').css('border-top','1px solid #aaa');
            // $('.chargeCodeSelect').siblings().find('.chosen-drop').css('top','auto');
            // $('.chargeCodeSelect').siblings().find('.chosen-drop').css('bottom','40px');

        },
        createChargePrice: function(param) {

            // var dfd = jQuery.Deferred();

            // var price = "";
            // var hospitalIdValue = (grids.missingChargesGrid.screenName == 'PRE') ? globalvars.preHospitals[globalvars.selectedPreHospitalIndex].hospitalId : globalvars.postHospitals[globalvars.selectedPostHospitalIndex].hospitalId;
            
            // $.ajax({
            //     type: 'GET',
            //     url: globalvars.charges.chargesLookupPriceUri + "?hospitalIdValue=" + hospitalIdValue + "&deptValue=" + param.rowData.dept + "&chargeValue=" + param.rowData.chargeCode + "&hcpcValue=" + param.rowData.hcpcCode,
            //     async: false,
            //     contentType: 'application/json',
            //     error: function(jqxhr) {
            //     },
            //     success: function(str) {
            //         price = str;
            //     }
            // });

            // return price;
        }
    },

     otherChargesGrid: {
        $gridDiv: {},
        selectedRow: undefined,
        savedSuccessfully: true,
        isEditable: true,
        billType: "",
        backScreen:"",
        initialize: function(param) {
            this.$gridDiv = $(param.gridDiv);
            this.isEditable = param.isEditable === false ? false : true;
            this.backScreen = param.backScreen;
            this.loadGrid(param.$gridDiv);
            this.fillGrid(param.data);
            this.billType = param.screenName;
        },
        loadGrid: function(param) { // param object holds gridDiv, data
            this.selectedRow = undefined;
            this.savedSuccessfully = true;

            this.$gridDiv.jqGrid({
                datatype: "local",
                autowidth: true,
                height: '120',
                gridview: true,
                viewrecords: true,
//                sortname: 'hcpcCode',
//                sortorder: 'asc',
                altRows: true,
                altclass: 'alternate_row_color',
                colNames: ['id', globalvars.localResourceMap.other_discoved_charge_search, globalvars.localResourceMap.other_discoved_charge_hcpc_code,
                    globalvars.localResourceMap.other_discoved_charge_dept_code, 'Modifier', globalvars.localResourceMap.other_discoved_charge_charge_code,'Ndc code',
                    '',globalvars.localResourceMap.other_discoved_charge_price, globalvars.localResourceMap.other_discoved_charge_add_qty, globalvars.localResourceMap.other_charge_date_of_service, globalvars.localResourceMap.other_discoved_charge_comment,
                    globalvars.localResourceMap.other_discoved_charge_chargeDescription,'predNbr','','','','','',''],
                colModel: [
                    {name: 'id', index: 'id', key: true, hidden: true},
                    {name: 'search', index: 'search', width: 90, fixed: true,sortable: false},
                    {
                        name: 'hcpcCode', index: 'hcpcCode', editable: false, width: 100, fixed: true, sortable:false, align: "center", sorttype: "string", key: true,
                        editoptions: {
                            size: "5",
                            maxlength: "5"
                        }
                    },
                    {
                        name: 'dept', index: 'dept', editable: false, width: 100, fixed: true, sorttype: "int", align: "center",sortable: false,
                        editoptions: {
//                            size: "3",
//                            maxlength: "3"
                        },

                        editrules: {
                            custom: true,
                            custom_func: function(value, colname) {
                                var selectedRowData = grids.otherChargesGrid.$gridDiv.jqGrid('getRowData', grids.otherChargesGrid.selectedRow);
                                if (value != undefined) {
                                    if (!(/^[a-z0-9\.\*]+$/i.test(value))){// || value.length !== 3) {
                                        return [false, globalvars.localResourceMap.other_discoverd_validation_new_msg4];
                                    } else {
                                        return [true, ""];
                                    }
                                }
                                else
                                    return [true, ""];
                            }
                        }
                    },
                    {name: 'modifier', index: 'modifier', fixed: true, width: 80, classes: 'grid_cell_style grid_cell_style_modifier_tooltip'},

                    {
                        name: 'chargeCode', index: 'chargeCode', editable: false, width: 110, fixed: true, sortable: false, align: "center", sorttype: "int",
                        editoptions: {
//                            size: "5",
//                            maxlength: "5"
                        }
//                        editrules: {
//                            custom: true,
//                            custom_func: function(value, colname) {
//                                var selectedRowData = grids.otherChargesGrid.$gridDiv.jqGrid('getRowData', grids.otherChargesGrid.selectedRow);
//                                if (value != undefined) {
//                                    if (!(/^[a-z0-9.]+$/i.test(value))){// || value.length !== 5) {
//                                        return [false, globalvars.localResourceMap.other_discoverd_validation_new_msg3];
//                                    } else {
//                                        return [true, ""];
//                                    }
//                                }
//                                else
//                                    return [true, ""];
//                            }
//                        }
                    },
                    {
                        name: 'ndcCode', index: 'ndcCode', editable: false, width: 100, fixed: true, sortable: false, align: "center", sorttype: "int"
                    },
                    {name: 'price_modified', index: 'price_modified', fixed: true, width: 80,hidden:true},
                    {name: 'price', index: 'price', width: 90, classes: 'price_val_other_charges', fixed: true, sortable: false, sorttype: "int", align: "center",formatter:'currency',editable:true,edittype:"text",
                     formatoptions: { decimalSeparator: ".", thousandsSeparator: ",", prefix: "$",decimalPlaces: 1, defaultValue: '0.0'},
                     editoptions: {
                         dataInit: function(element) {
                         	$(element).keypress(function(e){
                         		if (e.which > 31 && (e.which < 48 || e.which > 57) && !(e.which == 46 || e.which == 8)){
                         			return false;
                              	}
                         	});
                         	$(element).keyup(function(e){
                         		priceValue = $(this).val();
                         		if(/^(\d+)?(\.\d{2})(\d+)$/.test($(this).val())){
                         			//dialogs.messageDialog.show({ title: globalvars.localResourceMap.price_error_title, text: globalvars.localResourceMap.price_error_message })
                         			priceValue=priceValue.replace(/^(\d+)?(\.\d{1,2})(\d+)$/,"$1$2")
                         			$(this).val(priceValue);
                         		}
                         	});
                         }
                     }

                    },
                    {
                        name: 'quantity', index: 'quantity', sortable: false, editable: this.isEditable, width: 120, fixed: true, align: "center", sorttype: "int",
                        edittype: "text",
                        editoptions: {
                            size: "3",
                            maxlength: "3"
                        }
                        // editrules: {
                        //     custom: true,
                        //     custom_func: function(value, colname) {
                        //         if (!(/^\d+$/.test(value)) || isNaN(value)) {
                        //             return [false, globalvars.localResourceMap.other_discoverd_type_msg];
                        //         } else if (value < 1) {
                        //             return [true, ""];
                        //             //return [false, globalvars.localResourceMap.other_discoverd_validation_msg];
                        //         } else {
                        //             return [true, ""];
                        //         }


                        //     }
                        // }
                    },
                    {name: 'dateOfService1', index: 'dateOfService1', width: 110, fixed: true, sortable: false, sorttype: "date", datefmt: "Y-m-d h:i:s", editable: this.isEditable, align: "center",
                        editoptions:{
                                            readonly: 'readonly'
                                 }},
                    {name: 'comments', index: 'comments', editable: this.isEditable, width: 200, fixed: true,sortable: false,  editoptions: {
                            size: "24",
                            maxlength: "250",
                        },
                        classes: 'grid_cell_style'},
                    {name: 'chargeDescription', index: 'chargeDescription', hidden: true},
                    {name: 'predNbr', index: 'predNbr', hidden: true},
                    {name: 'method', index: 'method', hidden: true},
                    {name: 'predKey', index: 'predKey',hidden:true},
                    {name: 'rowEditable', index: 'rowEditable',hidden:true},
                    {name: 'selectedModifierListOther', index: 'selectedModifierListOther', hidden: true, search: true},

                    {name: 'cenAuditorId', index: 'cenAuditorId',hidden:true},
                    {name: 'cenAuditingTime', index: 'cenAuditingTime',hidden:true},

                ],
//                onCellSelect: function (rowid, index, contents, event) {
//                    if (index == 1 && grids.otherChargesGrid.isEditable == true) {
//
//                        if (grids.otherChargesGrid.savedSuccessfully == true || grids.otherChargesGrid.selectedRow == rowid) {
//                            dialogs.otherChargesSearchFormDialog.reset();
//                            grids.loadOtherChargesSearchFormGrid({
//                                gridDiv: "#account_details_other_charges_grid_search_form_table"
//                            });
//
//                            dialogs.otherChargesSearchFormDialog.initialize({
//                                $searchFormDialogDiv: $("#other_charges_grid_search_form_dialog"),
//                                $searchFormDialogDivSubmit: $("#other_charges_grid_search_form_submit"),
//                                $searchFormDialogDivReset: $("#other_charges_grid_search_form_reset"),
//                                $searchFormDialogDivCancel: $("#other_charges_grid_search_form_cancel"),
//                                billType:grids.otherChargesGrid.billType
//                            });
//                            dialogs.otherChargesSearchFormDialog.open();
//
//                        };
//                    };
//                  },
                onSelectRow: function(id) {
                	//console.log('111111')
                    var formatoptionsObject={truncateDecimal: true, decimalSeparator: ".", thousandsSeparator: ",", prefix: "$",decimalPlaces: 2, defaultValue: "0.00"};
                    grids.otherChargesGrid.$gridDiv.jqGrid('setColProp','price',{formatoptions:formatoptionsObject})

                    var rowData = grids.otherChargesGrid.$gridDiv.jqGrid('getRowData', id);
                   // console.log("rowData.rowEditable::::::  " + rowData.rowEditable);

                    var priceVal = grids.otherChargesGrid.$gridDiv.jqGrid('getCell', id, 'price_modified');
                    
                    if(priceVal > 0){
                        rowData.price = priceVal;
                        grids.otherChargesGrid.$gridDiv.jqGrid('setRowData', id, rowData);
                    }

                    if(rowData.rowEditable == false || rowData.rowEditable == "false"){
                        return;
                    }



                    //grids.otherChargesGrid.$gridDiv.trigger("jqGridInlineAfterSaveRow");
                    // if (grids.otherChargesGrid.selectedRow !== undefined && grids.otherChargesGrid.selectedRow !== id) {
                    //     grids.otherChargesGrid.$gridDiv.jqGrid('saveRow', grids.otherChargesGrid.selectedRow);
                    // }
                    // ;

                    if (globalvars.saveRowId != id) {

                        grids.otherChargesGrid.$gridDiv.jqGrid('saveRow', globalvars.saveRowId);
                        globalvars.saveRowId = id;
                    }

                    


                    if (grids.otherChargesGrid.savedSuccessfully == true && grids.otherChargesGrid.isEditable == true) {
                       // console.log('222222')

                        var newRowData = grids.otherChargesGrid.$gridDiv.jqGrid('getRowData', id);

                        if(priceVal > 0){
                        	newRowData.price=priceVal;
                        }

                        
                        newRowData.modifier = grids.otherChargesGrid.createModifierDropDown({
                                    rowData: rowData,
                                    rowId: id
                                });
                    

                        grids.otherChargesGrid.$gridDiv.jqGrid('setRowData', id, newRowData);

                         
                        grids.otherChargesGrid.selectedRow = id;
                        grids.otherChargesGrid.$gridDiv.jqGrid('editRow', id, true,false, false, false, false, false,false, afterrestorefunc);

                        if(grids.otherChargesGrid.backScreen == "preBill" || grids.otherChargesGrid.backScreen == "postBill")
                            $('#' + id + '_' + 'dateOfService1').datepicker({dateFormat: 'yy-mm-dd',defaultDate:screens.accountDetails.admitDate});//,minDate:screens.accountDetails.admitDate,maxDate:screens.accountDetails.dischargeDate});
                        else if(grids.otherChargesGrid.backScreen == "associationRules")
                            $('#' + id + '_' + 'dateOfService1').datepicker({dateFormat: 'yy-mm-dd',defaultDate:screens.rulesAccountDetails.admitDate});//,minDate:screens.rulesAccountDetails.admitDate,maxDate:screens.rulesAccountDetails.dischargeDate});
                        else if(grids.otherChargesGrid.backScreen == "editCharges")
                            $('#' + id + '_' + 'dateOfService1').datepicker({dateFormat: 'yy-mm-dd',defaultDate:screens.submittedAccountDetails.admitDate});//,minDate:screens.submittedAccountDetails.admitDate,maxDate:screens.submittedAccountDetails.dischargeDate});
                        else if(grids.otherChargesGrid.backScreen == "editChargesCCIEdits")
                            $('#' + id + '_' + 'dateOfService1').datepicker({dateFormat: 'yy-mm-dd',defaultDate:screens.submittedAccountDetailsCCIEdits.admitDate});//,minDate:screens.submittedAccountDetails.admitDate,maxDate:screens.submittedAccountDetails.dischargeDate});
                        else if(grids.otherChargesGrid.backScreen == "cciEdits")
                            $('#' + id + '_' + 'dateOfService1').datepicker({dateFormat: 'yy-mm-dd',defaultDate:screens.cciEditsAccountDetails.admitDate});//,minDate:screens.submittedAccountDetails.admitDate,maxDate:screens.submittedAccountDetails.dischargeDate});
                        

                        //$('#' + id + '_' + 'dateOfService1').datepicker({dateFormat: 'yy-mm-dd',defaultDate:screens.accountDetails.admitDate,minDate:screens.accountDetails.admitDate,maxDate:screens.accountDetails.dischargeDate});
                        grids.otherChargesGrid.bindDeptCodeChange({id: id});
                        grids.otherChargesGrid.addMultiSelectModifier({id:id})
                        grids.otherChargesGrid.savedSuccessfully = false;
                    }
                    ;
                    function afterrestorefunc(e){
                        grids.otherChargesGrid.savedSuccessfully = true;
                    }

                //    log('clicked ' + id + " " + grids.otherChargesGrid.$gridDiv.getRowData(id));

                },
                onCellSelect: function (iRow, iCol, content, event) {
                     var cmName = grids.otherChargesGrid.$gridDiv.jqGrid("getGridParam", "colModel")[iCol].name,
                     target = event.target;
                     if(target.className == "search_cell_search"){
                        dialogs.otherChargesSearchFormDialog.reset();
                            // grids.loadOtherChargesSearchFormGrid({
                            //     gridDiv: "#account_details_other_charges_grid_search_form_table"
                            // });

                            dialogs.otherChargesSearchFormDialog.initialize({
                                $searchFormDialogDiv: $("#other_charges_grid_search_form_dialog"),
                                $searchFormDialogDivSubmit: $("#other_charges_grid_search_form_submit"),
                                $searchFormDialogDivReset: $("#other_charges_grid_search_form_reset"),
                                $searchFormDialogDivCancel: $("#other_charges_grid_search_form_cancel"),
                                billType:grids.otherChargesGrid.billType
                            });
                            grids.otherChargesGrid.$gridDiv.jqGrid('saveRow', grids.otherChargesGrid.selectedRow);
                            dialogs.otherChargesSearchFormDialog.open();
                    }
                    else if(target.className == "search_cell_del"){
                        myDelOptions = {

                    onclickSubmit: function(options, rowid) {
                        var grid_id = $.jgrid.jqID(grids.otherChargesGrid.$gridDiv[0].id),
                            grid_p = grids.otherChargesGrid.$gridDiv[0].p,
                            newPage = grid_p.page;

                        options.processing = true;
                        grids.otherChargesGrid.$gridDiv.delRowData(rowid);
                        $.jgrid.hideModal("#delmod"+grid_id,
                                          {gb:"#gbox_"+grid_id,
                                          jqm:options.jqModal,onClose:options.onClose});

                        if (grid_p.lastpage > 1) {
                            if (grid_p.reccount === 0 && newPage === grid_p.lastpage) {
                                newPage--;
                            }
                            grids.otherChargesGrid.$gridDiv.trigger("reloadGrid", [{page:newPage}]);
                        }
                        grids.otherChargesGrid.savedSuccessfully = true;


                        return true;
                    },
                    processing:true
                };

                // if (gridPhysician.otherPhysicianChargesGrid.selectedRow !== undefined) {
                    log("submitting + saving row " + grids.otherChargesGrid.selectedRow);
                    //var rowid = gridPhysician.otherPhysicianChargesGrid.$gridDiv.jqGrid('getGridParam', 'selrow');
                    grids.otherChargesGrid.$gridDiv.jqGrid('delGridRow',iRow,myDelOptions);
                    grids.otherChargesGrid.savedSuccessfully = true;

                    // };

                   // return false;
                }
            },
                editurl: 'clientArray',
                loadComplete: function() {
                   // console.log('33333')

                    $(("#account_details_other_charges_grid_table tr")).removeClass('highlighted_row');
                     
                      var gridRowData = grids.otherChargesGrid.$gridDiv.jqGrid('getRowData');
                      var gridRowDataLength = gridRowData.length;

                      //console.log(gridRowData);

                     
                      for (var i = 0; i < gridRowDataLength; i++) {
                          if (gridRowData[i].rowEditable == "false" || gridRowData[i].rowEditable == false) {
                        //      log("isHighlighted " + gridRowData[i].isNew + " : " + (i + 1));
                              var searchId = gridRowData[i].id;
                                    $(("#account_details_other_charges_grid_table tr#" + (searchId))).addClass("highlighted_row");
                          }
                      }


                      $("#account_details_other_charges_grid_table tbody tr").find("td:eq(15)").each(function(){
                            //console.log($(this).text());

                            if($(this).text() == "false" || $(this).text() == false){

                                $(this).parent().tooltip({
                                content: function(response) {
                                    //console.log(this.parentNode)
                                    if(this.parentNode){
                                        var rowData = grids.otherChargesGrid.$gridDiv.jqGrid('getRowData',this.parentNode.id);
                                        return '<b>Assigned to: </b>' + rowData.cenAuditorId+"<br/><b>Submitted on: </b>" + rowData.cenAuditingTime;
                                    }
                                },
                                open: function() {
                                    $(this).tooltip("widget").stop(false, true).hide().slideDown("fast");
                                },
                                close: function() {
                                    $(this).tooltip("widget").stop(false, true).show().slideUp("fast");
                                }
                            }).tooltip("widget").addClass("ui-state-highlight");
                        }
                    })


                    grids.otherChargesGrid.$gridDiv.setGridParam({rowNum: gridRowDataLength}).trigger("reloadGrid");
                   // grids.otherChargesGrid.$gridDiv.jqGrid('setLabel', 'comments', '', {'text-align': 'left', 'padding-left': '16px', 'width': '236px'});

                }

            });

            this.$gridDiv.bind("jqGridInlineAfterSaveRow", function(rowid) {
                //console.log("jqGridInlineAfterSaveRow----other discovered");
               // $('#' + rowid + '_' + 'dateOfService1').datepicker({dateFormat: 'yy-mm-dd',defaultDate:screens.accountDetails.admitDate,minDate:screens.accountDetails.admitDate,maxDate:screens.accountDetails.dischargeDate});
                var selectedRowData = grids.otherChargesGrid.$gridDiv.jqGrid('getRowData', grids.otherChargesGrid.selectedRow);
                selectedRowData.modifier =  selectedRowData.selectedModifierListOther;
                grids.otherChargesGrid.$gridDiv.jqGrid('setRowData', grids.otherChargesGrid.selectedRow, selectedRowData);


                grids.otherChargesGrid.savedSuccessfully = true;
                //grids.otherChargesGrid.$gridDiv.jqGrid('saveRow', grids.otfherChargesGrid.selectedRow);

                    var rowid = grids.otherChargesGrid.$gridDiv.getGridParam("selrow");

                    if($(grids.otherChargesGrid.$gridDiv.jqGrid("getInd",rowid,true)).attr("editable") == "0")
                            globalvars.autoSaveOtherChargeData = grids.otherChargesGrid.$gridDiv.getRowData();

                    var priceCurrentValue = grids.otherChargesGrid.$gridDiv.jqGrid('getCell', grids.otherChargesGrid.selectedRow, 'price');

                    grids.otherChargesGrid.$gridDiv.jqGrid('setCell', grids.otherChargesGrid.selectedRow, 'price_modified', priceCurrentValue);
                    
                    //alert(JSON.stringify(grids.missingChargesGrid.$gridDiv.jqGrid('getRowData', grids.missingChargesGrid.selectedRow)));
                    $("#account_details_other_charges_grid_table tr td.price_val_other_charges").each(function(){
                    	var priceValue = $(this).text();
                    	if(priceValue && priceValue.length > 0){
                        	priceValue = priceValue.toString().replace(/(.*?)(\.\d)\d$/,"$1$2");
                        	$(this).text(priceValue);
                    	}
                    	console.log(priceValue);
                    })

            });

            // this.$gridDiv.bind("jqGridSortCol", function(rowid) {
            //  //   log("jqGridSortCol");
            // });
        },
        addMultiSelectModifier:function(param){
            var preBillSelectedAuditortext = grids.otherChargesGrid.$gridDiv.jqGrid('getCell', param.id, 'selectedModifierListOther');
            var preBillRetainAuditorList = preBillSelectedAuditortext.split(",");
            $("#missing_nodifier_dropdown_other" + param.id).val(preBillRetainAuditorList);
            $("#missing_nodifier_dropdown_other" + param.id).multiselect({
                multiple: true,
                minWidth: 60,
                selectedList: 40,
                checkAllText: '',
                uncheckAllText: ''
               
                
            }).multiselectfilter();

            $('.ui-multiselect-filter input').css('width', 'auto');
            $('.ui-multiselect-menu').css('width', 'auto');
            $('.ui-multiselect').css('background','#fff');
            $('.ui-multiselect-hasfilter ul').css('display','none')
        },
        selectModifierChange: function(selectObj, id) {

            var prebill_auditors = $("#missing_nodifier_dropdown_other" + id).multiselect("getChecked");
            var selected_auditor_list_prebill = new Array();
            //log(prebill_auditors); /*Use the Log statement when required*/
            for (var i = 0; i < prebill_auditors.length; i++) {
                //log($(prebill_auditors[i]).attr('value')); /*Use the Log statement when required*/
                selected_auditor_list_prebill.push($(prebill_auditors[i]).attr('value'));

            }
          
            if(selected_auditor_list_prebill.length == 0){
                grids.otherChargesGrid.$gridDiv.jqGrid('setCell', id, 'selectedModifierListOther', " ");
                var changingNewRowData = grids.otherChargesGrid.$gridDiv.jqGrid('getRowData', id);
                var hcpc = $(changingNewRowData.hcpcCode + " option:selected").val();
               // grids.otherChargesGrid.$gridDiv.jqGrid('setCell', id, 'price',globalvars.missingChargesRuleCodesPrice[hcpc]);

            }
            else{
                grids.otherChargesGrid.$gridDiv.jqGrid('setCell', id, 'selectedModifierListOther', selected_auditor_list_prebill.join());
                // if(globalvars.appModDataPrice[selected_auditor_list_prebill[0]] != undefined)
                //     grids.missingChargesGrid.$gridDiv.jqGrid('setCell', id, 'price',globalvars.appModDataPrice[selected_auditor_list_prebill[0]]);

            }


        },
        createModifierDropDown:function(param){
            var ModOptionData="";

            var hospitalIdValue = globalvars.selectedHospitalId;//globalvars.physicianHospitals[globalvars.selectedPreHospitalIndex].hospitalId;


            var searchQueryObject = {
                modifierType: "",
                modifierValue: "",
                descriptionType: "",
                descriptionValue: ""
                
            };

            var objectKeyMod = "missingData" + "_" + param.rowData.predKey + "_mod";
            var data  = globalvars.missingDropDownData[objectKeyMod];
            if(data){

            }else{

                //if(param.rowData.hcpcCode != ""){
                    getJSONModel({
                        async: false,
                        url: globalvars.root.uriModifier,
                        type: 'GET',
                        data: searchQueryObject,
                        traditional: true,
                        dataType: 'json',
                        targetVar: "missingModifierData"

                    });

                    //globalvars.missingModifierData = [{"hcpcCode":"74020","revenueCode":null,"price":100.00,"modifier":"","description":"PR X-RAY ABDOMEN 2 VW","modDesc":null},{"hcpcCode":"74020","revenueCode":null,"price":200.00,"modifier":"26","description":"PR X-RAY ABDOMEN 2 VW","modDesc":"Professional component"},{"hcpcCode":"74020","revenueCode":null,"price":300.00,"modifier":"TC","description":"PR X-RAY ABDOMEN 2 VW","modDesc":"Technical component only"}]

                    var modCollection=[];
                    $(globalvars.missingModifierData).each(function (i) {
                        modCollection.push(globalvars.missingModifierData[i].modifier)
                        globalvars.appModData[globalvars.missingModifierData[i].modifier] = globalvars.missingModifierData[i].description;
                        //globalvars.appModDataPrice[globalvars.missingModifierData[i].modifier] = globalvars.missingModifierData[i].price
                    })

                    globalvars.missingDropDownData[objectKeyMod] = modCollection;
                    data = globalvars.missingDropDownData[objectKeyMod];
                //}

                
            }

            if(data){
                $(data).each(function (i) {
                    if(data[i] != "")
                        ModOptionData += "<option value='" + data[i]+ "' title='" + globalvars.appModData[data[i]]+ "'>" + data[i] + "</option>"

                })

                //if(ModOptionData != "")
                    //ModOptionData += "<option value='addMore'>Add More...</option>"
            }

            // if(ModOptionData == "")
            //     return "";

            var preBillAuditorDropDown = new String();
            preBillAuditorDropDown = "<div><select class='missingMultiselect' id='missing_nodifier_dropdown_other" + param.rowId + "' multiple='multiple' onchange='grids.otherChargesGrid.selectModifierChange(this," + param.rowId + ")' style=width:60px>";
            preBillAuditorDropDown += ModOptionData;
            preBillAuditorDropDown += "</select></div>";


            return preBillAuditorDropDown;



        },
        fillGrid: function(data) {
            var searchDiv = '<div class="other_discover_search_wrapper"><img class="search_cell_del" src="common/images/account-details/delete-icon.png"><img class="search_cell_search" src="common/images/account-details/search-icon.png"></div>';
            this.$gridDiv.clearGridData();
            var datalength = data.length;
            for (var i = 0; i < datalength; i++) {
                data[i].id = i;
                data[i].selectedModifierListOther = data[i].modifier;
                data[i].price_modified = data[i].price;
                if(data[i].price && data[i].price>0){
                    data[i].price = data[i].price.toString().replace(/(.*?)(\.\d)\d$/,"$1$2");
                    data[i].price *= 1; 
                }
                this.$gridDiv.jqGrid('addRowData', i + 1, data[i]);
                if(data[i].rowEditable)
                    this.$gridDiv.jqGrid('setCell', i + 1, 'search', searchDiv, '');
            }
            ;
            this.$gridDiv.setGridParam({rowNum: datalength}).trigger("reloadGrid");
            this.$gridDiv.on('mouseover','.grid_cell_style_modifier_tooltip', function(){
            	var titletext = $(this).find("button.ui-multiselect span:eq(1)").html();
            	titletext = titletext.replace(/<br>/g," / ");
            	$(this).prop("title",titletext);
            })
        },
        bindDeptCodeChange: function(param) {
            var hospitalValue;
            if(this.billType == 'PRE')
              hospitalValue = globalvars.preHospitals[globalvars.selectedPreHospitalIndex].hospitalId
           else if(this.billType == 'POST')
              hospitalValue = globalvars.postHospitals[globalvars.selectedPostHospitalIndex].hospitalId
           else if(this.billType == 'EDIT')
              hospitalValue = globalvars.cciHospitals[globalvars.selectedCciHospitalIndex].hospitalId
            
            var hospitalIdValue = hospitalValue;

            $('#' + param.id + '_' + 'chargeCode').blur(function() {

                var deptValue = $('#' + param.id + '_' + 'dept').val();
                var chargeValue = $('#' + param.id + '_' + 'chargeCode').val();
                var hcpcValue = $('#' + param.id + '_' + 'hcpcCode').val();
                if(deptValue!="" && chargeValue!=""){
                    var priceKey = deptValue+"_"+ "_" + chargeValue + "_"+ param.id + "_" + hcpcValue;
                    if(priceKey == globalvars.priceKey)
                        return;

                    globalvars.priceKey =priceKey; 
                    $.ajax({
                        type: 'GET',
                        url: globalvars.charges.getCdmPriceUri + "?hospitalIdValue=" + hospitalIdValue + "&deptValue=" + deptValue + "&chargeValue=" + chargeValue + "&hcpcValue=" + hcpcValue,
                        contentType: 'application/json',
                        error: function(jqxhr) {
                            if(jqxhr.status==204){
                                grids.otherChargesGrid.$gridDiv.jqGrid('setCell', param.id, 'price',null);
                            }
                        },
                        success: function(str, textStatus, jqxhr) {
                            if(jqxhr.status=='200'){
                                if(str.cdmPrices != null && str.hcpcPrices !=null){
                                    grids.otherChargesGrid.$gridDiv.jqGrid('setCell', param.id, 'price', str.cdmPrices);
                                }else if(str.cdmPrices != null && str.hcpcPrices ==null){
                                    grids.otherChargesGrid.$gridDiv.jqGrid('setCell', param.id, 'price', str.cdmPrices);
                                    if(str.isHcpcMapped == false && hcpcValue != "")
                                        dialogs.messageDialog.show({ title: 'Other Discovered Charges Grid', text: deptValue+":" + chargeValue + " is not mapped to " + hcpcValue });
                                }
                                else if(str.cdmPrices == null && str.hcpcPrices != null ){
                                    grids.otherChargesGrid.$gridDiv.jqGrid('setCell', param.id, 'price', str.hcpcPrices);
                                    dialogs.messageDialog.show({ title:'Other Discovered Charges Grid' , text: deptValue+":" + chargeValue + " is not present in Charge Master" });
                                }else if(str.cdmPrices == null && str.hcpcPrices == null ){
                                    grids.otherChargesGrid.$gridDiv.jqGrid('setCell', param.id, 'price', '0.0');
                                    dialogs.messageDialog.show({ title:'Other Discovered Charges Grid' , text: deptValue+":" + chargeValue + " is not present in Charge Master" });
                                }
                            }else{
                              grids.otherChargesGrid.$gridDiv.jqGrid('setCell', param.id, 'price',null);
                            }
                        }
                    });
               }else{
                   grids.otherChargesGrid.$gridDiv.jqGrid('setCell', param.id, 'price',null);
               }
              });

           
              $('#' + param.id + '_' + 'dept').on('blur',function() {
                var deptValue = $('#' + param.id + '_' + 'dept').val();
                var chargeValue = $('#' + param.id + '_' + 'chargeCode').val();
                var hcpcValue = $('#' + param.id + '_' + 'hcpcCode').val();
                if(deptValue!="" && chargeValue!=""){

                    var priceKey = deptValue+"_"+ "_" + chargeValue + "_"+ param.id + "_" + hcpcValue;
                    if(priceKey == globalvars.priceKey)
                        return;

                    globalvars.priceKey =priceKey; 

                    $.ajax({
                        type: 'GET',
                        url: globalvars.charges.getCdmPriceUri + "?hospitalIdValue=" + hospitalIdValue + "&deptValue=" + deptValue + "&chargeValue=" + chargeValue + "&hcpcValue=" + hcpcValue,
                        contentType: 'application/json',
                        error: function(jqxhr) {
                            if(jqxhr.status==204){
                                grids.otherChargesGrid.$gridDiv.jqGrid('setCell', param.id, 'price',null);
                            }
                        },
                        success: function(str, textStatus, jqxhr) {
                               if(jqxhr.status=='200'){
                                if(str.cdmPrices != null && str.hcpcPrices !=null){
                                    grids.otherChargesGrid.$gridDiv.jqGrid('setCell', param.id, 'price', str.cdmPrices);
                                    if(str.isHcpcMapped == false)
                                        dialogs.messageDialog.show({ title: 'Other Discovered Charges Grid', text: deptValue+":" + chargeValue + "is not mapped to " + hcpcValue });

                                }else if(str.cdmPrices != null && str.hcpcPrices ==null){

                                    grids.otherChargesGrid.$gridDiv.jqGrid('setCell', param.id, 'price', str.cdmPrices);
                                    if(str.isHcpcMapped == false && hcpcValue != "")
                                        dialogs.messageDialog.show({ title: 'Other Discovered Charges Grid', text: deptValue+":" + chargeValue + "is not mapped to " + hcpcValue });
                                }
                                else if(str.cdmPrices == null && str.hcpcPrices != null ){
                                    grids.otherChargesGrid.$gridDiv.jqGrid('setCell', param.id, 'price', str.hcpcPrices);
                                    dialogs.messageDialog.show({ title:'Other Discovered Charges Grid' , text: deptValue+":" + chargeValue + " is not present in Charge Master" });
                                }else if(str.cdmPrices == null && str.hcpcPrices == null ){
                                    grids.otherChargesGrid.$gridDiv.jqGrid('setCell', param.id, 'price', '0.0');
                                    dialogs.messageDialog.show({ title:'Other Discovered Charges Grid' , text: deptValue+":" + chargeValue + " is not present in Charge Master" });
                                }
                            }else{
                              grids.otherChargesGrid.$gridDiv.jqGrid('setCell', param.id, 'price', null);
                            }
                        }
                        
                    });
               }else{
                   grids.otherChargesGrid.$gridDiv.jqGrid('setCell', param.id, 'price', null);
               }
              });
        }
    },
  associationRulesGrid: {
        $gridDiv: {},
        selectedRow: undefined,
        savedSuccessfully: true,
        isEditable: true,
        billType: "",
        isConfirmCharg:false,
        backScreen:"",
        initialize: function(param) {
            grids.associationRulesGrid.isConfirmCharg = param.isConfirmCharg;
            this.$gridDiv = $(param.gridDiv);
            this.isEditable = param.isEditable === false ? false : true;
            this.backScreen = param.backScreen;
            this.loadGrid(param.$gridDiv);
            if(param.data)
                this.fillGrid(param.data);
            this.billType = param.screenName;
        },
        loadGrid: function(param) { // param object holds gridDiv, data
            this.selectedRow = undefined;
            this.savedSuccessfully = true;

            this.$gridDiv.jqGrid({
                datatype: "local",
                autowidth: true,
                height:  (grids.associationRulesGrid.isConfirmCharg)?'120':'200',
                gridview: true,
                viewrecords: true,
                sortname: 'hcpcCode',
                sortorder: 'asc',
                altRows: true,
                altclass: 'alternate_row_color',
                colNames: ['id', ' ', globalvars.localResourceMap.associated_rule_existing_code, globalvars.localResourceMap.associated_rule_associated_code,' ', ' ', ' ', ' ', globalvars.localResourceMap.other_discoved_charge_hcpc_code,
                    globalvars.localResourceMap.other_discoved_charge_dept_code, globalvars.localResourceMap.other_discoved_charge_charge_code,
                    globalvars.localResourceMap.other_discoved_charge_price, globalvars.localResourceMap.other_discoved_charge_add_qty, globalvars.localResourceMap.other_charge_date_of_service,
                    globalvars.localResourceMap.missing_charge_charge_description, globalvars.localResourceMap.missing_charge_response, globalvars.localResourceMap.missing_charge_response_code,
                    globalvars.localResourceMap.other_discoved_charge_comment,'','','','',''
                    ],
                colModel: [
                    {name: 'id', index: 'id', key: true, hidden: true},
                    {name: 'search', index: 'search', width: 30, fixed: true,align: "left"},
                    {name: 'sourceCode', index: 'sourceCode', width: 120, fixed: true,align: "center"},
                    {name: 'targetCode', index: 'targetCode', width: 120, fixed: true,align: "center"},
                    {name: 'predCode', index:'predCode', hidden: true},
                    {name: 'sourceCodeType', index: 'sourceCodeType',hidden: true},
                    {name: 'targetCodeType', index: 'targetCodeType',hidden: true},
                    {name: 'revCode', index: 'revCode',hidden: true},
                    {
                        name: 'hcpcCode', index: 'hcpcCode', editable: false, hidden: true, fixed: true, sortable: true, align: "center", sorttype: "string",
                        editoptions: {
                            size: "5",
                            maxlength: "5"
                        }
                    },
                    {
                        name: 'dept', index: 'dept', editable: false, width: 100, fixed: true, sorttype: "int", align: "center",
                        editoptions: {
                            size: "3",
                            maxlength: "3"
                        },
                        editrules: {
                            custom: true,
                            custom_func: function(value, colname) {
                                var selectedRowData = grids.associationRulesGrid.$gridDiv.jqGrid('getRowData', grids.associationRulesGrid.selectedRow);
                                if (value != undefined) {
                                    if (!(/^[a-z0-9]+$/i.test(value)) || value.length !== 3) {
                                        return [false, globalvars.localResourceMap.other_discoverd_validation_msg4];
                                    } else {
                                        return [true, ""];
                                    }
                                }
                                else
                                    return [true, ""];
                            }
                        }
                    },
                    {
                        name: 'chargeCode', index: 'chargeCode', editable: false, width: 100, fixed: true, sortable: true, align: "center", sorttype: "int",
                        editoptions: {
                            size: "5",
                            maxlength: "5"
                        },
                        editrules: {
                            custom: true,
                            custom_func: function(value, colname) {
                                var selectedRowData = grids.associationRulesGrid.$gridDiv.jqGrid('getRowData', grids.associationRulesGrid.selectedRow);
                                if (value != undefined) {
                                    if (!(/^[a-z0-9]+$/i.test(value)) || value.length !== 5) {
                                        return [false, globalvars.localResourceMap.other_discoverd_validation_msg3];
                                    } else {
                                        return [true, ""];
                                    }
                                }
                                else
                                    return [true, ""];
                            }
                        }
                    },
                    {name: 'price', index: 'price', width: 100, fixed: true, sortable: true, sorttype: "int", align: "center"},
                    {
                        name: 'qty', index: 'qty', width: 100, fixed: true, sortable: true, sorttype: "int", editable: this.isEditable, align: "center",
                        edittype: "text",
                        editoptions: {
                            size: "3",
                            maxlength: "3",
                            minValue: 1
                        }, editrules: {
                            custom: true,
                            custom_func: function(value, colname) {

                                var selectedRowData = grids.associationRulesGrid.$gridDiv.jqGrid('getRowData', grids.associationRulesGrid.selectedRow);
                                var currentResponseValue = $("#responseSelectRules" + grids.associationRulesGrid.selectedRow + " option:selected").val();

                                var currentDeptValue = $("#deptSelect" + grids.associationRulesGrid.selectedRow + " option:selected").val();
                                var currentChargeCodeValue = $("#chargeCodeSelect" + grids.associationRulesGrid.selectedRow + " option:selected").val();

                                if (!(/^-?\d+$/.test(value)) || isNaN(value)) {
                                    return [false, globalvars.localResourceMap.missing_charge_validation_msg];
                                } else /*if (currentChargeCodeValue == "") {
                                 return [false, globalvars.localResourceMap.missing_charge_validation_msg4];
                                 } else*/ {
                                    if (value > 0 && currentResponseValue != "Y") {
                                        return [false, globalvars.localResourceMap.missing_charge_validation_msg3];
                                    } else if (value < 1 && currentResponseValue == "Y") {
                                        return [false, globalvars.localResourceMap.missing_charge_validation_msg2];
                                    }
                                    else {
                                        return [true, ""];
                                    }
                                    ;
                                }
                            }
                        }
                    },
                    {name: 'dateOfServiceAssocRule', index: 'dateOfServiceAssocRule', width: 100, fixed: true, sortable: true, sorttype: "date", datefmt: "Y-m-d h:i:s", editable: this.isEditable, align: "center",
                        editoptions:{
                                            readonly: 'readonly'
                                 }},
                 {name: 'chargeDescription', index: 'chargeDescription', hidden:true},
                 {name: 'response', index: 'response', fixed: true, width: 130, classes: 'grid_cell_style'},
                 {name: 'responseCode', hidden: true},
                 {name: 'comments', index: 'comments', editable: this.isEditable, width: 190, fixed: true,  editoptions: {size: "23", maxlength: "150"}, classes: 'grid_cell_style'},
                 {name: 'isNew', hidden: true},
                 {name: 'predKey', index: 'predKey',hidden:true},
                {name: 'rowEditable', index: 'rowEditable',hidden:true},
                {name: 'cenAuditorId', index: 'cenAuditorId',hidden:true},
                {name: 'cenAuditingTime', index: 'cenAuditingTime',hidden:true},

                ],

                onSelectRow: function(id) {

                    var rowData = grids.associationRulesGrid.$gridDiv.jqGrid('getRowData', id);

                    if(rowData.rowEditable == false || rowData.rowEditable == "false"){
                        return;
                    }


                    if (grids.associationRulesGrid.selectedRow !== undefined) {

                         grids.associationRulesGrid.$gridDiv.jqGrid('saveRow', grids.associationRulesGrid.selectedRow);

                     }
                     ;
                     if (grids.associationRulesGrid.savedSuccessfully == true && grids.associationRulesGrid.isEditable == true) {
                         grids.associationRulesGrid.selectedRow = id;

                         var selectedRowData = grids.associationRulesGrid.$gridDiv.jqGrid('getRowData', id);
                         var newRowData = grids.associationRulesGrid.$gridDiv.jqGrid('getRowData', id);

                         newRowData.response = grids.associationRulesGrid.createResponseDropdown({
                             rowData: selectedRowData,
                             rowId: id,
                             billType: grids.associationRulesGrid.screenName

                         });

                        grids.associationRulesGrid.$gridDiv.jqGrid('setRowData', id, newRowData);

                        grids.associationRulesGrid.$gridDiv.jqGrid('editRow', id, true,false, false, false, false, false,false, afterrestorefunc);

                        if(grids.associationRulesGrid.backScreen == "preBill" || grids.associationRulesGrid.backScreen == "postBill")
                            $('#' + id + '_' + 'dateOfServiceAssocRule').datepicker({dateFormat: 'yy-mm-dd',defaultDate:screens.accountDetails.admitDate});//,minDate:screens.accountDetails.admitDate,maxDate:screens.accountDetails.dischargeDate});
                        else if(grids.associationRulesGrid.backScreen == "associationRules")
                            $('#' + id + '_' + 'dateOfServiceAssocRule').datepicker({dateFormat: 'yy-mm-dd',defaultDate:screens.rulesAccountDetails.admitDate});//,minDate:screens.rulesAccountDetails.admitDate,maxDate:screens.rulesAccountDetails.dischargeDate});
                        else if(grids.associationRulesGrid.backScreen == "editCharges")
                            $('#' + id + '_' + 'dateOfServiceAssocRule').datepicker({dateFormat: 'yy-mm-dd',defaultDate:screens.submittedAccountDetails.admitDate});//,minDate:screens.submittedAccountDetails.admitDate,maxDate:screens.submittedAccountDetails.dischargeDate});
                        else if(grids.associationRulesGrid.backScreen == "cciEdits")
                            $('#' + id + '_' + 'dateOfServiceAssocRule').datepicker({dateFormat: 'yy-mm-dd',defaultDate:screens.cciEditsAccountDetails.admitDate});//,minDate:screens.submittedAccountDetails.admitDate,maxDate:screens.submittedAccountDetails.dischargeDate});
                        
                        grids.associationRulesGrid.savedSuccessfully = false;



                     }

                     function afterrestorefunc(e){
                        grids.associationRulesGrid.savedSuccessfully = true;
                    }


                },
                editurl: 'clientArray',
                loadComplete: function() {
                    
                    // $(("#account_details_associate_rules_grid_table tr")).removeClass('highlighted_row');
                    //  grids.associationRulesGrid.$gridDiv.trigger("reloadGrid");

                    // var gridRowData = grids.associationRulesGrid.$gridDiv.jqGrid('getRowData');
                    // var gridRowDataLength = gridRowData.length;

                    // grids.associationRulesGrid.$gridDiv.clearGridData();
                    
                    //  var datalength = gridRowData.length;
                    //  for (var i = 0; i < datalength; i++) {
                    //      grids.associationRulesGrid.$gridDiv.jqGrid('addRowData', i + 1, gridRowData[i]);
                    //  }
                     
                    //  grids.associationRulesGrid.$gridDiv.setGridParam({rowNum: datalength}).trigger("reloadGrid");

                    // for (var i = 0; i < gridRowDataLength; i++) {
                    //     if (gridRowData[i].isNew == "false") {
                    //         log("isHighlighted " + gridRowData[i].isNew + " : " + (i + 1));
                    //         $(("#account_details_associate_rules_grid_table tr#" + (i + 1))).addClass("highlighted_row");
                    //     }
                    //     ;
                    // }

                    $(("#account_details_associate_rules_grid_table tr")).removeClass('highlighted_row');
                     
                      var gridRowData = grids.associationRulesGrid.$gridDiv.jqGrid('getRowData');
                      var gridRowDataLength = gridRowData.length;

                     // console.log(gridRowData);

                     
                      for (var i = 0; i < gridRowDataLength; i++) {
                          if (gridRowData[i].rowEditable == "false" || gridRowData[i].rowEditable == false) {
                        //      log("isHighlighted " + gridRowData[i].isNew + " : " + (i + 1));
                              var searchId = gridRowData[i].id;
                                    $(("#account_details_associate_rules_grid_table tr#" + (searchId))).addClass("highlighted_row");
                          }
                      }


                      $("#account_details_associate_rules_grid_table tbody tr").find("td:eq(20)").each(function(){
                            //console.log($(this).text());

                            if($(this).text() == "false" || $(this).text() == false){

                                $(this).parent().tooltip({
                                content: function(response) {
                                    //console.log(this.parentNode)
                                    if(this.parentNode){
                                        var rowData = grids.associationRulesGrid.$gridDiv.jqGrid('getRowData',this.parentNode.id);
                                        return '<b>Assigned to: </b>' + rowData.cenAuditorId+"<br/><b>Submitted on: </b>" + rowData.cenAuditingTime;
                                    }
                                },
                                open: function() {
                                    $(this).tooltip("widget").stop(false, true).hide().slideDown("fast");
                                },
                                close: function() {
                                    $(this).tooltip("widget").stop(false, true).show().slideUp("fast");
                                }
                            }).tooltip("widget").addClass("ui-state-highlight");
                        }
                    })



                      grids.associationRulesGrid.$gridDiv.setGridParam({rowNum: gridRowDataLength}).trigger("reloadGrid");
                    //grids.associationRulesGrid.$gridDiv.jqGrid('setLabel', 'comments', '', {'text-align': 'left', 'padding-left': '16px', 'width': '236px'});

                }


            });

            this.$gridDiv.unbind("jqGridInlineAfterSaveRow");
            this.$gridDiv.bind("jqGridInlineAfterSaveRow", function(rowid) {
                var selectedRowData = grids.associationRulesGrid.$gridDiv.jqGrid('getRowData', grids.associationRulesGrid.selectedRow);
                selectedRowData.responseCode = $("#responseSelectRules" + grids.associationRulesGrid.selectedRow + " option:selected").val();
                selectedRowData.response = $("#responseSelectRules" + grids.associationRulesGrid.selectedRow + " option:selected").text();
                grids.associationRulesGrid.$gridDiv.jqGrid('setRowData', grids.associationRulesGrid.selectedRow, selectedRowData);

                grids.associationRulesGrid.savedSuccessfully = true;
            });

            this.$gridDiv.bind("jqGridSortCol", function(rowid) {
                log("jqGridSortCol");
            });
        },
        fillGrid: function(data) {
            var searchDiv = '<div><img class="searchAssociateCodeImage" src="common/images/account-details/search-icon.png" title="Search Associated code"></div>';
            this.$gridDiv.clearGridData();
            var datalength = data.length;
            for (var i = 0; i < datalength; i++) {
                data[i].id = i;
                this.$gridDiv.jqGrid('addRowData', i + 1, data[i]);
                if(data[i].rowEditable)
                    this.$gridDiv.jqGrid('setCell', i + 1, 'search', searchDiv, '');
            }
            ;
            this.$gridDiv.setGridParam({rowNum: datalength}).trigger("reloadGrid");
        },

        createResponseDropdown: function(param) {

            var response=[];
            if(param.billType != "POST"){
                var datalength = globalvars.responses.length;
                for (var i = 0; i < datalength;i++) {
                    if( globalvars.responses[i].value != "LPPB" && globalvars.responses[i].value != "ZNI")
                        response.push(globalvars.responses[i]);
                }

            }else{
                response = globalvars.responses;
            }

            var responseDropdown = createSelectBox({
                index: param.rowId,
                selectDivId: "responseSelectRules",
                values: response,
                currentValue: param.rowData.responseCode,
                valueKey: "value",
                textKey: "description",
                addEmptyItem: true
            });

            return responseDropdown;
        }
    },
    cciEditsGrid: {
        $gridDiv: {},
        selectedRow: undefined,
        savedSuccessfully: true,
        isEditable: true,
        billType: "",
        modEdit:false,
        backScreen:"",
        initialize: function(param) {
            this.$gridDiv = $(param.gridDiv);
            this.isEditable = param.isEditable === false ? false : true;
            this.backScreen = param.backScreen;
            this.loadGrid(param.$gridDiv);
            if(param.data)
                this.fillGrid(param.data);
            this.billType = param.screenName;
        },
        loadGrid: function(param) { // param object holds gridDiv, data
            this.selectedRow = undefined;
            this.savedSuccessfully = true;

            this.$gridDiv.jqGrid({
                datatype: "local",
                autowidth: true,
                height: '200',
                gridview: true,
                viewrecords: true,
                sortname: 'hcpcCode',
                sortorder: 'asc',
                altRows: true,
                altclass: 'alternate_row_color',
                colNames: ['id', ' ', 'Edit Type','HCPC A', 'HCPC B','Dept Code','Service Code','Add Qty','Date of Service','Edit Description','Response', '','Mod A','Mod B','Comments','','','',''],
                colModel: [
                    {name: 'id', index: 'id', key: true, hidden: true},
                    {name: 'search', index: 'search', width:18, fixed: true,align: "left"},
                    {name: 'editType', index: 'editType', width: 100, fixed: true,align: "center"},
                    {name: 'hcpcCodea', index: 'hcpcCodea', width: 100, fixed: true,align: "center"},
                    {name: 'hcpcCodeb', index:'hcpcCodeb', width: 100,fixed: true,align: "center"},
                        
                    {
                        name: 'deptCode', index: 'deptCode', editable: false, width: 60, fixed: true, sorttype: "int", align: "center",hidden: true,
                        editoptions: {
                            //size: "3",
                            //maxlength: "3"
                        },
                        editrules: {
                            custom: true,
                            custom_func: function(value, colname) {
                                var selectedRowData = grids.cciEditsGrid.$gridDiv.jqGrid('getRowData', grids.cciEditsGrid.selectedRow);
                                if (value != undefined) {
                                    if (!(/^[a-z0-9]+$/i.test(value))) {
                                        return [false, globalvars.localResourceMap.other_discoverd_validation_msg4];
                                    } else {
                                        return [true, ""];
                                    }
                                }
                                else
                                    return [true, ""];
                            }
                        }
                    },
                    {
                        name: 'chargeCode', index: 'chargeCode', editable: false, width: 60, fixed: true, sortable: true, align: "center", sorttype: "int",hidden: true,
                        editoptions: {
                            //size: "5",
                            //maxlength: "5"
                        },
                        editrules: {
                            custom: true,
                            custom_func: function(value, colname) {
                                var selectedRowData = grids.cciEditsGrid.$gridDiv.jqGrid('getRowData', grids.cciEditsGrid.selectedRow);
                                if (value != undefined) {
                                    if (!(/^[a-z0-9]+$/i.test(value))) {
                                        return [false, globalvars.localResourceMap.other_discoverd_validation_msg3];
                                    } else {
                                        return [true, ""];
                                    }
                                }
                                else
                                    return [true, ""];
                            }
                        }
                    },
                   
                    {
                        name: 'qty', index: 'qty', width: 40, fixed: true, sortable: true, sorttype: "int", editable: this.isEditable, align: "center",hidden: true,
                        edittype: "text",
                        editoptions: {
                            size: "3",
                            maxlength: "3",
                            minValue: 1
                        }, editrules: {
                            //custom: true,
                            //custom_func: function(value, colname) {

//                                var selectedRowData = grids.cciEditsGrid.$gridDiv.jqGrid('getRowData', grids.cciEditsGrid.selectedRow);
//                                var currentResponseValue = $("#responseSelectEdit" + grids.cciEditsGrid.selectedRow + " option:selected").val();
//                                
//                                
//                                if (!(/^-?\d+$/.test(value)) || isNaN(value)) {
//                                    return [false, globalvars.localResourceMap.missing_charge_validation_msg];
//                                } else /*if (currentChargeCodeValue == "") {
//                                 return [false, globalvars.localResourceMap.missing_charge_validation_msg4];
//                                 } else*/ {
//                                    if (value >= 0 && currentResponseValue == "CQ" && selectedRowData.editType == 'MUE') {
//                                        return [false, 'User only enter negative quantity if Response is Change Quantity'];
//                                    } 
//                                    else {
//                                        return [true, ""];
//                                    }
//                                    ;
//                                }
                            }
                        //}
                    },
                    {name: 'dateOfServiceCoding', index: 'dateOfServiceCoding', width: 120, fixed: true, sortable: true, sorttype: "date", datefmt: "Y-m-d h:i:s", editable: false, align: "center",
                        editoptions:{
                                            readonly: 'readonly'
                                 }},
                 {name: 'chargeDescription', index: 'chargeDescription', width: 280, fixed: true,align: "center"},
                 {name: 'response', index: 'response', fixed: true, width: 130, classes: 'grid_cell_style'},
                 {name: 'responseCode', hidden: true},
                 {name: 'modA', index: 'modA', width: 40, fixed: true,editable:false,hidden: true},
                 {name: 'modB', index: 'modB', width: 40, fixed: true,editable:false,hidden: true},

                 {name: 'comments', index: 'comments', editable: this.isEditable, width: 280, fixed: true,  editoptions: {size: "30", maxlength: "220"}, classes: 'grid_cell_style'},
                 {name: 'editKey', index: 'editKey',hidden:true},
                 {name: 'rowEditable', index: 'rowEditable',hidden:true},
                 {name: 'cenAuditorId', index: 'cenAuditorId',hidden:true},
                 {name: 'cenAuditingTime', index: 'cenAuditingTime',hidden:true}
                 
                ],

                onSelectRow: function(id) {
                    var rowData = grids.cciEditsGrid.$gridDiv.jqGrid('getRowData', id);

                    if(rowData.rowEditable == false || rowData.rowEditable == "false"){
                        return;
                    }

                     if (grids.cciEditsGrid.selectedRow !== undefined) {
                        
                         grids.cciEditsGrid.$gridDiv.jqGrid('saveRow', grids.cciEditsGrid.selectedRow);
                         

                     }
                     ;
                     if (grids.cciEditsGrid.savedSuccessfully == true && grids.cciEditsGrid.isEditable == true) {
                         grids.cciEditsGrid.selectedRow = id;
                         
//                         var cm =  grids.cciEditsGrid.$gridDiv.jqGrid('getColProp','modA');
//                           var cm1 =  grids.cciEditsGrid.$gridDiv.jqGrid('getColProp','modB');
//                           cm.editable = false;
//                           cm1.editable = false;
                         var selectedRowData = grids.cciEditsGrid.$gridDiv.jqGrid('getRowData', id);
                         var newRowData = grids.cciEditsGrid.$gridDiv.jqGrid('getRowData', id);
                         
                         if(selectedRowData.editType != 'CODE_PAIR'){
                            grids.cciEditsGrid.$gridDiv.jqGrid('saveRow', grids.cciEditsGrid.selectedRow);
                            var cm =  grids.cciEditsGrid.$gridDiv.jqGrid('getColProp','modA');
                            var cm1 =  grids.cciEditsGrid.$gridDiv.jqGrid('getColProp','modB');
                            cm.editable = false;
                            cm1.editable = false;
                            var changingRowData = grids.cciEditsGrid.$gridDiv.jqGrid('getRowData',id);
                            changingRowData.modA='';
                            changingRowData.modB='';
                            grids.cciEditsGrid.$gridDiv.jqGrid('setRowData',id, changingRowData);
                         }
                         if(selectedRowData.editType == 'CODE_PAIR' && selectedRowData.response=='Add Modifiers'){
                            var cm =  grids.cciEditsGrid.$gridDiv.jqGrid('getColProp','modA');  
                            var cm1 =  grids.cciEditsGrid.$gridDiv.jqGrid('getColProp','modB');  
                            cm.editable = true
                            cm1.editable = true
                          }
                         newRowData.response = grids.cciEditsGrid.createResponseDropdown({
                             rowData: selectedRowData,
                             rowId: id
                         });
                         
                        grids.cciEditsGrid.$gridDiv.jqGrid('setRowData', id, newRowData);

                        grids.cciEditsGrid.$gridDiv.jqGrid('editRow', id, true,false, false, false, false, false,false, afterrestorefunc);

                        if(grids.cciEditsGrid.backScreen == "preBill" || grids.cciEditsGrid.backScreen == "postBill")
                            $('#' + id + '_' + 'dateOfServiceCoding').datepicker({dateFormat: 'yy-mm-dd',defaultDate:screens.accountDetails.admitDate});//,minDate:screens.accountDetails.admitDate,maxDate:screens.accountDetails.dischargeDate});
                        else if(grids.cciEditsGrid.backScreen == "associationRules")
                            $('#' + id + '_' + 'dateOfServiceCoding').datepicker({dateFormat: 'yy-mm-dd',defaultDate:screens.rulesAccountDetails.admitDate});//,minDate:screens.rulesAccountDetails.admitDate,maxDate:screens.rulesAccountDetails.dischargeDate});
                        else if(grids.cciEditsGrid.backScreen == "editCharges")
                            $('#' + id + '_' + 'dateOfServiceCoding').datepicker({dateFormat: 'yy-mm-dd',defaultDate:screens.submittedAccountDetails.admitDate});//,minDate:screens.submittedAccountDetails.admitDate,maxDate:screens.submittedAccountDetails.dischargeDate});
                        else if(grids.cciEditsGrid.backScreen == "cciEdits")
                            $('#' + id + '_' + 'dateOfServiceCoding').datepicker({dateFormat: 'yy-mm-dd',defaultDate:screens.cciEditsAccountDetails.admitDate});//,minDate:screens.submittedAccountDetails.admitDate,maxDate:screens.submittedAccountDetails.dischargeDate});
                        
                        if(selectedRowData.editType == 'CODE_PAIR' || selectedRowData.editType == 'ADD_ON')
                            grids.cciEditsGrid.bindResponseChange({id:id,editType:selectedRowData.editType});

                        grids.cciEditsGrid.savedSuccessfully = false;



                     }

                     function afterrestorefunc(e){
                        grids.cciEditsGrid.savedSuccessfully = true;
                    }


                },
                editurl: 'clientArray',
                loadComplete: function() {
                    // $(("#account_details_ncci_edit_grid_table tr")).removeClass('highlighted_row');
                    //  grids.cciEditsGrid.$gridDiv.trigger("reloadGrid");

                    // var gridRowData = grids.cciEditsGrid.$gridDiv.jqGrid('getRowData');
                    // var gridRowDataLength = gridRowData.length;


                    // grids.cciEditsGrid.$gridDiv.clearGridData();
                    
                    //  var datalength = gridRowData.length;
                    //  for (var i = 0; i < datalength; i++) {
                    //      grids.cciEditsGrid.$gridDiv.jqGrid('addRowData', i + 1, gridRowData[i]);
                    //  }
                     
                    //  grids.cciEditsGrid.$gridDiv.setGridParam({rowNum: datalength}).trigger("reloadGrid");

                    // for (var i = 0; i < gridRowDataLength; i++) {
                    //     if (gridRowData[i].isNew == "false") {
                    //         log("isHighlighted " + gridRowData[i].isNew + " : " + (i + 1));
                    //         $(("#account_details_ncci_edit_grid_table tr#" + (i + 1))).addClass("highlighted_row");
                    //     }
                    //     ;
                    // }


                    $(("#account_details_ncci_edit_grid_table tr")).removeClass('highlighted_row');
                     
                      var gridRowData = grids.cciEditsGrid.$gridDiv.jqGrid('getRowData');
                      var gridRowDataLength = gridRowData.length;

                    //  console.log(gridRowData);

                     
                      for (var i = 0; i < gridRowDataLength; i++) {
                          if (gridRowData[i].rowEditable == "false" || gridRowData[i].rowEditable == false) {
                         //     log("isHighlighted " + gridRowData[i].isNew + " : " + (i + 1));
                              var searchId = gridRowData[i].id;
                                    $(("#account_details_ncci_edit_grid_table tr#" + (searchId))).addClass("highlighted_row");
                          }
                      }

                    //   $("#account_details_ncci_edit_grid_table tbody tr").find("td:eq(16)").each(function(){
                    //         //console.log($(this).text());

                    //         if($(this).text() == "false" || $(this).text() == false){

                    //             $(this).parent().tooltip({
                    //             content: function(response) {
                    //                 //console.log(this.parentNode)
                    //                 if(this.parentNode){
                    //                     var rowData = grids.cciEditsGrid.$gridDiv.jqGrid('getRowData',this.parentNode.id);
                    //                     return '<b>Assigned to: </b>' + rowData.cenAuditorId+"<br/><b>Submitted on: </b>" + rowData.cenAuditingTime;
                    //                 }
                    //             },
                    //             open: function() {
                    //                 $(this).tooltip("widget").stop(false, true).hide().slideDown("fast");
                    //             },
                    //             close: function() {
                    //                 $(this).tooltip("widget").stop(false, true).show().slideUp("fast");
                    //             }
                    //         }).tooltip("widget").addClass("ui-state-highlight");
                    //     }
                    // })

                    grids.cciEditsGrid.$gridDiv.setGridParam({rowNum: gridRowDataLength}).trigger("reloadGrid");


                    // grids.cciEditsGrid.$gridDiv.jqGrid('setLabel', 'hcpcCodea', '', {'text-align': 'left', 'padding-left': '10'});
                    // grids.cciEditsGrid.$gridDiv.jqGrid('setLabel', 'hcpcCodeb', '', {'text-align': 'left', 'padding-left': '10'});
                    // grids.cciEditsGrid.$gridDiv.jqGrid('setLabel', 'dateOfServiceCoding', '', {'text-align': 'left', 'padding-left': '10'});
                    // grids.cciEditsGrid.$gridDiv.jqGrid('setLabel', 'chargeDescription', '', {'text-align': 'left', 'padding-left': '20', 'width': '150px'});
                    // grids.cciEditsGrid.$gridDiv.jqGrid('setLabel', 'comments', '', {'text-align': 'left', 'padding-left': '30', 'width': '210px'});

                }


            });

            this.$gridDiv.unbind("jqGridInlineAfterSaveRow");
            this.$gridDiv.bind("jqGridInlineAfterSaveRow", function(rowid) {
                var selectedRowData = grids.cciEditsGrid.$gridDiv.jqGrid('getRowData', grids.cciEditsGrid.selectedRow);
                selectedRowData.responseCode = $("#responseSelectEdit" + grids.cciEditsGrid.selectedRow + " option:selected").val();
                selectedRowData.response = $("#responseSelectEdit" + grids.cciEditsGrid.selectedRow + " option:selected").text();
                grids.cciEditsGrid.$gridDiv.jqGrid('setRowData', grids.cciEditsGrid.selectedRow, selectedRowData);
                
                

                grids.cciEditsGrid.savedSuccessfully = true;
            });

            this.$gridDiv.bind("jqGridSortCol", function(rowid) {
                log("jqGridSortCol");
            });
        },
        fillGrid: function(data) {
            var searchDivHidden = '<div><img class="searchcciEditsCodeImageHidden" style="margin-left: -8px;" src="common/images/account-details/search-icon.png" title="Search Add On code"></div>';
            var searchDiv = '<div><img class="searchcciEditsCodeImage" style="margin-left: -8px;" src="common/images/account-details/search-icon.png" title="Search Add On code"></div>';
            this.$gridDiv.clearGridData();
            var datalength = data.length;
            for (var i = 0; i < datalength; i++) {
                if(data[i].editType == 'ADD_ON' && (data[i].rowEditable == true || data[i].rowEditable == "true")){
                    data[i].id = i;
                    this.$gridDiv.jqGrid('addRowData', i + 1, data[i]);
                    if(data[i].response == 'Add Required Code')
                       this.$gridDiv.jqGrid('setCell', i + 1, 'search', searchDiv, '');
                    else
                    this.$gridDiv.jqGrid('setCell', i + 1, 'search', searchDivHidden, '');
                }
                else{
                     this.$gridDiv.jqGrid('addRowData', i + 1, data[i]);
                }
            }
            ;
            this.$gridDiv.setGridParam({rowNum: datalength}).trigger("reloadGrid");
        },
        bindResponseChange: function(param) {

            $(".responseSelectEdit").change(function() {
              grids.cciEditsGrid.$gridDiv.jqGrid('editRow', param.id, true);
              
            if($(this).val()=='AC' && param.editType=='ADD_ON'){
            $(this).parent().parent().find('img').removeClass('searchcciEditsCodeImageHidden');
            $(this).parent().parent().find('img').addClass('searchcciEditsCodeImage');

           }
            else if($(this).val()!='AC' && param.editType=='ADD_ON'){
            $(this).parent().parent().find('img').removeClass('searchcciEditsCodeImage');
            $(this).parent().parent().find('img').addClass('searchcciEditsCodeImageHidden');
           }
              

//                if($(this).val()=='AM' && param.editType=='CODE_PAIR'){
//                    grids.cciEditsGrid.$gridDiv.jqGrid('saveRow', param.id);
//                    if (grids.cciEditsGrid.savedSuccessfully) {
//                        log("changing!! succes save");
//
//                        var changingRowData = grids.cciEditsGrid.$gridDiv.jqGrid('getRowData', param.id);
//                        var changingNewRowData = grids.cciEditsGrid.$gridDiv.jqGrid('getRowData', param.id);
//                        log(changingRowData);
//
//                        changingNewRowData.response = grids.cciEditsGrid.createResponseDropdown({
//                            rowData: changingRowData,
//                            rowId: param.id
//                        });
//
//                        grids.cciEditsGrid.$gridDiv.jqGrid('setRowData', param.id, changingNewRowData);
//                        var cm =  grids.cciEditsGrid.$gridDiv.jqGrid('getColProp','modA');  
//                      var cm1 =  grids.cciEditsGrid.$gridDiv.jqGrid('getColProp','modB');  
//                      cm.editable = true
//                      cm1.editable = true//
//                        grids.cciEditsGrid.$gridDiv.jqGrid('editRow', param.id, true);
//                        
//                        if(grids.cciEditsGrid.backScreen == "preBill" || grids.cciEditsGrid.backScreen == "postBill")
//                          $('#' + param.id + '_' + 'dateOfServiceCoding').datepicker({dateFormat: 'yy-mm-dd',defaultDate:screens.accountDetails.admitDate});//,minDate:screens.accountDetails.admitDate,maxDate:screens.accountDetails.dischargeDate});
//                        else if(grids.cciEditsGrid.backScreen == "associationRules")
//                          $('#' + param.id + '_' + 'dateOfServiceCoding').datepicker({dateFormat: 'yy-mm-dd',defaultDate:screens.rulesAccountDetails.admitDate});//,minDate:screens.rulesAccountDetails.admitDate,maxDate:screens.rulesAccountDetails.dischargeDate});
//                        else if(grids.cciEditsGrid.backScreen == "editCharges")
//                          $('#' + param.id + '_' + 'dateOfServiceCoding').datepicker({dateFormat: 'yy-mm-dd',defaultDate:screens.submittedAccountDetails.admitDate});//,minDate:screens.submittedAccountDetails.admitDate,maxDate:screens.submittedAccountDetails.dischargeDate});
//                        else if(grids.cciEditsGrid.backScreen == "cciEdits")
//                          $('#' + param.id + '_' + 'dateOfServiceCoding').datepicker({dateFormat: 'yy-mm-dd',defaultDate:screens.cciEditsAccountDetails.admitDate});//,minDate:screens.submittedAccountDetails.admitDate,maxDate:screens.submittedAccountDetails.dischargeDate});
//                        grids.cciEditsGrid.bindResponseChange({id: param.id,editType:changingRowData.editType});
//                        grids.cciEditsGrid.savedSuccessfully = false;
//                    }
//                  
//
//                }else if($(this).val()!='AM' && param.editType=='CODE_PAIR'){
//                  grids.cciEditsGrid.$gridDiv.jqGrid('saveRow', grids.cciEditsGrid.selectedRow);
//                  var cm =  grids.cciEditsGrid.$gridDiv.jqGrid('getColProp','modA');
//                  var cm1 =  grids.cciEditsGrid.$gridDiv.jqGrid('getColProp','modB');
//                  cm.editable = false;
//                  cm1.editable = false;
//                  var changingRowData = grids.cciEditsGrid.$gridDiv.jqGrid('getRowData', param.id);
//                  changingRowData.modA='';
//                  changingRowData.modB='';
//                  grids.cciEditsGrid.$gridDiv.jqGrid('setRowData', param.id, changingRowData);
//                  
//                }
//                else if($(this).val()=='AC' && param.editType=='ADD_ON'){
//                  $(this).parent().parent().find('img').removeClass('searchcciEditsCodeImageHidden');
//                  $(this).parent().parent().find('img').addClass('searchcciEditsCodeImage');
//
//                }
//                else if($(this).val()!='AC' && param.editType=='ADD_ON'){
//                  $(this).parent().parent().find('img').removeClass('searchcciEditsCodeImage');
//                  $(this).parent().parent().find('img').addClass('searchcciEditsCodeImageHidden');
//                }
//                else{
//                  var cm =  grids.cciEditsGrid.$gridDiv.jqGrid('getColProp','modA');
//                  var cm1 =  grids.cciEditsGrid.$gridDiv.jqGrid('getColProp','modB');
//                  cm.editable = false;
//                  cm1.editable = false;
//                  grids.cciEditsGrid.$gridDiv.jqGrid('saveRow', grids.cciEditsGrid.selectedRow);
//                }
//                ;
            });
        },
        createResponseDropdown: function(param) {
            var dpValue;
            if(param.rowData.editType == 'ADD_ON')
                dpValue = globalvars.responsesAddOn;
            else if(param.rowData.editType == 'CODE_PAIR')
                dpValue = globalvars.responsesCodePair;
            else if(param.rowData.editType == 'MUE')
                dpValue = globalvars.responsesMue;
            
            var responseDropdown = createSelectBox({
                index: param.rowId,
                selectDivId: "responseSelectEdit",
                values: dpValue,
                currentValue: param.rowData.responseCode,
                valueKey: "value",
                textKey: "description",
                addEmptyItem: true
            });

            return responseDropdown;
        }
    },
    loadAssociateRulesSearchFormGrid: {
        $gridDiv:{},
        loadGrid: function(param) {
        this.$gridDiv = $(param.gridDiv);
        this.$gridDiv.jqGrid({
            datatype: "local",
            width: '740',
            height: '200',
            gridview: true,
            viewrecords: true,
            sortorder: 'asc',
            altRows: true,
            altclass: 'alternate_row_color',
            colNames: [globalvars.localResourceMap.other_discoved_search_dept_code, 'Dept Description', globalvars.localResourceMap.other_discoved_search_charge_code,
                globalvars.localResourceMap.other_discoved_search_charge_desp, globalvars.localResourceMap.other_discoved_search_hcpc,
                globalvars.localResourceMap.other_discoved_search_rev_code, globalvars.localResourceMap.other_discoved_charge_price,'#count','','targetCode','targetCodeType'],
            colModel: [
                {name: 'dept', index: 'dept', width: 70, sortable: true, sorttype: 'int', fixed: true, align: 'center'},
                {name: 'deptDesc', index: 'deptDesc', width: 100, sortable: true, sorttype: 'int', fixed: true, align: 'center'},
                {name: 'chargeCode', index: 'chargeCode', width: 80, sortable: true, sorttype: 'int', fixed: true, align: 'center'},
                {name: 'chargeDesc', index: 'chargeDesc', width: 130, sortable: true, sorttype: 'string', fixed: true, classes: 'grid_cell_style'},
                {name: 'hcpcCode', index: 'hcpcCode', width: 70, sortable: true, sorttype: 'int', fixed: true, align: 'center'},
                {name: 'revenueCode', index: 'revenueCode', width: 60, sortable: true, sorttype: 'int', fixed: true, align: 'center'},
                {name: 'price', index: 'price', width: 60, sortable: true, sorttype: 'int', fixed: true, align: 'center'},
                {name: 'freqCount', index: 'freqCount', width: 60, sortable: true, sorttype: 'int', fixed: true, align: 'center'},
                {name: 'search', index: 'search', width: 80, fixed: true, align: 'center'},
                {name: 'targetCode', index: 'targetCode',hidden:true},
                {name: 'targetCodeType', index: 'targetCodeType',hidden:true}
            ],
            ondblClickRow: function(id) {

                globalvars.other_associateCode_charges_selected_row_form_data = grids.loadAssociateRulesSearchFormGrid.$gridDiv.jqGrid('getRowData', id);
                $("#associate_rules_grid_search_form_dialog").dialog("close");

                var data = {
                    hcpcCode: globalvars.other_associateCode_charges_selected_row_form_data.hcpcCode,
                    dept: globalvars.other_associateCode_charges_selected_row_form_data.dept,
                    chargeCode: globalvars.other_associateCode_charges_selected_row_form_data.chargeCode,
                    chargeDesc: globalvars.other_associateCode_charges_selected_row_form_data.chargeDesc,
                    price: globalvars.other_associateCode_charges_selected_row_form_data.price,
                    revenueCode: globalvars.other_associateCode_charges_selected_row_form_data.revenueCode,
                    targetCode: globalvars.other_associateCode_charges_selected_row_form_data.targetCode,
                    targetCodeType: globalvars.other_associateCode_charges_selected_row_form_data.targetCodeType
                };

                var test = grids.associationRulesGrid.$gridDiv.jqGrid('getRowData', grids.associationRulesGrid.selectedRow);
                if (test) {

                    grids.associationRulesGrid.$gridDiv.jqGrid('setCell', test.id, 'hcpcCode', data.hcpcCode);
                    grids.associationRulesGrid.$gridDiv.jqGrid('setCell', test.id, 'dept', data.dept);
                    grids.associationRulesGrid.$gridDiv.jqGrid('setCell', test.id, 'chargeCode', data.chargeCode);
                    grids.associationRulesGrid.$gridDiv.jqGrid('setCell', test.id, 'chargeDescription', data.chargeDesc);
                    grids.associationRulesGrid.$gridDiv.jqGrid('setCell', test.id, 'price', data.price);
                    grids.associationRulesGrid.$gridDiv.jqGrid('setCell', test.id, 'revCode', data.revenueCode);
                    grids.associationRulesGrid.$gridDiv.jqGrid('setCell', test.id, 'targetCode', data.targetCode);
                    grids.associationRulesGrid.$gridDiv.jqGrid('setCell', test.id, 'targetCodeType', data.targetCodeType);
                }
                    grids.associationRulesGrid.isEditable=true;
            },
            
            loadComplete: function() {

                //$gridDiv.jqGrid('setLabel', 'chargeDesc', '', {'text-align': 'left', 'padding-left': '16px', 'width': '216px'});
            }
        });
        
      
        
        },
        addBthClick:function(id){
            globalvars.other_discovered_charges_selected_row_form_data = grids.loadAssociateRulesSearchFormGrid.$gridDiv.jqGrid('getRowData', id);
            var data = {
                hcpcCode: globalvars.other_discovered_charges_selected_row_form_data.hcpcCode,
                dept: globalvars.other_discovered_charges_selected_row_form_data.dept,
                chargeCode: globalvars.other_discovered_charges_selected_row_form_data.chargeCode,
                price: globalvars.other_discovered_charges_selected_row_form_data.price
            };
            
            if (grids.otherChargesGrid.selectedRow !== undefined) {
              //  log("submitting + saving row " + grids.otherChargesGrid.selectedRow);
                grids.otherChargesGrid.$gridDiv.jqGrid('saveRow', grids.otherChargesGrid.selectedRow);

            };
            
            if (grids.otherChargesGrid.savedSuccessfully == true) {
            var searchDiv = '<div class="other_discover_search_wrapper"><img class="search_cell_del" src="common/images/account-details/delete-icon.png"><img class="search_cell_search" src="common/images/account-details/search-icon.png"></div>';
            
            var otherchargesgrid_data = grids.otherChargesGrid.$gridDiv.jqGrid('getRowData');
            var otherchargesgrid_data_newrow = (otherchargesgrid_data.length)+1
            var newrow = { id: otherchargesgrid_data_newrow, search: "", hcpcCode: "", dept: "", chargeCode: "", quantity:'', comments: "",method:'MANUAL-A2' ,rowEditable:true};
            grids.otherChargesGrid.$gridDiv.jqGrid('addRowData', otherchargesgrid_data_newrow, newrow);
           // log("New Row added to Other Charges Grid as row " + otherchargesgrid_data_newrow);
           
            //$("#account_details_other_charges_grid .ui-jqgrid-bdiv").scrollTop($("#account_details_other_charges_grid .ui-jqgrid-bdiv")[0].scrollHeight);  

            var test = grids.otherChargesGrid.$gridDiv.jqGrid('getRowData', otherchargesgrid_data_newrow);//$("#account_details_other_charges_grid_table").getRowData(grids.otherChargesGrid.selectedRow);
            if (test) {
                grids.otherChargesGrid.$gridDiv.jqGrid('setCell', otherchargesgrid_data_newrow, 'chargeCode', data.chargeCode);
                grids.otherChargesGrid.$gridDiv.jqGrid('setCell', otherchargesgrid_data_newrow, 'dept', data.dept);
                grids.otherChargesGrid.$gridDiv.jqGrid('setCell', otherchargesgrid_data_newrow, 'hcpcCode', data.hcpcCode);
                grids.otherChargesGrid.$gridDiv.jqGrid('setCell', otherchargesgrid_data_newrow, 'price', data.price);
                grids.otherChargesGrid.$gridDiv.jqGrid('setCell', otherchargesgrid_data_newrow, 'quantity', 1);
                grids.otherChargesGrid.$gridDiv.jqGrid('setCell', otherchargesgrid_data_newrow, 'search', searchDiv, '');
                
                grids.otherChargesGrid.$gridDiv.setGridParam({ rowNum: 30 }).trigger("reloadGrid");
                grids.otherChargesGrid.$gridDiv.setSelection(otherchargesgrid_data_newrow, true);
                grids.otherChargesGrid.savedSuccessfully = false;

            }
            }
            

        }
            
        
    
    },
    loadCciEditsSearchFormGrid: {
        $gridDiv:{},
        loadGrid: function(param) {
        this.$gridDiv = $(param.gridDiv);
        this.$gridDiv.jqGrid({
            datatype: "local",
            width: '740',
            height: '200',
            gridview: true,
            viewrecords: true,
            sortorder: 'asc',
            altRows: true,
            altclass: 'alternate_row_color',
            colNames: [globalvars.localResourceMap.other_discoved_search_dept_code,'Dept Description', globalvars.localResourceMap.other_discoved_search_charge_code,
                globalvars.localResourceMap.other_discoved_search_charge_desp, globalvars.localResourceMap.other_discoved_search_hcpc,
                globalvars.localResourceMap.other_discoved_search_rev_code, globalvars.localResourceMap.other_discoved_charge_price,'#count','','targetCode','targetCodeType',''],
            colModel: [
                {name: 'dept', index: 'dept', width: 70, sortable: true, sorttype: 'int', fixed: true, align: 'center'},
                {name: 'deptDesc', index: 'deptDesc', width: 100, sortable: true, sorttype: 'int', fixed: true, align: 'center'},
                {name: 'chargeCode', index: 'chargeCode', width: 80, sortable: true, sorttype: 'int', fixed: true, align: 'center'},
                {name: 'chargeDesc', index: 'chargeDesc', width: 130, sortable: true, sorttype: 'string', fixed: true, classes: 'grid_cell_style'},
                {name: 'hcpcCode', index: 'hcpcCode', width: 60, sortable: true, sorttype: 'int', fixed: true, align: 'center'},
                {name: 'revenueCode', index: 'revenueCode', width: 60, sortable: true, sorttype: 'int', fixed: true, align: 'center'},
                {name: 'price', index: 'price', width: 70, sortable: true, sorttype: 'int', fixed: true, align: 'center'},
                {name: 'freqCount', index: 'freqCount', width: 60, sortable: true, sorttype: 'int', fixed: true, align: 'center'},
                {name: 'search', index: 'search', width: 80, fixed: true, align: 'center'},
                {name: 'targetCode', index: 'targetCode',hidden:true},
                {name: 'targetCodeType', index: 'targetCodeType',hidden:true},
                {name: 'dateOfService', index: 'dateOfService',hidden:true}
            ],
            ondblClickRow: function(id) {

                globalvars.other_cci_edits_charges_selected_row_form_data = grids.loadCciEditsSearchFormGrid.$gridDiv.jqGrid('getRowData', id);
                $("#cci_edits_grid_search_form_dialog").dialog("close");

                var data = {
                    hcpcCode: globalvars.other_cci_edits_charges_selected_row_form_data.hcpcCode,
                    dept: globalvars.other_cci_edits_charges_selected_row_form_data.dept,
                    chargeCode: globalvars.other_cci_edits_charges_selected_row_form_data.chargeCode,
                    dateOfService : globalvars.other_cci_edits_charges_selected_row_form_data.dateOfService
//                    chargeDesc: globalvars.other_associateCode_charges_selected_row_form_data.chargeDesc,
//                    price: globalvars.other_associateCode_charges_selected_row_form_data.price,
//                    revenueCode: globalvars.other_associateCode_charges_selected_row_form_data.revenueCode,
//                    targetCode: globalvars.other_associateCode_charges_selected_row_form_data.targetCode,
//                    targetCodeType: globalvars.other_associateCode_charges_selected_row_form_data.targetCodeType
                };

                var test = grids.cciEditsGrid.$gridDiv.jqGrid('getRowData', grids.cciEditsGrid.selectedRow);
                if (test) {

                    grids.cciEditsGrid.$gridDiv.jqGrid('setCell', test.id, 'hcpcCodeb', data.hcpcCode);
                    //grids.cciEditsGrid.$gridDiv.jqGrid('setCell', test.id, 'deptCode', data.dept);
                    //grids.cciEditsGrid.$gridDiv.jqGrid('setCell', test.id, 'chargeCode', data.chargeCode);
  
                    grids.loadCciEditsSearchFormGrid.addBthClick(test.id);
                }
                    grids.cciEditsGrid.isEditable=true;
            },
            
            loadComplete: function() {

                //$gridDiv.jqGrid('setLabel', 'chargeDesc', '', {'text-align': 'left', 'padding-left': '16px', 'width': '216px'});
            }
        });
        
      
        
        },
        addBthClick:function(id){
            globalvars.other_discovered_charges_selected_row_form_data = grids.loadCciEditsSearchFormGrid.$gridDiv.jqGrid('getRowData', id);
            var data = {
                hcpcCode: globalvars.other_discovered_charges_selected_row_form_data.hcpcCode,
                dept: globalvars.other_discovered_charges_selected_row_form_data.dept,
                chargeCode: globalvars.other_discovered_charges_selected_row_form_data.chargeCode,
                price: globalvars.other_discovered_charges_selected_row_form_data.price,
                dateOfService1 : globalvars.other_discovered_charges_selected_row_form_data.dateOfService
            };
            
            if (grids.otherChargesGrid.selectedRow !== undefined) {
              //  log("submitting + saving row " + grids.otherChargesGrid.selectedRow);
                grids.otherChargesGrid.$gridDiv.jqGrid('saveRow', grids.otherChargesGrid.selectedRow);

            };
            
            if (grids.otherChargesGrid.savedSuccessfully == true) {
            var searchDiv = '<div class="other_discover_search_wrapper"><img class="search_cell_del" src="common/images/account-details/delete-icon.png"><img class="search_cell_search" src="common/images/account-details/search-icon.png"></div>';
            
            var otherchargesgrid_data = grids.otherChargesGrid.$gridDiv.jqGrid('getRowData');
            var otherchargesgrid_data_newrow = (otherchargesgrid_data.length)+1
            var newrow = { id: otherchargesgrid_data_newrow, search: "", hcpcCode: "", dept: "", chargeCode: "", quantity:'', comments: "",method:'MANUAL-A3',rowEditable:true };
            grids.otherChargesGrid.$gridDiv.jqGrid('addRowData', otherchargesgrid_data_newrow, newrow);
           // log("New Row added to Other Charges Grid as row " + otherchargesgrid_data_newrow);
           
            //$("#account_details_other_charges_grid .ui-jqgrid-bdiv").scrollTop($("#account_details_other_charges_grid .ui-jqgrid-bdiv")[0].scrollHeight);  

            var test = grids.otherChargesGrid.$gridDiv.jqGrid('getRowData', otherchargesgrid_data_newrow);//$("#account_details_other_charges_grid_table").getRowData(grids.otherChargesGrid.selectedRow);
            if (test) {
                
                 var test = grids.cciEditsGrid.$gridDiv.jqGrid('getRowData', grids.cciEditsGrid.selectedRow);
                 if (test) {

                     grids.cciEditsGrid.$gridDiv.jqGrid('setCell', test.id, 'hcpcCodeb', data.hcpcCode);
                     //grids.cciEditsGrid.$gridDiv.jqGrid('setCell', test.id, 'deptCode', data.dept);
                     //grids.cciEditsGrid.$gridDiv.jqGrid('setCell', test.id, 'chargeCode', data.chargeCode);
   
                 }
                
                grids.otherChargesGrid.$gridDiv.jqGrid('setCell', otherchargesgrid_data_newrow, 'chargeCode', data.chargeCode);
                grids.otherChargesGrid.$gridDiv.jqGrid('setCell', otherchargesgrid_data_newrow, 'dept', data.dept);
                grids.otherChargesGrid.$gridDiv.jqGrid('setCell', otherchargesgrid_data_newrow, 'hcpcCode', data.hcpcCode);
                grids.otherChargesGrid.$gridDiv.jqGrid('setCell', otherchargesgrid_data_newrow, 'price', data.price);
                grids.otherChargesGrid.$gridDiv.jqGrid('setCell', otherchargesgrid_data_newrow, 'quantity', 1);
                grids.otherChargesGrid.$gridDiv.jqGrid('setCell', otherchargesgrid_data_newrow, 'dateOfService1', data.dateOfService1);

                grids.otherChargesGrid.$gridDiv.jqGrid('setCell', otherchargesgrid_data_newrow, 'search', searchDiv, '');
                
                grids.otherChargesGrid.$gridDiv.setGridParam({ rowNum: 30 }).trigger("reloadGrid");
                grids.otherChargesGrid.$gridDiv.setSelection(otherchargesgrid_data_newrow, true);
                grids.otherChargesGrid.savedSuccessfully = false;

            }
            }
            

        }
            
        
    
    },

    loadOtherChargesSearchFormGrid:{

    gridDiv: "",
        $gridDiv: {},
        pagerDiv: "",
        data: {},
        onClick: {},
        highlightedRows: [],
        showPType:'',
        initialize: function(param) {
            log(param);
            this.gridDiv = param.gridDiv;
            this.$gridDiv = $(param.gridDiv)
            this.pagerDiv = param.pagerDiv;
            this.showPType = param.showPType;
            this.data = param.data;
            this.onClick = param.onClick;
            this.loadGrid();
            this.fillGrid();
        },
        reloadGrid: function() {
            this.$gridDiv = $(this.gridDiv);
            this.$gridDiv.jqGrid('GridUnload');
            this.$gridDiv = $(this.gridDiv);
            this.loadGrid();
            this.fillGrid();
            this.$gridDiv.setGridParam().trigger("reloadGrid");
        },
        loadGrid: function() {
        this.$gridDiv.jqGrid({

            datatype: "local",
            width: '740',
            height: '200',
            gridview: true,
            viewrecords: true,
            sortorder: 'asc',
            altRows: true,
            altclass: 'alternate_row_color',
            colNames: [globalvars.localResourceMap.other_discoved_search_dept_code, 'Dept Description',globalvars.localResourceMap.other_discoved_search_charge_code,
                globalvars.localResourceMap.other_discoved_search_charge_desp,'ndc code',globalvars.localResourceMap.other_discoved_search_hcpc,
                globalvars.localResourceMap.other_discoved_search_rev_code, globalvars.localResourceMap.other_discoved_charge_price,'#count'],
            colModel: [
                {name: 'dept', index: 'dept', width: 65, sortable: true, sorttype: 'int', fixed: true, align: 'center'},
                {name: 'deptDesc', index: 'deptDesc', width: 120, sortable: true, fixed: true, align: 'center'},
                {name: 'chargeCode', index: 'chargeCode', width: 65, sortable: true, fixed: true, align: 'center'},
                {name: 'chargeDesc', index: 'chargeDesc', width: 120, sortable: true, sorttype: 'string', fixed: true, classes: 'grid_cell_style'},
                {name: 'ndcCode', index: 'ndcCode', width: 65, sortable: true, fixed: true, align: 'center'},
                {name: 'hcpcCode', index: 'hcpcCode', width: 65, sortable: true, fixed: true, align: 'center'},
                {name: 'revenueCode', index: 'revenueCode', width: 60, sortable: true, sorttype: 'int', fixed: true, align: 'center'},
                {name: 'price', index: 'price', width: 70, sortable: true, sorttype: 'int', fixed: true, align: 'center',formatter:'currency',
                     formatoptions: { decimalSeparator: ".", thousandsSeparator: ",", prefix: "$",decimalPlaces: 1, defaultValue: '0.0' }},
                {name: 'freqCount', index: 'freqCount', width: 70, sortable: true, sorttype: 'int', fixed: true, align: 'center'}

            ],
            ondblClickRow: function(id) {
               
                globalvars.other_discovered_charges_selected_row_form_data = grids.loadOtherChargesSearchFormGrid.$gridDiv.jqGrid('getRowData', id);
                $("#other_charges_grid_search_form_dialog").dialog("close");
                var data = {
                    hcpcCode: globalvars.other_discovered_charges_selected_row_form_data.hcpcCode,
                    dept: globalvars.other_discovered_charges_selected_row_form_data.dept,
                    chargeCode: globalvars.other_discovered_charges_selected_row_form_data.chargeCode,
                    price: globalvars.other_discovered_charges_selected_row_form_data.price,
                    ndcCode: globalvars.other_discovered_charges_selected_row_form_data.ndcCode,
                    chargeDesc: globalvars.other_discovered_charges_selected_row_form_data.chargeDesc,
                };
                var test = $("#account_details_other_charges_grid_table").getRowData(grids.otherChargesGrid.selectedRow);
                if (test) {
                    grids.otherChargesGrid.$gridDiv.jqGrid('setCell', test.id, 'hcpcCode', (data.hcpcCode != "")? data.hcpcCode:undefined);
                    grids.otherChargesGrid.$gridDiv.jqGrid('setCell', test.id, 'dept', data.dept);
                    grids.otherChargesGrid.$gridDiv.jqGrid('setCell', test.id, 'chargeCode', data.chargeCode);
                    grids.otherChargesGrid.$gridDiv.jqGrid('setCell', test.id, 'ndcCode', (data.ndcCode != "")? data.ndcCode:undefined);
                    grids.otherChargesGrid.$gridDiv.jqGrid('setCell', test.id, 'price', data.price);
                    grids.otherChargesGrid.$gridDiv.jqGrid('setCell', test.id, 'chargeDescription', data.chargeDesc);
                    grids.otherChargesGrid.$gridDiv.jqGrid('saveRow', grids.otherChargesGrid.selectedRow);
                    grids.otherChargesGrid.$gridDiv.trigger("jqGridInlineAfterSaveRow");
                }



            },
            loadComplete: function() {

                    
            }
            
        });
        },

        fillGrid: function() {
            var datalength = this.data.length;

            for (var i = 0; i < datalength; i++) {
                grids.loadOtherChargesSearchFormGrid.data[i].index = i;
                grids.loadOtherChargesSearchFormGrid.$gridDiv.jqGrid('addRowData', i + 1, grids.loadOtherChargesSearchFormGrid.data[i]);
            }
            ;
            grids.loadOtherChargesSearchFormGrid.$gridDiv.setGridParam({rowNum: datalength}).trigger("reloadGrid");

           
        }




    },



    loadOtherChargesSearchFormMissGrid:{

    gridDiv: "",
        $gridDiv: {},
        pagerDiv: "",
        data: {},
        onClick: {},
        highlightedRows: [],
        showPType:'',
        initialize: function(param) {
            log(param);
            this.gridDiv = param.gridDiv;
            this.$gridDiv = $(param.gridDiv)
            this.pagerDiv = param.pagerDiv;
            this.showPType = param.showPType;
            this.data = param.data;
            this.onClick = param.onClick;
            this.loadGrid();
            this.fillGrid();
        },
        reloadGrid: function() {
            this.$gridDiv = $(this.gridDiv);
            this.$gridDiv.jqGrid('GridUnload');
            this.$gridDiv = $(this.gridDiv);
            this.loadGrid();
            this.fillGrid();
            this.$gridDiv.setGridParam().trigger("reloadGrid");
        },
        loadGrid: function() {
        this.$gridDiv.jqGrid({

             datatype: "local",
            width: '740',
            height: '200',
            gridview: true,
            viewrecords: true,
            sortorder: 'asc',
            altRows: true,
            altclass: 'alternate_row_color',
            colNames: [globalvars.localResourceMap.other_discoved_search_dept_code, 'Dept Description',globalvars.localResourceMap.other_discoved_search_charge_code,
                globalvars.localResourceMap.other_discoved_search_charge_desp,'ndc code',globalvars.localResourceMap.other_discoved_search_hcpc,
                globalvars.localResourceMap.other_discoved_search_rev_code, globalvars.localResourceMap.other_discoved_charge_price,'#count',''],
            colModel: [
                {name: 'dept', index: 'dept', width: 65, sortable: true, sorttype: 'int', fixed: true, align: 'center'},
                {name: 'deptDesc', index: 'deptDesc', width: 120, sortable: true, fixed: true, align: 'center'},
                {name: 'chargeCode', index: 'chargeCode', width: 65, sortable: true, fixed: true, align: 'center'},
                {name: 'chargeDesc', index: 'chargeDesc', width: 120, sortable: true, sorttype: 'string', fixed: true, classes: 'grid_cell_style'},
                {name: 'ndcCode', index: 'ndcCode', width: 65, sortable: true, fixed: true, align: 'center'},
                {name: 'hcpc', index: 'hcpc', width: 65, sortable: true, fixed: true, align: 'center'},
                {name: 'revenueCode', index: 'revenueCode', width: 60, sortable: true, sorttype: 'int', fixed: true, align: 'center'},
                {name: 'price', index: 'price', width: 70, sortable: true, sorttype: 'int', fixed: true, align: 'center',formatter:'currency',
                     formatoptions: { decimalSeparator: ".", thousandsSeparator: ",", prefix: "$",decimalPlaces: 1, defaultValue: '0.0' }},
                {name: 'freqCount', index: 'freqCount', width: 70, sortable: true, sorttype: 'int', fixed: true, align: 'center'},
                {name: 'ndcDesc', index: 'ndcDesc',hidden:true}
            ],
            ondblClickRow: function(id) {
               
                globalvars.other_discovered_charges_selected_row_form_data = grids.loadOtherChargesSearchFormMissGrid.$gridDiv.jqGrid('getRowData', id);
                $("#other_charges_grid_search_form_miss_dialog").dialog("close");
                var data = {
                    chargeCode: globalvars.other_discovered_charges_selected_row_form_data.chargeCode,
                    chargeDesc: globalvars.other_discovered_charges_selected_row_form_data.chargeDesc,
                    ndcCode:globalvars.other_discovered_charges_selected_row_form_data.ndcCode,
                    ndcDesc:globalvars.other_discovered_charges_selected_row_form_data.ndcDesc,
                    price:globalvars.other_discovered_charges_selected_row_form_data.price
                };

                grids.missingChargesGrid.$gridDiv.jqGrid('saveRow', grids.missingChargesGrid.selectedRow);
                 var selectedRowData = grids.missingChargesGrid.$gridDiv.jqGrid('getRowData', grids.missingChargesGrid.selectedRow);
                 var rowId = grids.missingChargesGrid.$gridDiv.getGridParam("selrow");
                 var objectKey = "missingData" + "_" + grids.missingChargesGrid.screenName + "_"  + selectedRowData.dept + "_" + rowId;
                 newData = globalvars.missingDropDownData[objectKey];

                  if(newData.length>0){
                    var found = false;

                    for(var i = 0; i < newData.length; i++) {
                        if (newData[i].chargeCode == data.npi) {
                            found = true;
                            break;
                        }
                    }
                    if(found == false){
                        newData.push(data);

                    }
                    globalvars.missingDropDownData[objectKey] = newData; 
                 }else{
                    newData.push(data);
                    globalvars.missingDropDownData[objectKey] = newData; 
                 }

                    selectedRowData.chargeCode = data.chargeCode;
                    selectedRowData.price = data.price;
                    selectedRowData.chargeDesc = data.chargeDesc;
                    
                    if(data.ndcCode != "" || data.ndcCode != " " || data.ndcCode != undefined){
                        var ndcList=[];
                        selectedRowData.ndcCode = data.ndcCode;
                        var objectKey = "missingData" + "_" + grids.missingChargesGrid.screenName + "_" + selectedRowData.dept + "_" + data.chargeCode + "_" + rowId;
                        var obj = {ndcCode:data.ndcCode,ndcDesc:data.ndcDesc};
                        ndcList.push(obj);
                        globalvars.missingDropDownData[objectKey] = ndcList;
                        // grids.missingChargesGrid.createNDCCodeDropdown({
                        //     rowData: selectedRowData,
                        //     rowId: rowId
                        // });
                    }

                    grids.missingChargesGrid.$gridDiv.jqGrid('setRowData', grids.missingChargesGrid.selectedRow, selectedRowData);
                    grids.missingChargesGrid.savedSuccessfully = true;



            },
            loadComplete: function() {

                    
            }
            
        });
        },

        fillGrid: function() {
            var datalength = this.data.length;

            for (var i = 0; i < datalength; i++) {
                grids.loadOtherChargesSearchFormMissGrid.data[i].index = i;
                grids.loadOtherChargesSearchFormMissGrid.$gridDiv.jqGrid('addRowData', i + 1, grids.loadOtherChargesSearchFormMissGrid.data[i]);
            }
            ;
            grids.loadOtherChargesSearchFormMissGrid.$gridDiv.setGridParam({rowNum: datalength}).trigger("reloadGrid");

           
        }




    },



    // loadOtherChargesSearchFormMissGrid: function(param) {
    //     var $gridDiv = $(param.gridDiv);
    //     $gridDiv.jqGrid({
    //         datatype: "local",
    //         width: '740',
    //         height: '200',
    //         gridview: true,
    //         viewrecords: true,
    //         sortorder: 'asc',
    //         altRows: true,
    //         altclass: 'alternate_row_color',
    //         colNames: [globalvars.localResourceMap.other_discoved_search_dept_code, 'Dept Description',globalvars.localResourceMap.other_discoved_search_charge_code,
    //             globalvars.localResourceMap.other_discoved_search_charge_desp,'ndc code',globalvars.localResourceMap.other_discoved_search_hcpc,
    //             globalvars.localResourceMap.other_discoved_search_rev_code, globalvars.localResourceMap.other_discoved_charge_price,'#count',''],
    //         colModel: [
    //             {name: 'dept', index: 'dept', width: 65, sortable: true, sorttype: 'int', fixed: true, align: 'center'},
    //             {name: 'deptDesc', index: 'deptDesc', width: 120, sortable: true, fixed: true, align: 'center'},
    //             {name: 'chargeCode', index: 'chargeCode', width: 65, sortable: true, fixed: true, align: 'center'},
    //             {name: 'chargeDesc', index: 'chargeDesc', width: 120, sortable: true, sorttype: 'string', fixed: true, classes: 'grid_cell_style'},
    //             {name: 'ndcCode', index: 'ndcCode', width: 65, sortable: true, fixed: true, align: 'center'},
    //             {name: 'hcpcCode', index: 'hcpcCode', width: 65, sortable: true, fixed: true, align: 'center'},
    //             {name: 'revenueCode', index: 'revenueCode', width: 60, sortable: true, sorttype: 'int', fixed: true, align: 'center'},
    //             {name: 'price', index: 'price', width: 70, sortable: true, sorttype: 'int', fixed: true, align: 'center',formatter:'currency',
    //                  formatoptions: { decimalSeparator: ".", thousandsSeparator: ",", prefix: "$",decimalPlaces: 1, defaultValue: '0.0' }},
    //             {name: 'freqCount', index: 'freqCount', width: 70, sortable: true, sorttype: 'int', fixed: true, align: 'center'},
    //             {name: 'ndcDesc', index: 'ndcDesc',hidden:true}

    //         ],
    //         ondblClickRow: function(id) {
            
                
                
    //             globalvars.other_discovered_charges_selected_row_form_data = $gridDiv.jqGrid('getRowData', id);
    //             $("#other_charges_grid_search_form_miss_dialog").dialog("close");
    //             var data = {
    //                 chargeCode: globalvars.other_discovered_charges_selected_row_form_data.chargeCode,
    //                 chargeDesc: globalvars.other_discovered_charges_selected_row_form_data.chargeDesc,
    //                 ndcCode:globalvars.other_discovered_charges_selected_row_form_data.ndcCode,
    //                 ndcDesc:globalvars.other_discovered_charges_selected_row_form_data.ndcDesc,
    //                 price:globalvars.other_discovered_charges_selected_row_form_data.price
    //             };

    //             grids.missingChargesGrid.$gridDiv.jqGrid('saveRow', grids.missingChargesGrid.selectedRow);
    //              var selectedRowData = grids.missingChargesGrid.$gridDiv.jqGrid('getRowData', grids.missingChargesGrid.selectedRow);
    //              var rowId = grids.missingChargesGrid.$gridDiv.getGridParam("selrow");
    //              var objectKey = "missingData" + "_" + grids.missingChargesGrid.screenName + "_"  + selectedRowData.dept + "_" + rowId;
    //              newData = globalvars.missingDropDownData[objectKey];

    //               if(newData.length>0){
    //                 var found = false;

    //                 for(var i = 0; i < newData.length; i++) {
    //                     if (newData[i].chargeCode == data.npi) {
    //                         found = true;
    //                         break;
    //                     }
    //                 }
    //                 if(found == false){
    //                     newData.push(data);

    //                 }
    //                 globalvars.missingDropDownData[objectKey] = newData; 
    //              }else{
    //                 newData.push(data);
    //                 globalvars.missingDropDownData[objectKey] = newData; 
    //              }

    //                 selectedRowData.chargeCode = data.chargeCode;
    //                 selectedRowData.price = data.price;
    //                 selectedRowData.chargeDesc = data.chargeDesc;
                    
    //                 if(data.ndcCode != "" || data.ndcCode != " " || data.ndcCode != undefined){
    //                     var ndcList=[];
    //                     selectedRowData.ndcCode = data.ndcCode;
    //                     var objectKey = "missingData" + "_" + grids.missingChargesGrid.screenName + "_" + selectedRowData.dept + "_" + data.chargeCode + "_" + rowId;
    //                     var obj = {ndcCode:data.ndcCode,ndcDesc:data.ndcDesc};
    //                     ndcList.push(obj);
    //                     globalvars.missingDropDownData[objectKey] = ndcList;
    //                     // grids.missingChargesGrid.createNDCCodeDropdown({
    //                     //     rowData: selectedRowData,
    //                     //     rowId: rowId
    //                     // });
    //                 }

    //                 grids.missingChargesGrid.$gridDiv.jqGrid('setRowData', grids.missingChargesGrid.selectedRow, selectedRowData);
    //                 grids.missingChargesGrid.savedSuccessfully = true;






    //         },
    //         loadComplete: function() {
    //             if(globalvars.otherChargesSearchMissForm){
    //                 if (globalvars.otherChargesSearchMissForm.length > 0) {
    //                         $("#account_details_other_charges_grid_search_form_miss_table").jqGrid('clearGridData')
    //                         var datalength = globalvars.otherChargesSearchMissForm.length;
    //                         for (var i = 0; i < datalength; i++) {
    //                             $("#account_details_other_charges_grid_search_form_miss_table").jqGrid('addRowData', i + 1, globalvars.otherChargesSearchMissForm[i]);
    //                         }
    //                     }
    //             }
    //             //$gridDiv.jqGrid('setLabel', 'chargeDesc', '', {'text-align': 'left', 'padding-left': '16px', 'width': '160px'});
    //         }
    //     });
    // },
    loadConfirmChargesGrid: { // param object holds gridDiv, data
        $gridDiv:{},
        datalength:"",
        onClick:{},
        showExcel:"",
        loadGrid: function(param) {
        this.$gridDiv = $(param.gridDiv);
        this.datalength = param.data.length;
        this.onClick = param.onClick;
        this.showExcel = param.showExcel;


        this.$gridDiv.jqGrid({
            datatype: "local",
            data: param.data,
            autowidth: false,
            height: 'auto',
            pager: param.pagerDiv,
            rowNum: 30,
            rowList: [10, 20, 30, 50],
            pagination: true,
            gridview: true,
            viewrecords: true,
            altRows: true,
            altclass: 'alternate_row_color',
            colNames: ['',globalvars.localResourceMap.confirm_charge_coid,'Auditor Id',globalvars.localResourceMap.confirm_charge_acct, globalvars.localResourceMap.confirm_charge_hcpc_code, globalvars.localResourceMap.confirm_charge_dept_code,
                globalvars.localResourceMap.confirm_charge_charge_code, globalvars.localResourceMap.confirm_charge_charge_desp, globalvars.localResourceMap.confirm_charge_amount,
                globalvars.localResourceMap.confirm_charge_qty, globalvars.localResourceMap.confirm_charge_comments, globalvars.localResourceMap.confirm_charge_confirm_time, globalvars.localResourceMap.confirm_charge_desc, globalvars.localResourceMap.confirm_charge_found,''],
            colModel: [
                {name: 'hospitalId', index: 'hospitalId', width: 60,hidden:true},
                {name: 'shortName', index: 'shortName', width: 70, align: 'center', fixed: true, sortable: true, sorttype: "int"},
                {name: 'auditorId', index: 'auditorId', width: 60, align: 'center', fixed: true, sortable: true},
                {name: 'accountId', index: 'accountId', width: 60, sortable: true, fixed: true, sorttype: "int", classes: 'accountlist-account-cursor'},
                {name: 'hcpcCode', index: 'hcpcCode', width: 55, align: 'center', fixed: true, sortable: true, sorttype: "int"},
                {name: 'deptCode', index: 'deptCode', width: 55, align: 'center', fixed: true, sortable: true, sorttype: "int"},
                {name: 'chargeCode', index: 'chargeCode', width: 55, align: 'center', fixed: true, sortable: true, sorttype: "int"},
                {name: 'chargeDesc', index: 'chargeDesc', width: 90, fixed: true, sortable: true, classes: 'grid_cell_style_confrim_reject'},
                {name: 'chargeAmount', index: 'chargeAmount', width: 75, fixed: true, sortable: true, sorttype: "float", align: 'right'},
                {name: 'quantity', index: 'quantity', width: 50, fixed: true, sortable: true, sorttype: "int", align: 'center'},
                {name: 'comments', index: 'comments', width: 60, fixed: true, sortable: true, classes: 'grid_cell_style_confrim_reject'},
                {name: 'confirmTime', index: 'confirmTime', width: 108, fixed: true, sortable: true, sorttype: "date", datefmt: "Y-m-d h:i:s", classes: 'grid_cell_style_confrim_reject'},
                {name: 'desc', index: 'desc', width: 90, fixed: true, sortable: true, classes: 'grid_cell_style_confrim_reject'},
                {name: 'found', index: 'found', width: 10, hidden: true},
                {name: 'uriCharges', index: 'uriCharges', width: 10, hidden: true}
                
            ],
            onSelectRow: this.onClick,
            loadComplete: function() {
                var gridRowData = $(param.gridDiv).jqGrid('getRowData');
                for (var i = 0; i < gridRowData.length; i++) {
                    if (gridRowData[i].found == "1") {
                 //       log("Highlighted found" + gridRowData[i].acct + "::" + (i + 1));
                        $(("tr#" + (i + 1))).addClass("highlighted_row");
                    }
                }

                if ((grids.loadConfirmChargesGrid.datalength == 0 || grids.loadConfirmChargesGrid.datalength == undefined)
                        && grids.loadConfirmChargesGrid.showExcel == undefined) {
                    $("#confirm_charges_download_excel").hide();
                    dialogs.messageDialog.show({text: globalvars.localResourceMap.confirmed_charge_no_data_msg});
                }
                else if (grids.loadConfirmChargesGrid.datalength > 0 && grids.loadConfirmChargesGrid.showExcel==false) {
                     $("#confirm_charges_download_excel").hide();
                }
                else if (grids.loadConfirmChargesGrid.datalength > 0 && grids.loadConfirmChargesGrid.showExcel) {
                    $("#confirm_charges_download_excel").show();
                }
            }


        });

        }

    },
    
    
    loadConfirmChargesAuditLevelGrid:{ // param object holds gridDiv, data
        $gridDiv:{},
        datalength:"",
        onClick:{},
        loadGrid: function(param) {
            this.$gridDiv = $(param.gridDiv);
            this.datalength = param.data.length;
            this.onClick = param.onClick;
            this.showExcel = param.showExcel;
            this.$gridDiv.jqGrid({
            datatype: "local",
            data: param.data,
            autowidth: false,
            height: 'auto',
            pager: param.pagerDiv,
            rowNum: 30,
            rowList: [10, 20, 30, 50],
            pagination: true,
            gridview: true,
            viewrecords: true,
            altRows: true,
            altclass: 'alternate_row_color',
            colNames: ['',globalvars.localResourceMap.confirm_charge_coid,'Auditor Id', globalvars.localResourceMap.confirm_charge_acct, globalvars.localResourceMap.confirm_charge_hcpc_code, globalvars.localResourceMap.confirm_charge_dept_code,
                globalvars.localResourceMap.confirm_charge_charge_code, globalvars.localResourceMap.confirm_charge_charge_desp, globalvars.localResourceMap.confirm_charge_amount,
                globalvars.localResourceMap.confirm_charge_qty, globalvars.localResourceMap.confirm_charge_comments, globalvars.localResourceMap.confirm_charge_confirm_time, globalvars.localResourceMap.confirm_charge_desc,
                 globalvars.localResourceMap.confirm_charge_ext_auditor_flag, globalvars.localResourceMap.confirm_charge_ext_auditor_comments,globalvars.localResourceMap.confirm_charge_found,''],
            colModel: [
                {name: 'hospitalId', index: 'hospitalId', width: 60,hidden:true},
                {name: 'shortName', index: 'shortName', width: 70, align: 'center', fixed: true, sortable: true, sorttype: "int"},
                {name: 'auditorId', index: 'auditorId', width: 60, align: 'center', fixed: true, sortable: true},
                {name: 'accountId', index: 'accountId', width: 60, sortable: true, fixed: true, sorttype: "int", classes: 'confirm-account-cursor'},
                {name: 'hcpcCode', index: 'hcpcCode', width: 45, align: 'center', fixed: true, sortable: true, sorttype: "int"},
                {name: 'deptCode', index: 'deptCode', width: 45, align: 'center', fixed: true, sortable: true, sorttype: "int"},
                {name: 'chargeCode', index: 'chargeCode', width: 55, align: 'center', fixed: true, sortable: true, sorttype: "int"},
                {name: 'chargeDesc', index: 'chargeDesc', width: 90, fixed: true, sortable: true, classes: 'grid_cell_style_confrim_reject'},
                {name: 'chargeAmount', index: 'chargeAmount', width: 60, fixed: true, sortable: true, sorttype: "float", align: 'right'},
                {name: 'quantity', index: 'quantity', width: 30, fixed: true, sortable: true, sorttype: "int", align: 'center'},
                {name: 'comments', index: 'comments', width: 60, fixed: true, sortable: true, classes: 'grid_cell_style_confrim_reject'},
                {name: 'confirmTime', index: 'confirmTime', width: 80, fixed: true, sortable: true, sorttype: "date", datefmt: "Y-m-d h:i:s", classes: 'grid_cell_style_confrim_reject'},
                {name: 'desc', index: 'desc',  width: 50, fixed: true, sortable: true, classes: 'grid_cell_style_confrim_reject'},
                {name: 'extAuditorFlag', index: 'extAuditorFlag', width: 60, fixed: true, sortable: true, classes: 'grid_cell_style_confrim_reject'},
                {name: 'extAuditorComments', index: 'extAuditorComments', width: 60, fixed: true,sortable: true, classes: 'grid_cell_style_confrim_reject'},
                {name: 'found', index: 'found', width: 10, hidden: true},
                {name: 'uriCharges', index: 'uriCharges', width: 10, hidden: true}
            ],
            onSelectRow: this.onClick,

            loadComplete: function() {
                var gridRowData = $(param.gridDiv).jqGrid('getRowData');
                for (var i = 0; i < gridRowData.length; i++) {
                    if (gridRowData[i].found == "1") {
                //        log("Highlighted found" + gridRowData[i].acct + "::" + (i + 1));
                        $(("tr#" + (i + 1))).addClass("highlighted_row");
                    }
                }

                if (grids.loadConfirmChargesAuditLevelGrid.datalength == 0 || grids.loadConfirmChargesAuditLevelGrid.datalength == undefined) {
                    $("#confirm_charges_download_excel").hide();
                    dialogs.messageDialog.show({text: globalvars.localResourceMap.confirmed_charge_no_data_msg});
                }
                else if (grids.loadConfirmChargesAuditLevelGrid.datalength > 0 && grids.loadConfirmChargesAuditLevelGrid.showExcel==false) {
                     $("#confirm_charges_download_excel").hide();
                }
                else if (grids.loadConfirmChargesAuditLevelGrid.datalength > 0 && grids.loadConfirmChargesAuditLevelGrid.showExcel) {
                    $("#confirm_charges_download_excel").show();
                }
            },


         });
         }
//         searchRecord:function(accountId){
//             var searchFiler = accountId, f;
//
//             if (searchFiler.length === 0) {
//              grids.loadConfirmChargesAuditLevelGrid.$gridDiv[0].p.search = false;
//                 $.extend(grids.loadConfirmChargesAuditLevelGrid.$gridDiv[0].p.postData,{filters:""});
//             }
//             f = {groupOp:"OR",rules:[]};
//             f.rules.push({field:"acct",op:"cn",data:searchFiler});
//             grids.loadConfirmChargesAuditLevelGrid.$gridDiv[0].p.search = true;
//             $.extend(grids.loadConfirmChargesAuditLevelGrid.$gridDiv[0].p.postData,{filters:JSON.stringify(f)});
//             grids.loadConfirmChargesAuditLevelGrid.$gridDiv.trigger("reloadGrid",[{page:1,current:true}]);
//
//         }
    },
    loadAuditorPerformanceComparisonGrid: function(param) { // param object holds gridDiv, data
        var $gridDiv = $(param.gridDiv);
        var datalength = param.data.length;
        $gridDiv.jqGrid({
            datatype: "local",
            data: param.data,
            autowidth: false,
            height: 'auto',
            rowNum: 30,
            rowList: [10, 20, 30, 50],
            gridview: true,
            viewrecords: true,
            altRows: true,
            altclass: 'alternate_row_color',
            colNames: [globalvars.localResourceMap.auditor_performance_auditor_name, globalvars.localResourceMap.auditor_performance_total_facilities_assigned,
                globalvars.localResourceMap.auditor_performance_total_account_given,globalvars.localResourceMap.auditor_performance_total_account_reviewed_given, globalvars.localResourceMap.auditor_performance_reviewed,
                globalvars.localResourceMap.auditor_performance_hits, globalvars.localResourceMap.auditor_performance_value_hit],
            colModel: [
                {name: 'auditorName', index: 'auditorName', width: 180, fixed: true, sortable: true, sorttype: "string", classes: 'grid_cell_style'},
                {name: 'totalFacilities', index: 'totalFacilities', width: 80, fixed: true, sortable: true, align: 'center', sorttype: "int"},
                {name: 'totalAccount', index: 'totalAccount', width: 150, fixed: true, sortable: true, align: 'center', sorttype: "int",formatter:'integer',formatoptions : {thousandsSeparator: "," , defaultValue: '0'}},
                {name: 'reviewedAccount', index: 'reviewedAccount', width: 130, fixed: true, sortable: true, align: 'center', sorttype: "int",formatter:'integer',formatoptions : {thousandsSeparator: "," , defaultValue: '0'}},
                {name: 'reviewedRate', index: 'reviewedRate', width: 80, fixed: true, sortable: true, align: 'center', sorttype: "int"},
                {name: 'hitRate', index: 'hitRate', width: 100, fixed: true, sortable: true, align: 'center', sorttype: "int"},
                {name: 'hitValue', index: 'hitValue', width: 120, fixed: true, sortable: true, align: 'right', sorttype: "int"}

            ],
            onSelectRow: this.onClick,
            loadComplete: function() {
                var gridRowData = $(param.gridDiv).jqGrid('getRowData');
                for (var i = 0; i < gridRowData.length; i++) {
                    if (gridRowData[i].found == "1") {
                    //    log("Highlighted found" + gridRowData[i].acct + "::" + (i + 1));
                        $(("tr#" + (i + 1))).addClass("highlighted_row");
                    }
                }
                $gridDiv.jqGrid('setLabel', 'auditorName', '', {'text-align': 'left', 'padding-left': '16px', 'width': '176px'});
            }
        });

//        if (datalength == 0){
//          log("test");
//            dialogs.messageDialog.show({ text: globalvars.localResourceMap.auditor_performance_no_data_text });
//        }
    },
    loadFacilityPerformanceGrid: function(param) { // param object holds gridDiv, data
        var $gridDiv = $(param.gridDiv);
        var datalength = param.data.length;
        var hideChargeDesc = param.hideChargeDesc;
        var hideHitCount = param.hideHitCount;
        var gridHeader = (screens.facilityPerformance.reportType == "AUDITOR") ? "fullAuditorName" : "groupType";
        log(screens.facilityPerformance.reportType);
        $gridDiv.jqGrid({
            datatype: "local",
            data: param.data,
            autowidth: false,
            height: 'auto',
            pager: param.pagerDiv,
            rowNum: 30,
            rowList: [10, 20, 30, 50],
            pagination: true,
            gridview: true,
            viewrecords: true,
            altRows: true,
            altclass: 'alternate_row_color',
            colNames: ['Index', param.reportType, globalvars.localResourceMap.facility_performance_grid_charge_desc, globalvars.localResourceMap.facility_performance_grid_header2,
                globalvars.localResourceMap.facility_performance_grid_header3, param.rank1, param.rank2],
            colModel: [
                {name: 'id', index: 'id', width: 10, fixed: true, hidden: true, sortable: false},
                {name: gridHeader, index: gridHeader, width: 186, fixed: true, sortable: true, sorttype: "string", classes: 'facility_performance_grid_first_column_style'},
                {name: 'chargeDesc', index: 'chargeDesc', width: 216, fixed: true, sortable: true, sorttype: "string", hidden: hideChargeDesc, classes: 'grid_cell_style'},
                {name: 'hitValue', index: 'hitValue', width: 123, fixed: true, sortable: true, sorttype: "int", align: 'right',formatter:'integer',formatoptions : {thousandsSeparator: "," ,prefix: "$",decimalPlaces:0}},
                {name: 'hitCount', index: 'hitCount', width: 160, fixed: true, sortable: true, sorttype: "int", hidden: hideHitCount, align: 'center',formatter:'integer',formatoptions : {thousandsSeparator: "," }},
                {name: 'rank1', index: 'rank1', width: 140, fixed: true, sortable: true, sorttype: "string", align: 'center'},
                {name: 'rank2', index: 'rank2', width: 205, fixed: true, sortable: true, sorttype: "string", align: 'center'}
            ],
            loadComplete: function() {
                $gridDiv.jqGrid('setLabel', gridHeader, '', {'text-align': 'left', 'padding-left': '16px', 'width': '172px'});
                $gridDiv.jqGrid('setLabel', 'chargeDesc', '', {'text-align': 'left', 'padding-left': '16px', 'width': '192px'});
            }
        });
    },
    loadFacilityPerformanceDeptGrid: function(param) { // param object holds gridDiv, data
        var $gridDiv = $(param.gridDiv);
        var datalength = param.data.length;
        $gridDiv.jqGrid({
            datatype: "jsonstring",
            datastr: param.data,
            autowidth: false,
            height: 'auto',
            treeGrid: true,
            rowNum: 30,
            treeGridModel: 'adjacency',
            ExpandColumn: 'groupType',
            rowList: [10, 20, 30, 50],
            sortname: 'groupType',
            gridview: true,
            viewrecords: true,
            altRows: true,
            altclass: 'alternate_row_color',
            jsonReader: {
                repeatitems: false,
                root: function(obj) {
                    return obj;
                }
            },
            colNames: [param.reportType, globalvars.localResourceMap.facility_performance_grid_charge_desc, globalvars.localResourceMap.facility_performance_grid_header2,
                       globalvars.localResourceMap.facility_performance_grid_header3, param.rank1, param.rank2],
            colModel: [
                       {name: 'groupType', index: 'groupType', width: 186, fixed: true, sortable: false, sorttype: "string", classes: 'facility_performance_grid_first_column_style'},
                       {name: 'chargeDesc', index: 'chargeDesc', width: 216, fixed: true, sortable: false, sorttype: "string", classes: 'grid_cell_style'},
                       {name: 'hitValue', index: 'hitValue', width: 123, fixed: true, sortable: false, sorttype: "int", align: 'right',formatter:'integer',formatoptions : {thousandsSeparator: "," ,prefix: "$"}},
                       {name: 'hitCount', index: 'hitCount', width: 140, fixed: true, sortable: false, sorttype: "int", align: 'center',formatter:'integer',formatoptions : {thousandsSeparator: "," }},
                       {name: 'rank1', index: 'rank1', width: 100, fixed: true, sortable: false, sorttype: "string", align: 'center'},
                       {name: 'rank2', index: 'rank2', width: 100, fixed: true, sortable: false, sorttype: "string", align: 'center'}
            ],
            loadComplete: function() {
                $gridDiv.jqGrid('setLabel', 'groupType', '', {'text-align': 'left', 'padding-left': '16px', 'width': '172px'});
                $gridDiv.jqGrid('setLabel', 'chargeDesc', '', {'text-align': 'left', 'padding-left': '16px', 'width': '192px'});
            }
        });

    },
    loadFacilityPerformanceFacilityDeptGrid: function(param) { // param object holds gridDiv, data
        var $gridDiv = $(param.gridDiv);
        var datalength = param.data.length;
        $gridDiv.jqGrid({
            datatype: "jsonstring",
            datastr: param.data,
            autowidth: false,
            height: 'auto',
            treeGrid: true,
            rowNum: 30,
            treeGridModel: 'adjacency',
            ExpandColumn: 'groupType',
            rowList: [10, 20, 30, 50],
            sortname: 'groupType',
            gridview: true,
            viewrecords: true,
            altRows: true,
            altclass: 'alternate_row_color',
            jsonReader: {
                repeatitems: false,
                root: function(obj) {
                    return obj;
                }
            },
            colNames: [param.reportType, 'Dept Description', globalvars.localResourceMap.facility_performance_grid_header2,
                       globalvars.localResourceMap.facility_performance_grid_header3, param.rank1, param.rank2],
            colModel: [
                       {name: 'groupType', index: 'groupType', width: 186, fixed: true, sortable: false, sorttype: "string", classes: 'facility_performance_grid_first_column_style'},
                       {name: 'chargeDesc', index: 'chargeDesc', width: 216, fixed: true, sortable: false, sorttype: "string", classes: 'grid_cell_style'},
                       {name: 'hitValue', index: 'hitValue', width: 123, fixed: true, sortable: false, sorttype: "int", align: 'right',formatter:'integer',formatoptions : {thousandsSeparator: "," ,prefix: "$"}},
                       {name: 'hitCount', index: 'hitCount', width: 140, fixed: true, sortable: false, sorttype: "int", align: 'center',formatter:'integer',formatoptions : {thousandsSeparator: "," }},
                       {name: 'rank1', index: 'rank1', width: 100, fixed: true, sortable: false, sorttype: "string", align: 'center'},
                       {name: 'rank2', index: 'rank2', width: 100, fixed: true, sortable: false, sorttype: "string", align: 'center'}
            ],
            loadComplete: function() {
                $gridDiv.jqGrid('setLabel', 'groupType', '', {'text-align': 'left', 'padding-left': '16px', 'width': '172px'});
                $gridDiv.jqGrid('setLabel', 'chargeDesc', '', {'text-align': 'left', 'padding-left': '16px', 'width': '192px'});
            }
        });

    },
    loadFacilityPerformanceHCPCFacilityGrid: function(param) { // param object holds gridDiv, data
        var $gridDiv = $(param.gridDiv);
        var datalength = param.data.length;
        $gridDiv.jqGrid({
            datatype: "jsonstring",
            datastr: param.data,
            autowidth: false,
            height: 'auto',
            treeGrid: true,
            rowNum: 30,
            treeGridModel: 'adjacency',
            ExpandColumn: 'groupType',
            rowList: [10, 20, 30, 50],
            sortname: 'groupType',
            gridview: true,
            viewrecords: true,
            altRows: true,
            altclass: 'alternate_row_color',
            jsonReader: {
                repeatitems: false,
                root: function(obj) {
                    return obj;
                }
            },
            colNames: [param.reportType,globalvars.localResourceMap.facility_performance_grid_desc, 'Facility', globalvars.localResourceMap.facility_performance_grid_header2,
                       globalvars.localResourceMap.facility_performance_grid_header3, param.rank1, param.rank2],
            colModel: [
                       {name: 'groupType', index: 'groupType', width: 140, fixed: true, sortable: false, sorttype: "string", classes: 'facility_performance_grid_first_column_style'},
                       {name: 'deptCode', index: 'deptCode', width: 200, fixed: true, sortable: false, sorttype: "string"},
                       {name: 'chargeDesc', index: 'chargeDesc', width: 160, fixed: true, sortable: false, sorttype: "string", classes: 'grid_cell_style'},
                       {name: 'hitValue', index: 'hitValue', width: 103, fixed: true, sortable: false, sorttype: "int", align: 'right',formatter:'integer',formatoptions : {thousandsSeparator: "," ,prefix: "$"}},
                       {name: 'hitCount', index: 'hitCount', width: 70, fixed: true, sortable: false, sorttype: "int", align: 'center',formatter:'integer',formatoptions : {thousandsSeparator: "," }},
                       {name: 'rank1', index: 'rank1', width: 100, fixed: true, sortable: false, sorttype: "string", align: 'center'},
                       {name: 'rank2', index: 'rank2', width: 100, fixed: true, sortable: false, sorttype: "string", align: 'center'}
            ],
            loadComplete: function() {
                $gridDiv.jqGrid('setLabel', 'groupType', '', {'text-align': 'left', 'padding-left': '16px', 'width': '124px'});
                $gridDiv.jqGrid('setLabel', 'deptCode', '', {'text-align': 'left', 'padding-left': '16px','width': '184px'});
                $gridDiv.jqGrid('setLabel', 'chargeDesc', '', {'text-align': 'left','padding-left': '16px', 'width': '144px'});
            }
        });

    },
     loadByCategoryBYFacilityGrid: function(param) { // param object holds gridDiv, data
        var $gridDiv = $(param.gridDiv);
        var datalength = param.data.length;
        $gridDiv.jqGrid({
            datatype: "jsonstring",
            datastr: param.data,
            autowidth: false,
            height: 'auto',
            treeGrid: true,
            rowNum: 30,
            treeGridModel: 'adjacency',
            ExpandColumn: 'groupType',
            rowList: [10, 20, 30, 50],
            sortname: 'groupType',
            gridview: true,
            viewrecords: true,
            altRows: true,
            altclass: 'alternate_row_color',
            jsonReader: {
                repeatitems: false,
                root: function(obj) {
                    return obj;
                }
            },
            colNames: [param.reportType, 'Facility', globalvars.localResourceMap.facility_performance_grid_header2,
                       globalvars.localResourceMap.facility_performance_grid_header3, param.rank1, param.rank2],
            colModel: [
                       {name: 'groupType', index: 'groupType', width: 186, fixed: true, sortable: false, sorttype: "string", classes: 'facility_performance_grid_first_column_style'},
                       {name: 'chargeDesc', index: 'chargeDesc', width: 216, fixed: true, sortable: false, sorttype: "string", classes: 'grid_cell_style'},
                       {name: 'hitValue', index: 'hitValue', width: 123, fixed: true, sortable: false, sorttype: "int", align: 'right',formatter:'integer',formatoptions : {thousandsSeparator: "," ,prefix: "$"}},
                       {name: 'hitCount', index: 'hitCount', width: 140, fixed: true, sortable: false, sorttype: "int", align: 'center',formatter:'integer',formatoptions : {thousandsSeparator: "," }},
                       {name: 'rank1', index: 'rank1', width: 100, fixed: true, sortable: false, sorttype: "string", align: 'center'},
                       {name: 'rank2', index: 'rank2', width: 100, fixed: true, sortable: false, sorttype: "string", align: 'center'}
            ],
            loadComplete: function() {
                $gridDiv.jqGrid('setLabel', 'groupType', '', {'text-align': 'left', 'padding-left': '16px', 'width': '172px'});
                $gridDiv.jqGrid('setLabel', 'chargeDesc', '', {'text-align': 'left', 'padding-left': '16px', 'width': '192px'});
            }
        });

    },
    loadPerformanceComparisonGrid: function(param) { // param object holds gridDiv, data
        var $gridDiv = $(param.gridDiv);
        var datalength = param.data.length;
        $gridDiv.jqGrid({
            datatype: "jsonstring",
            datastr: param.data,
            autowidth: false,
            height: 'auto',
            treeGrid: true,
            rowNum: 30,
            treeGridModel: 'adjacency',
            ExpandColumn: 'hospitalId',
            rowList: [10, 20, 30, 50],
            sortname: 'hospitalId',
            gridview: true,
            viewrecords: true,
            altRows: true,
            altclass: 'alternate_row_color',
            jsonReader: {
                repeatitems: false,
                root: function(obj) {
                    return obj;
                }
            },
            colNames: [globalvars.localResourceMap.performance_comparison_grid_header1, globalvars.localResourceMap.performance_comparison_grid_header2,
                globalvars.localResourceMap.performance_comparison_grid_header3,
                globalvars.localResourceMap.performance_comparison_grid_header5, globalvars.localResourceMap.performance_comparison_grid_header6,
                globalvars.localResourceMap.performance_comparison_grid_header7, globalvars.localResourceMap.performance_comparison_grid_header8],
            colModel: [
                {name: 'hospitalId', index: 'hospitalId', width: 75, fixed: true, sortable: true, sorttype: "int", classes: 'cell_wrapperleaf_new'},
                {name: 'hospitalShortName', index: 'hospitalShortName', width: 140, fixed: true, sortable: true, sorttype: "string", classes: 'grid_cell_style'},
                {name: 'name', index: 'name', width: 290, fixed: true, sortable: true, sorttype: "string", classes: 'grid_cell_style'},
                {name: 'totalAccounts', index: 'totalAccounts', width: 77, align: 'center', fixed: true, sortable: true, sorttype: "int",formatter: 'integer',formatoptions :{thousandsSeparator: ",", defaultValue: '0'}},
                {name: 'reviewRate', index: 'reviewRate', width: 77, align: 'center', fixed: true, sortable: true, sorttype: "int"},
                {name: 'hitRate', index: 'hitRate', width: 75, align: 'center', fixed: true, sortable: true, sorttype: "int"},
                {name: 'hitValue', index: 'hitValue', width: 105, fixed: true, sortable: true, sorttype: "int", align: 'right'}
            ],
            loadComplete: function() {
                $gridDiv.jqGrid('setLabel', 'hospitalShortName', '', {'text-align': 'left', 'padding-left': '16px', 'width': '126px'});
                $gridDiv.jqGrid('setLabel', 'name', '', {'text-align': 'left', 'padding-left': '16px', 'width': '276px'});
            }
        });

    },
    /* Auditor Assignment Grid*/

    loadAuditorAssignmentGrid: {
        $gridDiv: "",
        pagerDiv: "",
        data: {},
        selectedRow: undefined,
        initialize: function(param) {
            this.$gridDiv = $(param.gridDiv);
            this.pagerDiv = param.pagerDiv;
            this.selectedRow = undefined;
            this.data = param.data;
            this.loadData();
            this.fillGrid();
        },
        reloadGrid: function() {
            this.$gridDiv = this.$gridDiv;
            this.$gridDiv.jqGrid('clearGridData');
            this.data = globalvars.auditorAssignmentData;
            this.fillGrid();
        },
        loadData: function() {
            this.$gridDiv.jqGrid({
                datatype: "local",
                autowidth: false,
                height: 'auto',
                pager: this.pagerDiv,
                rowNum: 30,
                rowList: [10, 20, 30, 50],
                pagination: true,
                gridview: true,
                viewrecords: true,
                sortname: '',
                viewsortcols: [false, 'vertical', true],
                altRows: true,
                altclass: 'alternate_row_color',
                colNames: [globalvars.localResourceMap.auditor_assignment_hospitalId, globalvars.localResourceMap.auditor_assignment_facility_name,
                    globalvars.localResourceMap.auditor_assignment_prebill_auditor, globalvars.localResourceMap.auditor_assignment_postbill_auditor, 'PREBILL SELECTED AUDITOR', 'POSTBILL SELECTED AUDITOR', 'ORIGINAL PREBILL AUDITOR', 'ORIGINAL POSTBILL AUDITOR','PRE-Queue Auditor' ,'Post-Queue Auditor','',''],
                colModel: [
                    {name: 'hospitalId', index: 'hospitalId', width: 100, fixed: true, align: 'center'},
                    {name: 'hospitalName', index: 'hospitalName', width: 150, fixed: true, classes: 'grid_cell_style'},
                    {name: 'preBillAuditor', index: 'preBillAuditor', width: 300, fixed: true, editable: true, sortable: false, classes: 'grid_cell_style'},
                    {name: 'postBillAuditor', index: 'postBillAuditor', width: 300, fixed: true, editable: true, sortable: false, classes: 'grid_cell_style'},
                    {name: 'preBillSelectedAuditor', index: 'preBillSelectedAuditor', hidden: true, search: true},
                    {name: 'postBillSelectedAuditor', index: 'postBillSelectedAuditor', hidden: true, search: true},
                    {name: 'originalPreBillSelectedAuditor', index: 'originalPreBillSelectedAuditor', hidden: true, search: true},
                    {name: 'originalPostBillSelectedAuditor', index: 'originalPostBillSelectedAuditor', hidden: true, search: true},
                    {name: 'preQueueAuditors', index: 'preQueueAuditors', width: 140, fixed: true, editable: false, sortable: false, classes: 'grid_cell_style'},
                    {name: 'postQueueAuditors', index: 'postQueueAuditors', width: 140, fixed: true, editable: false, sortable: false, classes: 'grid_cell_style'},
                    {name: 'preQueueSelectedAuditor', index: 'preQueueSelectedAuditor', hidden: true, search: true},
                    {name: 'postQueueSelectedAuditor', index: 'postQueueSelectedAuditor', hidden: true, search: true},


                ],
                onSelectRow: function(id) {

                    grids.loadAuditorAssignmentGrid.savePreviousRow();
                    grids.loadAuditorAssignmentGrid.selectedRow = id;   

                    var preBillAuditorDropDown = new String();
                    preBillAuditorDropDown = "<div class='prebill_auditor_selector_div'><select id='prebill_auditor_dropdown" + id + "' multiple='multiple' onchange='grids.loadAuditorAssignmentGrid.preBillAuditorChange(this," + id + ")' style=width:250px;>";
                    preBillAuditorDropDown += globalvars.auditorOptions;
                    preBillAuditorDropDown += "</select></div>";

                    var postBillAuditorDropDown = new String();
                    postBillAuditorDropDown = "<div class='prebill_auditor_selector_div'><select id='postbill_auditor_dropdown" + id + "' multiple='multiple' onchange='grids.loadAuditorAssignmentGrid.postBillAuditorChange(this," + id + ")' style=width:250px;>";
                    postBillAuditorDropDown += globalvars.auditorOptions;
                    postBillAuditorDropDown += "</select></div>";

                    grids.loadAuditorAssignmentGrid.$gridDiv.jqGrid('editRow', id, true);

                    grids.loadAuditorAssignmentGrid.$gridDiv.jqGrid('setCell', id, 'preBillAuditor', preBillAuditorDropDown);
                    grids.loadAuditorAssignmentGrid.$gridDiv.jqGrid('setCell', id, 'postBillAuditor', postBillAuditorDropDown);

                    var preBillSelectedAuditortext = grids.loadAuditorAssignmentGrid.$gridDiv.jqGrid('getCell', id, 'preBillSelectedAuditor');
                    var preBillRetainAuditorList = preBillSelectedAuditortext.split(",");

                    var postBillSelectedAuditortext = grids.loadAuditorAssignmentGrid.$gridDiv.jqGrid('getCell', id, 'postBillSelectedAuditor');
                    var postBillRetainAuditorList = postBillSelectedAuditortext.split(",");


                    $("#prebill_auditor_dropdown" + id).val(preBillRetainAuditorList);
                    $("#prebill_auditor_dropdown" + id).multiselect({
                        multiple: true,
                        minWidth: 230,
                        selectedList: 40
                    })
                            .multiselectfilter();

                    $("#postbill_auditor_dropdown" + id).val(postBillRetainAuditorList);
                    $("#postbill_auditor_dropdown" + id).multiselect({
                        multiple: true,
                        minWidth: 230,
                        selectedList: 40
                    })
                            .multiselectfilter();

             //       log('clicked ' + id + " " + grids.loadAuditorAssignmentGrid.$gridDiv.getRowData(id));
                },
                editurl: 'clientArray',
                ignoreCase: true,
                onPaging: function() {
                    grids.loadAuditorAssignmentGrid.savePreviousRow();
                    grids.loadAuditorAssignmentGrid.selectedRow = undefined;
                },
                onSortCol: function() {
                    grids.loadAuditorAssignmentGrid.savePreviousRow();
                    grids.loadAuditorAssignmentGrid.selectedRow = undefined;
                },
                cmTemplate: {title: false},
                loadComplete: function() {
                    // grids.loadAuditorAssignmentGrid.$gridDiv.jqGrid('setLabel', 'hospitalName', '', {'text-align': 'left', 'padding-left': '16px', 'width': '256px'});
                    // grids.loadAuditorAssignmentGrid.$gridDiv.jqGrid('setLabel', 'preBillAuditor', '', {'text-align': 'left', 'padding-left': '16px', 'width': '336px'});
                    // grids.loadAuditorAssignmentGrid.$gridDiv.jqGrid('setLabel', 'postBillAuditor', '', {'text-align': 'left', 'padding-left': '16px', 'width': '356px'});
                }
            });

        },
        preBillAuditorChange: function(selectObj, id) {

            var prebill_auditors = $("#prebill_auditor_dropdown" + id).multiselect("getChecked");
            var selected_auditor_list_prebill = new Array();
            //log(prebill_auditors); /*Use the Log statement when required*/
            for (var i = 0; i < prebill_auditors.length; i++) {
                //log($(prebill_auditors[i]).attr('value')); /*Use the Log statement when required*/
                selected_auditor_list_prebill.push($(prebill_auditors[i]).attr('value'));

            }
            grids.loadAuditorAssignmentGrid.$gridDiv.jqGrid('setCell', id, 'preBillSelectedAuditor', selected_auditor_list_prebill);

        },
        postBillAuditorChange: function(selectObj, id) {

            var postbill_auditors = $("#postbill_auditor_dropdown" + id).multiselect("getChecked");
            var selected_auditor_list_postbill = new Array();
            //log(postbill_auditors); /*Use the Log statement when required*/
            for (var i = 0; i < postbill_auditors.length; i++) {
                //log($(postbill_auditors[i]).attr('value')); /*Use the Log statement when required*/
                selected_auditor_list_postbill.push($(postbill_auditors[i]).attr('value'));

            }
            grids.loadAuditorAssignmentGrid.$gridDiv.jqGrid('setCell', id, 'postBillSelectedAuditor', selected_auditor_list_postbill);

        },
        savePreviousRow: function() {
            if (grids.loadAuditorAssignmentGrid.selectedRow !== undefined) {

                grids.loadAuditorAssignmentGrid.$gridDiv.jqGrid('saveRow', grids.loadAuditorAssignmentGrid.selectedRow);
                var prebill_auditors_text = grids.loadAuditorAssignmentGrid.$gridDiv.jqGrid('getCell', grids.loadAuditorAssignmentGrid.selectedRow, 'preBillSelectedAuditor');
                var prebill_auditors_list = prebill_auditors_text.split(",");
                var current_prebill_auditors_text = new String();

                var preBillOriginalAuditortext = grids.loadAuditorAssignmentGrid.$gridDiv.jqGrid('getCell', grids.loadAuditorAssignmentGrid.selectedRow, 'originalPreBillSelectedAuditor');
                var preBillOriginalAuditorList = preBillOriginalAuditortext.split(",");

                var postBillOriginalAuditortext = grids.loadAuditorAssignmentGrid.$gridDiv.jqGrid('getCell', grids.loadAuditorAssignmentGrid.selectedRow, 'originalPostBillSelectedAuditor');
                var postBillOriginalAuditorList = postBillOriginalAuditortext.split(",");

                var currentHospitalId = grids.loadAuditorAssignmentGrid.$gridDiv.jqGrid('getCell', grids.loadAuditorAssignmentGrid.selectedRow, 'hospitalId');
                var hospitalIndex;
                var auditorNotFound = false;

                if (preBillOriginalAuditorList.length != prebill_auditors_list.length) {
                    hospitalIndex = jQuery.inArray(currentHospitalId, screens.auditorAssignment.uniqueHospitalList);
                    if (hospitalIndex === -1) {
                        screens.auditorAssignment.uniqueHospitalList.push(currentHospitalId);
                    }
                } else if (prebill_auditors_list.length != 0) {
                    hospitalIndex = jQuery.inArray(currentHospitalId, screens.auditorAssignment.uniqueHospitalList);
                    for (var j = 0; j < preBillOriginalAuditorList.length; j++) {
                        var index = jQuery.inArray(preBillOriginalAuditorList[j], prebill_auditors_list);
                        if (index === -1) {
                            auditorNotFound = true;
                        }
                    }
                    if (auditorNotFound === true) {
                        if (hospitalIndex === -1) {
                            screens.auditorAssignment.uniqueHospitalList.push(currentHospitalId);
                        }
                    } else {
//                      if(hospitalIndex!= -1){
//                          screens.auditorAssignment.uniqueHospitalList.splice(hospitalIndex,1);
//                      }
                    }
                }


                for (var i = 0; i < prebill_auditors_list.length; i++) {
                    current_prebill_auditors_text += prebill_auditors_list[i] + "<br/>";
                }
                grids.loadAuditorAssignmentGrid.$gridDiv.jqGrid('setCell', grids.loadAuditorAssignmentGrid.selectedRow, 'preBillAuditor', current_prebill_auditors_text);

                var postbill_auditors_text = grids.loadAuditorAssignmentGrid.$gridDiv.jqGrid('getCell', grids.loadAuditorAssignmentGrid.selectedRow, 'postBillSelectedAuditor');
                var postbill_auditors_list = postbill_auditors_text.split(",");
                var current_postbill_auditors_text = new String();

                if (postBillOriginalAuditorList.length != postbill_auditors_list.length) {
                    hospitalIndex = jQuery.inArray(currentHospitalId, screens.auditorAssignment.uniqueHospitalList);
                    if (hospitalIndex === -1) {
                        screens.auditorAssignment.uniqueHospitalList.push(currentHospitalId);
                    }
                } else if (postbill_auditors_list.length != 0) {
                    hospitalIndex = jQuery.inArray(currentHospitalId, screens.auditorAssignment.uniqueHospitalList);
                    for (var j = 0; j < postBillOriginalAuditorList.length; j++) {
                        var index = jQuery.inArray(postBillOriginalAuditorList[j], postbill_auditors_list);
                        if (index === -1) {
                            auditorNotFound = true;
                        }
                    }
                    if (auditorNotFound === true) {
                        if (hospitalIndex === -1) {
                            screens.auditorAssignment.uniqueHospitalList.push(currentHospitalId);
                        }
                    } else {
//                      if(hospitalIndex!= -1){
//                          screens.auditorAssignment.uniqueHospitalList.splice(hospitalIndex,1);
//                      }
                    }
                }

            //    log(screens.auditorAssignment.uniqueHospitalList);

                for (var i = 0; i < postbill_auditors_list.length; i++) {
                    current_postbill_auditors_text += postbill_auditors_list[i] + "<br/>";
                }
                grids.loadAuditorAssignmentGrid.$gridDiv.jqGrid('setCell', grids.loadAuditorAssignmentGrid.selectedRow, 'postBillAuditor', current_postbill_auditors_text);
            }
        },
        fillGrid: function() {
            var datalength = this.data.length;
            var preBillAuditors;
            var preBillAuditorsText;
            var postBillAuditors;
            var postBillAuditorText;
            var preBillSelectedAuditors;
            var postBillSelectedAuditors;
            var preQueueAuditors;
            var preQueueAuditorsText;
            var postQueueAuditors;
            var postQueueAuditorsText;
            var preQueueSelectedAuditor;
            var postQueueSelectedAuditor
            for (var i = 0; i < datalength; i++) {
                preBillAuditors = new Array();
                preBillAuditors = grids.loadAuditorAssignmentGrid.data[i].preBillAuditors;
                preBillAuditorsText = new String();
                preBillSelectedAuditors = new Array();
                for (var j = 0; j < preBillAuditors.length; j++) {
                    preBillAuditorsText += preBillAuditors[j].userId + '<br/>';
                    preBillSelectedAuditors.push(preBillAuditors[j].userId);
                }

                postBillAuditors = new Array();
                postBillAuditors = grids.loadAuditorAssignmentGrid.data[i].postBillAuditors;
                postBillAuditorText = new String();
                postBillSelectedAuditors = new Array();
                for (var k = 0; k < postBillAuditors.length; k++) {
                    postBillAuditorText += postBillAuditors[k].userId + '<br/>';
                    postBillSelectedAuditors.push(postBillAuditors[k].userId);
                }

                preQueueAuditors = new Array();
                preQueueAuditors = grids.loadAuditorAssignmentGrid.data[i].preBillQueueAuditors;
                preQueueAuditorsText = new String();
                preQueueSelectedAuditor = new Array();
                for (var k = 0; k < preQueueAuditors.length; k++) {
                    preQueueAuditorsText += preQueueAuditors[k].userId + '<br/>';
                    preQueueSelectedAuditor.push(preQueueAuditors[k].userId);
                }

                postQueueAuditors = new Array();
                postQueueAuditors = grids.loadAuditorAssignmentGrid.data[i].postBillQueueAuditors;
                postQueueAuditorsText = new String();
                postQueueSelectedAuditor = new Array();
                for (var k = 0; k < postQueueAuditors.length; k++) {
                    postQueueAuditorsText += postQueueAuditors[k].userId + '<br/>';
                    postQueueSelectedAuditor.push(postQueueAuditors[k].userId)
                }

                grids.loadAuditorAssignmentGrid.$gridDiv.jqGrid('addRowData', i + 1, {
                    hospitalId: grids.loadAuditorAssignmentGrid.data[i].hospitalId,
                    hospitalName: grids.loadAuditorAssignmentGrid.data[i].hospitalName,
                    preBillAuditor: preBillAuditorsText,
                    postBillAuditor: postBillAuditorText,
                    preBillSelectedAuditor: preBillSelectedAuditors,
                    postBillSelectedAuditor: postBillSelectedAuditors,
                    originalPreBillSelectedAuditor: preBillSelectedAuditors,
                    originalPostBillSelectedAuditor: postBillSelectedAuditors,
                    preQueueAuditors: preQueueAuditorsText,
                    postQueueAuditors: postQueueAuditorsText,
                    preQueueSelectedAuditor: preQueueSelectedAuditor,
                    postQueueSelectedAuditor: postQueueSelectedAuditor,

                });
            }
            grids.loadAuditorAssignmentGrid.$gridDiv.setGridParam({rowNum: 30}).trigger("reloadGrid");
        }
    },
    loadAuditorAssignmentGridCCIEdits: {
        $gridDiv: "",
        pagerDiv: "",
        data: {},
        selectedRow: undefined,
        initialize: function(param) {
            this.$gridDiv = $(param.gridDiv);
            this.pagerDiv = param.pagerDiv;
            this.selectedRow = undefined;
            this.data = param.data;
            this.loadData();
            this.fillGrid();
        },
        reloadGrid: function() {
            this.$gridDiv = this.$gridDiv;
            this.$gridDiv.jqGrid('clearGridData');
            this.data = globalvars.auditorAssignmentData;
            this.fillGrid();
        },
        loadData: function() {
            this.$gridDiv.jqGrid({
                datatype: "local",
                autowidth: false,
                height: 'auto',
                pager: this.pagerDiv,
                rowNum: 30,
                rowList: [10, 20, 30, 50],
                pagination: true,
                gridview: true,
                viewrecords: true,
                sortname: '',
                viewsortcols: [false, 'vertical', true],
                altRows: true,
                altclass: 'alternate_row_color',
                colNames: [globalvars.localResourceMap.auditor_assignment_hospitalId, globalvars.localResourceMap.auditor_assignment_facility_name,
                    globalvars.localResourceMap.auditor_assignment_prebill_auditor, globalvars.localResourceMap.auditor_assignment_postbill_auditor,'CODING-EDITS AUDITOR',
                    'PREBILL SELECTED AUDITOR', 'POSTBILL SELECTED AUDITOR','CCIEDITS AUDITOR', 'ORIGINAL PREBILL AUDITOR', 'ORIGINAL POSTBILL AUDITOR','ORIGINAL CCIEDITS AUDITOR', 'PRE-Queue Auditor' ,'Post-Queue Auditor','',''],
                colModel: [
                    {name: 'hospitalId', index: 'hospitalId', width: 60, fixed: true, align: 'center'},
                    {name: 'hospitalName', index: 'hospitalName', width: 120, fixed: true, classes: 'grid_cell_style'},
                    {name: 'preBillAuditor', index: 'preBillAuditor', width: 210, fixed: true, editable: true, sortable: false, classes: 'grid_cell_style'},
                    {name: 'postBillAuditor', index: 'postBillAuditor', width: 210, fixed: true, editable: true, sortable: false, classes: 'grid_cell_style'},
                    {name: 'cciEditsAuditor', index: 'cciEditsAuditor', width: 210, fixed: true, editable: true, sortable: false, classes: 'grid_cell_style'},
                    {name: 'preBillSelectedAuditor', index: 'preBillSelectedAuditor', hidden: true, search: true},
                    {name: 'postBillSelectedAuditor', index: 'postBillSelectedAuditor', hidden: true, search: true},
                    {name: 'cciEditsSelectedAuditor', index: 'cciEditsSelectedAuditor', hidden: true, search: true},
                    {name: 'originalPreBillSelectedAuditor', index: 'originalPreBillSelectedAuditor', hidden: true, search: true},
                    {name: 'originalPostBillSelectedAuditor', index: 'originalPostBillSelectedAuditor', hidden: true, search: true},
                    {name: 'originalcciEditsSelectedAuditor', index: 'originalcciEditsSelectedAuditor', hidden: true, search: true},
                    {name: 'preQueueAuditors', index: 'preQueueAuditors', width: 165, fixed: true, editable: false, sortable: false, classes: 'grid_cell_style'},
                    {name: 'postQueueAuditors', index: 'postQueueAuditors', width: 165, fixed: true, editable: false, sortable: false, classes: 'grid_cell_style'},
                    {name: 'preQueueSelectedAuditor', index: 'preQueueSelectedAuditor', hidden: true, search: true},
                    {name: 'postQueueSelectedAuditor', index: 'postQueueSelectedAuditor', hidden: true, search: true},
                    

                ],
                onSelectRow: function(id) {

                    grids.loadAuditorAssignmentGridCCIEdits.savePreviousRow();
                    grids.loadAuditorAssignmentGridCCIEdits.selectedRow = id;

                    var preBillAuditorDropDown = new String();
                    preBillAuditorDropDown = "<div class='prebill_auditor_selector_div'><select id='prebill_auditor_dropdown" + id + "' multiple='multiple' onchange='grids.loadAuditorAssignmentGridCCIEdits.preBillAuditorChange(this," + id + ")' style=width:185px;>";
                    preBillAuditorDropDown += globalvars.auditorOptions;
                    preBillAuditorDropDown += "</select></div>";

                    var postBillAuditorDropDown = new String();
                    postBillAuditorDropDown = "<div class='prebill_auditor_selector_div'><select id='postbill_auditor_dropdown" + id + "' multiple='multiple' onchange='grids.loadAuditorAssignmentGridCCIEdits.postBillAuditorChange(this," + id + ")' style=width:185px;>";
                    postBillAuditorDropDown += globalvars.auditorOptions;
                    postBillAuditorDropDown += "</select></div>";
                    
                    var cciEditsAuditorDropDown = new String();
                    cciEditsAuditorDropDown = "<div class='prebill_auditor_selector_div'><select id='cciEdit_auditor_dropdown" + id + "' multiple='multiple' onchange='grids.loadAuditorAssignmentGridCCIEdits.cciEditsAuditorChange(this," + id + ")' style=width:185px;>";
                    cciEditsAuditorDropDown += globalvars.auditorOptions;
                    cciEditsAuditorDropDown += "</select></div>";

                    grids.loadAuditorAssignmentGridCCIEdits.$gridDiv.jqGrid('editRow', id, true);

                    grids.loadAuditorAssignmentGridCCIEdits.$gridDiv.jqGrid('setCell', id, 'preBillAuditor', preBillAuditorDropDown);
                    grids.loadAuditorAssignmentGridCCIEdits.$gridDiv.jqGrid('setCell', id, 'postBillAuditor', postBillAuditorDropDown);
                    grids.loadAuditorAssignmentGridCCIEdits.$gridDiv.jqGrid('setCell', id, 'cciEditsAuditor', cciEditsAuditorDropDown);


                    var preBillSelectedAuditortext = grids.loadAuditorAssignmentGridCCIEdits.$gridDiv.jqGrid('getCell', id, 'preBillSelectedAuditor');
                    var preBillRetainAuditorList = preBillSelectedAuditortext.split(",");

                    var postBillSelectedAuditortext = grids.loadAuditorAssignmentGridCCIEdits.$gridDiv.jqGrid('getCell', id, 'postBillSelectedAuditor');
                    var postBillRetainAuditorList = postBillSelectedAuditortext.split(",");
                    
                    var cciEditSelectedAuditortext = grids.loadAuditorAssignmentGridCCIEdits.$gridDiv.jqGrid('getCell', id, 'cciEditsSelectedAuditor');
                    var cciEditRetainAuditorList = cciEditSelectedAuditortext.split(",");


                    $("#prebill_auditor_dropdown" + id).val(preBillRetainAuditorList);
                    $("#prebill_auditor_dropdown" + id).multiselect({
                        multiple: true,
                        minWidth: 180,
                        selectedList: 40
                    })
                            .multiselectfilter();

                    $("#postbill_auditor_dropdown" + id).val(postBillRetainAuditorList);
                    $("#postbill_auditor_dropdown" + id).multiselect({
                        multiple: true,
                        minWidth: 180,
                        selectedList: 40
                    })
                            .multiselectfilter();
                    
                    $("#cciEdit_auditor_dropdown" + id).val(cciEditRetainAuditorList);
                    $("#cciEdit_auditor_dropdown" + id).multiselect({
                        multiple: true,
                        minWidth: 180,
                        selectedList: 40
                    })
                            .multiselectfilter();

                    $('.ui-multiselect-filter input').css('width','160px');


                //    log('clicked ' + id + " " + grids.loadAuditorAssignmentGridCCIEdits.$gridDiv.getRowData(id));
                },
                editurl: 'clientArray',
                ignoreCase: true,
                onPaging: function() {
                    grids.loadAuditorAssignmentGridCCIEdits.savePreviousRow();
                    grids.loadAuditorAssignmentGridCCIEdits.selectedRow = undefined;
                },
                onSortCol: function() {
                    grids.loadAuditorAssignmentGridCCIEdits.savePreviousRow();
                    grids.loadAuditorAssignmentGridCCIEdits.selectedRow = undefined;
                },
                cmTemplate: {title: false},
                loadComplete: function() {
//                    grids.loadAuditorAssignmentGrid.$gridDiv.jqGrid('setLabel', 'hospitalName', '', {'text-align': 'left', 'padding-left': '16px', 'width': '256px'});
//                    grids.loadAuditorAssignmentGrid.$gridDiv.jqGrid('setLabel', 'preBillAuditor', '', {'text-align': 'left', 'padding-left': '16px', 'width': '336px'});
//                    grids.loadAuditorAssignmentGrid.$gridDiv.jqGrid('setLabel', 'postBillAuditor', '', {'text-align': 'left', 'padding-left': '16px', 'width': '356px'});
                }
            });

        },
        preBillAuditorChange: function(selectObj, id) {

            var prebill_auditors = $("#prebill_auditor_dropdown" + id).multiselect("getChecked");
            var selected_auditor_list_prebill = new Array();
            //log(prebill_auditors); /*Use the Log statement when required*/
            for (var i = 0; i < prebill_auditors.length; i++) {
                //log($(prebill_auditors[i]).attr('value')); /*Use the Log statement when required*/
                selected_auditor_list_prebill.push($(prebill_auditors[i]).attr('value'));

            }
            grids.loadAuditorAssignmentGridCCIEdits.$gridDiv.jqGrid('setCell', id, 'preBillSelectedAuditor', selected_auditor_list_prebill);

        },
        postBillAuditorChange: function(selectObj, id) {

            var postbill_auditors = $("#postbill_auditor_dropdown" + id).multiselect("getChecked");
            var selected_auditor_list_postbill = new Array();
            //log(postbill_auditors); /*Use the Log statement when required*/
            for (var i = 0; i < postbill_auditors.length; i++) {
                //log($(postbill_auditors[i]).attr('value')); /*Use the Log statement when required*/
                selected_auditor_list_postbill.push($(postbill_auditors[i]).attr('value'));

            }
            grids.loadAuditorAssignmentGridCCIEdits.$gridDiv.jqGrid('setCell', id, 'postBillSelectedAuditor', selected_auditor_list_postbill);

        },
        cciEditsAuditorChange: function(selectObj, id) {

            var cciEdits_auditors = $("#cciEdit_auditor_dropdown" + id).multiselect("getChecked");
            var selected_auditor_list_cciEdits = new Array();
            //log(postbill_auditors); /*Use the Log statement when required*/
            for (var i = 0; i < cciEdits_auditors.length; i++) {
                //log($(postbill_auditors[i]).attr('value')); /*Use the Log statement when required*/
                selected_auditor_list_cciEdits.push($(cciEdits_auditors[i]).attr('value'));

            }
            grids.loadAuditorAssignmentGridCCIEdits.$gridDiv.jqGrid('setCell', id, 'cciEditsSelectedAuditor', selected_auditor_list_cciEdits);

        },
        savePreviousRow: function() {
            if (grids.loadAuditorAssignmentGridCCIEdits.selectedRow !== undefined) {

                grids.loadAuditorAssignmentGridCCIEdits.$gridDiv.jqGrid('saveRow', grids.loadAuditorAssignmentGridCCIEdits.selectedRow);
                var prebill_auditors_text = grids.loadAuditorAssignmentGridCCIEdits.$gridDiv.jqGrid('getCell', grids.loadAuditorAssignmentGridCCIEdits.selectedRow, 'preBillSelectedAuditor');
                var prebill_auditors_list = prebill_auditors_text.split(",");
                var current_prebill_auditors_text = new String();
                
//                var prebill_auditors_text = grids.loadAuditorAssignmentGridCCIEdits.$gridDiv.jqGrid('getCell', grids.loadAuditorAssignmentGridCCIEdits.selectedRow, 'preBillSelectedAuditor');
//                var prebill_auditors_list = prebill_auditors_text.split(",");
//                var current_prebill_auditors_text = new String();
                
                var cciEdits_auditors_text = grids.loadAuditorAssignmentGridCCIEdits.$gridDiv.jqGrid('getCell', grids.loadAuditorAssignmentGridCCIEdits.selectedRow, 'cciEditsSelectedAuditor');
                var cciEdits_auditors_list = cciEdits_auditors_text.split(",");
                var current_cciEdits_auditors_text = new String();

                var preBillOriginalAuditortext = grids.loadAuditorAssignmentGridCCIEdits.$gridDiv.jqGrid('getCell', grids.loadAuditorAssignmentGridCCIEdits.selectedRow, 'originalPreBillSelectedAuditor');
                var preBillOriginalAuditorList = preBillOriginalAuditortext.split(",");

                var postBillOriginalAuditortext = grids.loadAuditorAssignmentGridCCIEdits.$gridDiv.jqGrid('getCell', grids.loadAuditorAssignmentGridCCIEdits.selectedRow, 'originalPostBillSelectedAuditor');
                var postBillOriginalAuditorList = postBillOriginalAuditortext.split(",");
                
                
                var cciEditsOriginalAuditortext = grids.loadAuditorAssignmentGridCCIEdits.$gridDiv.jqGrid('getCell', grids.loadAuditorAssignmentGridCCIEdits.selectedRow, 'originalcciEditsSelectedAuditor');
                var cciEditsOriginalAuditorList = cciEditsOriginalAuditortext.split(",");

                
                var currentHospitalId = grids.loadAuditorAssignmentGridCCIEdits.$gridDiv.jqGrid('getCell', grids.loadAuditorAssignmentGridCCIEdits.selectedRow, 'hospitalId');
                var hospitalIndex;
                var auditorNotFound = false;

                if (preBillOriginalAuditorList.length != prebill_auditors_list.length) {
                    hospitalIndex = jQuery.inArray(currentHospitalId, screens.auditorAssignment.uniqueHospitalList);
                    if (hospitalIndex === -1) {
                        screens.auditorAssignment.uniqueHospitalList.push(currentHospitalId);
                    }
                } else if (prebill_auditors_list.length != 0) {
                    hospitalIndex = jQuery.inArray(currentHospitalId, screens.auditorAssignment.uniqueHospitalList);
                    for (var j = 0; j < preBillOriginalAuditorList.length; j++) {
                        var index = jQuery.inArray(preBillOriginalAuditorList[j], prebill_auditors_list);
                        if (index === -1) {
                            auditorNotFound = true;
                        }
                    }
                    if (auditorNotFound === true) {
                        if (hospitalIndex === -1) {
                            screens.auditorAssignment.uniqueHospitalList.push(currentHospitalId);
                        }
                    } else {
//                      if(hospitalIndex!= -1){
//                          screens.auditorAssignment.uniqueHospitalList.splice(hospitalIndex,1);
//                      }
                    }
                }


                for (var i = 0; i < prebill_auditors_list.length; i++) {
                    current_prebill_auditors_text += prebill_auditors_list[i] + "<br/>";
                }
                grids.loadAuditorAssignmentGridCCIEdits.$gridDiv.jqGrid('setCell', grids.loadAuditorAssignmentGridCCIEdits.selectedRow, 'preBillAuditor', current_prebill_auditors_text);

                var postbill_auditors_text = grids.loadAuditorAssignmentGridCCIEdits.$gridDiv.jqGrid('getCell', grids.loadAuditorAssignmentGridCCIEdits.selectedRow, 'postBillSelectedAuditor');
                var postbill_auditors_list = postbill_auditors_text.split(",");
                var current_postbill_auditors_text = new String();

                if (postBillOriginalAuditorList.length != postbill_auditors_list.length) {
                    hospitalIndex = jQuery.inArray(currentHospitalId, screens.auditorAssignment.uniqueHospitalList);
                    if (hospitalIndex === -1) {
                        screens.auditorAssignment.uniqueHospitalList.push(currentHospitalId);
                    }
                } else if (postbill_auditors_list.length != 0) {
                    hospitalIndex = jQuery.inArray(currentHospitalId, screens.auditorAssignment.uniqueHospitalList);
                    for (var j = 0; j < postBillOriginalAuditorList.length; j++) {
                        var index = jQuery.inArray(postBillOriginalAuditorList[j], postbill_auditors_list);
                        if (index === -1) {
                            auditorNotFound = true;
                        }
                    }
                    if (auditorNotFound === true) {
                        if (hospitalIndex === -1) {
                            screens.auditorAssignment.uniqueHospitalList.push(currentHospitalId);
                        }
                    } else {
//                      if(hospitalIndex!= -1){
//                          screens.auditorAssignment.uniqueHospitalList.splice(hospitalIndex,1);
//                      }
                    }
                }

            //    log(screens.auditorAssignment.uniqueHospitalList);

                for (var i = 0; i < postbill_auditors_list.length; i++) {
                    current_postbill_auditors_text += postbill_auditors_list[i] + "<br/>";
                }
                grids.loadAuditorAssignmentGridCCIEdits.$gridDiv.jqGrid('setCell', grids.loadAuditorAssignmentGridCCIEdits.selectedRow, 'postBillAuditor', current_postbill_auditors_text);
                
                
                // cci edits
                
                
                var cciEdits_auditors_text = grids.loadAuditorAssignmentGridCCIEdits.$gridDiv.jqGrid('getCell', grids.loadAuditorAssignmentGridCCIEdits.selectedRow, 'cciEditsSelectedAuditor');
                var cciEdits_auditors_list = cciEdits_auditors_text.split(",");
                var current_cciEdits_auditors_text = new String();

                if (cciEditsOriginalAuditorList.length != cciEdits_auditors_list.length) {
                    hospitalIndex = jQuery.inArray(currentHospitalId, screens.auditorAssignment.uniqueHospitalList);
                    if (hospitalIndex === -1) {
                        screens.auditorAssignment.uniqueHospitalList.push(currentHospitalId);
                    }
                } else if (cciEdits_auditors_list.length != 0) {
                    hospitalIndex = jQuery.inArray(currentHospitalId, screens.auditorAssignment.uniqueHospitalList);
                    for (var j = 0; j < cciEditsOriginalAuditorList.length; j++) {
                        var index = jQuery.inArray(cciEditsOriginalAuditorList[j], cciEdits_auditors_list);
                        if (index === -1) {
                            auditorNotFound = true;
                        }
                    }
                    if (auditorNotFound === true) {
                        if (hospitalIndex === -1) {
                            screens.auditorAssignment.uniqueHospitalList.push(currentHospitalId);
                        }
                    } else {
//                      if(hospitalIndex!= -1){
//                          screens.auditorAssignment.uniqueHospitalList.splice(hospitalIndex,1);
//                      }
                    }
                }

            //    log(screens.auditorAssignment.uniqueHospitalList);

                for (var i = 0; i < cciEdits_auditors_list.length; i++) {
                    current_cciEdits_auditors_text += cciEdits_auditors_list[i] + "<br/>";
                }
                grids.loadAuditorAssignmentGridCCIEdits.$gridDiv.jqGrid('setCell', grids.loadAuditorAssignmentGridCCIEdits.selectedRow, 'cciEditsAuditor', current_cciEdits_auditors_text);
                
            }
        },
        fillGrid: function() {
            var datalength = this.data.length;
            var preBillAuditors;
            var preBillAuditorsText;
            var postBillAuditors;
            var postBillAuditorText;
            var preBillSelectedAuditors;
            var postBillSelectedAuditors;
            var cciEditsAuditors;
            var cciEditsAuditorsText;
            var cciEditsSelectedAuditors;
            var preQueueAuditors;
            var preQueueAuditorsText;
            var postQueueAuditors;
            var postQueueAuditorsText;
            var preQueueSelectedAuditor;
            var postQueueSelectedAuditor;
           
            for (var i = 0; i < datalength; i++) {
                preBillAuditors = new Array();
                preBillAuditors = grids.loadAuditorAssignmentGridCCIEdits.data[i].preBillAuditors;
                preBillAuditorsText = new String();
                preBillSelectedAuditors = new Array();
                for (var j = 0; j < preBillAuditors.length; j++) {
                    preBillAuditorsText += preBillAuditors[j].userId + '<br/>';
                    preBillSelectedAuditors.push(preBillAuditors[j].userId);
                }

                postBillAuditors = new Array();
                postBillAuditors = grids.loadAuditorAssignmentGridCCIEdits.data[i].postBillAuditors;
                postBillAuditorText = new String();
                postBillSelectedAuditors = new Array();
                for (var k = 0; k < postBillAuditors.length; k++) {
                    postBillAuditorText += postBillAuditors[k].userId + '<br/>';
                    postBillSelectedAuditors.push(postBillAuditors[k].userId);
                }
                
                cciEditsAuditors = new Array();
                cciEditsAuditors = grids.loadAuditorAssignmentGridCCIEdits.data[i].codingEditsAuditors;
                cciEditsAuditorText = new String();
                cciEditsSelectedAuditors = new Array();
                for (var k = 0; k < cciEditsAuditors.length; k++) {
                    cciEditsAuditorText += cciEditsAuditors[k].userId + '<br/>';
                    cciEditsSelectedAuditors.push(cciEditsAuditors[k].userId);
                }

                preQueueAuditors = new Array();
                preQueueAuditors = grids.loadAuditorAssignmentGridCCIEdits.data[i].preBillQueueAuditors;
                preQueueAuditorsText = new String();
                preQueueSelectedAuditor = new Array();
                for (var k = 0; k < preQueueAuditors.length; k++) {
                    preQueueAuditorsText += preQueueAuditors[k].userId + '<br/>';
                    preQueueSelectedAuditor.push(preQueueAuditors[k].userId);
                }

                postQueueAuditors = new Array();
                postQueueAuditors = grids.loadAuditorAssignmentGridCCIEdits.data[i].postBillQueueAuditors;
                postQueueAuditorsText = new String();
                postQueueSelectedAuditor = new Array();
                for (var k = 0; k < postQueueAuditors.length; k++) {
                    postQueueAuditorsText += postQueueAuditors[k].userId + '<br/>';
                    postQueueSelectedAuditor.push(postQueueAuditors[k].userId);
                }



                grids.loadAuditorAssignmentGridCCIEdits.$gridDiv.jqGrid('addRowData', i + 1, {
                    hospitalId: grids.loadAuditorAssignmentGridCCIEdits.data[i].hospitalId,
                    hospitalName: grids.loadAuditorAssignmentGridCCIEdits.data[i].hospitalName,
                    preBillAuditor: preBillAuditorsText,
                    postBillAuditor: postBillAuditorText,
                    cciEditsAuditor: cciEditsAuditorText,
                    preBillSelectedAuditor: preBillSelectedAuditors,
                    postBillSelectedAuditor: postBillSelectedAuditors,
                    cciEditsSelectedAuditor: cciEditsSelectedAuditors,
                    originalPreBillSelectedAuditor: preBillSelectedAuditors,
                    originalPostBillSelectedAuditor: postBillSelectedAuditors,
                    originalcciEditsSelectedAuditor: cciEditsSelectedAuditors,
                    preQueueAuditors: preQueueAuditorsText,
                    postQueueAuditors: postQueueAuditorsText,
                    preQueueSelectedAuditor: preQueueSelectedAuditor,
                    postQueueSelectedAuditor: postQueueSelectedAuditor,


                });
            }
            grids.loadAuditorAssignmentGridCCIEdits.$gridDiv.setGridParam({rowNum: 30}).trigger("reloadGrid");
        }
    },
    /* Auditor Assignment Grid*/

    reportUserAssignmentGrid: {
        $gridDiv: "",
        pagerDiv: "",
        data: {},
        selectedRow: undefined,
        initialize: function(param) {
            this.$gridDiv = $(param.gridDiv);
            this.pagerDiv = param.pagerDiv;
            this.selectedRow = undefined;
            this.data = param.data;
            this.loadData();
            this.fillGrid();
        },
        reloadGrid: function() {
            this.$gridDiv = this.$gridDiv;
            this.$gridDiv.jqGrid('clearGridData');
            this.data = globalvars.reportingAssigmentData;
            this.fillGrid();
        },
        loadData: function() {
            this.$gridDiv.jqGrid({
                datatype: "local",
                autowidth: true,
                height: 'auto',
                pager: this.pagerDiv,
                rowNum: 30,
                rowList: [10, 20, 30, 50],
                pagination: true,
                gridview: true,
                viewrecords: true,
                sortname: '',
                viewsortcols: [false, 'vertical', true],
                altRows: true,
                altclass: 'alternate_row_color',
                colNames: ['Report User', 'USER Full Name', 'Assigned Facility', 'Selected Auditor', 'Original Assigned Auditor'],
                colModel: [
                    {name: 'hospitalName', index: 'hospitalName', classes: 'grid_cell_style'},
                    {name: 'userFullName', index: 'userFullName', hidden: true, classes: 'grid_cell_style'},
                    {name: 'preBillAuditor', index: 'preBillAuditor', editable: true, sortable: false, classes: 'grid_cell_style'},
                    {name: 'preBillSelectedAuditor', index: 'preBillSelectedAuditor', hidden: true, search: true},
                    {name: 'originalPreBillSelectedAuditor', index: 'originalPreBillSelectedAuditor', hidden: true, search: true},
                ],
                onSelectRow: function(id) {

                    grids.reportUserAssignmentGrid.savePreviousRow();
                    grids.reportUserAssignmentGrid.selectedRow = id;

                    var preBillAuditorDropDown = new String();
                    preBillAuditorDropDown = "<div class='prebill_auditor_selector_div'><select id='prebill_auditor_dropdown" + id + "' multiple='multiple' onchange='grids.reportUserAssignmentGrid.preBillAuditorChange(this," + id + ")' style=width:300px;>";
                    preBillAuditorDropDown += globalvars.auditorOptions;
                    preBillAuditorDropDown += "</select></div>";

                    grids.reportUserAssignmentGrid.$gridDiv.jqGrid('editRow', id, true);
                    grids.reportUserAssignmentGrid.$gridDiv.jqGrid('setCell', id, 'preBillAuditor', preBillAuditorDropDown);

                    var preBillSelectedAuditortext = grids.reportUserAssignmentGrid.$gridDiv.jqGrid('getCell', id, 'preBillSelectedAuditor');
                    var preBillRetainAuditorList = preBillSelectedAuditortext.split(",");


                    $("#prebill_auditor_dropdown" + id).val(preBillRetainAuditorList);
                    $("#prebill_auditor_dropdown" + id).multiselect({
                        multiple: true,
                        minWidth: 250,
                        selectedList: 40
                    })
                            .multiselectfilter();


                //    log('clicked ' + id + " " + grids.reportUserAssignmentGrid.$gridDiv.getRowData(id));
                },
                editurl: 'clientArray',
                ignoreCase: true,
                onPaging: function() {
                    grids.reportUserAssignmentGrid.savePreviousRow();
                    grids.reportUserAssignmentGrid.selectedRow = undefined;
                },
                onSortCol: function() {
                    grids.reportUserAssignmentGrid.savePreviousRow();
                    grids.reportUserAssignmentGrid.selectedRow = undefined;
                },
                cmTemplate: {title: false},
                loadComplete: function() {
                    //grids.reportUserAssignmentGrid.$gridDiv.jqGrid('setLabel', 'hospitalName', '', {'text-align':'left', 'padding-left':'16px', 'width':'256px'});
                    //grids.reportUserAssignmentGrid.$gridDiv.jqGrid('setLabel', 'preBillAuditor', '', {'text-align':'left', 'padding-left':'16px', 'width':'336px'});

                }
            });

        },
        preBillAuditorChange: function(selectObj, id) {

            var prebill_auditors = $("#prebill_auditor_dropdown" + id).multiselect("getChecked");
            var selected_auditor_list_prebill = new Array();
            //log(prebill_auditors); /*Use the Log statement when required*/
            for (var i = 0; i < prebill_auditors.length; i++) {
                //log($(prebill_auditors[i]).attr('value')); /*Use the Log statement when required*/
                selected_auditor_list_prebill.push($(prebill_auditors[i]).attr('value'));

            }
            grids.reportUserAssignmentGrid.$gridDiv.jqGrid('setCell', id, 'preBillSelectedAuditor', selected_auditor_list_prebill);

        },
        savePreviousRow: function() {
            if (grids.reportUserAssignmentGrid.selectedRow !== undefined) {

                grids.reportUserAssignmentGrid.$gridDiv.jqGrid('saveRow', grids.reportUserAssignmentGrid.selectedRow);
                var prebill_auditors_text = grids.reportUserAssignmentGrid.$gridDiv.jqGrid('getCell', grids.reportUserAssignmentGrid.selectedRow, 'preBillSelectedAuditor');
                var prebill_auditors_list;
                if(prebill_auditors_text)
                    prebill_auditors_list = prebill_auditors_text.split(",");
                var current_prebill_auditors_text = new String();

                var preBillOriginalAuditortext = grids.reportUserAssignmentGrid.$gridDiv.jqGrid('getCell', grids.reportUserAssignmentGrid.selectedRow, 'originalPreBillSelectedAuditor');
                var preBillOriginalAuditorList=[];
                if(preBillOriginalAuditortext)
                    preBillOriginalAuditorList = preBillOriginalAuditortext.split(",");


                var currentHospitalId = grids.reportUserAssignmentGrid.$gridDiv.jqGrid('getCell', grids.reportUserAssignmentGrid.selectedRow, 'hospitalName');
                var hospitalIndex;
                var auditorNotFound = false;

                if(prebill_auditors_list){

                if (preBillOriginalAuditorList.length != prebill_auditors_list.length) {
                    hospitalIndex = jQuery.inArray(currentHospitalId, screens.reportUserAssignment.uniqueHospitalList);
                    if (hospitalIndex === -1) {
                        screens.reportUserAssignment.uniqueHospitalList.push(currentHospitalId);
                    }
                } else if (prebill_auditors_list.length != 0) {
                    hospitalIndex = jQuery.inArray(currentHospitalId, screens.reportUserAssignment.uniqueHospitalList);
                    for (var j = 0; j < preBillOriginalAuditorList.length; j++) {
                        var index = jQuery.inArray(preBillOriginalAuditorList[j], prebill_auditors_list);
                        if (index === -1) {
                            auditorNotFound = true;
                        }
                    }
                    if (auditorNotFound === true) {
                        if (hospitalIndex === -1) {
                            screens.reportUserAssignment.uniqueHospitalList.push(currentHospitalId);
                        }
                    }
                }



                for (var i = 0; i < prebill_auditors_list.length; i++) {
                    current_prebill_auditors_text += prebill_auditors_list[i] + "<br/>";
                }
                grids.reportUserAssignmentGrid.$gridDiv.jqGrid('setCell', grids.reportUserAssignmentGrid.selectedRow, 'preBillAuditor', current_prebill_auditors_text);
            }

            }
        },
        fillGrid: function() {
            var datalength = this.data.length;
            var preBillAuditors;
            var preBillAuditorsText;
            var preBillSelectedAuditors;

            for (var i = 0; i < datalength; i++) {
                preBillAuditors = new Array();
                preBillAuditors = grids.reportUserAssignmentGrid.data[i].hospitals;
                preBillAuditorsText = new String();
                preBillSelectedAuditors = new Array();
                for (var j = 0; j < preBillAuditors.length; j++) {
                    preBillAuditorsText += preBillAuditors[j].hospitalId + '<br/>';
                    preBillSelectedAuditors.push(preBillAuditors[j].hospitalId);
                }


                grids.reportUserAssignmentGrid.$gridDiv.jqGrid('addRowData', i + 1, {
                    hospitalName: grids.reportUserAssignmentGrid.data[i].userId,
                    userFullName: grids.reportUserAssignmentGrid.data[i].userFullName,
                    preBillAuditor: preBillAuditorsText,
                    preBillSelectedAuditor: preBillSelectedAuditors,
                    originalPreBillSelectedAuditor: preBillSelectedAuditors,
                });
            }
            grids.reportUserAssignmentGrid.$gridDiv.setGridParam({rowNum: 30}).trigger("reloadGrid");
        }
    },
    loadPreBillRemainingAccountsGrid: {
        $gridDiv: "",
        data: {},
        onClick: {},
        initialize: function(param) {
            this.$gridDiv = param.$gridDiv;
            this.data = param.data;
            this.onClick = param.onClick;
            this.loadGrid();
            this.fillGrid();
        },
        loadGrid: function() {
            this.$gridDiv.jqGrid({
                datatype: "local",
                height: 'auto',
                width: 340,
                altRows: true,
                altclass: 'central_auditor_alternate_row_color',
                colNames: ['Facility','', 'ER', 'OBS', 'SUR', 'REST'], /*Grid Column Names are hidden from UI, So these Strings are not added in messages_en_properties*/
                colModel: [
                    {name: 'shortName', index: 'shortName', width: 140, align: 'center', classes: 'facility_cursor'},
                    {name: 'hospitalId', index: 'hospitalId',  hidden:true},
                    {name: 'emergencyCount', index: 'emergencyCount', width: 50, align: 'center'},
                    {name: 'observationCount', index: 'observationCount', width: 50, align: 'center'},
                    {name: 'surgeryCount', index: 'surgeryCount', width: 50, align: 'center'},
                    {name: 'restCount', index: 'restCount', width: 50, align: 'center'}
                ],
                onSelectRow: this.onClick
            });
        },
        fillGrid: function() {
            var datalength = this.data.length;
            for (var i = 0; i < datalength; i++) {
                this.$gridDiv.jqGrid('addRowData', i + 1, this.data[i]);
            }
        }
    },
    loadPostBillRemainingAccountsGrid: {
        $gridDiv: "",
        data: {},
        onClick: {},
        initialize: function(param) {
            this.$gridDiv = param.$gridDiv;
            this.data = param.data;
            this.onClick = param.onClick;
            this.loadGrid();
            this.fillGrid();
        },
        loadGrid: function() {
            this.$gridDiv.jqGrid({
                datatype: "local",
                height: 'auto',
                width: 340,
                altRows: true,
                altclass: 'central_auditor_alternate_row_color',
                colNames: ['Facility','', 'ER', 'OBS', 'SUR', 'REST'], /*Grid Column Names are hidden from UI, So these Strings are not added in messages_en_properties*/
                colModel: [
                           {name: 'shortName', index: 'shortName', width: 140, align: 'center', classes: 'facility_cursor'},
                           {name: 'hospitalId', index: 'hospitalId',  hidden:true},
                           {name: 'emergencyCount', index: 'emergencyCount', width: 50, align: 'center'},
                           {name: 'observationCount', index: 'observationCount', width: 50, align: 'center'},
                           {name: 'surgeryCount', index: 'surgeryCount', width: 50, align: 'center'},
                           {name: 'restCount', index: 'restCount', width: 50, align: 'center'}
                       ],
                onSelectRow: this.onClick
            });
        },
        fillGrid: function() {
            var datalength = this.data.length;
            for (var i = 0; i < datalength; i++) {
                this.$gridDiv.jqGrid('addRowData', i + 1, this.data[i]);
            }
        }
    },
    loadAssocRulesRemainingAccountsGrid: {
        $gridDiv: "",
        data: {},
        onClick: {},
        initialize: function(param) {
            this.$gridDiv = param.$gridDiv;
            this.data = param.data;
            this.onClick = param.onClick;
            this.loadGrid();
            this.fillGrid();
        },
        loadGrid: function() {
            this.$gridDiv.jqGrid({
                datatype: "local",
                height: 'auto',
                width: 340,
                altRows: true,
                altclass: 'central_auditor_alternate_row_color',
                colNames: ['Facility','', 'ER', 'OBS', 'SUR', 'REST'], /*Grid Column Names are hidden from UI, So these Strings are not added in messages_en_properties*/
                colModel: [
                           {name: 'shortName', index: 'shortName', width: 140, align: 'center', classes: 'facility_cursor'},
                           {name: 'hospitalId', index: 'hospitalId',  hidden:true},
                           {name: 'emergencyCount', index: 'emergencyCount', width: 50, align: 'center'},
                           {name: 'observationCount', index: 'observationCount', width: 50, align: 'center'},
                           {name: 'surgeryCount', index: 'surgeryCount', width: 50, align: 'center'},
                           {name: 'restCount', index: 'restCount', width: 50, align: 'center'}
                       ],
                onSelectRow: this.onClick
            });
        },
        fillGrid: function() {
            var datalength = this.data.length;
            for (var i = 0; i < datalength; i++) {
                this.$gridDiv.jqGrid('addRowData', i + 1, this.data[i]);
            }
        }
    },
    loadCciEditsRemainingAccountsGrid: {
        $gridDiv: "",
        data: {},
        onClick: {},
        initialize: function(param) {
            this.$gridDiv = param.$gridDiv;
            this.data = param.data;
            this.onClick = param.onClick;
            this.loadGrid();
            this.fillGrid();
        },
        loadGrid: function() {
            this.$gridDiv.jqGrid({
                datatype: "local",
                height: 'auto',
                width: 340,
                altRows: true,
                altclass: 'central_auditor_alternate_row_color',
                colNames: ['Facility','', 'ER', 'OBS', 'SUR', 'REST'], /*Grid Column Names are hidden from UI, So these Strings are not added in messages_en_properties*/
                colModel: [
                           {name: 'shortName', index: 'shortName', width: 140, align: 'center', classes: 'facility_cursor'},
                           {name: 'hospitalId', index: 'hospitalId',  hidden:true},
                           {name: 'emergencyCount', index: 'emergencyCount', width: 50, align: 'center'},
                           {name: 'observationCount', index: 'observationCount', width: 50, align: 'center'},
                           {name: 'surgeryCount', index: 'surgeryCount', width: 50, align: 'center'},
                           {name: 'restCount', index: 'restCount', width: 50, align: 'center'}
                       ],
                onSelectRow: this.onClick
            });
        },
        fillGrid: function() {
            var datalength = this.data.length;
            for (var i = 0; i < datalength; i++) {
                this.$gridDiv.jqGrid('addRowData', i + 1, this.data[i]);
            }
        }
    },
    loadLiveSummaryByFacilityGrid: function(param) { // param object holds gridDiv, data
        var $gridDiv = $(param.gridDiv);
        var datalength = param.data.length;
        $gridDiv.jqGrid({
            datatype: "jsonstring",
            datastr: param.data,
            autowidth: false,
            height: 'auto',
            treeGrid: true,
            rowNum: 30,
            treeGridModel: 'adjacency',
            ExpandColumn: 'hospitalId',
            rowList: [10, 20, 30, 50],
            sortname: 'hospitalId',
            gridview: true,
            viewrecords: true,
            altRows: true,
            altclass: 'alternate_row_color',
            jsonReader: {
                repeatitems: false,
                root: function(obj) {
                    return obj;
                }
            },
            colNames: [globalvars.localResourceMap.performance_comparison_grid_header1,globalvars.localResourceMap.performance_comparison_grid_header3,
                       globalvars.localResourceMap.performance_comparison_grid_header5,globalvars.localResourceMap.live_summary_grid_completed_account,
                       globalvars.localResourceMap.live_summary_grid_reviewed_account,globalvars.localResourceMap.live_summary_grid_remaining_account,
                       '# Hit Accounts','Amount Found'],
            colModel: [
                {name: 'hospitalId', index: 'hospitalId', width: 75, fixed: true, sortable: true, sorttype: "int", classes: 'cell_wrapperleaf_new'},
                {name: 'name', index: 'name', width: 290, fixed: true, sortable: true, sorttype: "string", classes: 'grid_cell_style'},
                {name: 'totalAccounts', index: 'totalAccounts', width: 75, align: 'center', fixed: true, sortable: true, sorttype: "int",formatter:'integer',formatoptions : {thousandsSeparator: "," }},
                {name: 'completed', index: 'completed', width: 80, align: 'center', fixed: true, sortable: true, sorttype: "int",

                    formatter: function (cellvalue) {

                        return '<span class="cellWithoutBackground" style="background-color:' + grids.getColorCode(cellvalue) + ';">' + numberWithCommas(cellvalue) + '</span>';
                        }
                },
                {name: 'reviewed', index: 'reviewed', width: 75, align: 'center', fixed: true, sortable: true, sorttype: "int"},
                {name: 'remaining', index: 'remaining', width: 75, fixed: true, sortable: true, sorttype: "int", align: 'center',formatter:'integer',formatoptions : {thousandsSeparator: ","}},
                {name: 'hitCount', index: 'hitCount', width: 75, fixed: true, sortable: true, sorttype: "int", align: 'center',formatter:'integer',formatoptions : {thousandsSeparator: ","}},
                {name: 'hitValue', index: 'hitValue', width: 75, fixed: true, sortable: true, sorttype: "int", align: 'center',formatter:'integer',formatoptions : {thousandsSeparator: ",",prefix: "$"}}
            ],
            loadComplete: function() {
                //$gridDiv.jqGrid('setLabel', 'hospitalShortName', '', {'text-align': 'left', 'padding-left': '16px', 'width': '126px'});
//                $gridDiv.jqGrid('setLabel', 'completed', '', {'text-align': 'center', 'width': '105'});
//
//
//
//              var ids = $gridDiv.jqGrid('getDataIDs');
//
//                if (ids) {
//
//                    var sortName = $gridDiv.jqGrid('getGridParam', 'sortname');
//                    for (var i = 0; i < ids.length; i++) {
//                      var cell = $gridDiv.jqGrid("getCell", ids[i], 'completed');
//                      $gridDiv.jqGrid('setCell', ids[i], 'completed', '', '', {style:'background:' + grids.getColorCode(cell)});
//                    }
//                }
//                $gridDiv.jqGrid('setLabel', 'completed', '', {'text-align': 'center','padding-left': '50'});

            }
        });

    },

    loadLiveSummaryByAuditorGrid: function(param) { // param object holds gridDiv, data
        var $gridDiv = $(param.gridDiv);
        var datalength = param.data.length;
        $gridDiv.jqGrid({
            datatype: "jsonstring",
            datastr: param.data,
            autowidth: false,
            height: 'auto',
            treeGrid: true,
            rowNum: 30,
            treeGridModel: 'adjacency',
            ExpandColumn: 'userId',
            rowList: [10, 20, 30, 50],
            sortname: 'userId',
            gridview: true,
            viewrecords: true,
            altRows: true,
            altclass: 'alternate_row_color',
            jsonReader: {
                repeatitems: false,
                root: function(obj) {
                    return obj;
                }
            },
            colNames: [globalvars.localResourceMap.live_summary_grid_auditor,globalvars.localResourceMap.live_summary_grid_facility_name,
                       globalvars.localResourceMap.performance_comparison_grid_header5, globalvars.localResourceMap.live_summary_grid_completed_account,
                       globalvars.localResourceMap.live_summary_grid_reviewed_account,globalvars.localResourceMap.live_summary_grid_remaining_account,
                       "# " + globalvars.localResourceMap.live_summary_grid_hit_account,globalvars.localResourceMap.live_summary_grid_amount_found],
            colModel: [
                {name: 'userId', index: 'userId', width: 150, fixed: true, sortable: true, sorttype: "int", classes: 'cell_wrapperleaf_new'},
                {name: 'name', index: 'name', width: 215, fixed: true, sortable: true, sorttype: "string", classes: 'grid_cell_style'},
                {name: 'totalAccounts', index: 'totalAccounts', width: 75, align: 'center', fixed: true, sortable: true, sorttype: "int",formatter:'integer',formatoptions : {thousandsSeparator: ","}},
                {name: 'completed', index: 'completed', width: 80,  align: 'center', fixed: true, sortable: true, sorttype: "int",
                    formatter: function (cellvalue) {

                    return '<span class="cellWithoutBackground" style="background-color:' + grids.getColorCode(cellvalue) + ';">' + numberWithCommas(cellvalue) + '</span>';
                    }

                },
                {name: 'reviewed', index: 'reviewed', width: 75, align: 'center', fixed: true, sortable: true, sorttype: "int"},
                {name: 'remaining', index: 'remaining', width: 75, fixed: true, sortable: true, sorttype: "int", align: 'center',formatter:'integer',formatoptions : {thousandsSeparator: ","}},
                {name: 'hitCount', index: 'hitCount', width: 75, fixed: true, sortable: true, sorttype: "int", align: 'center',formatter:'integer',formatoptions : {thousandsSeparator: ","}},
                {name: 'hitValue', index: 'hitValue', width: 75, fixed: true, sortable: true, sorttype: "int", align: 'center',formatter:'integer',formatoptions : {thousandsSeparator: "," ,prefix: "$"}}
            ],
            loadComplete: function() {


            }
        });

    },
    loadHitRateAnalysisGrid: {
        gridDiv: "",
        $gridDiv: {},
        pagerDiv: "",
        data: {},
        initialize: function(param) {
            log(param);
            this.gridDiv = param.gridDiv;
            this.$gridDiv = $(param.gridDiv);
            this.pagerDiv = param.pagerDiv;
            this.data = param.data;
            this.loadGrid();
           // this.fillGrid();
        },
        reloadGrid: function(data) {
            this.$gridDiv = $(this.gridDiv);
            this.$gridDiv.jqGrid('GridUnload');
           this.data = data;
            this.$gridDiv = $(this.gridDiv);
            this.loadGrid();
            //this.fillGrid();
            this.$gridDiv.setGridParam({rowNum: 30, sortname: 'hidden'}).trigger("reloadGrid");
        },
        loadGrid: function() {
            this.$gridDiv.jqGrid({
                datatype: "jsonstring",
                datastr: grids.loadHitRateAnalysisGrid.data,
                autowidth: false,
                height: 'auto',
                treeGrid: true,
                rowNum: 30,
                treeGridModel: 'adjacency',
                ExpandColumn: 'shortName',
                rowList: [10, 20, 30, 50],
                sortname: 'weekTotalCount',
                gridview: true,
                viewrecords: true,
                altRows: true,
                altclass: 'alternate_row_color',
                jsonReader: {
                    repeatitems: false,
                    root: function(obj) {
                        return obj;
                    }
                },
                colNames: ['rank',globalvars.localResourceMap.hit_rate_analysis_facility,' ',globalvars.localResourceMap.hit_rate_analysis_p_code, globalvars.localResourceMap.hit_rate_analysis_auditor,
                           globalvars.localResourceMap.hit_rate_analysis_account_lw, globalvars.localResourceMap.hit_rate_analysis_account_pw, 
                           globalvars.localResourceMap.hit_rate_analysis_hit_lw, globalvars.localResourceMap.hit_rate_analysis_hit_pw, 
                           globalvars.localResourceMap.hit_rate_analysis_amount_lw,globalvars.localResourceMap.hit_rate_analysis_amount_pw],
                colModel: [
                    {name: 'rank', index: 'rank',fixed: true, sortable: false,sorttype: "int", hidden:true}, 
                    {name: 'shortName', index: 'shortName', width: 120, align: 'left', fixed: true,sortable: true,sorttype: "string"},
                    {name: 'filterField', index: 'filterField', width: 120, fixed: true, sortable: true, sorttype: "int", classes: 'cell_wrapperleaf_new',hidden:true},
                    {name: 'pCode', width: 130,  fixed: true, sortable: false,sorttype: "int"}, 
//                  {name: 'name', index: 'name', width: 120, fixed: true, sortable: true, sorttype: "string", classes: 'grid_cell_style'},
                    {name: 'auditorId', index: 'auditorId', width: 120, align: 'left', fixed: true, sortable: true},
                    
                    {name: 'weekTotalCount', index: 'weekTotalCount', width: 80, align: 'center', fixed: true, sortable: true, sorttype: "number",formatter: 'number', formatoptions: { decimalPlaces: 2},},
                    {name: 'pweekTotalCount', index: 'pweekTotalCount', width: 80, fixed: true, sortable: true, sorttype: "int",formatter: 'number', formatoptions: { decimalPlaces: 2}, align: 'center'},
                    {name: 'weekHitRt', index: 'weekHitRt', width: 80, fixed: true, sortable: true, sorttype: "int",formatter: 'number', formatoptions: { decimalPlaces: 0}, align: 'center'},
                    {name: 'pweekHitRt', index: 'pweekHitRt', width: 80, fixed: true, sortable: true, sorttype: "int",formatter: 'number', formatoptions: { decimalPlaces: 0}, align: 'center'},
                    {name: 'weekAmount', index: 'weekAmount', width: 80, fixed: true, sortable: true, sorttype: "int",formatter: 'number', formatoptions: { decimalPlaces: 0}, align: 'center'},
                    {name: 'pWeekAmount', index: 'pWeekAmount', width: 80, fixed: true, sortable: true, sorttype: "int",formatter: 'number', formatoptions: { decimalPlaces: 0}, align: 'center'}
                ],
                loadComplete: function() {
                }
            });
        },
        fillGrid: function() {
            var datalength = this.data.length;

            for (var i = 0; i < datalength; i++) {
                grids.loadHitRateAnalysisGrid.data[i].index = i;
                grids.loadHitRateAnalysisGrid.$gridDiv.jqGrid('addRowData', i + 1, grids.billAccountReviewGrid.data[i]);
            }
            ;

            grids.loadHitRateAnalysisGrid.$gridDiv.setGridParam({rowNum: 30}).trigger("reloadGrid");

            if (datalength == 0) {
                dialogs.messageDialog.show({text: globalvars.localResourceMap.no_account_pending_msg});
            }
            ;
        }
    },
    loadVolumeAnalysisGrid: {
        $gridDiv: "",
        data: {},
        headerData:[],
        onClick: {},
        initialize: function(param) {
            this.$gridDiv = $(param.gridDiv);
            this.data = param.data;
            this.headerData = param.headerData
            this.onClick = param.onClick;
            this.loadGrid(this.headerData);
            this.fillGrid();
        },
        loadGrid: function(weekData) {
            this.$gridDiv.jqGrid({
                datatype: "local",
                height: 'auto',
                altRows: true,
                altclass: 'central_auditor_alternate_row_color',
                colNames: ['Facility',weekData[0],weekData[1],weekData[2],weekData[3],weekData[4],weekData[5],weekData[6],'Week Diff', 'Today #' ], /*Grid Column Names are hidden from UI, So these Strings are not added in messages_en_properties*/
                colModel: [
                           {name: 'shortName', index: 'shortName', width: 100, align: 'center', classes: 'accountlist-account-cursor'},
                           {name: weekData[0], index: weekData[0], width: 45, align: 'center',
                               
                               formatter: function (cellvalue) {
                                   var color = (cellvalue > 0)?'#00CC00':'#FF5050';
                                    return '<span class="cellBackcolor" style="background-color:' + color + ';">' + cellvalue + '</span>';
                               }
                           
                           },
                           {name: weekData[1], index: weekData[0], width: 45, align: 'center',
                               
                               formatter: function (cellvalue) {
                                   var color = (cellvalue > 0)?'#00CC00':'#FF5050';
                                    return '<span class="cellBackcolor" style="background-color:' + color + ';">' + cellvalue + '</span>';
                               }
                           },
                           {name: weekData[2], index: weekData[0], width: 45, align: 'center',
                               
                               formatter: function (cellvalue) {
                                   var color = (cellvalue > 0)?'#00CC00':'#FF5050';
                                    return '<span class="cellBackcolor" style="background-color:' + color + ';">' + cellvalue + '</span>';
                               }
                           },
                           {name: weekData[3], index: weekData[0], width: 45, align: 'center',
                               formatter: function (cellvalue) {
                                   var color = (cellvalue > 0)?'#00CC00':'#FF5050';
                                    return '<span class="cellBackcolor" style="background-color:' + color + ';">' + cellvalue + '</span>';
                               }   
                           },
                           {name: weekData[4], index: weekData[0], width: 45, align: 'center',
                               
                               formatter: function (cellvalue) {
                                   var color = (cellvalue > 0)?'#00CC00':'#FF5050';
                                    return '<span class="cellBackcolor" style="background-color:' + color + ';">' + cellvalue + '</span>';
                               }
                           },
                           {name: weekData[5], index: weekData[0], width: 45, align: 'center',
                               
                               formatter: function (cellvalue) {
                                   var color = (cellvalue > 0)?'#00CC00':'#FF5050';
                                    return '<span class="cellBackcolor" style="background-color:' + color + ';">' + cellvalue + '</span>';
                               }
                           
                           },
                           {name: weekData[6], index: weekData[0], width: 45, align: 'center',
                               
                               formatter: function (cellvalue) {
                                   var color = (cellvalue > 0)?'#00CC00':'#FF5050';
                                    return '<span class="cellBackcolor" style="background-color:' + color + ';">' + cellvalue + '</span>';
                               }
                           
                           },
                           {name: 'totalDiff', index: 'totalDiff', width: 45, align: 'center'},
                           {name: 'currentDayTotal', index: 'currentDayTotal', width: 50, align: 'center'}
                           
                           
                           
//                           {name: 'completed', index: 'completed', width: 80,  align: 'center', fixed: true, sortable: true, sorttype: "int",
//                              formatter: function (cellvalue) {
//
//                              return '<span class="cellWithoutBackground" style="background-color:' + grids.getColorCode(cellvalue) + ';">' + cellvalue + '</span>';
//                              }
//
//                           },

                           
                       ],
                onSelectRow: this.onClick
            });
        },
        fillGrid: function() {
            var datalength = this.data.length;
            for (var i = 0; i < datalength; i++) {
                var totalDiff=0;
                totalDiff = (this.data[i].Mon + this.data[i].Sun + this.data[i].Tue + this.data[i].Wed + this.data[i].Thu + this.data[i].Fri + this.data[i].Sat);
                this.data[i].totalDiff = totalDiff;
                this.$gridDiv.jqGrid('addRowData', i + 1, this.data[i]);
            }
        }
    },
    ruleSummaryGrid: {
        gridDiv: "",
        $gridDiv: {},
        pagerDiv: "",
        data: {},
        initialize: function(param) {
        //    log(param);
            this.gridDiv = param.gridDiv;
            this.$gridDiv = $(param.gridDiv);
            this.pagerDiv = param.pagerDiv;
            this.data = param.data;
            this.loadGrid();
            this.fillGrid();
        },
        reloadGrid: function(data) {
            this.$gridDiv = $(this.gridDiv);
            this.$gridDiv.jqGrid('GridUnload');
           this.data = data;
            this.$gridDiv = $(this.gridDiv);
            this.loadGrid();
            //this.fillGrid();
            this.$gridDiv.setGridParam({rowNum: 30, sortname: 'hidden'}).trigger("reloadGrid");
        },
        loadGrid: function() {
            this.$gridDiv.jqGrid({
                datatype: "local",
                //datastr: grids.ruleSummaryGrid.data,
                autowidth: false,
                height: 'auto',
                pager: this.pagerDiv,
                rowNum: 30,
                rowList: [10, 20, 30, 50],
                pagination: true,
                gridview: true,
                viewrecords: true,
                altRows: true,
                altclass: 'alternate_row_color',
                sortname: 'ruleId',
                viewsortcols: [false, 'vertical', true],
                
                
                colNames: ['Rule Name','','Rule Type','Primary Table','Last Modified By','Last Modified On','Status','','',''],
                colModel: [
                    
                    {name: 'ruleId', index: 'ruleId', width: 200, align: 'left',sortable: true,sorttype: "string",classes: 'accountlist-account-cursor'},
                    {name: 'displayName', index: 'displayName', hidden:true},
                    {name: 'ruleType', index: 'ruleType', width: 200, align: 'center', fixed: true, sortable: true,sorttype: "string"},
//                  
                    {name: 'primaryTable', width: 200,  fixed: true, sortable: true,sorttype: "string",align: 'center'}, 
//                  {name: 'name', index: 'name', width: 120, fixed: true, sortable: true, sorttype: "string", classes: 'grid_cell_style'},
//                  
                    
                    {name: 'modifiedBy', index: 'modifiedBy', width: 200, align: 'center', fixed: true, sortable: true},
                    {name: 'updateTime', index: 'updateTime', width: 200, align: 'center', fixed: true, sortable: true},
                    {name: 'active', index: 'active', width: 100, fixed: true, sortable: true, sorttype: "string", align: 'center'},
                    
                    {name: 'ruleDesc', index: 'ruleDesc', width: 300, fixed: true, sortable: true, sorttype: "int", classes: 'cell_wrapperleaf_new',hidden:true},
                    {name: 'ruleJson', index: 'ruleJson', width: 400, align: 'left', fixed: true, sortable: true,classes:'jqgrid-wrapText',hidden:true},
                    
                    {name: 'computedQuery', index: 'computedQuery', width: 400, align: 'left', fixed: true, sortable: true, sorttype: "int",classes:'jqgrid-wrapText',hidden:true},
                    
                ],
                onSelectRow: function(id, status, e) {

                    var rowData = grids.ruleSummaryGrid.$gridDiv.jqGrid('getRowData', id);
                    var colIndex = $(e.target).index();
                //    console.log(colIndex);
                    if(colIndex==0){
                        //var gridData = grids.ruleSummaryGrid.$gridDiv.jqGrid("getGridParam", "dataNew");
                //        console.log(rowData)
                        if(rowData){

                            $.ajax({
                                type: 'GET',
                                url: globalvars.root.ruleList+"/ruleDetail",
                                data: {"ruleId": rowData.ruleId},
                                dataType: "json",
                                success: function(data) {
                                    if(data){
                                        ruleSummary = data;
                                        localStorage.setItem('ruleSummary', JSON.stringify(ruleSummary));            
                                        $("#sub_menu #Configuration li.submenu_item").eq(1).click();
                                    }
                                },
                                error: function(jqxhr) {
                                    //alert('Error...');
                                }
                                });

                        }


                    }

                },
                loadComplete: function() {
                }
            });
        },
        fillGrid: function() {
            
             var datalength = this.data.length;

             for (var i = 0; i < datalength; i++) {
                 grids.ruleSummaryGrid.data[i].index = i;
                 grids.ruleSummaryGrid.$gridDiv.jqGrid('addRowData', i + 1, grids.ruleSummaryGrid.data[i]);
             }
             ;

             grids.ruleSummaryGrid.$gridDiv.setGridParam({rowNum: 30}).trigger("reloadGrid");
            
            
            
//            var datalength = this.data.length;
//
//            for (var i = 0; i < datalength; i++) {
//                grids.ruleSummaryGrid.data[i].index = i;
//                grids.ruleSummaryGrid.$gridDiv.jqGrid('addRowData', i + 1, grids.billAccountReviewGrid.data[i]);
//            }
//            ;
//
//            grids.loadHitRateAnalysisGrid.$gridDiv.setGridParam({rowNum: 30}).trigger("reloadGrid");
//
//            if (datalength == 0) {
//                dialogs.messageDialog.show({text: globalvars.localResourceMap.no_account_pending_msg});
//            }
//            ;
        }
    },
     configCDMAGrid: {
        gridDiv: "",
        $gridDiv: {},
        pagerDiv: "",
        data: {},
        localPostData:{},
        initialize: function(param) {
            this.gridDiv = param.gridDiv;
            this.$gridDiv = $(param.gridDiv);
            this.pagerDiv = param.pagerDiv;
            this.data = param.data;
            this.loadGrid();
            this.fillGrid();
        },
        reloadGrid: function(data) {
            this.$gridDiv = $(this.gridDiv);
            this.$gridDiv.jqGrid('GridUnload');
           this.data = data;
            this.$gridDiv = $(this.gridDiv);
            this.loadGrid();
            this.$gridDiv.setGridParam({rowNum: 30, sortname: 'hidden'}).trigger("reloadGrid");
        },
        initDateEdit : function (elem) {
                    setTimeout(function () {
                        $(elem).datepicker({
                            dateFormat: "yy-mm-dd",
                            showOn: "button",
                            changeYear: true,
                            changeMonth: true,
                            showButtonPanel: true,
                            showWeek: true
                        });
                    }, 50);
        },
        
        loadGrid: function() {

            //var API_URL = "api/products/";
            this.$gridDiv.jqGrid({
                datatype: "local",
                pager: this.pagerDiv,
                viewrecords: true,
                editable: true,
                autowidth: true,
                rowNum: 30,
                rowList: [10, 20, 30, 50],
                pagination: true,
                gridview: true,
                altRows: true,
                altclass: 'alternate_row_color',                               
                colNames: ['Facility Id','Dept',globalvars.localResourceMap.missing_charge_charge_code,globalvars.localResourceMap.missing_charge_charge_description,'Hcpc Desc','Modifier Desc','Hcpc','Modifier','Hcpc 2','Modifier 2','Hcpc 3','Modifier 3','Hcpc 4','Modifier 4','Hcpc 5','Modifier 5','Hcpc 6','Modifier 6','Rev Code','Pred Code','Price','Effective Date', 'Frequency'],
                colModel: [
                    
                    {name: 'hospitalId', index: 'hospitalId', width:90, editable: true,editoptions:{maxlength:10},align: "center",formoptions:{elmsuffix:'(*)'},editrules: { required: true}},
                    {name: 'dept', index: 'dept',  editable: true,width:90,editoptions:{maxlength:10},align: "center",formoptions:{elmsuffix:'(*)'},editrules: { required: true}},
                    {name: 'chargeCode', index: 'chargeCode', width:100, editable: true,editoptions:{maxlength:10},align: "center",formoptions:{elmsuffix:'(*)'},editrules: { required: true}},
                    {name: 'chargeDescription', index: 'chargeDescription',  width:150,editable: true,editoptions:{maxlength:100},align: "center"},
                    {name: 'hcpcDesc', index: 'hcpcDesc',  width:110,editable: false,editoptions:{maxlength:5},align: "center"},
                    {name: 'modifierDesc', index: 'modifierDesc',  width:110,editable: false,editoptions:{maxlength:2},align: "center"},
                    {name: 'hcpc', index: 'hcpc',  width:110,editable: true,editoptions:{maxlength:5},align: "center",hidden:true,editrules:{edithidden:true}},
                    {name: 'modifier', index: 'modifier',  width:110,editable: true,editoptions:{maxlength:2},align: "center",hidden:true,editrules:{edithidden:true}},
                    {name: 'hcpc2', index: 'hcpc2',  width:40,editable: true,hidden:true,editrules:{edithidden:true},editoptions:{maxlength:5}},
                    {name: 'modifier2', index: 'modifier2', width:40, editable: true,hidden:true,editrules:{edithidden:true},editoptions:{maxlength:2}},
                    {name: 'hcpc3', index: 'hcpc3', width:40, editable: true,hidden:true,editrules:{edithidden:true},editoptions:{maxlength:5}},
                    {name: 'modifier3', index: 'modifier3', width:40, editable: true,hidden:true,editrules:{edithidden:true},editoptions:{maxlength:2}},
                    {name: 'hcpc4', index: 'hcpc4', width:40, editable: true,hidden:true,editrules:{edithidden:true},editoptions:{maxlength:5}},
                    {name: 'modifier4', index: 'modifier4', width:40, editable: true,hidden:true,editrules:{edithidden:true},editoptions:{maxlength:2}},
                    {name: 'hcpc5', index: 'hcpc5', width:40, editable: true,hidden:true,editrules:{edithidden:true},editoptions:{maxlength:5}},
                    {name: 'modifier5', index: 'modifier5',width:40,  editable: true,hidden:true,editrules:{edithidden:true},editoptions:{maxlength:2}},
                    {name: 'hcpc6', index: 'hcpc6', width:40, editable: true,hidden:true,editrules:{edithidden:true},editoptions:{maxlength:5}},
                    {name: 'modifier6', index: 'modifier6',width:40,  editable: true,hidden:true,editrules:{edithidden:true},editoptions:{maxlength:2}},
                    // {name: 'deptDescription', index: 'deptDescription', width:100, editable: true,editoptions:{maxlength:200}},
                    {name: 'revenueCode', index: 'revenueCode', width:100, editable: true,editoptions:{maxlength:3},align: "center"},
                    {name: 'predCode', index: 'predCode', width:90, editable: true,editoptions:{ maxlength:50},align: "center"},
                    {name: 'price', index: 'price',width:90,  editable: true,align: "center",editrules: { number: true},sorttype: "int",formatter:'currency',
                     formatoptions: { decimalSeparator: ".", thousandsSeparator: ",", prefix: "$",decimalPlaces: 1, defaultValue: '$0.0'},editoptions:{maxlength:13, dataInit: function(element) {
                    $(element).keypress(function(e){
                         if (e.which != 8 && e.which != 0 && e.which != 46 && (e.which < 48 || e.which > 57)) {
                            return false;
                         }
                    });
                }}},
                    {name: 'effectiveDate', index: 'effectiveDate',width:100,  editable: true,sorttype: "date",
                        editoptions: {dataInit: grids.configCDMAGrid.initDateEdit, size: 14},align: "center"},
                    // {name: 'origFileNameDate', index: 'origFileNameDate',width:65,  editable: true},
                    // {name: 'fileLoadTimestamp', index: 'fileLoadTimestamp',width:65, editable: true}

                    {name: 'freqCount', index: 'freqCount', width:80, editable: true,editrules:{edithidden:true},editoptions:{maxlength:5},sorttype: "int"}


                    
                ]
               
              
            });

            // function updateDialog(action) {
            //     return {
            //         url: API_URL
            //         , closeAfterAdd: true
            //         , closeAfterEdit: true
            //         , afterShowForm: function (formId) { }
            //         , modal: true
            //         , onclickSubmit: function (params) {
            //             var list = $("#rule_grid_table");
            //             var selectedRow = list.getGridParam("selrow");
            //             rowData = list.getRowData(selectedRow);
            //             console.log(rowData)
            //             console.log(rowData.Id)

            //             params.url += rowData.Id;
            //             params.mtype = action;
            //         }
            //         , width: "600"
            //     };
            // }
 
 
            jQuery("#rule_grid_table").jqGrid('navGrid', '#prebill_grid_pager',
            {   edit:(globalvars.user.uType == globalvars.roles.supervisor)?false:true, 
                edittitle: "Edit Row", 
                width: 500,
                add:(globalvars.user.uType == globalvars.roles.supervisor)?false:true, 
                addtitle: "Add Row", 
                width: 500,
                del:(globalvars.user.uType == globalvars.roles.supervisor)?false:true,
                search: false,
                refresh: false,
                view:(globalvars.user.uType == globalvars.roles.supervisor)?true:false,
                closeAfterEdit:true,
                closeAfterAdd:true,
               
            },
            
             //Edit Options. save key parameter will keybind the Enter key to submit.
            {
                url: globalvars.root.chargeMasterUri,
                editCaption: "Edit Row", 
                edittext: "Edit", 
                closeOnEscape: true, 
                closeAfterEdit: true, 
                savekey: [true, 13], 
                errorTextFormat: commonError, 
                width: "500", 
                reloadAfterSubmit: true, 
                top: "40", 
                left: "350", 
                right: "5",
                recreateForm: true,
                // onInitializeForm: function ($form) {
                //     $form.css({height: "auto"});
                //     $form.closest(".ui-jqdialog").css({height:"75"});
                //     $form.closest(".ui-jqdialog").css({width:"250"});

                // },
                beforeShowForm: function(form) {
                    
                 
                    $('#hospitalId', form).attr("readonly","readonly");
                    $('#dept', form).attr("readonly","readonly");
                    $('#chargeCode', form).attr("readonly","readonly");
                    $('#freqCount', form).attr("readonly","readonly");
                    
                 },

                ajaxEditOptions: { contentType: "application/json" },
                beforeSubmit : function(postdata, formid) {
                            // grids.configCDMAGrid.localPostData = postdata;
                            // console.log(postdata);
                            return[true,'edit data']; 
                },
                serializeEditData: function(postData) {
                      return JSON.stringify(postData);
                },
                
                afterComplete:function(response, postdata, formid){
                        var responseTextStr = JSON.parse(response.responseText);
                        if (responseTextStr.status == "SUCCESS") {
                           dialogs.messageDialogUpdateCDM.show({title: globalvars.localResourceMap.message, text: 'Record Updated successfully'});
                           return [true, responseTextStr.status]
                        }
                       else {
                           dialogs.messageDialog.show({title: globalvars.localResourceMap.error, text: 'Unexpected problem encountered. Please contact your Administrator.'});
                           return [false, responseTextStr.status]
                           //Captures and displays the response text on th Edit window
                        }
                }

            
                },
                
                 {
                url: globalvars.root.chargeMasterUri,
                addCaption: "Add Row", 
                addtext: "Add", 
                closeOnEscape: true, 
                closeAfterEdit: true,
                closeAfterAdd:true, 
                savekey: [true, 13], 
                errorTextFormat: commonError, 
                width: "500", 
                reloadAfterSubmit: true, 
                top: "40", 
                left: "350", 
                right: "5",
                ajaxEditOptions: { contentType: "application/json" },
                beforeShowForm: function(form) { 
                    $('#hospitalId', form).removeAttr("readonly");
                    $('#dept', form).removeAttr("readonly");
                    $('#chargeCode', form).removeAttr("readonly");
                    $('#freqCount', form).attr("readonly","readonly");

                 },
                 serializeEditData: function(postData) {
                    return JSON.stringify(postData);
                 },
                 // errorTextFormat: function (response) {
                 //    if(response.status == 201){
                 //        $('.ui-state-error').removeClass();
                 //    return '<div style="color:green">'+
                 //                     '<span class="ui-icon ui-icon-check" style="float: left; margin-right: .3em;color:green"></span>' +
                 //                     '<strong>Row added successfully:</strong><br/></div>';
                 //    }
                 //    else{
                 //        return '<span class="ui-icon ui-icon-alert" style="float: left; margin-right: .3em;"></span>'+
                 //               "<strong>My error information:<strong></br>Status: '" +
                 //                 response.statusText + "'. Error code: " + response.status;
                 //    }

                 // },
                 afterComplete:function(response, postdata, formid){
                      var responseTextStr = JSON.parse(response.responseText);
                        if (responseTextStr.status == "SUCCESS") {
                           dialogs.messageDialogUpdateCDM.show({title: globalvars.localResourceMap.message, text: 'Record Added successfully'});
                           return [true, responseTextStr.status]
                        }
                       else {
                           dialogs.messageDialog.show({title: globalvars.localResourceMap.error, text: 'Unexpected problem encountered. Please contact your Administrator.'});
                           return [false, responseTextStr.status]
                           //Captures and displays the response text on th Edit window
                        }

                   }   
                // onclickSubmit: function (response, postdata) {
                //     AddPost(postdata);
                // }
            },
            //delete Options. save key parameter will keybind the Enter key to submit.
            {
                url: globalvars.root.chargeMasterUri,
                deleteCaption: "delete row", 
                deletetext: "Delete row", 
                closeOnEscape: true, 
                closeAfterEdit: true, 
                savekey: [true, 13], 
                errorTextFormat: commonError, 
                width: "500", 
                reloadAfterSubmit: true, 
                bottominfo: "Fields marked with (*) are required", 
                top: "60", 
                left: "300", 
                right: "5",
                ajaxDelOptions: { contentType: "application/json" },
                serializeDelData: function(postData) {
                    var rowdata = jQuery('#rule_grid_table').getRowData(postData.id);
                     rowdata.oper="del";
                     rowdata.id= postData.id;// append postdata with any information 
                    //return {id: postdata.id, oper: postdata.oper, user_id: rowdata.user_id};
                    return JSON.stringify(rowdata);
                 },
                 //  errorTextFormat: function (response) {
                 //    if(response.status == 201){
                 //        $('.ui-state-error').removeClass();
                 //    return '<div style="color:green">'+
                 //                     '<span class="ui-icon ui-icon-check" style="float: left; margin-right: .3em;color:green"></span>' +
                 //                     '<strong>Row deleted successfully:</strong><br/></div>';
                 //    }
                 //    else{
                 //        return '<span class="ui-icon ui-icon-alert" style="float: left; margin-right: .3em;"></span>'+
                 //               "<strong>My error information:<strong></br>Status: '" +
                 //                 response.statusText + "'. Error code: " + response.status;
                 //    }

                 // },
                 afterComplete:function(response, postdata, formid){
                       var responseTextStr = JSON.parse(response.responseText);
                        if (responseTextStr.status == "SUCCESS") {
                           dialogs.messageDialogUpdateCDM.show({title: globalvars.localResourceMap.message, text: 'Record deleted successfully'});
                           return [true, responseTextStr.status]
                        }
                       else {
                           dialogs.messageDialog.show({title: globalvars.localResourceMap.error, text: 'Unexpected problem encountered. Please contact your Administrator.'});
                           return [false, responseTextStr.status]
                           //Captures and displays the response text on th Edit window
                        }

                   }   
               
            },
            {
                //search Option
            },
            {
                addCaption: "View Row", 
                addtext: "View", 
                closeOnEscape: true, 
                closeAfterEdit: true,
                closeAfterAdd:true, 
                savekey: [true, 13], 
                width: "500", 
                top: "40", 
                left: "350", 
                right: "5"
            }
                                              



            )

            function commonError(data) {
                return "Error Occured during Operation. Please try again";
            }
               

            },
        fillGrid: function() {
            
             var datalength = this.data.length;

             for (var i = 0; i < datalength; i++) {
                 grids.configCDMAGrid.data[i].index = i;
                 grids.configCDMAGrid.$gridDiv.jqGrid('addRowData', i + 1, grids.configCDMAGrid.data[i]);
             }
             ;

             grids.configCDMAGrid.$gridDiv.setGridParam({rowNum: 30}).trigger("reloadGrid");
            
 
        }
    },
    CodesSummaryGrid: {
        gridDiv: "",
        $gridDiv: {},
        pagerDiv: "",
        data: {},
        initialize: function(param) {
        //    log(param);
            this.gridDiv = param.gridDiv;
            this.$gridDiv = $(param.gridDiv);
            this.pagerDiv = param.pagerDiv;
            this.data = param.data;
            this.loadGrid();
            this.fillGrid();
        },
        reloadGrid: function(data) {
            this.$gridDiv = $(this.gridDiv);
            this.$gridDiv.jqGrid('GridUnload');
           this.data = data;
            this.$gridDiv = $(this.gridDiv);
            this.loadGrid();
            //this.fillGrid();
            this.$gridDiv.setGridParam({rowNum: 30, sortname: 'hidden'}).trigger("reloadGrid");
        },
        loadGrid: function() {
            this.$gridDiv.jqGrid({
                datatype: "local",
                //datastr: grids.ruleSummaryGrid.data,
                autowidth: false,
                height: 'auto',
                pager: this.pagerDiv,
                rowNum: 30,
                rowList: [10, 20, 30, 50],
                pagination: true,
                gridview: true,
                viewrecords: true,
                altRows: true,
                altclass: 'alternate_row_color',
                sortname: 'ruleId',
                viewsortcols: [false, 'vertical', true],
                
                
                colNames: ['','Query Name','Bill Type','Sent Flag','Code Level','Status','Run Status','Last Modified By','Last Updated Time','Run At'],
                colModel: [
                    {name: 'rowId', index: 'rowId',hidden:true},
                    {name: 'ruleName', index: 'ruleName', width: 120, align: 'center',sortable: true,sorttype: "string",classes: 'accountlist-account-cursor'},
                    {name: 'billType', index: 'billType', width: 120, align: 'center',sorttype: true},
                    {name: 'sentFlag', index: 'sentFlag', width: 120, align: 'center', fixed: true, sortable: true,sorttype: "string"},
//                  
                    {name: 'codeLevel', width: 120,  fixed: true, sortable: true,sorttype: "string",align: 'center'}, 
//                  {name: 'name', index: 'name', width: 120, fixed: true, sortable: true, sorttype: "string", classes: 'grid_cell_style'},
//                  
                    
                    {name: 'isActive', index: 'isActive', width: 60, align: 'center', fixed: true, sortable: true},
                    {name: 'isRun', index: 'isRun', width: 60, align: 'center', fixed: true, sortable: true},
                    {name: 'modifiedBy', index: 'modifiedBy', width: 120, fixed: true, sortable: true, sorttype: "string", align: 'center'},
                    
                    {name: 'updateTime', index: 'updateTime', width: 180, fixed: true, sortable: true, sorttype: "string",align: 'center'},
                    {name: 'runAt', index: 'runAt', width: 180, align: 'center', fixed: true, sortable: true}
                    
                 
                ],
                onSelectRow: function(id, status, e) {

                    var rowData = grids.CodesSummaryGrid.$gridDiv.jqGrid('getRowData', id);
                    var colIndex = $(e.target).index();
                //    console.log(colIndex);
                    if(colIndex==1){
                        //var gridData = grids.ruleSummaryGrid.$gridDiv.jqGrid("getGridParam", "dataNew");
                        if(rowData){

                            $.ajax({
                                type: 'GET',
                                url: globalvars.root.publishCodeQueueList+"/ruleDetail",
                                data: {"rowId": rowData.rowId},
                                dataType: "json",
                                success: function(data) {
                                    if(data){
                                        ruleSummary = data;
                                        sessionStorage.setItem('codeSummary', JSON.stringify(ruleSummary));   
                                        $("#sub_menu #Configuration li.submenu_item").eq(6).click();
                                    }
                                },
                                error: function(jqxhr) {
                                    //alert('Error...');
                                }
                                });

                        }


                    }

                },
                loadComplete: function() {
                }
            });
        },
        fillGrid: function() {
            
             var datalength = this.data.length;

             for (var i = 0; i < datalength; i++) {
                 grids.CodesSummaryGrid.data[i].index = i;
                 grids.CodesSummaryGrid.$gridDiv.jqGrid('addRowData', i + 1, grids.CodesSummaryGrid.data[i]);
             }
             ;

             grids.CodesSummaryGrid.$gridDiv.setGridParam({rowNum: 30}).trigger("reloadGrid");
            
            
            
//            var datalength = this.data.length;
//
//            for (var i = 0; i < datalength; i++) {
//                grids.ruleSummaryGrid.data[i].index = i;
//                grids.ruleSummaryGrid.$gridDiv.jqGrid('addRowData', i + 1, grids.billAccountReviewGrid.data[i]);
//            }
//            ;
//
//            grids.loadHitRateAnalysisGrid.$gridDiv.setGridParam({rowNum: 30}).trigger("reloadGrid");
//
//            if (datalength == 0) {
//                dialogs.messageDialog.show({text: globalvars.localResourceMap.no_account_pending_msg});
//            }
//            ;
        }
    },
    getColorCode:function(value){

         var colorArray1 = getColorArray("#ECECEC","#548dd9",20);


                var colorCode;
                if(value >=0 && value <=5)
                    colorCode = colorArray1[0];
                else if(value >=6 && value <=10)
                    colorCode = colorArray1[1];
                else if(value >=11 && value <=15)
                    colorCode = colorArray1[2];
                else if(value >=16 && value <=20)
                    colorCode = colorArray1[3];
                else if(value >=21 && value <=25)
                    colorCode = colorArray1[4];
                else if(value >=26 && value <=30)
                    colorCode = colorArray1[5];
                else if(value >=31 && value <=35)
                    colorCode = colorArray1[6];
                else if(value >=36 && value <=40)
                    colorCode = colorArray1[7];
                else if(value >=41 && value <=45)
                    colorCode = colorArray1[8];
                else if(value >=46 && value <=50)
                    colorCode = colorArray1[9];
                else if(value >=51 && value <=55)
                    colorCode = colorArray1[10];
                else if(value >=56 && value <=60)
                    colorCode = colorArray1[11];
                else if(value >=61 && value <=65)
                    colorCode = colorArray1[12];
                else if(value >=66 && value <=70)
                    colorCode = colorArray1[13];
                else if(value >=71 && value <=75)
                    colorCode = colorArray1[14];
                else if(value >=76 && value <=80)
                    colorCode = colorArray1[15];
                else if(value >=81 && value <=85)
                    colorCode = colorArray1[16];
                else if(value >=86 && value <=90)
                    colorCode = colorArray1[17];
                else if(value >=91 && value <=95)
                    colorCode = colorArray1[18];
                else if(value >=96)
                    colorCode = colorArray1[19];

                return colorCode;




    },
//  auditorAssignmentGridManager: {
//  gridDiv: "",
//  gridData: {},
//  onClick: {},
//  isSpeciality:false,
//  originalAuditorOptions:"",
//  initialize: function(param) {
//      this.isSpeciality=param.isSpeciality;
//      this.gridDiv = $(param.gridDiv);
//      this.originalAuditorOptions = param.originalAuditorOptions;
//      this.onClick = param.onClick;
//      grids.auditorAssignmentGridManager.gridData = param.gridData;
//      this.loadGrid();
//      this.emptyGrid();
//      this.fillGrid();
//  },
//  loadGrid: function() {
//      grids.auditorAssignmentGridManager.gridDiv.jqGrid({
//          datatype: 'local',
//          autowidth: true,
//          height: 'auto',
//          gridview: true,
//          viewrecords: true,
//          altRows: true,
//          altclass: 'alternate_row_color',
//          sortname: '',
//          colNames: ['Region', 'specialty','Assigned Auditors', 'Assigned Level', 'Clear All Lower Levels','Selected Auditor','Original Assigned Auditor'],
//          colModel: [
//              {name: 'regionName', index: 'regionName', width: 200, align: 'center', },
//              {name: 'specialty', index: 'specialty', width: 200, align: 'center',hidden:grids.auditorAssignmentGridManager.isSpeciality},
//              {name: 'auditorName', index: 'auditorName',width:350,fixed:true,editable:true,sortable:false,classes:'grid_cell_style'},
//              {name: 'status', index: 'status'},
//              {name: 'count', index: 'count'},
//              { name: 'selectedAuditor', index: 'selectedAuditor',hidden:true,search:true},
//              { name: 'originalAuditorName', index: 'originalAuditorName',hidden:true,search:true},
//          ],
//          onSelectRow: function(id) {
//
//              grids.auditorAssignmentGridManager.savePreviousRow();
//              grids.auditorAssignmentGridManager.selectedRow = id;
//              var auditorNameDropDown = new String();
//              auditorNameDropDown = "<div class='prebill_auditor_selector_div'><select id='prebill_auditor_dropdown" + id + "' multiple='multiple' onchange='grids.auditorAssignmentGridManager.preBillAuditorChange(this," + id + ")' style=width:300px;>";
//              auditorNameDropDown += grids.auditorAssignmentGridManager.originalAuditorOptions;
//              auditorNameDropDown += "</select></div>";
//              grids.auditorAssignmentGridManager.gridDiv.jqGrid('editRow', id, true);
//              grids.auditorAssignmentGridManager.gridDiv.jqGrid('setCell', id, 'auditorName', auditorNameDropDown);
//              var preBillSelectedAuditortext = grids.auditorAssignmentGridManager.gridDiv.jqGrid('getCell', id, 'selectedAuditor');
//              var preBillRetainAuditorList = preBillSelectedAuditortext.split(",");
//              $("#prebill_auditor_dropdown"+id).val(preBillRetainAuditorList);
//              
////               var preBillSelectedAuditortext = grids.auditorAssignmentGrid.jqGrid('getCell', id, 'preBillSelectedAuditor');
////                      var preBillRetainAuditorList = preBillSelectedAuditortext.split(",");
////              $("#prebill_auditor_dropdown" + id).val(preBillRetainAuditorList);
//              $("#prebill_auditor_dropdown" + id).multiselect({
//                  multiple: true,
//                  minWidth: 250,
//                  selectedList: 40
//              }).multiselectfilter();
//          },
//          editurl: 'clientArray',
//          ignoreCase: true,
//          loadComplete: function () {
//              grids.auditorAssignmentGridManager.gridDiv.jqGrid('setLabel', 'auditorName', '', {'text-align':'left', 'padding-left':'16px', 'width':'336px'});
//              
//          }
//      });
//  },
//  preBillAuditorChange : function(selectObj,id){
//      
//      var prebill_auditors = $("#prebill_auditor_dropdown"+id).multiselect("getChecked");
//      var selected_auditor_list_prebill = new Array();
//      //log(prebill_auditors); /*Use the Log statement when required*/
//      for(var i =0; i < prebill_auditors.length; i++){
//          //log($(prebill_auditors[i]).attr('value')); /*Use the Log statement when required*/
//          selected_auditor_list_prebill.push($(prebill_auditors[i]).attr('value'));
//          
//      }
//      grids.auditorAssignmentGridManager.gridDiv.jqGrid('setCell', id, 'selectedAuditor',selected_auditor_list_prebill);
//      
//  },
//  emptyGrid: function() {
//      grids.auditorAssignmentGridManager.gridDiv.clearGridData();
//  },
//  savePreviousRow:function(){
//      if (grids.auditorAssignmentGridManager.selectedRow !== undefined) {
//          
//          grids.auditorAssignmentGridManager.gridDiv.jqGrid('saveRow', grids.auditorAssignmentGridManager.selectedRow);
//          var prebill_auditors_text = grids.auditorAssignmentGridManager.gridDiv.jqGrid('getCell', grids.auditorAssignmentGridManager.selectedRow, 'selectedAuditor');
//          var prebill_auditors_list = prebill_auditors_text.split(",");
//          var current_prebill_auditors_text = new String();
//          
//          var preBillOriginalAuditortext = grids.auditorAssignmentGridManager.gridDiv.jqGrid('getCell', grids.auditorAssignmentGridManager.selectedRow, 'originalAuditorName');
//          var preBillOriginalAuditorList = preBillOriginalAuditortext.split(",");
//          
//          for(var i =0;i<prebill_auditors_list.length;i++){
//              current_prebill_auditors_text+= prebill_auditors_list[i]+"<br/>";
//          }
//          grids.auditorAssignmentGridManager.gridDiv.jqGrid('setCell', grids.auditorAssignmentGridManager.selectedRow,'auditorName',current_prebill_auditors_text);
//      }
//  },
//  
//  fillGrid: function() {
//      var data = grids.auditorAssignmentGridManager.gridData;
//      var datalength = data.length;
//      var billAuditors;
//      var auditorsText;
//      var selectedAuditors;
//      for(var i =0;i<datalength;i++){
//          
//       billAuditors = new Array();  
//       billAuditors = data[i].auditors;
//           auditorsText = new String();
//           selectedAuditors = new Array();
//           for(var j = 0;j<billAuditors.length;j++){
//              auditorsText+= billAuditors[j].userId+'<br/>';
//              selectedAuditors.push(billAuditors[j].userId);
//           }
//           
//           grids.auditorAssignmentGridManager.gridDiv.jqGrid('addRowData', i + 1, {
//               regionName :  data[i].regionName,
//              specialty :  data[i].specialty,
//               status :  data[i].status,
//               count :  '<div><button>Clear</button></div>',
//               auditorName : auditorsText,
//           selectedAuditor : selectedAuditors,
//           originalAuditorName : selectedAuditors,
//           
//       });
//           
//           
//          
//      }
//      grids.auditorAssignmentGridManager.gridDiv.setGridParam({ rowNum: 30 }).trigger("reloadGrid");
//      
//      
//      
//  }
//},
auditorAssignmentGridManager: {
  $gridDiv: "",
  gridData: {},
  onClick: {},
  isSpeciality:false,
  originalAuditorOptions:"",
  initialize: function(param) {
    this.isSpeciality=param.isSpeciality;
      this.$gridDiv = $(param.gridDiv);
      this.originalAuditorOptions = param.originalAuditorOptions;
      this.onClick = param.onClick;
      grids.auditorAssignmentGridManager.gridData = param.gridData;
      this.loadGrid();
      this.emptyGrid();
      this.fillGrid();
  },
  loadGrid: function() {
      grids.auditorAssignmentGridManager.$gridDiv.jqGrid({
          datatype: 'local',
          autowidth: true,
          height: 'auto',
          gridview: true,
          viewrecords: true,
          altRows: true,
          altclass: 'alternate_row_color',
          sortname: '',
          colNames: ['Audit Type', 'Facility','Patient Type','Assigned Auditors', 'Assigned Level', 'Clear All Lower Levels','Selected Auditor','Original Assigned Auditor'],
          colModel: [
              {name: 'auditType', index: 'auditType', width: 200, align: 'center', },
              {name: 'coid', index: 'coid', width: 200, align: 'center',hidden:grids.auditorAssignmentGridManager.isSpeciality},
              {name: 'ptype', index: 'ptype', width: 200, align: 'center',hidden:grids.auditorAssignmentGridManager.isSpeciality},
              {name: 'auditorName', index: 'auditorName',width:350,fixed:true,editable:true,sortable:false,classes:'grid_cell_style'},
              {name: 'status', index: 'status'},
              {name: 'count', index: 'count'},
              { name: 'selectedAuditor', index: 'selectedAuditor',hidden:true,search:true},
              { name: 'originalAuditorName', index: 'originalAuditorName',hidden:true,search:true},
          ],
          onSelectRow: function(id) {

              grids.auditorAssignmentGridManager.savePreviousRow();
              grids.auditorAssignmentGridManager.selectedRow = id;
              var auditorNameDropDown = new String();
              auditorNameDropDown = "<div class='prebill_auditor_selector_div'><select id='prebill_auditor_dropdown" + id + "' multiple='multiple' onchange='grids.auditorAssignmentGridManager.preBillAuditorChange(this," + id + ")' style=width:300px;>";
              auditorNameDropDown += grids.auditorAssignmentGridManager.originalAuditorOptions;
              auditorNameDropDown += "</select></div>";
              grids.auditorAssignmentGridManager.$gridDiv.jqGrid('editRow', id, true);
              grids.auditorAssignmentGridManager.$gridDiv.jqGrid('setCell', id, 'auditorName', auditorNameDropDown);
              var preBillSelectedAuditortext = grids.auditorAssignmentGridManager.$gridDiv.jqGrid('getCell', id, 'selectedAuditor');
              var preBillRetainAuditorList = preBillSelectedAuditortext.split(",");
              $("#prebill_auditor_dropdown"+id).val(preBillRetainAuditorList);
              
//               var preBillSelectedAuditortext = grids.auditorAssignmentGrid.jqGrid('getCell', id, 'preBillSelectedAuditor');
//                      var preBillRetainAuditorList = preBillSelectedAuditortext.split(",");
//              $("#prebill_auditor_dropdown" + id).val(preBillRetainAuditorList);
              $("#prebill_auditor_dropdown" + id).multiselect({
                  multiple: true,
                  minWidth: 250,
                  selectedList: 40
              }).multiselectfilter();
          },
          editurl: 'clientArray',
          ignoreCase: true,
          loadComplete: function () {
            grids.auditorAssignmentGridManager.$gridDiv.jqGrid('setLabel', 'auditorName', '', {'text-align':'left', 'padding-left':'16px', 'width':'336px'});
            
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
        grids.auditorAssignmentGridManager.$gridDiv.jqGrid('setCell', id, 'selectedAuditor',selected_auditor_list_prebill);
        
    },
  emptyGrid: function() {
      grids.auditorAssignmentGridManager.$gridDiv.clearGridData();
  },
  savePreviousRow:function(){
        if (grids.auditorAssignmentGridManager.selectedRow !== undefined) {
            
            grids.auditorAssignmentGridManager.$gridDiv.jqGrid('saveRow', grids.auditorAssignmentGridManager.selectedRow);
        var prebill_auditors_text = grids.auditorAssignmentGridManager.$gridDiv.jqGrid('getCell', grids.auditorAssignmentGridManager.selectedRow, 'selectedAuditor');
        var prebill_auditors_list = String(prebill_auditors_text).split(",");
          var current_prebill_auditors_text = new String();
          
          var preBillOriginalAuditortext = grids.auditorAssignmentGridManager.$gridDiv.jqGrid('getCell', grids.auditorAssignmentGridManager.selectedRow, 'originalAuditorName');
          var preBillOriginalAuditorList = String(preBillOriginalAuditortext).split(",");
          
          for(var i =0;i<prebill_auditors_list.length;i++){
            current_prebill_auditors_text+= prebill_auditors_list[i]+"<br/>";
          }
          grids.auditorAssignmentGridManager.$gridDiv.jqGrid('setCell', grids.auditorAssignmentGridManager.selectedRow,'auditorName',current_prebill_auditors_text);
        }
    },
    
  fillGrid: function() {
      var data = grids.auditorAssignmentGridManager.gridData;
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
             
             grids.auditorAssignmentGridManager.$gridDiv.jqGrid('addRowData', i + 1, {
                auditType :  data[i].auditType,
                coid :  data[i].coid,
                ptype :  data[i].ptype,
                status:data[i].status,
                 count :  '<div><button>Clear</button></div>',
                 auditorName : auditorsText,
             selectedAuditor : selectedAuditors,
             originalAuditorName : selectedAuditors,
             
         });
             
             
        
      }
      grids.auditorAssignmentGridManager.$gridDiv.setGridParam({ rowNum: 30 }).trigger("reloadGrid");
      
      
      
  }
},
auditorAssignmentSubGrid: {
  $gridDiv: "",
  gridData: {},
  onClick: {},
  originalAuditorOptions:"",
  initialize: function(param) {
      this.$gridDiv = $(param.gridDiv);
      this.originalAuditorOptions = param.originalAuditorOptions;
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
          colNames: ['Speciality', 'Assigned Auditors', 'Assigned Level', 'Clear All Lower Levels','Selected Auditor','Original Assigned Auditor'],
          colModel: [
              {name: 'specialty', index: 'specialty', width: 200, align: 'center', },
              {name: 'auditorName', index: 'auditorName',width:350,fixed:true,editable:true,sortable:false,classes:'grid_cell_style'},
              {name: 'status', index: 'status'},
              {name: 'count', index: 'count'},
              { name: 'selectedAuditor', index: 'selectedAuditor',hidden:true,search:true},
              { name: 'originalAuditorName', index: 'originalAuditorName',hidden:true,search:true},
          ],
          onSelectRow: function(id) {

              grids.auditorAssignmentSubGrid.savePreviousRow();
              grids.auditorAssignmentSubGrid.selectedRow = id;
              var auditorNameDropDown = new String();
              auditorNameDropDown = "<div class='prebill_auditor_selector_div'><select id='prebill_auditor_dropdown" + id + "' multiple='multiple' onchange='grids.auditorAssignmentGrid.preBillAuditorChange(this," + id + ")' style=width:300px;>";
              auditorNameDropDown += grids.auditorAssignmentSubGrid.originalAuditorOptions;
              auditorNameDropDown += "</select></div>";
              grids.auditorAssignmentSubGrid.gridDiv.jqGrid('editRow', id, true);
              grids.auditorAssignmentSubGrid.gridDiv.jqGrid('setCell', id, 'auditorName', auditorNameDropDown);
              var preBillSelectedAuditortext = grids.auditorAssignmentSubGrid.gridDiv.jqGrid('getCell', id, 'selectedAuditor');
              var preBillRetainAuditorList = preBillSelectedAuditortext.split(",");
              $("#prebill_auditor_dropdown"+id).val(preBillRetainAuditorList);
              
//               var preBillSelectedAuditortext = grids.auditorAssignmentGrid.jqGrid('getCell', id, 'preBillSelectedAuditor');
//                      var preBillRetainAuditorList = preBillSelectedAuditortext.split(",");
//              $("#prebill_auditor_dropdown" + id).val(preBillRetainAuditorList);
              $("#prebill_auditor_dropdown" + id).multiselect({
                  multiple: true,
                  minWidth: 250,
                  selectedList: 40
              }).multiselectfilter();
          },
          editurl: 'clientArray',
          ignoreCase: true,
          loadComplete: function () {
            grids.auditorAssignmentSubGrid.gridDiv.jqGrid('setLabel', 'auditorName', '', {'text-align':'left', 'padding-left':'16px', 'width':'336px'});
            
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
        grids.auditorAssignmentSubGrid.gridDiv.jqGrid('setCell', id, 'selectedAuditor',selected_auditor_list_prebill);
        
    },
  emptyGrid: function() {
      grids.auditorAssignmentSubGrid.gridDiv.clearGridData();
  },
  savePreviousRow:function(){
        if (grids.auditorAssignmentSubGrid.selectedRow !== undefined) {
            
            grids.auditorAssignmentSubGrid.gridDiv.jqGrid('saveRow', grids.auditorAssignmentSubGrid.selectedRow);
        var prebill_auditors_text = grids.auditorAssignmentSubGrid.gridDiv.jqGrid('getCell', grids.auditorAssignmentSubGrid.selectedRow, 'selectedAuditor');
        var prebill_auditors_list = prebill_auditors_text.split(",");
          var current_prebill_auditors_text = new String();
          
          var preBillOriginalAuditortext = grids.auditorAssignmentSubGrid.gridDiv.jqGrid('getCell', grids.auditorAssignmentSubGrid.selectedRow, 'originalAuditorName');
          var preBillOriginalAuditorList = preBillOriginalAuditortext.split(",");
          
          for(var i =0;i<prebill_auditors_list.length;i++){
            current_prebill_auditors_text+= prebill_auditors_list[i]+"<br/>";
          }
          grids.auditorAssignmentSubGrid.gridDiv.jqGrid('setCell', grids.auditorAssignmentSubGrid.selectedRow,'auditorName',current_prebill_auditors_text);
        }
    },
    
  fillGrid: function() {
      var data = grids.auditorAssignmentSubGrid.gridData;
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
             
             grids.auditorAssignmentSubGrid.gridDiv.jqGrid('addRowData', i + 1, {
                 specialty :  data[i].specialty,
                 status :  data[i].status,
                 count :  '<div><button>Clear</button></div>',
                 auditorName : auditorsText,
             selectedAuditor : selectedAuditors,
             originalAuditorName : selectedAuditors,
             
         });
             
             
        
      }
      grids.auditorAssignmentSubGrid.gridDiv.setGridParam({ rowNum: 30 }).trigger("reloadGrid");
      
      
      
  }
},
    
    

//     configReportGrid: {
//         gridDiv: "",
//         $gridDiv: {},
//         pagerDiv: "",
//         data: {},
//         initialize: function(param) {
//             log(param);
//             this.gridDiv = param.gridDiv;
//             this.$gridDiv = $(param.gridDiv);
//             this.pagerDiv = param.pagerDiv;
//             this.data = param.data;
//             this.loadGrid();
//             this.fillGrid();
//         },
//         reloadGrid: function(data) {
//             this.$gridDiv = $(this.gridDiv);
//             this.$gridDiv.jqGrid('GridUnload');
//            this.data = data;
//             this.$gridDiv = $(this.gridDiv);
//             this.loadGrid();
//             //this.fillGrid();
//             this.$gridDiv.setGridParam({rowNum: 30, sortname: 'hidden'}).trigger("reloadGrid");
//         },
//         loadGrid: function() {
//             this.$gridDiv.jqGrid({
//                 datatype: "local",
//                 //datastr: grids.ruleSummaryGrid.data,
//                 autowidth: false,
//                 height: 'auto',
//                 pager: this.pagerDiv,
//                 rowNum: 30,
//                 rowList: [10, 20, 30, 50],
//                 pagination: true,
//                 gridview: true,
//                 viewrecords: true,
//                 altRows: true,
//                 altclass: 'alternate_row_color',
//                 sortname: 'ruleId',
//                 viewsortcols: [false, 'vertical', true],
                
                
//                 colNames: ['Report Name','Description','Schedule time','Include Weekend','TO_Email','CC_Email','Active'],
//                 colModel: [
                    
//                     {name: 'reportName', index: 'reportName', width: 200, align: 'left',sortable: true,sorttype: "string",classes: 'accountlist-account-cursor'},
//                     {name: 'reportDescription', index: 'reportDescription', width: 200, align: 'center', fixed: true, sortable: true,sorttype: "string"},
// //                  
//                     {name: 'scheduleTime', width: 150,  fixed: true, sortable: true,sorttype: "string",align: 'center'}, 
// //                  {name: 'name', index: 'name', width: 120, fixed: true, sortable: true, sorttype: "string", classes: 'grid_cell_style'},
// //                  
                    
//                     {name: 'includeWeekend', index: 'includeWeekend', width: 150, editable: true,align: 'center',
//                         edittype: 'checkbox', editoptions: { value: "True:False" }, formatter: "checkbox", formatoptions: { disabled: false},
//                     },
                    
//                     {name: 'updateTime', index: 'updateTime', width: 150, align: 'center', fixed: true, sortable: true, editable:true,editoptions: {
//                             size: "23",
//                             maxlength: "250",
//                         },
//                         classes: 'grid_cell_style'},
//                     {name: 'active', index: 'active', width: 100, fixed: true, sortable: true, sorttype: "string", align: 'center',editable:true},
                    
//                     {name: 'modifiedBy', index: 'modifiedBy', width: 150, editable: true,align: 'center',
//                         edittype: 'checkbox', editoptions: { value: "True:False" }, formatter: "checkbox", formatoptions: { disabled: false},
//                     }
                    
//                 ],
//                 editurl: 'clientArray',
//                 loadComplete: function() {
//                 }
//             });
//         },
//         fillGrid: function() {
            
//              var datalength = this.data.length;

//              for (var i = 0; i < datalength; i++) {
//                  grids.configReportGrid.data[i].index = i;
//                  grids.configReportGrid.$gridDiv.jqGrid('addRowData', i + 1, grids.configReportGrid.data[i]);
//              }
//              ;

//              grids.configReportGrid.$gridDiv.setGridParam({rowNum: 30}).trigger("reloadGrid");
            
            
            
// //            var datalength = this.data.length;
// //
// //            for (var i = 0; i < datalength; i++) {
// //                grids.ruleSummaryGrid.data[i].index = i;
// //                grids.ruleSummaryGrid.$gridDiv.jqGrid('addRowData', i + 1, grids.billAccountReviewGrid.data[i]);
// //            }
// //            ;
// //
// //            grids.loadHitRateAnalysisGrid.$gridDiv.setGridParam({rowNum: 30}).trigger("reloadGrid");
// //
// //            if (datalength == 0) {
// //                dialogs.messageDialog.show({text: globalvars.localResourceMap.no_account_pending_msg});
// //            }
// //            ;
//         }
//     },

    configReportGrid: {
        $gridDiv: {},
        selectedRow: undefined,
        savedSuccessfully: true,
        altRows: true,
        backScreen:"",
        altclass: 'alternate_row_color',
        data: {},
        screenName: "",
        initialize: function(param) {
            this.$gridDiv = $(param.gridDiv);
            this.backScreen = param.backScreen;
            this.loadGrid(param.$gridDiv);
            this.fillGrid(param.data);
            this.screenName = param.screenName;
        },
        loadGrid: function(param) { // param object holds gridDiv, data
            this.selectedRow = undefined;
            this.savedSuccessfully = true;
            this.$gridDiv.jqGrid({
                 datatype: "local",
                //datastr: grids.ruleSummaryGrid.data,
                autowidth: false,
                height: 'auto',
                pager: this.pagerDiv,
                rowNum: 30,
                rowList: [10, 20, 30, 50],
                pagination: true,
                gridview: true,
                viewrecords: true,
                altRows: true,
                altclass: 'alternate_row_color',
                sortname: 'ruleId',
                viewsortcols: [false, 'vertical', true],
                colNames: ['Report Name','Description','Schedule time','','TO_Email','','CC_Email','','Error_Email','','Subject','','Body','Active','','frequency','','',''],
                colModel: [
                    {name: 'reportName', index: 'reportName', width: 125, align: 'left',sortable: true,sorttype: "string"},
                    {name: 'reportDescription', index: 'reportDescription', fixed: true, sortable: true,sorttype: "string",hidden: true},
//                  
                    {name: 'scheduleTime', width: 80,  fixed: true, sortable: true,sorttype: "string",align: 'center',editable:false}, 
//                  {name: 'name', index: 'name', width: 120, fixed: true, sortable: true, sorttype: "string", classes: 'grid_cell_style'},
//                  
                    
                    
                    {name: 'toList', index: 'toList', formatter:htmlFormatter, width: 25,align: 'center'},
                    {name: 'toEmail', index: 'toEmail', formatter:htmlFormatter, width: 120, align: 'center', fixed: true, sortable: true},
                    {name: 'ccList', index: 'ccList', formatter:htmlFormatter, width: 25,align: 'center'},
                    {name: 'ccEmail', index: 'ccEmail', formatter:htmlFormatter, width: 120, fixed: true, sortable: true, sorttype: "string", align: 'center'},
                    {name: 'errorList', index: 'errorList', formatter:htmlFormatter, width: 25,align: 'center'},
                    {name: 'errorEmail', index: 'errorEmail', formatter:htmlFormatter, width: 100, fixed: true, sortable: true, sorttype: "string", align: 'center'},
                    {name: 'subjectList', index: 'subjectList',formatter:htmlFormatter, width: 25,align: 'center'},
                    {name: 'subject', index: 'subject', formatter:htmlFormatter, width: 95, fixed: true, sortable: true, sorttype: "string", align: 'center'},
                    {name: 'bodyList', index: 'bodyList', formatter:htmlFormatter, width: 25,align: 'center'},
                    {name: 'body', index: 'body', formatter:htmlFormatter, width: 90, fixed: true, sortable: true, sorttype: "string", align: 'center'},
                    {name: 'active', index: 'active', width: 60, editable: true,align: 'center',
                        edittype: 'checkbox', editoptions: { value: "1:0" }, formatter: "checkbox", formatoptions: { disabled: false},
                    },
                    {name: 'rowId', index: 'rowId', hidden:true},
                    {name : 'frequency',index :'frequency',width:90,
                                            sortable:true,
                                            align:'center',
                                            editable:true,
                                            cellEdit:true,
                                            edittype: 'select', 
                                            formatter: 'select',

                                            editoptions:{value: grids.configReportGrid.getAllfrequecyOptions()}
                     },

                     {name: 'update', index: 'update', width: 80,align: 'center',
                    	 formatter: function (cellvalue, options, rowObject) {
                    		 			//console.log(rowObject);
                    		 			var markup = '<span id="updateRow" class="img-icon-container" title="Save Row">&nbsp;</span>';
                    		 			if(rowObject.isHospDept==1){
                        		 			markup += '<span title="Config Report by Dept" id="updateDept" class="img-icon-container">&nbsp;</span>';
                    		 			}
                    		 			if(rowObject.isHosp==1){
                        		 			markup += '<span title="Config Report by Hospital" id="updateHospital" class="img-icon-container">&nbsp;</span>';
                    		 			}
                    		 			return markup;

                    	 			}
                      },
                      {name: 'isHosp', index: 'isHosp', hidden:true},
                      {name: 'isHospDept', index: 'isHospDept', hidden:true},
                    
                ],
                onSelectRow: function(id, status, e) {
                    var selectedRowDataObject = grids.configReportGrid.$gridDiv.jqGrid('getRowData', id);
                    globalvars.configSelectedReportName = selectedRowDataObject.reportName;
                	console.log(e.target);
                	var node = $(e.target);
                	var imageId = node.attr("id") || "";
                	console.log(imageId);
                    var colIndex = $(e.target).index();
                    console.log(colIndex);
                    if(colIndex == 9){
                        var classNames = $(e.target).attr("class");
                        if(classNames === undefined){
                        	return false;
                        }
                    }
                     if(colIndex == 3 || colIndex==5 || colIndex==7 || colIndex==9 || colIndex==11 || colIndex==16 || imageId.length > 0){
                         //if(grids.missingChargesGrid.isEditable == true){
                            //var gridData = grids.configReportGrid.$gridDiv.jqGrid("getGridParam", "dataNew");
                            screens.reportConfig.showToDialog(id,colIndex, imageId);
                            //console.log(colIndex);
                         //}
                     } 
                     else{
                     
                        if (grids.configReportGrid.selectedRow !== undefined) {

                            grids.configReportGrid.$gridDiv.jqGrid('saveRow', grids.configReportGrid.selectedRow);

                        }
                            grids.configReportGrid.selectedRow = id;

                            grids.configReportGrid.$gridDiv.jqGrid('editRow',id, true, false, false, false, false, false,false, afterrestorefunc);
                            if(colIndex==2){
                                grids.configReportGrid.$gridDiv.jqGrid('setColProp','scheduleTime',{editable:true});
                                $('#' + id + '_' + 'scheduleTime').timepicker({'timeFormat': 'H:i:s' ,'step': 15, 'dropdown': true });
                            }
                            
                            
                            grids.configReportGrid.savedSuccessfully = false;
                    }
                    
                     function afterrestorefunc(e){
                        grids.configReportGrid.$gridDiv.trigger('jqGridInlineAfterSaveRow');
                     }

                //     log('missing Charges ID clicked ' + id + " " + grids.configReportGrid.selectedRow);
                },
                editurl: 'clientArray',
                loadComplete: function() {
                    
                                      
                     var gridRowData = grids.configReportGrid.$gridDiv.jqGrid('getRowData');
                     var gridRowDataLength = gridRowData.length;

                     var gridData = grids.configReportGrid.$gridDiv.jqGrid("getGridParam", "dataNew");
                     
                     var tableGridID = "#rule_grid_table";
                     
                     
                     for (var i = 0; i < gridRowDataLength; i++) {
                         
                         $(tableGridID).find("tr#" + (i + 1)).find("td").eq(3).addClass("reportEmail_icon").prop("title","Click to add Emails");
                         $(tableGridID).find("tr#" + (i + 1)).find("td").eq(5).addClass("reportEmail_icon").prop("title","Click to add Emails");
                         $(tableGridID).find("tr#" + (i + 1)).find("td").eq(7).addClass("reportEmail_icon").prop("title","Click to add Emails");
                         if($(tableGridID).find("tr#" + (i + 1)).find("td").eq(10).text().trim().length>0){
                             $(tableGridID).find("tr#" + (i + 1)).find("td").eq(9).addClass("reportEmailText_icon").prop("title","Click to add text");
                         }
                         $(tableGridID).find("tr#" + (i + 1)).find("td").eq(11).addClass("reportEmailText_icon").prop("title","Click to add text");
                         $(tableGridID).find("tr#" + (i + 1)).find("td").eq(3).css('border-right','0px');
                         $(tableGridID).find("tr#" + (i + 1)).find("td").eq(3).css('cursor','pointer');
                         $(tableGridID).find("tr#" + (i + 1)).find("td").eq(5).css('border-right','0px');
                         $(tableGridID).find("tr#" + (i + 1)).find("td").eq(5).css('cursor','pointer');
                         $(tableGridID).find("tr#" + (i + 1)).find("td").eq(7).css('border-right','0px');
                         $(tableGridID).find("tr#" + (i + 1)).find("td").eq(7).css('cursor','pointer');
                         $(tableGridID).find("tr#" + (i + 1)).find("td").eq(9).css('border-right','0px');
                         $(tableGridID).find("tr#" + (i + 1)).find("td").eq(9).css('cursor','pointer');
                         $(tableGridID).find("tr#" + (i + 1)).find("td").eq(11).css('border-right','0px');
                         $(tableGridID).find("tr#" + (i + 1)).find("td").eq(11).css('cursor','pointer');
                        //$(tableGridID).find("tr#" + (i + 1)).find("td").eq(16).addClass("update_icon");
                        $(tableGridID).find("tr#" + (i + 1)).find("td").eq(16).css('cursor','pointer');


                         

                         //$(tableGridID).find("tr#" + (i + 1)).find("td").eq(10).append("<button>Update</button>" );

                         
                     }
                     
                }

            });
            function htmlFormatter(cellvalue, options, rowObject){
            	return $('<div/>').text(cellvalue).html();
            }
            this.$gridDiv.unbind("jqGridInlineAfterSaveRow");
            this.$gridDiv.bind("jqGridInlineAfterSaveRow", function(rowid) {
             //   log("jqGridInlineAfterSaveRow");

               var selectedRowData = grids.configReportGrid.$gridDiv.jqGrid('getRowData', grids.configReportGrid.selectedRow);

              
                grids.configReportGrid.$gridDiv.jqGrid('setRowData', grids.configReportGrid.selectedRow, selectedRowData);

                grids.configReportGrid.savedSuccessfully = true;
            });


        },
        fillGrid: function(data) {
            this.$gridDiv.clearGridData();
            var datalength = data.length;
            //var searchDiv = '<div style="color:blue;">Update</div>';
             for (var i = 0; i < datalength; i++) {
                 data[i].index = i;
                // data[i].update="Update";
                 grids.configReportGrid.$gridDiv.jqGrid('addRowData', i + 1, data[i]);
              //   $("#rule_grid_table").jqGrid('setCell', i + 1,  'update', searchDiv, '');
             }
             ;

             grids.configReportGrid.$gridDiv.setGridParam({rowNum: 30}).trigger("reloadGrid");
        },
        
           getAllfrequecyOptions: function(){

            var frequency = { '1': 'Daily', '2': 'Weekdays', '3': 'Weekly', 
               '4': 'Monthly'};

            return frequency;
            }



         },

//adv report grid

         configAdvReportGrid: {
             $gridDiv: {},
             selectedRow: undefined,
             savedSuccessfully: true,
             altRows: true,
             backScreen:"",
             altclass: 'alternate_row_color',
             pagerDiv: "",
             data: {},
             screenName: "",
             initialize: function(param) {
                 this.$gridDiv = $(param.gridDiv);
                 this.backScreen = param.backScreen;
                 this.loadGrid(param.$gridDiv);
                 this.fillGrid(param.data);
                 this.pagerDiv = param.pagerDiv;
                 this.screenName = param.screenName;
             },
             loadGrid: function(param) { // param object holds gridDiv, data
                 this.selectedRow = undefined;
                 this.savedSuccessfully = true;
                 this.$gridDiv.jqGrid({
                      datatype: "local",
                     //datastr: grids.ruleSummaryGrid.data,
                     autowidth: false,
                     height: 'auto',
                     pager: '#prebill_grid_pager',
                     rowNum: 20,
                     ignoreCase: true,
                     rowList: [10, 20, 30, 50],
                     pagination: true,
                     gridview: true,
                     viewrecords: true,
                     altRows: true,
                     altclass: 'alternate_row_color',
                     sortname: 'ruleId',
                     viewsortcols: [false, 'vertical', true],
                     colNames: ['Hospital','Name','','TO_Email','','CC_Email','Active','',''],
                     colModel: [
                         {name: 'hospitalId', index: 'hospitalId', width: 150, align: 'left',sortable: true,sorttype: "string"},
                         {name: 'name', index: 'name', fixed: true, sortable: true,sorttype: "string",editable:true},
//                       
//                         {name: 'scheduleTime', width: 80,  fixed: true, sortable: true,sorttype: "string",align: 'center',editable:true}, 
//                       {name: 'name', index: 'name', width: 120, fixed: true, sortable: true, sorttype: "string", classes: 'grid_cell_style'},
//                       
                         
                         
                         {name: 'toList', index: 'toList', formatter:htmlFormatter, width: 25,align: 'center', classes:'reportEmail_icon'},
                         {name: 'toEmail', index: 'toEmail', formatter:htmlFormatter, width: 325, align: 'center', fixed: true, sortable: true},
                         {name: 'ccList', index: 'ccList', formatter:htmlFormatter, width: 25,align: 'center', classes:'reportEmail_icon'},
                         {name: 'ccEmail', index: 'ccEmail', formatter:htmlFormatter, width: 325, fixed: true, sortable: true, sorttype: "string", align: 'center'},
//                         {name: 'errorList', index: 'errorList', width: 25,align: 'center'},
//                         {name: 'errorEmail', index: 'errorEmail', width: 90, fixed: true, sortable: true, sorttype: "string", align: 'center'},
//                         {name: 'subjectList', index: 'subjectList', width: 25,align: 'center'},
//                         {name: 'subject', index: 'subject', width: 95, fixed: true, sortable: true, sorttype: "string", align: 'center'},
//                         {name: 'bodyList', index: 'bodyList', width: 25,align: 'center'},
//                         {name: 'body', index: 'body', width: 100, fixed: true, sortable: true, sorttype: "string", align: 'center'},
                         {name: 'active', index: 'active', width: 50, editable: true,align: 'center',
                             edittype: 'checkbox', editoptions: { value: "1:0" }, formatter: "checkbox", formatoptions: { disabled: false},
                         },
                         {name: 'rowId', index: 'rowId', hidden:true},
/*                         {name : 'frequency',index :'frequency',width:100,
                                                 sortable:true,
                                                 align:'center',
                                                 editable:true,
                                                 cellEdit:true,
                                                 edittype: 'select', 
                                                 formatter: 'select',

                                                 editoptions:{value: grids.configAdvReportGrid.getAllfrequecyOptions()}
                          },
*/
                          {name: 'update', index: 'update', width: 50,align: 'center',
                         	 formatter: function (cellvalue, options, rowObject) {
                         		 			var markup = '<span id="updateRow" class="img-icon-container" title="Save Row">&nbsp;</span>';
                         		 			return markup;

                         	 			}
                           }
                         
                     ],
                     onSelectRow: function(id, status, e) {
                     	console.log(e.target);
                    	var node = $(e.target);
                    	var imageId = node.attr("id") || "";
                    	console.log(imageId);
                          var colIndex = $(e.target).index();
                     //        console.log(colIndex);
                          if(colIndex == 2 || colIndex==4 || colIndex==7 || imageId.length > 0){
                              //if(grids.missingChargesGrid.isEditable == true){
                                 //var gridData = grids.configReportGrid.$gridDiv.jqGrid("getGridParam", "dataNew");
                                 screens.advReportConfig.showToDialog(id,colIndex, imageId);
                                 //console.log(colIndex);
                              //}
                          } 
                          else{
                          

                             if (grids.configAdvReportGrid.selectedRow !== undefined) {

                                 grids.configAdvReportGrid.$gridDiv.jqGrid('saveRow', grids.configAdvReportGrid.selectedRow);

                             }
                                 grids.configAdvReportGrid.selectedRow = id;

                                 grids.configAdvReportGrid.$gridDiv.jqGrid('editRow',id, true, false, false, false, false, false,false, afterrestorefunc);

                                 $('#' + id + '_' + 'scheduleTime').timepicker({'timeFormat': 'H:i:s' ,'step': 15 });
                                 
                                 
                                 grids.configAdvReportGrid.savedSuccessfully = false;
                         }
                         
                          function afterrestorefunc(e){
                             grids.configAdvReportGrid.$gridDiv.trigger('jqGridInlineAfterSaveRow');
                          }

                     //     log('missing Charges ID clicked ' + id + " " + grids.configAdvReportGrid.selectedRow);
                     },
                     editurl: 'clientArray',
                     loadComplete: function() {
                         
                                           
                          var gridRowData = grids.configAdvReportGrid.$gridDiv.jqGrid('getRowData');
                          var gridRowDataLength = gridRowData.length;

                          var gridData = grids.configAdvReportGrid.$gridDiv.jqGrid("getGridParam", "dataNew");
                          
                          var tableGridID = "#rule_grid_table";
                          
                          
                          for (var i = 0; i < gridRowDataLength; i++) {
                              
                              $(tableGridID).find("tr#" + (i + 1)).find("td").eq(2).css('border-right','0px');
                              $(tableGridID).find("tr#" + (i + 1)).find("td").eq(2).css('cursor','pointer');
                              $(tableGridID).find("tr#" + (i + 1)).find("td").eq(4).css('border-right','0px');
                              $(tableGridID).find("tr#" + (i + 1)).find("td").eq(4).css('cursor','pointer');
                             //$(tableGridID).find("tr#" + (i + 1)).find("td").eq(16).addClass("update_icon");
                             $(tableGridID).find("tr#" + (i + 1)).find("td").eq(8).css('cursor','pointer');


                              

                              //$(tableGridID).find("tr#" + (i + 1)).find("td").eq(10).append("<button>Update</button>" );

                              
                          }
                          
                     }

                 });

                 function htmlFormatter(cellvalue, options, rowObject){
                 	return $('<div/>').text(cellvalue).html();
                 }

                 this.$gridDiv.unbind("jqGridInlineAfterSaveRow");
                 this.$gridDiv.bind("jqGridInlineAfterSaveRow", function(rowid) {
                  //   log("jqGridInlineAfterSaveRow");

                    var selectedRowData = grids.configAdvReportGrid.$gridDiv.jqGrid('getRowData', grids.configAdvReportGrid.selectedRow);

                   
                     grids.configAdvReportGrid.$gridDiv.jqGrid('setRowData', grids.configAdvReportGrid.selectedRow, selectedRowData);

                     grids.configAdvReportGrid.savedSuccessfully = true;
                 });


             },
             fillGrid: function(data) {
                 this.$gridDiv.clearGridData();
                 var datalength = data.length;
                 //var searchDiv = '<div style="color:blue;">Update</div>';
                  for (var i = 0; i < datalength; i++) {
                      data[i].index = i;
                     // data[i].update="Update";
                      grids.configAdvReportGrid.$gridDiv.jqGrid('addRowData', i + 1, data[i]);
                   //   $("#rule_grid_table").jqGrid('setCell', i + 1,  'update', searchDiv, '');
                  }
                  ;

                  grids.configAdvReportGrid.$gridDiv.setGridParam({rowNum: 20}).trigger("reloadGrid");
             },
             
                getAllfrequecyOptions: function(){

                 var frequency = { '1': 'Daily', '2': 'Weekdays', '3': 'Weekly', 
                    '4': 'Monthly'};

                 return frequency;
                 }



     },
// config report by dept grid
     
     configReportByDeptGrid: {
         $gridDiv: {},
         selectedRow: undefined,
         savedSuccessfully: true,
         altRows: true,
         backScreen:"",
         altclass: 'alternate_row_color',
         pagerDiv: "",
         data: {},
         screenName: "",
         initialize: function(param) {
             this.$gridDiv = $(param.gridDiv);
             this.backScreen = param.backScreen;
             this.loadGrid(param.$gridDiv);
             this.fillGrid(param.data);
             this.pagerDiv = param.pagerDiv;
             this.screenName = param.screenName;
         },
         loadGrid: function(param) { // param object holds gridDiv, data
             this.selectedRow = undefined;
             this.savedSuccessfully = true;
             this.$gridDiv.jqGrid({
                  datatype: "local",
                 //datastr: grids.ruleSummaryGrid.data,
                 autowidth: false,
                 height: 'auto',
                 pager: '#prebill_grid_pager',
                 rowNum: 20,
                 rowList: [10, 20, 30, 50],
                 ignoreCase: true,
                 pagination: true,
                 gridview: true,
                 viewrecords: true,
                 altRows: true,
                 altclass: 'alternate_row_color',
                 sortname: 'ruleId',
                 viewsortcols: [false, 'vertical', true],
                 colNames: ['Hospital','Dept Code','Dept Desc','','TO_Email','','CC_Email','Active','',''],
                 colModel: [
                     {name: 'hospitalId', index: 'hospitalId', width: 100, align: 'left',sortable: true,sorttype: "string"},
                     {name: 'deptCode', index: 'deptCode', fixed: true, sortable: true,sorttype: "string"},
                     {name: 'deptDesc', index: 'deptDesc', width: 250, fixed: true, sortable: true,sorttype: "string"},
//                   
//                     {name: 'scheduleTime', width: 80,  fixed: true, sortable: true,sorttype: "string",align: 'center',editable:true}, 
//                   {name: 'name', index: 'name', width: 120, fixed: true, sortable: true, sorttype: "string", classes: 'grid_cell_style'},
//                   
                     
                     
                     {name: 'toList', index: 'toList', formatter:htmlFormatter, width: 25,align: 'center', classes:'reportEmail_icon'},
                     {name: 'toEmail', index: 'toEmail', formatter:htmlFormatter, width: 225, align: 'center', fixed: true, sortable: true},
                     {name: 'ccList', index: 'ccList', formatter:htmlFormatter, width: 25,align: 'center', classes:'reportEmail_icon'},
                     {name: 'ccEmail', index: 'ccEmail', formatter:htmlFormatter, width: 225, fixed: true, sortable: true, sorttype: "string", align: 'center'},
//                     {name: 'errorList', index: 'errorList', width: 25,align: 'center'},
//                     {name: 'errorEmail', index: 'errorEmail', width: 90, fixed: true, sortable: true, sorttype: "string", align: 'center'},
//                     {name: 'subjectList', index: 'subjectList', width: 25,align: 'center'},
//                     {name: 'subject', index: 'subject', width: 95, fixed: true, sortable: true, sorttype: "string", align: 'center'},
//                     {name: 'bodyList', index: 'bodyList', width: 25,align: 'center'},
//                     {name: 'body', index: 'body', width: 100, fixed: true, sortable: true, sorttype: "string", align: 'center'},
                     {name: 'active', index: 'active', width: 50, editable: true,align: 'center',
                         edittype: 'checkbox', editoptions: { value: "1:0" }, formatter: "checkbox", formatoptions: { disabled: false},
                     },
                     {name: 'rowId', index: 'rowId', hidden:true},
/*                         {name : 'frequency',index :'frequency',width:100,
                                             sortable:true,
                                             align:'center',
                                             editable:true,
                                             cellEdit:true,
                                             edittype: 'select', 
                                             formatter: 'select',

                                             editoptions:{value: grids.configReportByDeptGrid.getAllfrequecyOptions()}
                      },
*/
                      {name: 'update', index: 'update', width: 50,align: 'center',
                     	 formatter: function (cellvalue, options, rowObject) {
                     		 			var markup = '<span id="updateRow" class="img-icon-container" title="Save Row">&nbsp;</span>';
                     		 			return markup;

                     	 			}
                       }
                     
                 ],
                 onSelectRow: function(id, status, e) {
                 	console.log(e.target);
                	var node = $(e.target);
                	var imageId = node.attr("id") || "";
                	console.log(imageId);
                      var colIndex = $(e.target).index();
                 //        console.log(colIndex);

                      if(colIndex == 3 || colIndex==5 || colIndex==8 || imageId.length > 0){
                          //if(grids.missingChargesGrid.isEditable == true){
                             //var gridData = grids.configReportGrid.$gridDiv.jqGrid("getGridParam", "dataNew");
                             screens.configReportByDept.showToDialog(id,colIndex, imageId);
                             //console.log(colIndex);
                          //}
                      } 
                      else{
                      

                         if (grids.configReportByDeptGrid.selectedRow !== undefined) {

                             grids.configReportByDeptGrid.$gridDiv.jqGrid('saveRow', grids.configReportByDeptGrid.selectedRow);

                         }
                             grids.configReportByDeptGrid.selectedRow = id;

                             grids.configReportByDeptGrid.$gridDiv.jqGrid('editRow',id, true, false, false, false, false, false,false, afterrestorefunc);

                             $('#' + id + '_' + 'scheduleTime').timepicker({'timeFormat': 'H:i:s' ,'step': 15 });
                             
                             
                             grids.configReportByDeptGrid.savedSuccessfully = false;
                     }
                     
                      function afterrestorefunc(e){
                         grids.configReportByDeptGrid.$gridDiv.trigger('jqGridInlineAfterSaveRow');
                      }

                 //     log('missing Charges ID clicked ' + id + " " + grids.configReportByDeptGrid.selectedRow);
                 },
                 editurl: 'clientArray',
                 loadComplete: function() {
                                       
                      var gridRowData = grids.configReportByDeptGrid.$gridDiv.jqGrid('getRowData');
                      var gridRowDataLength = gridRowData.length;

                      var gridData = grids.configReportByDeptGrid.$gridDiv.jqGrid("getGridParam", "dataNew");
                      
                      var tableGridID = "#rule_grid_table";
                      
                      
                      for (var i = 0; i < gridRowDataLength; i++) {
                          
                          $(tableGridID).find("tr#" + (i + 1)).find("td").eq(3).css('border-right','0px');
                          $(tableGridID).find("tr#" + (i + 1)).find("td").eq(3).css('cursor','pointer');
                          $(tableGridID).find("tr#" + (i + 1)).find("td").eq(5).css('border-right','0px');
                          $(tableGridID).find("tr#" + (i + 1)).find("td").eq(5).css('cursor','pointer');
                         //$(tableGridID).find("tr#" + (i + 1)).find("td").eq(16).addClass("update_icon");
                         $(tableGridID).find("tr#" + (i + 1)).find("td").eq(9).css('cursor','pointer');


                          

                          //$(tableGridID).find("tr#" + (i + 1)).find("td").eq(10).append("<button>Update</button>" );

                          
                      }
                      
                 }

             });
             function htmlFormatter(cellvalue, options, rowObject){
             	return $('<div/>').text(cellvalue).html();
             }
             this.$gridDiv.unbind("jqGridInlineAfterSaveRow");
             this.$gridDiv.bind("jqGridInlineAfterSaveRow", function(rowid) {
              //   log("jqGridInlineAfterSaveRow");

                var selectedRowData = grids.configReportByDeptGrid.$gridDiv.jqGrid('getRowData', grids.configReportByDeptGrid.selectedRow);

               
                 grids.configReportByDeptGrid.$gridDiv.jqGrid('setRowData', grids.configReportByDeptGrid.selectedRow, selectedRowData);

                 grids.configReportByDeptGrid.savedSuccessfully = true;
             });


         },
         fillGrid: function(data) {
             this.$gridDiv.clearGridData();
             var datalength = data.length;
             //var searchDiv = '<div style="color:blue;">Update</div>';
              for (var i = 0; i < datalength; i++) {
                  data[i].index = i;
                 // data[i].update="Update";
                  grids.configReportByDeptGrid.$gridDiv.jqGrid('addRowData', i + 1, data[i]);
               //   $("#rule_grid_table").jqGrid('setCell', i + 1,  'update', searchDiv, '');
              }
              ;

              grids.configReportByDeptGrid.$gridDiv.setGridParam({rowNum: 20}).trigger("reloadGrid");
         },
         
            getAllfrequecyOptions: function(){

             var frequency = { '1': 'Daily', '2': 'Weekdays', '3': 'Weekly', 
                '4': 'Monthly'};

             return frequency;
             }



 },

    auditorQueueListGrid: {
        gridDiv: "",
        $gridDiv: {},
        pagerDiv: "",
        data: {},
        initialize: function(param) {
         //   log(param);
            this.gridDiv = param.gridDiv;
            this.$gridDiv = $(param.gridDiv);
            this.pagerDiv = param.pagerDiv;
            this.data = param.data;
            this.loadGrid();
            this.fillGrid();
        },
        reloadGrid: function(data) {
            this.$gridDiv = $(this.gridDiv);
            this.$gridDiv.jqGrid('GridUnload');
           this.data = data;
            this.$gridDiv = $(this.gridDiv);
            this.loadGrid();
            //this.fillGrid();
            this.$gridDiv.setGridParam({rowNum: 30, sortname: 'hidden'}).trigger("reloadGrid");
        },
        loadGrid: function() {
            this.$gridDiv.jqGrid({
                datatype: "local",
                //datastr: grids.ruleSummaryGrid.data,
                autowidth: false,
                height: 'auto',
                pager: this.pagerDiv,
                rowNum: 30,
                rowList: [10, 20, 30, 50],
                pagination: true,
                gridview: true,
                viewrecords: true,
                altRows: true,
                altclass: 'alternate_row_color',
                sortname: 'ruleId',
                viewsortcols: [false, 'vertical', true],
                
                
                colNames: ['Queue Name','Auditor','Bill Type','priority','Status','','',''],
                colModel: [
                    
                    {name: 'ruleId', index: 'ruleId', width: 240, align: 'left',sortable: true,sorttype: "string",classes: 'accountlist-account-cursor'},
                    {name: 'auditorId', index: 'auditorId', width: 240, align: 'center', fixed: true, sortable: true,sorttype: "string"},
                    {name: 'billType', width: 240,  fixed: true, sortable: true,sorttype: "string",align: 'center'}, 
                    {name: 'priority', index: 'priority', width: 200, align: 'center', fixed: true, sortable: true, editable:true,

                        edittype: "text",
                        editoptions: {
                            size: "10",
                            maxlength: "3",
                        },
                        editrules: {
                            custom: true,
                            custom_func: function(value, colname) {
                                if (value == "") {
                                    return [true, ""];
                                } else if (!(/^-?\d+$/.test(value)) || isNaN(value) || value == 0 || value < 0) {
                                    value = "";
                                    return [];
                                } else {
                                    return [true, ""];
                                }
                                ;
                            }
                        }



                    },
                    {name: 'status', index: 'status', width: 200, align: 'center', fixed: true, sortable: true},

                    {name: 'ruleDesc', index: 'ruleDesc', width: 300, fixed: true, sortable: true, sorttype: "int", classes: 'cell_wrapperleaf_new',hidden:true},
                    {name: 'ruleJson', index: 'ruleJson', width: 400, align: 'left', fixed: true, sortable: true,classes:'jqgrid-wrapText',hidden:true},
                    {name: 'computedQuery', index: 'computedQuery', width: 400, align: 'left', fixed: true, sortable: true, sorttype: "int",classes:'jqgrid-wrapText',hidden:true},
                    
                ],
                onSelectRow: function(id, status, e) {
                    if (grids.auditorQueueListGrid.selectedRow !== undefined) {
                        grids.auditorQueueListGrid.$gridDiv.jqGrid('saveRow', grids.auditorQueueListGrid.selectedRow);
                    }
                    grids.auditorQueueListGrid.selectedRow = id;
                    grids.auditorQueueListGrid.$gridDiv.jqGrid('editRow',id, true, false, false, false, false, false,false, afterrestorefunc);
                    function afterrestorefunc(e){
                        grids.auditorQueueListGrid.$gridDiv.trigger('jqGridInlineAfterSaveRow');
                     }

                //     log('missing Charges ID clicked ' + id + " " + grids.auditorQueueListGrid.selectedRow);
                },
                loadComplete: function() {
                }
            });

            this.$gridDiv.unbind("jqGridInlineAfterSaveRow");
            this.$gridDiv.bind("jqGridInlineAfterSaveRow", function(rowid) {
                log("jqGridInlineAfterSaveRow");
               var selectedRowData = grids.auditorQueueListGrid.$gridDiv.jqGrid('getRowData', grids.auditorQueueListGrid.selectedRow);
                grids.auditorQueueListGrid.$gridDiv.jqGrid('setRowData', grids.auditorQueueListGrid.selectedRow, selectedRowData);
                grids.auditorQueueListGrid.savedSuccessfully = true;
            });
        },
        fillGrid: function() {
             var datalength = this.data.length;
             for (var i = 0; i < datalength; i++) {
                 grids.auditorQueueListGrid.data[i].index = i;
                 grids.auditorQueueListGrid.data[i].auditorId = grids.auditorQueueListGrid.data[i].auditorList.join('<br>');
                 
                 grids.auditorQueueListGrid.data[i].billType = (grids.auditorQueueListGrid.data[i].primaryTable == 'T_PREDICTIONS_PRE')?'PRE' : 'POST';
                 if(grids.auditorQueueListGrid.data[i].billTypeAll == 1)
                    grids.auditorQueueListGrid.data[i].billType = 'PRE,POST';
                 grids.auditorQueueListGrid.data[i].status = (grids.auditorQueueListGrid.data[i].active == 1)?'Active' : 'In-Active';
                 grids.auditorQueueListGrid.$gridDiv.jqGrid('addRowData', i + 1, grids.auditorQueueListGrid.data[i]);
             }
             ;
             grids.auditorQueueListGrid.$gridDiv.setGridParam({rowNum: 30}).trigger("reloadGrid");
        }
    }
};


var gridsNew = {

existingChargesGrid: {
        $gridDiv: {},
        selectedRow: undefined,
        savedSuccessfully: true,
        isEditable: true,
        isConfirmCharg:false,
        initialize: function(param) {
            this.$gridDiv = $(param.gridDiv);
            gridsNew.existingChargesGrid.isConfirmCharg = param.isConfirmCharg;
            this.isEditable = param.isEditable === false ? false : true;
            this.loadGrid(param.$gridDiv);
            this.fillGrid(param.data);

        },
        loadGrid: function(param) { // param object holds gridDiv, data
            this.selectedRow = undefined;
            this.savedSuccessfully = true;

            this.$gridDiv.jqGrid({
                datatype: "local",
                height: (gridsNew.existingChargesGrid.isConfirmCharg)? '350':'200',
                autowidth: true,
                gridview: true,
                viewrecords: true,
                sortname: 'hcpcCode',
                altRows: true,
                altclass: 'alternate_row_color',
                // sortorder: 'asc',
                colNames: [globalvars.localResourceMap.existing_charge_hcpc_code, globalvars.localResourceMap.existing_charge_dept_code, '', globalvars.localResourceMap.existing_charge_charge_code,
                    globalvars.localResourceMap.existing_charge_unit, globalvars.localResourceMap.existing_charge_change_qty, globalvars.localResourceMap.existing_charge_amount,
                    globalvars.localResourceMap.existing_charge_charge_date,'Rev Code',globalvars.localResourceMap.existing_charge_charge_description, '','','',globalvars.localResourceMap.existing_charge_comment,'POST DATE','','','',''],
                colModel: [
                    {name: 'hcpcCode', index: 'hcpcCode', width: 80, fixed: true, sortable: true, sorttype: "string", align: 'center'},
                    {name: 'dept', index: 'dept', width: 80, fixed: true, sorttype: "int", align: 'center'},
                    {name: 'chargeNumber', index: 'chargeNumber', hidden: true},
                    {name: 'chargeCode', index: 'chargeCode', fixed: true, width: 80, sortable: true, sorttype: "int", align: 'center'},
                    {name: 'quantity', index: 'quantity', width: 50, fixed: true, align: "center", sorttype: "int"},
                    {
                        name: 'qty', index: 'qty', width: 60, fixed: true, align: "center", editable: this.isEditable, sorttype: "int",
                        edittype: "text",
                        editoptions: {
                            size: "3",
                            maxlength: "3",
                        },
                        editrules: {
                            custom: true,
                            custom_func: function(value, colname) {
                                if (value == "") {
                                    return [true, ""];
                                } else if (!(/^-?\d+$/.test(value)) || isNaN(value) || value == 0) {
                                    value = "";
                                    return [false, globalvars.localResourceMap.existing_charge_validation_msg];
                                } else {
                                    return [true, ""];
                                }
                                ;
                            }
                        }
                    },
                    {name: 'chargeAmount', index: 'chargeAmount', width: 80, fixed: true, sorttype: "int", align: 'right'},
                    {name: 'chargeDate', index: 'chargeDate', width: 85, fixed: true, align: "center", sorttype: "date"},
                    {name: 'revenueCode', index: 'revenueCode', width: 70, fixed: true, align: "center", sorttype: "date"},
                    {name: 'chargeDesc', index: 'chargeDesc', width: 200, fixed: true, sorttype: "string", classes: 'grid_cell_style'},
                    {name: 'modifier', index: 'modifier', width: 60, fixed: true, sortable: true, sorttype: "string", align: 'center',hidden: true},
                    {name: 'changeModifier', index: 'changeModifier', width: 50, fixed: true, editable: this.isEditable,sortable: true, sorttype: "string", align: 'center',hidden: true},
                    {name: 'medicareCode', index: 'medicareCode', width: 60, fixed: true, sortable: true, sorttype: "string", align: 'center',hidden: true},
                    {name: 'comments', index: 'comments_xact', width: 200, fixed: true, editable: this.isEditable,
                        editoptions: {
                            size: "25",
                            maxlength: "250",
                        },
                        classes: 'grid_cell_style'},
                    {name: 'postDate', index: 'postDate', width: 110, fixed: true, align: "left", sorttype: "date"},
                    {name: 'predKey', index: 'predKey',hidden:true},
                    {name: 'rowEditable', index: 'rowEditable',hidden:true},
                    {name: 'cenAuditorId', index: 'cenAuditorId',hidden:true},
                    {name: 'cenAuditingTime', index: 'cenAuditingTime',hidden:true}
                ],
                onSelectRow: function(id) {
                    var selectedRowData = gridsNew.existingChargesGrid.$gridDiv.jqGrid('getRowData', id);

                    if(selectedRowData.rowEditable == false || selectedRowData.rowEditable == "false"){
                        return;
                    }

                    if (gridsNew.existingChargesGrid.selectedRow !== undefined) {
                        gridsNew.existingChargesGrid.$gridDiv.jqGrid('saveRow', gridsNew.existingChargesGrid.selectedRow);
                    }
                    ;
                    if (gridsNew.existingChargesGrid.savedSuccessfully == true) {
                        gridsNew.existingChargesGrid.selectedRow = id;
                        //gridsNew.existingChargesGrid.$gridDiv.jqGrid('editRow', id, true,);
                        gridsNew.existingChargesGrid.$gridDiv.jqGrid('editRow',id, true, false, false, false, false, false,false, afterrestorefunc)
                        gridsNew.existingChargesGrid.savedSuccessfully = false;
                    }
                    
                    function afterrestorefunc(e){
                            gridsNew.existingChargesGrid.savedSuccessfully = true;
                    }

                  //  log('Exiting Charges ID clicked ' + id + " " + gridsNew.existingChargesGrid.selectedRow);
                },
                
                editurl: 'clientArray',
                loadComplete: function() {


                    $(("#account_details_existing_charges_grid_table tr")).removeClass('highlighted_row');
                     gridsNew.existingChargesGrid.$gridDiv.trigger("reloadGrid");


                     var gridRowData = gridsNew.existingChargesGrid.$gridDiv.jqGrid('getRowData');
                     var gridRowDataLength = gridRowData.length;

                    gridsNew.existingChargesGrid.$gridDiv.clearGridData();

                     var datalength = gridRowData.length;
                     for (var i = 0; i < datalength; i++) {
                         gridsNew.existingChargesGrid.$gridDiv.jqGrid('addRowData', i + 1, gridRowData[i]);
                     }
                     
                     gridsNew.existingChargesGrid.$gridDiv.setGridParam({rowNum: datalength}).trigger("reloadGrid");


                     var tableGridID = "#account_details_existing_charges_grid_table";
                     if(gridsNew.existingChargesGrid.isConfirmCharg == true){
                         tableGridID = "#confirm_charge_existing_charges_grid_table";
                     }

                     
                     for (var i = 0; i < gridRowDataLength; i++) {
                     //   log("isHighlighted new test " + gridRowData[i].rowEditable + " : " + (i + 1));
                         if (gridRowData[i].rowEditable == "false" || gridRowData[i].rowEditable == false) {
                       //      log("isHighlighted new test " + gridRowData[i].rowEditable + " : " + (i + 1));
                             $(tableGridID).find("tr#" + (i + 1)).addClass("highlighted_row");
                         }
                     }

                     $(tableGridID).find('tr').find('td:eq(16)').each(function(){
                            //console.log($(this).text());

                            if($(this).text() == "false" || $(this).text() == false){

                                $(this).parent().tooltip({
                                content: function(response) {
                                    //console.log(this.parentNode)
                                    if(this.parentNode){
                                        var rowData = gridsNew.existingChargesGrid.$gridDiv.jqGrid('getRowData',this.parentNode.id);
                                        return '<b>Assigned to: </b>' + rowData.cenAuditorId+"<br/><b>Submitted on: </b>" + rowData.cenAuditingTime;
                                    }
                                },
                                open: function() {
                                    $(this).tooltip("widget").stop(false, true).hide().slideDown("fast");
                                },
                                close: function() {
                                    $(this).tooltip("widget").stop(false, true).show().slideUp("fast");
                                }
                            }).tooltip("widget").addClass("ui-state-highlight");
                        }
                    })
                    // gridsNew.existingChargesGrid.$gridDiv.jqGrid('setLabel', 'chargeDesc', '', {'text-align': 'left', 'padding-left': '16px', 'width': '186px'});
                    // gridsNew.existingChargesGrid.$gridDiv.jqGrid('setLabel', 'comments', '', {'text-align': 'left', 'padding-left': '16px', 'width': '186px'});

                     gridsNew.existingChargesGrid.$gridDiv.jqGrid('setLabel', 'postDate', '', {'text-align': 'left', 'padding-left': '-20px', 'width': '110px'});
                }

            });

            this.$gridDiv.bind("jqGridInlineAfterSaveRow", function(rowid) {
             //   log("jqGridInlineAfterSaveRow");
                gridsNew.existingChargesGrid.savedSuccessfully = true;
            });
            
        },
        fillGrid: function(data) {
            this.$gridDiv.clearGridData();
            var datalength = data.length;
            for (var i = 0; i < datalength; i++) {
                this.$gridDiv.jqGrid('addRowData', i + 1, data[i]);
            }
            ;
            this.$gridDiv.setGridParam({rowNum: datalength}).trigger("reloadGrid");
        }
    },
    missingChargesGrid: {
        $gridDiv: {},
        selectedRow: undefined,
        savedSuccessfully: true,
        isEditable: true,
        isHidden: true,
        isConfirmCharg: false,
        altRows: true,
        backScreen:"",
        altclass: 'alternate_row_color',
        screenName: "",
        initialize: function(param) {
            gridsNew.missingChargesGrid.isConfirmCharg = param.isConfirmCharg;
            this.$gridDiv = $(param.gridDiv);
            this.isEditable = param.isEditable === false ? false : true;
            this.isHidden = param.isHidden === false ? false : true;
            this.backScreen = param.backScreen;
            this.loadGrid(param.$gridDiv);
            this.fillGrid(param.data);
            this.screenName = param.screenName;
        },
        loadGrid: function(param) { // param object holds gridDiv, data
            this.selectedRow = undefined;
            this.savedSuccessfully = true;
            this.$gridDiv.jqGrid({
                datatype: "local",
                autowidth: true,
                height: (gridsNew.missingChargesGrid.isConfirmCharg)? '120':'160',
                gridview: true,
                viewrecords: true,
                altRows: true,
                altclass: 'alternate_row_color',
                sortorder: 'asc',
                colNames: [globalvars.localResourceMap.missing_charge_hcpc_code, globalvars.localResourceMap.missing_charge_dept_code, globalvars.localResourceMap.missing_charge_charge_code, globalvars.localResourceMap.missing_charge_price,
                    globalvars.localResourceMap.missing_charge_add_qty, globalvars.localResourceMap.missing_charge_date_of_service, globalvars.localResourceMap.missing_charge_charge_description,
                    globalvars.localResourceMap.missing_charge_response, globalvars.localResourceMap.missing_charge_response_code, globalvars.localResourceMap.missing_charge_pred_code, globalvars.localResourceMap.missing_charge_comment,'','','','','','',''],
                colModel: [
                    {
                        name: 'hcpcCodeDisplay', index: 'hcpcCodeDisplay', width: 100, fixed: true, sortable: true, sorttype: "string", align: "center"
                    },
                    {name: 'dept', index: 'dept', width: 100, fixed: true, sorttype: "int", align: "center"},
                    {name: 'chargeCode', index: 'chargeCode', width: 80, fixed: true, sortable: true, sorttype: "int", align: "center"},
                    {name: 'price', index: 'price', width: 70, fixed: true, sortable: true, sorttype: "int", align: "center"},
                    {
                        name: 'qty', index: 'qty', width: 70, fixed: true, sortable: true, sorttype: "int", editable: this.isEditable, align: "center",
                        edittype: "text",
                        editoptions: {
                            size: "3",
                            maxlength: "3",
                            minValue: 1
                        }, editrules: {
                            custom: true,
                            custom_func: function(value, colname) {
                            	if(value !== undefined){
    								if (!(/^-?\d+$/.test(value)) || isNaN(value)) {
                                        return [false, globalvars.localResourceMap.missing_charge_validation_msg];
                                    } 
                            	}
                                var selectedRowData = gridsNew.missingChargesGrid.$gridDiv.jqGrid('getRowData', gridsNew.missingChargesGrid.selectedRow);
                                var currentResponseValue = $("#responseSelect" + gridsNew.missingChargesGrid.selectedRow + " option:selected").val();

                                var currentDeptValue = $("#deptSelect" + gridsNew.missingChargesGrid.selectedRow + " option:selected").val();
                                var currentChargeCodeValue = $("#chargeCodeSelect" + gridsNew.missingChargesGrid.selectedRow + " option:selected").val();
								if (value > 0 && currentResponseValue != "Y") {
                                        return [false, globalvars.localResourceMap.missing_charge_validation_msg3];
                                    } else if (value < 1 && currentResponseValue == "Y") {
                                        return [false, globalvars.localResourceMap.missing_charge_validation_msg2];
                                    } else {
                                        return [true, ""];
                                    };                                
                            }
                        }
                    },
                    {name: 'dateOfService', index: 'dateOfService', width: 80, fixed: true, sortable: true, sorttype: "date", datefmt: "Y-m-d h:i:s", editable: this.isEditable, align: "center",
                    editoptions:{
                                            readonly: 'readonly'
                                 }},
                    {name: 'chargeDesc', index: 'chargeDesc', fixed: true, width: 180, classes: 'grid_cell_style'},
                    {name: 'response', index: 'response', fixed: true, width: 150, classes: 'grid_cell_style'},
                    {name: 'responseCode', hidden: true},
                    {name: 'predCode', hidden: true},
                    {name: 'comments', index: 'comments', width: 200, fixed: true, editable: this.isEditable,  editoptions: {
                            size: "23",
                            maxlength: "250",
                        },
                        classes: 'grid_cell_style'},
                    {name: 'isNew', hidden: true},
                    {name: 'predKey', index: 'predKey',hidden:true},
                    {name: 'rowEditable', index: 'rowEditable',hidden:true},
                    {name: 'cenAuditorId', index: 'cenAuditorId',hidden:true},
                    {name: 'cenAuditingTime', index: 'cenAuditingTime',hidden:true},
                    {name: 'hcpcCode', index: 'hcpcCode', hidden:true},
                    {name: 'isComment', index: 'isComment', fixed: true, width: 70, classes: 'grid_cell_style',align: "left"}
                    

                    
                ],
            	onSelectRow: function(id, status, e) {

                	var rowData = gridsNew.missingChargesGrid.$gridDiv.jqGrid('getRowData', id);

                    if(rowData.rowEditable == false || rowData.rowEditable == "false"){
                        var colIndex = $(e.target).index();
                        if(colIndex == 17){
                         //if(gridsNew.missingChargesGrid.isEditable == true){
                            var gridData = gridsNew.missingChargesGrid.$gridDiv.jqGrid("getGridParam", "dataNew");
                            screens.accountDetails.showTipOffCommentDialog(gridData[id-1], id,gridsNew.missingChargesGrid.isConfirmCharg);
                         //}
                        }  
                        return;
                    }

                    var colIndex = $(e.target).index();
                    if(colIndex == 17){
                         //if(gridsNew.missingChargesGrid.isEditable == true){
                            var gridData = gridsNew.missingChargesGrid.$gridDiv.jqGrid("getGridParam", "dataNew");
                            screens.accountDetails.showTipOffCommentDialog(gridData[id-1], id,gridsNew.missingChargesGrid.isConfirmCharg);
                         //}
                    }  
                    else{
                        if (gridsNew.missingChargesGrid.selectedRow !== undefined) {

                            gridsNew.missingChargesGrid.$gridDiv.jqGrid('saveRow', gridsNew.missingChargesGrid.selectedRow);

                        }
                        if (gridsNew.missingChargesGrid.savedSuccessfully == true && gridsNew.missingChargesGrid.isEditable == true) {
                            gridsNew.missingChargesGrid.selectedRow = id;

                            var selectedRowData = gridsNew.missingChargesGrid.$gridDiv.jqGrid('getRowData', id);
                            var newRowData = gridsNew.missingChargesGrid.$gridDiv.jqGrid('getRowData', id);

                            newRowData.response = gridsNew.missingChargesGrid.createResponseDropdown({
                                rowData: selectedRowData,
                                rowId: id,
                                billType: gridsNew.missingChargesGrid.screenName
                            });

                            if (selectedRowData.hcpcCode != "") {
                                newRowData.dept = gridsNew.missingChargesGrid.createDeptDropdown({
                                    rowData: selectedRowData,
                                    rowId: id
                                });
							}

                            if (selectedRowData.hcpcCode != "" && selectedRowData.dept != "") {
                                newRowData.chargeCode = gridsNew.missingChargesGrid.createChargeCodeDropdown({
                                    rowData: selectedRowData,
                                    rowId: id
                                });
                            }

							gridsNew.missingChargesGrid.$gridDiv.jqGrid('setRowData', id, newRowData);

                            gridsNew.missingChargesGrid.bindDeptCodeChange({id: id});

                            gridsNew.missingChargesGrid.$gridDiv.jqGrid('editRow',id, true, false, false, false, false, false,false, afterrestorefunc);

                            if(gridsNew.missingChargesGrid.backScreen == "preBill" || gridsNew.missingChargesGrid.backScreen == "postBill")
								$('#' + id + '_' + 'dateOfService').datepicker({dateFormat: 'yy-mm-dd',defaultDate:screens.accountDetails.admitDate});
								//,minDate:screens.accountDetails.admitDate,maxDate:screens.accountDetails.dischargeDate});
                            else if(gridsNew.missingChargesGrid.backScreen == "associationRules")
								$('#' + id + '_' + 'dateOfService').datepicker({dateFormat: 'yy-mm-dd',defaultDate:screens.rulesAccountDetails.admitDate});
								//,minDate:screens.rulesAccountDetails.admitDate,maxDate:screens.rulesAccountDetails.dischargeDate});
                            else if(gridsNew.missingChargesGrid.backScreen == "editCharges")
								$('#' + id + '_' + 'dateOfService').datepicker({dateFormat: 'yy-mm-dd',defaultDate:screens.submittedAccountDetails.admitDate});
								//,minDate:screens.submittedAccountDetails.admitDate,maxDate:screens.submittedAccountDetails.dischargeDate});
                            else if(gridsNew.missingChargesGrid.backScreen == "cciEdits")
								$('#' + id + '_' + 'dateOfService').datepicker({dateFormat: 'yy-mm-dd',defaultDate:screens.cciEditsAccountDetails.admitDate});
								//,minDate:screens.submittedAccountDetails.admitDate,maxDate:screens.submittedAccountDetails.dischargeDate});
                                            
								//$('#' + id + '_' + 'dateOfService').datepicker({dateFormat: 'yy-mm-dd',defaultDate:screens.accountDetails.admitDate,minDate:screens.accountDetails.admitDate,maxDate:screens.accountDetails.dischargeDate
							gridsNew.missingChargesGrid.savedSuccessfully = false;

                        }
                        
                    }
                    function afterrestorefunc(e){
                        gridsNew.missingChargesGrid.$gridDiv.trigger('jqGridInlineAfterSaveRow');
                    }

                   //  log('missing Charges ID clicked ' + id + " " + gridsNew.missingChargesGrid.selectedRow);
            		
                },
                editurl: 'clientArray',
                loadComplete: function() {
                    $(("#account_details_missing_charges_grid_table tr")).removeClass('highlighted_row');
                     gridsNew.missingChargesGrid.$gridDiv.trigger("reloadGrid");

                     var gridRowData = gridsNew.missingChargesGrid.$gridDiv.jqGrid('getRowData');
                     var gridRowDataLength = gridRowData.length;

                     var gridData = gridsNew.missingChargesGrid.$gridDiv.jqGrid("getGridParam", "dataNew");


                     gridsNew.missingChargesGrid.$gridDiv.clearGridData();
                    
                     var datalength = gridRowData.length;
                     for (var i = 0; i < datalength; i++) {
                         gridsNew.missingChargesGrid.$gridDiv.jqGrid('addRowData', i + 1, gridRowData[i]);
                     }
                     
                     gridsNew.missingChargesGrid.$gridDiv.setGridParam({rowNum: datalength}).trigger("reloadGrid");

                     
                     var tableGridID = "#account_details_missing_charges_grid_table";
                     if(gridsNew.missingChargesGrid.isConfirmCharg == true){
                         tableGridID = "#confirm_charge_missing_charges_grid_table";
                     }
                     
                     for (var i = 0; i < gridRowDataLength; i++) {
                         if (gridRowData[i].rowEditable == "false" || gridRowData[i].rowEditable == false) {
                         //    log("isHighlighted " + gridRowData[i].isNew + " : " + (i + 1));
                             $(tableGridID).find("tr#" + (i + 1)).addClass("highlighted_row");
                         }
                         $(tableGridID).find("tr#" + (i + 1)).find("td:last").text("");
                         //$(("#confirm_charge_missing_charges_grid_table" + "tr#" + (i + 1))).find("td:last").text("");
                         if (gridData[i].isComment == true) {
                             //$(("#account_details_missing_charges_grid_table tr#" + (i + 1))).find("td:last").addClass("lightbulb_on");
                             $(tableGridID).find("tr#" + (i + 1)).find("td:last").addClass("lightbulb_on");
                         }
                         else{
                             //$(("#account_details_missing_charges_grid_table tr#" + (i + 1))).find("td:last").addClass("lightbulb_off");
                             $(tableGridID).find("tr#" + (i + 1)).find("td:last").addClass("lightbulb_off");
                         }
                     }


                     $(tableGridID).find('tr').find('td:eq(13)').each(function(){
                            //console.log($(this).text());

                            if($(this).text() == "false" || $(this).text() == false){

                                $(this).parent().tooltip({
                                content: function(response) {
                                    //console.log(this.parentNode)
                                    if(this.parentNode){
                                        var rowData = gridsNew.missingChargesGrid.$gridDiv.jqGrid('getRowData',this.parentNode.id);
                                        return '<b>Assigned to: </b>' + rowData.cenAuditorId+"<br/><b>Submitted on: </b>" + rowData.cenAuditingTime;
                                    }
                                },
                                open: function() {
                                    $(this).tooltip("widget").stop(false, true).hide().slideDown("fast");
                                },
                                close: function() {
                                    $(this).tooltip("widget").stop(false, true).show().slideUp("fast");
                                }
                            }).tooltip("widget").addClass("ui-state-highlight");
                        }
                    })
                               
                  //  gridsNew.missingChargesGrid.$gridDiv.jqGrid('setLabel', 'chargeDesc', '', {'text-align': 'left', 'padding-left': '8px'});
                  //  gridsNew.missingChargesGrid.$gridDiv.jqGrid('setLabel', 'response', '', {'text-align': 'left', 'padding-left': '8px'});
                  //  gridsNew.missingChargesGrid.$gridDiv.jqGrid('setLabel', 'comments', '', {'text-align': 'left', 'padding-left': '25px'});
                  //  gridsNew.missingChargesGrid.$gridDiv.jqGrid('setLabel', 'isComment', '', {'text-align': 'left', 'padding-left': '0px'});
                }

            });

            this.$gridDiv.unbind("jqGridInlineAfterSaveRow");
            this.$gridDiv.bind("jqGridInlineAfterSaveRow", function(rowid) {
              //  log("jqGridInlineAfterSaveRow");

                var selectedRowData = gridsNew.missingChargesGrid.$gridDiv.jqGrid('getRowData', gridsNew.missingChargesGrid.selectedRow);
                selectedRowData.responseCode = $("#responseSelect" + gridsNew.missingChargesGrid.selectedRow + " option:selected").val();
                selectedRowData.response = $("#responseSelect" + gridsNew.missingChargesGrid.selectedRow + " option:selected").text();

                selectedRowData.dept = $("#deptSelect" + gridsNew.missingChargesGrid.selectedRow + " option:selected").val();

                selectedRowData.chargeCode = $("#chargeCodeSelect" + gridsNew.missingChargesGrid.selectedRow + " option:selected").val();

             //   log(selectedRowData);
                gridsNew.missingChargesGrid.$gridDiv.jqGrid('setRowData', gridsNew.missingChargesGrid.selectedRow, selectedRowData);

                gridsNew.missingChargesGrid.savedSuccessfully = true;
            });


        },
        fillGrid: function(data) {
            this.$gridDiv.clearGridData();
            var datalength = data.length;
            //var data = eval([{"hcpcCode":"95819","dept":"","chargeCode":"","qty":0,"chargeDesc":"ELECTROENCEPHALOGRAM (EEG)","response":null,"responseCode":null,"comments":null,"predCode":"95819","dateOfService":null,"chargeNumber":null,"price":2208.72,"isNew":true,"addComment":"","tipOffComment":{"comment":"test","selectedFacilities":["Bayonne","Cayonne"],"newComment":""}},{"hcpcCode":"94002","dept":"","chargeCode":"","qty":0,"chargeDesc":"INITIAL,VENTILATORMANAGEMENT","response":null,"responseCode":null,"comments":null,"predCode":"94002","dateOfService":null,"chargeNumber":null,"price":1411.65,"isNew":true,"addComment":"","tipOffComment":{"comment":"", "selectedFacilities":[],"newComment":""}}]);
            for (var i = 0; i < datalength; i++) {
                this.$gridDiv.jqGrid('addRowData', i + 1, data[i]);
            }

            this.$gridDiv.setGridParam({dataNew: data});

            this.$gridDiv.setGridParam({rowNum: datalength}).trigger("reloadGrid");
        },
        bindDeptCodeChange: function(param) {

            $("#deptSelect" + param.id).change(function() {

               // log("changing!!");
                gridsNew.missingChargesGrid.$gridDiv.jqGrid('saveRow', param.id);

                if (gridsNew.missingChargesGrid.savedSuccessfully) {
                    log("changing!! succes save");

                    var changingRowData = gridsNew.missingChargesGrid.$gridDiv.jqGrid('getRowData', param.id);
                    var changingNewRowData = gridsNew.missingChargesGrid.$gridDiv.jqGrid('getRowData', param.id);
                //    log(changingRowData);

                    changingNewRowData.response = gridsNew.missingChargesGrid.createResponseDropdown({
                        rowData: changingRowData,
                        rowId: param.id,
                        billType: gridsNew.missingChargesGrid.screenName
                    });

                    changingNewRowData.dept = gridsNew.missingChargesGrid.createDeptDropdown({
                        rowData: changingRowData,
                        rowId: param.id
                    });

                    if (changingRowData.dept != "") {
						changingRowData.chargeCode="";
                        changingNewRowData.chargeCode = gridsNew.missingChargesGrid.createChargeCodeDropdown({
                            rowData: changingRowData,
                            rowId: param.id
                        });
                        changingNewRowData.price = "";
                    } else {
                        changingNewRowData.chargeCode = "";
						changingNewRowData.price = "";
					}
					gridsNew.missingChargesGrid.$gridDiv.jqGrid('setRowData', param.id, changingNewRowData);

					gridsNew.missingChargesGrid.$gridDiv.jqGrid('editRow', param.id, true);

					if(gridsNew.missingChargesGrid.backScreen == "preBill" || gridsNew.missingChargesGrid.backScreen == "postBill")
						$('#' + param.id + '_' + 'dateOfService').datepicker({dateFormat: 'yy-mm-dd',defaultDate:screens.accountDetails.admitDate});//,minDate:screens.accountDetails.admitDate,maxDate:screens.accountDetails.dischargeDate});
                    else if(gridsNew.missingChargesGrid.backScreen == "associationRules")
						$('#' + param.id + '_' + 'dateOfService').datepicker({dateFormat: 'yy-mm-dd',defaultDate:screens.rulesAccountDetails.admitDate});//,minDate:screens.rulesAccountDetails.admitDate,maxDate:screens.rulesAccountDetails.dischargeDate});
                    else if(gridsNew.missingChargesGrid.backScreen == "editCharges")
						$('#' + param.id + '_' + 'dateOfService').datepicker({dateFormat: 'yy-mm-dd',defaultDate:screens.submittedAccountDetails.admitDate});//,minDate:screens.submittedAccountDetails.admitDate,maxDate:screens.submittedAccountDetails.dischargeDate});
					else if(gridsNew.missingChargesGrid.backScreen == "cciEdits")
						$('#' + param.id + '_' + 'dateOfService').datepicker({dateFormat: 'yy-mm-dd',defaultDate:screens.cciEditsAccountDetails.admitDate});//,minDate:screens.submittedAccountDetails.admitDate,maxDate:screens.submittedAccountDetails.dischargeDate});
                            

                        //$('#' + param.id + '_' + 'dateOfService').datepicker({dateFormat: 'yy-mm-dd',defaultDate:screens.accountDetails.admitDate,minDate:screens.accountDetails.admitDate,maxDate:screens.accountDetails.dischargeDate})

                    gridsNew.missingChargesGrid.bindDeptCodeChange({id: param.id});

                    gridsNew.missingChargesGrid.savedSuccessfully = false;
                }
            });
            $("#chargeCodeSelect" + param.id).change(function() {

             //   log("changing!!");
                gridsNew.missingChargesGrid.$gridDiv.jqGrid('saveRow', param.id);

                if (gridsNew.missingChargesGrid.savedSuccessfully) {
                    log("changing!! succes save");

                    var changingRowData = gridsNew.missingChargesGrid.$gridDiv.jqGrid('getRowData', param.id);
                    var changingNewRowData = gridsNew.missingChargesGrid.$gridDiv.jqGrid('getRowData', param.id);
             //       log(changingRowData);

                    changingNewRowData.response = gridsNew.missingChargesGrid.createResponseDropdown({
                        rowData: changingRowData,
                        rowId: param.id,
                        billType: gridsNew.missingChargesGrid.screenName
                    });

					changingNewRowData.dept = gridsNew.missingChargesGrid.createDeptDropdown({
                        rowData: changingRowData,
                        rowId: param.id
                    });

					changingNewRowData.chargeCode = gridsNew.missingChargesGrid.createChargeCodeDropdown({
                        rowData: changingRowData,
                        rowId: param.id
                    });

                    var selChargeCode = $(this).val();
                    if($.trim(selChargeCode) != ""){
                            if(globalvars.missingChargesChargeCodes){
                                for(var i=0;i<globalvars.missingChargesChargeCodes.length;i++){
                                    if(globalvars.missingChargesChargeCodes[i].chargeCode == $.trim(selChargeCode)){
                                         changingNewRowData.chargeDesc = globalvars.missingChargesChargeCodes[i].chargeDesc;
                                         break;
                                    }
                                }
                            }
                            
                    }

					if (changingRowData.dept != "" && changingRowData.chargeCode != "") {

                        changingNewRowData.price = gridsNew.missingChargesGrid.createChargePrice({
                            rowData: changingRowData,
                            rowId: param.id
                        });
						
					} else {
						changingNewRowData.price = "";
                        
					}


					gridsNew.missingChargesGrid.$gridDiv.jqGrid('setRowData', param.id, changingNewRowData);

                    gridsNew.missingChargesGrid.$gridDiv.jqGrid('editRow', param.id, true);
                        
					if(gridsNew.missingChargesGrid.backScreen == "preBill" || gridsNew.missingChargesGrid.backScreen == "postBill")
						$('#' + param.id + '_' + 'dateOfService').datepicker({dateFormat: 'yy-mm-dd',defaultDate:screens.accountDetails.admitDate});//,minDate:screens.accountDetails.admitDate,maxDate:screens.accountDetails.dischargeDate});
                    else if(gridsNew.missingChargesGrid.backScreen == "associationRules")
						$('#' + param.id + '_' + 'dateOfService').datepicker({dateFormat: 'yy-mm-dd',defaultDate:screens.rulesAccountDetails.admitDate});//,minDate:screens.rulesAccountDetails.admitDate,maxDate:screens.rulesAccountDetails.dischargeDate});
                    else if(gridsNew.missingChargesGrid.backScreen == "editCharges")
						$('#' + param.id + '_' + 'dateOfService').datepicker({dateFormat: 'yy-mm-dd',defaultDate:screens.submittedAccountDetails.admitDate});//,minDate:screens.submittedAccountDetails.admitDate,maxDate:screens.submittedAccountDetails.dischargeDate});
                    else if(gridsNew.missingChargesGrid.backScreen == "cciEdits")
						$('#' + id + '_' + 'dateOfService').datepicker({dateFormat: 'yy-mm-dd',defaultDate:screens.cciEditsAccountDetails.admitDate});//,minDate:screens.submittedAccountDetails.admitDate,maxDate:screens.submittedAccountDetails.dischargeDate});
                                
						//$('#' + param.id + '_' + 'dateOfService').datepicker({dateFormat: 'yy-mm-dd',defaultDate:screens.accountDetails.admitDate,minDate:screens.accountDetails.admitDate,maxDate:screens.accountDetails.dischargeDate});

                    gridsNew.missingChargesGrid.bindDeptCodeChange({id: param.id});

					gridsNew.missingChargesGrid.savedSuccessfully = false;
                }
            });
        },
        createDeptDropdown: function(param) {

            var dfd = jQuery.Deferred();

            var searchQueryObject = {
                hospitalIdValue: (gridsNew.missingChargesGrid.screenName == 'PRE') ? globalvars.preHospitals[globalvars.selectedPreHospitalIndex].hospitalId : globalvars.postHospitals[globalvars.selectedPostHospitalIndex].hospitalId,
                hospitalIdType: "equals",
                hcpcValue: param.rowData.hcpcCode,
                hcpcType: "equals"
            };

            getJSONModel({
                async: false,
                url: globalvars.charges.chargesLookupUri,
                data: searchQueryObject,
                targetVar: "missingChargesDeptCodes"
            });

            var deptDropdown = createSelectBox({
                    index: param.rowId,
                    selectDivId: "deptSelect",
                    values: globalvars.missingChargesDeptCodes,
                    currentValue: param.rowData.dept,
                    valueKey: "dept",
                    textKey: "dept",
                    secondaryTextKey: "deptDesc",
                    addEmptyItem: true,
                    checkForUniqueKeys: true
            });

            return deptDropdown;

        },
        createResponseDropdown: function(param) {
            var response=[];
            if(param.billType != "POST"){
                var datalength = globalvars.responses.length;
                for (var i = 0; i < datalength;i++) {
                    if( globalvars.responses[i].value != "LPPB" && globalvars.responses[i].value != "ZNI")
                        response.push(globalvars.responses[i]);
                }

            }else{
                response = globalvars.responses;
            }


            var responseDropdown = createSelectBox({
                index: param.rowId,
                selectDivId: "responseSelect",
                values: response,
                currentValue: param.rowData.responseCode,
                valueKey: "value",
                textKey: "description",
                addEmptyItem: true
            });

            return responseDropdown;
        },
        createChargeCodeDropdown: function(param) {
            
            var dfd = jQuery.Deferred();

            var searchQueryObject = {
                hospitalIdValue: (gridsNew.missingChargesGrid.screenName == 'PRE') ? globalvars.preHospitals[globalvars.selectedPreHospitalIndex].hospitalId : globalvars.postHospitals[globalvars.selectedPostHospitalIndex].hospitalId,
                hospitalIdType: "equals",
                hcpcValue: param.rowData.hcpcCode,
                hcpcType: "equals",
                deptValue: param.rowData.dept,
                deptType: "equals"
            };

         //   log(searchQueryObject);

            getJSONModel({
                async: false,
                url: globalvars.charges.chargesLookupUri,
                data: searchQueryObject,
                targetVar: "missingChargesChargeCodes"
            });

            var chargeCodeDropdown = createSelectBox({
                    index: param.rowId,
                    selectDivId: "chargeCodeSelect",
                    values: globalvars.missingChargesChargeCodes,
                    currentValue: param.rowData.chargeCode,
                    valueKey: "chargeCode",
                    textKey: "chargeCode",
                    secondaryTextKey: "chargeDesc",
                    addEmptyItem: true,
                    checkForUniqueKeys: true
			});
                
            return chargeCodeDropdown;

        },
        createChargePrice: function(param) {

            var dfd = jQuery.Deferred();

            var price = "";
            var hospitalIdValue = (gridsNew.missingChargesGrid.screenName == 'PRE') ? globalvars.preHospitals[globalvars.selectedPreHospitalIndex].hospitalId : globalvars.postHospitals[globalvars.selectedPostHospitalIndex].hospitalId;
            
            $.ajax({
                type: 'GET',
                url: globalvars.charges.chargesLookupPriceUri + "?hospitalIdValue=" + hospitalIdValue + "&deptValue=" + param.rowData.dept + "&chargeValue=" + param.rowData.chargeCode + "&hcpcValue=" + param.rowData.hcpcCode,
				async: false,
                contentType: 'application/json',
                error: function(jqxhr) {
                },
                success: function(str) {
                    price = str;
                }
            });

			return price;
        }
    },
    loadAssociateRulesSearchFormGrid: {
        $gridDiv:{},
        loadGrid: function(param) {
        this.$gridDiv = $(param.gridDiv);
        this.$gridDiv.jqGrid({
            datatype: "local",
            width: '740',
            height: '200',
            gridview: true,
            viewrecords: true,
            sortorder: 'asc',
            altRows: true,
            altclass: 'alternate_row_color',
            colNames: [globalvars.localResourceMap.other_discoved_search_dept_code, 'Dept Description', globalvars.localResourceMap.other_discoved_search_charge_code,
                globalvars.localResourceMap.other_discoved_search_charge_desp, globalvars.localResourceMap.other_discoved_search_hcpc,
                globalvars.localResourceMap.other_discoved_search_rev_code, globalvars.localResourceMap.other_discoved_charge_price,'#count','','targetCode','targetCodeType'],
            colModel: [
                {name: 'dept', index: 'dept', width: 70, sortable: true, sorttype: 'int', fixed: true, align: 'center'},
                {name: 'deptDesc', index: 'deptDesc', width: 100, sortable: true, sorttype: 'int', fixed: true, align: 'center'},
                {name: 'chargeCode', index: 'chargeCode', width: 80, sortable: true, sorttype: 'int', fixed: true, align: 'center'},
                {name: 'chargeDesc', index: 'chargeDesc', width: 130, sortable: true, sorttype: 'string', fixed: true, classes: 'grid_cell_style'},
                {name: 'hcpcCode', index: 'hcpcCode', width: 70, sortable: true, sorttype: 'int', fixed: true, align: 'center'},
                {name: 'revenueCode', index: 'revenueCode', width: 60, sortable: true, sorttype: 'int', fixed: true, align: 'center'},
                {name: 'price', index: 'price', width: 60, sortable: true, sorttype: 'int', fixed: true, align: 'center'},
                {name: 'freqCount', index: 'freqCount', width: 60, sortable: true, sorttype: 'int', fixed: true, align: 'center'},
                {name: 'search', index: 'search', width: 80, fixed: true, align: 'center'},
                {name: 'targetCode', index: 'targetCode',hidden:true},
                {name: 'targetCodeType', index: 'targetCodeType',hidden:true}
            ],
            ondblClickRow: function(id) {

                globalvars.other_associateCode_charges_selected_row_form_data = gridsNew.loadAssociateRulesSearchFormGrid.$gridDiv.jqGrid('getRowData', id);
                $("#associate_rules_grid_search_form_dialog").dialog("close");

                var data = {
                    hcpcCode: globalvars.other_associateCode_charges_selected_row_form_data.hcpcCode,
                    dept: globalvars.other_associateCode_charges_selected_row_form_data.dept,
                    chargeCode: globalvars.other_associateCode_charges_selected_row_form_data.chargeCode,
                    chargeDesc: globalvars.other_associateCode_charges_selected_row_form_data.chargeDesc,
                    price: globalvars.other_associateCode_charges_selected_row_form_data.price,
                    revenueCode: globalvars.other_associateCode_charges_selected_row_form_data.revenueCode,
                    targetCode: globalvars.other_associateCode_charges_selected_row_form_data.targetCode,
                    targetCodeType: globalvars.other_associateCode_charges_selected_row_form_data.targetCodeType
                };

                var test = gridsNew.associationRulesGrid.$gridDiv.jqGrid('getRowData', gridsNew.associationRulesGrid.selectedRow);
                if (test) {

                    gridsNew.associationRulesGrid.$gridDiv.jqGrid('setCell', test.id, 'hcpcCode', data.hcpcCode);
                    gridsNew.associationRulesGrid.$gridDiv.jqGrid('setCell', test.id, 'dept', data.dept);
                    gridsNew.associationRulesGrid.$gridDiv.jqGrid('setCell', test.id, 'chargeCode', data.chargeCode);
                    gridsNew.associationRulesGrid.$gridDiv.jqGrid('setCell', test.id, 'chargeDescription', data.chargeDesc);
                    gridsNew.associationRulesGrid.$gridDiv.jqGrid('setCell', test.id, 'price', data.price);
                    gridsNew.associationRulesGrid.$gridDiv.jqGrid('setCell', test.id, 'revCode', data.revenueCode);
                    gridsNew.associationRulesGrid.$gridDiv.jqGrid('setCell', test.id, 'targetCode', data.targetCode);
                    gridsNew.associationRulesGrid.$gridDiv.jqGrid('setCell', test.id, 'targetCodeType', data.targetCodeType);
                }
                    gridsNew.associationRulesGrid.isEditable=true;
            },
            
            loadComplete: function() {

                //$gridDiv.jqGrid('setLabel', 'chargeDesc', '', {'text-align': 'left', 'padding-left': '16px', 'width': '216px'});
            }
        });
        
      
        
        },
        addBthClick:function(id){
            globalvars.other_discovered_charges_selected_row_form_data = gridsNew.loadAssociateRulesSearchFormGrid.$gridDiv.jqGrid('getRowData', id);
            var data = {
                hcpcCode: globalvars.other_discovered_charges_selected_row_form_data.hcpcCode,
                dept: globalvars.other_discovered_charges_selected_row_form_data.dept,
                chargeCode: globalvars.other_discovered_charges_selected_row_form_data.chargeCode,
                price: globalvars.other_discovered_charges_selected_row_form_data.price
            };
            
            if (gridsNew.otherChargesGrid.selectedRow !== undefined) {
              //  log("submitting + saving row " + grids.otherChargesGrid.selectedRow);
                gridsNew.otherChargesGrid.$gridDiv.jqGrid('saveRow', gridsNew.otherChargesGrid.selectedRow);

            };
            
            if (gridsNew.otherChargesGrid.savedSuccessfully == true) {
            var searchDiv = '<div class="other_discover_search_wrapper"><img class="search_cell_del" src="common/images/account-details/delete-icon.png"><img class="search_cell_search" src="common/images/account-details/search-icon.png"></div>';
            
            var otherchargesgrid_data = gridsNew.otherChargesGrid.$gridDiv.jqGrid('getRowData');
            var otherchargesgrid_data_newrow = (otherchargesgrid_data.length)+1
            var newrow = { id: otherchargesgrid_data_newrow, search: "", hcpcCode: "", dept: "", chargeCode: "", quantity:'', comments: "",method:'MANUAL-A2' ,rowEditable:true};
            gridsNew.otherChargesGrid.$gridDiv.jqGrid('addRowData', otherchargesgrid_data_newrow, newrow);
           // log("New Row added to Other Charges Grid as row " + otherchargesgrid_data_newrow);
           
            //$("#account_details_other_charges_grid .ui-jqgrid-bdiv").scrollTop($("#account_details_other_charges_grid .ui-jqgrid-bdiv")[0].scrollHeight);  

            var test = gridsNew.otherChargesGrid.$gridDiv.jqGrid('getRowData', otherchargesgrid_data_newrow);//$("#account_details_other_charges_grid_table").getRowData(grids.otherChargesGrid.selectedRow);
            if (test) {
                gridsNew.otherChargesGrid.$gridDiv.jqGrid('setCell', otherchargesgrid_data_newrow, 'chargeCode', data.chargeCode);
                gridsNew.otherChargesGrid.$gridDiv.jqGrid('setCell', otherchargesgrid_data_newrow, 'dept', data.dept);
                gridsNew.otherChargesGrid.$gridDiv.jqGrid('setCell', otherchargesgrid_data_newrow, 'hcpcCode', data.hcpcCode);
                gridsNew.otherChargesGrid.$gridDiv.jqGrid('setCell', otherchargesgrid_data_newrow, 'price', data.price);
                gridsNew.otherChargesGrid.$gridDiv.jqGrid('setCell', otherchargesgrid_data_newrow, 'quantity', 1);
                gridsNew.otherChargesGrid.$gridDiv.jqGrid('setCell', otherchargesgrid_data_newrow, 'search', searchDiv, '');
                
                gridsNew.otherChargesGrid.$gridDiv.setGridParam({ rowNum: 30 }).trigger("reloadGrid");
                gridsNew.otherChargesGrid.$gridDiv.setSelection(otherchargesgrid_data_newrow, true);
                gridsNew.otherChargesGrid.savedSuccessfully = false;

            }
            }
            

        }
            
        
    
    },
     otherChargesGrid: {
        $gridDiv: {},
        selectedRow: undefined,
        savedSuccessfully: true,
        isEditable: true,
        billType: "",
        backScreen:"",
        initialize: function(param) {
            this.$gridDiv = $(param.gridDiv);
            this.isEditable = param.isEditable === false ? false : true;
            this.backScreen = param.backScreen;
            this.loadGrid(param.$gridDiv);
            this.fillGrid(param.data);
            this.billType = param.screenName;
        },
        loadGrid: function(param) { // param object holds gridDiv, data
            this.selectedRow = undefined;
            this.savedSuccessfully = true;

            this.$gridDiv.jqGrid({
                datatype: "local",
                autowidth: true,
                height: '120',
                gridview: true,
                viewrecords: true,
//                sortname: 'hcpcCode',
//                sortorder: 'asc',
                altRows: true,
                altclass: 'alternate_row_color',
                colNames: ['id', globalvars.localResourceMap.other_discoved_charge_search, globalvars.localResourceMap.other_discoved_charge_hcpc_code,
                    globalvars.localResourceMap.other_discoved_charge_dept_code, globalvars.localResourceMap.other_discoved_charge_charge_code,
                    globalvars.localResourceMap.other_discoved_charge_price, globalvars.localResourceMap.other_discoved_charge_add_qty, globalvars.localResourceMap.other_charge_date_of_service, globalvars.localResourceMap.other_discoved_charge_comment,
                    globalvars.localResourceMap.other_discoved_charge_chargeDescription,'predNbr','','','','',''],
                colModel: [
                    {name: 'id', index: 'id', key: true, hidden: true},
                    {name: 'search', index: 'search', width: 100, fixed: true,sortable: false},
                    {
                        name: 'hcpcCode', index: 'hcpcCode', editable: true, width: 140, fixed: true, sortable:false, align: "center", sorttype: "string", key: true,
                        editoptions: {
                            size: "5",
                            maxlength: "5"
                        }
                    },
                    {
                        name: 'dept', index: 'dept', editable: false, width: 140, fixed: true, sorttype: "int", align: "center",sortable: false,
                        editoptions: {
//                            size: "3",
//                            maxlength: "3"
                        },
                        editrules: {
                            custom: true,
                            custom_func: function(value, colname) {
                                var selectedRowData = gridsNew.otherChargesGrid.$gridDiv.jqGrid('getRowData', gridsNew.otherChargesGrid.selectedRow);
                                if (value != undefined) {
                                    if (!(/^[a-z0-9\.\*]+$/i.test(value))){// || value.length !== 3) {
                                        return [false, globalvars.localResourceMap.other_discoverd_validation_new_msg4];
                                    } else {
                                        return [true, ""];
                                    }
                                }
                                else
                                    return [true, ""];
                            }
                        }
                    },
                    {
                        name: 'chargeCode', index: 'chargeCode', editable: false, width: 160, fixed: true, sortable: false, align: "center", sorttype: "int",
                        editoptions: {
//                            size: "5",
//                            maxlength: "5"
                        }
//                        editrules: {
//                            custom: true,
//                            custom_func: function(value, colname) {
//                                var selectedRowData = gridsNew.otherChargesGrid.$gridDiv.jqGrid('getRowData', gridsNew.otherChargesGrid.selectedRow);
//                                if (value != undefined) {
//                                    if (!(/^[a-z0-9.]+$/i.test(value))){// || value.length !== 5) {
//                                        return [false, globalvars.localResourceMap.other_discoverd_validation_new_msg3];
//                                    } else {
//                                        return [true, ""];
//                                    }
//                                }
//                                else
//                                    return [true, ""];
//                            }
//                        }
                    },
                    {name: 'price', index: 'price', width: 100, fixed: true, sortable: false, sorttype: "int", align: "center"},
                    {
                        name: 'quantity', index: 'quantity', sortable: false, editable: this.isEditable, width: 120, fixed: true, align: "center", sorttype: "int",
                        edittype: "text",
                        editoptions: {
                            size: "3",
                            maxlength: "3"
                        },
                        editrules: {
                            custom: true,
                            custom_func: function(value, colname) {
                                if (!(/^\d+$/.test(value)) || isNaN(value)) {
                                    return [false, globalvars.localResourceMap.other_discoverd_type_msg];
                                } else if (value < 1) {
                                    return [true, ""];
                                    //return [false, globalvars.localResourceMap.other_discoverd_validation_msg];
                                } else {
                                    return [true, ""];
                                }


                            }
                        }
                    },
                    {name: 'dateOfService1', index: 'dateOfService1', width: 120, fixed: true, sortable: false, sorttype: "date", datefmt: "Y-m-d h:i:s", editable: this.isEditable, align: "center",
                        editoptions:{
                                            readonly: 'readonly'
                                 }},
                    {name: 'comments', index: 'comments', editable: this.isEditable, width: 220, fixed: true,sortable: false,  editoptions: {
                            size: "23",
                            maxlength: "250",
                        },
                        classes: 'grid_cell_style'},
                    {name: 'chargeDescription', index: 'chargeDescription', hidden: true},
                    {name: 'predNbr', index: 'predNbr', hidden: true},
                    {name: 'method', index: 'method', hidden: true},
                    {name: 'predKey', index: 'predKey',hidden:true},
                    {name: 'rowEditable', index: 'rowEditable',hidden:true},
                    {name: 'cenAuditorId', index: 'cenAuditorId',hidden:true},
                    {name: 'cenAuditingTime', index: 'cenAuditingTime',hidden:true},

                ],
//                onCellSelect: function (rowid, index, contents, event) {
//                    if (index == 1 && gridsNew.otherChargesGrid.isEditable == true) {
//
//                        if (gridsNew.otherChargesGrid.savedSuccessfully == true || gridsNew.otherChargesGrid.selectedRow == rowid) {
//                            dialogs.otherChargesSearchFormDialog.reset();
//                            gridsNew.loadOtherChargesSearchFormGrid({
//                                gridDiv: "#account_details_other_charges_grid_search_form_table"
//                            });
//
//                            dialogs.otherChargesSearchFormDialog.initialize({
//                                $searchFormDialogDiv: $("#other_charges_grid_search_form_dialog"),
//                                $searchFormDialogDivSubmit: $("#other_charges_grid_search_form_submit"),
//                                $searchFormDialogDivReset: $("#other_charges_grid_search_form_reset"),
//                                $searchFormDialogDivCancel: $("#other_charges_grid_search_form_cancel"),
//                                billType:gridsNew.otherChargesGrid.billType
//                            });
//                            dialogs.otherChargesSearchFormDialog.open();
//
//                        };
//                    };
//                  },
                onSelectRow: function(id) {
 //console.log('111111')
                    var rowData = gridsNew.otherChargesGrid.$gridDiv.jqGrid('getRowData', id);
                   // console.log("rowData.rowEditable::::::  " + rowData.rowEditable);

                    if(rowData.rowEditable == false || rowData.rowEditable == "false"){
                        return;
                    }

                    gridsNew.otherChargesGrid.$gridDiv.trigger("jqGridInlineAfterSaveRow");
                    if (gridsNew.otherChargesGrid.selectedRow !== undefined && gridsNew.otherChargesGrid.selectedRow !== id) {
                        gridsNew.otherChargesGrid.$gridDiv.jqGrid('saveRow', gridsNew.otherChargesGrid.selectedRow);
                    }
                    ;

                    if (gridsNew.otherChargesGrid.savedSuccessfully == true && gridsNew.otherChargesGrid.isEditable == true) {
                       // console.log('222222')

                        gridsNew.otherChargesGrid.selectedRow = id;
                        gridsNew.otherChargesGrid.$gridDiv.jqGrid('editRow', id, true,false, false, false, false, false,false, afterrestorefunc);

                        if(gridsNew.otherChargesGrid.backScreen == "preBill" || gridsNew.otherChargesGrid.backScreen == "postBill")
                            $('#' + id + '_' + 'dateOfService1').datepicker({dateFormat: 'yy-mm-dd',defaultDate:screens.accountDetails.admitDate});//,minDate:screens.accountDetails.admitDate,maxDate:screens.accountDetails.dischargeDate});
                        else if(gridsNew.otherChargesGrid.backScreen == "associationRules")
                            $('#' + id + '_' + 'dateOfService1').datepicker({dateFormat: 'yy-mm-dd',defaultDate:screens.rulesAccountDetails.admitDate});//,minDate:screens.rulesAccountDetails.admitDate,maxDate:screens.rulesAccountDetails.dischargeDate});
                        else if(gridsNew.otherChargesGrid.backScreen == "editCharges")
                            $('#' + id + '_' + 'dateOfService1').datepicker({dateFormat: 'yy-mm-dd',defaultDate:screens.submittedAccountDetails.admitDate});//,minDate:screens.submittedAccountDetails.admitDate,maxDate:screens.submittedAccountDetails.dischargeDate});
                        else if(gridsNew.otherChargesGrid.backScreen == "editChargesCCIEdits")
                            $('#' + id + '_' + 'dateOfService1').datepicker({dateFormat: 'yy-mm-dd',defaultDate:screens.submittedAccountDetailsCCIEdits.admitDate});//,minDate:screens.submittedAccountDetails.admitDate,maxDate:screens.submittedAccountDetails.dischargeDate});
                        else if(gridsNew.otherChargesGrid.backScreen == "cciEdits")
                            $('#' + id + '_' + 'dateOfService1').datepicker({dateFormat: 'yy-mm-dd',defaultDate:screens.cciEditsAccountDetails.admitDate});//,minDate:screens.submittedAccountDetails.admitDate,maxDate:screens.submittedAccountDetails.dischargeDate});
                        

                        //$('#' + id + '_' + 'dateOfService1').datepicker({dateFormat: 'yy-mm-dd',defaultDate:screens.accountDetails.admitDate,minDate:screens.accountDetails.admitDate,maxDate:screens.accountDetails.dischargeDate});
                        gridsNew.otherChargesGrid.bindDeptCodeChange({id: id});
                        gridsNew.otherChargesGrid.savedSuccessfully = false;
                    }
                    ;
                    function afterrestorefunc(e){
                        gridsNew.otherChargesGrid.savedSuccessfully = true;
                    }

                //    log('clicked ' + id + " " + gridsNew.otherChargesGrid.$gridDiv.getRowData(id));

                },
                editurl: 'clientArray',
                loadComplete: function() {
                   // console.log('33333')

                    $(("#account_details_other_charges_grid_table tr")).removeClass('highlighted_row');
                     
                      var gridRowData = gridsNew.otherChargesGrid.$gridDiv.jqGrid('getRowData');
                      var gridRowDataLength = gridRowData.length;

                      //console.log(gridRowData);

                     
                      for (var i = 0; i < gridRowDataLength; i++) {
                          if (gridRowData[i].rowEditable == "false" || gridRowData[i].rowEditable == false) {
                        //      log("isHighlighted " + gridRowData[i].isNew + " : " + (i + 1));
                              var searchId = gridRowData[i].id;
                                    $(("#account_details_other_charges_grid_table tr#" + (searchId))).addClass("highlighted_row");
                          }
                      }


                      $("#account_details_other_charges_grid_table tbody tr").find("td:eq(13)").each(function(){
                            //console.log($(this).text());

                            if($(this).text() == "false" || $(this).text() == false){

                                $(this).parent().tooltip({
                                content: function(response) {
                                    //console.log(this.parentNode)
                                    if(this.parentNode){
                                        var rowData = gridsNew.otherChargesGrid.$gridDiv.jqGrid('getRowData',this.parentNode.id);
                                        return '<b>Assigned to: </b>' + rowData.cenAuditorId+"<br/><b>Submitted on: </b>" + rowData.cenAuditingTime;
                                    }
                                },
                                open: function() {
                                    $(this).tooltip("widget").stop(false, true).hide().slideDown("fast");
                                },
                                close: function() {
                                    $(this).tooltip("widget").stop(false, true).show().slideUp("fast");
                                }
                            }).tooltip("widget").addClass("ui-state-highlight");
                        }
                    })


                    gridsNew.otherChargesGrid.$gridDiv.setGridParam({rowNum: gridRowDataLength}).trigger("reloadGrid");
                    gridsNew.otherChargesGrid.$gridDiv.jqGrid('setLabel', 'comments', '', {'text-align': 'left', 'padding-left': '16px', 'width': '236px'});

                }

            });

            this.$gridDiv.bind("jqGridInlineAfterSaveRow", function(rowid) {
           //     log("jqGridInlineAfterSaveRow");
               // $('#' + rowid + '_' + 'dateOfService1').datepicker({dateFormat: 'yy-mm-dd',defaultDate:screens.accountDetails.admitDate,minDate:screens.accountDetails.admitDate,maxDate:screens.accountDetails.dischargeDate});
                gridsNew.otherChargesGrid.savedSuccessfully = true;
            });

            this.$gridDiv.bind("jqGridSortCol", function(rowid) {
             //   log("jqGridSortCol");
            });
        },
        fillGrid: function(data) {
            var searchDiv = '<div class="other_discover_search_wrapper"><img class="search_cell_del" src="common/images/account-details/delete-icon.png"><img class="search_cell_search" src="common/images/account-details/search-icon.png"></div>';
            this.$gridDiv.clearGridData();
            var datalength = data.length;
            for (var i = 0; i < datalength; i++) {
                data[i].id = i;
                this.$gridDiv.jqGrid('addRowData', i + 1, data[i]);
                if(data[i].rowEditable)
                    this.$gridDiv.jqGrid('setCell', i + 1, 'search', searchDiv, '');
            }
            ;
            this.$gridDiv.setGridParam({rowNum: datalength}).trigger("reloadGrid");
        },
        bindDeptCodeChange: function(param) {
            var hospitalValue;
            if(this.billType == 'PRE')
              hospitalValue = globalvars.preHospitals[globalvars.selectedPreHospitalIndex].hospitalId
           else if(this.billType == 'POST')
              hospitalValue = globalvars.postHospitals[globalvars.selectedPostHospitalIndex].hospitalId
           else if(this.billType == 'EDIT')
              hospitalValue = globalvars.cciHospitals[globalvars.selectedCciHospitalIndex].hospitalId
            
            var hospitalIdValue = hospitalValue;
            $('#' + param.id + '_' + 'chargeCode').blur(function() {
                var deptValue = $('#' + param.id + '_' + 'dept').val();
                var chargeValue = $('#' + param.id + '_' + 'chargeCode').val();
                var hcpcValue = $('#' + param.id + '_' + 'hcpcCode').val();
                if(deptValue!="" && chargeValue!=""){
                    $.ajax({
                        type: 'GET',
                        url: globalvars.charges.chargesLookupPriceUri + "?hospitalIdValue=" + hospitalIdValue + "&deptValue=" + deptValue + "&chargeValue=" + chargeValue + "&hcpcValue=" + hcpcValue,
                        contentType: 'application/json',
                        error: function(jqxhr) {
                            if(jqxhr.status==204){
                                gridsNew.otherChargesGrid.$gridDiv.jqGrid('setCell', param.id, 'price',null);
                            }
                        },
                        success: function(str, textStatus, jqxhr) {
                            if(jqxhr.status=='200'){
                                gridsNew.otherChargesGrid.$gridDiv.jqGrid('setCell', param.id, 'price', str);
                            }else{
                              gridsNew.otherChargesGrid.$gridDiv.jqGrid('setCell', param.id, 'price',null);
                            }
                        }
                    });
               }else{
                   gridsNew.otherChargesGrid.$gridDiv.jqGrid('setCell', param.id, 'price',null);
               }
              });
              $('#' + param.id + '_' + 'dept').blur(function() {
                var deptValue = $('#' + param.id + '_' + 'dept').val();
                var chargeValue = $('#' + param.id + '_' + 'chargeCode').val();
                var hcpcValue = $('#' + param.id + '_' + 'hcpcCode').val();
                if(deptValue!="" && chargeValue!=""){
                    $.ajax({
                        type: 'GET',
                        url: globalvars.charges.chargesLookupPriceUri + "?hospitalIdValue=" + hospitalIdValue + "&deptValue=" + deptValue + "&chargeValue=" + chargeValue + "&hcpcValue=" + hcpcValue,
                        contentType: 'application/json',
                        error: function(jqxhr) {
                            if(jqxhr.status==204){
                                gridsNew.otherChargesGrid.$gridDiv.jqGrid('setCell', param.id, 'price',null);
                            }
                        },
                        success: function(str, textStatus, jqxhr) {
                            if(jqxhr.status=='200'){
                                gridsNew.otherChargesGrid.$gridDiv.jqGrid('setCell', param.id, 'price', str);
                            }else{
                              gridsNew.otherChargesGrid.$gridDiv.jqGrid('setCell', param.id, 'price', null);
                            }
                        }
                    });
               }else{
                   gridsNew.otherChargesGrid.$gridDiv.jqGrid('setCell', param.id, 'price', null);
               }
              });
        }
    },
    associationRulesGrid: {
        $gridDiv: {},
        selectedRow: undefined,
        savedSuccessfully: true,
        isEditable: true,
        billType: "",
        isConfirmCharg:false,
        backScreen:"",
        initialize: function(param) {
            gridsNew.associationRulesGrid.isConfirmCharg = param.isConfirmCharg;
            this.$gridDiv = $(param.gridDiv);
            this.isEditable = param.isEditable === false ? false : true;
            this.backScreen = param.backScreen;
            this.loadGrid(param.$gridDiv);
            if(param.data)
                this.fillGrid(param.data);
            this.billType = param.screenName;
        },
        loadGrid: function(param) { // param object holds gridDiv, data
            this.selectedRow = undefined;
            this.savedSuccessfully = true;

            this.$gridDiv.jqGrid({
                datatype: "local",
                autowidth: true,
                height:  (gridsNew.associationRulesGrid.isConfirmCharg)?'120':'200',
                gridview: true,
                viewrecords: true,
                sortname: 'hcpcCode',
                sortorder: 'asc',
                altRows: true,
                altclass: 'alternate_row_color',
                colNames: ['id', ' ', globalvars.localResourceMap.associated_rule_existing_code, globalvars.localResourceMap.associated_rule_associated_code,' ', ' ', ' ', ' ', globalvars.localResourceMap.other_discoved_charge_hcpc_code,
                    globalvars.localResourceMap.other_discoved_charge_dept_code, globalvars.localResourceMap.other_discoved_charge_charge_code,
                    globalvars.localResourceMap.other_discoved_charge_price, globalvars.localResourceMap.other_discoved_charge_add_qty, globalvars.localResourceMap.other_charge_date_of_service,
                    globalvars.localResourceMap.missing_charge_charge_description, globalvars.localResourceMap.missing_charge_response, globalvars.localResourceMap.missing_charge_response_code,
                    globalvars.localResourceMap.other_discoved_charge_comment,'','','','',''
                    ],
                colModel: [
                    {name: 'id', index: 'id', key: true, hidden: true},
                    {name: 'search', index: 'search', width: 30, fixed: true,align: "left"},
                    {name: 'sourceCode', index: 'sourceCode', width: 120, fixed: true,align: "center"},
                    {name: 'targetCode', index: 'targetCode', width: 120, fixed: true,align: "center"},
                    {name: 'predCode', index:'predCode', hidden: true},
                    {name: 'sourceCodeType', index: 'sourceCodeType',hidden: true},
                    {name: 'targetCodeType', index: 'targetCodeType',hidden: true},
                    {name: 'revCode', index: 'revCode',hidden: true},
                    {
                        name: 'hcpcCode', index: 'hcpcCode', editable: false, hidden: true, fixed: true, sortable: true, align: "center", sorttype: "string",
                        editoptions: {
                            size: "5",
                            maxlength: "5"
                        }
                    },
                    {
                        name: 'dept', index: 'dept', editable: false, width: 100, fixed: true, sorttype: "int", align: "center",
                        editoptions: {
                            size: "3",
                            maxlength: "3"
                        },
                        editrules: {
                            custom: true,
                            custom_func: function(value, colname) {
                                var selectedRowData = gridsNew.associationRulesGrid.$gridDiv.jqGrid('getRowData', gridsNew.associationRulesGrid.selectedRow);
                                if (value != undefined) {
                                    if (!(/^[a-z0-9]+$/i.test(value)) || value.length !== 3) {
                                        return [false, globalvars.localResourceMap.other_discoverd_validation_msg4];
                                    } else {
                                        return [true, ""];
                                    }
                                }
                                else
                                    return [true, ""];
                            }
                        }
                    },
                    {
                        name: 'chargeCode', index: 'chargeCode', editable: false, width: 100, fixed: true, sortable: true, align: "center", sorttype: "int",
                        editoptions: {
                            size: "5",
                            maxlength: "5"
                        },
                        editrules: {
                            custom: true,
                            custom_func: function(value, colname) {
                                var selectedRowData = gridsNew.associationRulesGrid.$gridDiv.jqGrid('getRowData', gridsNew.associationRulesGrid.selectedRow);
                                if (value != undefined) {
                                    if (!(/^[a-z0-9]+$/i.test(value)) || value.length !== 5) {
                                        return [false, globalvars.localResourceMap.other_discoverd_validation_msg3];
                                    } else {
                                        return [true, ""];
                                    }
                                }
                                else
                                    return [true, ""];
                            }
                        }
                    },
                    {name: 'price', index: 'price', width: 100, fixed: true, sortable: true, sorttype: "int", align: "center"},
                    {
                        name: 'qty', index: 'qty', width: 100, fixed: true, sortable: true, sorttype: "int", editable: this.isEditable, align: "center",
                        edittype: "text",
                        editoptions: {
                            size: "3",
                            maxlength: "3",
                            minValue: 1
                        }, editrules: {
                            custom: true,
                            custom_func: function(value, colname) {

                                var selectedRowData = gridsNew.associationRulesGrid.$gridDiv.jqGrid('getRowData', gridsNew.associationRulesGrid.selectedRow);
                                var currentResponseValue = $("#responseSelectRules" + gridsNew.associationRulesGrid.selectedRow + " option:selected").val();

                                var currentDeptValue = $("#deptSelect" + gridsNew.associationRulesGrid.selectedRow + " option:selected").val();
                                var currentChargeCodeValue = $("#chargeCodeSelect" + gridsNew.associationRulesGrid.selectedRow + " option:selected").val();

                                if (!(/^-?\d+$/.test(value)) || isNaN(value)) {
                                    return [false, globalvars.localResourceMap.missing_charge_validation_msg];
                                } else /*if (currentChargeCodeValue == "") {
                                 return [false, globalvars.localResourceMap.missing_charge_validation_msg4];
                                 } else*/ {
                                    if (value > 0 && currentResponseValue != "Y") {
                                        return [false, globalvars.localResourceMap.missing_charge_validation_msg3];
                                    } else if (value < 1 && currentResponseValue == "Y") {
                                        return [false, globalvars.localResourceMap.missing_charge_validation_msg2];
                                    }
                                    else {
                                        return [true, ""];
                                    }
                                    ;
                                }
                            }
                        }
                    },
                    {name: 'dateOfServiceAssocRule', index: 'dateOfServiceAssocRule', width: 100, fixed: true, sortable: true, sorttype: "date", datefmt: "Y-m-d h:i:s", editable: this.isEditable, align: "center",
                        editoptions:{
                                            readonly: 'readonly'
                                 }},
                 {name: 'chargeDescription', index: 'chargeDescription', hidden:true},
                 {name: 'response', index: 'response', fixed: true, width: 130, classes: 'grid_cell_style'},
                 {name: 'responseCode', hidden: true},
                 {name: 'comments', index: 'comments', editable: this.isEditable, width: 190, fixed: true,  editoptions: {size: "23", maxlength: "150"}, classes: 'grid_cell_style'},
                 {name: 'isNew', hidden: true},
                 {name: 'predKey', index: 'predKey',hidden:true},
                {name: 'rowEditable', index: 'rowEditable',hidden:true},
                {name: 'cenAuditorId', index: 'cenAuditorId',hidden:true},
                {name: 'cenAuditingTime', index: 'cenAuditingTime',hidden:true},

                ],

                onSelectRow: function(id) {

                    var rowData = gridsNew.associationRulesGrid.$gridDiv.jqGrid('getRowData', id);

                    if(rowData.rowEditable == false || rowData.rowEditable == "false"){
                        return;
                    }


                    if (gridsNew.associationRulesGrid.selectedRow !== undefined) {

                         gridsNew.associationRulesGrid.$gridDiv.jqGrid('saveRow', gridsNew.associationRulesGrid.selectedRow);

                     }
                     ;
                     if (gridsNew.associationRulesGrid.savedSuccessfully == true && gridsNew.associationRulesGrid.isEditable == true) {
                         gridsNew.associationRulesGrid.selectedRow = id;

                         var selectedRowData = gridsNew.associationRulesGrid.$gridDiv.jqGrid('getRowData', id);
                         var newRowData = gridsNew.associationRulesGrid.$gridDiv.jqGrid('getRowData', id);

                         newRowData.response = gridsNew.associationRulesGrid.createResponseDropdown({
                             rowData: selectedRowData,
                             rowId: id,
                             billType: gridsNew.associationRulesGrid.screenName

                         });

                        gridsNew.associationRulesGrid.$gridDiv.jqGrid('setRowData', id, newRowData);

                        gridsNew.associationRulesGrid.$gridDiv.jqGrid('editRow', id, true,false, false, false, false, false,false, afterrestorefunc);

                        if(gridsNew.associationRulesGrid.backScreen == "preBill" || gridsNew.associationRulesGrid.backScreen == "postBill")
                            $('#' + id + '_' + 'dateOfServiceAssocRule').datepicker({dateFormat: 'yy-mm-dd',defaultDate:screens.accountDetails.admitDate});//,minDate:screens.accountDetails.admitDate,maxDate:screens.accountDetails.dischargeDate});
                        else if(gridsNew.associationRulesGrid.backScreen == "associationRules")
                            $('#' + id + '_' + 'dateOfServiceAssocRule').datepicker({dateFormat: 'yy-mm-dd',defaultDate:screens.rulesAccountDetails.admitDate});//,minDate:screens.rulesAccountDetails.admitDate,maxDate:screens.rulesAccountDetails.dischargeDate});
                        else if(gridsNew.associationRulesGrid.backScreen == "editCharges")
                            $('#' + id + '_' + 'dateOfServiceAssocRule').datepicker({dateFormat: 'yy-mm-dd',defaultDate:screens.submittedAccountDetails.admitDate});//,minDate:screens.submittedAccountDetails.admitDate,maxDate:screens.submittedAccountDetails.dischargeDate});
                        else if(gridsNew.associationRulesGrid.backScreen == "cciEdits")
                            $('#' + id + '_' + 'dateOfServiceAssocRule').datepicker({dateFormat: 'yy-mm-dd',defaultDate:screens.cciEditsAccountDetails.admitDate});//,minDate:screens.submittedAccountDetails.admitDate,maxDate:screens.submittedAccountDetails.dischargeDate});
                        
                        gridsNew.associationRulesGrid.savedSuccessfully = false;



                     }

                     function afterrestorefunc(e){
                        gridsNew.associationRulesGrid.savedSuccessfully = true;
                    }


                },
                editurl: 'clientArray',
                loadComplete: function() {
                    
                    // $(("#account_details_associate_rules_grid_table tr")).removeClass('highlighted_row');
                    //  gridsNew.associationRulesGrid.$gridDiv.trigger("reloadGrid");

                    // var gridRowData = gridsNew.associationRulesGrid.$gridDiv.jqGrid('getRowData');
                    // var gridRowDataLength = gridRowData.length;

                    // gridsNew.associationRulesGrid.$gridDiv.clearGridData();
                    
                    //  var datalength = gridRowData.length;
                    //  for (var i = 0; i < datalength; i++) {
                    //      gridsNew.associationRulesGrid.$gridDiv.jqGrid('addRowData', i + 1, gridRowData[i]);
                    //  }
                     
                    //  gridsNew.associationRulesGrid.$gridDiv.setGridParam({rowNum: datalength}).trigger("reloadGrid");

                    // for (var i = 0; i < gridRowDataLength; i++) {
                    //     if (gridRowData[i].isNew == "false") {
                    //         log("isHighlighted " + gridRowData[i].isNew + " : " + (i + 1));
                    //         $(("#account_details_associate_rules_grid_table tr#" + (i + 1))).addClass("highlighted_row");
                    //     }
                    //     ;
                    // }

                    $(("#account_details_associate_rules_grid_table tr")).removeClass('highlighted_row');
                     
                      var gridRowData = gridsNew.associationRulesGrid.$gridDiv.jqGrid('getRowData');
                      var gridRowDataLength = gridRowData.length;

                     // console.log(gridRowData);

                     
                      for (var i = 0; i < gridRowDataLength; i++) {
                          if (gridRowData[i].rowEditable == "false" || gridRowData[i].rowEditable == false) {
                        //      log("isHighlighted " + gridRowData[i].isNew + " : " + (i + 1));
                              var searchId = gridRowData[i].id;
                                    $(("#account_details_associate_rules_grid_table tr#" + (searchId))).addClass("highlighted_row");
                          }
                      }


                      $("#account_details_associate_rules_grid_table tbody tr").find("td:eq(20)").each(function(){
                            //console.log($(this).text());

                            if($(this).text() == "false" || $(this).text() == false){

                                $(this).parent().tooltip({
                                content: function(response) {
                                    //console.log(this.parentNode)
                                    if(this.parentNode){
                                        var rowData = gridsNew.associationRulesGrid.$gridDiv.jqGrid('getRowData',this.parentNode.id);
                                        return '<b>Assigned to: </b>' + rowData.cenAuditorId+"<br/><b>Submitted on: </b>" + rowData.cenAuditingTime;
                                    }
                                },
                                open: function() {
                                    $(this).tooltip("widget").stop(false, true).hide().slideDown("fast");
                                },
                                close: function() {
                                    $(this).tooltip("widget").stop(false, true).show().slideUp("fast");
                                }
                            }).tooltip("widget").addClass("ui-state-highlight");
                        }
                    })



                      gridsNew.associationRulesGrid.$gridDiv.setGridParam({rowNum: gridRowDataLength}).trigger("reloadGrid");
                    //gridsNew.associationRulesGrid.$gridDiv.jqGrid('setLabel', 'comments', '', {'text-align': 'left', 'padding-left': '16px', 'width': '236px'});

                }


            });

            this.$gridDiv.unbind("jqGridInlineAfterSaveRow");
            this.$gridDiv.bind("jqGridInlineAfterSaveRow", function(rowid) {
                var selectedRowData = gridsNew.associationRulesGrid.$gridDiv.jqGrid('getRowData', gridsNew.associationRulesGrid.selectedRow);
                selectedRowData.responseCode = $("#responseSelectRules" + gridsNew.associationRulesGrid.selectedRow + " option:selected").val();
                selectedRowData.response = $("#responseSelectRules" + gridsNew.associationRulesGrid.selectedRow + " option:selected").text();
                gridsNew.associationRulesGrid.$gridDiv.jqGrid('setRowData', gridsNew.associationRulesGrid.selectedRow, selectedRowData);

                gridsNew.associationRulesGrid.savedSuccessfully = true;
            });

            this.$gridDiv.bind("jqGridSortCol", function(rowid) {
                log("jqGridSortCol");
            });
        },
        fillGrid: function(data) {
            var searchDiv = '<div><img class="searchAssociateCodeImage" src="common/images/account-details/search-icon.png" title="Search Associated code"></div>';
            this.$gridDiv.clearGridData();
            var datalength = data.length;
            for (var i = 0; i < datalength; i++) {
                data[i].id = i;
                this.$gridDiv.jqGrid('addRowData', i + 1, data[i]);
                if(data[i].rowEditable)
                    this.$gridDiv.jqGrid('setCell', i + 1, 'search', searchDiv, '');
            }
            ;
            this.$gridDiv.setGridParam({rowNum: datalength}).trigger("reloadGrid");
        },

        createResponseDropdown: function(param) {

            var response=[];
            if(param.billType != "POST"){
                var datalength = globalvars.responses.length;
                for (var i = 0; i < datalength;i++) {
                    if( globalvars.responses[i].value != "LPPB" && globalvars.responses[i].value != "ZNI")
                        response.push(globalvars.responses[i]);
                }

            }else{
                response = globalvars.responses;
            }

            var responseDropdown = createSelectBox({
                index: param.rowId,
                selectDivId: "responseSelectRules",
                values: response,
                currentValue: param.rowData.responseCode,
                valueKey: "value",
                textKey: "description",
                addEmptyItem: true
            });

            return responseDropdown;
        }
    },
    loadOtherChargesSearchFormGrid: function(param) {
        var $gridDiv = $(param.gridDiv);
        $gridDiv.jqGrid({
            datatype: "local",
            width: '740',
            height: '200',
            gridview: true,
            viewrecords: true,
            sortorder: 'asc',
            altRows: true,
            altclass: 'alternate_row_color',
            colNames: [globalvars.localResourceMap.other_discoved_search_dept_code, 'Dept Description',globalvars.localResourceMap.other_discoved_search_charge_code,
                globalvars.localResourceMap.other_discoved_search_charge_desp, globalvars.localResourceMap.other_discoved_search_hcpc,
                globalvars.localResourceMap.other_discoved_search_rev_code, globalvars.localResourceMap.other_discoved_charge_price,'#count'],
            colModel: [
                {name: 'dept', index: 'dept', width: 70, sortable: true, sorttype: 'int', fixed: true, align: 'center'},
                {name: 'deptDesc', index: 'deptDesc', width: 150, sortable: true, fixed: true, align: 'center'},
                {name: 'chargeCode', index: 'chargeCode', width: 70, sortable: true, fixed: true, align: 'center'},
                {name: 'chargeDesc', index: 'chargeDesc', width: 140, sortable: true, sorttype: 'string', fixed: true, classes: 'grid_cell_style'},
                {name: 'hcpcCode', index: 'hcpcCode', width: 70, sortable: true, fixed: true, align: 'center'},
                {name: 'revenueCode', index: 'revenueCode', width: 60, sortable: true, sorttype: 'int', fixed: true, align: 'center'},
                {name: 'price', index: 'price', width: 70, sortable: true, sorttype: 'int', fixed: true, align: 'center'},
                {name: 'freqCount', index: 'freqCount', width: 70, sortable: true, sorttype: 'int', fixed: true, align: 'center'}

            ],
            ondblClickRow: function(id) {
                
                
                
                globalvars.other_discovered_charges_selected_row_form_data = $gridDiv.jqGrid('getRowData', id);
                $("#other_charges_grid_search_form_dialog").dialog("close");
                var data = {
                    hcpcCode: globalvars.other_discovered_charges_selected_row_form_data.hcpcCode,
                    dept: globalvars.other_discovered_charges_selected_row_form_data.dept,
                    chargeCode: globalvars.other_discovered_charges_selected_row_form_data.chargeCode,
                    price: globalvars.other_discovered_charges_selected_row_form_data.price
                };
                var test = $("#account_details_other_charges_grid_table").getRowData(gridsNew.otherChargesGrid.selectedRow);
                if (test) {
                    gridsNew.otherChargesGrid.$gridDiv.jqGrid('setCell', test.id, 'hcpcCode', data.hcpcCode);
                    gridsNew.otherChargesGrid.$gridDiv.jqGrid('setCell', test.id, 'dept', data.dept);
                    gridsNew.otherChargesGrid.$gridDiv.jqGrid('setCell', test.id, 'chargeCode', data.chargeCode);

                    gridsNew.otherChargesGrid.$gridDiv.jqGrid('setCell', test.id, 'price', data.price);
                    gridsNew.otherChargesGrid.$gridDiv.jqGrid('saveRow', gridsNew.otherChargesGrid.selectedRow);
                }



            },
            loadComplete: function() {
                if(globalvars.otherChargesSearchForm){
                    if (globalvars.otherChargesSearchForm.length > 0) {
                            var datalength = globalvars.otherChargesSearchForm.length;
                            for (var i = 0; i < datalength; i++) {
                                $("#account_details_other_charges_grid_search_form_table").jqGrid('addRowData', i + 1, globalvars.otherChargesSearchForm[i]);
                            }
                        }
                }
                //$gridDiv.jqGrid('setLabel', 'chargeDesc', '', {'text-align': 'left', 'padding-left': '16px', 'width': '160px'});
            }
        });
    },

    existingChargesGridGlobal: {
        $gridDiv: {},
        selectedRow: undefined,
        savedSuccessfully: true,
        isEditable: true,
        isConfirmCharg:false,
        initialize: function(param) {
            this.$gridDiv = $(param.gridDiv);
            gridsNew.existingChargesGridGlobal.isConfirmCharg = param.isConfirmCharg;
            this.isEditable = param.isEditable === false ? false : true;
            this.loadGrid(param.$gridDiv);
            this.fillGrid(param.data);

        },
        loadGrid: function(param) { // param object holds gridDiv, data
            this.selectedRow = undefined;
            this.savedSuccessfully = true;

            this.$gridDiv.jqGrid({
                datatype: "local",
                height: (gridsNew.existingChargesGridGlobal.isConfirmCharg)? '350':'200',
                autowidth: true,
                gridview: true,
                viewrecords: true,
                sortname: 'hcpcCode',
                altRows: true,
                altclass: 'alternate_row_color',
                // sortorder: 'asc',
                colNames: [globalvars.localResourceMap.existing_charge_hcpc_code, globalvars.localResourceMap.existing_charge_dept_code, '', globalvars.localResourceMap.existing_charge_charge_code,
                    globalvars.localResourceMap.existing_charge_unit, globalvars.localResourceMap.existing_charge_change_qty, globalvars.localResourceMap.existing_charge_amount,
                    globalvars.localResourceMap.existing_charge_charge_date,'Rev Code',globalvars.localResourceMap.existing_charge_charge_description, '','','',globalvars.localResourceMap.existing_charge_comment,'POST DATE','','','',''],
                colModel: [
                    {name: 'hcpcCode', index: 'hcpcCode', width: 80, fixed: true, sortable: true, sorttype: "string", align: 'center'},
                    {name: 'dept', index: 'dept', width: 80, fixed: true, sorttype: "int", align: 'center'},
                    {name: 'chargeNumber', index: 'chargeNumber', hidden: true},
                    {name: 'chargeCode', index: 'chargeCode', fixed: true, width: 80, sortable: true, sorttype: "int", align: 'center'},
                    {name: 'quantity', index: 'quantity', width: 50, fixed: true, align: "center", sorttype: "int"},
                    {
                        name: 'cenAuditorQty', index: 'cenAuditorQty', width: 60, fixed: true, align: "center", editable: this.isEditable, sorttype: "int",
                        edittype: "text",
                        editoptions: {
                            size: "3",
                            maxlength: "3",
                        },
                        editrules: {
                            custom: true,
                            custom_func: function(value, colname) {
                                if (value == "") {
                                    return [true, ""];
                                } else if (!(/^-?\d+$/.test(value)) || isNaN(value) || value == 0) {
                                    value = "";
                                    return [false, globalvars.localResourceMap.existing_charge_validation_msg];
                                } else {
                                    return [true, ""];
                                }
                                ;
                            }
                        }
                    },
                    {name: 'amount', index: 'amount', width: 80, fixed: true, sorttype: "int", align: 'right',formatter:'currency',
                     formatoptions: { decimalSeparator: ".", thousandsSeparator: ",", prefix: "$",decimalPlaces: 1, defaultValue: '0.0' }},
                    {name: 'chargeDate', index: 'chargeDate', width: 85, fixed: true, align: "center", sorttype: "date"},
                    {name: 'revenueCode', index: 'revenueCode', width: 70, fixed: true, align: "center", sorttype: "date"},
                    {name: 'chargeDescription', index: 'chargeDescription', width: 200, fixed: true, sorttype: "string", classes: 'grid_cell_style'},
                    {name: 'modifier', index: 'modifier', width: 60, fixed: true, sortable: true, sorttype: "string", align: 'center',hidden: true},
                    {name: 'changeModifier', index: 'changeModifier', width: 50, fixed: true, editable: this.isEditable,sortable: true, sorttype: "string", align: 'center',hidden: true},
                    {name: 'medicareCode', index: 'medicareCode', width: 60, fixed: true, sortable: true, sorttype: "string", align: 'center',hidden: true},
                    {name: 'cenAuditorComments', index: 'cenAuditorComments', width: 200, fixed: true, editable: this.isEditable,
                        editoptions: {
                            size: "25",
                            maxlength: "250",
                        },
                        classes: 'grid_cell_style'},
                    {name: 'postDate', index: 'postDate', width: 110, fixed: true, align: "left", sorttype: "date"},
                    {name: 'predKey', index: 'predKey',hidden:true},
                    {name: 'rowEditable', index: 'rowEditable',hidden:true},
                    {name: 'cenAuditorId', index: 'cenAuditorId',hidden:true},
                    {name: 'cenAuditingTime', index: 'cenAuditingTime',hidden:true}
                ],
                onSelectRow: function(id) {
                    var selectedRowData = gridsNew.existingChargesGridGlobal.$gridDiv.jqGrid('getRowData', id);

                    if(selectedRowData.rowEditable == false || selectedRowData.rowEditable == "false"){
                        return;
                    }

                    if (gridsNew.existingChargesGridGlobal.selectedRow !== undefined) {
                        gridsNew.existingChargesGridGlobal.$gridDiv.jqGrid('saveRow', gridsNew.existingChargesGridGlobal.selectedRow);
                    }
                    ;
                    if (gridsNew.existingChargesGridGlobal.savedSuccessfully == true) {
                        gridsNew.existingChargesGridGlobal.selectedRow = id;
                        //gridsNew.existingChargesGrid.$gridDiv.jqGrid('editRow', id, true,);
                        gridsNew.existingChargesGridGlobal.$gridDiv.jqGrid('editRow',id, true, false, false, false, false, false,false, afterrestorefunc)
                        gridsNew.existingChargesGridGlobal.savedSuccessfully = false;
                    }
                    
                    function afterrestorefunc(e){
                            gridsNew.existingChargesGridGlobal.savedSuccessfully = true;
                    }

                  //  log('Exiting Charges ID clicked ' + id + " " + gridsNew.existingChargesGrid.selectedRow);
                },
                
                editurl: 'clientArray',
                loadComplete: function() {


                    $(("#global_account_details_existing_charges_grid_table tr")).removeClass('highlighted_row');
                     gridsNew.existingChargesGridGlobal.$gridDiv.trigger("reloadGrid");


                     var gridRowData = gridsNew.existingChargesGridGlobal.$gridDiv.jqGrid('getRowData');
                     var gridRowDataLength = gridRowData.length;

                    gridsNew.existingChargesGridGlobal.$gridDiv.clearGridData();

                     var datalength = gridRowData.length;
                     for (var i = 0; i < datalength; i++) {
                         gridsNew.existingChargesGridGlobal.$gridDiv.jqGrid('addRowData', i + 1, gridRowData[i]);
                     }
                     
                     gridsNew.existingChargesGridGlobal.$gridDiv.setGridParam({rowNum: datalength}).trigger("reloadGrid");


                     var tableGridID = "#global_account_details_existing_charges_grid_table";
                     if(gridsNew.existingChargesGridGlobal.isConfirmCharg == true){
                         tableGridID = "#confirm_charge_existing_charges_grid_table";
                     }

                     
                    //  for (var i = 0; i < gridRowDataLength; i++) {
                    //  //   log("isHighlighted new test " + gridRowData[i].rowEditable + " : " + (i + 1));
                    //      if (gridRowData[i].rowEditable == "false" || gridRowData[i].rowEditable == false) {
                    //    //      log("isHighlighted new test " + gridRowData[i].rowEditable + " : " + (i + 1));
                    //    //      $(tableGridID).find("tr#" + (i + 1)).addClass("highlighted_row");
                    //      }
                    //  }

                     $(tableGridID).find('tr').find('td:eq(17)').each(function(){
                            //console.log($(this).text());

                            if($.trim($(this).text()) != ""){

                                $(this).parent().tooltip({
                                content: function(response) {
                                    //console.log(this.parentNode)
                                    if(this.parentNode){
                                        var rowData = gridsNew.existingChargesGridGlobal.$gridDiv.jqGrid('getRowData',this.parentNode.id);
                                        return '<b>Assigned to: </b>' + rowData.cenAuditorId+"<br/><b>Submitted on: </b>" + rowData.cenAuditingTime;
                                    }
                                },
                                open: function() {
                                    $(this).tooltip("widget").stop(false, true).hide().slideDown("fast");
                                },
                                close: function() {
                                    $(this).tooltip("widget").stop(false, true).show().slideUp("fast");
                                }
                            }).tooltip("widget").addClass("ui-state-highlight");
                        }
                        })
                    // gridsNew.existingChargesGrid.$gridDiv.jqGrid('setLabel', 'chargeDesc', '', {'text-align': 'left', 'padding-left': '16px', 'width': '186px'});
                    // gridsNew.existingChargesGrid.$gridDiv.jqGrid('setLabel', 'comments', '', {'text-align': 'left', 'padding-left': '16px', 'width': '186px'});

                     gridsNew.existingChargesGridGlobal.$gridDiv.jqGrid('setLabel', 'postDate', '', {'text-align': 'left', 'padding-left': '-20px', 'width': '110px'});
                }

            });

            this.$gridDiv.bind("jqGridInlineAfterSaveRow", function(rowid) {
             //   log("jqGridInlineAfterSaveRow");
                gridsNew.existingChargesGridGlobal.savedSuccessfully = true;
            });
            
        },
        fillGrid: function(data) {
            this.$gridDiv.clearGridData();
            var datalength = data.length;
            for (var i = 0; i < datalength; i++) {
                this.$gridDiv.jqGrid('addRowData', i + 1, data[i]);
            }
            ;
            this.$gridDiv.setGridParam({rowNum: datalength}).trigger("reloadGrid");
        }
    },
    missingChargesGridGlobal: {
        $gridDiv: {},
        selectedRow: undefined,
        savedSuccessfully: true,
        isEditable: true,
        isHidden: true,
        isConfirmCharg: false,
        altRows: true,
        backScreen:"",
        altclass: 'alternate_row_color',
        screenName: "",
        publishAccount:false,
        initialize: function(param) {
            gridsNew.missingChargesGridGlobal.isConfirmCharg = param.isConfirmCharg;
            this.$gridDiv = $(param.gridDiv);
            this.isEditable = param.isEditable === false ? false : true;
            this.isHidden = param.isHidden === false ? false : true;
            this.backScreen = param.backScreen;
            this.publishAccount = param.publishAccount === false ? false : true;
            this.loadGrid(param.$gridDiv);
            this.fillGrid(param.data);
            this.screenName = param.screenName;
        },
        loadGrid: function(param) { // param object holds gridDiv, data
            this.selectedRow = undefined;
            this.savedSuccessfully = true;
            this.$gridDiv.jqGrid({
                datatype: "local",
                autowidth: true,
                height: (gridsNew.missingChargesGridGlobal.isConfirmCharg)? '120':'200',
                gridview: true,
                viewrecords: true,
                altRows: true,
                altclass: 'alternate_row_color',
                sortorder: 'asc',
                colNames: [globalvars.localResourceMap.missing_charge_hcpc_code, globalvars.localResourceMap.missing_charge_dept_code, globalvars.localResourceMap.missing_charge_charge_code, 'ndc code', globalvars.localResourceMap.missing_charge_price,
                    globalvars.localResourceMap.missing_charge_add_qty, globalvars.localResourceMap.missing_charge_date_of_service, globalvars.localResourceMap.missing_charge_charge_description,
                    globalvars.localResourceMap.missing_charge_response, globalvars.localResourceMap.missing_charge_response_code, globalvars.localResourceMap.missing_charge_pred_code, globalvars.localResourceMap.missing_charge_comment,'','','','Bill Type','Sent Flag','','','','',''],
                colModel: [
                    {
                        name: 'hcpcCodeDisplay', index: 'hcpcCodeDisplay', width: 80, fixed: true, sortable: true, sorttype: "string", align: "center"
                    },
                    {name: 'dept', index: 'dept', width: 60, fixed: true, sorttype: "int", align: "center"},
                    {name: 'chargeCode', index: 'chargeCode', width: 60, fixed: true, sortable: true, sorttype: "int", align: "center"},
                    {name: 'ndcCode', index: 'ndcCode', width: 60, fixed: true, sortable: true, sorttype: "int", align: "center"},
                    {name: 'val', index: 'val', width: 60, fixed: true, sortable: true, sorttype: "int", align: "center",formatter:'currency',
                     formatoptions: { decimalSeparator: ".", thousandsSeparator: ",", prefix: "$",decimalPlaces: 1, defaultValue: '0.0' }},
                    {
                        name: 'cenAuditorQty', index: 'cenAuditorQty', width: 60, fixed: true, sortable: true, sorttype: "int", editable: this.isEditable, align: "center",
                        edittype: "text",
                        editoptions: {
                            size: "3",
                            maxlength: "3",
                            minValue: 1
                        }, editrules: {
                            custom: true,
                            custom_func: function(value, colname) {
                            	if(value !== undefined){
    								if (!(/^-?\d+$/.test(value)) || isNaN(value)) {
                                        return [false, globalvars.localResourceMap.missing_charge_validation_msg];
                                    } 
                            	}
                                var selectedRowData = gridsNew.missingChargesGridGlobal.$gridDiv.jqGrid('getRowData', gridsNew.missingChargesGridGlobal.selectedRow);
                                var currentResponseValue = $("#responseSelect" + gridsNew.missingChargesGridGlobal.selectedRow + " option:selected").val();

                                var currentDeptValue = $("#deptSelect" + gridsNew.missingChargesGridGlobal.selectedRow + " option:selected").val();
                                var currentChargeCodeValue = $("#chargeCodeSelect" + gridsNew.missingChargesGridGlobal.selectedRow + " option:selected").val();
								if (value > 0 && currentResponseValue != "Y") {
                                        return [false, globalvars.localResourceMap.missing_charge_validation_msg3];
                                    } else if (value < 1 && currentResponseValue == "Y") {
                                        return [false, globalvars.localResourceMap.missing_charge_validation_msg2];
                                    } else {
                                        return [true, ""];
                                    };                                
                            }
                        }
                    },
                    {name: 'dateOfService', index: 'dateOfService', width: 60, fixed: true, sortable: true, sorttype: "date", datefmt: "Y-m-d h:i:s", editable: this.isEditable, align: "center",
                    editoptions:{
                                            readonly: 'readonly'
                                 }},
                    {name: 'chargeDescription', index: 'chargeDescription', fixed: true, width: (gridsNew.missingChargesGridGlobal.publishAccount == true)?250:170, classes: 'grid_cell_style'},
                    {name: 'response', index: 'response', fixed: true, width: 150, classes: 'grid_cell_style'},
                    {name: 'responseCode', hidden: true},
                    {name: 'predCode', hidden: true},
                    {name: 'cenAuditorComments', index: 'cenAuditorComments', width: 190, fixed: true, editable: this.isEditable,  editoptions: {
                            size: "22",
                            maxlength: "230",
                        },
                        classes: 'grid_cell_style'},
                    {name: 'isNew', hidden: true},
                    {name: 'predKey', index: 'predKey',hidden:true},
                    {name: 'rowEditable', index: 'rowEditable',hidden:true},
                    {name: 'billType', index: 'billType', width: 70, fixed: true, sorttype: "int", align: "center"},
                    {name: 'sentFlag', index: 'sentFlag', width: 70, fixed: true, sorttype: "int", align: "center",hidden:gridsNew.missingChargesGridGlobal.publishAccount},
                    {name: 'cenAuditorId', index: 'cenAuditorId',hidden:true},
                    {name: 'cenAuditingTime', index: 'cenAuditingTime',hidden:true},
                    {name: 'hcpcCode', index: 'hcpcCode', hidden:true},
                    {name: 'predDate', index: 'predDate', hidden:true},
                    {name: 'isComment', index: 'isComment', fixed: true, hidden:true,width: 70, classes: 'grid_cell_style',align: "left"}
                    

                    
                ],
            	onSelectRow: function(id, status, e) {

                    return false;
          
                },
                editurl: 'clientArray',
                loadComplete: function() {
                    $(("#global_account_details_missing_charges_grid_table tr")).removeClass('highlighted_row');
                     gridsNew.missingChargesGridGlobal.$gridDiv.trigger("reloadGrid");

                     var gridRowData = gridsNew.missingChargesGridGlobal.$gridDiv.jqGrid('getRowData');
                     var gridRowDataLength = gridRowData.length;

                     var gridData = gridsNew.missingChargesGridGlobal.$gridDiv.jqGrid("getGridParam", "dataNew");


                     gridsNew.missingChargesGridGlobal.$gridDiv.clearGridData();
                    
                     var datalength = gridRowData.length;
                     for (var i = 0; i < datalength; i++) {
                         gridsNew.missingChargesGridGlobal.$gridDiv.jqGrid('addRowData', i + 1, gridRowData[i]);
                     }
                     
                     gridsNew.missingChargesGridGlobal.$gridDiv.setGridParam({rowNum: datalength}).trigger("reloadGrid");

                     
                     var tableGridID = "#global_account_details_missing_charges_grid_table";
                     
                     
                     for (var i = 0; i < gridRowDataLength; i++) {
                         if (gridRowData[i].rowEditable == "false" || gridRowData[i].rowEditable == false) {
                         //    log("isHighlighted " + gridRowData[i].isNew + " : " + (i + 1));
                            // $(tableGridID).find("tr#" + (i + 1)).addClass("highlighted_row");
                         }
                         $(tableGridID).find("tr#" + (i + 1)).find("td:last").text("");
                         //$(("#confirm_charge_missing_charges_grid_table" + "tr#" + (i + 1))).find("td:last").text("");
                         if (gridData[i].isComment == true) {
                             //$(("#account_details_missing_charges_grid_table tr#" + (i + 1))).find("td:last").addClass("lightbulb_on");
                             $(tableGridID).find("tr#" + (i + 1)).find("td:last").addClass("lightbulb_on");
                         }
                         else{
                             //$(("#account_details_missing_charges_grid_table tr#" + (i + 1))).find("td:last").addClass("lightbulb_off");
                             $(tableGridID).find("tr#" + (i + 1)).find("td:last").addClass("lightbulb_off");
                         }
                     }


                     $(tableGridID).find('tr').each(function(){
                            //console.log($(this).text());

                           // if($(this).text() == "false" || $(this).text() == false){

                                $(this).parent().tooltip({
                                content: function(response) {
                                    //console.log(this.parentNode)
                                    if(this.parentNode){
                                        var rowData = gridsNew.missingChargesGridGlobal.$gridDiv.jqGrid('getRowData',this.parentNode.id);
                                        return '<b>Pred date: </b>' +rowData.predDate+ '<br/><b>Assigned to: </b>' + rowData.cenAuditorId+"<br/><b>Submitted on: </b>" + rowData.cenAuditingTime;
                                    }
                                },
                                open: function() {
                                    $(this).tooltip("widget").stop(false, true).hide().slideDown("fast");
                                },
                                close: function() {
                                    $(this).tooltip("widget").stop(false, true).show().slideUp("fast");
                                }
                            }).tooltip("widget").addClass("ui-state-highlight");
                       // }
                    })
              
                }

            });


        },
        fillGrid: function(data) {
            this.$gridDiv.clearGridData();
            var datalength = data.length;
         
            for (var i = 0; i < datalength; i++) {
                if(gridsNew.missingChargesGridGlobal.publishAccount){
                    if(data[i].sentFlag == 'Y' || data[i].sentFlag == 'y'){
                        this.$gridDiv.jqGrid('addRowData', i + 1, data[i]);
                    }
                    
                }else{
                    this.$gridDiv.jqGrid('addRowData', i + 1, data[i]);
                }
            }

            this.$gridDiv.setGridParam({dataNew: data});

            this.$gridDiv.setGridParam({rowNum: datalength}).trigger("reloadGrid");
        },
      
    },
     otherChargesGridGlobal: {
        $gridDiv: {},
        selectedRow: undefined,
        savedSuccessfully: true,
        isEditable: true,
        billType: "",
        backScreen:"",
        initialize: function(param) {
            this.$gridDiv = $(param.gridDiv);
            this.isEditable = param.isEditable === false ? false : true;
            this.backScreen = param.backScreen;
            this.loadGrid(param.$gridDiv);
            this.fillGrid(param.data);
            this.billType = param.screenName;
        },
        loadGrid: function(param) { // param object holds gridDiv, data
            this.selectedRow = undefined;
            this.savedSuccessfully = true;

            this.$gridDiv.jqGrid({
                datatype: "local",
                autowidth: true,
                height: '120',
                gridview: true,
                viewrecords: true,
//                sortname: 'hcpcCode',
//                sortorder: 'asc',
                altRows: true,
                altclass: 'alternate_row_color',
                colNames: ['id', globalvars.localResourceMap.other_discoved_charge_search, globalvars.localResourceMap.other_discoved_charge_hcpc_code,
                    globalvars.localResourceMap.other_discoved_charge_dept_code, globalvars.localResourceMap.other_discoved_charge_charge_code,'ndc code',
                    globalvars.localResourceMap.other_discoved_charge_price, globalvars.localResourceMap.other_discoved_charge_add_qty, globalvars.localResourceMap.other_charge_date_of_service, globalvars.localResourceMap.other_discoved_charge_comment,
                    globalvars.localResourceMap.other_discoved_charge_chargeDescription,'predNbr','','','','','','Bill type'],
                colModel: [
                     {name: 'id', index: 'id', key: true, hidden: true},
                    {name: 'search', index: 'search', width: 100, fixed: true,sortable: false},
                    {
                        name: 'hcpcCode', index: 'hcpcCode', editable: true, width: 110, fixed: true, sortable:false, align: "center", sorttype: "string", key: true,
                        editoptions: {
                            size: "5",
                            maxlength: "5"
                        }
                    },
                    {
                        name: 'dept', index: 'dept', editable: false, width: 110, fixed: true, sorttype: "int", align: "center",sortable: false
                       
                    },
                    {
                        name: 'chargeCode', index: 'chargeCode', editable: false, width: 120, fixed: true, sortable: false, align: "center", sorttype: "int"
                     
                    },
                    {
                        name: 'ndcCode', index: 'chargeCode', editable: false, width: 100, fixed: true, sortable: false, align: "center", sorttype: "int"
                     
                    },
                    {name: 'price', index: 'price', width: 80, fixed: true, sortable: false, sorttype: "int", align: "center",formatter:'currency',
                     formatoptions: { decimalSeparator: ".", thousandsSeparator: ",", prefix: "$",decimalPlaces: 1, defaultValue: '0.0' }},
                    {
                        name: 'quantity', index: 'quantity', sortable: false, editable: this.isEditable, width: 120, fixed: true, align: "center", sorttype: "int", edittype: "text"
                        
                    },
                    {name: 'dateOfService1', index: 'dateOfService1', width: 100, fixed: true, sortable: false, sorttype: "date", datefmt: "Y-m-d h:i:s", editable: this.isEditable, align: "center",
                        editoptions:{
                                            readonly: 'readonly'
                                 }},
                    {name: 'comments', index: 'comments', editable: this.isEditable, width: 200, fixed: true,sortable: false,  editoptions: {
                            size: "23",
                            maxlength: "250",
                        },
                        classes: 'grid_cell_style'},
                    {name: 'chargeDescription', index: 'chargeDescription', hidden: true},
                    {name: 'predNbr', index: 'predNbr', hidden: true},
                    {name: 'method', index: 'method', hidden: true},
                    {name: 'predKey', index: 'predKey',hidden:true},
                    {name: 'rowEditable', index: 'rowEditable',hidden:true},
                    {name: 'cenAuditorId', index: 'cenAuditorId',hidden:true},
                    {name: 'cenAuditingTime', index: 'cenAuditingTime',hidden:true},
                    {name: 'billType', index: 'billType',width: 60,fixed: true,align:'center'}

                    ],

                onSelectRow: function(id) {

                    return false;


                },
                editurl: 'clientArray',
                loadComplete: function() {

                    $(("#global_account_details_other_charges_grid_table tr")).removeClass('highlighted_row');
                     
                      var gridRowData = gridsNew.otherChargesGridGlobal.$gridDiv.jqGrid('getRowData');
                      var gridRowDataLength = gridRowData.length;

                    


                      $("#global_account_details_other_charges_grid_table tbody tr").each(function(){
                            //console.log($(this).text());

                          //  if($(this).text() == "false" || $(this).text() == false){

                                $(this).parent().tooltip({
                                content: function(response) {
                                    //console.log(this.parentNode)
                                    if(this.parentNode){
                                        var rowData = gridsNew.otherChargesGridGlobal.$gridDiv.jqGrid('getRowData',this.parentNode.id);
                                        return '<b>Assigned to: </b>' + rowData.cenAuditorId+"<br/><b>Submitted on: </b>" + rowData.cenAuditingTime;
                                    }
                                },
                                open: function() {
                                    $(this).tooltip("widget").stop(false, true).hide().slideDown("fast");
                                },
                                close: function() {
                                    $(this).tooltip("widget").stop(false, true).show().slideUp("fast");
                                }
                            }).tooltip("widget").addClass("ui-state-highlight");
                      //  }
                    })


                    gridsNew.otherChargesGridGlobal.$gridDiv.setGridParam({rowNum: gridRowDataLength}).trigger("reloadGrid");
                   // gridsNew.otherChargesGridGlobal.$gridDiv.jqGrid('setLabel', 'comments', '', {'text-align': 'left', 'padding-left': '16px', 'width': '236px'});

                }

            });

        },
        fillGrid: function(data) {
            var searchDiv = '<div class="other_discover_search_wrapper"><img class="search_cell_del" src="common/images/account-details/delete-icon.png"><img class="search_cell_search" src="common/images/account-details/search-icon.png"></div>';
            this.$gridDiv.clearGridData();
            var datalength = data.length;
            for (var i = 0; i < datalength; i++) {
                data[i].id = i;
                this.$gridDiv.jqGrid('addRowData', i + 1, data[i]);
                if(data[i].rowEditable)
                    this.$gridDiv.jqGrid('setCell', i + 1, 'search', searchDiv, '');
            }
            ;
            this.$gridDiv.setGridParam({rowNum: datalength}).trigger("reloadGrid");
        },
    
    },

}