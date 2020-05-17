var express = require('express');
var router = express.Router();
var pool = require('../mysql');
var jwt = require('jsonwebtoken');


router.post('/upload', function (req, res, next) {
    var sql = "insert into books(bookname,author,ISBN,status) values(?,?,?,?)";
    let token = req.headers['authorization'];
    var manageruserid = null;
    var usertype = null;
    if (token.startsWith('Bearer ')) {
        // Remove Bearer from string
        token = token.slice(7, token.length);
        console.log(token);
    }

    try {
        jwt.verify(token, "goodmorning", (err, decoded) => {
            manageruserid = decoded.otherid;
            usertype = decoded.usertype;

        })
        if (usertype == "manager") {
            pool.query(sql, [req.body.bookname, req.body.author, req.body.isbn, "available"], function (err, rows, field) {
                if (!err && rows.affectedRows > 0) {

                    var data = {
                        succeed: true
                    }


                    // req.session.userID = rows[0].userID;
                    res.send(data);
                } else {
                    console.log(err);
                }
            });

        } else {
            res.status(401).send('invalid token...');
        }
    } catch (error) {
        console.log(error);
        res.send({ "succeed": false });

    }
});

router.put('/:bookid', function (req, res, next) {
    var updateSql = "update books set bookname = (?), author = (?), ISBN = (?) where bookid=?";
    let token = req.headers['authorization'];
    var manageruserid = null;
    var usertype = null;
    if (token.startsWith('Bearer ')) {
        // Remove Bearer from string
        token = token.slice(7, token.length);
        console.log(token);
    }

    try {
        jwt.verify(token, "goodmorning", (err, decoded) => {
            manageruserid = decoded.otherid;
            usertype = decoded.usertype;

        })
        if (usertype == "manager") {
            pool.query(updateSql, [req.body.bookname, req.body.author, req.body.isbn, req.params.bookid], (err, rows) => {
                if (!err) {

                } else {
                    res.send({ "succeed": false });
                }
                if (rows.affectedRows > 0) {
                    var data = {
                        succeed: true
                    }
                    res.send(data);
                }
            })

        } else {
            res.status(401).send('invalid token...');
        }
    } catch (error) {
        console.log(error);
        res.send({ "succeed": false });
    }
});

router.delete('/:bookid', function (req, res, next) {
    var deletesql = "DELETE from books where bookid = (?);"
    let token = req.headers['authorization'];
    var manageruserid = null;
    var usertype = null;
    if (token.startsWith('Bearer ')) {
        // Remove Bearer from string
        token = token.slice(7, token.length);
        console.log(token);
    }

    try {
        jwt.verify(token, "goodmorning", (err, decoded) => {
            manageruserid = decoded.otherid;
            usertype = decoded.usertype;

        });
        if (usertype == "manager") {
            pool.query(deletesql, [req.params.bookid], (err, rows) => {
                if (!err && rows.affectedRows == 1) {
                    var data = {
                        succeed:true
                    };
                    res.send(data);
                } else {
                    res.send({ "succeed": false });
                }

            });

        } else {
            res.status(401).send('invalid token...');
        }
    } catch (error) {
        console.log(error);
        res.send({ "succeed": false });
    }

});

module.exports = router;