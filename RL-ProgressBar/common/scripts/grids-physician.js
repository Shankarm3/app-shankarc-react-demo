var gridPhysician = {

     physicianBillAccountReviewGrid: {
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
                colNames: ['index', 'Rank','','',globalvars.localResourceMap.bill_accout_review_account, 'Top Missing Code','Service Line',globalvars.localResourceMap.bill_accout_review_admit_date,
                    globalvars.localResourceMap.bill_accout_review_discharge_date, globalvars.localResourceMap.bill_accout_review_patient_type,globalvars.localResourceMap.bill_accout_review_patient_type,'',
                    globalvars.localResourceMap.bill_accout_review_payer_name, 'isHighlighted','patientId','Name','',''],
                colModel: [
                   // {name: 'hidden', width: 10, hidden: true, key: true},
                    {name: 'index', width: 10,hidden: true},
                    {name: 'rank', width: 40,sorttype: "int"},
                    {name: 'age', width: 50, sorttype: "int", align: "center", fixed: true, sorttype: "int", sortable: false,hidden: true},
                    {name: 'gender', width: 60, align: 'center', sortable: false, fixed: true, hidden: true},
                    {name: 'accountId', width: 100, sorttype: "int", fixed: true, classes: 'accountlist-account-cursor', sortable: false},
                    {name: 'predCode', width: 100, sorttype: "int", fixed: true, sortable: false},         
                    {name: 'serviceLocation', width: 100, sorttype: "int", fixed: true, sortable: false},         
                    {name: 'admitDate', width: 90, sorttype: "date", sortable: false, classes: 'grid_cell_style', fixed: true},
                    {name: 'dischargeDate', width: 90, sorttype: "date", sortable: false, classes: 'grid_cell_style', fixed: true},
                    {name: 'patTypeWithDescription', align: 'center', width: 120, sortable: false, classes: 'grid_cell_style', fixed: true, hidden:true},
                    {name: 'patSubTypeWithDescription', align: 'center', width: 130, sortable: false, classes: 'grid_cell_style', fixed: true,hidden:false},
                    {name: 'insurance', width: 80, sortable: false, classes: 'grid_cell_style', fixed: true,hidden: true},
                    {name: 'insuranceName', width: 210, sortable: false, classes: 'grid_cell_style', fixed: true},
                    {name: 'isHighlighted', width: 10, hidden: true, sortable: false},
                    {name: 'patientId', width: 10, hidden: true, sortable: false},
                    {name: 'name', width: 10, hidden: true, sortable: false},
                    {name: 'dob', width: 10, hidden: true, sortable: false},
                    {name: 'transferDate', width: 10, hidden: true, sortable: false}
                ],
                onSelectRow: this.onClick,
                loadComplete: function() {

                    var gridRowData = gridPhysician.physicianBillAccountReviewGrid.$gridDiv.jqGrid('getRowData');
                    var gridRowDataLength = gridRowData.length;
                    for (var i = 0; i < gridRowDataLength; i++) {
                        if (gridRowData[i].isHighlighted == "true") {
                            log("isHighlighted " + gridRowData[i].accountId + " : " + (i + 1));
                            $(("#prebill_grid_table tr#" + (parseInt(gridRowData[i].index,10) + 1))).addClass("highlighted_row");
                        }
                        ;
                    }
                    ;
                    gridPhysician.physicianBillAccountReviewGrid.$gridDiv.jqGrid('setLabel', 'accountId', '', {'text-align': 'left', 'padding-left': '16px', 'width': '86px'});
                    gridPhysician.physicianBillAccountReviewGrid.$gridDiv.jqGrid('setLabel', 'admitDate', '', {'text-align': 'left', 'padding-left': '16px', 'width': '86px'});
                    gridPhysician.physicianBillAccountReviewGrid.$gridDiv.jqGrid('setLabel', 'dischargeDate', '', {'text-align': 'left', 'padding-left': '16px', 'width': '96px'});
                    gridPhysician.physicianBillAccountReviewGrid.$gridDiv.jqGrid('setLabel', 'patTypeWithDescription', '', {'text-align': 'left', 'padding-left': '5px', 'width': '106px'});
                    gridPhysician.physicianBillAccountReviewGrid.$gridDiv.jqGrid('setLabel', 'patSubTypeWithDescription', '', {'text-align': 'left', 'padding-left': '5px', 'width': '106px'});
                    gridPhysician.physicianBillAccountReviewGrid.$gridDiv.jqGrid('setLabel', 'insurance', '', {'text-align': 'left', 'padding-left': '16px', 'width': '66px'});
                    gridPhysician.physicianBillAccountReviewGrid.$gridDiv.jqGrid('setLabel', 'insuranceName', '', {'text-align': 'left', 'padding-left': '16px', 'width': '236px'});

                }
            });
        },
        fillGrid: function() {
            var datalength = this.data.length;

            for (var i = 0; i < datalength; i++) {
                gridPhysician.physicianBillAccountReviewGrid.data[i].index = i;
                gridPhysician.physicianBillAccountReviewGrid.$gridDiv.jqGrid('addRowData', i + 1, gridPhysician.physicianBillAccountReviewGrid.data[i]);
            }
            ;

            gridPhysician.physicianBillAccountReviewGrid.$gridDiv.setGridParam({rowNum: 30}).trigger("reloadGrid");

           
        }
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

	 loadFacilityPerformanceDeptGrid : function(param){
		 	var columnHeaderLabel = (param.colHeader) ? param.colHeader :  globalvars.localResourceMap.facility_performance_grid_group_desc 
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
	            colNames: [param.reportType, columnHeaderLabel, globalvars.localResourceMap.facility_performance_grid_header2,
	                       globalvars.localResourceMap.facility_performance_grid_header3],
	            colModel: [
	                       {name: 'groupType', index: 'groupType', width: 206, fixed: true, sortable: false, sorttype: "string", classes: 'facility_performance_grid_first_column_style'},
	                       {name: 'groupDesc', index: 'groupDesc', width: 396, fixed: true, sortable: false, sorttype: "string", classes: 'grid_cell_style'},
	                       {name: 'hitValue', index: 'hitValue', width: 153, fixed: true, sortable: false, sorttype: "int", align: 'right',formatter:'integer',formatoptions : {thousandsSeparator: "," ,prefix: "$"}},
	                       {name: 'hitCount', index: 'hitCount', width: 150, fixed: true, sortable: false, sorttype: "int", align: 'center',formatter:'integer',formatoptions : {thousandsSeparator: "," }},
	            ],
	            loadComplete: function() {
	                //$gridDiv.jqGrid('setLabel', 'groupType', '', {'text-align': 'left', 'padding-left': '16px', 'width': '172px'});
	                //$gridDiv.jqGrid('setLabel', 'groupDesc', '', {'text-align': 'left', 'padding-left': '16px', 'width': '192px'});
	            }
	        });
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
	                globalvars.localResourceMap.auditor_performance_total_account_reviewed_given,
	                globalvars.localResourceMap.auditor_performance_hits, globalvars.localResourceMap.auditor_performance_value_hit],
	            colModel: [
	                {name: 'auditorName', index: 'auditorName', width: 200, fixed: true, sortable: true, sorttype: "string", classes: 'grid_cell_style'},
	                {name: 'totalCostCenter', index: 'totalCostCenter', width: 230, fixed: true, sortable: true, align: 'center', sorttype: "int"},
	                {name: 'reviewedAccount', index: 'reviewedAccount', width: 170, fixed: true, sortable: true, align: 'center', sorttype: "int",formatter:'integer',formatoptions : {thousandsSeparator: "," , defaultValue: '0'}},
	                {name: 'hitAccount', index: 'hitAccount', width: 130, fixed: true, sortable: true, align: 'center', sorttype: "int"},
	                {name: 'hitValue', index: 'hitValue', width: 110, fixed: true, sortable: true, align: 'center', sorttype: "int"}

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

//	        if (datalength == 0){
//	          log("test");
//	            dialogs.messageDialog.show({ text: globalvars.localResourceMap.auditor_performance_no_data_text });
//	        }
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
    existingPhysicianChargesGrid: {
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
                sortname: 'hcpcCode',
                altRows: true,
                altclass: 'alternate_row_color',
                sortorder: 'asc',
                colNames: [
                             'guarantor Id',
                            'Claim #',
                          'PROCEDURE <br>Code',
                          'PROCEDURE <br>DESC',
                          globalvars.localResourceMap.missing_charge_date_of_service, 
                         'Qty', 
                          'Change Qty',
                          'Amount', 
                          
                          // 'Source',
                          'PHYSICIAN','','','','','','','','','','','','','','','',''],
                colModel: [
                    
                    {name: 'guarantorId', index: 'guarantorId', width: 110, fixed: true, sortable: true, sorttype: "string", align: 'left',editable: this.isEditable,editoptions:{readonly:"readonly"}},
                    {name: 'claim', index: 'claim', width: 110, fixed: true, sortable: true, sorttype: "string", align: 'left',editable: this.isEditable,editoptions:{readonly:"readonly"}},
                    {name: 'hcpcCode', index: 'hcpcCode', width: 110, fixed: true, sortable: true, sorttype: "string", align: 'left'},
                    {name: 'chargeDesc', index: 'chargeDesc', width: 220, fixed: true, sorttype: "string", classes: 'grid_cell_style',align: 'left'},
                    {name: 'chargeDate', index: 'chargeDate', width: 100, fixed: true, align: "center", sorttype: "date"},
                    {name: 'quantity', index: 'quantity', width: 80, fixed: true, align: "right", sorttype: "int"},
                    {name: 'qty', index: 'qty', width: 80, fixed: true, sortable: true, sorttype: "int", editable: this.isEditable, align: "center",
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
                            }
                        }
                    },
                    {name: 'chargeAmount', index: 'chargeAmount', width: 80, fixed: true, sorttype: "int", align: 'right',formatter:'currency',
                     formatoptions: { decimalSeparator: ".", thousandsSeparator: ",", prefix: "$",decimalPlaces: 1, defaultValue: '0.0' }},
                    // {name: 'source', index: 'source', width: 100, fixed: true, sortable: true, sorttype: "string", align: 'center'},
                    {name: 'doctor', index: 'doctor', width: 200, fixed: true, classes: 'grid_cell_style',align: 'left'},
                    {name: 'doctorId', index: 'doctorId', hidden:true},
                    {name: 'chargeCode', index: 'chargeCode', hidden:true},
                    {name: 'dept', index: 'dept', hidden:true},
                    {name: 'chargeNumber', index: 'chargeNumber', hidden:true},
                    {name: 'npi', index: 'npi', hidden:true},
                    {name: 'startDate', index: 'startDate', hidden:true},
                    {name: 'terminationDate', index: 'terminationDate', hidden:true},
                    {name: 'type', index: 'type', hidden:true},
                    {name: 'predKey', index: 'predKey',hidden:true},
                    {name: 'rowEditable', index: 'rowEditable',hidden:true},
                    {name: 'firstName', index: 'firstName', hidden:true},
                    {name: 'lastName', index: 'lastName',hidden:true},
                    {name: 'dob', index: 'dob',hidden:true},
                    {name: 'cenAuditorId', index: 'cenAuditorId',hidden:true},
                    {name: 'cenAuditingTime', index: 'cenAuditingTime',hidden:true},
                    {name: 'code', index: 'code',hidden:true}

                    
                ],
                onSelectRow: function(id) {
                    var rowData = gridPhysician.existingPhysicianChargesGrid.$gridDiv.jqGrid('getRowData', id);

                    if(rowData.rowEditable == false || rowData.rowEditable == "false"){
                        return;
                    }

                    if (gridPhysician.existingPhysicianChargesGrid.selectedRow !== undefined) {
                        gridPhysician.existingPhysicianChargesGrid.$gridDiv.jqGrid('saveRow', gridPhysician.existingPhysicianChargesGrid.selectedRow);
                    }
                    ;
                    if (gridPhysician.existingPhysicianChargesGrid.savedSuccessfully == true) {
                        gridPhysician.existingPhysicianChargesGrid.selectedRow = id;
                        //gridPhysician.existingChargesGrid.$gridDiv.jqGrid('editRow', id, true,);
                        gridPhysician.existingPhysicianChargesGrid.$gridDiv.jqGrid('editRow',id, true, false, false, false, false, false,false, afterrestorefunc)
                        gridPhysician.existingPhysicianChargesGrid.savedSuccessfully = false;
                    }
                    
                    function afterrestorefunc(e){
                            gridPhysician.existingPhysicianChargesGrid.savedSuccessfully = true;
                    }

                    log('Exiting Charges ID clicked ' + id + " " + gridPhysician.existingPhysicianChargesGrid.selectedRow);
                },
                
                editurl: 'clientArray',
                loadComplete: function() {
                    var gridRowData = gridPhysician.existingPhysicianChargesGrid.$gridDiv.jqGrid('getRowData');
                     var gridRowDataLength = gridRowData.length;

                   
                     
                     

                    
                     //var gridRowData = gridPhysician.existingChargesGridCCIEdits.$gridDiv.clearGridData();
                     
                     
                     gridPhysician.existingPhysicianChargesGrid.$gridDiv.clearGridData();
                     var datalength = gridRowData.length;
                     for (var i = 0; i < datalength; i++) {

                         gridPhysician.existingPhysicianChargesGrid.$gridDiv.jqGrid('addRowData', i + 1, gridRowData[i]);
                     }


                     for (var i = 0; i < gridRowDataLength; i++) {
                         if (gridRowData[i].rowEditable == "false" || gridRowData[i].rowEditable == false) {
                             $(("#account_details_existing_charges_grid_table tr#" + (i + 1))).addClass("highlighted_row");
                         }
                     }


                     $("#account_details_existing_charges_grid_table tbody tr").find('td:eq(18)').each(function(){
                            //console.log($(this).text());

                            if($(this).text() == "false" || $(this).text() == false){

                                $(this).parent().tooltip({
                                content: function(response) {
                                    //console.log(this.parentNode)
                                    if(this.parentNode){
                                        var rowData = gridPhysician.existingPhysicianChargesGrid.$gridDiv.jqGrid('getRowData',this.parentNode.id);
                                        return '<b>Assigned to: </b>' + rowData.cenAuditorId+"<br/><b>Submitted on: </b>" + rowData.cenAuditingTime;
                                    }
                                },
                                open: function() {
                                    $(this).tooltip("widget").stop(false, true).hide().slideDown("fast");
                                },
                                close: function() {
                                    $(this).tooltip("widget").stop(false, true).show().slideUp("fast");
                                }
                            })//.tooltip("widget").addClass("ui-state-highlight");
                        }
                    })

                     $("#account_details_existing_charges_grid_table tbody tr").find("td:eq(8)").each(function(){
                          //  console.log($(this).text());

                            if($(this).text().length > 1){

                                $(this).tooltip({
                                content: function(response) {
                                    var rowData = gridPhysician.existingPhysicianChargesGrid.$gridDiv.jqGrid('getRowData',this.parentNode.id);
                                    if(globalvars.client == "CP")
                                        return '<b>Name: </b>' + rowData.doctor+"<br/><b>NPI: </b>" + rowData.npi + '<br/> <b>CODE: </b>' + rowData.code + '<br/> <b>Start Date: </b>' + rowData.startDate + '<br/><b>Termination Date: </b>' + rowData.terminationDate + '<br/><b>Speciality: </b>' + rowData.type ;
                                    else
                                        return '<b>Name: </b>' + rowData.doctor+"<br/><b>NPI: </b>" + rowData.npi + '<br/><b>Start Date: </b>' + rowData.startDate + '<br/><b>Termination Date: </b>' + rowData.terminationDate + '<br/><b>Speciality: </b>' + rowData.type ;

                                },
                                open: function() {
                                    $(this).tooltip("widget").stop(false, true).hide().slideDown("fast");
                                },
                                close: function() {
                                    $(this).tooltip("widget").stop(false, true).show().slideUp("fast");
                                }
                            })//.tooltip("widget").addClass("ui-state-highlight");
                        }
                    })
                     $("#account_details_existing_charges_grid_table tbody tr").find("td:eq(0)").each(function(){
                         //   console.log($(this).text());

                            if($(this).text().length > 1){

                                $(this).tooltip({
                                content: function(response) {
                                    var rowData = gridPhysician.existingPhysicianChargesGrid.$gridDiv.jqGrid('getRowData',this.parentNode.id);
                                    return '<b>First Name: </b>' + rowData.firstName+"<br/><b>Last Name: </b>" + rowData.lastName + '<br/><b>Dob: </b>' + rowData.dob;
                                },
                                open: function() {
                                    $(this).tooltip("widget").stop(false, true).hide().slideDown("fast");
                                },
                                close: function() {
                                    $(this).tooltip("widget").stop(false, true).show().slideUp("fast");
                                }
                            })//.tooltip("widget").addClass("ui-state-highlight");
                        }
                    })

                     
                    
                    gridPhysician.existingPhysicianChargesGrid.$gridDiv.setGridParam({rowNum: datalength}).trigger("reloadGrid");
                   // gridPhysician.existingPhysicianChargesGrid.$gridDiv.jqGrid('setLabel', 'chargeDesc', '', {'text-align': 'left', 'padding-left': '16px', 'width': '150px'});
                    //gridPhysician.existingPhysicianChargesGrid.$gridDiv.jqGrid('setLabel', 'comments', '', {'text-align': 'left', 'padding-left': '16px', 'width': '186px'});
                }

            });

            this.$gridDiv.bind("jqGridInlineAfterSaveRow", function(rowid) {
                log("jqGridInlineAfterSaveRow");
                gridPhysician.existingPhysicianChargesGrid.savedSuccessfully = true;
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
     existingHospitalChargesGrid: {
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
                //sortname: 'hcpcCode',
                altRows: true,
                altclass: 'alternate_row_color',
                colNames: ['CPT/HCPC CODE', 
                           globalvars.localResourceMap.existing_charge_dept_code,
                           'REV Code',  
                           globalvars.localResourceMap.existing_charge_charge_code,
                           'Units', 
                           globalvars.localResourceMap.existing_charge_amount,
                           'Date Of Service', 
                           globalvars.localResourceMap.existing_charge_charge_description,
                           'Doctor','','','','',''],
                colModel: [
                    {name: 'hcpcCode', index: 'hcpcCode', width: 100, fixed: true,align: 'center',sortable: false},
                    {name: 'dept', index: 'dept', width: 100, fixed: true, sorttype: "int", align: 'center'},
                    {name: 'revenueCode', index: 'revenueCode', width: 100, fixed: true, sorttype: "int", align: 'center'},
                    {name: 'chargeCode', index: 'chargeCode', fixed: true, width: 100, sortable: true, sorttype: "int", align: 'center'},
                    {name: 'quantity', index: 'quantity', width: 100, fixed: true, align: "center", sorttype: "int"},
                    {name: 'chargeAmount', index: 'chargeAmount', width: 120, fixed: true, sorttype: "int", align: 'right',formatter:'currency',
                     formatoptions: { decimalSeparator: ".", thousandsSeparator: ",", prefix: "$",decimalPlaces: 1, defaultValue: '0.0' }},
                    {name: 'chargeDate', index: 'chargeDate', width: 120, fixed: true, align: "center", sorttype: "date"},
                    {name: 'chargeDesc', index: 'chargeDesc', width: 200, fixed: true, sorttype: "string", classes: 'grid_cell_style'},
                    {name: 'doctor', index: 'doctor', width: 155, fixed: true, editable: false},
                    {name: 'isExist', index: 'isExist', hidden:true},
                    {name: 'npi', index: 'npi', hidden:true},
                    {name: 'startDate', index: 'startDate', hidden:true},
                    {name: 'terminationDate', index: 'terminationDate', hidden:true},
                    {name: 'type', index: 'type', hidden:true}

                ],
                onSelectRow: function(id) {
                },
                
                editurl: 'clientArray',
                loadComplete: function() {

                    $("#account_details_hospital_charges_grid_table tr").removeClass('highlighted_row_yellow');
                     gridPhysician.existingHospitalChargesGrid.$gridDiv.trigger("reloadGrid");

                     var gridRowData = gridPhysician.existingHospitalChargesGrid.$gridDiv.jqGrid('getRowData');
                     //var gridRowData = gridPhysician.existingChargesGridCCIEdits.$gridDiv.clearGridData();
                     
                     
                     gridPhysician.existingHospitalChargesGrid.$gridDiv.clearGridData();
                     var datalength = gridRowData.length;
                     for (var i = 0; i < datalength; i++) {
                         gridPhysician.existingHospitalChargesGrid.$gridDiv.jqGrid('addRowData', i + 1, gridRowData[i]);
                     }
                     
                     gridPhysician.existingHospitalChargesGrid.$gridDiv.setGridParam({rowNum: datalength}).trigger("reloadGrid");
                     
                     
                     
                     for (var i = 0; i < gridRowData.length; i++) {
                         log("Highlighted found:::" + gridRowData[i].isExist);
                         if (gridRowData[i].isExist == 'true' || gridRowData[i].isExist == "true") {
                             log("Highlighted found" + gridRowData[i].isExist + "::" + (i + 1) + "::::" + gridRowData[i].hcpcCode);
                             $("#account_details_hospital_charges_grid_table tbody tr#" + (i + 1)).addClass("highlighted_row_yellow");
                         }
                         
                     }


                     $("#account_details_hospital_charges_grid_table tbody tr").find("td:eq(8)").each(function(){
                            //console.log($(this).text().length);

                            if($(this).text().length > 1){

                                $(this).tooltip({
                                content: function(response) {
                                    var rowData = gridPhysician.existingHospitalChargesGrid.$gridDiv.jqGrid('getRowData',this.parentNode.id);
                                    return '<b>Name: </b>' + rowData.doctor+"<br/><b>NPI: </b>" + rowData.npi + '<br/><b>Start Date: </b>' + rowData.startDate + '<br/><b>Termination Date: </b>' + rowData.terminationDate + '<br/><b>Speciality: </b>' + rowData.type ;
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
                

                    gridPhysician.existingHospitalChargesGrid.$gridDiv.jqGrid('setLabel', 'chargeDesc', '', {'text-align': 'left', 'padding-left': '16px', 'width': '186px'});
                    gridPhysician.existingHospitalChargesGrid.$gridDiv.jqGrid('setLabel', 'doctor', '', {'text-align': 'left', 'padding-left': '5px', 'width': '186px'});
                }

            });

            this.$gridDiv.bind("jqGridInlineAfterSaveRow", function(rowid) {
                log("jqGridInlineAfterSaveRow");
                gridPhysician.existingHospitalChargesGrid.savedSuccessfully = true;
            });
            
        },
        fillGrid: function(data) {
            this.$gridDiv.clearGridData();
            var datalength = data.length;
            for (var i = 0; i < datalength; i++) {
                this.$gridDiv.jqGrid('addRowData', i + 1, data[i]);
            }
     
            this.$gridDiv.setGridParam({rowNum: datalength}).trigger("reloadGrid");

        }
    },
    missingPhysicianChargesGrid: {
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
            gridPhysician.missingPhysicianChargesGrid.isConfirmCharg = param.isConfirmCharg;
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
                height: '200',
                gridview: true,
                viewrecords: true,
                altRows: true,
                altclass: 'alternate_row_color',
                sortorder: 'asc',
                colNames: [ 'id',
                            'Prediction',
                            (globalvars.client == "MSH")?'Clinic':'Dept',
                           'Procedure', 
                           'Desc',
                           globalvars.localResourceMap.missing_charge_price,
                            'Modifier',
                           globalvars.localResourceMap.missing_charge_add_qty, 
                           globalvars.localResourceMap.missing_charge_date_of_service, 
                           'pos',
                           'Serving Phys',
                           'Billing Phys',
                           'Diag Codes',
                           'Primary Diag',
                           globalvars.localResourceMap.missing_charge_response, 
                           globalvars.localResourceMap.missing_charge_response_code,
                           'claim #', 
                           globalvars.localResourceMap.missing_charge_comment,'','','','','','','','','',''],
                            
                colModel: [
                    {name: 'id', index: 'id', key: true, hidden: true},
                    {
                        name: 'predCode', index: 'predCode', width:70, fixed: true, sortable: true, sorttype: "string", align: "center"
                    },
                    {name: 'deptPhys', index: 'deptPhys', fixed: true, width: 60},
                    {name: 'hcpcCode', index: 'hcpcCode', width:80, fixed: true, sorttype: "int", align: "center"},
                    {name: 'chargeDesc', index: 'chargeDesc', fixed: true, width: 60, classes: 'grid_cell_style'},
                    
                    

                    {name: 'price', index: 'price', width: 50, fixed: true, sortable: true, sorttype: "int", align: "center",formatter:'currency',
                     formatoptions: { decimalSeparator: ".", thousandsSeparator: ",", prefix: "$",decimalPlaces: 1, defaultValue: '0.0' }},
                    {name: 'modifier', index: 'modifier', fixed: true, width: 80, classes: 'grid_cell_style',align: "center"},

                    {
                        name: 'qty', index: 'qty', width: 50, fixed: true, sortable: true, sorttype: "int", editable: this.isEditable, align: "center",
                        edittype: "text",
                        editoptions: {
                            size: "3",
                            maxlength: "3",
                            minValue: 1
                        }
                        // }, editrules: {
                        //     custom: true,
                        //     custom_func: function(value, colname) {

                        //         var selectedRowData = gridPhysician.missingPhysicianChargesGrid.$gridDiv.jqGrid('getRowData', gridPhysician.missingPhysicianChargesGrid.selectedRow);
                        //         var currentResponseValue = $("#responseSelect" + gridPhysician.missingPhysicianChargesGrid.selectedRow + " option:selected").val();

                        //         var currentDeptValue = $("#deptSelect" + gridPhysician.missingPhysicianChargesGrid.selectedRow + " option:selected").val();
                        //         var currentChargeCodeValue = $("#chargeCodeSelect" + gridPhysician.missingPhysicianChargesGrid.selectedRow + " option:selected").val();

                        //         if(value !== undefined){
                        //             if (!(/^-?\d+$/.test(value)) || isNaN(value)) {
                        //                 return [false, globalvars.localResourceMap.missing_physician_validation_msg1];
                        //             }
                        //             else{
                        //                 // if((value > 0 && currentResponseValue != "Y")||(value > 0 && currentResponseValue != "C")||(value > 0 && currentResponseValue != "W"))
                        //                 //     return [true, ""];
                        //                 if ((value != 0 && currentResponseValue != "Y") && (value != 0 && currentResponseValue != "C")&& (value != 0 && currentResponseValue != "W") && (value != 0 && currentResponseValue != "T")) {
                        //                     return [false, globalvars.localResourceMap.missing_charge_validation_msg3];
                        //                 } else if ((value < 1 && currentResponseValue == "Y") || (value < 1 && currentResponseValue == "C") || (value < 1 && currentResponseValue == "W") || (value < 1 && currentResponseValue == "T")) {
                        //                     return [false, globalvars.localResourceMap.missing_physician_validation_msg2];
                        //                 } else {
                        //                     return [true, ""];
                        //                 }
                        //             }
                        //     	}
                                
                        //     }
                        // }
                    },
                    {name: 'dateOfService', index: 'dateOfService', width: 60, fixed: true, sortable: true, sorttype: "date", datefmt: "Y-m-d h:i:s", editable: this.isEditable, align: "center",
                    editoptions:{
                                            readonly: 'readonly'
                                 }},
                    {name: 'pos', index: 'pos', fixed: true, width: 50,align: "center"},
                    {name: 'npi', index: 'npi', fixed: true, width: 75,align: "center"},
                    {name: 'billPhys', index: 'billPhys', fixed: true, width: 70},
                    {name: 'diag', index: 'diag', fixed: true, width: 75,align: "center"},
                    {name: 'primaryDiag', index: 'primaryDiag', fixed: true, width: 70,align: "center"},
                    {name: 'response', index: 'response', fixed: true, width: 70, classes: 'grid_cell_style'},
                    {name: 'responseCode', hidden: true},
                    {name: 'claimNumber', index: 'claimNumber', width: 50, fixed: true,editable: this.isEditable,editoptions: {maxlength: "50"}}, 
                    {name: 'comments', index: 'comments', width: 80, fixed: true, editable: this.isEditable,  editoptions: {
                            size: "7",
                            maxlength: "500",
                        },
                        classes: 'grid_cell_style'},
                        {name: 'predCode', hidden: true},
                        {name: 'isNew', hidden: true}, 
                        {name: 'predKey', index: 'predKey',hidden:true},
                        {name: 'rowEditable', index: 'rowEditable',hidden:true},
                        {name: 'cenAuditorId', index: 'cenAuditorId',hidden:true},
                    {name: 'cenAuditingTime', index: 'cenAuditingTime',hidden:true} ,

                    {name: 'preBillSelectedAuditor', index: 'preBillSelectedAuditor', hidden: true, search: true},
                    {name: 'accountSelectedDiag', index: 'accountSelectedDiag', hidden: true, search: true},
                    {name: 'source', index: 'source',hidden:true},
                    {name: 'costCenter', index: 'costCenter',hidden:true},




   
                ],
                onSelectRow: function(id, status, e) {
                        
                                //globalvars.saveRowId = id

                    var rowData = gridPhysician.missingPhysicianChargesGrid.$gridDiv.jqGrid('getRowData', id);

                    if(rowData.rowEditable == false || rowData.rowEditable == "false"){
                        return;
                    }



                        if (globalvars.saveRowId != id) {

                            gridPhysician.missingPhysicianChargesGrid.$gridDiv.jqGrid('saveRow', globalvars.saveRowId);
                            globalvars.saveRowId = id;
                        }   
                        if (gridPhysician.missingPhysicianChargesGrid.savedSuccessfully == true && gridPhysician.missingPhysicianChargesGrid.isEditable == true) {
                            gridPhysician.missingPhysicianChargesGrid.selectedRow = id;

                            var selectedRowData = gridPhysician.missingPhysicianChargesGrid.$gridDiv.jqGrid('getRowData', id);
                            
                            //added for new default data
                            gridPhysician.missingPhysicianChargesGrid.setDefaultData({rowData: selectedRowData,
                               rowId: id});
                            

                            var newRowData = gridPhysician.missingPhysicianChargesGrid.$gridDiv.jqGrid('getRowData', id);
                            globalvars.selectedNPI = selectedRowData.npi;
                            newRowData.response = gridPhysician.missingPhysicianChargesGrid.createResponseDropdown({
                                rowData: selectedRowData,
                                rowId: id
                            });

                            newRowData.npi = gridPhysician.missingPhysicianChargesGrid.createPhysicianNpiDropdown({
                                rowData: selectedRowData,
                                rowId: id
                            });

                            newRowData.billPhys = gridPhysician.missingPhysicianChargesGrid.createPhysicianBillingNpiDropdown({
                                rowData: selectedRowData,
                                rowId: id
                            });

                            if (selectedRowData.predCode != "") {
                                newRowData.hcpcCode = gridPhysician.missingPhysicianChargesGrid.createDeptDropdown({
                                    rowData: selectedRowData,
                                    rowId: id
                                });
                            }

                           if (selectedRowData.hcpcCode != "") {

                            newRowData.modifier = gridPhysician.missingPhysicianChargesGrid.createModifierDropDown({
                                    rowData: selectedRowData,
                                    rowId: id
                                });

                           }

                           newRowData.diag = gridPhysician.missingPhysicianChargesGrid.createDiagDropDown({
                                    rowData: selectedRowData,
                                    rowId: id
                                });


                            newRowData.pos = gridPhysician.missingPhysicianChargesGrid.createPosDropdown({
                                    rowData: selectedRowData,
                                    rowId: id
                                });

                            newRowData.deptPhys = gridPhysician.missingPhysicianChargesGrid.createDepartmentDropdown({
                                    rowData: selectedRowData,
                                    rowId: id
                                });

                            newRowData.primaryDiag = gridPhysician.missingPhysicianChargesGrid.createPrimaryDiagDropdown({
                                    rowData: selectedRowData,
                                    rowId: id
                                });


                            

                            
                            
                            gridPhysician.missingPhysicianChargesGrid.$gridDiv.jqGrid('setRowData', id, newRowData);
                            gridPhysician.missingPhysicianChargesGrid.addSearableDropDown();
                           

                            gridPhysician.missingPhysicianChargesGrid.bindHcpcCodeChange({id: id});
                            gridPhysician.missingPhysicianChargesGrid.bindPhysicianNPICodeChange({id: id});
                            gridPhysician.missingPhysicianChargesGrid.bindBillingPhysicianNPICodeChange({id: id});
                            
                            gridPhysician.missingPhysicianChargesGrid.addMultiSelectModifier({id: id})
                            gridPhysician.missingPhysicianChargesGrid.addMultiSelectDiagCode({id:id})

                            //gridPhysician.missingPhysicianChargesGrid.bindSourceChange({id: id});


                            gridPhysician.missingPhysicianChargesGrid.$gridDiv.jqGrid('editRow',id, true, false, false, false, false, false,false, afterrestorefunc);

                            $('#' + id + '_' + 'dateOfService').datepicker({dateFormat: 'yy-mm-dd',defaultDate:screens.physicianAccountDetailsForm.admitDate});//,minDate:screens.accountDetails.admitDate,maxDate:screens.accountDetails.dischargeDate});
                           
                            $('.ui-multiselect-filter input').css('width', 'auto');
                            $('.ui-multiselect-menu').css('width', 'auto');
                            $('.ui-multiselect').css('background','#fff');
                            $('.ui-multiselect-hasfilter ul').css('display','none')
                           // $('.ui-helper-reset').css('display','none');
                            
                              
                             gridPhysician.missingPhysicianChargesGrid.savedSuccessfully = false;
                            


                        }
                        
                    
                     function afterrestorefunc(e){
                        gridPhysician.missingPhysicianChargesGrid.$gridDiv.trigger('jqGridInlineAfterSaveRow');
                     }

                     //log('missing Charges ID clicked ' + id + " " + gridPhysician.missingPhysicianChargesGrid.selectedRow);
                },
                /*onCellSelect: function (iRow, iCol, content, event) {
                     var cmName = gridPhysician.missingPhysicianChargesGrid.$gridDiv.jqGrid("getGridParam", "colModel")[iCol].name,
                     target = event.target;
                },*/
                editurl: 'clientArray',
                loadComplete: function() {
                    
                    $(("#account_details_missing_charges_grid_table tr")).removeClass('highlighted_row');
                      // gridPhysician.missingPhysicianChargesGrid.$gridDiv.trigger("reloadGrid");
                      var gridRowData = gridPhysician.missingPhysicianChargesGrid.$gridDiv.jqGrid('getRowData');
                      var gridRowDataLength = gridRowData.length;

                    //  console.log(gridRowData);

                     
                      for (var i = 0; i < gridRowDataLength; i++) {
                          if ((gridRowData[i].rowEditable == "false" || gridRowData[i].rowEditable == false) || (gridRowData[i].cenAuditorId != globalvars.user.userId) && (globalvars.user.uType == globalvars.roles.physicianUser)) {
                              log("isHighlighted " + gridRowData[i].isNew + " : " + (i + 1));
                              var searchId = gridRowData[i].id;
                         //     console.log(searchId);
                                    $(("#account_details_missing_charges_grid_table tr#" + (searchId))).addClass("highlighted_row");
                          }
                      }

                      $("#account_details_missing_charges_grid_table tbody tr").each(function(){
                            var rowId1 = $(this).find('td:eq(21)');
                            var rowId2 = $(this).find('td:eq(22)');
                            if($(rowId1).text() != "" && $(rowId2).text() != ""){

                                if((($(rowId1).text() == false)||($(rowId2).text() != globalvars.user.userId)) && (globalvars.user.uType == globalvars.roles.physicianUser)){
                                    $(this).find('td').tooltip({
                                    content: function(response) {
                                      //  console.log($(this).index());
                                        if($(this).index() == 1){
                                            if(this.parentNode){    
                                                var rowData = gridPhysician.missingPhysicianChargesGrid.$gridDiv.jqGrid('getRowData',this.parentNode.id);
                                                return '<b>Assigned to: </b>' + rowData.cenAuditorId+"<br/><b>Submitted on: </b>" + rowData.cenAuditingTime;
                                            }
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
                        }
                    })

                }

            });

            this.$gridDiv.unbind("jqGridInlineAfterSaveRow");
            this.$gridDiv.bind("jqGridInlineAfterSaveRow", function(rowid) {
                log("jqGridInlineAfterSaveRow");

                var selectedRowData = gridPhysician.missingPhysicianChargesGrid.$gridDiv.jqGrid('getRowData', gridPhysician.missingPhysicianChargesGrid.selectedRow);
                selectedRowData.responseCode = $("#responseSelect" + gridPhysician.missingPhysicianChargesGrid.selectedRow + " option:selected").val();
                selectedRowData.response = $("#responseSelect" + gridPhysician.missingPhysicianChargesGrid.selectedRow + " option:selected").text();

                if($("#deptSelect" + gridPhysician.missingPhysicianChargesGrid.selectedRow + " option:selected").val() == undefined)
                    selectedRowData.hcpcCode="";
                else
                    selectedRowData.hcpcCode = $("#deptSelect" + gridPhysician.missingPhysicianChargesGrid.selectedRow + " option:selected").val();

                if($("#posSelect" + gridPhysician.missingPhysicianChargesGrid.selectedRow + " option:selected").val() == undefined)
                    selectedRowData.pos="";
                else
                    selectedRowData.pos = $("#posSelect" + gridPhysician.missingPhysicianChargesGrid.selectedRow + " option:selected").val();


                if($("#pDiagSelect" + gridPhysician.missingPhysicianChargesGrid.selectedRow + " option:selected").val() == undefined)
                    selectedRowData.primaryDiag="";
                else
                    selectedRowData.primaryDiag = $("#pDiagSelect" + gridPhysician.missingPhysicianChargesGrid.selectedRow + " option:selected").val();



                if($("#physicianNPISelect" + gridPhysician.missingPhysicianChargesGrid.selectedRow + " option:selected").val() == undefined){
                    selectedRowData.npi="";
                }
                else{
                    selectedRowData.npi = $("#physicianNPISelect" + gridPhysician.missingPhysicianChargesGrid.selectedRow + " option:selected").val();
                }

                if($("#physicianBillNPISelect" + gridPhysician.missingPhysicianChargesGrid.selectedRow + " option:selected").val() == undefined){
                    selectedRowData.billPhys="";
                }
                else{
                    selectedRowData.billPhys = $("#physicianBillNPISelect" + gridPhysician.missingPhysicianChargesGrid.selectedRow + " option:selected").val();
                }


                if($("#departmentSelect" + gridPhysician.missingPhysicianChargesGrid.selectedRow + " option:selected").val() == undefined){
                    selectedRowData.deptPhys="";
                }
                else{
                    selectedRowData.deptPhys = $("#departmentSelect" + gridPhysician.missingPhysicianChargesGrid.selectedRow + " option:selected").val();
                }



                //selectedRowData.chargeCode = $("#chargeCodeSelect" + gridPhysician.missingPhysicianChargesGrid.selectedRow + " option:selected").val();

                selectedRowData.modifier =  selectedRowData.preBillSelectedAuditor;
                selectedRowData.diag =  selectedRowData.accountSelectedDiag;


                log(selectedRowData);
                gridPhysician.missingPhysicianChargesGrid.$gridDiv.jqGrid('setRowData', gridPhysician.missingPhysicianChargesGrid.selectedRow, selectedRowData);

                gridPhysician.missingPhysicianChargesGrid.savedSuccessfully = true;

            });


        },
        fillGrid: function(data) {
            this.$gridDiv.clearGridData();
            var datalength = data.length;
            //var data = eval([{"hcpcCode":"95819","dept":"","chargeCode":"","qty":0,"chargeDesc":"ELECTROENCEPHALOGRAM (EEG)","response":null,"responseCode":null,"comments":null,"predCode":"95819","dateOfService":null,"chargeNumber":null,"price":2208.72,"isNew":true,"addComment":"","tipOffComment":{"comment":"test","selectedFacilities":["Bayonne","Cayonne"],"newComment":""}},{"hcpcCode":"94002","dept":"","chargeCode":"","qty":0,"chargeDesc":"INITIAL,VENTILATORMANAGEMENT","response":null,"responseCode":null,"comments":null,"predCode":"94002","dateOfService":null,"chargeNumber":null,"price":1411.65,"isNew":true,"addComment":"","tipOffComment":{"comment":"", "selectedFacilities":[],"newComment":""}}]);
            for (var i = 0; i < datalength; i++) {
                data[i].preBillSelectedAuditor = data[i].modifier;
                data[i].accountSelectedDiag = data[i].diag;

                
                this.$gridDiv.jqGrid('addRowData', i + 1, data[i]);
            }

            this.$gridDiv.setGridParam({dataNew: data});

            this.$gridDiv.setGridParam({rowNum: datalength}).trigger("reloadGrid");
        },
        setDefaultData:function(param){

            var objectKey = "missingData" + "_" +param.rowData.predKey
            var data  = globalvars.missingDropDownData[objectKey];
            if(data){

            }else{
                getJSONModel({
                    async: false,
                    url: globalvars.uriCharges.getPhysModifierDaigUri,
                    type: 'GET',
                    data: {'predKey':param.rowData.predKey,'hcpcCode':param.rowData.hcpcCode},
                    traditional: true,
                    dataType: 'json',
                    targetVar: "dataPredKeyList"

                });
                var objectKeyDiag = "missingData" + "_" +param.rowData.predKey + "_diag";
                var objectKeyNpi = "missingData" + "_" +param.rowData.predKey + "_npi";
                var objectKeyNpiBill = "missingData" + "_" +param.rowData.predKey + "_billPhys";
                var objectKeyMod = "missingData" + "_" + param.rowData.hcpcCode + "_" +param.rowData.predKey + "_mod";

                //billingPhysicianList

                var diagList=[];
                var npiList=[];
                var billNpiList=[];
                var modList=[];
                

                
                $(globalvars.dataPredKeyList.diagCodeList).each(function (i) {
                    diagList.push(globalvars.dataPredKeyList.diagCodeList[i].diagCode)
                    globalvars.appDiagData[globalvars.dataPredKeyList.diagCodeList[i].diagCode] = globalvars.dataPredKeyList.diagCodeList[i].description;


                })
                $(globalvars.dataPredKeyList.physicianList).each(function (i) {
                     var obj={};
                    obj.name = globalvars.dataPredKeyList.physicianList[i].name;
                    obj.npi = globalvars.dataPredKeyList.physicianList[i].npi;
                    npiList.push(obj);

                })

                $(globalvars.dataPredKeyList.billingPhysicianList).each(function (i) {
                     var obj={};
                    obj.name = globalvars.dataPredKeyList.billingPhysicianList[i].name;
                    obj.npi = globalvars.dataPredKeyList.billingPhysicianList[i].npi;
                    billNpiList.push(obj);

                })
               
                $(globalvars.dataPredKeyList.listModifier).each(function (i) {
                    modList.push(globalvars.dataPredKeyList.listModifier[i].modifier)
                    globalvars.appModData[globalvars.dataPredKeyList.listModifier[i].modifier] = globalvars.dataPredKeyList.listModifier[i].description;

                })



                globalvars.missingDropDownData[objectKey] = globalvars.dataPredKeyList;
                globalvars.missingDropDownData[objectKeyNpi] = npiList;
                globalvars.missingDropDownData[objectKeyNpiBill] = billNpiList;
                globalvars.missingDropDownData[objectKeyDiag] =diagList; 
                globalvars.missingDropDownData[objectKeyMod] =modList; 
            }


        },
        addMultiSelectModifier:function(param){
            var preBillSelectedAuditortext = gridPhysician.missingPhysicianChargesGrid.$gridDiv.jqGrid('getCell', param.id, 'preBillSelectedAuditor');
            var preBillRetainAuditorList = preBillSelectedAuditortext.split(",");
            $("#prebill_auditor_dropdown" + param.id).val(preBillRetainAuditorList);
            $("#prebill_auditor_dropdown" + param.id).multiselect({
                multiple: true,
                minWidth: 60,
                selectedList: 40,
                checkAllText: '',
                uncheckAllText: '',
                click: function( event, ui ) {
                    // console.log('click');
                    if(ui.value === 'addMore'){
                        dialogs.otherPhysicianMissingModDialog.reset();
                        // gridPhysician.loadMissingPhyModCodePopupGrid({
                        //     gridDiv: "#account_details_missing_mod_physician_grid_search_form_table"
                        // });

                        dialogs.otherPhysicianMissingModDialog.initialize({
                            $searchFormDialogDiv: $("#missing_mod_grid_physician_search_form_dialog"),
                            $searchFormDialogDivSubmit: $("#missing_mod_grid_physician_search_form_submit"),
                            $searchFormDialogDivReset: $("#missing_mod_grid_physician_search_form_reset"),
                            $searchFormDialogDivCancel: $("#missing_mod_grid_physician_search_form_cancel"),
                            $searchFormDialogDivAddCodes: $("#missing_mod_grid_physician_search_form_add_Codes"),
                            screenName:"missing"
                        });
                        dialogs.otherPhysicianMissingModDialog.open();
                        $("#prebill_auditor_dropdown" + param.id).multiselect('close');
                        return false;


                    }
                }
            }).multiselectfilter();
        },
        addMultiSelectDiagCode:function(param){
            var preBillSelectedAuditortext = gridPhysician.missingPhysicianChargesGrid.$gridDiv.jqGrid('getCell', param.id, 'accountSelectedDiag');
            var preBillRetainAuditorList = preBillSelectedAuditortext.split(",");
            $("#diag_code_dropdown" + param.id).val(preBillRetainAuditorList);
            $("#diag_code_dropdown" + param.id).multiselect({
                multiple: true,
                minWidth: 60,
                selectedList: 40,
                checkAllText: '',
                uncheckAllText: '',
                click: function( event, ui ) {
                    // console.log('click');
                    if(ui.value === 'addMore'){
                        dialogs.otherPhysicianMissingDiagDialog.reset();
                        // gridPhysician.loadMissingPhyDiagCodePopupGrid({
                        //     gridDiv: "#account_details_missing_diag_physician_grid_search_form_table"
                        // });

                        dialogs.otherPhysicianMissingDiagDialog.initialize({
                            $searchFormDialogDiv: $("#missing_diag_grid_physician_search_form_dialog"),
                            $searchFormDialogDivSubmit: $("#missing_diag_grid_physician_search_form_submit"),
                            $searchFormDialogDivReset: $("#missing_diag_grid_physician_search_form_reset"),
                            $searchFormDialogDivCancel: $("#missing_diag_grid_physician_search_form_cancel"),
                            $searchFormDialogDivAddCodes: $("#missing_diag_grid_physician_search_form_add_Codes"),
                            screenName:"missing"
                        });
                        dialogs.otherPhysicianMissingDiagDialog.open();
                        $("#diag_code_dropdown" + param.id).multiselect('close');
                        return false;


                    }


                    // .eq(ui.value === 'usa'? 0 : 1)
                    // .filter(':not(:checked)')
                    // }
                }
            }).multiselectfilter();
        },
        preBillAuditorChange: function(selectObj, id) {

            var prebill_auditors = $("#prebill_auditor_dropdown" + id).multiselect("getChecked");
            var selected_auditor_list_prebill = new Array();
            //log(prebill_auditors); /*Use the Log statement when required*/
            for (var i = 0; i < prebill_auditors.length; i++) {
                //log($(prebill_auditors[i]).attr('value')); /*Use the Log statement when required*/
                selected_auditor_list_prebill.push($(prebill_auditors[i]).attr('value'));

            }
          
            if(selected_auditor_list_prebill.length == 0){
                gridPhysician.missingPhysicianChargesGrid.$gridDiv.jqGrid('setCell', id, 'preBillSelectedAuditor', " ");
                var changingNewRowData = gridPhysician.missingPhysicianChargesGrid.$gridDiv.jqGrid('getRowData', id);
                var hcpc = $(changingNewRowData.hcpcCode + " option:selected").val();
                gridPhysician.missingPhysicianChargesGrid.$gridDiv.jqGrid('setCell', id, 'price',globalvars.missingChargesRuleCodesPrice[hcpc]);

            }
            else{
                gridPhysician.missingPhysicianChargesGrid.$gridDiv.jqGrid('setCell', id, 'preBillSelectedAuditor', selected_auditor_list_prebill.join());
                if(globalvars.appModDataPrice[selected_auditor_list_prebill[0]] != undefined)
                    gridPhysician.missingPhysicianChargesGrid.$gridDiv.jqGrid('setCell', id, 'price',globalvars.appModDataPrice[selected_auditor_list_prebill[0]]);

            }


        },
        createModifierDropDown:function(param){
            var ModOptionData="";

            var hospitalIdValue = globalvars.selectedHospitalId;//globalvars.physicianHospitals[globalvars.selectedPreHospitalIndex].hospitalId;

            var searchQueryObject = {
                hcpcType: "equals",
                hcpcValue: param.rowData.hcpcCode,
                hospitalIdValue: hospitalIdValue,
                hospitalIdType: "equals"
            };

            var objectKeyMod = "missingData" + "_" + param.rowData.hcpcCode + "_" +param.rowData.predKey + "_mod";
            var data  = globalvars.missingDropDownData[objectKeyMod];
            if(data){

            }else{

                if(param.rowData.hcpcCode != ""){
                    getJSONModel({
                        async: false,
                        url: globalvars.uriCharges.chargesMasterLookupUri,
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
                        globalvars.appModData[globalvars.missingModifierData[i].modifier] = globalvars.missingModifierData[i].modDesc;
                        globalvars.appModDataPrice[globalvars.missingModifierData[i].modifier] = globalvars.missingModifierData[i].price
                    })

                    globalvars.missingDropDownData[objectKeyMod] = modCollection;
                    data = globalvars.missingDropDownData[objectKeyMod];
                }

                
            }

            if(data){
                $(data).each(function (i) {
                    if(data[i] != "")
                        ModOptionData += "<option value='" + data[i]+ "' title='" + globalvars.appModData[data[i]]+ "'>" + data[i] + "</option>"

                })

                //if(ModOptionData != "")
                    ModOptionData += "<option value='addMore'>Add More...</option>"
            }

            // if(ModOptionData == "")
            //     return "";

            var preBillAuditorDropDown = new String();
            preBillAuditorDropDown = "<div><select class='missingMultiselect' id='prebill_auditor_dropdown" + param.rowId + "' multiple='multiple' onchange='gridPhysician.missingPhysicianChargesGrid.preBillAuditorChange(this," + param.rowId + ")' style=width:60px>";
            preBillAuditorDropDown += ModOptionData;
            preBillAuditorDropDown += "</select></div>";


            return preBillAuditorDropDown;



        },
        diagChangeClick: function(selectObj, id) {

        var prebill_auditors = $("#diag_code_dropdown" + id).multiselect("getChecked");
            var selected_auditor_list_prebill = new Array();
            //log(prebill_auditors); /*Use the Log statement when required*/
            for (var i = 0; i < prebill_auditors.length; i++) {
                //log($(prebill_auditors[i]).attr('value')); /*Use the Log statement when required*/
                selected_auditor_list_prebill.push($(prebill_auditors[i]).attr('value'));

            }

         if(selected_auditor_list_prebill.length == 0)
            gridPhysician.missingPhysicianChargesGrid.$gridDiv.jqGrid('setCell', id, 'accountSelectedDiag', " ");
         else
            gridPhysician.missingPhysicianChargesGrid.$gridDiv.jqGrid('setCell', id, 'accountSelectedDiag', selected_auditor_list_prebill.join());

            var staticNewRowData = gridPhysician.missingPhysicianChargesGrid.$gridDiv.jqGrid('getRowData', id);
            var newDiagData = gridPhysician.missingPhysicianChargesGrid.createPrimaryDiagDropdown({
                                    rowData: staticNewRowData,
                                    rowId: id
                                });
            gridPhysician.missingPhysicianChargesGrid.$gridDiv.jqGrid('setCell', id, 'primaryDiag', newDiagData);
           


        },
        createDiagDropDown:function(param){
            var ModOptionData="";

            // getJSONModel({
            //     async: false,
            //     url: globalvars.uriCharges.uriDiagnoses,
            //     targetVar: "missingDiagData"
            // });
            var objectKey = "missingData" + "_" +param.rowData.predKey + "_diag"
            var newData=[];
            newData = globalvars.missingDropDownData[objectKey];

            //globalvars.missingDiagData = globalvars.diagnoses;
            // if(param.rowData.diag == ""){
            //     globalvars.missingDropDownData[objectKey] = globalvars.missingDiagData;
            //     newData = globalvars.missingDropDownData[objectKey];
            // }else{
            //     var data = globalvars.missingDropDownData[objectKey];
            //     if(data){
            //         var localList = param.rowData.diag.split(',')
            //         if(globalvars.missingDiagData){
            //             newData = data.concat(globalvars.missingDiagData).unique();
            //         }
            //         globalvars.missingDropDownData[objectKey]=newData;
            //     }else{
            //         newData = param.rowData.diag.split(',');
            //         if(globalvars.missingDiagData){
            //             newData = newData.concat(globalvars.missingDiagData).unique();
            //         }
                    
            //         globalvars.missingDropDownData[objectKey]=newData;
            //     }
            // }


            if(newData){
                $(newData).each(function (i) {
                    ModOptionData += "<option value='" +newData[i] + "' title='" +globalvars.appDiagData[newData[i]] + "'>" + newData[i] + "</option>"

                })

                ModOptionData += "<option value='addMore'>Add More...</option>"

            }

           // if(ModOptionData != "")
                    

            // if(ModOptionData == "")
            //     return "";

            var preBillAuditorDropDown = new String();
            preBillAuditorDropDown = "<div><select class='missingDiagMultiselect' id='diag_code_dropdown" + param.rowId + "' multiple='multiple' onchange='gridPhysician.missingPhysicianChargesGrid.diagChangeClick(this," + param.rowId + ")' style=width:60px>";
            preBillAuditorDropDown += ModOptionData;
            preBillAuditorDropDown += "</select></div>";


            return preBillAuditorDropDown;



        },
        addSearableDropDown:function(){

            $('.deptSelect').select2({dropdownAutoWidth: true});
            $('.departmentSelect').select2({dropdownAutoWidth: true});
             $('.select2-dropdown').css('width','200px');
             $('.select2-selection--single').css('height','18px');
             $('.select2-selection--single').css('border-radius','0px');
             $('.select2-selection__rendered').css('line-height','18px');
             $('.select2-selection__arrow').css('height','18px');
             $('.select2-results__option').css('padding','2px');
        },
           
         createDeptDropdown: function(param) {
        

            var searchQueryObject = {ruleId:'88342'};

            var objectKey = "missingData" + "_" + param.rowData.predCode + "_" + param.rowId
            var data  = globalvars.missingDropDownData[objectKey];

            if(data){
                globalvars.missingChargesRuleCodes = data;
            }else{
                getJSONModel({
                    async: false,
                    url: globalvars.uriCharges.uriGetPhyHcpc,
                    data: {ruleId:param.rowData.predCode},
                    targetVar: "missingChargesRuleCodes"
                });
                globalvars.missingDropDownData[objectKey] = globalvars.missingChargesRuleCodes;
                data = globalvars.missingDropDownData[objectKey];
             }

            var listRule=[]
            globalvars.missingChargesRuleCodesPrice={};
            globalvars.missingChargesRuleCodesDesc={};
            if(globalvars.missingChargesRuleCodes){
                $(globalvars.missingChargesRuleCodes).each(function (i) {
                    var ruleObj={};
                    ruleObj.rule = globalvars.missingChargesRuleCodes[i].phyHcpcCode;
                    ruleObj.price = globalvars.missingChargesRuleCodes[i].price;

                    if(globalvars.missingChargesRuleCodes[i].description != null)
                        ruleObj.desc = globalvars.missingChargesRuleCodes[i].phyHcpcCode + ":" + globalvars.missingChargesRuleCodes[i].description;
                    else
                        ruleObj.desc = globalvars.missingChargesRuleCodes[i].phyHcpcCode

                    listRule.push(ruleObj);
                    globalvars.missingChargesRuleCodesPrice[ruleObj.rule] = ruleObj.price;
                    globalvars.missingChargesRuleCodesDesc[ruleObj.rule] = globalvars.missingChargesRuleCodes[i].description;


                })
            }            


            var deptDropdown = createSelectBox({
                index: param.rowId,
                selectDivId: "deptSelect",
                values: listRule,
                currentValue: param.rowData.hcpcCode,
                valueKey: "rule",
                textKey: "desc",
                //secondaryTextKey: "price",
                addEmptyItem: true,
                //checkForUniqueKeys: true
            });

            

            return deptDropdown;
        },
        createDepartmentDropdown: function(param) {
            
            var objectKey = "departmentData"+"_"+globalvars.selectedHospitalId;
            var data  = globalvars.departmentDataDropDownData[objectKey];
           // var data = globalvars.departmentData;

            if(data){

            }else{
                getJSONModel({
                    async: false,
                    url: globalvars.uriCharges.getDeptUri,
                    targetVar: "departmentData"
                });
                data = globalvars.departmentData;
                globalvars.departmentDataDropDownData[objectKey]= globalvars.departmentData;
             }
             var listRuleSource=[];

             if(data){
                if(data.length > 0){
           
                    $(data).each(function (i) {
                        var ruleObj={};
                        ruleObj.sourceVal = data[i].dept;
                        ruleObj.name = data[i].dept + " - " + data[i].deptDesc;
                        listRuleSource.push(ruleObj);
                    })
                }
            }
            


            var posDropdown = createSelectBox({
                index: param.rowId,
                selectDivId: "departmentSelect",
                values: listRuleSource,
                currentValue: param.rowData.deptPhys,
                valueKey: "sourceVal",
                textKey: "name",
                //secondaryTextKey: "price",
                addEmptyItem: true,
                //checkForUniqueKeys: true
            });

            

            return posDropdown;
        },
        createPosDropdown: function(param) {
            
            var data = globalvars.chargesPosData;

            if(data){

            }else{
                getJSONModel({
                    async: false,
                    url: globalvars.root.getPosUri,
                    targetVar: "missingChargesPosData"
                });
                data = globalvars.missingChargesPosData;
                globalvars.chargesPosData= globalvars.missingChargesPosData;
             }

            


            var posDropdown = createSelectBox({
                index: param.rowId,
                selectDivId: "posSelect",
                values: data,
                currentValue: param.rowData.pos,
                valueKey: "pos",
                textKey: "pos",
                //secondaryTextKey: "price",
                addEmptyItem: true,
                //checkForUniqueKeys: true
            });

            

            return posDropdown;
        },
        createPrimaryDiagDropdown: function(param) {
            
            var data = globalvars.chargesPosData;

            var changingNewRowData = gridPhysician.missingPhysicianChargesGrid.$gridDiv.jqGrid('getRowData', param.rowId);
            var selectedDiagCodes = changingNewRowData.accountSelectedDiag;
            var dataNew = selectedDiagCodes.split(',');

            if(dataNew){
                if(dataNew.length > 0){

                var listRuleSource=[];
            
                $(dataNew).each(function (i) {
                    var ruleObj={};
                    ruleObj.sourceVal = dataNew[i];
                    ruleObj.valueVal = dataNew[i];
                    listRuleSource.push(ruleObj);
                })
                
                var pDiagDropdown = createSelectBox({
                    index: param.rowId,
                    selectDivId: "pDiagSelect",
                    values: listRuleSource,
                    currentValue: param.rowData.primaryDiag,
                    valueKey: "sourceVal",
                    textKey: "sourceVal",
                    //secondaryTextKey: "price",
                    addEmptyItem: false,
                    //checkForUniqueKeys: true
                });

                

                return pDiagDropdown;
             }
            }
        },
        createSourceDropdown: function(param) {
        
            var sourceList = [{"key":"21"},{"key":"22"},{"key":"23"}];
            globalvars.missingChargesSourceList={};

            var listRuleSource=[];
            
                $(sourceList).each(function (i) {
                    var ruleObj={};
                    ruleObj.sourceVal = sourceList[i].key;
                    ruleObj.price = sourceList[i].key;
                    listRuleSource.push(ruleObj);
                    globalvars.missingChargesSourceList[ruleObj.sourceVal] = ruleObj.sourceVal;
                })
          

            var sourceDropdown = createSelectBox({
                index: param.rowId,
                selectDivId: "sourceSelect",
                values: listRuleSource,
                currentValue: param.rowData.pos,
                valueKey: "sourceVal",
                textKey: "sourceVal",
                //secondaryTextKey: "price",
                addEmptyItem: true,
                //checkForUniqueKeys: true
            });

            

            return sourceDropdown;
        },

        
        createResponseDropdown: function(param) {

            var response=[];
            var datalength = globalvars.responsesPhys.length;

                if(globalvars.responsesPhys){
                    
                    for (var i = 0; i < datalength;i++) {
                       //if( globalvars.responsesPhys[i].value == "Y" || globalvars.responsesPhys[i].value == "T" || globalvars.responsesPhys[i].value == "O" || globalvars.responsesPhys[i].value == "R1")
                            response.push(globalvars.responsesPhys[i]);
                    }
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
        createPhysicianNpiDropdown: function(param) {

           //var sourceList = [{"key":"1912954413","value":"1912954413 - Dr Asif MD Mohammad"},{"key":"2222222222","value":"2222222222-Dr John Marsh"}];
            //globalvars.physician

            var objectKeyNpi = "missingData" + "_" +param.rowData.predKey + "_npi";
            var listRuleSource=[];
            var newData =[];
            newData = globalvars.missingDropDownData[objectKeyNpi];
            
            if(newData){
                if(newData.length > 0){
           
                    $(newData).each(function (i) {
                        var ruleObj={};
                        ruleObj.sourceVal = newData[i].npi;
                        ruleObj.name = newData[i].npi + " - " + newData[i].name;
                        listRuleSource.push(ruleObj);
                    })
                }
            }

            var obj={"sourceVal":"More","name":"More..."};
            listRuleSource.push(obj);
            

            var npiDropdown = createSelectBox({
                index: param.rowId,
                selectDivId: "physicianNPISelect",
                values: listRuleSource,
                currentValue: param.rowData.npi,
                valueKey: "sourceVal",
                textKey: "name",
                //secondaryTextKey: "price",
                addEmptyItem: true,
                //checkForUniqueKeys: true
            });



            return npiDropdown;
        },
        createPhysicianBillingNpiDropdown: function(param) {

           //var sourceList = [{"key":"1912954413","value":"1912954413 - Dr Asif MD Mohammad"},{"key":"2222222222","value":"2222222222-Dr John Marsh"}];
            //globalvars.physician

            var objectKeyNpi = "missingData" + "_" +param.rowData.predKey + "_billPhys";
            var listRuleSource=[];
            var newData =[];
            newData = globalvars.missingDropDownData[objectKeyNpi];
            
            if(newData){
                if(newData.length > 0){
           
                    $(newData).each(function (i) {
                        var ruleObj={};
                        ruleObj.sourceVal = newData[i].npi;
                        ruleObj.name = newData[i].npi + " - " + newData[i].name;
                        listRuleSource.push(ruleObj);
                    })
                }
            }

            var obj={"sourceVal":"More","name":"More..."};
            listRuleSource.push(obj);
            

            var npiDropdown = createSelectBox({
                index: param.rowId,
                selectDivId: "physicianBillNPISelect",
                values: listRuleSource,
                currentValue: param.rowData.billPhys,
                valueKey: "sourceVal",
                textKey: "name",
                //secondaryTextKey: "price",
                addEmptyItem: true,
                //checkForUniqueKeys: true
            });



            return npiDropdown;
        },
        // createChargeCodeDropdown: function(param) {

        //     var dfd = jQuery.Deferred();

        //     var searchQueryObject = {
        //         hospitalIdValue: (gridPhysician.missingPhysicianChargesGrid.screenName == 'PRE') ? globalvars.physicianHospitals[globalvars.selectedPreHospitalIndex].hospitalId : globalvars.postHospitals[globalvars.selectedPostHospitalIndex].hospitalId,
        //         hospitalIdType: "equals",
        //         hcpcValue: param.rowData.hcpcCode,
        //         hcpcType: "equals",
        //         deptValue: param.rowData.dept,
        //         deptType: "equals"
        //     };
        //     log(searchQueryObject);

        //     $.when(
        //             $.ajax({
        //                 type: 'GET',
        //                 url: globalvars.charges.chargesLookupUri,
        //                 data: searchQueryObject,
        //                 dataType: 'json'
        //             })
                    
        //     ).done(function(data){
        //         globalvars["missingChargesChargeCodes"] = data;
        //         var chargeCodeDropdown = createSelectBox({
        //             index: param.rowId,
        //             selectDivId: "chargeCodeSelect",
        //             values: globalvars.missingChargesChargeCodes,
        //             currentValue: param.rowData.chargeCode,
        //             valueKey: "chargeCode",
        //             textKey: "chargeCode",
        //             secondaryTextKey: "chargeDesc",
        //             addEmptyItem: true,
        //             checkForUniqueKeys: true
        //         });
                
        //         param.newRowSelectedData.chargeCode = chargeCodeDropdown;

        //     });

        //     return dfd.promise();

        // },
        createChargePrice: function(param) {
            var price = "";
            var hospitalIdValue = (gridPhysician.missingPhysicianChargesGrid.screenName == 'PRE') ? globalvars.selectedHospitalId : globalvars.selectedHospitalId;
            
            $.ajax({
                type: 'GET',
                url: globalvars.charges.chargesLookupPriceUri + "?hospitalIdValue=" + hospitalIdValue + "&deptValue=" + param.rowData.dept + "&chargeValue=" + param.rowData.chargeCode + "&hcpcValue=" + param.rowData.hcpcCode,
                contentType: 'application/json',
                error: function(jqxhr) {
                },
                success: function(str) {
                    price = str;
                }
            });
            return price;
        },
         bindPhysicianNPICodeChange: function(param) {

             $("#physicianNPISelect" + param.id).change(function() {
                if($(this).val() == "More"){
                        dialogs.otherPhysicianMissingNPIDialog.reset();
                        globalvars.npiGridName = "missing";
                        // gridPhysician.loadMissingPhyNPICodePopupGrid({
                        //     gridDiv: "#account_details_missing_npi_physician_grid_search_form_table"
                        // });

                        dialogs.otherPhysicianMissingNPIDialog.initialize({
                            $searchFormDialogDiv: $("#missing_npi_grid_physician_search_form_dialog"),
                            $searchFormDialogDivSubmit: $("#missing_npi_grid_physician_search_form_submit"),
                            $searchFormDialogDivReset: $("#missing_npi_grid_physician_search_form_reset"),
                            $searchFormDialogDivCancel: $("#missing_npi_grid_physician_search_form_cancel")
                        });
                        $(this).val(globalvars.selectedNPI);
                        dialogs.otherPhysicianMissingNPIDialog.open()   
                }else{
                    globalvars.selectedNPI = $(this).val();
                }

             })
        },

        bindBillingPhysicianNPICodeChange: function(param) {

             $("#physicianBillNPISelect" + param.id).change(function() {
                if($(this).val() == "More"){
                        dialogs.otherBillingPhysicianMissingNPIDialog.reset();
                        globalvars.npiGridName = "missing";
                        // gridPhysician.loadMissingPhyNPICodePopupGrid({
                        //     gridDiv: "#account_details_missing_npi_physician_grid_search_form_table"
                        // });

                        dialogs.otherBillingPhysicianMissingNPIDialog.initialize({
                            $searchFormDialogDiv: $("#missing_bill_npi_grid_physician_search_form_dialog"),
                            $searchFormDialogDivSubmit: $("#missing_bill_npi_grid_physician_search_form_submit"),
                            $searchFormDialogDivReset: $("#missing_bill_npi_grid_physician_search_form_reset"),
                            $searchFormDialogDivCancel: $("#missing_bill_npi_grid_physician_search_form_cancel")
                        });
                        $(this).val(globalvars.selectedNPI);
                        dialogs.otherBillingPhysicianMissingNPIDialog.open()   
                }else{
                    globalvars.selectedNPI = $(this).val();
                }

             })
        },
        
        bindHcpcCodeChange: function(param) {
            //console.log(globalvars.missingChargesRuleCodesPrice);
            $("#deptSelect" + param.id).change(function() {
                gridPhysician.missingPhysicianChargesGrid.$gridDiv.jqGrid('saveRow', param.id);

                if (gridPhysician.missingPhysicianChargesGrid.savedSuccessfully) {
            
                    var changingRowData = gridPhysician.missingPhysicianChargesGrid.$gridDiv.jqGrid('getRowData', param.id);
                    var changingNewRowData = gridPhysician.missingPhysicianChargesGrid.$gridDiv.jqGrid('getRowData', param.id);
              
                    changingNewRowData.response = gridPhysician.missingPhysicianChargesGrid.createResponseDropdown({
                                rowData: changingRowData,
                                rowId: param.id
                            });
                    changingNewRowData.npi = gridPhysician.missingPhysicianChargesGrid.createPhysicianNpiDropdown({
                                rowData: changingRowData,
                                rowId: param.id
                            });

                    changingNewRowData.billPhys = gridPhysician.missingPhysicianChargesGrid.createPhysicianBillingNpiDropdown({
                                rowData: changingRowData,
                                rowId: param.id
                            });

                    changingNewRowData.pos = gridPhysician.missingPhysicianChargesGrid.createPosDropdown({
                                    rowData: changingRowData,
                                    rowId: param.id
                                });

                    changingNewRowData.deptPhys = gridPhysician.missingPhysicianChargesGrid.createDepartmentDropdown({
                                    rowData: changingRowData,
                                    rowId: param.id
                                });


                     changingNewRowData.hcpcCode = gridPhysician.missingPhysicianChargesGrid.createDeptDropdown({
                                    rowData: changingRowData,
                                    rowId: param.id
                                });

                     changingNewRowData.diag = gridPhysician.missingPhysicianChargesGrid.createDiagDropDown({
                                    rowData: changingRowData,
                                    rowId: param.id
                                });

                      changingNewRowData.modifier = gridPhysician.missingPhysicianChargesGrid.createModifierDropDown({
                                    rowData: changingRowData,
                                    rowId: param.id
                                });

                      changingNewRowData.primaryDiag = gridPhysician.missingPhysicianChargesGrid.createPrimaryDiagDropdown({
                                    rowData: changingRowData,
                                    rowId: param.id
                                });

                      changingNewRowData.preBillSelectedAuditor="";

                      var hcpc = $(changingNewRowData.hcpcCode + " option:selected").val();

                      changingNewRowData.price = globalvars.missingChargesRuleCodesPrice[hcpc];
                      changingNewRowData.chargeDesc = globalvars.missingChargesRuleCodesDesc[hcpc];

                      
                      gridPhysician.missingPhysicianChargesGrid.$gridDiv.jqGrid('setRowData', param.id, changingNewRowData);
                      gridPhysician.missingPhysicianChargesGrid.$gridDiv.jqGrid('editRow',param.id,true);
                      $('#' + param.id + '_' + 'dateOfService').datepicker({dateFormat: 'yy-mm-dd',defaultDate:screens.physicianAccountDetailsForm.admitDate});//,minDate:screens.accountDetails.admitDate,maxDate:screens.accountDetails.dischargeDate});
                      gridPhysician.missingPhysicianChargesGrid.bindHcpcCodeChange({id: param.id});

                      gridPhysician.missingPhysicianChargesGrid.addMultiSelectModifier({id: param.id})
                      gridPhysician.missingPhysicianChargesGrid.addMultiSelectDiagCode({id: param.id})
                      gridPhysician.missingPhysicianChargesGrid.addSearableDropDown();
                      gridPhysician.missingPhysicianChargesGrid.bindPhysicianNPICodeChange({id: param.id});
                      gridPhysician.missingPhysicianChargesGrid.bindBillingPhysicianNPICodeChange({id: param.id});
                      gridPhysician.missingPhysicianChargesGrid.savedSuccessfully = false;

                            

                      $('.ui-multiselect-filter input').css('width', 'auto');
                      $('.ui-multiselect-menu').css('width', 'auto');
                      $('.ui-multiselect').css('background','#fff')
                      $('.ui-multiselect-hasfilter ul').css('display','none')
                      $('#account_details_missing_charges_grid_table .ui-state-highlight .ui-icon').css('background-image',' ');

                }

             });

        }
    },
    otherPhysicianChargesGrid: {
        $gridDiv: {},
        selectedRow: undefined,
        savedSuccessfully: true,
        isEditable: true,
        billType: "",
        backScreen:"",
        isConfirm:"",
        initialize: function(param) {
            this.$gridDiv = $(param.gridDiv);
            this.isEditable = param.isEditable === false ? false : true;
            this.isConfirm = param.isConfirm;
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
                height: '200',
                gridview: true,
                viewrecords: true,
                altRows: true,
                altclass: 'alternate_row_color',
                colNames: ['id', globalvars.localResourceMap.other_discoved_charge_search, 
                    (globalvars.client == "MSH")?'Clinic':'Dept',
                    'Procedure Code',
                    globalvars.localResourceMap.other_discoved_charge_price,
                    'Modifier',
                    globalvars.localResourceMap.other_discoved_charge_add_qty, 
                    globalvars.localResourceMap.other_charge_date_of_service,
                    'pos',
                    'Serving Phys',
                    'Billing Phys',
                    'Diag Codes',
                    'Primary Diag',
                    'Claim #',
                    // 'Source',
                    // 'cost center',
                    globalvars.localResourceMap.other_discoved_charge_comment,
                    globalvars.localResourceMap.other_discoved_charge_chargeDescription,
                    'predNbr','','','','','','','',''],
                colModel: [
                    {name: 'id', index: 'id', key: true, hidden: true},
                    
                    {name: 'search', index: 'search', width: 80, fixed: true,sortable: false},
                    {name: 'deptPhys', index: 'deptPhys', fixed: true, width: 70},
                    {
                        name: 'hcpcCode', index: 'hcpcCode', editable: false, width: 90, fixed: true, sortable: false, align: "center", sorttype: "string", key: true,
                        editoptions: {
                            size: "5",
                            maxlength: "5"
                        }
                    },
                    {name: 'price', index: 'price', width: 60, fixed: true, sortable: false, sorttype: "int", align: "center",formatter:'currency',
                     formatoptions: { decimalSeparator: ".", thousandsSeparator: ",", prefix: "$",decimalPlaces: 1, defaultValue: '0.0' }},
                    
                    {name: 'modifier', index: 'modifier', fixed: true, width: 80, classes: 'grid_cell_style'},

                    {
                        name: 'quantity', index: 'quantity', editable: this.isEditable, sortable: false, width: 50, fixed: true, align: "center", sorttype: "int",
                        edittype: "text",
                        editoptions: {
                            size: "3",
                            maxlength: "3"
                        },
                        editrules: {
                            custom: true,
                            custom_func: function(value, colname) {
                                if (!(/^[0-9]*[1-9][0-9]*$/.test(value)) || isNaN(value)) {
                                //if (!(/^\d+$/.test(value)) || isNaN(value)) {
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
                    {name: 'dateOfService1', index: 'dateOfService1', width: 80, fixed: true, sortable: false, sorttype: "date", datefmt: "Y-m-d h:i:s", editable: this.isEditable, align: "center",
                        editoptions:{
                                            readonly: 'readonly'
                                 }},
                    {name: 'pos', index: 'pos', fixed: true, width: 60,align: "center"},
                    {name: 'npi', index: 'npi', fixed: true, width:80,align: "center"},
                    {name: 'billPhys', index: 'billPhys', fixed: true, width:70},
                    {name: 'diag', index: 'diag', fixed: true, width: 80,align: "center"},
                    {name: 'primaryDiag', index: 'primaryDiag', fixed: true, width: 80,align: "center"},


                    {name: 'claimNumber', index: 'claimNumber', width:60, editable: this.isEditable,fixed: true, sortable: false, sorttype: "int", align: "center",editoptions: {maxlength: "50"}},            
                    // {name: 'source', index: 'source', fixed: true, width: 120,align: "center"},
                    // {name: 'costCenter', index: 'costCenter', fixed: true, width: 100,align: "center"},

                    {name: 'comments', index: 'comments', editable: this.isEditable, width: 120, fixed: true,  sortable: false, editoptions: {
                            size: "10",
                            maxlength: "500",
                        },
                        classes: 'grid_cell_style'},
                    {name: 'chargeDescription', index: 'chargeDescription', hidden: true},
                    {name: 'predNbr', index: 'predNbr', hidden: true},
                    {name: 'method', index: 'method', hidden: true},
                     {name: 'predKey', index: 'predKey',hidden:true},
                    {name: 'rowEditable', index: 'rowEditable',hidden:true},
                    {name: 'cenAuditorId', index: 'cenAuditorId',hidden:true},
                    {name: 'cenAuditingTime', index: 'cenAuditingTime',hidden:true},
                    {name: 'preBillSelectedAuditorOther', index: 'preBillSelectedAuditorOther', hidden: true, search: true},
                    {name: 'accountSelectedDiagOther', index: 'accountSelectedDiagOther', hidden: true, search: true},
                    {name: 'rowId', index: 'rowId',hidden: true},

                ],
                onSelectRow: function(id) {

                    var rowData = gridPhysician.otherPhysicianChargesGrid.$gridDiv.jqGrid('getRowData', id);

                    if(rowData.rowEditable == false || rowData.rowEditable == "false"){
                        return;
                    }

                    if (globalvars.saveRowIdPhy != id) {

                        gridPhysician.otherPhysicianChargesGrid.$gridDiv.jqGrid('saveRow', globalvars.saveRowIdPhy);
                        globalvars.saveRowIdPhy = id;
                    }

                   
                                                      //  console.log(rowData);

                    if (gridPhysician.otherPhysicianChargesGrid.savedSuccessfully == true && gridPhysician.otherPhysicianChargesGrid.isEditable == true){
                    gridPhysician.otherPhysicianChargesGrid.selectedRow = id;

                    var selectedRowData = gridPhysician.otherPhysicianChargesGrid.$gridDiv.jqGrid('getRowData', id);
                    
                    if(selectedRowData.hcpcCode != ""){
                        gridPhysician.otherPhysicianChargesGrid.setDefaultData({rowData: selectedRowData,
                                rowId: id});
                    }

                    var newRowData = gridPhysician.otherPhysicianChargesGrid.$gridDiv.jqGrid('getRowData', id);

                    // newRowData.source = gridPhysician.otherPhysicianChargesGrid.createSourceDropdownOther({
                    //                 rowData: selectedRowData,
                    //                 rowId: id
                    //     });

                    // newRowData.costCenter = gridPhysician.otherPhysicianChargesGrid.createCostCenterDropdownOther({
                    //                 rowData: selectedRowData,
                    //                 rowId: id
                    //     });

                    if(selectedRowData.hcpcCode != ""){
                     newRowData.npi = gridPhysician.otherPhysicianChargesGrid.createPhysicianNpiDropdown({
                                rowData: selectedRowData,
                                rowId: id
                            });

                     newRowData.billPhys = gridPhysician.otherPhysicianChargesGrid.createPhysicianBillingNpiDropdown({
                                rowData: selectedRowData,
                                rowId: id
                            });
                    }

                     if(selectedRowData.hcpcCode != ""){
                        newRowData.modifier = gridPhysician.otherPhysicianChargesGrid.createModifierDropDown({
                                    rowData: selectedRowData,
                                    rowId: id
                                });
                        }



                    newRowData.pos = gridPhysician.otherPhysicianChargesGrid.createPosDropdown({
                                    rowData: selectedRowData,
                                    rowId: id
                                });

                    newRowData.primaryDiag = gridPhysician.otherPhysicianChargesGrid.createPrimaryDiagDropdown({
                                    rowData: selectedRowData,
                                    rowId: id
                                });

                    newRowData.deptPhys = gridPhysician.otherPhysicianChargesGrid.createDepartmentDropdown({
                                    rowData: selectedRowData,
                                    rowId: id
                                });

                    if(selectedRowData.hcpcCode != ""){
                    newRowData.diag = gridPhysician.otherPhysicianChargesGrid.createDiagDropDown({
                                    rowData: selectedRowData,
                                    rowId: id
                                });
                    }




                    gridPhysician.otherPhysicianChargesGrid.$gridDiv.jqGrid('setRowData', id, newRowData);

                    
                    gridPhysician.otherPhysicianChargesGrid.addMultiSelectDiagCode({id:id})
                    gridPhysician.otherPhysicianChargesGrid.addMultiSelectModifier({id:id})



                    if (gridPhysician.otherPhysicianChargesGrid.savedSuccessfully == true && gridPhysician.otherPhysicianChargesGrid.isEditable == true) {
                        gridPhysician.otherPhysicianChargesGrid.selectedRow = id;
                        gridPhysician.otherPhysicianChargesGrid.$gridDiv.jqGrid('editRow', id, true,false, false, false, false, false,false, false,afterrestorefunc);


                    $('#' + id + '_' + 'dateOfService1').datepicker({dateFormat: 'yy-mm-dd',defaultDate:screens.physicianAccountDetailsForm.admitDate});
                        
                    //gridPhysician.otherPhysicianChargesGrid.bindDeptCodeChange({id: id});
                    gridPhysician.otherPhysicianChargesGrid.bindPhysicianNPICodeChange({id: id});
                    gridPhysician.otherPhysicianChargesGrid.bindBillingPhysicianNPICodeChange({id: id});


                    }
                     $('.departmentSelectOther').select2({dropdownAutoWidth: true});
                    $('.select2-dropdown').css('width','200px');
                    $('.select2-selection--single').css('height','18px');
                    $('.select2-selection--single').css('border-radius','0px');
                    $('.select2-selection__rendered').css('line-height','18px');
                    $('.select2-selection__arrow').css('height','18px');
                    $('.select2-results__option').css('padding','2px');
                    $('.ui-multiselect-filter input').css('width', 'auto');
                    $('.ui-multiselect-menu').css('width', 'auto');
                    $('.ui-multiselect').css('background','#fff');
                     $('.ui-multiselect-hasfilter ul').css('display','none')

                    gridPhysician.otherPhysicianChargesGrid.savedSuccessfully = false;
                 }

                    function afterrestorefunc(e){
                       // gridPhysician.otherPhysicianChargesGrid.savedSuccessfully = true;
                    gridPhysician.otherPhysicianChargesGrid.$gridDiv.trigger('jqGridInlineAfterSaveRow');

                    }


                },
                onCellSelect: function (iRow, iCol, content, event) {
                     var cmName = gridPhysician.otherPhysicianChargesGrid.$gridDiv.jqGrid("getGridParam", "colModel")[iCol].name,
                     target = event.target;
                     if(target.className == "search_cell_search"){
                        dialogs.otherPhysicianChargesSearchFormDialog.reset();
                        // gridPhysician.loadOtherPhyChargesSearchFormGrid({
                        //     gridDiv: "#account_details_other_charges_physician_grid_search_form_table"
                        // });

                        dialogs.otherPhysicianChargesSearchFormDialog.initialize({
                            $searchFormDialogDiv: $("#other_charges_grid_physician_search_form_dialog"),
                            $searchFormDialogDivSubmit: $("#other_charges_grid_physician_search_form_submit"),
                            $searchFormDialogDivReset: $("#other_charges_grid_physician_search_form_reset"),
                            $searchFormDialogDivCancel: $("#other_charges_grid_physician_search_form_cancel"),
                            billType:gridPhysician.otherPhysicianChargesGrid.billType,
                            screenName:"other"
                        });
                        dialogs.otherPhysicianChargesSearchFormDialog.open();
                    }
                    else if(target.className == "search_cell_del"){
                        myDelOptions = {

                    onclickSubmit: function(options, rowid) {
                        var grid_id = $.jgrid.jqID(gridPhysician.otherPhysicianChargesGrid.$gridDiv[0].id),
                            grid_p = gridPhysician.otherPhysicianChargesGrid.$gridDiv[0].p,
                            newPage = grid_p.page;

                        options.processing = true;
                        gridPhysician.otherPhysicianChargesGrid.$gridDiv.delRowData(rowid);
                        $.jgrid.hideModal("#delmod"+grid_id,
                                          {gb:"#gbox_"+grid_id,
                                          jqm:options.jqModal,onClose:options.onClose});

                        if (grid_p.lastpage > 1) {
                            if (grid_p.reccount === 0 && newPage === grid_p.lastpage) {
                                newPage--;
                            }
                            gridPhysician.otherPhysicianChargesGrid.$gridDiv.trigger("reloadGrid", [{page:newPage}]);
                        }
                        gridPhysician.otherPhysicianChargesGrid.savedSuccessfully = true;


                        return true;
                    },
                    processing:true
                };

                // if (gridPhysician.otherPhysicianChargesGrid.selectedRow !== undefined) {
                    log("submitting + saving row " + gridPhysician.otherPhysicianChargesGrid.selectedRow);
                    //var rowid = gridPhysician.otherPhysicianChargesGrid.$gridDiv.jqGrid('getGridParam', 'selrow');
                    gridPhysician.otherPhysicianChargesGrid.$gridDiv.jqGrid('delGridRow',iRow,myDelOptions);
                    gridPhysician.otherPhysicianChargesGrid.savedSuccessfully = true;

                    // };

                   // return false;
                }
            },
                editurl: 'clientArray',
                loadComplete: function() {
                     
                      $(("#account_details_other_charges_grid_table tr")).removeClass('highlighted_row');
                     
                      var gridRowData = gridPhysician.otherPhysicianChargesGrid.$gridDiv.jqGrid('getRowData');
                      var gridRowDataLength = gridRowData.length;

                     // console.log(gridRowData);

                      var tableGridID = "#account_details_other_charges_grid_table";
                     if(gridPhysician.otherPhysicianChargesGrid.isConfirm == true){
                         tableGridID = "#account_details_Physician_other_charges_grid_table";
                     }

                     
                      for (var i = 0; i < gridRowDataLength; i++) {
                          if((gridRowData[i].rowEditable == "false" || gridRowData[i].rowEditable == false) && (globalvars.user.uType == globalvars.roles.physicianUser)) {
                              log("isHighlighted " + gridRowData[i].isNew + " : " + (i + 1));
                              var searchId = gridRowData[i].id;
                                    //$(("#account_details_other_charges_grid_table tr#" + (searchId))).addClass("highlighted_row");
                                    $(tableGridID).find("tr#" + (searchId)).addClass("highlighted_row");
                          }
                      }

                            $(tableGridID).find('tr').find('td:eq(19)').each(function(){
                      
                            console.log($(this).text());


                            if($(this).text() == "false" || $(this).text() == false){

                                $(this).parent().find('td').tooltip({
                                content: function(response) {
                                    if($(this).index() != 9){
                                        if(this.parentNode){
                                            var rowData = gridPhysician.otherPhysicianChargesGrid.$gridDiv.jqGrid('getRowData',this.parentNode.id);
                                            return '<b>Assigned to: </b>' + rowData.cenAuditorId+"<br/><b>Submitted on: </b>" + rowData.cenAuditingTime;
                                        }
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
                        ///////////// temp close
                   })

                  // gridPhysician.otherPhysicianChargesGrid.$gridDiv.jqGrid('setLabel', 'comments', '', {'text-align': 'left', 'padding-left': '40px', 'width': '236px'});

                }

            });

            this.$gridDiv.bind("jqGridInlineAfterSaveRow", function(rowid) {
                log("jqGridInlineAfterSaveRow");
                var selectedRowData = gridPhysician.otherPhysicianChargesGrid.$gridDiv.jqGrid('getRowData', gridPhysician.otherPhysicianChargesGrid.selectedRow);
                //gridPhysician.otherPhysicianChargesGrid.$gridDiv.jqGrid('setCell', rowid, 'source', globalvars.otherDiscoveredSourceList[$(this).val()]);

                if($("#sourceSelectOther" + gridPhysician.otherPhysicianChargesGrid.selectedRow + " option:selected").val() == undefined)
                    selectedRowData.source="";
                else
                    selectedRowData.source = $("#sourceSelectOther" + gridPhysician.otherPhysicianChargesGrid.selectedRow + " option:selected").val();
               
                //  if($("#costcenterSelectOther" + gridPhysician.otherPhysicianChargesGrid.selectedRow + " option:selected").val() == undefined)
                //     selectedRowData.costCenter="";
                // else
                //     selectedRowData.costCenter = $("#costcenterSelectOther" + gridPhysician.otherPhysicianChargesGrid.selectedRow + " option:selected").val();


                if($("#posSelectOther" + gridPhysician.otherPhysicianChargesGrid.selectedRow + " option:selected").val() == undefined)
                    selectedRowData.pos="";
                else
                    selectedRowData.pos = $("#posSelectOther" + gridPhysician.otherPhysicianChargesGrid.selectedRow + " option:selected").val();



                if($("#pOtherDiagSelect" + gridPhysician.otherPhysicianChargesGrid.selectedRow + " option:selected").val() == undefined)
                    selectedRowData.primaryDiag="";
                else
                    selectedRowData.primaryDiag = $("#pOtherDiagSelect" + gridPhysician.otherPhysicianChargesGrid.selectedRow + " option:selected").val();



                if($("#physicianBillNPISelectOther" + gridPhysician.otherPhysicianChargesGrid.selectedRow + " option:selected").val() == undefined){
                    selectedRowData.billPhys="";
                }
                else{
                    selectedRowData.billPhys = $("#physicianBillNPISelectOther" + gridPhysician.otherPhysicianChargesGrid.selectedRow + " option:selected").val();
                }


                if($("#departmentSelectOther" + gridPhysician.otherPhysicianChargesGrid.selectedRow + " option:selected").val() == undefined){
                    selectedRowData.deptPhys="";
                }
                else{
                    selectedRowData.deptPhys = $("#departmentSelectOther" + gridPhysician.otherPhysicianChargesGrid.selectedRow + " option:selected").val();
                }


               // $('#' + rowid + '_' + 'dateOfService1').datepicker({dateFormat: 'yy-mm-dd',defaultDate:screens.accountDetails.admitDate,minDate:screens.accountDetails.admitDate,maxDate:screens.accountDetails.dischargeDate});
                
                if($("#physicianNPISelectOther" + gridPhysician.otherPhysicianChargesGrid.selectedRow + " option:selected").val() == undefined){
                    selectedRowData.npi="";
                }
                else{
                    selectedRowData.npi = $("#physicianNPISelectOther" + gridPhysician.otherPhysicianChargesGrid.selectedRow + " option:selected").val();
                }

                selectedRowData.modifier =  selectedRowData.preBillSelectedAuditorOther;
                selectedRowData.diag =  selectedRowData.accountSelectedDiagOther;


                gridPhysician.otherPhysicianChargesGrid.$gridDiv.jqGrid('setRowData', gridPhysician.otherPhysicianChargesGrid.selectedRow, selectedRowData);
                gridPhysician.otherPhysicianChargesGrid.savedSuccessfully = true;
            });

            this.$gridDiv.bind("jqgridPhysicianortCol", function(rowid) {
                log("jqgridPhysicianortCol");
            });
        },
        fillGrid: function(data) {
            var searchDiv = '<div class="other_discover_search_wrapper"><img class="search_cell_del" src="common/images/account-details/delete-icon.png"><img class="search_cell_search" src="common/images/account-details/search-icon.png"></div>';
            this.$gridDiv.clearGridData();
            var datalength = data.length;
            for (var i = 0; i < datalength; i++) {
                data[i].id = i;
                data[i].preBillSelectedAuditorOther = data[i].modifier;
                data[i].accountSelectedDiagOther = data[i].diag;
                this.$gridDiv.jqGrid('addRowData', i + 1, data[i]);
                if(data[i].rowEditable)
                    this.$gridDiv.jqGrid('setCell', i + 1, 'search', searchDiv, '');
            }
            ;
            this.$gridDiv.setGridParam({rowNum: datalength}).trigger("reloadGrid");
        },
        setDefaultData:function(param){

            if(param.rowData.hcpcCode == "")
                return false;


            var objectKey = "otherData" + "_" +param.rowData.hcpcCode + "_" + param.rowId
            var data  = globalvars.otherDropDownData[objectKey];
            if(data){

            }else{
                getJSONModel({
                    async: false,
                    url: globalvars.uriCharges.getPhysModifierDaigUri,
                    type: 'GET',
                    data: {'hcpcCode':param.rowData.hcpcCode,'rowId':param.rowData.rowId,'predKey':param.rowData.predKey},
                    traditional: true,
                    dataType: 'json',
                    targetVar: "dataPredKeyList"

                });
                var objectKeyDiag = "otherData" + "_" +param.rowData.hcpcCode + "_" + param.rowId + "_diag";
                var objectKeyNpi = "otherData" + "_" +param.rowData.hcpcCode + "_" + param.rowId + "_npi";
                var objectKeyNpiBill = "otherData" + "_" +param.rowData.hcpcCode + "_" + param.rowId + "_billPhys";
                var objectKeyMod = "otherData" + "_" + param.rowData.hcpcCode + "_" + param.rowId + "_mod";

                var diagList=[];
                var npiList=[];
                var billNpiList=[];
                var modList=[];
                
                //billingPhysicianList

                $(globalvars.dataPredKeyList.diagCodeList).each(function (i) {
                    diagList.push(globalvars.dataPredKeyList.diagCodeList[i].diagCode)
                    globalvars.appDiagData[globalvars.dataPredKeyList.diagCodeList[i].diagCode] = globalvars.dataPredKeyList.diagCodeList[i].description;


                })
                $(globalvars.dataPredKeyList.physicianList).each(function (i) {
                     var obj={};
                    obj.name = globalvars.dataPredKeyList.physicianList[i].name;
                    obj.npi = globalvars.dataPredKeyList.physicianList[i].npi;
                    npiList.push(obj);

                })

                $(globalvars.dataPredKeyList.billingPhysicianList).each(function (i) {
                     var obj={};
                    obj.name = globalvars.dataPredKeyList.billingPhysicianList[i].name;
                    obj.npi = globalvars.dataPredKeyList.billingPhysicianList[i].npi;
                    billNpiList.push(obj);

                })

                $(globalvars.dataPredKeyList.listModifier).each(function (i) {
                    modList.push(globalvars.dataPredKeyList.listModifier[i].modifier);
                    globalvars.appModData[globalvars.dataPredKeyList.listModifier[i].modifier] = globalvars.dataPredKeyList.listModifier[i].description;
                    //globalvars.appModDataPrice[globalvars.dataPredKeyList.listModifier[i].modifier] = globalvars.dataPredKeyList.listModifier[i].price;


                })



                globalvars.otherDropDownData[objectKey] = globalvars.dataPredKeyList;
                globalvars.otherDropDownData[objectKeyNpi] = npiList;
                globalvars.otherDropDownData[objectKeyNpiBill] = billNpiList;
                globalvars.otherDropDownData[objectKeyDiag] =diagList; 
                globalvars.otherDropDownData[objectKeyMod] =modList; 
            }


        },
       // createPosDropdown: function(param) {
        
            // var sourceList = [{"key":"21"},{"key":"22"},{"key":"23"}];

            // var listRuleSource=[];
            
            //     $(sourceList).each(function (i) {
            //         var ruleObj={};
            //         ruleObj.sourceVal = sourceList[i].key;
            //         ruleObj.price = sourceList[i].key;
            //         listRuleSource.push(ruleObj);
            //     })
          

            // var sourceDropdown = createSelectBox({
            //     index: param.rowId,
            //     selectDivId: "sourceSelectOthers",
            //     values: listRuleSource,
            //     currentValue: param.rowData.pos,
            //     valueKey: "sourceVal",
            //     textKey: "sourceVal",
            //     //secondaryTextKey: "price",
            //     addEmptyItem: true,
            //     //checkForUniqueKeys: true
            // });

            

            // return sourceDropdown;
        //},

        addMultiSelectDiagCode:function(param){
            var preBillSelectedAuditortext = gridPhysician.otherPhysicianChargesGrid.$gridDiv.jqGrid('getCell', param.id, 'accountSelectedDiagOther');
            var preBillRetainAuditorList;
            if(preBillSelectedAuditortext)
                 preBillRetainAuditorList = preBillSelectedAuditortext.split(",");

            $("#diag_code_dropdown_other" + param.id).val(preBillRetainAuditorList);
            $("#diag_code_dropdown_other" + param.id).multiselect({
                multiple: true,
                minWidth: 70,
                selectedList: 40,
                checkAllText: '',
                uncheckAllText: '',
                click: function( event, ui ) {
                    // console.log('click');
                    if(ui.value === 'addMore'){
                        dialogs.otherPhysicianMissingDiagDialog.reset();
                        // gridPhysician.loadMissingPhyDiagCodePopupGrid({
                        //     gridDiv: "#account_details_missing_diag_physician_grid_search_form_table"
                        // });

                        dialogs.otherPhysicianMissingDiagDialog.initialize({
                            $searchFormDialogDiv: $("#missing_diag_grid_physician_search_form_dialog"),
                            $searchFormDialogDivSubmit: $("#missing_diag_grid_physician_search_form_submit"),
                            $searchFormDialogDivReset: $("#missing_diag_grid_physician_search_form_reset"),
                            $searchFormDialogDivCancel: $("#missing_diag_grid_physician_search_form_cancel"),
                            $searchFormDialogDivAddCodes: $("#missing_diag_grid_physician_search_form_add_Codes"),
                            screenName:"other"
                        });
                        dialogs.otherPhysicianMissingDiagDialog.open();
                        $("#diag_code_dropdown_other" + param.id).multiselect('close');
                        return false;


                    }

                }
            }).multiselectfilter();
        },

        diagChangeClick: function(selectObj, id) {

            var prebill_auditors = $("#diag_code_dropdown_other" + id).multiselect("getChecked");
            var selected_auditor_list_prebill = new Array();
            //log(prebill_auditors); /*Use the Log statement when required*/
            for (var i = 0; i < prebill_auditors.length; i++) {
                //log($(prebill_auditors[i]).attr('value')); /*Use the Log statement when required*/
                selected_auditor_list_prebill.push($(prebill_auditors[i]).attr('value'));

            }
           //gridPhysician.otherPhysicianChargesGrid.$gridDiv.jqGrid('setCell', id, 'accountSelectedDiagOther', selected_auditor_list_prebill.join());


           if(selected_auditor_list_prebill.length == 0)
                gridPhysician.otherPhysicianChargesGrid.$gridDiv.jqGrid('setCell', id, 'accountSelectedDiagOther', " ");
            else
                gridPhysician.otherPhysicianChargesGrid.$gridDiv.jqGrid('setCell', id, 'accountSelectedDiagOther', selected_auditor_list_prebill.join());


            var staticNewRowData = gridPhysician.otherPhysicianChargesGrid.$gridDiv.jqGrid('getRowData', id);
            var newDiagData = gridPhysician.otherPhysicianChargesGrid.createPrimaryDiagDropdown({
                                    rowData: staticNewRowData,
                                    rowId: id
                                });
            gridPhysician.otherPhysicianChargesGrid.$gridDiv.jqGrid('setCell', id, 'primaryDiag', newDiagData);

        },

        createDiagDropDown:function(param){

            var ModOptionData="";
            var objectKey = "otherData" + "_" +param.rowData.hcpcCode + "_" + param.rowId + "_diag";
            
            var newData=[];
            newData = globalvars.otherDropDownData[objectKey];

                if(newData){
                    $(newData).each(function (i) {
                        ModOptionData += "<option value='" +newData[i] + "' title='" +globalvars.appDiagData[newData[i]] + "'>" + newData[i] + "</option>"

                })
                }

                ModOptionData += "<option value='addMore'>Add More...</option>"

            

           
            var preBillAuditorDropDown = new String();
            preBillAuditorDropDown = "<div><select class='otherDiagMultiselect' id='diag_code_dropdown_other" + param.rowId + "' multiple='multiple' onchange='gridPhysician.otherPhysicianChargesGrid.diagChangeClick(this," + param.rowId + ")' style=width:60px>";
            preBillAuditorDropDown += ModOptionData;
            preBillAuditorDropDown += "</select></div>";


            return preBillAuditorDropDown;



        },
        createPrimaryDiagDropdown: function(param) {
            
            var data = globalvars.chargesPosData;

            var changingNewRowData = gridPhysician.otherPhysicianChargesGrid.$gridDiv.jqGrid('getRowData', param.rowId);
            var selectedDiagCodes = changingNewRowData.accountSelectedDiagOther;
            
            if(selectedDiagCodes == undefined){
                return;
            }

            var dataNew = selectedDiagCodes.split(',');

            if(dataNew){
                if(dataNew.length > 0){

                var listRuleSource=[];
            
                $(dataNew).each(function (i) {
                    var ruleObj={};
                    ruleObj.sourceVal = dataNew[i];
                    ruleObj.valueVal = dataNew[i];
                    listRuleSource.push(ruleObj);
                })
                
                var pDiagDropdown = createSelectBox({
                    index: param.rowId,
                    selectDivId: "pOtherDiagSelect",
                    values: listRuleSource,
                    currentValue: param.rowData.primaryDiag,
                    valueKey: "sourceVal",
                    textKey: "sourceVal",
                    //secondaryTextKey: "price",
                    addEmptyItem: false,
                    //checkForUniqueKeys: true
                });

                

                return pDiagDropdown;
             }
            }
        },
        addSearableDropDown:function(){

            $('.deptSelect').select2({dropdownAutoWidth: true});
            $('.departmentSelectOther').select2({dropdownAutoWidth: true});
             $('.select2-dropdown').css('width','200px');
             $('.select2-selection--single').css('height','18px');
             $('.select2-selection--single').css('border-radius','0px');
             $('.select2-selection__rendered').css('line-height','18px');
             $('.select2-selection__arrow').css('height','18px');
             $('.select2-results__option').css('padding','2px');
        },
        createDepartmentDropdown: function(param) {
            
            var objectKey = "departmentData"+"_"+ globalvars.selectedHospitalId; //globalvars.physicianHospitals[globalvars.selectedPreHospitalIndex].hospitalId;
            var data  = globalvars.departmentDataDropDownData[objectKey];
           // var data = globalvars.departmentData;

            if(data){

            }else{
                getJSONModel({
                    async: false,
                    url: globalvars.uriCharges.getDeptUri,
                    targetVar: "departmentData"
                });
                data = globalvars.departmentData;
                globalvars.departmentDataDropDownData[objectKey]= globalvars.departmentData;
             }
             var listRuleSource=[];

             if(data){
                if(data.length > 0){
           
                    $(data).each(function (i) {
                        var ruleObj={};
                        ruleObj.sourceVal = data[i].dept;
                        ruleObj.name = data[i].dept + " - " + data[i].deptDesc;
                        listRuleSource.push(ruleObj);
                    })
                }
            }
            


            var posDropdown = createSelectBox({
                index: param.rowId,
                selectDivId: "departmentSelectOther",
                values: listRuleSource,
                currentValue: param.rowData.deptPhys,
                valueKey: "sourceVal",
                textKey: "name",
                //secondaryTextKey: "price",
                addEmptyItem: true,
                //checkForUniqueKeys: true
            });

            
            
            return posDropdown;
        },
        createPhysicianNpiDropdown: function(param) {

           //var sourceList = [{"key":"1912954413","value":"1912954413 - Dr Asif MD Mohammad"},{"key":"2222222222","value":"2222222222-Dr John Marsh"}];
            //globalvars.physician

            var objectKeyNpi = "otherData" + "_" +param.rowData.hcpcCode + "_" + param.rowId + "_npi";
            var listRuleSource=[];
            var newData =[];
            newData = globalvars.otherDropDownData[objectKeyNpi];
            if(newData){
                if(newData.length > 0){
           
                    $(newData).each(function (i) {
                        var ruleObj={};
                        ruleObj.sourceVal = newData[i].npi;
                        ruleObj.name = newData[i].npi + " - " + newData[i].name;
                        listRuleSource.push(ruleObj);
                    })
                }
            }

            var obj={"sourceVal":"More","name":"More..."};
            listRuleSource.push(obj);
            

            var npiDropdown = createSelectBox({
                index: param.rowId,
                selectDivId: "physicianNPISelectOther",
                values: listRuleSource,
                currentValue: param.rowData.npi,
                valueKey: "sourceVal",
                textKey: "name",
                //secondaryTextKey: "price",
                addEmptyItem: true,
                //checkForUniqueKeys: true
            });



            return npiDropdown;
        },
        createPhysicianBillingNpiDropdown: function(param) {

           //var sourceList = [{"key":"1912954413","value":"1912954413 - Dr Asif MD Mohammad"},{"key":"2222222222","value":"2222222222-Dr John Marsh"}];
            //globalvars.physician
            var objectKeyNpi = "otherData" + "_" +param.rowData.hcpcCode + "_" + param.rowId + "_billPhys";
            var listRuleSource=[];
            var newData =[];
            newData = globalvars.otherDropDownData[objectKeyNpi];
            
            if(newData){
                if(newData.length > 0){
           
                    $(newData).each(function (i) {
                        var ruleObj={};
                        ruleObj.sourceVal = newData[i].npi;
                        ruleObj.name = newData[i].npi + " - " + newData[i].name;
                        listRuleSource.push(ruleObj);
                    })
                }
            }

            var obj={"sourceVal":"More","name":"More..."};
            listRuleSource.push(obj);
            

            var npiDropdown = createSelectBox({
                index: param.rowId,
                selectDivId: "physicianBillNPISelectOther",
                values: listRuleSource,
                currentValue: param.rowData.billPhys,
                valueKey: "sourceVal",
                textKey: "name",
                //secondaryTextKey: "price",
                addEmptyItem: true,
                //checkForUniqueKeys: true
            });



            return npiDropdown;
        },
        bindPhysicianNPICodeChange: function(param) {

             $("#physicianNPISelectOther" + param.id).change(function() {
                if($(this).val() == "More"){
                        dialogs.otherPhysicianMissingNPIDialog.reset();
                        globalvars.npiGridName = "other";
                        // gridPhysician.loadMissingPhyNPICodePopupGrid({
                        //     gridDiv: "#account_details_missing_npi_physician_grid_search_form_table",
                        //     screenName:"other"
                        // });

                        dialogs.otherPhysicianMissingNPIDialog.initialize({
                            $searchFormDialogDiv: $("#missing_npi_grid_physician_search_form_dialog"),
                            $searchFormDialogDivSubmit: $("#missing_npi_grid_physician_search_form_submit"),
                            $searchFormDialogDivReset: $("#missing_npi_grid_physician_search_form_reset"),
                            $searchFormDialogDivCancel: $("#missing_npi_grid_physician_search_form_cancel"),
                            screenName:"other"
                        });
                        $(this).val(globalvars.selectedNPI);
                        dialogs.otherPhysicianMissingNPIDialog.open()   
                }else{
                    globalvars.selectedNPI = $(this).val();
                }

             })
        },
         bindBillingPhysicianNPICodeChange: function(param) {

             $("#physicianBillNPISelectOther" + param.id).change(function() {
                if($(this).val() == "More"){
                        dialogs.otherBillingPhysicianMissingNPIDialog.reset();
                        globalvars.npiGridName = "other";
                        // gridPhysician.loadMissingPhyNPICodePopupGrid({
                        //     gridDiv: "#account_details_missing_npi_physician_grid_search_form_table"
                        // });

                        dialogs.otherBillingPhysicianMissingNPIDialog.initialize({
                            $searchFormDialogDiv: $("#missing_bill_npi_grid_physician_search_form_dialog"),
                            $searchFormDialogDivSubmit: $("#missing_bill_npi_grid_physician_search_form_submit"),
                            $searchFormDialogDivReset: $("#missing_bill_npi_grid_physician_search_form_reset"),
                            $searchFormDialogDivCancel: $("#missing_bill_npi_grid_physician_search_form_cancel")
                        });
                        $(this).val(globalvars.selectedNPI);
                        dialogs.otherBillingPhysicianMissingNPIDialog.open()   
                }else{
                    globalvars.selectedNPI = $(this).val();
                }

             })
        },
        preBillAuditorChange: function(selectObj, id) {

            var prebill_auditors = $("#other_modifier_dropdown" + id).multiselect("getChecked");
            var selected_auditor_list_prebill = new Array();
            //log(prebill_auditors); /*Use the Log statement when required*/
            for (var i = 0; i < prebill_auditors.length; i++) {
                //log($(prebill_auditors[i]).attr('value')); /*Use the Log statement when required*/
                selected_auditor_list_prebill.push($(prebill_auditors[i]).attr('value'));

            }
            if(selected_auditor_list_prebill.length == 0)
                gridPhysician.otherPhysicianChargesGrid.$gridDiv.jqGrid('setCell', id, 'preBillSelectedAuditorOther', " ");
            else{

                gridPhysician.otherPhysicianChargesGrid.$gridDiv.jqGrid('setCell', id, 'preBillSelectedAuditorOther', selected_auditor_list_prebill.join());
                 // if(globalvars.appModDataPrice[selected_auditor_list_prebill[0]] != undefined)
                 //    gridPhysician.otherPhysicianChargesGrid.$gridDiv.jqGrid('setCell', id, 'price',globalvars.appModDataPrice[selected_auditor_list_prebill[0]]);

            }
        
        },
        createModifierDropDown:function(param){
            var ModOptionData="";

            var hospitalIdValue = globalvars.selectedHospitalId;//globalvars.physicianHospitals[globalvars.selectedPreHospitalIndex].hospitalId;

            var searchQueryObject = {
                hcpcType: "equals",
                hcpcValue: param.rowData.hcpcCode,
                hospitalIdValue: hospitalIdValue,
                hospitalIdType: "equals"
            };
            var objectKeyMod = "otherData" + "_" + param.rowData.hcpcCode + "_" + param.rowId + "_mod";
            
            var data  = globalvars.otherDropDownData[objectKeyMod];
           

            if(data){
                $(data).each(function (i) {
                    if(data[i] != "")
                        ModOptionData += "<option value='" + data[i]+ "' title='" +globalvars.appModData[data[i]] + "'>" + data[i] + "</option>"

                })

                    
            }

            ModOptionData += "<option value='addMore'>Add More...</option>"

       
            var preBillAuditorDropDown = new String();
            preBillAuditorDropDown = "<div><select class='missingMultiselect' id='other_modifier_dropdown" + param.rowId + "' multiple='multiple' onchange='gridPhysician.otherPhysicianChargesGrid.preBillAuditorChange(this," + param.rowId + ")' style=width:60px>";
            preBillAuditorDropDown += ModOptionData;
            preBillAuditorDropDown += "</select></div>";


            return preBillAuditorDropDown;



        },
        addMultiSelectModifier:function(param){
            var preBillSelectedAuditortext = gridPhysician.otherPhysicianChargesGrid.$gridDiv.jqGrid('getCell', param.id, 'preBillSelectedAuditorOther');
            var preBillRetainAuditorList ;
            if(preBillSelectedAuditortext)
                preBillRetainAuditorList= preBillSelectedAuditortext.split(",");

            $("#other_modifier_dropdown" + param.id).val(preBillRetainAuditorList);
            $("#other_modifier_dropdown" + param.id).multiselect({
                multiple: true,
                minWidth: 70,
                selectedList: 40,
                checkAllText: '',
                uncheckAllText: '',
                click: function( event, ui ) {
                    // console.log('click');
                    if(ui.value === 'addMore'){
                        dialogs.otherPhysicianMissingModDialog.reset();
                        // gridPhysician.loadMissingPhyModCodePopupGrid({
                        //     gridDiv: "#account_details_missing_mod_physician_grid_search_form_table"
                        // });

                        dialogs.otherPhysicianMissingModDialog.initialize({
                            $searchFormDialogDiv: $("#missing_mod_grid_physician_search_form_dialog"),
                            $searchFormDialogDivSubmit: $("#missing_mod_grid_physician_search_form_submit"),
                            $searchFormDialogDivReset: $("#missing_mod_grid_physician_search_form_reset"),
                            $searchFormDialogDivCancel: $("#missing_mod_grid_physician_search_form_cancel"),
                            $searchFormDialogDivAddCodes: $("#missing_mod_grid_physician_search_form_add_Codes"),
                            screenName:"other"
                        });
                        dialogs.otherPhysicianMissingModDialog.open();
                        $("#other_modifier_dropdown" + param.id).multiselect('close');
                        return false;


                    }
                }
            }).multiselectfilter();
        },
    
        // createDeptDropdown: function(param) {
        

        //     var searchQueryObject = {ruleId:'88342'};

        //     var objectKey = "missingData" + "_" + param.rowData.predCode + "_" + param.rowId
        //     var data  = globalvars.missingDropDownData[objectKey];

        //     if(data){
        //         globalvars.missingChargesRuleCodes = data;
        //     }else{
        //         getJSONModel({
        //             async: false,
        //             url: globalvars.uriCharges.uriGetPhyHcpc,
        //             data: {ruleId:param.rowData.predCode},
        //             targetVar: "missingChargesRuleCodes"
        //         });
        //         globalvars.missingDropDownData[objectKey] = globalvars.missingChargesRuleCodes;
        //         data = globalvars.missingDropDownData[objectKey];
        //      }

        //     var listRule=[]
        //     globalvars.missingChargesRuleCodesPrice={};

        //     if(globalvars.missingChargesRuleCodes){
        //         $(globalvars.missingChargesRuleCodes).each(function (i) {
        //             var ruleObj={};
        //             ruleObj.rule = globalvars.missingChargesRuleCodes[i].phyHcpcCode;
        //             ruleObj.price = globalvars.missingChargesRuleCodes[i].price;
        //            // console.log(ruleObj);
        //             listRule.push(ruleObj);
        //             //var priceObj={};
        //             globalvars.missingChargesRuleCodesPrice[ruleObj.rule] = ruleObj.price;
        //             //globalvars.missingChargesRuleCodesPrice.push(priceObj);
        //         })
        //     }            

        //  //   console.log( param.rowData);

        //     var deptDropdown = createSelectBox({
        //         index: param.rowId,
        //         selectDivId: "deptSelect",
        //         values: listRule,
        //         currentValue: param.rowData.hcpcCode,
        //         valueKey: "rule",
        //         textKey: "rule",
        //         //secondaryTextKey: "price",
        //         addEmptyItem: true,
        //         //checkForUniqueKeys: true
        //     });

            

        //     return deptDropdown;
        // },
        // createSourceDropdownOther: function(param) {
        
        //     var sourceList = [{"key":"GSHA"},{"key":"CPHMG"}];
        //     globalvars.otherDiscoveredSourceList={};

        //     var listRuleSource=[];
            
        //         $(sourceList).each(function (i) {
        //             var ruleObj={};
        //             ruleObj.sourceVal = sourceList[i].key;
        //             ruleObj.price = sourceList[i].key;
        //             listRuleSource.push(ruleObj);
        //             globalvars.otherDiscoveredSourceList[ruleObj.sourceVal] = ruleObj.sourceVal;
        //         })
          

        //     var sourceDropdown = createSelectBox({
        //         index: param.rowId,
        //         selectDivId: "sourceSelectOther",
        //         values: listRuleSource,
        //         currentValue: param.rowData.source,
        //         valueKey: "sourceVal",
        //         textKey: "sourceVal",
        //         //secondaryTextKey: "price",
        //         //addEmptyItem: true,
        //         //checkForUniqueKeys: true
        //     });

            

        //     return sourceDropdown;
        // },
        createCostCenterDropdownOther: function(param) {
        
            //var sourceList = [{"key":"GSHA"},{"key":"CPHMG"},{"key":"costCenter"}];
            globalvars.otherDiscoveredCostCenterList={};

            getJSONModel({
                async: false,
                url: globalvars.uriCharges.getPhyCostCenterUri,
                targetVar: "listCostCenter"
            });

            var listRuleCost=[];
            
                $(globalvars.listCostCenter).each(function (i) {
                    var ruleObj={};
                    ruleObj.sourceVal = globalvars.listCostCenter[i];
                    ruleObj.price = globalvars.listCostCenter[i];
                    listRuleCost.push(ruleObj);
                    globalvars.otherDiscoveredCostCenterList[ruleObj.sourceVal] = ruleObj.sourceVal;
                })
          

            var costDropdown = createSelectBox({
                index: param.rowId,
                selectDivId: "costcenterSelectOther",
                values: listRuleCost,
                currentValue: param.rowData.costCenter,
                valueKey: "sourceVal",
                textKey: "sourceVal",
                //secondaryTextKey: "price",
                addEmptyItem: true,
                //checkForUniqueKeys: true
            });

            

            return costDropdown;
        },
        createPosDropdown: function(param) {
            
            var data = globalvars.chargesPosData;

            if(data){

            }else{
                getJSONModel({
                    async: false,
                    url: globalvars.root.getPosUri,
                    targetVar: "missingChargesPosData"
                });
                data = globalvars.missingChargesPosData;
                globalvars.chargesPosData= globalvars.missingChargesPosData;
             }

            


            var posDropdown = createSelectBox({
                index: param.rowId,
                selectDivId: "posSelectOther",
                values: data,
                currentValue: param.rowData.pos,
                valueKey: "pos",
                textKey: "pos",
                //secondaryTextKey: "price",
                addEmptyItem: true,
                //checkForUniqueKeys: true
            });

            

            return posDropdown;
        },
        
        // bindDeptCodeChange: function(param) {
        //     var hospitalValue = globalvars.physicianHospitals[globalvars.selectedPreHospitalIndex].hospitalId
           
            
        //     var hospitalIdValue = hospitalValue;
        //     $('#' + param.id + '_' + 'chargeCode').blur(function() {
        //         var deptValue = $('#' + param.id + '_' + 'dept').val();
        //         var chargeValue = $('#' + param.id + '_' + 'chargeCode').val();
        //         var hcpcValue = $('#' + param.id + '_' + 'hcpcCode').val();
        //         if(deptValue!="" && chargeValue!=""){
        //             $.ajax({
        //                 type: 'GET',
        //                 url: globalvars.charges.chargesLookupPriceUri + "?hospitalIdValue=" + hospitalIdValue + "&deptValue=" + deptValue + "&chargeValue=" + chargeValue + "&hcpcValue=" + hcpcValue,
        //                 contentType: 'application/json',
        //                error: function(jqxhr) {
        //                     if(jqxhr.status==204){
        //                         gridPhysician.otherPhysicianChargesGrid.$gridDiv.jqGrid('setCell', param.id, 'price',null);
        //                     }
        //                 },
        //                 success: function(str, textStatus, jqxhr) {
        //                     if(jqxhr.status=='200'){
        //                         gridPhysician.otherPhysicianChargesGrid.$gridDiv.jqGrid('setCell', param.id, 'price', str);
        //                     }else{
        //                       gridPhysician.otherPhysicianChargesGrid.$gridDiv.jqGrid('setCell', param.id, 'price',null);
        //                     }
        //                 }
        //             });
        //        }else{
        //            gridPhysician.otherPhysicianChargesGrid.$gridDiv.jqGrid('setCell', param.id, 'price',null);
        //        }
        //       });
        //       $('#' + param.id + '_' + 'dept').blur(function() {
        //         var deptValue = $('#' + param.id + '_' + 'dept').val();
        //         var chargeValue = $('#' + param.id + '_' + 'chargeCode').val();
        //         var hcpcValue = $('#' + param.id + '_' + 'hcpcCode').val();
        //         if(deptValue!="" && chargeValue!=""){
        //         $.ajax({
        //             type: 'GET',
        //             url: globalvars.charges.chargesLookupPriceUri + "?hospitalIdValue=" + hospitalIdValue + "&deptValue=" + deptValue + "&chargeValue=" + chargeValue + "&hcpcValue=" + hcpcValue,
        //             contentType: 'application/json',
        //             error: function(jqxhr) {
        //                 if(jqxhr.status==204){
        //                     gridPhysician.otherPhysicianChargesGrid.$gridDiv.jqGrid('setCell', param.id, 'price',null);
        //                 }
        //             },
        //            success: function(str, textStatus, jqxhr) {
        //                 if(jqxhr.status=='200'){
        //                     gridPhysician.otherPhysicianChargesGrid.$gridDiv.jqGrid('setCell', param.id, 'price', str);
        //                 }else{
        //                   gridPhysician.otherPhysicianChargesGrid.$gridDiv.jqGrid('setCell', param.id, 'price', null);
        //                 }
        //             }
        //         });
        //        }else{
        //            gridPhysician.otherPhysicianChargesGrid.$gridDiv.jqGrid('setCell', param.id, 'price', null);
        //        }
        //       });
        // }
    },
    loadPhysicianConfirmChargesGrid: { // param object holds gridDiv, data
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
            colNames: ['',globalvars.localResourceMap.confirm_charge_coid,'Auditor Id',globalvars.localResourceMap.confirm_charge_acct, 'Cost Center',
                'Source', globalvars.localResourceMap.confirm_charge_hcpc_code,'Guarantor Id',globalvars.localResourceMap.confirm_charge_amount,
                globalvars.localResourceMap.confirm_charge_qty, globalvars.localResourceMap.confirm_charge_comments, globalvars.localResourceMap.confirm_charge_confirm_time, globalvars.localResourceMap.confirm_charge_desc, globalvars.localResourceMap.confirm_charge_found],
            colModel: [
                {name: 'hospitalId', index: 'hospitalId', width: 60,hidden:true},
                {name: 'shortName', index: 'shortName', width: 70, align: 'center', fixed: true, sortable: true, sorttype: "int"},
                {name: 'auditorId', index: 'auditorId', width: 60, align: 'center', fixed: true, sortable: true},
                {name: 'accountId', index: 'accountId', width: 90, sortable: true, fixed: true, sorttype: "int",align: 'center',classes: 'confirm-account-cursor'},
                
                {name: 'costCenter', index: 'costCenter', width: 60, align: 'center', fixed: true, sortable: true, sorttype: "int"},
                {name: 'source', index: 'source', width: 55, align: 'center', fixed: true, sortable: true, sorttype: "int"},
                {name: 'hcpcCode', index: 'hcpcCode', width: 55, align: 'center', fixed: true, sortable: true, sorttype: "int"},
                {name: 'guarantorId', index: 'guarantorId', width: 65, align: 'center', fixed: true, sortable: true, sorttype: "int"},
                {name: 'chargeAmount', index: 'chargeAmount', width: 75, fixed: true, sortable: true, sorttype: "float", align: 'right'},
                {name: 'quantity', index: 'quantity', width: 50, fixed: true, sortable: true, sorttype: "int", align: 'center'},
                {name: 'comments', index: 'comments', width: 80, fixed: true, sortable: true, classes: 'grid_cell_style_confrim_reject'},
                {name: 'confirmTime', index: 'confirmTime', width: 108, fixed: true, sortable: true, sorttype: "date", datefmt: "Y-m-d h:i:s", classes: 'grid_cell_style_confrim_reject'},
                {name: 'desc', index: 'desc', width: 90, fixed: true, sortable: true, classes: 'grid_cell_style_confrim_reject'},

                // {name: 'chargeDesc', index: 'chargeDesc', width: 90, fixed: true, sortable: true, classes: 'grid_cell_style_confrim_reject'},
                
                
                {name: 'found', index: 'found', width: 10, hidden: true}
            ],
            onSelectRow: this.onClick,
            loadComplete: function() {
                var gridRowData = gridPhysician.loadPhysicianConfirmChargesGrid.$gridDiv.jqGrid('getRowData');
                for (var i = 0; i < gridRowData.length; i++) {
                    if (gridRowData[i].found == "1") {
                        log("Highlighted found" + gridRowData[i].acct + "::" + (i + 1));
                        $(("tr#" + (i + 1))).addClass("highlighted_row");
                    }
                }

                if ((gridPhysician.loadPhysicianConfirmChargesGrid.datalength == 0 || gridPhysician.loadPhysicianConfirmChargesGrid.datalength == undefined)
                        && gridPhysician.loadPhysicianConfirmChargesGrid.showExcel == undefined) {
                    $("#confirm_charges_download_excel").hide();
                    dialogs.messageDialog.show({text: globalvars.localResourceMap.confirmed_charge_no_data_msg});
                }
                else if (gridPhysician.loadPhysicianConfirmChargesGrid.datalength > 0 && gridPhysician.loadPhysicianConfirmChargesGrid.showExcel==false) {
                     $("#confirm_charges_download_excel").hide();
                }
                else if (gridPhysician.loadPhysicianConfirmChargesGrid.datalength > 0 && gridPhysician.loadPhysicianConfirmChargesGrid.showExcel) {
                    $("#confirm_charges_download_excel").show();
                }
            }


        });

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
                colNames:globalvars.physEdit.colNames,
                colModel:globalvars.physEdit.colModel,
 /*               colNames: ['index', globalvars.localResourceMap.bill_accout_review_account, globalvars.localResourceMap.bill_accout_review_age,
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
                    {name: 'name', width: 10, hidden: true, sortable: false},
                    {name: 'dob', width: 10, hidden: true, sortable: false}


                ], */
                onSelectRow: this.onClick,
                loadComplete: function() {

                    var gridRowData = gridPhysician.submittedAccountReviewGrid.$gridDiv.jqGrid('getRowData');
                    var gridRowDataLength = gridRowData.length;
                    for (var i = 0; i < gridRowDataLength; i++) {
                        if (gridRowData[i].isHighlighted == "true") {
                            log("isHighlighted " + gridRowData[i].accountId + " : " + (i + 1));
                            $(("#prebill_grid_table tr#" + (parseInt(gridRowData[i].index,10) + 1))).addClass("highlighted_row");
                        }
                        ;
                    }
                    ;
                    gridPhysician.submittedAccountReviewGrid.$gridDiv.jqGrid('setLabel', 'accountId', '', {'text-align': 'left', 'padding-left': '16px', 'width': '86px'});
                    gridPhysician.submittedAccountReviewGrid.$gridDiv.jqGrid('setLabel', 'admitDate', '', {'text-align': 'left', 'padding-left': '16px', 'width': '86px'});
                    gridPhysician.submittedAccountReviewGrid.$gridDiv.jqGrid('setLabel', 'dischargeDate', '', {'text-align': 'left', 'padding-left': '16px', 'width': '96px'});
                    gridPhysician.submittedAccountReviewGrid.$gridDiv.jqGrid('setLabel', 'patTypeWithDescription', '', {'text-align': 'left', 'padding-left': '16px', 'width': '106px'});
                    gridPhysician.submittedAccountReviewGrid.$gridDiv.jqGrid('setLabel', 'insurance', '', {'text-align': 'left', 'padding-left': '16px', 'width': '66px'});
                    gridPhysician.submittedAccountReviewGrid.$gridDiv.jqGrid('setLabel', 'insuranceName', '', {'text-align': 'left', 'padding-left': '16px', 'width': '236px'});

                }
            });
        },
        fillGrid: function() {
            var datalength = this.data.length;
            for (var i = 0; i < datalength; i++) {
                gridPhysician.submittedAccountReviewGrid.data[i].index = i;
                gridPhysician.submittedAccountReviewGrid.$gridDiv.jqGrid('addRowData', i + 1, gridPhysician.submittedAccountReviewGrid.data[i]);
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
    
    loadOtherPhyChargesSearchFormGrid: {
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
                width: '630',
                height: '200',
                gridview: true,
                viewrecords: true,
                altRows: true,
                altclass: 'alternate_row_color',
                colNames: [
                        '',
                        'PROCEDURE CODE',
                        'Description',
                       'modifier',
                       // globalvars.localResourceMap.other_discoved_search_rev_code, 
                       globalvars.localResourceMap.other_discoved_charge_price

                ],
                colModel: [
                   // {name: 'hidden', width: 10, hidden: true, key: true},
                     {name: 'index', width: 10,hidden: true},
                     {name: 'hcpcCode', index: 'hcpcCode', width: 100, sortable: true, fixed: true, align: 'center'},
                     {name: 'description', index: 'description', width: 320, sortable: true,  fixed: true, align: 'left'},
                     {name: 'modifier', index: 'modifier', width: 100, sortable: true, fixed: true, align: 'center'},
                // {name: 'revenueCode', index: 'rev', width: 120, sortable: true, sorttype: 'int', fixed: true, align: 'center'},
                     {name: 'price', index: 'price', width: 100, sortable: true,  fixed: true, align: 'center',formatter:'currency',
                     formatoptions: { decimalSeparator: ".", thousandsSeparator: ",", prefix: "$",decimalPlaces: 1, defaultValue: '0.0' }},
                ],
        ondblClickRow: function(id) {
             globalvars.other_discovered_charges_selected_row_form_data = $("#account_details_other_charges_physician_grid_search_form_table").jqGrid('getRowData', id);
                $("#other_charges_grid_physician_search_form_dialog").dialog("close");
                var data = {
                    hcpcCode: globalvars.other_discovered_charges_selected_row_form_data.hcpcCode,
                    dept: globalvars.other_discovered_charges_selected_row_form_data.dept,
                    chargeCode: globalvars.other_discovered_charges_selected_row_form_data.chargeCode,
                    price: globalvars.other_discovered_charges_selected_row_form_data.price,
                    modifier:globalvars.other_discovered_charges_selected_row_form_data.modifier
                };
                var test = $("#account_details_other_charges_grid_table").getRowData(gridPhysician.otherPhysicianChargesGrid.selectedRow);
                if (test) {
                        gridPhysician.otherPhysicianChargesGrid.$gridDiv.jqGrid('setCell', test.id, 'hcpcCode', data.hcpcCode);
                        gridPhysician.otherPhysicianChargesGrid.$gridDiv.jqGrid('setCell', test.id, 'price', data.price);
                        if(data.hcpcCode != test.hcpcCode){
                            gridPhysician.otherPhysicianChargesGrid.$gridDiv.jqGrid('setCell', test.id, 'preBillSelectedAuditorOther', " ");
                            gridPhysician.otherPhysicianChargesGrid.$gridDiv.jqGrid('setCell', test.id, 'modifier', " ");
                        }
                        test.hcpcCode = data.hcpcCode;
                        gridPhysician.otherPhysicianChargesGrid.setDefaultData({rowData: test,
                                rowId: test.id});
                        gridPhysician.otherPhysicianChargesGrid.$gridDiv.jqGrid('saveRow', gridPhysician.otherPhysicianChargesGrid.selectedRow);
                        
                        var afterSaveRow = $("#account_details_other_charges_grid_table").getRowData(gridPhysician.otherPhysicianChargesGrid.selectedRow);


                        // added new implementation
                        if(data.modifier != "" || data.modifier != " "){

                        var objectKey = "otherData" + "_" + test.hcpcCode + "_" + test.id + "_mod";
                        var newData  = globalvars.otherDropDownData[objectKey];

                        var selected_items=[];
                        selected_items.push(data.modifier)

                        if(newData)
                            newData = newData.concat(selected_items)
                        else
                            newData = selected_items;

                        newData = newData.unique();
                        globalvars.otherDropDownData[objectKey] = newData;

                 
                        var selPopupModCodes = selected_items.join(',');
                        var rowDiagCode;

                        if($.trim(afterSaveRow.preBillSelectedAuditorOther).length > 0)
                            rowDiagCode = (afterSaveRow.preBillSelectedAuditorOther != " ")? $.trim(afterSaveRow.preBillSelectedAuditorOther) + "," + selPopupModCodes : selPopupModCodes;

                        else
                            rowDiagCode = selPopupModCodes;

                        rowDiagCode = rowDiagCode.split(',').unique().join(',');
                        gridPhysician.otherPhysicianChargesGrid.$gridDiv.jqGrid('setCell', test.id, 'modifier', rowDiagCode);
                        gridPhysician.otherPhysicianChargesGrid.$gridDiv.jqGrid('setCell', test.id, 'preBillSelectedAuditorOther', rowDiagCode);

                    }else{
                            //gridPhysician.otherPhysicianChargesGrid.$gridDiv.jqGrid('setCell', test.id, 'modifier', rowDiagCode);

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
                gridPhysician.loadOtherPhyChargesSearchFormGrid.data[i].index = i;
                gridPhysician.loadOtherPhyChargesSearchFormGrid.$gridDiv.jqGrid('addRowData', i + 1, gridPhysician.loadOtherPhyChargesSearchFormGrid.data[i]);
            }
            ;
            gridPhysician.loadOtherPhyChargesSearchFormGrid.$gridDiv.setGridParam({rowNum: datalength}).trigger("reloadGrid");

           
        }
    },

    loadMissingPhyDiagCodePopupGrid: {
        gridDiv: "",
        $gridDiv: {},
        pagerDiv: "",
        data: {},
        onClick: {},
       
        initialize: function(param) {
            log(param);
            this.gridDiv = param.gridDiv;
            this.$gridDiv = $(param.gridDiv)
            this.pagerDiv = param.pagerDiv;
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
                width: '630',
                height: '180',
                gridview: true,
                viewrecords: true,
                altRows: true,
                altclass: 'alternate_row_color',
                viewsortcols: [false, 'vertical', true],
                colNames: [
                        '','Diag Code','Diag description',''
                        

                ],
                colModel: [
                     {name: 'index', width: 10,hidden: true},
                     {name: 'diagCode', index: 'diagCode', width: 120, sortable: true, fixed: true, align: 'center'},
                     {name: 'description', index: 'description', width: 400, sortable: true,fixed: true,align: 'left',classes:'colCell'},
                     {name: 'search', index: 'search', width: 100, sortable: true, fixed: true, align: 'right'},
                    
                ],
        ondblClickRow: function(id) {
            
        },
        loadComplete: function() {

                    
                }
            });
        },
        fillGrid: function() {
            var datalength = this.data.length;
            console.log(datalength);
            var searchDiv = '<button class="other_discover_btn_add" type="button"><span class="button_text_add">ADD</span></button>';
            for (var i = 0; i < datalength; i++) {
                gridPhysician.loadMissingPhyDiagCodePopupGrid.data[i].index = i;
                gridPhysician.loadMissingPhyDiagCodePopupGrid.data[i].search = searchDiv;
                gridPhysician.loadMissingPhyDiagCodePopupGrid.$gridDiv.jqGrid('addRowData', i + 1, gridPhysician.loadMissingPhyDiagCodePopupGrid.data[i]);
            }
            ;
            gridPhysician.loadMissingPhyDiagCodePopupGrid.$gridDiv.setGridParam({rowNum: datalength}).trigger("reloadGrid");

            //gridPhysician.loadMissingPhyDiagCodePopupGrid.$gridDiv.setGridParam().trigger("reloadGrid");

           
        }
    },

    loadMissingPhyModCodePopupGrid: {
        gridDiv: "",
        $gridDiv: {},
        pagerDiv: "",
        data: {},
        onClick: {},
       
        initialize: function(param) {
            log(param);
            this.gridDiv = param.gridDiv;
            this.$gridDiv = $(param.gridDiv)
            this.pagerDiv = param.pagerDiv;
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
                width: '630',
                height: '180',
                gridview: true,
                viewrecords: true,
                altRows: true,
                altclass: 'alternate_row_color',
                sortname: 'rank',
                viewsortcols: [false, 'vertical', true],
                colNames: [
                        '','modifier','Description',''
                        

                ],
                colModel: [
                     {name: 'index', width: 10,hidden: true},
                     {name: 'modifier', index: 'modifier', width: 120, sortable: true, fixed: true, align: 'center'},
                     {name: 'description', index: 'description', width: 400, sortable: true,fixed: true,align: 'left',classes:'colCell'},
                     {name: 'search', index: 'modifier', width: 100, sortable: true, fixed: true, align: 'right'},
                    
                ],
        ondblClickRow: function(id) {
            
        },
        loadComplete: function() {

                    
                }
            });
        },
        fillGrid: function() {
            var datalength = this.data.length;
            var searchDiv = '<button class="other_discover_btn_mod_add" type="button"><span class="button_text_add">ADD</span></button>';
            for (var i = 0; i < datalength; i++) {
                gridPhysician.loadMissingPhyModCodePopupGrid.data[i].index = i;
                gridPhysician.loadMissingPhyModCodePopupGrid.data[i].search = searchDiv;
                gridPhysician.loadMissingPhyModCodePopupGrid.$gridDiv.jqGrid('addRowData', i + 1, gridPhysician.loadMissingPhyModCodePopupGrid    .data[i]);
            }
            ;
            gridPhysician.loadMissingPhyModCodePopupGrid.$gridDiv.setGridParam({rowNum: datalength}).trigger("reloadGrid");

           
        }
    },

    otherChargesSearchFormPhysicianNPI: {
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
                width: '630',
                height: '200',
                gridview: true,
                viewrecords: true,
                altRows: true,
                altclass: 'alternate_row_color',
                colNames: [
                        '','NPI','CODE','NAME','Start Date','Termination</br>Date'

                ],
                colModel: [
                   // {name: 'hidden', width: 10, hidden: true, key: true},
                {name: 'index', width: 10,hidden: true},
                {name: 'npi', index: 'npi', width: 90, sortable: true, sorttype: 'int', fixed: true, align: 'center'},
                {name: 'code', index: 'code', width: 90, sortable: true,fixed: true,align: 'center'},
                {name: 'name', index: 'name', width: 200, sortable: true,fixed: true,align: 'left'},
                {name: 'startDate', index: 'startDate', width: 90, sortable: true,fixed: true,align: 'center'},
                {name: 'terminationDate', index: 'terminationDate', width: 140, sortable: true,align: 'center',fixed: true},
                ],
        ondblClickRow: function(id) {
                 
                globalvars.missingNPIData = $("#account_details_missing_npi_physician_grid_search_form_table").jqGrid('getRowData', id);
                $("#missing_npi_grid_physician_search_form_dialog").dialog("close");
                

                var data = {
                    name: globalvars.missingNPIData.name,
                    npi: globalvars.missingNPIData.npi
                }

                var newData=[];

                if(globalvars.npiGridName == "other"){

                 gridPhysician.otherPhysicianChargesGrid.$gridDiv.jqGrid('saveRow', gridPhysician.otherPhysicianChargesGrid.selectedRow);
                 var selectedRowData = gridPhysician.otherPhysicianChargesGrid.$gridDiv.jqGrid('getRowData', gridPhysician.otherPhysicianChargesGrid.selectedRow);
                 //var objectKeyNpi = "missingData" + "_" +selectedRowData.predKey + "_npi";
                 var objectKeyNpi = "otherData" + "_" +selectedRowData.hcpcCode + "_" + selectedRowData.id + "_npi";
                 newData = globalvars.otherDropDownData[objectKeyNpi];

                 
                 if(newData.length>0){
                    var found = false;

                    for(var i = 0; i < newData.length; i++) {
                        if (newData[i].npi == data.npi) {
                            found = true;
                            break;
                        }
                    }
                    if(found == false){
                        newData.push(data);

                    }
                    globalvars.otherDropDownData[objectKeyNpi] = newData; 
                 }else{
                    newData.push(data);
                    globalvars.otherDropDownData[objectKeyNpi] = newData; 
                 }

                    selectedRowData.npi = data.npi;
                    //selectedRowData.physicianName = data.name;
                    gridPhysician.otherPhysicianChargesGrid.$gridDiv.jqGrid('setRowData', gridPhysician.otherPhysicianChargesGrid.selectedRow, selectedRowData);
                    gridPhysician.otherPhysicianChargesGrid.savedSuccessfully = true;

                }
                else
                {
                 gridPhysician.missingPhysicianChargesGrid.$gridDiv.jqGrid('saveRow', gridPhysician.missingPhysicianChargesGrid.selectedRow);
                 var selectedRowData = gridPhysician.missingPhysicianChargesGrid.$gridDiv.jqGrid('getRowData', gridPhysician.missingPhysicianChargesGrid.selectedRow);
                 var objectKeyNpi = "missingData" + "_" +selectedRowData.predKey + "_npi";
                 newData = globalvars.missingDropDownData[objectKeyNpi];

                 
                 if(newData.length>0){
                    var found = false;

                    for(var i = 0; i < newData.length; i++) {
                        if (newData[i].npi == data.npi) {
                            found = true;
                            break;
                        }
                    }
                    if(found == false){
                        newData.push(data);

                    }
                    globalvars.missingDropDownData[objectKeyNpi] = newData; 
                 }else{
                    newData.push(data);
                    globalvars.missingDropDownData[objectKeyNpi] = newData; 
                 }

                    selectedRowData.npi = data.npi;
                    //selectedRowData.physicianName = data.name;
                    gridPhysician.missingPhysicianChargesGrid.$gridDiv.jqGrid('setRowData', gridPhysician.missingPhysicianChargesGrid.selectedRow, selectedRowData);
                    gridPhysician.missingPhysicianChargesGrid.savedSuccessfully = true;

                }
        },
        loadComplete: function() {

                    
                }
            });
        },
        fillGrid: function() {
            var datalength = this.data.length;

            for (var i = 0; i < datalength; i++) {
                gridPhysician.otherChargesSearchFormPhysicianNPI.data[i].index = i;
                gridPhysician.otherChargesSearchFormPhysicianNPI.$gridDiv.jqGrid('addRowData', i + 1, gridPhysician.otherChargesSearchFormPhysicianNPI.data[i]);
            }
            ;

            gridPhysician.otherChargesSearchFormPhysicianNPI.$gridDiv.setGridParam({rowNum: datalength}).trigger("reloadGrid");

           
        }
    },

     otherChargesSearchFormPhysicianNPIBilling: {
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
                width: '630',
                height: '200',
                gridview: true,
                viewrecords: true,
                altRows: true,
                altclass: 'alternate_row_color',
                colNames: [
                        '','NPI','CODE','NAME','Start Date','Termination</br>Date'

                ],
                colModel: [
                   // {name: 'hidden', width: 10, hidden: true, key: true},
                {name: 'index', width: 10,hidden: true},
                {name: 'npi', index: 'npi', width: 90, sortable: true, sorttype: 'int', fixed: true, align: 'center'},
                {name: 'code', index: 'code', width: 90, sortable: true,fixed: true,align: 'center'},
                {name: 'name', index: 'name', width: 200, sortable: true,fixed: true,align: 'left'},
                {name: 'startDate', index: 'startDate', width: 90, sortable: true,fixed: true,align: 'center'},
                {name: 'terminationDate', index: 'terminationDate', width: 140, sortable: true,align: 'center',fixed: true},
                ],
        ondblClickRow: function(id) {
                 
                globalvars.missingNPIData = $("#account_details_missing_bill_npi_physician_grid_search_form_table").jqGrid('getRowData', id);
                $("#missing_bill_npi_grid_physician_search_form_dialog").dialog("close");

                var data = {
                    name: globalvars.missingNPIData.name,
                    npi: globalvars.missingNPIData.npi
                }

                var newData=[];

                if(globalvars.npiGridName == "other"){

                 gridPhysician.otherPhysicianChargesGrid.$gridDiv.jqGrid('saveRow', gridPhysician.otherPhysicianChargesGrid.selectedRow);
                 var selectedRowData = gridPhysician.otherPhysicianChargesGrid.$gridDiv.jqGrid('getRowData', gridPhysician.otherPhysicianChargesGrid.selectedRow);
                 //var objectKeyNpi = "missingData" + "_" +selectedRowData.predKey + "_npi";
                 var objectKeyNpi = "otherData" + "_" +selectedRowData.hcpcCode + "_" + selectedRowData.id + "_billPhys";
                 newData = globalvars.otherDropDownData[objectKeyNpi];

                 
                 if(newData.length>0){
                    var found = false;

                    for(var i = 0; i < newData.length; i++) {
                        if (newData[i].npi == data.npi) {
                            found = true;
                            break;
                        }
                    }
                    if(found == false){
                        newData.push(data);

                    }
                    globalvars.otherDropDownData[objectKeyNpi] = newData; 
                 }else{
                    newData.push(data);
                    globalvars.otherDropDownData[objectKeyNpi] = newData; 
                 }

                    selectedRowData.billPhys = data.npi;
                    //selectedRowData.physicianName = data.name;
                    gridPhysician.otherPhysicianChargesGrid.$gridDiv.jqGrid('setRowData', gridPhysician.otherPhysicianChargesGrid.selectedRow, selectedRowData);
                    gridPhysician.otherPhysicianChargesGrid.savedSuccessfully = true;

                }
                else
                {
                 gridPhysician.missingPhysicianChargesGrid.$gridDiv.jqGrid('saveRow', gridPhysician.missingPhysicianChargesGrid.selectedRow);
                 var selectedRowData = gridPhysician.missingPhysicianChargesGrid.$gridDiv.jqGrid('getRowData', gridPhysician.missingPhysicianChargesGrid.selectedRow);
                 var objectKeyNpi = "missingData" + "_" +selectedRowData.predKey + "_billPhys";
                 newData = globalvars.missingDropDownData[objectKeyNpi];

                 
                 if(newData.length>0){
                    var found = false;

                    for(var i = 0; i < newData.length; i++) {
                        if (newData[i].npi == data.npi) {
                            found = true;
                            break;
                        }
                    }
                    if(found == false){
                        newData.push(data);

                    }
                    globalvars.missingDropDownData[objectKeyNpi] = newData; 
                 }else{
                    newData.push(data);
                    globalvars.missingDropDownData[objectKeyNpi] = newData; 
                 }

                    selectedRowData.billPhys = data.npi;
                    //selectedRowData.physicianName = data.name;
                    gridPhysician.missingPhysicianChargesGrid.$gridDiv.jqGrid('setRowData', gridPhysician.missingPhysicianChargesGrid.selectedRow, selectedRowData);
                    gridPhysician.missingPhysicianChargesGrid.savedSuccessfully = true;

                }
        },
        loadComplete: function() {

                    
                }
            });
        },
        fillGrid: function() {
            var datalength = this.data.length;

            for (var i = 0; i < datalength; i++) {
                gridPhysician.otherChargesSearchFormPhysicianNPIBilling.data[i].index = i;
                gridPhysician.otherChargesSearchFormPhysicianNPIBilling.$gridDiv.jqGrid('addRowData', i + 1, gridPhysician.otherChargesSearchFormPhysicianNPIBilling.data[i]);
            }
            ;

            gridPhysician.otherChargesSearchFormPhysicianNPIBilling.$gridDiv.setGridParam({rowNum: datalength}).trigger("reloadGrid");

           
        }
    },
    
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

                    gridPhysician.reportUserAssignmentGrid.savePreviousRow();
                    gridPhysician.reportUserAssignmentGrid.selectedRow = id;

                    var preBillAuditorDropDown = new String();
                    preBillAuditorDropDown = "<div class='prebill_auditor_selector_div'><select id='prebill_auditor_dropdown" + id + "' multiple='multiple' onchange='gridPhysician.reportUserAssignmentGrid.preBillAuditorChange(this," + id + ")' style=width:300px;>";
                    preBillAuditorDropDown += globalvars.auditorOptions;
                    preBillAuditorDropDown += "</select></div>";

                    gridPhysician.reportUserAssignmentGrid.$gridDiv.jqGrid('editRow', id, true);
                    gridPhysician.reportUserAssignmentGrid.$gridDiv.jqGrid('setCell', id, 'preBillAuditor', preBillAuditorDropDown);

                    var preBillSelectedAuditortext = gridPhysician.reportUserAssignmentGrid.$gridDiv.jqGrid('getCell', id, 'preBillSelectedAuditor');
                    var preBillRetainAuditorList = preBillSelectedAuditortext.split(",");


                    $("#prebill_auditor_dropdown" + id).val(preBillRetainAuditorList);
                    $("#prebill_auditor_dropdown" + id).multiselect({
                        multiple: true,
                        minWidth: 250,
                        selectedList: 40
                    })
                            .multiselectfilter();


                //    log('clicked ' + id + " " + gridPhysician.reportUserAssignmentGrid.$gridDiv.getRowData(id));
                },
                editurl: 'clientArray',
                ignoreCase: true,
                onPaging: function() {
                    gridPhysician.reportUserAssignmentGrid.savePreviousRow();
                    gridPhysician.reportUserAssignmentGrid.selectedRow = undefined;
                },
                onSortCol: function() {
                    gridPhysician.reportUserAssignmentGrid.savePreviousRow();
                    gridPhysician.reportUserAssignmentGrid.selectedRow = undefined;
                },
                cmTemplate: {title: false},
                loadComplete: function() {
                    //gridPhysician.reportUserAssignmentGrid.$gridDiv.jqGrid('setLabel', 'hospitalName', '', {'text-align':'left', 'padding-left':'16px', 'width':'256px'});
                    //gridPhysician.reportUserAssignmentGrid.$gridDiv.jqGrid('setLabel', 'preBillAuditor', '', {'text-align':'left', 'padding-left':'16px', 'width':'336px'});

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
            gridPhysician.reportUserAssignmentGrid.$gridDiv.jqGrid('setCell', id, 'preBillSelectedAuditor', selected_auditor_list_prebill);

        },
        savePreviousRow: function() {
            if (gridPhysician.reportUserAssignmentGrid.selectedRow !== undefined) {

                gridPhysician.reportUserAssignmentGrid.$gridDiv.jqGrid('saveRow', gridPhysician.reportUserAssignmentGrid.selectedRow);
                var prebill_auditors_text = gridPhysician.reportUserAssignmentGrid.$gridDiv.jqGrid('getCell', gridPhysician.reportUserAssignmentGrid.selectedRow, 'preBillSelectedAuditor');
                var prebill_auditors_list;
                if(prebill_auditors_text)
                    prebill_auditors_list = prebill_auditors_text.split(",");
                var current_prebill_auditors_text = new String();

                var preBillOriginalAuditortext = gridPhysician.reportUserAssignmentGrid.$gridDiv.jqGrid('getCell', gridPhysician.reportUserAssignmentGrid.selectedRow, 'originalPreBillSelectedAuditor');
                var preBillOriginalAuditorList=[];
                if(preBillOriginalAuditortext)
                    preBillOriginalAuditorList = preBillOriginalAuditortext.split(",");


                var currentHospitalId = gridPhysician.reportUserAssignmentGrid.$gridDiv.jqGrid('getCell', gridPhysician.reportUserAssignmentGrid.selectedRow, 'hospitalName');
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
                gridPhysician.reportUserAssignmentGrid.$gridDiv.jqGrid('setCell', gridPhysician.reportUserAssignmentGrid.selectedRow, 'preBillAuditor', current_prebill_auditors_text);
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
                preBillAuditors = gridPhysician.reportUserAssignmentGrid.data[i].hospitals;
                preBillAuditorsText = new String();
                preBillSelectedAuditors = new Array();
                for (var j = 0; j < preBillAuditors.length; j++) {
                    preBillAuditorsText += preBillAuditors[j].hospitalId + '<br/>';
                    preBillSelectedAuditors.push(preBillAuditors[j].hospitalId);
                }


                gridPhysician.reportUserAssignmentGrid.$gridDiv.jqGrid('addRowData', i + 1, {
                    hospitalName: gridPhysician.reportUserAssignmentGrid.data[i].userId,
                    userFullName: gridPhysician.reportUserAssignmentGrid.data[i].userFullName,
                    preBillAuditor: preBillAuditorsText,
                    preBillSelectedAuditor: preBillSelectedAuditors,
                    originalPreBillSelectedAuditor: preBillSelectedAuditors,
                });
            }
            gridPhysician.reportUserAssignmentGrid.$gridDiv.setGridParam({rowNum: 30}).trigger("reloadGrid");
        }
    },
    
    

    /* Auditor Assignment Grid*/

    loadPhysicianAuditorAssignmentGrid: {
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
                colNames: ['','Source', 'Service Line', 'Facility', 'Facility Name','Account Volume', 'Auditor', '', '','Queue <br>Auditor'],
                colModel: [
                    
                    {name: 'hospIndex', index: 'hospIndex',hidden: true,},
                    {name: 'source', index: 'source', width: (globalvars.client=="MERCY" || globalvars.client == "MSH")? 210:130, fixed: true, align: 'center'},
                    {name: 'costCenter', index: 'costCenter', width: (globalvars.client=="MERCY" || globalvars.client == "MSH")? 210:130, fixed: true, classes: 'grid_cell_style',align: 'center'},
                    {name: 'hospitalId', index: 'hospitalId', width: 140, fixed: true, classes: 'grid_cell_style',align: 'center', hidden:(globalvars.client=="MERCY" || globalvars.client == "MSH")? true:false},
                    // {name: 'facilityList', index: 'facilityList', width: 350, fixed: true, editable: true, sortable: false, classes: 'grid_cell_style'},
                    {name: 'shortName', index: 'shortName', width: 140, fixed: true, classes: 'grid_cell_style',align: 'center',hidden:(globalvars.client=="MERCY" || globalvars.client == "MSH")? true:false},
                    {name: 'total', index: 'total', width: (globalvars.client=="MERCY" || globalvars.client == "MSH")? 210:130, fixed: true, align: 'center',sorttype: "int"},


                    {name: 'preBillAuditor', index: 'preBillAuditor', width: 250, fixed: true, editable: true, sortable: false, classes: 'grid_cell_style'},
                    {name: 'preBillSelectedAuditor', index: 'preBillSelectedAuditor', hidden: true, search: true},
                    // {name: 'facilitySelectedList', index: 'facilitySelectedList', hidden: true, search: true},
                    {name: 'originalPreBillSelectedAuditor', index: 'originalPreBillSelectedAuditor', hidden: true, search: true},
                    // {name: 'originalfacilitySelectedList', index: 'originalfacilitySelectedList', hidden: true, search: true}
                    {name: 'queueAuditors', index: 'queueAuditors', width: 140, fixed: true, editable: false, sortable: false, classes: 'grid_cell_style'}


                ],
                onSelectRow: function(id) {

                    gridPhysician.loadPhysicianAuditorAssignmentGrid.savePreviousRow();
                    gridPhysician.loadPhysicianAuditorAssignmentGrid.selectedRow = id;   

                    var preBillAuditorDropDown = new String();
                    preBillAuditorDropDown = "<div class='prebill_auditor_selector_div'><select id='prebill_auditor_dropdown" + id + "' multiple='multiple' onchange='gridPhysician.loadPhysicianAuditorAssignmentGrid.preBillAuditorChange(this," + id + ")' style=width:200px>";
                    preBillAuditorDropDown += globalvars.auditorOptions;
                    preBillAuditorDropDown += "</select></div>";

                    // var facilityDropDown = new String();
                    // facilityDropDown = "<div class='prebill_auditor_selector_div'><select id='postbill_auditor_dropdown" + id + "' multiple='multiple' onchange='gridPhysician.loadPhysicianAuditorAssignmentGrid.postBillAuditorChange(this," + id + ")' style=width:280px;>";
                    // facilityDropDown += globalvars.facilityOptions;
                    // facilityDropDown += "</select></div>";

                    gridPhysician.loadPhysicianAuditorAssignmentGrid.$gridDiv.jqGrid('editRow', id, true);

                    gridPhysician.loadPhysicianAuditorAssignmentGrid.$gridDiv.jqGrid('setCell', id, 'preBillAuditor', preBillAuditorDropDown);
                    // gridPhysician.loadPhysicianAuditorAssignmentGrid.$gridDiv.jqGrid('setCell', id, 'facilityList', facilityDropDown);

                    var preBillSelectedAuditortext = gridPhysician.loadPhysicianAuditorAssignmentGrid.$gridDiv.jqGrid('getCell', id, 'preBillSelectedAuditor');
                    var preBillRetainAuditorList = preBillSelectedAuditortext.split(",");

                    // var postBillSelectedAuditortext = gridPhysician.loadPhysicianAuditorAssignmentGrid.$gridDiv.jqGrid('getCell', id, 'facilitySelectedList');
                    // var postBillRetainAuditorList = postBillSelectedAuditortext.split(",");


                    $("#prebill_auditor_dropdown" + id).val(preBillRetainAuditorList);
                    $("#prebill_auditor_dropdown" + id).multiselect({
                        multiple: true,
                        minWidth: 230,
                        selectedList: 40
                    })
                            .multiselectfilter();

                    // $("#postbill_auditor_dropdown" + id).val(postBillRetainAuditorList);
                    // $("#postbill_auditor_dropdown" + id).multiselect({
                    //     multiple: true,
                    //     minWidth: 230,
                    //     selectedList: 40
                    // })
                    //         .multiselectfilter();

                    log('clicked ' + id + " " + gridPhysician.loadPhysicianAuditorAssignmentGrid.$gridDiv.getRowData(id));
                },
                editurl: 'clientArray',
                ignoreCase: true,
                onPaging: function() {
                    gridPhysician.loadPhysicianAuditorAssignmentGrid.savePreviousRow();
                    gridPhysician.loadPhysicianAuditorAssignmentGrid.selectedRow = undefined;
                },
                onSortCol: function() {
                    gridPhysician.loadPhysicianAuditorAssignmentGrid.savePreviousRow();
                    gridPhysician.loadPhysicianAuditorAssignmentGrid.selectedRow = undefined;
                },
                cmTemplate: {title: false},
                loadComplete: function() {
                    // gridPhysician.loadAuditorAssignmentGrid.$gridDiv.jqGrid('setLabel', 'hospitalName', '', {'text-align': 'left', 'padding-left': '16px', 'width': '256px'});
                    // gridPhysician.loadAuditorAssignmentGrid.$gridDiv.jqGrid('setLabel', 'preBillAuditor', '', {'text-align': 'left', 'padding-left': '16px', 'width': '336px'});
                    // gridPhysician.loadAuditorAssignmentGrid.$gridDiv.jqGrid('setLabel', 'postBillAuditor', '', {'text-align': 'left', 'padding-left': '16px', 'width': '356px'});
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
            gridPhysician.loadPhysicianAuditorAssignmentGrid.$gridDiv.jqGrid('setCell', id, 'preBillSelectedAuditor', selected_auditor_list_prebill);

        },
        // postBillAuditorChange: function(selectObj, id) {

        //     var postbill_auditors = $("#postbill_auditor_dropdown" + id).multiselect("getChecked");
        //     var selected_auditor_list_postbill = new Array();
        //     //log(postbill_auditors); /*Use the Log statement when required*/
        //     for (var i = 0; i < postbill_auditors.length; i++) {
        //         //log($(postbill_auditors[i]).attr('value')); /*Use the Log statement when required*/
        //         selected_auditor_list_postbill.push($(postbill_auditors[i]).attr('value'));

        //     }
        //     gridPhysician.loadPhysicianAuditorAssignmentGrid.$gridDiv.jqGrid('setCell', id, 'facilitySelectedList', selected_auditor_list_postbill);

        // },
        savePreviousRow: function() {
            // if (gridPhysician.loadPhysicianAuditorAssignmentGrid.selectedRow !== undefined) {
            //     gridPhysician.loadPhysicianAuditorAssignmentGrid.$gridDiv.jqGrid('saveRow', gridPhysician.loadPhysicianAuditorAssignmentGrid.selectedRow);
            //     var prebill_auditors_text = gridPhysician.loadPhysicianAuditorAssignmentGrid.$gridDiv.jqGrid('getCell', gridPhysician.loadPhysicianAuditorAssignmentGrid.selectedRow, 'preBillSelectedAuditor');
            //     if(prebill_auditors_text)
            //          var prebill_auditors_list = prebill_auditors_text.split(",");
            //     var current_prebill_auditors_text = new String();

            //     var preBillOriginalAuditortext = gridPhysician.loadPhysicianAuditorAssignmentGrid.$gridDiv.jqGrid('getCell', gridPhysician.loadPhysicianAuditorAssignmentGrid.selectedRow, 'originalPreBillSelectedAuditor');
            //     if(preBillOriginalAuditortext)
            //         var preBillOriginalAuditorList = preBillOriginalAuditortext.split(",");

            //     // var postBillOriginalAuditortext = gridPhysician.loadPhysicianAuditorAssignmentGrid.$gridDiv.jqGrid('getCell', gridPhysician.loadPhysicianAuditorAssignmentGrid.selectedRow, 'originalfacilitySelectedList');
            //     // var postBillOriginalAuditorList = postBillOriginalAuditortext.split(",");

            //     var currentHospitalId = gridPhysician.loadPhysicianAuditorAssignmentGrid.$gridDiv.jqGrid('getCell', gridPhysician.loadPhysicianAuditorAssignmentGrid.selectedRow, 'hospIndex');
            //     var hospitalIndex;
            //     var auditorNotFound = false;

                               
            //     if(prebill_auditors_list && preBillOriginalAuditorList){
            //         if (preBillOriginalAuditorList.length != prebill_auditors_list.length) {
            //             hospitalIndex = jQuery.inArray(currentHospitalId, screens.physicianAuditorAssignment.uniqueHospitalList);
            //             if (hospitalIndex === -1) {
            //                 screens.physicianAuditorAssignment.uniqueHospitalList.push(currentHospitalId);
            //             }
            //         } 
            //     }else if(prebill_auditors_list){
            //             if (prebill_auditors_list.length != 0) {
            //                 hospitalIndex = jQuery.inArray(currentHospitalId, screens.physicianAuditorAssignment.uniqueHospitalList);
            //                 if(preBillOriginalAuditorList){
            //                     for (var j = 0; j < preBillOriginalAuditorList.length; j++) {
            //                         var index = jQuery.inArray(preBillOriginalAuditorList[j], prebill_auditors_list);
            //                         if (index === -1) {
            //                             auditorNotFound = true;
            //                         }
            //                     }
            //                 }
            //             if (auditorNotFound === true) {
            //                 if (hospitalIndex === -1) {
            //                     screens.physicianAuditorAssignment.uniqueHospitalList.push(currentHospitalId);
            //                 }
            //             } else {
            //               if(hospitalIndex!= -1){
            //                   screens.physicianAuditorAssignment.uniqueHospitalList.splice(hospitalIndex,1);
            //               }
            //             }
            //         }
            //     }

            //     if(prebill_auditors_list){
            //         for (var i = 0; i < prebill_auditors_list.length; i++) {
            //             current_prebill_auditors_text += prebill_auditors_list[i] + "<br/>";
            //         }
            //         gridPhysician.loadPhysicianAuditorAssignmentGrid.$gridDiv.jqGrid('setCell', gridPhysician.loadPhysicianAuditorAssignmentGrid.selectedRow, 'preBillAuditor', current_prebill_auditors_text);
            //     }
            // }











            if (gridPhysician.loadPhysicianAuditorAssignmentGrid.selectedRow !== undefined) {

                gridPhysician.loadPhysicianAuditorAssignmentGrid.$gridDiv.jqGrid('saveRow', gridPhysician.loadPhysicianAuditorAssignmentGrid.selectedRow);
                var prebill_auditors_text = gridPhysician.loadPhysicianAuditorAssignmentGrid.$gridDiv.jqGrid('getCell', gridPhysician.loadPhysicianAuditorAssignmentGrid.selectedRow, 'preBillSelectedAuditor');
                var prebill_auditors_list = prebill_auditors_text.split(",");
                
                var current_prebill_auditors_text = new String();

                var preBillOriginalAuditortext = gridPhysician.loadPhysicianAuditorAssignmentGrid.$gridDiv.jqGrid('getCell', gridPhysician.loadPhysicianAuditorAssignmentGrid.selectedRow, 'originalPreBillSelectedAuditor');
                var preBillOriginalAuditorList = preBillOriginalAuditortext.split(",");


                var currentHospitalId = gridPhysician.loadPhysicianAuditorAssignmentGrid.$gridDiv.jqGrid('getCell', gridPhysician.loadPhysicianAuditorAssignmentGrid.selectedRow, 'source');
                var hospitalIndex;
                var auditorNotFound = false;

              


                if (preBillOriginalAuditorList.length != prebill_auditors_list.length) {
                    hospitalIndex = jQuery.inArray(currentHospitalId, screens.physicianAuditorAssignment.uniqueHospitalList);
                    if (hospitalIndex === -1) {
                        screens.physicianAuditorAssignment.uniqueHospitalList.push(currentHospitalId);
                    }
                } else if (prebill_auditors_list.length != 0) {
                    hospitalIndex = jQuery.inArray(currentHospitalId, screens.physicianAuditorAssignment.uniqueHospitalList);
                    for (var j = 0; j < preBillOriginalAuditorList.length; j++) {
                        var index = jQuery.inArray(preBillOriginalAuditorList[j], prebill_auditors_list);
                        if (index === -1) {
                            auditorNotFound = true;
                        }
                    }
                    if (auditorNotFound === true) {
                        if (hospitalIndex === -1) {
                            screens.physicianAuditorAssignment.uniqueHospitalList.push(currentHospitalId);
                        }
                    }
                }



                for (var i = 0; i < prebill_auditors_list.length; i++) {
                    current_prebill_auditors_text += prebill_auditors_list[i] + "<br/>";
                }
                gridPhysician.loadPhysicianAuditorAssignmentGrid.$gridDiv.jqGrid('setCell', gridPhysician.loadPhysicianAuditorAssignmentGrid.selectedRow, 'preBillAuditor', current_prebill_auditors_text);
            

            }





            
        },
        fillGrid: function() {
            var datalength = this.data.length;
            var preBillAuditors;
            var preBillAuditorsText;
            var preBillSelectedAuditors;

            // var postBillAuditors;
            // var postBillAuditorText;
            // var postBillSelectedAuditors;
           
            for (var i = 0; i < datalength; i++) {
                preBillAuditors = new Array();
                preBillAuditors = gridPhysician.loadPhysicianAuditorAssignmentGrid.data[i].auditorData;
                preBillAuditorsText = new String();
                preBillSelectedAuditors = new Array();
                for (var j = 0; j < preBillAuditors.length; j++) {
                    preBillAuditorsText += preBillAuditors[j] + '<br/>';
                    preBillSelectedAuditors.push(preBillAuditors[j]);
                }

                // postBillAuditors = new Array();
                // postBillAuditors = gridPhysician.loadPhysicianAuditorAssignmentGrid.data[i].hospitalData;
                // postBillAuditorText = new String();
                // postBillSelectedAuditors = new Array();
                // for (var k = 0; k < postBillAuditors.length; k++) {
                //     postBillAuditorText += postBillAuditors[k] + '<br/>';
                //     postBillSelectedAuditors.push(postBillAuditors[k]);
                // }

                screens.physicianAuditorAssignment.filterList.push(gridPhysician.loadPhysicianAuditorAssignmentGrid.data[i].source);
                screens.physicianAuditorAssignment.filterList.push(gridPhysician.loadPhysicianAuditorAssignmentGrid.data[i].costCenter);
               // screens.physicianAuditorAssignment.filterList.push(gridPhysician.loadPhysicianAuditorAssignmentGrid.data[i].hospitalId);


                gridPhysician.loadPhysicianAuditorAssignmentGrid.$gridDiv.jqGrid('addRowData', i + 1, {
                    hospIndex:i,
                    source: gridPhysician.loadPhysicianAuditorAssignmentGrid.data[i].source,
                    costCenter: gridPhysician.loadPhysicianAuditorAssignmentGrid.data[i].costCenter,
                    hospitalId: gridPhysician.loadPhysicianAuditorAssignmentGrid.data[i].hospitalId,
                    shortName:gridPhysician.loadPhysicianAuditorAssignmentGrid.data[i].shortName,
                    total:gridPhysician.loadPhysicianAuditorAssignmentGrid.data[i].total,
                    preBillAuditor: preBillAuditorsText,
                    // facilityList: postBillAuditorText,
                    preBillSelectedAuditor: preBillSelectedAuditors,
                    // facilitySelectedList: postBillSelectedAuditors,
                    originalPreBillSelectedAuditor: preBillSelectedAuditors,
                    queueAuditors:gridPhysician.loadPhysicianAuditorAssignmentGrid.data[i].queueAuditors.join('</br>')

                    // originalfacilitySelectedList: postBillSelectedAuditors
                    

                });
            }
            gridPhysician.loadPhysicianAuditorAssignmentGrid.$gridDiv.setGridParam({rowNum: 30}).trigger("reloadGrid");
        }
    },
loadPhysicianAssignmentBreakupGrid: {
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
            this.data = window["globalvars"]["auditorAssignmentBreakupData"];
            this.$gridDiv = $(this.gridDiv);
            this.loadGrid();
            this.fillGrid();
            this.$gridDiv.setGridParam({rowNum: 30, sortname: 'hidden'}).trigger("reloadGrid");
        },
        loadGrid: function() {
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
                altRows: true,
                altclass: 'alternate_row_color',
                sortname: 'rank',
                viewsortcols: [false, 'vertical', true],
                colNames: ['Source','Service Line','Facility','Facility Name','Auditor','# Codes <br>Assigned'],
                colModel: [
                   // {name: 'hidden', width: 10, hidden: true, key: true},
                    {name: 'source', width: 150, align: "center", fixed: true,sortable: true},
                    {name: 'costCenter', width: 150, align: 'center', sortable: true, fixed: true,align: "center"},
                    {name: 'hospitalId', width: 100, fixed: true,align: "center",sortable: true}, 
                    {name: 'shortName', width: 200, fixed: true,align: "center",sortable: true},         
                    {name: 'userId', width: 300, fixed: true,align: "center",sortable: true},         
                    {name: 'count', width: 150, sorttype: "int", fixed: true,align: "center",formatter:'integer',formatoptions : {thousandsSeparator: "," }}
                    ],
                onSelectRow: this.onClick,
                loadComplete: function() {

                    // var gridRowData = gridPhysician.loadPhysicianAssignmentBreakupGrid.$gridDiv.jqGrid('getRowData');
                    // var gridRowDataLength = gridRowData.length;
                    // for (var i = 0; i < gridRowDataLength; i++) {
                    //     if (gridRowData[i].isHighlighted == "true") {
                    //         log("isHighlighted " + gridRowData[i].accountId + " : " + (i + 1));
                    //         $(("#prebill_grid_table tr#" + (parseInt(gridRowData[i].index,10) + 1))).addClass("highlighted_row");
                    //     }
                    //     ;
                    // }
                    // ;
                    
                }
            });
        },
        fillGrid: function() {
            var datalength = this.data.length;

            for (var i = 0; i < datalength; i++) {
                gridPhysician.loadPhysicianAssignmentBreakupGrid.data[i].index = i;
                gridPhysician.loadPhysicianAssignmentBreakupGrid.$gridDiv.jqGrid('addRowData', i + 1, gridPhysician.loadPhysicianAssignmentBreakupGrid.data[i]);
            }
            ;

            gridPhysician.loadPhysicianAssignmentBreakupGrid.$gridDiv.setGridParam({rowNum: 30}).trigger("reloadGrid");

           
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

                    var rowData = gridPhysician.ruleSummaryGrid.$gridDiv.jqGrid('getRowData', id);
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
                 gridPhysician.ruleSummaryGrid.data[i].index = i;
                 gridPhysician.ruleSummaryGrid.$gridDiv.jqGrid('addRowData', i + 1, gridPhysician.ruleSummaryGrid.data[i]);
             }
             ;

             gridPhysician.ruleSummaryGrid.$gridDiv.setGridParam({rowNum: 30}).trigger("reloadGrid");
            
            
            
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
    loadLiveSummaryByFacilityGrid: function(param) { // param object holds gridDiv, data
        var $gridDiv = $(param.gridDiv);
        var datalength = param.data.length;
        $gridDiv.jqGrid({
            datatype: "jsonstring",
            datastr: param.data,
            autowidth: true,
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
                       '# Hit Accounts','$ Amount Found'],
            colModel: [
                {name: 'hospitalId', index: 'hospitalId', width: 80, fixed: true, sortable: true, sorttype: "int", classes: 'cell_wrapperleaf_new'},
                {name: 'name', index: 'name', width: 290, fixed: true, sortable: true, sorttype: "string", classes: 'grid_cell_style'},
                {name: 'totalAccounts', index: 'totalAccounts', width: 80, align: 'center', fixed: true, sortable: true, sorttype: "int",formatter:'integer',formatoptions : {thousandsSeparator: "," }},
                {name: 'completed', index: 'completed', width: 80, align: 'center', fixed: true, sortable: true, sorttype: "int",

                    formatter: function (cellvalue) {

                        return '<span class="cellWithoutBackground" style="background-color:' + gridPhysician.getColorCode(cellvalue) + ';">' + numberWithCommas(cellvalue) + '</span>';
                        }
                },
                {name: 'reviewed', index: 'reviewed', width: 80, align: 'center', fixed: true, sortable: true, sorttype: "int"},
                {name: 'remaining', index: 'remaining', width: 80, fixed: true, sortable: true, sorttype: "int", align: 'center',formatter:'integer',formatoptions : {thousandsSeparator: ","}},
                {name: 'hitCount', index: 'hitCount', width: 80, fixed: true, sortable: true, sorttype: "int", align: 'center',formatter:'integer',formatoptions : {thousandsSeparator: ","}},
                {name: 'hitValue', index: 'hitValue', width: 80, fixed: true, sortable: true, sorttype: "int", align: 'center',formatter:'integer',formatoptions : {thousandsSeparator: ",",prefix: "$"}}
            ],
            loadComplete: function() {
 
            }
        });

    },

    loadLiveSummaryByAuditorGrid: function(param) { // param object holds gridDiv, data
        var $gridDiv = $(param.gridDiv);
        var datalength = param.data.length;
        $gridDiv.jqGrid({
            datatype: "jsonstring",
            datastr: param.data,
            autowidth: true,
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
                       "# " + globalvars.localResourceMap.live_summary_grid_hit_account,'$ Amount <br>Found'],
            colModel: [
                {name: 'userId', index: 'userId', width: 150, fixed: true, sortable: true, sorttype: "int", classes: 'cell_wrapperleaf_new'},
                {name: 'name', index: 'name', width: 220, fixed: true, sortable: true, sorttype: "string", classes: 'grid_cell_style'},
                {name: 'totalAccounts', index: 'totalAccounts', width: 80, align: 'center', fixed: true, sortable: true, sorttype: "int",formatter:'integer',formatoptions : {thousandsSeparator: ","}},
                {name: 'completed', index: 'completed', width: 80,  align: 'center', fixed: true, sortable: true, sorttype: "int",
                    formatter: function (cellvalue) {

                    return '<span class="cellWithoutBackground" style="background-color:' + gridPhysician.getColorCode(cellvalue) + ';">' + numberWithCommas(cellvalue) + '</span>';
                    }

                },
                {name: 'reviewed', index: 'reviewed', width: 80, align: 'center', fixed: true, sortable: true, sorttype: "int"},
                {name: 'remaining', index: 'remaining', width: 80, fixed: true, sortable: true, sorttype: "int", align: 'center',formatter:'integer',formatoptions : {thousandsSeparator: ","}},
                {name: 'hitCount', index: 'hitCount', width: 80, fixed: true, sortable: true, sorttype: "int", align: 'center',formatter:'integer',formatoptions : {thousandsSeparator: ","}},
                {name: 'hitValue', index: 'hitValue', width: 80, fixed: true, sortable: true, sorttype: "int", align: 'center',formatter:'integer',formatoptions : {thousandsSeparator: "," ,prefix: "$"}}
            ],
            loadComplete: function() {


            }
        });

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
                
                
                colNames: ['Queue Name','Auditor','priority','Status','','',''],
                colModel: [
                    
                    {name: 'ruleId', index: 'ruleId', width: 300, align: 'left',sortable: true,sorttype: "string",classes: 'accountlist-account-cursor'},
                    {name: 'auditorId', index: 'auditorId', width: 300, align: 'center', fixed: true, sortable: true,sorttype: "string"},
                    // {name: 'billType', width: 240,  fixed: true, sortable: true,sorttype: "string",align: 'center'}, 
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
                    {name: 'status', index: 'status', width: 300, align: 'center', fixed: true, sortable: true},

                    {name: 'ruleDesc', index: 'ruleDesc', width: 300, fixed: true, sortable: true, sorttype: "int", classes: 'cell_wrapperleaf_new',hidden:true},
                    {name: 'ruleJson', index: 'ruleJson', width: 400, align: 'left', fixed: true, sortable: true,classes:'jqgrid-wrapText',hidden:true},
                    {name: 'computedQuery', index: 'computedQuery', width: 400, align: 'left', fixed: true, sortable: true, sorttype: "int",classes:'jqgrid-wrapText',hidden:true},
                    
                ],
                onSelectRow: function(id, status, e) {
                    if (gridPhysician.auditorQueueListGrid.selectedRow !== undefined) {
                        gridPhysician.auditorQueueListGrid.$gridDiv.jqGrid('saveRow', gridPhysician.auditorQueueListGrid.selectedRow);
                    }
                    gridPhysician.auditorQueueListGrid.selectedRow = id;
                    gridPhysician.auditorQueueListGrid.$gridDiv.jqGrid('editRow',id, true, false, false, false, false, false,false, afterrestorefunc);
                    function afterrestorefunc(e){
                        gridPhysician.auditorQueueListGrid.$gridDiv.trigger('jqGridInlineAfterSaveRow');
                     }

                //     log('missing Charges ID clicked ' + id + " " + gridPhysician.auditorQueueListGrid.selectedRow);
                },
                loadComplete: function() {
                }
            });

            this.$gridDiv.unbind("jqGridInlineAfterSaveRow");
            this.$gridDiv.bind("jqGridInlineAfterSaveRow", function(rowid) {
                log("jqGridInlineAfterSaveRow");
               var selectedRowData = gridPhysician.auditorQueueListGrid.$gridDiv.jqGrid('getRowData', gridPhysician.auditorQueueListGrid.selectedRow);
                gridPhysician.auditorQueueListGrid.$gridDiv.jqGrid('setRowData', gridPhysician.auditorQueueListGrid.selectedRow, selectedRowData);
                gridPhysician.auditorQueueListGrid.savedSuccessfully = true;
            });
        },
        fillGrid: function() {
             var datalength = this.data.length;
             for (var i = 0; i < datalength; i++) {
                 gridPhysician.auditorQueueListGrid.data[i].index = i;
                 gridPhysician.auditorQueueListGrid.data[i].auditorId = gridPhysician.auditorQueueListGrid.data[i].auditorList.join('<br>');
                 //gridPhysician.auditorQueueListGrid.data[i].billType = (gridPhysician.auditorQueueListGrid.data[i].primaryTable == 'T_PREDICTIONS_PRE')?'PRE' : 'POST';
                 //if(gridPhysician.auditorQueueListGrid.data[i].billTypeAll == 1)
                 //   gridPhysician.auditorQueueListGrid.data[i].billType = 'PRE,POST';
                 gridPhysician.auditorQueueListGrid.data[i].status = (gridPhysician.auditorQueueListGrid.data[i].active == 1)?'Active' : 'In-Active';
                 gridPhysician.auditorQueueListGrid.$gridDiv.jqGrid('addRowData', i + 1, gridPhysician.auditorQueueListGrid.data[i]);
             }
             ;
             gridPhysician.auditorQueueListGrid.$gridDiv.setGridParam({rowNum: 30}).trigger("reloadGrid");
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
                
                
                colNames: ['','Query Name','Sent Flag','Code Level','Status','Run Status','Last Modified By','Last Updated Time','Run At'],
                colModel: [
                    {name: 'rowId', index: 'rowId',hidden:true},
                    {name: 'ruleName', index: 'ruleName', width: 140, align: 'center',sortable: true,sorttype: "string",classes: 'accountlist-account-cursor'},
                    // {name: 'billType', index: 'billType', width: 120, align: 'center',sorttype: true},
                    {name: 'sentFlag', index: 'sentFlag', width: 140, align: 'center', fixed: true, sortable: true,sorttype: "string"},
//                  
                    {name: 'codeLevel', width: 140,  fixed: true, sortable: true,sorttype: "string",align: 'center'}, 
//                  {name: 'name', index: 'name', width: 120, fixed: true, sortable: true, sorttype: "string", classes: 'grid_cell_style'},
//                  
                    
                    {name: 'isActive', index: 'isActive', width: 80, align: 'center', fixed: true, sortable: true},
                    {name: 'isRun', index: 'isRun', width: 80, align: 'center', fixed: true, sortable: true},
                    {name: 'modifiedBy', index: 'modifiedBy', width: 140, fixed: true, sortable: true, sorttype: "string", align: 'center'},
                    
                    {name: 'updateTime', index: 'updateTime', width: 180, fixed: true, sortable: true, sorttype: "string",align: 'center'},
                    {name: 'runAt', index: 'runAt', width: 180, align: 'center', fixed: true, sortable: true}
                    
                 
                ],
                onSelectRow: function(id, status, e) {

                    var rowData = gridPhysician.CodesSummaryGrid.$gridDiv.jqGrid('getRowData', id);
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
                                        $("#sub_menu #Configuration li.submenu_item").eq(3).click();
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
                 gridPhysician.CodesSummaryGrid.data[i].index = i;
                 gridPhysician.CodesSummaryGrid.$gridDiv.jqGrid('addRowData', i + 1, gridPhysician.CodesSummaryGrid.data[i]);
             }
             ;

             gridPhysician.CodesSummaryGrid.$gridDiv.setGridParam({rowNum: 30}).trigger("reloadGrid");
            

        }
    },
    accountsSummaryGrid: {
        gridDiv: "",
        $gridDiv: {},
        pagerDiv: "",
        data: {},
        initialize: function(param) {
        	console.log(param);
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
                
                
                colNames: ['','Query Name','Status','Run Status','Last Modified By','Last Updated Time','Run At'],
                colModel: [
                    {name: 'rowId', index: 'rowId',hidden:true},
                    {name: 'ruleName', index: 'ruleName', width: 140, align: 'center',sortable: true,sorttype: "string",classes: 'accountlist-account-cursor'},
                    // {name: 'billType', index: 'billType', width: 120, align: 'center',sorttype: true},
                    //{name: 'sentFlag', index: 'sentFlag', width: 140, align: 'center', fixed: true, sortable: true,sorttype: "string"},
//                  
                    //{name: 'codeLevel', width: 140,  fixed: true, sortable: true,sorttype: "string",align: 'center'}, 
//                  {name: 'name', index: 'name', width: 120, fixed: true, sortable: true, sorttype: "string", classes: 'grid_cell_style'},
//                  
                    
                    {name: 'isActive', index: 'isActive', width: 180, align: 'center', fixed: true, sortable: true},
                    {name: 'isRun', index: 'isRun', width: 180, align: 'center', fixed: true, sortable: true},
                    {name: 'modifiedBy', index: 'modifiedBy', width: 180, fixed: true, sortable: true, sorttype: "string", align: 'center'},
                    
                    {name: 'updateTime', index: 'updateTime', width: 180, fixed: true, sortable: true, sorttype: "string",align: 'center'},
                    {name: 'runAt', index: 'runAt', width: 180, align: 'center', fixed: true, sortable: true}
                    
                 
                ],
                onSelectRow: function(id, status, e) {

                    var rowData = gridPhysician.accountsSummaryGrid.$gridDiv.jqGrid('getRowData', id);
                    var colIndex = $(e.target).index();
                //    console.log(colIndex);
                    if(colIndex==1){
                        //var gridData = grids.ruleSummaryGrid.$gridDiv.jqGrid("getGridParam", "dataNew");
                        if(rowData){

                            $.ajax({
                                type: 'GET',
                                url: globalvars.root.setEvScoreList+"/ruleDetail",
                                data: {"rowId": rowData.rowId},
                                dataType: "json",
                                success: function(data) {
                                    if(data){
                                        ruleSummary = data;
                                        sessionStorage.setItem('codeSummary', JSON.stringify(ruleSummary));            
                                        $("#sub_menu #Configuration li.submenu_item").eq(5).click();
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
                 gridPhysician.accountsSummaryGrid.data[i].index = i;
                 gridPhysician.accountsSummaryGrid.$gridDiv.jqGrid('addRowData', i + 1, gridPhysician.accountsSummaryGrid.data[i]);
             }
             ;

             gridPhysician.accountsSummaryGrid.$gridDiv.setGridParam({rowNum: 30}).trigger("reloadGrid");
            

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




    }







};



var gridPhysicianGlobal = {

    missingPhysicianChargesGrid: {
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
        global:'',
        initialize: function(param) {
            gridPhysicianGlobal.missingPhysicianChargesGrid.isConfirmCharg = param.isConfirmCharg;
            this.$gridDiv = $(param.gridDiv);
            this.global = param.globalVar;
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
                height: '200',
                gridview: true,
                viewrecords: true,
                altRows: true,
                altclass: 'alternate_row_color',
                sortorder: 'asc',
                colNames: [ 'id',
                            'Prediction',
                            (globalvars.client == "MSH")?'Clinic':'Dept',
                           'Procedure', 
                           'Desc',
                           globalvars.localResourceMap.missing_charge_price,
                            'Modifier',
                           globalvars.localResourceMap.missing_charge_add_qty, 
                           globalvars.localResourceMap.missing_charge_date_of_service, 
                           'pos',
                           'Serving Phys',
                           'Billing Phys',
                           'Diag Codes',
                           'Primary Diag',
                           globalvars.localResourceMap.missing_charge_response, 
                           globalvars.localResourceMap.missing_charge_response_code,
                           'claim #', 
                           globalvars.localResourceMap.missing_charge_comment,'','','','','','','','','','','Sent Flag'],
                            
                colModel: [
                    {name: 'id', index: 'id', key: true, hidden: true},
                    {
                        name: 'predCode', index: 'predCode', width:70, fixed: true, sortable: true, sorttype: "string", align: "center"
                    },
                    {name: 'deptPhys', index: 'deptPhys', fixed: true, width: 60},
                    {name: 'hcpcCode', index: 'hcpcCode', width:80, fixed: true, sorttype: "int", align: "center"},
                    {name: 'chargeDesc', index: 'chargeDesc', fixed: true, width: 60, classes: 'grid_cell_style'},
                    
                    

                    {name: 'price', index: 'price', width: 50, fixed: true, sortable: true, sorttype: "int", align: "center",formatter:'currency',
                     formatoptions: { decimalSeparator: ".", thousandsSeparator: ",", prefix: "$",decimalPlaces: 1, defaultValue: '0.0' }},
                    {name: 'modifier', index: 'modifier', fixed: true, width: 70, classes: 'grid_cell_style',align: "center"},

                    {
                        name: 'qty', index: 'qty', width: 50, fixed: true, sortable: true, sorttype: "int", editable: this.isEditable, align: "center",
                        edittype: "text",
                        editoptions: {
                            size: "3",
                            maxlength: "3",
                            minValue: 1
                        }
                       
                    },
                    {name: 'dateOfService', index: 'dateOfService', width: 60, fixed: true, sortable: true, sorttype: "date", datefmt: "Y-m-d h:i:s", editable: this.isEditable, align: "center",
                    editoptions:{
                                            readonly: 'readonly'
                                 }},
                    {name: 'pos', index: 'pos', fixed: true, width: 40,align: "center"},
                    {name: 'npi', index: 'npi', fixed: true, width: 70,align: "center"},
                    {name: 'billPhys', index: 'billPhys', fixed: true, width: 70},
                    {name: 'diag', index: 'diag', fixed: true, width: 70,align: "center"},
                    {name: 'primaryDiag', index: 'primaryDiag', fixed: true, width: 70,align: "center"},
                    {name: 'response', index: 'response', fixed: true, width: 70, classes: 'grid_cell_style'},
                    {name: 'responseCode', hidden: true},
                    {name: 'claimNumber', index: 'claimNumber', width: 50, fixed: true,editable: this.isEditable,editoptions: {maxlength: "50"}}, 
                    {name: 'comments', index: 'comments', width: 70, fixed: true, editable: this.isEditable,  editoptions: {
                            size: "7",
                            maxlength: "500",
                        },
                        classes: 'grid_cell_style'},
                        {name: 'predCode', hidden: true},
                        {name: 'isNew', hidden: true}, 
                        {name: 'predKey', index: 'predKey',hidden:true},
                        {name: 'rowEditable', index: 'rowEditable',hidden:true},
                        {name: 'cenAuditorId', index: 'cenAuditorId',hidden:true},
                    {name: 'cenAuditingTime', index: 'cenAuditingTime',hidden:true} ,

                    {name: 'preBillSelectedAuditor', index: 'preBillSelectedAuditor', hidden: true, search: true},
                    {name: 'accountSelectedDiag', index: 'accountSelectedDiag', hidden: true, search: true},
                    {name: 'source', index: 'source',hidden:true},
                    {name: 'costCenter', index: 'costCenter',hidden:true},
                    {name: 'sentFlag', index: 'sentFlag',fixed: true,width:40},




   
                ],
                editurl: 'clientArray',
                loadComplete: function() {
                    
                    $(("#account_details_missing_charges_grid_table_global tr")).removeClass('highlighted_row');
                      // gridPhysicianGlobal.missingPhysicianChargesGrid.$gridDiv.trigger("reloadGrid");
                      var gridRowData = gridPhysicianGlobal.missingPhysicianChargesGrid.$gridDiv.jqGrid('getRowData');
                      var gridRowDataLength = gridRowData.length;

                    //  console.log(gridRowData);

                     
                      for (var i = 0; i < gridRowDataLength; i++) {
                          if ((gridRowData[i].rowEditable == "false" || gridRowData[i].rowEditable == false) || (gridRowData[i].cenAuditorId != globalvars.user.userId) && (globalvars.user.uType == globalvars.roles.physicianUser)) {
                              log("isHighlighted " + gridRowData[i].isNew + " : " + (i + 1));
                              var searchId = gridRowData[i].id;
                         //     console.log(searchId);
                                    $(("#account_details_missing_charges_grid_table_global tr#" + (searchId))).addClass("highlighted_row");
                          }
                      }

                      $("#account_details_missing_charges_grid_table_global tbody tr").each(function(){
                            var rowId1 = $(this).find('td:eq(21)');
                            var rowId2 = $(this).find('td:eq(22)');
                            if($(rowId1).text() != "" && $(rowId2).text() != ""){

                                if((($(rowId1).text() == false)||($(rowId2).text() != globalvars.user.userId)) && (globalvars.user.uType == globalvars.roles.physicianUser)){
                                    $(this).find('td').tooltip({
                                    content: function(response) {
                                      //  console.log($(this).index());
                                        if($(this).index() == 1){
                                            if(this.parentNode){    
                                                var rowData = gridPhysicianGlobal.missingPhysicianChargesGrid.$gridDiv.jqGrid('getRowData',this.parentNode.id);
                                                return '<b>Assigned to: </b>' + rowData.cenAuditorId+"<br/><b>Submitted on: </b>" + rowData.cenAuditingTime;
                                            }
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
                        }
                    })

                }

            });
        },
        fillGrid: function(data) {
            this.$gridDiv.clearGridData();
            var datalength = data.length;
            for (var i = 0; i < datalength; i++) {
                data[i].preBillSelectedAuditor = data[i].modifier;
                data[i].accountSelectedDiag = data[i].diag;

                
                this.$gridDiv.jqGrid('addRowData', i + 1, data[i]);
            }

            this.$gridDiv.setGridParam({dataNew: data});

            this.$gridDiv.setGridParam({rowNum: datalength}).trigger("reloadGrid");
        }
     
    },
    otherPhysicianChargesGrid: {
        $gridDiv: {},
        selectedRow: undefined,
        savedSuccessfully: true,
        isEditable: true,
        billType: "",
        backScreen:"",
        isConfirm:"",
        initialize: function(param) {
            this.$gridDiv = $(param.gridDiv);
            this.isEditable = param.isEditable === false ? false : true;
            this.isConfirm = param.isConfirm;
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
                height: '200',
                gridview: true,
                viewrecords: true,
                altRows: true,
                altclass: 'alternate_row_color',
                colNames: ['id', globalvars.localResourceMap.other_discoved_charge_search, 
                    (globalvars.client == "MSH")?'Clinic':'Dept',
                    'Procedure Code',
                    globalvars.localResourceMap.other_discoved_charge_price,
                    'Modifier',
                    globalvars.localResourceMap.other_discoved_charge_add_qty, 
                    globalvars.localResourceMap.other_charge_date_of_service,
                    'pos',
                    'Serving Phys',
                    'Billing Phys',
                    'Diag Codes',
                    'Primary Diag',
                    'Claim #',
                    // 'Source',
                    // 'cost center',
                    globalvars.localResourceMap.other_discoved_charge_comment,
                    globalvars.localResourceMap.other_discoved_charge_chargeDescription,
                    'predNbr','','','','','','','',''],
                colModel: [
                    {name: 'id', index: 'id', key: true, hidden: true},
                    
                    {name: 'search', index: 'search', width: 80, fixed: true,sortable: false},
                    {name: 'deptPhys', index: 'deptPhys', fixed: true, width: 70},
                    {
                        name: 'hcpcCode', index: 'hcpcCode', editable: false, width: 90, fixed: true, sortable: false, align: "center", sorttype: "string", key: true,
                        editoptions: {
                            size: "5",
                            maxlength: "5"
                        }
                    },
                    {name: 'price', index: 'price', width: 60, fixed: true, sortable: false, sorttype: "int", align: "center",formatter:'currency',
                     formatoptions: { decimalSeparator: ".", thousandsSeparator: ",", prefix: "$",decimalPlaces: 1, defaultValue: '0.0' }},
                    
                    {name: 'modifier', index: 'modifier', fixed: true, width: 80, classes: 'grid_cell_style'},

                    {
                        name: 'quantity', index: 'quantity', editable: this.isEditable, sortable: false, width: 50, fixed: true, align: "center", sorttype: "int",
                        edittype: "text",
                        editoptions: {
                            size: "3",
                            maxlength: "3"
                        },
                        editrules: {
                            custom: true,
                            custom_func: function(value, colname) {
                                if (!(/^[0-9]*[1-9][0-9]*$/.test(value)) || isNaN(value)) {
                                //if (!(/^\d+$/.test(value)) || isNaN(value)) {
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
                    {name: 'dateOfService1', index: 'dateOfService1', width: 80, fixed: true, sortable: false, sorttype: "date", datefmt: "Y-m-d h:i:s", editable: this.isEditable, align: "center",
                        editoptions:{
                                            readonly: 'readonly'
                                 }},
                    {name: 'pos', index: 'pos', fixed: true, width: 60,align: "center"},
                    {name: 'npi', index: 'npi', fixed: true, width:80,align: "center"},
                    {name: 'billPhys', index: 'billPhys', fixed: true, width:70},
                    {name: 'diag', index: 'diag', fixed: true, width: 80,align: "center"},
                    {name: 'primaryDiag', index: 'primaryDiag', fixed: true, width: 80,align: "center"},


                    {name: 'claimNumber', index: 'claimNumber', width:60, editable: this.isEditable,fixed: true, sortable: false, sorttype: "int", align: "center",editoptions: {maxlength: "50"}},            
                    // {name: 'source', index: 'source', fixed: true, width: 120,align: "center"},
                    // {name: 'costCenter', index: 'costCenter', fixed: true, width: 100,align: "center"},

                    {name: 'comments', index: 'comments', editable: this.isEditable, width: 120, fixed: true,  sortable: false, editoptions: {
                            size: "10",
                            maxlength: "500",
                        },
                        classes: 'grid_cell_style'},
                    {name: 'chargeDescription', index: 'chargeDescription', hidden: true},
                    {name: 'predNbr', index: 'predNbr', hidden: true},
                    {name: 'method', index: 'method', hidden: true},
                     {name: 'predKey', index: 'predKey',hidden:true},
                    {name: 'rowEditable', index: 'rowEditable',hidden:true},
                    {name: 'cenAuditorId', index: 'cenAuditorId',hidden:true},
                    {name: 'cenAuditingTime', index: 'cenAuditingTime',hidden:true},
                    {name: 'preBillSelectedAuditorOther', index: 'preBillSelectedAuditorOther', hidden: true, search: true},
                    {name: 'accountSelectedDiagOther', index: 'accountSelectedDiagOther', hidden: true, search: true},
                    {name: 'rowId', index: 'rowId',hidden: true},

                ],
              
               editurl: 'clientArray',
                loadComplete: function() {
                     
                      $(("#account_details_other_charges_grid_table_global tr")).removeClass('highlighted_row');
                     
                      var gridRowData = gridPhysicianGlobal.otherPhysicianChargesGrid.$gridDiv.jqGrid('getRowData');
                      var gridRowDataLength = gridRowData.length;

                     // console.log(gridRowData);

                      var tableGridID = "#account_details_other_charges_grid_table_global";
                     if(gridPhysicianGlobal.otherPhysicianChargesGrid.isConfirm == true){
                         tableGridID = "#account_details_Physician_other_charges_grid_table";
                     }

                     
                      for (var i = 0; i < gridRowDataLength; i++) {
                          if((gridRowData[i].rowEditable == "false" || gridRowData[i].rowEditable == false) && (globalvars.user.uType == globalvars.roles.physicianUser)) {
                              log("isHighlighted " + gridRowData[i].isNew + " : " + (i + 1));
                              var searchId = gridRowData[i].id;
                                    //$(("#account_details_other_charges_grid_table tr#" + (searchId))).addClass("highlighted_row");
                                    $(tableGridID).find("tr#" + (searchId)).addClass("highlighted_row");
                          }
                      }

                            $(tableGridID).find('tr').find('td:eq(19)').each(function(){
                      
                            console.log($(this).text());


                            if($(this).text() == "false" || $(this).text() == false){

                                $(this).parent().find('td').tooltip({
                                content: function(response) {
                                    if($(this).index() != 9){
                                        if(this.parentNode){
                                            var rowData = gridPhysicianGlobal.otherPhysicianChargesGrid.$gridDiv.jqGrid('getRowData',this.parentNode.id);
                                            return '<b>Assigned to: </b>' + rowData.cenAuditorId+"<br/><b>Submitted on: </b>" + rowData.cenAuditingTime;
                                        }
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
                        ///////////// temp close
                   })

                  // gridPhysicianGlobal.otherPhysicianChargesGrid.$gridDiv.jqGrid('setLabel', 'comments', '', {'text-align': 'left', 'padding-left': '40px', 'width': '236px'});

                }

            });

       
        },
        fillGrid: function(data) {
            var searchDiv = '<div class="other_discover_search_wrapper"><img class="search_cell_del" src="common/images/account-details/delete-icon.png"><img class="search_cell_search" src="common/images/account-details/search-icon.png"></div>';
            this.$gridDiv.clearGridData();
            var datalength = data.length;
            for (var i = 0; i < datalength; i++) {
                data[i].id = i;
                data[i].preBillSelectedAuditorOther = data[i].modifier;
                data[i].accountSelectedDiagOther = data[i].diag;
                this.$gridDiv.jqGrid('addRowData', i + 1, data[i]);
                if(data[i].rowEditable)
                    this.$gridDiv.jqGrid('setCell', i + 1, 'search', searchDiv, '');
            }
            ;
            this.$gridDiv.setGridParam({rowNum: datalength}).trigger("reloadGrid");
        },
    },
    existingPhysicianChargesGrid: {
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
                sortname: 'hcpcCode',
                altRows: true,
                altclass: 'alternate_row_color',
                sortorder: 'asc',
                colNames: [
                             'guarantor Id',
                            'Claim #',
                          'PROCEDURE <br>Code',
                          'PROCEDURE <br>DESC',
                          globalvars.localResourceMap.missing_charge_date_of_service, 
                         'Qty', 
                          'Change Qty',
                          'Amount', 
                          
                          // 'Source',
                          'PHYSICIAN','','','','','','','','','','','','','','','',''],
                colModel: [
                    
                    {name: 'guarantorId', index: 'guarantorId', width: 110, fixed: true, sortable: true, sorttype: "string", align: 'left',editable: this.isEditable,editoptions:{readonly:"readonly"}},
                    {name: 'claim', index: 'claim', width: 110, fixed: true, sortable: true, sorttype: "string", align: 'left',editable: this.isEditable,editoptions:{readonly:"readonly"}},
                    {name: 'hcpcCode', index: 'hcpcCode', width: 110, fixed: true, sortable: true, sorttype: "string", align: 'left'},
                    {name: 'chargeDesc', index: 'chargeDesc', width: 220, fixed: true, sorttype: "string", classes: 'grid_cell_style',align: 'left'},
                    {name: 'chargeDate', index: 'chargeDate', width: 100, fixed: true, align: "center", sorttype: "date"},
                    {name: 'quantity', index: 'quantity', width: 80, fixed: true, align: "right", sorttype: "int"},
                    {name: 'qty', index: 'qty', width: 80, fixed: true, sortable: true, sorttype: "int", editable: this.isEditable, align: "center",
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
                            }
                        }
                    },
                    {name: 'chargeAmount', index: 'chargeAmount', width: 80, fixed: true, sorttype: "int", align: 'right',formatter:'currency',
                     formatoptions: { decimalSeparator: ".", thousandsSeparator: ",", prefix: "$",decimalPlaces: 1, defaultValue: '0.0' }},
                    // {name: 'source', index: 'source', width: 100, fixed: true, sortable: true, sorttype: "string", align: 'center'},
                    {name: 'doctor', index: 'doctor', width: 200, fixed: true, classes: 'grid_cell_style',align: 'left'},
                    {name: 'doctorId', index: 'doctorId', hidden:true},
                    {name: 'chargeCode', index: 'chargeCode', hidden:true},
                    {name: 'dept', index: 'dept', hidden:true},
                    {name: 'chargeNumber', index: 'chargeNumber', hidden:true},
                    {name: 'npi', index: 'npi', hidden:true},
                    {name: 'startDate', index: 'startDate', hidden:true},
                    {name: 'terminationDate', index: 'terminationDate', hidden:true},
                    {name: 'type', index: 'type', hidden:true},
                    {name: 'predKey', index: 'predKey',hidden:true},
                    {name: 'rowEditable', index: 'rowEditable',hidden:true},
                    {name: 'firstName', index: 'firstName', hidden:true},
                    {name: 'lastName', index: 'lastName',hidden:true},
                    {name: 'dob', index: 'dob',hidden:true},
                    {name: 'cenAuditorId', index: 'cenAuditorId',hidden:true},
                    {name: 'cenAuditingTime', index: 'cenAuditingTime',hidden:true},
                    {name: 'code', index: 'code',hidden:true}

                    
                ],
       
                editurl: 'clientArray',
                loadComplete: function() {
                    var gridRowData = gridPhysicianGlobal.existingPhysicianChargesGrid.$gridDiv.jqGrid('getRowData');
                     var gridRowDataLength = gridRowData.length;

                   
                     
                     

                    
                     //var gridRowData = gridPhysicianGlobal.existingChargesGridCCIEdits.$gridDiv.clearGridData();
                     
                     
                     gridPhysicianGlobal.existingPhysicianChargesGrid.$gridDiv.clearGridData();
                     var datalength = gridRowData.length;
                     for (var i = 0; i < datalength; i++) {

                         gridPhysicianGlobal.existingPhysicianChargesGrid.$gridDiv.jqGrid('addRowData', i + 1, gridRowData[i]);
                     }


                     for (var i = 0; i < gridRowDataLength; i++) {
                         if (gridRowData[i].rowEditable == "false" || gridRowData[i].rowEditable == false) {
                             $(("#account_details_existing_charges_grid_table_global tr#" + (i + 1))).addClass("highlighted_row");
                         }
                     }


                     $("#account_details_existing_charges_grid_table_global tbody tr").find('td:eq(18)').each(function(){
                            //console.log($(this).text());

                            if($(this).text() == "false" || $(this).text() == false){

                                $(this).parent().tooltip({
                                content: function(response) {
                                    //console.log(this.parentNode)
                                    if(this.parentNode){
                                        var rowData = gridPhysicianGlobal.existingPhysicianChargesGrid.$gridDiv.jqGrid('getRowData',this.parentNode.id);
                                        return '<b>Assigned to: </b>' + rowData.cenAuditorId+"<br/><b>Submitted on: </b>" + rowData.cenAuditingTime;
                                    }
                                },
                                open: function() {
                                    $(this).tooltip("widget").stop(false, true).hide().slideDown("fast");
                                },
                                close: function() {
                                    $(this).tooltip("widget").stop(false, true).show().slideUp("fast");
                                }
                            })//.tooltip("widget").addClass("ui-state-highlight");
                        }
                    })

                     $("#account_details_existing_charges_grid_table_global tbody tr").find("td:eq(8)").each(function(){
                          //  console.log($(this).text());

                            if($(this).text().length > 1){

                                $(this).tooltip({
                                content: function(response) {
                                    var rowData = gridPhysicianGlobal.existingPhysicianChargesGrid.$gridDiv.jqGrid('getRowData',this.parentNode.id);
                                    if(globalvars.client == "CP")
                                        return '<b>Name: </b>' + rowData.doctor+"<br/><b>NPI: </b>" + rowData.npi + '<br/> <b>CODE: </b>' + rowData.code + '<br/> <b>Start Date: </b>' + rowData.startDate + '<br/><b>Termination Date: </b>' + rowData.terminationDate + '<br/><b>Speciality: </b>' + rowData.type ;
                                    else
                                        return '<b>Name: </b>' + rowData.doctor+"<br/><b>NPI: </b>" + rowData.npi + '<br/><b>Start Date: </b>' + rowData.startDate + '<br/><b>Termination Date: </b>' + rowData.terminationDate + '<br/><b>Speciality: </b>' + rowData.type ;

                                },
                                open: function() {
                                    $(this).tooltip("widget").stop(false, true).hide().slideDown("fast");
                                },
                                close: function() {
                                    $(this).tooltip("widget").stop(false, true).show().slideUp("fast");
                                }
                            })//.tooltip("widget").addClass("ui-state-highlight");
                        }
                    })
                     $("#account_details_existing_charges_grid_table_global tbody tr").find("td:eq(0)").each(function(){
                         //   console.log($(this).text());

                            if($(this).text().length > 1){

                                $(this).tooltip({
                                content: function(response) {
                                    var rowData = gridPhysicianGlobal.existingPhysicianChargesGrid.$gridDiv.jqGrid('getRowData',this.parentNode.id);
                                    return '<b>First Name: </b>' + rowData.firstName+"<br/><b>Last Name: </b>" + rowData.lastName + '<br/><b>Dob: </b>' + rowData.dob;
                                },
                                open: function() {
                                    $(this).tooltip("widget").stop(false, true).hide().slideDown("fast");
                                },
                                close: function() {
                                    $(this).tooltip("widget").stop(false, true).show().slideUp("fast");
                                }
                            })//.tooltip("widget").addClass("ui-state-highlight");
                        }
                    })

                     
                    
                    gridPhysicianGlobal.existingPhysicianChargesGrid.$gridDiv.setGridParam({rowNum: datalength}).trigger("reloadGrid");
                   // gridPhysicianGlobal.existingPhysicianChargesGrid.$gridDiv.jqGrid('setLabel', 'chargeDesc', '', {'text-align': 'left', 'padding-left': '16px', 'width': '150px'});
                    //gridPhysicianGlobal.existingPhysicianChargesGrid.$gridDiv.jqGrid('setLabel', 'comments', '', {'text-align': 'left', 'padding-left': '16px', 'width': '186px'});
                }

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
   

}