package com.operasolutions.rl.service.hcpc;

import java.util.List;

import org.jooq.FactoryOperations;

import com.google.inject.Inject;
import com.operasolutions.rl.schema.tables.THcpcCodes;
import com.operasolutions.rl.schema.tables.records.THcpcCodesRecord;

/**
 * HcpcDao
 * 
 * @author Marcel Bodnar
 */
public class HcpcDao {

	private final FactoryOperations create;

	@Inject
	public HcpcDao(FactoryOperations jooqFactory) {
		this.create = jooqFactory;
	}

	/**
	 * All hcpcs
	 *
	 * @return List of hcpc codes
	 */
	public List<THcpcCodesRecord> getAllHcpcs() {
		return create.selectFrom(THcpcCodes.T_HCPC_CODES).fetch();
	}

	/**
	 * Hcpc by code
	 *
	 * @param code
	 * @return THcpcCodesRecord
	 */
	public THcpcCodesRecord getHcpcByCode(String code) {
		if (code == null) throw new IllegalArgumentException("Input parameter 'code' cannot be null.");

		return create.selectFrom(THcpcCodes.T_HCPC_CODES).where(THcpcCodes.T_HCPC_CODES.CODE_VALUE.equal(code)).fetchOne();
	}
}