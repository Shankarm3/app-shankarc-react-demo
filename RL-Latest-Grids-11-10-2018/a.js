
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

