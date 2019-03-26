package com.operasolutions.rl.service.facilitypeformance;

import com.google.inject.AbstractModule;

public class FacilityPerformanceModule extends AbstractModule {

	@Override
	protected void configure() {
		bind(FacilityPerformanceResource.class);		
	}
}