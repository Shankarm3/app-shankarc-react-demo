package com.operasolutions.rl.service.role;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authz.annotation.RequiresAuthentication;
import com.operasolutions.rl.schema.enums.TPermission;
import com.operasolutions.rl.schema.enums.TUserRole;

/**
 * RoleResource
 *
 * @author Nirmal Kumar
 */
@Path("/" + RoleResource.URL_ROLES)
@Produces(MediaType.APPLICATION_JSON)
@RequiresAuthentication
public class RoleResource {

    public static final String URL_ROLES = "roles";

    @GET
    public List<RoleRepresentation> getAllRoles() {

        SecurityUtils.getSubject().checkPermission(TPermission.READ_ALL_ROLES.getPermission());

        List<RoleRepresentation> result = new ArrayList<RoleRepresentation>();

        class MyComparator implements Comparator<TUserRole> {

            @Override
            public int compare(TUserRole o1, TUserRole o2) {
                return o1.getUType().compareTo(o2.getUType());
            }
        }

        List<TUserRole> roles = Arrays.asList(TUserRole.values());
        Collections.sort(roles, new MyComparator());

        for (TUserRole oneRole : roles) {
            RoleRepresentation one = new RoleRepresentation();
            one.roleName = oneRole.getUType();
            result.add(one);
        }

        return result;
    }

    /**
     * Message class
     */
    public static class RoleRepresentation {

        public String roleName;
    }
}
