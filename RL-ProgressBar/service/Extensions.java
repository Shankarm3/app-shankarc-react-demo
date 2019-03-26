package com.operasolutions.rl.service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import javax.ws.rs.core.UriInfo;

/**
 * Extensions
 *
 * @author Adam Lewis
 */
public final class Extensions {

    private Extensions() {
    }

    public static List<Href> consolidate(UriInfo context, Collection<ResourceExtensionProvider> providers, List<String> parameters) {
        if (providers == null) {
            return Collections.emptyList();
        }

        List<Href> ret = new ArrayList<Href>(providers.size());
        for (ResourceExtensionProvider provider : providers) {
            ret.addAll(provider.getExtensionList(context, parameters));
        }

        return Collections.unmodifiableList(ret);
    }

    public static ExtensionPoint point(Class<?> extensionPoint) {
        return new ExtensionPointImpl(extensionPoint);
    }
}
