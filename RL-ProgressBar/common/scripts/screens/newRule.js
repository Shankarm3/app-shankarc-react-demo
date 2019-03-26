screens.newRule = {
	ruleTableTemplate:"",
	mode:'NEW',
	selectedTable:'',
	selectedPrevTableValue:'',
	localRuleData:'',
	costCenter:'',
	initialize: function (param) {
		this.drawScreen();
		this.loadData();
	},
	drawScreen: function () {
		
		getSYNC('common/templates/screens/newRule.html', function (data) {
            globalvars.$contentcontainer.append($.nano(data,globalvars.localResourceMap));
        });
		
		if(this.ruleTableTemplate==""){
    		this.ruleTableTemplate =  getTemplate('common/templates/option_item_auditor.html');
    	}
		
		
	},
	loadData: function(){
		
    	$.when(
        		$.ajax({
        			type: 'GET',
    	            url: globalvars.root.ruleConfigMap,
    				traditional: true,
    				dataType: 'json'
        		})
    			
    	).done(function(data){

    		globalvars["ruleConfig"] = data;
    		var getRuleData = 	localStorage.getItem('ruleSummary');
    		if(getRuleData){
    			console.log(getRuleData);
    			getRuleData = JSON.parse(getRuleData);
    			screens.newRule.localRuleData=getRuleData;
    			screens.newRule.mode='EDIT';
    			screens.newRule.costCenter = getRuleData.costCenter;
    			$('.parse-preview-builder1').show();
    			$('.parse-clone-builder1').show();
    			$("input:radio[name=ruleType][value=" + getRuleData.ruleType + "]").attr('checked', 'checked');
    			screens.newRule.bindFunctionality(getRuleData.ruleType);
    			$("#filter_table_select").val(getRuleData.primaryTable);
    			$("#costCenter_table_select").val(getRuleData.costCenter);
    			$("#source_table_select").val(getRuleData.source);

    			
    			screens.newRule.populateFilterData();
    			screens.newRule.populateRuleData();
    			screens.newRule.bindFunctionalityButtons();
    			screens.newRule.addCustomValidationOperator();
    			screens.newRule.addToolTipInDropdown();
    		}else{
    			screens.newRule.mode='NEW';
    			$('.parse-preview-builder1').hide();
    			$('.parse-clone-builder1').hide();
    			screens.newRule.costCenter='';
    			localStorage.removeItem('ruleSummary');
    			screens.newRule.bindFunctionality();
    			screens.newRule.populateFilterData();
    			screens.newRule.bindFunctionalityButtons();
    			//this.populateRuleData();
    		}

    	})
		 
	},
	populateRuleData:function(getRuleData){
		
		 var getRuleData = 	localStorage.getItem('ruleSummary');
		 
		
		 
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
//						if(rules.value instanceof Array){
//							rules.value = convertNameValuePair(rules.value);
//							//log(rules.value);
//						}
						break;
					}
				}
				//alert(JSON.stringify(rules));
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


    	
    	if (getRuleData) {
    		screens.newRule.mode='EDIT';
	    	getRuleData = JSON.parse(getRuleData);
	    	$("#txtRuleName").prop('disabled', true);
	    	$("#filter_table_select").attr('disabled',true);
			$('#txtRuleName').val(getRuleData.ruleId);
			$('#txtRuleDesc').val(getRuleData.ruleDesc);

			$('#txtHcpcCode').val(getRuleData.hcpcCode)
			$('#txtHspHcpcCode').val(getRuleData.hspHcpcCode)

			//$('#txtChargeCode').val(getRuleData.dchgCode)
			$('#txtRevCode').val(getRuleData.revCode)
			$("#txtDisplayName").val(getRuleData.displayName);


			//$("#filter_table_select").val(getRuleData.primaryTable);
			screens.newRule.bindFunctionality(getRuleData.ruleType);
			$("#filter_table_select").val(getRuleData.primaryTable);
			$("#costCenter_table_select").val(getRuleData.costCenter);
    		$("#source_table_select").val(getRuleData.source);
			$("input:radio[name=ruleType][value=" + getRuleData.ruleType + "]").attr('checked', 'checked');
			
			//console.log(getRuleData.active);
			if(getRuleData.active == "1")
				$("input:checkbox[name=ruleActive]").attr('checked', 'checked');

			// if(getRuleData.billTypeAll == "1")
			// 	$("input:checkbox[name=bothBillType]").attr('checked', 'checked');
			
			if(getRuleData.primaryTable != 'T_PHYS_PATIENT_SCORABLE' && getRuleData.primaryTable != 'T_PHYS_PATIENT_VISITS_SCORABLE'){
				//$("input:checkbox[name=bothBillType]").attr('disabled',false);
				$("#code_details_wrapper").hide();
				$("#displayNameId").hide()
			}else{
				$("#code_details_wrapper").show();
				$("#displayNameId").show()
			}
			
			//log(getRuleData.ruleJson);
	    	var convertedValue = changeKeyOperator(JSON.parse(getRuleData.ruleJson));
	    	//log(convertedValue.toSource());
			$('#builder1').queryBuilder('setRules',convertedValue);
			$('.set').click();
		 }
    	
    	localStorage.removeItem('ruleSummary');
	},
	addCustomValidationOperator:function(){

		//$(".rule-operator-container select").live('change', function(){

			$(".rule-operator-container select").each(function (i) {
			
			var selectedOperator = $(this).find("option:selected").val();
			var operatorDateRangeList = ["greater_by_x_days", "less_by_x_days"];

			if(jQuery.inArray(selectedOperator, operatorDateRangeList) >= 0){
				var inputID = $(this).parents(".rule-operator-container").siblings(".rule-value-container").find("input").prop("id");
				$(this).parents(".rule-operator-container").siblings(".rule-value-container:first").find("input").unbind();
				$(this).parents(".rule-operator-container").siblings(".rule-value-container:first").find("input").bind('keydown', allowNumbersOnly);
			}
			else{
				$(this).parents(".rule-operator-container").siblings(".rule-value-container:first").find("input").bind('click', customBind);
				$(this).parents(".rule-operator-container").siblings(".rule-value-container:first").find("input").unbind('keydown');
			}

		//});
		
			function customBind(){
				$(this).datepicker('show');
			}

		})

	},
	bindFunctionality: function (value) {

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

		screens.newRule.selectedPrevTableValue = $("#filter_table_select").val();
		$("#filter_table_select").on('change', function(){
			var res = $('#builder1').queryBuilder('getRules');
			if(res.rules && res.rules.length > 0){
				screens.newRule.selectedTable = $(this).val();
				dialogs.messageDialogRuleTableChange.show({text:'Table change will remove All selected Rule schema.'})
			}else{
				screens.newRule.selectedTable = $(this).val();
				screens.newRule.selectedPrevTableValue = screens.newRule.selectedTable;
				screens.newRule.changeRuleSchema();
			}
		});



		
		
		function fillAuditorFilter(val){
       	 $("#filter_table_select").empty();
       	 var tempHtml = "";
       	 
       	if(val == "Addition"){
       	 $(globalvars.ruleConfig.tableList).each(function (i) {
       		 		if(globalvars.ruleConfig.tableList[i].tblName == "T_PHYS_PATIENT_SCORABLE"||globalvars.ruleConfig.tableList[i].tblName == "T_PHYS_PATIENT_VISITS_SCORABLE")	 
       		 			tempHtml += $.nano(screens.newRule.ruleTableTemplate, { index: globalvars.ruleConfig.tableList[i].tblName, data: globalvars.ruleConfig.tableList[i].tblDisplayName });
            });

       	 $("#code_details_wrapper").show();
       	 $("#displayNameId").show();
		}else if(val == "Suppression"){
			$(globalvars.ruleConfig.tableList).each(function (i) {
 	       		 if(globalvars.ruleConfig.tableList[i].tblName != "T_PHYS_PATIENT_SCORABLE" && globalvars.ruleConfig.tableList[i].tblName != "T_PHYS_PATIENT_VISITS_SCORABLE")
 	       			 tempHtml += $.nano(screens.newRule.ruleTableTemplate, { index: globalvars.ruleConfig.tableList[i].tblName, data: globalvars.ruleConfig.tableList[i].tblDisplayName });
           });
			$("#code_details_wrapper").hide();
			$("#displayNameId").hide();
		}
		else{
			$(globalvars.ruleConfig.tableList).each(function (i) {
      			 tempHtml += $.nano(screens.newRule.ruleTableTemplate, { index: globalvars.ruleConfig.tableList[i].tblName, data: globalvars.ruleConfig.tableList[i].tblDisplayName });
           });
		}
       	 
       	 
       	 $("#filter_table_select").append(tempHtml);
       };
       
       fillAuditorFilter(value);


       function fillCostCenterFilter(){

       		$.ajax({
				type: 'GET',
                url: globalvars.root.costCenterUri,
				traditional: true,
				dataType: 'json',
				success: function(data){
	        		globalvars["costCenterList"] = data;

	        		 $("#costCenter_table_select").empty();
       	 			 var tempHtml = '<option value=""></option>';
	        		$(globalvars.costCenterList).each(function (i) {
      			 		tempHtml += $.nano(screens.newRule.ruleTableTemplate, { index: globalvars.costCenterList[i], data: globalvars.costCenterList[i] });
           			});



           			$("#costCenter_table_select").append(tempHtml);

           			$("#costCenter_table_select").val(screens.newRule.costCenter);
				}
    		})

      	 }


      	 fillCostCenterFilter();
 
       $('#new_rule_form input:radio[name=ruleType]').change(function () {
           if ($(this).is(':checked') == true) 
        	   fillAuditorFilter(($(this).val()));
       });

   		$(document).on('click','.rules-group-header .btn-group', function(e) {
			screens.newRule.addToolTipInDropdown();
		});


       
       
       
       
	},
	changeRuleSchema:function(){
			var selectedTable = $("#filter_table_select").val();
			if(selectedTable=="T_PHYS_PATIENT_SCORABLE"||selectedTable=="T_PHYS_PATIENT_VISITS_SCORABLE"){
				$("input:radio[name=ruleType][value=Addition]").attr('checked', 'checked');
				//$("input:checkbox[name=bothBillType]").attr('checked', false);
				//$("input:checkbox[name=bothBillType]").attr('disabled',true);
				$("#code_details_wrapper").show();
				$("#displayNameId").show();
			}
			else if(selectedTable == "T_PHYS_PREDICTIONS" || selectedTable == "T_PREDICTIONS_POST"){
				$("input:radio[name=ruleType][value=Suppression]").attr('checked', 'checked');
				//$("input:checkbox[name=bothBillType]").attr('disabled',false);
				$("#code_details_wrapper").hide();
				$("#displayNameId").hide();
			}

			if(screens.newRule.mode == 'NEW')
				screens.newRule.populateFilterData();
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


			 
			  
				//commented for showing progress bar during file download
				/*
					$('.parse-preview-builder1').on('click', function() {
					  
					  	  var ruleId = $('#txtRuleName').val();
					  	  var ruleType = $('input:radio[name=ruleType]:checked').val();
	
					  //ruleConfigExcel
					  	var ruleConfigExcel = globalvars.root.ruleConfigExcel + "?ruleId=" + ruleId + "&ruleType=" + ruleType;
	            	//	console.log(ruleConfigExcel);
	           			window.location.href = ruleConfigExcel;
	
		 
					  
					});	
				*/

				//added for showing progress bar during file download

				$(".parse-preview-builder1").on("click", function (event) {
		    		
		    		event.preventDefault();
		    		event.stopPropagation();
		    		
		            var $preparingFileModal = $("#preparing-file-modal");
		
				  	var ruleId = $('#txtRuleName').val();
				  	var ruleType = $('input:radio[name=ruleType]:checked').val();
		
				  	var urlLocation = globalvars.root.ruleConfigExcel + "?ruleId=" + ruleId + "&ruleType=" + ruleType;
		    //		console.log(urlLocation);

		    		$preparingFileModal.dialog({ modal: true });
		
		            $.fileDownload(urlLocation, {
		                successCallback: function (url) {
		                    $preparingFileModal.dialog('destroy');
		                },
		                failCallback: function (responseHtml, url) {
		     
		                    $preparingFileModal.dialog('destroy');
		                    //$("#error-modal").dialog({ modal: true });
		                    dialog.messageDialogRule.show({text:globalvars.localResourceMap.progress_bar_error_message});
		                }
		            });
		        
		            return false; 
		
		    	});


				$('.parse-clone-builder1').die('click').on('click', function() {

					$(this).prop('disabled','disabled');
					$('.parse-preview-builder1').hide();
					$("#filter_table_select").attr('disabled',false);
					screens.newRule.populateFilterData();
	    			//screens.newRule.populateRuleData();

	    			var getRuleData = 	screens.newRule.localRuleData;
		 
		
		 
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
			//						if(rules.value instanceof Array){
			//							rules.value = convertNameValuePair(rules.value);
			//							//log(rules.value);
			//						}
									break;
								}
							}
							//alert(JSON.stringify(rules));
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


    	
			    	if (getRuleData) {
			    		screens.newRule.mode='NEW';
				    	//getRuleData = JSON.parse(getRuleData);
				    	//$("#txtRuleName").prop('disabled', true);
				    	$("#filter_table_select").attr('disabled',true);
						$('#txtRuleName').val(getRuleData.ruleId + "_Clone");
						$('#txtRuleDesc').val(getRuleData.ruleDesc);

						// obj.hcpcCode = $("#txtHcpcCode").val();
	    	// 	obj.dchgCode = $("#txtChargeCode").val();
	    	// 	obj.revCode = $("#txtRevCode").val();
	    	// 	obj.displayName = $("#txtDisplayName").val();
						//$("#filter_table_select").val(getRuleData.primaryTable);
						screens.newRule.bindFunctionality(getRuleData.ruleType);
						$("#filter_table_select").val(getRuleData.primaryTable);
						$("input:radio[name=ruleType][value=" + getRuleData.ruleType + "]").attr('checked', 'checked');
						
						//console.log(getRuleData.active);
						if(getRuleData.active == "1")
							$("input:checkbox[name=ruleActive]").attr('checked', 'checked');

						// if(getRuleData.billTypeAll == "1")
						// 	$("input:checkbox[name=bothBillType]").attr('checked', 'checked');
						
						// if(getRuleData.primaryTable != 'T_PHYS_PATIENT_SCORABLE')
						// 	$("input:checkbox[name=bothBillType]").attr('disabled',false);
						
						//log(getRuleData.ruleJson);
				    	var convertedValue = changeKeyOperator(JSON.parse(getRuleData.ruleJson));
				    	//log(convertedValue.toSource());
						$('#builder1').queryBuilder('setRules',convertedValue);
						$('.set').click();
					 }


	    			//screens.newRule.bindFunctionalityButtons();

				});
			  
			  $('.parse-sql-builder1').die('click').on('click', function() {
				  var res = $('#builder1').queryBuilder('getSQL', $(this).data('stmt'));
				  if (res.sql.length) {
				 // 	console.log(res.sql);
				  	  var sqlText = screens.newRule.changedSqlDisplay(res.sql);
					  var queryText = '<pre class="code-popup" style="max-height:300px;min-height:150px;white-space: pre-wrap;white-space: -moz-pre-wrap;word-wrap: break-word;">' + JSON.stringify(sqlText, null, 2) + '</pre>';
					 

					  dialogs.messageDialogRule.show({ text:queryText});
	 
				  }
				});
			  
			  //"{"condition":"AND","rules":[{"id":100,"field":100,"type":"string","input":"text","operator":"equal","value":"100"},{"id":101,"field":101,"type":"string","input":"text","operator":"equal","value":"100"}]}"
			  
	    	$('.parse-json-builder1').die('click').on('click', function() {
    		  
	    		var res = $('#builder1').queryBuilder('getRules');
	    		//alert(JSON.stringify(res));
	    		var queryText = '<pre class="code-popup" style="max-height:300px;min-height:150px;white-space: pre-wrap;white-space: -moz-pre-wrap;word-wrap: break-word;">' + JSON.stringify(changeKeyOperator(res),undefined, 2) + '</pre>';
	    		 dialogs.messageDialogRule.show({ text:queryText});
	    		
	  		});
	    	
	    	$('.submit-json-builder1').die('click').on('click', function() {
	    		
	    		var obj={};
	    		obj.ruleId = $('#txtRuleName').val();
	    		obj.ruleDesc = $('#txtRuleDesc').val();
	    		obj.hcpcCode = $("#txtHcpcCode").val();
	    		obj.hspHcpcCode = $("#txtHspHcpcCode").val();
	    		//obj.dchgCode = $("#txtChargeCode").val();
	    		obj.revCode = $("#txtRevCode").val();
	    		obj.displayName = $("#txtDisplayName").val();
	    		obj.ruleType = $('input:radio[name=ruleType]:checked').val(),
	    		obj.primaryTable = $('#filter_table_select option:selected').val();
	    		obj.costCenter = $('#costCenter_table_select option:selected').val();
	    		obj.source = $('#source_table_select option:selected').val();
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

	    		
	    		if(obj.ruleId == "" || obj.ruleType == undefined){
	    			dialogs.messageDialog.show({text: 'Rule Name and Rule Type are Mandatory Fields'});
	    			//return;
	    		}
	    		else
	    		{
		    		if(res.rules && res.rules.length > 0){
		    		
			    		if(checkRuleName(obj.ruleId)){	    			
			    			$.ajax({
				                url: globalvars.root.ruleList,
				                type: 'POST',
				                data: JSON.stringify(obj),
				                contentType: 'application/json',
				                success:function(data){
			                		dialogs.messageDialogNewRuleSave.show({ text: 'Rules Saved Successfully'});
			                	},
			                	error: function (jqXHR, textStatus, errorThrown) {
			                        if (jqXHR.status == 201) {
			                        	dialogs.messageDialogNewRuleSave.show({ text: 'Rules Saved Successfully'});
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
	    		
	    		if(screens.newRule.mode == 'EDIT')
	    			return true;
	    		
	    		
	    		var flag=true;
	    		if(globalvars.ruleSummary){
	   			 for(var i=0;i<globalvars.ruleSummary.length;i++){
	   				 if(value == globalvars.ruleSummary[i].ruleId){
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
	            //Model($rule).operator = that.getOperatorByType($(this).val());
	            
	        });
	    	

	    	$('#builder1').on('afterDeleteRule.queryBuilder', function(e, rule, error, value) {
			  	$("div.btn-group.bootstrap-select.open").remove();
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
			//console.log(mainText)

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

	
		
};