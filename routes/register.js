var express = require('express');
var router = express.Router();
var pool = require('../mysql');


/* register */
router.post('/', function (req, res, next) {
    var sql = "INSERT INTO user(email,password,usertype) values(?,sha1(?),'normaluser');";
    var insertNormaluserSql = "INSERT INTO normaluser(userid) values(?);";

    try {
        pool.query(sql, [req.body.username, req.body.password], (err, results) => {
            if(!err){
                var userid = results.insertId;
                pool.query(insertNormaluserSql,[userid],(err,results)=>{
                    if(!err){
                        res.send({"succeed":true});
                    }else{
                        res.send({"succeed":false});
                    }
                });
            }else{
                res.send({"succeed":false});
            }

        });

    } catch (error) {
        console.log(error);
        res.send({"succeed":false});

    }


});

module.exports = router;
