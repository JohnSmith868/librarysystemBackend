var express = require('express');
var router = express.Router();
var pool = require('../mysql');
var jwt = require('jsonwebtoken');

//show user's bookings (appointments)
router.get('/', function (req, res, next) {
    var sql = "select borrowrecord.borrowid, borrowrecord.borrowdate, borrowrecord.returndate, books.bookname, books.author, books.ISBN from books, borrowrecord where borrowrecord.normaluserid=? and borrowrecord.bookid = books.bookid;"
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


module.exports = router;