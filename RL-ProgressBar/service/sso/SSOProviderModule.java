package com.operasolutions.rl.service.sso;

import com.google.inject.AbstractModule;

public class SSOProviderModule extends AbstractModule {

	@Override
	protected void configure() {
		bind(SSOProviderResource.class);
	}
}