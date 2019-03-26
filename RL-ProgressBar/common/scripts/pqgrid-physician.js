var pqgridPhysician = {

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
                   this.$gridDiv = $(param.gridDiv);
                   this.pagerDiv = param.pagerDiv;
                   this.showPType = param.showPType;
                   this.data = param.data;
                   this.onClick = param.onClick;
                   this.fillGrid();
                   this.loadGrid();
               },
               reloadGrid: function() {
                   this.$gridDiv = $(this.gridDiv);
                   this.$gridDiv.pqGrid('destroy');
                   this.data = window["globalvars"]["assignedAccounts"];
                   this.$gridDiv = $(this.gridDiv);
                   this.fillGrid();
                   this.loadGrid();

               },
               loadGrid: function() {
                   this.$gridDiv.pqGrid({
                       width: 910,
                       showTitle: false,            
                       columnBorders: false,
                       numberCell: false,
                       showBottom: true,
                       editable: false,
                       flexWidth: false,
                       columnBorders: true,
                       flexHeight: true,
                       scrollModel:{pace: 'fast', autoFit: true, theme: true },
                       wrap:false,
                       hwrap:false,
                       resizable: false,
                       collapsible: false,
                       hwrap:true,
                       pageModel: {type: "local", rPP:30, rPPOptions: [10, 20, 30, 50, 100], strRpp:"{0}", strDisplay:"{0} to {1} of {2}"},
                       filterModel: { on: true, mode: "AND", header: true },
                       dataModel: {
                                   data: this.data,
                              sorting: "local",
                              sortIndx: "rank",
                              sortDir: "up"
                       },
                       colModel: [
                            {dataIndx: 'index', width:30 ,hidden: true,title:'index'},
                            {dataIndx: 'rank', width: 30,title:'Rank', align: "center"},
                            {dataIndx: 'age', width: 50,  align: "center", fixed: true, sorttype: "int", sortable: true,hidden: true,title:''},
                            {dataIndx: 'gender', width: 60, align: 'center', sortable: true, fixed: true, hidden: true,title:''},
                            
                            {dataIndx: 'hospitalId', width: 60, hidden: true, fixed: true, align: "center", sortable: true,title:'Hospital',
                            filter: { type: 'textbox', attr: 'placeholder="Search..."', condition: "contain", listeners: ['keyup'] }},
                            
                            {dataIndx: 'shortName', width: 60,  fixed: true, align: "center", sortable: true,title:'Hospital',
                            filter: { type: 'textbox', attr: 'placeholder="Search..."', condition: "contain", listeners: ['keyup'] }},
                            

                            {dataIndx: 'accountId', width: 100,  fixed: true, align: "center", cls: 'accountlist-account-cursor', sortable: true,title:globalvars.localResourceMap.bill_accout_review_account,
                            filter: { type: 'textbox', attr: 'placeholder="Search..."', condition: "contain", listeners: ['keyup'] }},
                            {dataIndx: 'predCode', width: 100,  fixed: true, sortable: true,title:'Top Missing Code',
                            filter: { type: 'textbox', attr: 'placeholder="Search..."', condition: "contain", listeners: ['keyup'] }},         
                            {dataIndx: 'serviceLocation', width: 70, fixed: true, sortable: true,title:'Service Line',
                            filter: { type: 'textbox', attr: 'placeholder="Search..."', condition: "contain", listeners: ['keyup'] }},         
                            
                            {dataIndx: 'admitDate', width: 90, hidden:true, sortable: true, classes: 'grid_cell_style', fixed: true,title:globalvars.localResourceMap.bill_accout_review_admit_date,
                            filter: { type: 'textbox', attr: 'placeholder="Search..."', condition: "contain", listeners: ['keyup'] }},
                            
                             {dataIndx: 'remainingTime', align:"center", width: 70, sortable: true, classes: 'grid_cell_style', fixed: true,title:'Time remaining',
                            filter: { type: 'textbox', attr: 'placeholder="Search..."', condition: "contain", listeners: ['keyup'] }},

                            {dataIndx: 'dischargeDate', width: 80,sortable: true, classes: 'grid_cell_style', fixed: true,title:globalvars.localResourceMap.bill_accout_review_discharge_date,
                            filter: { type: 'textbox', attr: 'placeholder="Search..."', condition: "contain", listeners: ['keyup'] }},
                            
                            {dataIndx: 'employedNpis', align:"center", width: 90,sortable: true, classes: 'grid_cell_style', fixed: true,title:'Employed Physician',
                            filter: { type: 'textbox', attr: 'placeholder="Search..."', condition: "contain", listeners: ['keyup'] }},

                            {dataIndx: 'patTypeWithDescription', align: 'center', width: 100, sortable: true, classes: 'grid_cell_style', fixed: true, hidden:false,title:globalvars.localResourceMap.bill_accout_review_patient_type,
                            filter: { type: 'textbox', attr: 'placeholder="Search..."', condition: "contain", listeners: ['keyup'] }},
                            {dataIndx: 'patSubTypeWithDescription', align: 'center', width: 130, sortable: true, classes: 'grid_cell_style', fixed: true,hidden:true,title:globalvars.localResourceMap.bill_accout_review_patient_type,
                            filter: { type: 'textbox', attr: 'placeholder="Search..."', condition: "contain", listeners: ['keyup'] }},
                            {dataIndx: 'insurance', width: 80, sortable: true, classes: 'grid_cell_style', fixed: true,hidden: true,title:''},
                            {dataIndx: 'insuranceName', width: 140, sortable: true, classes: 'grid_cell_style', fixed: true,title:globalvars.localResourceMap.bill_accout_review_payer_name,
                            filter: { type: 'textbox', attr: 'placeholder="Search..."', condition: "contain", listeners: ['keyup'] }},
                            {dataIndx: 'isHighlighted', width: 10, hidden: true, sortable: false,title:'isHighlighted'},
                            {dataIndx: 'patientId', width: 10, hidden: true, sortable: false,title:'patientId'},
                            {dataIndx: 'name', width: 10, hidden: true, sortable: false,title:'Name'},
                            {dataIndx: 'dob', width: 10, hidden: true, sortable: false,title:''},
                            {dataIndx: 'transferDate', width: 10, hidden: true, sortable: false,title:''}

                       ],
                       create: function(){
                           var gridRowData = pqgridPhysician.physicianBillAccountReviewGrid.$gridDiv.pqGrid( "option" , "dataModel.data" );
                           pqgridPhysician.physicianBillAccountReviewGrid.$gridDiv.pqGrid("refreshDataAndView");
                           if(gridRowData){
                           var gridRowDataLength = gridRowData.length;
                           
                             for (var i = 0; i < gridRowDataLength; i++) {
                                 if (gridRowData[i].isHighlighted == true) {
                                     //log("isHighlighted " + gridRowData[i].accountId + " : " + (i + 1));
                                     pqgridPhysician.physicianBillAccountReviewGrid.$gridDiv.pqGrid("addClass", { rowIndx: i, cls: 'highlighted_row' } );
                                 }
                             }
                         }


                       },
                       // load:function(){
                       //  console.log('load data');
                       //     pqgridPhysician.physicianBillAccountReviewGrid.$gridDiv.pqGrid("refreshDataAndView");
                       // },
                       rowClick: this.onClick,
                       // refresh: function( event, ui ) {
                       //    pqgridPhysician.physicianBillAccountReviewGrid.$gridDiv.pqGrid("refreshDataAndView");

                       // }
                   });
                                       

               },
               fillGrid: function() {

                   var datalength = this.data.length;

                   for (var i = 0; i < datalength; i++) {
                     pqgridPhysician.physicianBillAccountReviewGrid.data[i].index = i;
                   }
               }

           },


     loadPhysicianConfirmChargesGrid: {
                $gridDiv:{},
                datalength:"",
                onClick:{},
                showExcel:"",
                data: {},
               initialize: function(param) {
                                console.log('inside initialize function');

                   this.$gridDiv = $(param.gridDiv);
                   this.datalength = param.data.length;
                   this.onClick = param.onClick;
                   this.data = param.data;
                   this.showExcel = param.showExcel;
                   this.fillGrid();
                   this.loadGrid();
               },
               reloadGrid: function() {
                   this.$gridDiv = $(this.gridDiv);
                   this.$gridDiv.pqGrid('destroy');
                   this.$gridDiv = $(this.gridDiv);
                   this.fillGrid();
                   this.loadGrid();

               },
               formatCurrency:function(ui) {
                  var data = parseFloat(ui.cellData).toFixed(1);
                   return '$' + String(data).split("").reverse().join("")
                      .replace(/(\d{3}\B)/g, "$1,")
                      .split("").reverse().join("");
                },
               loadGrid: function() {
                  console.log('inside loadGrid function');

                var grid1 =  this.$gridDiv.pqGrid({
                       width: 905,
                       showTitle: false,            
                       columnBorders: false,
                       numberCell: false,
                       showBottom: true,
                       editable: false,
                       flexWidth: false,
                       columnBorders: true,
                       flexHeight: true,
                       scrollModel:{pace: 'fast', autoFit: true, theme: true },
                       wrap:false,
                       hwrap:false,
                       resizable: true,
                       collapsible: false,
                       hwrap:true,
                       pageModel: {type: "local", rPP:30, rPPOptions: [10, 20, 30, 50, 100], strRpp:"{0}", strDisplay:"{0} to {1} of {2}"},
                       filterModel: { on: true, mode: "AND", header: true },
                       dataModel: {
                              data: this.data,
                              sorting: "local",
                              //sortIndx: "accountId",
                              sortDir: "up"
                       },
                       colModel: [
                            {dataIndx: 'hospitalId', width:60 ,hidden: true,title:''},
                            {dataIndx: 'shortName', width: 65,title:globalvars.localResourceMap.confirm_charge_coid, align: "center",sortable: true},
                            {dataIndx: 'auditorId', width: 65,  align: "center", fixed: true, sortable: true,title:'Auditor Id'},
                            {dataIndx: 'accountId', width: 100, align: 'center', sortable: true,cls: 'accountlist-account-cursor', fixed: true,title:globalvars.localResourceMap.confirm_charge_acct},
                            {dataIndx: 'costCenter', width: 75,  fixed: true, align: "center", sortable: true,title:'Cost Center'},
                            {dataIndx: 'source', width: 60,  fixed: true, sortable: true,title:'Source', hidden:(globalvars.client == "MSH")? true:false},         
                            {dataIndx: 'dept', width: 60,  fixed: true, sortable: true,title:'Clinic',hidden:(globalvars.client == "MSH")? false:true},         
                            {dataIndx: 'hcpcCode', width: 55, fixed: true, sortable: true,title:globalvars.localResourceMap.confirm_charge_hcpc_code},
                            //filter: { type: 'textbox', attr: 'placeholder="Search..."', condition: "contain", listeners: ['keyup'] }},         
                            {dataIndx: 'guarantorId', width: 90, align: 'center',sortable: true, classes: 'grid_cell_style', fixed: true,title:'Guarantor Id'},
                            {dataIndx: 'chargeAmount', width: 65,sortable: true, classes: 'grid_cell_style', fixed: true,title:globalvars.localResourceMap.confirm_charge_amount,render: pqgridPhysician.loadPhysicianConfirmChargesGrid.formatCurrency},
                            {dataIndx: 'quantity', align: 'center', width: 30, sortable: true, classes: 'grid_cell_style', fixed: true,title:globalvars.localResourceMap.confirm_charge_qty},
                            {dataIndx: 'comments', align: 'left', width: 75, sortable: true, classes: 'grid_cell_style', fixed: true,title:globalvars.localResourceMap.confirm_charge_comments},
                            {dataIndx: 'confirmTime', align: 'center',width: 135, sortable: true, classes: 'grid_cell_style', fixed: true,title:globalvars.localResourceMap.confirm_charge_confirm_time},
                            {dataIndx: 'desc', width: 75, align: 'center',sortable: true, classes: 'grid_cell_style', fixed: true,title:globalvars.localResourceMap.confirm_charge_desc},
                            {dataIndx: 'found', width: 10, hidden: true, sortable: true,title:globalvars.localResourceMap.confirm_charge_found},
                            {dataIndx: 'uriCharges', align: 'left',width: 10, hidden: true, sortable: true,title:globalvars.localResourceMap.confirm_charge_found}
                            

                       ],
                       create: function(){
                          console.log('inside create function');
                           var gridRowData = pqgridPhysician.loadPhysicianConfirmChargesGrid.$gridDiv.pqGrid( "option" , "dataModel.data" );
                           //pqgridPhysician.loadPhysicianConfirmChargesGrid.$gridDiv.pqGrid("refreshDataAndView");
                          if(gridRowData){
                             var gridRowDataLength = gridRowData.length;
                             for (var i = 0; i < gridRowDataLength; i++) {
                                 if (gridRowData[i].found == true || gridRowData[i].found == "true") {
                                     //log("isHighlighted " + gridRowData[i].accountId + " : " + (i + 1));
                                     pqgridPhysician.loadPhysicianConfirmChargesGrid.$gridDiv.pqGrid("addClass", { rowIndx: i, cls: 'highlighted_row' } );
                                 }
                             }
                         }
                         $('.pq-header-outer').css('height','45px');
                         $('.ui-widget-header').css('height','45px');
                         $('.pq-grid-top').hide();

                       },
                       // load:function(){
                       //  console.log('load data');
                       //     pqgridPhysician.physicianBillAccountReviewGrid.$gridDiv.pqGrid("refreshDataAndView");
                       // },
                       rowClick: this.onClick,
                       // refresh: function( event, ui ) {
                       //    pqgridPhysician.physicianBillAccountReviewGrid.$gridDiv.pqGrid("refreshDataAndView");

                       // }
                   });
                      grid1.on("pqgridrefresh", function (evt, ui) {
                          $('.pq-header-outer').css('height','45px');
                          $('.ui-widget-header').css('height','45px');
                          $('.pq-grid-top').hide();
                  });                  

               },
               fillGrid: function() {
                console.log('inside fillGrid function');

                   var datalength = this.data.length;

                   for (var i = 0; i < datalength; i++) {
                     pqgridPhysician.loadPhysicianConfirmChargesGrid.data[i].index = i;
                   }


                if ((pqgridPhysician.loadPhysicianConfirmChargesGrid.datalength == 0 || pqgridPhysician.loadPhysicianConfirmChargesGrid.datalength == undefined)
                        && pqgridPhysician.loadPhysicianConfirmChargesGrid.showExcel == undefined) {
                    $("#confirm_charges_download_excel").hide();
                    dialogs.messageDialog.show({text: globalvars.localResourceMap.confirmed_charge_no_data_msg});
                }
                else if (pqgridPhysician.loadPhysicianConfirmChargesGrid.datalength > 0 && pqgridPhysician.loadPhysicianConfirmChargesGrid.showExcel==false) {
                     $("#confirm_charges_download_excel").hide();
                }
                else if (pqgridPhysician.loadPhysicianConfirmChargesGrid.datalength > 0 && pqgridPhysician.loadPhysicianConfirmChargesGrid.showExcel) {
                    $("#confirm_charges_download_excel").show();
                }
               }

    },

    existingHospitalChargesGrid: {
        $gridDiv: {},
        selectedRow: undefined,
        savedSuccessfully: true,
        data: {},
        isEditable: true,
              initialize: function(param) {
              this.$gridDiv = $(param.gridDiv);
              this.data = param.data;
              this.isEditable = param.isEditable === false ? false : true;
              this.onClick = param.onClick;
              this.fillGrid();
              this.loadGrid();
              this.addTooltip();
              //this.createEvent();

               },
               reloadGrid: function() {
                   this.$gridDiv = $(this.gridDiv);
                   this.$gridDiv.pqGrid('destroy');
                   this.$gridDiv = $(this.gridDiv);
                   this.fillGrid();
                   this.loadGrid();


               },
               formatCurrency:function(ui) {
                  var data = parseFloat(ui.cellData).toFixed(1);
                   return '$' + String(data).split("").reverse().join("")
                      .replace(/(\d{3}\B)/g, "$1,")
                      .split("").reverse().join("");
                },
               loadGrid: function() {
                  console.log('inside loadGrid function existingHospitalChargesGrid');

                var grid1= this.$gridDiv.pqGrid({
                       width: 1130,
                       height:240,
                       showTitle: false,            
                       columnBorders: false,
                       numberCell: false,
                       showBottom: false,
                       editable: false,
                       flexWidth: false,
                       columnBorders: true,
                       flexHeight: false,
                       scrollModel:{pace: 'fast', autoFit: true, theme: true },
                       resizable: false,
                       hwrap:true,
                       wrap:false,
                       collapsible: true,
                       filterModel: { on: true, mode: "AND", header: true },
                       dataModel: {
                              data: this.data,
                              sorting: "local",
                              sortIndx: "isExist",
                              sortDir: "down"
                       },
                       colModel: [
                            {title: 'index', hidden: true, dataIndx:'index'},
                            {dataIndx: 'hcpcCode', width:60 ,title:'CPT/HCPC CODE',align: "left",
                            filter: { type: 'textbox', attr: 'placeholder="Search..."',condition: "contain", listeners: ['keyup'] }},
                            {dataIndx: 'dept', sortable: false,width: 70,title:globalvars.localResourceMap.existing_charge_dept_code, align: "left",sortable: true,
                            filter: { type: 'textbox', attr: 'placeholder="Search..."', condition: "contain", listeners: ['keyup'] }},
                            {dataIndx: 'revenueCode', width: 70,  align: "left", fixed: true, sortable: true,title:'REV Code',
                            filter: { type: 'textbox', attr: 'placeholder="Search..."', condition: "contain", listeners: ['keyup'] }},
                            {dataIndx: 'chargeCode', width: 70, align: 'left', sortable: true, fixed: true,title:globalvars.localResourceMap.existing_charge_charge_code,
                            filter: { type: 'textbox', attr: 'placeholder="Search..."', condition: "contain", listeners: ['keyup'] }},
                            
                            {dataIndx: 'chargeDesc', width: 200, align: 'left',sortable: true, classes: 'grid_cell_style', fixed: true,title:globalvars.localResourceMap.existing_charge_charge_description,
                            filter: { type: 'textbox', attr: 'placeholder="Search..."', condition: "contain", listeners: ['keyup'] }},
                            
                            {dataIndx: 'chargeDate', width: 60, fixed: true, sortable: true,title:'Date Of Service',align: 'center',
                            filter: { type: 'textbox', attr: 'placeholder="Search..."', condition: "contain", listeners: ['keyup'] }},
     
                            {dataIndx: 'quantity', width: 40,  fixed: true, align: "right", sortable: true,title:'Qty',
                            filter: { type: 'textbox', attr: 'placeholder="Search..."', condition: "contain", listeners: ['keyup'] }},
                            {dataIndx: 'chargeAmount', align: 'right',width: 40,  fixed: true, sortable: true,title:globalvars.localResourceMap.existing_charge_amount,render: pqgridPhysician.existingHospitalChargesGrid.formatCurrency,
                            filter: { type: 'textbox', attr: 'placeholder="Search..."', condition: "contain", listeners: ['keyup'] }},         
                                                   //filter: { type: 'textbox', attr: 'placeholder="Search..."', condition: "contain", listeners: ['keyup'] }},         
                            {dataIndx: 'doctor', width: 150,sortable: true, classes: 'grid_cell_style', fixed: true,title:'Physician',
                            filter: { type: 'textbox', attr: 'placeholder="Search..."', condition: "contain", listeners: ['keyup'] }},
                            {dataIndx: 'isExist', hidden: true, align: 'center', width: 40, sortable: true, classes: 'grid_cell_style', fixed: true,title:''},
                            {dataIndx: 'npi', hidden: true, align: 'left', width: 85, sortable: true, classes: 'grid_cell_style', fixed: true,title:''},
                            {dataIndx: 'startDate', hidden: true, align: 'center',width: 80, sortable: true, classes: 'grid_cell_style', fixed: true,title:''},
                            {dataIndx: 'terminationDate', hidden: true,width: 80, align: 'center',sortable: true, classes: 'grid_cell_style', fixed: true,title:''},
                            {dataIndx: 'type', width: 10, hidden: true, sortable: true,title:''}
                            
                            

                       ],
                       create: function(){
                          console.log('inside create function existingHospitalChargesGrid');
                           var gridRowData = pqgridPhysician.existingHospitalChargesGrid.$gridDiv.pqGrid( "option" , "dataModel.data" );
                          // pqgridPhysician.existingHospitalChargesGrid.$gridDiv.pqGrid("refreshDataAndView");
                          if(gridRowData){
                             var gridRowDataLength = gridRowData.length;
                             for (var i = 0; i < gridRowDataLength; i++) {
                                 if (gridRowData[i].isExist == true || gridRowData[i].isExist == 'true') {
                                     //log("isHighlighted " + gridRowData[i].accountId + " : " + (i + 1));
                                     pqgridPhysician.existingHospitalChargesGrid.$gridDiv.pqGrid("addClass", { rowIndx: i, cls: 'highlighted_row_yellow' } );
                                 }
                             }
                         }

                         

                       },
                       
                       rowClick: this.onClick
                       
                   });

                   grid1.on("pqgridrefresh", function (evt, ui) {
                      pqgridPhysician.existingHospitalChargesGrid.addTooltip();
                  });
                                       

               },
               fillGrid: function() {
                console.log('inside fillGrid function existingHospitalChargesGrid');

                   var datalength = this.data.length;

                   for (var i = 0; i < datalength; i++) {
                     pqgridPhysician.existingHospitalChargesGrid.data[i].index = i;
                     //pqgridPhysician.existingHospitalChargesGrid.data[i].doctor='saurabh Goel';
                   }


                
               },
               addTooltip: function(){

                $("#account_details_hospital_charges_grid_table  tr.pq-grid-row td[pq-col-indx=9] div").each(function(){
                            var that = $(this);
                            if($(this).text().length > 1){
                                var rowIndex = parseInt(that.parent().parent().attr('pq-row-indx'));
                                var rowData = $("#account_details_hospital_charges_grid_table").pqGrid( "getRowData", {rowIndxPage: rowIndex} );
                                if(rowData.startDate == null)
                                  rowData.startDate = "";

                                if(rowData.terminationDate == null)
                                  rowData.terminationDate = "";
                                var content ="";
                                if(globalvars.client == "CP")
                                  content = '<b>Name: </b>' + rowData.doctor+"<br/><b>NPI: </b>" + rowData.npi + '<br/><b>CODE: </b>' + rowData.code + '<br/> <b>Start Date: </b>' + rowData.startDate + '<br/><b>Termination Date: </b>' + rowData.terminationDate + '<br/><b>Speciality: </b>' + rowData.type ;
                                else
                                  content = '<b>Name: </b>' + rowData.doctor+"<br/><b>NPI: </b>" + rowData.npi + '<br/><b>Start Date: </b>' + rowData.startDate + '<br/><b>Termination Date: </b>' + rowData.terminationDate + '<br/><b>Speciality: </b>' + rowData.type ;
                                
                                var $td = $( "#account_details_hospital_charges_grid_table" ).pqGrid( "getCell", { rowIndx: rowIndex, dataIndx: "doctor" } );
                                $td.attr("title", content).tooltip();
                        }
                        })
               }
              

      },

    existingPhysicianChargesGrid: {
        $gridDiv: {},
        selectedRow: undefined,
        savedSuccessfully: true,
        data: {},
        isEditable: true,
              initialize: function(param) {
              this.$gridDiv = $(param.gridDiv);
              this.data = param.data;
              this.isEditable = param.isEditable === false ? false : true;
              this.onClick = param.onClick;
              this.fillGrid();
              this.loadGrid();
               },
               reloadGrid: function() {
                   this.$gridDiv = $(this.gridDiv);
                   this.$gridDiv.pqGrid('destroy');
                   this.$gridDiv = $(this.gridDiv);
                   this.fillGrid();
                   this.loadGrid();

               },
               loadGrid: function() {
                  console.log('inside loadGrid function existingHospitalChargesGrid');

                  var grid1 = this.$gridDiv.pqGrid({
                       width: 880,
                       height:200,
                       showTitle: false,            
                       columnBorders: false,
                       numberCell: false,
                       showBottom: true,
                       editable: true,
                       flexWidth: false,
                       columnBorders: true,
                       scrollModel:{pace: 'fast', autoFit: true, theme: true },
                       wrap:false,
                       hwrap:false,
                       resizable: false,
                       collapsible: false,
                       pageModel: {type: "local", rPP:30, rPPOptions: [10, 20, 30, 50, 100], strRpp:"{0}", strDisplay:"{0} to {1} of {2}"},
                       filterModel: { on: true, mode: "AND", header: true },
                       dataModel: {
                              data: this.data,
                              sorting: "local",
                              sortDir: "up"
                       },
                       editModel: {
                            saveKey: $.ui.keyCode.ENTER,
                            select: false,
                            keyUpDown: false,
                            cellBorderWidth: 0                
                        },
                        colModel: [
                            {title: 'index', hidden: true, dataIndx:'index'},
                            {dataIndx: 'guarantorId', width:105 ,title:'Guarantor ID',align: "center",editable: false},
                            {dataIndx: 'claim', sortable: false,width: 60,title:'Claim#', align: "center",sortable: true,editable: false},
                            {dataIndx: 'hcpcCode', width: 60,  align: "center", fixed: true, sortable: true,title:globalvars.localResourceMap.missing_charge_hcpc_code,editable: false},
                            {dataIndx: 'quantity', width: 60, align: 'center', sortable: true, fixed: true,title:'Units',editable: false},
                            {dataIndx: 'qty', width: 55,  fixed: true, align: "center", sortable: true,title:'Change Qty',
                              validations: [
                                    { type: 'maxLen', value: 3, msg: "Required" },
                                    { type: function (ui) {
                                        var value = ui.value;
                                        if (value == "") {
                                            return true;
                                        } else if (!(/^-?\d+$/.test(value)) || isNaN(value) || value == 0) {
                                            value = "";
                                            ui.msg = globalvars.localResourceMap.existing_charge_validation_msg;
                                            return false;
                                        } else {
                                            return true;
                                        }
                                    }, icon:'ui-icon-info'
                                    }
                               ]},
                            {dataIndx: 'chargeAmount', width: 65,  fixed: true, sortable: true,title:'Amount',editable: false},
                            {dataIndx: 'chargeDate', width: 80, fixed: true, sortable: true,title:globalvars.localResourceMap.missing_charge_date_of_service,editable: false},
                            //filter: { type: 'textbox', attr: 'placeholder="Search..."', condition: "contain", listeners: ['keyup'] }},         
                            {dataIndx: 'chargeDesc', width: 90, align: 'center',sortable: true, classes: 'grid_cell_style', fixed: true,editable: false, title:globalvars.localResourceMap.missing_charge_charge_description},
                            {dataIndx: 'source', width: 90, align: 'center',sortable: true, classes: 'grid_cell_style', fixed: true,title:'Source',editable: false},
                            {dataIndx: 'doctor', width: 65,sortable: true, classes: 'grid_cell_style', fixed: true,title:'Doctor',editable: false},
                            {dataIndx: 'doctorId', index: 'doctorId', hidden:true,title:''},
                            {dataIndx: 'chargeCode', index: 'chargeCode', hidden:true,title:''},
                            {dataIndx: 'dept', index: 'dept', hidden:true,title:''},
                            {dataIndx: 'chargeNumber', index: 'chargeNumber', hidden:true,title:''},
                            {dataIndx: 'npi', index: 'npi', hidden:true,title:''},
                            {dataIndx: 'startDate', index: 'startDate', hidden:true,title:''},
                            {dataIndx: 'terminationDate', index: 'terminationDate', hidden:true,title:''},
                            {dataIndx: 'type', index: 'type', hidden:true,title:''},
                            {dataIndx: 'predKey', index: 'predKey',hidden:true,title:''},
                            {dataIndx: 'rowEditable', index: 'rowEditable',hidden:true,title:''},
                            {dataIndx: 'firstName', index: 'firstName', hidden:true,title:''},
                            {dataIndx: 'lastName', index: 'lastName',hidden:true,title:''},
                            {dataIndx: 'dob', index: 'dob',hidden:true,title:''},
                            {dataIndx: 'cenAuditorId', index: 'cenAuditorId',hidden:true,title:''},
                            {dataIndx: 'cenAuditingTime', index: 'cenAuditingTime',hidden:true,title:''}
                            
                            

                       ],
                       create: function(){
                          console.log('inside create function existingHospitalChargesGrid');
                           var gridRowData = pqgridPhysician.existingPhysicianChargesGrid.$gridDiv.pqGrid( "option" , "dataModel.data" );
                          // pqgridPhysician.existingHospitalChargesGrid.$gridDiv.pqGrid("refreshDataAndView");
                          if(gridRowData){
                             var gridRowDataLength = gridRowData.length;
                             for (var i = 0; i < gridRowDataLength; i++) {
                                 if (gridRowData[i].isExist == true || gridRowData[i].isExist == 'true') {
                                     //log("isHighlighted " + gridRowData[i].accountId + " : " + (i + 1));
                                     pqgridPhysician.existingPhysicianChargesGrid.$gridDiv.pqGrid("addClass", { rowIndx: i, cls: 'highlighted_row_yellow' } );
                                 }
                             }
                         }

                      

                       },
                       
                       rowClick: this.onClick
                       
                   });
                  
                grid1.on("pqgridquiteditmode", function (evt, ui) {
                    //exclude esc and tab            
                    if (evt.keyCode != $.ui.keyCode.ESCAPE && evt.keyCode != $.ui.keyCode.TAB) {
                        grid1.pqGrid("saveEditCell");
                    }
                });
                grid1.on("pqgridcellbeforesave", function (evt, ui) {
                    var isValid = grid1.pqGrid("isValid", { dataIndx: ui.dataIndx, value: ui.newVal }).valid;
                    if (!isValid) {
                        grid1.find(".pq-editor-focus").css({ "border-color": "red" });
                        return false;
                    }
                });
                                       

               },
               fillGrid: function() {
                console.log('inside fillGrid function existingHospitalChargesGrid');

                   var datalength = this.data.length;

                   for (var i = 0; i < datalength; i++) {
                     pqgridPhysician.existingPhysicianChargesGrid.data[i].index = i;
                   }


                
               }

    },

    loadGlobalSearchGrid:{ // param object holds gridDiv, data
          gridDiv: "",
          $gridDiv:{},
          datalength:0,
          onClick:{},
          gridCreated: false,
          formatCurrency:function(ui) {
              var data = parseFloat(ui.cellData).toFixed(1);
               return '$' + String(data).split("").reverse().join("")
                  .replace(/(\d{3}\B)/g, "$1,")
                  .split("").reverse().join("");
            },
          loadGrid: function(param) {
            
            if(param.data && param.data.length > 0){
      
                this.gridDiv = param.gridDiv;
                this.$gridDiv = $(param.gridDiv);
                this.datalength = param.data.length;
                this.onClick = param.onClick;
                this.showExcel = param.showExcel;
                this.$gridDiv.pqGrid({
                    width: 850,
                    showTitle: false,            
                    columnBorders: false,
                    numberCell: false,
                    showBottom: true,
                    editable: false,
                    flexWidth: false,
                    columnBorders: true,
                    flexHeight: true,
                    scrollModel:{pace: 'fast', autoFit: true, theme: true },
                  wrap:false,
                    hwrap:true,
                    resizable: false,
                    collapsible: false,
                    pageModel: {type: "local", rPP:30, rPPOptions: [10, 20, 30, 50, 100], strRpp:"{0}", strDisplay:"{0} to {1} of {2}"},
                    filterModel: { on: true, mode: "AND", header: true },
                    dataModel: {
                  data: param.data,
                      sorting: "local",
                      sortIndx: "hospitalId",
                      sortDir: "up"
                    },
                    colModel: [
                      {title: globalvars.localResourceMap.confirm_charge_coid, dataIndx: 'hospitalId', width: 100, align: 'center', sortable: true,
                filter: { type: 'textbox', attr: 'placeholder="Search..."', condition: "contain", listeners: ['keyup']}
                      },
                      {title: globalvars.localResourceMap.confirm_charge_acct, dataIndx: 'accountId', width: 100, sortable: true, cls:'accountlist-account-cursor',
                filter: { type: 'textbox', attr: 'placeholder="Search..."', condition: "contain", listeners: ['keyup']}
                      },
                      {title:'Patient type', dataIndx: 'patTypeWithDescription', width: 100, align: 'center', sortable: true,
                filter: { type: 'textbox', attr: 'placeholder="Search..."', condition: "contain", listeners: ['keyup']}
                      },
                      {title: 'Patient Sub-Type', dataIndx: 'patSubTypeWithDescription', width: 100, align: 'center', sortable: true,
                filter: { type: 'textbox', attr: 'placeholder="Search..."', condition: "contain", listeners: ['keyup']}
                      },
                      {title:'Discharge Date', dataIndx: 'dischargeDate', width: 100, align: 'center', sortable: true,
                filter: { type: 'textbox', attr: 'placeholder="Search..."', condition: "contain", listeners: ['keyup']}
                      },
                      {title:'Transfer Date', dataIndx: 'transferDate', width: 100, sortable: true,
                filter: { type: 'textbox', attr: 'placeholder="Search..."', condition: "contain", listeners: ['keyup']}
                      },
                      {title:'Financial class', dataIndx: 'financialClass', width: 100, sortable: true,
                filter: { type: 'textbox', attr: 'placeholder="Search..."', condition: "contain", listeners: ['keyup']}
                      },
              {title:'Sum (prediction value)', dataIndx: 'sumOfPredValue', width: 100, sortable: true,render: pqgridPhysician.loadGlobalSearchGrid.formatCurrency,
                filter: { type: 'textbox', attr: 'placeholder="Search..."', condition: "contain", listeners: ['keyup']}
                      }
                     

                 ],
                 rowClick: this.onClick,

                 create: function() {

                         var gridRowData = pqgridPhysician.loadGlobalSearchGrid.$gridDiv.pqGrid( "option" , "dataModel.data" );

                     if(gridRowData && gridRowData.length > 0){
                        for (var i = 0; i < gridRowData.length; i++) {
                            // if (gridRowData[i].found == "1") {
                            //     log("Highlighted found" + gridRowData[i].acct + "::" + (i + 1));
                              //     pqGrids.loadGlobalSearchGrid.$gridDiv.pqGrid("addClass", { rowIndx: i, cls: 'highlighted_row' } );
                            //     //$(("tr#" + (i + 1))).addClass("highlighted_row");
                            // }
                        }
                    }

    
                      
                      
                      pqgridPhysician.loadGlobalSearchGrid.gridCreated = true;

                  },


             });

            }else{
              //if (pqGrids.loadConfirmChargesAuditLevelGrid.datalength == 0 || pqGrids.loadConfirmChargesAuditLevelGrid.datalength == undefined) {
                          //$("#confirm_charges_download_excel").hide();
                          dialogs.messageDialog.show({text: globalvars.localResourceMap.account_no_data_msg});
                     // }
            }

        }

      },
       publishCodeListGridPQ: {
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
             // this.showPType = param.showPType;
              this.data = param.data;
              //this.onClick = param.onClick;
              this.fillGrid();
              this.loadGrid();
          },
          reloadGrid: function() {
              this.$gridDiv = $(this.gridDiv);
              this.$gridDiv.pqGrid('destroy');
             // this.data = window["globalvars"]["assignedAccounts"];
              this.$gridDiv = $(this.gridDiv);
              this.fillGrid();
              this.loadGrid();
          },
          loadGrid: function() {
              this.$gridDiv.pqGrid({
                     width: 800,
                       showTitle: false,            
                       columnBorders: false,
                       numberCell: false,
                       showBottom: true,
                       editable: false,
                       flexWidth: false,
                       columnBorders: true,
                       flexHeight: false,
                       scrollModel:{pace: 'fast', autoFit: true, theme: true },
                       resizable: false,
                       hwrap:true,
                       wrap:false,
                       collapsible: false,
                       filterModel: { on: true, mode: "AND", header: true },
                       pageModel: {type: "local", rPP:30, rPPOptions: [10, 20, 30, 50, 100], strRpp:"{0}", strDisplay:"{0} to {1} of {2}"},

                       dataModel: {
                              data: this.data,
                              sorting: "local",
                              // sortIndx: "isExist",
                              // sortDir: "down"
                       },
                  colModel: [
                      {title: 'index', hidden: true, dataIndx:'index'},
                      {title: 'Hospital Id', width: 90, align:"center",dataIndx: 'hospitalId',filter: { type: 'textbox', attr: 'placeholder="Search..."',condition: "contain", listeners: ['keyup'] }},
                      {title: 'Account Id', width: 120, align:"center", dataIndx: 'accountId',filter: { type: 'textbox', attr: 'placeholder="Search..."',condition: "contain", listeners: ['keyup'] }},
                      {title: 'Pred Key',width: 90,align:"center", dataIndx: 'predKey',filter: { type: 'textbox', attr: 'placeholder="Search..."',condition: "contain", listeners: ['keyup'] }},
                      {title: 'Pred Code', width: 90, align:"center", dataIndx: 'predCode',filter: { type: 'textbox', attr: 'placeholder="Search..."',condition: "contain", listeners: ['keyup'] }},
                      {title: 'Pred Date', width: 90, align:"center", dataIndx: 'predDate',filter: { type: 'textbox', attr: 'placeholder="Search..."',condition: "contain", listeners: ['keyup'] }},
                      {title: 'DCHG Code', width: 90, align:"center", dataIndx: 'dchgCode',filter: { type: 'textbox', attr: 'placeholder="Search..."',condition: "contain", listeners: ['keyup'] }},
                      {title: 'Response', width: 90,align:"center", dataIndx: 'cenAuditorFlag',filter: { type: 'textbox', attr: 'placeholder="Search..."',condition: "contain", listeners: ['keyup'] }},
                      {title: 'Date of Service', width: 90,align:"center", dataIndx: 'dateOfService',filter: { type: 'textbox', attr: 'placeholder="Search..."',condition: "contain", listeners: ['keyup'] }},
                      {title: 'Sent Flag', width: 90, align:"center", dataIndx: 'sentFlag',filter: { type: 'textbox', attr: 'placeholder="Search..."',condition: "contain", listeners: ['keyup'] }}

                  ],
                  create: function(){
                      var gridRowData = pqgridPhysician.publishCodeListGridPQ.$gridDiv.pqGrid( "option" , "dataModel.data" );
                     
                  },
              });
          },
          fillGrid: function() {
              var datalength = this.data.length;

              for (var i = 0; i < datalength; i++) {
                pqgridPhysician.publishCodeListGridPQ.data[i].index = i;
              }
          }

      },

      publishAccountsGridPQ: {
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
             // this.showPType = param.showPType;
              this.data = param.data;
              //this.onClick = param.onClick;
              this.fillGrid();
              this.loadGrid();
          },
          reloadGrid: function() {
              this.$gridDiv = $(this.gridDiv);
              this.$gridDiv.pqGrid('destroy');
             // this.data = window["globalvars"]["assignedAccounts"];
              this.$gridDiv = $(this.gridDiv);
              this.fillGrid();
              this.loadGrid();
          },
          loadGrid: function() {
              this.$gridDiv.pqGrid({
                     width: 800,
                       showTitle: false,            
                       columnBorders: false,
                       numberCell: false,
                       showBottom: true,
                       editable: false,
                       flexWidth: false,
                       columnBorders: true,
                       flexHeight: false,
                       scrollModel:{pace: 'fast', autoFit: true, theme: true },
                       resizable: false,
                       hwrap:true,
                       wrap:false,
                       collapsible: false,
                       filterModel: { on: true, mode: "AND", header: true },
                       pageModel: {type: "local", rPP:30, rPPOptions: [10, 20, 30, 50, 100], strRpp:"{0}", strDisplay:"{0} to {1} of {2}"},

                       dataModel: {
                              data: this.data,
                              sorting: "local",
                              // sortIndx: "isExist",
                              // sortDir: "down"
                       },
                  colModel: [
                      {title: 'index', hidden: true, dataIndx:'index'},
                      {title: 'Hospital Id', width: 90, align:"center",dataIndx: 'hospitalId',filter: { type: 'textbox', attr: 'placeholder="Search..."',condition: "contain", listeners: ['keyup'] }},
                      {title: 'Account Id', width: 120, align:"center", dataIndx: 'accountId',filter: { type: 'textbox', attr: 'placeholder="Search..."',condition: "contain", listeners: ['keyup'] }},
                      {title: 'Pred Key',width: 90,align:"center", dataIndx: 'predKey',filter: { type: 'textbox', attr: 'placeholder="Search..."',condition: "contain", listeners: ['keyup'] }},
                      {title: 'Pred Code', width: 90, align:"center", dataIndx: 'predCode',filter: { type: 'textbox', attr: 'placeholder="Search..."',condition: "contain", listeners: ['keyup'] }},
                      {title: 'Pred Date', width: 90, align:"center", dataIndx: 'predDate',filter: { type: 'textbox', attr: 'placeholder="Search..."',condition: "contain", listeners: ['keyup'] }},
                      {title: 'EV Score', width: 90, align:"center", dataIndx: 'evScore',filter: { type: 'textbox', attr: 'placeholder="Search..."',condition: "contain", listeners: ['keyup'] }},
                      {title: 'Response', width: 90,align:"center", dataIndx: 'cenAuditorFlag',filter: { type: 'textbox', attr: 'placeholder="Search..."',condition: "contain", listeners: ['keyup'] }},
                      {title: 'Date of Service', width: 90,align:"center", dataIndx: 'dateOfService',filter: { type: 'textbox', attr: 'placeholder="Search..."',condition: "contain", listeners: ['keyup'] }},
                      {title: 'Sent Flag', width: 90, align:"center", dataIndx: 'sentFlag',filter: { type: 'textbox', attr: 'placeholder="Search..."',condition: "contain", listeners: ['keyup'] }}

                  ],
                  create: function(){
                      var gridRowData = pqgridPhysician.publishAccountsGridPQ.$gridDiv.pqGrid( "option" , "dataModel.data" );
                     
                  },
              });
          },
          fillGrid: function() {
              var datalength = this.data.length;

              for (var i = 0; i < datalength; i++) {
                pqgridPhysician.publishAccountsGridPQ.data[i].index = i;
              }
          }

      },
    



};