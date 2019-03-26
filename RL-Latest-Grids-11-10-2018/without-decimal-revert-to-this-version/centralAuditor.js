roles.centralAuditor = {
    createMainMenu: function (param) {

        app.createScreenMenu.initialize([
                 
                 {name:"centralAuditorDashboard",title:globalvars.localResourceMap.central_auditor_dashbaord_label,visible:true,parameters: {rulesInforce: true}},
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
									{  name: "associationRules", title:globalvars.localResourceMap.supervisor_account_review_submenu4,visible:globalvars.root.enableRule,
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
									{  name: "cciEdits", title:'Coding Edits',visible:globalvars.root.enableCodingEdits,
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
					     {name: "editChargesCCIEdits", title: 'Submitted Coding Edits', parameters: {accountDetailsEditable: true,
						         accountDetailsHidden:false,
						         showSave: false,
						         showSubmit: true,
						         showAddRow: true,
						         showDelRow: true,
						         showPType:true},visible:globalvars.root.enableCodingEdits},
                         
                     ]
                 },
                 {name:"help",title:'Help',visible:true}

         
                
                 
        ], "#main_menu");
    },
    autoSaveAccountDetails:function(param){
    	var existingChargesData = globalvars.existingCharges;

    	if(!globalvars.autoSaveOtherChargeData)
			globalvars.autoSaveOtherChargeData = globalvars.otherCharges;

		if(!globalvars.autoSaveMissingData)
			globalvars.autoSaveMissingData = globalvars.missingCharges;    		

    	var otherChargesData = globalvars.autoSaveOtherChargeData;
    	var missingChargesData = globalvars.autoSaveMissingData;

    	 for (var i = 0; i < otherChargesData.length; i++) {
                delete otherChargesData[i].search;
                delete otherChargesData[i].id;
                delete otherChargesData[i].selectedModifierListOther;
            };

         if(missingChargesData){
             for (var i = 0; i < missingChargesData.length; i++) {
                delete missingChargesData[i].selectedModifierList;
             };
          }

         if(existingChargesData){

            for (var j = 0; j < existingChargesData.length; j++) {
                delete existingChargesData[j].pq_rowcls;
                delete existingChargesData[j].pq_rowselect;
                delete existingChargesData[j].pq_cellselect;
                delete existingChargesData[j].index;
                delete existingChargesData[j].rowIndx;
                delete existingChargesData[j].pq_hidden;
                delete existingChargesData[j].groupKey;
		       	}
            }else{
            	existingChargesData=[];
            }

    	jsonToSend = {  
    					existing: existingChargesData,
        	            missing: missingChargesData,
        	          	others: otherChargesData,
                        codingEdits:[]
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

      

    },
    sendAccountDetails: function (param) { //url, type, callback, validateMissingCharges, validateSuccessfullySaved
    	//alert('test');
        //var existingChargesData = grids.existingChargesGrid.$gridDiv.getRowData();
    
        var otherChargesData = grids.otherChargesGrid.$gridDiv.getRowData();
     //   var existingChargesData = pqGrids.existingChargesGrid.$gridDiv.pqGrid("option" , "dataModel.data")



            for (var i = 0; i < otherChargesData.length; i++) {
                delete otherChargesData[i].search;
                delete otherChargesData[i].id;
                delete otherChargesData[i].selectedModifierListOther;
            };

            // for (var j = 0; j < existingChargesData.length; j++) {
            //     delete existingChargesData[j].pq_rowcls;
            //     delete existingChargesData[j].pq_rowselect;
            //     delete existingChargesData[j].index;

            // };

            var jsonToSend={};
            log('param.screen::' + param.screen);
            

            if((param.screen == "preBill" || param.screen == "associationRules") && globalvars.root.enableRule && globalvars.root.enableCodingEdits){
                //var existingChargesData = grids.existingChargesGrid.$gridDiv.getRowData();
                //var existingChargesData = pqGrids.existingChargesGrid.$gridDiv.pqGrid("option" , "dataModel.data")
                var existingChargesData = globalvars.existingCharges;
                var missingChargesData = grids.missingChargesGrid.$gridDiv.getRowData();
            	var associateCodesData = grids.associationRulesGrid.$gridDiv.getRowData();

            	// for (var i = 0; i < missingChargesData.length; i++) {
            	// 	delete missingChargesData[i].isPharmacy;
            	// }

	            for (var i = 0; i < associateCodesData.length; i++) {
	                delete associateCodesData[i].search;
	                delete associateCodesData[i].id;
	            };

                if(missingChargesData){
                     for (var i = 0; i < missingChargesData.length; i++) {
                        delete missingChargesData[i].selectedModifierList;
                     };
                }

	            if(existingChargesData){

		            for (var j = 0; j < existingChargesData.length; j++) {
		                delete existingChargesData[j].pq_rowcls;
		                delete existingChargesData[j].pq_rowselect;
		                delete existingChargesData[j].index;
		                delete existingChargesData[j].rowIndx;
		                delete existingChargesData[j].pq_hidden;
		                delete existingChargesData[j].groupKey;
                        delete existingChargesData[j].pq_cellselect;

	            	};
	            }else{
	            	existingChargesData=[];
	            }


	            jsonToSend = {
	                existing: existingChargesData,
	                missing: missingChargesData,
	                others: otherChargesData,
	                assocRules:associateCodesData,
	                codingEdits:[]
	            }
            }
            else if((param.screen == "preBill" || param.screen == "associationRules") && globalvars.root.enableRule){
              //  var existingChargesData = grids.existingChargesGrid.$gridDiv.getRowData();
                var missingChargesData = grids.missingChargesGrid.$gridDiv.getRowData();
            	var associateCodesData = grids.associationRulesGrid.$gridDiv.getRowData();
            	//var existingChargesData = pqGrids.existingChargesGrid.$gridDiv.pqGrid("option" , "dataModel.data")
            	var existingChargesData = globalvars.existingCharges;

	            for (var i = 0; i < associateCodesData.length; i++) {
	                delete associateCodesData[i].search;
	                delete associateCodesData[i].id;
	            };

	            // for (var i = 0; i < missingChargesData.length; i++) {
            	// 	delete missingChargesData[i].isPharmacy;
            	// }

                if(missingChargesData){
                     for (var i = 0; i < missingChargesData.length; i++) {
                        delete missingChargesData[i].selectedModifierList;
                     };
                }

	             if(existingChargesData){

		            for (var j = 0; j < existingChargesData.length; j++) {
		                delete existingChargesData[j].pq_rowcls;
		                delete existingChargesData[j].pq_rowselect;
		                delete existingChargesData[j].index;
		                delete existingChargesData[j].rowIndx;
		                delete existingChargesData[j].pq_hidden;
		                delete existingChargesData[j].groupKey;
                        delete existingChargesData[j].pq_cellselect;

	            	};
	            }else{
	            	existingChargesData=[];
	            }



            	
	            jsonToSend = {
	                existing: existingChargesData,
	                missing: missingChargesData,
	                others: otherChargesData,
	                assocRules:associateCodesData
	            }
            }
            else if(param.screen == "cciEdits" && globalvars.root.enableCodingEdits && globalvars.root.enableRule){
                var existingChargesDataCCI = pqGrids.existingChargesGridCCI.$gridDiv.pqGrid("option" , "dataModel.data");

                for (var j = 0; j < existingChargesDataCCI.length; j++) {
	                delete existingChargesDataCCI[j].pq_rowcls;
	                delete existingChargesDataCCI[j].pq_rowselect;
	                delete existingChargesDataCCI[j].index;

            	};

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
                var existingChargesDataCCI = pqGrids.existingChargesGridCCI.$gridDiv.pqGrid("option" , "dataModel.data");
            	var cciEditsData = grids.cciEditsGrid.$gridDiv.getRowData();
	            
            	for (var j = 0; j < existingChargesDataCCI.length; j++) {
	                delete existingChargesDataCCI[j].pq_rowcls;
	                delete existingChargesDataCCI[j].pq_rowselect;
	                delete existingChargesDataCCI[j].index;

            	};


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
              //  var existingChargesData = grids.existingChargesGrid.$gridDiv.getRowData();
                var missingChargesData = grids.missingChargesGrid.$gridDiv.getRowData();

             //    for (var i = 0; i < missingChargesData.length; i++) {
            	// 	delete missingChargesData[i].isPharmacy;
            	// }
                if(missingChargesData){
                     for (var i = 0; i < missingChargesData.length; i++) {
                        delete missingChargesData[i].selectedModifierList;
                     };
                }
                //var existingChargesData = pqGrids.existingChargesGrid.$gridDiv.pqGrid("option" , "dataModel.data")
                var existingChargesData = globalvars.existingCharges;
	                 if(existingChargesData){

		            for (var j = 0; j < existingChargesData.length; j++) {
		                delete existingChargesData[j].pq_rowcls;
		                delete existingChargesData[j].pq_rowselect;
		                delete existingChargesData[j].index;
		                delete existingChargesData[j].rowIndx;
		                delete existingChargesData[j].pq_hidden;
		                delete existingChargesData[j].groupKey;
                        delete existingChargesData[j].pq_cellselect;

	            	};
	            }else{
	            	existingChargesData=[];
	            }

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
                                codingEdits:[]
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

    checkLoadedHospitals: function (type) {

    	var dfd = jQuery.Deferred();

        var  deferredCollection = [];

    		if(type == 'pre')
    			deferredCollection.push(getPreHospitals());

    		if(type == 'post')
       			deferredCollection.push(getPostHospitals());

	        if(globalvars.root.enableCodingEdits && type == 'edit')
	        	deferredCollection.push(getCCIHospitals());

	        if(type == 'all'){   // This is the case of charge view (confirm charge and edit charge)
	        	deferredCollection.push(getPreHospitals());
	        	deferredCollection.push(getPostHospitals());

	        }

        $.when.apply($, deferredCollection).done(function(){
        	return dfd.resolve();
        });        		

        function getPreHospitals(){
        	var dfd = jQuery.Deferred();
    		$.ajax({
				type: 'GET',
                url: globalvars.root.assignedHospitals,
                data:{billType:'PRE'},
				traditional: true,
				dataType: 'json',
				success: function(data){
	        		globalvars["preHospitals"] = data;
	    	    	return dfd.resolve();
				}
    		})
        	return dfd.promise();
        }

        function getPostHospitals(){
        	var dfd = jQuery.Deferred();
    		$.ajax({
				type: 'GET',
                url: globalvars.root.assignedHospitals,
                data:{billType:'POST'},
				traditional: true,
				dataType: 'json',
				success: function(data){
	        		globalvars["postHospitals"] = data;
	    	    	return dfd.resolve();
				}
    		})
        	return dfd.promise();
        }
        
        function getCCIHospitals(){
        	var dfd = jQuery.Deferred();
    		$.ajax({
				type: 'GET',
                url: globalvars.root.assignedHospitals,
                data:{billType:'EDITS'},
				traditional: true,
				dataType: 'json',
				success: function(data){
	        		globalvars["cciHospitals"] = data;
	    	    	return dfd.resolve();
				}
    		})
        	return dfd.promise();
        }
    	
    	return dfd.promise();
       
    }

};

