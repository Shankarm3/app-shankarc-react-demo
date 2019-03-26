package com.operasolutions.rl.service.user;

import com.google.inject.AbstractModule;

public class ResetPasswordModule extends AbstractModule {

	@Override
	public void configure()
	{
		bind(ResetPasswordResource.class);
	}
}
