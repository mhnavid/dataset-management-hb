const express    = require('express');
const router     = express.Router();
const minio      = require('minio');

const minioHost         = process.env.MINIO_HOST        || '192.168.99.100';
const minioPort         = process.env.MINIO_PORT        ||  9000;
const minioUseSSL       = process.env.MINIO_SSL         ||  false;
const minioAccessKey    = process.env.MINIO_ACCESSKEY   || 'minioadmin';
const minioSecrectKey   = process.env.MINIO_SECRETKEY   || 'minioadmin';

const client = new minio.Client({
    endPoint: minioHost,
    port: minioPort,
    useSSL: minioUseSSL,
    accessKey: minioAccessKey,
    secretKey: minioSecrectKey
});

router.get('/api/presignedUrl', (req, res) => {
    client.presignedPutObject('nvd', req.query.name, (err, url) => {
        if (err){
            return res
                .status(400)
                .json({
                    error: true,
                    message: "Url not generated."
                });
        } else {
            return res
                .status(200)
                .json({
                    error: false,
                    url: url
                });
        }
    })
});

module.exports = router;
