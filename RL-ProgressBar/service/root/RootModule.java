package com.operasolutions.rl.service.root;

import com.google.inject.AbstractModule;

public class RootModule extends AbstractModule {

	@Override
	protected void configure() {
	    bind(RootResource.class);		
	}
}