const { handleHttpError } = require("../utils/handleError")

const checkRoles = (roles) => (req, res, next) => {
    try {
        const rolesByUser = req.session.roles;
        const checkRole1 = rolesByUser.includes(1);

        if (!checkRole1) return handleHttpError(res, 'USER_NOT_EMAIL_VERIFIED', 403);

        const checkValueRol = roles.some((rolSingle) => rolesByUser.includes(rolSingle));

        if (!checkValueRol) return handleHttpError(res, 'USER_NOT_PERMISSIONS', 403);
        
        next();

    } catch (error) {
        console.log(error);
        handleHttpError(res, 'ERROR_PERMISSIONS', 403);
    }

}

module.exports = { checkRoles }