package com.operasolutions.rl.service.physician.confirmed;

import java.sql.Timestamp;
import java.util.List;

import org.jooq.FactoryOperations;
import org.jooq.SelectLimitStep;
import org.jooq.SelectQuery;
import org.jooq.impl.Factory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.inject.Inject;
import static com.operasolutions.rl.common.ActivityLogUtils.PHYS_AGREE;
import com.operasolutions.rl.common.DbConstants;
import com.operasolutions.rl.schema.enums.TUserRole;
import com.operasolutions.rl.schema.tables.TPhysCnfmReportFields;
import com.operasolutions.rl.schema.tables.TPhysPredictions;
import com.operasolutions.rl.schema.tables.records.TPhysCnfmReportFieldsRecord;
import com.operasolutions.rl.service.physician.confirmed.ConfirmedChargeResource.ConfirmChargesRepresentation;
import java.sql.ResultSet;

import java.util.ArrayList;
import org.apache.shiro.SecurityUtils;

/**
 * ConfirmChargeAccountDao
 *
 * @author Ravi Teja
 */
public class ConfirmedChargeDao {

    private final FactoryOperations create;
    protected static final Logger log = LoggerFactory.getLogger(ConfirmedChargeDao.class);

    @Inject
    public ConfirmedChargeDao(FactoryOperations jooqFactory) {
        this.create = jooqFactory;
    }

    /**
     * Gets confirmed charges for pre-bill
     *
     * @param hospitalList
     * @param startDate
     * @param endDate
     * @param rejectedCharges
     * @param isAuditor
     * @param currentUser
     * @param auditorList
     * @param uriCharges
     * @return List<ConfirmChargesRepresentation>
     */
    public List<ConfirmChargesRepresentation> getConfirmCharges(List<String> hospitalList, Timestamp startDate, Timestamp endDate, String rejectedCharges, boolean isAuditor, String currentUser,
            List<String> auditorList, String uriCharges) {
        if (hospitalList == null) {
            throw new IllegalArgumentException("Input parameter 'hospitalList' cannot be null");
        }
        if (startDate == null) {
            throw new IllegalArgumentException("Input parameter 'startDate' cannot be null");
        }
        if (endDate == null) {
            throw new IllegalArgumentException("Input parameter 'endDate' cannot be null");
        }
        if (currentUser == null) {
            throw new IllegalArgumentException("Input parameter 'currentUser' cannot be null");
        }
        TPhysCnfmReportFieldsRecord record = getQueryDetail(DbConstants.CONFIRM_REPORT_GRID);
        String fieldArray[] = record.getSelectQuery().split("#");
        SelectQuery filterQry = create.selectQuery();
        filterQry.setDistinct(true);
        for (String fieldArray1 : fieldArray) {
            String[] arry = fieldArray1.split(" as ");
            if (arry.length == 2) {
                filterQry.addSelect(Factory.field(arry[0]).as(arry[1].trim()));
            }
        }
        filterQry.addSelect(Factory.field("REPLACE(REPLACE('" + uriCharges + "','hospitalId',T_PATIENT.HOSPITAL_ID),'accountId',T_PATIENT.ACCOUNT_ID)").as("uriCharges"));
        filterQry.addFrom(Factory.table(record.getFromQuery()));
        filterQry.addConditions(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITING_TIME.between(startDate, endDate));
        filterQry.addConditions(TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID.in(hospitalList));
        filterQry.addConditions(TPhysPredictions.T_PHYS_PREDICTIONS.SENT_FLAG.equal(DbConstants.YES_VALUE));
        if (rejectedCharges != null && rejectedCharges.equals("Y")) {
            filterQry.addConditions(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_FLAG.isNotNull().or(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_QTY.lessThan(0)));
        } else {
            filterQry.addConditions(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_FLAG.in(PHYS_AGREE).and(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_QTY.greaterThan(0)));
        }
        if (isAuditor) {
            filterQry.addConditions(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_ID.eq(currentUser));
        } else {
            filterQry.addConditions(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_ID.in(auditorList));
        }
        filterQry.addOrderBy(Factory.field(record.getOrderBy()));

        return filterQry.fetchInto(ConfirmChargesRepresentation.class);

    }

    public List<ConfirmChargesRepresentation> getConfirmChargesSearch(String accountId, boolean isAuditor, String currentUser, String uriCharges) {
        if (accountId == null) {
            throw new IllegalArgumentException("Input parameter 'accountId' cannot be null");
        }
        if (currentUser == null) {
            throw new IllegalArgumentException("Input parameter 'currentUser' cannot be null");
        }
        List<ConfirmChargesRepresentation> chargesResults = new ArrayList<ConfirmChargesRepresentation>();
        TPhysCnfmReportFieldsRecord recordPre = getQueryDetail(DbConstants.CONFIRM_REPORT_GRID);

        String fieldArray[] = recordPre.getSelectQuery().split("#");
        SelectQuery filterQry = create.selectQuery();
        filterQry.setDistinct(true);
        for (String fieldArray1 : fieldArray) {
            String[] arry = fieldArray1.split(" as ");
            if (arry.length == 2) {
                filterQry.addSelect(Factory.field(arry[0]).as(arry[1].trim()));
            }
        }
        filterQry.addSelect(Factory.field("REPLACE(REPLACE('" + uriCharges + "','hospitalId',T_PATIENT.HOSPITAL_ID),'accountId',T_PATIENT.ACCOUNT_ID)").as("uriCharges"));
        filterQry.addFrom(Factory.table(recordPre.getFromQuery()));
        filterQry.addConditions(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_FLAG.isNotNull().or(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_QTY.lessThan(0)));
        filterQry.addConditions(TPhysPredictions.T_PHYS_PREDICTIONS.ACCOUNT_ID.eq(accountId));
        filterQry.addConditions(TPhysPredictions.T_PHYS_PREDICTIONS.SENT_FLAG.equal(DbConstants.YES_VALUE));

        filterQry.addOrderBy(Factory.field(recordPre.getOrderBy()));
        if (isAuditor) {
            filterQry.addConditions(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_ID.equal(currentUser));
        }
        List<ConfirmChargesRepresentation> preList = filterQry.fetchInto(ConfirmChargesRepresentation.class);

        if (!preList.isEmpty()) {
            chargesResults.addAll(preList);
        }
        return chargesResults;

    }

    /**
     * Gets confirmed charges for pre-bill
     *
     * @param hospitalList
     * @param startDate
     * @param endDate
     * @param rejectedCharges
     * @param isAuditor
     * @param currentUser
     * @param auditorList
     * @return List<ConfirmChargesResult>
     */
    public ResultSet getConfirmChargesForExcel(List<String> hospitalList, Timestamp startDate, Timestamp endDate, String rejectedCharges, boolean isAuditor, String currentUser, List<String> auditorList) {
        if (hospitalList == null) {
            throw new IllegalArgumentException("Input parameter 'hospitalList' cannot be null");
        }
        if (startDate == null) {
            throw new IllegalArgumentException("Input parameter 'startDate' cannot be null");
        }
        if (endDate == null) {
            throw new IllegalArgumentException("Input parameter 'endDate' cannot be null");
        }
        if (currentUser == null) {
            throw new IllegalArgumentException("Input parameter 'currentUser' cannot be null");
        }
        log.debug("isAuditor :: " + isAuditor + " , rejectedCharges :: " + rejectedCharges);
        SelectLimitStep qry = null;
        TPhysCnfmReportFieldsRecord record = getQueryDetail(DbConstants.CONFIRM_REPORT_EXCEL);
        qry = create.selectDistinct(Factory.field(record.getSelectQuery()))
                .from(record.getFromQuery())
                .where(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITING_TIME.between(startDate, endDate))
                .and(TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID.in(hospitalList))
                .and(TPhysPredictions.T_PHYS_PREDICTIONS.SENT_FLAG.equal(DbConstants.YES_VALUE));
        SelectQuery filterQry = qry.getQuery();
        if (rejectedCharges != null && rejectedCharges.equals("Y")) {
            filterQry.addConditions(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_FLAG.isNotNull().or(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_QTY.lessThan(0)));
        } else {
            filterQry.addConditions(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_FLAG.in(PHYS_AGREE).and(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_QTY.greaterThan(0)));
        }
        if (isAuditor) {
            filterQry.addConditions(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_ID.eq(currentUser));
        } else {
            filterQry.addConditions(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_ID.in(auditorList));
        }

        filterQry.addOrderBy(Factory.field(record.getOrderBy()));

        return filterQry.fetchResultSet();

    }

    public TPhysCnfmReportFieldsRecord getQueryDetail(String reportType) {
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
        return create.selectFrom(TPhysCnfmReportFields.T_PHYS_CNFM_REPORT_FIELDS)
                .where(TPhysCnfmReportFields.T_PHYS_CNFM_REPORT_FIELDS.REPORT_TYPE.eq(reportType)
                        .and(TPhysCnfmReportFields.T_PHYS_CNFM_REPORT_FIELDS.USER_ROLE.eq(currentRoleId)))
                .fetchOne();
    }

}
