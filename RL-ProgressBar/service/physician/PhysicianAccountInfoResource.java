package com.operasolutions.rl.service.physician;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.net.URI;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.UriInfo;
import javax.ws.rs.core.Response.Status;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authz.AuthorizationException;
import org.apache.shiro.authz.annotation.RequiresAuthentication;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.inject.Inject;
import com.operasolutions.rl.auth.AuthUtils;
import com.operasolutions.rl.common.DateFormatConstant;
import com.operasolutions.rl.schema.enums.TPermission;

/**
 * PhysicianAccountInfoResource
 *
 * @author Nirmal Kumar
 * @author Nirmal Kumar
 */
@Path(PhysicianAccountInfoResource.URL_ACCOUNT_INFO)
@Produces(MediaType.APPLICATION_JSON)
@RequiresAuthentication
public class PhysicianAccountInfoResource {

    public static final String URL_ACCOUNT_INFO = "physicianAccountInfo";
    protected static final Logger log = LoggerFactory.getLogger(PhysicianAccountInfoResource.class);

    private final PhysicianAccountInfoDao accountInfoDao;

    @Context
    UriInfo uriInfo;

    @Inject
    public PhysicianAccountInfoResource(PhysicianAccountInfoDao accountInfoDao) {
        this.accountInfoDao = accountInfoDao;
    }

    @GET
    public AccountInfoRepresentation getAccountInfo(@QueryParam("hospitalId") String hospitalId, @QueryParam(value = "costCenter") String costCenter, @QueryParam("auditorId") List<String> auditorList) {

        log.debug("getAccountInfo() - start, hospitalId = " + hospitalId);

        if (hospitalId == null || hospitalId.trim().isEmpty()) {
            throw new WebApplicationException(Status.BAD_REQUEST);
        }

        Boolean all = null;
        if (SecurityUtils.getSubject().isPermitted(TPermission.READ_ALL_ACCOUNTS_INFO.getPermission())) {
            all = true;
        } else if (SecurityUtils.getSubject().isPermitted(TPermission.READ_ACCOUNT_INFO.getPermission())) {
            all = false;
        } else {
            throw new AuthorizationException();
        }

        long completed;
        long completedCurrentMonth;
        long remaining;
        long completedLastMonth;
        long remainingLastMonth;
        completed = accountInfoDao.getCurrentMonthCompleted(hospitalId, AuthUtils.getLoggedUserName(), all, costCenter, auditorList);
        completedCurrentMonth = accountInfoDao.getCurrentMonthCompleted1(hospitalId, AuthUtils.getLoggedUserName(), all, costCenter, auditorList);
        remaining = accountInfoDao.getCurrentMonthRemaining(hospitalId, AuthUtils.getLoggedUserName(), all, costCenter, auditorList);
        AccountInfoResult accountInfoResult = accountInfoDao.getCurrentMonthHitCountHitValue(hospitalId, AuthUtils.getLoggedUserName(), all, costCenter, auditorList);
        completedLastMonth = accountInfoDao.getLastMonthCompleted(hospitalId, AuthUtils.getLoggedUserName(), all, costCenter, auditorList);
        remainingLastMonth = accountInfoDao.getLastMonthRemaining(hospitalId, AuthUtils.getLoggedUserName(), all,costCenter, auditorList);
        AccountInfoResult accountInfoResultLastMonth = accountInfoDao.getLastMonthHitCountHitValue(hospitalId, AuthUtils.getLoggedUserName(), all, costCenter, auditorList);
        return getRepresentationNew(accountInfoResult, completed,completedCurrentMonth, remaining, accountInfoResultLastMonth, completedLastMonth, remainingLastMonth);
    }

    /**
     * Gets representation
     *
     * @param previous
     * @param current
     * @param completed
     * @param remanining
     * @return AccountInfoRepresentation
     */
    private AccountInfoRepresentation getRepresentationNew(AccountInfoResult current, long completed,long completedCurrentMonth, long remanining, AccountInfoResult previous, long completedLastMonth, long remaniningLastMonth) {
        AccountInfoRepresentation result = new AccountInfoRepresentation();
        result.total = completed + remanining;
        long totalAccount=completedCurrentMonth + remanining;
        result.completed = completed;
        if (previous != null) {
            long lastMonthTotal = completedLastMonth + remaniningLastMonth;
            if (lastMonthTotal != 0) {
                result.prevAmount = previous.hitValue != null ? previous.hitValue.setScale(0, RoundingMode.HALF_UP) : new BigDecimal(0);
                result.prevReviewRate = completedLastMonth != 0 ? new BigDecimal(completedLastMonth).multiply(new BigDecimal(100)).divide(new BigDecimal(lastMonthTotal), 0, RoundingMode.HALF_UP) : new BigDecimal(0);
                result.prevHitRate = (previous.hitCount != null && completedLastMonth != 0) ? previous.hitCount.multiply(new BigDecimal(100)).divide(new BigDecimal(completedLastMonth), 0, RoundingMode.HALF_UP) : new BigDecimal(0);
            }
        }
        if (current != null) {
            if (result.total != 0) {
                result.currAmount = current.hitValue != null ? current.hitValue.setScale(0, RoundingMode.HALF_UP) : new BigDecimal(0);
                result.currReviewRate = completedCurrentMonth != 0 ? new BigDecimal(completedCurrentMonth).multiply(new BigDecimal(100)).divide(new BigDecimal(totalAccount), 0, RoundingMode.HALF_UP) : new BigDecimal(0);
                result.currHitRate = (current.hitCount != null && completedCurrentMonth != 0) ? current.hitCount.multiply(new BigDecimal(100)).divide(new BigDecimal(completedCurrentMonth), 0, RoundingMode.HALF_UP) : new BigDecimal(0);
            }
        }
        result.predDate = getMonthYearString();
        result.uri = userAccountInfoUri();

        return result;
    }

    protected URI userAccountInfoUri() {
        return uriInfo.getRequestUri();
    }

    /**
     * AccountInfo message class
     */
    public static class AccountInfoRepresentation {

        public URI uri;
        public long total;
        public long completed;
        public BigDecimal prevReviewRate = new BigDecimal(0);
        public BigDecimal prevHitRate = new BigDecimal(0);
        public BigDecimal prevAmount = new BigDecimal(0);
        public String predDate;
        public BigDecimal currReviewRate = new BigDecimal(0);
        public BigDecimal currHitRate = new BigDecimal(0);
        public BigDecimal currAmount = new BigDecimal(0);
    }

    /**
     * Gets previous month as string representation
     */
    public String getMonthYearString() {
        SimpleDateFormat dateFormat = new SimpleDateFormat(DateFormatConstant.MONTH_FULL_NAME_CHARACTERS);
        Calendar cal = Calendar.getInstance();
        cal.add(Calendar.MONTH, -1);
        String monthYearString = dateFormat.format(cal.getTime()) + " " + cal.get(Calendar.YEAR);

        return monthYearString;
    }

    /**
     * AccountInfoStatus result class
     */
    public static class AccountInfoResult {

        public BigDecimal hitCount;
        public BigDecimal hitValue;
    }
}
