var express = require('express');
var router = express.Router();
var pool = require('../mysql');
var jwt = require('jsonwebtoken');

router.post('/', function (req, res, next) {

    let token = req.headers['authorization'];
    if (token.startsWith('Bearer ')) {
        // Remove Bearer from string
        token = token.slice(7, token.length);
    }
    var data = {
        "isLogin": false
    };
    if (token) {

        console.log("this is "+token);
        jwt.verify(token, "goodmorning", (err, decoded) => {
            if (err) {
                res.send(JSON.stringify(data));
            } else {
                var newToken = jwt.sign({ 
                    "userid":decoded.userid,
                    "usertype":decoded.usertype,
                    "otherid":decoded.otherid
                 }, "goodmorning", { expiresIn: 60*60 });
                data = {
                    "isLogin": true,
                    "userid": decoded.userid,
                    "usertype":decoded.usertype,
                    "otherid":decoded.otherid,
                    "token": newToken
                }
                console.log("this is new  "+newToken);
                res.send(JSON.stringify(data));

            }
        });
    }




});

module.exports = router;
