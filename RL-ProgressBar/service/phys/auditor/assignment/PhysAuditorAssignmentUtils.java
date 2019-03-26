package com.operasolutions.rl.service.phys.auditor.assignment;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.operasolutions.rl.service.phys.auditor.assignment.PhysAuditorAssignmentResource.AuditorAssignmentRepresentation;
import java.util.Collections;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.TreeMap;

/**
 * PhysicianAuditorAssignmentUtils
 *
 * @author Nirmal Kumar
 */
public class PhysAuditorAssignmentUtils {

    protected static final Logger log = LoggerFactory.getLogger(PhysAuditorAssignmentUtils.class);

    private Map<String, AuditorAssignmentRepresentation> oldRecords = new TreeMap<String, AuditorAssignmentRepresentation>();

    /**
     * Constructor
     *
     * @param current
     */
    public PhysAuditorAssignmentUtils(List<AuditorAssignmentRepresentation> current) {
        if (current == null) {
            throw new IllegalArgumentException("Input parameter 'current' cannot be null.");
        }

        log.debug("Number of current records = " + current.size());

        for (AuditorAssignmentRepresentation one : current) {
            oldRecords.put(one.source + one.costCenter, one);
        }
    }

    /**
     * Tells if the facility oneHospital had some auditor(s) before, and now has
     * lost all of them, or not. This helps us avoid running unassignment update
     * queries on T_PREDICTION tables for the facilities which already had no
     * auditors assigned to it to begin with
     *
     * @param newRecord
     * @return NoReassign
     */
    public NoReassign getIfReassignedNoAuditor(AuditorAssignmentRepresentation newRecord) {
        NoReassign n = new NoReassign();
        n.PHYS = false;

        if (oldRecords.get(newRecord.source + newRecord.costCenter).auditorData.size() != 0 && newRecord.auditorData.size() == 0) {
            n.PHYS = true;
        }

        return n;
    }

    /**
     * Finds differences for one hospital
     *
     * @param newRecord
     * @return DiffResult
     */
    public DiffResult getDifferences(AuditorAssignmentRepresentation newRecord) {

        log.debug("Finding differences for hospitalId = " + newRecord.source + newRecord.costCenter);
        DiffResult result = new DiffResult();

        AuditorAssignmentRepresentation oldRecord = oldRecords.get(newRecord.source + newRecord.costCenter);
        if (oldRecord != null) {
            log.debug("Finding differences for preBill...");
            result.differences.addAll(getDifference(oldRecord.auditorData, newRecord.auditorData));
            log.debug("Finding replacements for preBill...");
            result.replacements.addAll(getReplacements(oldRecord.auditorData, newRecord.auditorData));

        }

        return result;
    }

    /**
     * Finds replacement between list of auditors
     *
     * @param oldData
     * @param newData
     * @return List<Replacement>
     */
    protected List<Replacement> getReplacements(Set<String> oldData, Set<String> newData) {
        List<Replacement> result = new ArrayList<Replacement>(0);

        // I sort them, because list from client shouldn't be ordered correctly
        List<String> oldDataCopy = new ArrayList<String>(oldData);
        List<String> newDataCopy = new ArrayList<String>(newData);

        Collections.sort(oldDataCopy);
        Collections.sort(newDataCopy);
        if (oldDataCopy.size() == newDataCopy.size()) {
            for (int i = 0; i < oldDataCopy.size(); i++) {
                if (oldDataCopy.get(i) != null && newDataCopy.get(i) != null && oldDataCopy.get(i).compareTo(newDataCopy.get(i)) != 0) {
                    Replacement current = new Replacement();
                    current.oldUserId = oldDataCopy.get(i);
                    current.newUserId = newDataCopy.get(i);
                    result.add(current);
                    log.debug("Generated replacement = " + current);
                }
            }
        }
        log.debug("Number of replacements = " + result.size());
        return result;
    }

    /**
     * Gets difference between collections
     *
     * @param oldData
     * @param newData
     * @param billType
     * @return List<Difference>
     */
    protected List<Difference> getDifference(Set<String> oldData, Set<String> newData) {
        List<Difference> result = new ArrayList<Difference>(0);

        Set<String> auditorOldRecord = new HashSet<String>(oldData);
        Set<String> auditorNewRecord = new HashSet<String>(newData);

        // result are UPDATE candidates
        auditorNewRecord.removeAll(auditorOldRecord);
        if (auditorNewRecord.size() == 0) {
            log.debug("No ADD candidates.");
        } else {
            log.debug("Adding ADD candidates...");

            for (String data : auditorNewRecord) {
                Difference diff = new Difference();
                diff.type = OperationType.ADD;
                diff.userId = data;

                result.add(diff);
            }
        }

        auditorNewRecord = new HashSet<String>(newData);

        // result are DELETE candidates
        auditorOldRecord.removeAll(auditorNewRecord);
        if (auditorOldRecord.size() == 0) {
            log.debug("No DELETE candidates.");
        } else {
            log.debug("Adding DELETE candidates...");

            for (String data : auditorOldRecord) {
                Difference diff = new Difference();
                diff.type = OperationType.DELETE;
                diff.userId = data;
                result.add(diff);
            }
        }
        if (!result.isEmpty()) {
            Set<String> auditorOldRecordExt = new HashSet<String>(oldData);
            Set<String> auditorNewRecordExt = new HashSet<String>(newData);
            auditorOldRecordExt.retainAll(auditorNewRecordExt);
            for (String data : auditorOldRecordExt) {
                Difference diff = new Difference();
                diff.type = OperationType.EXIST;
                diff.userId = data;
                result.add(diff);
            }
        }
        return result;
    }
}

enum OperationType {

    DELETE, ADD, EXIST;
}

class DiffResult {

    List<Difference> differences = new ArrayList<Difference>(0);
    List<Replacement> replacements = new ArrayList<Replacement>(0);
}

class Replacement {

    String oldUserId;
    String newUserId;

    @Override
    public String toString() {
        StringBuffer result = new StringBuffer();

        result.append("oldUserId = " + oldUserId);
        result.append(", newUserId = " + newUserId);

        return result.toString();
    }
}

class Difference {

    OperationType type;
    String userId;

    @Override
    public String toString() {
        StringBuffer result = new StringBuffer();

        result.append("operationType = " + type);
        result.append(", userId = " + userId);

        return result.toString();
    }
}

class NoReassign {

    public boolean PHYS;
}
