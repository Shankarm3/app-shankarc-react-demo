roles.administrator = {
    createMainMenu: function () {

        app.createScreenMenu.initialize([
            {name: "physicianDashboard", title: 'Dashboard', visible: true},
            {
                name: "performanceComparison",
                title: globalvars.localResourceMap.supervisor_menu3, subMenuTitle: "facility",visible:true,parameters: {subType: "COST_CENTER"},
                submenu: true,
                submenuModel: [
                    {name: "performanceComparison", title: globalvars.localResourceMap.supervisor_menu4,visible:true},
                    {name: "facilityPerformance", title: globalvars.localResourceMap.supervisor_facility_performance_submenu1, parameters: {subType: "COST_CENTER"},visible:true},
                    {name: "facilityPerformance", title: globalvars.localResourceMap.supervisor_facility_performance_submenu2, parameters: {subType: "DEPT"},visible:true},
                    {name: "facilityPerformance", title: globalvars.localResourceMap.supervisor_facility_performance_submenu3, parameters: {subType: "REGION"},visible:true},
                    {name: "facilityPerformance", title: globalvars.localResourceMap.supervisor_facility_performance_submenu4, parameters: {subType: "NPI"},visible:true},
                    // {name: "facilityPerformance", title: globalvars.localResourceMap.supervisor_facility_performance_submenu6, parameters: {subType: "FACILITY_DEPT"},visible:true},
                    // {name: "facilityPerformance", title: globalvars.localResourceMap.supervisor_facility_performance_submenu7, parameters: {subType: "FACILITY_HCPC"},visible:true}

                ]
            },
            {name: "auditorPerformance", title: globalvars.localResourceMap.supervisor_menu7,visible:true},
            {
                name: "auditorQueueList",
                title: globalvars.localResourceMap.supervisor_menu5, subMenuTitle: "supervisorTools",visible:true,
                submenu: true,
                submenuModel: [
                   
                    {name: "liveSummary", title: globalvars.localResourceMap.supervisor_menu10, visible: true},
                    {name: "physicianAuditorAssignment", title: globalvars.localResourceMap.supervisor_menu6, visible: true},
                    {name: "auditorQueueList", title: 'Additional Auditor Queue List',visible:true},
                    {name: "newAuditorQueue", title: 'New Auditor Queue',visible:true},
                    {name: "globalAccountSearch", title: 'Global Account Search',visible:true},
                    {name: "reportUserAssignment", title: globalvars.localResourceMap.supervisor_menu9,visible:true}

                ]
            },
            {name: "physicianAccountDetails",
                title: globalvars.localResourceMap.supervisor_menu11, subMenuTitle: "auditor", visible: true,
                submenu: true, parameters: {accountDetailsEditable: true, accountDetailsHidden: false, showSave: false, showSubmit: false, showAddRow: true, showDelRow: true, showPType: true},
                submenuModel: [
                    {name: "physicianAccountDetails", title: 'Account Review List', visible: true,
                        parameters: {accountDetailsEditable: true, accountDetailsHidden: false, showSave: false, showSubmit: false, showAddRow: true, showDelRow: true, showPType: true},
                    },
                    {name: "physicianConfirmCharges", title: globalvars.localResourceMap.central_auditor_confirmed_charges_label, visible: true},
                    {name: "editChargesPhysician", title: globalvars.localResourceMap.central_auditor_edit_account_label, parameters: {accountDetailsEditable: true,
                            accountDetailsHidden: false,
                            showSave: false,
                            showSubmit: false,
                            showAddRow: true,
                            showDelRow: true,
                            showPType: true}, visible: true}
                ]
            },
            {
                    name: "ruleSummary",
                    title: 'Configuration', subMenuTitle: "Configuration",visible:true,
                    submenu: true,
                    submenuModel: [
                        {name: "ruleSummary", title: 'Rules Summary',visible:true},
                        {name: "newRule", title:'New Rule',visible:true},
                        {name: "publishCodesList", title:'Published Code List',visible:true},
                        {name: "publishCodes", title:'Publish New Codes',visible:true},
                        {name: "prioritizeAccountsList", title:'Prioritize Account List',visible:true},
                        {name: "publishAccounts", title:'New Prioritize Accounts',visible:true}
                        ]
            }

            // {
            //         name: "physicianAuditorAssignment",
            //         title: globalvars.localResourceMap.supervisor_menu5, subMenuTitle: "supervisorTools",visible:true,
            //         submenu: true,
            //         submenuModel: [
            //             {name: "physicianAuditorAssignment", title: globalvars.localResourceMap.supervisor_menu6,visible:true}

            //         ]
            //     }

        ], "#main_menu");

    },
};