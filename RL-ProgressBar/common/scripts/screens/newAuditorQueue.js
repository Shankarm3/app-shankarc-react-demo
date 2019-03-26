screens.newAuditorQueue = {
	ruleTableTemplate:"",
	mode:'NEW',
	selectedTable:'',
	selectedPrevTableValue:'',
	localRuleData:'',
	initialize: function (param) {
		this.drawScreen();
		this.loadData();
	},
	drawScreen: function () {
		
		getSYNC('common/templates/screens/newAuditorQueue.html', function (data) {
            globalvars.$contentcontainer.append($.nano(data,globalvars.localResourceMap));
        });
		
		if(this.ruleTableTemplate==""){
    		this.ruleTableTemplate =  getTemplate('common/templates/option_item_auditor.html');
    	}
		
			var config = {
	      '.chosen-select'           : {},
	      '.chosen-select-deselect'  : {allow_single_deselect:true},
	      '.chosen-select-no-single' : {disable_search_threshold:10},
	      '.chosen-select-no-results': {no_results_text:'Oops, nothing found!'},
	      '.chosen-select-width'     : {width:"95%"}
	    	}
		    for (var selector in config) {
		      $(selector).chosen(config[selector]);
		    }
		
	},
	loadData: function(){
    	$.when(
        		$.ajax({
        			type: 'GET',
    	            url: globalvars.root.ruleConfigMap,
    				traditional: true,
    				dataType: 'json'
        		}),
        		$.ajax({
					type: 'GET',
	                url: globalvars.root.usersPhyUri,
					traditional: true,
					dataType: 'json',
					
	    		})
    			
    	).done(function(data1,data2){
    		globalvars["ruleConfig"] = data1[0];
    		globalvars["queueAuditorList"] = data2[0];
    		screens.newAuditorQueue.fillTableFilter();
    		var getRuleData = localStorage.getItem('auditorQueueSummary');
    		if(getRuleData)  			
    			screens.newAuditorQueue.populateEditRuleScreen(getRuleData);
    		else
  				screens.newAuditorQueue.populateNewRuleScreen();
    	});
    	


    			 
	},
	populateNewRuleScreen:function(){

		screens.newAuditorQueue.mode='NEW';
		 $('.parse-preview-builder1').hide();
		 $('.parse-clone-builder1').hide();
		 localStorage.removeItem('ruleSummary');
		 localStorage.removeItem('auditorQueueSummary');
		 screens.newAuditorQueue.bindFunctionality();
		 screens.newAuditorQueue.populateFilterData();
		 screens.newAuditorQueue.bindFunctionalityButtons();
		 screens.newAuditorQueue.fillAuditorList();

	},
	populateEditRuleScreen:function(getRuleData){
		screens.newAuditorQueue.mode='EDIT';
		var getRuleData = JSON.parse(getRuleData);
		screens.newAuditorQueue.localRuleData=getRuleData;
		$('.parse-preview-builder1').show();

		 $('.parse-clone-builder1').show();
		 $("#filter_table_select").val(getRuleData.primaryTable);
		// screens.newAuditorQueue.bindFunctionality(getRuleData.ruleType);
		screens.newAuditorQueue.populateFilterData();
		screens.newAuditorQueue.populateRuleData(getRuleData);
		screens.newAuditorQueue.bindFunctionality();
	    screens.newAuditorQueue.bindFunctionalityButtons();
        screens.newAuditorQueue.fillAuditorList(getRuleData.auditorList);
        screens.newAuditorQueue.populateCloneRule();
   		$("#filter_table_select").attr('disabled',true);
    	$("#txtRuleName").prop('disabled', true);
		$('#txtRuleName').val(getRuleData.ruleId);
		$('#txtRuleDesc').val(getRuleData.ruleDesc);
		//$("#filter_table_select").val(getRuleData.primaryTable);
		if(getRuleData.status == "Active")
			$("input:checkbox[name=ruleActive]").attr('checked', 'checked');
		if(getRuleData.billTypeAll == "1")
			$("input:checkbox[name=bothBillType]").attr('checked', 'checked');
    	
		localStorage.removeItem('auditorQueueSummary');

		
	},
	populateRuleData:function(getRuleData){
		
    	function changeOperator(rules){
    		var data = globalvars.ruleConfig.operatorList;
				for(var k=0;k<data.length;k++){
					var op = rules.operator;
					if(op == data[k].operatorId){
						rules.operator = data[k].operatorKey.toLowerCase();
						rules.id = changeIdValue(rules.id);
						rules.field = rules.id;
						
						if(rules.input == "select"){
							var strList = rules.value;
							rules.value = strList.split(',');
						}
						break;
					}
				}
    		return rules;
    	}
		
		
		function convertNameValuePair(value){
			var fieldArray=[];
			  if(value){
				  $(value).each(function (i){
					  var obj=new Object();
					  obj.id=value[i];
					  obj.name=value[i];
					  fieldArray.push(obj);
				  })
				  
			  }
			
			return fieldArray;
			
		}
    	
    	function changeIdValue(val){
    		var data = globalvars.ruleConfig.parameterList;
    		var id_val;
				for(var k=0;k<data.length;k++){
					var idValue = data[k].parameterId;
					if(val == idValue){
						id_val = data[k].tableName + "." + data[k].paramDbFieldName;
						break;
					}
				}
    		return id_val;
    	}
    	
    	function changeKeyOperator(jText){
    		if(jText.rules){
    			$(jText.rules).each(function (i) {
    				if(jText.rules[i].rules){
    						changeKeyOperator(jText.rules[i]);
    				}else{
    					jText.rules[i] = changeOperator(jText.rules[i]);
    				}
    			}) 
    			
    		}
    		
    		return jText
    	}

    	if(getRuleData){
	    	var convertedValue = changeKeyOperator(JSON.parse(getRuleData.ruleJson));
			$('#builder1').queryBuilder('setRules',convertedValue);
			$('.set').click();
		}
	},
	bindFunctionality: function () {

		$(".rule-operator-container select").live('change', function(){
			
			var selectedOperator = $(this).find("option:selected").val();
			var operatorDateRangeList = ["greater_by_x_days", "less_by_x_days"];

			if(jQuery.inArray(selectedOperator, operatorDateRangeList) >= 0){
				var inputID = $(this).parents(".rule-operator-container").siblings(".rule-value-container").find("input").prop("id");
				$(this).parents(".rule-operator-container").siblings(".rule-value-container:first").find("input").val("").unbind();
				$(this).parents(".rule-operator-container").siblings(".rule-value-container:first").find("input").bind('keydown', allowNumbersOnly);
			}
			else{
				$(this).parents(".rule-operator-container").siblings(".rule-value-container:first").find("input").bind('click', customBind);
				$(this).parents(".rule-operator-container").siblings(".rule-value-container:first").find("input").unbind('keydown');
			}

		});
		
		function customBind(){
			$(this).val("").datepicker('show');
		}

		
		screens.newAuditorQueue.selectedPrevTableValue = $("#filter_table_select").val();
		$("#filter_table_select").on('change', function(){
			var res = $('#builder1').queryBuilder('getRules');
			if(res.rules && res.rules.length > 0){
				screens.newAuditorQueue.selectedTable = $(this).val();
				dialogs.messageDialogAuditorQueueTableChange.show({text:'Table change will remove All selected Rule schema.'})
			}else{
				screens.newAuditorQueue.selectedTable = $(this).val();
				screens.newAuditorQueue.selectedPrevTableValue = screens.newAuditorQueue.selectedTable;
				screens.newAuditorQueue.changeRuleSchema();
			}
		});

	},
	changeRuleSchema:function(){
			var selectedTable = $("#filter_table_select").val();
			$("input:checkbox[name=bothBillType]").attr('disabled',false);
			
			if(screens.newAuditorQueue.mode == 'NEW')
				screens.newAuditorQueue.populateFilterData();
	},
	populateFilterData:function(){
		
		//console.log('populateFilterData call');
		$("#txtRuleName").prop('disabled', false);
		$('#builder1').queryBuilder('destroy');
		var filterTemplates =[];
		
		var stringTemplate = {
	    	    id: '',
	    	    label: '',
	    	    type: 'string',
	    	    size: 30,
	    	    unique: false
	    	  };
		var intTemplate = {
	    	    id: '',
	    	    label: '',
	    	    type: 'integer',
	    	    size: 5,
	    	    validation: {
	    	      min: 0,
	    	      step: 1
	    	    }
	    	  };
		
		var dateTemplates = {
			    id: '',
			    label: '',
			    type: 'date',
			    validation: {
			      //format: 'YYYY/MM/DD'
			    },
			    plugin: 'datepicker',
			    plugin_config: {
			      dateFormat: 'yy-mm-dd',
			      todayBtn: 'linked',
			      todayHighlight: true,
			      autoclose: true
			    }
			  };
		
		var listTemplates = {
		    id: '',
		    label: '',
		    type: 'string',
		    input: 'select',
		    multiple:true,
		    values: {
		    },
		    operators: ['equal', 'not_equal', 'in', 'not_in', 'is_null', 'is_not_null']
		  }
		
		var subQueryTemplate = {
	    	    id: '',
	    	    label: '',
	    	    type: 'string',
	    	    input: 'textarea',
	    	    size: 30,
	    	    rows: 3
	    	  }
		
		
		
			  filterTemplates.push(stringTemplate);
			  filterTemplates.push(intTemplate);
			  filterTemplates.push(dateTemplates);
			  filterTemplates.push(listTemplates);
			  filterTemplates.push(subQueryTemplate);
			  
			  
			  var filterArray=[];
			  var stringFilter={};

			  var parameterList=[];
			  var parameterListConfig = jQuery.extend(true, {}, globalvars.ruleConfig);
			  var parameterListTotal = parameterListConfig.parameterList;
			  var selectedTable = $('#filter_table_select').val();
			  //console.log("table selected::::: " + selectedTable);

			   if(selectedTable == 'T_PHYS_PATIENT_SCORABLE'){
			  	$(parameterListTotal).each(function (j) {
			  		//console.log(parameterListTotal[j].tableName);
			  		if(parameterListTotal[j].tableName != 'T_PHYS_PREDICTIONS' && parameterListTotal[j].tableName != 'T_PREDICTIONS_POST')
			  			parameterList.push(parameterListTotal[j]);
			  	})
			  }
			  else if(selectedTable == 'T_PHYS_PATIENT_VISITS_SCORABLE'){
			  	$(parameterListTotal).each(function (j) {
			  		//console.log(parameterListTotal[j].tableName);
			  		if(parameterListTotal[j].tableName == 'T_PHYS_PATIENT_VISITS_SCORABLE' || parameterListTotal[j].tableName == 'T_PHYS_CHARGES' || parameterListTotal[j].tableName == 'CUSTOM_EXPRESSION')
			  			parameterList.push(parameterListTotal[j]);
			  	})
			  }
			  else if(selectedTable == 'T_PHYS_PREDICTIONS'){
			  	$(parameterListTotal).each(function (j) {
			  		if(parameterListTotal[j].tableName != 'T_PREDICTIONS_POST')
			  			parameterList.push(parameterListTotal[j]);
			  	})
			  }
			  else if(selectedTable == 'T_PREDICTIONS_POST'){
			  	$(parameterListTotal).each(function (j) {
			  		if(parameterListTotal[j].tableName != 'T_PHYS_PREDICTIONS')
			  			parameterList.push(parameterListTotal[j]);
			  	})
			  }
			 




			  screens.newRule.paramToolTip={};

			  $(parameterList).each(function (i) {
				  stringFilter = new Object();


				  // this is custom implemetation for display name
				  var toolTipText = (parameterList[i].paramDesc==null ? parameterList[i].paramDisplayName:parameterList[i].paramDesc);
				  //parameterList[i].paramDisplayName = parameterList[i].paramDisplayName.substring(0,15);
				  screens.newRule.paramToolTip[parameterList[i].paramDisplayName] = toolTipText;
				  ////////////////////////////////////////////////////

				  // I am assuming we are getting paramToolTip paramter
				  // screens.newRule.paramToolTip[parameterList[i].paramDisplayName] = parameterList[i].paramToolTip;




				  //if( globalvars.ruleConfig.parameterList[i].paramDisplayName == 'Facility (Pre)')
					//  globalvars.ruleConfig.parameterList[i].fieldType = 'List'
				  
				  if(parameterList[i].fieldType == "String"){
					  stringFilter = jQuery.extend(true, {}, filterTemplates[0]);
					  stringFilter.id=parameterList[i].tableName + "." + parameterList[i].paramDbFieldName;
					  stringFilter.label=parameterList[i].paramDisplayName;
					  stringFilter.optgroup= 'String';
					  filterArray.push(stringFilter);
				  }
				  else if(parameterList[i].fieldType == "Integer"){
					  stringFilter = jQuery.extend(true, {}, filterTemplates[1]);
					  stringFilter.id=parameterList[i].tableName + "." + parameterList[i].paramDbFieldName;
					  stringFilter.label=parameterList[i].paramDisplayName;
					  stringFilter.optgroup= 'Integer';
					  filterArray.push(stringFilter);
				  }
				  else if(parameterList[i].fieldType == "Date"){
					  stringFilter = jQuery.extend(true, {}, filterTemplates[2]);
					  stringFilter.id=parameterList[i].tableName + "." + parameterList[i].paramDbFieldName;
					  stringFilter.label=parameterList[i].paramDisplayName;
					  stringFilter.optgroup= 'Date';
					  filterArray.push(stringFilter);
				  }
				  else if(parameterList[i].fieldType == "List"){
					  stringFilter = jQuery.extend(true, {}, filterTemplates[3]);
					  stringFilter.id=parameterList[i].tableName + "." + parameterList[i].paramDbFieldName;
					  stringFilter.label=parameterList[i].paramDisplayName;
					  stringFilter.optgroup= 'List';
					  stringFilter.values = loadListParamater(stringFilter.id);
					  filterArray.push(stringFilter);
				  }
				  else if(parameterList[i].fieldType == "Subquery"){
					  stringFilter = jQuery.extend(true, {}, filterTemplates[4]);
					  stringFilter.id=parameterList[i].tableName + "." + parameterList[i].paramDbFieldName;
					  stringFilter.label=parameterList[i].paramDisplayName;
					  filterArray.push(stringFilter);
				  }
			  });
			  
			  
			  
			  
			  function loadListParamater(param){
				  var data = globalvars.ruleConfig.parameterListValues;
				  var listArray=[];
				  if(data){
					  for(var k=0;k<data.length;k++){
						  var id_val = data[k].tableName + "." + data[k].fieldName;
						 
						  if(id_val == param){
							  var fieldvar = data[k].fieldValues;
							  listArray = fieldvar.split(',');
							  break;
						  }
						  else{
							  
						  }
					  }
				  }
				  
				  var fieldArray=[];
				  if(listArray){
					  
					  $(listArray).each(function (i){
						  var obj=new Object;
						  obj[listArray[i]] =listArray[i];
						  fieldArray.push(obj);
					  })
					  
				  }
				  return fieldArray;
				  
			  }
			  
			  
			//  log(filterArray.toSource());
			  $('#builder1').queryBuilder({
		    	  allow_empty: true,
		    	  
		    	  plugins: {
		    	    //'bt-tooltip-errors': { delay: 100},
		    	    'sortable': null,
//		    	    'filter-description': { mode: 'bootbox' },
		    	    'bt-selectpicker': null,
		    	    'unique-filter': null,
		    	    'bt-checkbox': { color: 'primary' }
		    	  },

		    	  filters: filterArray
			  });
			  
			  
			 screens.newRule.addToolTipInDropdown();
	    	
	    	
			  
	},
	addToolTipInDropdown:function(){

		
			$('.bootstrap-select ul.selectpicker li').each(function() {  // loop through each li - you can change this selector to match your needs
				  var li = $(this);
				   	anchor = li.find('a>span'); // in case there are multiple anchors?
				  	anchorText = anchor.text();
				    if(anchorText != '------')
				     anchor.attr('title', screens.newRule.paramToolTip[anchorText]);
				});

		

	},

bindFunctionalityButtons:function(){
		$('#builder1').on('afterCreateRuleInput.queryBuilder', function(e, rule) {
		    if (rule.filter.plugin == 'selectize') {
		        rule.$el.find('.rule-value-container').css('min-width', '200px')
		          .find('.selectize-control').removeClass('form-control');
		        
		        
		        rule.$el.find('.selectize-dropdown').css('min-height', '100px');
		        rule.$el.find('.selectize-dropdown').css('height', '150px');
		        rule.$el.find('.selectize-dropdown-content').css('height', '130px');
		        rule.$el.find('.selectize-dropdown-content').css('overflow-y','scroll');
		        
		    }
		});
			  
	/*$('.parse-preview-builder1').on('click', function() {
	    var ruleId = $('#txtRuleName').val();
	   	var ruleConfigExcel = globalvars.root.ruleAssigmentConfigExcel + "?ruleId=" + ruleId;
		window.location.href = ruleConfigExcel;
	});*/
		
		//added for showing progress bar during file download
    	$("button.parse-preview-builder1").die("click").on("click", function (event) {
    		
    		event.stopPropagation();

    	    var ruleId = $('#txtRuleName').val();
    	   	var urlLocation = globalvars.root.ruleAssigmentConfigExcel + "?ruleId=" + ruleId;

            var $preparingFileModal = $("#preparing-file-modal");
     
            $preparingFileModal.dialog({ modal: true });

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


  $('.parse-sql-builder1').die('click').on('click', function() {
	  var res = $('#builder1').queryBuilder('getSQL', $(this).data('stmt'));
		  if (res.sql.length) {
	  	  var sqlText = screens.newAuditorQueue.changedSqlDisplay(res.sql);
		  var queryText = '<pre class="code-popup" style="max-height:300px;min-height:150px;white-space: pre-wrap;white-space: -moz-pre-wrap;word-wrap: break-word;">' + JSON.stringify(sqlText, null, 2) + '</pre>';
		  dialogs.messageDialogRule.show({ text:queryText});

		  }
	});
			  
  $('.parse-json-builder1').die('click').on('click', function() {
  	var res = $('#builder1').queryBuilder('getRules');
	var queryText = '<pre class="code-popup" style="max-height:300px;min-height:150px;white-space: pre-wrap;white-space: -moz-pre-wrap;word-wrap: break-word;">' + JSON.stringify(changeKeyOperator(res),undefined, 2) + '</pre>';
    dialogs.messageDialogRule.show({ text:queryText});
	});
	    	
  
  $('.submit-json-builder1').die('click').on('click', function() {
	var obj={};
	obj.ruleId = $('#txtRuleName').val();
	obj.ruleDesc = $('#txtRuleDesc').val();
	obj.primaryTable = $('#filter_table_select option:selected').val();
	var res = $('#builder1').queryBuilder('getRules');
	obj.ruleJson = JSON.stringify(changeKeyOperator(res));
	var activeFlag = Number($('input:checkbox[name=ruleActive]:checked').val());
	if(activeFlag != 1)
		activeFlag=0;
	obj.active = activeFlag;

	// var activeFlagBill = Number($('input:checkbox[name=bothBillType]:checked').val());
	// if(activeFlagBill != 1)
	// 	activeFlagBill=0;
	// obj.billTypeAll = activeFlagBill;

	obj.auditorList = $("#auditors_queue_list").val();
	//console.log(obj.auditorList);
	
	if(obj.ruleId == "" || obj.auditorList == null){
		dialogs.messageDialog.show({text: 'Rule Name and Auditor ID are Mandatory Fields'});
		//return;
	}
	else
	{
		if(res.rules && res.rules.length > 0){
		
    		if(checkRuleName(obj.ruleId)){	    			
    			$.ajax({
	                url: globalvars.root.ruleAssigmentSave,
	                type: 'POST',
	                data: JSON.stringify(obj),
	                contentType: 'application/json',
	                success:function(data){
                		dialogs.messageDialogRuleQueueSave.show({ text: 'Rules Saved Successfully'});
                	},
                	error: function (jqXHR, textStatus, errorThrown) {
                        if (jqXHR.status == 201) {
                        	dialogs.messageDialogRuleQueueSave.show({ text: 'Rules Saved Successfully'});
                          	//$("#sub_menu #Configuration li.submenu_item").eq(0).click();
                          	//dialogs.messageDialog.$messageDialogDiv.dialog('destroy');
                        	
                        	
                        }
                    }
	            });
    		}
		}
		else{
			dialogs.messageDialog.show({text: 'Please select Valid Rule'});
		}
	}
	    		
});
	    	
	    	
	function checkRuleName(value){
		if(screens.newAuditorQueue.mode == 'EDIT')
			return true;

		var flag=true;
		if(globalvars.auditorQueueSummary){
			 for(var i=0;i<globalvars.auditorQueueSummary.length;i++){
				 if(value == globalvars.auditorQueueSummary[i].ruleId){
					dialogs.messageDialog.show({ text: 'Rule Name Already exists.'});
					flag=false;
					break;
				 }
			 }
		}
		if(flag){
			var data = $.trim(value);
			if(data < 3){
				dialogs.messageDialog.show({ text: 'Rule Name should be minimum 3 character long.'});
				flag=false;
			}
		}
		return flag;
	}
		    	
		    	
	$('#builder1').on('change.queryBuilder', '.rule-operator-container [name$=_operator]', function() {
		var $rule = $(this).closest('.rule-container');
		log($rule);
		log($(this).val());

	});

		    	 
	function covertListToString(data){
		var listString="";
		
		$(data).each(function (i) {
			listString += data[i];
			if(i < data.length-1){
				
				listString += ",";
			}
			
		})
		return listString;
	} 
		    	
		    	
		function changeOperator(rules){
			var data = globalvars.ruleConfig.operatorList;
				for(var k=0;k<data.length;k++){
					var op = rules.operator;
					var type = rules.type;
					var typeRule = data[k].fieldType;
					if(op.toUpperCase() == data[k].operatorKey && type == typeRule.toLowerCase()){
						log(op.toUpperCase() + ":::::::"+ data[k].operatorKey);
						log(type + ":::::::"+ typeRule.toLowerCase());
						rules.operator = data[k].operatorId;
						rules.id = changeIdValue(rules.id);
						rules.field = rules.id;
						log("::::" + rules.input);
						if(rules.input == "select"){
						//	console.log(type);
							var strList = covertListToString(rules.value);
							rules.value = strList;
						}
							
						break;
					}
				}
			return rules;
		}

		function changeIdValue(val){
			var data = globalvars.ruleConfig.parameterList;
			var id_val;
				for(var k=0;k<data.length;k++){
					var idValue = data[k].tableName + "." + data[k].paramDbFieldName;
					if(val == idValue){
						id_val = data[k].parameterId;
						break;
					}
				}
			return id_val;
		}

		function changeKeyOperator(jText){
			if(jText.rules){
				$(jText.rules).each(function (i) {
					if(jText.rules[i].rules){
							changeKeyOperator(jText.rules[i]);
					}else{
						jText.rules[i] = changeOperator(jText.rules[i]);
					}
				}) 
				
			}
			
			return jText;
		}
			    	

	},
	changedSqlDisplay:function(mainText){

			var r1 = /LESS_BY_X_DAYS '\d+'/g;
			var r2 = /LESS_BY_X_DAYS '\d+'/;

			var m1 = /GREATER_BY_X_DAYS '\d+'/g;
			var m2 = /GREATER_BY_X_DAYS '\d+'/;

			//var changedText = " >= DATE_ADD('[FILE_DATE]', INTERVAL -XXX DAY) "
			var countLess = (mainText.match(r1) || []).length;
			var countGreater = (mainText.match(m1) || []).length;
			//var extractText = String(mainText.match(r2));
			//alert(extractText);
			var changedTextGreater = " >= DATE_ADD('[FILE_DATE]', INTERVAL -XXX DAY) "
			var changedTextLess = " <= DATE_ADD('[FILE_DATE]', INTERVAL -XXX DAY) "
			changedSqlText(changedTextGreater,countGreater,m2);
			changedSqlText(changedTextLess,countLess,r2);

			function changedSqlText(changedText,count,regex){
			    for(i=0;i<count;i++){
			        var extractText = String(mainText.match(regex));
			        //var changedText = " >= DATE_ADD('[FILE_DATE]', INTERVAL -XXX DAY) "
			        var r = /\d+/;
			        //alert(extractText);
			        var extractNumber = extractText.match(r);
			        var replaceText = changedText.replace('XXX',extractNumber);
			        //alert(replaceText);
			        mainText = mainText.replace(regex, replaceText);
			    }
			}

			return mainText;
		//	console.log(mainText)

			//alert(mainText);
	},
    showQuery : function(queryText){

        $("#dialog").dialog({
                      title: 'SQL',
                      autoOpen: true,
                      width: 1000,
                      minHeight: 50,
                      height:350,
                      resizable: false,
                      position: [300,100]
               })
               $("#dialog").find("p").html(queryText);
               
     },
     fillTableFilter: function(){
       	 
       	 $("#filter_table_select").empty();
       	 var tempHtml = "";
       	 
       	  $(globalvars.ruleConfig.tableList).each(function (i) {
       		 		if(globalvars.ruleConfig.tableList[i].tblName == "T_PHYS_PREDICTIONS")	 
       		 			tempHtml += $.nano(screens.newAuditorQueue.ruleTableTemplate, { index: globalvars.ruleConfig.tableList[i].tblName, data: globalvars.ruleConfig.tableList[i].tblDisplayName });
            });

       	 $("#filter_table_select").append(tempHtml);
       },
       
    fillAuditorList:function(selectAuditorList){

    	(selectAuditorList);
       	$("#auditors_queue_list").empty();
        	 var tempHtml = "";
        	 var selected='';
        	 //var selectAuditorList = ["dummy.auditor4", "dummy.auditor5","eileen.blossick"];
        	 $(globalvars.queueAuditorList).each(function (i) {
        	 	var flag=false;
		  	 	if(selectAuditorList){
	        	 	for (var j=0;j<selectAuditorList.length;j++) {
	        	 		if(selectAuditorList[j] == globalvars.queueAuditorList[i].userId){
	        	 			flag=true;
	        	 			break;
	        	 		}
	        	 	}
	        	 	if(flag)
	        	 		tempHtml += $.nano(screens.newAuditorQueue.ruleTableTemplate, { selected:'selected', index: globalvars.queueAuditorList[i].userId, data: globalvars.queueAuditorList[i].userId });
	        	 	else
	        	 		tempHtml += $.nano(screens.newAuditorQueue.ruleTableTemplate, {index: globalvars.queueAuditorList[i].userId, data: globalvars.queueAuditorList[i].userId });
	        	 
	        	 	flag=false;
	        	 }
	        	 else{
	        	 	tempHtml += $.nano(screens.newAuditorQueue.ruleTableTemplate, {index: globalvars.queueAuditorList[i].userId, data: globalvars.queueAuditorList[i].userId });
	        	 }
             });

           //  console.log(tempHtml);
        	 $("#auditors_queue_list").append(tempHtml);

        	$('.chosen-select').trigger("chosen:updated");

       },

populateCloneRule:function(){

       	$('.parse-clone-builder1').die('click').on('click', function() {

			$(this).prop('disabled','disabled');
			$('.parse-preview-builder1').hide();
			$("#filter_table_select").attr('disabled',false);
			screens.newAuditorQueue.populateFilterData();
			var getRuleData = 	screens.newAuditorQueue.localRuleData;
		 	
			function changeOperator(rules){
	    		var data = globalvars.ruleConfig.operatorList;
					for(var k=0;k<data.length;k++){
						var op = rules.operator;
						if(op == data[k].operatorId){
							rules.operator = data[k].operatorKey.toLowerCase();
							rules.id = changeIdValue(rules.id);
							rules.field = rules.id;
							
							if(rules.input == "select"){
								var strList = rules.value;
								rules.value = strList.split(',');
							}
							break;
						}
					}
	    		return rules;
			 }
		
		
			function convertNameValuePair(value){
				var fieldArray=[];
				  if(value){
					  $(value).each(function (i){
						  var obj=new Object();
						  obj.id=value[i];
						  obj.name=value[i];
						  fieldArray.push(obj);
					  })
					  
				  }
				
				return fieldArray;
				
			}
			    	
	    	function changeIdValue(val){
	    		var data = globalvars.ruleConfig.parameterList;
	    		var id_val;
					for(var k=0;k<data.length;k++){
						var idValue = data[k].parameterId;
						if(val == idValue){
							id_val = data[k].tableName + "." + data[k].paramDbFieldName;
							break;
						}
					}
	    		return id_val;
	    	}
			    	
	    	function changeKeyOperator(jText){
	    		if(jText.rules){
	    			$(jText.rules).each(function (i) {
	    				if(jText.rules[i].rules){
	    						changeKeyOperator(jText.rules[i]);
	    				}else{
	    					jText.rules[i] = changeOperator(jText.rules[i]);
	    				}
	    			}) 
	    			
	    		}
	    		
	    		return jText;
	    	}

	    	if (getRuleData) {
	    		screens.newAuditorQueue.mode='NEW';
		    	$("#filter_table_select").attr('disabled',true);
				$('#txtRuleName').val(getRuleData.ruleId + "_Clone");
				$('#txtRuleDesc').val(getRuleData.ruleDesc);
				//screens.newAuditorQueue.bindFunctionality(getRuleData.ruleType);
				$("#filter_table_select").val(getRuleData.primaryTable);
				if(getRuleData.active == "Active")
					$("input:checkbox[name=ruleActive]").attr('checked', 'checked');
				if(getRuleData.billTypeAll == "1")
					$("input:checkbox[name=bothBillType]").attr('checked', 'checked');
				
		    	var convertedValue = changeKeyOperator(JSON.parse(getRuleData.ruleJson));
		    	//log(convertedValue.toSource());
				$('#builder1').queryBuilder('setRules',convertedValue);
				$('.set').click();
			 }

	});
			  


   }

	
		
};