package com.operasolutions.rl.service.user;

import com.google.inject.AbstractModule;

public class UserModule extends AbstractModule {

	@Override
	protected void configure() {
	    bind(UserResource.class);		
	}
}