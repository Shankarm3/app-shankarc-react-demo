screens.liveSummary = {
        
    initialize: function (param) {
        this.drawScreen();
        //this.loadData();
        this.bindFunctionality();
        //this.drawTable();
    },
    drawScreen: function () {
        
        getSYNC('common/templates/screens/liveSummary.html', function (data) {
            globalvars.$contentcontainer.append($.nano(data,globalvars.localResourceMap));
        });
        

         widgets.physicianLiveSummaryFilter.initialize({
            $targetDiv: $("#filters_wrapper"),
            screen: 'liveSummary'
            
        });
        

        
        
        
    },
    onFilterUpdate: function () {
        this.loadData();
    },
    loadData: function(){
    
        $.ajax({
            type: 'GET',
            url: globalvars.root.physCurrentSummary + '?costCenter=' + $('input:radio[name=costCenter]:checked').val(),
            traditional: true,
            dataType: 'json',
            success: function(data){
                globalvars["currentFacilitySummary"] = data;
                globalvars["currentAuditorSummary"] = jQuery.extend(true,{}, data);
                screens.liveSummary.populateData();
            }
        })



    },
    populateData: function(){
        
        charts.barChart.initialize({
            completed: globalvars.currentFacilitySummary.completed,
            targetId: 'selected_facility_total_account_chart',
            total:100,
            total: (globalvars.currentFacilitySummary.totalAccount != 0) ? globalvars.currentFacilitySummary.totalAccount : $('#selected_facility_total_account_chart').width(),
            type: 'AccountChart'

        });

        
            
        var currDate = getCurrentDate();
        
        
        $(".live_summary_today_date").text("(" + (currDate.month+1) + "/" + currDate.day + "/" + currDate.year + ")");
        $('#selected_total_account_value').text(globalvars.localResourceMap.accounts_total + " " + globalvars.currentFacilitySummary.totalAccount);
        $('#selected_completed_account_value').text(globalvars.localResourceMap.accounts_completed + " " + globalvars.currentFacilitySummary.completed);
        $('#selected_remaining_account_value').text(globalvars.localResourceMap.accounts_remaining + " " + (globalvars.currentFacilitySummary.totalAccount - globalvars.currentFacilitySummary.completed));
        $('#selected_hit_account_value').text(globalvars.localResourceMap.live_summary_grid_hit_account + ": " + globalvars.currentFacilitySummary.totalHitCount);
        $('#selected_amount_found_value').text(globalvars.localResourceMap.live_summary_grid_amount_found + ": " + numberWithCommasToInt(globalvars.currentFacilitySummary.totalHitValue));
        
        
        $("#prebill_grid_table").jqGrid('GridUnload');
        $("#postbill_grid_table").jqGrid('GridUnload');

        var treeListData =  [];
        treeListData = screens.liveSummary.populateTreeViewData();    
        
        var populateAuditorData=[];
        populateAuditorData = screens.liveSummary.populateAuditorData();

        gridPhysician.loadLiveSummaryByFacilityGrid({
            gridDiv: "#prebill_grid_table",
            pagerDiv: "#prebill_grid_pager",
            data: treeListData
        });
        
        gridPhysician.loadLiveSummaryByAuditorGrid({
            gridDiv: "#postbill_grid_table",
            pagerDiv: "#postbill_grid_pager",
            data: populateAuditorData
        });
        
    },
    bindFunctionality: function () {
        
        $("#dashboard_facility_report_wrapper input").click(function(){
            var selectClass= $("#dashboard_facility_report_wrapper").attr('class')
            if(selectClass == "summary_bill_wrapper_hiddden"){
                $("#dashboard_facility_report_wrapper").removeClass('summary_bill_wrapper_hiddden');
                $("#dashboard_facility_report_wrapper").addClass('summary_bill_wrapper');
                $("#summary_by_facility_table_wrapper").removeClass('summary_report_hide');
                $("#summary_by_facility_table_wrapper").addClass('summary_report_show');
                $("#dashboard_facility_report_wrapper input").removeClass('live_summary_row_down_arrow');
                $("#dashboard_facility_report_wrapper input").addClass('live_summary_row_up_arrow')
            }
            else
            {
                $("#dashboard_facility_report_wrapper").removeClass('summary_bill_wrapper');
                $("#dashboard_facility_report_wrapper").addClass('summary_bill_wrapper_hiddden');
                $("#summary_by_facility_table_wrapper").removeClass('summary_report_show');
                $("#summary_by_facility_table_wrapper").addClass('summary_report_hide');
                $("#dashboard_facility_report_wrapper input").removeClass('live_summary_row_up_arrow');
                $("#dashboard_facility_report_wrapper input").addClass('live_summary_row_down_arrow')
            }
            
            
            
            
        });
        
        $("#dashboard_auditor_report_wrapper input").click(function(){
            $("#dashboard_auditor_report_wrapper input").toggleClass('live_summary_row_up_arrow');
            var selectClass= $("#dashboard_auditor_report_wrapper").attr('class')
            if(selectClass == "summary_bill_wrapper_hiddden"){
                $("#dashboard_auditor_report_wrapper").removeClass('summary_bill_wrapper_hiddden');
                $("#dashboard_auditor_report_wrapper").addClass('summary_bill_wrapper');
                $("#summary_by_auditor_table_wrapper").removeClass('summary_report_hide');
                $("#summary_by_auditor_table_wrapper").addClass('summary_report_show');
            }
            else
            {
                $("#dashboard_auditor_report_wrapper").removeClass('summary_bill_wrapper');
                $("#dashboard_auditor_report_wrapper").addClass('summary_bill_wrapper_hiddden');
                $("#summary_by_auditor_table_wrapper").removeClass('summary_report_show');
                $("#summary_by_auditor_table_wrapper").addClass('summary_report_hide');
            }
            
        });
        
    },
    
    populateTreeViewData:function(){
        var dataFacility =[];
        dataFacility = globalvars.currentFacilitySummary.facilityList;
        
        if(dataFacility)
        {
            var uniqueHospListFacility=[];
            $.each(dataFacility, function (index) {
                var flag=true;
                //var currItem = this;
                dataFacility[index].level="";
                dataFacility[index].parent="null";
                dataFacility[index].isLeaf=true;
                dataFacility[index].expanded=false;
                var obj = new Object();
                for(i=0;i<uniqueHospListFacility.length;i++){
                    if(uniqueHospListFacility[i].hospitalId == dataFacility[index].hospitalId){
                        uniqueHospListFacility[i].hospitalList.push(dataFacility[index]);
                        flag=false;
                        break;
                    }
                }
                if(flag==true)
                {
                    obj.hospitalId = dataFacility[index].hospitalId;
                    obj.hospitalList = new Array();
                    obj.hospitalList.push(dataFacility[index]);
                    uniqueHospListFacility.push(obj);
                }
                
            });
            
            var treeListDataFacility=[];
            $.each(uniqueHospListFacility, function (i) {
                if(uniqueHospListFacility[i].hospitalList.length > 1){
                    var reviewed=0;
                    var totalAccounts=0;
                    var remaining=0;
                    var completed=0;
                    var hospName;
                    var hospShortName;
                    var hitCount=0;
                    var hitValue=0
                    var hospitalId;
                    var obj = new Object();
                    var tempTreeListDataFalicity = new Array();
                    $.each(uniqueHospListFacility[i].hospitalList, function (j){  // this is for child
                        var currSel = {};
                        currSel = uniqueHospListFacility[i].hospitalList[j];
                        hospitalId = currSel.hospitalId;
                        totalAccounts += currSel.totalAccounts;
                        reviewed += currSel.reviewed;
                        completed += currSel.completed;
                        remaining += currSel.remaining;
                        hospName = currSel.hospitalName;
                        hospShortName = currSel.hospitalShortName;
                        hitCount += currSel.hitCount;
                        hitValue += currSel.hitValue;
                        currSel.name=currSel.fullAuditorName;
                        currSel.reviewed = Math.round(currSel.reviewed)
                        currSel.hospitalName = currSel.fullAuditorName;
                        currSel.parent=convertSpacetoUnderscoreString(hospitalId);
                        currSel.hitCount = currSel.hitCount;
                        currSel.hitValue = Math.round(currSel.hitValue);
                        currSel.id=convertSpacetoUnderscoreString(hospitalId) + "_" + j;
                        currSel.hospitalId="";
                        currSel.hospitalShortName="";
                        
                        tempTreeListDataFalicity.push(uniqueHospListFacility[i].hospitalList[j]);
                    });
                    obj.hospitalId = hospitalId;   // this is for parent
                    obj.fullAuditorName="";
                    obj.hospitalName = hospName;
                    obj.name=hospName;
                    obj.hospitalShortName=hospShortName;
                    obj.reviewed = Math.round((completed*100)/totalAccounts);
                    obj.totalAccounts = totalAccounts;
                    obj.remaining = remaining;
                    obj.completed = completed;
                    obj.hitCount = hitCount;
                    obj.hitValue = Math.round(hitValue);
                    obj.level="0";
                    obj.parent="null";
                    obj.isLeaf=false;
                    obj.id=convertSpacetoUnderscoreString(hospitalId);
                    obj.expanded=false;
                    uniqueHospListFacility[i].hospitalList.push(obj);
                    treeListDataFacility.push(obj);
                    $.each(tempTreeListDataFalicity,function(i){
                        treeListDataFacility.push(tempTreeListDataFalicity[i]);
                    });
                        
                    
                }
                else{
                    var objectParent = jQuery.extend(true, {}, uniqueHospListFacility[i].hospitalList[0]);
                    var objectChild = jQuery.extend(true, {}, uniqueHospListFacility[i].hospitalList[0]);
                    objectParent.level="0";
                    objectParent.parent="null";
                    objectParent.isLeaf=false;
                    objectParent.expanded=false;
                    objectParent.fullAuditorName="";
                    objectParent.name = objectParent.hospitalName;
                    objectParent.hospitalShortName = objectParent.hospitalShortName;
                    objectParent.id=convertSpacetoUnderscoreString(objectParent.hospitalId);
                    objectParent.reviewed = Math.round(objectParent.reviewed);
                    objectParent.hitValue = Math.round(objectParent.hitValue);

                    
                    
                    treeListDataFacility.push(objectParent);
                    
                    
                    objectChild.hospitalName = objectChild.fullAuditorName;
                    objectChild.name = objectChild.fullAuditorName;
                    objectChild.parent=convertSpacetoUnderscoreString(objectChild.hospitalId);
                    objectChild.id=convertSpacetoUnderscoreString(objectChild.hospitalId) + "_1";
                    objectChild.reviewed = Math.round(objectChild.reviewed);
                    objectChild.hitValue = Math.round(objectChild.hitValue);

                    objectChild.hospitalId="";
                    objectChild.hospitalShortName="";
                    treeListDataFacility.push(objectChild);
                }
                
            });
            
        }

        console.log("facility:::::");
     
        console.log(treeListDataFacility);
          
          return treeListDataFacility;
        
    },
    
    populateAuditorData:function(){
        
        if(globalvars.currentAuditorSummary.facilityList)
        {
            var uniqueauditorList=[];
            $.each(globalvars.currentAuditorSummary.facilityList, function (index) {
                var flag=true;
                var currItem = this;
                currItem.level="";
                currItem.parent="null";
                currItem.isLeaf=true;
                currItem.expanded=false;
                var obj = new Object();
                for(i=0;i<uniqueauditorList.length;i++){
                    if(uniqueauditorList[i].userId == currItem.userId){
                        uniqueauditorList[i].userList.push(currItem);
                        flag=false;
                        break;
                    }
                }
                if(flag==true)
                {
                    obj.userId = currItem.userId;
                    obj.userList = new Array();
                    obj.userList.push(currItem);
                    uniqueauditorList.push(obj);
                }
                
            });
            
            
            var treeListData=[];
            $.each(uniqueauditorList, function (i) {
                if(uniqueauditorList[i].userList.length > 1){
                    var reviewed=0;
                    var totalAccounts=0;
                    var remaining=0;
                    var completed=0;
                    var hospName;
                    var hospShortName;
                    var hospitalId;
                    var hitCount=0;
                    var hitValue=0
                    var count=0;
                    var obj = new Object();
                    var tempTreeListData = new Array();
                    $.each(uniqueauditorList[i].userList, function (j){  // this is for child
                        var currSel = uniqueauditorList[i].userList[j];
                        userId = currSel.userId;
                        totalAccounts += currSel.totalAccounts;
                        reviewed += currSel.reviewed;
                        completed += currSel.completed;
                        remaining += currSel.remaining;
                        hitCount += currSel.hitCount;
                        hitValue += currSel.hitValue;
                        hospName = currSel.hospitalName;
                        hospShortName = currSel.hospitalShortName;
                        
                        currSel.name=currSel.hospitalName;
                        currSel.hospitalName = currSel.fullAuditorName;
                        currSel.reviewed = Math.round(currSel.reviewed)
                        currSel.hitCount = currSel.hitCount;
                        currSel.hitValue = Math.round(currSel.hitValue);
                        currSel.parent=convertSpacetoUnderscoreString(userId);
                        currSel.id=convertSpacetoUnderscoreString(userId)+ "_" + j;
                        currSel.userId="";
                        currSel.hospitalShortName="";
                        count ++;
                        tempTreeListData.push(uniqueauditorList[i].userList[j]);
                    });
                    obj.userId = userId;   // this is for parent
                    obj.fullAuditorName="";
                    obj.hospitalName = hospName;
                    obj.name="";
                    obj.hospitalShortName=hospShortName;
                    obj.reviewed = Math.round((completed*100)/totalAccounts);
                    obj.totalAccounts = totalAccounts;
                    obj.remaining = remaining;
                    obj.completed = completed;
                    obj.hitCount = hitCount;
                    obj.hitValue = Math.round(hitValue);
                    obj.level="0";
                    obj.parent="null";
                    obj.isLeaf=false;
                    obj.id=convertSpacetoUnderscoreString(userId);
                    obj.expanded=false;
                    uniqueauditorList[i].userList.push(obj);
                    treeListData.push(obj);
                    $.each(tempTreeListData,function(i){
                        treeListData.push(tempTreeListData[i]);
                    });
                        
                    
                }
                else{
                    var objectParent = jQuery.extend(true, {}, uniqueauditorList[i].userList[0]);
                    var objectChild = jQuery.extend(true, {}, uniqueauditorList[i].userList[0]);
                    objectParent.level="0";
                    objectParent.parent="null";
                    objectParent.isLeaf=false;
                    objectParent.expanded=false;
                    objectParent.fullAuditorName="";
                    objectParent.name = "";
                    objectParent.hospitalShortName = objectParent.hospitalShortName;
                    objectParent.id=convertSpacetoUnderscoreString(objectParent.userId);
                    objectParent.reviewed = Math.round(objectParent.reviewed);
                    objectParent.hitValue = Math.round(objectParent.hitValue);
                    

                    
                    
                    treeListData.push(objectParent);
                    
                    
                    objectChild.hospitalName = objectChild.hospitalName;
                    objectChild.name = objectChild.hospitalName;
                    objectChild.parent=convertSpacetoUnderscoreString(objectChild.userId);
                    objectChild.reviewed = Math.round(objectChild.reviewed);
                    objectChild.id=convertSpacetoUnderscoreString(objectChild.userId)+ "_1";
                    objectChild.hitValue = Math.round(objectChild.hitValue);
                    objectChild.userId="";
                    objectChild.hospitalShortName="";
                    treeListData.push(objectChild);
                }
                
            });
            
        }
         
         console.log("auditor:::::")
         console.log(treeListData);

          return treeListData;
    }
        
};