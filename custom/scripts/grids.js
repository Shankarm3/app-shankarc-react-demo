grids.otherChargesGrid= {
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
                    height: '200',
                    gridview: true,
                    viewrecords: true,
//                    sortname: 'hcpcCode',
//                    sortorder: 'asc',
                    altRows: true,
                    altclass: 'alternate_row_color',
                    colNames: ['id', globalvars.localResourceMap.other_discoved_charge_search, globalvars.localResourceMap.other_discoved_charge_hcpc_code,
                        globalvars.localResourceMap.other_discoved_charge_dept_code, globalvars.localResourceMap.other_discoved_charge_charge_code,
                        globalvars.localResourceMap.other_discoved_charge_price, globalvars.localResourceMap.other_discoved_charge_add_qty, globalvars.localResourceMap.other_charge_date_of_service, globalvars.localResourceMap.other_discoved_charge_comment,
                        globalvars.localResourceMap.other_discoved_charge_chargeDescription,'predNbr',''],
                    colModel: [
                        {name: 'id', index: 'id', key: true, hidden: true},
                        {name: 'search', index: 'search', width: 100, fixed: true},
                        {
                            name: 'hcpcCode', index: 'hcpcCode', editable: true, width: 100, fixed: true, sortable: true, align: "center", sorttype: "string", key: true,
                            editoptions: {
                                size: "5",
                                maxlength: "5"
                            }
                        },
                        {
	                        name: 'dept', index: 'dept', editable: true, width: 100, fixed: true, sorttype: "int", align: "center",
	                        editoptions: {
//	                            size: "3",
//	                            maxlength: "3"
	                        },
	                        editrules: {
	                            custom: true,
	                            custom_func: function(value, colname) {
	                                var selectedRowData = grids.otherChargesGrid.$gridDiv.jqGrid('getRowData', grids.otherChargesGrid.selectedRow);
	                                if (value != undefined) {
	                                    if (!(/^[a-z0-9.]+$/i.test(value))){// || value.length !== 3) {
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
	                        name: 'chargeCode', index: 'chargeCode', editable: true, width: 120, fixed: true, sortable: true, align: "center", sorttype: "int",
	                        editoptions: {
//	                            size: "5",
//	                            maxlength: "5"
	                        }
//	                        editrules: {
//	                            custom: true,
//	                            custom_func: function(value, colname) {
//	                                var selectedRowData = grids.otherChargesGrid.$gridDiv.jqGrid('getRowData', grids.otherChargesGrid.selectedRow);
//	                                if (value != undefined) {
//	                                    if (!(/^[a-z0-9.]+$/i.test(value))){// || value.length !== 5) {
//	                                        return [false, globalvars.localResourceMap.other_discoverd_validation_new_msg3];
//	                                    } else {
//	                                        return [true, ""];
//	                                    }
//	                                }
//	                                else
//	                                    return [true, ""];
//	                            }
//	                        }
	                    },
                        {name: 'price', index: 'price', width: 60, fixed: true, sortable: true, sorttype: "int", align: "center"},
                        {
                            name: 'quantity', index: 'quantity', editable: this.isEditable, width: 100, fixed: true, align: "center", sorttype: "int",
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
                        {name: 'dateOfService1', index: 'dateOfService1', width: 85, fixed: true, sortable: true, sorttype: "date", datefmt: "Y-m-d h:i:s", editable: this.isEditable, align: "center",
                            editoptions:{
                                                readonly: 'readonly'
                                     }},
                        {name: 'comments', index: 'comments', editable: this.isEditable, width: 140, fixed: true,  editoptions: {
                                size: "18",
                                maxlength: "250",
                            },
                            classes: 'grid_cell_style'},
                        {name: 'chargeDescription', index: 'chargeDescription', hidden: true},
                        {name: 'predNbr', index: 'predNbr', hidden: true},
                        {name: 'method', index: 'method', hidden: true}
                    ],
//                    onCellSelect: function (rowid, index, contents, event) {
//                        if (index == 1 && grids.otherChargesGrid.isEditable == true) {
    //
//                            if (grids.otherChargesGrid.savedSuccessfully == true || grids.otherChargesGrid.selectedRow == rowid) {
//                                dialogs.otherChargesSearchFormDialog.reset();
//                                grids.loadOtherChargesSearchFormGrid({
//                                    gridDiv: "#account_details_other_charges_grid_search_form_table"
//                                });
    //
//                                dialogs.otherChargesSearchFormDialog.initialize({
//                                    $searchFormDialogDiv: $("#other_charges_grid_search_form_dialog"),
//                                    $searchFormDialogDivSubmit: $("#other_charges_grid_search_form_submit"),
//                                    $searchFormDialogDivReset: $("#other_charges_grid_search_form_reset"),
//                                    $searchFormDialogDivCancel: $("#other_charges_grid_search_form_cancel"),
//                                    billType:grids.otherChargesGrid.billType
//                                });
//                                dialogs.otherChargesSearchFormDialog.open();
    //
//                            };
//                        };
//                      },
                    onSelectRow: function(id) {
                        grids.otherChargesGrid.$gridDiv.trigger("jqGridInlineAfterSaveRow");
                        if (grids.otherChargesGrid.selectedRow !== undefined && grids.otherChargesGrid.selectedRow !== id) {
                            grids.otherChargesGrid.$gridDiv.jqGrid('saveRow', grids.otherChargesGrid.selectedRow);
                        }
                        ;

                        if (grids.otherChargesGrid.savedSuccessfully == true && grids.otherChargesGrid.isEditable == true) {
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
                            grids.otherChargesGrid.savedSuccessfully = false;
                        }
                        ;
                        function afterrestorefunc(e){
                    		grids.otherChargesGrid.savedSuccessfully = true;
                    	}
                        
                        log('clicked ' + id + " " + grids.otherChargesGrid.$gridDiv.getRowData(id));

                    },
                    editurl: 'clientArray',
                    loadComplete: function() {
                        grids.otherChargesGrid.$gridDiv.jqGrid('setLabel', 'comments', '', {'text-align': 'left', 'padding-left': '16px', 'width': '236px'});

                    }

                });

                this.$gridDiv.bind("jqGridInlineAfterSaveRow", function(rowid) {
                    log("jqGridInlineAfterSaveRow");
                   // $('#' + rowid + '_' + 'dateOfService1').datepicker({dateFormat: 'yy-mm-dd',defaultDate:screens.accountDetails.admitDate,minDate:screens.accountDetails.admitDate,maxDate:screens.accountDetails.dischargeDate});
                    grids.otherChargesGrid.savedSuccessfully = true;
                });

                this.$gridDiv.bind("jqGridSortCol", function(rowid) {
                    log("jqGridSortCol");
                });
            },
            fillGrid: function(data) {
                var searchDiv = '<div class="other_discover_search_wrapper"><img class="search_cell_del" src="common/images/account-details/delete-icon.png"><img class="search_cell_search" src="common/images/account-details/search-icon.png"></div>';
                this.$gridDiv.clearGridData();
                var datalength = data.length;
                for (var i = 0; i < datalength; i++) {
                    data[i].id = i;
                    this.$gridDiv.jqGrid('addRowData', i + 1, data[i]);
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
                        async: false,
                        contentType: 'application/json',
                       error: function(jqxhr) {
                            if(jqxhr.status==204){
                                grids.otherChargesGrid.$gridDiv.jqGrid('setCell', param.id, 'price',null);
                            }
                        },
                        success: function(str, textStatus, jqxhr) {
                            if(jqxhr.status=='200'){
                                grids.otherChargesGrid.$gridDiv.jqGrid('setCell', param.id, 'price', str);
                            }else{
                              grids.otherChargesGrid.$gridDiv.jqGrid('setCell', param.id, 'price',null);
                            }
                        }
                    });
                   }else{
                       grids.otherChargesGrid.$gridDiv.jqGrid('setCell', param.id, 'price',null);
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
                        async: false,
                        contentType: 'application/json',
                        error: function(jqxhr) {
                            if(jqxhr.status==204){
                                grids.otherChargesGrid.$gridDiv.jqGrid('setCell', param.id, 'price',null);
                            }
                        },
                       success: function(str, textStatus, jqxhr) {
                            if(jqxhr.status=='200'){
                                grids.otherChargesGrid.$gridDiv.jqGrid('setCell', param.id, 'price', str);
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
    }