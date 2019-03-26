package com.operasolutions.rl.service.user;

import java.sql.Timestamp;
import java.util.List;

import org.jooq.FactoryOperations;
import org.jooq.SelectQuery;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.inject.Inject;
import com.operasolutions.rl.schema.enums.TUserRole;
import com.operasolutions.rl.schema.tables.TUser;
import com.operasolutions.rl.schema.tables.TUserTimeZone;
import com.operasolutions.rl.schema.tables.records.TUserRecord;

/**
 * UserDao
 *
 * @author Nirmal Kumar
 * @author Nirmal Kumar
 */
public class UserDao {

    private final FactoryOperations create;
    protected static final Logger log = LoggerFactory.getLogger(UserDao.class);

    @Inject
    public UserDao(FactoryOperations jooqFactory) {
        this.create = jooqFactory;
    }

    /**
     * Gets all users
     *
     * @param roleEnum
     * @return Lists of users
     */
    public List<TUserRecord> getAllUsers(TUserRole roleEnum, boolean isUserManagement) {
        SelectQuery query = create.selectQuery();
        query.addFrom(TUser.T_USER);
        query.addOrderBy(TUser.T_USER.F_NAME, TUser.T_USER.L_NAME);

        // add conditions for active user
        if (isUserManagement == Boolean.FALSE) {
            query.addConditions(TUser.T_USER.ENABLED.eq(Boolean.TRUE));
        }
        if (roleEnum != null) {
            query.addConditions(TUser.T_USER.U_TYPE.equal(roleEnum));
        }

        return query.fetchInto(TUserRecord.class);
    }

    /**
     * Stores user
     *
     * @param user
     */
    public String storeUser(TUserRecord user) {
        if (user == null) {
            throw new IllegalArgumentException("Input parameter 'user' cannot be null.");
        }

        user.attach(create);
        user.store();

        return user.getUserId();
    }

    /**
     * Gets user by userId
     *
     * @param userId
     * @return TUserRecord
     */
    public TUserRecord getUser(String userId) {
        if (userId == null) {
            throw new IllegalArgumentException("Input parameter 'userId' cannot be null.");
        }

        return create.selectFrom(TUser.T_USER)
                .where(TUser.T_USER.USER_ID.equal(userId))
                .fetchOne();
    }

    /**
     * Deletes/disables user by userId
     *
     * @param userId
     * @return Number of updated records
     */
    public int deleteUser(String userId) {
        if (userId == null) {
            throw new IllegalArgumentException("Input parameter 'userId' cannot be null.");
        }

        return create.update(TUser.T_USER)
                .set(TUser.T_USER.ENABLED, Boolean.FALSE)
                .set(TUser.T_USER.UPDATE_TIME, new Timestamp(System.currentTimeMillis()))
                .where(TUser.T_USER.USER_ID.equal(userId))
                .execute();
    }

    List<UserResource.TimeZoneResult> getAllTimeZone() {
        return create.selectFrom(TUserTimeZone.T_USER_TIME_ZONE).fetchInto(UserResource.TimeZoneResult.class);
    }
}
