const customHeader = (req, res, next) => {

    try {

        const apiKey = req.headers.api_key;
        if( apiKey === 'FLP-01'){
            next();
        } else{
            res.status(403).send({error: 'API KEY NO ES CORRECTA'})
        }

    } catch (error) {
        res.status(403).send({error: 'ALGO OCURRIO EN EL CUSTOM HEADER'});
    }
};


module.exports = customHeader