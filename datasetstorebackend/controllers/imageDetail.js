const express        = require('express');
const router         = express.Router();
const {ImageDetails} = require('../utils/mongo');

router.post('/api/image-detail', async(req, res, next) => {
    let {
        newFileName,
        originalFileName,
        relativePath,
        format,
        size,
        shape,
        lastModifiedDate,
        jobId
    } = req.body;

    let insertImageDetails = new ImageDetails({
        newFileName, originalFileName, relativePath, format, size, shape, lastModifiedDate, jobId
    }) ;
    insertImageDetails.save()
        .then(() => {
            return res
                .status(200)
                .json({
                    error: false,
                    message:"Database updated."
                });
        })
        .catch(() => {
            return res
                .status(401)
                .json({
                    error: true,
                    message: "Database error."
                });
        });
});

module.exports = router;
