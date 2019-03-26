widgets.physicianLiveSummaryFilter = {
    centralAuditorFilterTemplate: "",
    centralAuditorFacilityOptionTemplate: "",
    filterTemplate: "",
    initialize: function(params) {
    	this.screenName = params.screen;
    	this.loadData();
    	this.loadTemplate();
    	this.populateData(params.$targetDiv);
    	this.bindFunctionality();
    	this.updateScreen();
    },
    loadData:function(){


    		$.ajax({
				type: 'GET',
                url: globalvars.root.costCenterUri,
				traditional: true,
				dataType: 'json',
				success: function(data){
	        		globalvars["costCenterList"] = data;
				}
    		})

    },
    loadTemplate:function(){

    	if(this.filterTemplate==""){
    		this.filterTemplate = getTemplate('common/templates/widgets/physicianLiveSummaryFilter.html');
    	}
    	widgets.physicianLiveSummaryFilter.centralAuditorFacilityOptionTemplate = getTemplate('common/templates/physician_cost_center_filter.html');
    },
    populateData:function($filterDiv){

    	$filterDiv.empty();
        $filterDiv.append($.nano(widgets.physicianLiveSummaryFilter.filterTemplate, globalvars.localResourceMap));


    	var facilityDiv = $("#filter_cost_center");
            facilityDiv.append("<ul></ul>");
            
          $(globalvars.costCenterList).each(function(i) {
                    facilityDiv.find("ul:last").append($.nano(widgets.physicianLiveSummaryFilter.centralAuditorFacilityOptionTemplate, {
                        index: i,
                        data: globalvars.costCenterList[i],
                        //checked:(i==globalvars.costCenterList.length)?"checked = 'ckecked'":''
                    }));
                });


          facilityDiv.find("ul:last").append('<li><input type="radio" name="costCenter" value="overAll" checked = "ckecked">Overall</li>')
            
    },
    updateScreen:function(){

    	window["screens"][widgets.physicianLiveSummaryFilter.screenName]["onFilterUpdate"]();

    },
    bindFunctionality:function(){

    	 $("#filter_update_button").click(function() {
    	 	widgets.physicianLiveSummaryFilter.updateScreen();
    	 })
    }

}