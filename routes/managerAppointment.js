var express = require('express');
var router = express.Router();
var pool = require('../mysql');
var jwt = require('jsonwebtoken');


//show all appointment
router.get('/', function (req, res, next) {
    var showappointments = "select * from apointment WHERE status <> 'collected'";
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
            pool.query(showappointments, function (err, rows, field) {
                if (!err) {




                    // req.session.userID = rows[0].userID;
                    res.send(rows);
                } else {
                    console.log(err);
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











router.put('/confirm/:apointid', function (req, res, next) {
    var sql = "UPDATE `apointment` SET `status` = 'collected' WHERE `apointment`.`apointid` = ?";
    var selectBookid = "SELECT bookid,normaluserid from apointment where apointid = ?";
    var updateBookStatus = "update books set status = 'borrowed' where bookid=?";
    var updateBorrowRecord = "INSERT into borrowrecord(normaluserid, borrowdate, returndate,bookid) values(?,?,?,?)";

    var date = new Date();
    var returnDate = new Date(date);
    returnDate.setDate(date.getDate() + 14);


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


            pool.query(sql, [req.params.apointid], function (err, rows, field) {
                if (!err) {

                    pool.query(selectBookid, [req.params.apointid], function (err, rows, field) {
                        if (!err) {
                            var bookid = rows[0].bookid;
                            var normaluserid = rows[0].normaluserid;
                            pool.query(updateBookStatus, [bookid], function (err, rows, field) {
                                if (!err) {

                                    pool.query(updateBorrowRecord, [normaluserid, date, returnDate, bookid], (err, rows) => {
                                        if (rows.affectedRows > 0) {
                                            var data = {
                                                succeed: true
                                            }
                                            res.send(data);
                                        }
                                    })

                                }
                            })
                        }
                    })


                    // req.session.userID = rows[0].userID;

                } else {
                    console.log(err);
                }
            });
        }else{
            res.status(401).send('invalid token...');
        }
        
    } catch(error){
        console.log(error);
        res.send({"succeed":false});

    }

});

module.exports = router;
