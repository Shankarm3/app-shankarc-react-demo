screens.physicianAuditorAssignment = {
    auditorIdList: {},
    facilityIdList: {},
    uniqueHospitalList: [],
    filterList: [],
    initialize: function () {
        this.uniqueHospitalList = new Array();
        this.uniqueFacilityList = new Array();
        this.loadData();
    },
    loadData: function () {

        /*Load the List of Auditors Available*/

        $.when(
                $.ajax({
                    type: 'GET',
                    url: globalvars.root.usersPhyUri,
                    traditional: true,
                    dataType: 'json'
                }),
                $.ajax({
                    type: 'GET',
                    url: globalvars.root.auditorAssignmentUri,
                    traditional: true,
                    dataType: 'json'
                }),
                $.ajax({
                    type: 'GET',
                    url: globalvars.root.viewCodeAssignmentUri,
                    traditional: true,
                    dataType: 'json'
                })





                ).done(function (data1, data2, data3) {

            globalvars["auditorsList"] = data1[0];
            globalvars["auditorAssignmentData"] = data2[0];
            globalvars["auditorAssignmentBreakupData"] = data3[0];



            // globalvars["auditorAssignmentData"] = [{"source":"GSHA","costcenter":"SDS","preBillAuditors":["PAuditor"],"facilityList":["BNJ"]},
            // {"source":"GSHA","costcenter":"SDS","preBillAuditors":["PhysicianAuditor","PAuditor"],"facilityList":["CHNJ"]},
            // {"source":"GSHA","costcenter":"SDS","preBillAuditors":["PhysicianAuditor"],"facilityList":["HUMC","CHNJ"]},
            // ]


            // globalvars["auditorAssignmentBreakupData"] =[{"source":"GSHA","costcenter":"SDS","facility":"BNJ","auditor":"PhysicianAuditor","codeAssigned":"abc"},
            // {"source":"GSHA","costcenter":"SDS","facility":"BNJ","auditor":"PhysicianAuditor","codeAssigned":"abc"},
            // {"source":"GSHA","costcenter":"SDS","facility":"BNJ","auditor":"PhysicianAuditor","codeAssigned":"abc"}]

            screens.physicianAuditorAssignment.loadAuditorOptions();
            // screens.physicianAuditorAssignment.loadFacilityOptions();

            screens.physicianAuditorAssignment.drawScreen();
            screens.physicianAuditorAssignment.bindFunctionality();

        });



    },
    drawScreen: function () {

        getSYNC('common/templates/screens/physicianAuditorAssignment.html', function (data) {
            log('loading auditorAssignment template');
            globalvars.$contentcontainer.append($.nano(data, globalvars.localResourceMap));
        });



        gridPhysician.loadPhysicianAuditorAssignmentGrid.initialize({
            data: globalvars.auditorAssignmentData,
            gridDiv: "#auditor_assignment_grid_table",
            pagerDiv: "#auditor_assignment_grid_pager"
        });

        gridPhysician.loadPhysicianAssignmentBreakupGrid.initialize({
            data: globalvars.auditorAssignmentBreakupData,
            gridDiv: "#auditor_assignment_Breakup_grid_table",
            pagerDiv: "#auditor_assignment_Breakup_grid_pager"
        });

    },
    bindFunctionality: function () {


        for (var i = 0; i < globalvars.auditorsList.length; i++) {
            screens.physicianAuditorAssignment.filterList.push(globalvars.auditorsList[i].userId);
        }

        $("#search_auditor").autocomplete({
            source: screens.physicianAuditorAssignment.filterList.unique()
        });

        $("#search_auditor").focus(function () {
            $("#search_auditor").val("");
            gridPhysician.loadPhysicianAuditorAssignmentGrid.savePreviousRow();
        });


        $('#search_auditor').bind('keydown', function (event) {
            if (event.keyCode == 13) {
                screens.physicianAuditorAssignment.searchAuditor();
            }
        });

        $("#search_auditor_icon").click(function () {
            screens.physicianAuditorAssignment.searchAuditor();
        });

        $("#auditor_assignment_submit").click(function () {
            gridPhysician.loadPhysicianAuditorAssignmentGrid.savePreviousRow()
            log(screens.physicianAuditorAssignment.uniqueHospitalList.length)

            if (screens.physicianAuditorAssignment.uniqueHospitalList.length != 0) {
                var auditor_assignment_array = gridPhysician.loadPhysicianAuditorAssignmentGrid.$gridDiv.jqGrid('getGridParam', 'data');
                var gridRecordLength = gridPhysician.loadPhysicianAuditorAssignmentGrid.$gridDiv.jqGrid('getGridParam', 'records');


                var dataToSend = new Array();
                var dataObj;

                for (var i = 0; i < auditor_assignment_array.length; i++) {
                    dataObj = new Object();
                    dataObj.source = auditor_assignment_array[i].source;
                    dataObj.costCenter = auditor_assignment_array[i].costCenter;
                    dataObj.hospitalId = auditor_assignment_array[i].hospitalId;
                    dataObj.auditorData = screens.physicianAuditorAssignment.auditorDetails(auditor_assignment_array[i].preBillSelectedAuditor);
                    dataToSend.push(dataObj);
                }

                log(dataToSend);
                if (gridRecordLength != 0) {
                    $.ajax({
                        url: globalvars.root.auditorAssignmentUri,
                        type: 'PUT',
                        async: true,
                        data: JSON.stringify(dataToSend),
                        contentType: 'application/json',
                        success: function (data) {
                            dialogs.messageDialog.show({text: globalvars.localResourceMap.auditor_assignment_success_message});
                            globalvars.auditorAssignmentData = dataToSend;
                            screens.physicianAuditorAssignment.viewCodeAssignment();
                            //$("#main_menu #Configuration li.submenu_item").eq(1).click();
                            $('#supervisorTools li.submenu_item').eq(1).click();
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            if (jqXHR.status == 202 && jqXHR.statusText == "Accepted") {
                                dialogs.messageDialog.show({text: globalvars.localResourceMap.auditor_assignment_success_message});
                                globalvars.auditorAssignmentData = dataToSend;
                                screens.physicianAuditorAssignment.viewCodeAssignment();
                                //$("#main_menu #Configuration li.submenu_item").eq(1).click();
                                $('#supervisorTools li.submenu_item').eq(1).click();
                            }
                        }
                    });
                }
            } else {
                dialogs.messageDialog.show({text: globalvars.localResourceMap.auditor_assignment_grid_no_changes_made_text});
            }

        });

        /*Reset Grid data*/

        $("#auditor_assignment_reset").click(function () {
            gridPhysician.loadPhysicianAuditorAssignmentGrid.reloadGrid();


        });
    },
    /*Make the Auditor Options to show inside a Dropdown*/

    loadAuditorOptions: function () {
        globalvars.auditorOptions = new String();
        screens.physicianAuditorAssignment.auditorIdList = new Array();
        for (var i = 0; i < globalvars.auditorsList.length; i++) {
            globalvars.auditorOptions += "<option value='" + globalvars.auditorsList[i].userId + "'>" + globalvars.auditorsList[i].userId + "</option>"
            screens.physicianAuditorAssignment.auditorIdList.push(globalvars.auditorsList[i].userId);
        }
    },
    // loadFacilityOptions:function(){
    // 	   globalvars.facilityOptions = new String();
    // 	   screens.physicianAuditorAssignment.facilityIdList = new Array();
    // 	   for(var i=0;i<globalvars.facilityList.length;i++){
    //              	 globalvars.facilityOptions+= "<option value='"+globalvars.facilityList[i].hospitalId+"'>"+globalvars.facilityList[i].hospitalId+"</option>"
    //              	screens.physicianAuditorAssignment.facilityIdList.push(globalvars.facilityList[i].hospitalId);
    // 	}
    // },

    /* Function to Search a Auditor inside the Auditor Assignment Grid */

    searchAuditor: function () {
        var searchValue = $("#search_auditor").val(), findText;
        console.log(searchValue);

        if (searchValue === "Search") {
            dialogs.messageDialog.show({text: 'Please Enter Value to Search'});
        } else {
            if (searchValue.length === 0) {
                $("#auditor_assignment_grid_table")[0].p.search = false;
                $.extend($("#auditor_assignment_grid_table")[0].p.postData, {filters: ""});
                $("#auditor_assignment_grid_table").trigger("reloadGrid");
            }
            findText = {groupOp: "OR", rules: []};
            findText.rules.push({field: "preBillSelectedAuditor", op: "cn", data: searchValue}, {field: "source", op: "cn", data: searchValue}, {field: "costCenter", op: "cn", data: searchValue}, {field: "hospitalId", op: "cn", data: searchValue});
            $("#auditor_assignment_grid_table")[0].p.search = true;
            $.extend($("#auditor_assignment_grid_table")[0].p.postData, {filters: JSON.stringify(findText)});
            $("#auditor_assignment_grid_table").trigger("reloadGrid", [{page: 1, current: true}]);
        }

    },
    /*This function Returns the list of Pre-Bill and Post-Bill Auditors in the same format as it received from the service*/

    auditorDetails: function (param) {
        var selectedAuditorList = param;
        var auditorListToSend = new Array();
        var index = -1;
        var obj;
        for (var i = 0; i < selectedAuditorList.length; i++) {

            for (j = 0; j < screens.physicianAuditorAssignment.auditorIdList.length; j++) {
                if (screens.physicianAuditorAssignment.auditorIdList[j] == selectedAuditorList[i]) {
                    index = j;
                    break;
                }
            }

            if (index !== -1) {
                // obj = new Object();
                // obj.userId = globalvars.auditorsList[index].userId;
                // obj.userFullName = globalvars.auditorsList[index].fullUserName;
                auditorListToSend.push(globalvars.auditorsList[index].userId);
                index = -1;
            }

        }
        return auditorListToSend;
    },
    viewCodeAssignment: function () {

        $.when(
                $.ajax({
                    type: 'GET',
                    url: globalvars.root.viewCodeAssignmentUri,
                    traditional: true,
                    dataType: 'json'
                })

                ).done(function (data1) {
            globalvars["auditorAssignmentBreakupData"] = data1;

            gridPhysician.loadPhysicianAssignmentBreakupGrid.initialize({
                data: globalvars.auditorAssignmentBreakupData,
                gridDiv: "#auditor_assignment_Breakup_grid_table",
                pagerDiv: "#auditor_assignment_Breakup_grid_pager"
            });

            gridPhysician.loadPhysicianAssignmentBreakupGrid.reloadGrid();

        })

    }

    // auditorDetails : function(param){
    // 	var selectedFacilityList = param;
    // 	var facilityListToSend = new Array();
    // 	var index=-1;
    // 	var obj;
    // 	for(var i = 0; i < selectedFacilityList.length;i++){

    // 		for(j=0;j<screens.physicianAuditorAssignment.facilityIdList.length;j++){
    // 			if(screens.physicianAuditorAssignment.facilityIdList[j] == selectedFacilityList[i]){
    // 				index=j;
    // 				break;
    // 			}
    // 		}

    // 		if(index!== -1){
    // 			// obj = new Object();
    // 			// obj.userId = globalvars.auditorsList[index].userId;
    // 			// obj.userFullName = globalvars.auditorsList[index].fullUserName;
    // 			// facilityListToSend.push(obj);
    // 			facilityListToSend.push(globalvars.auditorsList[index].userId);
    // 			index=-1;
    // 		}

    // 	}
    // 	return facilityListToSend;
    // }
}


