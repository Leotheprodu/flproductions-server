/* const {
    songNameGenerator,
    FLPChatRecordingStudio,
} = require('../config/openAi'); */
const { handleHttpError } = require('../utils/handleError');
const { PAYPAL_API } = require('../config/paypal');
const axios = require('axios');
const { get_access_token, capturePayment } = require('../utils/handlePaypal');
/**
 * Obtener un detalle!
 * @param {*} req
 * @param {*} res

*/
const createOrder = async (req, res) => {
    try {
        const access_token = await get_access_token();
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
                return_url: `${process.env.PUBLIC_URL}/api/payment/capture-order`,
                cancel_url: `${process.env.PUBLIC_URL}/api/payment/cancel-order`,
            },
        };
        const response = await axios.post(
            `${PAYPAL_API}/v2/checkout/orders`,
            order,
            {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            }
        );
        res.send({ response: response.data });
    } catch (error) {
        console.log(error);
        handleHttpError(res, 'Hubo un problema al crear orden de compra');
    }
};
const captureOrder = async (req, res) => {
    try {
        const { token } = req.query;
        console.log(token);
        const response = await capturePayment(token);
        res.send({ respuesta: response.data });
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
