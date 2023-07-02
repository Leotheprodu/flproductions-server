/* const {
    songNameGenerator,
    FLPChatRecordingStudio,
} = require('../config/openAi'); */
const { handleHttpError } = require('../utils/handleError');
const { PAYPAL_API, AUTH } = require('../config/paypal');
const axios = require('axios');
/**
 * Obtener un detalle!
 * @param {*} req
 * @param {*} res

*/
const createOrder = async (req, res) => {
    try {
        const params = new URLSearchParams();
        params.append('grant_type', 'client_credentials');
        const order = {
            intent: 'CAPTURE',
            purchase_units: [
                {
                    amount: {
                        currency_code: 'USD',
                        value: '10',
                    },
                },
            ],
            application_context: {
                brand_name: 'FLProductions',
                landing_page: 'NO_PREFERENCE',
                user_action: 'PAY_NOW',
                return_url: `${process.env.PUBLIC_URL}/api/payments/capture-order`,
                cancel_url: `${process.env.PUBLIC_URL}/api/payments/cancel-order`,
            },
        };
        const {
            data: { access_token },
        } = await axios.post(`${PAYPAL_API}/v1/oauth2/token`, params, AUTH);
        const response = await axios.post(
            `${PAYPAL_API}/v2/checkout/orders`,
            order,
            {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            }
        );
        console.log(response.data);
        res.send({ response: response.data, access_token: access_token });
    } catch (error) {
        console.log(error);
        handleHttpError(res, 'Hubo un problema al crear orden de compra');
    }
};
const captureOrder = async (req, res) => {
    try {
        res.send({ message: 'captureOrder' });
    } catch (error) {
        console.log(error);
        handleHttpError(res, 'Hubo un problema al capturar orden de compra');
    }
};
const cancelPayment = async (req, res) => {
    try {
        res.send({ message: 'cancelPayment' });
    } catch (error) {
        console.log(error);
        handleHttpError(res, 'Hubo un problema al cancelar el pago');
    }
};

module.exports = {
    createOrder,
    captureOrder,
    cancelPayment,
};
