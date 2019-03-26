package com.operasolutions.rl.service.auditorperformance;

import com.google.inject.AbstractModule;

public class AuditorPerformanceModule extends AbstractModule {
	
	@Override
	protected void configure() {
		bind(AuditorPerformanceResource.class);
	}
}