var express = require('express');
var router = express.Router();
var pool = require('../mysql');
var jwt = require('jsonwebtoken');


router.get('/', function (req, res, next) {
    var sql = "select apointment.apointid, apointment.status, apointment.apointdate,  books.bookid, apointment.deadline, books.bookname, books.ISBN, books.author from apointment,books where apointment.normaluserid = ? and apointment.bookid = books.bookid;";
    let token = req.headers['authorization'];

    var normaluserid = null;

    if (token.startsWith('Bearer ')) {
        // Remove Bearer from string
        token = token.slice(7, token.length);
        console.log(token);
    }

    try {
        jwt.verify(token, "goodmorning", (err, decoded) => {
            normaluserid = decoded.otherid;


        })

        pool.query(sql, [normaluserid], (err, rows) => {

            res.send(rows);
        });
    } catch (error) {
        console.log(error);
        res.send({ "succeed": false });

    }



});

router.delete('/:appointmentid', (req, res, next) => {
    var deletesql = "DELETE FROM apointment WHERE apointid = ? and normaluserid = ?;";
    var updatebookstatus = "UPDATE books SET status = 'available' where bookid=?";
    let token = req.headers['authorization'];
    var normaluserid = null;
    var appointmentid = req.params.appointmentid;
    var bookid = req.body.bookid;
    if (token.startsWith('Bearer ')) {
        // Remove Bearer from string
        token = token.slice(7, token.length);
        console.log(token);
    }

    try {
        jwt.verify(token, "goodmorning", (err, decoded) => {
            normaluserid = decoded.otherid;


        })

        pool.query(deletesql, [appointmentid, normaluserid], (err, rows) => {
            if (!err&&rows.affectedRows==1) {
                pool.query(updatebookstatus,[bookid],(err,rows)=>{
                    if(!err){
                        res.send({ "succeed": true });
                    }else{
                        res.send({ "succeed": false });
                    }
                });
                
            }else{
                res.send({ "succeed": false });
            }

        });
    } catch (error) {
        console.log(error);
        res.send({ "succeed": false });

    }
});

module.exports = router;
