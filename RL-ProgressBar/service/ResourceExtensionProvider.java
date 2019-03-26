package com.operasolutions.rl.service;

import java.util.List;

import javax.ws.rs.core.UriInfo;

/**
 * ResourceExtensionProvider
 *
 * @author Adam Lewis
 */
public interface ResourceExtensionProvider {

    List<Href> getExtensionList(UriInfo context, List<String> parameters);
}
