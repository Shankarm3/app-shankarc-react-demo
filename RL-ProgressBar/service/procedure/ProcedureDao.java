package com.operasolutions.rl.service.procedure;

import java.util.List;

import org.jooq.FactoryOperations;

import com.google.inject.Inject;
import com.operasolutions.rl.schema.tables.TProcCodes;
import com.operasolutions.rl.schema.tables.records.TProcCodesRecord;

/**
 * ProcedureDao
 * 
 * @author Marcel Bodnar
 */
public class ProcedureDao {
	private final FactoryOperations create;

	@Inject
	public ProcedureDao(FactoryOperations jooqFactory) {
		this.create = jooqFactory;
	}
	
	/**
	 * All procedures
	 *
	 * @return List of all procedures
	 */
	public List<TProcCodesRecord> getAllProcedures() {
		return create.selectFrom(TProcCodes.T_PROC_CODES).fetch();
	}

	/**
	 * Procedure by code
	 *
	 * @param code
	 * @return TProcCodesRecord
	 */
	public TProcCodesRecord getProcedureByCode(String code) {
		if (code == null) throw new IllegalArgumentException("Input parameter 'code' cannot be null.");

		return create.selectFrom(TProcCodes.T_PROC_CODES).where(TProcCodes.T_PROC_CODES.CODE_VALUE.equal(code)).fetchOne();
	}
}