/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.operasolutions.rl.service.physician.confirmed.search;

import com.google.inject.Inject;
import com.operasolutions.rl.common.DbConstants;
import com.operasolutions.rl.common.DbUtils;
import com.operasolutions.rl.schema.enums.TUserRole;
import com.operasolutions.rl.schema.tables.TPhysConfigReports;
import com.operasolutions.rl.schema.tables.THospital;
import com.operasolutions.rl.schema.tables.TTypeLookup;
import com.operasolutions.rl.schema.tables.records.TPhysConfigReportsRecord;
import com.operasolutions.rl.service.physician.confirmed.search.GlobalAccountSearchResource.GlobalSearchRepresentation;
import java.util.List;
import java.util.Map;
import org.apache.shiro.SecurityUtils;
import org.jooq.FactoryOperations;
import org.jooq.SelectQuery;
import org.jooq.impl.Factory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *
 * @author nirmal.kumar
 */
public class GlobalAccountSearchDao {

    private final FactoryOperations create;
    protected static final Logger log = LoggerFactory.getLogger(GlobalAccountSearchDao.class);

    @Inject
    public GlobalAccountSearchDao(FactoryOperations jooqFactory) {
        this.create = jooqFactory;
    }

    public List<GlobalSearchRepresentation> getGlobalSearchAccountById(String coIdAcctId, String uriCharges) {
        if (coIdAcctId == null) {
            throw new IllegalArgumentException("Input parameter 'coIdAcctId' cannot be null.");
        }

        TPhysConfigReportsRecord record = getQueryDetail(DbConstants.PHYS_GLOBAL_SEARCH_BY_ACCOUNT);
        String fromQuery = record.getFromQuery();
        String fieldArray[] = record.getSelectQuery().split("#");
        SelectQuery query = create.selectQuery();
        query.setDistinct(true);
        for (String fieldArray1 : fieldArray) {
            String[] arry = fieldArray1.split(" as ");
            if (arry.length == 2) {
                query.addSelect(Factory.field(arry[0]).as(arry[1].trim()));
            }
        }
        query.addSelect(Factory.field("REPLACE(REPLACE('" + uriCharges + "','HOSPITAL_ID',A.HOSPITAL_ID),'ACCOUNT_ID',A.ACCOUNT_ID)").as("uriCharges"));
        query.addFrom(Factory.table(fromQuery));
        query.addConditions(Factory.field("A.ACCOUNT_ID").eq(coIdAcctId).or(Factory.field("A.PATIENT_ID").eq(coIdAcctId)).or(Factory.field("CONCAT(A.HOSPITAL_ID,':',A.ACCOUNT_ID)").eq(coIdAcctId).or(Factory.field("CONCAT(A.HOSPITAL_ID,':',A.PATIENT_ID)").eq(coIdAcctId))));
        query.addGroupBy(Factory.field(record.getGroupBy()));
        query.addOrderBy(Factory.inline(record.getOrderBy()));
        query.addLimit(record.getQueryLimit());
        return query.fetch().into(GlobalSearchRepresentation.class);
    }

    public List<GlobalSearchRepresentation> getGlobalSearchAccountByFilter(GlobalAccountSearchResource.MyInput params, String uriCharges) {

        TPhysConfigReportsRecord record = getQueryDetail(DbConstants.PHYS_GLOBAL_SEARCH_BY_ACCOUNT);
        String fromQuery = record.getFromQuery();
        String fieldArray[] = record.getSelectQuery().split("#");
        SelectQuery query = create.selectQuery();
        query.setDistinct(true);
        for (String fieldArray1 : fieldArray) {
            String[] arry = fieldArray1.split(" as ");
            if (arry.length == 2) {
                query.addSelect(Factory.field(arry[0]).as(arry[1].trim()));
            }
        }
        query.addSelect(Factory.field("REPLACE(REPLACE('" + uriCharges + "','HOSPITAL_ID',A.HOSPITAL_ID),'ACCOUNT_ID',A.ACCOUNT_ID)").as("uriCharges"));
        query.addFrom(Factory.table(fromQuery));
        if (!params.hospitalId.isEmpty()) {
            query.addConditions(Factory.condition(DbUtils.arrayListToSqlString(params.hospitalId, "A.HOSPITAL_ID")));
        }
        if (!params.patType.isEmpty()) {
            query.addConditions(Factory.condition(DbUtils.arrayListToSqlString(params.patType, "A.PATIENT_TYPE")));
        }
        if (!params.patSubType.isEmpty()) {
            query.addConditions(Factory.condition(DbUtils.arrayListToSqlString(params.patSubType, "A.PATIENT_SUBTYPE")));
        }
        if (!params.admitStartDate.equals("") && !params.admitEndDate.equals("")) {
            query.addConditions(Factory.field("A.ADMIT_DATE").between(params.admitStartDate, params.admitEndDate));
        } else if (!params.admitStartDate.equals("")) {
            query.addConditions(Factory.field("A.ADMIT_DATE").ge(params.admitStartDate));
        } else if (!params.admitEndDate.equals("")) {
            query.addConditions(Factory.field("A.ADMIT_DATE").le(params.admitEndDate));
        }
        if (!params.dischargeStartDate.equals("") && !params.dischargeEndDate.equals("")) {
            query.addConditions(Factory.field("A.DISCHARGE_DATE").between(params.dischargeStartDate, params.dischargeEndDate));
        } else if (!params.dischargeStartDate.equals("")) {
            query.addConditions(Factory.field("A.DISCHARGE_DATE").ge(params.dischargeStartDate));
        } else if (!params.dischargeEndDate.equals("")) {
            query.addConditions(Factory.field("A.DISCHARGE_DATE").le(params.dischargeEndDate));
        }
        if (params.unBilledAccounts.equals("Y")) {
            query.addConditions(Factory.condition(" (A.TRANSFER_DATE IS NULL OR A.TRANSFER_DATE='0000-00-00') "));
        } else if (!params.transferStartDate.equals("") && !params.transferEndDate.equals("")) {
            query.addConditions(Factory.field("A.TRANSFER_DATE").between(params.transferStartDate, params.transferEndDate));
        } else if (!params.transferStartDate.equals("")) {
            query.addConditions(Factory.field("A.TRANSFER_DATE").ge(params.transferStartDate));
        } else if (!params.transferEndDate.equals("")) {
            query.addConditions(Factory.field("A.TRANSFER_DATE").le(params.transferEndDate));
        }
        query.addGroupBy(Factory.field(record.getGroupBy()));
        query.addOrderBy(Factory.inline(record.getOrderBy()));
        query.addLimit(record.getQueryLimit());
        return query.fetch().into(GlobalSearchRepresentation.class);
    }

    public Map<String, String> getLookupType(String type) {
        return create.selectDistinct(TTypeLookup.T_TYPE_LOOKUP.VALUE, TTypeLookup.T_TYPE_LOOKUP.DESCRIPTION)
                .from(TTypeLookup.T_TYPE_LOOKUP).where(TTypeLookup.T_TYPE_LOOKUP.LOOKUP_TYPE.eq(type))
                .groupBy(TTypeLookup.T_TYPE_LOOKUP.VALUE)
                .fetchMap(TTypeLookup.T_TYPE_LOOKUP.VALUE, TTypeLookup.T_TYPE_LOOKUP.DESCRIPTION);
    }

    public Map<String, String> getHospitalList() {
        return create.selectDistinct(THospital.T_HOSPITAL.HOSPITAL_ID, THospital.T_HOSPITAL.SHORT_NAME).from(THospital.T_HOSPITAL).groupBy(THospital.T_HOSPITAL.HOSPITAL_ID).fetchMap(THospital.T_HOSPITAL.HOSPITAL_ID, THospital.T_HOSPITAL.SHORT_NAME);
    }

    public TPhysConfigReportsRecord getQueryDetail(String reportType) {
        String currentRoleId = "";
        if (SecurityUtils.getSubject().hasRole(TUserRole.PHYSICIAN_ADMIN.getUType())) {
            currentRoleId = TUserRole.PHYSICIAN_ADMIN.getUType();
        } else if (SecurityUtils.getSubject().hasRole(TUserRole.PHYSICIAN_SUPERVISOR.getUType())) {
            currentRoleId = TUserRole.PHYSICIAN_SUPERVISOR.getUType();
        } else if (SecurityUtils.getSubject().hasRole(TUserRole.PHYSICIAN_AUDITOR.getUType())) {
            currentRoleId = TUserRole.PHYSICIAN_AUDITOR.getUType();
        }
        return create.selectFrom(TPhysConfigReports.T_PHYS_CONFIG_REPORTS)
                .where(TPhysConfigReports.T_PHYS_CONFIG_REPORTS.REPORT_TYPE.eq(reportType))
                .and(TPhysConfigReports.T_PHYS_CONFIG_REPORTS.USER_ROLE.eq(currentRoleId))
                .fetchOne();
    }

}
