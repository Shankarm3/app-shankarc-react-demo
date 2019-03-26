package com.operasolutions.rl.service.procedure;

import com.google.inject.AbstractModule;

public class ProcedureModule extends AbstractModule {

	@Override
	protected void configure() {
		bind(ProcedureResource.class);
	}
}