const { role_usersModel } = require('../models');

const refreshUserRoles = async (user_id) => {
    const results = await role_usersModel.findAll({
        where: { user_id },
    });
    const roles = results
        .map((obj) => obj.role_id)
        .filter((val) => val !== undefined);
    if (results === null || !roles.includes(2)) {
        await role_usersModel.create({
            user_id,
            role_id: 2,
        });
        const results2 = await role_usersModel.findAll({
            where: { user_id },
        });

        return results2
            .map((obj) => obj.role_id)
            .filter((val) => val !== undefined);
    } else {
        return results
            .map((obj) => obj.role_id)
            .filter((val) => val !== undefined);
    }
};

module.exports = { refreshUserRoles };
