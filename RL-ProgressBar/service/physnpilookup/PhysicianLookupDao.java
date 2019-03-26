/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.operasolutions.rl.service.physnpilookup;

import com.operasolutions.rl.service.physician.charges.PhysicianLookupChargeMasterResource;
import java.util.List;
import org.jooq.FactoryOperations;
import com.google.inject.Inject;
import com.operasolutions.rl.schema.tables.TPhysMaster;
import com.operasolutions.rl.schema.tables.records.TPhysMasterRecord;
import com.operasolutions.rl.service.physnpilookup.PhysicianLookupResource.TPhysMasterRepresentation;
import com.operasolutions.rl.service.physician.charges.SearchTypeEnum;
import org.jooq.Comparator;
import org.jooq.Field;
import org.jooq.SelectQuery;

/**
 * DiagnoseDao
 *
 * @author nirmal.kumar
 */
public class PhysicianLookupDao {

    private final FactoryOperations create;

    @Inject
    public PhysicianLookupDao(FactoryOperations jooqFactory) {
        this.create = jooqFactory;
    }

    /**
     * All diagnoses
     *
     * @return List of diagnoses
     */
    public List<TPhysMasterRecord> getAllPhysicianNpi() {
        return create.selectFrom(TPhysMaster.T_PHYS_MASTER).fetch();
    }

    /**
     * Diagnose by code
     *
     * @param code
     * @return TDiagCodesRecord
     */
    public TPhysMasterRecord getPhysicianNpi(String code) {
        if (code == null) {
            throw new IllegalArgumentException("Input parameter 'code' cannot be null.");
        }

        return create.selectFrom(TPhysMaster.T_PHYS_MASTER).where(TPhysMaster.T_PHYS_MASTER.CODE.equal(code)).fetchOne();
    }

    /**
     * Searches for charges based on criteria
     *
     * @param criteria
     * @return List<LookupChargeMasterResult>
     */
    public List<TPhysMasterRepresentation> searchForCharges(List<PhysicianLookupChargeMasterResource.SearchCriteria> criteria) {
        if (criteria == null) {
            throw new IllegalArgumentException("Input parameter 'criteria' cannot be null.");
        }

        SelectQuery query = create.selectQuery();
        query.setDistinct(true);
        query.addFrom(TPhysMaster.T_PHYS_MASTER);

        for (PhysicianLookupChargeMasterResource.SearchCriteria one : criteria) {

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
        query.addConditions(TPhysMaster.T_PHYS_MASTER.NPI.isNotNull());
        query.addConditions(TPhysMaster.T_PHYS_MASTER.NPI.ne(""));
        query.addConditions(TPhysMaster.T_PHYS_MASTER.IS_EMPLOYED.isTrue());
        query.addLimit(500);

        return query.fetchInto(TPhysMasterRepresentation.class);

    }
}
