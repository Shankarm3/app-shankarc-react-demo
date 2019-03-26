package com.operasolutions.rl.service.physician.hospital;

import com.google.inject.AbstractModule;

public class PhysicianHospitalModule extends AbstractModule {

	@Override
	protected void configure() {
	    bind(PhysicianHospitalResource.class);
	}
}