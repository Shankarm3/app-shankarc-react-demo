/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.operasolutions.rl.service.physician;

import com.google.inject.Inject;
import com.operasolutions.rl.auth.AuthUtils;
import com.operasolutions.rl.common.ActivityLogUtils;
import com.operasolutions.rl.common.DbConstants;
import com.operasolutions.rl.common.DbUtils;
import com.operasolutions.rl.schema.enums.TUserRole;
import com.operasolutions.rl.schema.tables.TDiagCodes;
import com.operasolutions.rl.schema.tables.THcpcCodes;
import com.operasolutions.rl.schema.tables.TPhysConfigAccountFields;
import com.operasolutions.rl.schema.tables.TProcCodes;
import com.operasolutions.rl.schema.tables.TUbDiag;
import com.operasolutions.rl.schema.tables.TUbHcpc;
import com.operasolutions.rl.schema.tables.TUbProc;
import com.operasolutions.rl.schema.tables.records.TDiagCodesRecord;
import com.operasolutions.rl.schema.tables.records.THcpcCodesRecord;
import com.operasolutions.rl.schema.tables.records.TPhysConfigAccountFieldsRecord;
import com.operasolutions.rl.schema.tables.records.TProcCodesRecord;
import java.sql.ResultSet;
import java.sql.Timestamp;
import java.text.ParseException;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.apache.shiro.SecurityUtils;
import org.jooq.FactoryOperations;
import org.jooq.SelectQuery;
import org.jooq.impl.Factory;

/**
 *
 * @author nirmal.kumar
 */
public class PhysicianAccountViewDao {

    private final FactoryOperations create;

    protected ActivityLogUtils activityLogUtils;

    @Inject
    public PhysicianAccountViewDao(FactoryOperations jooqFactory, ActivityLogUtils activityLogUtils) {
        this.create = jooqFactory;
        this.activityLogUtils = activityLogUtils;
    }

    public List<PhysicianAccountViewResource.PhysicianAccountRepresentation> getAccountsConfig(String hospitalId, String userId, Boolean all, List<String> auditorList, String viewType, String costCenter, String uriCharges) {
        if (hospitalId == null) {
            throw new IllegalArgumentException("Input parameter 'hospitalId' cannot be null.");
        }
        if (userId == null) {
            throw new IllegalArgumentException("Input parameter 'userId' cannot be null.");
        }
        if (all == null) {
            throw new IllegalArgumentException("Input parameter 'all' cannot be null.");
        }

        TPhysConfigAccountFieldsRecord record = getQueryDetail(viewType, (byte) 0);
        String fromQuery = record.getFromQuery();
        if (hospitalId.equalsIgnoreCase(DbConstants.OVER_ALL)) {
            if (SecurityUtils.getSubject().hasRole(TUserRole.PHYSICIAN_RPT_USER.getUType())) {
                fromQuery = fromQuery.replaceAll("#HOSPITAL_ID#", " T_PHYS_PREDICTIONS.HOSPITAL_ID IN (SELECT HOSPITAL_ID FROM T_PHYS_REPORTING_ASSIGNMENT WHERE T_PHYS_REPORTING_ASSIGNMENT.USER_ID =  '" + AuthUtils.getLoggedUserName() + "') AND ");
            } else {
                fromQuery = fromQuery.replaceAll("#HOSPITAL_ID#", " ");
            }
        } else {
            fromQuery = fromQuery.replaceAll("#HOSPITAL_ID#", " T_PHYS_PREDICTIONS.HOSPITAL_ID = '" + hospitalId + "' AND ");
        }
        if (costCenter.equalsIgnoreCase(DbConstants.OVER_ALL)) {
            fromQuery = fromQuery.replaceAll("#COST_CENTER#", " ");
        } else {
            fromQuery = fromQuery.replaceAll("#COST_CENTER#", " T_PHYS_PREDICTIONS.COST_CENTER = '" + costCenter + "' AND ");
        }
        fromQuery = fromQuery.replaceAll("#USER_ID#", userId);
        if (all == Boolean.TRUE && (auditorList != null && auditorList.size() > 0)) {
            fromQuery = fromQuery.replaceAll("#USER_LIST#", DbUtils.arrayListToSqlString(auditorList));
        }
        String fieldArray[] = record.getSelectQuery().split("#");
        SelectQuery query = create.selectQuery();
        query.setDistinct(true);
        for (String fieldArray1 : fieldArray) {
            String[] arry = fieldArray1.split(" as ");
            if (arry.length == 2) {
                query.addSelect(Factory.field(arry[0]).as(arry[1].trim()));
            }
        }
        query.addSelect(Factory.field("REPLACE(REPLACE('" + uriCharges + "','hospitalId',T_PATIENT.HOSPITAL_ID),'accountId',T_PATIENT.ACCOUNT_ID)").as("uriCharges"));
        query.addFrom(Factory.table(fromQuery));
        query.addGroupBy(Factory.field(record.getGroupBy()));
        query.addOrderBy(Factory.field(record.getOrderBy()));
        return query.fetch().into(PhysicianAccountViewResource.PhysicianAccountRepresentation.class);
    }

    public ResultSet getAccountsConfigResult(String hospitalId, String userId, Boolean all, List<String> auditorList, String viewType, String costCenter) {
        if (hospitalId == null) {
            throw new IllegalArgumentException("Input parameter 'hospitalId' cannot be null.");
        }
        if (userId == null) {
            throw new IllegalArgumentException("Input parameter 'userId' cannot be null.");
        }
        if (all == null) {
            throw new IllegalArgumentException("Input parameter 'all' cannot be null.");
        }

        TPhysConfigAccountFieldsRecord record = getQueryDetail(viewType, (byte) 0);
        String fromQuery = record.getFromQuery();
        if (hospitalId.equalsIgnoreCase(DbConstants.OVER_ALL)) {
            if (SecurityUtils.getSubject().hasRole(TUserRole.PHYSICIAN_RPT_USER.getUType())) {
                fromQuery = fromQuery.replaceAll("#HOSPITAL_ID#", " A.HOSPITAL_ID IN (SELECT HOSPITAL_ID FROM T_PHYS_REPORTING_ASSIGNMENT WHERE T_PHYS_REPORTING_ASSIGNMENT.USER_ID =  '" + AuthUtils.getLoggedUserName() + "') AND ");
            } else {
                fromQuery = fromQuery.replaceAll("#HOSPITAL_ID#", " ");
            }
        } else {
            fromQuery = fromQuery.replaceAll("#HOSPITAL_ID#", " A.HOSPITAL_ID = '" + hospitalId + "' AND ");
        }
        if (costCenter.equalsIgnoreCase(DbConstants.OVER_ALL)) {
            fromQuery = fromQuery.replaceAll("#COST_CENTER#", " ");
        } else {
            fromQuery = fromQuery.replaceAll("#COST_CENTER#", " A.COST_CENTER = '" + costCenter + "' AND ");
        }
        fromQuery = fromQuery.replaceAll("#USER_ID#", userId);
        if (all == Boolean.TRUE && (auditorList != null && auditorList.size() > 0)) {
            fromQuery = fromQuery.replaceAll("#USER_LIST#", DbUtils.arrayListToSqlString(auditorList));
        }
        SelectQuery query = create.selectQuery();
        query.setDistinct(true);
        query.addSelect(Factory.field(record.getSelectQuery()));
        query.addFrom(Factory.table(fromQuery));
        query.addGroupBy(Factory.field(record.getGroupBy()));
        query.addOrderBy(Factory.field(record.getOrderBy()));
        return query.fetchResultSet();
    }

    public List<PhysicianAccountViewResource.PhysicianAccountRepresentation> getAccountsSubmitted(String hospitalId, String userId, Boolean all, List<String> auditorList, String viewType, String uriCharges) {
        if (hospitalId == null) {
            throw new IllegalArgumentException("Input parameter 'hospitalId' cannot be null.");
        }
        if (userId == null) {
            throw new IllegalArgumentException("Input parameter 'userId' cannot be null.");
        }
        if (all == null) {
            throw new IllegalArgumentException("Input parameter 'all' cannot be null.");
        }
        Timestamp cuurntTime = null;
        try {
            cuurntTime = activityLogUtils.getCuurentDateTimeStamp(userId);
        } catch (ParseException ex) {
            Logger.getLogger(PhysicianAccountViewDao.class.getName()).log(Level.SEVERE, null, ex);
        }
        TPhysConfigAccountFieldsRecord record = getQueryDetail(viewType, (byte) 1);
        String fromQuery = record.getFromQuery();
        fromQuery = fromQuery.replaceAll("#HOSPITAL_ID#", hospitalId);
        fromQuery = fromQuery.replaceAll("#USER_ID#", userId);
        fromQuery = fromQuery.replaceAll("#CEN_AUDITING_TIME#", cuurntTime.toString());
        if (all == Boolean.TRUE && (auditorList != null && auditorList.size() > 0)) {
            fromQuery = fromQuery.replaceAll("#USER_LIST#", DbUtils.arrayListToSqlString(auditorList));
        }
        String fieldArray[] = record.getSelectQuery().split("#");
        SelectQuery query = create.selectQuery();
        query.setDistinct(true);
        for (String fieldArray1 : fieldArray) {
            String[] arry = fieldArray1.split(" as ");
            if (arry.length == 2) {
                query.addSelect(Factory.field(arry[0]).as(arry[1].trim()));
            }
        }
        query.addSelect(Factory.field("REPLACE(REPLACE('" + uriCharges + "','hospitalId',T_PATIENT.HOSPITAL_ID),'accountId',T_PATIENT.ACCOUNT_ID)").as("uriCharges"));
        query.addFrom(Factory.table(fromQuery));
        query.addGroupBy(Factory.field(record.getGroupBy()));
        query.addOrderBy(Factory.field(record.getOrderBy()));
        return query.fetch().into(PhysicianAccountViewResource.PhysicianAccountRepresentation.class);
    }

    public TPhysConfigAccountFieldsRecord getQueryDetail(String viewType, byte isSubmitted) {
        String currentRoleId = "";
        if (SecurityUtils.getSubject().hasRole(TUserRole.PHYSICIAN_ADMIN.getUType())) {
            currentRoleId = TUserRole.PHYSICIAN_ADMIN.getUType();
        } else if (SecurityUtils.getSubject().hasRole(TUserRole.PHYSICIAN_SUPERVISOR.getUType())) {
            currentRoleId = TUserRole.PHYSICIAN_SUPERVISOR.getUType();
        } else if (SecurityUtils.getSubject().hasRole(TUserRole.PHYSICIAN_AUDITOR.getUType())) {
            currentRoleId = TUserRole.PHYSICIAN_AUDITOR.getUType();
        } else if (SecurityUtils.getSubject().hasRole(TUserRole.PHYSICIAN_RPT_USER.getUType())) {
            currentRoleId = TUserRole.PHYSICIAN_SUPERVISOR.getUType();
        }
        if (currentRoleId.equals(DbConstants.BLANK)) {
            currentRoleId = TUserRole.PHYSICIAN_SUPERVISOR.getUType();
        }

        return create.selectFrom(TPhysConfigAccountFields.T_PHYS_CONFIG_ACCOUNT_FIELDS)
                .where(TPhysConfigAccountFields.T_PHYS_CONFIG_ACCOUNT_FIELDS.VIEW_TYPE.eq(viewType)
                        .and(TPhysConfigAccountFields.T_PHYS_CONFIG_ACCOUNT_FIELDS.USER_ROLE.eq(currentRoleId))
                        .and(TPhysConfigAccountFields.T_PHYS_CONFIG_ACCOUNT_FIELDS.IS_SUBMITTED.eq(isSubmitted)))
                .fetchOne();
    }

    /**
     * Procedures for a hospital and an account
     *
     * @param hospitalId
     * @param accountId
     * @return List of procedures
     */
    public List<TProcCodesRecord> getAllProceduresForAccount(String hospitalId, String accountId) {
        if (hospitalId == null) {
            throw new IllegalArgumentException("Input parameter 'hospitalId' cannot be null.");
        }
        if (accountId == null) {
            throw new IllegalArgumentException("Input parameter 'accountId' cannot be null.");
        }
        return create.selectDistinct(TProcCodes.T_PROC_CODES.CODE_VALUE, TProcCodes.T_PROC_CODES.DESCRIPTION)
                .from(TProcCodes.T_PROC_CODES)
                .join(TUbProc.T_UB_PROC).on(TProcCodes.T_PROC_CODES.CODE_VALUE.equal(TUbProc.T_UB_PROC.PROC_CODE))
                .where(TUbProc.T_UB_PROC.HOSPITAL_ID.equal(hospitalId)).and(TUbProc.T_UB_PROC.ACCOUNT_ID.equal(accountId))
                //.join(nested).on(nested.getField(TUbProc.T_UB_PROC.HOSPITAL_ID).equal(TUbProc.T_UB_PROC.HOSPITAL_ID), nested.getField(TUbProc.T_UB_PROC.ACCOUNT_ID).equal(TUbProc.T_UB_PROC.ACCOUNT_ID), nested.getField(TUbProc.T_UB_PROC.ORIG_FILE_NAME_DATE.as("max_date")).equal(TUbProc.T_UB_PROC.ORIG_FILE_NAME_DATE))
                .fetchInto(TProcCodesRecord.class);
    }

    /**
     * Hcpcs for a hospital and an account
     *
     * @param hospitalId
     * @param accountId
     * @return List of hcpc codes
     */
    public List<THcpcCodesRecord> getAllHcpcsForAccount(String hospitalId, String accountId) {
        if (hospitalId == null) {
            throw new IllegalArgumentException("Input parameter 'hospitalId' cannot be null.");
        }
        if (accountId == null) {
            throw new IllegalArgumentException("Input parameter 'accountId' cannot be null.");
        }

        return create.selectDistinct(THcpcCodes.T_HCPC_CODES.CODE_VALUE, THcpcCodes.T_HCPC_CODES.DESCRIPTION)
                .from(THcpcCodes.T_HCPC_CODES)
                .join(TUbHcpc.T_UB_HCPC).on(THcpcCodes.T_HCPC_CODES.CODE_VALUE.equal(TUbHcpc.T_UB_HCPC.HCPC_CODE))
                .where(TUbHcpc.T_UB_HCPC.HOSPITAL_ID.equal(hospitalId)).and(TUbHcpc.T_UB_HCPC.ACCOUNT_ID.equal(accountId))
                //.join(nested).on(nested.getField(TUbHcpc.T_UB_HCPC.HOSPITAL_ID).equal(TUbHcpc.T_UB_HCPC.HOSPITAL_ID), nested.getField(TUbHcpc.T_UB_HCPC.ACCOUNT_ID).equal(TUbHcpc.T_UB_HCPC.ACCOUNT_ID), nested.getField(TUbHcpc.T_UB_HCPC.ORIG_FILE_NAME_DATE.as("max_date")).equal(TUbHcpc.T_UB_HCPC.ORIG_FILE_NAME_DATE))
                .fetchInto(THcpcCodesRecord.class);
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
                //.join(nested).on(nested.getField(TUbDiag.T_UB_DIAG.HOSPITAL_ID).equal(TUbDiag.T_UB_DIAG.HOSPITAL_ID), nested.getField(TUbDiag.T_UB_DIAG.ACCOUNT_ID).equal(TUbDiag.T_UB_DIAG.ACCOUNT_ID), nested.getField(TUbDiag.T_UB_DIAG.ORIG_FILE_NAME_DATE.as("max_date")).equal(TUbDiag.T_UB_DIAG.ORIG_FILE_NAME_DATE))
                .fetchInto(TDiagCodesRecord.class);
    }
}
