screens.ruleSummary = {
		
	initialize: function (param) {
		this.drawScreen();
		this.loadData();
	},
	drawScreen: function () {
		
		getSYNC('common/templates/screens/ruleSummary.html', function (data) {
            globalvars.$contentcontainer.append($.nano(data,globalvars.localResourceMap));
        });
		
		
	},
	
	loadData: function(){
		
    	$.when(
        		$.ajax({
        			type: 'GET',
    	            url: globalvars.root.ruleList,
    				traditional: true,
    				dataType: 'json'
        		})
    			
    	).done(function(data){

    		globalvars["ruleSummary"] = data;
	   		if (gridPhysician.ruleSummaryGrid.$gridDiv.jqGrid)
		            gridPhysician.ruleSummaryGrid.$gridDiv.jqGrid('GridUnload');
			 
			if(globalvars.ruleSummary){
				 for(var i=0;i<globalvars.ruleSummary.length;i++){
					 if(globalvars.ruleSummary[i].active == "1")
						 globalvars.ruleSummary[i].active = "Active";
					 else
						 globalvars.ruleSummary[i].active = "In-Active";
				 }
			}


			if(globalvars.ruleSummary.length > 0){
				$('#rule_summary_download_excel').show();
			}else{
				$('#rule_summary_download_excel').hide();
			}
			 
			gridPhysician.ruleSummaryGrid.initialize({
		          data: globalvars.ruleSummary,
		          gridDiv: "#rule_grid_table",
		          pagerDiv: "#prebill_grid_pager"
			});

			screens.ruleSummary.bindFunctionality();

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

		var availableRuleName = new Array();
		
		for(var i = 0; i< globalvars.ruleSummary.length; i++){
			if(globalvars.ruleSummary[i].ruleId != null)
				availableRuleName.push(globalvars.ruleSummary[i].ruleId);
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
				screens.ruleSummary.searchRuleName();

			}
		});
		
		$('#search_rule_icon').die('click').on('click',function(){
			screens.ruleSummary.searchRuleName();
		});

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
		        	 $("#rule_grid_table")[0].p.search = false;
		             $.extend($("#rule_grid_table")[0].p.postData,{filters:""});
		             $("#rule_grid_table").trigger("reloadGrid");
			  }
		      findText = {groupOp:"OR",rules:[]};
		      findText.rules.push({field:"ruleId",op:"cn",data:searchValue});
		      $("#rule_grid_table")[0].p.search = true;
		      $.extend($("#rule_grid_table")[0].p.postData,{filters:JSON.stringify(findText)});
		      $("#rule_grid_table").trigger("reloadGrid",[{page:1,current:true}]);
		  }
		  
	},

	
		
};