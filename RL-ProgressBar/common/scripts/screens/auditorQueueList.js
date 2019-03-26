screens.auditorQueueList = {
	initialize: function (param) {
		this.drawScreen();
		this.loadData();
	},
	drawScreen: function () {
		
		getSYNC('common/templates/screens/auditorQueueList.html', function (data) {
            globalvars.$contentcontainer.append($.nano(data,globalvars.localResourceMap));
        });
		

		
	},
	
	loadData: function(){
		
    	$.when(
        		$.ajax({
        			type: 'GET',
    	            url: globalvars.root.ruleAssigment,
    				traditional: true,
    				dataType: 'json'
        		})
    			
    	).done(function(data){

    		globalvars["auditorQueueSummary"] = data;

    		// globalvars["auditorQueueSummary"] = [
    		// {ruleId: "Test First", ruleDesc: "Test Desc", primaryTable: "T_PREDICTIONS_PRE", active: 1,auditorList: ["allen.shane", "Bob.Darko"],billTypeAll: 0,primaryTable: "T_PREDICTIONS_PRE","ruleJson":"{\"condition\":\"AND\",\"rules\":[{\"id\":119,\"field\":119,\"type\":\"integer\",\"input\":\"text\",\"operator\":202,\"value\":\"120000\"},{\"id\":117,\"field\":117,\"type\":\"date\",\"input\":\"text\",\"operator\":300,\"value\":\"2015-08-12\"}]}"}
								
			//					]

	   		if (gridPhysician.auditorQueueListGrid.$gridDiv.jqGrid)
		            gridPhysician.auditorQueueListGrid.$gridDiv.jqGrid('GridUnload');
			 
			

			if(globalvars.auditorQueueSummary.length > 0){
				$('#rule_summary_download_excel').show();
				$('.account_details_btn').show();
			}else{
				$('#rule_summary_download_excel').hide();
				$('.account_details_btn').hide();
			}
			
			var griddata = globalvars.auditorQueueSummary;
			gridPhysician.auditorQueueListGrid.initialize({
		          data: griddata,
		          gridDiv: "#auditor_queue_grid_table",
		          pagerDiv: "#prebill_grid_pager"
			});

			screens.auditorQueueList.bindFunctionality();

    	})
		 
	},
	bindFunctionality: function () {
		
		$('#auditor_queue_grid_table').on('click','.accountlist-account-cursor',function(){ 
			log($(this).text());
			var ruleId = $(this).text();
			var ruleSummary={};
			for(var i=0;i<globalvars.auditorQueueSummary.length;i++){
				if(ruleId == globalvars.auditorQueueSummary[i].ruleId){
					ruleSummary = globalvars.auditorQueueSummary[i];
					break;
				}
			}
			localStorage.setItem('auditorQueueSummary', JSON.stringify(ruleSummary)); 

					//if(globalvars.user.uType == globalvars.roles.supervisor){

						if($('#supervisorTools li.submenu_item').eq(1).text() == "New Auditor Queue"){
		                    $('#supervisorTools li.submenu_item').removeClass('active');
	                    	$('#supervisorTools li.submenu_item').eq(1).addClass('active');
		                }
	                    
	                    //$(this).addClass('active');
	                    app.screenManager.showScreen('newAuditorQueue');
                    //}else     
					//$("#sub_menu #supervisorTools li.submenu_item").eq(4).click();
			
		
		})

		var availableRuleName = new Array();
		
		for(var i = 0; i< globalvars.auditorQueueSummary.length; i++){
			if(globalvars.auditorQueueSummary[i].ruleId != null)
				availableRuleName.push(globalvars.auditorQueueSummary[i].ruleId);
		}
		
				
		$("#search_rule_code").bind("keydown", function (event) {
		    if (event.keyCode === $.ui.keyCode.TAB && $(this).data("ui-autocomplete").menu.active) {
		        event.preventDefault();
		    }
		}).autocomplete({
			source: availableRuleName,
		});
		
		$("#search_rule_code").focus(function(){
			$("#search_rule_code").val("");
		});
		
	
		$('#search_rule_code').bind('keydown', function(event) {
			if (event.keyCode == 13){
				screens.auditorQueueList.searchRuleName();

			}
		});
		
		$('#search_rule_icon').die('click').on('click',function(){
			screens.auditorQueueList.searchRuleName();
		});


		$('#rule_summary_download_excel').die('click').on('click',function(){
			var ruleUri = globalvars.root.ruleAssigmentDownload;
            window.location.href = ruleUri;
		});


		$('#submit_priority_detail_data').die('click').on('click',function(){

			

			if (gridPhysician.auditorQueueListGrid.selectedRow !== undefined) {
                log("submitting + saving row " + gridPhysician.auditorQueueListGrid.selectedRow);
                gridPhysician.auditorQueueListGrid.$gridDiv.jqGrid('saveRow', gridPhysician.auditorQueueListGrid.selectedRow);
            };

            var auditorQueueData = gridPhysician.auditorQueueListGrid.$gridDiv.getRowData();


            for (var i = 0; i < auditorQueueData.length; i++) {

            	if(auditorQueueData[i].priority == '' || auditorQueueData[i].priority == ' '){
            		dialogs.messageDialog.show({
                        text: 'Priority can not be left blank.',
                        title: globalvars.localResourceMap.error
                    });
                    return;
            	}else if (!(/^-?\d+$/.test(auditorQueueData[i].priority)) || isNaN(auditorQueueData[i].priority) || auditorQueueData[i].priority == 0 || auditorQueueData[i].priority < 0) {

            		dialogs.messageDialog.show({
                        text: 'Priority should be integer only',
                        title: globalvars.localResourceMap.error
                    });
                    return;
                               
                 } 
            	
            }
            
            var priorityList = [];
            
            for (var i = 0; i < auditorQueueData.length; i++) {

            	if(auditorQueueData[i].priority >= 0 && auditorQueueData[i].priority != "")
            	priorityList.push(auditorQueueData[i].priority);
            }

         //   console.log(priorityList);

            if(priorityList.checkIfArrayIsUnique()){

            	var gData = globalvars.auditorQueueSummary;

            	 $(gData).each(function (i) {
		  	 		if(auditorQueueData){
	        	 	for (var j=0;j<auditorQueueData.length;j++) {
	        	 		if(auditorQueueData[j].ruleId == gData[i].ruleId){
	        	 			gData[i].priority = auditorQueueData[j].priority;
	        	 			delete gData[i].status;
	        	 			delete gData[i].auditorId;
	        	 			delete gData[i].billType;
	        	 			delete gData[i].index;

	        	 			break;
	        	 			}
	        	 		}
	        	 	}


            		 });


            					$.ajax({
				                url: globalvars.root.ruleAssigment,
				                type: 'POST',
				                data: JSON.stringify(gData),
				                contentType: 'application/json',
				                success:function(data){
			                		dialogs.messageDialogRuleQueueSave.show({ text: 'Rules Priority Update Successfully'});
			                	},
			                	error: function (jqXHR, textStatus, errorThrown) {
			                        if (jqXHR.status == 201) {
			                        	dialogs.messageDialogRuleQueueSave.show({ text: 'Rules Priority Update Successfully'});
			                          	//$("#sub_menu #Configuration li.submenu_item").eq(0).click();
			                          	//dialogs.messageDialog.$messageDialogDiv.dialog('destroy');
			                        	
			                        	
			                        }
			                    }
				            });

            }
            else{
            	dialogs.messageDialog.show({
                        text: 'Auditor Queue priority should be unique for the system.',
                        title: globalvars.localResourceMap.error
                    });
            }
		})


		$('#submit_assigned_rule_data').die('click').on('click',function(){

			
			// if (grids.auditorQueueListGrid.selectedRow !== undefined) {
   //              log("submitting + saving row " + grids.auditorQueueListGrid.selectedRow);
   //              grids.auditorQueueListGrid.$gridDiv.jqGrid('saveRow', grids.auditorQueueListGrid.selectedRow);
   //          };

   //          var auditorQueueData = grids.auditorQueueListGrid.$gridDiv.getRowData();
            
   //          var priorityList = [];
            
   //          for (var i = 0; i < auditorQueueData.length; i++) {

   //          	if(auditorQueueData[i].priority >= 0 && auditorQueueData[i].priority != "")
   //          	priorityList.push(auditorQueueData[i].priority);
   //          }

   //          console.log(priorityList);

   //          if(priorityList.checkIfArrayIsUnique()){

   //          	var gData = globalvars.auditorQueueSummary;

   //          	 $(gData).each(function (i) {
		 //  	 		if(auditorQueueData){
	  //       	 	for (var j=0;j<auditorQueueData.length;j++) {
	  //       	 		if(auditorQueueData[j].ruleId == gData[i].ruleId){
	  //       	 			gData[i].priority = auditorQueueData[j].priority;
	  //       	 			delete gData[i].status;
	  //       	 			delete gData[i].auditorId;
	  //       	 			delete gData[i].billType;
	  //       	 			delete gData[i].index;

	  //       	 			break;
	  //       	 			}
	  //       	 		}
	  //       	 	}


   //          		 });


            	 	dialogs.messageDialogRuleRunChange.show({
                        text: 'System will reassign accounts based on auditor queue priority. Do you want to continue?',
                        title: 'Info'
                    });
            	 	

            					

  //           }
  //           else{
  //           	dialogs.messageDialog.show({
  //                       text: 'Auditor Queue List should be unique for the system.',
  //                       title: globalvars.localResourceMap.error
  //                   });
  //           }
		 })



    },
updateRuleAssignRun:function(){

			$.ajax({
	            url: globalvars.root.ruleAssigmentRun,
	            type: 'GET',
	            contentType: 'application/json',
	            success:function(data){
	        		dialogs.messageDialogRuleQueueSave.show({ text: 'All Rules Assigned Successfully'});
	        	},
	        	error: function (jqXHR, textStatus, errorThrown) {
	                if (jqXHR.status == 201) {
	                	dialogs.messageDialogRuleQueueSave.show({ text: 'All Rules Assigned Successfully'});
	                  	//$("#sub_menu #Configuration li.submenu_item").eq(0).click();
	                  	//dialogs.messageDialog.$messageDialogDiv.dialog('destroy');
	                	
	                	
	                }
	            }
	        });
	


},

    searchRuleName:function(){
		  var searchValue = $("#search_rule_code").val(), findText;
		  
		  if(searchValue == "Search Rule Name"){
			  dialogs.messageDialog.show({ text: 'Please Enter a Rule Name to Search' });
		  }else {
			  if (searchValue.length === 0) {
				  	 dialogs.messageDialog.show({ text: 'Search Rule Name is empty' });
		        	 $("#auditor_queue_grid_table")[0].p.search = false;
		             $.extend($("#auditor_queue_grid_table")[0].p.postData,{filters:""});
		             $("#auditor_queue_grid_table").trigger("reloadGrid");
			  }
		      findText = {groupOp:"OR",rules:[]};
		      findText.rules.push({field:"ruleId",op:"cn",data:searchValue});
		      $("#auditor_queue_grid_table")[0].p.search = true;
		      $.extend($("#auditor_queue_grid_table")[0].p.postData,{filters:JSON.stringify(findText)});
		      $("#auditor_queue_grid_table").trigger("reloadGrid",[{page:1,current:true}]);
		  }
		  
	},

	
		
};