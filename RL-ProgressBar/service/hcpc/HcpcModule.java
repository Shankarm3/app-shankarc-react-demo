package com.operasolutions.rl.service.hcpc;

import com.google.inject.AbstractModule;

public class HcpcModule extends AbstractModule {

	@Override
	protected void configure() {
		bind(HcpcResource.class);		
	}
}