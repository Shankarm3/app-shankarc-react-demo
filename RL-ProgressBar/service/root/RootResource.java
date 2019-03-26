package com.operasolutions.rl.service.root;

import java.net.URI;

import javax.servlet.ServletContext;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.UriBuilder;
import javax.ws.rs.core.UriInfo;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authz.annotation.RequiresAuthentication;
import org.apache.shiro.subject.Subject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.google.inject.Inject;
import com.operasolutions.rl.auth.AuthConstants;
import com.operasolutions.rl.auth.AuthUtils;
import com.operasolutions.rl.common.LookupTypes;
import com.operasolutions.rl.common.VersionMetaDataReader;
import com.operasolutions.rl.common.VersionMetaDataReader.VersionInfo;
import com.operasolutions.rl.common.config.AuditorAssignmentRuleResource;
import com.operasolutions.rl.common.config.PublishCodeQueueResource;
import com.operasolutions.rl.common.config.RuleConfigResource;
import com.operasolutions.rl.common.config.SetEvScoreResource;
import com.operasolutions.rl.exception.RevenueLeakageException;
import com.operasolutions.rl.schema.enums.TUserRole;
import com.operasolutions.rl.service.auditorperformance.AuditorPerformanceResource;
import com.operasolutions.rl.service.diagnose.DiagnoseResource;
import com.operasolutions.rl.service.division.DivisionResource;
import com.operasolutions.rl.service.facilitypeformance.FacilityPerformanceResource;
import com.operasolutions.rl.service.lookup.type.TypeResource;
import com.operasolutions.rl.service.meta.config.ConfigResource;
import com.operasolutions.rl.service.modifier.ModifierResource;
import com.operasolutions.rl.service.phys.auditor.assignment.PhysAuditorAssignmentResource;
import com.operasolutions.rl.service.physician.PhysicianAccountInfoResource;
import com.operasolutions.rl.service.physician.PhysicianAccountViewResource;
import static com.operasolutions.rl.service.physician.PhysicianAccountViewResource.QUERY_STRING_VIEW_TYPE;
import com.operasolutions.rl.service.physnpilookup.PhysicianLookupResource;
import com.operasolutions.rl.service.physician.SubmittedPhysicianAccountResource;
import com.operasolutions.rl.service.physician.auditor.assignment.PhysicianAuditorAssignmentResource;
import com.operasolutions.rl.service.physician.auditor.assignment.PhysicianSummaryResource;
import com.operasolutions.rl.service.physician.confirmed.ConfirmedChargeResource;
import com.operasolutions.rl.service.physician.confirmed.search.GlobalAccountSearchResource;
import com.operasolutions.rl.service.physician.dashboard.account.report.PhysicianAccountReportResource;
import com.operasolutions.rl.service.physician.dashboard.overaltrend.PhysicianOveralTrendResource;
import com.operasolutions.rl.service.physician.dashboard.peformancecomparison.PhysicianPerformanceComparisonResource;
import com.operasolutions.rl.service.physician.dashboard.topprocedurecode.TopProcedureCodeResource;
import com.operasolutions.rl.service.physician.hospital.PhysicianHospitalResource;
import com.operasolutions.rl.service.physician.hospital.auditor.PhysicianAuditorResource;
import com.operasolutions.rl.service.physician.summary.SummaryResource;
import com.operasolutions.rl.service.pos.PosResource;
import com.operasolutions.rl.service.reporting.assignment.ReportingAssignmentResource;
import com.operasolutions.rl.service.role.RoleResource;
import com.operasolutions.rl.service.security.SecurityResource;
import com.operasolutions.rl.service.user.UserResource;
import static com.operasolutions.rl.servlet.RevenueLeakageShiroWebModule.IS_CUSTOM_ASSIGNMENT;

/**
 * RootResource
 *
 * @author Nirmal Kumar
 */
@Path("/" + RootResource.URL_ROOT)
@Produces(MediaType.APPLICATION_JSON)
@RequiresAuthentication
public class RootResource {

    public static final String URL_ROOT = "root";

    protected static final Logger log = LoggerFactory.getLogger(RootResource.class);

    protected final VersionMetaDataReader versionMetaDataReader;

    @Context
    protected UriInfo uriInfo;

    @Context
    protected ServletContext context;

    @Inject
    public RootResource(VersionMetaDataReader versionMetaDataReader) {
        this.versionMetaDataReader = versionMetaDataReader;
    }

    @GET
    public RootRepresentation getRootInformation() throws RevenueLeakageException {

        log.debug("getRootInformation() - start");
        RootRepresentation result = null;

        VersionInfo versionInfo = versionMetaDataReader.readMetaData(context);
        String version = versionInfo.getVersion() + "-" + versionInfo.getBuild();

        Subject subject = SecurityUtils.getSubject();
        if (subject.hasRole(TUserRole.PHYSICIAN_ADMIN.getUType())) {
            result = new AdministratorRootRepresentation(version, uriInfo, context);
        } else if (subject.hasRole(TUserRole.PHYSICIAN_AUDITOR.getUType())) {
            result = new PhysicianAuditorRootRepresentation(version, uriInfo, context);
        } else if (subject.hasRole(TUserRole.PHYSICIAN_SUPERVISOR.getUType())) {
            result = new PhysicianSupervisorRootRepresentation(version, uriInfo, context);
        } else if (subject.hasRole(TUserRole.PHYSICIAN_RPT_USER.getUType())) {
            result = new ReportingRootRepresentation(version, uriInfo, context);
        } else {
            throw new RevenueLeakageException("Role not supported!!!");
        }

        return result;
    }

    /**
     * RootRepresentation - data for all users
     *
     */
    public static class RootRepresentation {

        public String version;
        public URI userUri;
        public URI userTimeZoneUri;
        public URI changePasswordUri;
        public URI logoutUri;
        public URI typeResponsesPhysUri;
        public URI securityImplUri;
        public URI diagnosesUri;
        public URI modifierUri;
        public URI physicianNpiLookupUri;
        public URI getPosUri;
        public URI uriPhysicianAccountsInfo;
        public URI uriPhysicianAccounts;
        public URI uriPhysicianAccountsExcel;
        public URI costCenterUri;
        public URI jqGridConfigUri;

        public RootRepresentation(String version, UriInfo uriInfo, ServletContext context) {
            this.version = version;
            UriBuilder ub = uriInfo.getBaseUriBuilder().path(UserResource.class).path(AuthUtils.getLoggedUserName());
            this.userUri = ub.build();
            this.userTimeZoneUri = uriInfo.getBaseUriBuilder().path(UserResource.class).path(UserResource.TIME_ZONE).build();
            this.changePasswordUri = ub.path(UserResource.PWD).build();
            this.logoutUri = UriBuilder.fromUri(context.getContextPath() + AuthConstants.LOGOUT_URL).build();
            this.typeResponsesPhysUri = uriInfo.getBaseUriBuilder().path(TypeResource.class).path(LookupTypes.TYPE_RESPONSE_PHYS).build();
            this.securityImplUri = uriInfo.getBaseUriBuilder().path(SecurityResource.URL_SECURITY).path(SecurityResource.URL_IMPLEMENTATION).build();
            this.diagnosesUri = uriInfo.getBaseUriBuilder().path(DiagnoseResource.class).build();
            this.modifierUri = uriInfo.getBaseUriBuilder().path(ModifierResource.class).build();
            this.physicianNpiLookupUri = uriInfo.getBaseUriBuilder().path(PhysicianLookupResource.class).build();
            this.getPosUri = uriInfo.getBaseUriBuilder().path(PosResource.class).build();
            this.getPosUri = uriInfo.getBaseUriBuilder().path(PosResource.class).build();
            this.uriPhysicianAccounts = uriInfo.getBaseUriBuilder().path(PhysicianAccountViewResource.class).build();
            this.uriPhysicianAccountsExcel = uriInfo.getBaseUriBuilder().path(PhysicianAccountViewResource.class).path(AuthConstants.EXCEL_URL).queryParam(QUERY_STRING_VIEW_TYPE, AuthConstants.EXCEL_URL).build();
            this.uriPhysicianAccountsInfo = uriInfo.getBaseUriBuilder().path(PhysicianAccountInfoResource.class).build();
            this.costCenterUri = uriInfo.getBaseUriBuilder().path(PhysicianHospitalResource.class).path(PhysicianHospitalResource.URL_COST_CENTER).build();
            this.jqGridConfigUri = uriInfo.getBaseUriBuilder().path(ConfigResource.class).build();
        }
    }

    /**
     * AdministratorRootRepresentation - data for Administrator
     *
     */
    public static class AdministratorRootRepresentation extends PhysicianSupervisorRootRepresentation {

        public URI rolesUri;
        public URI passwordResetUri;
        public URI ruleList;
        public URI ruleDownload;

        public URI ruleConfigExcel;
        public URI globalAccountSerachUri;
        public URI globalFilterSeachUri;
        public URI getGlobalFilterParametrUri;
        public URI publishCodeQueueList;
        public URI publishCodeQueuePreview;
        public URI setEvScoreList;
        public URI setEvScorePreview;

        public AdministratorRootRepresentation(String version, UriInfo uriInfo, ServletContext context) {
            super(version, uriInfo, context);

            this.rolesUri = uriInfo.getBaseUriBuilder().path(RoleResource.URL_ROLES).build();
            this.passwordResetUri = uriInfo.getBaseUriBuilder().path(UserResource.class).path(UserResource.PASSWORD_RESET).build();
            this.ruleList = uriInfo.getBaseUriBuilder().path(RuleConfigResource.class).build();
            this.ruleDownload = uriInfo.getBaseUriBuilder().path(RuleConfigResource.class).path(RuleConfigResource.URL_RULE_DOWNLOAD).build();
            // this.ruleConfigMap = uriInfo.getBaseUriBuilder().path(RuleConfigResource.class).path(RuleConfigResource.URL_RULE_CONFIG).build();
            this.ruleConfigExcel = uriInfo.getBaseUriBuilder().path(RuleConfigResource.class).path(RuleConfigResource.URL_RULE_EXCEL).build();
            this.publishCodeQueueList = uriInfo.getBaseUriBuilder().path(PublishCodeQueueResource.class).build();
            this.publishCodeQueuePreview = uriInfo.getBaseUriBuilder().path(PublishCodeQueueResource.class).path(PublishCodeQueueResource.URL_RULE_PREVIEW).build();
            this.globalAccountSerachUri = uriInfo.getBaseUriBuilder().path(GlobalAccountSearchResource.class).build();
            this.globalFilterSeachUri = uriInfo.getBaseUriBuilder().path(GlobalAccountSearchResource.class).path(GlobalAccountSearchResource.URL_GLOBAL_SERACH_FILTER).build();
            this.getGlobalFilterParametrUri = uriInfo.getBaseUriBuilder().path(GlobalAccountSearchResource.class).path(GlobalAccountSearchResource.URL_FILTER_PARAMETER).build();
            this.setEvScoreList = uriInfo.getBaseUriBuilder().path(SetEvScoreResource.class).build();
            this.setEvScorePreview = uriInfo.getBaseUriBuilder().path(SetEvScoreResource.class).path(SetEvScoreResource.URL_RULE_PREVIEW).build();
        }
    }

    /**
     * InternalAuditorCentralizedRootRepresentation - data for Internal auditor
     * centralized
     *
     */
    public static class PhysicianAuditorRootRepresentation extends RootRepresentation {

        public URI assignedHospitals;
        public URI phyConfirmChargesUri;
        public URI phyConfirmChargesExcelUri;
        public URI phySubmittedAccountUri;
        public URI assignedCostCenter;

        public PhysicianAuditorRootRepresentation(String version, UriInfo uriInfo, ServletContext context) {
            super(version, uriInfo, context);

            this.assignedHospitals = uriInfo.getBaseUriBuilder().path(PhysicianHospitalResource.class).path(PhysicianHospitalResource.URL_USERS).path(AuthUtils.getLoggedUserName()).build();
            this.phyConfirmChargesUri = uriInfo.getBaseUriBuilder().path(ConfirmedChargeResource.class).build();
            this.phyConfirmChargesExcelUri = uriInfo.getBaseUriBuilder().path(ConfirmedChargeResource.class).path(AuthConstants.EXCEL_URL).build();
            this.phySubmittedAccountUri = uriInfo.getBaseUriBuilder().path(SubmittedPhysicianAccountResource.class).path(SubmittedPhysicianAccountResource.URL_ACCOUNTS_VIEW).build();
            this.assignedCostCenter = uriInfo.getBaseUriBuilder().path(PhysicianHospitalResource.class).path(PhysicianHospitalResource.URL_COST_CENTER_USER).path(AuthUtils.getLoggedUserName()).build();
        }
    }

    /**
     * InternalAuditorCentralizedRootRepresentation - data for Internal auditor
     * centralized
     *
     */
    public static class PhysicianSupervisorRootRepresentation extends RootRepresentation {

        public URI divisionsUri;

        public URI assignedHospitals;
        public URI assignedCostCenter;
        public URI auditorsUri;
        public URI usersUri;
        public URI usersPhyUri;
        public URI phyConfirmChargesUri;
        public URI phyConfirmChargesExcelUri;
        public URI accountReportsUri;
        public URI overallTrendsUri;
        public URI performanceComparisonListViewUri;
        public URI performanceComparisonListViewExcelUri;
        public URI performanceComparisonListViewPdfUri;
        public URI performanceComparisonChartViewUri;
        public URI physicianTopProcedureCodeUri;
        public URI phySubmittedAccountUri;
        public URI getAllAuditor;
        public URI getAllPhysAuditor;
        public URI auditorAssignmentUri;
        public URI viewCodeAssignmentUri;
        public URI physCurrentSummary;
        public URI ruleAssigmentDownload;
        public URI ruleAssigmentRun;
        public URI ruleAssigment;
        public URI reportingAssignmentUri;
        public URI ruleConfigMap;
        public URI ruleAssigmentSave;
        public URI ruleAssigmentConfigExcel;
        public URI allHospitalsUri;
        public URI facilityPerformanceUri;
        public URI facilityPerformanceExcelUri;
        public URI facilityPerformancePdfUri;
        public URI auditorComparisonUri;
        public URI auditorComparisonExcelUri;
        public URI auditorComparisonPdfUri;
        public URI auditorTrendUri;

        public PhysicianSupervisorRootRepresentation(String version, UriInfo uriInfo, ServletContext context) {
            super(version, uriInfo, context);
            this.divisionsUri = uriInfo.getBaseUriBuilder().path(DivisionResource.URL_DIVISIONS).build();
            this.auditorsUri = uriInfo.getBaseUriBuilder().path(PhysicianAuditorResource.class).build();
            this.getAllAuditor = uriInfo.getBaseUriBuilder().path(PhysicianAuditorResource.class).path(PhysicianAuditorResource.URL_GET_ALL_AUDITOR).build();
            this.getAllPhysAuditor = uriInfo.getBaseUriBuilder().path(PhysicianAuditorResource.class).path(PhysicianAuditorResource.URL_GET_ALL_PHYS_AUDITOR).build();
            this.usersUri = uriInfo.getBaseUriBuilder().path(UserResource.URL_USERS).build();
            this.usersPhyUri = uriInfo.getBaseUriBuilder().path(UserResource.URL_USERS).queryParam("role", TUserRole.PHYSICIAN_AUDITOR).build();
            this.assignedHospitals = uriInfo.getBaseUriBuilder().path(PhysicianHospitalResource.class).path(PhysicianHospitalResource.URL_USERS).path(AuthUtils.getLoggedUserName()).build();
            //this.costCenterUri = uriInfo.getBaseUriBuilder().path(PhysicianHospitalResource.class).path(PhysicianHospitalResource.URL_COST_CENTER).build();
            this.phyConfirmChargesUri = uriInfo.getBaseUriBuilder().path(ConfirmedChargeResource.class).build();
            this.phyConfirmChargesExcelUri = uriInfo.getBaseUriBuilder().path(ConfirmedChargeResource.class).path(AuthConstants.EXCEL_URL).build();
            this.performanceComparisonListViewUri = uriInfo.getBaseUriBuilder().path(PhysicianPerformanceComparisonResource.class).path(PhysicianPerformanceComparisonResource.URL_LIST_VIEW).build();
            this.performanceComparisonListViewExcelUri = uriInfo.getBaseUriBuilder().path(PhysicianPerformanceComparisonResource.class).path(PhysicianPerformanceComparisonResource.URL_LIST_VIEW).path(AuthConstants.EXCEL_URL).build();
            this.performanceComparisonListViewPdfUri = uriInfo.getBaseUriBuilder().path(PhysicianPerformanceComparisonResource.class).path(PhysicianPerformanceComparisonResource.URL_LIST_VIEW).path(AuthConstants.PDF_URL).build();
            this.performanceComparisonChartViewUri = uriInfo.getBaseUriBuilder().path(PhysicianPerformanceComparisonResource.class).path(PhysicianPerformanceComparisonResource.URL_CHART_VIEW).build();
            this.accountReportsUri = uriInfo.getBaseUriBuilder().path(PhysicianAccountReportResource.class).build();
            this.physicianTopProcedureCodeUri = uriInfo.getBaseUriBuilder().path(TopProcedureCodeResource.URL_TOP_PROCEDURE_CODE).build();
            this.overallTrendsUri = uriInfo.getBaseUriBuilder().path(PhysicianOveralTrendResource.class).build();
            this.phySubmittedAccountUri = uriInfo.getBaseUriBuilder().path(SubmittedPhysicianAccountResource.class).build();
            this.reportingAssignmentUri = uriInfo.getBaseUriBuilder().path(ReportingAssignmentResource.URL_REPORTING_ASSIGNMENT).build();
            if (IS_CUSTOM_ASSIGNMENT) {
                this.auditorAssignmentUri = uriInfo.getBaseUriBuilder().path(PhysAuditorAssignmentResource.class).build();
            } else {
                this.auditorAssignmentUri = uriInfo.getBaseUriBuilder().path(PhysicianAuditorAssignmentResource.class).build();
            }
            this.viewCodeAssignmentUri = uriInfo.getBaseUriBuilder().path(PhysicianSummaryResource.class).build();
            this.physCurrentSummary = uriInfo.getBaseUriBuilder().path(SummaryResource.class).build();
            this.assignedCostCenter = uriInfo.getBaseUriBuilder().path(PhysicianHospitalResource.class).path(PhysicianHospitalResource.URL_COST_CENTER_USER).path(AuthUtils.getLoggedUserName()).build();
            this.ruleConfigMap = uriInfo.getBaseUriBuilder().path(RuleConfigResource.class).path(RuleConfigResource.URL_RULE_CONFIG).build();
            this.ruleAssigmentConfigExcel = uriInfo.getBaseUriBuilder().path(AuditorAssignmentRuleResource.class).path(AuditorAssignmentRuleResource.URL_RULE_EXCEL).build();
            this.ruleAssigment = uriInfo.getBaseUriBuilder().path(AuditorAssignmentRuleResource.class).build();
            this.ruleAssigmentSave = uriInfo.getBaseUriBuilder().path(AuditorAssignmentRuleResource.class).path(AuditorAssignmentRuleResource.URL_RULE_SAVE).build();
            this.ruleAssigmentDownload = uriInfo.getBaseUriBuilder().path(AuditorAssignmentRuleResource.class).path(AuditorAssignmentRuleResource.URL_RULE_DOWNLOAD).build();
            this.ruleAssigmentRun = uriInfo.getBaseUriBuilder().path(AuditorAssignmentRuleResource.class).path(AuditorAssignmentRuleResource.URL_RULE_RUN).build();
            this.allHospitalsUri = uriInfo.getBaseUriBuilder().path(PhysicianHospitalResource.class).build();
            this.facilityPerformanceUri = uriInfo.getBaseUriBuilder().path(FacilityPerformanceResource.class).build();
            this.facilityPerformanceExcelUri = uriInfo.getBaseUriBuilder().path(FacilityPerformanceResource.class).path(AuthConstants.EXCEL_URL).build();
            this.facilityPerformancePdfUri = uriInfo.getBaseUriBuilder().path(FacilityPerformanceResource.class).path(AuthConstants.PDF_URL).build();
            this.auditorComparisonUri = uriInfo.getBaseUriBuilder().path(AuditorPerformanceResource.URL_AUDITOR_PERFORMANCE).path(AuditorPerformanceResource.URL_AUDITOR_COMPARISON).build();
            this.auditorComparisonExcelUri = uriInfo.getBaseUriBuilder().path(AuditorPerformanceResource.URL_AUDITOR_PERFORMANCE).path(AuditorPerformanceResource.URL_AUDITOR_COMPARISON).path(AuthConstants.EXCEL_URL).build();
            this.auditorComparisonPdfUri = uriInfo.getBaseUriBuilder().path(AuditorPerformanceResource.URL_AUDITOR_PERFORMANCE).path(AuditorPerformanceResource.URL_AUDITOR_COMPARISON).path(AuthConstants.PDF_URL).build();
            this.auditorTrendUri = uriInfo.getBaseUriBuilder().path(AuditorPerformanceResource.URL_AUDITOR_PERFORMANCE).path(AuditorPerformanceResource.URL_AUDITOR_TREND).build();

        }
    }

    /**
     * ReportingRootRepresentation - data for Report
     *
     */
    public static class ReportingRootRepresentation extends RootRepresentation {

        public URI overallTrendsUri;
        public URI auditorsUri;
        public URI auditorTrendUri;
        public URI performanceComparisonListViewUri;
        public URI performanceComparisonListViewExcelUri;
        public URI performanceComparisonListViewPdfUri;
        public URI performanceComparisonChartViewUri;
        public URI accountReportsUri;
        public URI divisionsUri;
        public URI physicianTopProcedureCodeUri;
        public URI assignedHospitals;
        public URI assignedCostCenter;
        public URI getAllPhysAuditor;
        public URI phyConfirmChargesUri;
        public URI phyConfirmChargesExcelUri;
        public URI auditorComparisonUri;
        public URI auditorComparisonExcelUri;
        public URI auditorComparisonPdfUri;

        public ReportingRootRepresentation(String version, UriInfo uriInfo, ServletContext context) {
            super(version, uriInfo, context);

            this.overallTrendsUri = uriInfo.getBaseUriBuilder().path(PhysicianOveralTrendResource.class).build();
            this.auditorsUri = uriInfo.getBaseUriBuilder().path(PhysicianAuditorResource.URL_AUDITORS).build();
            this.performanceComparisonListViewUri = uriInfo.getBaseUriBuilder().path(PhysicianPerformanceComparisonResource.class).path(PhysicianPerformanceComparisonResource.URL_LIST_VIEW).build();
            this.performanceComparisonListViewExcelUri = uriInfo.getBaseUriBuilder().path(PhysicianPerformanceComparisonResource.class).path(PhysicianPerformanceComparisonResource.URL_LIST_VIEW).path(AuthConstants.EXCEL_URL).build();
            this.performanceComparisonListViewPdfUri = uriInfo.getBaseUriBuilder().path(PhysicianPerformanceComparisonResource.class).path(PhysicianPerformanceComparisonResource.URL_LIST_VIEW).path(AuthConstants.PDF_URL).build();
            this.performanceComparisonChartViewUri = uriInfo.getBaseUriBuilder().path(PhysicianPerformanceComparisonResource.class).path(PhysicianPerformanceComparisonResource.URL_CHART_VIEW).build();
            this.accountReportsUri = uriInfo.getBaseUriBuilder().path(PhysicianAccountReportResource.class).build();
            this.divisionsUri = uriInfo.getBaseUriBuilder().path(DivisionResource.URL_DIVISIONS).path(DivisionResource.URL_DIVISIONS_ASSIGNED).build();
            this.physicianTopProcedureCodeUri = uriInfo.getBaseUriBuilder().path(TopProcedureCodeResource.URL_TOP_PROCEDURE_CODE).build();
            this.assignedHospitals = uriInfo.getBaseUriBuilder().path(PhysicianHospitalResource.class).path(PhysicianHospitalResource.URL_USERS).path(AuthUtils.getLoggedUserName()).build();
            this.assignedCostCenter = uriInfo.getBaseUriBuilder().path(PhysicianHospitalResource.class).path(PhysicianHospitalResource.URL_COST_CENTER_USER).path(AuthUtils.getLoggedUserName()).build();
            this.getAllPhysAuditor = uriInfo.getBaseUriBuilder().path(PhysicianAuditorResource.class).path(PhysicianAuditorResource.URL_GET_ALL_PHYS_AUDITOR).build();
            this.phyConfirmChargesUri = uriInfo.getBaseUriBuilder().path(ConfirmedChargeResource.class).build();
            this.phyConfirmChargesExcelUri = uriInfo.getBaseUriBuilder().path(ConfirmedChargeResource.class).path(AuthConstants.EXCEL_URL).build();
            this.auditorComparisonUri = uriInfo.getBaseUriBuilder().path(AuditorPerformanceResource.URL_AUDITOR_PERFORMANCE).path(AuditorPerformanceResource.URL_AUDITOR_COMPARISON).build();
            this.auditorComparisonExcelUri = uriInfo.getBaseUriBuilder().path(AuditorPerformanceResource.URL_AUDITOR_PERFORMANCE).path(AuditorPerformanceResource.URL_AUDITOR_COMPARISON).path(AuthConstants.EXCEL_URL).build();
            this.auditorComparisonPdfUri = uriInfo.getBaseUriBuilder().path(AuditorPerformanceResource.URL_AUDITOR_PERFORMANCE).path(AuditorPerformanceResource.URL_AUDITOR_COMPARISON).path(AuthConstants.PDF_URL).build();
            this.auditorTrendUri = uriInfo.getBaseUriBuilder().path(AuditorPerformanceResource.URL_AUDITOR_PERFORMANCE).path(AuditorPerformanceResource.URL_AUDITOR_TREND).build();

        }
    }
}
