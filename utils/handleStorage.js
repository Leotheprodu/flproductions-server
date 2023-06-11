const multer = require('multer');
/* const sharp = require('sharp'); */
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const pathStorage = `${__dirname}/../storage`;
        cb(null, pathStorage);
    },
    filename: function (req, file, cb) {
        const ext = file.originalname.split('.').pop();
        const filename = `${Date.now()}.${ext}`;
        cb(null, filename);
    },
});
/**
 *
 * @param {[mp3,zip,jpg]} allowedExtensions
 * @returns
 */
const uploadMiddleware = function (allowedExtensions) {
    const fileSizeLimits = {
        mp3: 10 * 1024 * 1024, // 10 MB
        zip: 100 * 1024 * 1024, // 100 MB
        jpg: 1 * 1024 * 1024, // 1 MB
    };

    return multer({
        storage,
        limits: { fileSize: fileSizeLimits['jpg'] }, // 1 MB by default
        fileFilter: function (req, file, cb) {
            const ext = file.originalname.split('.').pop();
            if (!allowedExtensions.includes(ext)) {
                const error = new Error('Tipo de archivo no permitido');
                error.code = 'INVALID_FILE_TYPE';
                return cb(error);
            }
            const fileSizeLimit = fileSizeLimits[ext];
            if (fileSizeLimit) {
                req.fileSizeLimit = fileSizeLimit;
            }
            if (file.size > fileSizeLimit) {
                const error = new Error(
                    'El tamaño del archivo excede el límite permitido'
                );
                error.code = 'FILE_SIZE_LIMIT_EXCEEDED';
                return cb(error);
            }
            cb(null, true);
        },
    });
};

const resizeImage = async (req, res, next) => {
    if (!req.file) {
        return next();
    }
    try {
        const { filename } = req.file;
        const outputPath = path.resolve(
            req.file.destination,
            `${req.session.user.id}`
        );

        // Creamos la carpeta si no existe
        if (!fs.existsSync(outputPath)) {
            fs.mkdirSync(outputPath);
        }
        const { name } = path.parse(filename);
        const newFilename = `${name}.webp`;

        /*  await sharp(req.file.path)
            .resize(800)
            .webp({ quality: 80 })
            .toFile(path.resolve(outputPath, newFilename)); */
        fs.unlinkSync(req.file.path);
        req.file.filename = newFilename;
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = { uploadMiddleware, resizeImage };
