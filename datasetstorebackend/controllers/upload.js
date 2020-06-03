const express    = require('express');
const router     = express.Router();
const { v4: uuidv4 } = require('uuid');

router.post('/api/upload', async(req, res, next) => {
    console.log(uuidv4());
    if (!req.files || Object.keys(req.files).length === 0) {
        return res
            .status(400)
            .json({
                error: true,
                message: "No files were uploaded."
            });
    }
    let uploadedFile = req.files.file;

    await uploadedFile.mv(__dirname + "/../public/images/" + req.files.file.name, function (err) {
        if(err){
            return res
                .status(500)
                .json({
                    error: true,
                    message: err
                });
        } else {
            return res
                .status(200)
                .json({
                    error: false,
                    message: "Upload successful."
                });
        }
    });
});


module.exports = router;
