const express    = require('express');
const router     = express.Router();
const jwt        = require('jsonwebtoken');

const signingKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkhlYWRCbG9ja3MifQ.ugZlzQKpe0cmFNwEcDQ0sat9fWfvTYWPvdLeioXyqyQ";

router.post('/api/verification', async(req, res, next) => {
    let {
        token
    } = req.body;
    await jwt.verify(token,signingKey,function(err,verifiedJwt){
        if(err){
            return res
                .status(400)
                .json({
                    error: true,
                    verification: false,
                    message: "Token verification failed."
                });
        }else{
            return res
                .status(200)
                .json({
                    error: false,
                    verification: true,
                    message: "Verification successful."
                });
        }
    });
})

module.exports = router;
