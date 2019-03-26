
/* Global variables */

var globalobject = this;

var globalvars = {
    $pagecontainer: {},
    $contentcontainer: {},
    selectedPreHospitalIndex: 0,
    selectedPostHospitalIndex: 0,
    selectedCciHospitalIndex:0,
    selectedCostCenterValue:0,
    selectedBillTypeForSubmitCharge:"PRE",
    filterParameters: {},
    filterParametersAuditor:{},
    missingDropDownData:{},
    departmentDataDropDownData:{},
    selectedHospitalId:"",
    roles: {
        administrator: "PHYSICIAN_ADMIN",
        physicianUser:"PHYSICIAN_AUDITOR",
        physicianSupervisor:"PHYSICIAN_SUPERVISOR",
        physicianRPTUser:"PHYSICIAN_RPT_USER"
    },
    auditorFullNameList:"",
    authmode:"",
    appModData:{},
    appDiagData:{}
  };

var roles = {};
var screens = {};
var widgets = {};

