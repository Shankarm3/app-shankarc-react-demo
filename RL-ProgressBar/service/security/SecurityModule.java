package com.operasolutions.rl.service.security;

import com.google.inject.AbstractModule;

public class SecurityModule extends AbstractModule {

	@Override
	protected void configure() {
		bind(SecurityResource.class);
	}
}