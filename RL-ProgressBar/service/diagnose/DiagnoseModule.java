package com.operasolutions.rl.service.diagnose;

import com.google.inject.AbstractModule;

public class DiagnoseModule extends AbstractModule {

	@Override
	protected void configure() {
		bind(DiagnoseResource.class);		
	}
}