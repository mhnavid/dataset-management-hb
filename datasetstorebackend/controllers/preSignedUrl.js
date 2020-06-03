const express    = require('express');
const router     = express.Router();
const minio      = require('minio');

let client = new minio.Client({
    endPoint: '192.168.99.100',
    port: 9000,
    useSSL: false,
    accessKey: 'minioadmin',
    secretKey: 'minioadmin'
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
