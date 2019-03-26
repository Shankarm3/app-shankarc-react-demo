roles.physicianUser = {
    createMainMenu: function () {

        app.createScreenMenu.initialize([

              { name: "physicianAccountDetails", title: 'Account Review List',visible:true,
             	 parameters: {accountDetailsEditable: true, accountDetailsHidden:false,showSave: true, showSubmit: true,showAddRow: true,showDelRow: true,showPType:true},
              },
              {name: "physicianConfirmCharges", title: globalvars.localResourceMap.central_auditor_confirmed_charges_label,visible:true},
              {name: "editChargesPhysician", title: globalvars.localResourceMap.central_auditor_edit_account_label, parameters: {accountDetailsEditable: true,
                             accountDetailsHidden:false,
                             showSave: false,
                             showSubmit: true,
                             showAddRow: true,
                             showDelRow: true,
                             showPType:true},visible:true}

        ], "#main_menu");

    },
    sendAccountDetails: function (param) { //url, type, callback, validateMissingCharges, validateSuccessfullySaved


        var otherChargesData = gridPhysician.otherPhysicianChargesGrid.$gridDiv.getRowData();


            for (var i = 0; i < otherChargesData.length; i++) {
                delete otherChargesData[i].search;
                delete otherChargesData[i].id;
                delete otherChargesData[i].preBillSelectedAuditorOther;
                delete otherChargesData[i].accountSelectedDiagOther;

            };



	           var jsonToSend={};
            log('param.screen::' + param.screen);


            //var existingHospitalChargesData = gridPhysician.existingHospitalChargesGrid.$gridDiv.getRowData();
            var existingPhysicianChargesData = gridPhysician.existingPhysicianChargesGrid.$gridDiv.getRowData();
            var missingPhysicianChargesData = gridPhysician.missingPhysicianChargesGrid.$gridDiv.getRowData();


            for (var i = 0; i < missingPhysicianChargesData.length; i++) {
                delete missingPhysicianChargesData[i].id;
                delete missingPhysicianChargesData[i].accountSelectedDiag;
                delete missingPhysicianChargesData[i].preBillSelectedAuditor;
            };


	            jsonToSend = {
	            	//existingHospitalCharges: existingHospitalChargesData,
	            	existingPhysicianCharges: existingPhysicianChargesData,
	                missingPhysicianCharges: missingPhysicianChargesData,
	                otherPhysicianCharges: otherChargesData
	            }


            jsonToSend = JSON.stringify(jsonToSend);

            log("associate account details stringified DATA: " + jsonToSend);
            log("sent to: " + param.url);

            $.ajax({
                url: param.url,
                type: param.type,
                data: jsonToSend,
                async: false,
                contentType: 'application/json'
            });

            if (param.callback && typeof (param.callback) === "function") {
                log(" and launching callback");
                param.callback();
            };


    },
    checkLoadedHospitals: function () {

      var dfd = jQuery.Deferred();

        var  deferredCollection = [];

        //if (globalvars.physicianHospitals === undefined){
        deferredCollection.push(getPhysicianHospitals());
       // }
        $.when.apply($, deferredCollection).done(function(){
          return dfd.resolve();
        });           

        function getPhysicianHospitals(){
          var dfd = jQuery.Deferred();
        $.ajax({
        type: 'GET',
        url: globalvars.root.assignedHospitals,
        traditional: true,
        dataType: 'json',
        success: function(data){
              globalvars["physicianHospitals"] = data;
              return dfd.resolve();
        }
        })
          return dfd.promise();
        }

       
      return dfd.promise();
       
    }

};