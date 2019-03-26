/* Helper functions */

function timeout(rlloginurl,guvnorurl)
{
	if(guvnorurl!="")
	{
	    $.ajax({
	        url: guvnorurl+"/logout",
	        async: false,
	        error: function (jqXHR, textStatus, errorThrown) {
	        result = false;
	        }
	      });
	}
    window.location = rlloginurl;
}

function logout(rllogouturl,guvnorurl)
{
	if(guvnorurl!="")
	{
	    $.ajax({
	        url: guvnorurl+"/logout",
	        async: false,
	        error: function (jqXHR, textStatus, errorThrown) {
	        result = false;
	        }
	      });
	}
    window.location = rllogouturl;
}

function getErrorMessage(jqxhr,appendErrorRef)
{
    var obj = jQuery.parseJSON(jqxhr.responseText);
    var p=obj.properties;
    var err_code=obj.errorCode;
    var err_reference=obj.referenceNumber;
    
    var err_msg=globalvars.localResourceMap[err_code];
    
    for (var key in p) 
    {
        if (p.hasOwnProperty(key))
        {
        	err_msg=err_msg.replace(key,p[key]);
        }
    }
	if(appendErrorRef) err_msg=err_msg+" ("+err_reference+")";
	
    return err_msg;
}


function log(data) {
    if (typeof console !== "undefined" && typeof console.log !== "undefined") {
        console.log(data);
    };
};

function logLines(dataArray) {
    $(dataArray).each(function (index) {
        log(dataArray[index]);
    });
};

function logSpace(dataArray) {
    var tempString = "";
    $(dataArray).each(function (index) {
        tempString += dataArray[index] + " ";
    });
    log(tempString);
}

function getObjPropertyCount(object) {
    var count = 0;
    for (var i in object) {
        if (object.hasOwnProperty(i)) { count++; };
    };
    return count;
}

function loadJSONSync(url, callback) { //param has url and callback function
    $.ajax({
        url: url,
        dataType: 'json',
        async: false,
        success: callback
    });
};

function getTemplate(url) {
    return $.ajax({
        url: url,
        async: false
        }).responseText;
}

function getColorArray(startColorCode,endColorCode,step){
	var startColor = startColorCode;
	var endColor = endColorCode;
	var steps = parseInt(step);	
    var start = {
            'Hex'   : startColor,
            'R'     : parseInt(startColor.slice(1,3), 16),
            'G'     : parseInt(startColor.slice(3,5), 16),
            'B'     : parseInt(startColor.slice(5,7), 16)
    }
    var end = {
            'Hex'   : endColor,
            'R'     : parseInt(endColor.slice(1,3), 16),
            'G'     : parseInt(endColor.slice(3,5), 16),
            'B'     : parseInt(endColor.slice(5,7), 16)
    }
    diffR = end['R'] - start['R'];
    diffG = end['G'] - start['G'];
    diffB = end['B'] - start['B'];

    stepsHex  = new Array();
    stepsR    = new Array();
    stepsG    = new Array();
    stepsB    = new Array();

    for(var i = 0; i <= steps; i++) {
            stepsR[i] = start['R'] + ((diffR / steps) * i);
            stepsG[i] = start['G'] + ((diffG / steps) * i);
            stepsB[i] = start['B'] + ((diffB / steps) * i);
            stepsHex[i] = '#' + Math.round(stepsR[i]).toString(16) + '' + Math.round(stepsG[i]).toString(16) + '' + Math.round(stepsB[i]).toString(16);
    }
    return stepsHex;
	
}



function formatFiltersForChartExport() {
    var result = "";
    if (widgets.filter.allParametersTitles[widgets.filter.screenName]) {
        $.each(widgets.filter.allParametersTitles[widgets.filter.screenName], function (key, value) {
            if ($.type(value) == 'array' && value.length > 0) {
              result += key + '=' + value.length + ';';
            }
            else {
              result += key + '=' + value + ';';
            };
        });
    };
    return result;
};

function formatFiltersForChartExportPhysician() {
    var result = "";
    if (widgets.physicianFilter.allParametersTitles[widgets.physicianFilter.screenName]) {
        $.each(widgets.physicianFilter.allParametersTitles[widgets.physicianFilter.screenName], function (key, value) {
            if ($.type(value) == 'array' && value.length > 0) {
              result += key + '=' + value.length + ';';
            }
            else {
              result += key + '=' + value + ';';
            };
        });
    };
    return result;
};

function convertSpacetoUnderscoreString(str){
	if(str){
		return str.split(" ").join("_");
	}
};


// special currency formatter with output specified by Ashish
// 1000 -> 1000.00
// 1001 -> 1.00K 


// function chartsCurrencyFormatter(x) {
//     if (x > 1000000) {
//         return (Math.round((x / 1000000) * 10) / 10) + 'M';
//     } else if ($.isNumeric(x)) {
//         return (Math.round((x / 1000) * 10) / 10) + 'K';
//     } else {
//         return 0;
//     };
// };


function chartsCurrencyFormatter(x) {
	var isNegative = false;
	var formattedNumber;
	if (x < 0) {
        isNegative = true
    }
    x = Math.abs(x)

    if (x > 1000000) {
        formattedNumber =  (isNegative)?"(" + (Math.round((x / 1000000) * 10) / 10) + ")M" : (Math.round((x / 1000000) * 10) / 10) + 'M';
    } else if ($.isNumeric(x)) {
        formattedNumber = (isNegative)?"(" +  (Math.round((x / 1000) * 10) / 10) + ')K' :  (Math.round((x / 1000) * 10) / 10) + 'K';
    } else {
        formattedNumber = 0;
    };


    return formattedNumber

};

// This function return ','(thousand) separated string

function numberWithCommas(x) {
    if ($.isNumeric(x)) {
        return parseFloat(x).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } else {
        return 0;
    };
};

function numberWithCommasToInt(x) {
    return x.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

/* Function for Validating Email*/

function isValidEmailAddress(emailAddress) {
	var pattern = new RegExp(/^[+a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i);
    return pattern.test(emailAddress);
};


function validateEmailListComma(raw){
    var emails = raw.split(',')

    var valid = true;
    var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    for (var i = 0; i < emails.length; i++) {
        if( emails[i] === "" || !regex.test(emails[i].replace(/\s/g, ""))){
            valid = false;
        }
    }
    return valid;
}

/* Function for Validating Phone*/

function isValidPhone(phone) {
	var pattern = new RegExp(/^(\+91-|\+91|0)?\d{10}$/); //for 10 digit number only
    return pattern.test(phone);
};

function postJSONModel(param) { //param has url, passData and callback function
    $.ajax({
        url: param.url,
        type:'POST',
        data:param.data,
        async: param.async,
        contentType: 'application/json',
        success: param.callback,
        error:param.errorfunction
    });
};

function getSYNC(url, callback) {
    $.ajax({
        url: url,
        success: callback,
        async: false
    });
}


function getJSONModel(param) {
    $.ajax({
        url: param.url,
        dataType: 'json',
        data: param.data,
        traditional: true,
        async: param.async,
        success: function (data) {
        	globalvars[param.targetVar] = data;
        	log("Successfully loaded JSON Data from " + param.url + " to: globalvars." + param.targetVar);
        	if (param.callback && typeof (param.callback) === "function") {
        	    log(" and launching callback");
        	    param.callback();
        	}
        }
    });
};

/* Function for Validating AlphaNumeric*/

function checkAlphanumeric(str){
	var alpha = /^[a-zA-Z]+$/;
	var number = /^[0-9]+$/;
	for(i=0; i<str.length; i++){
		if(str.substr(i, 1).match(alpha)){ 
		var letters = true;
		}
		if(str.substr(i, 1).match(number)){ 
		var numbers = true;
		}
	}
	if(letters==true&&numbers==true){ 
	return true
	} else { 
	return false;
	}
}

/* Function for Validating Spaces in String*/
function allowedSpecialCharacters(str){
    invalidCharacter = true;
    for(var i=0;i<str.length;i++){
     var val = str.charAt(i);
     if(!(/^[a-zA-Z0-9!@#$%(&*)+=?]*$/).test(val)){
      invalidCharacter = false;
      break;
     }
    }
    if(invalidCharacter == true){
     return true;
    }
   }

/* Function for Validating Special Character*/
function allowedSpaces(str){
    invalidCharacter = true;
    for(var i=0;i<str.length;i++){
     var val = str.charAt(i);
     if((/^[\s]*$/).test(val)){
      invalidCharacter = false;
      break;
     }
    }
    if(invalidCharacter == true){
     return true;
    }
   }

/* Function for Validating Special Character*/
function allowedOneUpperAndLowerCase(str){
   
	var lowerCase = /(?=.*[a-z])/;
	var upperCase = /(?=.*[A-Z])/;
	for(i=0; i<str.length; i++){
		if(str.substr(i, 1).match(lowerCase)){ 
		var lCase = true;
		}
		if(str.substr(i, 1).match(upperCase)){ 
		var uCase = true;
		}
	}
	if(lCase==true&&uCase==true){ 
	return true
	} else { 
	return false;
	}
	
   }

/* Function to show Last update date for dashboard section */

function getLastUpdateDate()
{
	var monthNames = [ "January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December" ];
	var date = new Date();
	date.setDate(date.getDate()-1);
	var lastUpdateDate={};
	lastUpdateDate.day = date.getDate();
	lastUpdateDate.month = date.getMonth();
	lastUpdateDate.year = date.getFullYear();
	lastUpdateDate.monthName = monthNames[date.getMonth()];
	return lastUpdateDate;
}


/* Function to get current date */

function getCurrentDate()
{
	var monthNames = [ "January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December" ];
	var date = new Date();
	date.setDate(date.getDate());
	var currentDate={};
	currentDate.day = date.getDate();
	currentDate.month = date.getMonth();
	currentDate.year = date.getFullYear();
	currentDate.monthName = monthNames[date.getMonth()];
	return currentDate;
}

/* Function to Populate The Highlights Widget*/

function populateHighlightWidget(DataArr){
	var tempArr = new Array();
	var tempHtml = "";
	var tempObj;
	for(var i=0; i<DataArr.length;i++){
		
		tempObj = new Object();
		//tempHtml += '<li> <span class="alert_type_span"><u>' + DataArr[i].category_name + '</u></span>';
		tempObj.part1 = '<span class="alert_type_span"><u>' + DataArr[i].category_name + '</u></span>';
		
		var activity_value = DataArr[i].activity_value;
		var activity_value_arr = activity_value.split(",");
		
		var activity_desc = DataArr[i].activity_desc;
		var indexArr = new Array();
		
		for(var j=0;j<activity_value_arr.length;j++){
			var indexArr = new Array();
			for(var k =0;k<activity_desc.length;k++){
				if(activity_desc.charAt(k) == "[" || activity_desc.charAt(k) == "]"){
					indexArr.push(k);
				}
			}
			
			var categoryType = activity_desc.substring(indexArr[0]+1, indexArr[1]);
			
			if(categoryType === "CHARGE_CODE"){
				activity_desc = activity_desc.replace(activity_desc.substring(indexArr[0], indexArr[1]+1), '<span class="alert_value_span">'+activity_value_arr[j]+'</span>');
			}else if(categoryType === "HIT_VALUE"){
				activity_desc = activity_desc.replace(activity_desc.substring(indexArr[0], indexArr[1]+1), '<span class="alert_value_span">'+chartsCurrencyFormatter(activity_value_arr[j])+'</span>');
			}else if(categoryType === "HOSPITAL_NAME"){
				activity_desc = activity_desc.replace(activity_desc.substring(indexArr[0], indexArr[1]+1), '<span class="alert_value_span">'+activity_value_arr[j]+'</span>');
			}else if(categoryType === "AUDITOR_NAME"){
				activity_desc = activity_desc.replace(activity_desc.substring(indexArr[0], indexArr[1]+1), '<span class="alert_value_span">'+activity_value_arr[j]+'</span>');
			}else if(categoryType === "HIT_RATE"){
				activity_desc = activity_desc.replace(activity_desc.substring(indexArr[0], indexArr[1]+1), '<span class="alert_value_span">'+activity_value_arr[j]+'</span>');
			}else if(categoryType === "REVIEWED_RATE"){
				activity_desc = activity_desc.replace(activity_desc.substring(indexArr[0], indexArr[1]+1), '<span class="alert_value_span">'+activity_value_arr[j]+'</span>');
			}else if(categoryType === "REVIEWED_CT"){
				activity_desc = activity_desc.replace(activity_desc.substring(indexArr[0], indexArr[1]+1), '<span class="alert_value_span">'+activity_value_arr[j]+'</span>');
			}else if(categoryType === "DEPT_NAME"){
				activity_desc = activity_desc.replace(activity_desc.substring(indexArr[0], indexArr[1]+1), '<span class="alert_value_span">'+activity_value_arr[j]+'</span>');
			}
			
		}
		//tempHtml += '<span class="alert_desc_span">' + activity_desc + '</span></li>';
		tempObj.part2 = '<span class="alert_desc_span">' + activity_desc + '</span>';
		tempArr.push(tempObj);
	}
	
	return tempArr;
	
}

/* Function For Change of Existing Password */

function changePassword(){
	var old_password = $("#old_password").val(); 
	var new_password = $("#new_password").val();
	var confirm_new_password = $("#confirm_new_password").val();
	
		
	if(old_password == ""){
		$("#change_password_validation_alert").text(globalvars.localResourceMap.password_enter_message);
		$("#change_password_form")[0].reset();
	}
	else if (confirm_new_password == "" || new_password == "" || confirm_new_password.length < 6 || new_password.length <6 || confirm_new_password.length > 28 || new_password.length > 28){
		$("#change_password_validation_alert").text(globalvars.localResourceMap.password_minimum_six_length);
		$("#change_password_form")[0].reset();
	}
	else if(confirm_new_password != new_password){
		$("#change_password_validation_alert").text(globalvars.localResourceMap.passowrd_not_match);
		$("#change_password_form")[0].reset();
	}
	else if(!allowedSpaces(new_password)){
		$("#change_password_validation_alert").text(globalvars.localResourceMap.password_invalid_spaces);
		$("#change_password_form")[0].reset();
	}
	else if(!checkAlphanumeric(new_password)){
		$("#change_password_validation_alert").text(globalvars.localResourceMap.passowrd_alphanumeric);
		$("#change_password_form")[0].reset();
	}
	else if(!allowedSpecialCharacters(new_password)){
		$("#change_password_validation_alert").text(globalvars.localResourceMap.password_invalid_special_character);
		$("#change_password_form")[0].reset();
	}
	else if(!allowedOneUpperAndLowerCase(new_password)){
		$("#change_password_validation_alert").text(globalvars.localResourceMap.password_one_uppercase);
		$("#change_password_form")[0].reset();
	}
	else if (confirm_new_password == old_password || new_password == old_password){
		$("#change_password_validation_alert").text(globalvars.localResourceMap.password_not_same_new);
		$("#change_password_form")[0].reset();
	}else if(confirm_new_password == new_password && confirm_new_password.length >=6 && new_password.length >= 6){
		var password_data = JSON.stringify({"newPwd":new_password,"currentPassword":old_password});
		$("#change_password_validation_alert").text("");
	    $.ajax({
	        url: globalvars.root.changePasswordUri,
	        type:'PUT',
	        data:password_data,
	        async: true,
	        contentType: 'application/json',
	        success:  function(data){
				$("#change_password_form")[0].reset();
				$("#change_password_dialog").dialog("close");
				dialogs.messageDialog.show({ text: globalvars.localResourceMap.password_change_success });
			},
	        error:function(xhr){
	        	if(xhr.status == 412){
	        		
	        		err_msg=getErrorMessage(xhr,false);
	        		$("#change_password_validation_alert").text(err_msg);

	        		$("#change_password_form")[0].reset();
	        	}
				
			}
	    });
	}
};


/* Create Hospital selector */

function createHospitalSelector(param) {
    $.get('common/templates/option_item.html', function (data) {
        var $targetSelectId = $(param.targetSelectId);
        $targetSelectId.empty();
        var hospitals;
        (param.screen == "preBill")? hospitals= globalvars.preHospitals:hospitals = globalvars.postHospitals;
        $(hospitals).each(function (i) {
            $targetSelectId.append($.nano(data, {
                index: i,
                data: hospitals[i],
                selected: (param.screen == "preBill")? globalvars.selectedPreHospitalIndex == i ? "selected = 'selected'" : "" : globalvars.selectedPostHospitalIndex == i ? "selected = 'selected'" : ""
            }));
        });


        $(".ui-multiselect-menu").remove();

            $targetSelectId.multiselect({
                multiple: false,
                minWidth: 90,
                selectedList: 1
            });
    

        $targetSelectId.off().on("change", function () {
            log('hospital index: ' + $targetSelectId.val());
            (param.screen == "preBill")? globalvars.selectedPreHospitalIndex = $targetSelectId.val(): globalvars.selectedPostHospitalIndex = $targetSelectId.val();
            log(param.screen);

            if (window["screens"][param.screen]["hospitalChange"] !== undefined && typeof window["screens"][param.screen]["hospitalChange"] === 'function') {
                window["screens"][param.screen]["hospitalChange"].call(window["screens"][param.screen], "");
            }
        });

        
    });
};

/* Create Facility Check Box Container*/

function createFacilityCheckBoxSelector(param){
	 $.get('common/templates/option_item_facility.html', function (data) {
		 var $targetId = param.targetId;
	     $targetId.empty();
	     
	     $(globalvars.hospitals).each(function (i) {
	            $targetId.append($.nano(data, {
	                data: globalvars.hospitals[i],
	                checked: globalvars.selectedHospitalIndex == i ? "checked = 'checked'" : ""
	          }));
	     });
	 });
}


function createSelectBox(param) {  // index, selectDivId, values, currentValue, valueKey, textKey, secondaryTextKey, checkForUniqueKeys, addEmptyItem
	log(":::" + param.selectDivId);
    var selectBox = "<select id="+ param.selectDivId + param.index + " class="+param.selectDivId+" style=''>";
    if (param.addEmptyItem) {selectBox += "<option></option>"};
    var processedValues = {};
    var processedValuesLength = getObjPropertyCount(processedValues);
    
    
 
    $(param.values).each(function (i) {
        processedValues[param.values[i][param.valueKey]] = param.values[i][param.textKey];
        if ((param.checkForUniqueKeys && (getObjPropertyCount(processedValues) > processedValuesLength)) || !param.checkForUniqueKeys) {
            processedValuesLength = getObjPropertyCount(processedValues);
            if (param.values[i][param.valueKey] == param.currentValue) {
                selectBox += "<option selected=\"selected\" value=" +
                    param.values[i][param.valueKey] +
                    ">" +
                    param.values[i][param.textKey] + (param.values[i][param.secondaryTextKey] ? (" : "+param.values[i][param.secondaryTextKey]) : "") +
                    "</option>";
            } else {
                selectBox += "<option value=" +
                    param.values[i][param.valueKey] +
                    ">" +
                    param.values[i][param.textKey] + (param.values[i][param.secondaryTextKey] ? (" : " + param.values[i][param.secondaryTextKey]) : "") +
                    "</option>";
            };
        }
    });

    selectBox += "</select>";
    
    
    $("#account_details_missing_charges_grid_table select").on({
        focus: function () {
            $(this).
                data("origWidth", $(this).css("width")).
                css("width", "auto");
            
            $(this).find('option').each(function(i){
            	$(this).attr('title',$(this).text());
            })
        },
        blur: function () {
            var $this = $(this);
            $this.css("width", $this.data("origWidth"));
        }
    });
    
   
    return selectBox;
};

function printChart(param){
   	var chartContainer = param.chartContainer.highcharts();
	var origParent = chartContainer.container.parentNode;
	
	log(chartContainer);
	log(origParent);
	
	var origDisplay = [],
    body = document.body,
    childNodes = body.childNodes;
	
	if(chartContainer!=undefined){
		
	  // hide all body content	
  	  Highcharts.each(childNodes, function (node, i) {
            if (node.nodeType === 1) {
                origDisplay[i] = node.style.display;
                node.style.display = "none";
            }
      });

  	  var chartHeader = getChartHeaderDetails(param.chartTitle,param.screenName);
  	  
		 $(body).append(chartHeader);
	     body.appendChild(chartContainer.container);

	    // print
    	 window.focus(); 
    	 window.print();
         var elem = document.getElementById('chart_title');
   		 elem.parentNode.removeChild(elem);
  		 setTimeout(function () {

		 // put the chart back in
		 origParent.appendChild(chartContainer.container);

         // restore all body content
         Highcharts.each(childNodes, function (node, i) {
             if (node.nodeType === 1) {
                    node.style.display = origDisplay[i];
             }
         });

		}, 1000);
	}
};

function getChartHeaderDetails(chartTitle,screenName){

	var timePeriodArr = [
		                     	globalvars.localResourceMap.dashboard_filter_time_period_selector_value1,
		                     	globalvars.localResourceMap.dashboard_filter_time_period_selector_value2,
		                     	globalvars.localResourceMap.dashboard_filter_time_period_selector_value3,
		                     	globalvars.localResourceMap.dashboard_filter_time_period_selector_value4,
		                     	globalvars.localResourceMap.dashboard_filter_time_period_selector_value5,
		                     	globalvars.localResourceMap.dashboard_filter_time_period_selector_value6,
		                     	globalvars.localResourceMap.dashboard_filter_time_period_selector_value7,
		                     	globalvars.localResourceMap.dashboard_filter_time_period_selector_value8,
		                     	globalvars.localResourceMap.dashboard_filter_time_period_selector_value9,
		                     ];

		 if(globalvars.user.uType == globalvars.roles.physicianSupervisor || globalvars.user.uType == globalvars.roles.administrator){
		 	var selectedHospitals =  globalvars.filterParameters[widgets.physicianFilter.screenName].hospitalId.length;
			var period = parseInt(globalvars.filterParameters[widgets.physicianFilter.screenName].period)-1;
			var selectedCostCenter =  globalvars.filterParameters[widgets.physicianFilter.screenName].costCenter.length;
			var selectedHospitalsText = globalvars.localResourceMap.print_chart_facility+" "+selectedHospitals+" "+globalvars.localResourceMap.print_chart_selected;
			var selectedCostCenterText = 'Cost Center:'+" "+selectedCostCenter+" "+globalvars.localResourceMap.print_chart_selected;
			var selectedTimeperiod = globalvars.localResourceMap.print_chart_time_period +" "+timePeriodArr[period];
			return "<div id='chart_title'><b>"+chartTitle+"</b><br><br><div id='chart_header'>&nbsp<b>"+globalvars.localResourceMap.print_chart_filter_information+"</b>&nbsp&nbsp"+selectedHospitalsText+"&nbsp&nbsp"+selectedCostCenterText+"&nbsp&nbsp" +selectedTimeperiod+"&nbsp&nbsp</div><div><br><br>";
		 }


		//var billType = globalvars.filterParameters[widgets.physicianFilter.screenName].billType;
		//var hitType = globalvars.filterParameters[widgets.physicianFilter.screenName].hitType;
		
		var auditorId = globalvars.filterParameters[widgets.physicianFilter.screenName].auditorId;
		//var metricType = globalvars.filterParameters[widgets.physicianFilter.screenName].metricType;

		var selectedBillTypeText;
		var selectedHitTypeText;
		
		var selectedHospitalsText = globalvars.localResourceMap.print_chart_facility+" "+selectedHospitals+" "+globalvars.localResourceMap.print_chart_selected;
		var selectedAuditorText = globalvars.localResourceMap.Print_chart_auditor+" "+auditorId;
		
		var selectedMetricTypeText = globalvars.localResourceMap.print_chart_metric_type+" "+metricType;
		if(metricType == "foundPerDay"){
			selectedMetricTypeText = globalvars.localResourceMap.print_chart_metric_type+" "+globalvars.localResourceMap.print_chart_dollar_found_metric;
		}else{
			selectedMetricTypeText = globalvars.localResourceMap.print_chart_metric_type+" "+globalvars.localResourceMap.print_chart_reviewrate_metric;
		}
		
		
		
		if(billType == "PRE"){
			selectedBillTypeText = globalvars.localResourceMap.print_chart_audit_type+" "+globalvars.localResourceMap.central_auditor_prebill;
		}else if(billType == "POST"){
			selectedBillTypeText = globalvars.localResourceMap.print_chart_audit_type+" "+globalvars.localResourceMap.central_auditor_postbill;
		}else{
			selectedBillTypeText = globalvars.localResourceMap.print_chart_audit_type+" "+globalvars.localResourceMap.dashboard_overall_text;
		}
		
		if( (globalvars.user.uType == globalvars.roles.supervisor || globalvars.user.uType == globalvars.roles.administrator) && globalvars.root.auditLevel=="2" ){

			if(hitType == "A"){
				selectedHitTypeText = globalvars.localResourceMap.print_chart_hit_type+" "+globalvars.localResourceMap.dashboard_filter_auditor_hit;
			}else if(hitType == "H"){
				selectedHitTypeText = globalvars.localResourceMap.print_chart_hit_type+" "+globalvars.localResourceMap.dashboard_filter_hospital_hit;
			}else{
				selectedHitTypeText = globalvars.localResourceMap.print_chart_hit_type+" "+globalvars.localResourceMap.dashboard_filter_auditor_hit;
			}
		
		}
		
		if(selectedHitTypeText == 'undefined' || selectedHitTypeText == undefined)
			selectedHitTypeText="";
		
		
		
		var selectedTimeperiod = globalvars.localResourceMap.print_chart_time_period +" "+timePeriodArr[period];
		
		if(screenName =="auditorPerformanceChart"){
			return "<div id='chart_title'><b>"+chartTitle+"</b><br><br><div id='chart_header'>&nbsp<b>"+globalvars.localResourceMap.print_chart_filter_information+"</b>&nbsp&nbsp"+selectedAuditorText+"&nbsp&nbsp"+selectedBillTypeText+"&nbsp&nbsp" +selectedHitTypeText+"&nbsp&nbsp"+selectedTimeperiod+"&nbsp&nbsp</div><div><br><br>";
		}else if(screenName =="auditorPerformanceGrid"){
			return "<div id='chart_title'><b>"+chartTitle+"</b><br><br><div id='chart_header'>&nbsp<b>"+globalvars.localResourceMap.print_chart_filter_information+"</b>&nbsp&nbsp"+selectedBillTypeText +"&nbsp&nbsp"+selectedHitTypeText+"&nbsp&nbsp"+selectedTimeperiod+"&nbsp&nbsp</div><div><br><br>";
		}else if(screenName =="performanceComparisonGrid"){
			return "<div id='chart_title'><b>"+chartTitle+"</b><br><br><div id='chart_header'>&nbsp<b>"+globalvars.localResourceMap.print_chart_filter_information+"</b>&nbsp&nbsp"+selectedBillTypeText +"&nbsp&nbsp"+selectedHitTypeText +"&nbsp&nbsp"+selectedTimeperiod+"&nbsp&nbsp"+selectedHospitalsText+"</div><div><br><br>";
		}else if(screenName == "performanceComparisonChart"){
			return "<div id='chart_title'><b>"+chartTitle+"</b><br><br><div id='chart_header'>&nbsp<b>"+globalvars.localResourceMap.print_chart_filter_information+"</b>&nbsp&nbsp"+selectedBillTypeText +"&nbsp&nbsp"+selectedHitTypeText +"&nbsp&nbsp"+selectedMetricTypeText+"&nbsp&nbsp"+selectedTimeperiod+"&nbsp&nbsp"+selectedHospitalsText+"</div><div><br><br>";
		}else{
			return "<div id='chart_title'><b>"+chartTitle+"</b><br><br><div id='chart_header'>&nbsp<b>"+globalvars.localResourceMap.print_chart_filter_information+"</b>&nbsp&nbsp"+selectedBillTypeText +"&nbsp&nbsp"+selectedHitTypeText + "&nbsp&nbsp"+selectedTimeperiod+"&nbsp&nbsp"+selectedHospitalsText+"</div><div><br><br>";
		}
		
};

function printGrid(param){
	
	var origDisplay = [],
    body = document.body,
    childNodes = body.childNodes;
	
 	var container = param.container;
 	log(container);
	var origParent = container.parent();
    log(origParent);
    
	  for(var i=0;i<childNodes.length;i++){
		  if(childNodes[i].nodeType === 1){
			  origDisplay[i] = childNodes[i].style.display;
			  childNodes[i].style.display = "none";
		  }
	  }
	  
	  var chartHeader = getChartHeaderDetails(param.gridTitle,param.screenName);
  	  
	  $(body).append(chartHeader);
	  
	  $(body).append(container);
	  
	  window.focus(); 
	  window.print();
  
	  var elem = document.getElementById('chart_title');
	  elem.parentNode.removeChild(elem);
	  setTimeout(function () {
		 // put the chart back in
		$(origParent).append(container);

		// restore all body content
        Highcharts.each(childNodes, function (node, i) {
            if (node.nodeType === 1) {
                node.style.display = origDisplay[i];
            }
        });
    	
    

	  }, 1000);
	
};

function printPerformanceComparisonChart(param){
	var origDisplay = [],
    body = document.body,
    childNodes = body.childNodes;
	
	var chartContainer1 = param.chartContainer1;
    var chartContainer2 = param.chartContainer2;
    
    // hide all body content	
	  Highcharts.each(childNodes, function (node, i) {
        if (node.nodeType === 1) {
            origDisplay[i] = node.style.display;
            node.style.display = "none";
        }
	  });
	  
	  var container1Parent = param.container1Parent;
	  var container2Parent = param.container2Parent;
	  
	  var chartHeader = getChartHeaderDetails(param.chartTitle,param.screenName);
	  $(body).append(chartHeader);
	  
	  //Get the Chart Containers for Print
	  if(param.screenName == "dashboardPerformanceChart"){
		  body.appendChild(param.appendContainer1);  
		  $(body).append("<br>");
	      body.appendChild(param.appendContainer2);
	  }
	  if(param.screenName == "physicianDashboardPerformanceChart"){
		  body.appendChild(param.appendContainer1);  
		  $(body).append("<br>");
	      body.appendChild(param.appendContainer2);
	  }else if(param.screenName == "performanceComparisonChart"){
		  $(body).append(param.appendContainer1);
		  $(body).append("<br>");
		  $(body).append(param.appendContainer2);
	  }
      
     
      
      // print
	  window.focus(); 
	  window.print();
	  
	  setTimeout(function () {
		  // put the chart back in
		  if(param.screenName == "dashboardPerformanceChart"){
			  container1Parent.appendChild(param.appendContainer1);  
			  container2Parent.appendChild(param.appendContainer2);
		  }else if(param.screenName == "physicianDashboardPerformanceChart"){
			  container1Parent.appendChild(param.appendContainer1);  
			  container2Parent.appendChild(param.appendContainer2);
		  }else if(param.screenName == "performanceComparisonChart"){
			  container1Parent.append(param.appendContainer1);
			  container2Parent.append(param.appendContainer2);
		  }
		  
		  
		  
		  // restore all body content
		  var elem = document.getElementById('chart_title');
		  elem.parentNode.removeChild(elem);
		  
		  Highcharts.each(childNodes, function (node, i) {
              if (node.nodeType === 1) {
                  node.style.display = origDisplay[i];
              }
          });

	  }, 1000);
		
}

$(document).on('change','.responseSelect',function () {
	log($(this).val());
    var id=$(this).parent().parent().attr("id");
    log('id::::' +id );
    var targetId = '#account_details_missing_charges_grid_table' + ' ' + '#'+id+'_qty';
     //if(globalvars.client = "CP"){
     var selValue;
     if(globalvars.client == "CP"){
     	selValue = ($(this).val()=='Y' || $(this).val()=='C' || $(this).val()=='W' || $(this).val()=='T')?true:false;
     }else{
     	selValue = ($(this).val()=='Y')?true:false;
     }

     if(selValue){
     //if($(this).val()=='Y'){
			if( $(targetId).val()<=0){
				$(targetId).val(1);
			}
		}else{
			if($(targetId).val()>0){
				$(targetId).val(0);
				}		 
		}  
 });

	$(document).on('change','.responseSelectRules',function () {
		log($(this).val());
	    var id=$(this).parent().parent().attr("id");
	    log('id::::' +id );
	    var targetId = '#account_details_associate_rules_grid_table' + ' ' + '#'+id+'_qty';
	     if($(this).val()=='Y'){
				if( $(targetId).val()<=0){
					$(targetId).val(1);
				}
			}else{
				if($(targetId).val()>0){
					$(targetId).val(0);
					}		 
			}  
	 });
	 
 function getRowIdByValue(rowData,index){
     var indexArray=[];
     index=(parseInt(index,10)-1);
          for (var i = 0; i < rowData.length; i++) {
            indexArray.push(parseInt(rowData[i].index,10));
        }
        return (jQuery.inArray(index,indexArray));
 }

function allowNumbersOnly(e){

	var key = e.which || e.keyCode;

    if (!e.shiftKey && !e.altKey && !e.ctrlKey &&
        key >= 48 && key <= 57 ||
        key >= 96 && key <= 105 ||
        key == 8 || key == 9 || key == 13 ||
        key == 35 || key == 36 ||
        key == 37 || key == 39 ||
        key == 46 || key == 45){
        return true;
    }

    return false;        
}

// check unique value in Array

Array.prototype.checkIfArrayIsUnique = function() {
		    this.sort();    
		    for ( var i = 1; i < this.length; i++ ){
		        if(this[i-1] == this[i])
		            return false;
		    }
		    return true;
	    }


function uniqueArrayList(){

		Array.prototype.contains = function(v) {
		    for(var i = 0; i < this.length; i++) {
		        if(this[i] === v) return true;
		    }
		    return false;
			};

		Array.prototype.unique = function() {
		    var arr = [];
		    for(var i = 0; i < this.length; i++) {
		        if(!arr.contains(this[i])) {
		            arr.push(this[i]);
		        }
		    }
		    return arr; 
			}
		}
uniqueArrayList();

	// function removeDuplicatesArray(arr, key) {
	//     if (!(arr instanceof Array) || key && typeof key !== 'string') {
	//         return false;
	//     }

	//     if (key && typeof key === 'string') {
	//         return arr.filter((obj, index, arr) => {
	//             return arr.map(mapObj => mapObj[key]).indexOf(obj[key]) === index;
	//         });

	//     } else {
	//         return arr.filter(function(item, index, arr) {
	//             return arr.indexOf(item) == index;
	//         });
	//     }
	// }