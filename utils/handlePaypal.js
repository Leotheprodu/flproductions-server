const { PAYPAL_API, CLIENT, SECRET } = require('../config/paypal');
const axios = require('axios');

const get_access_token = async () => {
    const params = 'grant_type=client_credentials';
    const auth = `${CLIENT}:${SECRET}`;
    const {
        data: { access_token },
    } = await axios.post(`${PAYPAL_API}/v1/oauth2/token`, params, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${Buffer.from(auth).toString('base64')}`,
        },
    });
    return access_token;
};

const capturePayment = async (orderId) => {
    const access_token = await get_access_token();
    const url = `${PAYPAL_API}/v2/checkout/orders/${orderId}/capture`;
    const response = await axios.post(
        url,
        {},
        {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        }
    );
    console.log(response);
    return response;
};

module.exports = { get_access_token, capturePayment };
