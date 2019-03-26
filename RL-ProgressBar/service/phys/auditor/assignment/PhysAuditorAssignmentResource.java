package com.operasolutions.rl.service.phys.auditor.assignment;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriInfo;
import javax.ws.rs.core.Response.Status;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authz.annotation.RequiresAuthentication;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.inject.Inject;
import com.google.inject.persist.Transactional;
import com.operasolutions.rl.auth.AuthUtils;
import com.operasolutions.rl.common.config.AuditorAssignmentRuleDao;
import com.operasolutions.rl.common.config.AuditorAssignmentRuleResource;
import com.operasolutions.rl.common.config.AuditorAssignmentRuleResource.Auditor;
import com.operasolutions.rl.common.email.EmailConstants;
import com.operasolutions.rl.common.email.EmailSender;
import com.operasolutions.rl.common.email.EmailUtils;
import com.operasolutions.rl.exception.RevenueLeakageException;
import com.operasolutions.rl.schema.enums.TPermission;
import com.operasolutions.rl.schema.tables.records.TPhysAssignmentRecord;
import com.operasolutions.rl.schema.tables.records.TUserRecord;
import com.operasolutions.rl.service.user.UserDao;
import com.sun.jersey.api.NotFoundException;
import java.sql.Date;
import java.sql.Timestamp;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Set;

/**
 * PhysicianAuditorAssignmentResource
 *
 * @author Nirmal Kumar This is only for Mercy
 */
@Path("/" + PhysAuditorAssignmentResource.URL_AUDITOR_ASSIGNMENT)
@Produces(MediaType.APPLICATION_JSON)
@RequiresAuthentication
public class PhysAuditorAssignmentResource {

    public static final String URL_AUDITOR_ASSIGNMENT = "physAuditorAssignment";

    protected static final Logger log = LoggerFactory.getLogger(PhysAuditorAssignmentResource.class);

    private final PhysAuditorAssignmentDao businessDao;
    private final UserDao userDao;
    @Inject
    private EmailSender emailSender;

    @Inject
    private AuditorAssignmentRuleDao auditorAssignmentRuleDao;

    @Context
    UriInfo uriInfo;

    @Inject
    public PhysAuditorAssignmentResource(PhysAuditorAssignmentDao businessDao, UserDao userDao) {
        this.businessDao = businessDao;
        this.userDao = userDao;
    }

    /**
     * Reads all hospital assignments
     *
     * @return List<AuditorAssignmentRepresentation>
     */
    @GET
    public List<AuditorAssignmentRepresentation> getAllAssignments() {
        log.debug("getAllAssignments() - start");

        SecurityUtils.getSubject().checkPermission(TPermission.READ_HOSPITALS_ASSIGNMENTS.getPermission());
        List<PhysAuditorAssignmentResult> physicianBillData = businessDao.getAllAssignments();
        // List<PhysAuditorAssignmentResult> queuePhysicianData = businessDao.getAllAssignmentsQueue();
        log.debug("Number of size = " + physicianBillData.size());
        return mergeResults(physicianBillData);
    }

    /**
     * Updates hospital assignments
     *
     * @param input
     * @return Response
     */
    @PUT
    @Transactional
    public Response updateAssignments(List<AuditorAssignmentRepresentation> input) throws RevenueLeakageException {
        log.debug("updateAssignments() - start, input = " + input);

        SecurityUtils.getSubject().checkPermission(TPermission.UPDATE_HOSPITALS_ASSIGNMENTS.getPermission());

        if (input == null) {
            throw new WebApplicationException(Status.BAD_REQUEST);
        }
        if (!isInputObjectValid(input)) {
            throw new WebApplicationException(Status.BAD_REQUEST);
        }
        long currentTime = System.currentTimeMillis();
        List<AuditorAssignmentRepresentation> current = getAllAssignments();
        log.debug("Comparing assignments...");
        PhysAuditorAssignmentUtils util = new PhysAuditorAssignmentUtils(current);
        Map<String, HospitalData> userHospitalMappingForDifferenceNew = new TreeMap<String, HospitalData>();
        Map<String, HospitalData> userHospitalMappingForDifferenceOld = new TreeMap<String, HospitalData>();
        Map<String, HospitalData> userHospitalMappingForExisting = new TreeMap<String, HospitalData>();
        for (AuditorAssignmentRepresentation oneHospital : input) {

            /* If the facility has lost all its auditors
             * then unassign all of its unreviewed accounts
             */
            NoReassign n = util.getIfReassignedNoAuditor(oneHospital);

            if (n.PHYS) {
                log.debug("oneHospital.source,oneHospital.costCenter,oneHospital.hospitalId  " + oneHospital.source, oneHospital.costCenter + " no longer has any pre bill auditors. Unassigning all unreviewed pre bill accounts...");
                businessDao.unassignAccounts(oneHospital.source, oneHospital.costCenter);
            }
            DiffResult result = util.getDifferences(oneHospital);
            log.debug("Processing differences...");
            for (Difference difference : result.differences) {
                if (difference.type == OperationType.DELETE) {
                    log.debug("Deleting assignments = " + difference);
                    businessDao.deleteAssignment(difference.userId, oneHospital.source, oneHospital.costCenter, AuthUtils.getLoggedUserName(), currentTime, (byte) 1);
                    log.debug("Processing old user...");
                    if (userHospitalMappingForDifferenceOld.containsKey(difference.userId)) {
                        List<PhysicianResult> newHospList = userHospitalMappingForDifferenceOld.get(difference.userId).physicianHospitalList;
                        PhysicianResult pr = new PhysicianResult(oneHospital.source, oneHospital.costCenter);
                        newHospList.add(pr);
                    } else {
                        PhysicianResult pr = new PhysicianResult(oneHospital.source, oneHospital.costCenter);
                        List<PhysicianResult> newHospList = new ArrayList<PhysicianResult>();
                        newHospList.add(pr);
                        HospitalData hospitalData = new HospitalData();
                        hospitalData.physicianHospitalList.addAll(newHospList);
                        userHospitalMappingForDifferenceOld.put(difference.userId, hospitalData);
                    }
                }
                if (difference.type == OperationType.ADD) {
                    TPhysAssignmentRecord record = new TPhysAssignmentRecord();
                    record.setUserId(difference.userId);
                    record.setSource(oneHospital.source);
                    record.setCostCenter(oneHospital.costCenter);
                    record.setIsRegular((byte) 1);
                    record.setUpdateTime(new Timestamp(currentTime));
                    record.setAssignedBy(AuthUtils.getLoggedUserName());
                    log.debug("Adding assignments = ");
                    businessDao.addAssignment(record);
                    log.debug("Processing new user...");
                    if (userHospitalMappingForDifferenceNew.containsKey(difference.userId)) {
                        List<PhysicianResult> newHospList = userHospitalMappingForDifferenceNew.get(difference.userId).physicianHospitalList;
                        PhysicianResult pr = new PhysicianResult(oneHospital.source, oneHospital.costCenter);
                        newHospList.add(pr);
                    } else {
                        PhysicianResult pr = new PhysicianResult(oneHospital.source, oneHospital.costCenter);
                        List<PhysicianResult> newHospList = new ArrayList<PhysicianResult>();
                        newHospList.add(pr);
                        HospitalData hospitalData = new HospitalData();
                        hospitalData.physicianHospitalList.addAll(newHospList);
                        userHospitalMappingForDifferenceNew.put(difference.userId, hospitalData);
                    }
                }
                if (difference.type == OperationType.EXIST) {
                    log.debug("Processing existing user...");
                    if (userHospitalMappingForExisting.containsKey(difference.userId)) {
                        List<PhysicianResult> newHospList = userHospitalMappingForExisting.get(difference.userId).physicianHospitalList;
                        PhysicianResult pr = new PhysicianResult(oneHospital.source, oneHospital.costCenter);
                        newHospList.add(pr);
                    } else {
                        PhysicianResult pr = new PhysicianResult(oneHospital.source, oneHospital.costCenter);
                        List<PhysicianResult> newHospList = new ArrayList<PhysicianResult>();
                        newHospList.add(pr);
                        HospitalData hospitalData = new HospitalData();
                        hospitalData.physicianHospitalList.addAll(newHospList);
                        userHospitalMappingForExisting.put(difference.userId, hospitalData);
                    }
                }
            }
            log.debug("Processing replacements...");
        }
        log.debug("Comparing assignments...");
        // String is hosapital id , AuditorDataAssignment data is number of auditor 
        Map<PhysicianResult, AuditorDataAssignment> map = new HashMap<PhysicianResult, AuditorDataAssignment>();
        changeTheStructureAccordingHospitalIdToUser(userHospitalMappingForDifferenceNew, map);
        changeTheStructureAccordingHospitalIdToUser(userHospitalMappingForExisting, map);
        if (!map.isEmpty()) {
            List<AccountList> accountLists = new ArrayList<AccountList>(0);
            for (PhysicianResult physicianResult : map.keySet()) {
                List<AccountList> accountList = businessDao.getAllUnReviwedAccount(physicianResult);
                if (!accountList.isEmpty()) {
                    accountLists.addAll(accountList);
                }
            }
            log.info("Size of List " + accountLists.size());
            auditorAssigmentRoundRobin(map, accountLists);
        }
        for (PhysicianResult physicianResult : map.keySet()) {
            if (!map.get(physicianResult).physicianHospitalListMap.isEmpty()) {
                for (String userId : map.get(physicianResult).physicianHospitalListMap.keySet()) {
                    if (!map.get(physicianResult).physicianHospitalListMap.get(userId).isEmpty()) {
                        businessDao.updatePredictionTableR(userId, map.get(physicianResult).physicianHospitalListMap.get(userId));
                    }
                }
            }
        }
        overrideAccount(current);
        if (!map.isEmpty()) {
            runCustomAssignment(map);
        }
        runRules(map, userHospitalMappingForDifferenceNew, userHospitalMappingForDifferenceOld, userHospitalMappingForExisting, currentTime);
        Map<String, HospitalData> deleted = new TreeMap<String, HospitalData>(userHospitalMappingForDifferenceOld);
        for (String userId : userHospitalMappingForDifferenceOld.keySet()) {
            if (userHospitalMappingForDifferenceNew.containsKey(userId) || userHospitalMappingForExisting.containsKey(userId)) {
                deleted.remove(userId);
            }
        }
        if (!deleted.isEmpty()) {
            log.debug("for differences old user");
            sendAuditorAssignmentEmail(true, deleted, EmailConstants.PHYS_REASSIGNMENT_MESSAGE, EmailConstants.PHYS_NON_REAL_TIME_AUDITOR_ASSIGNMENT_OLD_USER_MESSAGE);
        }
        for (String arg : userHospitalMappingForExisting.keySet()) {
            if (userHospitalMappingForDifferenceNew.containsKey(arg)) {
                userHospitalMappingForExisting.get(arg).physicianHospitalList.addAll(userHospitalMappingForDifferenceNew.get(arg).physicianHospitalList);
            }
        }
        userHospitalMappingForDifferenceNew.putAll(userHospitalMappingForExisting);
        if (!userHospitalMappingForDifferenceNew.isEmpty()) {
            log.debug("for differences new user");
            sendAuditorAssignmentEmail(false, userHospitalMappingForDifferenceNew, EmailConstants.PHYS_ASSIGNMENT_MESSAGE_COST_CENTER, EmailConstants.PHYS_NON_REAL_TIME_AUDITOR_ASSIGNMENT_NEW_USER_MESSAGE);
        }
//        if (!userHospitalMappingForExisting.isEmpty()) {
//            log.debug("for change in existing user");
//            sendAuditorAssignmentEmail(userHospitalMappingForExisting, EmailConstants.PHYS_ASSIGNMENT_MESSAGE, EmailConstants.PHYS_NON_REAL_TIME_AUDITOR_ASSIGNMENT_NEW_USER_MESSAGE);
//        }

        return Response.status(Response.Status.ACCEPTED).build();
    }

    /**
     * Sends email notification to the newly assigned auditors
     *
     * @param flag
     * @param map
     * @param assigmentMessage1
     * @param assigmentMessage2
     * @throws RevenueLeakageException
     */
    protected void sendAuditorAssignmentEmail(boolean flag, Map<String, HospitalData> map, String assigmentMessage1, String assigmentMessage2) throws RevenueLeakageException {
        for (Map.Entry<String, HospitalData> entry : map.entrySet()) {
            if (!entry.getValue().physicianHospitalList.isEmpty()) {
                String hospParam = "";

                if (!entry.getValue().physicianHospitalList.isEmpty()) {
                    hospParam = "<br/><TABLE style=\"border-collapse: collapse;border: 1px solid black;\"><thead><TH style=\"border: 1px solid black;padding: 5px;text-align: left;\"><b>Source</b></TH><TH style=\"border: 1px solid black;padding: 5px;text-align: left;\"><b>Cost Center</b></TH></thead>";
                }
                for (PhysicianResult physicianResult : new HashSet<PhysicianResult>(map.get(entry.getKey()).physicianHospitalList)) {
                    hospParam = hospParam + "<tr><td style=\"border: 1px solid black;padding: 5px;text-align: left;\" >" + physicianResult.source + "</td><td style=\"border: 1px solid black;padding: 5px;text-align: left;\" > " + physicianResult.costCenter + "</td></tr>";
                }
                if (!entry.getValue().physicianHospitalList.isEmpty()) {
                    hospParam = hospParam + "</tbody></TABLE>";
                }
                if (flag) {
                    hospParam = "";
                }
                TUserRecord record = userDao.getUser(entry.getKey());

                if (record == null) {
                    throw new NotFoundException("User not found.");
                }

                emailSender.sendEmail(record.getEmail(), EmailConstants.PHYS_AUDITOR_ASSIGNMENT_SUBJECT, EmailUtils.composeEmailBody(EmailConstants.PHYS_AUDITOR_ASSIGNMENT_TEMPLATE_FILE_NAME, record.getFName(), record.getLName(), assigmentMessage1, hospParam, assigmentMessage2), null);
            }
        }
    }

    private void changeTheStructureAccordingHospitalIdToUser(Map<String, HospitalData> userHospitalMapping, Map<PhysicianResult, AuditorDataAssignment> map) {
        Map<String, HospitalData> userHospitalMappingCopy = new HashMap<String, HospitalData>();
        userHospitalMappingCopy.putAll(userHospitalMapping);

        for (Map.Entry<String, HospitalData> entry : userHospitalMappingCopy.entrySet()) {
            if (!entry.getValue().physicianHospitalList.isEmpty()) {
                for (PhysicianResult hospId : userHospitalMappingCopy.get(entry.getKey()).physicianHospitalList) {
                    if (map.containsKey(hospId)) {
                        map.get(hospId).physicianHospitalListMap.put(entry.getKey(), new HashSet<String>());
                    } else {
                        AuditorDataAssignment data = new AuditorDataAssignment();
                        data.physicianHospitalListMap.put(entry.getKey(), new HashSet<String>());
                        map.put(hospId, data);
                    }
                }
            }
        }
    }

    private void auditorAssigmentRoundRobin(Map<PhysicianResult, AuditorDataAssignment> map, List<AccountList> accountLists) {
        for (PhysicianResult physicianResult : map.keySet()) {
            if (!map.get(physicianResult).physicianHospitalListMap.isEmpty()) {
                int size = map.get(physicianResult).physicianHospitalListMap.size();
                int counter = 0;
                List<String> list = new ArrayList<String>(map.get(physicianResult).physicianHospitalListMap.keySet());
                for (AccountList accountList : accountLists) {
                    if (accountList.source.equalsIgnoreCase(physicianResult.source) && accountList.costCenter.equalsIgnoreCase(physicianResult.costCenter)) {
                        map.get(physicianResult).physicianHospitalListMap.get(list.get(counter % size)).add(accountList.accountId);
                        counter++;
                    }
                }
            }
        }
    }

    private void overrideAccount(List<AuditorAssignmentRepresentation> current) {
        for (AuditorAssignmentRepresentation record : current) {
            if (record.auditorData.size() > 1) {
                List<AccountList> accountList = businessDao.getAllOverlapsAccount(record.costCenter, record.source);
                for (AccountList account : accountList) {
                    businessDao.updatePredictionOverlaps(record.costCenter, record.source, (String) record.auditorData.toArray()[0], account.accountId);
                }
            }
        }
    }

    private void runCustomAssignment(Map<PhysicianResult, AuditorDataAssignment> map) {
        businessDao.runCustomAssignment(map);
    }

    public static class HospitalData {

        public List<PhysicianResult> physicianHospitalList = new ArrayList<PhysicianResult>();

    }

    public static class AuditorDataAssignment {

        public Map<String, Set<String>> physicianHospitalListMap = new HashMap<String, Set<String>>();
    }

    /**
     * Verifies whether input object from client is valid
     *
     * @param input
     * @return true/false
     */
    protected boolean isInputObjectValid(List<AuditorAssignmentRepresentation> input) {
        boolean result = true;

        for (AuditorAssignmentRepresentation one : input) {
            if (one.source == null || one.source.trim().isEmpty()) {
                log.error("source is null or empty string!");

                result = false;
                break;
            }
            if (one.costCenter == null || one.costCenter.trim().isEmpty()) {
                log.error("costCenter is null or empty string!");

                result = false;
                break;
            }

            if (one.auditorData == null) {
                log.error(" auditorData list is null!");
                result = false;
                break;
            }
        }
        return result;
    }

    /**
     * Merges preBill and postBill into one result
     *
     * @param physicainData
     * @return List<AuditorAssignmentRepresentation>
     */
    protected List<AuditorAssignmentRepresentation> mergeResults(List<PhysAuditorAssignmentResult> physicainData) {

        Map<PhysicianResult, AuditorAssignmentRepresentation> tempResult = new TreeMap<PhysicianResult, AuditorAssignmentRepresentation>();
        log.debug("Processing preBill data...");
        for (PhysAuditorAssignmentResult one : physicainData) {
            PhysicianResult physicianResult = new PhysicianResult(one.source, one.costCenter);
            AuditorAssignmentRepresentation oneRecord = tempResult.get(physicianResult);
            if (oneRecord == null) {
                AuditorAssignmentRepresentation newRecord = new AuditorAssignmentRepresentation();
                newRecord.source = one.source;
                newRecord.costCenter = one.costCenter;
                newRecord.total = one.total;
                tempResult.put(physicianResult, newRecord);
                oneRecord = newRecord;
            }
            if (one.auditorId != null && one.auditorId.trim().length() != 0) {
                oneRecord.auditorData.addAll(new HashSet<String>(Arrays.asList(one.auditorId.split("\\,"))));
            }
            if (one.queueAuditorId != null && one.queueAuditorId.trim().length() != 0) {
                oneRecord.queueAuditors.addAll(new HashSet<String>(Arrays.asList(one.queueAuditorId.split("\\,"))));
            }
        }
        return convertMapIntoList(tempResult);
    }

    /**
     * Converts data from Map into List
     *
     * @param input
     * @return List<AuditorAssignmentRepresentation>
     */
    protected List<AuditorAssignmentRepresentation> convertMapIntoList(Map<PhysicianResult, AuditorAssignmentRepresentation> input) {
        List<AuditorAssignmentRepresentation> result = new ArrayList<AuditorAssignmentRepresentation>();

        for (Map.Entry<PhysicianResult, AuditorAssignmentRepresentation> entry : input.entrySet()) {
            result.add(entry.getValue());
        }

        return result;
    }

    /**
     * Merges preBill and postBill into one result
     *
     * @param physicainData
     * @return List<AuditorAssignmentRepresentation>
     */
    protected List<PhysAuditorAssignmentResult> chageOriginalStructure(List<AuditorAssignmentRepresentation> physicainData) {
        Set<PhysAuditorAssignmentResult> list = new HashSet<PhysAuditorAssignmentResult>(0);
        for (AuditorAssignmentRepresentation oneRecord : physicainData) {
            boolean flag = true;
            for (String auditorId : oneRecord.auditorData) {
                PhysAuditorAssignmentResult one = new PhysAuditorAssignmentResult();
                one.source = oneRecord.source;
                one.costCenter = oneRecord.costCenter;
                one.auditorId = auditorId;
                flag = false;
                list.add(one);
            }
            if (flag) {
                PhysAuditorAssignmentResult one = new PhysAuditorAssignmentResult();
                one.source = oneRecord.source;
                one.costCenter = oneRecord.costCenter;
                list.add(one);
            }
        }
        return new ArrayList<PhysAuditorAssignmentResult>(list);
    }

    public static class AuditorAssignmentRepresentation {

        public String source;
        public String costCenter;
        public Set<String> auditorData = new HashSet<String>(0);
        public List<String> queueAuditors = new ArrayList<String>(0);
        public Integer total;
    }

    /**
     * PhysicianAuditorAssignmentResult
     *
     * @author Nirmal Kumar
     */
    public class PhysicianResult implements Comparable<PhysicianResult> {

        public String source;
        public String costCenter;

        public PhysicianResult(String source, String costCenter) {
            this.source = source;
            this.costCenter = costCenter;
        }

        @Override
        public int hashCode() {
            int hash = 5;
            String concateKey = this.source.toLowerCase() + "-" + this.costCenter.toLowerCase();
            hash = hash + concateKey.hashCode();
            return hash;
        }

        @Override
        public boolean equals(Object obj) {
            if (this == obj) {
                return true;
            }
            if (obj == null) {
                return false;
            }
            if (getClass() != obj.getClass()) {
                return false;
            }
            final PhysicianResult other = (PhysicianResult) obj;
            String concateKey = this.source.toLowerCase() + "-" + this.costCenter.toLowerCase();
            String concateKey1 = other.source.toLowerCase() + "-" + other.costCenter.toLowerCase();
            return concateKey.equals(concateKey1);
        }

        @Override
        public int compareTo(PhysicianResult o) {
            PhysicianResult other = new PhysicianResult(this.source.toLowerCase(), this.costCenter.toLowerCase());
            return other.hashCode() - o.hashCode();
        }

    }

    public static class AccountList {

        public String hospitalId;
        public String source;
        public String costCenter;
        public String accountId;
    }

    public void runRules(Map<PhysicianResult, AuditorDataAssignment> map, Map<String, HospitalData> userHospitalMappingForDifferenceNew, Map<String, HospitalData> userHospitalMappingForDifferenceOld, Map<String, HospitalData> userHospitalMappingForExisting, long currentTime) {
        Set<Auditor> oldAuditorList = new HashSet<Auditor>(0);
        Set<Auditor> oldQueAuditorList = new HashSet<Auditor>(0);
        Set<Auditor> newAuditorList = new HashSet<Auditor>(0);
        Date predDatePre = auditorAssignmentRuleDao.getPhysMaxPredDate();
        log.debug("runRules() - start by auditor assignment ");
        for (PhysicianResult physicianResult : map.keySet()) {
            oldAuditorList.addAll(auditorAssignmentRuleDao.getAllAuditor(physicianResult));
            oldQueAuditorList.addAll(auditorAssignmentRuleDao.getAllAuditorQueue(physicianResult));
        }
        for (String auditorId : userHospitalMappingForDifferenceOld.keySet()) {
            if (!userHospitalMappingForDifferenceOld.get(auditorId).physicianHospitalList.isEmpty()) {
                for (PhysicianResult physicianResult : userHospitalMappingForDifferenceOld.get(auditorId).physicianHospitalList) {
                    oldAuditorList.addAll(auditorAssignmentRuleDao.getAllAuditor(physicianResult));
                    oldQueAuditorList.addAll(auditorAssignmentRuleDao.getAllAuditorQueue(physicianResult));
                }
            }
        }
        List<AuditorAssignmentRuleResource.RuleResult> list = auditorAssignmentRuleDao.getPriorityAllRule();
        for (AuditorAssignmentRuleResource.RuleResult ruleResult : list) {
            Map<String, List<Integer>> preBillMap = new HashMap<String, List<Integer>>();
            String[] auditorArray = ruleResult.auditorList.split("\\,");
            int size = auditorArray.length;
            if (size != 0) {
                int counterPreBill = 0;

                List<AuditorAssignmentRuleResource.RuleConfigAssignmentResult> accountList = new ArrayList<AuditorAssignmentRuleResource.RuleConfigAssignmentResult>(0);
                for (PhysicianResult physicianResult : map.keySet()) {
                    if (!map.get(physicianResult).physicianHospitalListMap.isEmpty()) {
                        accountList.addAll(auditorAssignmentRuleDao.getActualAccountFlag(ruleResult.ruleId, physicianResult.source, physicianResult.costCenter, predDatePre));
                        log.debug("Phys Account list size =" + accountList.size());
                    }
                }
                for (String auditorId : userHospitalMappingForDifferenceOld.keySet()) {
                    if (!userHospitalMappingForDifferenceOld.get(auditorId).physicianHospitalList.isEmpty()) {
                        for (PhysicianResult physicianResult : userHospitalMappingForDifferenceOld.get(auditorId).physicianHospitalList) {
                            accountList.addAll(auditorAssignmentRuleDao.getActualAccountFlag(ruleResult.ruleId, physicianResult.source, physicianResult.costCenter, predDatePre));
                        }
                    }
                }
                for (AuditorAssignmentRuleResource.RuleConfigAssignmentResult ruleConfigPreviewResult : accountList) {

                    Auditor auditor = new Auditor(ruleConfigPreviewResult.hospitalId, ruleConfigPreviewResult.source, ruleConfigPreviewResult.costCenter, auditorArray[counterPreBill % size]);
                    newAuditorList.add(auditor);
                    if (preBillMap.containsKey(auditorArray[counterPreBill % size])) {
                        List<Integer> predKeyList = preBillMap.get(auditorArray[counterPreBill % size]);
                        predKeyList.add(ruleConfigPreviewResult.predKey);
                    } else {
                        List<Integer> predKeyList = new ArrayList<Integer>(0);
                        predKeyList.add(ruleConfigPreviewResult.predKey);
                        preBillMap.put(auditorArray[counterPreBill % size], predKeyList);
                    }
                    counterPreBill++;
                }

            }
            for (String string : preBillMap.keySet()) {
                int count = auditorAssignmentRuleDao.updatePhysPredictions(string, preBillMap.get(string));
                log.info(count + " predkey has been updated for UserId " + string);
            }

        }
        // newAuditorList.removeAll(oldQueAuditorList);
        Set<Auditor> addAuditorList = new HashSet<Auditor>(newAuditorList);
        addAuditorList.removeAll(oldQueAuditorList);
        Set<Auditor> deleteAuditorList = new HashSet<Auditor>(oldQueAuditorList);

        deleteAuditorList.removeAll(newAuditorList);
        Set<Auditor> commonAuditorList = new HashSet<Auditor>(newAuditorList);

        commonAuditorList.retainAll(oldQueAuditorList);

        for (Auditor auditor : addAuditorList) {
            TPhysAssignmentRecord record = new TPhysAssignmentRecord();
            record.setHospitalId(auditor.hospitalId);
            record.setUserId(auditor.userId);
            record.setSource(auditor.source);
            record.setCostCenter(auditor.costCenter);
            record.setUpdateTime(new Timestamp(currentTime));
            record.setIsRegular((byte) 0);
            record.setAssignedBy(AuthUtils.getLoggedUserName());
            log.debug("Adding assignments = ");
            log.info(auditor.toString());
            businessDao.addAssignment(record);
            updateAssignmentByQueue(userHospitalMappingForDifferenceNew, auditor);
        }
        for (Auditor auditor : deleteAuditorList) {
            businessDao.deleteAssignment(auditor.userId, auditor.source, auditor.costCenter, AuthUtils.getLoggedUserName(), currentTime, (byte) 0);
            //int count=auditorAssignmentRuleDao.unassignAccounts(auditor.hospitalId, auditor.userId, AuditTypeEnum.getAuditTypeFromEnum(auditor.billType));
            //log.debug("Unassign count is  = "+count);
            //updateAssignmentByQueue(userHospitalMappingForDifferenceOld, auditor);
        }
        for (Auditor auditor : commonAuditorList) {
            updateAssignmentByQueue(userHospitalMappingForExisting, auditor);
        }
        for (String userId : userHospitalMappingForDifferenceNew.keySet()) {
            if (userHospitalMappingForDifferenceNew.containsKey(userId) && userHospitalMappingForExisting.containsKey(userId)) {
                userHospitalMappingForDifferenceNew.get(userId).physicianHospitalList.removeAll(userHospitalMappingForExisting.get(userId).physicianHospitalList);

            }
        }
        for (String userId : userHospitalMappingForDifferenceOld.keySet()) {
            if (userHospitalMappingForDifferenceOld.containsKey(userId) && userHospitalMappingForExisting.containsKey(userId)) {
                userHospitalMappingForDifferenceOld.get(userId).physicianHospitalList.removeAll(userHospitalMappingForExisting.get(userId).physicianHospitalList);

            }
        }
    }

    public void updateAssignmentByQueue(Map<String, HospitalData> userMappingForHospital, Auditor auditor) {
        log.debug("Processing new user...");
        PhysicianResult result = new PhysicianResult(auditor.source, auditor.costCenter);
        if (userMappingForHospital.containsKey(auditor.userId)) {
            userMappingForHospital.get(auditor.userId).physicianHospitalList.add(result);
        } else {
            HospitalData hospitalData = new HospitalData();
            hospitalData.physicianHospitalList.add(result);
            userMappingForHospital.put(auditor.userId, hospitalData);
        }
    }
}
