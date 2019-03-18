roles.administrator = {
    createMainMenu: function() {
            app.createScreenMenu.initialize([
                {name: "dashboard", title: globalvars.localResourceMap.supervisor_menu1,visible:true},
                //{ name: "overallTrends", title: globalvars.localResourceMap.supervisor_menu2 },

                {
                    name: "performanceComparison",
                    title: globalvars.localResourceMap.supervisor_menu3, subMenuTitle: "facility",visible:true,parameters: {subType: "DEPT"},
                    submenu: true,
                    submenuModel: [
                        {name: "performanceComparison", title: globalvars.localResourceMap.supervisor_menu4,visible:true},
                        {name: "facilityPerformance", title: globalvars.localResourceMap.supervisor_facility_performance_submenu1, parameters: {subType: "DEPT"},visible:true},
                        {name: "facilityPerformance", title: globalvars.localResourceMap.supervisor_facility_performance_submenu2, parameters: {subType: "PAT"},visible:true},
                        {name: "facilityPerformance", title: globalvars.localResourceMap.supervisor_facility_performance_submenu3, parameters: {subType: "CHARGE"},visible:true},
                        {name: "facilityPerformance", title: globalvars.localResourceMap.supervisor_facility_performance_submenu4, parameters: {subType: "AUDITOR"},visible:true},
                        {name: "facilityPerformance", title: globalvars.localResourceMap.supervisor_facility_performance_submenu5, parameters: {subType: "FSC"},visible:true}

                    ]
                },
                {name: "auditorPerformance", title: globalvars.localResourceMap.supervisor_menu7,visible:true},
                {
                    name: "liveSummary",
                    title: globalvars.localResourceMap.supervisor_menu5, subMenuTitle: "supervisorTools",visible:true,
                    submenu: true,
                    submenuModel: [
                        {name: "liveSummary", title: globalvars.localResourceMap.supervisor_menu10,visible:true},
                        {name: "auditorAssignment", title: globalvars.localResourceMap.supervisor_menu6,visible:true},
                        {name: "reportUserAssignment", title: globalvars.localResourceMap.supervisor_menu9,visible:true}                       
                    ]
                },
                {
                    name: "preBill",
                    title: globalvars.localResourceMap.supervisor_menu11, subMenuTitle: "auditor",visible:true,
                    submenu: true,parameters: {accountDetailsEditable: false,accountDetailsHidden:false,showSave: false,showSubmit: false,showAddRow: false, showDelRow: false,showPType:true},
                    submenuModel: [
									{
									    name: "preBill",
									    title: globalvars.localResourceMap.prebill_account_review_label,visible:true,
									    parameters: {
									        accountDetailsEditable: false,
									        accountDetailsHidden:false,
									        showSave: false,
									        showSubmit: false,
									        showAddRow: false,
									        showDelRow: false,
									        showPType:true
									    }
									},
									{
									    name: "postBill", title: globalvars.localResourceMap.postbill_account_review_label,visible:true, parameters: {
									        accountDetailsEditable: false,
									        accountDetailsHidden:false,
									        showSave: false,
									        showSubmit: false,
									        showAddRow: false,
									        showDelRow: false,
									        showPType:true
									    }
									},
									{  name: "associationRules", title:globalvars.localResourceMap.supervisor_account_review_submenu4,visible:globalvars.root.enableRule,
										 parameters: {
									        accountDetailsEditable: false,
									        accountDetailsHidden:false,
									        showSave: false,
									        showSubmit: false,
									        showAddRow: false,
									        showDelRow: false,
									        showPType:true
									    }
									},
									 {name: "confirmCharges", title: globalvars.localResourceMap.central_auditor_confirmed_charges_label,visible:true,parameters: {showPType:true}},
			                         {name: "editCharges", title: globalvars.localResourceMap.central_auditor_edit_account_label, parameters: {accountDetailsEditable: false,
								         accountDetailsHidden:false,
								         showSave: false,
								         showSubmit: false,
								         showAddRow: false,
								         showDelRow: false,
								         showPType:true},visible:true},

                    ]
                },
                {
                    name: "hitrateAnalysis",
                    title: 'Analysis', subMenuTitle: "Analysis",visible:true,
                    submenu: true,
                    submenuModel: [
                        {name: "hitrateAnalysis", title: 'Hit Rate Analysis',visible:true},
                        {name: "volumeAnalysis", title:'Volume Analysis',visible:true}
                       
                    ]
                },
                {
                    name: "ruleSummary",
                    title: 'Configuration', subMenuTitle: "Configuration",visible:true,
                    submenu: true,
                    submenuModel: [
                        {name: "ruleSummary", title: 'Rules Summary',visible:true},
                        {name: "newRule", title:'New Rule',visible:true}
//                        {name: "configScreen", title:'Configuration Screen',visible:true}
                       
                    ]
                }
               
            ], "#main_menu");
       

    },

    sendAccountDetails: function (param) { //url, type, callback, validateMissingCharges, validateSuccessfullySaved

            var existingChargesData = grids.existingChargesGrid.$gridDiv.getRowData();
            var missingChargesData = grids.missingChargesGrid.$gridDiv.getRowData();
            var otherChargesData = grids.otherChargesGrid.$gridDiv.getRowData();

                for (var i = 0; i < otherChargesData.length; i++) {
                    delete otherChargesData[i].search;
                    delete otherChargesData[i].id;
                };

                var jsonToSend = {
                    existing: existingChargesData,
                    missing: missingChargesData,
                    others: otherChargesData
                };

                jsonToSend = JSON.stringify(jsonToSend);

                log("account details stringified DATA: " + jsonToSend);
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