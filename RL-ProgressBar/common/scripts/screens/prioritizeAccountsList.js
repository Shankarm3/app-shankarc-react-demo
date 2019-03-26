screens.prioritizeAccountsList = {
		
	initialize: function (param) {
		this.drawScreen();
		this.loadData();
	},
	drawScreen: function () {
		
		getSYNC('common/templates/screens/prioritizeAccountsList.html', function (data) {
            globalvars.$contentcontainer.append($.nano(data,globalvars.localResourceMap));
        });
		
		
	},
	
	loadData: function(){
		
    	$.when(
        		$.ajax({
        			type: 'GET',
    	            url: globalvars.root.setEvScoreList,
    				traditional: true,
    				dataType: 'json'
        		})
    			
    	).done(function(data){

    		globalvars["CodesSummary"] = data;
	   		if (gridPhysician.accountsSummaryGrid.$gridDiv.jqGrid)
		            gridPhysician.accountsSummaryGrid.$gridDiv.jqGrid('GridUnload');
			 
			if(globalvars.CodesSummary){
				 for(var i=0;i<globalvars.CodesSummary.length;i++){

				 
					 if(globalvars.CodesSummary[i].sentFlag == "Y")
					 	globalvars.CodesSummary[i].sentFlag="Publish";
					 else if(globalvars.CodesSummary[i].sentFlag == "RETR")
					 	globalvars.CodesSummary[i].sentFlag="Retract";
					 else if(globalvars.CodesSummary[i].sentFlag == "SUP")
					 	globalvars.CodesSummary[i].sentFlag="Suppress";
                                         else if(globalvars.CodesSummary[i].sentFlag == "W")
					 	globalvars.CodesSummary[i].sentFlag="WaitList";   
                                         else if(globalvars.CodesSummary[i].sentFlag == "W1")
					 	globalvars.CodesSummary[i].sentFlag="WaitList1";
                                            
					 if(globalvars.CodesSummary[i].codeLevel == "C")
					 	globalvars.CodesSummary[i].codeLevel="Pred Key";
					 else if(globalvars.CodesSummary[i].codeLevel == "A")
					 	globalvars.CodesSummary[i].codeLevel="Account Id";

					 if(globalvars.CodesSummary[i].isActive == "1")
					 	globalvars.CodesSummary[i].isActive="Active";
					 else 
					 	globalvars.CodesSummary[i].isActive="In-Active";


				 }
			}


		
			 
			gridPhysician.accountsSummaryGrid.initialize({
		          data: globalvars.CodesSummary,
		          gridDiv: "#codes_grid_table",
		          pagerDiv: "#prebill_grid_pager"
			});

			screens.prioritizeAccountsList.bindFunctionality();

    	})
		 
	},
	bindFunctionality: function () {

    	$("button.fileDownloadCustomProgressBar").die("click").on("click", function (event) {
    		
    		event.preventDefault();
    		event.stopPropagation();
    		
            var $preparingFileModal = $("#preparing-file-modal");
     
            $preparingFileModal.dialog({ modal: true });
            var urlLocation = globalvars.root.ruleDownload;
            $.fileDownload(urlLocation, {
                successCallback: function (url) {
                    $preparingFileModal.dialog('destroy');
                },
                failCallback: function (responseHtml, url) {
     
                    $preparingFileModal.dialog('destroy');
                    $("#error-modal").dialog({ modal: true });
                }
            });
        
            return false; 

    	});

		$('#rule_grid_table').on('click','.accountlist-account-cursor',function(){ 
			// log($(this).text());
			// var ruleId = $(this).text();

			// var displayName="";

			//  	var ruleSummary={};
			// 	for(var i=0;i<globalvars.ruleSummary.length;i++){
			// 		if(ruleId == globalvars.ruleSummary[i].displayName){
			// 			//ruleSummary = globalvars.ruleSummary[i];
			// 			displayName = globalvars.ruleSummary[i].ruleId;
			// 			break;
			// 		}
			// 	}
				
				// localStorage.setItem('ruleSummary', JSON.stringify(ruleSummary));            
				// $("#sub_menu #Configuration li.submenu_item").eq(1).click();
				
			
			
			// $.ajax({
	  //           type: 'GET',
	  //           url: globalvars.root.ruleList+"/ruleDetail",
	  //           data: {"ruleId": displayName},
			// 	dataType: "json",
	  //           success: function(data) {
	  //           	if(data){
			// 			ruleSummary = data;
			// 			localStorage.setItem('ruleSummary', JSON.stringify(ruleSummary));            
			// 			$("#sub_menu #Configuration li.submenu_item").eq(1).click();
	  //           	}
	  //           },
	  //           error: function(jqxhr) {
	  //           	//alert('Error...');
	  //           }
	  //       });

		
		})

		// var availableRuleName = new Array();
		
		// for(var i = 0; i< globalvars.CodesSummary.length; i++){
		// 	if(globalvars.ruleSummary[i].displayName != null)
		// 		availableRuleName.push(globalvars.CodesSummary[i].displayName);
		// }
		
				
		// $("#search_rule_code").bind("keydown", function (event) {
		//     if (event.keyCode === $.ui.keyCode.TAB && $(this).data("ui-autocomplete").menu.active) {
		//         event.preventDefault();
		//     }
		// }).autocomplete({
		// 	source: availableRuleName,
		// });
		
		// $("#search_rule_code").focus(function(){
		// 	$("#search_rule_code").val("");
		// });
		
	
		// $('#search_rule_code').bind('keydown', function(event) {
		// 	if (event.keyCode == 13){
		// 		screens.publishCodesList.searchRuleName();

		// 	}
		// });
		
		// $('#search_rule_icon').die('click').on('click',function(){
		// 	screens.publishCodesList.searchRuleName();
		// });

		//commented for showing progress bar during download

		/*$('#rule_summary_download_excel').die('click').on('click',function(){
			var ruleUri = globalvars.root.ruleDownload;
            window.location.href = ruleUri;
		});*/

    },

    searchRuleName:function(){
		  var searchValue = $("#search_rule_code").val(), findText;
		  
		  if(searchValue == "Search Rule Name"){
			  dialogs.messageDialog.show({ text: 'Please Enter a Rule Name to Search' });
		  }else {
			  if (searchValue.length === 0) {
				  	 dialogs.messageDialog.show({ text: 'Search Rule Name is empty' });
		        	 $("#codes_grid_table")[0].p.search = false;
		             $.extend($("#codes_grid_table")[0].p.postData,{filters:""});
		             $("#codes_grid_table").trigger("reloadGrid");
			  }
		      findText = {groupOp:"OR",rules:[]};
		      findText.rules.push({field:"displayName",op:"cn",data:searchValue});
		      $("#codes_grid_table")[0].p.search = true;
		      $.extend($("#rule_grid_table")[0].p.postData,{filters:JSON.stringify(findText)});
		      $("#codes_grid_table").trigger("reloadGrid",[{page:1,current:true}]);
		  }
		  
	}

	
		
};