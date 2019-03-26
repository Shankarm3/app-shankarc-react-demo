package com.operasolutions.rl.service.diagnose;

import java.util.List;

import org.jooq.FactoryOperations;

import com.google.inject.Inject;
import com.operasolutions.rl.schema.tables.TDiagCodes;
import com.operasolutions.rl.schema.tables.records.TDiagCodesRecord;
import com.operasolutions.rl.service.diagnose.DiagnoseResource.DiagnoseResult;
import com.operasolutions.rl.service.physician.charges.PhysicianLookupChargeMasterResource.SearchCriteria;
import com.operasolutions.rl.service.physician.charges.SearchTypeEnum;
import org.jooq.Comparator;
import org.jooq.Field;
import org.jooq.SelectQuery;

/**
 * DiagnoseDao
 *
 * @author Marcel Bodnar
 */
public class DiagnoseDao {

    private final FactoryOperations create;

    @Inject
    public DiagnoseDao(FactoryOperations jooqFactory) {
        this.create = jooqFactory;
    }

    /**
     * All diagnoses
     *
     * @return List of diagnoses
     */
    public List<TDiagCodesRecord> getAllDiagnoses() {
        return create.selectFrom(TDiagCodes.T_DIAG_CODES).fetch();
    }

    /**
     * Diagnose by code
     *
     * @param code
     * @return TDiagCodesRecord
     */
    public TDiagCodesRecord getDiagnoseByCode(String code) {
        if (code == null) {
            throw new IllegalArgumentException("Input parameter 'code' cannot be null.");
        }

        return create.selectFrom(TDiagCodes.T_DIAG_CODES).where(TDiagCodes.T_DIAG_CODES.CODE_VALUE.equal(code)).fetchOne();
    }

    /**
     * Searches for charges based on criteria
     *
     * @param criteria
     * @return List<LookupChargeMasterResult>
     */
    public List<DiagnoseResult> searchForCharges(List<SearchCriteria> criteria) {
        if (criteria == null) {
            throw new IllegalArgumentException("Input parameter 'criteria' cannot be null.");
        }

        SelectQuery query = create.selectQuery();
        query.addSelect(TDiagCodes.T_DIAG_CODES.CODE_VALUE.as("diagCode"), TDiagCodes.T_DIAG_CODES.DESCRIPTION);
        query.addFrom(TDiagCodes.T_DIAG_CODES);

        for (SearchCriteria one : criteria) {

            SearchTypeEnum typeCheck = one.searchType;
            String valueCheck = one.value.trim();
            Field<String> field = one.field;

            if (null != typeCheck) {
                switch (typeCheck) {
                    case EQUALS: {
                        Comparator comparator = Comparator.EQUALS;
                        query.addConditions(one.field.compare(comparator, valueCheck));
                        break;
                    }
                    case BEGINS_WITH: {
                        Comparator comparator = Comparator.LIKE;
                        String value = valueCheck + "%";
                        query.addConditions(field.compare(comparator, value));
                        break;
                    }
                    case ENDS_WITH: {
                        Comparator comparator = Comparator.LIKE;
                        String value = "%" + valueCheck;
                        query.addConditions(field.compare(comparator, value));
                        break;
                    }
                    case CONTAINS: {
                        Comparator comparator = Comparator.LIKE;
                        String value = "%" + valueCheck + "%";
                        query.addConditions(field.compare(comparator, value));
                        break;
                    }
                    default:
                        break;
                }
            }
        }

        // if no criteria were specified, return all records, limit 500
        query.addConditions(TDiagCodes.T_DIAG_CODES.ICD10.isTrue());
        query.addLimit(500);

        return query.fetchInto(DiagnoseResult.class);
    }
}
