package com.operasolutions.rl.service.physician;

import java.net.URI;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.core.UriInfo;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authz.AuthorizationException;
import org.apache.shiro.authz.annotation.RequiresAuthentication;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.inject.Inject;
import com.operasolutions.rl.auth.AuthUtils;
import com.operasolutions.rl.common.DbConstants;
import com.operasolutions.rl.common.NumberConstants;
import com.operasolutions.rl.common.RevLeakageUtils;
import com.operasolutions.rl.schema.enums.TPermission;
import com.operasolutions.rl.schema.tables.records.TPatMatchStatsRecord;

import com.operasolutions.rl.service.physnpilookup.PhysicianLookupResource.TPhysMasterRepresentation;
import com.operasolutions.rl.service.physician.charges.PhysicianChargesResource;
import static com.operasolutions.rl.service.physician.charges.PhysicianChargesResource.ISSUBMITTED;
import static com.operasolutions.rl.service.physician.charges.PhysicianChargesResource.URL_PHYSICIAN_DETAIL;
import static com.operasolutions.rl.service.physician.charges.PhysicianChargesResource.URL_PHYSICIAN_STATS_PANEL;
import com.operasolutions.rl.service.physician.hospital.PhysicianHospitalResource;
import static com.operasolutions.rl.servlet.RevenueLeakageShiroWebModule.IS_MULTIFILE_ENABLE;
import com.sun.jersey.api.core.ResourceContext;
import java.util.Map;

/**
 * PhysicianAccountDao
 *
 * @author Nirmal Kumar
 */
@Path("/" + PhysicianHospitalResource.URL_HOSPITALS + "/{hospitalId:.*}/" + PhysicianAccountResource.URL_ACCOUNTS)
@Produces(MediaType.APPLICATION_JSON)
@RequiresAuthentication
public class PhysicianAccountResource {

    public static final String URL_ACCOUNTS = "physicianAccounts";
    public static final String SCORING_CHECK = "accountScoringCheck";
    public static final String ISCONFIRM = "isConfirm";
    protected static final Logger log = LoggerFactory.getLogger(PhysicianAccountResource.class);

    @Context
    UriInfo uriInfo;

    @Context
    ResourceContext rc;
    @Inject
    public PhysicianAccountDao physicianAccountDao;

    @GET
    public List<PhysicianAccountRepresentation> getAccounts(@PathParam("hospitalId") String hospitalId, @QueryParam("auditorId") List<String> auditorList) {
        log.debug("getAccounts() - start, hospitalId = " + hospitalId);

        if (hospitalId == null || hospitalId.trim().isEmpty()) {
            throw new WebApplicationException(Status.BAD_REQUEST);
        }

        List<PhysicianAccountRepresentation> result = new ArrayList<PhysicianAccountRepresentation>();

        Boolean all = null;
        if (SecurityUtils.getSubject().isPermitted(TPermission.READ_ALL_ACCOUNTS.getPermission())) {
            all = true;
        } else if (SecurityUtils.getSubject().isPermitted(TPermission.READ_ASSIGNED_ACCOUNTS.getPermission())) {
            all = false;
        } else {
            throw new AuthorizationException();
        }

        List<PhysicianAccountResourceResult> records = new ArrayList<PhysicianAccountResourceResult>();

        for (PhysicianAccountResourceResult oneRecord : physicianAccountDao.getPhysicianAccounts(hospitalId, AuthUtils.getLoggedUserName(), all, auditorList)) {
            records.add(oneRecord);
        }

        log.debug("Creating representation...");
        if (records != null && !records.isEmpty()) {
            int index = 1;
            for (PhysicianAccountResourceResult oneRecord : records) {
                PhysicianAccountRepresentation oneAccount = new PhysicianAccountRepresentation();
                oneAccount.rank = index;
                index++;
                oneAccount.accountId = oneRecord.accountId;
                oneAccount.age = oneRecord.age;
                oneAccount.dob = oneRecord.dob;
                oneAccount.patientId = oneRecord.patientId;
                oneAccount.name = oneRecord.name;
                oneAccount.predCode = RevLeakageUtils.getSubString(oneRecord.predCode, DbConstants.COMMA, NumberConstants.THREE);
                // gender, T_TYPE_LOOKUP
                String genderValue = oneRecord.sex;
                String genderDescription = oneRecord.genderDescription;
                if (genderDescription != null) {
                    genderValue = genderDescription;
                }

                oneAccount.gender = genderValue;
                oneAccount.admitDate = oneRecord.admitDate;
                oneAccount.dischargeDate = oneRecord.dischargeDate;
                oneAccount.transferDate = oneRecord.transferDate;
                oneAccount.serviceLocation = oneRecord.serviceLine;

                // patType, T_TYPE_LOOKUP
                String patTypeWithDescription = null;
                String patType = oneRecord.patientType;
                String patTypeDescription = oneRecord.patTypeDescription;

                if (patTypeDescription != null) {
                    patTypeWithDescription = patType + " - " + patTypeDescription;
                } else {
                    patTypeWithDescription = patType;
                }

                oneAccount.patType = patType;
                oneAccount.patTypeWithDescription = patTypeWithDescription;
                // patSubType, T_TYPE_LOOKUP
                String patSubTypeWithDescription = null;
                String patSubType = oneRecord.patientSubtype;
                String patSubTypeDescription = oneRecord.patSubTypeDescription;

                if (patSubTypeDescription != null) {
                    patSubTypeWithDescription = patSubType + " - " + patSubTypeDescription;
                } else {
                    patSubTypeWithDescription = patSubType;
                }

                oneAccount.patSubType = patSubType;
                oneAccount.patSubTypeWithDescription = patSubTypeWithDescription;
                oneAccount.insurance = oneRecord.payerCode;
                oneAccount.insuranceName = oneRecord.payerDesc;

                // isHighlighted = true it there is a records in existing
                // charges, possibly missing or other discovered charges
                if (oneRecord.possMissingCode != null) {
                    oneAccount.isHighlighted = true;
                } else {
                    oneAccount.isHighlighted = false;
                }
                oneAccount.isPrimary = oneRecord.isPrimary;
                oneAccount.uri = uriInfo.getRequestUri();
                oneAccount.uriCharges = uriInfo.getBaseUriBuilder().path(PhysicianChargesResource.class).queryParam(ISCONFIRM, false).queryParam(ISSUBMITTED, false).build(hospitalId, oneAccount.accountId);
                result.add(oneAccount);
            }
        }
        return result;
    }

    /**
     * All TPhysAcctDetailsRepresentation for account - expanded
     *
     * @param hospitalId
     * @param accountId
     * @return List<TPhysAcctDetailsRepresentation>
     */
    @GET
    @Path("/{accountId:.*}/" + URL_PHYSICIAN_DETAIL)
    public List<TPhysMasterRepresentation> getPhysicianAccountDetail(@PathParam("hospitalId") String hospitalId, @PathParam("accountId") String accountId) {
        log.debug("getHcpcsForAccount(), hospitalId = " + hospitalId + ", accountId = " + accountId);

        SecurityUtils.getSubject().checkPermission(TPermission.READ_ALL_CHARGES.getPermission());

        List<TPhysAcctDetailsRepresentation> result = new ArrayList<TPhysAcctDetailsRepresentation>();

        if (hospitalId == null || hospitalId.trim().isEmpty()) {
            throw new WebApplicationException(Status.BAD_REQUEST);
        }
        if (accountId == null || accountId.trim().isEmpty()) {
            throw new WebApplicationException(Status.BAD_REQUEST);
        }

        return physicianAccountDao.getPhysicianAccountDetail(hospitalId, accountId);

    }

    @GET
    @Path("/{accountId:.*}/" + URL_PHYSICIAN_STATS_PANEL)
    public List<TPhysAcctStatsPanelRepresentation> getPhysicianAccountStatePanel(@PathParam("hospitalId") String hospitalId, @PathParam("accountId") String accountId) {
        log.debug("getHcpcsForAccount(), hospitalId = " + hospitalId + ", accountId = " + accountId);

        SecurityUtils.getSubject().checkPermission(TPermission.READ_ALL_CHARGES.getPermission());

        List<TPhysAcctStatsPanelRepresentation> result = new ArrayList<TPhysAcctStatsPanelRepresentation>();

        if (hospitalId == null || hospitalId.trim().isEmpty()) {
            throw new WebApplicationException(Status.BAD_REQUEST);
        }
        if (accountId == null || accountId.trim().isEmpty()) {
            throw new WebApplicationException(Status.BAD_REQUEST);
        }

        for (TPatMatchStatsRecord oneRecord : physicianAccountDao.getPhysicianAccountStatePanel(hospitalId, accountId)) {
            result.add(getRepresentation(oneRecord));
        }
        if (result.isEmpty()) {
            TPhysAcctStatsPanelRepresentation representation = new TPhysAcctStatsPanelRepresentation(0, 0, 0, 0, 0);
            result.add(representation);
        }
        return result;
    }

    @GET
    @Path("/" + PhysicianAccountResource.SCORING_CHECK)
    public Boolean scoringCheck(@PathParam("hospitalId") String hospitalId) {

        SecurityUtils.getSubject().checkPermission(TPermission.READ_ALL_CHARGES.getPermission());

        log.debug("check scoring is running or not .");
        Boolean result = false;
        if (IS_MULTIFILE_ENABLE) {
            result = physicianAccountDao.scoringCheck(hospitalId);
        } else {
            result = physicianAccountDao.scoringCheck();
        }
        return result;
    }

    public static class PhysicianAccountRepresentation {

        public URI uri;
        public URI uriCharges;
        public String accountId;
        public Integer age;
        public String gender;
        public Date admitDate;
        public Date dischargeDate;
        public String patType;
        public String patTypeWithDescription;
        public String insurance;
        public String insuranceName;
        public boolean isHighlighted;
        public String predCode;
        public int rank;
        public String patSubType;
        public String patSubTypeWithDescription;
        public boolean isPrimary;
        public String patientId;
        public String serviceLocation;
        public String name;
        public java.sql.Date dob;
        public java.sql.Date transferDate;
    }

    /**
     * JOOQ Record Result Mapping Class
     */
    public static class PhysicianAccountResourceResult {

        public String accountId;
        public Integer age;
        public String sex;
        public String genderDescription;
        public java.sql.Date admitDate;
        public java.sql.Date dischargeDate;
        public String patientType;
        public String patTypeDescription;
        public String payerDesc;
        public String payerCode;
        public String possMissingCode;
        public String hospitalId;
        public double evScore;
        public String predCode;
        public String patientSubtype;
        public String patSubTypeDescription;
        public boolean isPrimary;
        public String patientId;
        public String serviceLine;
        public String name;
        public java.sql.Date dob;
        public java.sql.Date transferDate;
    }

    public static class TPhysAcctDetailsRepresentation {

        public String admitPhys;
        public String admitPhysCode;
        public String attndPhys;
        public String attndPhysCode;
        public String referPhys;
        public String referPhysCode;
        public String erPhys;
        public String erPhysCode;
        public String surgPhys;
        public String surgPhysCode;
        public Map<String, TPhysMasterRepresentation> physDetail;
    }

    public static class TPhysAcctStatsPanelRepresentation {

        public Integer matchOverall;
        public Integer matchSsn;
        public Integer matchDob;
        public Integer matchFname;
        public Integer matchLname;

        public TPhysAcctStatsPanelRepresentation() {
        }

        public TPhysAcctStatsPanelRepresentation(Integer matchOverall, Integer matchSsn, Integer matchDob, Integer matchFname, Integer matchLname) {
            this.matchOverall = matchOverall;
            this.matchSsn = matchSsn;
            this.matchDob = matchDob;
            this.matchFname = matchFname;
            this.matchLname = matchLname;
        }
    }

    public TPhysAcctStatsPanelRepresentation getRepresentation(TPatMatchStatsRecord record) {
        TPhysAcctStatsPanelRepresentation result = new TPhysAcctStatsPanelRepresentation();
        result.matchOverall = record.getMatchOverall();
        result.matchSsn = record.getMatchSsn();
        result.matchDob = record.getMatchDob();
        result.matchFname = record.getMatchFname();
        result.matchLname = record.getMatchLname();
        return result;
    }

}
