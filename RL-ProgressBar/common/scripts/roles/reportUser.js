roles.reportUser = {
    createMainMenu: function () {

        app.createScreenMenu.initialize([
            {name: "physicianDashboard", title: 'Dashboard', visible: true},
            {name: "physicianAccountDetails",
                title: globalvars.localResourceMap.supervisor_menu11, subMenuTitle: "auditor", visible: true,
                submenu: true, parameters: {accountDetailsEditable: true, accountDetailsHidden: false, showSave: false, showSubmit: false, showAddRow: true, showDelRow: true, showPType: true},
                submenuModel: [
                    {name: "physicianAccountDetails", title: 'Account Review List', visible: true,
                        parameters: {accountDetailsEditable: true, accountDetailsHidden: false, showSave: false, showSubmit: false, showAddRow: true, showDelRow: true, showPType: true},
                    },
                    {name: "physicianConfirmCharges", title: globalvars.localResourceMap.central_auditor_confirmed_charges_label, visible: true}
                   
                ]
            }

            ],"#main_menu" )

    }

}