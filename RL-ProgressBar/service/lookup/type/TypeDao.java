package com.operasolutions.rl.service.lookup.type;

import java.util.List;

import org.jooq.FactoryOperations;

import com.google.inject.Inject;
import com.operasolutions.rl.schema.tables.TTypeLookup;
import com.operasolutions.rl.schema.tables.records.TTypeLookupRecord;

/**
 * TypeDao
 * 
 * @author Nirmal Kumar
 */
public class TypeDao {
	private final FactoryOperations create;

	@Inject
	public TypeDao(FactoryOperations jooqFactory) {
		this.create = jooqFactory;
	}

	/**
	 * Gets all types
	 * 
	 * @param lookupType
	 * @return All lookup values 
	 */
	public List<TTypeLookupRecord> getAllTypes(String lookupType) {
		if (lookupType == null) throw new IllegalArgumentException("Input parameter 'lookupType' cannot be null.");

		return create.selectFrom(TTypeLookup.T_TYPE_LOOKUP)
				.where(TTypeLookup.T_TYPE_LOOKUP.LOOKUP_TYPE.equal(lookupType))
				.orderBy(TTypeLookup.T_TYPE_LOOKUP.RANK_ORDER)
				.fetch();
	}

	/**
	 * Gets type information
	 * 
	 * @param lookupType
	 * @param lookupValue
	 * @return Data for one type 
	 */
	public TTypeLookupRecord getTypeAndValueData(String lookupType, String lookupValue) {
		if (lookupType == null) throw new IllegalArgumentException("Input parameter 'lookupType' cannot be null.");
		if (lookupValue == null) throw new IllegalArgumentException("Input parameter 'lookupValue' cannot be null.");
		
		return create.selectFrom(TTypeLookup.T_TYPE_LOOKUP)
				.where(TTypeLookup.T_TYPE_LOOKUP.LOOKUP_TYPE.equal(lookupType))
				.and(TTypeLookup.T_TYPE_LOOKUP.VALUE.equal(lookupValue))
				.fetchOne();
	}
}