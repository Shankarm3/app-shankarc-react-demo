
/* Global variables */

var globalobject = this;

var globalvars = {
    $pagecontainer: {},
    user: {},
    $contentcontainer: {},
    selectedPreHospitalIndex: 0,
    selectedPostHospitalIndex: 0,
    filterParameters: {},
    roles: {
        centralAuditor: "INTERNAL_AUDITOR_CENTRALIZED",
        supervisor: "SUPERVISOR",
        administrator: "ADMIN",
        executive: "EXECUTIVE"
    },
    auditorFullNameList: "",
    selectedClaimsToWorkSpaceArr: [],
    selectedResonCodeType: ["Procedure-Diagnosis Mismatch", "Provider Specialty - Procedure Mismatch", "Outlier Charges", "Unbundling", "Overcharging", "Duplicate Claims"],
    selectedClaimType: ["Procedure-Diagnosis Mismatch", "Provider Specialty - Procedure Mismatch", "Outlier Charges", "Unbundling", "Overcharging", "Duplicate Claims"],
    selectedPieSerries: "",
    dataArray: [
        {"acct_id": "1198255", "auditor_id": "CAnalyst", "date_verified": "2013-06-28", "date_verified_days": "2 days", "risk_amount": "$696", "claim_value": "$800", "score": 2, "patient_name": "Graham Grant", "gender": "M", "age": "55", "admit_date": "2013-02-15", "discharge_date": "2013-02-20", "claim_type": "Outpatient", "primary_insurer": "Cigna", "plan_type": "Physician", "provider_group": "Mountain Hill", "provider_id": "22133454", "provider_name": "Laureth Plano", "provider_type": "Clinic", "Specialty": "Oncologist", "Specialty_id": "22",
            "reasonProcList": [{"procedureCode": "Age=50-59", "category": "Attribute", "description": "Age", "paidAmount": "3.2"}, {"procedureCode": "Proc. 82374", "category": "Procedure Code", "description": "Assay of blood carbon dioxide", "paidAmount": "2.98"}, {"procedureCode": "Proc. 82310", "category": "Procedure Code", "description": "Assay of calcium", "paidAmount": "2.89"}, {"procedureCode": "Proc. 82247", "category": "Procedure Code", "description": "Bilirubin total", "paidAmount": "2.6"},
                {"procedureCode": "Proc. 82310", "category": "Attribute", "description": "Assay of calcium", "paidAmount": "1.59"}, {"procedureCode": "Urgent Admit", "category": "Attribute", "description": "Assay of calcium", "paidAmount": "1.29"}, {"procedureCode": "Proc. 87633", "category": "Attribute", "description": "Assay of calcium", "paidAmount": "0.59"}, {"procedureCode": "Male", "category": "Attribute", "description": "Age", "paidAmount": "0.3"}],
            "reasonParentProcList": [{"procedureCode": "80074", "category": "Equivalent Parent Procedure", "description": "Acute Hep Panel", "paidAmount": "17"}],
            "risk_reason": "Outlier Charges", "risk_description": "Presence of the Outlier charge <b>ID:  80053 Comprehen metabolic panel</b> does not match other diagnosis or procedure codes.",
            "claims_no": "250", "member_no": "220", "total_bill_amount": "$14500", "rejection_reason": "Claim Anomalies", "sub_reason": "Outlier Charges", "claim_fraud_score": 98, "provider_fraud_score": 83, "status": "F", diagnose: [{id: 'V5811', desc: 'ANTINEOPLASTIC CHEMO ENC'}, {id: '20300', desc: 'MULT MYE W/O ACHV RMSON'}], procedures: [{id: '82040', desc: 'Assay of serum albumin'}, {id: '80053', desc: 'Comprehen metabolic panel'}, {id: '82247', desc: 'Bilirubin total'}, {id: '82310', desc: 'Assay of calcium'}, {id: '82374', desc: 'Assay blood carbon dioxide'}, {id: '87633', desc: 'Resp virus 12-25 targets'}]},
        {"acct_id": "1198289", "auditor_id": "CAnalyst", "date_verified": "2013-09-28", "date_verified_days": "3 days", "risk_amount": "$160", "claim_value": "$230", "score": 4, "patient_name": "Bruce Persie", "gender": "M", "age": "26", "admit_date": "2013-07-01", "discharge_date": "2013-07-11", "claim_type": "Inpatient", "primary_insurer": "Cigna", "plan_type": "Laboratory", "provider_group": "Northwest", "provider_id": "49369038", "provider_name": "Ned Stark", "provider_type": "Clinic", "Specialty": "Radiologist", "Specialty_id": "22",
            "reasonProcList": [{"procedureCode": "77295", "category": "Unbundled-1", "description": "Set radiation therapy field", "paidAmount": "674"}, {"procedureCode": "77300", "category": "Unbundled-2", "description": "Radiation therapy dose plan", "paidAmount": "161"}],
            "reasonParentProcList": [{"procedureCode": "77301", "category": "Equivalent Parent Procedure", "description": "Radiotherapy dose plan imrt", "paidAmount": "675"}],
            "risk_reason": "Duplicate Claims", "risk_description": "Analytics detected 2 procedures which can be substituted by a comprehensive procedure <b>(ID: 77301)</b> with discounted rates.",
            "claims_no": "240", "member_no": "210", "total_bill_amount": "$12200", "rejection_reason": "Unbundling", "sub_reason": "Unbundling", "claim_fraud_score": 96, "provider_fraud_score": 82, "status": "O", diagnose: [{id: 'V661', desc: 'RADIOTHERAPY CONVALESCEN'}], procedures: [{id: '77295', desc: 'Set radiation therapy field'}, {id: '77300', desc: 'Radiation therapy dose plan'}]},
        {"acct_id": "1198288", "auditor_id": "CAnalyst", "date_verified": "2013-09-28", "date_verified_days": "3 days", "risk_amount": "$150", "claim_value": "$200", "score": 4, "patient_name": "Alex Sanchez", "gender": "M", "age": "39", "admit_date": "2013-06-01", "discharge_date": "2013-06-11", "claim_type": "Inpatient", "primary_insurer": "Cigna", "plan_type": "Laboratory", "provider_group": "Mountain Hill", "provider_id": "22133454", "provider_name": "Fritz Simon", "provider_type": "Clinic", "Specialty": "Internal Medicine", "Specialty_id": "22",
            "reasonProcList": [{"procedureCode": "86705", "category": "Unbundled-1", "description": "Hepatitis B Core Antibody IGN", "paidAmount": "50"}, {"procedureCode": "86709", "category": "Unbundled-2", "description": "Hep A Antibody IGN", "paidAmount": "50"}, {"procedureCode": "86803", "category": "Unbundled-3", "description": "Hep C AB Test", "paidAmount": "60"}, {"procedureCode": "87340", "category": "Unbundled-4", "description": "Hep B Surface AG EIA", "paidAmount": "40"}],
            "reasonParentProcList": [{"procedureCode": "80074", "category": "Equivalent Parent Procedure", "description": "Acute Hep Panel", "paidAmount": "50"}],
            "risk_reason": "Duplicate Claims", "risk_description": "Analytics detected 4 procedures which can be substituted by a comprehensive procedure <b>(ID: 80074)</b> with discounted rates.",
            "claims_no": "220", "member_no": "200", "total_bill_amount": "$12000", "rejection_reason": "Unbundling", "sub_reason": "Unbundling", "claim_fraud_score": 95, "provider_fraud_score": 80, "status": "F", diagnose: [{id: '07201', desc: 'HPT B ACTE COMA W DLTA'}], procedures: [{id: '86705', desc: 'Hepatitis B Core Antibody IGN'}, {id: '86709', desc: 'Hep A Antibody IGN'}, {id: '86803', desc: 'Hep C AB Test'}, {id: '87340', desc: 'Hep B Surface AG EIA'}]},
        {"acct_id": "1198267", "auditor_id": "CAnalyst", "date_verified": "2013-10-28", "date_verified_days": "5 days", "risk_amount": "$45", "claim_value": "$190", "score": 5, "patient_name": "John Smith", "gender": "M", "age": "39", "admit_date": "2013-02-15", "discharge_date": "2013-03-13", "claim_type": "Outpatient", "primary_insurer": "Cigna", "plan_type": "Physician", "provider_group": "Northwest", "provider_id": "49369038", "provider_name": "May Flower", "provider_type": "Clinic", "Specialty": "Psychiatrist", "Specialty_id": "26",
            "reasonProcList": [{"rank": "1", "description": "Medication Management", "code": "90862", "contribution": "25", "sliced": true, "selected": true}, {"rank": "2", "description": "Subsequent Hospital Care", "code": "99232", "contribution": "12", "sliced": true, "selected": true}, {"rank": "3", "description": "All Others", "code": "-", "contribution": "63", "sliced": false, "selected": false}, {"rank": "87", "description": "Chiropractic Manipulation", "code": "98940", "contribution": "0.05", "sliced": true, "selected": true}],
            "risk_reason": "Provider Specialty - Procedure Mismatch", "risk_description": "Provider John Smith (ID: 23343) who specializes in <b>Psychiatry (ID: 26)</b> conducted <b>chiropractic manipulation (ID: 98940)</b> Procedure.",
            "claims_no": "200", "member_no": "180", "total_bill_amount": "$11200", "rejection_reason": "Claim Anomalies", "sub_reason": "Provider Specialty - Procedure Mismatch", "claim_fraud_score": 93, "provider_fraud_score": 78, "status": "O", diagnose: [{id: '2989', desc: 'Pyschosis Nos'}], procedures: [{id: '99232', desc: 'Subsequent Hospital Care'}, {id: '98940', desc: 'Chirpopractic Manipulation'}]},
        {"acct_id": "1198279", "auditor_id": "CAnalyst", "date_verified": "2013-10-28", "date_verified_days": "5 days", "risk_amount": "$43", "claim_value": "$178", "score": 5, "patient_name": "Tim Doe", "gender": "M", "age": "41", "admit_date": "2013-01-11", "discharge_date": "2013-01-29", "claim_type": "Outpatient", "primary_insurer": "United", "plan_type": "Physician", "provider_group": "Spring Field", "provider_id": "46031840", "provider_name": "Met Bravo", "provider_type": "Clinic", "Specialty": "Cardiologist", "Specialty_id": "15",
            "reasonProcList": [{"rank": "1", "description": "Office Outpatient Visit", "code": "99214", "contribution": "20", "sliced": true, "selected": true}, {"rank": "2", "description": "Electrocardiogram Complete", "code": "93010", "contribution": "9", "sliced": true, "selected": true}, {"rank": "3", "description": "All Others", "code": "-", "contribution": "71", "sliced": false, "selected": false}, {"rank": "87", "description": "Assay Thyrid Stim Hormone", "code": "84443", "contribution": "0.02", "sliced": true, "selected": true}],
            "risk_reason": "Provider Specialty - Procedure Mismatch", "risk_description": "Provider Matt Bravo (ID: 46031840) who specializes in <b>Cardiology</b> conducted the <b>Assay Thyrid Stim Hormone (ID:84443)</b> Procedure.",
            "claims_no": "180", "member_no": "160", "total_bill_amount": "$9500", "rejection_reason": "Claim Anomalies", "sub_reason": "Provider Specialty - Procedure Mismatch", "claim_fraud_score": 93, "provider_fraud_score": 78, "status": "O", diagnose: [{id: '4280', desc: 'THYRTOX ORIG NEC NO CRIS'}, {id: '78841', desc: 'URINARY FREQUNECY'}, {id: '78079', desc: 'MALAISE AND FATIGUE NEC'}], procedures: [{id: '84439', desc: 'Assay of Free Throxine'}, {id: '84443', desc: 'Assay Thyrid Stim Hormone'}]},
        {"acct_id": "1198265", "auditor_id": "CAnalyst", "date_verified": "2013-10-28", "date_verified_days": "6 days", "risk_amount": "$37", "claim_value": "$175", "score": 5, "patient_name": "Tim May", "gender": "M", "age": "27", "admit_date": "2013-05-01", "discharge_date": "2013-05-10", "claim_type": "Outpatient", "primary_insurer": "Cigna", "plan_type": "Physician", "provider_group": "Northwest", "provider_id": "49369038", "provider_name": "John Major", "provider_type": "Clinic", "Specialty": "Cardiologist", "Specialty_id": "15",
            "reasonProcList": [{"rank": "1", "description": "Office Outpatient Visit", "code": "99214", "contribution": "20", "sliced": true, "selected": true}, {"rank": "2", "description": "Electrocardiogram Complete", "code": "93010", "contribution": "9", "sliced": true, "selected": true}, {"rank": "3", "description": "All Others", "code": "-", "contribution": "71", "sliced": false, "selected": false}, {"rank": "87", "description": "C Reactive Protein", "code": "86410", "contribution": "0.44", "sliced": true, "selected": true}],
            "risk_reason": "Provider Specialty - Procedure Mismatch", "risk_description": "Provider John Major (ID: 49369038) who specializes in <b>Caridiology</b> conducted <b>C Reactive Protein</b> Procedure.",
            "claims_no": "160", "member_no": "135", "total_bill_amount": "$8000", "rejection_reason": "Claim Anomalies", "sub_reason": "Provider Specialty - Procedure Mismatch", "claim_fraud_score": 93, "provider_fraud_score": 76, "status": "F", diagnose: [{id: 'V5869', desc: ' Long Term used medicine'}, {id: '79095', desc: 'ELEV C- REACTIVE PROTIEN'}], procedures: [{id: '36415', desc: 'Routine Venipuncture'}, {id: '86140', desc: 'C Reactive Protein'}]},
        {"acct_id": "1239847", "auditor_id": "CAnalyst", "date_verified": "2013-07-29", "date_verified_days": "8 days", "risk_amount": "$35", "claim_value": "$172", "score": 3, "patient_name": "Reed White", "gender": "F", "age": "24", "admit_date": "2012-12-13", "discharge_date": "2013-02-01", "claim_type": "Inpatient", "primary_insurer": "BCBS", "plan_type": "Hosp. Outpatient", "provider_group": "Northwest", "provider_id": "49369038", "provider_name": "Northwest Medical Center", "provider_type": "Clinic", "Specialty": "Pathologist", "Specialty_id": "22",
            "risk_reason": "Overcharging", "risk_description": "Possible cases of overcharging was detected in this claim.",
            "claims_no": "150", "member_no": "130", "total_bill_amount": "$7500", "rejection_reason": "Overcharging", "sub_reason": "Overcharging", "claim_fraud_score": 91, "provider_fraud_score": 75, "status": "O", diagnose: [{id: '470', desc: 'Deviated Nasal Septum'}, {id: '4780', desc: 'Hyper Nasal Turbiant'}, {id: '32723', desc: 'Obstructure Sleep Apena'}], procedures: [{id: '470', desc: 'Deviated Nasal Septum'}, {id: '4780', desc: 'Hyper Nasal Turbiant'}, {id: '32723', desc: 'Obstructure Sleep Apena'}]},
        {"acct_id": "1198269", "auditor_id": "CAnalyst", "date_verified": "2013-10-28", "date_verified_days": "9 days", "risk_amount": "$31", "claim_value": "$137", "score": 5, "patient_name": "Tim Doe", "gender": "M", "age": "41", "admit_date": "2013-01-11", "discharge_date": "2013-01-29", "claim_type": "Outpatient", "primary_insurer": "United", "plan_type": "Hosp. Outpatient", "provider_group": "Spring Field", "provider_id": "46031840", "provider_name": "Met Bravo", "provider_type": "Clinic", "Specialty": "Physician", "Specialty_id": "15",
            "reasonProcList": [{"rank": "1", "description": "Office Outpatient Visit", "code": "99214", "contribution": "20", "sliced": true, "selected": true}, {"rank": "2", "description": "Electrocardiogram Complete", "code": "93010", "contribution": "9", "sliced": true, "selected": true}, {"rank": "3", "description": "All Others", "code": "-", "contribution": "71", "sliced": false, "selected": false}, {"rank": "87", "description": "Assay Thyrid Stim Hormone", "code": "84443", "contribution": "0.02", "sliced": true, "selected": true}],
            "risk_reason": "Procedure-Diagnosis Mismatch", "risk_description": "Chiropractic manipulation of the <b>lower spine (ID:98940)</b> was performed even though diagnosis was <b>face & neck injury (ID:95909)</b>.",
            "claims_no": "140", "member_no": "120", "total_bill_amount": "$7000", "rejection_reason": "Claim Anomalies", "sub_reason": "Procedure-Diagnosis Mismatch", "claim_fraud_score": 91, "provider_fraud_score": 72, "status": "F", diagnose: [{id: '95909', desc: 'FACE & NECK INJURY'}], procedures: [{id: 'A0428', desc: 'Ambulance service supplier'}, {id: '98940', desc: 'Chiropractic manipulation'}]},
        {"acct_id": "1649023", "auditor_id": "CAnalyst", "date_verified": "2013-10-25", "date_verified_days": "11 days", "risk_amount": "$28", "claim_value": "$100", "score": 3, "patient_name": "Su Chung", "gender": "M", "age": "24", "admit_date": "2012-12-13", "discharge_date": "2012-02-01", "claim_type": "Inpatient", "primary_insurer": "Cigna", "plan_type": "Home Professional", "provider_group": "South Region", "provider_id": "NP111456", "provider_name": "Newport Medical Center", "provider_type": "Clinic", "Specialty": "Cardiologist", "Specialty_id": "22",
            "reasonProcList": [{"procedureCode": "86705", "category": "Unbundled-1", "description": "Hepatitis B Core Antibody IGN", "paidAmount": "17"}, {"procedureCode": "86709", "category": "Unbundled-2", "description": "Hep A Antibody IGN", "paidAmount": "16"}, {"procedureCode": "86803", "category": "Unbundled-3", "description": "Hep C AB Test", "paidAmount": "20"}, {"procedureCode": "87340", "category": "Unbundled-4", "description": "Hep B Surface AG EIA", "paidAmount": "14"}],
            "reasonParentProcList": [{"procedureCode": "80074", "category": "Equivalent Parent Procedure", "description": "Acute Hep Panel", "paidAmount": "17"}],
            "risk_reason": "Duplicate Claims", "risk_description": "Claim ID : <b>1649023</b> is a possible duplicate of Claim ID: <b>1649024</b>.",
            "claims_no": "120", "member_no": "110", "total_bill_amount": "$6000", "rejection_reason": "Duplicate Claims", "sub_reason": "Duplicate Claims", "claim_fraud_score": 90, "provider_fraud_score": 69, "status": "O", diagnose: [{id: '470', desc: 'Deviated Nasal Septum'}, {id: '4780', desc: 'Hyper Nasal Turbiant'}, {id: '31723', desc: 'Obstructure Sleep Apena'}], procedures: [{id: '470', desc: 'Deviated Nasal Septum'}, {id: '4780', desc: 'Hyper Nasal Turbiant'}, {id: '31723', desc: 'Obstructure Sleep Apena'}]},
        {"acct_id": "1649024", "auditor_id": "CAnalyst", "date_verified": "2013-10-25", "date_verified_days": "11 days", "risk_amount": "$28", "claim_value": "$100", "score": 3, "patient_name": "Su Chung", "gender": "M", "age": "24", "admit_date": "2012-12-13", "discharge_date": "2012-02-01", "claim_type": "Inpatient", "primary_insurer": "BCBS", "plan_type": "Home Professional", "provider_group": "South Region", "provider_id": "NP111456", "provider_name": "Newport Medical Center", "provider_type": "Clinic", "Specialty": "Physician", "Specialty_id": "22",
            "reasonProcList": [{"procedureCode": "86705", "category": "Unbundled-1", "description": "Hepatitis B Core Antibody IGN", "paidAmount": "17"}, {"procedureCode": "86709", "category": "Unbundled-2", "description": "Hep A Antibody IGN", "paidAmount": "16"}, {"procedureCode": "86803", "category": "Unbundled-3", "description": "Hep C AB Test", "paidAmount": "20"}, {"procedureCode": "87340", "category": "Unbundled-4", "description": "Hep B Surface AG EIA", "paidAmount": "14"}],
            "reasonParentProcList": [{"procedureCode": "80074", "category": "Equivalent Parent Procedure", "description": "Acute Hep Panel", "paidAmount": "17"}],
            "risk_reason": "Duplicate Claims", "risk_description": "Claim ID : <b>1649024</b> is a possible duplicate of Claim ID: <b>1649023</b>.",
            "claims_no": "100", "member_no": "80", "total_bill_amount": "$5000", "rejection_reason": "Duplicate Claims", "sub_reason": "Duplicate Claims", "claim_fraud_score": 89, "provider_fraud_score": 66, "status": "O", diagnose: [{id: '470', desc: 'Deviated Nasal Septum'}, {id: '4780', desc: 'Hyper Nasal Turbiant'}, {id: '31723', desc: 'Obstructure Sleep Apena'}], procedures: [{id: '470', desc: 'Deviated Nasal Septum'}, {id: '4780', desc: 'Hyper Nasal Turbiant'}, {id: '31723', desc: 'Obstructure Sleep Apena'}]},
        {"acct_id": "1649029", "auditor_id": "CAnalyst", "date_verified": "2013-04-28", "date_verified_days": "12 days", "risk_amount": "$26", "claim_value": "$70", "score": 2, "patient_name": "Been Li", "gender": "M", "age": "35", "admit_date": "2012-11-20", "discharge_date": "2012-11-22", "claim_type": "Inpatient", "primary_insurer": "United", "plan_type": "Laboratory", "provider_group": "Kent", "provider_id": "L3230213", "provider_name": "Light Tower Medical Center", "provider_type": "Clinic", "Specialty": "Physician", "Specialty_id": "22",
            "risk_reason": "Procedure-Diagnosis Mismatch", "risk_description": "Provider John Smith ( ID: 23343) who specializes in <b>Psychiatry (ID: 26)</b> conducted <b>chiropractic manipulation (ID: 98940)</b>.",
            "claims_no": "100", "member_no": "70", "total_bill_amount": "$5000", "rejection_reason": "Claim Anomalies", "sub_reason": "Procedure-Diagnosis Mismatch", "claim_fraud_score": 85, "provider_fraud_score": 52, "status": "F", diagnose: [{id: '4139', desc: 'Angina Pectoral'}], procedures: [{id: '93798', desc: 'Cardiac Rehab'}, {id: '43883', desc: 'Facial Weakness'}]},
        {"acct_id": "7649025", "auditor_id": "CAnalyst", "date_verified": "2013-04-28", "date_verified_days": "13 days", "risk_amount": "$22", "claim_value": "$56", "score": 2, "patient_name": "James", "gender": "M", "age": "35", "admit_date": "2012-11-20", "discharge_date": "2012-11-22", "claim_type": "Inpatient", "primary_insurer": "Cigna", "plan_type": "Laboratory", "provider_group": "Providence", "provider_id": "H3230213", "provider_name": "Holander Medical Center", "provider_type": "Clinic", "Specialty": "Physician", "Specialty_id": "22",
            "risk_reason": "Procedure-Diagnosis Mismatch", "risk_description": "Provider John Smith ( ID: 23343) who specializes in <b>Psychiatry (ID: 26)</b> conducted <b>chiropractic manipulation (ID: 98940)</b>.",
            "claims_no": "80", "member_no": "60", "total_bill_amount": "$4000", "rejection_reason": "Claim Anomalies", "sub_reason": "Procedure-Diagnosis Mismatch", "claim_fraud_score": 83, "provider_fraud_score": 51, "status": "A", diagnose: [{id: '470', desc: 'Deviated Nasal Septum'}, {id: '4780', desc: 'Hyper Nasal Turbiant'}, {id: '32723', desc: 'Obstructure Sleep Apena'}], procedures: [{id: '470', desc: 'Deviated Nasal Septum'}, {id: '4780', desc: 'Hyper Nasal Turbiant'}, {id: '32723', desc: 'Obstructure Sleep Apena'}]},
    ],
    workspaceProcServiceData: [
        {"acct_id": "1198255", procedures: [{id: '82040', desc: 'Assay of serum albumin', date: '2013-02-15', modifier: '', quantity: '2', amount: '$220', paid_amount: '$180'}, {id: '80053', desc: 'Comprehen metabolic panel', date: '2013-03-15', modifier: 'PO', quantity: '3', amount: '$120', paid_amount: '$109'}, {id: '82247', desc: 'Bilirubin total', date: '2013-02-16', modifier: 'OB', quantity: '2', amount: '$90', paid_amount: '$80'}, {id: '82310', desc: 'Assay of calcium', date: '2013-02-15', modifier: 'OB', quantity: '2', amount: '$120', paid_amount: '$102'}, {id: '82374', desc: 'Assay blood carbon dioxide', date: '2013-02-15', modifier: '', quantity: '2', amount: '$130', paid_amount: '$115'}, {id: '87633', desc: 'Resp virus 12-25 targets', date: '2013-02-15', modifier: 'OB', quantity: '2', amount: '$120', paid_amount: '$110'}]},
        {"acct_id": "1198289", procedures: [{id: '77295', desc: 'Set radiation therapy field', date: '2013-03-25', modifier: 'OC', quantity: '3', amount: '$140', paid_amount: '$90'}, {id: '77300', desc: 'Radiation therapy dose plan', date: '2013-01-15', modifier: 'OB', quantity: '1', amount: '$90', paid_amount: '$70'}]},
        {"acct_id": "1198288", procedures: [{id: '86705', desc: 'Hepatitis B Core Antibody IGN', date: '2013-01-05', modifier: 'OC', quantity: '1', amount: '$90', paid_amount: '$70'}, {id: '86709', desc: 'Hep A Antibody IGN', date: '2013-02-16', modifier: 'OM', quantity: '1', amount: '$50', paid_amount: '$35'}, {id: '86803', desc: 'Hep C AB Test', date: '2013-01-15', modifier: 'OS', quantity: '1', amount: '$45', paid_amount: '$35'}, {id: '87340', desc: 'Hep B Surface AG EIA', date: '2013-02-15', modifier: 'OB', quantity: '2', amount: '$15', paid_amount: '$10'}]},
        {"acct_id": "1198267", procedures: [{id: '99232', desc: 'Subsequent Hospital Care', date: '2013-01-15', modifier: 'OM', quantity: '2', amount: '$160', paid_amount: '$110'}, {id: '98940', desc: 'Chirpopractic Manipulation', date: '2013-02-17', modifier: 'OB', quantity: '2', amount: '$120', paid_amount: '$70'}]},
        {"acct_id": "1198279", procedures: [{id: '84439', desc: 'Assay of Free Throxine', date: '2013-01-15', modifier: 'OB', quantity: '1', amount: '$120', paid_amount: '$70'}, {id: '84443', desc: 'Assay Thyrid Stim Hormone', date: '2013-02-15', modifier: 'OT', quantity: '1', amount: '$220', paid_amount: '$170'}]},
        {"acct_id": "1198265", procedures: [{id: '36415', desc: 'Routine Venipuncture', date: '2013-02-25', modifier: 'DO', quantity: '2', amount: '$180', paid_amount: '$120'}, {id: '86140', desc: 'C Reactive Protein', date: '2013-02-16', modifier: 'OB', quantity: '4', amount: '$110', paid_amount: '$70'}]},
        {"acct_id": "1239847", procedures: [{id: '470', desc: 'Deviated Nasal Septum', date: '2013-02-16', modifier: 'OB', quantity: '2', amount: '$120', paid_amount: '$70'}, {id: '4780', desc: 'Hyper Nasal Turbiant', date: '2013-02-18', modifier: 'OS', quantity: '1', amount: '$140', paid_amount: '$90'}, {id: '32723', desc: 'Obstructure Sleep Apena', date: '2013-02-16', modifier: 'OT', quantity: '1', amount: '$120', paid_amount: '$70'}]},
        {"acct_id": "1198269", procedures: [{id: 'A0428', desc: 'Ambulance service supplier', date: '2013-03-15', modifier: 'OB', quantity: '2', amount: '$110', paid_amount: '$70'}, {id: '98940', desc: 'Chiropractic manipulation', date: '2013-02-15', modifier: 'OB', quantity: '2', amount: '$120', paid_amount: '$90'}]},
        {"acct_id": "1649023", procedures: [{id: '470', desc: 'Deviated Nasal Septum', date: '2013-02-17', modifier: 'BO', quantity: '2', amount: '$120', paid_amount: '$70'}, {id: '4780', desc: 'Hyper Nasal Turbiant', date: '2013-02-19', modifier: 'OQ', quantity: '2', amount: '$220', paid_amount: '$130'}, {id: '31723', desc: 'Obstructure Sleep Apena', date: '2013-03-15', modifier: 'OB', quantity: '2', amount: '$140', paid_amount: '$90'}]},
        {"acct_id": "1649024", procedures: [{id: '470', desc: 'Deviated Nasal Septum', date: '2013-02-11', modifier: 'OB', quantity: '3', amount: '$150', paid_amount: '$110'}, {id: '4780', desc: 'Hyper Nasal Turbiant', date: '2013-02-20', modifier: 'OB', quantity: '3', amount: '$130', paid_amount: '$90'}, {id: '31723', desc: 'Obstructure Sleep Apena', date: '2013-03-15', modifier: 'ON', quantity: '2', amount: '$120', paid_amount: '$70'}]},
        {"acct_id": "1649029", procedures: [{id: '93798', desc: 'Cardiac Rehab', date: '2013-02-12', modifier: 'OB', quantity: '2', amount: '$160', paid_amount: '$110'}, {id: '43883', desc: 'Facial Weakness', date: '2013-02-15', modifier: 'OB', quantity: '2', amount: '$120', paid_amount: '$70'}]},
        {"acct_id": "7649025", procedures: [{id: '470', desc: 'Deviated Nasal Septum', date: '2013-01-15', modifier: 'GO', quantity: '2', amount: '$120', paid_amount: '$70'}, {id: '4780', desc: 'Hyper Nasal Turbiant', date: '2013-02-15', modifier: 'TP', quantity: '1', amount: '$150', paid_amount: '$110'}, {id: '32723', desc: 'Obstructure Sleep Apena', date: '2013-01-15', modifier: 'OM', quantity: '2', amount: '$150', paid_amount: '$100'}]},
    ],
    providerDataArray: [{"provider": "93847521", "risk_ID": "1011", "source": "System", "provider_Name": "John Smith", "risk_reason": "Specialty - Procedure Mismatch", "provider_Specialty": "Psychiatry", "total_claims": "11", "unique_Patients": "9", "amount": "$20,120", "risk_score": 97, "Specialty": "Psychiatry", "provider_group": "Newport"},
        {"provider": "98235623", "risk_ID": "1013", "source": "Hotline", "provider_Name": "Larry Bucshon", "risk_reason": "Overcharging", "provider_Specialty": "General Surgery", "total_claims": "15", "unique_Patients": "12", "amount": "$19,402", "risk_score": 93, "Specialty": "General Surgery", "provider_group": "Northwest"},
        {"provider": "40926608", "risk_ID": "1012", "source": "System", "provider_Name": "Chuck Brown", "risk_reason": "Unbundling", "provider_Specialty": "Cardiology", "total_claims": "18", "unique_Patients": "15", "amount": "$17,211", "risk_score": 90, "Specialty": "Cardiology", "provider_group": "Spring Field"},
        {"provider": "24329643", "risk_ID": "1016", "source": "Other Users", "provider_Name": "Britni Murrow", "risk_reason": "Overcharging", "provider_Specialty": "Endocrinology", "total_claims": "10", "unique_Patients": "10", "amount": "$10,345", "risk_score": 88, "Specialty": "Endocrinology", "provider_group": "Mountain Hill"},
        {"provider": "79403874", "risk_ID": "1014", "source": "Hotline", "provider_Name": "Joe Heck", "risk_reason": "Specialty - Procedure Mismatch", "provider_Specialty": "General Surgery", "total_claims": "12", "unique_Patients": "11", "amount": "$9,007", "risk_score": 87, "Specialty": "General Surgery", "provider_group": "Freeport"},
        {"provider": "53831859", "risk_ID": "1015", "source": "System", "provider_Name": "Susan White", "risk_reason": "Unbundling", "provider_Specialty": "Endocrinology", "total_claims": "13", "unique_Patients": "12", "amount": "$7,900", "risk_score": 84, "Specialty": "Endocrinology", "provider_group": "Mountain Hill"}

    ],
    providerDataArrayViewArray: [{"providerName": "John Smith", "providerId": "93847521", "services": "Practitioner", "address": "350 5th Avenue, New York, NY", "total_Claim": "11", "unique_patient": "9", "provider_specialty": "Psychiatry", "risk_reason1": "Specialty - Procedure Mismatch", "amount": "$20,120", "risk_reason2": "Claims contain procedure codes inconsistent with provider specialty", "risk_score": 97},
        {"providerName": "Larry Bucshon", "providerId": "98235623", "services": "Practitioner", "address": "462 First Avenue, New York, NY", "total_Claim": "15", "unique_patient": "12", "provider_specialty": "General Surgery", "risk_reason1": "Overcharging", "amount": "$19,402", "risk_reason2": "Claims are overcharged above the threshold cost", "risk_score": 93},
        {"providerName": "Chuck Brown", "providerId": "40926608", "services": "Practitioner", "address": "2070 Clinton Ave, Alameda CA", "total_Claim": "18", "unique_patient": "15", "provider_specialty": "Cardiology", "risk_reason1": "Unbundling", "amount": "$17,211", "risk_reason2": "Parent procedure code is available that can be used instead unbundled procedures", "risk_score": 90},
        {"providerName": "Britni Murrow", "providerId": "24329643", "services": "Practitioner", "address": "577 S Main Street, Providence, RI", "total_Claim": "10", "unique_patient": "10", "provider_specialty": "Endocrinology", "risk_reason1": "Overcharging", "amount": "$10,345", "risk_reason2": "Claims are overcharged above the threshold cost", "risk_score": 88},
        {"providerName": "Joe Heck", "providerId": "79403874", "services": "Practitioner", "address": "2450 Ashby Avenue Berkeley , CA", "total_Claim": "12", "unique_patient": "11", "provider_specialty": "General Surgery", "risk_reason1": "Specialty - Procedure Mismatch", "amount": "$9,007", "risk_reason2": "Claims contain procedure codes inconsistent with provider specialty", "risk_score": 87},
        {"providerName": "Susan White", "providerId": "53831859", "services": "Practitioner", "address": "350 Hawthorne Avenue Oakland , CA", "total_Claim": "13", "unique_patient": "12", "provider_specialty": "Endocrinology", "risk_reason1": "Unbundling", "amount": "$7,900", "risk_reason2": "Parent procedure code is available that can be used instead unbundled procedures", "risk_score": 84},
        {"providerName": "Susan White", "providerId": "76567667", "services": "Internal Medicine ", "address": "462 First Avenue, New York, NY", "total_Claim": "10", "unique_patient": "9", "provider_specialty": "Internal Medicine", "risk_reason1": "Network Fraud: Provider - Provider", "amount": "$29,400", "risk_reason2": "High volume of patient forwarding from one provider to other", "risk_score": 96},
        {"providerName": "Tim White", "providerId": "86637643", "services": "ICF/MR, Cardiology", "address": "462 First Avenue, New York, NY", "total_Claim": "15", "unique_patient": "12", "provider_specialty": "Oncology", "risk_reason1": "Network Fraud: Provider - Provider", "amount": "$13,015", "risk_reason2": "High volume of patient forwarding from one provider to the other", "risk_score": 93},
        {"providerName": "Mark Lekar", "providerId": "93367632", "services": "Durable Med Equip, Dental Clinic", "address": "577 S Main Street, Providence, RI", "total_Claim": "16", "unique_patient": "16", "provider_specialty": "Cardiology", "risk_reason1": "Network Fraud: Provider - Provider", "amount": "$10,008", "risk_reason2": "High volume of patient forwarding from one provider to the other", "risk_score": 91},
        {"providerName": "Britni Murrow", "providerId": "86567234", "services": "General Surgery, Endocrinology", "address": "2450 Ashby Avenue Berkeley , CA", "total_Claim": "19", "unique_patient": "18", "provider_specialty": "General Surgery", "risk_reason1": "Network Fraud: Provider - Provider", "amount": "$9,290", "risk_reason2": "High volume of patient forwarding from one provider to the other", "risk_score": 89},
        {"providerName": "John White", "providerId": "96567367", "services": "Laboratory, Ear Care", "address": "350 Hawthorne Avenue Oakland , CA", "total_Claim": "22", "unique_patient": "20", "provider_specialty": "Psychiatry", "risk_reason1": "Network Fraud: Provider - Member", "amount": "$9,247", "risk_reason2": "High volume of patient referring to same provider", "risk_score": 83},
        {"providerName": "Richard Green", "providerId": "27815901", "services": "General Surgery, Endocrinology", "address": "2450 West Street, Newark, NY", "total_Claim": "19", "unique_patient": "18", "provider_specialty": "General Surgery", "risk_reason1": "Network Fraud: Provider - Provider", "amount": "$9,290", "risk_reason2": "High volume of patient forwarding from one provider to the other", "risk_score": 89},
        {"providerName": "John Black", "providerId": "29307171", "services": "Laboratory, Ear Care", "address": "350 West Hasting Street, New York", "total_Claim": "22", "unique_patient": "20", "provider_specialty": "Internal Medicine", "risk_reason1": "Network Fraud: Provider - Member", "amount": "$9,247", "risk_reason2": "High volume of patient referring to same provider", "risk_score": 83}

    ],
    providerFormDataArray: [{"claim_no": "2385678", "reason_code": "Specialty - Procedure Mismatch", "claim_date": "10-02-2013", "review_outcome": "Processing", "referring_provider": "Lily Young", "paid_amount": "$3,622", "comments": ""},
        {"claim_no": "1120394", "reason_code": "Specialty - Procedure Mismatch", "claim_date": "10-03-2013", "review_outcome": "Released", "referring_provider": "Lily Young", "paid_amount": "$409", "comments": ""},
        {"claim_no": "8927405", "reason_code": "Specialty - Procedure Mismatch", "claim_date": "10-04-2013", "review_outcome": "Released", "referring_provider": "Olivia Lo", "paid_amount": "$1,001", "comments": ""},
        {"claim_no": "0035648", "reason_code": "Specialty - Procedure Mismatch", "claim_date": "10-05-2013", "review_outcome": "Processing", "referring_provider": "Ruby Wildy", "paid_amount": "$3,680", "comments": ""},
        {"claim_no": "6787900", "reason_code": "Specialty - Procedure Mismatch", "claim_date": "10-06-2013", "review_outcome": "Released", "referring_provider": "Sophie Green", "paid_amount": "$5,424", "comments": ""},
        {"claim_no": "2345623", "reason_code": "Specialty - Procedure Mismatch", "claim_date": "10-07-2013", "review_outcome": "Processing", "referring_provider": "Jessica Hills", "paid_amount": "$2,217", "comments": ""},
        {"claim_no": "9876782", "reason_code": "Specialty - Procedure Mismatch", "claim_date": "10-08-2013", "review_outcome": "Released", "referring_provider": "Amelia Rogers", "paid_amount": "$672", "comments": ""},
        {"claim_no": "2324543", "reason_code": "Specialty - Procedure Mismatch", "claim_date": "10-08-2013", "review_outcome": "Released", "referring_provider": "Amelia Rogers", "paid_amount": "$490", "comments": ""},
        {"claim_no": "2434323", "reason_code": "Specialty - Procedure Mismatch", "claim_date": "10-08-2013", "review_outcome": "Released", "referring_provider": "Amelia Rogers", "paid_amount": "$900", "comments": ""},
        {"claim_no": "2343343", "reason_code": "Specialty - Procedure Mismatch", "claim_date": "10-08-2013", "review_outcome": "Released", "referring_provider": "Amelia Rogers", "paid_amount": "$750", "comments": ""},
        {"claim_no": "2356876", "reason_code": "Specialty - Procedure Mismatch", "claim_date": "10-06-2013", "review_outcome": "Released", "referring_provider": "Sophie Green", "paid_amount": "$952", "comments": ""},
    ],
    providerFormClaimDetailsDataArray: [{"claim_no": "2385678", p_name: "Clara Smith", gender: "F", age: "39", admit_date: "09-24-2013", discharge_date: "09-25-2013", claim_type: "Outpatient", p_insurer: "Cinda", l_stay: "1", ref_provider: "748167", red_provider: "718045", diag_code1: "65523", diag_value1: "FAMIL HERED DIS-ANTEPART", diag_code2: "64881", diag_value2: "ABN GLUCOSE TOLER-DELIV", diag_code3: "64901", diag_value3: "TOBACCO USE DISOR-DELLIV", proc_code1: "76817", proc_value1: "Transvaginal us obstetric", proc_code2: "99211", proc_value2: "Office/outpatient visit est", proc_code3: "59514", proc_value3: "Cesarean delivery only", comment1: "Procedure not valid for provider specialty", comment2: "-By Richy Walton 06-12-2013 10:23:12 AM"},
        {"claim_no": "1120394", p_name: "Tina Ray", gender: "F", age: "39", admit_date: "09-24-2013", discharge_date: "09-25-2013", claim_type: "Outpatient", p_insurer: "Cinda", l_stay: "3", ref_provider: "748167", red_provider: "718045", diag_code1: "65523", diag_value1: "FAMIL HERED DIS-ANTEPART", diag_code2: "64881", diag_value2: "ABN GLUCOSE TOLER-DELIV", diag_code3: "64901", diag_value3: "TOBACCO USE DISOR-DELLIV", proc_code1: "76817", proc_value1: "Transvaginal us obstetric", proc_code2: "99211", proc_value2: "Office/outpatient visit est", proc_code3: "59514", proc_value3: "Cesarean delivery only", comment1: "Procedure not valid for provider specialty", comment2: "-By Richy Walton 06-12-2013 10:23:12 AM"},
        {"claim_no": "8927405", p_name: "Julian Hale", gender: "F", age: "43", admit_date: "09-24-2013", discharge_date: "09-25-2013", claim_type: "Outpatient", p_insurer: "Cinda", l_stay: "2", ref_provider: "748167", red_provider: "718045", diag_code1: "65523", diag_value1: "FAMIL HERED DIS-ANTEPART", diag_code2: "64881", diag_value2: "ABN GLUCOSE TOLER-DELIV", diag_code3: "64901", diag_value3: "TOBACCO USE DISOR-DELLIV", proc_code1: "76817", proc_value1: "Transvaginal us obstetric", proc_code2: "99211", proc_value2: "Office/outpatient visit est", proc_code3: "59514", proc_value3: "Cesarean delivery only", comment1: "Procedure not valid for provider specialty", comment2: "-By Richy Walton 06-12-2013 10:23:12 AM"},
        {"claim_no": "0035648", p_name: "Tina Smith", gender: "F", age: "23", admit_date: "09-24-2013", discharge_date: "09-25-2013", claim_type: "Outpatient", p_insurer: "Cinda", l_stay: "4", ref_provider: "748167", red_provider: "718045", diag_code1: "65523", diag_value1: "FAMIL HERED DIS-ANTEPART", diag_code2: "64881", diag_value2: "ABN GLUCOSE TOLER-DELIV", diag_code3: "64901", diag_value3: "TOBACCO USE DISOR-DELLIV", proc_code1: "76817", proc_value1: "Transvaginal us obstetric", proc_code2: "99211", proc_value2: "Office/outpatient visit est", proc_code3: "59514", proc_value3: "Cesarean delivery only", comment1: "Procedure not valid for provider specialty", comment2: "-By Richy Walton 06-12-2013 10:23:12 AM"},
        {"claim_no": "6787900", p_name: "Tim Ray", gender: "F", age: "39", admit_date: "09-24-2013", discharge_date: "09-25-2013", claim_type: "Outpatient", p_insurer: "Cinda", l_stay: "5", ref_provider: "748167", red_provider: "718045", diag_code1: "65523", diag_value1: "FAMIL HERED DIS-ANTEPART", diag_code2: "64881", diag_value2: "ABN GLUCOSE TOLER-DELIV", diag_code3: "64901", diag_value3: "TOBACCO USE DISOR-DELLIV", proc_code1: "76817", proc_value1: "Transvaginal us obstetric", proc_code2: "99211", proc_value2: "Office/outpatient visit est", proc_code3: "59514", proc_value3: "Cesarean delivery only", comment1: "Procedure not valid for provider specialty", comment2: "-By Richy Walton 06-12-2013 10:23:12 AM"},
        {"claim_no": "2345623", p_name: "Hillary Smith", gender: "F", age: "54", admit_date: "09-24-2013", discharge_date: "09-25-2013", claim_type: "Outpatient", p_insurer: "Cinda", l_stay: "1", ref_provider: "748167", red_provider: "718045", diag_code1: "65523", diag_value1: "FAMIL HERED DIS-ANTEPART", diag_code2: "64881", diag_value2: "ABN GLUCOSE TOLER-DELIV", diag_code3: "64901", diag_value3: "TOBACCO USE DISOR-DELLIV", proc_code1: "76817", proc_value1: "Transvaginal us obstetric", proc_code2: "99211", proc_value2: "Office/outpatient visit est", proc_code3: "59514", proc_value3: "Cesarean delivery only", comment1: "Procedure not valid for provider specialty", comment2: "-By Richy Walton 06-12-2013 10:23:12 AM"},
        {"claim_no": "9876782", p_name: "Cathy Sam", gender: "F", age: "39", admit_date: "09-24-2013", discharge_date: "09-25-2013", claim_type: "Outpatient", p_insurer: "Cinda", l_stay: "2", ref_provider: "748167", red_provider: "718045", diag_code1: "65523", diag_value1: "FAMIL HERED DIS-ANTEPART", diag_code2: "64881", diag_value2: "ABN GLUCOSE TOLER-DELIV", diag_code3: "64901", diag_value3: "TOBACCO USE DISOR-DELLIV", proc_code1: "76817", proc_value1: "Transvaginal us obstetric", proc_code2: "99211", proc_value2: "Office/outpatient visit est", proc_code3: "59514", proc_value3: "Cesarean delivery only", comment1: "Procedure not valid for provider specialty", comment2: "-By Richy Walton 06-12-2013 10:23:12 AM"},
        {"claim_no": "2324543", p_name: "Monica Lee", gender: "F", age: "39", admit_date: "09-24-2013", discharge_date: "09-25-2013", claim_type: "Outpatient", p_insurer: "Cinda", l_stay: "2", ref_provider: "748167", red_provider: "718045", diag_code1: "65523", diag_value1: "FAMIL HERED DIS-ANTEPART", diag_code2: "64881", diag_value2: "ABN GLUCOSE TOLER-DELIV", diag_code3: "64901", diag_value3: "TOBACCO USE DISOR-DELLIV", proc_code1: "76817", proc_value1: "Transvaginal us obstetric", proc_code2: "99211", proc_value2: "Office/outpatient visit est", proc_code3: "59514", proc_value3: "Cesarean delivery only", comment1: "Procedure not valid for provider specialty", comment2: "-By Richy Walton 06-12-2013 10:23:12 AM"},
        {"claim_no": "2434323", p_name: "Martina Pipkin", gender: "F", age: "39", admit_date: "09-24-2013", discharge_date: "09-25-2013", claim_type: "Outpatient", p_insurer: "Cinda", l_stay: "2", ref_provider: "748167", red_provider: "718045", diag_code1: "65523", diag_value1: "FAMIL HERED DIS-ANTEPART", diag_code2: "64881", diag_value2: "ABN GLUCOSE TOLER-DELIV", diag_code3: "64901", diag_value3: "TOBACCO USE DISOR-DELLIV", proc_code1: "76817", proc_value1: "Transvaginal us obstetric", proc_code2: "99211", proc_value2: "Office/outpatient visit est", proc_code3: "59514", proc_value3: "Cesarean delivery only", comment1: "Procedure not valid for provider specialty", comment2: "-By Richy Walton 06-12-2013 10:23:12 AM"},
        {"claim_no": "2343343", p_name: "Christina May", gender: "F", age: "39", admit_date: "09-24-2013", discharge_date: "09-25-2013", claim_type: "Outpatient", p_insurer: "Cinda", l_stay: "2", ref_provider: "748167", red_provider: "718045", diag_code1: "65523", diag_value1: "FAMIL HERED DIS-ANTEPART", diag_code2: "64881", diag_value2: "ABN GLUCOSE TOLER-DELIV", diag_code3: "64901", diag_value3: "TOBACCO USE DISOR-DELLIV", proc_code1: "76817", proc_value1: "Transvaginal us obstetric", proc_code2: "99211", proc_value2: "Office/outpatient visit est", proc_code3: "59514", proc_value3: "Cesarean delivery only", comment1: "Procedure not valid for provider specialty", comment2: "-By Richy Walton 06-12-2013 10:23:12 AM"},
        {"claim_no": "2356876", p_name: "Christina May", gender: "F", age: "39", admit_date: "09-24-2013", discharge_date: "09-25-2013", claim_type: "Outpatient", p_insurer: "Cinda", l_stay: "2", ref_provider: "748167", red_provider: "718045", diag_code1: "65523", diag_value1: "FAMIL HERED DIS-ANTEPART", diag_code2: "64881", diag_value2: "ABN GLUCOSE TOLER-DELIV", diag_code3: "64901", diag_value3: "TOBACCO USE DISOR-DELLIV", proc_code1: "76817", proc_value1: "Transvaginal us obstetric", proc_code2: "99211", proc_value2: "Office/outpatient visit est", proc_code3: "59514", proc_value3: "Cesarean delivery only", comment1: "Procedure not valid for provider specialty", comment2: "-By Richy Walton 06-12-2013 10:23:12 AM"},
    ],
    networkFormDataArray: [{"claim_no": "1290764", "reason_code": "Network Fraud", "claim_date": "10-02-2013", "review_outcome": "Released", "referring_provider": "John Black", "paid_amount": "$3,665", "comments": ""},
        {"claim_no": "2903262", "reason_code": "Network Fraud", "claim_date": "10-03-2013", "review_outcome": "Released", "referring_provider": "John Black", "paid_amount": "$2,084", "comments": ""},
        {"claim_no": "0992367", "reason_code": "Network Fraud", "claim_date": "10-04-2013", "review_outcome": "Released", "referring_provider": "John Black", "paid_amount": "$4,090", "comments": ""},
        {"claim_no": "3278901", "reason_code": "Network Fraud", "claim_date": "10-05-2013", "review_outcome": "Released", "referring_provider": "John Black", "paid_amount": "$3,822", "comments": ""},
        {"claim_no": "0192874", "reason_code": "Network Fraud", "claim_date": "10-06-2013", "review_outcome": "Released", "referring_provider": "John Black", "paid_amount": "$1,022", "comments": ""},
        {"claim_no": "4902711", "reason_code": "Network Fraud", "claim_date": "10-07-2013", "review_outcome": "Released", "referring_provider": "John Black", "paid_amount": "$2,030", "comments": ""},
        {"claim_no": "0908236", "reason_code": "Network Fraud", "claim_date": "10-08-2013", "review_outcome": "Released", "referring_provider": "John Black", "paid_amount": "$5,411", "comments": ""},
        {"claim_no": "9146789", "reason_code": "Network Fraud", "claim_date": "10-08-2013", "review_outcome": "Released", "referring_provider": "John Black", "paid_amount": "$2,246", "comments": ""},
        {"claim_no": "0208652", "reason_code": "Network Fraud", "claim_date": "10-08-2013", "review_outcome": "Released", "referring_provider": "John Black", "paid_amount": "$1,008", "comments": ""},
        {"claim_no": "2789365", "reason_code": "Network Fraud", "claim_date": "10-08-2013", "review_outcome": "Released", "referring_provider": "John Black", "paid_amount": "$4,022", "comments": ""},
    ],
    networkFormClaimDetailsDataArray: [{"claim_no": "1290764", p_name: "Clara Smith", gender: "F", age: "39", admit_date: "09-24-2013", discharge_date: "09-25-2013", claim_type: "Outpatient", p_insurer: "Cinda", l_stay: "1", ref_provider: "748167", red_provider: "718045", diag_code1: "65523", diag_value1: "FAMIL HERED DIS-ANTEPART", diag_code2: "64881", diag_value2: "ABN GLUCOSE TOLER-DELIV", diag_code3: "64901", diag_value3: "TOBACCO USE DISOR-DELLIV", proc_code1: "76817", proc_value1: "Transvaginal us obstetric", proc_code2: "99211", proc_value2: "Office/outpatient visit est", proc_code3: "59514", proc_value3: "Cesarean delivery only", comment1: "High volume of patient forwarding", comment2: "-By Richy Walton 06-12-2013 10:23:12 AM"},
        {"claim_no": "2903262", p_name: "Tina Ray", gender: "F", age: "39", admit_date: "09-24-2013", discharge_date: "09-25-2013", claim_type: "Outpatient", p_insurer: "Cinda", l_stay: "3", ref_provider: "748167", red_provider: "718045", diag_code1: "65523", diag_value1: "FAMIL HERED DIS-ANTEPART", diag_code2: "64881", diag_value2: "ABN GLUCOSE TOLER-DELIV", diag_code3: "64901", diag_value3: "TOBACCO USE DISOR-DELLIV", proc_code1: "76817", proc_value1: "Transvaginal us obstetric", proc_code2: "99211", proc_value2: "Office/outpatient visit est", proc_code3: "59514", proc_value3: "Cesarean delivery only", comment1: "High volume of patient forwarding", comment2: "-By Richy Walton 06-12-2013 10:23:12 AM"},
        {"claim_no": "0992367", p_name: "Julian Hale", gender: "F", age: "43", admit_date: "09-24-2013", discharge_date: "09-25-2013", claim_type: "Outpatient", p_insurer: "Cinda", l_stay: "2", ref_provider: "748167", red_provider: "718045", diag_code1: "65523", diag_value1: "FAMIL HERED DIS-ANTEPART", diag_code2: "64881", diag_value2: "ABN GLUCOSE TOLER-DELIV", diag_code3: "64901", diag_value3: "TOBACCO USE DISOR-DELLIV", proc_code1: "76817", proc_value1: "Transvaginal us obstetric", proc_code2: "99211", proc_value2: "Office/outpatient visit est", proc_code3: "59514", proc_value3: "Cesarean delivery only", comment1: "High volume of patient forwarding", comment2: "-By Richy Walton 06-12-2013 10:23:12 AM"},
        {"claim_no": "3278901", p_name: "Tina Smith", gender: "F", age: "23", admit_date: "09-24-2013", discharge_date: "09-25-2013", claim_type: "Outpatient", p_insurer: "Cinda", l_stay: "4", ref_provider: "748167", red_provider: "718045", diag_code1: "65523", diag_value1: "FAMIL HERED DIS-ANTEPART", diag_code2: "64881", diag_value2: "ABN GLUCOSE TOLER-DELIV", diag_code3: "64901", diag_value3: "TOBACCO USE DISOR-DELLIV", proc_code1: "76817", proc_value1: "Transvaginal us obstetric", proc_code2: "99211", proc_value2: "Office/outpatient visit est", proc_code3: "59514", proc_value3: "Cesarean delivery only", comment1: "High volume of patient forwarding", comment2: "-By Richy Walton 06-12-2013 10:23:12 AM"},
        {"claim_no": "0192874", p_name: "Tim Ray", gender: "F", age: "39", admit_date: "09-24-2013", discharge_date: "09-25-2013", claim_type: "Outpatient", p_insurer: "Cinda", l_stay: "5", ref_provider: "748167", red_provider: "718045", diag_code1: "65523", diag_value1: "FAMIL HERED DIS-ANTEPART", diag_code2: "64881", diag_value2: "ABN GLUCOSE TOLER-DELIV", diag_code3: "64901", diag_value3: "TOBACCO USE DISOR-DELLIV", proc_code1: "76817", proc_value1: "Transvaginal us obstetric", proc_code2: "99211", proc_value2: "Office/outpatient visit est", proc_code3: "59514", proc_value3: "Cesarean delivery only", comment1: "High volume of patient forwarding", comment2: "-By Richy Walton 06-12-2013 10:23:12 AM"},
        {"claim_no": "4902711", p_name: "Hillary Smith", gender: "F", age: "54", admit_date: "09-24-2013", discharge_date: "09-25-2013", claim_type: "Outpatient", p_insurer: "Cinda", l_stay: "1", ref_provider: "748167", red_provider: "718045", diag_code1: "65523", diag_value1: "FAMIL HERED DIS-ANTEPART", diag_code2: "64881", diag_value2: "ABN GLUCOSE TOLER-DELIV", diag_code3: "64901", diag_value3: "TOBACCO USE DISOR-DELLIV", proc_code1: "76817", proc_value1: "Transvaginal us obstetric", proc_code2: "99211", proc_value2: "Office/outpatient visit est", proc_code3: "59514", proc_value3: "Cesarean delivery only", comment1: "High volume of patient forwarding", comment2: "-By Richy Walton 06-12-2013 10:23:12 AM"},
        {"claim_no": "0908236", p_name: "Cathy Sam", gender: "F", age: "39", admit_date: "09-24-2013", discharge_date: "09-25-2013", claim_type: "Outpatient", p_insurer: "Cinda", l_stay: "2", ref_provider: "748167", red_provider: "718045", diag_code1: "65523", diag_value1: "FAMIL HERED DIS-ANTEPART", diag_code2: "64881", diag_value2: "ABN GLUCOSE TOLER-DELIV", diag_code3: "64901", diag_value3: "TOBACCO USE DISOR-DELLIV", proc_code1: "76817", proc_value1: "Transvaginal us obstetric", proc_code2: "99211", proc_value2: "Office/outpatient visit est", proc_code3: "59514", proc_value3: "Cesarean delivery only", comment1: "High volume of patient forwarding", comment2: "-By Richy Walton 06-12-2013 10:23:12 AM"},
        {"claim_no": "9146789", p_name: "Monica Lee", gender: "F", age: "39", admit_date: "09-24-2013", discharge_date: "09-25-2013", claim_type: "Outpatient", p_insurer: "Cinda", l_stay: "2", ref_provider: "748167", red_provider: "718045", diag_code1: "65523", diag_value1: "FAMIL HERED DIS-ANTEPART", diag_code2: "64881", diag_value2: "ABN GLUCOSE TOLER-DELIV", diag_code3: "64901", diag_value3: "TOBACCO USE DISOR-DELLIV", proc_code1: "76817", proc_value1: "Transvaginal us obstetric", proc_code2: "99211", proc_value2: "Office/outpatient visit est", proc_code3: "59514", proc_value3: "Cesarean delivery only", comment1: "High volume of patient forwarding", comment2: "-By Richy Walton 06-12-2013 10:23:12 AM"},
        {"claim_no": "0208652", p_name: "Martina Pipkin", gender: "F", age: "39", admit_date: "09-24-2013", discharge_date: "09-25-2013", claim_type: "Outpatient", p_insurer: "Cinda", l_stay: "2", ref_provider: "748167", red_provider: "718045", diag_code1: "65523", diag_value1: "FAMIL HERED DIS-ANTEPART", diag_code2: "64881", diag_value2: "ABN GLUCOSE TOLER-DELIV", diag_code3: "64901", diag_value3: "TOBACCO USE DISOR-DELLIV", proc_code1: "76817", proc_value1: "Transvaginal us obstetric", proc_code2: "99211", proc_value2: "Office/outpatient visit est", proc_code3: "59514", proc_value3: "Cesarean delivery only", comment1: "High volume of patient forwarding", comment2: "-By Richy Walton 06-12-2013 10:23:12 AM"},
        {"claim_no": "2789365", p_name: "Christina May", gender: "F", age: "39", admit_date: "09-24-2013", discharge_date: "09-25-2013", claim_type: "Outpatient", p_insurer: "Cinda", l_stay: "2", ref_provider: "748167", red_provider: "718045", diag_code1: "65523", diag_value1: "FAMIL HERED DIS-ANTEPART", diag_code2: "64881", diag_value2: "ABN GLUCOSE TOLER-DELIV", diag_code3: "64901", diag_value3: "TOBACCO USE DISOR-DELLIV", proc_code1: "76817", proc_value1: "Transvaginal us obstetric", proc_code2: "99211", proc_value2: "Office/outpatient visit est", proc_code3: "59514", proc_value3: "Cesarean delivery only", comment1: "High volume of patient forwarding", comment2: "-By Richy Walton 06-12-2013 10:23:12 AM"},
    ],
    providerFormClaimDescArray: [{"service_date": "09-24-2013", "cpt_hcpcs_code": "<b>76817</b>", "description": "Transvaginal us obstetric", "quantity": "1", "claim_amount": "$610", "paid_amount": "$590"},
        {"service_date": "09-25-2013", "cpt_hcpcs_code": "<b>99211</b>", "description": "Office/outpatient visit est", "quantity": "1", "claim_amount": "$210", "paid_amount": "$180"},
        {"service_date": "09-26-2013", "cpt_hcpcs_code": "<b>59514</b>", "description": "Cesarean delivery only", "quantity": "1", "claim_amount": "$710", "paid_amount": "$682"},
        {"service_date": "09-27-2013", "cpt_hcpcs_code": "<b>76817</b>", "description": "Transvaginal us obstetric", "quantity": "1", "claim_amount": "$609", "paid_amount": "$580"},
        {"service_date": "10-28-2013", "cpt_hcpcs_code": "<b>76817</b>", "description": "Transvaginal us obstetric", "quantity": "1", "claim_amount": "$614", "paid_amount": "$590"},
        {"service_date": "11-28-2013", "cpt_hcpcs_code": "<b>99211</b>", "description": "Office/outpatient visit est", "quantity": "1", "claim_amount": "$220", "paid_amount": "$204"},
        {"service_date": "12-27-2013", "cpt_hcpcs_code": "<b>76817</b>", "description": "Transvaginal us obstetric", "quantity": "1", "claim_amount": "$621", "paid_amount": "$602"},
        {"service_date": "12-28-2013", "cpt_hcpcs_code": "<b>99211</b>", "description": "Office/outpatient visit est", "quantity": "1", "claim_amount": "$216", "paid_amount": "$194"},
    ],
    networkFormClaimDescArray: [{"service_date": "09-24-2013", "cpt_hcpcs_code": "<b>76817</b>", "description": "Transvaginal us obstetric", "quantity": "1", "claim_amount": "$610", "paid_amount": "$590"},
        {"service_date": "09-25-2013", "cpt_hcpcs_code": "<b>99211</b>", "description": "Office/outpatient visit est", "quantity": "1", "claim_amount": "$226", "paid_amount": "$214"},
        {"service_date": "09-26-2013", "cpt_hcpcs_code": "<b>59514</b>", "description": "Cesarean delivery only", "quantity": "1", "claim_amount": "$710", "paid_amount": "$682"},
        {"service_date": "09-27-2013", "cpt_hcpcs_code": "<b>76817</b>", "description": "Transvaginal us obstetric", "quantity": "1", "claim_amount": "$609", "paid_amount": "$580"},
        {"service_date": "10-28-2013", "cpt_hcpcs_code": "<b>76817</b>", "description": "Transvaginal us obstetric", "quantity": "1", "claim_amount": "$616", "paid_amount": "$602"},
        {"service_date": "11-28-2013", "cpt_hcpcs_code": "<b>99211</b>", "description": "Office/outpatient visit est", "quantity": "1", "claim_amount": "$231", "paid_amount": "$202"},
        {"service_date": "12-27-2013", "cpt_hcpcs_code": "<b>76817</b>", "description": "Transvaginal us obstetric", "quantity": "1", "claim_amount": "$620", "paid_amount": "$601"},
        {"service_date": "12-28-2013", "cpt_hcpcs_code": "<b>99211</b>", "description": "Office/outpatient visit est", "quantity": "1", "claim_amount": "$206", "paid_amount": "$194"},
    ],
    providerRiskTableCase: [{"caseId": "1029484", "reasonCode": "Overcharging", "decisionStatus": "Not FWA", "notes": "--", "investigator": "Jammie Lou", "lastActivity": "12-08-2013 04:28:33 PM"},
        {"caseId": "2039472", "reasonCode": "Unbundling", "decisionStatus": "Waste and Abuse,partial Recovery", "notes": "A873 and A887 both over ordered", "investigator": "Susan Carman", "lastActivity": "10-23-2013 11:12:55 PM"}
    ],
    providerRiskTableReason: [{"caseId": "1029484", "reasonCode": "Overcharging", "reasonDismissal": "Not FWA", "notes": "--", "investigator": "Jammie Lou", "lastActivity": "12-08-2013 04:28:33 PM"},
        {"caseId": "2039472", "reasonCode": "Unbundling", "reasonDismissal": "Waste and Abuse,partial Recovery", "notes": "A873 and A887 both over ordered", "investigator": "Susan Carman", "lastActivity": "10-23-2013 11:12:55 PM"},
        // {"caseId": "2039473", "reasonCode": "Anomalous Charges", "reasonDismissal": "Provider No longer active", "notes": "A873 and A887 both over ordered", "investigator": "Susan Carman", "lastActivity": "10-23-2013 11:12:55 PM"}
    ],
    networkDataArray: [{"provider": "76567667", "memberId": "29307171", "risk_ID": "1011", "source": "System", "provider_Name": "Susan White<br>John Black", "relation": "Provider-Provider", "provider_Specialty": "Internal Medicine General Surgery", "associated_entities": "2", "total_claims": "10", "services": "Internal Medicine General Surgery", "unique_Patients": "9", "amount": "$29,400", "risk_score": 96, "provider_text": "", "Specialty": "Internal Medicine General Surgery", "provider_group": "Northwest", "risk_reason": "Unbundling, Network"},
        {"provider": "86637643", "memberId": "27815901", "risk_ID": "1013", "source": "Hotline", "provider_Name": "Tim White<br>Richard Green", "relation": "Provider-Provider", "provider_Specialty": "Oncology Cardiology", "associated_entities": "2", "total_claims": "15", "services": "Oncology Cardiology", "unique_Patients": "12", "amount": "$13,015", "risk_score": 93, "provider_text": "", "Specialty": "Oncology Cardiology", "provider_group": "South Region", "risk_reason": "Overcharging, Unbundling ,Network"},
        {"provider": "93367632", "memberId": "56781231", "risk_ID": "1012", "source": "System", "provider_Name": "Mark Lekar<br>Dane Adkison", "relation": "Provider-Provider", "provider_Specialty": "Cardiology Dental Clinic", "associated_entities": "3", "total_claims": "16", "services": "Cardiology Dental Clinic", "unique_Patients": "16", "amount": "$10,008", "risk_score": 91, "provider_text": "", "Specialty": "Cardiology Dental Clinic", "provider_group": "Spring Field", "risk_reason": "Network"},
        {"provider": "27815901", "memberId": "86637643", "risk_ID": "1016", "source": "Other Users", "provider_Name": "Richard Green<br>Tim White", "relation": "Provider-Provider", "provider_Specialty": "General Surgery Endocrinology", "associated_entities": "3", "total_claims": "19", "services": "General Surgery Endocrinology", "unique_Patients": "18", "amount": "$9,290", "risk_score": 89, "provider_text": "", "Specialty": "General Surgery Endocrinology", "provider_group": "Newport", "risk_reason": "Overcharging, Network"},
        {"provider": "29307171", "memberId": "93367632", "risk_ID": "1014", "source": "Hotline", "provider_Name": "John Black<br>Mark Lekar", "relation": "Provider-Member", "provider_Specialty": "Internal Medicine", "associated_entities": "8", "total_claims": "22", "services": "Internal Medicine", "unique_Patients": "20", "amount": "$9,247", "risk_score": 83, "provider_text": "", "Specialty": "Internal Medicine", "provider_group": "Mountain Hill", "risk_reason": "Overcharging, Network"}

    ],
    memberDataArrayViewArray: [{"providerName": "John Black", "memberId": "29307171", "services": "Practitioner", "address": "577 S Main Street, Providence, New York", "total_Claim": "10", "unique_patient": "9", "provider_specialty": "General Surgery", "risk_reason1": "Network Fraud:Provider-Member", "amount": "$1,479", "risk_reason2": " High volume of patient forwarding ", "risk_score": 93},
        {"providerName": "Richard Green", "memberId": "27815901", "services": "Practitioner", "address": "577 S Main Street, Providence, RI", "total_Claim": "11", "unique_patient": "9", "provider_specialty": "Cardiology", "risk_reason1": "Network Fraud:Provider-Member", "amount": "$1,279", "risk_reason2": "High volume of patient forwarding ", "risk_score": 89},
        {"providerName": "Dane Adkison", "memberId": "56781231", "services": "Practitioner", "address": "577 S Main Street, Providence, RI", "total_Claim": "11", "unique_patient": "9", "provider_specialty": "Dental Clinic", "risk_reason1": "Network Fraud:Provider-Member", "amount": "$869", "risk_reason2": "High volume of patient forwarding ", "risk_score": 87},
        {"providerName": "Howard White", "memberId": "65278001", "services": "Practitioner", "address": "577 S Main Street, Providence, RI", "total_Claim": "11", "unique_patient": "9", "provider_specialty": "Endocrinology", "risk_reason1": "Network Fraud:Provider-Member", "amount": "$453", "risk_reason2": "High volume of patient forwarding ", "risk_score": 85},
        {"providerName": "Randal Ray", "memberId": "65278011", "services": "Practitioner", "address": "577 S Main Street, Providence, RI", "total_Claim": "11", "unique_patient": "9", "provider_specialty": "Psychiatry, Certified Social worker, Clinical Psychology", "risk_reason1": "Network Fraud:Provider-Member", "amount": "$179", "risk_reason2": " High volume of patient forwarding ", "risk_score": 82},
        {"providerName": "Tim White", "memberId": "86637643", "services": "Practitioner", "address": "577 S Main Street, Providence, RI", "total_Claim": "11", "unique_patient": "9", "provider_specialty": "Psychiatry, Certified Social worker, Clinical Psychology", "risk_reason1": "Network Fraud:Provider-Member", "amount": "$179", "risk_reason2": " High volume of patient forwarding ", "risk_score": 82},
        {"providerName": "Mark Lekar", "memberId": "93367632", "services": "Practitioner", "address": "577 S Main Street, Providence, RI", "total_Claim": "11", "unique_patient": "9", "provider_specialty": "Psychiatry, Certified Social worker, Clinical Psychology", "risk_reason1": "Network Fraud:Provider-Member", "amount": "$179", "risk_reason2": " High volume of patient forwarding ", "risk_score": 82}

    ],
    memberDataArray: [{"provider": "29307171", "risk_ID": "1011", "source": "System", "provider_Name": "John Black", "risk_reason": "Specialty - Procedure Mismatch", "provider_Specialty": "General Surgery", "associated_entities": "2", "total_claims": "4", "services": "Psychiatry General Surgey Priv Dent", "unique_Patients": "3", "amount": "$1,479", "risk_score": 93, "Specialty": "General Surgery", "provider_group": "Northwest", "risk_reason": "Unbundling, Network"},
        {"provider": "27815901", "risk_ID": "1013", "source": "Hotline", "provider_Name": "Richard Green", "risk_reason": "Overcharging", "provider_Specialty": "Cardiology", "associated_entities": "5", "total_claims": "4", "services": "Psychiatry General Surgey Priv Dent", "unique_Patients": "3", "amount": "$1,279", "risk_score": 89, "Specialty": "Endocrinology,Cardiology", "provider_group": "Mountain Hill", "risk_reason": "Unbundling, Network, Duplicate Claims"},
        {"provider": "56781231", "risk_ID": "1012", "source": "System", "provider_Name": "Dane Adkison", "risk_reason": "Unbundling", "provider_Specialty": "Dental Clinic", "associated_entities": "17", "total_claims": "4", "services": "Psychiatry General Surgey Priv Dent", "unique_Patients": "3", "amount": "$869", "risk_score": 87, "Specialty": "Cardiology", "provider_group": "Newport", "risk_reason": "Unbundling, Overcharging"},
        {"provider": "65278001", "risk_ID": "1016", "source": "Other Users", "provider_Name": "Howard White", "risk_reason": "Overcharging", "provider_Specialty": "Endocrinology", "associated_entities": "2", "total_claims": "4", "services": "Cardiology Laboratory", "unique_Patients": "3", "amount": "$453", "risk_score": 85, "Specialty": "Psychiatry,Endocrinology,Cardiology", "provider_group": "South Region", "risk_reason": "Unbundling, Network, Overcharging"},
        {"provider": "65278011", "risk_ID": "1014", "source": "Hotline", "provider_Name": "Randal Ray", "risk_reason": "High Duration", "provider_Specialty": "Psychiatry", "associated_entities": "13", "total_claims": "4", "services": "General Surgey Endocrinology", "unique_Patients": "3", "amount": "$179", "risk_score": 82, "Specialty": "Psychiatry,Cardiology", "provider_group": "Spring Field", "risk_reason": "Unbundling, Network, Duplicate Claims"}

    ],
    caseActiveDataArray: [{"caseId": "93847521", "risk_ID": "1011", "source": "System", "provider_Name": "John Smith", "risk_reason": "Specialty - Procedure Mismatch", "provider_Specialty": "Psychiatry", "total_claims": "11", "unique_Patients": "3", "amount": "$20,120", "due_date": "02-02-2014", "caseType": "open", "provider_group": "Northwest"},
        {"caseId": "48527633", "risk_ID": "1013", "source": "Hotline", "provider_Name": "William Bell", "risk_reason": "Overcharging", "provider_Specialty": "Oncology", "total_claims": "14", "unique_Patients": "8", "amount": "$18,943", "due_date": "20-01-2014", "caseType": "open", "provider_group": "Spring Field"},
        {"caseId": "98235623", "risk_ID": "1013", "source": "Hotline", "provider_Name": "Larry Bucshon", "risk_reason": "Overcharging", "provider_Specialty": "Oncology", "total_claims": "14", "unique_Patients": "8", "amount": "$18,943", "due_date": "20-01-2014", "caseType": "open", "provider_group": "Spring Field"},
        {"caseId": "40926608", "risk_ID": "1012", "source": "System", "provider_Name": "Chuck Brown", "risk_reason": "Unbundling", "provider_Specialty": "General Medicine", "total_claims": "9", "unique_Patients": "6", "amount": "$15,234", "due_date": "05-01-2014", "caseType": "open", "provider_group": "Lake Shore"},
        {"caseId": "24329643", "risk_ID": "1016", "source": "Other Users", "provider_Name": "Britni Murrow", "risk_reason": "Overcharging", "provider_Specialty": "Cardiology", "total_claims": "12", "unique_Patients": "9", "amount": "$19,765", "due_date": "30-12-2013", "caseType": "Assigned", "provider_group": "South Region"},
        {"caseId": "79403874", "risk_ID": "1014", "source": "Hotline", "provider_Name": "Joe Heck", "risk_reason": "High Duration", "provider_Specialty": "Family Medicine", "total_claims": "16", "unique_Patients": "12", "amount": "$17,500", "due_date": "31-12-2013", "caseType": "Shared", "provider_group": "Northwest"},
        {"caseId": "53831859", "risk_ID": "1015", "source": "System", "provider_Name": "Susan White", "risk_reason": "Unbundling", "provider_Specialty": "Endocrinology", "total_claims": "11", "unique_Patients": "8", "amount": "$11,636", "due_date": "01-06-2014", "caseType": "Shared", "provider_group": "Newport"}

    ],
    caseSearchDataArray: [{"caseId": "93847521", "risk_ID": "1011", "source": "System", "provider_Name": "John Smith", "risk_reason": "Specialty - Procedure Mismatch", "provider_Specialty": "General Medicine", "total_claims": "4", "unique_Patients": "3", "amount": "$1,479", "status": "Not FWA", "due_date": "02-02-2014", "caseType": "open", "provider_group": "Northwest"},
        {"caseId": "48527633", "risk_ID": "1013", "source": "Hotline", "provider_Name": "William Bell", "risk_reason": "Overcharging", "provider_Specialty": "Psychiatry", "total_claims": "4", "unique_Patients": "3", "amount": "$1,479", "status": "Waste and Abuse", "due_date": "20-01-2014", "caseType": "open", "provider_group": "Spring Field"},
        {"caseId": "98235623", "risk_ID": "1013", "source": "Hotline", "provider_Name": "Larry Bucshon", "risk_reason": "Overcharging", "provider_Specialty": "Psychiatry", "total_claims": "4", "unique_Patients": "3", "amount": "$1,479", "status": "Waste and Abuse", "due_date": "20-01-2014", "caseType": "open", "provider_group": "Spring Field"},
        {"caseId": "40926608", "risk_ID": "1012", "source": "System", "provider_Name": "Chuck Brown", "risk_reason": "Unbundling", "provider_Specialty": "General Medicine", "total_claims": "4", "unique_Patients": "3", "amount": "$1,379", "status": "Partial Recovery", "due_date": "05-01-2014", "caseType": "open", "provider_group": "Lake Shore"},
        {"caseId": "24329643", "risk_ID": "1016", "source": "Other Users", "provider_Name": "Britni Murrow", "risk_reason": "Overcharging", "provider_Specialty": "Psychiatry", "total_claims": "4", "unique_Patients": "3", "amount": "$1,279", "status": "Provider Not Longer Active", "due_date": "30-12-2013", "caseType": "Assigned", "provider_group": "South Region"},
        {"caseId": "79403874", "risk_ID": "1014", "source": "Hotline", "provider_Name": "Joe Heck", "risk_reason": "High Duration", "provider_Specialty": "General Medicine", "total_claims": "4", "unique_Patients": "3", "amount": "$1,179", "status": "Not FWA", "due_date": "31-12-2013", "caseType": "Shared", "provider_group": "Northwest"},
        {"caseId": "53831859", "risk_ID": "1015", "source": "System", "provider_Name": "Susan White", "risk_reason": "Unbundling", "provider_Specialty": "General Medicine", "total_claims": "4", "unique_Patients": "3", "amount": "$1,079", "status": "Not FWA", "due_date": "01-06-2014", "caseType": "Shared", "provider_group": "Newport"}

    ],
    caseActiveDataDetailsViewArray: [{"caseId": "93847521", "providerName": "John Smith", "providerId": "938475521", "services": "Practitioner", "address": "350 5th Avenue, New York, NY 10118", "total_Claim": "11", "unique_patient": "9", "provider_specialty": "Psychiatry", "risk_reason1": "Specialty - Procedure Mismatch", "risk_reason2": "Claims contain procedure codes inconsistent with provider specialty", "risk_score": 97, "due_date": "20-10-2013", "case_type": "Provider"},
        {"caseId": "48527633", "providerName": "William Bell", "providerId": "48527633", "services": "Practitioner", "address": "577 S Main Street, Providence, RI, 02903", "total_Claim": "14", "unique_patient": "8", "provider_specialty": "Oncology, Certified Social worker, Clinical Psychology", "risk_reason1": "Specialty - Procedure Mismatch", "risk_reason2": "Claims contains codes inconsistent with provider specialty", "risk_score": 30, "due_date": "20-10-2013", "case_type": "Member"},
        {"caseId": "98235623", "providerName": "Larry Bucshon", "providerId": "938475521", "services": "Practitioner", "address": "577 S Main Street, Providence, RI, 02903", "total_Claim": "14", "unique_patient": "8", "provider_specialty": "Oncology, Certified Social worker, Clinical Psychology", "risk_reason1": "Specialty - Procedure Mismatch", "risk_reason2": "Claims contains codes inconsistent with provider specialty", "risk_score": 30, "due_date": "20-10-2013", "case_type": "Member"},
        {"caseId": "40926608", "providerName": "Chuck Brown", "providerId": "938475521", "services": "Practitioner", "address": "577 S Main Street, Providence, RI, 02903", "total_Claim": "9", "unique_patient": "6", "provider_specialty": "General Medicine", "risk_reason1": "Specialty - Procedure Mismatch", "risk_reason2": "Claims contains codes inconsistent with provider specialty", "risk_score": 70, "due_date": "20-10-2013", "case_type": "Provider"},
        {"caseId": "24329643", "providerName": "Britni Murrow", "providerId": "938475521", "services": "Practitioner", "address": "577 S Main Street, Providence, RI, 02903", "total_Claim": "12", "unique_patient": "9", "provider_specialty": "Cardiology, Certified Social worker", "risk_reason1": "Specialty - Procedure Mismatch", "risk_reason2": "Claims contains codes inconsistent with provider specialty", "risk_score": 60, "due_date": "20-10-2013", "case_type": "Network"},
        {"caseId": "79403874", "providerName": "Joe Heck", "providerId": "938475521", "services": "Practitioner", "address": "577 S Main Street, Providence, RI, 02903", "total_Claim": "16", "unique_patient": "12", "provider_specialty": "Family Medicine, Clinical Psychology", "risk_reason1": "Specialty - Procedure Mismatch", "risk_reason2": "Claims contains codes inconsistent with provider specialty", "risk_score": 80, "due_date": "20-10-2013", "case_type": "Member"},
        {"caseId": "53831859", "providerName": "Susan White", "providerId": "938475521", "services": "Practitioner", "address": "577 S Main Street, Providence, RI, 02903", "total_Claim": "11", "unique_patient": "8", "provider_specialty": "Endocrinology, Certified Social worker, Clinical Psychology", "risk_reason1": "Specialty - Procedure Mismatch", "risk_reason2": "Claims contains codes inconsistent with provider specialty", "risk_score": 30, "due_date": "20-10-2013", "case_type": "Provider"}

    ],
    caseSearchDataDetailsViewArray: [{"caseId": "93847521", "providerName": "John Smith", "providerId": "938475521", "services": "Practitioner", "address": "350 5th Avenue, New York, NY 10118", "total_Claim": "11", "unique_patient": "3", "provider_specialty": "Internal Medicine", "risk_reason1": "Specialty - Procedure Mismatch", "risk_reason2": "Claims contain procedure codes inconsistent with provider specialty", "risk_score": 97, "due_date": "20-10-2013", "case_type": "Provider"},
        {"caseId": "48527633", "providerName": "William Bell", "providerId": "48527633", "services": "Practitioner", "address": "577 S Main Street, Providence, RI, 02903", "total_Claim": "11", "unique_patient": "9", "provider_specialty": "Psychiatry, Certified Social worker, Clinical Psychology", "risk_reason1": "Specialty - Procedure Mismatch", "risk_reason2": "Claims contains codes inconsistent with provider specialty/", "risk_score": 30, "due_date": "20-10-2013", "case_type": "Member"},
        {"caseId": "98235623", "providerName": "Larry Bucshon", "providerId": "938475521", "services": "Practitioner", "address": "577 S Main Street, Providence, RI, 02903", "total_Claim": "11", "unique_patient": "9", "provider_specialty": "Psychiatry, Certified Social worker, Clinical Psychology", "risk_reason1": "Specialty - Procedure Mismatch", "risk_reason2": "Claims contains codes inconsistent with provider specialty/", "risk_score": 30, "due_date": "20-10-2013", "case_type": "Member"},
        {"caseId": "40926608", "providerName": "Chuck Brown", "providerId": "938475521", "services": "Practitioner", "address": "577 S Main Street, Providence, RI, 02903", "total_Claim": "11", "unique_patient": "9", "provider_specialty": "Psychiatry, Certified Social worker, Clinical Psychology", "risk_reason1": "Specialty - Procedure Mismatch", "risk_reason2": "Claims contains codes inconsistent with provider specialty/", "risk_score": 70, "due_date": "20-10-2013", "case_type": "Provider"},
        {"caseId": "24329643", "providerName": "Britni Murrow", "providerId": "938475521", "services": "Practitioner", "address": "577 S Main Street, Providence, RI, 02903", "total_Claim": "11", "unique_patient": "9", "provider_specialty": "Psychiatry, Certified Social worker, Clinical Psychology", "risk_reason1": "Specialty - Procedure Mismatch", "risk_reason2": "Claims contains codes inconsistent with provider specialty/", "risk_score": 60, "due_date": "20-10-2013", "case_type": "Network"},
        {"caseId": "79403874", "providerName": "Joe Heck", "providerId": "938475521", "services": "Practitioner", "address": "577 S Main Street, Providence, RI, 02903", "total_Claim": "11", "unique_patient": "9", "provider_specialty": "Psychiatry, Certified Social worker, Clinical Psychology", "risk_reason1": "Specialty - Procedure Mismatch", "risk_reason2": "Claims contains codes inconsistent with provider specialty/", "risk_score": 80, "due_date": "20-10-2013", "case_type": "Member"},
        {"caseId": "53831859", "providerName": "Susan White", "providerId": "938475521", "services": "Practitioner", "address": "577 S Main Street, Providence, RI, 02903", "total_Claim": "11", "unique_patient": "9", "provider_specialty": "Psychiatry, Certified Social worker, Clinical Psychology", "risk_reason1": "Specialty - Procedure Mismatch", "risk_reason2": "Claims contains codes inconsistent with provider specialty/", "risk_score": 30, "due_date": "20-10-2013", "case_type": "Provider"}

    ],
    providerPatientDetails: [
        {"providerId": "93847521", "Specialty": "Oncology", "amount": "$4324", geoCodeX: "40.7326491", geoCodeY: "-73.9816158", patientDetails: [{name: "John Hoe", age: "52", amount: "$20", geoCodeX: "40.759005", geoCodeY: "-74.018985", gender: "M", "visit_date": "01-04-2014", "distance": "6"}, {name: "John May", age: "42", amount: "$130", geoCodeX: "40.779005", geoCodeY: "-73.85985", gender: "M", "visit_date": "11-04-2014", "distance": "12"}, {name: "Tim May", age: "32", amount: "$80", geoCodeX: "40.679005", geoCodeY: "-73.758985", gender: "M", "visit_date": "15-04-2014", "distance": "14"}, {name: "Sean Roy", age: "52", amount: "$170", geoCodeX: "40.759005", geoCodeY: "-73.978985", gender: "M", "visit_date": "25-04-2014", "distance": "2"}, {name: "Tina Ray", age: "22", amount: "$220", geoCodeX: "40.779005", geoCodeY: "-74.038985", gender: "F", "visit_date": "02-04-2014", "distance": "6"}, {name: "Dayne Smith", age: "55", amount: "$300", geoCodeX: "40.779005", geoCodeY: "-73.878985", gender: "M", "visit_date": "08-04-2014", "distance": "9"}, {name: "Morris Jay", age: "52", amount: "$150", geoCodeX: "40.649005", geoCodeY: "-73.998985", gender: "M", "visit_date": "30-04-2014", "distance": "7"}, {name: "Christina Lee", age: "43", amount: "$120", geoCodeX: "40.779005", geoCodeY: "-73.878985", gender: "F", "visit_date": "27-04-2014", "distance": "9"}, {name: "John Black", age: "52", amount: "$220", geoCodeX: "40.679005", geoCodeY: "-74.018985", gender: "M", "visit_date": "30-04-2014", "distance": "6"}, {name: "Sean Black", age: "22", amount: "$140", geoCodeX: "40.719005", geoCodeY: "-74.178985", gender: "M", "visit_date": "15-04-2014", "distance": "12"}]},
        {"providerId": "48527633", "Specialty": "Cardiology", "amount": "$3424", geoCodeX: "40.7336491", geoCodeY: "-73.9816158", patientDetails: [{name: "John Hoe", age: "52", amount: "$20", geoCodeX: "40.759005", geoCodeY: "-74.018985", gender: "M", "visit_date": "01-04-2014", "distance": "6"}, {name: "John May", age: "42", amount: "$130", geoCodeX: "40.779005", geoCodeY: "-73.85985", gender: "M", "visit_date": "11-04-2014", "distance": "12"}, {name: "Tim May", age: "32", amount: "$80", geoCodeX: "40.679005", geoCodeY: "-73.758985", gender: "M", "visit_date": "15-04-2014", "distance": "14"}, {name: "Sean Roy", age: "52", amount: "$170", geoCodeX: "40.759005", geoCodeY: "-73.978985", gender: "M", "visit_date": "25-04-2014", "distance": "2"}, {name: "Tina Ray", age: "22", amount: "$220", geoCodeX: "40.779005", geoCodeY: "-74.038985", gender: "F", "visit_date": "02-04-2014", "distance": "6"}, {name: "Dayne Smith", age: "55", amount: "$300", geoCodeX: "40.779005", geoCodeY: "-73.878985", gender: "M", "visit_date": "08-04-2014", "distance": "9"}, {name: "Morris Jay", age: "52", amount: "$150", geoCodeX: "40.649005", geoCodeY: "-73.998985", gender: "M", "visit_date": "30-04-2014", "distance": "7"}, {name: "Christina Lee", age: "43", amount: "$120", geoCodeX: "40.779005", geoCodeY: "-73.878985", gender: "F", "visit_date": "27-04-2014", "distance": "9"}, {name: "John Black", age: "52", amount: "$220", geoCodeX: "40.679005", geoCodeY: "-74.018985", gender: "M", "visit_date": "30-04-2014", "distance": "6"}, {name: "Sean Black", age: "22", amount: "$140", geoCodeX: "40.719005", geoCodeY: "-74.178985", gender: "M", "visit_date": "15-04-2014", "distance": "12"}]},
        {"providerId": "98235623", "Specialty": "Cardiology", "amount": "$3424", geoCodeX: "40.7336491", geoCodeY: "-73.9816158", patientDetails: [{name: "John Hoe", age: "52", amount: "$20", geoCodeX: "40.759005", geoCodeY: "-74.018985", gender: "M", "visit_date": "01-04-2014", "distance": "6"}, {name: "John May", age: "42", amount: "$130", geoCodeX: "40.779005", geoCodeY: "-73.85985", gender: "M", "visit_date": "11-04-2014", "distance": "12"}, {name: "Tim May", age: "32", amount: "$80", geoCodeX: "40.679005", geoCodeY: "-73.758985", gender: "M", "visit_date": "15-04-2014", "distance": "14"}, {name: "Sean Roy", age: "52", amount: "$170", geoCodeX: "40.759005", geoCodeY: "-73.978985", gender: "M", "visit_date": "25-04-2014", "distance": "2"}, {name: "Tina Ray", age: "22", amount: "$220", geoCodeX: "40.779005", geoCodeY: "-74.038985", gender: "F", "visit_date": "02-04-2014", "distance": "6"}, {name: "Dayne Smith", age: "55", amount: "$300", geoCodeX: "40.779005", geoCodeY: "-73.878985", gender: "M", "visit_date": "08-04-2014", "distance": "9"}, {name: "Morris Jay", age: "52", amount: "$150", geoCodeX: "40.649005", geoCodeY: "-73.998985", gender: "M", "visit_date": "30-04-2014", "distance": "7"}, {name: "Christina Lee", age: "43", amount: "$120", geoCodeX: "40.779005", geoCodeY: "-73.878985", gender: "F", "visit_date": "27-04-2014", "distance": "9"}, {name: "John Black", age: "52", amount: "$220", geoCodeX: "40.679005", geoCodeY: "-74.018985", gender: "M", "visit_date": "30-04-2014", "distance": "6"}, {name: "Sean Black", age: "22", amount: "$140", geoCodeX: "40.719005", geoCodeY: "-74.178985", gender: "M", "visit_date": "15-04-2014", "distance": "12"}]},
        {"providerId": "40926608", "Specialty": "Oncology", "amount": "$2224", geoCodeX: "37.762878", geoCodeY: "-122.254121", patientDetails: [{name: "John Hoe", age: "52", amount: "$20", geoCodeX: "37.659005", geoCodeY: "-122.178985", gender: "M", "visit_date": "01-04-2014", "distance": "10"}, {name: "John May", age: "42", amount: "$130", geoCodeX: "37.779005", geoCodeY: "-122.178985", gender: "M", "visit_date": "01-04-2014", "distance": "5"}, {name: "Tim May", age: "32", amount: "$80", geoCodeX: "37.679005", geoCodeY: "-122.054121", gender: "M", "visit_date": "01-04-2014", "distance": "15"}, {name: "Sean Roy", age: "52", amount: "$170", geoCodeX: "37.562878", geoCodeY: "-122.134121", gender: "M", "visit_date": "01-04-2014", "distance": "23"}, {name: "Tina Ray", age: "22", amount: "$220", geoCodeX: "37.779005", geoCodeY: "-122.178985", gender: "F", "visit_date": "01-04-2014", "distance": "5"}, {name: "Dayne Smith", age: "55", amount: "$300", geoCodeX: "37.779005", geoCodeY: "-122.478985", gender: "M", "visit_date": "01-04-2014", "distance": "15"}, {name: "Morris Jay", age: "52", amount: "$150", geoCodeX: "37.549005", geoCodeY: "-122.178985", gender: "M", "visit_date": "01-04-2014", "distance": "34"}, {name: "Christina Lee", age: "43", amount: "$120", geoCodeX: "37.739005", geoCodeY: "-122.178985", gender: "F", "visit_date": "01-04-2014", "distance": "6"}, {name: "John Black", age: "52", amount: "$220", geoCodeX: "37.679005", geoCodeY: "-122.178985", gender: "M", "visit_date": "01-04-2014", "distance": "8"}, {name: "Sean Black", age: "22", amount: "$140", geoCodeX: "37.87905", geoCodeY: "-122.478985", gender: "M", "visit_date": "01-04-2014", "distance": "20"}]},
        {"providerId": "24329643", "Specialty": "General Surgery", "amount": "$1324", geoCodeX: "41.817282", geoCodeY: "-71.740637", patientDetails: [{name: "John Hoe", age: "52", amount: "$20", geoCodeX: "41.659005", geoCodeY: "-71.678985", gender: "M", "visit_date": "01-04-2014", "distance": "20"}, {name: "John May", age: "42", amount: "$130", geoCodeX: "41.779005", geoCodeY: "-71.878985", gender: "M", "visit_date": "01-04-2014", "distance": "10"}, {name: "Tim May", age: "32", amount: "$80", geoCodeX: "41.679005", geoCodeY: "-71.658985", gender: "M", "visit_date": "01-04-2014", "distance": "12"}, {name: "Sean Roy", age: "52", amount: "$170", geoCodeX: "41.729005", geoCodeY: "-71.878985", gender: "M", "visit_date": "01-04-2014", "distance": "12"}, {name: "Tina Ray", age: "22", amount: "$220", geoCodeX: "41.779005", geoCodeY: "-71.778985", gender: "F", "visit_date": "01-04-2014", "distance": "5"}, {name: "Dayne Smith", age: "55", amount: "$300", geoCodeX: "41.779005", geoCodeY: "-71.478985", gender: "M", "visit_date": "01-04-2014", "distance": "16"}, {name: "Morris Jay", age: "52", amount: "$150", geoCodeX: "41.549005", geoCodeY: "-71.778985", gender: "M", "visit_date": "01-04-2014", "distance": "26"}, {name: "Christina Lee", age: "43", amount: "$120", geoCodeX: "41.739005", geoCodeY: "-71.878985", gender: "F", "visit_date": "01-04-2014", "distance": "12"}, {name: "John Black", age: "52", amount: "$220", geoCodeX: "41.679005", geoCodeY: "-72.078985", gender: "M", "visit_date": "01-04-2014", "distance": "25"}, {name: "Sean Black", age: "22", amount: "$140", geoCodeX: "41.719005", geoCodeY: "-71.878985", gender: "M", "visit_date": "01-04-2014", "distance": "12"}]},
        {"providerId": "79403874", "Specialty": "Orthopaedics", "amount": "$5324", geoCodeX: "37.762878", geoCodeY: "-122.254121", patientDetails: [{name: "John Hoe", age: "52", amount: "$20", geoCodeX: "37.659005", geoCodeY: "-122.178985", gender: "M", "visit_date": "01-04-2014", "distance": "10"}, {name: "John May", age: "42", amount: "$130", geoCodeX: "37.779005", geoCodeY: "-122.178985", gender: "M", "visit_date": "01-04-2014", "distance": "5"}, {name: "Tim May", age: "32", amount: "$80", geoCodeX: "37.679005", geoCodeY: "-122.054121", gender: "M", "visit_date": "01-04-2014", "distance": "15"}, {name: "Sean Roy", age: "52", amount: "$170", geoCodeX: "37.562878", geoCodeY: "-122.134121", gender: "M", "visit_date": "01-04-2014", "distance": "23"}, {name: "Tina Ray", age: "22", amount: "$220", geoCodeX: "37.779005", geoCodeY: "-122.178985", gender: "F", "visit_date": "01-04-2014", "distance": "5"}, {name: "Dayne Smith", age: "55", amount: "$300", geoCodeX: "37.779005", geoCodeY: "-122.478985", gender: "M", "visit_date": "01-04-2014", "distance": "15"}, {name: "Morris Jay", age: "52", amount: "$150", geoCodeX: "37.549005", geoCodeY: "-122.178985", gender: "M", "visit_date": "01-04-2014", "distance": "34"}, {name: "Christina Lee", age: "43", amount: "$120", geoCodeX: "37.739005", geoCodeY: "-122.178985", gender: "F", "visit_date": "01-04-2014", "distance": "6"}, {name: "John Black", age: "52", amount: "$220", geoCodeX: "37.679005", geoCodeY: "-122.178985", gender: "M", "visit_date": "01-04-2014", "distance": "8"}, {name: "Sean Black", age: "22", amount: "$140", geoCodeX: "37.87905", geoCodeY: "-122.478985", gender: "M", "visit_date": "01-04-2014", "distance": "20"}]},
        {"providerId": "53831859", "Specialty": "Cardiology", "amount": "$6324", geoCodeX: "37.762878", geoCodeY: "-122.254121", patientDetails: [{name: "John Hoe", age: "52", amount: "$20", geoCodeX: "37.659005", geoCodeY: "-122.178985", gender: "M", "visit_date": "01-04-2014", "distance": "10"}, {name: "John May", age: "42", amount: "$130", geoCodeX: "37.779005", geoCodeY: "-122.178985", gender: "M", "visit_date": "01-04-2014", "distance": "5"}, {name: "Tim May", age: "32", amount: "$80", geoCodeX: "37.679005", geoCodeY: "-122.054121", gender: "M", "visit_date": "01-04-2014", "distance": "15"}, {name: "Sean Roy", age: "52", amount: "$170", geoCodeX: "37.562878", geoCodeY: "-122.134121", gender: "M", "visit_date": "01-04-2014", "distance": "23"}, {name: "Tina Ray", age: "22", amount: "$220", geoCodeX: "37.779005", geoCodeY: "-122.178985", gender: "F", "visit_date": "01-04-2014", "distance": "5"}, {name: "Dayne Smith", age: "55", amount: "$300", geoCodeX: "37.779005", geoCodeY: "-122.478985", gender: "M", "visit_date": "01-04-2014", "distance": "15"}, {name: "Morris Jay", age: "52", amount: "$150", geoCodeX: "37.549005", geoCodeY: "-122.178985", gender: "M", "visit_date": "01-04-2014", "distance": "34"}, {name: "Christina Lee", age: "43", amount: "$120", geoCodeX: "37.739005", geoCodeY: "-122.178985", gender: "F", "visit_date": "01-04-2014", "distance": "6"}, {name: "John Black", age: "52", amount: "$220", geoCodeX: "37.679005", geoCodeY: "-122.178985", gender: "M", "visit_date": "01-04-2014", "distance": "8"}, {name: "Sean Black", age: "22", amount: "$140", geoCodeX: "37.87905", geoCodeY: "-122.478985", gender: "M", "visit_date": "01-04-2014", "distance": "20"}]},
        {"providerId": "76567667", "Specialty": "Oncology", "amount": "$4324", geoCodeX: "40.7326491", geoCodeY: "-73.9816158", patientDetails: [{name: "John Hoe", age: "52", amount: "$20", geoCodeX: "40.759005", geoCodeY: "-74.018985", gender: "M", "visit_date": "01-04-2014", "distance": "6"}, {name: "John May", age: "42", amount: "$130", geoCodeX: "40.779005", geoCodeY: "-73.85985", gender: "M", "visit_date": "11-04-2014", "distance": "12"}, {name: "Tim May", age: "32", amount: "$80", geoCodeX: "40.679005", geoCodeY: "-73.758985", gender: "M", "visit_date": "15-04-2014", "distance": "14"}, {name: "Sean Roy", age: "52", amount: "$170", geoCodeX: "40.759005", geoCodeY: "-73.978985", gender: "M", "visit_date": "25-04-2014", "distance": "2"}, {name: "Tina Ray", age: "22", amount: "$220", geoCodeX: "40.779005", geoCodeY: "-74.038985", gender: "F", "visit_date": "02-04-2014", "distance": "6"}, {name: "Dayne Smith", age: "55", amount: "$300", geoCodeX: "40.779005", geoCodeY: "-73.878985", gender: "M", "visit_date": "08-04-2014", "distance": "9"}, {name: "Morris Jay", age: "52", amount: "$150", geoCodeX: "40.649005", geoCodeY: "-73.998985", gender: "M", "visit_date": "30-04-2014", "distance": "7"}, {name: "Christina Lee", age: "43", amount: "$120", geoCodeX: "40.779005", geoCodeY: "-73.878985", gender: "F", "visit_date": "27-04-2014", "distance": "9"}, {name: "John Black", age: "52", amount: "$220", geoCodeX: "40.679005", geoCodeY: "-74.018985", gender: "M", "visit_date": "30-04-2014", "distance": "6"}, {name: "Sean Black", age: "22", amount: "$140", geoCodeX: "40.719005", geoCodeY: "-74.178985", gender: "M", "visit_date": "15-04-2014", "distance": "12"}]},
        {"providerId": "86637643", "Specialty": "Cardiology", "amount": "$3424", geoCodeX: "40.5326491", geoCodeY: "-73.6816158", patientDetails: [{name: "John Hoe", age: "52", amount: "$20", geoCodeX: "41.459005", geoCodeY: "-74.178985", gender: "M", "visit_date": "01-04-2014", "distance": "6"}, {name: "John May", age: "42", amount: "$130", geoCodeX: "41.779005", geoCodeY: "-76.178985", gender: "M", "visit_date": "01-04-2014", "distance": "6"}, {name: "Tim May", age: "32", amount: "$80", geoCodeX: "41.679005", geoCodeY: "-76.658985", gender: "M", "visit_date": "01-04-2014", "distance": "2"}, {name: "Sean Roy", age: "52", amount: "$170", geoCodeX: "41.229005", geoCodeY: "-72.178985", gender: "M", "visit_date": "01-04-2014", "distance": "6"}, {name: "Tina Ray", age: "22", amount: "$220", geoCodeX: "41.779005", geoCodeY: "-73.178985", gender: "F", "visit_date": "01-04-2014", "distance": "9"}, {name: "Dayne Smith", age: "55", amount: "$300", geoCodeX: "41.779005", geoCodeY: "-74.478985", gender: "M", "visit_date": "01-04-2014", "distance": "6"}, {name: "Morris Jay", age: "52", amount: "$150", geoCodeX: "42.549005", geoCodeY: "-73.178985", gender: "M", "visit_date": "01-04-2014", "distance": "3"}, {name: "Christina Lee", age: "43", amount: "$120", geoCodeX: "40.739005", geoCodeY: "-74.178985", gender: "F", "visit_date": "01-04-2014", "distance": "8"}, {name: "John Black", age: "52", amount: "$220", geoCodeX: "41.679005", geoCodeY: "-72.178985", gender: "M", "visit_date": "01-04-2014", "distance": "6"}, {name: "Sean Black", age: "22", amount: "$140", geoCodeX: "42.119005", geoCodeY: "-73.878985", gender: "M", "visit_date": "01-04-2014", "distance": "3"}]},
        {"providerId": "93367632", "Specialty": "Oncology", "amount": "$2224", geoCodeX: "37.762878", geoCodeY: "-122.254121", patientDetails: [{name: "John Hoe", age: "52", amount: "$20", geoCodeX: "36.459005", geoCodeY: "-121.178985", gender: "M", "visit_date": "01-04-2014", "distance": "6"}, {name: "John May", age: "42", amount: "$130", geoCodeX: "36.779005", geoCodeY: "-121.178985", gender: "M", "visit_date": "01-04-2014", "distance": "6"}, {name: "Tim May", age: "32", amount: "$80", geoCodeX: "37.679005", geoCodeY: "-121.658985", gender: "M", "visit_date": "01-04-2014", "distance": "8"}, {name: "Sean Roy", age: "52", amount: "$170", geoCodeX: "38.229005", geoCodeY: "-121.178985", gender: "M", "visit_date": "01-04-2014", "distance": "6"}, {name: "Tina Ray", age: "22", amount: "$220", geoCodeX: "38.779005", geoCodeY: "-123.178985", gender: "F", "visit_date": "01-04-2014", "distance": "2"}, {name: "Dayne Smith", age: "55", amount: "$300", geoCodeX: "36.779005", geoCodeY: "-121.478985", gender: "M", "visit_date": "01-04-2014", "distance": "6"}, {name: "Morris Jay", age: "52", amount: "$150", geoCodeX: "37.549005", geoCodeY: "-121.178985", gender: "M", "visit_date": "01-04-2014", "distance": "9"}, {name: "Christina Lee", age: "43", amount: "$120", geoCodeX: "38.739005", geoCodeY: "-121.178985", gender: "F", "visit_date": "01-04-2014", "distance": "7"}, {name: "John Black", age: "52", amount: "$220", geoCodeX: "38.679005", geoCodeY: "-121.178985", gender: "M", "visit_date": "01-04-2014"}, {name: "Sean Black", age: "22", amount: "$140", geoCodeX: "38.119005", geoCodeY: "-122.878985", gender: "M", "visit_date": "01-04-2014"}]},
        {"providerId": "86567234", "Specialty": "General Surgery", "amount": "$1324", geoCodeX: "41.817282", geoCodeY: "-71.400637", patientDetails: [{name: "John Hoe", age: "52", amount: "$20", geoCodeX: "41.459005", geoCodeY: "-74.178985", gender: "M", "visit_date": "01-04-2014", "distance": "6"}, {name: "John May", age: "42", amount: "$130", geoCodeX: "41.779005", geoCodeY: "-76.178985", gender: "M", "visit_date": "01-04-2014", "distance": "6"}, {name: "Tim May", age: "32", amount: "$80", geoCodeX: "41.679005", geoCodeY: "-76.658985", gender: "M", "visit_date": "01-04-2014", "distance": "2"}, {name: "Sean Roy", age: "52", amount: "$170", geoCodeX: "41.229005", geoCodeY: "-72.178985", gender: "M", "visit_date": "01-04-2014", "distance": "6"}, {name: "Tina Ray", age: "22", amount: "$220", geoCodeX: "41.779005", geoCodeY: "-73.178985", gender: "F", "visit_date": "01-04-2014", "distance": "9"}, {name: "Dayne Smith", age: "55", amount: "$300", geoCodeX: "41.779005", geoCodeY: "-74.478985", gender: "M", "visit_date": "01-04-2014", "distance": "6"}, {name: "Morris Jay", age: "52", amount: "$150", geoCodeX: "42.549005", geoCodeY: "-73.178985", gender: "M", "visit_date": "01-04-2014", "distance": "3"}, {name: "Christina Lee", age: "43", amount: "$120", geoCodeX: "40.739005", geoCodeY: "-74.178985", gender: "F", "visit_date": "01-04-2014", "distance": "8"}, {name: "John Black", age: "52", amount: "$220", geoCodeX: "41.679005", geoCodeY: "-72.178985", gender: "M", "visit_date": "01-04-2014", "distance": "6"}, {name: "Sean Black", age: "22", amount: "$140", geoCodeX: "42.119005", geoCodeY: "-73.878985", gender: "M", "visit_date": "01-04-2014", "distance": "3"}]},
        {"providerId": "96567367", "Specialty": "Orthopaedics", "amount": "$5324", geoCodeX: "37.8557241", geoCodeY: "-122.257135", patientDetails: [{name: "John Hoe", age: "52", amount: "$20", geoCodeX: "36.459005", geoCodeY: "-121.178985", gender: "M", "visit_date": "01-04-2014", "distance": "6"}, {name: "John May", age: "42", amount: "$130", geoCodeX: "36.779005", geoCodeY: "-121.178985", gender: "M", "visit_date": "01-04-2014", "distance": "6"}, {name: "Tim May", age: "32", amount: "$80", geoCodeX: "37.679005", geoCodeY: "-121.658985", gender: "M", "visit_date": "01-04-2014", "distance": "8"}, {name: "Sean Roy", age: "52", amount: "$170", geoCodeX: "38.229005", geoCodeY: "-121.178985", gender: "M", "visit_date": "01-04-2014", "distance": "6"}, {name: "Tina Ray", age: "22", amount: "$220", geoCodeX: "38.779005", geoCodeY: "-123.178985", gender: "F", "visit_date": "01-04-2014", "distance": "2"}, {name: "Dayne Smith", age: "55", amount: "$300", geoCodeX: "36.779005", geoCodeY: "-121.478985", gender: "M", "visit_date": "01-04-2014", "distance": "6"}, {name: "Morris Jay", age: "52", amount: "$150", geoCodeX: "37.549005", geoCodeY: "-121.178985", gender: "M", "visit_date": "01-04-2014", "distance": "9"}, {name: "Christina Lee", age: "43", amount: "$120", geoCodeX: "38.739005", geoCodeY: "-121.178985", gender: "F", "visit_date": "01-04-2014", "distance": "7"}, {name: "John Black", age: "52", amount: "$220", geoCodeX: "38.679005", geoCodeY: "-121.178985", gender: "M", "visit_date": "01-04-2014"}, {name: "Sean Black", age: "22", amount: "$140", geoCodeX: "38.119005", geoCodeY: "-122.878985", gender: "M", "visit_date": "01-04-2014"}]},
        {"providerId": "29307171", "Specialty": "Oncology", "amount": "$4324", geoCodeX: "40.7326491", geoCodeY: "-73.9816158", patientDetails: [{name: "John Hoe", age: "52", amount: "$20", geoCodeX: "40.759005", geoCodeY: "-74.018985", gender: "M", "visit_date": "01-04-2014", "distance": "6"}, {name: "John May", age: "42", amount: "$130", geoCodeX: "40.779005", geoCodeY: "-73.85985", gender: "M", "visit_date": "11-04-2014", "distance": "12"}, {name: "Tim May", age: "32", amount: "$80", geoCodeX: "40.679005", geoCodeY: "-73.758985", gender: "M", "visit_date": "15-04-2014", "distance": "14"}, {name: "Sean Roy", age: "52", amount: "$170", geoCodeX: "40.759005", geoCodeY: "-73.978985", gender: "M", "visit_date": "25-04-2014", "distance": "2"}, {name: "Tina Ray", age: "22", amount: "$220", geoCodeX: "40.779005", geoCodeY: "-74.038985", gender: "F", "visit_date": "02-04-2014", "distance": "6"}, {name: "Dayne Smith", age: "55", amount: "$300", geoCodeX: "40.779005", geoCodeY: "-73.878985", gender: "M", "visit_date": "08-04-2014", "distance": "9"}, {name: "Morris Jay", age: "52", amount: "$150", geoCodeX: "40.649005", geoCodeY: "-73.998985", gender: "M", "visit_date": "30-04-2014", "distance": "7"}, {name: "Christina Lee", age: "43", amount: "$120", geoCodeX: "40.779005", geoCodeY: "-73.878985", gender: "F", "visit_date": "27-04-2014", "distance": "9"}, {name: "John Black", age: "52", amount: "$220", geoCodeX: "40.679005", geoCodeY: "-74.018985", gender: "M", "visit_date": "30-04-2014", "distance": "6"}, {name: "Sean Black", age: "22", amount: "$140", geoCodeX: "40.719005", geoCodeY: "-74.178985", gender: "M", "visit_date": "15-04-2014", "distance": "12"}]},
        {"providerId": "27815901", "Specialty": "Cardiology", "amount": "$3424", geoCodeX: "40.5326491", geoCodeY: "-73.6816158", patientDetails: [{name: "John Hoe", age: "52", amount: "$20", geoCodeX: "40.759005", geoCodeY: "-74.018985", gender: "M", "visit_date": "01-04-2014", "distance": "6"}, {name: "John May", age: "42", amount: "$130", geoCodeX: "40.779005", geoCodeY: "-73.85985", gender: "M", "visit_date": "11-04-2014", "distance": "12"}, {name: "Tim May", age: "32", amount: "$80", geoCodeX: "40.679005", geoCodeY: "-73.758985", gender: "M", "visit_date": "15-04-2014", "distance": "14"}, {name: "Sean Roy", age: "52", amount: "$170", geoCodeX: "40.759005", geoCodeY: "-73.978985", gender: "M", "visit_date": "25-04-2014", "distance": "2"}, {name: "Tina Ray", age: "22", amount: "$220", geoCodeX: "40.779005", geoCodeY: "-74.038985", gender: "F", "visit_date": "02-04-2014", "distance": "6"}, {name: "Dayne Smith", age: "55", amount: "$300", geoCodeX: "40.779005", geoCodeY: "-73.878985", gender: "M", "visit_date": "08-04-2014", "distance": "9"}, {name: "Morris Jay", age: "52", amount: "$150", geoCodeX: "40.649005", geoCodeY: "-73.998985", gender: "M", "visit_date": "30-04-2014", "distance": "7"}, {name: "Christina Lee", age: "43", amount: "$120", geoCodeX: "40.779005", geoCodeY: "-73.878985", gender: "F", "visit_date": "27-04-2014", "distance": "9"}, {name: "John Black", age: "52", amount: "$220", geoCodeX: "40.679005", geoCodeY: "-74.018985", gender: "M", "visit_date": "30-04-2014", "distance": "6"}, {name: "Sean Black", age: "22", amount: "$140", geoCodeX: "40.719005", geoCodeY: "-74.178985", gender: "M", "visit_date": "15-04-2014", "distance": "12"}]},
        {"providerId": "56781231", "Specialty": "Oncology", "amount": "$2224", geoCodeX: "37.762878", geoCodeY: "-122.254121", patientDetails: [{name: "John Hoe", age: "52", amount: "$20", geoCodeX: "36.459005", geoCodeY: "-121.178985", gender: "M", "visit_date": "01-04-2014", "distance": "6"}, {name: "John May", age: "42", amount: "$130", geoCodeX: "36.779005", geoCodeY: "-121.178985", gender: "M", "visit_date": "01-04-2014", "distance": "6"}, {name: "Tim May", age: "32", amount: "$80", geoCodeX: "37.679005", geoCodeY: "-121.658985", gender: "M", "visit_date": "01-04-2014", "distance": "8"}, {name: "Sean Roy", age: "52", amount: "$170", geoCodeX: "38.229005", geoCodeY: "-121.178985", gender: "M", "visit_date": "01-04-2014", "distance": "6"}, {name: "Tina Ray", age: "22", amount: "$220", geoCodeX: "38.779005", geoCodeY: "-123.178985", gender: "F", "visit_date": "01-04-2014", "distance": "2"}, {name: "Dayne Smith", age: "55", amount: "$300", geoCodeX: "36.779005", geoCodeY: "-121.478985", gender: "M", "visit_date": "01-04-2014", "distance": "6"}, {name: "Morris Jay", age: "52", amount: "$150", geoCodeX: "37.549005", geoCodeY: "-121.178985", gender: "M", "visit_date": "01-04-2014", "distance": "9"}, {name: "Christina Lee", age: "43", amount: "$120", geoCodeX: "38.739005", geoCodeY: "-121.178985", gender: "F", "visit_date": "01-04-2014", "distance": "7"}, {name: "John Black", age: "52", amount: "$220", geoCodeX: "38.679005", geoCodeY: "-121.178985", gender: "M", "visit_date": "01-04-2014"}, {name: "Sean Black", age: "22", amount: "$140", geoCodeX: "38.119005", geoCodeY: "-122.878985", gender: "M", "visit_date": "01-04-2014"}]},
        {"providerId": "65278001", "Specialty": "General Surgery", "amount": "$1324", geoCodeX: "41.817282", geoCodeY: "-71.400637", patientDetails: [{name: "John Hoe", age: "52", amount: "$20", geoCodeX: "41.459005", geoCodeY: "-74.178985", gender: "M", "visit_date": "01-04-2014", "distance": "6"}, {name: "John May", age: "42", amount: "$130", geoCodeX: "41.779005", geoCodeY: "-76.178985", gender: "M", "visit_date": "01-04-2014", "distance": "6"}, {name: "Tim May", age: "32", amount: "$80", geoCodeX: "41.679005", geoCodeY: "-76.658985", gender: "M", "visit_date": "01-04-2014", "distance": "2"}, {name: "Sean Roy", age: "52", amount: "$170", geoCodeX: "41.229005", geoCodeY: "-72.178985", gender: "M", "visit_date": "01-04-2014", "distance": "6"}, {name: "Tina Ray", age: "22", amount: "$220", geoCodeX: "41.779005", geoCodeY: "-73.178985", gender: "F", "visit_date": "01-04-2014", "distance": "9"}, {name: "Dayne Smith", age: "55", amount: "$300", geoCodeX: "41.779005", geoCodeY: "-74.478985", gender: "M", "visit_date": "01-04-2014", "distance": "6"}, {name: "Morris Jay", age: "52", amount: "$150", geoCodeX: "42.549005", geoCodeY: "-73.178985", gender: "M", "visit_date": "01-04-2014", "distance": "3"}, {name: "Christina Lee", age: "43", amount: "$120", geoCodeX: "40.739005", geoCodeY: "-74.178985", gender: "F", "visit_date": "01-04-2014", "distance": "8"}, {name: "John Black", age: "52", amount: "$220", geoCodeX: "41.679005", geoCodeY: "-72.178985", gender: "M", "visit_date": "01-04-2014", "distance": "6"}, {name: "Sean Black", age: "22", amount: "$140", geoCodeX: "42.119005", geoCodeY: "-73.878985", gender: "M", "visit_date": "01-04-2014", "distance": "3"}]},
        {"providerId": "65278011", "Specialty": "Orthopaedics", "amount": "$5324", geoCodeX: "37.8557241", geoCodeY: "-122.257135", patientDetails: [{name: "John Hoe", age: "52", amount: "$20", geoCodeX: "36.459005", geoCodeY: "-121.178985", gender: "M", "visit_date": "01-04-2014", "distance": "6"}, {name: "John May", age: "42", amount: "$130", geoCodeX: "36.779005", geoCodeY: "-121.178985", gender: "M", "visit_date": "01-04-2014", "distance": "6"}, {name: "Tim May", age: "32", amount: "$80", geoCodeX: "37.679005", geoCodeY: "-121.658985", gender: "M", "visit_date": "01-04-2014", "distance": "8"}, {name: "Sean Roy", age: "52", amount: "$170", geoCodeX: "38.229005", geoCodeY: "-121.178985", gender: "M", "visit_date": "01-04-2014", "distance": "6"}, {name: "Tina Ray", age: "22", amount: "$220", geoCodeX: "38.779005", geoCodeY: "-123.178985", gender: "F", "visit_date": "01-04-2014", "distance": "2"}, {name: "Dayne Smith", age: "55", amount: "$300", geoCodeX: "36.779005", geoCodeY: "-121.478985", gender: "M", "visit_date": "01-04-2014", "distance": "6"}, {name: "Morris Jay", age: "52", amount: "$150", geoCodeX: "37.549005", geoCodeY: "-121.178985", gender: "M", "visit_date": "01-04-2014", "distance": "9"}, {name: "Christina Lee", age: "43", amount: "$120", geoCodeX: "38.739005", geoCodeY: "-121.178985", gender: "F", "visit_date": "01-04-2014", "distance": "7"}, {name: "John Black", age: "52", amount: "$220", geoCodeX: "38.679005", geoCodeY: "-121.178985", gender: "M", "visit_date": "01-04-2014"}, {name: "Sean Black", age: "22", amount: "$140", geoCodeX: "38.119005", geoCodeY: "-122.878985", gender: "M", "visit_date": "01-04-2014"}]},
    ],
    networkPatientDetails: [
        {"providerId": "76567667", "Specialty": "Psychiatry", "amount": "$4324", geoCodeX: "40.7326491", geoCodeY: "-73.9816158", patientDetails: [{"providerId": "29307171", "Specialty": "General Surgery", amount: "$1000", geoCodeX: "40.759005", geoCodeY: "-74.318985", gender: "M", "visit_date": "15-04-2014", "distance": "20"}, {"providerId": "23654567", "Specialty": "Radiology", amount: "$130", geoCodeX: "40.779005", geoCodeY: "-73.85985", gender: "M", "visit_date": "15-04-2014", "distance": "12"}, {"providerId": "25435677", "Specialty": "General Medicine", amount: "$100", geoCodeX: "40.679005", geoCodeY: "-73.758985", gender: "M", "visit_date": "16-04-2014", "distance": "14"}, {"providerId": "21453356", "Specialty": "Oncology", amount: "$170", geoCodeX: "40.759005", geoCodeY: "-73.978985", gender: "M", "visit_date": "11-04-2014", "distance": "2"}, {"providerId": "24324567", "Specialty": "General Surgery", amount: "$220", geoCodeX: "40.779005", geoCodeY: "-74.038985", gender: "F", "visit_date": "11-04-2014", "distance": "6"}, {"providerId": "23245642", "Specialty": "Oncology", amount: "$300", geoCodeX: "40.780005", geoCodeY: "-73.888985", gender: "M", "visit_date": "11-04-2014", "distance": "9"}, {"providerId": "23135465", "Specialty": "Oncology", amount: "$150", geoCodeX: "40.649005", geoCodeY: "-73.998985", gender: "M", "visit_date": "11-04-2014", "distance": "7"}, {"providerId": "24433564", "Specialty": "Cardiology", amount: "$120", geoCodeX: "40.779005", geoCodeY: "-73.878985", gender: "F", "visit_date": "11-04-2014", "distance": "8"}, {"providerId": "23245689", "Specialty": "Oncology", amount: "$220", geoCodeX: "40.679005", geoCodeY: "-74.018985", gender: "M", "visit_date": "11-04-2014", "distance": "6"}, {"providerId": "23424564", "Specialty": "Oncology", amount: "$140", geoCodeX: "40.719005", geoCodeY: "-74.178985", gender: "M", "visit_date": "11-04-2014", "distance": "12"}]},
        {"providerId": "86637643", "Specialty": "Cardiology", "amount": "$3424", geoCodeX: "40.7326491", geoCodeY: "-73.9816158", patientDetails: [{"providerId": "29307171", "Specialty": "General Surgery", amount: "$1000", geoCodeX: "40.759005", geoCodeY: "-74.318985", gender: "M", "visit_date": "15-04-2014", "distance": "20"}, {"providerId": "23654567", "Specialty": "Radiology", amount: "$130", geoCodeX: "40.779005", geoCodeY: "-73.85985", gender: "M", "visit_date": "15-04-2014", "distance": "12"}, {"providerId": "25435677", "Specialty": "General Medicine", amount: "$100", geoCodeX: "40.679005", geoCodeY: "-73.758985", gender: "M", "visit_date": "16-04-2014", "distance": "14"}, {"providerId": "21453356", "Specialty": "Oncology", amount: "$170", geoCodeX: "40.759005", geoCodeY: "-73.978985", gender: "M", "visit_date": "11-04-2014", "distance": "2"}, {"providerId": "24324567", "Specialty": "General Surgery", amount: "$220", geoCodeX: "40.779005", geoCodeY: "-74.038985", gender: "F", "visit_date": "11-04-2014", "distance": "6"}, {"providerId": "23245642", "Specialty": "Oncology", amount: "$300", geoCodeX: "40.780005", geoCodeY: "-73.888985", gender: "M", "visit_date": "11-04-2014", "distance": "9"}, {"providerId": "23135465", "Specialty": "Oncology", amount: "$150", geoCodeX: "40.649005", geoCodeY: "-73.998985", gender: "M", "visit_date": "11-04-2014", "distance": "7"}, {"providerId": "24433564", "Specialty": "Cardiology", amount: "$120", geoCodeX: "40.779005", geoCodeY: "-73.878985", gender: "F", "visit_date": "11-04-2014", "distance": "8"}, {"providerId": "23245689", "Specialty": "Oncology", amount: "$220", geoCodeX: "40.679005", geoCodeY: "-74.018985", gender: "M", "visit_date": "11-04-2014", "distance": "6"}, {"providerId": "23424564", "Specialty": "Oncology", amount: "$140", geoCodeX: "40.719005", geoCodeY: "-74.178985", gender: "M", "visit_date": "11-04-2014", "distance": "12"}]},
        {"providerId": "93367632", "Specialty": "Oncology", "amount": "$2224", geoCodeX: "40.7326491", geoCodeY: "-73.9816158", patientDetails: [{"providerId": "29307171", "Specialty": "General Surgery", amount: "$1000", geoCodeX: "40.759005", geoCodeY: "-74.318985", gender: "M", "visit_date": "15-04-2014", "distance": "20"}, {"providerId": "23654567", "Specialty": "Radiology", amount: "$130", geoCodeX: "40.779005", geoCodeY: "-73.85985", gender: "M", "visit_date": "15-04-2014", "distance": "12"}, {"providerId": "25435677", "Specialty": "General Medicine", amount: "$100", geoCodeX: "40.679005", geoCodeY: "-73.758985", gender: "M", "visit_date": "16-04-2014", "distance": "14"}, {"providerId": "21453356", "Specialty": "Oncology", amount: "$170", geoCodeX: "40.759005", geoCodeY: "-73.978985", gender: "M", "visit_date": "11-04-2014", "distance": "2"}, {"providerId": "24324567", "Specialty": "General Surgery", amount: "$220", geoCodeX: "40.779005", geoCodeY: "-74.038985", gender: "F", "visit_date": "11-04-2014", "distance": "6"}, {"providerId": "23245642", "Specialty": "Oncology", amount: "$300", geoCodeX: "40.780005", geoCodeY: "-73.888985", gender: "M", "visit_date": "11-04-2014", "distance": "9"}, {"providerId": "23135465", "Specialty": "Oncology", amount: "$150", geoCodeX: "40.649005", geoCodeY: "-73.998985", gender: "M", "visit_date": "11-04-2014", "distance": "7"}, {"providerId": "24433564", "Specialty": "Cardiology", amount: "$120", geoCodeX: "40.779005", geoCodeY: "-73.878985", gender: "F", "visit_date": "11-04-2014", "distance": "8"}, {"providerId": "23245689", "Specialty": "Oncology", amount: "$220", geoCodeX: "40.679005", geoCodeY: "-74.018985", gender: "M", "visit_date": "11-04-2014", "distance": "6"}, {"providerId": "23424564", "Specialty": "Oncology", amount: "$140", geoCodeX: "40.719005", geoCodeY: "-74.178985", gender: "M", "visit_date": "11-04-2014", "distance": "12"}]},
        {"providerId": "86567234", "Specialty": "General Surgery", "amount": "$1324", geoCodeX: "40.7326491", geoCodeY: "-73.9816158", patientDetails: [{"providerId": "29307171", "Specialty": "General Surgery", amount: "$1000", geoCodeX: "40.759005", geoCodeY: "-74.318985", gender: "M", "visit_date": "15-04-2014", "distance": "20"}, {"providerId": "23654567", "Specialty": "Radiology", amount: "$130", geoCodeX: "40.779005", geoCodeY: "-73.85985", gender: "M", "visit_date": "15-04-2014", "distance": "12"}, {"providerId": "25435677", "Specialty": "General Medicine", amount: "$100", geoCodeX: "40.679005", geoCodeY: "-73.758985", gender: "M", "visit_date": "16-04-2014", "distance": "14"}, {"providerId": "21453356", "Specialty": "Oncology", amount: "$170", geoCodeX: "40.759005", geoCodeY: "-73.978985", gender: "M", "visit_date": "11-04-2014", "distance": "2"}, {"providerId": "24324567", "Specialty": "General Surgery", amount: "$220", geoCodeX: "40.779005", geoCodeY: "-74.038985", gender: "F", "visit_date": "11-04-2014", "distance": "6"}, {"providerId": "23245642", "Specialty": "Oncology", amount: "$300", geoCodeX: "40.780005", geoCodeY: "-73.888985", gender: "M", "visit_date": "11-04-2014", "distance": "9"}, {"providerId": "23135465", "Specialty": "Oncology", amount: "$150", geoCodeX: "40.649005", geoCodeY: "-73.998985", gender: "M", "visit_date": "11-04-2014", "distance": "7"}, {"providerId": "24433564", "Specialty": "Cardiology", amount: "$120", geoCodeX: "40.779005", geoCodeY: "-73.878985", gender: "F", "visit_date": "11-04-2014", "distance": "8"}, {"providerId": "23245689", "Specialty": "Oncology", amount: "$220", geoCodeX: "40.679005", geoCodeY: "-74.018985", gender: "M", "visit_date": "11-04-2014", "distance": "6"}, {"providerId": "23424564", "Specialty": "Oncology", amount: "$140", geoCodeX: "40.719005", geoCodeY: "-74.178985", gender: "M", "visit_date": "11-04-2014", "distance": "12"}]},
        {"providerId": "96567367", "Specialty": "Orthopaedics", "amount": "$5324", geoCodeX: "40.7326491", geoCodeY: "-73.9816158", patientDetails: [{"providerId": "29307171", "Specialty": "General Surgery", amount: "$1000", geoCodeX: "40.759005", geoCodeY: "-74.318985", gender: "M", "visit_date": "15-04-2014", "distance": "20"}, {"providerId": "23654567", "Specialty": "Radiology", amount: "$130", geoCodeX: "40.779005", geoCodeY: "-73.85985", gender: "M", "visit_date": "15-04-2014", "distance": "12"}, {"providerId": "25435677", "Specialty": "General Medicine", amount: "$100", geoCodeX: "40.679005", geoCodeY: "-73.758985", gender: "M", "visit_date": "16-04-2014", "distance": "14"}, {"providerId": "21453356", "Specialty": "Oncology", amount: "$170", geoCodeX: "40.759005", geoCodeY: "-73.978985", gender: "M", "visit_date": "11-04-2014", "distance": "2"}, {"providerId": "24324567", "Specialty": "General Surgery", amount: "$220", geoCodeX: "40.779005", geoCodeY: "-74.038985", gender: "F", "visit_date": "11-04-2014", "distance": "6"}, {"providerId": "23245642", "Specialty": "Oncology", amount: "$300", geoCodeX: "40.780005", geoCodeY: "-73.888985", gender: "M", "visit_date": "11-04-2014", "distance": "9"}, {"providerId": "23135465", "Specialty": "Oncology", amount: "$150", geoCodeX: "40.649005", geoCodeY: "-73.998985", gender: "M", "visit_date": "11-04-2014", "distance": "7"}, {"providerId": "24433564", "Specialty": "Cardiology", amount: "$120", geoCodeX: "40.779005", geoCodeY: "-73.878985", gender: "F", "visit_date": "11-04-2014", "distance": "8"}, {"providerId": "23245689", "Specialty": "Oncology", amount: "$220", geoCodeX: "40.679005", geoCodeY: "-74.018985", gender: "M", "visit_date": "11-04-2014", "distance": "6"}, {"providerId": "23424564", "Specialty": "Oncology", amount: "$140", geoCodeX: "40.719005", geoCodeY: "-74.178985", gender: "M", "visit_date": "11-04-2014", "distance": "12"}]},
        {"providerId": "27815901", "Specialty": "General Surgery", "amount": "$1324", geoCodeX: "40.7326491", geoCodeY: "-73.9816158", patientDetails: [{"providerId": "29307171", "Specialty": "General Surgery", amount: "$1000", geoCodeX: "40.759005", geoCodeY: "-74.318985", gender: "M", "visit_date": "15-04-2014", "distance": "20"}, {"providerId": "23654567", "Specialty": "Radiology", amount: "$130", geoCodeX: "40.779005", geoCodeY: "-73.85985", gender: "M", "visit_date": "15-04-2014", "distance": "12"}, {"providerId": "25435677", "Specialty": "General Medicine", amount: "$100", geoCodeX: "40.679005", geoCodeY: "-73.758985", gender: "M", "visit_date": "16-04-2014", "distance": "14"}, {"providerId": "21453356", "Specialty": "Oncology", amount: "$170", geoCodeX: "40.759005", geoCodeY: "-73.978985", gender: "M", "visit_date": "11-04-2014", "distance": "2"}, {"providerId": "24324567", "Specialty": "General Surgery", amount: "$220", geoCodeX: "40.779005", geoCodeY: "-74.038985", gender: "F", "visit_date": "11-04-2014", "distance": "6"}, {"providerId": "23245642", "Specialty": "Oncology", amount: "$300", geoCodeX: "40.780005", geoCodeY: "-73.888985", gender: "M", "visit_date": "11-04-2014", "distance": "9"}, {"providerId": "23135465", "Specialty": "Oncology", amount: "$150", geoCodeX: "40.649005", geoCodeY: "-73.998985", gender: "M", "visit_date": "11-04-2014", "distance": "7"}, {"providerId": "24433564", "Specialty": "Cardiology", amount: "$120", geoCodeX: "40.779005", geoCodeY: "-73.878985", gender: "F", "visit_date": "11-04-2014", "distance": "8"}, {"providerId": "23245689", "Specialty": "Oncology", amount: "$220", geoCodeX: "40.679005", geoCodeY: "-74.018985", gender: "M", "visit_date": "11-04-2014", "distance": "6"}, {"providerId": "23424564", "Specialty": "Oncology", amount: "$140", geoCodeX: "40.719005", geoCodeY: "-74.178985", gender: "M", "visit_date": "11-04-2014", "distance": "12"}]},
        {"providerId": "29307171", "Specialty": "Orthopaedics", "amount": "$5324", geoCodeX: "40.7326491", geoCodeY: "-73.9816158", patientDetails: [{"providerId": "29307171", "Specialty": "General Surgery", amount: "$1000", geoCodeX: "40.759005", geoCodeY: "-74.318985", gender: "M", "visit_date": "15-04-2014", "distance": "20"}, {"providerId": "23654567", "Specialty": "Radiology", amount: "$130", geoCodeX: "40.779005", geoCodeY: "-73.85985", gender: "M", "visit_date": "15-04-2014", "distance": "12"}, {"providerId": "25435677", "Specialty": "General Medicine", amount: "$100", geoCodeX: "40.679005", geoCodeY: "-73.758985", gender: "M", "visit_date": "16-04-2014", "distance": "14"}, {"providerId": "21453356", "Specialty": "Oncology", amount: "$170", geoCodeX: "40.759005", geoCodeY: "-73.978985", gender: "M", "visit_date": "11-04-2014", "distance": "2"}, {"providerId": "24324567", "Specialty": "General Surgery", amount: "$220", geoCodeX: "40.779005", geoCodeY: "-74.038985", gender: "F", "visit_date": "11-04-2014", "distance": "6"}, {"providerId": "23245642", "Specialty": "Oncology", amount: "$300", geoCodeX: "40.780005", geoCodeY: "-73.888985", gender: "M", "visit_date": "11-04-2014", "distance": "9"}, {"providerId": "23135465", "Specialty": "Oncology", amount: "$150", geoCodeX: "40.649005", geoCodeY: "-73.998985", gender: "M", "visit_date": "11-04-2014", "distance": "7"}, {"providerId": "24433564", "Specialty": "Cardiology", amount: "$120", geoCodeX: "40.779005", geoCodeY: "-73.878985", gender: "F", "visit_date": "11-04-2014", "distance": "8"}, {"providerId": "23245689", "Specialty": "Oncology", amount: "$220", geoCodeX: "40.679005", geoCodeY: "-74.018985", gender: "M", "visit_date": "11-04-2014", "distance": "6"}, {"providerId": "23424564", "Specialty": "Oncology", amount: "$140", geoCodeX: "40.719005", geoCodeY: "-74.178985", gender: "M", "visit_date": "11-04-2014", "distance": "12"}]},
    ],
    /*** START Data related to Active Cases **/
    newActivityTypes: [
        {"name": "Onsite visit"},
        {"name": "Request medical record"},
        {"name": "Other (Please explain)"}
    ],
    newActivityDueDates: [
        {"due_date": "05-13-2014"}
    ],
    newActivityRemindMeOptions: [
        {"remind_me_option": "At time of event"},
        {"remind_me_option": "5 minutes before"},
        {"remind_me_option": "15 minutes before"},
        {"remind_me_option": "30 minutes before"},
        {"remind_me_option": "1 hour before"},
        {"remind_me_option": "2 hours before"},
        {"remind_me_option": "1 day before"},
        {"remind_me_option": "2 days before"},
        {"remind_me_option": "1 week before"}
    ],
    activeCaseUpcomingActivitiesDataArray: [
        {"activity": "Onsite visit", "due_date": "11-20-2013", "delete_img": ""},
        {"activity": "Request medical record", "due_date": "12-02-2013", "delete_img": ""},
        {"activity": "Call Richard W", "due_date": "12-11-2013", "delete_img": ""}
    ],
    activeCasePastActivitiesDataArray: [
        {"activities": "Investigated Claim 782905", "status": "Processing", "note": "Need more investigations from network side", "action_date": "11-15-2013", "investigator": "Sandy W"},
        {"activities": "Investigated Claim 293847", "status": "Completed", "note": "", "action_date": "11-10-2013", "investigator": "Sandy W"}
    ],
    activeCaseHistoryActivitiesDataArray: [
        {"activities": "Assigned to Sandy W", "status": "Processing", "note": "Need help from Sandy W about..", "action_date": "11-04-2013", "investigator": "David C"},
        {"activities": "Investigated Claim 293847", "status": "Processing", "note": "", "action_date": "07-10-2013", "investigator": "David C"},
        {"activities": "Assigned to David C", "status": "Late", "note": "Need help from David C about...", "action_date": "07-06-2013", "investigator": "Lily T"},
        {"activities": "Creat a case for provider John Smith", "status": "Completed", "note": "Need more investigations on...", "action_date": "06-31-2013", "investigator": "Lily T"}
    ],
    activeCaseSupportingDocsDataArray: [
        {"doc_type": "Excel", "doc_num": "12345678", "doc_title": "Charge Comparison", "doc_desc": "Peer comparison", "doc_date_created": "10-01-2013", "doc_report_by": "David C", "dummy_column": ""},
        {"doc_type": "Word", "doc_num": "23847592", "doc_title": "Office Staff List", "doc_desc": "Hospital staff record", "doc_date_created": "08-26-2013", "doc_report_by": "David C", "dummy_column": ""},
        {"doc_type": "Excel", "doc_num": "02934642", "doc_title": "Receivables, 06-2013", "doc_desc": "Documentation supporting claims", "doc_date_created": "07-03-2013", "doc_report_by": "Lily T", "dummy_column": ""},
    ],
    activeCaseCRsummaryDataArray: [
        {"cr_date": "11-04-2013", "cr_desc": "Drove to physician location to interview office staff.", "cr_cost": "$560"},
        {"cr_date": "10-26-2013", "cr_desc": "Requested paper claims from CMS, filing free incurred.", "cr_cost": "$250"},
        {"cr_date": "10-12-2013", "cr_desc": "Onsite visit, physician interview.", "cr_cost": "$320"}
    ],
    activeCaseCRsummaryDataArray1: [
        {"cr_date": "11-07-2013", "cr_desc": "Amount paid for claim anomolies for northwest patients.", "cr_cost": "$423"},
        {"cr_date": "12-23-2013", "cr_desc": "Total recovery for two high charges.", "cr_cost": "$259"},
        {"cr_date": "12-29-2013", "cr_desc": "Payment for last patient visit.", "cr_cost": "$32"}
    ],
    chordChartData: [[0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1],
        [0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 4, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 2, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 2, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 2, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 2, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 3, 0, 0, 2, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 2, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 2, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 0, 2, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 2, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 2, 0, 0, 0, 0]],
    chordChartLabelData: ["John Smith",
        "Britni Murrow",
        "Bermudez, Zaida C.",
        "Berrios, Luis D.",
        "Bhat, Saligrama",
        "Calvino, Stephane",
        "Carbonell, Mario",
        "Cooke, Jennifer",
        "Dakouny, Antoine",
        "Droffner, Mark C.",
        "Garrett, Robert B",
        "Guvenli, Gokhan",
        "Hassan, Syed",
        "Hershkowitz, D",
        "Hundt, Nancy L.",
        "Janz, Timothy A.",
        "Kamal, Asif",
        "Keller, Anita",
        "Koppuzha, George",
        "Krishna, Malathi"
    ],
    networkChartData: [
        {"providerId": 93847521, networkChordData: {provider_matirx: [[0, 0, 5, 0, 1, 0, 1, 0, 1, 2, 1, 4, 5, 4, 0, 5, 0, 4, 1, 0], [1, 0, 5, 1, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 1, 0, 0, 1, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [1, 1, 1, 1, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [1, 0, 1, 0, 0, 0, 2, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1]], networkChordLabelData: [{name: 'John Smith', risk_score: 85, claim_amount: 650, total_claim: 28}, {name: 'Richard Green', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Mark Green', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Larry Bucshon', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Elly Kocher', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Joe Heck', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Yuan Lee', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Susan White', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Kim Smith', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'April Sexer', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Ray Marble', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Tobey Houston', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Enny Joachim', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'John Davis', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Chuck Brown', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Nitin Babu', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Britni Murrow', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Nick Lehman', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Robert Junior', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Dane Adkison', risk_score: 5, claim_amount: 250, total_claim: 18}]}},
        {"providerId": 48527633, networkChordData: {provider_matirx: [[0, 0, 1, 0, 1, 0, 1, 0, 1, 2, 1, 1, 0, 2, 0, 0, 0, 2, 1, 0], [1, 0, 5, 1, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 1, 0, 0, 1, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [1, 1, 1, 1, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [1, 0, 1, 0, 0, 0, 2, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1]], networkChordLabelData: [{name: 'John Smith', risk_score: 85, claim_amount: 650, total_claim: 28}, {name: 'Richard Green', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Mark Green', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Larry Bucshon', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Elly Kocher', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Joe Heck', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Yuan Lee', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Susan White', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Kim Smith', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'April Sexer', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Ray Marble', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Tobey Houston', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Enny Joachim', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'John Davis', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Chuck Brown', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Nitin Babu', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Britni Murrow', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Nick Lehman', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Robert Junior', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Dane Adkison', risk_score: 5, claim_amount: 250, total_claim: 18}]}},
        {"providerId": 98235623, networkChordData: {provider_matirx: [[0, 0, 1, 0, 1, 0, 1, 0, 1, 2, 1, 1, 0, 2, 0, 0, 0, 2, 1, 0], [1, 0, 5, 1, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 1, 0, 0, 1, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [1, 1, 1, 1, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [1, 0, 1, 0, 0, 0, 2, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1]], networkChordLabelData: [{name: 'John Smith', risk_score: 85, claim_amount: 650, total_claim: 28}, {name: 'Richard Green', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Mark Green', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Larry Bucshon', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Elly Kocher', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Joe Heck', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Yuan Lee', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Susan White', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Kim Smith', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'April Sexer', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Ray Marble', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Tobey Houston', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Enny Joachim', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'John Davis', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Chuck Brown', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Nitin Babu', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Britni Murrow', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Nick Lehman', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Robert Junior', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Dane Adkison', risk_score: 5, claim_amount: 250, total_claim: 18}]}},
        {"providerId": 40926608, networkChordData: {provider_matirx: [[0, 0, 1, 0, 1, 0, 1, 0, 1, 2, 1, 1, 0, 2, 0, 0, 0, 2, 1, 0], [1, 0, 5, 1, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 1, 0, 0, 1, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [1, 1, 1, 1, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [1, 0, 1, 0, 0, 0, 2, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1]], networkChordLabelData: [{name: 'John Smith', risk_score: 85, claim_amount: 650, total_claim: 28}, {name: 'Richard Green', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Mark Green', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Larry Bucshon', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Elly Kocher', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Joe Heck', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Yuan Lee', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Susan White', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Kim Smith', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'April Sexer', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Ray Marble', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Tobey Houston', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Enny Joachim', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'John Davis', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Chuck Brown', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Nitin Babu', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Britni Murrow', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Nick Lehman', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Robert Junior', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Dane Adkison', risk_score: 5, claim_amount: 250, total_claim: 18}]}},
        {"providerId": 24329643, networkChordData: {provider_matirx: [[0, 0, 1, 0, 1, 0, 1, 0, 1, 2, 1, 1, 0, 2, 0, 0, 0, 2, 1, 0], [1, 0, 5, 1, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 1, 0, 0, 1, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [1, 1, 1, 1, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [1, 0, 1, 0, 0, 0, 2, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1]], networkChordLabelData: [{name: 'John Smith', risk_score: 85, claim_amount: 650, total_claim: 28}, {name: 'Richard Green', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Mark Green', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Larry Bucshon', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Elly Kocher', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Joe Heck', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Yuan Lee', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Susan White', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Kim Smith', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'April Sexer', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Ray Marble', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Tobey Houston', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Enny Joachim', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'John Davis', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Chuck Brown', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Nitin Babu', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Britni Murrow', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Nick Lehman', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Robert Junior', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Dane Adkison', risk_score: 5, claim_amount: 250, total_claim: 18}]}},
        {"providerId": 79403874, networkChordData: {provider_matirx: [[0, 0, 1, 0, 1, 0, 1, 0, 1, 2, 1, 1, 0, 2, 0, 0, 0, 2, 1, 0], [1, 0, 5, 1, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 1, 0, 0, 1, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [1, 1, 1, 1, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [1, 0, 1, 0, 0, 0, 2, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1]], networkChordLabelData: [{name: 'John Smith', risk_score: 85, claim_amount: 650, total_claim: 28}, {name: 'Richard Green', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Mark Green', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Larry Bucshon', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Elly Kocher', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Joe Heck', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Yuan Lee', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Susan White', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Kim Smith', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'April Sexer', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Ray Marble', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Tobey Houston', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Enny Joachim', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'John Davis', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Chuck Brown', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Nitin Babu', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Britni Murrow', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Nick Lehman', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Robert Junior', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Dane Adkison', risk_score: 5, claim_amount: 250, total_claim: 18}]}},
        {"providerId": 53831859, networkChordData: {provider_matirx: [[0, 0, 1, 0, 1, 0, 1, 0, 1, 2, 1, 1, 0, 2, 0, 0, 0, 2, 1, 0], [1, 0, 5, 1, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 1, 0, 0, 1, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [1, 1, 1, 1, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [1, 0, 1, 0, 0, 0, 2, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1]], networkChordLabelData: [{name: 'John Smith', risk_score: 85, claim_amount: 650, total_claim: 28}, {name: 'Richard Green', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Mark Green', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Larry Bucshon', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Elly Kocher', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Joe Heck', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Yuan Lee', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Susan White', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Kim Smith', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'April Sexer', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Ray Marble', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Tobey Houston', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Enny Joachim', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'John Davis', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Chuck Brown', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Nitin Babu', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Britni Murrow', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Nick Lehman', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Robert Junior', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Dane Adkison', risk_score: 5, claim_amount: 250, total_claim: 18}]}},
        ,
                {"providerId": 76567667, networkChordData: {provider_matirx: [[0, 0, 1, 0, 1, 0, 1, 0, 1, 2, 1, 1, 0, 2, 0, 0, 0, 2, 1, 0], [1, 0, 5, 1, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 1, 0, 0, 1, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [1, 1, 1, 1, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [1, 0, 1, 0, 0, 0, 2, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1]], networkChordLabelData: [{name: 'John Smith', risk_score: 85, claim_amount: 650, total_claim: 28}, {name: 'Richard Green', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Mark Green', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Larry Bucshon', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Elly Kocher', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Joe Heck', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Yuan Lee', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Susan White', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Kim Smith', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'April Sexer', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Ray Marble', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Tobey Houston', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Enny Joachim', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'John Davis', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Chuck Brown', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Nitin Babu', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Britni Murrow', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Nick Lehman', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Robert Junior', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Dane Adkison', risk_score: 5, claim_amount: 250, total_claim: 18}]}},
        {"providerId": 86637643, networkChordData: {provider_matirx: [[0, 0, 1, 0, 1, 0, 1, 0, 1, 2, 1, 1, 0, 2, 0, 0, 0, 2, 1, 0], [1, 0, 5, 1, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 1, 0, 0, 1, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [1, 1, 1, 1, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [1, 0, 1, 0, 0, 0, 2, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1]], networkChordLabelData: [{name: 'John Smith', risk_score: 85, claim_amount: 650, total_claim: 28}, {name: 'Richard Green', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Mark Green', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Larry Bucshon', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Elly Kocher', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Joe Heck', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Yuan Lee', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Susan White', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Kim Smith', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'April Sexer', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Ray Marble', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Tobey Houston', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Enny Joachim', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'John Davis', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Chuck Brown', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Nitin Babu', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Britni Murrow', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Nick Lehman', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Robert Junior', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Dane Adkison', risk_score: 5, claim_amount: 250, total_claim: 18}]}},
        {"providerId": 93367632, networkChordData: {provider_matirx: [[0, 0, 1, 0, 1, 0, 1, 0, 1, 2, 1, 1, 0, 2, 0, 0, 0, 2, 1, 0], [1, 0, 5, 1, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 1, 0, 0, 1, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [1, 1, 1, 1, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [1, 0, 1, 0, 0, 0, 2, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1]], networkChordLabelData: [{name: 'John Smith', risk_score: 85, claim_amount: 650, total_claim: 28}, {name: 'Richard Green', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Mark Green', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Larry Bucshon', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Elly Kocher', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Joe Heck', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Yuan Lee', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Susan White', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Kim Smith', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'April Sexer', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Ray Marble', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Tobey Houston', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Enny Joachim', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'John Davis', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Chuck Brown', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Nitin Babu', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Britni Murrow', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Nick Lehman', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Robert Junior', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Dane Adkison', risk_score: 5, claim_amount: 250, total_claim: 18}]}},
        {"providerId": 86567234, networkChordData: {provider_matirx: [[0, 0, 1, 0, 1, 0, 1, 0, 1, 2, 1, 1, 0, 2, 0, 0, 0, 2, 1, 0], [1, 0, 5, 1, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 1, 0, 0, 1, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [1, 1, 1, 1, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [1, 0, 1, 0, 0, 0, 2, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1]], networkChordLabelData: [{name: 'John Smith', risk_score: 85, claim_amount: 650, total_claim: 28}, {name: 'Richard Green', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Mark Green', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Larry Bucshon', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Elly Kocher', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Joe Heck', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Yuan Lee', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Susan White', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Kim Smith', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'April Sexer', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Ray Marble', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Tobey Houston', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Enny Joachim', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'John Davis', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Chuck Brown', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Nitin Babu', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Britni Murrow', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Nick Lehman', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Robert Junior', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Dane Adkison', risk_score: 5, claim_amount: 250, total_claim: 18}]}},
        {"providerId": 96567367, networkChordData: {provider_matirx: [[0, 0, 1, 0, 1, 0, 1, 0, 1, 2, 1, 1, 0, 2, 0, 0, 0, 2, 1, 0], [1, 0, 5, 1, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 1, 0, 0, 1, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [1, 1, 1, 1, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [1, 0, 1, 0, 0, 0, 2, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1]], networkChordLabelData: [{name: 'John Smith', risk_score: 85, claim_amount: 650, total_claim: 28}, {name: 'Richard Green', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Mark Green', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Larry Bucshon', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Elly Kocher', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Joe Heck', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Yuan Lee', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Susan White', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Kim Smith', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'April Sexer', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Ray Marble', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Tobey Houston', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Enny Joachim', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'John Davis', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Chuck Brown', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Nitin Babu', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Britni Murrow', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Nick Lehman', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Robert Junior', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Dane Adkison', risk_score: 5, claim_amount: 250, total_claim: 18}]}},
        {"providerId": 29307171, networkChordData: {provider_matirx: [[0, 0, 1, 0, 1, 0, 1, 0, 1, 2, 1, 1, 0, 2, 0, 0, 0, 2, 1, 0], [1, 0, 5, 1, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 1, 0, 0, 1, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [1, 1, 1, 1, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [1, 0, 1, 0, 0, 0, 2, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1]], networkChordLabelData: [{name: 'John Smith', risk_score: 85, claim_amount: 650, total_claim: 28}, {name: 'Richard Green', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Mark Green', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Larry Bucshon', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Elly Kocher', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Joe Heck', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Yuan Lee', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Susan White', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Kim Smith', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'April Sexer', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Ray Marble', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Tobey Houston', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Enny Joachim', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'John Davis', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Chuck Brown', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Nitin Babu', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Britni Murrow', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Nick Lehman', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Robert Junior', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Dane Adkison', risk_score: 5, claim_amount: 250, total_claim: 18}]}},
        {"providerId": 27815901, networkChordData: {provider_matirx: [[0, 0, 1, 0, 1, 0, 1, 0, 1, 2, 1, 1, 0, 2, 0, 0, 0, 2, 1, 0], [1, 0, 5, 1, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 1, 0, 0, 1, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [1, 1, 1, 1, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [1, 0, 1, 0, 0, 0, 2, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1]], networkChordLabelData: [{name: 'John Smith', risk_score: 85, claim_amount: 650, total_claim: 28}, {name: 'Richard Green', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Mark Green', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Larry Bucshon', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Elly Kocher', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Joe Heck', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Yuan Lee', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Susan White', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Kim Smith', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'April Sexer', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Ray Marble', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Tobey Houston', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Enny Joachim', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'John Davis', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Chuck Brown', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Nitin Babu', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Britni Murrow', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Nick Lehman', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Robert Junior', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Dane Adkison', risk_score: 5, claim_amount: 250, total_claim: 18}]}},
        {"providerId": 56781231, networkChordData: {provider_matirx: [[0, 0, 1, 0, 1, 0, 1, 0, 1, 2, 1, 1, 0, 2, 0, 0, 0, 2, 1, 0], [1, 0, 5, 1, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 1, 0, 0, 1, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [1, 1, 1, 1, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [1, 0, 1, 0, 0, 0, 2, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1]], networkChordLabelData: [{name: 'John Smith', risk_score: 85, claim_amount: 650, total_claim: 28}, {name: 'Richard Green', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Mark Green', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Larry Bucshon', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Elly Kocher', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Joe Heck', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Yuan Lee', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Susan White', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Kim Smith', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'April Sexer', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Ray Marble', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Tobey Houston', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Enny Joachim', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'John Davis', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Chuck Brown', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Nitin Babu', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Britni Murrow', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Nick Lehman', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Robert Junior', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Dane Adkison', risk_score: 5, claim_amount: 250, total_claim: 18}]}},
        {"providerId": 65278001, networkChordData: {provider_matirx: [[0, 0, 1, 0, 1, 0, 1, 0, 1, 2, 1, 1, 0, 2, 0, 0, 0, 2, 1, 0], [1, 0, 5, 1, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 1, 0, 0, 1, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [1, 1, 1, 1, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [1, 0, 1, 0, 0, 0, 2, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1]], networkChordLabelData: [{name: 'John Smith', risk_score: 85, claim_amount: 650, total_claim: 28}, {name: 'Richard Green', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Mark Green', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Larry Bucshon', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Elly Kocher', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Joe Heck', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Yuan Lee', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Susan White', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Kim Smith', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'April Sexer', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Ray Marble', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Tobey Houston', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Enny Joachim', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'John Davis', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Chuck Brown', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Nitin Babu', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Britni Murrow', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Nick Lehman', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Robert Junior', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Dane Adkison', risk_score: 5, claim_amount: 250, total_claim: 18}]}},
        {"providerId": 65278011, networkChordData: {provider_matirx: [[0, 0, 1, 0, 1, 0, 1, 0, 1, 2, 1, 1, 0, 2, 0, 0, 0, 2, 1, 0], [1, 0, 5, 1, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 1, 0, 0, 1, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [1, 1, 1, 1, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [1, 0, 1, 0, 0, 0, 2, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1]], networkChordLabelData: [{name: 'John Smith', risk_score: 85, claim_amount: 650, total_claim: 28}, {name: 'Richard Green', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Mark Green', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Larry Bucshon', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Elly Kocher', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Joe Heck', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Yuan Lee', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Susan White', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Kim Smith', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'April Sexer', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Ray Marble', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Tobey Houston', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Enny Joachim', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'John Davis', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Chuck Brown', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Nitin Babu', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Britni Murrow', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Nick Lehman', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Robert Junior', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Dane Adkison', risk_score: 5, claim_amount: 250, total_claim: 18}]}},
    ],
    networkChartDataNetworkTab: [
        {"providerId": 93847521, networkChordData: {provider_matirx: [[0, 0, 1, 0, 1, 0, 1, 0, 1, 2, 1, 1, 0, 2, 0, 0, 0, 2, 1, 0], [1, 0, 5, 1, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 1, 0, 0, 1, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [1, 1, 1, 1, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [1, 0, 1, 0, 0, 0, 2, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1]], networkChordLabelData: [{name: 'John Smith', risk_score: 85, claim_amount: 650, total_claim: 28}, {name: 'Richard Green', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Mark Green', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Mark Lekar', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Elly Kocher', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Richard Lee', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Yuan Lee', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Susan White', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Sean Jay', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'April Sexer', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Ray Marble', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Tobey Houston', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Enny Joachim', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'John Davis', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Tim White', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Nitin Babu', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'John Black', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Nick Lehman', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Robert Junior', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Dane Adkison', risk_score: 5, claim_amount: 250, total_claim: 18}]}},
        {"providerId": 48527633, networkChordData: {provider_matirx: [[0, 0, 1, 0, 1, 0, 1, 0, 1, 2, 1, 1, 0, 2, 0, 0, 0, 2, 1, 0], [1, 0, 5, 1, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 1, 0, 0, 1, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [1, 1, 1, 1, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [1, 0, 1, 0, 0, 0, 2, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1]], networkChordLabelData: [{name: 'John Smith', risk_score: 85, claim_amount: 650, total_claim: 28}, {name: 'Richard Green', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Mark Green', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Mark Lekar', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Elly Kocher', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Richard Lee', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Yuan Lee', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Susan White', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Sean Jay', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'April Sexer', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Ray Marble', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Tobey Houston', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Enny Joachim', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'John Davis', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Tim White', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Nitin Babu', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'John Black', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Nick Lehman', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Robert Junior', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Dane Adkison', risk_score: 5, claim_amount: 250, total_claim: 18}]}},
        {"providerId": 98235623, networkChordData: {provider_matirx: [[0, 0, 1, 0, 1, 0, 1, 0, 1, 2, 1, 1, 0, 2, 0, 0, 0, 2, 1, 0], [1, 0, 5, 1, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 1, 0, 0, 1, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [1, 1, 1, 1, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [1, 0, 1, 0, 0, 0, 2, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1]], networkChordLabelData: [{name: 'John Smith', risk_score: 85, claim_amount: 650, total_claim: 28}, {name: 'Richard Green', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Mark Green', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Mark Lekar', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Elly Kocher', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Richard Lee', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Yuan Lee', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Susan White', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Sean Jay', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'April Sexer', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Ray Marble', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Tobey Houston', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Enny Joachim', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'John Davis', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Tim White', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Nitin Babu', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'John Black', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Nick Lehman', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Robert Junior', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Dane Adkison', risk_score: 5, claim_amount: 250, total_claim: 18}]}},
        {"providerId": 40926608, networkChordData: {provider_matirx: [[0, 0, 1, 0, 1, 0, 1, 0, 1, 2, 1, 1, 0, 2, 0, 0, 0, 2, 1, 0], [1, 0, 5, 1, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 1, 0, 0, 1, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [1, 1, 1, 1, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [1, 0, 1, 0, 0, 0, 2, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1]], networkChordLabelData: [{name: 'John Smith', risk_score: 85, claim_amount: 650, total_claim: 28}, {name: 'Richard Green', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Mark Green', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Mark Lekar', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Elly Kocher', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Richard Lee', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Yuan Lee', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Susan White', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Sean Jay', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'April Sexer', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Ray Marble', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Tobey Houston', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Enny Joachim', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'John Davis', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Tim White', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Nitin Babu', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'John Black', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Nick Lehman', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Robert Junior', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Dane Adkison', risk_score: 5, claim_amount: 250, total_claim: 18}]}},
        {"providerId": 24329643, networkChordData: {provider_matirx: [[0, 0, 1, 0, 1, 0, 1, 0, 1, 2, 1, 1, 0, 2, 0, 0, 0, 2, 1, 0], [1, 0, 5, 1, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 1, 0, 0, 1, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [1, 1, 1, 1, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [1, 0, 1, 0, 0, 0, 2, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1]], networkChordLabelData: [{name: 'John Smith', risk_score: 85, claim_amount: 650, total_claim: 28}, {name: 'Richard Green', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Mark Green', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Mark Lekar', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Elly Kocher', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Richard Lee', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Yuan Lee', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Susan White', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Sean Jay', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'April Sexer', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Ray Marble', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Tobey Houston', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Enny Joachim', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'John Davis', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Tim White', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Nitin Babu', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'John Black', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Nick Lehman', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Robert Junior', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Dane Adkison', risk_score: 5, claim_amount: 250, total_claim: 18}]}},
        {"providerId": 79403874, networkChordData: {provider_matirx: [[0, 0, 1, 0, 1, 0, 1, 0, 1, 2, 1, 1, 0, 2, 0, 0, 0, 2, 1, 0], [1, 0, 5, 1, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 1, 0, 0, 1, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [1, 1, 1, 1, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [1, 0, 1, 0, 0, 0, 2, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1]], networkChordLabelData: [{name: 'John Smith', risk_score: 85, claim_amount: 650, total_claim: 28}, {name: 'Richard Green', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Mark Green', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Mark Lekar', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Elly Kocher', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Richard Lee', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Yuan Lee', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Susan White', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Sean Jay', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'April Sexer', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Ray Marble', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Tobey Houston', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Enny Joachim', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'John Davis', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Tim White', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Nitin Babu', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'John Black', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Nick Lehman', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Robert Junior', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Dane Adkison', risk_score: 5, claim_amount: 250, total_claim: 18}]}},
        {"providerId": 53831859, networkChordData: {provider_matirx: [[0, 0, 1, 0, 1, 0, 1, 0, 1, 2, 1, 1, 0, 2, 0, 0, 0, 2, 1, 0], [1, 0, 5, 1, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 1, 0, 0, 1, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [1, 1, 1, 1, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [1, 0, 1, 0, 0, 0, 2, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1]], networkChordLabelData: [{name: 'John Smith', risk_score: 85, claim_amount: 650, total_claim: 28}, {name: 'Richard Green', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Mark Green', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Mark Lekar', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Elly Kocher', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Richard Lee', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Yuan Lee', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Susan White', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Sean Jay', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'April Sexer', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Ray Marble', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Tobey Houston', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Enny Joachim', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'John Davis', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Tim White', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Nitin Babu', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'John Black', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Nick Lehman', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Robert Junior', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Dane Adkison', risk_score: 5, claim_amount: 250, total_claim: 18}]}},
        {"providerId": 76567667, networkChordData: {provider_matirx: [[0, 0, 5, 0, 1, 0, 1, 0, 1, 2, 1, 4, 5, 4, 0, 5, 0, 4, 1, 0], [1, 0, 5, 1, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 1, 0, 0, 1, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [1, 1, 1, 1, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [1, 0, 1, 0, 0, 0, 2, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 11, 1, 1, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 9, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1]], networkChordLabelData: [{name: 'John Smith', risk_score: 85, claim_amount: 650, total_claim: 28}, {name: 'Richard Green', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Mark Green', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Mark Lekar', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Elly Kocher', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Richard Lee', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Yuan Lee', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Susan White', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Sean Jay', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'April Sexer', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Ray Marble', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Tobey Houston', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Enny Joachim', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'John Davis', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Tim White', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Nitin Babu', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'John Black', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Nick Lehman', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Robert Junior', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Dane Adkison', risk_score: 5, claim_amount: 250, total_claim: 18}]}},
        {"providerId": 86637643, networkChordData: {provider_matirx: [[0, 0, 1, 0, 1, 0, 1, 0, 1, 2, 1, 1, 0, 2, 0, 0, 0, 2, 1, 0], [1, 0, 5, 1, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 7, 2, 0, 0, 0, 1], [0, 1, 0, 0, 1, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [1, 1, 1, 1, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [1, 0, 1, 0, 0, 0, 2, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 11, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1]], networkChordLabelData: [{name: 'John Smith', risk_score: 85, claim_amount: 650, total_claim: 28}, {name: 'Richard Green', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Mark Green', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Mark Lekar', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Elly Kocher', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Richard Lee', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Yuan Lee', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Susan White', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Sean Jay', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'April Sexer', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Ray Marble', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Tobey Houston', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Enny Joachim', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'John Davis', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Tim White', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Nitin Babu', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'John Black', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Nick Lehman', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Robert Junior', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Dane Adkison', risk_score: 5, claim_amount: 250, total_claim: 18}]}},
        {"providerId": 93367632, networkChordData: {provider_matirx: [[0, 0, 1, 0, 1, 0, 1, 0, 1, 2, 1, 1, 0, 1, 0, 2, 0, 2, 1, 0], [1, 0, 2, 1, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 1, 0, 0, 1, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [1, 1, 1, 1, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 11], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [1, 0, 1, 0, 0, 0, 2, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 7, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1]], networkChordLabelData: [{name: 'John Smith', risk_score: 85, claim_amount: 650, total_claim: 28}, {name: 'Richard Green', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Mark Green', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Mark Lekar', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Elly Kocher', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Richard Lee', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Yuan Lee', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Susan White', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Sean Jay', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'April Sexer', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Ray Marble', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Tobey Houston', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Enny Joachim', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'John Davis', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Tim White', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Nitin Babu', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'John Black', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Nick Lehman', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Robert Junior', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Dane Adkison', risk_score: 5, claim_amount: 250, total_claim: 18}]}},
        {"providerId": 86567234, networkChordData: {provider_matirx: [[0, 0, 1, 0, 1, 0, 1, 0, 1, 2, 1, 1, 0, 2, 0, 0, 0, 2, 1, 0], [1, 0, 5, 1, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 1, 0, 0, 1, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [1, 1, 1, 1, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [1, 0, 1, 0, 0, 0, 2, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1]], networkChordLabelData: [{name: 'John Smith', risk_score: 85, claim_amount: 650, total_claim: 28}, {name: 'Richard Green', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Mark Green', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Mark Lekar', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Elly Kocher', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Richard Lee', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Yuan Lee', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Susan White', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Sean Jay', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'April Sexer', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Ray Marble', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Tobey Houston', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Enny Joachim', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'John Davis', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Tim White', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Nitin Babu', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'John Black', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Nick Lehman', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Robert Junior', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Dane Adkison', risk_score: 5, claim_amount: 250, total_claim: 18}]}},
        {"providerId": 96567367, networkChordData: {provider_matirx: [[0, 0, 1, 0, 1, 0, 1, 0, 1, 2, 1, 1, 0, 2, 0, 0, 0, 2, 1, 0], [1, 0, 5, 1, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 1, 0, 0, 1, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [1, 1, 1, 1, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [1, 0, 1, 0, 0, 0, 2, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1]], networkChordLabelData: [{name: 'John Smith', risk_score: 85, claim_amount: 650, total_claim: 28}, {name: 'Richard Green', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Mark Green', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Mark Lekar', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Elly Kocher', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Richard Lee', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Yuan Lee', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Susan White', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Sean Jay', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'April Sexer', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Ray Marble', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Tobey Houston', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Enny Joachim', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'John Davis', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Tim White', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Nitin Babu', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'John Black', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Nick Lehman', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Robert Junior', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Dane Adkison', risk_score: 5, claim_amount: 250, total_claim: 18}]}},
        {"providerId": 29307171, networkChordData: {provider_matirx: [[0, 0, 1, 0, 1, 0, 1, 0, 1, 2, 1, 1, 0, 2, 0, 0, 0, 2, 1, 0], [1, 0, 5, 1, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 1, 0, 0, 1, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [1, 1, 1, 1, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 8, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [1, 0, 1, 0, 0, 0, 2, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 1, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 12, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1]], networkChordLabelData: [{name: 'John Smith', risk_score: 85, claim_amount: 650, total_claim: 28}, {name: 'Richard Green', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Mark Green', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Mark Lekar', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Elly Kocher', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Richard Lee', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Yuan Lee', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Susan White', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Sean Jay', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'April Sexer', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Ray Marble', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Tobey Houston', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Enny Joachim', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'John Davis', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Tim White', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Nitin Babu', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'John Black', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Nick Lehman', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Robert Junior', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Dane Adkison', risk_score: 5, claim_amount: 250, total_claim: 18}]}},
        {"providerId": 27815901, networkChordData: {provider_matirx: [[0, 0, 1, 0, 1, 0, 1, 0, 1, 2, 1, 1, 0, 2, 0, 0, 0, 2, 1, 0], [1, 0, 5, 1, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 11, 2, 0, 0, 0, 1], [0, 1, 0, 0, 1, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [1, 1, 1, 1, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [1, 0, 1, 0, 0, 0, 2, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 8, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1]], networkChordLabelData: [{name: 'John Smith', risk_score: 85, claim_amount: 650, total_claim: 28}, {name: 'Richard Green', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Mark Green', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Mark Lekar', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Elly Kocher', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Richard Lee', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Yuan Lee', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Susan White', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Sean Jay', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'April Sexer', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Ray Marble', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Tobey Houston', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Enny Joachim', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'John Davis', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Tim White', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Nitin Babu', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'John Black', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Nick Lehman', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Robert Junior', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Dane Adkison', risk_score: 5, claim_amount: 250, total_claim: 18}]}},
        {"providerId": 56781231, networkChordData: {provider_matirx: [[0, 0, 1, 0, 1, 0, 1, 0, 1, 2, 1, 1, 0, 2, 0, 0, 0, 2, 1, 0], [1, 0, 5, 1, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 1, 0, 0, 1, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [1, 1, 1, 1, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [1, 0, 1, 0, 0, 0, 2, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1]], networkChordLabelData: [{name: 'John Smith', risk_score: 85, claim_amount: 650, total_claim: 28}, {name: 'Richard Green', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Mark Green', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Mark Lekar', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Elly Kocher', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Richard Lee', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Yuan Lee', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Susan White', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Sean Jay', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'April Sexer', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Ray Marble', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Tobey Houston', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Enny Joachim', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'John Davis', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Tim White', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Nitin Babu', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'John Black', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Nick Lehman', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Robert Junior', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Dane Adkison', risk_score: 5, claim_amount: 250, total_claim: 18}]}},
        {"providerId": 65278001, networkChordData: {provider_matirx: [[0, 0, 1, 0, 1, 0, 1, 0, 1, 2, 1, 1, 0, 2, 0, 0, 0, 2, 1, 0], [1, 0, 5, 1, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 1, 0, 0, 1, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [1, 1, 1, 1, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [1, 0, 1, 0, 0, 0, 2, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1]], networkChordLabelData: [{name: 'John Smith', risk_score: 85, claim_amount: 650, total_claim: 28}, {name: 'Richard Green', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Mark Green', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Mark Lekar', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Elly Kocher', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Richard Lee', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Yuan Lee', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Susan White', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Sean Jay', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'April Sexer', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Ray Marble', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Tobey Houston', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Enny Joachim', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'John Davis', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Tim White', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Nitin Babu', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'John Black', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Nick Lehman', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Robert Junior', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Dane Adkison', risk_score: 5, claim_amount: 250, total_claim: 18}]}},
        {"providerId": 65278011, networkChordData: {provider_matirx: [[0, 0, 1, 0, 1, 0, 1, 0, 1, 2, 1, 1, 0, 2, 0, 0, 0, 2, 1, 0], [1, 0, 5, 1, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 1, 0, 0, 1, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [1, 1, 1, 1, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [1, 0, 1, 0, 0, 0, 2, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0, 0, 1]], networkChordLabelData: [{name: 'John Smith', risk_score: 85, claim_amount: 650, total_claim: 28}, {name: 'Richard Green', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Mark Green', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Mark Lekar', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Elly Kocher', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Richard Lee', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Yuan Lee', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Susan White', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Sean Jay', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'April Sexer', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Ray Marble', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Tobey Houston', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Enny Joachim', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'John Davis', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Tim White', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Nitin Babu', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'John Black', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Nick Lehman', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Robert Junior', risk_score: 5, claim_amount: 250, total_claim: 18}, {name: 'Dane Adkison', risk_score: 5, claim_amount: 250, total_claim: 18}]}},
    ],
    networkForceChartData: [
        {"providerId": 93847521, "nodes": [{"name": "Tim May", "group": 2, "size": 10.5857740586}, {"name": "Ray Green", "group": 2, "size": 10.0836820084}, {"name": "John Smith", "group": 3, "size": 25.0}, {"name": "Robby Thomas", "group": 2, "size": 12.0836820084}, {"name": "Christina Lee", "group": 2, "size": 15.0836820084}, {"name": "Sean Roy", "group": 2, "size": 10.0836820084}, {"name": "Eric Loe", "group": 2, "size": 10.0836820084}, {"name": "Tony Cima", "group": 2, "size": 11.2510460251}, {"name": "Tina Ray", "group": 2, "size": 9.2510460251}, {"name": "Sue Lee", "group": 2, "size": 10.2510460251}], "links": [{"source": 9, "target": 2, "value": 5, "pcolor": "Temp", "amount": 10.2}, {"source": 9, "target": 5, "value": 6, "pcolor": "Temp", "amount": 10.2}, {"source": 8, "target": 2, "value": 6, "pcolor": "Temp", "amount": 10.2}, {"source": 7, "target": 2, "value": 5, "pcolor": "Temp", "amount": 10.2}, {"source": 6, "target": 2, "value": 6, "pcolor": "Temp", "amount": 10.2}, {"source": 5, "target": 2, "value": 3, "pcolor": "Temp", "amount": 10.2}, {"source": 4, "target": 2, "value": 5, "pcolor": "Temp", "amount": 10.2}, {"source": 3, "target": 2, "value": 4, "pcolor": "Temp", "amount": 10.2}, {"source": 1, "target": 2, "value": 5, "pcolor": "Temp", "amount": 10.2}, {"source": 9, "target": 5, "value": 9, "pcolor": "Temp", "amount": 10.2}, {"source": 9, "target": 4, "value": 59, "pcolor": "Temp", "amount": 10.2}, {"source": 9, "target": 3, "value": 20, "pcolor": "Temp", "amount": 10.2}, {"source": 8, "target": 3, "value": 6, "pcolor": "Temp", "amount": 10.2}, {"source": 8, "target": 0, "value": 5, "pcolor": "Temp", "amount": 10.2}]},
        {"providerId": 48527633, "nodes": [{"name": "Tim May", "group": 2, "size": 10.5857740586}, {"name": "Ray Green", "group": 2, "size": 10.0836820084}, {"name": "Larry Bucshon", "group": 3, "size": 25.0}, {"name": "Robby Thomas", "group": 2, "size": 10.0836820084}, {"name": "Christina Lee", "group": 2, "size": 10.0836820084}, {"name": "Sean Roy", "group": 2, "size": 10.0836820084}, {"name": "Eric Loe", "group": 2, "size": 10.0836820084}, {"name": "Tony Cima", "group": 2, "size": 10.2510460251}, {"name": "Tina Ray", "group": 2, "size": 10.2510460251}, {"name": "Sue Lee", "group": 2, "size": 10.2510460251}], "links": [{"source": 9, "target": 2, "value": 1, "pcolor": "Temp", "amount": 10.2}, {"source": 9, "target": 5, "value": 6, "pcolor": "Temp", "amount": 10.2}, {"source": 8, "target": 2, "value": 6, "pcolor": "Temp", "amount": 10.2}, {"source": 7, "target": 2, "value": 5, "pcolor": "Temp", "amount": 10.2}, {"source": 6, "target": 2, "value": 6, "pcolor": "Temp", "amount": 10.2}, {"source": 5, "target": 2, "value": 3, "pcolor": "Temp", "amount": 10.2}, {"source": 4, "target": 2, "value": 1, "pcolor": "Temp", "amount": 10.2}, {"source": 3, "target": 2, "value": 4, "pcolor": "Temp", "amount": 10.2}, {"source": 1, "target": 2, "value": 1, "pcolor": "Temp", "amount": 10.2}, {"source": 9, "target": 5, "value": 9, "pcolor": "Temp", "amount": 10.2}, {"source": 9, "target": 4, "value": 19, "pcolor": "Temp", "amount": 10.2}, {"source": 9, "target": 3, "value": 20, "pcolor": "Temp", "amount": 10.2}, {"source": 8, "target": 3, "value": 1, "pcolor": "Temp", "amount": 10.2}, {"source": 8, "target": 0, "value": 1, "pcolor": "Temp", "amount": 10.2}]},
        {"providerId": 98235623, "nodes": [{"name": "Tim May", "group": 2, "size": 10.5857740586}, {"name": "Ray Green", "group": 2, "size": 10.0836820084}, {"name": "Larry Bucshon", "group": 3, "size": 25.0}, {"name": "Robby Thomas", "group": 2, "size": 10.0836820084}, {"name": "Christina Lee", "group": 2, "size": 10.0836820084}, {"name": "Sean Roy", "group": 2, "size": 10.0836820084}, {"name": "Eric Loe", "group": 2, "size": 10.0836820084}, {"name": "Tony Cima", "group": 2, "size": 10.2510460251}, {"name": "Tina Ray", "group": 2, "size": 10.2510460251}, {"name": "Sue Lee", "group": 2, "size": 10.2510460251}], "links": [{"source": 9, "target": 2, "value": 1, "pcolor": "Temp", "amount": 10.2}, {"source": 9, "target": 5, "value": 6, "pcolor": "Temp", "amount": 10.2}, {"source": 8, "target": 2, "value": 6, "pcolor": "Temp", "amount": 10.2}, {"source": 7, "target": 2, "value": 5, "pcolor": "Temp", "amount": 10.2}, {"source": 6, "target": 2, "value": 6, "pcolor": "Temp", "amount": 10.2}, {"source": 5, "target": 2, "value": 3, "pcolor": "Temp", "amount": 10.2}, {"source": 4, "target": 2, "value": 1, "pcolor": "Temp", "amount": 10.2}, {"source": 3, "target": 2, "value": 4, "pcolor": "Temp", "amount": 10.2}, {"source": 1, "target": 2, "value": 1, "pcolor": "Temp", "amount": 10.2}, {"source": 9, "target": 5, "value": 9, "pcolor": "Temp", "amount": 10.2}, {"source": 9, "target": 4, "value": 19, "pcolor": "Temp", "amount": 10.2}, {"source": 9, "target": 3, "value": 20, "pcolor": "Temp", "amount": 10.2}, {"source": 8, "target": 3, "value": 1, "pcolor": "Temp", "amount": 10.2}, {"source": 8, "target": 0, "value": 1, "pcolor": "Temp", "amount": 10.2}]},
        {"providerId": 40926608, "nodes": [{"name": "Tim May", "group": 2, "size": 10.5857740586}, {"name": "Ray Green", "group": 2, "size": 10.0836820084}, {"name": "Chuck Brown", "group": 3, "size": 25.0}, {"name": "Robby Thomas", "group": 2, "size": 10.0836820084}, {"name": "Christina Lee", "group": 2, "size": 10.0836820084}, {"name": "Sean Roy", "group": 2, "size": 10.0836820084}, {"name": "Eric Loe", "group": 2, "size": 10.0836820084}, {"name": "Tony Cima", "group": 2, "size": 10.2510460251}, {"name": "Tina Ray", "group": 2, "size": 10.2510460251}, {"name": "Sue Lee", "group": 2, "size": 10.2510460251}], "links": [{"source": 9, "target": 2, "value": 1, "pcolor": "Temp", "amount": 10.2}, {"source": 9, "target": 5, "value": 6, "pcolor": "Temp", "amount": 10.2}, {"source": 8, "target": 2, "value": 6, "pcolor": "Temp", "amount": 10.2}, {"source": 7, "target": 2, "value": 5, "pcolor": "Temp", "amount": 10.2}, {"source": 6, "target": 2, "value": 6, "pcolor": "Temp", "amount": 10.2}, {"source": 5, "target": 2, "value": 3, "pcolor": "Temp", "amount": 10.2}, {"source": 4, "target": 2, "value": 1, "pcolor": "Temp", "amount": 10.2}, {"source": 3, "target": 2, "value": 4, "pcolor": "Temp", "amount": 10.2}, {"source": 1, "target": 2, "value": 1, "pcolor": "Temp", "amount": 10.2}, {"source": 9, "target": 5, "value": 9, "pcolor": "Temp", "amount": 10.2}, {"source": 9, "target": 4, "value": 19, "pcolor": "Temp", "amount": 10.2}, {"source": 9, "target": 3, "value": 20, "pcolor": "Temp", "amount": 10.2}, {"source": 8, "target": 3, "value": 1, "pcolor": "Temp", "amount": 10.2}, {"source": 8, "target": 0, "value": 1, "pcolor": "Temp", "amount": 10.2}]},
        {"providerId": 24329643, "nodes": [{"name": "Tim May", "group": 2, "size": 10.5857740586}, {"name": "Ray Green", "group": 2, "size": 10.0836820084}, {"name": "Britni Murrow", "group": 3, "size": 25.0}, {"name": "Robby Thomas", "group": 2, "size": 10.0836820084}, {"name": "Christina Lee", "group": 2, "size": 10.0836820084}, {"name": "Sean Roy", "group": 2, "size": 10.0836820084}, {"name": "Eric Loe", "group": 2, "size": 10.0836820084}, {"name": "Tony Cima", "group": 2, "size": 10.2510460251}, {"name": "Tina Ray", "group": 2, "size": 10.2510460251}, {"name": "Sue Lee", "group": 2, "size": 10.2510460251}], "links": [{"source": 9, "target": 2, "value": 1, "pcolor": "Temp", "amount": 10.2}, {"source": 9, "target": 5, "value": 6, "pcolor": "Temp", "amount": 10.2}, {"source": 8, "target": 2, "value": 6, "pcolor": "Temp", "amount": 10.2}, {"source": 7, "target": 2, "value": 5, "pcolor": "Temp", "amount": 10.2}, {"source": 6, "target": 2, "value": 6, "pcolor": "Temp", "amount": 10.2}, {"source": 5, "target": 2, "value": 3, "pcolor": "Temp", "amount": 10.2}, {"source": 4, "target": 2, "value": 1, "pcolor": "Temp", "amount": 10.2}, {"source": 3, "target": 2, "value": 4, "pcolor": "Temp", "amount": 10.2}, {"source": 1, "target": 2, "value": 1, "pcolor": "Temp", "amount": 10.2}, {"source": 9, "target": 5, "value": 9, "pcolor": "Temp", "amount": 10.2}, {"source": 9, "target": 4, "value": 19, "pcolor": "Temp", "amount": 10.2}, {"source": 9, "target": 3, "value": 20, "pcolor": "Temp", "amount": 10.2}, {"source": 8, "target": 3, "value": 1, "pcolor": "Temp", "amount": 10.2}, {"source": 8, "target": 0, "value": 1, "pcolor": "Temp", "amount": 10.2}]},
        {"providerId": 79403874, "nodes": [{"name": "Tim May", "group": 2, "size": 10.5857740586}, {"name": "Ray Green", "group": 2, "size": 10.0836820084}, {"name": "Joe Heck", "group": 3, "size": 25.0}, {"name": "Robby Thomas", "group": 2, "size": 10.0836820084}, {"name": "Christina Lee", "group": 2, "size": 10.0836820084}, {"name": "Sean Roy", "group": 2, "size": 10.0836820084}, {"name": "Eric Loe", "group": 2, "size": 10.0836820084}, {"name": "Tony Cima", "group": 2, "size": 10.2510460251}, {"name": "Tina Ray", "group": 2, "size": 10.2510460251}, {"name": "Sue Lee", "group": 2, "size": 10.2510460251}], "links": [{"source": 9, "target": 2, "value": 1, "pcolor": "Temp", "amount": 10.2}, {"source": 9, "target": 5, "value": 6, "pcolor": "Temp", "amount": 10.2}, {"source": 8, "target": 2, "value": 6, "pcolor": "Temp", "amount": 10.2}, {"source": 7, "target": 2, "value": 5, "pcolor": "Temp", "amount": 10.2}, {"source": 6, "target": 2, "value": 6, "pcolor": "Temp", "amount": 10.2}, {"source": 5, "target": 2, "value": 3, "pcolor": "Temp", "amount": 10.2}, {"source": 4, "target": 2, "value": 1, "pcolor": "Temp", "amount": 10.2}, {"source": 3, "target": 2, "value": 4, "pcolor": "Temp", "amount": 10.2}, {"source": 1, "target": 2, "value": 1, "pcolor": "Temp", "amount": 10.2}, {"source": 9, "target": 5, "value": 9, "pcolor": "Temp", "amount": 10.2}, {"source": 9, "target": 4, "value": 19, "pcolor": "Temp", "amount": 10.2}, {"source": 9, "target": 3, "value": 20, "pcolor": "Temp", "amount": 10.2}, {"source": 8, "target": 3, "value": 1, "pcolor": "Temp", "amount": 10.2}, {"source": 8, "target": 0, "value": 1, "pcolor": "Temp", "amount": 10.2}]},
        {"providerId": 53831859, "nodes": [{"name": "Tim May", "group": 2, "size": 10.5857740586}, {"name": "Ray Green", "group": 2, "size": 10.0836820084}, {"name": "Susan White", "group": 3, "size": 25.0}, {"name": "Robby Thomas", "group": 2, "size": 10.0836820084}, {"name": "Christina Lee", "group": 2, "size": 10.0836820084}, {"name": "Sean Roy", "group": 2, "size": 10.0836820084}, {"name": "Eric Loe", "group": 2, "size": 10.0836820084}, {"name": "Tony Cima", "group": 2, "size": 10.2510460251}, {"name": "Tina Ray", "group": 2, "size": 10.2510460251}, {"name": "Sue Lee", "group": 2, "size": 10.2510460251}], "links": [{"source": 9, "target": 2, "value": 1, "pcolor": "Temp", "amount": 10.2}, {"source": 9, "target": 5, "value": 6, "pcolor": "Temp", "amount": 10.2}, {"source": 8, "target": 2, "value": 6, "pcolor": "Temp", "amount": 10.2}, {"source": 7, "target": 2, "value": 5, "pcolor": "Temp", "amount": 10.2}, {"source": 6, "target": 2, "value": 6, "pcolor": "Temp", "amount": 10.2}, {"source": 5, "target": 2, "value": 3, "pcolor": "Temp", "amount": 10.2}, {"source": 4, "target": 2, "value": 1, "pcolor": "Temp", "amount": 10.2}, {"source": 3, "target": 2, "value": 4, "pcolor": "Temp", "amount": 10.2}, {"source": 1, "target": 2, "value": 1, "pcolor": "Temp", "amount": 10.2}, {"source": 9, "target": 5, "value": 9, "pcolor": "Temp", "amount": 10.2}, {"source": 9, "target": 4, "value": 19, "pcolor": "Temp", "amount": 10.2}, {"source": 9, "target": 3, "value": 20, "pcolor": "Temp", "amount": 10.2}, {"source": 8, "target": 3, "value": 1, "pcolor": "Temp", "amount": 10.2}, {"source": 8, "target": 0, "value": 1, "pcolor": "Temp", "amount": 10.2}]},
    ],
    networkHeatMapPhysicianChartData: {mapRefPhysician: ['Dane Adkison', 'Richard Green', 'John Smith', 'Larry Bucshon', 'Chuck Brown', 'Britni Murrow', 'Joe Heck', 'Susan White'], mapPerPhysician: ['Kim Smith', 'April Sexer', 'Ray Marble', 'Tobey Houston', 'Enny Joachim', 'John Davis', 'Elly Kocher', 'Nitin Babu', 'Yuan Lee', 'Nick Lehman', 'Robert Junior', 'Mark Green']},
    networkPhyChartData: {mapRefPhysician: ['Mark Lekar', 'Richard Green', 'Susan White', 'Tim White', 'John Black', 'Richard Lee', 'John Smith', 'Sean Jay'], mapPerPhysician: ['John Black', 'Richard Green', 'Dane Adkison', 'Tim White', 'Mark Lekar', 'John Davis', 'Elly Kocher', 'Nitin Babu', 'Yuan Lee', 'Nick Lehman', 'Robert Junior', 'Mark Green']},
    networkHeatMapChartData: [
        {"providerId": 93847521, providerName: "John Smith", performerName: "John Smith", risk_score_matrix_ref: [12, 50, 65, 80, 43, 65, 34, 23], risk_score_matrix_pef: [22, 13, 32, 55, 43, 68, 12, 72, 12, 72, 34, 65]},
        {"providerId": 48527633, providerName: "Larry Bucshon", performerName: "John Smith", risk_score_matrix_ref: [51, 13, 85, 80, 42, 70, 34, 23], risk_score_matrix_pef: [55, 13, 12, 75, 43, 90, 12, 72, 12, 72, 34, 65]},
        {"providerId": 98235623, providerName: "Larry Bucshon", performerName: "John Smith", risk_score_matrix_ref: [51, 13, 85, 80, 42, 70, 34, 23], risk_score_matrix_pef: [55, 13, 12, 75, 43, 90, 12, 72, 12, 72, 34, 65]},
        {"providerId": 40926608, providerName: "Chuck Brown", performerName: "John Smith", risk_score_matrix_ref: [75, 50, 12, 80, 43, 70, 34, 23], risk_score_matrix_pef: [55, 75, 12, 55, 43, 70, 12, 72, 12, 72, 34, 65]},
        {"providerId": 24329643, providerName: "Britni Murrow", performerName: "John Smith", risk_score_matrix_ref: [65, 50, 65, 13, 43, 70, 34, 23], risk_score_matrix_pef: [12, 55, 75, 13, 43, 70, 12, 72, 12, 72, 34, 65]},
        {"providerId": 79403874, providerName: "Joe Heck", performerName: "John Smith", risk_score_matrix_ref: [12, 50, 65, 80, 43, 80, 34, 23], risk_score_matrix_pef: [85, 13, 12, 55, 43, 80, 12, 72, 12, 72, 34, 65]},
        {"providerId": 53831859, providerName: "Susan White", performerName: "John Smith", risk_score_matrix_ref: [68, 50, 65, 80, 43, 80, 34, 23], risk_score_matrix_pef: [12, 50, 55, 55, 13, 80, 45, 65, 13, 12, 12, 72, 12, 72, 34, 65]},
        {"providerId": 76567667, providerName: "Susan White", performerName: "John Black", risk_score_matrix_ref: [90, 12, 65, 80, 43, 50, 34, 23], risk_score_matrix_pef: [91, 13, 12, 55, 43, 50, 45, 65, 13, 12, 12, 72, 12, 72, 34, 65]},
        {"providerId": 86637643, providerName: "Tim White", performerName: "Richard Green", risk_score_matrix_ref: [12, 50, 90, 60, 43, 70, 34, 23], risk_score_matrix_pef: [12, 93, 12, 30, 43, 30, 12, 72, 12, 72, 34, 65]},
        {"providerId": 93367632, providerName: "Mark Lekar", performerName: "Dane Adkison", risk_score_matrix_ref: [51, 13, 60, 70, 90, 42, 34, 23], risk_score_matrix_pef: [55, 13, 91, 65, 43, 40, 12, 72, 12, 72, 34, 65]},
        {"providerId": 86567234, providerName: "Britni Murrow", performerName: "John Smith", risk_score_matrix_ref: [95, 50, 12, 80, 43, 90, 34, 23], risk_score_matrix_pef: [55, 95, 12, 55, 43, 90, 12, 72, 12, 72, 34, 65]},
        {"providerId": 96567367, providerName: "John White", performerName: "John Smith", risk_score_matrix_ref: [65, 50, 65, 13, 43, 90, 34, 23], risk_score_matrix_pef: [12, 55, 95, 13, 43, 90, 12, 72, 12, 72, 34, 65]},
        {"providerId": 29307171, providerName: "John Black", performerName: "Mark Lekar", risk_score_matrix_ref: [12, 90, 65, 80, 43, 70, 34, 23], risk_score_matrix_pef: [12, 13, 12, 55, 91, 70, 12, 72, 12, 72, 34, 65]},
        {"providerId": 27815901, providerName: "Richard Green", performerName: "Tim White", risk_score_matrix_ref: [12, 50, 65, 90, 43, 70, 34, 23], risk_score_matrix_pef: [12, 13, 12, 95, 43, 70, 12, 72, 12, 72, 34, 65]},
        {"providerId": 56781231, providerName: "Dane Adkison", performerName: "John Smith", risk_score_matrix_ref: [51, 13, 85, 80, 42, 90, 34, 23], risk_score_matrix_pef: [55, 13, 12, 95, 43, 90, 12, 72, 12, 72, 34, 65]},
        {"providerId": 65278001, providerName: "Howard White", performerName: "John Smith", risk_score_matrix_ref: [95, 50, 12, 80, 43, 90, 34, 23], risk_score_matrix_pef: [55, 95, 12, 55, 43, 90, 12, 72, 12, 72, 34, 65]},
        {"providerId": 65278011, providerName: "Randal Ray", performerName: "John Smith", risk_score_matrix_ref: [65, 50, 65, 13, 43, 90, 34, 23], risk_score_matrix_pef: [12, 55, 95, 13, 43, 90, 12, 72, 12, 72, 34, 65]},
    ],
    providerDashboardData: [
        {label: "", type: 'provider', times: [{"starting_time": new Date(2013, 07, 01).getTime(), "due_date": new Date(2014, 01, 14).getTime(), providerId: '93847521', provider: 'John Smith', amount: 1256, status: 'Investing', services: 'Clinic/Lab', rej_reason: 'Unbundling', risk_score: 2, "provider_group": "Newport"}]},
        {label: "", type: 'provider', times: [{"starting_time": new Date(2013, 08, 01).getTime(), "due_date": new Date(2014, 04, 01).getTime(), providerId: '98235623', provider: 'John Black', amount: 1768, status: 'Investing', services: 'Clinic/Lab', rej_reason: 'Network Fraud', risk_score: 4, "provider_group": "Northwest"}]},
        {label: "", type: 'provider', times: [{"starting_time": new Date(2013, 09, 20).getTime(), "due_date": new Date(2014, 04, 01).getTime(), providerId: '40926608', provider: 'Tim Ray', amount: 768, status: 'Investing', services: 'Clinic/Lab', rej_reason: 'Provider Fraud', risk_score: 9, "provider_group": "South Region"}]},
        {label: "", type: 'provider', times: [{"starting_time": new Date(2013, 10, 01).getTime(), "due_date": new Date(2014, 05, 01).getTime(), providerId: '24329643', provider: 'Britni Murrow', amount: 2322, status: 'Investing', services: 'Clinic/Lab', rej_reason: 'Provider Fraud', risk_score: 5, "provider_group": "Mountain Hill"}]},
        {label: "", type: 'provider', times: [{"starting_time": new Date(2014, 01, 15).getTime(), "due_date": new Date(2014, 08, 01).getTime(), providerId: '79403874', provider: 'Ray Green', amount: 2327, status: 'Investing', services: 'Clinic/Lab', rej_reason: 'Unbundling', risk_score: 3, "provider_group": "Freeport"}]},
        {label: "", type: 'provider', times: [{"starting_time": new Date(2014, 01, 16).getTime(), "due_date": new Date(2014, 07, 01).getTime(), providerId: '53831859', provider: 'Susan White', amount: 2327, status: 'Investing', services: 'Clinic/Lab', rej_reason: 'Unbundling', risk_score: 3, "provider_group": "Holander"}]},
        {label: "", type: 'member', times: [{"starting_time": new Date(2013, 07, 01).getTime(), "due_date": new Date(2014, 02, 01).getTime(), providerId: '29307171', provider: 'John Smith', amount: 1256, status: 'Investing', services: 'Clinic/Lab', rej_reason: 'Unbundling', risk_score: 2, "provider_group": "Newport"}]},
        {label: "", type: 'member', times: [{"starting_time": new Date(2013, 11, 01).getTime(), "due_date": new Date(2014, 06, 01).getTime(), providerId: '27815901', provider: 'Richard Green', amount: 1768, status: 'Investing', services: 'Clinic/Lab', rej_reason: 'Network Fraud', risk_score: 4, "provider_group": "Northwest"}]},
        {label: "", type: 'member', times: [{"starting_time": new Date(2014, 00, 01).getTime(), "due_date": new Date(2014, 09, 01).getTime(), providerId: '56781231', provider: 'Dane Adkison', amount: 768, status: 'Investing', services: 'Clinic/Lab', rej_reason: 'Provider Fraud', risk_score: 9, "provider_group": "South Region"}]},
        {label: "", type: 'member', times: [{"starting_time": new Date(2014, 00, 26).getTime(), "due_date": new Date(2014, 09, 01).getTime(), providerId: '65278001', provider: 'Britni Murrow', amount: 2322, status: 'Investing', services: 'Clinic/Lab', rej_reason: 'Provider Fraud', risk_score: 5, "provider_group": "Mountain Hill"}]},
        {label: "", type: 'member', times: [{"starting_time": new Date(2013, 08, 01).getTime(), "due_date": new Date(2014, 04, 01).getTime(), providerId: '65278011', provider: 'Randal White', amount: 2327, status: 'Investing', services: 'Clinic/Lab', rej_reason: 'Unbundling', risk_score: 3, "provider_group": "Freeport"}]},
        {label: "", type: 'network', times: [{"starting_time": new Date(2013, 08, 01).getTime(), "due_date": new Date(2014, 05, 01).getTime(), providerId: '76567667', provider: 'Susan White', memberId: '29307171', member: 'John Smith', amount: 1256, status: 'Investing', services: 'Clinic/Lab', rej_reason: 'Unbundling', risk_score: 2, "provider_group": "Newport"}]},
        {label: "", type: 'network', times: [{"starting_time": new Date(2014, 00, 26).getTime(), "due_date": new Date(2014, 09, 01).getTime(), providerId: '98235623', provider: 'Tim White', memberId: '29307171', member: 'Richard Green', amount: 1768, status: 'Investing', services: 'Clinic/Lab', rej_reason: 'Network Fraud', risk_score: 4, "provider_group": "Northwest"}]},
        {label: "", type: 'network', times: [{"starting_time": new Date(2014, 00, 01).getTime(), "due_date": new Date(2014, 06, 01).getTime(), providerId: '93367632', provider: 'Mark Lekar', memberId: '56781231', member: 'Dane Adkison', amount: 768, status: 'Investing', services: 'Clinic/Lab', rej_reason: 'Network Fraud', risk_score: 9, "provider_group": "South Region"}]},
        {label: "", type: 'network', times: [{"starting_time": new Date(2014, 00, 01).getTime(), "due_date": new Date(2014, 10, 01).getTime(), providerId: '86567234', provider: 'Britni Murrow', memberId: '65278001', member: 'Haword White', amount: 2322, status: 'Investing', services: 'Clinic/Lab', rej_reason: 'Provider Fraud', risk_score: 5, "provider_group": "Mountain Hill"}]},
        {label: "", type: 'network', times: [{"starting_time": new Date(2014, 00, 26).getTime(), "due_date": new Date(2014, 06, 01).getTime(), providerId: '96567367', provider: 'John White', memberId: '65278011', member: 'Randal White', amount: 2327, status: 'Investing', services: 'Clinic/Lab', rej_reason: 'Unbundling', risk_score: 3, "provider_group": "Freeport"}]}

    ],
    /*** END Data related to Active Cases **/
    bitoolChartData: [
        {"providerId": "93847521",
            "barChart": {"value": [{"name": 'MA+Enc Svcs Pd(Plan Reported)(This)', "data": [200]}, {"name": 'MA+Enc Svcs Pd(Plan Reported)(This)', "data": [100]}], "title": 'Top 50 Physicians for E&M Codes', "categories": ['93847521-PHYSICIAN']},
            "stackChart": {"value": [{"name": '99214 OFFICE/OUTPATIENT VISIT EST', "data": [75, 79, 36, 43, 85, 65, 85, 88, 60, 43, 45, 40]}, {"name": '99213 OFFICE/OUTPATIENT VISIT EST', "data": [3, 5, 2, 1, 1, 1, 2, 2, 30, 55, 54, 56]}, {"name": '99215 OFFICE/OUTPATIENT VISIT EST', "data": [22, 15, 15, 16, 14, 14, 13, 10, 10, 2, 1, 4]}, {"name": '99212 OFFICE/OUTPATIENT VISIT EST', "data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}], "title": 'Claim Count Percent Share by Procedure Summary', "categories": ['01/2011', '', '03/2011', '', '05/2011', '', '07/2011', '', '09/2011', '', '11/2011', '']},
            "pieChart": {"value": [['99214 OFFICE/OUTPATIENT VISIT EST', 75], ['99213 OFFICE/OUTPATIENT VISIT EST', 16], {name: '99215 OFFICE/OUTPATIENT VISIT EST', y: 9, sliced: true, selected: true}, ['99212 OFFICE/OUTPATIENT VISIT EST', 0.1]], "title": 'Claim Count Mix by Procedure Summary'},
            "lineChart": {"value": [{"name": '22133454', "data": [1200, 1203, 1300, 1280, 1300, 1280, 1200, 1300, 1405, 1410, 1410, 1400]}, {"name": 'PHYSICIAN', "data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ]}, {"name": 'Others', "data": [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100]}], "title": 'Physician vs. All Others', "categories": ['01/2011', '', '03/2011', '', '05/2011', '', '07/2011', '', '09/2011', '', '11/2011', '']}

        },
        {"providerId": "98235623",
            "barChart": {"value": [{"name": 'MA+Enc Svcs Pd(Plan Reported)(This)', "data": [220]}, {"name": 'MA+Enc Svcs Pd(Plan Reported)(This)', "data": [80]}], "title": 'Top 50 Physicians for E&M Codes', "categories": ['98235623-PHYSICIAN']},
            "stackChart": {"value": [{"name": '99214 OFFICE/OUTPATIENT VISIT EST', "data": [75, 80, 83, 83, 85, 85, 85, 88, 60, 43, 45, 40]}, {"name": '99213 OFFICE/OUTPATIENT VISIT EST', "data": [3, 5, 2, 1, 1, 1, 2, 2, 30, 55, 54, 56]}, {"name": '99215 OFFICE/OUTPATIENT VISIT EST', "data": [22, 15, 15, 16, 14, 14, 13, 10, 10, 2, 1, 4]}, {"name": '99212 OFFICE/OUTPATIENT VISIT EST', "data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}], "title": 'Claim Count Percent Share by Procedure Summary', "categories": ['01/2011', '', '03/2011', '', '05/2011', '', '07/2011', '', '09/2011', '', '11/2011', '']},
            "pieChart": {"value": [['99214 OFFICE/OUTPATIENT VISIT EST', 45], ['99213 OFFICE/OUTPATIENT VISIT EST', 45], {name: '99215 OFFICE/OUTPATIENT VISIT EST', y: 9, sliced: true, selected: true}, ['99212 OFFICE/OUTPATIENT VISIT EST', 0.1]], "title": 'Claim Count Mix by Procedure Summary'},
            "lineChart": {"value": [{"name": '22133454', "data": [1200, 1203, 1300, 1280, 1300, 1280, 1200, 1300, 1405, 1410, 1410, 1400]}, {"name": 'PHYSICIAN', "data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ]}, {"name": 'Others', "data": [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100]}], "title": 'Physician vs. All Others', "categories": ['01/2011', '', '03/2011', '', '05/2011', '', '07/2011', '', '09/2011', '', '11/2011', '']}
        },
        {"providerId": "40926608",
            "barChart": {"value": [{"name": 'MA+Enc Svcs Pd(Plan Reported)(This)', "data": [300]}, {"name": 'MA+Enc Svcs Pd(Plan Reported)(This)', "data": [120]}], "title": 'Top 50 Physicians for E&M Codes', "categories": ['40926608-PHYSICIAN']},
            "stackChart": {"value": [{"name": '99214 OFFICE/OUTPATIENT VISIT EST', "data": [75, 79, 36, 43, 85, 65, 85, 88, 60, 43, 45, 40]}, {"name": '99213 OFFICE/OUTPATIENT VISIT EST', "data": [3, 5, 2, 1, 1, 1, 2, 2, 30, 55, 54, 56]}, {"name": '99215 OFFICE/OUTPATIENT VISIT EST', "data": [22, 15, 15, 16, 14, 14, 13, 10, 10, 2, 1, 4]}, {"name": '99212 OFFICE/OUTPATIENT VISIT EST', "data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}], "title": 'Claim Count Percent Share by Procedure Summary', "categories": ['01/2011', '', '03/2011', '', '05/2011', '', '07/2011', '', '09/2011', '', '11/2011', '']},
            "pieChart": {"value": [['99214 OFFICE/OUTPATIENT VISIT EST', 55], ['99213 OFFICE/OUTPATIENT VISIT EST', 21], {name: '99215 OFFICE/OUTPATIENT VISIT EST', y: 23, sliced: true, selected: true}, ['99212 OFFICE/OUTPATIENT VISIT EST', 0.1]], "title": 'Claim Count Mix by Procedure Summary'},
            "lineChart": {"value": [{"name": '22133454', "data": [1200, 1203, 1300, 1280, 1300, 1280, 1200, 1300, 1405, 1410, 1410, 1400]}, {"name": 'PHYSICIAN', "data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ]}, {"name": 'Others', "data": [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100]}], "title": 'Physician vs. All Others', "categories": ['01/2011', '', '03/2011', '', '05/2011', '', '07/2011', '', '09/2011', '', '11/2011', '']}

        },
        {"providerId": "24329643",
            "barChart": {"value": [{"name": 'MA+Enc Svcs Pd(Plan Reported)(This)', "data": [230]}, {"name": 'MA+Enc Svcs Pd(Plan Reported)(This)', "data": [100]}], "title": 'Top 50 Physicians for E&M Codes', "categories": ['24329643-PHYSICIAN']},
            "stackChart": {"value": [{"name": '99214 OFFICE/OUTPATIENT VISIT EST', "data": [75, 80, 83, 83, 85, 85, 85, 88, 60, 43, 45, 40]}, {"name": '99213 OFFICE/OUTPATIENT VISIT EST', "data": [3, 5, 2, 1, 1, 1, 2, 2, 30, 55, 54, 56]}, {"name": '99215 OFFICE/OUTPATIENT VISIT EST', "data": [22, 15, 15, 16, 14, 14, 13, 10, 10, 2, 1, 4]}, {"name": '99212 OFFICE/OUTPATIENT VISIT EST', "data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}], "title": 'Claim Count Percent Share by Procedure Summary', "categories": ['01/2011', '', '03/2011', '', '05/2011', '', '07/2011', '', '09/2011', '', '11/2011', '']},
            "pieChart": {"value": [['99214 OFFICE/OUTPATIENT VISIT EST', 75], ['99213 OFFICE/OUTPATIENT VISIT EST', 16], {name: '99215 OFFICE/OUTPATIENT VISIT EST', y: 9, sliced: true, selected: true}, ['99212 OFFICE/OUTPATIENT VISIT EST', 0.1]], "title": 'Claim Count Mix by Procedure Summary'},
            "lineChart": {"value": [{"name": '22133454', "data": [1200, 1203, 1300, 1280, 1300, 1280, 1200, 1300, 1405, 1410, 1410, 1400]}, {"name": 'PHYSICIAN', "data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ]}, {"name": 'Others', "data": [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100]}], "title": 'Physician vs. All Others', "categories": ['01/2011', '', '03/2011', '', '05/2011', '', '07/2011', '', '09/2011', '', '11/2011', '']}
        },
        {"providerId": "79403874",
            "barChart": {"value": [{"name": 'MA+Enc Svcs Pd(Plan Reported)(This)', "data": [250]}, {"name": 'MA+Enc Svcs Pd(Plan Reported)(This)', "data": [120]}], "title": 'Top 50 Physicians for E&M Codes', "categories": ['79403874-PHYSICIAN']},
            "stackChart": {"value": [{"name": '99214 OFFICE/OUTPATIENT VISIT EST', "data": [75, 79, 36, 43, 85, 65, 85, 88, 60, 43, 45, 40]}, {"name": '99213 OFFICE/OUTPATIENT VISIT EST', "data": [3, 5, 2, 1, 1, 1, 2, 2, 30, 55, 54, 56]}, {"name": '99215 OFFICE/OUTPATIENT VISIT EST', "data": [22, 15, 15, 16, 14, 14, 13, 10, 10, 2, 1, 4]}, {"name": '99212 OFFICE/OUTPATIENT VISIT EST', "data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}], "title": 'Claim Count Percent Share by Procedure Summary', "categories": ['01/2011', '', '03/2011', '', '05/2011', '', '07/2011', '', '09/2011', '', '11/2011', '']},
            "pieChart": {"value": [['99214 OFFICE/OUTPATIENT VISIT EST', 75], ['99213 OFFICE/OUTPATIENT VISIT EST', 16], {name: '99215 OFFICE/OUTPATIENT VISIT EST', y: 9, sliced: true, selected: true}, ['99212 OFFICE/OUTPATIENT VISIT EST', 0.1]], "title": 'Claim Count Mix by Procedure Summary'},
            "lineChart": {"value": [{"name": '22133454', "data": [1200, 1203, 1300, 1280, 1300, 1280, 1200, 1300, 1405, 1410, 1410, 1400]}, {"name": 'PHYSICIAN', "data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ]}, {"name": 'Others', "data": [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100]}], "title": 'Physician vs. All Others', "categories": ['01/2011', '', '03/2011', '', '05/2011', '', '07/2011', '', '09/2011', '', '11/2011', '']}

        },
        {"providerId": "53831859",
            "barChart": {"value": [{"name": 'MA+Enc Svcs Pd(Plan Reported)(This)', "data": [240]}, {"name": 'MA+Enc Svcs Pd(Plan Reported)(This)', "data": [100]}], "title": 'Top 50 Physicians for E&M Codes', "categories": ['53831859-PHYSICIAN']},
            "stackChart": {"value": [{"name": '99214 OFFICE/OUTPATIENT VISIT EST', "data": [75, 80, 83, 83, 85, 85, 85, 88, 60, 43, 45, 40]}, {"name": '99213 OFFICE/OUTPATIENT VISIT EST', "data": [3, 5, 2, 1, 1, 1, 2, 2, 30, 55, 54, 56]}, {"name": '99215 OFFICE/OUTPATIENT VISIT EST', "data": [22, 15, 15, 16, 14, 14, 13, 10, 10, 2, 1, 4]}, {"name": '99212 OFFICE/OUTPATIENT VISIT EST', "data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}], "title": 'Claim Count Percent Share by Procedure Summary', "categories": ['01/2011', '', '03/2011', '', '05/2011', '', '07/2011', '', '09/2011', '', '11/2011', '']},
            "pieChart": {"value": [['99214 OFFICE/OUTPATIENT VISIT EST', 75], ['99213 OFFICE/OUTPATIENT VISIT EST', 16], {name: '99215 OFFICE/OUTPATIENT VISIT EST', y: 9, sliced: true, selected: true}, ['99212 OFFICE/OUTPATIENT VISIT EST', 0.1]], "title": 'Claim Count Mix by Procedure Summary'},
            "lineChart": {"value": [{"name": '22133454', "data": [1200, 1203, 1300, 1280, 1300, 1280, 1200, 1300, 1405, 1410, 1410, 1400]}, {"name": 'PHYSICIAN', "data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ]}, {"name": 'Others', "data": [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100]}], "title": 'Physician vs. All Others', "categories": ['01/2011', '', '03/2011', '', '05/2011', '', '07/2011', '', '09/2011', '', '11/2011', '']}
        }
    ],
    explorerChartData: [
        {"providerId": "93847521",
            "barChart": {"value": [{"name": 'MA+Enc Svcs Pd(Plan Reported)(This)', "data": [200]}, {"name": 'MA+Enc Svcs Pd(Plan Reported)(This)', "data": [100]}], "title": 'Services Paid This Year vs. Last Year', "categories": ['PSC PSY & NERURO:PSYCHIATRY (NOT CHILD)']},
            "scatterChart": {"value": [{name: 'Cost', color: '#f06f07', data: [[161.2, 51.6], [167.5, 59], [159.5, 49.2], [157, 63], [155.8, 53.6], [170, 59], [159.1, 47.6], [166, 69.8], [176.2, 66.8], [160.2, 75.2], [172.5, 55.2], [170.9, 54.2], [172.9, 62.5], [153.4, 42], [160, 50], [147.2, 49.8], [168.2, 49.2], [175, 73.2], [157, 47.8], [167.6, 68.8], [159.5, 50.6], [175, 82.5], [166.8, 57.2], [176.5, 87.8], [170.2, 72.8], [174, 54.5], [173, 59.8], [179.9, 67.3], [170.5, 67.8], [160, 47]]}], "title": 'High cost Recipients', "categories": ['MA + ENc Services Pd(Plan Reported)', 'MA + Enc Service Claim Claim Ct']},
            "pieChart": {"value": [['PRENATAK/POSTPARTUM CARE', 40], ['99213 OFFICE/OUTPATIENT VISIT EST', 30], {name: '99215 OFFICE/OUTPATIENT VISIT EST', y: 17, sliced: true, selected: true}, ['99212 OFFICE/OUTPATIENT VISIT EST', 10], ['99214 OFFICE/OUTPATIENT VISIT EST', 3]], "title": 'Services Paid By MNCOR'},
            "barChartSecond": {"value": [{"name": 'MA+Enc Svcs Pd(Plan Reported)(This)', "data": [400]}, {"name": 'MA+Enc Svcs Pd(Plan Reported)(Last)', "data": [300]}, {"name": 'MA+Enc Service Claim Ct(This)', "data": [340]}, {"name": 'MA+Enc Service Claim Ct(Last)', "data": [250]}], "title": 'Services Paid & Claim Courts by Provider ', "categories": ['34346010-PHYSICIAN']}
        },
        {"providerId": "48527633",
            "barChart": {"value": [{"name": 'MA+Enc Svcs Pd(Plan Reported)(This)', "data": [300]}, {"name": 'MA+Enc Svcs Pd(Plan Reported)(This)', "data": [130]}], "title": 'Services Paid This Year vs. Last Year', "categories": ['PSC PSY & NERURO:PSYCHIATRY (NOT CHILD)']},
            "scatterChart": {"value": [{name: 'Cost', color: '#f06f07', data: [[161.2, 57.6], [167.5, 59], [159.5, 59.2], [157, 63], [155.8, 63.6], [170, 59], [159.1, 57.6], [166, 69.8], [176.2, 66.8], [160.2, 75.2], [172.5, 55.2], [170.9, 54.2], [172.9, 62.5], [153.4, 42], [160, 50], [147.2, 49.8], [168.2, 49.2], [175, 73.2], [157, 47.8], [167.6, 68.8], [159.5, 50.6], [175, 82.5], [166.8, 57.2], [176.5, 87.8], [170.2, 72.8], [174, 54.5], [173, 59.8], [179.9, 67.3], [170.5, 67.8], [160, 47]]}], "title": 'High cost Recipients', "categories": ['MA + ENc Services Pd(Plan Reported)', 'MA + Enc Service Claim Claim Ct']},
            "pieChart": {"value": [['PRENATAK/POSTPARTUM CARE', 50], ['99213 OFFICE/OUTPATIENT VISIT EST', 20], {name: '99215 OFFICE/OUTPATIENT VISIT EST', y: 17, sliced: true, selected: true}, ['99212 OFFICE/OUTPATIENT VISIT EST', 10], ['99214 OFFICE/OUTPATIENT VISIT EST', 3]], "title": 'Services Paid By MNCOR'},
            "barChartSecond": {"value": [{"name": 'MA+Enc Svcs Pd(Plan Reported)(This)', "data": [500]}, {"name": 'MA+Enc Svcs Pd(Plan Reported)(Last)', "data": [200]}, {"name": 'MA+Enc Service Claim Ct(This)', "data": [340]}, {"name": 'MA+Enc Service Claim Ct(Last)', "data": [250]}], "title": 'Services Paid & Claim Courts by Provider ', "categories": ['34346010-PHYSICIAN']}
        },		
        {"providerId": "98235623",
            "barChart": {"value": [{"name": 'MA+Enc Svcs Pd(Plan Reported)(This)', "data": [300]}, {"name": 'MA+Enc Svcs Pd(Plan Reported)(This)', "data": [130]}], "title": 'Services Paid This Year vs. Last Year', "categories": ['PSC PSY & NERURO:PSYCHIATRY (NOT CHILD)']},
            "scatterChart": {"value": [{name: 'Cost', color: '#f06f07', data: [[161.2, 57.6], [167.5, 59], [159.5, 59.2], [157, 63], [155.8, 63.6], [170, 59], [159.1, 57.6], [166, 69.8], [176.2, 66.8], [160.2, 75.2], [172.5, 55.2], [170.9, 54.2], [172.9, 62.5], [153.4, 42], [160, 50], [147.2, 49.8], [168.2, 49.2], [175, 73.2], [157, 47.8], [167.6, 68.8], [159.5, 50.6], [175, 82.5], [166.8, 57.2], [176.5, 87.8], [170.2, 72.8], [174, 54.5], [173, 59.8], [179.9, 67.3], [170.5, 67.8], [160, 47]]}], "title": 'High cost Recipients', "categories": ['MA + ENc Services Pd(Plan Reported)', 'MA + Enc Service Claim Claim Ct']},
            "pieChart": {"value": [['PRENATAK/POSTPARTUM CARE', 50], ['99213 OFFICE/OUTPATIENT VISIT EST', 20], {name: '99215 OFFICE/OUTPATIENT VISIT EST', y: 17, sliced: true, selected: true}, ['99212 OFFICE/OUTPATIENT VISIT EST', 10], ['99214 OFFICE/OUTPATIENT VISIT EST', 3]], "title": 'Services Paid By MNCOR'},
            "barChartSecond": {"value": [{"name": 'MA+Enc Svcs Pd(Plan Reported)(This)', "data": [500]}, {"name": 'MA+Enc Svcs Pd(Plan Reported)(Last)', "data": [200]}, {"name": 'MA+Enc Service Claim Ct(This)', "data": [340]}, {"name": 'MA+Enc Service Claim Ct(Last)', "data": [250]}], "title": 'Services Paid & Claim Courts by Provider ', "categories": ['34346010-PHYSICIAN']}
        },
        {"providerId": "40926608",
            "barChart": {"value": [{"name": 'MA+Enc Svcs Pd(Plan Reported)(This)', "data": [220]}, {"name": 'MA+Enc Svcs Pd(Plan Reported)(This)', "data": [100]}], "title": 'Services Paid This Year vs. Last Year', "categories": ['PSC PSY & NERURO:PSYCHIATRY (NOT CHILD)']},
            "scatterChart": {"value": [{name: 'Cost', color: '#f06f07', data: [[161.2, 61.6], [167.5, 59], [159.5, 49.2], [157, 53], [155.8, 53.6], [170, 59], [159.1, 47.6], [166, 79.8], [176.2, 66.8], [160.2, 75.2], [172.5, 55.2], [170.9, 54.2], [172.9, 62.5], [153.4, 42], [160, 50], [147.2, 49.8], [168.2, 49.2], [175, 73.2], [157, 47.8], [167.6, 68.8], [159.5, 50.6], [175, 82.5], [166.8, 57.2], [176.5, 87.8], [170.2, 72.8], [174, 54.5], [173, 59.8], [179.9, 67.3], [170.5, 67.8], [160, 47]]}], "title": 'High cost Recipients', "categories": ['MA + ENc Services Pd(Plan Reported)', 'MA + Enc Service Claim Claim Ct']},
            "pieChart": {"value": [['PRENATAK/POSTPARTUM CARE', 35], ['99213 OFFICE/OUTPATIENT VISIT EST', 35], {name: '99215 OFFICE/OUTPATIENT VISIT EST', y: 17, sliced: true, selected: true}, ['99212 OFFICE/OUTPATIENT VISIT EST', 10], ['99214 OFFICE/OUTPATIENT VISIT EST', 3]], "title": 'Services Paid By MNCOR'},
            "barChartSecond": {"value": [{"name": 'MA+Enc Svcs Pd(Plan Reported)(This)', "data": [420]}, {"name": 'MA+Enc Svcs Pd(Plan Reported)(Last)', "data": [230]}, {"name": 'MA+Enc Service Claim Ct(This)', "data": [340]}, {"name": 'MA+Enc Service Claim Ct(Last)', "data": [250]}], "title": 'Services Paid & Claim Courts by Provider ', "categories": ['34346010-PHYSICIAN']}
        },
        {"providerId": "24329643",
            "barChart": {"value": [{"name": 'MA+Enc Svcs Pd(Plan Reported)(This)', "data": [250]}, {"name": 'MA+Enc Svcs Pd(Plan Reported)(This)', "data": [140]}], "title": 'Services Paid This Year vs. Last Year', "categories": ['PSC PSY & NERURO:PSYCHIATRY (NOT CHILD)']},
            "scatterChart": {"value": [{name: 'Cost', color: '#f06f07', data: [[161.2, 51.6], [167.5, 59], [159.5, 49.2], [157, 63], [155.8, 53.6], [170, 59], [159.1, 47.6], [166, 69.8], [176.2, 66.8], [160.2, 75.2], [172.5, 55.2], [170.9, 54.2], [172.9, 62.5], [153.4, 42], [160, 50], [147.2, 49.8], [168.2, 49.2], [175, 73.2], [157, 47.8], [167.6, 68.8], [159.5, 50.6], [175, 82.5], [166.8, 57.2], [176.5, 87.8], [170.2, 72.8], [174, 54.5], [173, 59.8], [179.9, 67.3], [170.5, 67.8], [160, 47]]}], "title": 'High cost Recipients', "categories": ['MA + ENc Services Pd(Plan Reported)', 'MA + Enc Service Claim Claim Ct']},
            "pieChart": {"value": [['PRENATAK/POSTPARTUM CARE', 40], ['99213 OFFICE/OUTPATIENT VISIT EST', 30], {name: '99215 OFFICE/OUTPATIENT VISIT EST', y: 17, sliced: true, selected: true}, ['99212 OFFICE/OUTPATIENT VISIT EST', 10], ['99214 OFFICE/OUTPATIENT VISIT EST', 3]], "title": 'Services Paid By MNCOR'},
            "barChartSecond": {"value": [{"name": 'MA+Enc Svcs Pd(Plan Reported)(This)', "data": [430]}, {"name": 'MA+Enc Svcs Pd(Plan Reported)(Last)', "data": [300]}, {"name": 'MA+Enc Service Claim Ct(This)', "data": [340]}, {"name": 'MA+Enc Service Claim Ct(Last)', "data": [250]}], "title": 'Services Paid & Claim Courts by Provider ', "categories": ['34346010-PHYSICIAN']}
        },
        {"providerId": "79403874",
            "barChart": {"value": [{"name": 'MA+Enc Svcs Pd(Plan Reported)(This)', "data": [200]}, {"name": 'MA+Enc Svcs Pd(Plan Reported)(This)', "data": [100]}], "title": 'Services Paid This Year vs. Last Year', "categories": ['PSC PSY & NERURO:PSYCHIATRY (NOT CHILD)']},
            "scatterChart": {"value": [{name: 'Cost', color: '#f06f07', data: [[161.2, 51.6], [167.5, 59], [159.5, 49.2], [157, 63], [155.8, 53.6], [170, 59], [159.1, 47.6], [166, 69.8], [176.2, 66.8], [160.2, 75.2], [172.5, 55.2], [170.9, 54.2], [172.9, 62.5], [153.4, 42], [160, 50], [147.2, 49.8], [168.2, 49.2], [175, 73.2], [157, 47.8], [167.6, 68.8], [159.5, 50.6], [175, 82.5], [166.8, 57.2], [176.5, 87.8], [170.2, 72.8], [174, 54.5], [173, 59.8], [179.9, 67.3], [170.5, 67.8], [160, 47]]}], "title": 'High cost Recipients', "categories": ['MA + ENc Services Pd(Plan Reported)', 'MA + Enc Service Claim Claim Ct']},
            "pieChart": {"value": [['PRENATAK/POSTPARTUM CARE', 40], ['99213 OFFICE/OUTPATIENT VISIT EST', 30], {name: '99215 OFFICE/OUTPATIENT VISIT EST', y: 17, sliced: true, selected: true}, ['99212 OFFICE/OUTPATIENT VISIT EST', 10], ['99214 OFFICE/OUTPATIENT VISIT EST', 3]], "title": 'Services Paid By MNCOR'},
            "barChartSecond": {"value": [{"name": 'MA+Enc Svcs Pd(Plan Reported)(This)', "data": [400]}, {"name": 'MA+Enc Svcs Pd(Plan Reported)(Last)', "data": [300]}, {"name": 'MA+Enc Service Claim Ct(This)', "data": [340]}, {"name": 'MA+Enc Service Claim Ct(Last)', "data": [250]}], "title": 'Services Paid & Claim Courts by Provider ', "categories": ['34346010-PHYSICIAN']}
        },
        {"providerId": "53831859",
            "barChart": {"value": [{"name": 'MA+Enc Svcs Pd(Plan Reported)(This)', "data": [200]}, {"name": 'MA+Enc Svcs Pd(Plan Reported)(This)', "data": [100]}], "title": 'Services Paid This Year vs. Last Year', "categories": ['PSC PSY & NERURO:PSYCHIATRY (NOT CHILD)']},
            "scatterChart": {"value": [{name: 'Cost', color: '#f06f07', data: [[161.2, 51.6], [167.5, 59], [159.5, 49.2], [157, 63], [155.8, 53.6], [170, 59], [159.1, 47.6], [166, 69.8], [176.2, 66.8], [160.2, 75.2], [172.5, 55.2], [170.9, 54.2], [172.9, 62.5], [153.4, 42], [160, 50], [147.2, 49.8], [168.2, 49.2], [175, 73.2], [157, 47.8], [167.6, 68.8], [159.5, 50.6], [175, 82.5], [166.8, 57.2], [176.5, 87.8], [170.2, 72.8], [174, 54.5], [173, 59.8], [179.9, 67.3], [170.5, 67.8], [160, 47]]}], "title": 'High cost Recipients', "categories": ['MA + ENc Services Pd(Plan Reported)', 'MA + Enc Service Claim Claim Ct']},
            "pieChart": {"value": [['PRENATAK/POSTPARTUM CARE', 40], ['99213 OFFICE/OUTPATIENT VISIT EST', 30], {name: '99215 OFFICE/OUTPATIENT VISIT EST', y: 17, sliced: true, selected: true}, ['99212 OFFICE/OUTPATIENT VISIT EST', 10], ['99214 OFFICE/OUTPATIENT VISIT EST', 3]], "title": 'Services Paid By MNCOR'},
            "barChartSecond": {"value": [{"name": 'MA+Enc Svcs Pd(Plan Reported)(This)', "data": [400]}, {"name": 'MA+Enc Svcs Pd(Plan Reported)(Last)', "data": [300]}, {"name": 'MA+Enc Service Claim Ct(This)', "data": [340]}, {"name": 'MA+Enc Service Claim Ct(Last)', "data": [250]}], "title": 'Services Paid & Claim Courts by Provider ', "categories": ['34346010-PHYSICIAN']}
        }

    ],
    explorerChartData1: [
        {"providerId": "93847521",
			"griddata": {"value": [[{"flag": 'Total Claim Count', "providerValue": "45", "peerAvgValue": "27", "percentDev": "425%"}, {"flag": 'Total Claimed Amount ($)', "providerValue": "22,500", "peerAvgValue": "11,880", "percentDev": "343%"}, {"flag": 'Total Paid Amount ($)', "providerValue": "14,500", "peerAvgValue": "11,167", "percentDev": "332%"}, {"flag": 'Amount at Risk', "providerValue": "3600", "peerAvgValue": "356", "percentDev": "471%"}, {"flag": 'Overall Risk score', "providerValue": "78", "peerAvgValue": "28", "percentDev": "471%"}]
                            , [{"flag": 'Total Claim Count', "providerValue": "87", "peerAvgValue": "53", "percentDev": "430%"}, {"flag": 'Total Claimed Amount ($)', "providerValue": "43,080", "peerAvgValue": "22,540", "percentDev": "383%"}, {"flag": 'Total Paid Amount ($)', "providerValue": "26,800", "peerAvgValue": "21,081", "percentDev": "322%"}, {"flag": 'Amount at Risk', "providerValue": "7,574", "peerAvgValue": "730", "percentDev": "447%"}, {"flag": 'Overall Risk score', "providerValue": "82", "peerAvgValue": "29", "percentDev": "471%"}]
                            , [{"flag": 'Total Claim Count', "providerValue": "125", "peerAvgValue": "76", "percentDev": "453%"}, {"flag": 'Total Claimed Amount ($)', "providerValue": "60,940", "peerAvgValue": "32,890", "percentDev": "345%"}, {"flag": 'Total Paid Amount ($)', "providerValue": "38,300", "peerAvgValue": "29,879", "percentDev": "356%"}, {"flag": 'Amount at Risk', "providerValue": "10,882", "peerAvgValue": "1,506", "percentDev": "409%"}, {"flag": 'Overall Risk score', "providerValue": "79", "peerAvgValue": "29", "percentDev": "471%"}]
                            , [{"flag": 'Total Claim Count', "providerValue": "212", "peerAvgValue": "156", "percentDev": "455%"}, {"flag": 'Total Claimed Amount ($)', "providerValue": "99,400", "peerAvgValue": "67,600", "percentDev": "413%"}, {"flag": 'Total Paid Amount ($)', "providerValue": "66,100", "peerAvgValue": "60,833", "percentDev": "345%"}, {"flag": 'Amount at Risk', "providerValue": "16,942", "peerAvgValue": "3,383", "percentDev": "398%"}, {"flag": 'Overall Risk score', "providerValue": "71", "peerAvgValue": "30", "percentDev": "471%"}]                            
                ]},
            "lineChart": {"totalCliamCount": [{"name": 'Provider (93847521)', "data": [25,28,34,38,42,45]}], "totalBillAmount": [{"name": 'Provider (93847521)', "data": [10500,12320,15640,17860,20580,22500]}], "totalPaidAmount": [{"name": 'Provider (93847521)', "data": [8700,9200,9900,11500,12300,14500]}], "title": 'Claim Statistics', "categories": ['Jan-15', 'Feb-15', 'Mar-15', 'Apr-15', 'May-15', 'Jun-15'], "yAxisTitle": " "},
            "lineChartForPeer": {"totalCliamCount": [{"name": 'Provider (93847521)', "data": [25,28,34,38,42,45]},{"name": 'Peers', "data": [25,28,27,23,26,27]}], "totalBillAmount": [{"name": 'Provider (93847521)', "data": [10500,12320,15640,17860,20580,22500]},{"name": 'Peers', "data": [10500,12600,11610,10350,10660,11880]}], "totalPaidAmount": [{"name": 'Provider (93847521)', "data": [8700,9200,9900,11500,12300,14500]},{"name": 'Peers', "data": [9660,10962,10333,8798,9914,11167]}], "title": '', "categories": ['Jan-15', 'Feb-15', 'Mar-15', 'Apr-15', 'May-15', 'Jun-15'], "yAxisTitle": " "},			
            "lineChartComp": {"value": [{"name": 'Amount at Risk', "type":"column", "data": [900,1716,3444,3307,3974,3600]}, {"name": 'Risk Score', "type":"spline", "yAxis": 1, "data": [56,65,68,75,85,78]}], "title": 'Amount at Risk v/s Score', "categories": ['Jan-15', 'Feb-15', 'Mar-15', 'Apr-15', 'May-15', 'Jun-15'], "yAxisTitle": ""},
            "lineChartCompForPeer": {"value": [{"name": 'Amount at Risk', "type":"column", "data": [900,1716,3444,3307,3974,3600]}, {"name": 'Risk Score', "type":"spline", "yAxis": 1, "data": [56,65,68,75,85,78]},{"name": 'Amount at Risk for Peer', "type":"column", "data": [946,448,455,1846,770,611]}, {"name": 'Risk Score for Peer', "type":"spline", "yAxis": 1, "data": [28,33,30,31,27,28]}], "title": 'Risk Amount v/s Score', "categories": ['Jan-15', 'Feb-15', 'Mar-15', 'Apr-15', 'May-15', 'Jun-15'], "yAxisTitle": ""},
            "scatterChart": {"value": [{name: 'Claim Details:', color: '#f06f07', data: [[600, 21], [500, 12], [630, 81], [300, 41], [700, 67], [400, 91], [700, 45], [320, 5], [200, 6], [620, 41], [120, 61], [600, 81], [120, 46], [240, 65], [200, 21], [400, 88], [500, 62], [830, 71], [820, 66], [340, 25], [600, 71], [980, 78], [970, 92], [900, 91], [320, 76], [340, 25], [220, 21], [440, 88], [550, 62], [650, 81], [320, 46], [340, 65], [600, 21], [430, 88], [550, 62]]}], "title": 'Claim Risk - Claim Amount Matrix (Claims Under Processing)', "categories": ['$ Amount (Low to High)', 'Risk Score (Low to High)']},
            "scatterChartForPeer": {"value": [{name: 'Claim Details:', color: '#f06f07', data: [[600, 21], [500, 12], [630, 81], [300, 41], [700, 67], [400, 91], [700, 45], [320, 5], [200, 6], [620, 41], [120, 61], [600, 81], [120, 46], [240, 65], [200, 21], [400, 88], [500, 62], [830, 71], [820, 66], [340, 25], [600, 71], [980, 78], [970, 92], [900, 91], [320, 76], [340, 25], [220, 21], [440, 88], [550, 62], [650, 81], [320, 46], [340, 65], [600, 21], [430, 88], [550, 62]]},{name: 'Claim Details:', color: 'rgba(119, 152, 191, .5)', data: [[550, 31], [450, 22], [530, 71], [330, 51], [650, 67], [400, 95], [650, 45], [320, 5], [220, 6], [620, 51], [150, 61], [550, 71], [150, 46], [240, 65], [220, 31], [400, 88], [450, 62], [800, 71], [710, 66], [340, 25], [550, 71], [880, 78], [570, 92], [800, 95], [320, 76], [340, 25], [220, 31], [440, 88], [550, 62], [650, 71], [320, 46], [340, 65], [550, 31], [430, 88], [550, 62]]}], "title": 'Claim Risk - Claim Amount Matrix (Claims Under Processing)', "categories": ['$ Amount (Low to High)', 'Risk Score (Low to High)']},        },
        {"providerId": "48527633",
            "griddata": {"value": [[{"flag": 'Total Claim Count', "providerValue": "21", "peerAvgValue": "21", "percentDev": "425%"}, {"flag": 'Total Claimed Amount ($)', "providerValue": "10,251", "peerAvgValue": "9,656", "percentDev": "343%"}, {"flag": 'Total Paid Amount ($)', "providerValue": "8,394", "peerAvgValue": "8147", "percentDev": "332%"}, {"flag": 'Amount at Risk', "providerValue": "611", "peerAvgValue": "565", "percentDev": "471%"}, {"flag": 'Overall Risk score', "providerValue": "39", "peerAvgValue": "37", "percentDev": "471%"}]
                            , [{"flag": 'Total Claim Count', "providerValue": "48", "peerAvgValue": "40", "percentDev": "430%"}, {"flag": 'Total Claimed Amount ($)', "providerValue": "28,623", "peerAvgValue": "7,343", "percentDev": "383%"}, {"flag": 'Total Paid Amount ($)', "providerValue": "24,423", "peerAvgValue": "7,543", "percentDev": "322%"}, {"flag": 'Amount at Risk', "providerValue": "1,381", "peerAvgValue": "1,142", "percentDev": "447%"}, {"flag": 'Overall Risk score', "providerValue": "38", "peerAvgValue": "39", "percentDev": "471%"}]
                            , [{"flag": 'Total Claim Count', "providerValue": "66", "peerAvgValue": "63", "percentDev": "453%"}, {"flag": 'Total Claimed Amount ($)', "providerValue": "32,383", "peerAvgValue": "8,533", "percentDev": "345%"}, {"flag": 'Total Paid Amount ($)', "providerValue": "28,675", "peerAvgValue": "8,707", "percentDev": "356%"}, {"flag": 'Amount at Risk', "providerValue": "3226", "peerAvgValue": "2137", "percentDev": "409%"}, {"flag": 'Overall Risk score', "providerValue": "52", "peerAvgValue": "47", "percentDev": "471%"}]
                            , [{"flag": 'Total Claim Count', "providerValue": "149", "peerAvgValue": "132", "percentDev": "455%"}, {"flag": 'Total Claimed Amount ($)', "providerValue": "33,723", "peerAvgValue": "8,786", "percentDev": "413%"}, {"flag": 'Total Paid Amount ($)', "providerValue": "31,643", "peerAvgValue": "9,233", "percentDev": "345%"}, {"flag": 'Amount at Risk', "providerValue": "5,076", "peerAvgValue": "4", "percentDev": "398%"}, {"flag": 'Overall Risk score', "providerValue": "45", "peerAvgValue": "43", "percentDev": "471%"}]                            
                ]},
            "lineChart": {"totalCliamCount": [{"name": 'Provider (93847521)', "data": [25,28,34,38,42,45]}], "totalBillAmount": [{"name": 'Provider (93847521)', "data": [10500,12320,15640,17860,20580,22500]}], "totalPaidAmount": [{"name": 'Provider (93847521)', "data": [8700,9200,9900,11500,12300,14500]}], "title": 'Claim Statistics', "categories": ['Jan-15', 'Feb-15', 'Mar-15', 'Apr-15', 'May-15', 'Jun-15'], "yAxisTitle": " "},
            "lineChartForPeer": {"totalCliamCount": [{"name": 'Provider (93847521)', "data": [25,28,34,38,42,45]},{"name": 'Peers', "data": [25,28,27,23,26,27]}], "totalBillAmount": [{"name": 'Provider (93847521)', "data": [10500,12320,15640,17860,20580,22500]},{"name": 'Peers', "data": [10500,12600,11610,10350,10660,11880]}], "totalPaidAmount": [{"name": 'Provider (93847521)', "data": [8700,9200,9900,11500,12300,14500]},{"name": 'Peers', "data": [9660,10962,10333,8798,9914,11167]}], "title": '', "categories": ['Jan-15', 'Feb-15', 'Mar-15', 'Apr-15', 'May-15', 'Jun-15'], "yAxisTitle": " "},			
            "lineChartComp": {"value": [{"name": 'Amount at Risk', "type":"column", "data": [900,1716,3444,3307,3974,3600]}, {"name": 'Risk Score', "type":"spline", "yAxis": 1, "data": [56,65,68,75,85,78]}], "title": 'Amount at Risk v/s Score', "categories": ['Jan-15', 'Feb-15', 'Mar-15', 'Apr-15', 'May-15', 'Jun-15'], "yAxisTitle": ""},
            "lineChartCompForPeer": {"value": [{"name": 'Amount at Risk', "data": [900,1716,3444,3307,3974,3600]}, {"name": 'Risk Score', "data": [56,65,68,75,85,78]},{"name": 'Amount at Risk for Peer', "data": [946,448,455,1846,770,611]}, {"name": 'Risk Score for Peer', "data": [28,33,30,31,27,28]}], "title": 'Risk Amount v/s Score', "categories": ['Jan-15', 'Feb-15', 'Mar-15', 'Apr-15', 'May-15', 'Jun-15'], "yAxisTitle": ""},
            "scatterChart": {"value": [{name: 'Claim Details:', color: '#f06f07', data: [[600, 21], [500, 12], [630, 81], [300, 41], [700, 67], [400, 91], [700, 45], [320, 5], [200, 6], [620, 41], [120, 61], [600, 81], [120, 46], [240, 65], [200, 21], [400, 88], [500, 62], [830, 71], [820, 66], [340, 25], [600, 71], [980, 78], [970, 92], [900, 91], [320, 76], [340, 25], [220, 21], [440, 88], [550, 62], [650, 81], [320, 46], [340, 65], [600, 21], [430, 88], [550, 62]]}], "title": 'Claim Risk - Claim Amount Matrix (Claims Under Processing)', "categories": ['$ Amount (Low to High)', 'Risk Score (Low to High)']},
        },        
		{"providerId": "98235623",
			"griddata": {"value": [[{"flag": 'Total Claim Count', "providerValue": "45", "peerAvgValue": "27", "percentDev": "425%"}, {"flag": 'Total Claimed Amount ($)', "providerValue": "22,500", "peerAvgValue": "11,880", "percentDev": "343%"}, {"flag": 'Total Paid Amount ($)', "providerValue": "14,500", "peerAvgValue": "11,167", "percentDev": "332%"}, {"flag": 'Amount at Risk', "providerValue": "3600", "peerAvgValue": "356", "percentDev": "471%"}, {"flag": 'Overall Risk score', "providerValue": "78", "peerAvgValue": "28", "percentDev": "471%"}]
                            , [{"flag": 'Total Claim Count', "providerValue": "87", "peerAvgValue": "53", "percentDev": "430%"}, {"flag": 'Total Claimed Amount ($)', "providerValue": "43,080", "peerAvgValue": "22,540", "percentDev": "383%"}, {"flag": 'Total Paid Amount ($)', "providerValue": "26,800", "peerAvgValue": "21,081", "percentDev": "322%"}, {"flag": 'Amount at Risk', "providerValue": "7,574", "peerAvgValue": "730", "percentDev": "447%"}, {"flag": 'Overall Risk score', "providerValue": "82", "peerAvgValue": "29", "percentDev": "471%"}]
                            , [{"flag": 'Total Claim Count', "providerValue": "125", "peerAvgValue": "76", "percentDev": "453%"}, {"flag": 'Total Claimed Amount ($)', "providerValue": "60,940", "peerAvgValue": "32,890", "percentDev": "345%"}, {"flag": 'Total Paid Amount ($)', "providerValue": "38,300", "peerAvgValue": "29,879", "percentDev": "356%"}, {"flag": 'Amount at Risk', "providerValue": "10,882", "peerAvgValue": "1,506", "percentDev": "409%"}, {"flag": 'Overall Risk score', "providerValue": "79", "peerAvgValue": "29", "percentDev": "471%"}]
                            , [{"flag": 'Total Claim Count', "providerValue": "212", "peerAvgValue": "156", "percentDev": "455%"}, {"flag": 'Total Claimed Amount ($)', "providerValue": "99,400", "peerAvgValue": "67,600", "percentDev": "413%"}, {"flag": 'Total Paid Amount ($)', "providerValue": "66,100", "peerAvgValue": "60,833", "percentDev": "345%"}, {"flag": 'Amount at Risk', "providerValue": "16,942", "peerAvgValue": "3,383", "percentDev": "398%"}, {"flag": 'Overall Risk score', "providerValue": "71", "peerAvgValue": "30", "percentDev": "471%"}]                            
                ]},
            "lineChart": {"totalCliamCount": [{"name": 'Provider (93847521)', "data": [25,28,34,38,42,45]}], "totalBillAmount": [{"name": 'Provider (93847521)', "data": [10500,12320,15640,17860,20580,22500]}], "totalPaidAmount": [{"name": 'Provider (93847521)', "data": [8700,9200,9900,11500,12300,14500]}], "title": 'Claim Statistics', "categories": ['Jan-15', 'Feb-15', 'Mar-15', 'Apr-15', 'May-15', 'Jun-15'], "yAxisTitle": " "},
            "lineChartForPeer": {"totalCliamCount": [{"name": 'Provider (93847521)', "data": [25,28,34,38,42,45]},{"name": 'Peers', "data": [25,28,27,23,26,27]}], "totalBillAmount": [{"name": 'Provider (93847521)', "data": [10500,12320,15640,17860,20580,22500]},{"name": 'Peers', "data": [10500,12600,11610,10350,10660,11880]}], "totalPaidAmount": [{"name": 'Provider (93847521)', "data": [8700,9200,9900,11500,12300,14500]},{"name": 'Peers', "data": [9660,10962,10333,8798,9914,11167]}], "title": '', "categories": ['Jan-15', 'Feb-15', 'Mar-15', 'Apr-15', 'May-15', 'Jun-15'], "yAxisTitle": " "},			
            "lineChartComp": {"value": [{"name": 'Amount at Risk', "type":"column", "data": [900,1716,3444,3307,3974,3600]}, {"name": 'Risk Score', "type":"spline", "yAxis": 1, "data": [56,65,68,75,85,78]}], "title": 'Amount at Risk v/s Score', "categories": ['Jan-15', 'Feb-15', 'Mar-15', 'Apr-15', 'May-15', 'Jun-15'], "yAxisTitle": ""},
            "lineChartCompForPeer": {"value": [{"name": 'Amount at Risk', "data": [900,1716,3444,3307,3974,3600]}, {"name": 'Risk Score', "data": [56,65,68,75,85,78]},{"name": 'Amount at Risk for Peer', "data": [946,448,455,1846,770,611]}, {"name": 'Risk Score for Peer', "data": [28,33,30,31,27,28]}], "title": 'Risk Amount v/s Score', "categories": ['Jan-15', 'Feb-15', 'Mar-15', 'Apr-15', 'May-15', 'Jun-15'], "yAxisTitle": ""},
            "scatterChart": {"value": [{name: 'Claim Details:', color: '#f06f07', data: [[600, 21], [500, 12], [630, 81], [300, 41], [700, 67], [400, 91], [700, 45], [320, 5], [200, 6], [620, 41], [120, 61], [600, 81], [120, 46], [240, 65], [200, 21], [400, 88], [500, 62], [830, 71], [820, 66], [340, 25], [600, 71], [980, 78], [970, 92], [900, 91], [320, 76], [340, 25], [220, 21], [440, 88], [550, 62], [650, 81], [320, 46], [340, 65], [600, 21], [430, 88], [550, 62]]}], "title": 'Claim Risk - Claim Amount Matrix (Claims Under Processing)', "categories": ['$ Amount (Low to High)', 'Risk Score (Low to High)']},
        },
        {"providerId": "40926608",
			"griddata": {"value": [[{"flag": 'Total Claim Count', "providerValue": "45", "peerAvgValue": "27", "percentDev": "425%"}, {"flag": 'Total Claimed Amount ($)', "providerValue": "22,500", "peerAvgValue": "11,880", "percentDev": "343%"}, {"flag": 'Total Paid Amount ($)', "providerValue": "14,500", "peerAvgValue": "11,167", "percentDev": "332%"}, {"flag": 'Amount at Risk', "providerValue": "3600", "peerAvgValue": "356", "percentDev": "471%"}, {"flag": 'Overall Risk score', "providerValue": "78", "peerAvgValue": "28", "percentDev": "471%"}]
                            , [{"flag": 'Total Claim Count', "providerValue": "87", "peerAvgValue": "53", "percentDev": "430%"}, {"flag": 'Total Claimed Amount ($)', "providerValue": "43,080", "peerAvgValue": "22,540", "percentDev": "383%"}, {"flag": 'Total Paid Amount ($)', "providerValue": "26,800", "peerAvgValue": "21,081", "percentDev": "322%"}, {"flag": 'Amount at Risk', "providerValue": "7,574", "peerAvgValue": "730", "percentDev": "447%"}, {"flag": 'Overall Risk score', "providerValue": "82", "peerAvgValue": "29", "percentDev": "471%"}]
                            , [{"flag": 'Total Claim Count', "providerValue": "125", "peerAvgValue": "76", "percentDev": "453%"}, {"flag": 'Total Claimed Amount ($)', "providerValue": "60,940", "peerAvgValue": "32,890", "percentDev": "345%"}, {"flag": 'Total Paid Amount ($)', "providerValue": "38,300", "peerAvgValue": "29,879", "percentDev": "356%"}, {"flag": 'Amount at Risk', "providerValue": "10,882", "peerAvgValue": "1,506", "percentDev": "409%"}, {"flag": 'Overall Risk score', "providerValue": "79", "peerAvgValue": "29", "percentDev": "471%"}]
                            , [{"flag": 'Total Claim Count', "providerValue": "212", "peerAvgValue": "156", "percentDev": "455%"}, {"flag": 'Total Claimed Amount ($)', "providerValue": "99,400", "peerAvgValue": "67,600", "percentDev": "413%"}, {"flag": 'Total Paid Amount ($)', "providerValue": "66,100", "peerAvgValue": "60,833", "percentDev": "345%"}, {"flag": 'Amount at Risk', "providerValue": "16,942", "peerAvgValue": "3,383", "percentDev": "398%"}, {"flag": 'Overall Risk score', "providerValue": "71", "peerAvgValue": "30", "percentDev": "471%"}]                            
                ]},
            "lineChart": {"totalCliamCount": [{"name": 'Provider (93847521)', "data": [25,28,34,38,42,45]}], "totalBillAmount": [{"name": 'Provider (93847521)', "data": [10500,12320,15640,17860,20580,22500]}], "totalPaidAmount": [{"name": 'Provider (93847521)', "data": [8700,9200,9900,11500,12300,14500]}], "title": 'Claim Statistics', "categories": ['Jan-15', 'Feb-15', 'Mar-15', 'Apr-15', 'May-15', 'Jun-15'], "yAxisTitle": " "},
            "lineChartForPeer": {"totalCliamCount": [{"name": 'Provider (93847521)', "data": [25,28,34,38,42,45]},{"name": 'Peers', "data": [25,28,27,23,26,27]}], "totalBillAmount": [{"name": 'Provider (93847521)', "data": [10500,12320,15640,17860,20580,22500]},{"name": 'Peers', "data": [10500,12600,11610,10350,10660,11880]}], "totalPaidAmount": [{"name": 'Provider (93847521)', "data": [8700,9200,9900,11500,12300,14500]},{"name": 'Peers', "data": [9660,10962,10333,8798,9914,11167]}], "title": '', "categories": ['Jan-15', 'Feb-15', 'Mar-15', 'Apr-15', 'May-15', 'Jun-15'], "yAxisTitle": " "},			
            "lineChartComp": {"value": [{"name": 'Amount at Risk', "type":"column", "data": [900,1716,3444,3307,3974,3600]}, {"name": 'Risk Score', "type":"spline", "yAxis": 1, "data": [56,65,68,75,85,78]}], "title": 'Amount at Risk v/s Score', "categories": ['Jan-15', 'Feb-15', 'Mar-15', 'Apr-15', 'May-15', 'Jun-15'], "yAxisTitle": ""},
            "lineChartCompForPeer": {"value": [{"name": 'Amount at Risk', "data": [900,1716,3444,3307,3974,3600]}, {"name": 'Risk Score', "data": [56,65,68,75,85,78]},{"name": 'Amount at Risk for Peer', "data": [946,448,455,1846,770,611]}, {"name": 'Risk Score for Peer', "data": [28,33,30,31,27,28]}], "title": 'Risk Amount v/s Score', "categories": ['Jan-15', 'Feb-15', 'Mar-15', 'Apr-15', 'May-15', 'Jun-15'], "yAxisTitle": ""},
            "scatterChart": {"value": [{name: 'Claim Details:', color: '#f06f07', data: [[600, 21], [500, 12], [630, 81], [300, 41], [700, 67], [400, 91], [700, 45], [320, 5], [200, 6], [620, 41], [120, 61], [600, 81], [120, 46], [240, 65], [200, 21], [400, 88], [500, 62], [830, 71], [820, 66], [340, 25], [600, 71], [980, 78], [970, 92], [900, 91], [320, 76], [340, 25], [220, 21], [440, 88], [550, 62], [650, 81], [320, 46], [340, 65], [600, 21], [430, 88], [550, 62]]}], "title": 'Claim Risk - Claim Amount Matrix (Claims Under Processing)', "categories": ['$ Amount (Low to High)', 'Risk Score (Low to High)']},
        },
        {"providerId": "24329643",
			"griddata": {"value": [[{"flag": 'Total Claim Count', "providerValue": "45", "peerAvgValue": "27", "percentDev": "425%"}, {"flag": 'Total Claimed Amount ($)', "providerValue": "22,500", "peerAvgValue": "11,880", "percentDev": "343%"}, {"flag": 'Total Paid Amount ($)', "providerValue": "14,500", "peerAvgValue": "11,167", "percentDev": "332%"}, {"flag": 'Amount at Risk', "providerValue": "3600", "peerAvgValue": "356", "percentDev": "471%"}, {"flag": 'Overall Risk score', "providerValue": "78", "peerAvgValue": "28", "percentDev": "471%"}]
                            , [{"flag": 'Total Claim Count', "providerValue": "87", "peerAvgValue": "53", "percentDev": "430%"}, {"flag": 'Total Claimed Amount ($)', "providerValue": "43,080", "peerAvgValue": "22,540", "percentDev": "383%"}, {"flag": 'Total Paid Amount ($)', "providerValue": "26,800", "peerAvgValue": "21,081", "percentDev": "322%"}, {"flag": 'Amount at Risk', "providerValue": "7,574", "peerAvgValue": "730", "percentDev": "447%"}, {"flag": 'Overall Risk score', "providerValue": "82", "peerAvgValue": "29", "percentDev": "471%"}]
                            , [{"flag": 'Total Claim Count', "providerValue": "125", "peerAvgValue": "76", "percentDev": "453%"}, {"flag": 'Total Claimed Amount ($)', "providerValue": "60,940", "peerAvgValue": "32,890", "percentDev": "345%"}, {"flag": 'Total Paid Amount ($)', "providerValue": "38,300", "peerAvgValue": "29,879", "percentDev": "356%"}, {"flag": 'Amount at Risk', "providerValue": "10,882", "peerAvgValue": "1,506", "percentDev": "409%"}, {"flag": 'Overall Risk score', "providerValue": "79", "peerAvgValue": "29", "percentDev": "471%"}]
                            , [{"flag": 'Total Claim Count', "providerValue": "212", "peerAvgValue": "156", "percentDev": "455%"}, {"flag": 'Total Claimed Amount ($)', "providerValue": "99,400", "peerAvgValue": "67,600", "percentDev": "413%"}, {"flag": 'Total Paid Amount ($)', "providerValue": "66,100", "peerAvgValue": "60,833", "percentDev": "345%"}, {"flag": 'Amount at Risk', "providerValue": "16,942", "peerAvgValue": "3,383", "percentDev": "398%"}, {"flag": 'Overall Risk score', "providerValue": "71", "peerAvgValue": "30", "percentDev": "471%"}]                            
                ]},
            "lineChart": {"totalCliamCount": [{"name": 'Provider (93847521)', "data": [25,28,34,38,42,45]}], "totalBillAmount": [{"name": 'Provider (93847521)', "data": [10500,12320,15640,17860,20580,22500]}], "totalPaidAmount": [{"name": 'Provider (93847521)', "data": [8700,9200,9900,11500,12300,14500]}], "title": 'Claim Statistics', "categories": ['Jan-15', 'Feb-15', 'Mar-15', 'Apr-15', 'May-15', 'Jun-15'], "yAxisTitle": " "},
            "lineChartForPeer": {"totalCliamCount": [{"name": 'Provider (93847521)', "data": [25,28,34,38,42,45]},{"name": 'Peers', "data": [25,28,27,23,26,27]}], "totalBillAmount": [{"name": 'Provider (93847521)', "data": [10500,12320,15640,17860,20580,22500]},{"name": 'Peers', "data": [10500,12600,11610,10350,10660,11880]}], "totalPaidAmount": [{"name": 'Provider (93847521)', "data": [8700,9200,9900,11500,12300,14500]},{"name": 'Peers', "data": [9660,10962,10333,8798,9914,11167]}], "title": '', "categories": ['Jan-15', 'Feb-15', 'Mar-15', 'Apr-15', 'May-15', 'Jun-15'], "yAxisTitle": " "},			
            "lineChartComp": {"value": [{"name": 'Amount at Risk', "type":"column", "data": [900,1716,3444,3307,3974,3600]}, {"name": 'Risk Score', "type":"spline", "yAxis": 1, "data": [56,65,68,75,85,78]}], "title": 'Amount at Risk v/s Score', "categories": ['Jan-15', 'Feb-15', 'Mar-15', 'Apr-15', 'May-15', 'Jun-15'], "yAxisTitle": ""},
            "lineChartCompForPeer": {"value": [{"name": 'Amount at Risk', "data": [900,1716,3444,3307,3974,3600]}, {"name": 'Risk Score', "data": [56,65,68,75,85,78]},{"name": 'Amount at Risk for Peer', "data": [946,448,455,1846,770,611]}, {"name": 'Risk Score for Peer', "data": [28,33,30,31,27,28]}], "title": 'Risk Amount v/s Score', "categories": ['Jan-15', 'Feb-15', 'Mar-15', 'Apr-15', 'May-15', 'Jun-15'], "yAxisTitle": ""},
            "scatterChart": {"value": [{name: 'Claim Details:', color: '#f06f07', data: [[600, 21], [500, 12], [630, 81], [300, 41], [700, 67], [400, 91], [700, 45], [320, 5], [200, 6], [620, 41], [120, 61], [600, 81], [120, 46], [240, 65], [200, 21], [400, 88], [500, 62], [830, 71], [820, 66], [340, 25], [600, 71], [980, 78], [970, 92], [900, 91], [320, 76], [340, 25], [220, 21], [440, 88], [550, 62], [650, 81], [320, 46], [340, 65], [600, 21], [430, 88], [550, 62]]}], "title": 'Claim Risk - Claim Amount Matrix (Claims Under Processing)', "categories": ['$ Amount (Low to High)', 'Risk Score (Low to High)']},
        },
        {"providerId": "79403874",
			"griddata": {"value": [[{"flag": 'Total Claim Count', "providerValue": "45", "peerAvgValue": "27", "percentDev": "425%"}, {"flag": 'Total Claimed Amount ($)', "providerValue": "22,500", "peerAvgValue": "11,880", "percentDev": "343%"}, {"flag": 'Total Paid Amount ($)', "providerValue": "14,500", "peerAvgValue": "11,167", "percentDev": "332%"}, {"flag": 'Amount at Risk', "providerValue": "3600", "peerAvgValue": "356", "percentDev": "471%"}, {"flag": 'Overall Risk score', "providerValue": "78", "peerAvgValue": "28", "percentDev": "471%"}]
                            , [{"flag": 'Total Claim Count', "providerValue": "87", "peerAvgValue": "53", "percentDev": "430%"}, {"flag": 'Total Claimed Amount ($)', "providerValue": "43,080", "peerAvgValue": "22,540", "percentDev": "383%"}, {"flag": 'Total Paid Amount ($)', "providerValue": "26,800", "peerAvgValue": "21,081", "percentDev": "322%"}, {"flag": 'Amount at Risk', "providerValue": "7,574", "peerAvgValue": "730", "percentDev": "447%"}, {"flag": 'Overall Risk score', "providerValue": "82", "peerAvgValue": "29", "percentDev": "471%"}]
                            , [{"flag": 'Total Claim Count', "providerValue": "125", "peerAvgValue": "76", "percentDev": "453%"}, {"flag": 'Total Claimed Amount ($)', "providerValue": "60,940", "peerAvgValue": "32,890", "percentDev": "345%"}, {"flag": 'Total Paid Amount ($)', "providerValue": "38,300", "peerAvgValue": "29,879", "percentDev": "356%"}, {"flag": 'Amount at Risk', "providerValue": "10,882", "peerAvgValue": "1,506", "percentDev": "409%"}, {"flag": 'Overall Risk score', "providerValue": "79", "peerAvgValue": "29", "percentDev": "471%"}]
                            , [{"flag": 'Total Claim Count', "providerValue": "212", "peerAvgValue": "156", "percentDev": "455%"}, {"flag": 'Total Claimed Amount ($)', "providerValue": "99,400", "peerAvgValue": "67,600", "percentDev": "413%"}, {"flag": 'Total Paid Amount ($)', "providerValue": "66,100", "peerAvgValue": "60,833", "percentDev": "345%"}, {"flag": 'Amount at Risk', "providerValue": "16,942", "peerAvgValue": "3,383", "percentDev": "398%"}, {"flag": 'Overall Risk score', "providerValue": "71", "peerAvgValue": "30", "percentDev": "471%"}]                            
                ]},
            "lineChart": {"totalCliamCount": [{"name": 'Provider (93847521)', "data": [25,28,34,38,42,45]}], "totalBillAmount": [{"name": 'Provider (93847521)', "data": [10500,12320,15640,17860,20580,22500]}], "totalPaidAmount": [{"name": 'Provider (93847521)', "data": [8700,9200,9900,11500,12300,14500]}], "title": 'Claim Statistics', "categories": ['Jan-15', 'Feb-15', 'Mar-15', 'Apr-15', 'May-15', 'Jun-15'], "yAxisTitle": " "},
            "lineChartForPeer": {"totalCliamCount": [{"name": 'Provider (93847521)', "data": [25,28,34,38,42,45]},{"name": 'Peers', "data": [25,28,27,23,26,27]}], "totalBillAmount": [{"name": 'Provider (93847521)', "data": [10500,12320,15640,17860,20580,22500]},{"name": 'Peers', "data": [10500,12600,11610,10350,10660,11880]}], "totalPaidAmount": [{"name": 'Provider (93847521)', "data": [8700,9200,9900,11500,12300,14500]},{"name": 'Peers', "data": [9660,10962,10333,8798,9914,11167]}], "title": '', "categories": ['Jan-15', 'Feb-15', 'Mar-15', 'Apr-15', 'May-15', 'Jun-15'], "yAxisTitle": " "},			
            "lineChartComp": {"value": [{"name": 'Amount at Risk', "type":"column", "data": [900,1716,3444,3307,3974,3600]}, {"name": 'Risk Score', "type":"spline", "yAxis": 1, "data": [56,65,68,75,85,78]}], "title": 'Amount at Risk v/s Score', "categories": ['Jan-15', 'Feb-15', 'Mar-15', 'Apr-15', 'May-15', 'Jun-15'], "yAxisTitle": ""},
            "lineChartCompForPeer": {"value": [{"name": 'Amount at Risk', "data": [900,1716,3444,3307,3974,3600]}, {"name": 'Risk Score', "data": [56,65,68,75,85,78]},{"name": 'Amount at Risk for Peer', "data": [946,448,455,1846,770,611]}, {"name": 'Risk Score for Peer', "data": [28,33,30,31,27,28]}], "title": 'Risk Amount v/s Score', "categories": ['Jan-15', 'Feb-15', 'Mar-15', 'Apr-15', 'May-15', 'Jun-15'], "yAxisTitle": ""},
            "scatterChart": {"value": [{name: 'Claim Details:', color: '#f06f07', data: [[600, 21], [500, 12], [630, 81], [300, 41], [700, 67], [400, 91], [700, 45], [320, 5], [200, 6], [620, 41], [120, 61], [600, 81], [120, 46], [240, 65], [200, 21], [400, 88], [500, 62], [830, 71], [820, 66], [340, 25], [600, 71], [980, 78], [970, 92], [900, 91], [320, 76], [340, 25], [220, 21], [440, 88], [550, 62], [650, 81], [320, 46], [340, 65], [600, 21], [430, 88], [550, 62]]}], "title": 'Claim Risk - Claim Amount Matrix (Claims Under Processing)', "categories": ['$ Amount (Low to High)', 'Risk Score (Low to High)']},
        },
        {"providerId": "53831859",
			"griddata": {"value": [[{"flag": 'Total Claim Count', "providerValue": "45", "peerAvgValue": "27", "percentDev": "425%"}, {"flag": 'Total Claimed Amount ($)', "providerValue": "22,500", "peerAvgValue": "11,880", "percentDev": "343%"}, {"flag": 'Total Paid Amount ($)', "providerValue": "14,500", "peerAvgValue": "11,167", "percentDev": "332%"}, {"flag": 'Amount at Risk', "providerValue": "3600", "peerAvgValue": "356", "percentDev": "471%"}, {"flag": 'Overall Risk score', "providerValue": "78", "peerAvgValue": "28", "percentDev": "471%"}]
                            , [{"flag": 'Total Claim Count', "providerValue": "87", "peerAvgValue": "53", "percentDev": "430%"}, {"flag": 'Total Claimed Amount ($)', "providerValue": "43,080", "peerAvgValue": "22,540", "percentDev": "383%"}, {"flag": 'Total Paid Amount ($)', "providerValue": "26,800", "peerAvgValue": "21,081", "percentDev": "322%"}, {"flag": 'Amount at Risk', "providerValue": "7,574", "peerAvgValue": "730", "percentDev": "447%"}, {"flag": 'Overall Risk score', "providerValue": "82", "peerAvgValue": "29", "percentDev": "471%"}]
                            , [{"flag": 'Total Claim Count', "providerValue": "125", "peerAvgValue": "76", "percentDev": "453%"}, {"flag": 'Total Claimed Amount ($)', "providerValue": "60,940", "peerAvgValue": "32,890", "percentDev": "345%"}, {"flag": 'Total Paid Amount ($)', "providerValue": "38,300", "peerAvgValue": "29,879", "percentDev": "356%"}, {"flag": 'Amount at Risk', "providerValue": "10,882", "peerAvgValue": "1,506", "percentDev": "409%"}, {"flag": 'Overall Risk score', "providerValue": "79", "peerAvgValue": "29", "percentDev": "471%"}]
                            , [{"flag": 'Total Claim Count', "providerValue": "212", "peerAvgValue": "156", "percentDev": "455%"}, {"flag": 'Total Claimed Amount ($)', "providerValue": "99,400", "peerAvgValue": "67,600", "percentDev": "413%"}, {"flag": 'Total Paid Amount ($)', "providerValue": "66,100", "peerAvgValue": "60,833", "percentDev": "345%"}, {"flag": 'Amount at Risk', "providerValue": "16,942", "peerAvgValue": "3,383", "percentDev": "398%"}, {"flag": 'Overall Risk score', "providerValue": "71", "peerAvgValue": "30", "percentDev": "471%"}]                            
                ]},
            "lineChart": {"totalCliamCount": [{"name": 'Provider (93847521)', "data": [25,28,34,38,42,45]}], "totalBillAmount": [{"name": 'Provider (93847521)', "data": [10500,12320,15640,17860,20580,22500]}], "totalPaidAmount": [{"name": 'Provider (93847521)', "data": [8700,9200,9900,11500,12300,14500]}], "title": 'Claim Statistics', "categories": ['Jan-15', 'Feb-15', 'Mar-15', 'Apr-15', 'May-15', 'Jun-15'], "yAxisTitle": " "},
            "lineChartForPeer": {"totalCliamCount": [{"name": 'Provider (93847521)', "data": [25,28,34,38,42,45]},{"name": 'Peers', "data": [25,28,27,23,26,27]}], "totalBillAmount": [{"name": 'Provider (93847521)', "data": [10500,12320,15640,17860,20580,22500]},{"name": 'Peers', "data": [10500,12600,11610,10350,10660,11880]}], "totalPaidAmount": [{"name": 'Provider (93847521)', "data": [8700,9200,9900,11500,12300,14500]},{"name": 'Peers', "data": [9660,10962,10333,8798,9914,11167]}], "title": '', "categories": ['Jan-15', 'Feb-15', 'Mar-15', 'Apr-15', 'May-15', 'Jun-15'], "yAxisTitle": " "},			
            "lineChartComp": {"value": [{"name": 'Amount at Risk', "type":"column", "data": [900,1716,3444,3307,3974,3600]}, {"name": 'Risk Score', "type":"spline", "yAxis": 1, "data": [56,65,68,75,85,78]}], "title": 'Amount at Risk v/s Score', "categories": ['Jan-15', 'Feb-15', 'Mar-15', 'Apr-15', 'May-15', 'Jun-15'], "yAxisTitle": ""},
            "lineChartCompForPeer": {"value": [{"name": 'Amount at Risk', "data": [900,1716,3444,3307,3974,3600]}, {"name": 'Risk Score', "data": [56,65,68,75,85,78]},{"name": 'Amount at Risk for Peer', "data": [946,448,455,1846,770,611]}, {"name": 'Risk Score for Peer', "data": [28,33,30,31,27,28]}], "title": 'Risk Amount v/s Score', "categories": ['Jan-15', 'Feb-15', 'Mar-15', 'Apr-15', 'May-15', 'Jun-15'], "yAxisTitle": ""},
            "scatterChart": {"value": [{name: 'Claim Details:', color: '#f06f07', data: [[600, 21], [500, 12], [630, 81], [300, 41], [700, 67], [400, 91], [700, 45], [320, 5], [200, 6], [620, 41], [120, 61], [600, 81], [120, 46], [240, 65], [200, 21], [400, 88], [500, 62], [830, 71], [820, 66], [340, 25], [600, 71], [980, 78], [970, 92], [900, 91], [320, 76], [340, 25], [220, 21], [440, 88], [550, 62], [650, 81], [320, 46], [340, 65], [600, 21], [430, 88], [550, 62]]}], "title": 'Claim Risk - Claim Amount Matrix (Claims Under Processing)', "categories": ['$ Amount (Low to High)', 'Risk Score (Low to High)']},
        }
    ],
    peerLineChartDataNew: [
        {"providerId": "93847521", "claim_count": [5, 20, 30, 15, 20, 30, 21, 12, 18, 29, 25, 21], "total_amount": [132, 224, 350, 412, 529, 613, 777, 844, 935, 112, 228, 999], "regional_average_count": 10, "national_average_count": 15, "regional_average_amount": 350, "national_average_amount": 450},
        {"providerId": "48527633", "claim_count": [5, 20, 30, 15, 20, 30, 21, 12, 18, 29, 25, 21], "total_amount": [232, 324, 450, 512, 529, 613, 777, 844, 935, 112, 228, 999], "regional_average_count": 10, "national_average_count": 15, "regional_average_amount": 350, "national_average_amount": 450},		
        {"providerId": "98235623", "claim_count": [5, 20, 30, 15, 20, 30, 21, 12, 18, 29, 25, 21], "total_amount": [232, 324, 450, 512, 529, 613, 777, 844, 935, 112, 228, 999], "regional_average_count": 10, "national_average_count": 15, "regional_average_amount": 350, "national_average_amount": 450},
        {"providerId": "40926608", "claim_count": [5, 20, 30, 15, 20, 30, 21, 12, 18, 29, 25, 21], "total_amount": [332, 424, 550, 612, 529, 613, 777, 844, 935, 112, 228, 999], "regional_average_count": 10, "national_average_count": 15, "regional_average_amount": 350, "national_average_amount": 450},
        {"providerId": "24329643", "claim_count": [5, 20, 30, 15, 20, 30, 21, 12, 18, 29, 25, 21], "total_amount": [432, 524, 650, 712, 529, 613, 777, 844, 935, 112, 228, 999], "regional_average_count": 10, "national_average_count": 15, "regional_average_amount": 350, "national_average_amount": 450},
        {"providerId": "79403874", "claim_count": [5, 20, 30, 15, 20, 30, 21, 12, 18, 29, 25, 21], "total_amount": [532, 624, 750, 812, 529, 613, 777, 844, 935, 112, 228, 999], "regional_average_count": 10, "national_average_count": 15, "regional_average_amount": 350, "national_average_amount": 450},
        {"providerId": "53831859", "claim_count": [5, 20, 30, 15, 20, 30, 21, 12, 18, 29, 25, 21], "total_amount": [632, 724, 850, 912, 529, 613, 777, 844, 935, 112, 228, 999], "regional_average_count": 10, "national_average_count": 15, "regional_average_amount": 350, "national_average_amount": 450}

    ],
    peerLineChartDataNetwork: [
        {"providerId": "76567667", "claim_count": [5, 20, 30, 15, 20, 30, 21, 12, 18, 29, 25, 21], "total_amount": [132, 224, 350, 412, 529, 613, 777, 844, 935, 112, 228, 999], "regional_average_count": 10, "national_average_count": 15, "regional_average_amount": 350, "national_average_amount": 450},
        {"providerId": "86637643", "claim_count": [5, 20, 30, 15, 20, 30, 21, 12, 18, 29, 25, 21], "total_amount": [232, 324, 450, 512, 529, 613, 777, 844, 935, 112, 228, 999], "regional_average_count": 10, "national_average_count": 15, "regional_average_amount": 350, "national_average_amount": 450},
        {"providerId": "93367632", "claim_count": [5, 20, 30, 15, 20, 30, 21, 12, 18, 29, 25, 21], "total_amount": [332, 424, 550, 612, 529, 613, 777, 844, 935, 112, 228, 999], "regional_average_count": 10, "national_average_count": 15, "regional_average_amount": 350, "national_average_amount": 450},
        {"providerId": "86567234", "claim_count": [5, 20, 30, 15, 20, 30, 21, 12, 18, 29, 25, 21], "total_amount": [432, 524, 650, 712, 529, 613, 777, 844, 935, 112, 228, 999], "regional_average_count": 10, "national_average_count": 15, "regional_average_amount": 350, "national_average_amount": 450},
        {"providerId": "96567367", "claim_count": [5, 20, 30, 15, 20, 30, 21, 12, 18, 29, 25, 21], "total_amount": [532, 624, 750, 812, 529, 613, 777, 844, 935, 112, 228, 999], "regional_average_count": 10, "national_average_count": 15, "regional_average_amount": 350, "national_average_amount": 4507},
        {"providerId": "27815901", "claim_count": [5, 20, 30, 15, 20, 30, 21, 12, 18, 29, 25, 21], "total_amount": [132, 224, 350, 412, 529, 613, 777, 844, 935, 112, 228, 999], "regional_average_count": 10, "national_average_count": 15, "regional_average_amount": 350, "national_average_amount": 450},
        {"providerId": "29307171", "claim_count": [5, 20, 30, 15, 20, 30, 21, 12, 18, 29, 25, 21], "total_amount": [132, 224, 350, 412, 529, 613, 777, 844, 935, 112, 228, 999], "regional_average_count": 10, "national_average_count": 15, "regional_average_amount": 350, "national_average_amount": 450},
    ],
    peerLineChartDataMember: [
        {"providerId": "29307171", "claim_count": [5, 20, 30, 15, 20, 30, 21, 12, 18, 29, 25, 21], "total_amount": [132, 224, 350, 412, 529, 613, 777, 844, 935, 112, 228, 999], "regional_average_count": 10, "national_average_count": 15, "regional_average_amount": 350, "national_average_amount": 450},
        {"providerId": "27815901", "claim_count": [5, 20, 30, 15, 20, 30, 21, 12, 18, 29, 25, 21], "total_amount": [232, 324, 450, 512, 529, 613, 777, 844, 935, 112, 228, 999], "regional_average_count": 10, "national_average_count": 15, "regional_average_amount": 350, "national_average_amount": 450},
        {"providerId": "56781231", "claim_count": [5, 20, 30, 15, 20, 30, 21, 12, 18, 29, 25, 21], "total_amount": [332, 424, 550, 612, 529, 613, 777, 844, 935, 112, 228, 999], "regional_average_count": 10, "national_average_count": 15, "regional_average_amount": 350, "national_average_amount": 450},
        {"providerId": "65278001", "claim_count": [5, 20, 30, 15, 20, 30, 21, 12, 18, 29, 25, 21], "total_amount": [432, 524, 650, 712, 529, 613, 777, 844, 935, 112, 228, 999], "regional_average_count": 10, "national_average_count": 15, "regional_average_amount": 350, "national_average_amount": 450},
        {"providerId": "65278011", "claim_count": [5, 20, 30, 15, 20, 30, 21, 12, 18, 29, 25, 21], "total_amount": [532, 624, 750, 812, 529, 613, 777, 844, 935, 112, 228, 999], "regional_average_count": 10, "national_average_count": 15, "regional_average_amount": 350, "national_average_amount": 450}
    ],
    peerLineChartDataActiveCase: [
        {"providerId": "93847521", "claim_count": [5, 20, 30, 15, 20, 30, 21, 12, 18, 29, 25, 21], "total_amount": [132, 224, 350, 412, 529, 613, 777, 844, 935, 112, 228, 999], "regional_average_count": 10, "national_average_count": 15, "regional_average_amount": 350, "national_average_amount": 450},
        {"providerId": "48527633", "claim_count": [5, 20, 30, 15, 20, 30, 21, 12, 18, 29, 25, 21], "total_amount": [232, 324, 450, 512, 529, 613, 777, 844, 935, 112, 228, 999], "regional_average_count": 10, "national_average_count": 15, "regional_average_amount": 350, "national_average_amount": 450},
        {"providerId": "98235623", "claim_count": [5, 20, 30, 15, 20, 30, 21, 12, 18, 29, 25, 21], "total_amount": [232, 324, 450, 512, 529, 613, 777, 844, 935, 112, 228, 999], "regional_average_count": 10, "national_average_count": 15, "regional_average_amount": 350, "national_average_amount": 450},
        {"providerId": "40926608", "claim_count": [5, 20, 30, 15, 20, 30, 21, 12, 18, 29, 25, 21], "total_amount": [332, 424, 550, 612, 529, 613, 777, 844, 935, 112, 228, 999], "regional_average_count": 10, "national_average_count": 15, "regional_average_amount": 350, "national_average_amount": 450},
        {"providerId": "24329643", "claim_count": [5, 20, 30, 15, 20, 30, 21, 12, 18, 29, 25, 21], "total_amount": [432, 524, 650, 712, 529, 613, 777, 844, 935, 112, 228, 999], "regional_average_count": 10, "national_average_count": 15, "regional_average_amount": 350, "national_average_amount": 450},
        {"providerId": "79403874", "claim_count": [5, 20, 30, 15, 20, 30, 21, 12, 18, 29, 25, 21], "total_amount": [532, 624, 750, 812, 529, 613, 777, 844, 935, 112, 228, 999], "regional_average_count": 10, "national_average_count": 15, "regional_average_amount": 350, "national_average_amount": 450},
        {"providerId": "53831859", "claim_count": [5, 20, 30, 15, 20, 30, 21, 12, 18, 29, 25, 21], "total_amount": [632, 724, 850, 912, 529, 613, 777, 844, 935, 112, 228, 999], "regional_average_count": 10, "national_average_count": 15, "regional_average_amount": 350, "national_average_amount": 450}

    ],
    peerLineChartData: [
        {"providerId": "93847521",
            "peerLine": {"value": [{color: '#4a7ebb', name: 'Other Providers', marker: {symbol: 'circle'}, data: [100, 52, 46.85, 43.76, 41.38, 38.38, 35.55, 32.48, {y: 29.41, marker: {symbol: 'url(http://www.highcharts.com/demo/gfx/sun.png)'}}, 26.35, 22.25, 17.41]},
                    {name: 'Current Provider', color: '#f9322f', marker: {symbol: 'diamond'}, data: [{y: 100}, 52, 46.85, 43.76, 41.38, 38.38, 35.55, 32.48, 29.41, 26.35, 22.25, 17.41]},
                    {name: 'Provider Average', color: '#7c97b8', marker: {symbol: 'circle'}, data: [37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37]},
                    {name: '90% ile', color: '#b10594', marker: {symbol: 'circle'}, data: [53, 53, 53, 53, 53, 53, 53, 53, 53, 53, 53, 53]},
                    {name: 'Current Provider Average', color: '#00a5a6', marker: {symbol: 'circle'}, data: [36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36]}
                ], "title": 'Peer Chart', "categories": ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']}
        },
        {"providerId": "48527633",
            "peerLine": {"value": [{color: '#4a7ebb', name: 'Other Providers', marker: {symbol: 'circle'}, data: [100, 52, 46.85, 43.76, 41.38, 38.38, 35.55, 32.48, {y: 29.41, marker: {symbol: 'url(http://www.highcharts.com/demo/gfx/sun.png)'}}, 26.35, 22.25, 17.41]},
                    {name: 'Current Provider', color: '#f9322f', marker: {symbol: 'diamond'}, data: [{y: 100}, 52, 46.85, 43.76, 41.38, 38.38, 35.55, 32.48, 29.41, 26.35, 22.25, 17.41]},
                    {name: 'Provider Average', color: '#7c97b8', marker: {symbol: 'circle'}, data: [37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37]},
                    {name: '90% ile', color: '#b10594', marker: {symbol: 'circle'}, data: [53, 53, 53, 53, 53, 53, 53, 53, 53, 53, 53, 53]},
                    {name: 'Current Provider Average', color: '#00a5a6', marker: {symbol: 'circle'}, data: [36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36]}
                ], "title": 'Peer Chart', "categories": ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']}
        },		
        {"providerId": "98235623",
            "peerLine": {"value": [{color: '#4a7ebb', name: 'Other Providers', marker: {symbol: 'circle'}, data: [100, 52, 46.85, 43.76, 41.38, 38.38, 35.55, 32.48, {y: 29.41, marker: {symbol: 'url(http://www.highcharts.com/demo/gfx/sun.png)'}}, 26.35, 22.25, 17.41]},
                    {name: 'Current Provider', color: '#f9322f', marker: {symbol: 'diamond'}, data: [{y: 100}, 52, 46.85, 43.76, 41.38, 38.38, 35.55, 32.48, 29.41, 26.35, 22.25, 17.41]},
                    {name: 'Provider Average', color: '#7c97b8', marker: {symbol: 'circle'}, data: [37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37]},
                    {name: '90% ile', color: '#b10594', marker: {symbol: 'circle'}, data: [53, 53, 53, 53, 53, 53, 53, 53, 53, 53, 53, 53]},
                    {name: 'Current Provider Average', color: '#00a5a6', marker: {symbol: 'circle'}, data: [36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36]}
                ], "title": 'Peer Chart', "categories": ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']}
        },
        {"providerId": "40926608",
            "peerLine": {"value": [{color: '#4a7ebb', name: 'Other Providers', marker: {symbol: 'circle'}, data: [100, 52, 46.85, 43.76, 41.38, 38.38, 35.55, 32.48, {y: 29.41, marker: {symbol: 'url(http://www.highcharts.com/demo/gfx/sun.png)'}}, 26.35, 22.25, 17.41]},
                    {name: 'Current Provider', color: '#f9322f', marker: {symbol: 'diamond'}, data: [{y: 100}, 52, 46.85, 43.76, 41.38, 38.38, 35.55, 32.48, 29.41, 26.35, 22.25, 17.41]},
                    {name: 'Provider Average', color: '#7c97b8', marker: {symbol: 'circle'}, data: [37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37]},
                    {name: '90% ile', color: '#b10594', marker: {symbol: 'circle'}, data: [53, 53, 53, 53, 53, 53, 53, 53, 53, 53, 53, 53]},
                    {name: 'Current Provider Average', color: '#00a5a6', marker: {symbol: 'circle'}, data: [36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36]}
                ], "title": 'Peer Chart', "categories": ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']}
        },
        {"providerId": "24329643",
            "peerLine": {"value": [{color: '#4a7ebb', name: 'Other Providers', marker: {symbol: 'circle'}, data: [100, 52, 46.85, 43.76, 41.38, 38.38, 35.55, 32.48, {y: 29.41, marker: {symbol: 'url(http://www.highcharts.com/demo/gfx/sun.png)'}}, 26.35, 22.25, 17.41]},
                    {name: 'Current Provider', color: '#f9322f', marker: {symbol: 'diamond'}, data: [{y: 100}, 52, 46.85, 43.76, 41.38, 38.38, 35.55, 32.48, 29.41, 26.35, 22.25, 17.41]},
                    {name: 'Provider Average', color: '#7c97b8', marker: {symbol: 'circle'}, data: [37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37]},
                    {name: '90% ile', color: '#b10594', marker: {symbol: 'circle'}, data: [53, 53, 53, 53, 53, 53, 53, 53, 53, 53, 53, 53]},
                    {name: 'Current Provider Average', color: '#00a5a6', marker: {symbol: 'circle'}, data: [36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36]}
                ], "title": 'Peer Chart', "categories": ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']}
        },
        {"providerId": "79403874",
            "peerLine": {"value": [{color: '#4a7ebb', name: 'Other Providers', marker: {symbol: 'circle'}, data: [100, 52, 46.85, 43.76, 41.38, 38.38, 35.55, 32.48, {y: 29.41, marker: {symbol: 'url(http://www.highcharts.com/demo/gfx/sun.png)'}}, 26.35, 22.25, 17.41]},
                    {name: 'Current Provider', color: '#f9322f', marker: {symbol: 'diamond'}, data: [{y: 100}, 52, 46.85, 43.76, 41.38, 38.38, 35.55, 32.48, 29.41, 26.35, 22.25, 17.41]},
                    {name: 'Provider Average', color: '#7c97b8', marker: {symbol: 'circle'}, data: [37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37]},
                    {name: '90% ile', color: '#b10594', marker: {symbol: 'circle'}, data: [53, 53, 53, 53, 53, 53, 53, 53, 53, 53, 53, 53]},
                    {name: 'Current Provider Average', color: '#00a5a6', marker: {symbol: 'circle'}, data: [36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36]}
                ], "title": 'Peer Chart', "categories": ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']}
        },
        {"providerId": "53831859",
            "peerLine": {"value": [{color: '#4a7ebb', name: 'Other Providers', marker: {symbol: 'circle'}, data: [100, 52, 46.85, 43.76, 41.38, 38.38, 35.55, 32.48, {y: 29.41, marker: {symbol: 'url(http://www.highcharts.com/demo/gfx/sun.png)'}}, 26.35, 22.25, 17.41]},
                    {name: 'Current Provider', color: '#f9322f', marker: {symbol: 'diamond'}, data: [{y: 100}, 52, 46.85, 43.76, 41.38, 38.38, 35.55, 32.48, 29.41, 26.35, 22.25, 17.41]},
                    {name: 'Provider Average', color: '#7c97b8', marker: {symbol: 'circle'}, data: [37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37]},
                    {name: '90% ile', color: '#b10594', marker: {symbol: 'circle'}, data: [53, 53, 53, 53, 53, 53, 53, 53, 53, 53, 53, 53]},
                    {name: 'Current Provider Average', color: '#00a5a6', marker: {symbol: 'circle'}, data: [36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36]}
                ], "title": 'Peer Chart', "categories": ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']}
        },
        {"providerId": "76567667",
            "peerLine": {"value": [{color: '#4a7ebb', name: 'Other Providers', marker: {symbol: 'circle'}, data: [100, 52, 46.85, 43.76, 41.38, 38.38, 35.55, 32.48, {y: 29.41, marker: {symbol: 'url(http://www.highcharts.com/demo/gfx/sun.png)'}}, 26.35, 22.25, 17.41]},
                    {name: 'Current Provider', color: '#f9322f', marker: {symbol: 'diamond'}, data: [{y: 100}, 52, 46.85, 43.76, 41.38, 38.38, 35.55, 32.48, 29.41, 26.35, 22.25, 17.41]},
                    {name: 'Provider Average', color: '#7c97b8', marker: {symbol: 'circle'}, data: [37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37]},
                    {name: '90% ile', color: '#b10594', marker: {symbol: 'circle'}, data: [53, 53, 53, 53, 53, 53, 53, 53, 53, 53, 53, 53]},
                    {name: 'Current Provider Average', color: '#00a5a6', marker: {symbol: 'circle'}, data: [36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36]}
                ], "title": 'Peer Chart', "categories": ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']}
        },
        {"providerId": "86637643",
            "peerLine": {"value": [{color: '#4a7ebb', name: 'Other Providers', marker: {symbol: 'circle'}, data: [100, 52, 46.85, 43.76, 41.38, 38.38, 35.55, 32.48, {y: 29.41, marker: {symbol: 'url(http://www.highcharts.com/demo/gfx/sun.png)'}}, 26.35, 22.25, 17.41]},
                    {name: 'Current Provider', color: '#f9322f', marker: {symbol: 'diamond'}, data: [{y: 100}, 52, 46.85, 43.76, 41.38, 38.38, 35.55, 32.48, 29.41, 26.35, 22.25, 17.41]},
                    {name: 'Provider Average', color: '#7c97b8', marker: {symbol: 'circle'}, data: [37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37]},
                    {name: '90% ile', color: '#b10594', marker: {symbol: 'circle'}, data: [53, 53, 53, 53, 53, 53, 53, 53, 53, 53, 53, 53]},
                    {name: 'Current Provider Average', color: '#00a5a6', marker: {symbol: 'circle'}, data: [36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36]}
                ], "title": 'Peer Chart', "categories": ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']}
        },
        {"providerId": "93367632",
            "peerLine": {"value": [{color: '#4a7ebb', name: 'Other Providers', marker: {symbol: 'circle'}, data: [100, 52, 46.85, 43.76, 41.38, 38.38, 35.55, 32.48, {y: 29.41, marker: {symbol: 'url(http://www.highcharts.com/demo/gfx/sun.png)'}}, 26.35, 22.25, 17.41]},
                    {name: 'Current Provider', color: '#f9322f', marker: {symbol: 'diamond'}, data: [{y: 100}, 52, 46.85, 43.76, 41.38, 38.38, 35.55, 32.48, 29.41, 26.35, 22.25, 17.41]},
                    {name: 'Provider Average', color: '#7c97b8', marker: {symbol: 'circle'}, data: [37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37]},
                    {name: '90% ile', color: '#b10594', marker: {symbol: 'circle'}, data: [53, 53, 53, 53, 53, 53, 53, 53, 53, 53, 53, 53]},
                    {name: 'Current Provider Average', color: '#00a5a6', marker: {symbol: 'circle'}, data: [36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36]}
                ], "title": 'Peer Chart', "categories": ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']}
        },
        {"providerId": "86567234",
            "peerLine": {"value": [{color: '#4a7ebb', name: 'Other Providers', marker: {symbol: 'circle'}, data: [100, 52, 46.85, 43.76, 41.38, 38.38, 35.55, 32.48, {y: 29.41, marker: {symbol: 'url(http://www.highcharts.com/demo/gfx/sun.png)'}}, 26.35, 22.25, 17.41]},
                    {name: 'Current Provider', color: '#f9322f', marker: {symbol: 'diamond'}, data: [{y: 100}, 52, 46.85, 43.76, 41.38, 38.38, 35.55, 32.48, 29.41, 26.35, 22.25, 17.41]},
                    {name: 'Provider Average', color: '#7c97b8', marker: {symbol: 'circle'}, data: [37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37]},
                    {name: '90% ile', color: '#b10594', marker: {symbol: 'circle'}, data: [53, 53, 53, 53, 53, 53, 53, 53, 53, 53, 53, 53]},
                    {name: 'Current Provider Average', color: '#00a5a6', marker: {symbol: 'circle'}, data: [36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36]}
                ], "title": 'Peer Chart', "categories": ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']}
        },
        {"providerId": "96567367",
            "peerLine": {"value": [{color: '#4a7ebb', name: 'Other Providers', marker: {symbol: 'circle'}, data: [100, 52, 46.85, 43.76, 41.38, 38.38, 35.55, 32.48, {y: 29.41, marker: {symbol: 'url(http://www.highcharts.com/demo/gfx/sun.png)'}}, 26.35, 22.25, 17.41]},
                    {name: 'Current Provider', color: '#f9322f', marker: {symbol: 'diamond'}, data: [{y: 100}, 52, 46.85, 43.76, 41.38, 38.38, 35.55, 32.48, 29.41, 26.35, 22.25, 17.41]},
                    {name: 'Provider Average', color: '#7c97b8', marker: {symbol: 'circle'}, data: [37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37]},
                    {name: '90% ile', color: '#b10594', marker: {symbol: 'circle'}, data: [53, 53, 53, 53, 53, 53, 53, 53, 53, 53, 53, 53]},
                    {name: 'Current Provider Average', color: '#00a5a6', marker: {symbol: 'circle'}, data: [36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36]}
                ], "title": 'Peer Chart', "categories": ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']}
        },
        {"providerId": "29307171",
            "peerLine": {"value": [{color: '#4a7ebb', name: 'Other Providers', marker: {symbol: 'circle'}, data: [100, 52, 46.85, 43.76, 41.38, 38.38, 35.55, 32.48, {y: 29.41, marker: {symbol: 'url(http://www.highcharts.com/demo/gfx/sun.png)'}}, 26.35, 22.25, 17.41]},
                    {name: 'Current Provider', color: '#f9322f', marker: {symbol: 'diamond'}, data: [{y: 100}, 52, 46.85, 43.76, 41.38, 38.38, 35.55, 32.48, 29.41, 26.35, 22.25, 17.41]},
                    {name: 'Provider Average', color: '#7c97b8', marker: {symbol: 'circle'}, data: [37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37]},
                    {name: '90% ile', color: '#b10594', marker: {symbol: 'circle'}, data: [53, 53, 53, 53, 53, 53, 53, 53, 53, 53, 53, 53]},
                    {name: 'Current Provider Average', color: '#00a5a6', marker: {symbol: 'circle'}, data: [36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36]}
                ], "title": 'Peer Chart', "categories": ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']}
        },
        {"providerId": "27815901",
            "peerLine": {"value": [{color: '#4a7ebb', name: 'Other Providers', marker: {symbol: 'circle'}, data: [100, 52, 46.85, 43.76, 41.38, 38.38, 35.55, 32.48, {y: 29.41, marker: {symbol: 'url(http://www.highcharts.com/demo/gfx/sun.png)'}}, 26.35, 22.25, 17.41]},
                    {name: 'Current Provider', color: '#f9322f', marker: {symbol: 'diamond'}, data: [{y: 100}, 52, 46.85, 43.76, 41.38, 38.38, 35.55, 32.48, 29.41, 26.35, 22.25, 17.41]},
                    {name: 'Provider Average', color: '#7c97b8', marker: {symbol: 'circle'}, data: [37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37]},
                    {name: '90% ile', color: '#b10594', marker: {symbol: 'circle'}, data: [53, 53, 53, 53, 53, 53, 53, 53, 53, 53, 53, 53]},
                    {name: 'Current Provider Average', color: '#00a5a6', marker: {symbol: 'circle'}, data: [36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36]}
                ], "title": 'Peer Chart', "categories": ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']}
        },
        {"providerId": "56781231",
            "peerLine": {"value": [{color: '#4a7ebb', name: 'Other Providers', marker: {symbol: 'circle'}, data: [100, 52, 46.85, 43.76, 41.38, 38.38, 35.55, 32.48, {y: 29.41, marker: {symbol: 'url(http://www.highcharts.com/demo/gfx/sun.png)'}}, 26.35, 22.25, 17.41]},
                    {name: 'Current Provider', color: '#f9322f', marker: {symbol: 'diamond'}, data: [{y: 100}, 52, 46.85, 43.76, 41.38, 38.38, 35.55, 32.48, 29.41, 26.35, 22.25, 17.41]},
                    {name: 'Provider Average', color: '#7c97b8', marker: {symbol: 'circle'}, data: [37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37]},
                    {name: '90% ile', color: '#b10594', marker: {symbol: 'circle'}, data: [53, 53, 53, 53, 53, 53, 53, 53, 53, 53, 53, 53]},
                    {name: 'Current Provider Average', color: '#00a5a6', marker: {symbol: 'circle'}, data: [36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36]}
                ], "title": 'Peer Chart', "categories": ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']}
        },
        {"providerId": "65278001",
            "peerLine": {"value": [{color: '#4a7ebb', name: 'Other Providers', marker: {symbol: 'circle'}, data: [100, 52, 46.85, 43.76, 41.38, 38.38, 35.55, 32.48, {y: 29.41, marker: {symbol: 'url(http://www.highcharts.com/demo/gfx/sun.png)'}}, 26.35, 22.25, 17.41]},
                    {name: 'Current Provider', color: '#f9322f', marker: {symbol: 'diamond'}, data: [{y: 100}, 52, 46.85, 43.76, 41.38, 38.38, 35.55, 32.48, 29.41, 26.35, 22.25, 17.41]},
                    {name: 'Provider Average', color: '#7c97b8', marker: {symbol: 'circle'}, data: [37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37]},
                    {name: '90% ile', color: '#b10594', marker: {symbol: 'circle'}, data: [53, 53, 53, 53, 53, 53, 53, 53, 53, 53, 53, 53]},
                    {name: 'Current Provider Average', color: '#00a5a6', marker: {symbol: 'circle'}, data: [36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36]}
                ], "title": 'Peer Chart', "categories": ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']}
        },
        {"providerId": "65278011",
            "peerLine": {"value": [{color: '#4a7ebb', name: 'Other Providers', marker: {symbol: 'circle'}, data: [100, 52, 46.85, 43.76, 41.38, 38.38, 35.55, 32.48, {y: 29.41, marker: {symbol: 'url(http://www.highcharts.com/demo/gfx/sun.png)'}}, 26.35, 22.25, 17.41]},
                    {name: 'Current Provider', color: '#f9322f', marker: {symbol: 'diamond'}, data: [{y: 100}, 52, 46.85, 43.76, 41.38, 38.38, 35.55, 32.48, 29.41, 26.35, 22.25, 17.41]},
                    {name: 'Provider Average', color: '#7c97b8', marker: {symbol: 'circle'}, data: [37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37]},
                    {name: '90% ile', color: '#b10594', marker: {symbol: 'circle'}, data: [53, 53, 53, 53, 53, 53, 53, 53, 53, 53, 53, 53]},
                    {name: 'Current Provider Average', color: '#00a5a6', marker: {symbol: 'circle'}, data: [36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36]}
                ], "title": 'Peer Chart', "categories": ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']}
        }

    ],
    providerPeerLineChartData: [
        {"providerId": "93847521",
            "peerLine": {"value": [{color: '#4a7ebb', name: 'Other Providers', marker: {symbol: 'circle'}, data: [100, 52, 46.85, 43.76, 41.38, 38.38, 35.55, 32.48, {y: 29.41, marker: {symbol: 'url(http://www.highcharts.com/demo/gfx/sun.png)'}}, 26.35, 22.25, 17.41]},
                    {name: 'Current Provider', color: '#f9322f', marker: {symbol: 'diamond'}, data: [{y: 100}, 52, 46.85, 43.76, 41.38, 38.38, 35.55, 32.48, 29.41, 26.35, 22.25, 17.41]},
                    {name: 'Provider Average', color: '#7c97b8', marker: {symbol: 'circle'}, data: [37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37]},
                    {name: '90% ile', color: '#b10594', marker: {symbol: 'circle'}, data: [53, 53, 53, 53, 53, 53, 53, 53, 53, 53, 53, 53]},
                    {name: 'Current Provider Average', color: '#00a5a6', marker: {symbol: 'circle'}, data: [36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36]}
                ], "title": 'Peer Chart', "categories": ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']}
        }
    ],
    heatMapChartData: [{"providerName": "John Smith", "providerId": "93847521", "services": "Practitioner", "address": "First Avenue at 16th Street, New York, NY", "total_Claim": "11", "unique_patient": "9", "provider_specialty": "Psychiatry", "risk_reason1": "Specialty - Procedure Mismatch", "amount": "$20,120", "risk_amount": "$8,012", "risk_reason2": "Claims contains codes inconsistent with provider specialty", "risk_score": 97, "provider_group": "Newport", "primaryDiagnosisClass": "MS-601", "serviceCategory": "Hosp. Outpatient"},
	{
		"providerId": 48527633,
		"risk_score": 45,
		"primaryDiagnosisClass": "MS-604",
		"providerName": "William Bell",
		"provider_specialty": "Psychiatry",
		"amount": "$62,416",
		"provider_group": "Newport",
		"services": "Practitioner",
		"address": "First Avenue at 16th Street, New York, NY",
		"total_Claim": 11,
		"unique_patient": 9,
		"risk_reason1": "None",
		"risk_amount": "$5,076",
		"risk_reason2": "None",
		"serviceCategory": "Hosp. Outpatient"
	},
        {"providerName": "Larry Bucshon", "providerId": "98235623", "services": "Practitioner", "address": "462 First Avenue, New York, NY", "total_Claim": "15", "unique_patient": "12", "provider_specialty": "Cardiologist", "risk_reason1": "Overcharging", "amount": "$19,402", "risk_amount": "$3,800", "risk_reason2": "Claims are overcharged with the threshold cost", "risk_score": 95, "provider_group": "Northwest", "primaryDiagnosisClass": "MS-601", "serviceCategory": "Home Professional"},
        {"providerName": "Chuck Brown", "providerId": "40926608", "services": "Practitioner", "address": "2070 Clinton Ave, Alameda CA, 02903", "total_Claim": "18", "unique_patient": "15", "provider_specialty": "Clinical Psychology", "risk_reason1": "Unbundling", "amount": "$17,211", "risk_amount": "$3,400", "risk_reason2": "Parent procedure code is available that can be used instead unbundled procedures", "risk_score": 93, "provider_group": "Newport", "primaryDiagnosisClass": "MS-602", "serviceCategory": "Ambulatory"},
        {"providerName": "Britni Murrow", "providerId": "24329643", "services": "Practitioner", "address": "577 S Main Street, Providence, RI, 02903", "total_Claim": "10", "unique_patient": "10", "provider_specialty": "Oncologist", "risk_reason1": "Overcharging", "amount": "$10,345", "risk_amount": "$3,012", "risk_reason2": "Claims are overcharged with the threshold cost", "risk_score": 92, "provider_group": "Freeport", "primaryDiagnosisClass": "MS-601", "serviceCategory": "Laboratory"},
        {"providerName": "Joe Heck", "providerId": "79403874", "services": "Practitioner", "address": "2450 Ashby Avenue Berkeley , CA 94705", "total_Claim": "12", "unique_patient": "11", "provider_specialty": "General Surgery", "risk_reason1": "High Duration", "amount": "$9,007", "risk_amount": "$2,012", "risk_reason2": "Duration for the treatment is high than usual period it takes", "risk_score": 91, "provider_group": "Mountain Hill", "primaryDiagnosisClass": "MS-601", "serviceCategory": "Physician"},
        {"providerName": "Susan White", "providerId": "53831859", "services": "Practitioner", "address": "350 Hawthorne Avenue Oakland , CA 94609", "total_Claim": "13", "unique_patient": "12", "provider_specialty": "Clinical Psychology", "risk_reason1": "Unbundling", "amount": "$7,900", "risk_amount": "$2,012", "risk_reason2": "Parent procedure code is available that can be used instead unbundled procedures", "risk_score": 90, "provider_group": "Newport", "primaryDiagnosisClass": "MS-602", "serviceCategory": "Physical Therapist"},
        {"providerName": "Susan White", "providerId": "76567667", "services": "Psychiatry, General Surgery, Priv Dent", "address": "462 First Avenue, New York, NY", "total_Claim": "10", "unique_patient": "9", "provider_specialty": "Cardiologist", "risk_reason1": "Overcharging", "amount": "$29,400", "risk_amount": "$6,112", "risk_reason2": "Claims are overcharged with the threshold cost", "risk_score": 90, "provider_group": "Northwest", "primaryDiagnosisClass": "MS-601", "serviceCategory": "Physician"},
        {"providerName": "Tim White", "providerId": "86637643", "services": "ICF/MR, Cardiologist", "address": "2070 Clinton Ave, Alameda CA, 02903", "total_Claim": "15", "unique_patient": "12", "provider_specialty": "General Medicine", "risk_reason1": "Unbundling", "amount": "$13,015", "risk_amount": "$2,012", "risk_reason2": "Parent procedure code is available that can be used instead unbundled procedures", "risk_score": 90, "provider_group": "Freeport", "primaryDiagnosisClass": "MS-603", "serviceCategory": "Laboratory"},
        {"providerName": "Mark Lekar", "providerId": "93367632", "services": "Durable Med Equip, Dental Clinic", "address": "577 S Main Street, Providence, RI, 02903", "total_Claim": "16", "unique_patient": "16", "provider_specialty": "Oncologist", "risk_reason1": "Overcharging", "amount": "$10,008", "risk_amount": "$2,012", "risk_reason2": "Claims are overcharged with the threshold cost", "risk_score": 90, "provider_group": "Mountain Hill", "primaryDiagnosisClass": "MS-601", "serviceCategory": "Laboratory"},
        {"providerName": "Britni Murrow", "providerId": "86567234", "services": "General Surgery, Endocrinology", "address": "2450 Ashby Avenue Berkeley , CA 94705", "total_Claim": "19", "unique_patient": "18", "provider_specialty": "Cardiologist", "risk_reason1": "High Duration", "amount": "$9,290", "risk_amount": "$2,012", "risk_reason2": "Duration for the treatment is high than usual period it takes", "risk_score": 89, "provider_group": "Spring Field", "primaryDiagnosisClass": "MS-603", "serviceCategory": "Ambulatory"},
        {"providerName": "John White", "providerId": "96567367", "services": "Laboratory, Ear Care", "address": "350 Hawthorne Avenue Oakland , CA 94609", "total_Claim": "22", "unique_patient": "20", "provider_specialty": "Psychiatry", "risk_reason1": "Unbundling", "amount": "$9,247", "risk_amount": "$2,012", "risk_reason2": "Parent procedure code is available that can be used instead unbundled procedures", "risk_score": 89, "provider_group": "Newport", "primaryDiagnosisClass": "MS-604", "serviceCategory": "Ambulatory"},
        {"providerName": "John Heck", "providerId": "93847522", "services": "Practitioner", "address": "First Avenue at 16th Street, New York, NY", "total_Claim": "11", "unique_patient": "9", "provider_specialty": "Psychiatry", "risk_reason1": "Specialty - Procedure Mismatch", "amount": "$20,120", "risk_amount": "$5012", "risk_reason2": "Claims contains codes inconsistent with provider specialty", "risk_score": 89, "provider_group": "Newport", "primaryDiagnosisClass": "MS-604", "serviceCategory": "Home Professional"},
        {"providerName": "Larry Gomes", "providerId": "98235624", "services": "Practitioner", "address": "462 First Avenue, New York, NY", "total_Claim": "15", "unique_patient": "12", "provider_specialty": "Cardiologist", "risk_reason1": "Overcharging", "amount": "$19,402", "risk_amount": "$8,012", "risk_reason2": "Claims are overcharged with the threshold cost", "risk_score": 88, "provider_group": "Northwest", "primaryDiagnosisClass": "MS-601", "serviceCategory": "Hosp. Outpatient"},
        {"providerName": "Howard Page", "providerId": "40926609", "services": "Practitioner", "address": "2070 Clinton Ave, Alameda CA, 02903", "total_Claim": "18", "unique_patient": "15", "provider_specialty": "Clinical Psychology", "risk_reason1": "Unbundling", "amount": "$17,211", "risk_amount": "$2,012", "risk_reason2": "Parent procedure code is available that can be used instead unbundled procedures", "risk_score": 88, "provider_group": "Newport", "primaryDiagnosisClass": "MS-605", "serviceCategory": "Home Professional"},
        {"providerName": "Britni Murrow", "providerId": "24329644", "services": "Practitioner", "address": "577 S Main Street, Providence, RI, 02903", "total_Claim": "10", "unique_patient": "10", "provider_specialty": "Oncologist", "risk_reason1": "Overcharging", "amount": "$10,345", "risk_amount": "$2,012", "risk_reason2": "Claims are overcharged with the threshold cost", "risk_score": 88, "provider_group": "Freeport", "primaryDiagnosisClass": "MS-601", "serviceCategory": "Home Professional"},
        {"providerName": "Joe Henry", "providerId": "79403875", "services": "Practitioner", "address": "2450 Ashby Avenue Berkeley , CA 94705", "total_Claim": "12", "unique_patient": "11", "provider_specialty": "General Surgery", "risk_reason1": "High Duration", "amount": "$9,007", "risk_amount": "$2,012", "risk_reason2": "Duration for the treatment is high than usual period it takes", "risk_score": 88, "provider_group": "Mountain Hill", "primaryDiagnosisClass": "MS-601", "serviceCategory": "Ambulatory"},
        {"providerName": "Susan White", "providerId": "53831858", "services": "Practitioner", "address": "350 Hawthorne Avenue Oakland , CA 94609", "total_Claim": "13", "unique_patient": "12", "provider_specialty": "Clinical Psychology", "risk_reason1": "Unbundling", "amount": "$7,900", "risk_amount": "$2,012", "risk_reason2": "Parent procedure code is available that can be used instead unbundled procedures", "risk_score": 87, "provider_group": "Newport", "primaryDiagnosisClass": "MS-605", "serviceCategory": "Laboratory"},
        {"providerName": "Susan White", "providerId": "76567668", "services": "Psychiatry, General Surgery, Priv Dent", "address": "462 First Avenue, New York, NY", "total_Claim": "10", "unique_patient": "9", "provider_specialty": "Cardiologist", "risk_reason1": "Overcharging", "amount": "$29,400", "risk_amount": "$2,012", "risk_reason2": "Claims are overcharged with the threshold cost", "risk_score": 87, "provider_group": "Northwest", "primaryDiagnosisClass": "MS-601", "serviceCategory": "Physician"},
        {"providerName": "Tim White", "providerId": "86637644", "services": "ICF/MR, Cardiologist", "address": "2070 Clinton Ave, Alameda CA, 02903", "total_Claim": "15", "unique_patient": "12", "provider_specialty": "General Medicine", "risk_reason1": "Unbundling", "amount": "$13,015", "risk_amount": "$2,012", "risk_reason2": "Parent procedure code is available that can be used instead unbundled procedures", "risk_score": 87, "provider_group": "Freeport", "primaryDiagnosisClass": "MS-603", "serviceCategory": "Physician"},
        {"providerName": "Mark Lekar", "providerId": "93367633", "services": "Durable Med Equip, Dental Clinic", "address": "577 S Main Street, Providence, RI, 02903", "total_Claim": "16", "unique_patient": "16", "provider_specialty": "Oncologist", "risk_reason1": "Overcharging", "amount": "$10,008", "risk_amount": "$2,012", "risk_reason2": "Claims are overcharged with the threshold cost", "risk_score": 85, "provider_group": "Mountain Hill", "primaryDiagnosisClass": "MS-602", "serviceCategory": "Physician"},
        {"providerName": "Britni Murrow", "providerId": "86567235", "services": "General Surgery, Endocrinology", "address": "2450 Ashby Avenue Berkeley , CA 94705", "total_Claim": "19", "unique_patient": "18", "provider_specialty": "Cardiologist", "risk_reason1": "High Duration", "amount": "$9,290", "risk_amount": "$2,012", "risk_reason2": "Duration for the treatment is high than usual period it takes", "risk_score": 85, "provider_group": "Spring Field", "primaryDiagnosisClass": "MS-603", "serviceCategory": "Ambulatory"},
        {"providerName": "John White", "providerId": "96567368", "services": "Laboratory, Ear Care", "address": "350 Hawthorne Avenue Oakland , CA 94609", "total_Claim": "22", "unique_patient": "20", "provider_specialty": "Psychiatry", "risk_reason1": "Unbundling", "amount": "$9,247", "risk_amount": "$2,012", "risk_reason2": "Parent procedure code is available that can be used instead unbundled procedures", "risk_score": 80, "provider_group": "Newport", "primaryDiagnosisClass": "MS-604", "serviceCategory": "Ambulatory"},
        {
            "providerId": 29527633,
            "risk_score": 79,
            "primaryDiagnosisClass": "MS-601",
            "providerName": "Jeff Jackson",
            "provider_specialty": "Cardiologist",
            "amount": "$16,080",
            "provider_group": "Newport",
            "services": "Practitioner",
            "address": "First Avenue at 16th Street, New York, NY",
            "total_Claim": 11,
            "unique_patient": 9,
            "risk_reason1": "None",
            "risk_amount": "$5,000",
            "risk_reason2": "None",
            "serviceCategory": "Hosp. Outpatient"
        },
        {
            "providerId": 11677633,
            "risk_score": 78,
            "primaryDiagnosisClass": "MS-602",
            "providerName": "Mark Well",
            "provider_specialty": "Cardiologist",
            "amount": "$16,330",
            "provider_group": "Newport",
            "services": "Practitioner",
            "address": "First Avenue at 16th Street, New York, NY",
            "total_Claim": 11,
            "unique_patient": 9,
            "risk_reason1": "None",
            "risk_amount": "$5,000",
            "risk_reason2": "None",
            "serviceCategory": "Hosp. Outpatient"
        },
        {
            "providerId": 84027633,
            "risk_score": 76,
            "primaryDiagnosisClass": "MS-605",
            "providerName": "Robert Half",
            "provider_specialty": "Cardiologist",
            "amount": "$19,060",
            "provider_group": "Newport",
            "services": "Practitioner",
            "address": "First Avenue at 16th Street, New York, NY",
            "total_Claim": 11,
            "unique_patient": 9,
            "risk_reason1": "None",
            "risk_amount": "$5,000",
            "risk_reason2": "None",
            "serviceCategory": "Hosp. Outpatient"
        },
        {
            "providerId": 11707633,
            "risk_score": 75,
            "primaryDiagnosisClass": "MS-604",
            "providerName": "Helen Teller",
            "provider_specialty": "Cardiologist",
            "amount": "$17,970",
            "provider_group": "Newport",
            "services": "Practitioner",
            "address": "First Avenue at 16th Street, New York, NY",
            "total_Claim": 11,
            "unique_patient": 9,
            "risk_reason1": "None",
            "risk_amount": "$5,000",
            "risk_reason2": "None",
            "serviceCategory": "Hosp. Outpatient"
        },
        {
            "providerId": 72277633,
            "risk_score": 73,
            "primaryDiagnosisClass": "MS-602",
            "providerName": "Linda Smith",
            "provider_specialty": "Oncologist",
            "amount": "$19,150",
            "provider_group": "Newport",
            "services": "Practitioner",
            "address": "First Avenue at 16th Street, New York, NY",
            "total_Claim": 11,
            "unique_patient": 9,
            "risk_reason1": "None",
            "risk_amount": "$5,000",
            "risk_reason2": "None",
            "serviceCategory": "Hosp. Outpatient"
        },
        {
            "providerId": 35287633,
            "risk_score": 68,
            "primaryDiagnosisClass": "MS-603",
            "providerName": "Kenneth Jupiter",
            "provider_specialty": "Oncologist",
            "amount": "$15,140",
            "provider_group": "Newport",
            "services": "Practitioner",
            "address": "First Avenue at 16th Street, New York, NY",
            "total_Claim": 11,
            "unique_patient": 9,
            "risk_reason1": "None",
            "risk_amount": "$5,000",
            "risk_reason2": "None",
            "serviceCategory": "Hosp. Outpatient"
        },
        {
            "providerId": 12927633,
            "risk_score": 68,
            "primaryDiagnosisClass": "Group-105",
            "providerName": "George Hamilton",
            "provider_specialty": "Oncologist",
            "amount": "$16,110",
            "provider_group": "Newport",
            "services": "Practitioner",
            "address": "First Avenue at 16th Street, New York, NY",
            "total_Claim": 11,
            "unique_patient": 9,
            "risk_reason1": "None",
            "risk_amount": "$5,000",
            "risk_reason2": "None",
            "serviceCategory": "Hosp. Outpatient"
        },
        {
            "providerId": 33527633,
            "risk_score": 64,
            "primaryDiagnosisClass": "MS-603",
            "providerName": "Donna Barbarra",
            "provider_specialty": "Oncologist",
            "amount": "$18,190",
            "provider_group": "Newport",
            "services": "Practitioner",
            "address": "First Avenue at 16th Street, New York, NY",
            "total_Claim": 11,
            "unique_patient": 9,
            "risk_reason1": "None",
            "risk_amount": "$5,000",
            "risk_reason2": "None",
            "serviceCategory": "Hosp. Outpatient"
        },
        {
            "providerId": 11407633,
            "risk_score": 60,
            "primaryDiagnosisClass": "MS-605",
            "providerName": "Patricia Andrew",
            "provider_specialty": "Oncologist",
            "amount": "$15,640",
            "provider_group": "Newport",
            "services": "Practitioner",
            "address": "First Avenue at 16th Street, New York, NY",
            "total_Claim": 11,
            "unique_patient": 9,
            "risk_reason1": "None",
            "risk_amount": "$5,000",
            "risk_reason2": "None",
            "serviceCategory": "Hosp. Outpatient"
        },
        {
            "providerId": 88076332,
            "risk_score": 60,
            "primaryDiagnosisClass": "MS-601",
            "providerName": "Edward Warding",
            "provider_specialty": "Radiologist",
            "amount": "$15,020",
            "provider_group": "Newport",
            "services": "Practitioner",
            "address": "First Avenue at 16th Street, New York, NY",
            "total_Claim": 11,
            "unique_patient": 9,
            "risk_reason1": "None",
            "risk_amount": "$5,000",
            "risk_reason2": "None",
            "serviceCategory": "Hosp. Outpatient"
        },
        {
            "providerId": 79276337,
            "risk_score": 56,
            "primaryDiagnosisClass": "MS-604",
            "providerName": "Charles Kennel",
            "provider_specialty": "Radiologist",
            "amount": "$17,530",
            "provider_group": "Newport",
            "services": "Practitioner",
            "address": "First Avenue at 16th Street, New York, NY",
            "total_Claim": 11,
            "unique_patient": 9,
            "risk_reason1": "None",
            "risk_amount": "$5,000",
            "risk_reason2": "None",
            "serviceCategory": "Hosp. Outpatient"
        },
        {
            "providerId": 64763327,
            "risk_score": 50,
            "primaryDiagnosisClass": "MS-603",
            "providerName": "Michelle White",
            "provider_specialty": "Radiologist",
            "amount": "$19,570",
            "provider_group": "Newport",
            "services": "Practitioner",
            "address": "First Avenue at 16th Street, New York, NY",
            "total_Claim": 11,
            "unique_patient": 9,
            "risk_reason1": "None",
            "risk_amount": "$5,000",
            "risk_reason2": "None",
            "serviceCategory": "Hosp. Outpatient"
        },
        {
            "providerId": 97763377,
            "risk_score": 42,
            "primaryDiagnosisClass": "MS-602",
            "providerName": "Margaret Webb",
            "provider_specialty": "Radiologist",
            "amount": "$18,280",
            "provider_group": "Newport",
            "services": "Practitioner",
            "address": "First Avenue at 16th Street, New York, NY",
            "total_Claim": 11,
            "unique_patient": 9,
            "risk_reason1": "None",
            "risk_amount": "$5,000",
            "risk_reason2": "None",
            "serviceCategory": "Hosp. Outpatient"
        },
        {
            "providerId": 85763352,
            "risk_score": 41,
            "primaryDiagnosisClass": "MS-602",
            "providerName": "Joseph John",
            "provider_specialty": "Radiologist",
            "amount": "$17,560",
            "provider_group": "Newport",
            "services": "Practitioner",
            "address": "First Avenue at 16th Street, New York, NY",
            "total_Claim": 11,
            "unique_patient": 9,
            "risk_reason1": "None",
            "risk_amount": "$5,000",
            "risk_reason2": "None",
            "serviceCategory": "Hosp. Outpatient"
        },
        {
            "providerId": 82527633,
            "risk_score": 40,
            "primaryDiagnosisClass": "MS-601",
            "providerName": "Laura Andrew",
            "provider_specialty": "Radiologist",
            "amount": "$16,340",
            "provider_group": "Newport",
            "services": "Practitioner",
            "address": "First Avenue at 16th Street, New York, NY",
            "total_Claim": 11,
            "unique_patient": 9,
            "risk_reason1": "None",
            "risk_amount": "$5,000",
            "risk_reason2": "None",
            "serviceCategory": "Hosp. Outpatient"
        },
        {
            "providerId": 12776332,
            "risk_score": 40,
            "primaryDiagnosisClass": "MS-602",
            "providerName": "Jennifer Jackson",
            "provider_specialty": "Radiologist",
            "amount": "$19,470",
            "provider_group": "Newport",
            "services": "Practitioner",
            "address": "First Avenue at 16th Street, New York, NY",
            "total_Claim": 11,
            "unique_patient": 9,
            "risk_reason1": "None",
            "risk_amount": "$5,000",
            "risk_reason2": "None",
            "serviceCategory": "Hosp. Outpatient"
        },
        {
            "providerId": 82276337,
            "risk_score": 40,
            "primaryDiagnosisClass": "MS-602",
            "providerName": "Brian Lara",
            "provider_specialty": "Radiologist",
            "amount": "$15,010",
            "provider_group": "Newport",
            "services": "Practitioner",
            "address": "First Avenue at 16th Street, New York, NY",
            "total_Claim": 11,
            "unique_patient": 9,
            "risk_reason1": "None",
            "risk_amount": "$5,000",
            "risk_reason2": "None",
            "serviceCategory": "Hosp. Outpatient"
        },
        {
            "providerId": 27276337,
            "risk_score": 40,
            "primaryDiagnosisClass": "MS-602",
            "providerName": "Sandra Anderson",
            "provider_specialty": "Psychiatry",
            "amount": "$21340",
            "provider_group": "Newport",
            "services": "Practitioner",
            "address": "First Avenue at 16th Street, New York, NY",
            "total_Claim": 11,
            "unique_patient": 9,
            "risk_reason1": "None",
            "risk_amount": "$5,000",
            "risk_reason2": "None",
            "serviceCategory": "Hosp. Outpatient"
        },
        {
            "providerId": 97633027,
            "risk_score": 40,
            "primaryDiagnosisClass": "MS-601",
            "providerName": "Michael Andrew",
            "provider_specialty": "Psychiatry",
            "amount": "$19,470",
            "provider_group": "Newport",
            "services": "Practitioner",
            "address": "First Avenue at 16th Street, New York, NY",
            "total_Claim": 11,
            "unique_patient": 9,
            "risk_reason1": "None",
            "risk_amount": "$5,000",
            "risk_reason2": "None",
            "serviceCategory": "Hosp. Outpatient"
        },
        {
            "providerId": 27076332,
            "risk_score": 39,
            "primaryDiagnosisClass": "MS-602",
            "providerName": "Donald Andrew",
            "provider_specialty": "Psychiatry",
            "amount": "$19,610",
            "provider_group": "Newport",
            "services": "Practitioner",
            "address": "First Avenue at 16th Street, New York, NY",
            "total_Claim": 11,
            "unique_patient": 9,
            "risk_reason1": "None",
            "risk_amount": "$5,000",
            "risk_reason2": "None",
            "serviceCategory": "Hosp. Outpatient"
        },
        {
            "providerId": 83776337,
            "risk_score": 39,
            "primaryDiagnosisClass": "MS-603",
            "providerName": "Mary Matthew",
            "provider_specialty": "Psychiatry",
            "amount": "$16,910",
            "provider_group": "Newport",
            "services": "Practitioner",
            "address": "First Avenue at 16th Street, New York, NY",
            "total_Claim": 11,
            "unique_patient": 9,
            "risk_reason1": "None",
            "risk_amount": "$5,000",
            "risk_reason2": "None",
            "serviceCategory": "Hosp. Outpatient"
        },
        {
            "providerId": 19776337,
            "risk_score": 37,
            "primaryDiagnosisClass": "MS-604",
            "providerName": "Thomas Johnson",
            "provider_specialty": "Psychiatry",
            "amount": "$16,250",
            "provider_group": "Newport",
            "services": "Practitioner",
            "address": "First Avenue at 16th Street, New York, NY",
            "total_Claim": 11,
            "unique_patient": 9,
            "risk_reason1": "None",
            "risk_amount": "$5,000",
            "risk_reason2": "None",
            "serviceCategory": "Hosp. Outpatient"
        },
        {
            "providerId": 12476337,
            "risk_score": 36,
            "primaryDiagnosisClass": "MS-605",
            "providerName": "Sarah Amerson",
            "provider_specialty": "Psychiatry",
            "amount": "$15,790",
            "provider_group": "Newport",
            "services": "Practitioner",
            "address": "First Avenue at 16th Street, New York, NY",
            "total_Claim": 11,
            "unique_patient": 9,
            "risk_reason1": "None",
            "risk_amount": "$5,000",
            "risk_reason2": "None",
            "serviceCategory": "Hosp. Outpatient"
        },
        {
            "providerId": 56027633,
            "risk_score": 34,
            "primaryDiagnosisClass": "MS-604",
            "providerName": "Lisa Taco",
            "provider_specialty": "Psychiatry",
            "amount": "$15,010",
            "provider_group": "Newport",
            "services": "Practitioner",
            "address": "First Avenue at 16th Street, New York, NY",
            "total_Claim": 11,
            "unique_patient": 9,
            "risk_reason1": "None",
            "risk_amount": "$5,000",
            "risk_reason2": "None",
            "serviceCategory": "Hosp. Outpatient"
        },
        {
            "providerId": 11257633,
            "risk_score": 33,
            "primaryDiagnosisClass": "MS-601",
            "providerName": "Ronald Holmes",
            "provider_specialty": "Psychiatry",
            "amount": "$16,420",
            "provider_group": "Newport",
            "services": "Practitioner",
            "address": "First Avenue at 16th Street, New York, NY",
            "total_Claim": 11,
            "unique_patient": 9,
            "risk_reason1": "None",
            "risk_amount": "$5,000",
            "risk_reason2": "None",
            "serviceCategory": "Hosp. Outpatient"
        },
        {
            "providerId": 10927637,
            "risk_score": 33,
            "primaryDiagnosisClass": "MS-601",
            "providerName": "Maria Paul",
            "provider_specialty": "Psychiatry",
            "amount": "$15,120",
            "provider_group": "Newport",
            "services": "Practitioner",
            "address": "First Avenue at 16th Street, New York, NY",
            "total_Claim": 11,
            "unique_patient": 9,
            "risk_reason1": "None",
            "risk_amount": "$5,000",
            "risk_reason2": "None",
            "serviceCategory": "Hosp. Outpatient"
        },
        {
            "providerId": 86576332,
            "risk_score": 33,
            "primaryDiagnosisClass": "MS-605",
            "providerName": "Paul Mitchell",
            "provider_specialty": "Oncologist",
            "amount": "$19,840",
            "provider_group": "Newport",
            "services": "Practitioner",
            "address": "First Avenue at 16th Street, New York, NY",
            "total_Claim": 11,
            "unique_patient": 9,
            "risk_reason1": "None",
            "risk_amount": "$5,000",
            "risk_reason2": "None",
            "serviceCategory": "Hosp. Outpatient"
        },
        {
            "providerId": 11377633,
            "risk_score": 33,
            "primaryDiagnosisClass": "MS-604",
            "providerName": "John Amazing",
            "provider_specialty": "Oncologist",
            "amount": "$19,210",
            "provider_group": "Newport",
            "services": "Practitioner",
            "address": "First Avenue at 16th Street, New York, NY",
            "total_Claim": 11,
            "unique_patient": 9,
            "risk_reason1": "None",
            "risk_amount": "$5,000",
            "risk_reason2": "None",
            "serviceCategory": "Hosp. Outpatient"
        },
        {
            "providerId": 57633077,
            "risk_score": 33,
            "primaryDiagnosisClass": "MS-603",
            "providerName": "Betty Bill",
            "provider_specialty": "Oncologist",
            "amount": "$19,490",
            "provider_group": "Newport",
            "services": "Practitioner",
            "address": "First Avenue at 16th Street, New York, NY",
            "total_Claim": 11,
            "unique_patient": 9,
            "risk_reason1": "None",
            "risk_amount": "$5,000",
            "risk_reason2": "None",
            "serviceCategory": "Hosp. Outpatient"
        },
        {
            "providerId": 90176332,
            "risk_score": 32,
            "primaryDiagnosisClass": "MS-602",
            "providerName": "Rini Andrew",
            "provider_specialty": "Psychiatry",
            "amount": "$18,740",
            "provider_group": "Newport",
            "services": "Practitioner",
            "address": "First Avenue at 16th Street, New York, NY",
            "total_Claim": 11,
            "unique_patient": 9,
            "risk_reason1": "None",
            "risk_amount": "$5,000",
            "risk_reason2": "None",
            "serviceCategory": "Hosp. Outpatient"
        },
        {
            "providerId": 54527633,
            "risk_score": 30,
            "primaryDiagnosisClass": "MS-603",
            "providerName": "Barbara Amerson",
            "provider_specialty": "Physician",
            "amount": "$19,560",
            "provider_group": "Newport",
            "services": "Practitioner",
            "address": "First Avenue at 16th Street, New York, NY",
            "total_Claim": 11,
            "unique_patient": 9,
            "risk_reason1": "None",
            "risk_amount": "$5,000",
            "risk_reason2": "None",
            "serviceCategory": "Hosp. Outpatient"
        },
        {
            "providerId": 46076332,
            "risk_score": 30,
            "primaryDiagnosisClass": "MS-603",
            "providerName": "Ruth Kelley",
            "provider_specialty": "Physician",
            "amount": "$17,810",
            "provider_group": "Newport",
            "services": "Practitioner",
            "address": "First Avenue at 16th Street, New York, NY",
            "total_Claim": 11,
            "unique_patient": 9,
            "risk_reason1": "None",
            "risk_amount": "$5,000",
            "risk_reason2": "None",
            "serviceCategory": "Hosp. Outpatient"
        },
        {
            "providerId": 37076332,
            "risk_score": 29,
            "primaryDiagnosisClass": "MS-602",
            "providerName": "Richard Paul",
            "provider_specialty": "Physician",
            "amount": "$17,430",
            "provider_group": "Newport",
            "services": "Practitioner",
            "address": "First Avenue at 16th Street, New York, NY",
            "total_Claim": 11,
            "unique_patient": 9,
            "risk_reason1": "None",
            "risk_amount": "$5,000",
            "risk_reason2": "None",
            "serviceCategory": "Hosp. Outpatient"
        },
        {
            "providerId": 58776337,
            "risk_score": 29,
            "primaryDiagnosisClass": "MS-602",
            "providerName": "Anthony Kepler",
            "provider_specialty": "Clinical Psychology",
            "amount": "$16,230",
            "provider_group": "Newport",
            "services": "Practitioner",
            "address": "First Avenue at 16th Street, New York, NY",
            "total_Claim": 11,
            "unique_patient": 9,
            "risk_reason1": "None",
            "risk_amount": "$5,000",
            "risk_reason2": "None",
            "serviceCategory": "Hosp. Outpatient"
        },
        {
            "providerId": 14076332,
            "risk_score": 27,
            "primaryDiagnosisClass": "MS-603",
            "providerName": "Christopher Anderson",
            "provider_specialty": "Clinical Psychology",
            "amount": "$17,250",
            "provider_group": "Newport",
            "services": "Practitioner",
            "address": "First Avenue at 16th Street, New York, NY",
            "total_Claim": 11,
            "unique_patient": 9,
            "risk_reason1": "None",
            "risk_amount": "$5,000",
            "risk_reason2": "None",
            "serviceCategory": "Hosp. Outpatient"
        },
        {
            "providerId": 71027633,
            "risk_score": 25,
            "primaryDiagnosisClass": "MS-604",
            "providerName": "Kimberly Clarks",
            "provider_specialty": "Clinical Psychology",
            "amount": "$17,760",
            "provider_group": "Newport",
            "services": "Practitioner",
            "address": "First Avenue at 16th Street, New York, NY",
            "total_Claim": 11,
            "unique_patient": 9,
            "risk_reason1": "None",
            "risk_amount": "$5,000",
            "risk_reason2": "None",
            "serviceCategory": "Hosp. Outpatient"
        },
        {
            "providerId": 43527633,
            "risk_score": 23,
            "primaryDiagnosisClass": "MS-602",
            "providerName": "Susan Smith",
            "provider_specialty": "Clinical Psychology",
            "amount": "$18,290",
            "provider_group": "Newport",
            "services": "Practitioner",
            "address": "First Avenue at 16th Street, New York, NY",
            "total_Claim": 11,
            "unique_patient": 9,
            "risk_reason1": "None",
            "risk_amount": "$5,000",
            "risk_reason2": "None",
            "serviceCategory": "Hosp. Outpatient"
        },
        {
            "providerId": 50217633,
            "risk_score": 21,
            "primaryDiagnosisClass": "MS-603",
            "providerName": "Kevin Petterson",
            "provider_specialty": "Urologists",
            "amount": "$15,960",
            "provider_group": "Newport",
            "services": "Practitioner",
            "address": "First Avenue at 16th Street, New York, NY",
            "total_Claim": 11,
            "unique_patient": 9,
            "risk_reason1": "None",
            "risk_amount": "$5,000",
            "risk_reason2": "None",
            "serviceCategory": "Hosp. Outpatient"
        },
        {
            "providerId": 10476332,
            "risk_score": 12,
            "primaryDiagnosisClass": "MS-604",
            "providerName": "Karen Deck",
            "provider_specialty": "Urologists",
            "amount": "$16,350",
            "provider_group": "Newport",
            "services": "Practitioner",
            "address": "First Avenue at 16th Street, New York, NY",
            "total_Claim": 11,
            "unique_patient": 9,
            "risk_reason1": "None",
            "risk_amount": "$5,000",
            "risk_reason2": "None",
            "serviceCategory": "Hosp. Outpatient"
        }
    ],
    auditorAssignment: [
        {regionName: "Northwest", auditors:[{userId:'auditor4'},{userId:'auditor1'}],auditorName: "Tom K", count: "12", status: "P", riskReasons: [{"specialty": "Outlier Charges", auditorName: "Mike M", count: "3","img":""}, {specialty: "Specialty Mismatch", auditorName: "", count: "5","img":""}, {specialty: "Unbundling", auditorName: "", count: "4","img":""}]},
        {regionName: "Spring Field", auditors:[{userId:'auditor2'},{userId:'auditor3'}],auditorName: "Bob K", count: "5", status: "A", riskReasons: [{specialty: "Outlier Charges", auditorName: "Bob K", count: "3"}, {specialty: "Rest", auditorName: "Bob K", count: "2"}]},
        {regionName: "South Region", auditors:[{userId:'auditor5'},{userId:'auditor2'}],auditorName: "Tom P", count: "15", status: "A", riskReasons: [{specialty: "Outlier Charges", auditorName: "Mike M", count: "6"}, {specialty: "Specialty Mismatch", auditorName: "Rob R", count: "5"}, {specialty: "Unbundling", auditorName: "John S", count: "4"}]},
        {regionName: "Mountain Hill", auditors:[{userId:'auditor3'},{userId:'auditor4'}], auditorName: "Tom R", count: "10", status: "U", riskReasons: [{specialty: "Duplicate Claims", auditorName: "", count: "1"}, {specialty: "Specialty Mismatch", auditorName: "", count: "5"}, {specialty: "Unbundling", auditorName: "", count: "4"}]},
        {regionName: "Newport", auditors:[{userId:'auditor1'},{userId:'auditor2'}], auditorName: "", count: "15", status: "P", riskReasons: [{specialty: "Network", auditorName: "Tim H", count: "6"}, {specialty: "Specialty Mismatch", auditorName: "", count: "5"}, {specialty: "Unbundling", auditorName: "", count: "4"}]},
        {regionName: "Lake Shore", auditors:[{userId:'auditor8'},{userId:'auditor9'}], auditorName: "", count: "9", status: "U", riskReasons: [{specialty: "Outlier Charges", auditorName: "", count: "3"}, {specialty: "Duplicate Claims", auditorName: "", count: "2"}, {specialty: "Unbundling", auditorName: "", count: "4"}]},
        {regionName: "Freeport", auditors:[{userId:'auditor6'},{userId:'auditor7'}], auditorName: "", count: "11", status: "U", riskReasons: [{specialty: "Outlier Charges", auditorName: "", count: "2"}, {specialty: "Specialty Mismatch", auditorName: "", count: "5"}, {specialty: "Unbundling", auditorName: "", count: "4"}]},
        {regionName: "Holander", auditors:[{userId:'auditor6'},{userId:'auditor5'}], auditorName: "", count: "12", status: "U", riskReasons: [{specialty: "Network", auditorName: "", count: "3"}, {specialty: "Specialty Mismatch", auditorName: "", count: "5"}, {specialty: "Unbundling", auditorName: "", count: "4"}]}
    ],
    fraudAuditorList:[{userId:'auditor1'},{userId:'auditor2'},{userId:'auditor3'},{userId:'auditor4'},{userId:'auditor5'},{userId:'auditor6'},{userId:'auditor7'},
                      {userId:'auditor8'},{userId:'auditor9'},{userId:'auditor10'},{userId:'auditor11'}],
    
    
    auditorAssignmentData:[
    {
        "hospitalId": "177",
        "hospitalName": "Yakima HMA Phys Mgmt LLC",
        "preBillAuditors": [
            {
                "userId": "Christina.Marble",
                "userFullName": "Christina Marble"
            },
            {
                "userId": "Dawn.Moavero",
                "userFullName": "Dawn Moavero"
            }
        ],
        "postBillAuditors": [
            {
                "userId": "Christina.Marble",
                "userFullName": "Christina Marble"
            },
            {
                "userId": "Dawn.Moavero",
                "userFullName": "Dawn Moavero"
            }
        ]
    },
    {
        "hospitalId": "707",
        "hospitalName": "Wuesthoff Nursing Home",
        "preBillAuditors": [
            {
                "userId": "DeborahT.IA",
                "userFullName": "Deborah Tremblay"
            }
        ],
        "postBillAuditors": [
            {
                "userId": "DeborahT.IA",
                "userFullName": "Deborah Tremblay"
            }
        ]
    },
    {
        "hospitalId": "710",
        "hospitalName": "Wuesthoff Baytree Imaging",
        "preBillAuditors": [
            {
                "userId": "Christina.Marble",
                "userFullName": "Christina Marble"
            }
        ],
        "postBillAuditors": [
            {
                "userId": "Christina.Marble",
                "userFullName": "Christina Marble"
            }
        ]
    },
    {
        "hospitalId": "711",
        "hospitalName": "Trilakes Medical Center",
        "preBillAuditors": [
            {
                "userId": "Stephanie.Thigpen",
                "userFullName": "Stephanie Thigpen"
            }
        ],
        "postBillAuditors": []
    },
    {
        "hospitalId": "715",
        "hospitalName": "Physicians Regional Medical Center",
        "preBillAuditors": [
            {
                "userId": "DeborahT.IA",
                "userFullName": "Deborah Tremblay"
            }
        ],
        "postBillAuditors": [
            {
                "userId": "Christina.Marble",
                "userFullName": "Christina Marble"
            }
        ]
    },
    {
        "hospitalId": "716",
        "hospitalName": "North Knoxville Medical Center",
        "preBillAuditors": [
            {
                "userId": "DeborahT.IA",
                "userFullName": "Deborah Tremblay"
            }
        ],
        "postBillAuditors": [
            {
                "userId": "DeborahT.IA",
                "userFullName": "Deborah Tremblay"
            }
        ]
    },
    {
        "hospitalId": "717",
        "hospitalName": "Turkey Creek Medical Center",
        "preBillAuditors": [
            {
                "userId": "Christina.Marble",
                "userFullName": "Christina Marble"
            },
            {
                "userId": "DeborahT.IA",
                "userFullName": "Deborah Tremblay"
            }
        ],
        "postBillAuditors": [
            {
                "userId": "Christina.Marble",
                "userFullName": "Christina Marble"
            },
            {
                "userId": "Dawn.Moavero",
                "userFullName": "Dawn Moavero"
            }
        ]
    },
    {
        "hospitalId": "718",
        "hospitalName": "Newport Medical Center",
        "preBillAuditors": [
            {
                "userId": "Dawn.Moavero",
                "userFullName": "Dawn Moavero"
            },
            {
                "userId": "Penny.Bailey",
                "userFullName": "Penny Bailey"
            },
            {
                "userId": "sanjeev",
                "userFullName": "sanjeev sanjeev"
            }
        ],
        "postBillAuditors": [
            {
                "userId": "sanjeev",
                "userFullName": "sanjeev sanjeev"
            },
            {
                "userId": "Sherry.Reneau",
                "userFullName": "Sherry Reneau"
            },
            {
                "userId": "Simon.Curl",
                "userFullName": "Simon Curl"
            }
        ]
    },
    {
        "hospitalId": "719",
        "hospitalName": "LaFollette Medical Center",
        "preBillAuditors": [
            {
                "userId": "Christina.Marble",
                "userFullName": "Christina Marble"
            },
            {
                "userId": "Dawn.Moavero",
                "userFullName": "Dawn Moavero"
            },
            {
                "userId": "DeborahT.IA",
                "userFullName": "Deborah Tremblay"
            }
        ],
        "postBillAuditors": [
            {
                "userId": "Dawn.Moavero",
                "userFullName": "Dawn Moavero"
            },
            {
                "userId": "DeborahT.IA",
                "userFullName": "Deborah Tremblay"
            },
            {
                "userId": "Katherine.Lowdermilk",
                "userFullName": "Katherine Lowdermilk"
            }
        ]
    },
    {
        "hospitalId": "720",
        "hospitalName": "St Marys Medical Center Scott",
        "preBillAuditors": [
            {
                "userId": "Sherry.Reneau",
                "userFullName": "Sherry Reneau"
            },
            {
                "userId": "Simon.Curl",
                "userFullName": "Simon Curl"
            },
            {
                "userId": "Tracy.Dennis",
                "userFullName": "Tracy Dennis"
            }
        ],
        "postBillAuditors": [
            {
                "userId": "OperaIT",
                "userFullName": "Opera Team "
            },
            {
                "userId": "Patricia.Torrado",
                "userFullName": "Patricia Torrado"
            },
            {
                "userId": "Penny.Bailey",
                "userFullName": "Penny Bailey"
            }
        ]
    },
    {
        "hospitalId": "721",
        "hospitalName": "Jefferson Memorial Hospital",
        "preBillAuditors": [
            {
                "userId": "sanjeev",
                "userFullName": "sanjeev sanjeev"
            },
            {
                "userId": "Sherry.Reneau",
                "userFullName": "Sherry Reneau"
            },
            {
                "userId": "Simon.Curl",
                "userFullName": "Simon Curl"
            }
        ],
        "postBillAuditors": [
            {
                "userId": "Christina.Marble",
                "userFullName": "Christina Marble"
            },
            {
                "userId": "Dawn.Moavero",
                "userFullName": "Dawn Moavero"
            },
            {
                "userId": "DeborahT.IA",
                "userFullName": "Deborah Tremblay"
            }
        ]
    },
    {
        "hospitalId": "731",
        "hospitalName": "Integris Blackwell Regional Hospital",
        "preBillAuditors": [
            {
                "userId": "DeborahT.IA",
                "userFullName": "Deborah Tremblay"
            }
        ],
        "postBillAuditors": [
            {
                "userId": "Penny.Bailey",
                "userFullName": "Penny Bailey"
            },
            {
                "userId": "Sherry.Reneau",
                "userFullName": "Sherry Reneau"
            }
        ]
    },
    {
        "hospitalId": "732",
        "hospitalName": "Integris Clinton Regional Hospital",
        "preBillAuditors": [
            {
                "userId": "Simon.Curl",
                "userFullName": "Simon Curl"
            },
            {
                "userId": "Stephanie.Thigpen",
                "userFullName": "Stephanie Thigpen"
            }
        ],
        "postBillAuditors": [
            {
                "userId": "Sherry.Reneau",
                "userFullName": "Sherry Reneau"
            },
            {
                "userId": "Simon.Curl",
                "userFullName": "Simon Curl"
            }
        ]
    },
    {
        "hospitalId": "733",
        "hospitalName": "Integris Mayes County Medical Center",
        "preBillAuditors": [],
        "postBillAuditors": [
            {
                "userId": "new.user",
                "userFullName": "NEW USER"
            }
        ]
    },
    {
        "hospitalId": "734",
        "hospitalName": "Integris Seminole Medical Center",
        "preBillAuditors": [
            {
                "userId": "Cathy.Pipkin",
                "userFullName": "Cathy Pipkin"
            },
            {
                "userId": "Christina.Marble",
                "userFullName": "Christina Marble"
            }
        ],
        "postBillAuditors": [
            {
                "userId": "Cathy.Pipkin",
                "userFullName": "Cathy Pipkin"
            },
            {
                "userId": "Christina.Marble",
                "userFullName": "Christina Marble"
            }
        ]
    },
    {
        "hospitalId": "735",
        "hospitalName": "Marshall County Medical Center",
        "preBillAuditors": [
            {
                "userId": "kartik.lamba",
                "userFullName": "Kartik Lamba"
            }
        ],
        "postBillAuditors": [
            {
                "userId": "rlee",
                "userFullName": "Richard Lee"
            },
            {
                "userId": "Tracy.Dennis",
                "userFullName": "Tracy Dennis"
            }
        ]
    },
    {
        "hospitalId": "741",
        "hospitalName": "Bayfront Medical Center",
        "preBillAuditors": [
            {
                "userId": "DeborahT.IA",
                "userFullName": "Deborah Tremblay"
            }
        ],
        "postBillAuditors": [
            {
                "userId": "DeborahT.IA",
                "userFullName": "Deborah Tremblay"
            }
        ]
    },
    {
        "hospitalId": "766",
        "hospitalName": "Wellmont - Lee Regional",
        "preBillAuditors": [
            {
                "userId": "Stephanie.Thigpen",
                "userFullName": "Stephanie Thigpen"
            }
        ],
        "postBillAuditors": [
            {
                "userId": "Lydia.Arnold",
                "userFullName": "Lydia Arnold"
            }
        ]
    },
    {
        "hospitalId": "803",
        "hospitalName": "Peace River Regional Medical Center",
        "preBillAuditors": [
            {
                "userId": "Dawn.Moavero",
                "userFullName": "Dawn Moavero"
            }
        ],
        "postBillAuditors": [
            {
                "userId": "Dawn.Moavero",
                "userFullName": "Dawn Moavero"
            }
        ]
    },
    {
        "hospitalId": "804",
        "hospitalName": "Barrow Regional Medical Center",
        "preBillAuditors": [
            {
                "userId": "Stephanie.Thigpen",
                "userFullName": "Stephanie Thigpen"
            }
        ],
        "postBillAuditors": [
            {
                "userId": "Stephanie.Thigpen",
                "userFullName": "Stephanie Thigpen"
            }
        ]
    },
    {
        "hospitalId": "805",
        "hospitalName": "Lake Norman Regional Medical Center",
        "preBillAuditors": [
            {
                "userId": "Cathy.Pipkin",
                "userFullName": "Cathy Pipkin"
            }
        ],
        "postBillAuditors": [
            {
                "userId": "Cathy.Pipkin",
                "userFullName": "Cathy Pipkin"
            }
        ]
    },
    {
        "hospitalId": "808",
        "hospitalName": "Venice Regional Medical Center",
        "preBillAuditors": [
            {
                "userId": "DeborahT.IA",
                "userFullName": "Deborah Tremblay"
            }
        ],
        "postBillAuditors": [
            {
                "userId": "DeborahT.IA",
                "userFullName": "Deborah Tremblay"
            }
        ]
    },
    {
        "hospitalId": "810",
        "hospitalName": "Paul B. Hall Regional Medical Center",
        "preBillAuditors": [
            {
                "userId": "Stephanie.Thigpen",
                "userFullName": "Stephanie Thigpen"
            }
        ],
        "postBillAuditors": [
            {
                "userId": "Stephanie.Thigpen",
                "userFullName": "Stephanie Thigpen"
            }
        ]
    },
    {
        "hospitalId": "812",
        "hospitalName": "Riverside Behavioral Center",
        "preBillAuditors": [
            {
                "userId": "Simon.Curl",
                "userFullName": "Simon Curl"
            }
        ],
        "postBillAuditors": [
            {
                "userId": "Simon.Curl",
                "userFullName": "Simon Curl"
            }
        ]
    },
    {
        "hospitalId": "813",
        "hospitalName": "Chester Regional Medical Center",
        "preBillAuditors": [
            {
                "userId": "Cathy.Pipkin",
                "userFullName": "Cathy Pipkin"
            }
        ],
        "postBillAuditors": [
            {
                "userId": "Cathy.Pipkin",
                "userFullName": "Cathy Pipkin"
            }
        ]
    },
    {
        "hospitalId": "814",
        "hospitalName": "Physicians Regional Medical Center at Collier Blvd",
        "preBillAuditors": [
            {
                "userId": "Dawn.Moavero",
                "userFullName": "Dawn Moavero"
            }
        ],
        "postBillAuditors": [
            {
                "userId": "Dawn.Moavero",
                "userFullName": "Dawn Moavero"
            }
        ]
    },
    {
        "hospitalId": "816",
        "hospitalName": "Bartow Regional Medical Center",
        "preBillAuditors": [
            {
                "userId": "Simon.Curl",
                "userFullName": "Simon Curl"
            }
        ],
        "postBillAuditors": [
            {
                "userId": "Stephanie.Thigpen",
                "userFullName": "Stephanie Thigpen"
            }
        ]
    },
    {
        "hospitalId": "817",
        "hospitalName": "Shands Lake Shore",
        "preBillAuditors": [
            {
                "userId": "Dawn.Moavero",
                "userFullName": "Dawn Moavero"
            }
        ],
        "postBillAuditors": [
            {
                "userId": "Dawn.Moavero",
                "userFullName": "Dawn Moavero"
            }
        ]
    },
    {
        "hospitalId": "818",
        "hospitalName": "Mountain View Regional Medical Center",
        "preBillAuditors": [
            {
                "userId": "rlee",
                "userFullName": "Richard Lee"
            },
            {
                "userId": "sanjeev",
                "userFullName": "sanjeev sanjeev"
            }
        ],
        "postBillAuditors": [
            {
                "userId": "Patricia.Torrado",
                "userFullName": "Patricia Torrado"
            },
            {
                "userId": "Penny.Bailey",
                "userFullName": "Penny Bailey"
            },
            {
                "userId": "sanjeev",
                "userFullName": "sanjeev sanjeev"
            }
        ]
    },
    {
        "hospitalId": "819",
        "hospitalName": "Physicians Regional Medical Center",
        "preBillAuditors": [
            {
                "userId": "Dawn.Moavero",
                "userFullName": "Dawn Moavero"
            }
        ],
        "postBillAuditors": [
            {
                "userId": "Dawn.Moavero",
                "userFullName": "Dawn Moavero"
            }
        ]
    },
    {
        "hospitalId": "820",
        "hospitalName": "Riverview Regional Medical Center",
        "preBillAuditors": [
            {
                "userId": "Kim.Wade",
                "userFullName": "Kim Wadee"
            }
        ],
        "postBillAuditors": [
            {
                "userId": "Kim.Wade",
                "userFullName": "Kim Wadee"
            }
        ]
    },
    {
        "hospitalId": "821",
        "hospitalName": "Heart Of Florida Regional Medical Center",
        "preBillAuditors": [
            {
                "userId": "DeborahT.IA",
                "userFullName": "Deborah Tremblay"
            }
        ],
        "postBillAuditors": [
            {
                "userId": "DeborahT.IA",
                "userFullName": "Deborah Tremblay"
            }
        ]
    },
    {
        "hospitalId": "822",
        "hospitalName": "Natchez Community Hospital",
        "preBillAuditors": [
            {
                "userId": "Christina.Marble",
                "userFullName": "Christina Marble"
            }
        ],
        "postBillAuditors": [
            {
                "userId": "Christina.Marble",
                "userFullName": "Christina Marble"
            }
        ]
    },
    {
        "hospitalId": "823",
        "hospitalName": "Sebastian River Medical Center",
        "preBillAuditors": [
            {
                "userId": "Patricia.Torrado",
                "userFullName": "Patricia Torrado"
            }
        ],
        "postBillAuditors": [
            {
                "userId": "Patricia.Torrado",
                "userFullName": "Patricia Torrado"
            }
        ]
    },
    {
        "hospitalId": "824",
        "hospitalName": "Stringfellow Memorial Hospital",
        "preBillAuditors": [
            {
                "userId": "Kim.Wade",
                "userFullName": "Kim Wadee"
            }
        ],
        "postBillAuditors": [
            {
                "userId": "Kim.Wade",
                "userFullName": "Kim Wadee"
            }
        ]
    },
    {
        "hospitalId": "825",
        "hospitalName": "Summit Medical Center",
        "preBillAuditors": [
            {
                "userId": "Kim.Wade",
                "userFullName": "Kim Wadee"
            }
        ],
        "postBillAuditors": [
            {
                "userId": "Kim.Wade",
                "userFullName": "Kim Wadee"
            }
        ]
    },
    {
        "hospitalId": "826",
        "hospitalName": "Surgery Center Lake Norman",
        "preBillAuditors": [
            {
                "userId": "Cathy.Pipkin",
                "userFullName": "Cathy Pipkin"
            }
        ],
        "postBillAuditors": [
            {
                "userId": "Cathy.Pipkin",
                "userFullName": "Cathy Pipkin"
            }
        ]
    },
    {
        "hospitalId": "827",
        "hospitalName": "Charlotte Regional Medical Center",
        "preBillAuditors": [
            {
                "userId": "Dawn.Moavero",
                "userFullName": "Dawn Moavero"
            }
        ],
        "postBillAuditors": [
            {
                "userId": "Dawn.Moavero",
                "userFullName": "Dawn Moavero"
            }
        ]
    },
    {
        "hospitalId": "828",
        "hospitalName": "Highlands Surgery Center",
        "preBillAuditors": [
            {
                "userId": "Christina.Marble",
                "userFullName": "Christina Marble"
            }
        ],
        "postBillAuditors": [
            {
                "userId": "Dawn.Moavero",
                "userFullName": "Dawn Moavero"
            }
        ]
    },
    {
        "hospitalId": "829",
        "hospitalName": "Northwest Mississippi Regional Medical Center",
        "preBillAuditors": [
            {
                "userId": "Christina.Marble",
                "userFullName": "Christina Marble"
            }
        ],
        "postBillAuditors": [
            {
                "userId": "Christina.Marble",
                "userFullName": "Christina Marble"
            }
        ]
    },
    {
        "hospitalId": "831",
        "hospitalName": "Sparks Regional Medical Center",
        "preBillAuditors": [
            {
                "userId": "Kim.Wade",
                "userFullName": "Kim Wadee"
            }
        ],
        "postBillAuditors": [
            {
                "userId": "Kim.Wade",
                "userFullName": "Kim Wadee"
            }
        ]
    },
    {
        "hospitalId": "832",
        "hospitalName": "East Georgia Regional Medical Center",
        "preBillAuditors": [
            {
                "userId": "Stephanie.Thigpen",
                "userFullName": "Stephanie Thigpen"
            }
        ],
        "postBillAuditors": [
            {
                "userId": "Stephanie.Thigpen",
                "userFullName": "Stephanie Thigpen"
            }
        ]
    },
    {
        "hospitalId": "833",
        "hospitalName": "Carolina Pines Regional Medical Center",
        "preBillAuditors": [
            {
                "userId": "Cathy.Pipkin",
                "userFullName": "Cathy Pipkin"
            }
        ],
        "postBillAuditors": [
            {
                "userId": "Cathy.Pipkin",
                "userFullName": "Cathy Pipkin"
            }
        ]
    },
    {
        "hospitalId": "834",
        "hospitalName": "Midwest Regional Medical Center",
        "preBillAuditors": [
            {
                "userId": "John.Munroe",
                "userFullName": "John Munroe"
            },
            {
                "userId": "Tracy.Dennis",
                "userFullName": "Tracy Dennis"
            }
        ],
        "postBillAuditors": [
            {
                "userId": "Tracy.Dennis",
                "userFullName": "Tracy Dennis"
            }
        ]
    },
    {
        "hospitalId": "835",
        "hospitalName": "Highlands Regional Medical Center",
        "preBillAuditors": [
            {
                "userId": "Cathy.Pipkin",
                "userFullName": "Cathy Pipkin"
            }
        ],
        "postBillAuditors": [
            {
                "userId": "Dawn.Moavero",
                "userFullName": "Dawn Moavero"
            }
        ]
    },
    {
        "hospitalId": "836",
        "hospitalName": "Southwest Regional Medical Center",
        "preBillAuditors": [
            {
                "userId": "DeborahT.IA",
                "userFullName": "Deborah Tremblay"
            }
        ],
        "postBillAuditors": [
            {
                "userId": "Christina.Marble",
                "userFullName": "Christina Marble"
            }
        ]
    },
    {
        "hospitalId": "837",
        "hospitalName": "Crossgates River Oaks Hospital",
        "preBillAuditors": [
            {
                "userId": "Christina.Marble",
                "userFullName": "Christina Marble"
            }
        ],
        "postBillAuditors": [
            {
                "userId": "Christina.Marble",
                "userFullName": "Christina Marble"
            }
        ]
    },
    {
        "hospitalId": "838",
        "hospitalName": "Riley Memorial Hospital",
        "preBillAuditors": [
            {
                "userId": "Simon.Curl",
                "userFullName": "Simon Curl"
            }
        ],
        "postBillAuditors": [
            {
                "userId": "Dawn.Moavero",
                "userFullName": "Dawn Moavero"
            }
        ]
    },
    {
        "hospitalId": "840",
        "hospitalName": "Franklin Regional Medical Center",
        "preBillAuditors": [
            {
                "userId": "Christina.Marble",
                "userFullName": "Christina Marble"
            },
            {
                "userId": "Dawn.Moavero",
                "userFullName": "Dawn Moavero"
            },
            {
                "userId": "Simon.Curl",
                "userFullName": "Simon Curl"
            }
        ],
        "postBillAuditors": [
            {
                "userId": "Christina.Marble",
                "userFullName": "Christina Marble"
            },
            {
                "userId": "Dawn.Moavero",
                "userFullName": "Dawn Moavero"
            },
            {
                "userId": "DeborahT.IA",
                "userFullName": "Deborah Tremblay"
            },
            {
                "userId": "Sherry.Reneau",
                "userFullName": "Sherry Reneau"
            }
        ]
    },
    {
        "hospitalId": "841",
        "hospitalName": "River Oaks Hospital",
        "preBillAuditors": [
            {
                "userId": "Christina.Marble",
                "userFullName": "Christina Marble"
            }
        ],
        "postBillAuditors": [
            {
                "userId": "Christina.Marble",
                "userFullName": "Christina Marble"
            }
        ]
    },
    {
        "hospitalId": "842",
        "hospitalName": "Woman's Hospital",
        "preBillAuditors": [
            {
                "userId": "Cathy.Pipkin",
                "userFullName": "Cathy Pipkin"
            },
            {
                "userId": "Christina.Marble",
                "userFullName": "Christina Marble"
            }
        ],
        "postBillAuditors": [
            {
                "userId": "Christina.Marble",
                "userFullName": "Christina Marble"
            }
        ]
    },
    {
        "hospitalId": "843",
        "hospitalName": "Brooksville Regional Hospital",
        "preBillAuditors": [
            {
                "userId": "Christina.Marble",
                "userFullName": "Christina Marble"
            },
            {
                "userId": "Cindy.White",
                "userFullName": "Cindy White"
            },
            {
                "userId": "Dawn.Moavero",
                "userFullName": "Dawn Moavero"
            },
            {
                "userId": "Sherry.Reneau",
                "userFullName": "Sherry Reneau"
            }
        ],
        "postBillAuditors": [
            {
                "userId": "Cindy.White",
                "userFullName": "Cindy White"
            },
            {
                "userId": "Opera.Backend",
                "userFullName": "Opera Backend"
            },
            {
                "userId": "Patricia.Torrado",
                "userFullName": "Patricia Torrado"
            },
            {
                "userId": "Penny.Bailey",
                "userFullName": "Penny Bailey"
            },
            {
                "userId": "sanjeev",
                "userFullName": "sanjeev sanjeev"
            }
        ]
    },
    {
        "hospitalId": "844",
        "hospitalName": "Spring Hill Regional Hospital",
        "preBillAuditors": [
            {
                "userId": "Cindy.White",
                "userFullName": "Cindy White"
            },
            {
                "userId": "Sherry.Reneau",
                "userFullName": "Sherry Reneau"
            }
        ],
        "postBillAuditors": [
            {
                "userId": "Cindy.White",
                "userFullName": "Cindy White"
            },
            {
                "userId": "Patricia.Torrado",
                "userFullName": "Patricia Torrado"
            }
        ]
    },
    {
        "hospitalId": "846",
        "hospitalName": "Lower Keys Medical Center",
        "preBillAuditors": [
            {
                "userId": "Patricia.Torrado",
                "userFullName": "Patricia Torrado"
            }
        ],
        "postBillAuditors": [
            {
                "userId": "Stephanie.Thigpen",
                "userFullName": "Stephanie Thigpen"
            }
        ]
    },
    {
        "hospitalId": "847",
        "hospitalName": "Heart Of Lancaster Regional Medical Center",
        "preBillAuditors": [
            {
                "userId": "Cathy.Pipkin",
                "userFullName": "Cathy Pipkin"
            }
        ],
        "postBillAuditors": [
            {
                "userId": "Cathy.Pipkin",
                "userFullName": "Cathy Pipkin"
            }
        ]
    },
    {
        "hospitalId": "848",
        "hospitalName": "Central Mississippi Medical Center",
        "preBillAuditors": [
            {
                "userId": "Christina.Marble",
                "userFullName": "Christina Marble"
            },
            {
                "userId": "Dawn.Moavero",
                "userFullName": "Dawn Moavero"
            },
            {
                "userId": "DeborahT.IA",
                "userFullName": "Deborah Tremblay"
            }
        ],
        "postBillAuditors": [
            {
                "userId": "Christina.Marble",
                "userFullName": "Christina Marble"
            },
            {
                "userId": "Dawn.Moavero",
                "userFullName": "Dawn Moavero"
            },
            {
                "userId": "DeborahT.IA",
                "userFullName": "Deborah Tremblay"
            }
        ]
    },
    {
        "hospitalId": "850",
        "hospitalName": "Williamson Memorial Hospital",
        "preBillAuditors": [
            {
                "userId": "Stephanie.Thigpen",
                "userFullName": "Stephanie Thigpen"
            }
        ],
        "postBillAuditors": [
            {
                "userId": "Stephanie.Thigpen",
                "userFullName": "Stephanie Thigpen"
            }
        ]
    },
    {
        "hospitalId": "851",
        "hospitalName": "Pasco Regional Medical Center",
        "preBillAuditors": [
            {
                "userId": "DeborahT.IA",
                "userFullName": "Deborah Tremblay"
            }
        ],
        "postBillAuditors": [
            {
                "userId": "DeborahT.IA",
                "userFullName": "Deborah Tremblay"
            }
        ]
    },
    {
        "hospitalId": "852",
        "hospitalName": "Lancaster Regional Medical Center",
        "preBillAuditors": [
            {
                "userId": "Cathy.Pipkin",
                "userFullName": "Cathy Pipkin"
            }
        ],
        "postBillAuditors": [
            {
                "userId": "Cathy.Pipkin",
                "userFullName": "Cathy Pipkin"
            }
        ]
    },
    {
        "hospitalId": "853",
        "hospitalName": "Shands Starke Critical Access",
        "preBillAuditors": [
            {
                "userId": "Stephanie.Thigpen",
                "userFullName": "Stephanie Thigpen"
            }
        ],
        "postBillAuditors": [
            {
                "userId": "Stephanie.Thigpen",
                "userFullName": "Stephanie Thigpen"
            }
        ]
    },
    {
        "hospitalId": "854",
        "hospitalName": "Gilmore Memorial Regional Medical Center",
        "preBillAuditors": [
            {
                "userId": "Kim.Wade",
                "userFullName": "Kim Wadee"
            }
        ],
        "postBillAuditors": [
            {
                "userId": "Kim.Wade",
                "userFullName": "Kim Wadee"
            }
        ]
    },
    {
        "hospitalId": "855",
        "hospitalName": "Fishermen's Hospital",
        "preBillAuditors": [
            {
                "userId": "Christina.Marble",
                "userFullName": "Christina Marble"
            },
            {
                "userId": "Dawn.Moavero",
                "userFullName": "Dawn Moavero"
            }
        ],
        "postBillAuditors": [
            {
                "userId": "Christina.Marble",
                "userFullName": "Christina Marble"
            },
            {
                "userId": "Dawn.Moavero",
                "userFullName": "Dawn Moavero"
            }
        ]
    },
    {
        "hospitalId": "856",
        "hospitalName": "Davis Regional Medical Center",
        "preBillAuditors": [
            {
                "userId": "Cathy.Pipkin",
                "userFullName": "Cathy Pipkin"
            }
        ],
        "postBillAuditors": [
            {
                "userId": "Cathy.Pipkin",
                "userFullName": "Cathy Pipkin"
            }
        ]
    },
    {
        "hospitalId": "857",
        "hospitalName": "Shands Live Oak Critical Access",
        "preBillAuditors": [
            {
                "userId": "Dawn.Moavero",
                "userFullName": "Dawn Moavero"
            }
        ],
        "postBillAuditors": [
            {
                "userId": "Dawn.Moavero",
                "userFullName": "Dawn Moavero"
            }
        ]
    },
    {
        "hospitalId": "858",
        "hospitalName": "Carlisle Regional Medical Center",
        "preBillAuditors": [
            {
                "userId": "Simon.Curl",
                "userFullName": "Simon Curl"
            },
            {
                "userId": "Stephanie.Thigpen",
                "userFullName": "Stephanie Thigpen"
            }
        ],
        "postBillAuditors": [
            {
                "userId": "Simon.Curl",
                "userFullName": "Simon Curl"
            },
            {
                "userId": "Stephanie.Thigpen",
                "userFullName": "Stephanie Thigpen"
            }
        ]
    },
    {
        "hospitalId": "860",
        "hospitalName": "Upstate Carolina Medical Center",
        "preBillAuditors": [
            {
                "userId": "Cathy.Pipkin",
                "userFullName": "Cathy Pipkin"
            },
            {
                "userId": "Christina.Marble",
                "userFullName": "Christina Marble"
            },
            {
                "userId": "Dawn.Moavero",
                "userFullName": "Dawn Moavero"
            }
        ],
        "postBillAuditors": [
            {
                "userId": "Christina.Marble",
                "userFullName": "Christina Marble"
            },
            {
                "userId": "Dawn.Moavero",
                "userFullName": "Dawn Moavero"
            },
            {
                "userId": "DeborahT.IA",
                "userFullName": "Deborah Tremblay"
            }
        ]
    },
    {
        "hospitalId": "861",
        "hospitalName": "St. Cloud Regional Medical Center",
        "preBillAuditors": [
            {
                "userId": "Cathy.Pipkin",
                "userFullName": "Cathy Pipkin"
            },
            {
                "userId": "Cindy.White",
                "userFullName": "Cindy White"
            },
            {
                "userId": "Dawn.Moavero",
                "userFullName": "Dawn Moavero"
            }
        ],
        "postBillAuditors": [
            {
                "userId": "Christina.Marble",
                "userFullName": "Christina Marble"
            },
            {
                "userId": "Cindy.White",
                "userFullName": "Cindy White"
            },
            {
                "userId": "DeborahT.IA",
                "userFullName": "Deborah Tremblay"
            },
            {
                "userId": "Nilda.Clark",
                "userFullName": "Nilda Clark"
            }
        ]
    },
    {
        "hospitalId": "862",
        "hospitalName": "Santa Rosa Medical Center",
        "preBillAuditors": [
            {
                "userId": "Cathy.Pipkin",
                "userFullName": "Cathy Pipkin"
            },
            {
                "userId": "Cindy.White",
                "userFullName": "Cindy White"
            },
            {
                "userId": "Dawn.Moavero",
                "userFullName": "Dawn Moavero"
            },
            {
                "userId": "DeborahT.IA",
                "userFullName": "Deborah Tremblay"
            }
        ],
        "postBillAuditors": [
            {
                "userId": "Christina.Marble",
                "userFullName": "Christina Marble"
            },
            {
                "userId": "Cindy.White",
                "userFullName": "Cindy White"
            },
            {
                "userId": "Dawn.Moavero",
                "userFullName": "Dawn Moavero"
            },
            {
                "userId": "DeborahT.IA",
                "userFullName": "Deborah Tremblay"
            },
            {
                "userId": "Nilda.Clark",
                "userFullName": "Nilda Clark"
            }
        ]
    },
    {
        "hospitalId": "863",
        "hospitalName": "Wuesthoff Memorial-Rockledge",
        "preBillAuditors": [
            {
                "userId": "Patricia.Torrado",
                "userFullName": "Patricia Torrado"
            }
        ],
        "postBillAuditors": [
            {
                "userId": "Patricia.Torrado",
                "userFullName": "Patricia Torrado"
            }
        ]
    },
    {
        "hospitalId": "864",
        "hospitalName": "Jamestown Regional Medical Center",
        "preBillAuditors": [
            {
                "userId": "Christina.Marble",
                "userFullName": "Christina Marble"
            },
            {
                "userId": "Dawn.Moavero",
                "userFullName": "Dawn Moavero"
            },
            {
                "userId": "DeborahT.IA",
                "userFullName": "Deborah Tremblay"
            }
        ],
        "postBillAuditors": [
            {
                "userId": "Cathy.Pipkin",
                "userFullName": "Cathy Pipkin"
            },
            {
                "userId": "Christina.Marble",
                "userFullName": "Christina Marble"
            },
            {
                "userId": "Dawn.Moavero",
                "userFullName": "Dawn Moavero"
            }
        ]
    },
    {
        "hospitalId": "865",
        "hospitalName": "University Behavioral Center",
        "preBillAuditors": [
            {
                "userId": "Cathy.Pipkin",
                "userFullName": "Cathy Pipkin"
            },
            {
                "userId": "Dawn.Moavero",
                "userFullName": "Dawn Moavero"
            },
            {
                "userId": "Janet.Keeton",
                "userFullName": "Janet Keeton"
            }
        ],
        "postBillAuditors": [
            {
                "userId": "Cathy.Pipkin",
                "userFullName": "Cathy Pipkin"
            },
            {
                "userId": "Dawn.Moavero",
                "userFullName": "Dawn Moavero"
            }
        ]
    },
    {
        "hospitalId": "866",
        "hospitalName": "Lee Regional Medical Center",
        "preBillAuditors": [
            {
                "userId": "Cathy.Pipkin",
                "userFullName": "Cathy Pipkin"
            },
            {
                "userId": "Christina.Marble",
                "userFullName": "Christina Marble"
            },
            {
                "userId": "Dawn.Moavero",
                "userFullName": "Dawn Moavero"
            },
            {
                "userId": "DeborahT.IA",
                "userFullName": "Deborah Tremblay"
            }
        ],
        "postBillAuditors": [
            {
                "userId": "Cathy.Pipkin",
                "userFullName": "Cathy Pipkin"
            },
            {
                "userId": "Christina.Marble",
                "userFullName": "Christina Marble"
            },
            {
                "userId": "Dawn.Moavero",
                "userFullName": "Dawn Moavero"
            },
            {
                "userId": "DeborahT.IA",
                "userFullName": "Deborah Tremblay"
            }
        ]
    },
    {
        "hospitalId": "867",
        "hospitalName": "Lehigh Regional Medical Center",
        "preBillAuditors": [
            {
                "userId": "Dawn.Moavero",
                "userFullName": "Dawn Moavero"
            }
        ],
        "postBillAuditors": [
            {
                "userId": "Dawn.Moavero",
                "userFullName": "Dawn Moavero"
            }
        ]
    },
    {
        "hospitalId": "868",
        "hospitalName": "Dallas Regional Medical Center",
        "preBillAuditors": [
            {
                "userId": "Tracy.Dennis",
                "userFullName": "Tracy Dennis"
            }
        ],
        "postBillAuditors": [
            {
                "userId": "Tracy.Dennis",
                "userFullName": "Tracy Dennis"
            }
        ]
    },
    {
        "hospitalId": "869",
        "hospitalName": "Wuesthoff Medical Center-Melbourne",
        "preBillAuditors": [
            {
                "userId": "Patricia.Torrado",
                "userFullName": "Patricia Torrado"
            }
        ],
        "postBillAuditors": [
            {
                "userId": "Patricia.Torrado",
                "userFullName": "Patricia Torrado"
            }
        ]
    },
    {
        "hospitalId": "870",
        "hospitalName": "Medical Center Of Southeastern Oklahoma",
        "preBillAuditors": [
            {
                "userId": "Tracy.Dennis",
                "userFullName": "Tracy Dennis"
            }
        ],
        "postBillAuditors": [
            {
                "userId": "Tracy.Dennis",
                "userFullName": "Tracy Dennis"
            }
        ]
    },
    {
        "hospitalId": "871",
        "hospitalName": "Surgery Center At Durant, Llc",
        "preBillAuditors": [
            {
                "userId": "Cathy.Pipkin",
                "userFullName": "Cathy Pipkin"
            }
        ],
        "postBillAuditors": [
            {
                "userId": "DeborahT.IA",
                "userFullName": "Deborah Tremblay"
            }
        ]
    },
    {
        "hospitalId": "872",
        "hospitalName": "The Woman's Hospital at Dallas Regional Medical Ce",
        "preBillAuditors": [
            {
                "userId": "Patricia.Torrado",
                "userFullName": "Patricia Torrado"
            }
        ],
        "postBillAuditors": [
            {
                "userId": "auditor1",
                "userFullName": "auditor 1"
            }
        ]
    },
    {
        "hospitalId": "874",
        "hospitalName": "Madison Regional Medical Center",
        "preBillAuditors": [
            {
                "userId": "Kim.Wade",
                "userFullName": "Kim Wadee"
            }
        ],
        "postBillAuditors": [
            {
                "userId": "Kim.Wade",
                "userFullName": "Kim Wadee"
            }
        ]
    },
    {
        "hospitalId": "875",
        "hospitalName": "Sandhills Regional Medical Center",
        "preBillAuditors": [
            {
                "userId": "Cathy.Pipkin",
                "userFullName": "Cathy Pipkin"
            }
        ],
        "postBillAuditors": [
            {
                "userId": "Cathy.Pipkin",
                "userFullName": "Cathy Pipkin"
            }
        ]
    },
    {
        "hospitalId": "876",
        "hospitalName": "Yakima Regional Medical & Cardiac Center",
        "preBillAuditors": [
            {
                "userId": "Sherry.Reneau",
                "userFullName": "Sherry Reneau"
            }
        ],
        "postBillAuditors": [
            {
                "userId": "Stephanie.Thigpen",
                "userFullName": "Stephanie Thigpen"
            }
        ]
    },
    {
        "hospitalId": "878",
        "hospitalName": "Toppenish Community Hospital",
        "preBillAuditors": [
            {
                "userId": "Patricia.Torrado",
                "userFullName": "Patricia Torrado"
            }
        ],
        "postBillAuditors": [
            {
                "userId": "Simon.Curl",
                "userFullName": "Simon Curl"
            },
            {
                "userId": "Stephanie.Thigpen",
                "userFullName": "Stephanie Thigpen"
            },
            {
                "userId": "Tracy.Dennis",
                "userFullName": "Tracy Dennis"
            }
        ]
    },
    {
        "hospitalId": "879",
        "hospitalName": "Clearview Regional Medical Center",
        "preBillAuditors": [
            {
                "userId": "Stephanie.Thigpen",
                "userFullName": "Stephanie Thigpen"
            }
        ],
        "postBillAuditors": [
            {
                "userId": "Stephanie.Thigpen",
                "userFullName": "Stephanie Thigpen"
            }
        ]
    },
    {
        "hospitalId": "880",
        "hospitalName": "Sandypines",
        "preBillAuditors": [
            {
                "userId": "Christina.Marble",
                "userFullName": "Christina Marble"
            },
            {
                "userId": "Dawn.Moavero",
                "userFullName": "Dawn Moavero"
            },
            {
                "userId": "DeborahT.IA",
                "userFullName": "Deborah Tremblay"
            }
        ],
        "postBillAuditors": [
            {
                "userId": "sanjeev",
                "userFullName": "sanjeev sanjeev"
            }
        ]
    },
    {
        "hospitalId": "883",
        "hospitalName": "Seven Rivers Regional Medical Center",
        "preBillAuditors": [
            {
                "userId": "Cindy.White",
                "userFullName": "Cindy White"
            },
            {
                "userId": "Simon.Curl",
                "userFullName": "Simon Curl"
            }
        ],
        "postBillAuditors": [
            {
                "userId": "Christina.Marble",
                "userFullName": "Christina Marble"
            },
            {
                "userId": "Cindy.White",
                "userFullName": "Cindy White"
            }
        ]
    },
    {
        "hospitalId": "884",
        "hospitalName": "University Medical Center",
        "preBillAuditors": [
            {
                "userId": "Patricia.Torrado",
                "userFullName": "Patricia Torrado"
            }
        ],
        "postBillAuditors": [
            {
                "userId": "Patricia.Torrado",
                "userFullName": "Patricia Torrado"
            }
        ]
    },
    {
        "hospitalId": "885",
        "hospitalName": "Lebanon ASC",
        "preBillAuditors": [
            {
                "userId": "DeborahT.IA",
                "userFullName": "Deborah Tremblay"
            }
        ],
        "postBillAuditors": [
            {
                "userId": "Christina.Marble",
                "userFullName": "Christina Marble"
            },
            {
                "userId": "Dawn.Moavero",
                "userFullName": "Dawn Moavero"
            }
        ]
    },
    {
        "hospitalId": "886",
        "hospitalName": "Poplar Bluff Regional Medical Center",
        "preBillAuditors": [
            {
                "userId": "Tracy.Dennis",
                "userFullName": "Tracy Dennis"
            }
        ],
        "postBillAuditors": [
            {
                "userId": "Tracy.Dennis",
                "userFullName": "Tracy Dennis"
            }
        ]
    },
    {
        "hospitalId": "888",
        "hospitalName": "Twin Rivers Regional Medical Center",
        "preBillAuditors": [
            {
                "userId": "Tracy.Dennis",
                "userFullName": "Tracy Dennis"
            }
        ],
        "postBillAuditors": [
            {
                "userId": "Tracy.Dennis",
                "userFullName": "Tracy Dennis"
            }
        ]
    },
    {
        "hospitalId": "889",
        "hospitalName": "Harton Regional Medical Center",
        "preBillAuditors": [
            {
                "userId": "Patricia.Torrado",
                "userFullName": "Patricia Torrado"
            }
        ],
        "postBillAuditors": [
            {
                "userId": "Patricia.Torrado",
                "userFullName": "Patricia Torrado"
            }
        ]
    },
    {
        "hospitalId": "890",
        "hospitalName": "Biloxi Regional Medical Center",
        "preBillAuditors": [
            {
                "userId": "Cathy.Pipkin",
                "userFullName": "Cathy Pipkin"
            },
            {
                "userId": "Christina.Marble",
                "userFullName": "Christina Marble"
            },
            {
                "userId": "Dawn.Moavero",
                "userFullName": "Dawn Moavero"
            },
            {
                "userId": "DeborahT.IA",
                "userFullName": "Deborah Tremblay"
            }
        ],
        "postBillAuditors": [
            {
                "userId": "Cathy.Pipkin",
                "userFullName": "Cathy Pipkin"
            },
            {
                "userId": "Christina.Marble",
                "userFullName": "Christina Marble"
            },
            {
                "userId": "Dawn.Moavero",
                "userFullName": "Dawn Moavero"
            }
        ]
    },
    {
        "hospitalId": "894",
        "hospitalName": "Gulf Coast Medical Center",
        "preBillAuditors": [
            {
                "userId": "Cathy.Pipkin",
                "userFullName": "Cathy Pipkin"
            },
            {
                "userId": "Christina.Marble",
                "userFullName": "Christina Marble"
            }
        ],
        "postBillAuditors": [
            {
                "userId": "Cathy.Pipkin",
                "userFullName": "Cathy Pipkin"
            },
            {
                "userId": "Christina.Marble",
                "userFullName": "Christina Marble"
            }
        ]
    },
    {
        "hospitalId": "899",
        "hospitalName": "Health Management Associates",
        "preBillAuditors": [
            {
                "userId": "auditor1",
                "userFullName": "auditor 1"
            }
        ],
        "postBillAuditors": [
            {
                "userId": "DeborahT.IA",
                "userFullName": "Deborah Tremblay"
            }
        ]
    }
],
auditorsList:[{"uri":"http://172.20.3.235:9999/resources/users/auditor1","userId":"auditor1","pwd":null,"fName":"auditor","lName":"1","uType":"INTERNAL_AUDITOR_CENTRALIZED","email":null,"phoneNbr":null,"primaryLoc":null,"manager":null,"createdBy":null,"fullUserName":"auditor 1","pwdValidDays":38,"isEnabled":true},{"uri":"http://172.20.3.235:9999/resources/users/Cathy.Pipkin","userId":"Cathy.Pipkin","pwd":null,"fName":"Cathy","lName":"Pipkin","uType":"INTERNAL_AUDITOR_CENTRALIZED","email":null,"phoneNbr":null,"primaryLoc":null,"manager":null,"createdBy":null,"fullUserName":"Cathy Pipkin","pwdValidDays":31,"isEnabled":true},{"uri":"http://172.20.3.235:9999/resources/users/Christina.Marble","userId":"Christina.Marble","pwd":null,"fName":"Christina","lName":"Marble","uType":"INTERNAL_AUDITOR_CENTRALIZED","email":null,"phoneNbr":null,"primaryLoc":null,"manager":null,"createdBy":null,"fullUserName":"Christina Marble","pwdValidDays":31,"isEnabled":true},{"uri":"http://172.20.3.235:9999/resources/users/Cindy.White","userId":"Cindy.White","pwd":null,"fName":"Cindy","lName":"White","uType":"INTERNAL_AUDITOR_CENTRALIZED","email":null,"phoneNbr":null,"primaryLoc":null,"manager":null,"createdBy":null,"fullUserName":"Cindy White","pwdValidDays":31,"isEnabled":true},{"uri":"http://172.20.3.235:9999/resources/users/Dawn.Moavero","userId":"Dawn.Moavero","pwd":null,"fName":"Dawn","lName":"Moavero","uType":"INTERNAL_AUDITOR_CENTRALIZED","email":null,"phoneNbr":null,"primaryLoc":null,"manager":null,"createdBy":null,"fullUserName":"Dawn Moavero","pwdValidDays":31,"isEnabled":true},{"uri":"http://172.20.3.235:9999/resources/users/DeborahT.IA","userId":"DeborahT.IA","pwd":null,"fName":"Deborah","lName":"Tremblay","uType":"INTERNAL_AUDITOR_CENTRALIZED","email":null,"phoneNbr":null,"primaryLoc":null,"manager":null,"createdBy":null,"fullUserName":"Deborah Tremblay","pwdValidDays":31,"isEnabled":true},{"uri":"http://172.20.3.235:9999/resources/users/Emely.Lopez","userId":"Emely.Lopez","pwd":null,"fName":"Emely","lName":"Lopez","uType":"INTERNAL_AUDITOR_CENTRALIZED","email":null,"phoneNbr":null,"primaryLoc":null,"manager":null,"createdBy":null,"fullUserName":"Emely Lopez","pwdValidDays":31,"isEnabled":true},{"uri":"http://172.20.3.235:9999/resources/users/Janet.Keeton","userId":"Janet.Keeton","pwd":null,"fName":"Janet","lName":"Keeton","uType":"INTERNAL_AUDITOR_CENTRALIZED","email":null,"phoneNbr":null,"primaryLoc":null,"manager":null,"createdBy":null,"fullUserName":"Janet Keeton","pwdValidDays":31,"isEnabled":true},{"uri":"http://172.20.3.235:9999/resources/users/John.Munroe","userId":"John.Munroe","pwd":null,"fName":"John","lName":"Munroe","uType":"INTERNAL_AUDITOR_CENTRALIZED","email":null,"phoneNbr":null,"primaryLoc":null,"manager":null,"createdBy":null,"fullUserName":"John Munroe","pwdValidDays":31,"isEnabled":true},{"uri":"http://172.20.3.235:9999/resources/users/kartik.lamba","userId":"kartik.lamba","pwd":null,"fName":"Kartik","lName":"Lamba","uType":"INTERNAL_AUDITOR_CENTRALIZED","email":null,"phoneNbr":null,"primaryLoc":null,"manager":null,"createdBy":null,"fullUserName":"Kartik Lamba","pwdValidDays":31,"isEnabled":true},{"uri":"http://172.20.3.235:9999/resources/users/Katherine.Lowdermilk","userId":"Katherine.Lowdermilk","pwd":null,"fName":"Katherine","lName":"Lowdermilk","uType":"INTERNAL_AUDITOR_CENTRALIZED","email":null,"phoneNbr":null,"primaryLoc":null,"manager":null,"createdBy":null,"fullUserName":"Katherine Lowdermilk","pwdValidDays":31,"isEnabled":true},{"uri":"http://172.20.3.235:9999/resources/users/Kim.Travolina","userId":"Kim.Travolina","pwd":null,"fName":"Kim","lName":"Travolina","uType":"INTERNAL_AUDITOR_CENTRALIZED","email":null,"phoneNbr":null,"primaryLoc":null,"manager":null,"createdBy":null,"fullUserName":"Kim Travolina","pwdValidDays":31,"isEnabled":true},{"uri":"http://172.20.3.235:9999/resources/users/Kim.Wade","userId":"Kim.Wade","pwd":null,"fName":"Kim","lName":"Wadee","uType":"INTERNAL_AUDITOR_CENTRALIZED","email":null,"phoneNbr":null,"primaryLoc":null,"manager":null,"createdBy":null,"fullUserName":"Kim Wadee","pwdValidDays":31,"isEnabled":true},{"uri":"http://172.20.3.235:9999/resources/users/kn","userId":"kn","pwd":null,"fName":"K","lName":"J","uType":"INTERNAL_AUDITOR_CENTRALIZED","email":null,"phoneNbr":null,"primaryLoc":null,"manager":null,"createdBy":null,"fullUserName":"K J","pwdValidDays":31,"isEnabled":true},{"uri":"http://172.20.3.235:9999/resources/users/Luv.Dua","userId":"Luv.Dua","pwd":null,"fName":"Luv","lName":"Dua","uType":"INTERNAL_AUDITOR_CENTRALIZED","email":null,"phoneNbr":null,"primaryLoc":null,"manager":null,"createdBy":null,"fullUserName":"Luv Dua","pwdValidDays":31,"isEnabled":true},{"uri":"http://172.20.3.235:9999/resources/users/luvdua","userId":"luvdua","pwd":null,"fName":"Luv","lName":"Dua","uType":"INTERNAL_AUDITOR_CENTRALIZED","email":null,"phoneNbr":null,"primaryLoc":null,"manager":null,"createdBy":null,"fullUserName":"Luv Dua","pwdValidDays":31,"isEnabled":true},{"uri":"http://172.20.3.235:9999/resources/users/Lydia.Arnold","userId":"Lydia.Arnold","pwd":null,"fName":"Lydia","lName":"Arnold","uType":"INTERNAL_AUDITOR_CENTRALIZED","email":null,"phoneNbr":null,"primaryLoc":null,"manager":null,"createdBy":null,"fullUserName":"Lydia Arnold","pwdValidDays":31,"isEnabled":true},{"uri":"http://172.20.3.235:9999/resources/users/Misty.Burnett","userId":"Misty.Burnett","pwd":null,"fName":"Misty","lName":"Burnett","uType":"INTERNAL_AUDITOR_CENTRALIZED","email":null,"phoneNbr":null,"primaryLoc":null,"manager":null,"createdBy":null,"fullUserName":"Misty Burnett","pwdValidDays":31,"isEnabled":true},{"uri":"http://172.20.3.235:9999/resources/users/new.user","userId":"new.user","pwd":null,"fName":"NEW","lName":"USER","uType":"INTERNAL_AUDITOR_CENTRALIZED","email":null,"phoneNbr":null,"primaryLoc":null,"manager":null,"createdBy":null,"fullUserName":"NEW USER","pwdValidDays":31,"isEnabled":true},{"uri":"http://172.20.3.235:9999/resources/users/Nilda.Clark","userId":"Nilda.Clark","pwd":null,"fName":"Nilda","lName":"Clark","uType":"INTERNAL_AUDITOR_CENTRALIZED","email":null,"phoneNbr":null,"primaryLoc":null,"manager":null,"createdBy":null,"fullUserName":"Nilda Clark","pwdValidDays":31,"isEnabled":true},{"uri":"http://172.20.3.235:9999/resources/users/omkar","userId":"omkar","pwd":null,"fName":"omkar","lName":"pandey","uType":"INTERNAL_AUDITOR_CENTRALIZED","email":null,"phoneNbr":null,"primaryLoc":null,"manager":null,"createdBy":null,"fullUserName":"omkar pandey","pwdValidDays":31,"isEnabled":true},{"uri":"http://172.20.3.235:9999/resources/users/Opera.Backend","userId":"Opera.Backend","pwd":null,"fName":"Opera","lName":"Backend","uType":"INTERNAL_AUDITOR_CENTRALIZED","email":null,"phoneNbr":null,"primaryLoc":null,"manager":null,"createdBy":null,"fullUserName":"Opera Backend","pwdValidDays":31,"isEnabled":true},{"uri":"http://172.20.3.235:9999/resources/users/OperaIT","userId":"OperaIT","pwd":null,"fName":"Opera Team","lName":"","uType":"INTERNAL_AUDITOR_CENTRALIZED","email":null,"phoneNbr":null,"primaryLoc":null,"manager":null,"createdBy":null,"fullUserName":"Opera Team ","pwdValidDays":31,"isEnabled":true},{"uri":"http://172.20.3.235:9999/resources/users/Patricia.Torrado","userId":"Patricia.Torrado","pwd":null,"fName":"Patricia","lName":"Torrado","uType":"INTERNAL_AUDITOR_CENTRALIZED","email":null,"phoneNbr":null,"primaryLoc":null,"manager":null,"createdBy":null,"fullUserName":"Patricia Torrado","pwdValidDays":31,"isEnabled":true},{"uri":"http://172.20.3.235:9999/resources/users/Penny.Bailey","userId":"Penny.Bailey","pwd":null,"fName":"Penny","lName":"Bailey","uType":"INTERNAL_AUDITOR_CENTRALIZED","email":null,"phoneNbr":null,"primaryLoc":null,"manager":null,"createdBy":null,"fullUserName":"Penny Bailey","pwdValidDays":31,"isEnabled":true},{"uri":"http://172.20.3.235:9999/resources/users/rlee","userId":"rlee","pwd":null,"fName":"Richard","lName":"Lee","uType":"INTERNAL_AUDITOR_CENTRALIZED","email":null,"phoneNbr":null,"primaryLoc":null,"manager":null,"createdBy":null,"fullUserName":"Richard Lee","pwdValidDays":31,"isEnabled":true},{"uri":"http://172.20.3.235:9999/resources/users/sanjeev","userId":"sanjeev","pwd":null,"fName":"sanjeev","lName":"sanjeev","uType":"INTERNAL_AUDITOR_CENTRALIZED","email":null,"phoneNbr":null,"primaryLoc":null,"manager":null,"createdBy":null,"fullUserName":"sanjeev sanjeev","pwdValidDays":31,"isEnabled":true},{"uri":"http://172.20.3.235:9999/resources/users/Sherry.Reneau","userId":"Sherry.Reneau","pwd":null,"fName":"Sherry","lName":"Reneau","uType":"INTERNAL_AUDITOR_CENTRALIZED","email":null,"phoneNbr":null,"primaryLoc":null,"manager":null,"createdBy":null,"fullUserName":"Sherry Reneau","pwdValidDays":31,"isEnabled":true},{"uri":"http://172.20.3.235:9999/resources/users/Simon.Curl","userId":"Simon.Curl","pwd":null,"fName":"Simon","lName":"Curl","uType":"INTERNAL_AUDITOR_CENTRALIZED","email":null,"phoneNbr":null,"primaryLoc":null,"manager":null,"createdBy":null,"fullUserName":"Simon Curl","pwdValidDays":31,"isEnabled":true},{"uri":"http://172.20.3.235:9999/resources/users/Stephanie.Thigpen","userId":"Stephanie.Thigpen","pwd":null,"fName":"Stephanie","lName":"Thigpen","uType":"INTERNAL_AUDITOR_CENTRALIZED","email":null,"phoneNbr":null,"primaryLoc":null,"manager":null,"createdBy":null,"fullUserName":"Stephanie Thigpen","pwdValidDays":31,"isEnabled":true},{"uri":"http://172.20.3.235:9999/resources/users/Tracy.Dennis","userId":"Tracy.Dennis","pwd":null,"fName":"Tracy","lName":"Dennis","uType":"INTERNAL_AUDITOR_CENTRALIZED","email":null,"phoneNbr":null,"primaryLoc":null,"manager":null,"createdBy":null,"fullUserName":"Tracy Dennis","pwdValidDays":31,"isEnabled":true}]


};



var roles = {};
var screens = {};
var widgets = {};

var networkData = '{ "name": "flare", "children": [ { "name": "analytics", "children": [ { "name": "cluster", "children": [ {"name": "AgglomerativeCluster", "size": 3938}, {"name": "CommunityStructure", "size": 3812}, {"name": "HierarchicalCluster", "size": 6714}, {"name": "MergeEdge", "size": 743} ] }, { "name": "graph", "children": [ {"name": "BetweennessCentrality", "size": 3534}, {"name": "LinkDistance", "size": 5731}, {"name": "MaxFlowMinCut", "size": 7840}, {"name": "ShortestPaths", "size": 5914}, {"name": "SpanningTree", "size": 3416} ] }, { "name": "optimization", "children": [ {"name": "AspectRatioBanker", "size": 7074} ] } ] }, { "name": "vis", "children": [ { "name": "axis", "children": [ {"name": "Axes", "size": 1302}, {"name": "Axis", "size": 24593}, {"name": "AxisGridLine", "size": 652}, {"name": "AxisLabel", "size": 636}, {"name": "CartesianAxes", "size": 6703} ] }, { "name": "legend", "children": [ {"name": "Legend", "size": 20859}, {"name": "LegendItem", "size": 4614}, {"name": "LegendRange", "size": 10530} ] } ] } ] }';







var globalAllData1 = new Object([
    /* Jan 2012 */
    [1325376000000, 415607],
    [1325721600000, 101778],
    [1326153600000, 1581473],
    [1326585600000, 3426191],
    [1327017600000, 1156713],
    [1327449600000, 1002331],
    [1327881600000, 1354391],
    /* Feb 2012 */

    [1328054400000, 1695731],
    [1328400000000, 1897201],
    [1328832000000, 3373151],
    [1329264000000, 1915313],
    [1329696000000, 2681057],
    [1330128000000, 1205144],
    [1330387200000, 2286116],
    /* Mar 2012 */

    [1330560000000, 3169710],
    [1330905600000, 2167119],
    [1331337600000, 2001412],
    [1331769600000, 2294114],
    [1332201600000, 1374415],
    [1332633600000, 2263117],
    [1333065600000, 2683163],
    /* Apr 2012 */

    [1333238400000, 415607],
    [1333584000000, 101778],
    [1334016000000, 1581473],
    [1334448000000, 3426191],
    [1334880000000, 1156713],
    [1335312000000, 1002331],
    [1335744000000, 1354391],
    /* May 2012 */

    [1335830400000, 1695731],
    [1336176000000, 1897210],
    [1336608000000, 3373115],
    [1337040000000, 1915133],
    [1337472000000, 2681057],
    [1337904000000, 1201544],
    [1338336000000, 2281616],
    /* Jun 2012 */

    [1338508800000, 3116970],
    [1338854400000, 2116719],
    [1339286400000, 2001142],
    [1339718400000, 2294114],
    [1340150400000, 1374415],
    [1340582400000, 2263171],
    [1341014400000, 2683613],
    /* Jul 2012 */

    [1341100800000, 451607],
    [1341446400000, 101778],
    [1341878400000, 1581473],
    [1342310400000, 3421691],
    [1342742400000, 1151673],
    [1343174400000, 1001233],
    [1343606400000, 1351439],
    /* Aug 2012 */

    [1343779200000, 1169573],
    [1344124800000, 1819720],
    [1344556800000, 3371315],
    [1344988800000, 1915133],
    [1345420800000, 2680517],
    [1345852800000, 1205441],
    [1346284800000, 2286161],
    /* Sep 2012 */

    [1346457600000, 1316970],
    [1346803200000, 2116719],
    [1347235200000, 2010142],
    [1347667200000, 2291414],
    [1348099200000, 1374145],
    [1348531200000, 2263117],
    [1348963200000, 2683631],
    /* Oct 2012 */

    [1349049600000, 456017],
    [1349395200000, 107781],
    [1349827200000, 1584731],
    [1350259200000, 3426911],
    [1350691200000, 1115673],
    [1351123200000, 1001233],
    [1351555200000, 1354139],
    /* Nov 2012 */

    [1351728000000, 1169573],
    [1352073600000, 1819720],
    [1352505600000, 3371315],
    [1352937600000, 1915133],
    [1353369600000, 2680517],
    [1353801600000, 1205414],
    [1354233600000, 2286161],
    /* Dec 2012 */

    [1354320000000, 3161970],
    [1354665600000, 2167119],
    [1355097600000, 2001142],
    [1355529600000, 2294114],
    [1355961600000, 1317445],
    [1356393600000, 2216317],
    [1356825600000, 2618363],
    /* Jan 2013 */
    [1356998400000, 415607],
    [1357344000000, 110778],
    [1357776000000, 1158473],
    [1358208000000, 3142691],
    [1358640000000, 1115673],
    [1359072000000, 1100233],
    [1359504000000, 1351439],
    /* Feb 2013 */

    [1359676800000, 1691573],
    [1360022400000, 1897120],
    [1360454400000, 3373115],
    [1360886400000, 1915313],
    [1361318400000, 2680157],
    [1361750400000, 1205414],
    [1362009600000, 2286116],
    /* Mar 2013 */

    [1362096000000, 3169710],
    [1362441600000, 2167119],
    [1362873600000, 2001142],
    [1363305600000, 2294114],
    [1363737600000, 1371445],
    [1364169600000, 2261317],
    [1364601600000, 2681363],
    /* Apr 2013 */

    [1364774400000, 456107],
    [1365120000000, 107178],
    [1365552000000, 1581473],
    [1365984000000, 3421691],
    [1366416000000, 1151673],
    [1366848000000, 1001233],
    [1367280000000, 1315439],
    /* May 2013 */

    [1367366400000, 1619573],
    [1367712000000, 1891720],
    [1368144000000, 3371315],
    [1368576000000, 1911533],
    [1369008000000, 2680157],
    [1369440000000, 1205144],
    [1369872000000, 2286116],
    /* Jun 2013 */

    [1370044800000, 3169170],
    [1370390400000, 2167119],
    [1370822400000, 2001142],
    [1371254400000, 2291414],
    [1371686400000, 1374145],
    [1372118400000, 2263117],
    [1372550400000, 2683163],
    /* Jul 2013 */
    [1372636800000, 456017],
    [1372982400000, 107718],
    [1373414400000, 1581473],
    [1373846400000, 3426191],
    [1374278400000, 1156713],
    [1374710400000, 1002313],
    [1375142400000, 1354319],
    /* Aug 2013 */

    [1375315200000, 1695713],
    [1375660800000, 1897210],
    [1376092800000, 3373115],
    [1376524800000, 1915313],
    [1376956800000, 2680517],
    [1377388800000, 1205414],
    [1377820800000, 2286116],
    /* Sep 2013 */

    [1377993600000, 3169710],
    [1378339200000, 2167119],
    [1378771200000, 2001142],
    [1379203200000, 2291414],
    [1379635200000, 1374145],
    [1380067200000, 2263117],
    [1380499200000, 2683613],
    /* Oct 2013 */
    [1380585600000, 1691573],
    [1380931200000, 1891720],
    [1381363200000, 3371315],
    [1381795200000, 1911533],
    [1382227200000, 2680157],
    [1382659200000, 1205414],
    [1383091200000, 2286116],
    /* Nov 2013 */

    [1383264000000, 3116970],
    [1383609600000, 2116719],
    [1384041600000, 2010142],
    [1384473600000, 2219414]
]);


var globalAllData2 = new Object([
    /* Jan 2012 */
    [1325376000000, 1456],
    [1325721600000, 1107],
    [1326153600000, 1158],
    [1326585600000, 1342],
    [1327017600000, 1115],
    [1327449600000, 1100],
    [1327881600000, 1135],
    /* Feb 2012 */

    [1328054400000, 1169],
    [1328400000000, 1189],
    [1328832000000, 1337],
    [1329264000000, 1191],
    [1329696000000, 1268],
    [1330128000000, 1120],
    [1330387200000, 1228],
    /* Mar 2012 */

    [1330560000000, 1316],
    [1330905600000, 1216],
    [1331337600000, 1200],
    [1331769600000, 1229],
    [1332201600000, 1137],
    [1332633600000, 1226],
    [1333065600000, 1268],
    /* Apr 2012 */

    [1333238400000, 1456],
    [1333584000000, 1107],
    [1334016000000, 1158],
    [1334448000000, 1342],
    [1334880000000, 1115],
    [1335312000000, 1100],
    [1335744000000, 1135],
    /* May 2012 */

    [1335830400000, 1169],
    [1336176000000, 1189],
    [1336608000000, 1337],
    [1337040000000, 1191],
    [1337472000000, 1268],
    [1337904000000, 1120],
    [1338336000000, 1228],
    /* Jun 2012 */

    [1338508800000, 1316],
    [1338854400000, 1216],
    [1339286400000, 1200],
    [1339718400000, 1229],
    [1340150400000, 1137],
    [1340582400000, 1226],
    [1341014400000, 1268],
    /* Jul 2012 */

    [1341100800000, 145],
    [1341446400000, 1107],
    [1341878400000, 1158],
    [1342310400000, 1342],
    [1342742400000, 1115],
    [1343174400000, 1100],
    [1343606400000, 1135],
    /* Aug 2012 */

    [1343779200000, 1169],
    [1344124800000, 1189],
    [1344556800000, 1337],
    [1344988800000, 1191],
    [1345420800000, 1268],
    [1345852800000, 1120],
    [1346284800000, 1228],
    /* Sep 2012 */

    [1346457600000, 1316],
    [1346803200000, 1216],
    [1347235200000, 1200],
    [1347667200000, 1229],
    [1348099200000, 1137],
    [1348531200000, 1226],
    [1348963200000, 1268],
    /* Oct 2012 */

    [1349049600000, 145],
    [1349395200000, 1107],
    [1349827200000, 1158],
    [1350259200000, 1342],
    [1350691200000, 1115],
    [1351123200000, 1100],
    [1351555200000, 1135],
    /* Nov 2012 */

    [1351728000000, 1169],
    [1352073600000, 1189],
    [1352505600000, 1337],
    [1352937600000, 1191],
    [1353369600000, 1268],
    [1353801600000, 1120],
    [1354233600000, 1228],
    /* Dec 2012 */

    [1354320000000, 1316],
    [1354665600000, 1216],
    [1355097600000, 1200],
    [1355529600000, 1229],
    [1355961600000, 1137],
    [1356393600000, 1126],
    [1356825600000, 1268],
    /* Jan 2013 */
    [1356998400000, 415],
    [1357344000000, 1108],
    [1357776000000, 1158],
    [1358208000000, 1342],
    [1358640000000, 1115],
    [1359072000000, 1100],
    [1359504000000, 1135],
    /* Feb 2013 */

    [1359676800000, 1169],
    [1360022400000, 1189],
    [1360454400000, 1337],
    [1360886400000, 1191],
    [1361318400000, 1268],
    [1361750400000, 1120],
    [1362009600000, 1228],
    /* Mar 2013 */

    [1362096000000, 1316],
    [1362441600000, 1216],
    [1362873600000, 1200],
    [1363305600000, 1229],
    [1363737600000, 1137],
    [1364169600000, 1226],
    [1364601600000, 1268],
    /* Apr 2013 */

    [1364774400000, 145],
    [1365120000000, 1108],
    [1365552000000, 1153],
    [1365984000000, 1341],
    [1366416000000, 1113],
    [1366848000000, 1103],
    [1367280000000, 1139],
    /* May 2013 */

    [1367366400000, 1163],
    [1367712000000, 1180],
    [1368144000000, 1335],
    [1368576000000, 1193],
    [1369008000000, 1267],
    [1369440000000, 1124],
    [1369872000000, 1226],
    /* Jun 2013 */

    [1370044800000, 1316],
    [1370390400000, 1216],
    [1370822400000, 1200],
    [1371254400000, 1229],
    [1371686400000, 1137],
    [1372118400000, 1226],
    [1372550400000, 1268],
    /* Jul 2013 */
    [1372636800000, 1456],
    [1372982400000, 1107],
    [1373414400000, 1158],
    [1373846400000, 1342],
    [1374278400000, 1115],
    [1374710400000, 1100],
    [1375142400000, 1135],
    /* Aug 2013 */

    [1375315200000, 1169],
    [1375660800000, 1189],
    [1376092800000, 1337],
    [1376524800000, 1191],
    [1376956800000, 1268],
    [1377388800000, 1120],
    [1377820800000, 1228],
    /* Sep 2013 */

    [1377993600000, 1310],
    [1378339200000, 1216],
    [1378771200000, 1200],
    [1379203200000, 1229],
    [1379635200000, 1137],
    [1380067200000, 1226],
    [1380499200000, 1268],
    /* Oct 2013 */
    [1380585600000, 1169],
    [1380931200000, 1189],
    [1381363200000, 1337],
    [1381795200000, 1191],
    [1382227200000, 1268],
    [1382659200000, 1120],
    [1383091200000, 1228],
    /* Nov 2013 */

    [1383264000000, 1316],
    [1383609600000, 1216],
    [1384041600000, 1200],
    [1384473600000, 1229]
]);


var globalRivalProcCodeData1 = new Object([
    /* Jan 2012 */
    [1325376000000, 45607],
    [1325721600000, 10778],
    [1326153600000, 158473],
    [1326585600000, 342691],
    [1327017600000, 115673],
    [1327449600000, 100233],
    [1327881600000, 135439],
    /* Feb 2012 */

    [1328054400000, 169573],
    [1328400000000, 189720],
    [1328832000000, 337315],
    [1329264000000, 191533],
    [1329696000000, 268057],
    [1330128000000, 120544],
    [1330387200000, 228616],
    /* Mar 2012 */

    [1330560000000, 316970],
    [1330905600000, 216719],
    [1331337600000, 200142],
    [1331769600000, 229414],
    [1332201600000, 137445],
    [1332633600000, 226317],
    [1333065600000, 268363],
    /* Apr 2012 */

    [1333238400000, 45607],
    [1333584000000, 10778],
    [1334016000000, 158473],
    [1334448000000, 342691],
    [1334880000000, 115673],
    [1335312000000, 100233],
    [1335744000000, 135439],
    /* May 2012 */

    [1335830400000, 169573],
    [1336176000000, 189720],
    [1336608000000, 337315],
    [1337040000000, 191533],
    [1337472000000, 268057],
    [1337904000000, 120544],
    [1338336000000, 228616],
    /* Jun 2012 */

    [1338508800000, 316970],
    [1338854400000, 216719],
    [1339286400000, 200142],
    [1339718400000, 229414],
    [1340150400000, 137445],
    [1340582400000, 226317],
    [1341014400000, 268363],
    /* Jul 2012 */

    [1341100800000, 45607],
    [1341446400000, 10778],
    [1341878400000, 158473],
    [1342310400000, 342691],
    [1342742400000, 115673],
    [1343174400000, 100233],
    [1343606400000, 135439],
    /* Aug 2012 */

    [1343779200000, 169573],
    [1344124800000, 189720],
    [1344556800000, 337315],
    [1344988800000, 191533],
    [1345420800000, 268057],
    [1345852800000, 120544],
    [1346284800000, 228616],
    /* Sep 2012 */

    [1346457600000, 316970],
    [1346803200000, 216719],
    [1347235200000, 200142],
    [1347667200000, 229414],
    [1348099200000, 137445],
    [1348531200000, 226317],
    [1348963200000, 268363],
    /* Oct 2012 */

    [1349049600000, 45607],
    [1349395200000, 10778],
    [1349827200000, 158473],
    [1350259200000, 342691],
    [1350691200000, 115673],
    [1351123200000, 100233],
    [1351555200000, 135439],
    /* Nov 2012 */

    [1351728000000, 169573],
    [1352073600000, 189720],
    [1352505600000, 337315],
    [1352937600000, 191533],
    [1353369600000, 268057],
    [1353801600000, 120544],
    [1354233600000, 228616],
    /* Dec 2012 */

    [1354320000000, 316970],
    [1354665600000, 216719],
    [1355097600000, 200142],
    [1355529600000, 229414],
    [1355961600000, 137445],
    [1356393600000, 226317],
    [1356825600000, 268363],
    /* Jan 2013 */
    [1356998400000, 45607],
    [1357344000000, 10778],
    [1357776000000, 158473],
    [1358208000000, 342691],
    [1358640000000, 115673],
    [1359072000000, 100233],
    [1359504000000, 135439],
    /* Feb 2013 */

    [1359676800000, 169573],
    [1360022400000, 189720],
    [1360454400000, 337315],
    [1360886400000, 191533],
    [1361318400000, 268057],
    [1361750400000, 120544],
    [1362009600000, 228616],
    /* Mar 2013 */

    [1362096000000, 316970],
    [1362441600000, 216719],
    [1362873600000, 200142],
    [1363305600000, 229414],
    [1363737600000, 137445],
    [1364169600000, 226317],
    [1364601600000, 268363],
    /* Apr 2013 */

    [1364774400000, 45607],
    [1365120000000, 10778],
    [1365552000000, 158473],
    [1365984000000, 342691],
    [1366416000000, 115673],
    [1366848000000, 100233],
    [1367280000000, 135439],
    /* May 2013 */

    [1367366400000, 169573],
    [1367712000000, 189720],
    [1368144000000, 337315],
    [1368576000000, 191533],
    [1369008000000, 268057],
    [1369440000000, 120544],
    [1369872000000, 228616],
    /* Jun 2013 */

    [1370044800000, 316970],
    [1370390400000, 216719],
    [1370822400000, 200142],
    [1371254400000, 229414],
    [1371686400000, 137445],
    [1372118400000, 226317],
    [1372550400000, 268363],
    /* Jul 2013 */
    [1372636800000, 45607],
    [1372982400000, 10778],
    [1373414400000, 158473],
    [1373846400000, 342691],
    [1374278400000, 115673],
    [1374710400000, 100233],
    [1375142400000, 135439],
    /* Aug 2013 */

    [1375315200000, 69573],
    [1375660800000, 89720],
    [1376092800000, 37315],
    [1376524800000, 91533], [1376956800000, 68057],
    [1377388800000, 20544],
    [1377820800000, 28616],
    /* Sep 2013 */

    [1377993600000, 16970],
    [1378339200000, 16719],
    [1378771200000, 80142],
    [1379203200000, 29414],
    [1379635200000, 37445],
    [1380067200000, 26317],
    [1380499200000, 68363],
    /* Oct 2013 */
    [1380585600000, 69573],
    [1380931200000, 89720],
    [1381363200000, 37315],
    [1381795200000, 91533],
    [1382227200000, 68057],
    [1382659200000, 20544],
    [1383091200000, 28616],
    /* Nov 2013 */

    [1383264000000, 16970],
    [1383609600000, 16719],
    [1384041600000, 00142],
    [1384473600000, 29414]
]);

var globalRivalProcCodeData2 = new Object([
    /* Jan 2012 */
    [1325376000000, 456],
    [1325721600000, 107],
    [1326153600000, 158],
    [1326585600000, 342],
    [1327017600000, 115],
    [1327449600000, 100],
    [1327881600000, 135],
    /* Feb 2012 */

    [1328054400000, 169],
    [1328400000000, 189],
    [1328832000000, 337],
    [1329264000000, 191],
    [1329696000000, 268],
    [1330128000000, 120],
    [1330387200000, 228],
    /* Mar 2012 */
    [1330560000000, 316],
    [1330905600000, 216],
    [1331337600000, 200],
    [1331769600000, 229],
    [1332201600000, 137],
    [1332633600000, 226],
    [1333065600000, 268],
    /* Apr 2012 */
    [1333238400000, 456],
    [1333584000000, 107],
    [1334016000000, 158],
    [1334448000000, 342],
    [1334880000000, 115],
    [1335312000000, 100],
    [1335744000000, 135],
    /* May 2012 */
    [1335830400000, 169],
    [1336176000000, 189],
    [1336608000000, 337],
    [1337040000000, 191],
    [1337472000000, 268],
    [1337904000000, 120],
    [1338336000000, 228],
    /* Jun 2012 */
    [1338508800000, 316],
    [1338854400000, 216],
    [1339286400000, 200],
    [1339718400000, 229],
    [1340150400000, 137],
    [1340582400000, 226],
    [1341014400000, 268],
    /* Jul 2012 */
    [1341100800000, 45],
    [1341446400000, 107],
    [1341878400000, 158],
    [1342310400000, 342],
    [1342742400000, 115],
    [1343174400000, 100],
    [1343606400000, 135],
    /* Aug 2012 */

    [1343779200000, 169],
    [1344124800000, 189],
    [1344556800000, 337],
    [1344988800000, 191],
    [1345420800000, 268],
    [1345852800000, 120],
    [1346284800000, 228],
    /* Sep 2012 */
    [1346457600000, 316],
    [1346803200000, 216],
    [1347235200000, 200],
    [1347667200000, 229],
    [1348099200000, 137],
    [1348531200000, 226],
    [1348963200000, 268],
    /* Oct 2012 */
    [1349049600000, 45],
    [1349395200000, 107],
    [1349827200000, 158],
    [1350259200000, 342],
    [1350691200000, 115],
    [1351123200000, 100],
    [1351555200000, 135],
    /* Nov 2012 */

    [1351728000000, 169],
    [1352073600000, 189],
    [1352505600000, 337],
    [1352937600000, 191],
    [1353369600000, 268],
    [1353801600000, 120],
    [1354233600000, 228],
    /* Dec 2012 */
    [1354320000000, 316],
    [1354665600000, 216],
    [1355097600000, 200],
    [1355529600000, 229],
    [1355961600000, 137],
    [1356393600000, 226],
    [1356825600000, 268],
    /* Jan 2013 */
    [1356998400000, 45],
    [1357344000000, 108],
    [1357776000000, 158],
    [1358208000000, 342],
    [1358640000000, 115],
    [1359072000000, 100],
    [1359504000000, 135],
    /* Feb 2013 */

    [1359676800000, 169],
    [1360022400000, 189],
    [1360454400000, 337],
    [1360886400000, 191],
    [1361318400000, 268],
    [1361750400000, 120],
    [1362009600000, 228],
    /* Mar 2013 */
    [1362096000000, 316],
    [1362441600000, 216],
    [1362873600000, 200],
    [1363305600000, 229],
    [1363737600000, 137],
    [1364169600000, 226],
    [1364601600000, 268],
    /* Apr 2013 */
    [1364774400000, 45],
    [1365120000000, 108],
    [1365552000000, 153],
    [1365984000000, 341],
    [1366416000000, 113],
    [1366848000000, 103],
    [1367280000000, 139],
    /* May 2013 */

    [1367366400000, 163],
    [1367712000000, 180],
    [1368144000000, 335],
    [1368576000000, 193],
    [1369008000000, 267],
    [1369440000000, 124],
    [1369872000000, 226],
    /* Jun 2013 */
    [1370044800000, 316],
    [1370390400000, 216],
    [1370822400000, 200],
    [1371254400000, 229],
    [1371686400000, 137],
    [1372118400000, 226],
    [1372550400000, 268],
    /* Jul 2013 */
    [1372636800000, 456],
    [1372982400000, 107],
    [1373414400000, 158],
    [1373846400000, 342],
    [1374278400000, 115],
    [1374710400000, 100],
    [1375142400000, 135],
    /* Aug 2013 */

    [1375315200000, 169],
    [1375660800000, 189],
    [1376092800000, 137],
    [1376524800000, 191],
    [1376956800000, 168],
    [1377388800000, 120],
    [1377820800000, 128],
    /* Sep 2013 */
    [1377993600000, 110],
    [1378339200000, 116],
    [1378771200000, 100],
    [1379203200000, 129],
    [1379635200000, 137],
    [1380067200000, 126],
    [1380499200000, 168],
    /* Oct 2013 */
    [1380585600000, 169],
    [1380931200000, 189],
    [1381363200000, 137],
    [1381795200000, 191],
    [1382227200000, 168],
    [1382659200000, 120],
    [1383091200000, 128],
    /* Nov 2013 */

    [1383264000000, 116],
    [1383609600000, 116],
    [1384041600000, 100],
    [1384473600000, 129]
]);



var globalProvDiagMismatchData1 = new Object([
    /* Jan 2012 */     [1325376000000, 45607],
    [1325721600000, 10778],
    [1326153600000, 158473],
    [1326585600000, 342691],
    [1327017600000, 115673],
    [1327449600000, 100233],
    [1327881600000, 135439],
    /* Feb 2012 */

    [1328054400000, 169573],
    [1328400000000, 189720],
    [1328832000000, 337315],
    [1329264000000, 191533],
    [1329696000000, 268057],
    [1330128000000, 120544],
    [1330387200000, 228616],
    /* Mar 2012 */

    [1330560000000, 316970],
    [1330905600000, 216719],
    [1331337600000, 200142],
    [1331769600000, 229414],
    [1332201600000, 137445],
    [1332633600000, 226317],
    [1333065600000, 268363],
    /* Apr 2012 */

    [1333238400000, 45607],
    [1333584000000, 10778],
    [1334016000000, 158473],
    [1334448000000, 342691],
    [1334880000000, 115673],
    [1335312000000, 100233],
    [1335744000000, 135439],
    /* May 2012 */

    [1335830400000, 169573],
    [1336176000000, 189720],
    [1336608000000, 337315],
    [1337040000000, 191533],
    [1337472000000, 268057],
    [1337904000000, 120544],
    [1338336000000, 228616],
    /* Jun 2012 */

    [1338508800000, 316970],
    [1338854400000, 216719],
    [1339286400000, 200142],
    [1339718400000, 229414],
    [1340150400000, 137445],
    [1340582400000, 226317],
    [1341014400000, 268363],
    /* Jul 2012 */

    [1341100800000, 45607],
    [1341446400000, 10778],
    [1341878400000, 158473],
    [1342310400000, 342691],
    [1342742400000, 115673],
    [1343174400000, 100233],
    [1343606400000, 135439],
    /* Aug 2012 */

    [1343779200000, 169573],
    [1344124800000, 189720],
    [1344556800000, 337315],
    [1344988800000, 191533],
    [1345420800000, 268057],
    [1345852800000, 120544],
    [1346284800000, 228616],
    /* Sep 2012 */

    [1346457600000, 316970],
    [1346803200000, 216719],
    [1347235200000, 200142],
    [1347667200000, 229414],
    [1348099200000, 137445],
    [1348531200000, 226317],
    [1348963200000, 268363],
    /* Oct 2012 */

    [1349049600000, 45607],
    [1349395200000, 10778],
    [1349827200000, 158473],
    [1350259200000, 342691],
    [1350691200000, 115673],
    [1351123200000, 100233],
    [1351555200000, 135439],
    /* Nov 2012 */

    [1351728000000, 169573],
    [1352073600000, 189720],
    [1352505600000, 337315],
    [1352937600000, 191533],
    [1353369600000, 268057],
    [1353801600000, 120544],
    [1354233600000, 228616],
    /* Dec 2012 */

    [1354320000000, 316970],
    [1354665600000, 216719],
    [1355097600000, 200142],
    [1355529600000, 229414],
    [1355961600000, 137445],
    [1356393600000, 226317],
    [1356825600000, 268363],
    /* Jan 2013 */
    [1356998400000, 45607],
    [1357344000000, 10778],
    [1357776000000, 158473],
    [1358208000000, 342691],
    [1358640000000, 115673],
    [1359072000000, 100233],
    [1359504000000, 135439],
    /* Feb 2013 */

    [1359676800000, 169573],
    [1360022400000, 189720],
    [1360454400000, 337315],
    [1360886400000, 191533],
    [1361318400000, 268057],
    [1361750400000, 120544],
    [1362009600000, 228616],
    /* Mar 2013 */

    [1362096000000, 316970],
    [1362441600000, 216719],
    [1362873600000, 200142],
    [1363305600000, 229414],
    [1363737600000, 137445],
    [1364169600000, 226317],
    [1364601600000, 268363],
    /* Apr 2013 */

    [1364774400000, 45607],
    [1365120000000, 10778],
    [1365552000000, 158473],
    [1365984000000, 342691],
    [1366416000000, 115673],
    [1366848000000, 100233],
    [1367280000000, 135439],
    /* May 2013 */

    [1367366400000, 169573],
    [1367712000000, 189720],
    [1368144000000, 337315],
    [1368576000000, 191533],
    [1369008000000, 268057],
    [1369440000000, 120544],
    [1369872000000, 228616],
    /* Jun 2013 */

    [1370044800000, 316970],
    [1370390400000, 216719],
    [1370822400000, 200142],
    [1371254400000, 229414],
    [1371686400000, 137445],
    [1372118400000, 226317],
    [1372550400000, 268363],
    /* Jul 2013 */
    [1372636800000, 45607],
    [1372982400000, 10778],
    [1373414400000, 158473],
    [1373846400000, 342691],
    [1374278400000, 115673],
    [1374710400000, 100233],
    [1375142400000, 135439],
    /* Aug 2013 */

    [1375315200000, 169573],
    [1375660800000, 189720],
    [1376092800000, 337315],
    [1376524800000, 191533],
    [1376956800000, 268057],
    [1377388800000, 120544],
    [1377820800000, 228616],
    /* Sep 2013 */

    [1377993600000, 316970],
    [1378339200000, 216719],
    [1378771200000, 200142],
    [1379203200000, 229414],
    [1379635200000, 137445],
    [1380067200000, 226317],
    [1380499200000, 268363],
    /* Oct 2013 */
    [1380585600000, 169573],
    [1380931200000, 189720],
    [1381363200000, 337315],
    [1381795200000, 191533],
    [1382227200000, 268057],
    [1382659200000, 120544],
    [1383091200000, 228616],
    /* Nov 2013 */

    [1383264000000, 316970],
    [1383609600000, 216719],
    [1384041600000, 200142],
    [1384473600000, 229414]
]);


var globalProvDiagMismatchData2 = new Object([
    /* Jan 2012 */
    [1325376000000, 456],
    [1325721600000, 107],
    [1326153600000, 158],
    [1326585600000, 342],
    [1327017600000, 115],
    [1327449600000, 100],
    [1327881600000, 135],
    /* Feb 2012 */

    [1328054400000, 169],
    [1328400000000, 189],
    [1328832000000, 337],
    [1329264000000, 191],
    [1329696000000, 268],
    [1330128000000, 120],
    [1330387200000, 228],
    /* Mar 2012 */
    [1330560000000, 316],
    [1330905600000, 216],
    [1331337600000, 200],
    [1331769600000, 229],
    [1332201600000, 137],
    [1332633600000, 226],
    [1333065600000, 268],
    /* Apr 2012 */
    [1333238400000, 456],
    [1333584000000, 107],
    [1334016000000, 158],
    [1334448000000, 342],
    [1334880000000, 115],
    [1335312000000, 100],
    [1335744000000, 135],
    /* May 2012 */
    [1335830400000, 169],
    [1336176000000, 189],
    [1336608000000, 337],
    [1337040000000, 191],
    [1337472000000, 268],
    [1337904000000, 120],
    [1338336000000, 228],
    /* Jun 2012 */
    [1338508800000, 316],
    [1338854400000, 216],
    [1339286400000, 200],
    [1339718400000, 229],
    [1340150400000, 137],
    [1340582400000, 226],
    [1341014400000, 268],
    /* Jul 2012 */
    [1341100800000, 45],
    [1341446400000, 107],
    [1341878400000, 158],
    [1342310400000, 342],
    [1342742400000, 115],
    [1343174400000, 100],
    [1343606400000, 135],
    /* Aug 2012 */

    [1343779200000, 169],
    [1344124800000, 189],
    [1344556800000, 337],
    [1344988800000, 191],
    [1345420800000, 268],
    [1345852800000, 120],
    [1346284800000, 228],
    /* Sep 2012 */
    [1346457600000, 316],
    [1346803200000, 216],
    [1347235200000, 200],
    [1347667200000, 229],
    [1348099200000, 137],
    [1348531200000, 226],
    [1348963200000, 268],
    /* Oct 2012 */
    [1349049600000, 45],
    [1349395200000, 107],
    [1349827200000, 158],
    [1350259200000, 342],
    [1350691200000, 115],
    [1351123200000, 100],
    [1351555200000, 135],
    /* Nov 2012 */

    [1351728000000, 169],
    [1352073600000, 189],
    [1352505600000, 337],
    [1352937600000, 191],
    [1353369600000, 268],
    [1353801600000, 120],
    [1354233600000, 228],
    /* Dec 2012 */
    [1354320000000, 316],
    [1354665600000, 216],
    [1355097600000, 200],
    [1355529600000, 229],
    [1355961600000, 137],
    [1356393600000, 226],
    [1356825600000, 268],
    /* Jan 2013 */
    [1356998400000, 45],
    [1357344000000, 108],
    [1357776000000, 158],
    [1358208000000, 342],
    [1358640000000, 115],
    [1359072000000, 100],
    [1359504000000, 135],
    /* Feb 2013 */

    [1359676800000, 169],
    [1360022400000, 189],
    [1360454400000, 337],
    [1360886400000, 191],
    [1361318400000, 268],
    [1361750400000, 120],
    [1362009600000, 228],
    /* Mar 2013 */
    [1362096000000, 316],
    [1362441600000, 216],
    [1362873600000, 200],
    [1363305600000, 229],
    [1363737600000, 137],
    [1364169600000, 226],
    [1364601600000, 268],
    /* Apr 2013 */
    [1364774400000, 45],
    [1365120000000, 108],
    [1365552000000, 153],
    [1365984000000, 341],
    [1366416000000, 113],
    [1366848000000, 103],
    [1367280000000, 139],
    /* May 2013 */

    [1367366400000, 163],
    [1367712000000, 180],
    [1368144000000, 335],
    [1368576000000, 193],
    [1369008000000, 267],
    [1369440000000, 124],
    [1369872000000, 226],
    /* Jun 2013 */
    [1370044800000, 316],
    [1370390400000, 216],
    [1370822400000, 200],
    [1371254400000, 229],
    [1371686400000, 137],
    [1372118400000, 226],
    [1372550400000, 268],
    /* Jul 2013 */
    [1372636800000, 456],
    [1372982400000, 107],
    [1373414400000, 158],
    [1373846400000, 342],
    [1374278400000, 115],
    [1374710400000, 100],
    [1375142400000, 135],
    /* Aug 2013 */

    [1375315200000, 169],
    [1375660800000, 189],
    [1376092800000, 337],
    [1376524800000, 191],
    [1376956800000, 268],
    [1377388800000, 120],
    [1377820800000, 228],
    /* Sep 2013 */
    [1377993600000, 310],
    [1378339200000, 216],
    [1378771200000, 200],
    [1379203200000, 229],
    [1379635200000, 137],
    [1380067200000, 226],
    [1380499200000, 268],
    /* Oct 2013 */
    [1380585600000, 169],
    [1380931200000, 189],
    [1381363200000, 337],
    [1381795200000, 191],
    [1382227200000, 268],
    [1382659200000, 120],
    [1383091200000, 228],
    /* Nov 2013 */

    [1383264000000, 316],
    [1383609600000, 216],
    [1384041600000, 200],
    [1384473600000, 229]
]);



var globalProcDiagMismatchData1 = new Object([
    /* Jan 2012 */     [1325376000000, 45607],
    [1325721600000, 10778],
    [1326153600000, 158473],
    [1326585600000, 342691],
    [1327017600000, 115673],
    [1327449600000, 100233],
    [1327881600000, 135439],
    /* Feb 2012 */

    [1328054400000, 169573],
    [1328400000000, 189720],
    [1328832000000, 337315],
    [1329264000000, 191533],
    [1329696000000, 268057],
    [1330128000000, 120544],
    [1330387200000, 228616],
    /* Mar 2012 */

    [1330560000000, 316970],
    [1330905600000, 216719],
    [1331337600000, 200142],
    [1331769600000, 229414],
    [1332201600000, 137445],
    [1332633600000, 226317],
    [1333065600000, 268363],
    /* Apr 2012 */

    [1333238400000, 45607],
    [1333584000000, 10778],
    [1334016000000, 158473],
    [1334448000000, 342691],
    [1334880000000, 115673],
    [1335312000000, 100233],
    [1335744000000, 135439],
    /* May 2012 */

    [1335830400000, 169573],
    [1336176000000, 189720],
    [1336608000000, 337315],
    [1337040000000, 191533],
    [1337472000000, 268057],
    [1337904000000, 120544],
    [1338336000000, 228616],
    /* Jun 2012 */

    [1338508800000, 316970],
    [1338854400000, 216719],
    [1339286400000, 200142],
    [1339718400000, 229414],
    [1340150400000, 137445],
    [1340582400000, 226317],
    [1341014400000, 268363],
    /* Jul 2012 */

    [1341100800000, 45607],
    [1341446400000, 10778],
    [1341878400000, 158473],
    [1342310400000, 342691],
    [1342742400000, 115673],
    [1343174400000, 100233],
    [1343606400000, 135439],
    /* Aug 2012 */

    [1343779200000, 169573],
    [1344124800000, 189720],
    [1344556800000, 337315],
    [1344988800000, 191533],
    [1345420800000, 268057],
    [1345852800000, 120544],
    [1346284800000, 228616],
    /* Sep 2012 */

    [1346457600000, 316970],
    [1346803200000, 216719],
    [1347235200000, 200142],
    [1347667200000, 229414],
    [1348099200000, 137445],
    [1348531200000, 226317],
    [1348963200000, 268363],
    /* Oct 2012 */

    [1349049600000, 45607],
    [1349395200000, 10778],
    [1349827200000, 158473],
    [1350259200000, 342691],
    [1350691200000, 115673],
    [1351123200000, 100233],
    [1351555200000, 135439],
    /* Nov 2012 */

    [1351728000000, 169573],
    [1352073600000, 189720],
    [1352505600000, 337315],
    [1352937600000, 191533],
    [1353369600000, 268057],
    [1353801600000, 120544],
    [1354233600000, 228616],
    /* Dec 2012 */

    [1354320000000, 316970],
    [1354665600000, 216719],
    [1355097600000, 200142],
    [1355529600000, 229414],
    [1355961600000, 137445],
    [1356393600000, 226317],
    [1356825600000, 268363],
    /* Jan 2013 */
    [1356998400000, 45607],
    [1357344000000, 10778],
    [1357776000000, 158473],
    [1358208000000, 342691],
    [1358640000000, 115673],
    [1359072000000, 100233],
    [1359504000000, 135439],
    /* Feb 2013 */

    [1359676800000, 169573],
    [1360022400000, 189720],
    [1360454400000, 337315],
    [1360886400000, 191533],
    [1361318400000, 268057],
    [1361750400000, 120544],
    [1362009600000, 228616],
    /* Mar 2013 */

    [1362096000000, 316970],
    [1362441600000, 216719],
    [1362873600000, 200142],
    [1363305600000, 229414],
    [1363737600000, 137445],
    [1364169600000, 226317],
    [1364601600000, 268363],
    /* Apr 2013 */

    [1364774400000, 45607],
    [1365120000000, 10778],
    [1365552000000, 158473],
    [1365984000000, 342691],
    [1366416000000, 115673],
    [1366848000000, 100233],
    [1367280000000, 135439],
    /* May 2013 */

    [1367366400000, 169573],
    [1367712000000, 189720],
    [1368144000000, 337315],
    [1368576000000, 191533],
    [1369008000000, 268057],
    [1369440000000, 120544],
    [1369872000000, 228616],
    /* Jun 2013 */

    [1370044800000, 316970],
    [1370390400000, 216719],
    [1370822400000, 200142],
    [1371254400000, 229414],
    [1371686400000, 137445],
    [1372118400000, 226317],
    [1372550400000, 268363],
    /* Jul 2013 */
    [1372636800000, 45607],
    [1372982400000, 10778],
    [1373414400000, 158473],
    [1373846400000, 342691],
    [1374278400000, 115673],
    [1374710400000, 100233],
    [1375142400000, 135439],
    /* Aug 2013 */

    [1375315200000, 69573],
    [1375660800000, 89720],
    [1376092800000, 137315],
    [1376524800000, 91533],
    [1376956800000, 68057], [1377388800000, 120544], [1377820800000, 128616], /* Sep 2013 */

    [1377993600000, 116970], [1378339200000, 116719],
    [1378771200000, 100142],
    [1379203200000, 129414],
    [1379635200000, 137445],
    [1380067200000, 126317],
    [1380499200000, 168363],
    /* Oct 2013 */
    [1380585600000, 169573],
    [1380931200000, 189720],
    [1381363200000, 137315],
    [1381795200000, 191533],
    [1382227200000, 168057],
    [1382659200000, 120544],
    [1383091200000, 128616],
    /* Nov 2013 */

    [1383264000000, 116970],
    [1383609600000, 116719],
    [1384041600000, 100142],
    [1384473600000, 129414]
]);


var globalProcDiagMismatchData2 = new Object([
    /* Jan 2012 */
    [1325376000000, 456],
    [1325721600000, 107],
    [1326153600000, 158],
    [1326585600000, 342],
    [1327017600000, 115],
    [1327449600000, 100],
    [1327881600000, 135],
    /* Feb 2012 */

    [1328054400000, 169],
    [1328400000000, 189],
    [1328832000000, 337],
    [1329264000000, 191],
    [1329696000000, 268],
    [1330128000000, 120],
    [1330387200000, 228],
    /* Mar 2012 */
    [1330560000000, 316],
    [1330905600000, 216],
    [1331337600000, 200],
    [1331769600000, 229],
    [1332201600000, 137],
    [1332633600000, 226],
    [1333065600000, 268],
    /* Apr 2012 */
    [1333238400000, 456],
    [1333584000000, 107],
    [1334016000000, 158],
    [1334448000000, 342],
    [1334880000000, 115],
    [1335312000000, 100],
    [1335744000000, 135],
    /* May 2012 */
    [1335830400000, 169],
    [1336176000000, 189],
    [1336608000000, 337],
    [1337040000000, 191],
    [1337472000000, 268],
    [1337904000000, 120],
    [1338336000000, 228],
    /* Jun 2012 */
    [1338508800000, 316],
    [1338854400000, 216],
    [1339286400000, 200],
    [1339718400000, 229],
    [1340150400000, 137],
    [1340582400000, 226],
    [1341014400000, 268],
    /* Jul 2012 */
    [1341100800000, 45],
    [1341446400000, 107],
    [1341878400000, 158],
    [1342310400000, 342],
    [1342742400000, 115],
    [1343174400000, 100],
    [1343606400000, 135],
    /* Aug 2012 */

    [1343779200000, 169],
    [1344124800000, 189],
    [1344556800000, 337],
    [1344988800000, 191],
    [1345420800000, 268],
    [1345852800000, 120],
    [1346284800000, 228],
    /* Sep 2012 */
    [1346457600000, 316],
    [1346803200000, 216],
    [1347235200000, 200],
    [1347667200000, 229],
    [1348099200000, 137],
    [1348531200000, 226],
    [1348963200000, 268],
    /* Oct 2012 */
    [1349049600000, 45],
    [1349395200000, 107],
    [1349827200000, 158],
    [1350259200000, 342],
    [1350691200000, 115],
    [1351123200000, 100],
    [1351555200000, 135],
    /* Nov 2012 */

    [1351728000000, 169],
    [1352073600000, 189],
    [1352505600000, 337],
    [1352937600000, 191],
    [1353369600000, 268],
    [1353801600000, 120],
    [1354233600000, 228],
    /* Dec 2012 */
    [1354320000000, 316],
    [1354665600000, 216],
    [1355097600000, 200],
    [1355529600000, 229],
    [1355961600000, 137],
    [1356393600000, 226],
    [1356825600000, 268],
    /* Jan 2013 */
    [1356998400000, 45],
    [1357344000000, 108],
    [1357776000000, 158],
    [1358208000000, 342],
    [1358640000000, 115],
    [1359072000000, 100],
    [1359504000000, 135],
    /* Feb 2013 */

    [1359676800000, 169],
    [1360022400000, 189],
    [1360454400000, 337],
    [1360886400000, 191],
    [1361318400000, 268],
    [1361750400000, 120],
    [1362009600000, 228],
    /* Mar 2013 */
    [1362096000000, 316],
    [1362441600000, 216],
    [1362873600000, 200],
    [1363305600000, 229],
    [1363737600000, 137],
    [1364169600000, 226],
    [1364601600000, 268],
    /* Apr 2013 */
    [1364774400000, 45],
    [1365120000000, 108],
    [1365552000000, 153],
    [1365984000000, 341],
    [1366416000000, 113],
    [1366848000000, 103],
    [1367280000000, 139],
    /* May 2013 */

    [1367366400000, 163],
    [1367712000000, 180],
    [1368144000000, 335],
    [1368576000000, 193],
    [1369008000000, 267],
    [1369440000000, 124],
    [1369872000000, 226],
    /* Jun 2013 */
    [1370044800000, 316],
    [1370390400000, 216],
    [1370822400000, 200],
    [1371254400000, 229],
    [1371686400000, 137],
    [1372118400000, 226],
    [1372550400000, 268],
    /* Jul 2013 */
    [1372636800000, 456],
    [1372982400000, 107],
    [1373414400000, 158],
    [1373846400000, 342],
    [1374278400000, 115],
    [1374710400000, 100],
    [1375142400000, 135],
    /* Aug 2013 */

    [1375315200000, 169],
    [1375660800000, 189],
    [1376092800000, 137],
    [1376524800000, 191],
    [1376956800000, 68],
    [1377388800000, 120],
    [1377820800000, 128],
    /* Sep 2013 */

    [1377993600000, 110],
    [1378339200000, 116],
    [1378771200000, 100],
    [1379203200000, 129],
    [1379635200000, 137],
    [1380067200000, 126],
    [1380499200000, 168],
    /* Oct 2013 */
    [1380585600000, 169],
    [1380931200000, 289],
    [1381363200000, 137],
    [1381795200000, 91],
    [1382227200000, 168],
    [1382659200000, 220],
    [1383091200000, 128],
    /* Nov 2013 */

    [1383264000000, 116],
    [1383609600000, 116],
    [1384041600000, 100],
    [1384473600000, 129]
]);


var globalDuplicateClaimsData1 = new Object([
    /* Jan 2012 */
    [1325376000000, 45607], [1325721600000, 10778],
    [1326153600000, 158473],
    [1326585600000, 342691],
    [1327017600000, 115673],
    [1327449600000, 100233],
    [1327881600000, 135439],
    /* Feb 2012 */

    [1328054400000, 169573],
    [1328400000000, 189720],
    [1328832000000, 337315],
    [1329264000000, 191533],
    [1329696000000, 268057],
    [1330128000000, 120544],
    [1330387200000, 228616],
    /* Mar 2012 */

    [1330560000000, 316970],
    [1330905600000, 216719],
    [1331337600000, 200142],
    [1331769600000, 229414],
    [1332201600000, 137445],
    [1332633600000, 226317],
    [1333065600000, 268363],
    /* Apr 2012 */

    [1333238400000, 45607],
    [1333584000000, 10778],
    [1334016000000, 158473],
    [1334448000000, 342691],
    [1334880000000, 115673],
    [1335312000000, 100233],
    [1335744000000, 135439],
    /* May 2012 */

    [1335830400000, 169573],
    [1336176000000, 189720],
    [1336608000000, 337315],
    [1337040000000, 191533],
    [1337472000000, 268057],
    [1337904000000, 120544],
    [1338336000000, 228616],
    /* Jun 2012 */

    [1338508800000, 316970],
    [1338854400000, 216719],
    [1339286400000, 200142],
    [1339718400000, 229414],
    [1340150400000, 137445],
    [1340582400000, 226317],
    [1341014400000, 268363],
    /* Jul 2012 */

    [1341100800000, 45607],
    [1341446400000, 10778],
    [1341878400000, 158473],
    [1342310400000, 342691],
    [1342742400000, 115673],
    [1343174400000, 100233],
    [1343606400000, 135439],
    /* Aug 2012 */

    [1343779200000, 169573],
    [1344124800000, 189720],
    [1344556800000, 337315],
    [1344988800000, 191533],
    [1345420800000, 268057],
    [1345852800000, 120544],
    [1346284800000, 228616],
    /* Sep 2012 */

    [1346457600000, 316970],
    [1346803200000, 216719],
    [1347235200000, 200142],
    [1347667200000, 229414],
    [1348099200000, 137445],
    [1348531200000, 226317],
    [1348963200000, 268363],
    /* Oct 2012 */

    [1349049600000, 45607],
    [1349395200000, 10778],
    [1349827200000, 158473],
    [1350259200000, 342691],
    [1350691200000, 115673],
    [1351123200000, 100233],
    [1351555200000, 135439],
    /* Nov 2012 */

    [1351728000000, 169573],
    [1352073600000, 189720],
    [1352505600000, 337315],
    [1352937600000, 191533],
    [1353369600000, 268057],
    [1353801600000, 120544],
    [1354233600000, 228616],
    /* Dec 2012 */

    [1354320000000, 316970],
    [1354665600000, 216719],
    [1355097600000, 200142],
    [1355529600000, 229414],
    [1355961600000, 137445],
    [1356393600000, 226317],
    [1356825600000, 268363],
    /* Jan 2013 */
    [1356998400000, 45607],
    [1357344000000, 10778],
    [1357776000000, 158473],
    [1358208000000, 342691],
    [1358640000000, 115673],
    [1359072000000, 100233],
    [1359504000000, 135439],
    /* Feb 2013 */

    [1359676800000, 169573],
    [1360022400000, 189720],
    [1360454400000, 337315],
    [1360886400000, 191533],
    [1361318400000, 268057],
    [1361750400000, 120544],
    [1362009600000, 228616],
    /* Mar 2013 */

    [1362096000000, 316970],
    [1362441600000, 216719],
    [1362873600000, 200142],
    [1363305600000, 229414],
    [1363737600000, 137445],
    [1364169600000, 226317],
    [1364601600000, 268363],
    /* Apr 2013 */

    [1364774400000, 45607],
    [1365120000000, 10778],
    [1365552000000, 158473],
    [1365984000000, 342691],
    [1366416000000, 115673],
    [1366848000000, 100233],
    [1367280000000, 135439],
    /* May 2013 */

    [1367366400000, 169573],
    [1367712000000, 189720],
    [1368144000000, 337315],
    [1368576000000, 191533],
    [1369008000000, 268057],
    [1369440000000, 120544],
    [1369872000000, 228616],
    /* Jun 2013 */

    [1370044800000, 316970],
    [1370390400000, 216719],
    [1370822400000, 200142],
    [1371254400000, 229414],
    [1371686400000, 137445],
    [1372118400000, 226317],
    [1372550400000, 268363],
    /* Jul 2013 */
    [1372636800000, 45607],
    [1372982400000, 10778],
    [1373414400000, 158473],
    [1373846400000, 342691],
    [1374278400000, 115673],
    [1374710400000, 100233],
    [1375142400000, 135439],
    /* Aug 2013 */

    [1375315200000, 69573],
    [1375660800000, 189720],
    [1376092800000, 237315],
    [1376524800000, 191533],
    [1376956800000, 168057],
    [1377388800000, 120544],
    [1377820800000, 128616],
    /* Sep 2013 */

    [1377993600000, 116970],
    [1378339200000, 216719],
    [1378771200000, 200142],
    [1379203200000, 129414],
    [1379635200000, 137445],
    [1380067200000, 126317],
    [1380499200000, 268363],
    /* Oct 2013 */
    [1380585600000, 169573],
    [1380931200000, 189720],
    [1381363200000, 137315],
    [1381795200000, 191533],
    [1382227200000, 168057],
    [1382659200000, 120544],
    [1383091200000, 228616],
    /* Nov 2013 */

    [1383264000000, 116970],
    [1383609600000, 216719],
    [1384041600000, 200142],
    [1384473600000, 129414]
]);


var globalDuplicateClaimsData2 = new Object([
    /* Jan 2012 */
    [1325376000000, 456],
    [1325721600000, 107],
    [1326153600000, 158],
    [1326585600000, 342],
    [1327017600000, 115],
    [1327449600000, 100],
    [1327881600000, 135],
    /* Feb 2012 */

    [1328054400000, 169],
    [1328400000000, 189],
    [1328832000000, 337],
    [1329264000000, 191],
    [1329696000000, 268],
    [1330128000000, 120],
    [1330387200000, 228],
    /* Mar 2012 */
    [1330560000000, 316],
    [1330905600000, 216],
    [1331337600000, 200],
    [1331769600000, 229],
    [1332201600000, 137],
    [1332633600000, 226],
    [1333065600000, 268],
    /* Apr 2012 */
    [1333238400000, 456],
    [1333584000000, 107],
    [1334016000000, 158],
    [1334448000000, 342],
    [1334880000000, 115],
    [1335312000000, 100],
    [1335744000000, 135],
    /* May 2012 */
    [1335830400000, 169],
    [1336176000000, 189],
    [1336608000000, 337],
    [1337040000000, 191],
    [1337472000000, 268],
    [1337904000000, 120],
    [1338336000000, 228],
    /* Jun 2012 */
    [1338508800000, 316],
    [1338854400000, 216],
    [1339286400000, 200],
    [1339718400000, 229],
    [1340150400000, 137],
    [1340582400000, 226],
    [1341014400000, 268],
    /* Jul 2012 */
    [1341100800000, 45],
    [1341446400000, 107],
    [1341878400000, 158],
    [1342310400000, 342],
    [1342742400000, 115],
    [1343174400000, 100],
    [1343606400000, 135],
    /* Aug 2012 */

    [1343779200000, 169],
    [1344124800000, 189],
    [1344556800000, 337],
    [1344988800000, 191],
    [1345420800000, 268],
    [1345852800000, 120],
    [1346284800000, 228],
    /* Sep 2012 */
    [1346457600000, 316],
    [1346803200000, 216],
    [1347235200000, 200],
    [1347667200000, 229],
    [1348099200000, 137],
    [1348531200000, 226],
    [1348963200000, 268],
    /* Oct 2012 */
    [1349049600000, 45],
    [1349395200000, 107],
    [1349827200000, 158],
    [1350259200000, 342],
    [1350691200000, 115],
    [1351123200000, 100],
    [1351555200000, 135],
    /* Nov 2012 */

    [1351728000000, 169],
    [1352073600000, 189],
    [1352505600000, 337],
    [1352937600000, 191],
    [1353369600000, 268],
    [1353801600000, 120],
    [1354233600000, 228],
    /* Dec 2012 */
    [1354320000000, 316],
    [1354665600000, 216],
    [1355097600000, 200],
    [1355529600000, 229],
    [1355961600000, 137],
    [1356393600000, 226],
    [1356825600000, 268],
    /* Jan 2013 */
    [1356998400000, 45],
    [1357344000000, 108],
    [1357776000000, 158],
    [1358208000000, 342],
    [1358640000000, 115],
    [1359072000000, 100],
    [1359504000000, 135],
    /* Feb 2013 */

    [1359676800000, 169],
    [1360022400000, 189],
    [1360454400000, 337],
    [1360886400000, 191],
    [1361318400000, 268],
    [1361750400000, 120],
    [1362009600000, 228],
    /* Mar 2013 */
    [1362096000000, 316],
    [1362441600000, 216],
    [1362873600000, 200],
    [1363305600000, 229],
    [1363737600000, 137],
    [1364169600000, 226],
    [1364601600000, 268],
    /* Apr 2013 */
    [1364774400000, 45],
    [1365120000000, 108],
    [1365552000000, 153],
    [1365984000000, 341],
    [1366416000000, 113],
    [1366848000000, 103],
    [1367280000000, 139],
    /* May 2013 */

    [1367366400000, 163],
    [1367712000000, 180],
    [1368144000000, 335],
    [1368576000000, 193],
    [1369008000000, 267],
    [1369440000000, 124],
    [1369872000000, 226],
    /* Jun 2013 */
    [1370044800000, 316],
    [1370390400000, 216],
    [1370822400000, 200],
    [1371254400000, 229],
    [1371686400000, 137],
    [1372118400000, 226],
    [1372550400000, 268],
    /* Jul 2013 */
    [1372636800000, 456],
    [1372982400000, 107],
    [1373414400000, 158],
    [1373846400000, 342],
    [1374278400000, 115],
    [1374710400000, 100],
    [1375142400000, 135],
    /* Aug 2013 */

    [1375315200000, 69],
    [1375660800000, 189],
    [1376092800000, 137],
    [1376524800000, 91],
    [1376956800000, 168],
    [1377388800000, 120],
    [1377820800000, 228],
    /* Sep 2013 */

    [1377993600000, 210],
    [1378339200000, 216],
    [1378771200000, 100],
    [1379203200000, 229],
    [1379635200000, 137],
    [1380067200000, 126],
    [1380499200000, 268],
    /* Oct 2013 */
    [1380585600000, 169],
    [1380931200000, 189],
    [1381363200000, 237],
    [1381795200000, 191],
    [1382227200000, 168],
    [1382659200000, 120],
    [1383091200000, 128],
    /* Nov 2013 */

    [1383264000000, 116],
    [1383609600000, 216],
    [1384041600000, 100],
    [1384473600000, 129]
]);


var globalUnbundlingData1 = new Object([/* Jan 2012 */
    [1325376000000, 45607],
    [1325721600000, 10778],
    [1326153600000, 158473],
    [1326585600000, 342691],
    [1327017600000, 115673],
    [1327449600000, 100233], [1327881600000, 135439],
    /* Feb 2012 */

    [1328054400000, 169573],
    [1328400000000, 189720],
    [1328832000000, 337315],
    [1329264000000, 191533],
    [1329696000000, 268057],
    [1330128000000, 120544],
    [1330387200000, 228616],
    /* Mar 2012 */

    [1330560000000, 316970],
    [1330905600000, 216719],
    [1331337600000, 200142],
    [1331769600000, 229414],
    [1332201600000, 137445],
    [1332633600000, 226317],
    [1333065600000, 268363],
    /* Apr 2012 */

    [1333238400000, 45607],
    [1333584000000, 10778],
    [1334016000000, 158473],
    [1334448000000, 342691],
    [1334880000000, 115673],
    [1335312000000, 100233],
    [1335744000000, 135439],
    /* May 2012 */

    [1335830400000, 169573],
    [1336176000000, 189720],
    [1336608000000, 337315],
    [1337040000000, 191533],
    [1337472000000, 268057],
    [1337904000000, 120544],
    [1338336000000, 228616],
    /* Jun 2012 */

    [1338508800000, 316970],
    [1338854400000, 216719],
    [1339286400000, 200142],
    [1339718400000, 229414],
    [1340150400000, 137445],
    [1340582400000, 226317],
    [1341014400000, 268363],
    /* Jul 2012 */

    [1341100800000, 45607],
    [1341446400000, 10778],
    [1341878400000, 158473],
    [1342310400000, 342691],
    [1342742400000, 115673],
    [1343174400000, 100233],
    [1343606400000, 135439],
    /* Aug 2012 */

    [1343779200000, 169573],
    [1344124800000, 189720],
    [1344556800000, 337315],
    [1344988800000, 191533],
    [1345420800000, 268057],
    [1345852800000, 120544],
    [1346284800000, 228616],
    /* Sep 2012 */

    [1346457600000, 316970],
    [1346803200000, 216719],
    [1347235200000, 200142],
    [1347667200000, 229414],
    [1348099200000, 137445],
    [1348531200000, 226317],
    [1348963200000, 268363],
    /* Oct 2012 */

    [1349049600000, 45607],
    [1349395200000, 10778],
    [1349827200000, 158473],
    [1350259200000, 342691],
    [1350691200000, 115673],
    [1351123200000, 100233],
    [1351555200000, 135439],
    /* Nov 2012 */

    [1351728000000, 169573],
    [1352073600000, 189720],
    [1352505600000, 337315],
    [1352937600000, 191533],
    [1353369600000, 268057],
    [1353801600000, 120544],
    [1354233600000, 228616],
    /* Dec 2012 */

    [1354320000000, 316970],
    [1354665600000, 216719],
    [1355097600000, 200142],
    [1355529600000, 229414],
    [1355961600000, 137445],
    [1356393600000, 226317],
    [1356825600000, 268363],
    /* Jan 2013 */
    [1356998400000, 45607],
    [1357344000000, 10778],
    [1357776000000, 158473],
    [1358208000000, 342691],
    [1358640000000, 115673],
    [1359072000000, 100233],
    [1359504000000, 135439],
    /* Feb 2013 */

    [1359676800000, 169573],
    [1360022400000, 189720],
    [1360454400000, 337315],
    [1360886400000, 191533],
    [1361318400000, 268057],
    [1361750400000, 120544],
    [1362009600000, 228616],
    /* Mar 2013 */

    [1362096000000, 316970],
    [1362441600000, 216719],
    [1362873600000, 200142],
    [1363305600000, 229414],
    [1363737600000, 137445],
    [1364169600000, 226317],
    [1364601600000, 268363],
    /* Apr 2013 */

    [1364774400000, 45607],
    [1365120000000, 10778],
    [1365552000000, 158473],
    [1365984000000, 342691],
    [1366416000000, 115673],
    [1366848000000, 100233],
    [1367280000000, 135439],
    /* May 2013 */

    [1367366400000, 169573],
    [1367712000000, 189720],
    [1368144000000, 337315],
    [1368576000000, 191533],
    [1369008000000, 268057],
    [1369440000000, 120544],
    [1369872000000, 228616],
    /* Jun 2013 */

    [1370044800000, 316970],
    [1370390400000, 216719],
    [1370822400000, 200142],
    [1371254400000, 229414],
    [1371686400000, 137445],
    [1372118400000, 226317],
    [1372550400000, 268363],
    /* Jul 2013 */
    [1372636800000, 45607],
    [1372982400000, 10778],
    [1373414400000, 158473],
    [1373846400000, 342691],
    [1374278400000, 115673],
    [1374710400000, 100233],
    [1375142400000, 135439],
    /* Aug 2013 */

    [1375315200000, 189573],
    [1375660800000, 199720],
    [1376092800000, 367315],
    [1376524800000, 191533],
    [1376956800000, 288057],
    [1377388800000, 120544],
    [1377820800000, 238616],
    /* Sep 2013 */

    [1377993600000, 336970],
    [1378339200000, 246719],
    [1378771200000, 220142],
    [1379203200000, 219414],
    [1379635200000, 157445],
    [1380067200000, 216317],
    [1380499200000, 288363],
    /* Oct 2013 */
    [1380585600000, 189573],
    [1380931200000, 199720],
    [1381363200000, 397315],
    [1381795200000, 191533],
    [1382227200000, 288057],
    [1382659200000, 150544],
    [1383091200000, 258616],
    /* Nov 2013 */

    [1383264000000, 356970],
    [1383609600000, 246719],
    [1384041600000, 250142],
    [1384473600000, 239414]
]);


var globalUnbundlingData2 = new Object([
    /* Jan 2012 */
    [1325376000000, 456],
    [1325721600000, 107],
    [1326153600000, 158],
    [1326585600000, 342],
    [1327017600000, 115],
    [1327449600000, 100],
    [1327881600000, 135],
    /* Feb 2012 */

    [1328054400000, 169],
    [1328400000000, 189],
    [1328832000000, 337],
    [1329264000000, 191],
    [1329696000000, 268],
    [1330128000000, 120],
    [1330387200000, 228],
    /* Mar 2012 */
    [1330560000000, 316],
    [1330905600000, 216],
    [1331337600000, 200],
    [1331769600000, 229],
    [1332201600000, 137],
    [1332633600000, 226],
    [1333065600000, 268],
    /* Apr 2012 */
    [1333238400000, 456],
    [1333584000000, 107],
    [1334016000000, 158],
    [1334448000000, 342],
    [1334880000000, 115],
    [1335312000000, 100],
    [1335744000000, 135],
    /* May 2012 */
    [1335830400000, 169],
    [1336176000000, 189],
    [1336608000000, 337],
    [1337040000000, 191],
    [1337472000000, 268],
    [1337904000000, 120],
    [1338336000000, 228],
    /* Jun 2012 */
    [1338508800000, 316],
    [1338854400000, 216],
    [1339286400000, 200],
    [1339718400000, 229],
    [1340150400000, 137],
    [1340582400000, 226],
    [1341014400000, 268],
    /* Jul 2012 */
    [1341100800000, 45],
    [1341446400000, 107],
    [1341878400000, 158],
    [1342310400000, 342],
    [1342742400000, 115],
    [1343174400000, 100],
    [1343606400000, 135],
    /* Aug 2012 */

    [1343779200000, 169],
    [1344124800000, 189],
    [1344556800000, 337],
    [1344988800000, 191],
    [1345420800000, 268],
    [1345852800000, 120],
    [1346284800000, 228],
    /* Sep 2012 */
    [1346457600000, 316],
    [1346803200000, 216],
    [1347235200000, 200],
    [1347667200000, 229],
    [1348099200000, 137],
    [1348531200000, 226],
    [1348963200000, 268],
    /* Oct 2012 */
    [1349049600000, 45],
    [1349395200000, 107],
    [1349827200000, 158],
    [1350259200000, 342],
    [1350691200000, 115],
    [1351123200000, 100],
    [1351555200000, 135],
    /* Nov 2012 */

    [1351728000000, 169],
    [1352073600000, 189],
    [1352505600000, 337],
    [1352937600000, 191],
    [1353369600000, 268],
    [1353801600000, 120],
    [1354233600000, 228],
    /* Dec 2012 */
    [1354320000000, 316],
    [1354665600000, 216],
    [1355097600000, 200],
    [1355529600000, 229],
    [1355961600000, 137],
    [1356393600000, 226],
    [1356825600000, 268],
    /* Jan 2013 */
    [1356998400000, 45],
    [1357344000000, 108],
    [1357776000000, 158],
    [1358208000000, 342],
    [1358640000000, 115],
    [1359072000000, 100],
    [1359504000000, 135],
    /* Feb 2013 */

    [1359676800000, 169],
    [1360022400000, 189],
    [1360454400000, 337],
    [1360886400000, 191],
    [1361318400000, 268],
    [1361750400000, 120],
    [1362009600000, 228],
    /* Mar 2013 */
    [1362096000000, 316],
    [1362441600000, 216],
    [1362873600000, 200],
    [1363305600000, 229],
    [1363737600000, 137],
    [1364169600000, 226],
    [1364601600000, 268],
    /* Apr 2013 */
    [1364774400000, 45],
    [1365120000000, 108],
    [1365552000000, 153],
    [1365984000000, 341],
    [1366416000000, 113],
    [1366848000000, 103],
    [1367280000000, 139],
    /* May 2013 */

    [1367366400000, 163],
    [1367712000000, 180],
    [1368144000000, 335],
    [1368576000000, 193],
    [1369008000000, 267],
    [1369440000000, 124],
    [1369872000000, 226],
    /* Jun 2013 */
    [1370044800000, 316],
    [1370390400000, 216],
    [1370822400000, 200],
    [1371254400000, 229],
    [1371686400000, 137],
    [1372118400000, 226],
    [1372550400000, 268],
    /* Jul 2013 */
    [1372636800000, 456],
    [1372982400000, 107],
    [1373414400000, 158],
    [1373846400000, 342],
    [1374278400000, 115],
    [1374710400000, 100],
    [1375142400000, 135],
    /* Aug 2013 */

    [1375315200000, 189],
    [1375660800000, 189],
    [1376092800000, 387],
    [1376524800000, 191],
    [1376956800000, 258],
    [1377388800000, 160],
    [1377820800000, 228],
    /* Sep 2013 */
    [1377993600000, 310],
    [1378339200000, 246],
    [1378771200000, 200],
    [1379203200000, 269],
    [1379635200000, 137],
    [1380067200000, 226],
    [1380499200000, 288],
    /* Oct 2013 */
    [1380585600000, 169],
    [1380931200000, 189],
    [1381363200000, 337],
    [1381795200000, 191],
    [1382227200000, 298],
    [1382659200000, 120],
    [1383091200000, 268],
    /* Nov 2013 */

    [1383264000000, 356],
    [1383609600000, 266],
    [1384041600000, 220],
    [1384473600000, 229]
]);
