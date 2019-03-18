roles.executive.createMainMenu = function () {
    app.createScreenMenu.initialize([
              { name: "dashboard", title: globalvars.localResourceMap.supervisor_menu1,visible:true},
              //{ name: "overallTrends", title: globalvars.localResourceMap.supervisor_menu2 },
              {
                  name: "performanceComparison",
                  title: globalvars.localResourceMap.supervisor_menu3,subMenuTitle:"facility",visible:true,parameters:{subType:"DEPT"},
                  submenu: true,
                  submenuModel: [
                    { name: "performanceComparison", title: globalvars.localResourceMap.supervisor_menu4,visible:true },
                    { name: "facilityPerformance", title: globalvars.localResourceMap.supervisor_facility_performance_submenu1,parameters:{subType:"DEPT"},visible:true},
                    { name: "facilityPerformance", title: globalvars.localResourceMap.supervisor_facility_performance_submenu2,parameters:{subType:"PAT"},visible:true},
                    { name: "facilityPerformance", title: globalvars.localResourceMap.supervisor_facility_performance_submenu3 ,parameters:{subType:"CHARGE"},visible:true},
                    {name: "facilityPerformance", title: globalvars.localResourceMap.supervisor_facility_performance_submenu5, parameters: {subType: "FSC"},visible:true}
                   
                  ]
              }
              
        ], "#main_menu");
    
};

