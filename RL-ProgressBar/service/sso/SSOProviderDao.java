package com.operasolutions.rl.service.sso;

import java.util.List;

import org.jooq.FactoryOperations;

import com.google.inject.Inject;
import com.operasolutions.rl.schema.enums.TUserRole;
import com.operasolutions.rl.schema.tables.TSsoToken;
import com.operasolutions.rl.schema.tables.records.TSsoTokenRecord;

/**
 * SSOProviderDao
 *
 * @author Nirmal Kumar
 */
public class SSOProviderDao {

    private final FactoryOperations create;

    @Inject
    public SSOProviderDao(FactoryOperations jooqFactory) {
        this.create = jooqFactory;
    }

    /**
     * Gets whole SsoTokenRecord for given token
     *
     * @param token
     * @return List<SsoTokenRecord>
     */
    public List<TSsoTokenRecord> getUserName(String token) {

        return create.selectFrom(TSsoToken.T_SSO_TOKEN)
                .where(TSsoToken.T_SSO_TOKEN.TOKEN.equal(token))
                .fetchInto(TSsoTokenRecord.class);
    }

    /**
     * Gets whole SsoTokenRecord for given userId
     *
     * @param userId
     * @return SsoTokenRecord
     */
    public TSsoTokenRecord getSSOToken(String userId) {

        return create.selectFrom(TSsoToken.T_SSO_TOKEN)
                .where(TSsoToken.T_SSO_TOKEN.USER_ID.equal(userId))
                .fetchOne();
    }

    /**
     * Saves new token into DB, returns number of created results = 1
     *
     * @param userName
     * @param token
     * @return number of inserted records
     */
    public int saveNewToken(String userName, String token) {
        return create.insertInto(TSsoToken.T_SSO_TOKEN)
                .set(TSsoToken.T_SSO_TOKEN.USER_ID, userName)
                .set(TSsoToken.T_SSO_TOKEN.TOKEN, token)
                .execute();
    }

}
