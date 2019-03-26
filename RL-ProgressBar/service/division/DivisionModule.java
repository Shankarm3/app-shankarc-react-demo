package com.operasolutions.rl.service.division;

import com.google.inject.AbstractModule;

public class DivisionModule extends AbstractModule {

	@Override
	protected void configure() {
	    bind(DivisionResource.class);
	}
}