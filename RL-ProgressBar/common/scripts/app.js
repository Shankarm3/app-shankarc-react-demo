var app = {
    initialize: function() {
        $(document)
                .ajaxStart(function () {
                    $.blockUI(
                            {
                                message: '<img style="margin-right:5px" src="common/images/indicator.gif"><span style="text-align:center;font-size:14px;">Loading...</span>',
                                css: {
                                    'font-family': 'sans-serif',
                                    'font-size': '14px',
                                    margin: '0 auto',
                                    background: '#fff',
                                    padding: '0.5em 0.75em 0.5em 0.5em',
                                    display: 'inline-block',
                                    color: '#000',
                                    width: '10%',
                                    'z-index':'2000',
                                    'border-radius': '1em',
                                    left: '40%',
                                    border: '1px solid rgb(170, 170, 170)',
                                    'line-height': '20px',
                                    '-webkit-box-shadow': '0 0 3px rgba(0,0,0,0.4)',
                                    '-webkit-border-radius': '1em',
                                    background: '-webkit-gradient(linear, left top, left bottom, color-stop(0, #fff), color-stop(1, #ccc))',
                                    '-moz-box-shadow': '0 0 3px rgba(0,0,0,0.4)',
                                    '-moz-border-radius': '1em',
                                    background: '-moz-gradient(linear, left top, left bottom, color-stop(0, #fff), color-stop(1, #ccc))'


                                },
                                overlayCSS: {
                                    backgroundColor: '#eee',
                                    opacity: .5,
                                    cursor: 'wait'
                                },
                            }
                    );
                })
                .ajaxStop(function() {
                	$.unblockUI();
                });

        /* Set ajax error message */
        var isUnexpectedError = false;
        $(document).ajaxError(function(event, jqxhr, settings, exception) {

            log(jqxhr.status + " statusText: " + jqxhr.statusText + " exception: " + exception);

            if (jqxhr.status == 401) {
                /* redirect to login page */
                timeout("index.jsp", globalvars.root.guvnorAppUrl);
            }
            else if (jqxhr.status == 400 || jqxhr.status == 403 || jqxhr.status == 500 || jqxhr.status == 503) {
                err_msg = getErrorMessage(jqxhr, true);

                if (!isUnexpectedError)
                    dialogs.messageDialog.show({title: globalvars.localResourceMap.error, text: err_msg});

                // Suppress multiple error in case there is non-business error is raised for multiple AJAX calls. 
                if (jqxhr.status == 500 || jqxhr.status == 503)
                    isUnexpectedError = true;
            }
            $("#ajaxSpinnerImage").hide();
            $('body').css({'cursor': 'auto'});
            ;
        });

        /* read token */

        globalvars.token = localStorage.getItem('serviceToken');

        /* clear LocalStorage */

        localStorage.removeItem('filterParameters');
        localStorage.removeItem('filterParametersAuditor');
        localStorage.removeItem('ruleSummary');


        jQuery.ajaxSetup({
            cache: false,
            beforeSend: function(xhr) {
                xhr.setRequestHeader("AuthTokenHeader", globalvars.token);
            }
        });

        /* Load i18n */

        this.loadBundles();

        /* Load DOM objects */

        globalvars.$pagecontainer = $('#borders_wrapper');
        globalvars.$contentcontainer = $('#content');

        /* Load initial JSON resources */

        this.initialResourceLoad();


        // disable browser back using Keyboard backspace key.

        $(document).unbind('keydown').bind('keydown', function (event) {
            if (event.keyCode === 8) {
                var doPrevent = true;
                var types = ["text", "password", "file", "search", "email", "number", "date", "color", "datetime", "datetime-local", "month", "range", "search", "tel", "time", "url", "week"];
                var d = $(event.srcElement || event.target);
                var disabled = d.prop("readonly") || d.prop("disabled");
                if (!disabled) {
                    if (d[0].isContentEditable) {
                        doPrevent = false;
                    } else if (d.is("input")) {
                        var type = d.attr("type");
                        if (type) {
                            type = type.toLowerCase();
                        }
                        if (types.indexOf(type) > -1) {
                            doPrevent = false;
                        }
                    } else if (d.is("textarea")) {
                        doPrevent = false;
                    }
                }
                if (doPrevent) {
                    event.preventDefault();
                    return false;
                }
            }
        });

    },
    loadBundles: function() {
        /* Load resource bundles */
        jQuery.i18n.properties({
            name: 'messages',
            path: 'resources/bundles/',
            mode: 'map',
            language: 'en',
            callback: function() {
                log('set Localization Map in globalvars');
                globalvars.localResourceMap = $.i18n.map;
            }
        });
    },
    initialResourceLoad: function() {

    	$.when(
    			
        		$.ajax({
        			type: 'GET',
                    url: "resources/root",
        		})
    			
    	).done(function(data){

    		globalvars["root"] = data;

    		$.when(

    				$.ajax({
            			type: 'GET',
                        url: globalvars.root.userUri,
            		}),

    				$.ajax({
            			type: 'GET',
                        url: globalvars.root.securityImplUri,
                        contentType: 'text/plain'
            		})

    				
    		).done(function(data1, data2){

    			globalvars["user"] = data1[0];
                globalvars["authmode"] = data2[0];

                if (globalvars.user.uType != globalvars.roles.executive && globalvars.user.uType != globalvars.roles.reportUser) {

                	$.when(
            				$.ajax({
                    			type: 'GET',
                                url: globalvars.root.typeResponsesUri,
                    		}),
							
							$.ajax({
                    			type: 'GET',
                                url: globalvars.root.typeResponsesPhysUri,
                    		}),
                                $.ajax({
                    			type: 'GET',
                                url: globalvars.root.jqGridConfigUri+"?screenName=PHYS_EDIT",
                    		})
                			
                	).done(function(data, dataPhys,physEdit){

                		globalvars["responses"] = data[0];
						globalvars["responsesPhys"] = dataPhys[0];
                                                globalvars["physEdit"] = physEdit[0];

                		if(globalvars.root.enableCodingEdits){

                			$.when(

                    				$.ajax({
                            			type: 'GET',
                    	                url: globalvars.root.typeResponsesCodePairUri,
                            		}),
                            		
                    				$.ajax({
                            			type: 'GET',
                    	                url: globalvars.root.typeResponsesMueUri,
                            		}),
                            		
                    				$.ajax({
                            			type: 'GET',
                    	                url: globalvars.root.typeResponsesAddOnUri,
                            		})

                			).done(function(data1, data2, data3){
                        		globalvars["responsesCodePair"] = data1[0];
                        		globalvars["responsesMue"] = data2[0];
                        		globalvars["responsesAddOn"] = data3[0];
                				
                			})
                        }
                		
                	})
                    
                }

                app.initialAppDraw();

                /* Check For Role */

                app.checkForRole();

    		})

    	})

    },
    initialAppDraw: function() {

        /*Load Header*/
        getSYNC('common/templates/header.html', function(data) {
            param = {
                logoutUri: globalvars.root.logoutUri,
                fullUserName: globalvars.user.fullUserName,
                header: globalvars.localResourceMap,
                guvnorUri: globalvars.root.guvnorAppUrl
            };
            globalvars.$pagecontainer.prepend($.nano(data, param));


            if (globalvars.user.uType == globalvars.roles.administrator || globalvars.user.uType == globalvars.roles.helpdeskUser) {
                $("#header_user_management").show();

                $('#header_user_management').click(function() {
                    $("#user_management_form")[0].reset();
                    dialogs.userManagementDialog.open();
                });
            }

            $('#header_change_password').click(function() {
                $("#change_password_form")[0].reset();
                dialogs.changePasswordDialog.open();
            });
            if (globalvars.authmode == 'rsa') {
                $("#header_change_password").hide();
                $("#header_logout").css('margin-top','1.3%')
            }
            /*Message should be shown to user regarding the no.of days left for password to expire */
            if (globalvars.authmode != 'rsa') {
                if (globalvars.user.pwdValidDays == 0) {
                    dialogs.messageDialog.show({text: globalvars.localResourceMap.password_expiry_text3});
                } else if (globalvars.user.pwdValidDays < 7) {
                    dialogs.messageDialog.show({text: globalvars.localResourceMap.password_expiry_text1 + " " + globalvars.user.pwdValidDays + " " + globalvars.localResourceMap.password_expiry_text2});
                }
            }
        });

        /*Load Dialogs*/

        getSYNC('common/templates/dialogs.html', function(data) {
            globalvars.$pagecontainer.after($.nano(data, globalvars.localResourceMap));

            dialogs.changePasswordDialog.initialize({
                $changePasswordDialogDiv: $("#change_password_dialog"),
                $changePasswordDialogAlertDiv: $("#change_password_validation_alert")
            });


            dialogs.userManagementDialog.initialize({
                $userManagementDialogDiv: $("#user_management_dialog")
            });

//            dialogs.otherChargesSearchFormDialog.initialize({
//                $searchFormDialogDiv: $("#other_charges_grid_search_form_dialog"),
//                $searchFormDialogDivSubmit: $("#other_charges_grid_search_form_submit"),
//                $searchFormDialogDivReset: $("#other_charges_grid_search_form_reset"),
//                $searchFormDialogDivCancel: $("#other_charges_grid_search_form_cancel"),
//            });

            dialogs.submitAccountDetailsDialog.initialize({
                $submitAccountDetailsDialogDiv: $("#submit_account_details_dialog"),
            });
			
			dialogs.physicianSubmitAccountDetailsDialog.initialize({
                $physicianSubmitAccountDetailsDialogDiv: $("#physician_submit_account_details_dialog"),
            });
           
            dialogs.confirmAccountListDialog.initialize({
                $confirmAccountDialogDiv: $("#confirm_account_dialog"),
            });
            
            dialogs.confirmChargesAccountInfo.initialize({
                $confirmChargesDialogDiv: $("#confirm_charge_account_info"),
            });
			
			dialogs.confirmChargesAccountInfoPhysician.initialize({
                $confirmChargesDialogDiv: $("#confirm_charge_account_info_physician"),
            });

            dialogs.confirmChargesAccountInfoPhysicianGlobal.initialize({
                $confirmChargesDialogDiv: $("#confirm_charge_account_info_physician_global"),
            });

        });

//        dialogs.associateRulesSearchFormDialog.initialize({
//            $searchFormDialogDiv: $("#associate_rules_grid_search_form_dialog"),
//            $searchFormDialogDivSubmit: $("#associate_codes_grid_search_form_submit"),
//            $searchFormDialogDivReset: $("#associate_codes_grid_search_form_reset"),
//            $searchFormDialogDivCancel: $("#associate_codes_grid_search_form_cancel"),
//        });

        /*Load Main Menu*/

//        getSYNC('common/templates/main_menu.html', function (data) {
//            globalvars.$contentcontainer.before($.nano(data, {}));
//        });

        /*Load Footer*/
        getSYNC('common/templates/footer.html', function(data) {
            globalvars.$pagecontainer.append($.nano(data, {resource: globalvars.localResourceMap, root: globalvars.root}));
        });

    },
    createScreenMenu: {
        screensArray: [],
        menuContainerDiv: "",
        initialize: function(screensArray, menuContainerDiv) {
        	
        	// this code is for show visible tabs only-------------------
        	var filteredScreenArray=[];
        	$.each(screensArray, function(i) {
        		if(screensArray[i].visible == true){
        			if (screensArray[i].submenu == true) {   // for sub-menu test
        				var subMenuList=[]
        				$(screensArray[i].submenuModel).each(function(index) {
        					if(screensArray[i].submenuModel[index].visible == true)   // test visible sub menu
        						subMenuList.push(screensArray[i].submenuModel[index]);
        				});
        				screensArray[i].submenuModel = subMenuList;
        				screensArray[i].name = screensArray[i].submenuModel[0].name;
        			}
        			filteredScreenArray.push(screensArray[i]);
        		}
        	});
        	//-----------------------------------------------------------
        	
            this.screensArray = filteredScreenArray;
            this.menuContainerDiv = menuContainerDiv;

            var menuList = '<ul class="main_menu_list">';

            var listTemplate = "";

            getSYNC('common/templates/main_menu_item.html', function(data) {
                listTemplate = data;
            });

            var menuItemCount = this.screensArray.length;
            var menuItemWidth = Math.floor(99 / menuItemCount);
            var submenuList;
            var submenuArray = [];
            /*
             * Menu Width that needs to be split across Tabs,Since we show border of 2px between each tabs,
             *  we are calculating the tab width based on No of borders
             *  If we have 7 Tabs we show 6 borders in between them, since last tab don't have a right border
             * 
             */
            var menuWidth = 1258 - (2 * (menuItemCount));
            var menuItemLength = 0;

            // Calculating Text length in all the Tabs Title
            $.each(this.screensArray, function(i) {
                var itemLength = parseInt(app.createScreenMenu.screensArray[i].title.length);
                menuItemLength = menuItemLength + itemLength;
            });

            app.createScreenMenu.screensArray[0].isActive = "active";


            $(app.createScreenMenu.screensArray).each(function(index) {
                app.createScreenMenu.screensArray[index].width = menuItemWidth;

                menuList += $.nano(listTemplate, app.createScreenMenu.screensArray[index]);

                if (app.createScreenMenu.screensArray[index].submenu == true) {
                    submenuArray.push(app.createScreenMenu.screensArray[index].submenuModel);

                    var submenuList = "<ul id=" + app.createScreenMenu.screensArray[index].subMenuTitle + " class='submenu'>";
                    app.createScreenMenu.screensArray[index].submenuModel[0].isActive = "active";
                    $(app.createScreenMenu.screensArray[index].submenuModel).each(function(index) {
                        submenuList += '<li class="submenu_item ' + this.isActive + ' "><a href="#">' + this.title + '</a></li>';
                    });
                    submenuList += '</ul>';
                    //menuList += submenuList;
                    $("#sub_menu").append(submenuList);
                }
                ;
            });
            menuList += '</ul>';

            $(app.createScreenMenu.menuContainerDiv).append(menuList);


            /*
             * Calculating the width for Tabs
             * 
             *  If the menuItemCount is less than 6, then we are splitting the Width equally across all tabs
             *  If menuItemCount is greater than or equal to 6, then we are calculating the Tab title length
             *  and we are calculating individual tab width proportionately based on total tabs title length
             * 
             * */

//            var tabWidth;
//            if(menuItemCount<6){
//            	tabWidth = Math.floor(menuWidth/menuItemCount);
//                $.each(this.screensArray,function(i){
//                	$(".main_menu_list .main_menu_item").eq(i).width(tabWidth);
//                });
//            }else{
//                $.each(this.screensArray,function(i){
//                	tabWidth = parseInt(app.createScreenMenu.screensArray[i].title.length);
//                	$(".main_menu_list .main_menu_item").eq(i).width(Math.floor((tabWidth/menuItemLength)*menuWidth));
//                });
//            }

            /*Fix in IE8 where last-of-type does not work for removing the right-border for the last menu-item*/
            var mainMenuItems = $("#main_menu li.main_menu_item");
            if (mainMenuItems.length > 0) {
                $("#main_menu li.main_menu_item").eq(mainMenuItems.length - 1).addClass('main_menu_last_item');
            }

            $(app.createScreenMenu.menuContainerDiv).delegate('li.main_menu_item', 'click', function() {

                var clickedIndex = $(this).index('li.main_menu_item');

                log("menu index clicked = " + clickedIndex + " Loading screen: " + app.createScreenMenu.screensArray[clickedIndex].name);

                if (app.createScreenMenu.screensArray[clickedIndex].submenu == true) {
                    $(app.createScreenMenu.menuContainerDiv + ' li.main_menu_item').removeClass('submenuactive');
                    $(app.createScreenMenu.menuContainerDiv + ' li.main_menu_item').removeClass('active');
                    $(this).addClass('active');
                    $("#sub_menu" + ' ul.submenu').hide();
                    $(this).addClass('submenuactive');
                } else {
                    $(app.createScreenMenu.menuContainerDiv + ' li.main_menu_item').removeClass('active');
                    $(app.createScreenMenu.menuContainerDiv + ' li.main_menu_item').removeClass('submenuactive');
                    $("#sub_menu" + ' ul.submenu').hide();
                    $(this).addClass('active');
                }

                /*Fix in IE8 where last-of-type does not work for removing the right-border for the last menu-item*/
                var subMenuItems = $("#sub_menu" + " #" + app.createScreenMenu.screensArray[clickedIndex].subMenuTitle + " li.submenu_item");
                if (subMenuItems.length > 0) {
                    $("#sub_menu" + " #" + app.createScreenMenu.screensArray[clickedIndex].subMenuTitle + " li.submenu_item").eq(subMenuItems.length - 1).addClass('submenu_last_item');
                }

                $("#sub_menu" + " #" + app.createScreenMenu.screensArray[clickedIndex].subMenuTitle).show();
                $("#sub_menu" + " #" + app.createScreenMenu.screensArray[clickedIndex].subMenuTitle + " li.submenu_item").removeClass('active');
                $("#sub_menu" + " #" + app.createScreenMenu.screensArray[clickedIndex].subMenuTitle + " li.submenu_item").eq(0).addClass('active');


                app.screenManager.showScreen(app.createScreenMenu.screensArray[clickedIndex].name, app.createScreenMenu.screensArray[clickedIndex].parameters);
                
            });

            $("#sub_menu" + ' ul.submenu').each(function(index) {
                $(this).delegate('li.submenu_item', 'click', function(e) {
                    var clickedIndex = $(this).index();

                    $('li.submenu_item').removeClass('active');
                    $(this).addClass('active');
                    app.screenManager.showScreen(submenuArray[index][clickedIndex].name, submenuArray[index][clickedIndex].parameters);

                });
            });


        }
    },
    checkForRole: function() {
        log("ROLE: " + globalvars.user.uType);
        if (globalvars.user.uType == globalvars.roles.physicianUser) {
            roles.physicianUser.createMainMenu();
            app.screenManager.showScreen('physicianAccountDetails', '');
        }
        else if (globalvars.user.uType == globalvars.roles.physicianSupervisor) {
            roles.physicianSupervisor.createMainMenu();
            app.screenManager.showScreen('physicianDashboard', '');
        }
        else if (globalvars.user.uType == globalvars.roles.administrator) {
            roles.administrator.createMainMenu();
            app.screenManager.showScreen('physicianDashboard', '');
        }
        else if (globalvars.user.uType == globalvars.roles.physicianRPTUser) {
            roles.reportUser.createMainMenu();
            app.screenManager.showScreen('physicianDashboard', '');
        }

    },
    screenManager: {
        showScreen: function(screenName, parameters) {
            globalvars.$contentcontainer.empty();
            if (window["screens"][screenName]) {
                window["screens"][screenName]["initialize"](parameters);
            } else {
                globalvars.$contentcontainer.html(screenName);
            }
            ;

        }
    }

}

