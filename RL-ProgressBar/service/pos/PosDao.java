/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.operasolutions.rl.service.pos;

import com.google.inject.Inject;
import com.operasolutions.rl.common.DbConstants;
import com.operasolutions.rl.schema.tables.TDiagCodes;
import com.operasolutions.rl.schema.tables.TPhysAccountDetails;
import com.operasolutions.rl.schema.tables.TPhysChargeMasterLookup;
import com.operasolutions.rl.schema.tables.TPhysHcpcModifier;
import com.operasolutions.rl.schema.tables.TPhysHcpcPos;
import com.operasolutions.rl.schema.tables.TPhysHospDeptMapping;
import com.operasolutions.rl.schema.tables.TPhysMaster;
import com.operasolutions.rl.schema.tables.TPhysPredictions;
import com.operasolutions.rl.schema.tables.TSavePhysDiscoveredcode;
import com.operasolutions.rl.schema.tables.TSavePhysPossMissingcode;
import com.operasolutions.rl.schema.tables.TUbDiag;
import com.operasolutions.rl.schema.tables.records.TDiagCodesRecord;
import com.operasolutions.rl.schema.tables.records.TPhysPredictionsRecord;
import com.operasolutions.rl.schema.tables.records.TSavePhysDiscoveredcodeRecord;
import com.operasolutions.rl.schema.tables.records.TSavePhysPossMissingcodeRecord;
import com.operasolutions.rl.service.diagnose.DiagnoseResource.DiagnoseResult;
import com.operasolutions.rl.service.modifier.ModifierResource.ModifierResult;
import com.operasolutions.rl.service.physician.charges.PhysicianLookupChargeMasterResource.LookupChargeMasterResult;
import com.operasolutions.rl.service.physnpilookup.PhysicianLookupResource.TPhysMasterRepresentation;
import com.operasolutions.rl.service.pos.PosResource.PosResult;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.jooq.FactoryOperations;

/**
 *
 * @author nirmal.kumar
 */
public class PosDao {

    private final FactoryOperations create;

    @Inject
    public PosDao(FactoryOperations jooqFactory) {
        this.create = jooqFactory;
    }

    /**
     * All diagnoses
     *
     * @return List of diagnoses
     */
    public List<PosResult> getAllPos() {
        return create.selectDistinct(TPhysHcpcPos.T_PHYS_HCPC_POS.POS).from(TPhysHcpcPos.T_PHYS_HCPC_POS).orderBy(TPhysHcpcPos.T_PHYS_HCPC_POS.RANK).fetchInto(PosResult.class);
    }

    public Map<String, Object> getPhysModifierDaig(String hospitalId, String accountId, Integer predkey, Integer rowId, String hcpcCode) {
        List<TPhysMasterRepresentation> physicianList = getPhysicianAccountDetail(hospitalId, accountId);
        List<TPhysMasterRepresentation> billingPhysicianList = new ArrayList<TPhysMasterRepresentation>(0);
        List<TDiagCodesRecord> diagList = getAllDiagnosesForAccount(hospitalId, accountId);
        Set<String> daiSet = new HashSet<String>();
        Set<String> physicianSet = new HashSet<String>();
        Set<String> billPhysicianSet = new HashSet<String>();
        Map<String, Object> map = new HashMap<String, Object>();
        Set<String> modifierSet = new HashSet<String>();
        for (TPhysMasterRepresentation one : physicianList) {
            if (one.npi != null && !one.npi.equals("")) {
                physicianSet.add(one.npi);
                billPhysicianSet.add(one.npi);
            }
        }
        for (TDiagCodesRecord one : diagList) {
            daiSet.add(one.getCodeValue());
        }
        boolean isHcpc = true;
        if (hcpcCode != null && !hcpcCode.trim().equals("")) {
            List<LookupChargeMasterResult> chargeMasterResult = create.selectFrom(TPhysChargeMasterLookup.T_PHYS_CHARGE_MASTER_LOOKUP)
                    .where(TPhysChargeMasterLookup.T_PHYS_CHARGE_MASTER_LOOKUP.HOSPITAL_ID.eq(hospitalId),
                            TPhysChargeMasterLookup.T_PHYS_CHARGE_MASTER_LOOKUP.HCPC.eq(hcpcCode), TPhysChargeMasterLookup.T_PHYS_CHARGE_MASTER_LOOKUP.MODIFIER.isNotNull(), TPhysChargeMasterLookup.T_PHYS_CHARGE_MASTER_LOOKUP.MODIFIER.ne("")).fetchInto(LookupChargeMasterResult.class);
            for (LookupChargeMasterResult one : chargeMasterResult) {
                modifierSet.add(one.modifier);
            }
            isHcpc = false;
        }
        if (rowId != null) {
            TSavePhysDiscoveredcodeRecord record1 = create.selectFrom(TSavePhysDiscoveredcode.T_SAVE_PHYS_DISCOVEREDCODE).where(TSavePhysDiscoveredcode.T_SAVE_PHYS_DISCOVEREDCODE.ROW_ID.eq(rowId)).limit(1).fetchOne();
            if (record1 != null) {
                if (isHcpc) {
                    if (record1.getHcpcCode() != null && !record1.getHcpcCode().trim().equals("")) {
                        List<LookupChargeMasterResult> chargeMasterResult = create.selectFrom(TPhysChargeMasterLookup.T_PHYS_CHARGE_MASTER_LOOKUP)
                                .where(TPhysChargeMasterLookup.T_PHYS_CHARGE_MASTER_LOOKUP.HOSPITAL_ID.eq(hospitalId), TPhysChargeMasterLookup.T_PHYS_CHARGE_MASTER_LOOKUP.HCPC.eq(record1.getHcpcCode()), TPhysChargeMasterLookup.T_PHYS_CHARGE_MASTER_LOOKUP.MODIFIER.isNotNull(), TPhysChargeMasterLookup.T_PHYS_CHARGE_MASTER_LOOKUP.MODIFIER.ne("")).fetchInto(LookupChargeMasterResult.class);
                        for (LookupChargeMasterResult one : chargeMasterResult) {
                            modifierSet.add(one.modifier);
                        }
                    }
                }
                if (record1.getModifier() != null) {
                    String[] arr = record1.getModifier().split(DbConstants.COMMA);
                    modifierSet.addAll(Arrays.asList(arr));
                }
                if (record1.getNpi() != null && !record1.getNpi().equals("") && !physicianSet.contains(record1.getNpi())) {
                    physicianSet.add(record1.getNpi());
                }
                if (record1.getBillPhys() != null && !record1.getBillPhys().equals("") && !billPhysicianSet.contains(record1.getBillPhys())) {
                    billPhysicianSet.add(record1.getBillPhys());
                }
                if (record1.getDiag() != null) {
                    String[] arr = record1.getDiag().split(DbConstants.COMMA);
                    daiSet.addAll(Arrays.asList(arr));
                }
            }
        }
        if (predkey != null) {
            TSavePhysPossMissingcodeRecord record1 = create.selectFrom(TSavePhysPossMissingcode.T_SAVE_PHYS_POSS_MISSINGCODE).where(TSavePhysPossMissingcode.T_SAVE_PHYS_POSS_MISSINGCODE.PRED_KEY.eq(predkey)).limit(1).fetchOne();
            if (record1 != null) {
                if (isHcpc) {
                    if (record1.getHcpcCode() != null && !record1.getHcpcCode().trim().equals("")) {
                        List<LookupChargeMasterResult> chargeMasterResult = create.selectFrom(TPhysChargeMasterLookup.T_PHYS_CHARGE_MASTER_LOOKUP)
                                .where(TPhysChargeMasterLookup.T_PHYS_CHARGE_MASTER_LOOKUP.HOSPITAL_ID.eq(hospitalId), TPhysChargeMasterLookup.T_PHYS_CHARGE_MASTER_LOOKUP.HCPC.eq(record1.getHcpcCode()), TPhysChargeMasterLookup.T_PHYS_CHARGE_MASTER_LOOKUP.MODIFIER.isNotNull(), TPhysChargeMasterLookup.T_PHYS_CHARGE_MASTER_LOOKUP.MODIFIER.ne("")).fetchInto(LookupChargeMasterResult.class);
                        for (LookupChargeMasterResult one : chargeMasterResult) {
                            modifierSet.add(one.modifier);
                        }
                    }
                }
                if (record1.getModifier() != null && !record1.getModifier().trim().equals("")) {
                    String[] arr = record1.getModifier().split(DbConstants.COMMA);
                    modifierSet.addAll(Arrays.asList(arr));
                }
                if (record1.getNpi() != null && !record1.getNpi().equals("") && !physicianSet.contains(record1.getNpi())) {
                    physicianSet.add(record1.getNpi());
                }
                if (record1.getBillPhys() != null && !record1.getBillPhys().equals("") && !billPhysicianSet.contains(record1.getBillPhys())) {
                    billPhysicianSet.add(record1.getBillPhys());
                }
                if (record1.getDiag() != null) {
                    String[] arr = record1.getDiag().split(DbConstants.COMMA);
                    daiSet.addAll(Arrays.asList(arr));
                }
            } else {
                TPhysPredictionsRecord record = create.selectFrom(TPhysPredictions.T_PHYS_PREDICTIONS).where(TPhysPredictions.T_PHYS_PREDICTIONS.PRED_KEY.eq(predkey)).limit(1).fetchOne();
                if (record != null) {
                    if (isHcpc) {
                        if (record.getHcpcCode() != null && !record.getHcpcCode().trim().equals("")) {
                            List<LookupChargeMasterResult> chargeMasterResult = create.selectFrom(TPhysChargeMasterLookup.T_PHYS_CHARGE_MASTER_LOOKUP)
                                    .where(TPhysChargeMasterLookup.T_PHYS_CHARGE_MASTER_LOOKUP.HOSPITAL_ID.eq(hospitalId), TPhysChargeMasterLookup.T_PHYS_CHARGE_MASTER_LOOKUP.HCPC.eq(record.getHcpcCode()), TPhysChargeMasterLookup.T_PHYS_CHARGE_MASTER_LOOKUP.MODIFIER.isNotNull(), TPhysChargeMasterLookup.T_PHYS_CHARGE_MASTER_LOOKUP.MODIFIER.ne("")).fetchInto(LookupChargeMasterResult.class);
                            for (LookupChargeMasterResult one : chargeMasterResult) {
                                modifierSet.add(one.modifier);
                            }
                        }
                    }
                    if (record.getModifier() != null) {
                        String[] arr = record.getModifier().split(DbConstants.COMMA);
                        modifierSet.addAll(Arrays.asList(arr));
                    }
                    if (record.getNpi() != null && !record.getNpi().equals("") && !physicianSet.contains(record.getNpi())) {
                        physicianSet.add(record.getNpi());
                    }
                    if (record.getBillPhys() != null && !record.getBillPhys().equals("") && !billPhysicianSet.contains(record.getBillPhys())) {
                        billPhysicianSet.add(record.getBillPhys());
                    }
                    if (record.getDiag() != null) {
                        String[] arr = record.getDiag().split(DbConstants.COMMA);
                        daiSet.addAll(Arrays.asList(arr));
                    }
                }
            }
        }

        List<DiagnoseResult> diagCodeList = create.selectDistinct(TDiagCodes.T_DIAG_CODES.CODE_VALUE.as("diagCode"), TDiagCodes.T_DIAG_CODES.DESCRIPTION).from(TDiagCodes.T_DIAG_CODES).where(TDiagCodes.T_DIAG_CODES.CODE_VALUE.in(daiSet), TDiagCodes.T_DIAG_CODES.ICD10.isTrue()).fetchInto(DiagnoseResult.class);
        physicianList = create.selectDistinct(TPhysMaster.T_PHYS_MASTER.CODE, TPhysMaster.T_PHYS_MASTER.NAME, TPhysMaster.T_PHYS_MASTER.NPI, TPhysMaster.T_PHYS_MASTER.TYPE.as("physicianType"), TPhysMaster.T_PHYS_MASTER.TERMINATION_DATE, TPhysMaster.T_PHYS_MASTER.START_DATE, TPhysMaster.T_PHYS_MASTER.IS_EMPLOYED).from(TPhysMaster.T_PHYS_MASTER).where(TPhysMaster.T_PHYS_MASTER.HOSPITAL_ID.eq(hospitalId), TPhysMaster.T_PHYS_MASTER.NPI.in(physicianSet).or(TPhysMaster.T_PHYS_MASTER.CODE.in(physicianSet)), TPhysMaster.T_PHYS_MASTER.IS_EMPLOYED.isTrue()).fetchInto(TPhysMasterRepresentation.class);
        billingPhysicianList = create.selectDistinct(TPhysMaster.T_PHYS_MASTER.CODE, TPhysMaster.T_PHYS_MASTER.NAME, TPhysMaster.T_PHYS_MASTER.NPI, TPhysMaster.T_PHYS_MASTER.TYPE.as("physicianType"), TPhysMaster.T_PHYS_MASTER.TERMINATION_DATE, TPhysMaster.T_PHYS_MASTER.START_DATE, TPhysMaster.T_PHYS_MASTER.IS_EMPLOYED).from(TPhysMaster.T_PHYS_MASTER).where(TPhysMaster.T_PHYS_MASTER.HOSPITAL_ID.eq(hospitalId),TPhysMaster.T_PHYS_MASTER.NPI.in(billPhysicianSet).or(TPhysMaster.T_PHYS_MASTER.CODE.in(billPhysicianSet)), TPhysMaster.T_PHYS_MASTER.IS_EMPLOYED.isTrue()).fetchInto(TPhysMasterRepresentation.class);
        List<ModifierResult> listModifier = create.selectFrom(TPhysHcpcModifier.T_PHYS_HCPC_MODIFIER).where(TPhysHcpcModifier.T_PHYS_HCPC_MODIFIER.MODIFIER.in(modifierSet)).fetchInto(ModifierResult.class);
        map.put("diagCodeList", diagCodeList);
        map.put("physicianList", physicianList);
        map.put("billingPhysicianList", billingPhysicianList);
        map.put("listModifier", listModifier);
        return map;
    }

    public List<TPhysMasterRepresentation> getPhysicianAccountDetail(String hospitalId, String accountId) {
        if (hospitalId == null) {
            throw new IllegalArgumentException("Input parameter 'hospitalId' cannot be null.");
        }
        if (accountId == null) {
            throw new IllegalArgumentException("Input parameter 'accountId' cannot be null.");
        }
        return create.selectDistinct(TPhysAccountDetails.T_PHYS_ACCOUNT_DETAILS.CODE, TPhysAccountDetails.T_PHYS_ACCOUNT_DETAILS.NAME, TPhysAccountDetails.T_PHYS_ACCOUNT_DETAILS.PHYSICIAN_TYPE, TPhysAccountDetails.T_PHYS_ACCOUNT_DETAILS.NPI, TPhysMaster.T_PHYS_MASTER.START_DATE, TPhysMaster.T_PHYS_MASTER.TERMINATION_DATE, TPhysMaster.T_PHYS_MASTER.IS_EMPLOYED)
                .from(TPhysAccountDetails.T_PHYS_ACCOUNT_DETAILS)
                .leftOuterJoin(TPhysMaster.T_PHYS_MASTER).on(TPhysAccountDetails.T_PHYS_ACCOUNT_DETAILS.HOSPITAL_ID.eq(TPhysMaster.T_PHYS_MASTER.HOSPITAL_ID),TPhysAccountDetails.T_PHYS_ACCOUNT_DETAILS.CODE.eq(TPhysMaster.T_PHYS_MASTER.CODE), TPhysMaster.T_PHYS_MASTER.NPI.isNotNull(), TPhysMaster.T_PHYS_MASTER.NPI.ne(""), TPhysMaster.T_PHYS_MASTER.IS_EMPLOYED.isTrue())
                .where(TPhysAccountDetails.T_PHYS_ACCOUNT_DETAILS.HOSPITAL_ID.equal(hospitalId))
                .and(TPhysAccountDetails.T_PHYS_ACCOUNT_DETAILS.ACCOUNT_ID.equal(accountId))
                .fetchInto(TPhysMasterRepresentation.class);
    }

    /**
     * Diagnoses for a hospital and an account
     *
     * @param hospitalId
     * @param accountId
     * @return List of diagnoses
     */
    public List<TDiagCodesRecord> getAllDiagnosesForAccount(String hospitalId, String accountId) {
        if (hospitalId == null) {
            throw new IllegalArgumentException("Input parameter 'hospitalId' cannot be null.");
        }
        if (accountId == null) {
            throw new IllegalArgumentException("Input parameter 'accountId' cannot be null.");
        }

        return create.selectDistinct(TDiagCodes.T_DIAG_CODES.CODE_VALUE, TDiagCodes.T_DIAG_CODES.DESCRIPTION)
                .from(TDiagCodes.T_DIAG_CODES)
                .join(TUbDiag.T_UB_DIAG).on(TDiagCodes.T_DIAG_CODES.CODE_VALUE.equal(TUbDiag.T_UB_DIAG.DIAG_CODE))
                .where(TUbDiag.T_UB_DIAG.HOSPITAL_ID.equal(hospitalId)).and(TUbDiag.T_UB_DIAG.ACCOUNT_ID.equal(accountId))
                .fetchInto(TDiagCodesRecord.class);
    }

    public List<TPhysMasterRepresentation> getPhys(String hospitalId, String accountId, Integer predkey, Integer rowId, String hcpcCode) {
        List<TPhysMasterRepresentation> physicianList = getPhysicianAccountDetail(hospitalId, accountId);
        Set<String> physicianSet = new HashSet<String>();
        for (TPhysMasterRepresentation one : physicianList) {
            physicianSet.add(one.npi);
        }
        if (rowId != null) {
            TSavePhysDiscoveredcodeRecord record1 = create.selectFrom(TSavePhysDiscoveredcode.T_SAVE_PHYS_DISCOVEREDCODE).where(TSavePhysDiscoveredcode.T_SAVE_PHYS_DISCOVEREDCODE.ROW_ID.eq(rowId)).limit(1).fetchOne();
            if (record1 != null) {
                if (record1.getNpi() != null && !record1.getNpi().equals("") && !physicianSet.contains(record1.getNpi())) {
                    physicianSet.add(record1.getNpi());
                }
            }
        }
        if (predkey != null) {
            TSavePhysPossMissingcodeRecord record1 = create.selectFrom(TSavePhysPossMissingcode.T_SAVE_PHYS_POSS_MISSINGCODE).where(TSavePhysPossMissingcode.T_SAVE_PHYS_POSS_MISSINGCODE.PRED_KEY.eq(predkey)).limit(1).fetchOne();
            if (record1 != null) {
                if (record1.getNpi() != null && !record1.getNpi().equals("") && !physicianSet.contains(record1.getNpi())) {
                    physicianSet.add(record1.getNpi());
                }
            } else {
                TPhysPredictionsRecord record = create.selectFrom(TPhysPredictions.T_PHYS_PREDICTIONS).where(TPhysPredictions.T_PHYS_PREDICTIONS.PRED_KEY.eq(predkey)).limit(1).fetchOne();
                if (record != null) {
                    if (record.getNpi() != null && !record.getNpi().equals("") && !physicianSet.contains(record.getNpi())) {
                        physicianSet.add(record.getNpi());
                    }
                }
            }
        }
        physicianList = create.selectDistinct(TPhysMaster.T_PHYS_MASTER.CODE, TPhysMaster.T_PHYS_MASTER.NAME, TPhysMaster.T_PHYS_MASTER.NPI, TPhysMaster.T_PHYS_MASTER.TYPE.as("physicianType"), TPhysMaster.T_PHYS_MASTER.TERMINATION_DATE, TPhysMaster.T_PHYS_MASTER.START_DATE, TPhysMaster.T_PHYS_MASTER.IS_EMPLOYED).from(TPhysMaster.T_PHYS_MASTER).where(TPhysMaster.T_PHYS_MASTER.HOSPITAL_ID.eq(hospitalId),TPhysMaster.T_PHYS_MASTER.NPI.in(physicianSet).or(TPhysMaster.T_PHYS_MASTER.CODE.in(physicianSet)), TPhysMaster.T_PHYS_MASTER.IS_EMPLOYED.isTrue()).fetchInto(TPhysMasterRepresentation.class);
        return physicianList;
    }

    public List<ModifierResult> getModifier(String hospitalId, String accountId, Integer predkey, Integer rowId, String hcpcCode) {
        Set<String> modifierSet = new HashSet<String>();
        boolean isHcpc = true;
        if (hcpcCode != null && !hcpcCode.trim().equals("")) {
            List<LookupChargeMasterResult> chargeMasterResult = create.selectFrom(TPhysChargeMasterLookup.T_PHYS_CHARGE_MASTER_LOOKUP)
                    .where(TPhysChargeMasterLookup.T_PHYS_CHARGE_MASTER_LOOKUP.HOSPITAL_ID.eq(hospitalId),
                            TPhysChargeMasterLookup.T_PHYS_CHARGE_MASTER_LOOKUP.HCPC.eq(hcpcCode), TPhysChargeMasterLookup.T_PHYS_CHARGE_MASTER_LOOKUP.MODIFIER.isNotNull(), TPhysChargeMasterLookup.T_PHYS_CHARGE_MASTER_LOOKUP.MODIFIER.ne("")).fetchInto(LookupChargeMasterResult.class);
            for (LookupChargeMasterResult one : chargeMasterResult) {
                modifierSet.add(one.modifier);
            }
            isHcpc = false;
        }
        if (rowId != null) {
            TSavePhysDiscoveredcodeRecord record1 = create.selectFrom(TSavePhysDiscoveredcode.T_SAVE_PHYS_DISCOVEREDCODE).where(TSavePhysDiscoveredcode.T_SAVE_PHYS_DISCOVEREDCODE.ROW_ID.eq(rowId)).limit(1).fetchOne();
            if (record1 != null) {
                if (isHcpc) {
                    if (record1.getHcpcCode() != null && !record1.getHcpcCode().trim().equals("")) {
                        List<LookupChargeMasterResult> chargeMasterResult = create.selectFrom(TPhysChargeMasterLookup.T_PHYS_CHARGE_MASTER_LOOKUP)
                                .where(TPhysChargeMasterLookup.T_PHYS_CHARGE_MASTER_LOOKUP.HOSPITAL_ID.eq(hospitalId), TPhysChargeMasterLookup.T_PHYS_CHARGE_MASTER_LOOKUP.HCPC.eq(record1.getHcpcCode()), TPhysChargeMasterLookup.T_PHYS_CHARGE_MASTER_LOOKUP.MODIFIER.isNotNull(), TPhysChargeMasterLookup.T_PHYS_CHARGE_MASTER_LOOKUP.MODIFIER.ne("")).fetchInto(LookupChargeMasterResult.class);
                        for (LookupChargeMasterResult one : chargeMasterResult) {
                            modifierSet.add(one.modifier);
                        }
                    }
                }
                if (record1.getModifier() != null) {
                    String[] arr = record1.getModifier().split(DbConstants.COMMA);
                    modifierSet.addAll(Arrays.asList(arr));
                }
            }
        }
        if (predkey != null) {
            TSavePhysPossMissingcodeRecord record1 = create.selectFrom(TSavePhysPossMissingcode.T_SAVE_PHYS_POSS_MISSINGCODE).where(TSavePhysPossMissingcode.T_SAVE_PHYS_POSS_MISSINGCODE.PRED_KEY.eq(predkey)).limit(1).fetchOne();
            if (record1 != null) {
                if (isHcpc) {
                    if (record1.getHcpcCode() != null && !record1.getHcpcCode().trim().equals("")) {
                        List<LookupChargeMasterResult> chargeMasterResult = create.selectFrom(TPhysChargeMasterLookup.T_PHYS_CHARGE_MASTER_LOOKUP)
                                .where(TPhysChargeMasterLookup.T_PHYS_CHARGE_MASTER_LOOKUP.HOSPITAL_ID.eq(hospitalId), TPhysChargeMasterLookup.T_PHYS_CHARGE_MASTER_LOOKUP.HCPC.eq(record1.getHcpcCode()), TPhysChargeMasterLookup.T_PHYS_CHARGE_MASTER_LOOKUP.MODIFIER.isNotNull(), TPhysChargeMasterLookup.T_PHYS_CHARGE_MASTER_LOOKUP.MODIFIER.ne("")).fetchInto(LookupChargeMasterResult.class);
                        for (LookupChargeMasterResult one : chargeMasterResult) {
                            modifierSet.add(one.modifier);
                        }
                    }
                }
                if (record1.getModifier() != null && !record1.getModifier().trim().equals("")) {
                    String[] arr = record1.getModifier().split(DbConstants.COMMA);
                    modifierSet.addAll(Arrays.asList(arr));
                }

            } else {
                TPhysPredictionsRecord record = create.selectFrom(TPhysPredictions.T_PHYS_PREDICTIONS).where(TPhysPredictions.T_PHYS_PREDICTIONS.PRED_KEY.eq(predkey)).limit(1).fetchOne();
                if (record != null) {
                    if (isHcpc) {
                        if (record.getHcpcCode() != null && !record.getHcpcCode().trim().equals("")) {
                            List<LookupChargeMasterResult> chargeMasterResult = create.selectFrom(TPhysChargeMasterLookup.T_PHYS_CHARGE_MASTER_LOOKUP)
                                    .where(TPhysChargeMasterLookup.T_PHYS_CHARGE_MASTER_LOOKUP.HOSPITAL_ID.eq(hospitalId), TPhysChargeMasterLookup.T_PHYS_CHARGE_MASTER_LOOKUP.HCPC.eq(record.getHcpcCode()), TPhysChargeMasterLookup.T_PHYS_CHARGE_MASTER_LOOKUP.MODIFIER.isNotNull(), TPhysChargeMasterLookup.T_PHYS_CHARGE_MASTER_LOOKUP.MODIFIER.ne("")).fetchInto(LookupChargeMasterResult.class);
                            for (LookupChargeMasterResult one : chargeMasterResult) {
                                modifierSet.add(one.modifier);
                            }
                        }
                    }
                    if (record.getModifier() != null) {
                        String[] arr = record.getModifier().split(DbConstants.COMMA);
                        modifierSet.addAll(Arrays.asList(arr));
                    }
                }
            }
        }
        List<ModifierResult> listModifier = create.selectFrom(TPhysHcpcModifier.T_PHYS_HCPC_MODIFIER).where(TPhysHcpcModifier.T_PHYS_HCPC_MODIFIER.MODIFIER.in(modifierSet)).fetchInto(ModifierResult.class);
        return listModifier;
    }

    public List<DiagnoseResult> getDaig(String hospitalId, String accountId, Integer predkey, Integer rowId, String hcpcCode) {

        List<TDiagCodesRecord> diagList = getAllDiagnosesForAccount(hospitalId, accountId);
        Set<String> daiSet = new HashSet<String>();
        for (TDiagCodesRecord one : diagList) {
            daiSet.add(one.getCodeValue());
        }
        if (rowId != null) {
            TSavePhysDiscoveredcodeRecord record1 = create.selectFrom(TSavePhysDiscoveredcode.T_SAVE_PHYS_DISCOVEREDCODE).where(TSavePhysDiscoveredcode.T_SAVE_PHYS_DISCOVEREDCODE.ROW_ID.eq(rowId)).limit(1).fetchOne();
            if (record1 != null) {
                if (record1.getDiag() != null) {
                    String[] arr = record1.getDiag().split(DbConstants.COMMA);
                    daiSet.addAll(Arrays.asList(arr));
                }
            }
        }
        if (predkey != null) {
            TSavePhysPossMissingcodeRecord record1 = create.selectFrom(TSavePhysPossMissingcode.T_SAVE_PHYS_POSS_MISSINGCODE).where(TSavePhysPossMissingcode.T_SAVE_PHYS_POSS_MISSINGCODE.PRED_KEY.eq(predkey)).limit(1).fetchOne();
            if (record1 != null) {
                if (record1.getDiag() != null) {
                    String[] arr = record1.getDiag().split(DbConstants.COMMA);
                    daiSet.addAll(Arrays.asList(arr));
                }
            } else {
                TPhysPredictionsRecord record = create.selectFrom(TPhysPredictions.T_PHYS_PREDICTIONS).where(TPhysPredictions.T_PHYS_PREDICTIONS.PRED_KEY.eq(predkey)).limit(1).fetchOne();
                if (record != null) {
                    if (record.getDiag() != null) {
                        String[] arr = record.getDiag().split(DbConstants.COMMA);
                        daiSet.addAll(Arrays.asList(arr));
                    }
                }
            }
        }
        List<DiagnoseResult> diagCodeList = create.selectDistinct(TDiagCodes.T_DIAG_CODES.CODE_VALUE.as("diagCode"), TDiagCodes.T_DIAG_CODES.DESCRIPTION).from(TDiagCodes.T_DIAG_CODES).where(TDiagCodes.T_DIAG_CODES.CODE_VALUE.in(daiSet), TDiagCodes.T_DIAG_CODES.ICD10.isTrue()).fetchInto(DiagnoseResult.class);
        return diagCodeList;
    }

    public List<PosResource.Dept> getDept(String hospitalId) {
        return create.selectDistinct(TPhysHospDeptMapping.T_PHYS_HOSP_DEPT_MAPPING.DEPT, TPhysHospDeptMapping.T_PHYS_HOSP_DEPT_MAPPING.DEPT_DESC)
                .from(TPhysHospDeptMapping.T_PHYS_HOSP_DEPT_MAPPING).where(TPhysHospDeptMapping.T_PHYS_HOSP_DEPT_MAPPING.HOSPITAL_ID.eq(hospitalId)).orderBy(TPhysHospDeptMapping.T_PHYS_HOSP_DEPT_MAPPING.RANK).limit(1000).fetchInto(PosResource.Dept.class);

    }

}
