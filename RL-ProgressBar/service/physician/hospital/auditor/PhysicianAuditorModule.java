package com.operasolutions.rl.service.physician.hospital.auditor;

import com.google.inject.AbstractModule;

public class PhysicianAuditorModule extends AbstractModule {

	@Override
	protected void configure() {
	    bind(PhysicianAuditorResource.class);
	}
}