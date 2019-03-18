roles.centralAuditor = {
    createMainMenu: function (param) {

        app.createScreenMenu.initialize([
                 
                 {name:"centralAuditorDashboard",title:globalvars.localResourceMap.central_auditor_dashbaord_label,visible:true,parameters: {rulesInforce: false}},
                 { 
                	 name: "preBill", title: globalvars.localResourceMap.central_auditor_modules,visible:true,
                	 parameters: {accountDetailsEditable: true, accountDetailsHidden:false,showSave: true, showSubmit: true,showAddRow: true,showDelRow: true,showPType:true},
                	 submenu: true,subMenuTitle: "Modules",
                     submenuModel: [
                                    
                                    
									{
									    name: "preBill",
									    title: globalvars.localResourceMap.prebill_account_review_label,visible:true,
									    parameters: {
									        accountDetailsEditable: true,
									        accountDetailsHidden:false,
									        showSave: true,
									        showSubmit: true,
									        showAddRow: true,
									        showDelRow: true,
									        showPType:true
									    }
									},
									{
									    name: "postBill", title: globalvars.localResourceMap.postbill_account_review_label,visible:true, parameters: {
									        accountDetailsEditable: true,
									        accountDetailsHidden:false,
									        showSave: true,
									        showSubmit: true,
									        showAddRow: true,
									        showDelRow: true,
									        showPType:true
									    }
									},
									{  name: "associationRules", title:globalvars.localResourceMap.supervisor_account_review_submenu4,visible:false,
										 parameters: {
									        accountDetailsEditable: true,
									        accountDetailsHidden:false,
									        showSave: true,
									        showSubmit: true,
									        showAddRow: true,
									        showDelRow: true,
									        showPType:true
									    }
									}								
                                    
                                    
                       ]
                 
                 
                 
                 },
                 {
                     name: "confirmCharges",
                     title: globalvars.localResourceMap.central_auditor_charge_view_label, subMenuTitle: "charge",visible:true,parameters: {showPType:true},
                     submenu: true,
                     submenuModel: [
                         {name: "confirmCharges", title: globalvars.localResourceMap.central_auditor_confirmed_charges_label,visible:true,parameters: {showPType:true}},
                         {name: "editCharges", title: globalvars.localResourceMap.central_auditor_edit_account_label, parameters: {accountDetailsEditable: true,
					         accountDetailsHidden:false,
					         showSave: false,
					         showSubmit: true,
					         showAddRow: true,
					         showDelRow: true,
					         showPType:true},visible:true},
                         
                     ]
                 },
         
                
                 
        ], "#main_menu");
    },

    sendAccountDetails: function (param) { //url, type, callback, validateMissingCharges, validateSuccessfullySaved
    	//alert('test');
        //var existingChargesData = grids.existingChargesGrid.$gridDiv.getRowData();
    
        var otherChargesData = grids.otherChargesGrid.$gridDiv.getRowData();


            for (var i = 0; i < otherChargesData.length; i++) {
                delete otherChargesData[i].search;
                delete otherChargesData[i].id;
            };

            var jsonToSend={};
            log('param.screen::' + param.screen);
            

            if((param.screen == "preBill" || param.screen == "associationRules") && globalvars.root.enableRule && globalvars.root.enableCodingEdits){
                var existingChargesData = grids.existingChargesGrid.$gridDiv.getRowData();
                var missingChargesData = grids.missingChargesGrid.$gridDiv.getRowData();
            	var associateCodesData = grids.associationRulesGrid.$gridDiv.getRowData();
	            for (var i = 0; i < associateCodesData.length; i++) {
	                delete associateCodesData[i].search;
	                delete associateCodesData[i].id;
	            };


	            jsonToSend = {
	                existing: existingChargesData,
	                missing: missingChargesData,
	                others: otherChargesData,
	                assocRules:associateCodesData,
	                codingEdits:[]
	            }
            }
            else if((param.screen == "preBill" || param.screen == "associationRules") && globalvars.root.enableRule){
                var existingChargesData = grids.existingChargesGrid.$gridDiv.getRowData();
                var missingChargesData = grids.missingChargesGrid.$gridDiv.getRowData();
            	var associateCodesData = grids.associationRulesGrid.$gridDiv.getRowData();
	            for (var i = 0; i < associateCodesData.length; i++) {
	                delete associateCodesData[i].search;
	                delete associateCodesData[i].id;
	            };

	            jsonToSend = {
	                existing: existingChargesData,
	                missing: missingChargesData,
	                others: otherChargesData,
	                assocRules:associateCodesData
	            }
            }
            else if(param.screen == "cciEdits" && globalvars.root.enableCodingEdits && globalvars.root.enableRule){
                var existingChargesDataCCI = grids.existingChargesGridCCIEdits.$gridDiv.getRowData();
            	var cciEditsData = grids.cciEditsGrid.$gridDiv.getRowData();
	            for (var i = 0; i < cciEditsData.length; i++) {
	                delete cciEditsData[i].search;
	                delete cciEditsData[i].id;
	            };

	            jsonToSend = {
	                existing: existingChargesDataCCI,
	                missing: [],
	                others: otherChargesData,
	                codingEdits:cciEditsData,
	                assocRules:[]
	            }
            }
            else if(param.screen == "cciEdits" && globalvars.root.enableCodingEdits){
                var existingChargesDataCCI = grids.existingChargesGridCCIEdits.$gridDiv.getRowData();
            	var cciEditsData = grids.cciEditsGrid.$gridDiv.getRowData();
	            for (var i = 0; i < cciEditsData.length; i++) {
	                delete cciEditsData[i].search;
	                delete cciEditsData[i].id;
	            };

	            jsonToSend = {
	                existing: existingChargesDataCCI,
	                missing: [],
	                others: otherChargesData,
	                codingEdits:cciEditsData
	            }
            }
            else{
                var existingChargesData = grids.existingChargesGrid.$gridDiv.getRowData();
                var missingChargesData = grids.missingChargesGrid.$gridDiv.getRowData();
            	if(param.screen == "postBill" && globalvars.root.enableRule && globalvars.root.enableCodingEdits){
                	jsonToSend = {
        	                existing: existingChargesData,
        	                missing: missingChargesData,
        	                others: otherChargesData,
        	                assocRules:[],
        	                codingEdits:[]
        	            }
                }
            	else if(param.screen == "postBill" && globalvars.root.enableRule){
            	jsonToSend = {
    	                existing: existingChargesData,
    	                missing: missingChargesData,
    	                others: otherChargesData,
    	                assocRules:[]
    	            }
            	}
            	else if(param.screen == "postBill" && globalvars.root.enableCodingEdits){
                	jsonToSend = {
        	                existing: existingChargesData,
        	                missing: missingChargesData,
        	                others: otherChargesData,
        	                codingEdits:[]
        	            }
                	}
            	else{

            		jsonToSend = {
        	                existing: existingChargesData,
        	                missing: missingChargesData,
        	                others: otherChargesData,
        	            }

            	}

            }

            jsonToSend = JSON.stringify(jsonToSend);

            log("associate account details stringified DATA: " + jsonToSend);
            log("sent to: " + param.url);

            $.ajax({
                url: param.url,
                type: param.type,
                data: jsonToSend,
                async: false,
                contentType: 'application/json'
            });

            if (param.callback && typeof (param.callback) === "function") {
                log(" and launching callback");
                param.callback();
            };


    },

    checkLoadedHospitals: function () {
    	        
        if (globalvars.preHospitals === undefined){
            getJSONModel({
                async: false,
                url: globalvars.root.assignedHospitals,
                data:{billType:'PRE'},
                targetVar: "preHospitals"
                
            });
        };
        
        if (globalvars.postHospitals === undefined){
            getJSONModel({
                async: false,
                url: globalvars.root.assignedHospitals,
                data:{billType:'POST'},
                targetVar: "postHospitals"
                
            });
        };
        
    }

};

