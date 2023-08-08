const CLIENT = process.env.PAYPAL_CLIENT;
const SECRET = process.env.PAYPAL_SECRET;
const PAYPAL_API =
    process.env.ENV === 'production'
        ? process.env.PAYPAL_API_PROD
        : process.env.PAYPAL_API_DEV;
const paypalFeePercent = 0.054; //%
const paypalFeeDolar = 0.3; //USD
const AUTH = { auth: { username: CLIENT, password: SECRET } };

module.exports = {
    PAYPAL_API,
    AUTH,
    paypalFeePercent,
    paypalFeeDolar,
    CLIENT,
    SECRET,
};
