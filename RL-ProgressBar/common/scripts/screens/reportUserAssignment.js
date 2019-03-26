screens.reportUserAssignment = {
		
		facilityIdList:{},
		uniqueHospitalList:[],
		initialize : function() {
			this.uniqueHospitalList = new Array();
			this.loadData();
		},
		
		loadData : function(){

			/*Load the List of Auditors Available*/
			$.when(
					
	    			$.ajax({
	    				type: 'GET',
	    				url: globalvars.root.allHospitalsUri,
	    				traditional: true,
	    				dataType: 'json'
	            	}),
				
	    			$.ajax({
	    				type: 'GET',
	    				url: globalvars.root.reportingAssignmentUri,
	    				traditional: true,
	    				dataType: 'json'
	            	}),

	    			$.ajax({
	    				type: 'GET',
	    				url: globalvars.root.usersUri,
	    				data: {role:"PHYSICIAN_RPT_USER"},
	    				traditional: true,
	    				dataType: 'json'
	            	})

			).done(function(data1, data2, data3){
			
            	globalvars["fullhospitalList"] = data1[0];
            	globalvars["reportingAssigmentData"] = data2[0];
            	globalvars["auditorsList"] = data3[0];
            	screens.reportUserAssignment.loadAuditorOptions();
            	screens.reportUserAssignment.drawScreen();
            	screens.reportUserAssignment.bindFunctionality();
            	
			});
		    
		    /* Load Grid Data*/
		    
			
		},
		
		drawScreen : function(){
			
		    getSYNC('common/templates/screens/reportUserAssignment.html', function (data) {
	            log('loading reportUserAssignment template');
	            globalvars.$contentcontainer.append($.nano(data,globalvars.localResourceMap));
	        });
		    
		    
			gridPhysician.reportUserAssignmentGrid.initialize({
                  data: globalvars.reportingAssigmentData,
                  gridDiv: "#auditor_assignment_grid_table",
                  pagerDiv: "#auditor_assignment_grid_pager"
  			});	
		},
		
		bindFunctionality:function(){
			
			var availableCoid = new Array();
			
			for(var i = 0; i< globalvars.fullhospitalList.length; i++){
				availableCoid.push(globalvars.fullhospitalList[i].hospitalId);
			}
			
			$("#search_auditor").autocomplete({
				source:availableCoid
			});
			
			$("#search_auditor").focus(function(){
				$("#search_auditor").val("");
				gridPhysician.reportUserAssignmentGrid.savePreviousRow();
			});
			
			
			$('#search_auditor').bind('keydown', function(event) {
				if (event.keyCode == 13){
					screens.reportUserAssignment.searchAuditor();
				}
			});
			
			$("#search_auditor_icon").click(function(){
				screens.reportUserAssignment.searchAuditor();
			});
			
			$("#auditor_assignment_submit").click(function(){
				gridPhysician.reportUserAssignmentGrid.savePreviousRow();
				
				
								
				if(screens.reportUserAssignment.uniqueHospitalList.length!=0){
					var auditor_assignment_array = gridPhysician.reportUserAssignmentGrid.$gridDiv.jqGrid('getGridParam', 'data');
	                var gridRecordLength =  gridPhysician.reportUserAssignmentGrid.$gridDiv.jqGrid('getGridParam', 'records');
	                var dataToSend = new Array();
	                var dataObj;
	                
					
	                
	                for(var i = 0 ; i < auditor_assignment_array.length; i++){
	                	dataObj = new Object();
	                	dataObj.userId = auditor_assignment_array[i].hospitalName;
	                	dataObj.userFullName = auditor_assignment_array[i].userFullName;
	                	dataObj.hospitals = screens.reportUserAssignment.auditorDetails(auditor_assignment_array[i].preBillSelectedAuditor);
	                	dataToSend.push(dataObj);
	                }
	                
	                log(dataToSend.length);
	                if(gridRecordLength != 0){
		                $.ajax({
		                	url:globalvars.root.reportingAssignmentUri,
		                	type:'PUT',
		                	async: true,
		                	data:JSON.stringify(dataToSend),
		                	contentType: 'application/json',
		                	success:function(data){
		                		dialogs.messageDialog.show({ text: globalvars.localResourceMap.auditor_assignment_success_message });
		                		globalvars.reportingAssigmentData = dataToSend;
		                	},
		                	error: function (jqXHR, textStatus, errorThrown) {
		                        if (jqXHR.status == 202) {
		                        	dialogs.messageDialog.show({ text: globalvars.localResourceMap.auditor_assignment_success_message });
			                		globalvars.reportingAssigmentData = dataToSend;
		                        }
		                    }
		                });
	                }
				}else{
					dialogs.messageDialog.show({ text: globalvars.localResourceMap.auditor_assignment_grid_no_changes_made_text });
				}
                
			});
			
			/*Reset Grid data*/
			
			$("#auditor_assignment_reset").click(function(){
				gridPhysician.reportUserAssignmentGrid.reloadGrid();
			});
		},
		
		/*Make the Auditor Options to show inside a Dropdown*/
		
		loadAuditorOptions:function(){
			   globalvars.auditorOptions = new String();
			   screens.reportUserAssignment.facilityIdList = new Array();
			   for(var i=0;i<globalvars.fullhospitalList.length;i++){
               	 globalvars.auditorOptions+= "<option value='"+globalvars.fullhospitalList[i].hospitalId+"'>"+globalvars.fullhospitalList[i].hospitalId+"</option>"
               	screens.reportUserAssignment.facilityIdList.push(globalvars.fullhospitalList[i].hospitalId);
			   }
		},
		
		/* Function to Search a Auditor inside the Auditor Assignment Grid */
		
		searchAuditor:function(){
			  var searchValue = $("#search_auditor").val(), findText;
			  
			  if(searchValue === "Search Auditor"){
				  dialogs.messageDialog.show({ text: globalvars.localResourceMap.auditor_assignment_search_auditor_message });
			  }else {
				  if (searchValue.length === 0) {
			        	 $("#auditor_assignment_grid_table")[0].p.search = false;
			             $.extend($("#auditor_assignment_grid_table")[0].p.postData,{filters:""});
			             $("#auditor_assignment_grid_table").trigger("reloadGrid");
				  }
			      findText = {groupOp:"OR",rules:[]};
			      findText.rules.push({field:"preBillSelectedAuditor",op:"cn",data:searchValue},{field:"postBillSelectedAuditor",op:"cn",data:searchValue});
			      $("#auditor_assignment_grid_table")[0].p.search = true;
			      $.extend($("#auditor_assignment_grid_table")[0].p.postData,{filters:JSON.stringify(findText)});
			      $("#auditor_assignment_grid_table").trigger("reloadGrid",[{page:1,current:true}]);
			  }
			  
		},
		
		/*This function Returns the list of Pre-Bill and Post-Bill Auditors in the same format as it received from the service*/
		
		auditorDetails : function(param){
			
			var selectedAuditorList = param;
			var auditorListToSend = new Array();
			var index=-1;
			var obj;

			
			for(var i = 0; i < selectedAuditorList.length;i++){
				
				for(j=0;j<screens.reportUserAssignment.facilityIdList.length;j++){
					if(screens.reportUserAssignment.facilityIdList[j] == selectedAuditorList[i]){
						index=j;
						break;
					}
				}
				
				if(index!== -1){
					obj = new Object();
					obj.hospitalId = globalvars.fullhospitalList[index].hospitalId;
					obj.hospitalName = globalvars.fullhospitalList[index].hospitalName;
					auditorListToSend.push(obj);
					index=-1;
				}
				
			}
			return auditorListToSend;
		}
}


