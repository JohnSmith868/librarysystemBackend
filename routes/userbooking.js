var express = require('express');
var router = express.Router();
var pool = require('../mysql');
var jwt = require('jsonwebtoken');

//show user's bookings (appointments)
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
//delete booking by appointmentid
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

router.post('/make', (req,res,next)=>{
    var makeappointmentsql = "INSERT INTO apointment (normaluserid, bookid, apointdate, deadline) values (?,?,?,?);"
    let token = req.headers['authorization'];
    var date = new Date();
    var deadline = new Date(date);
    deadline.setDate(date.getDate()+7);
    var normaluserid = null;
    var bookid = req.body.bookid;
    if (token.startsWith('Bearer ')) {
        // Remove Bearer from string
        token = token.slice(7, token.length);
        console.log(token);
    }

    try {
        jwt.verify(token,"goodmorning",(err,decoded)=>{
            normaluserid = decoded.otherid;
        })

        pool.query(makeappointmentsql,[normaluserid,bookid,date,deadline],(err,rows)=>{
            if(!err){
                if (rows.affectedRows > 0) {
                
                    var apointid = rows.insertId;
                    console.log("succeed make new booking with id: " + apointid);
                    data = {
                        "apointid": apointid
                    }
                    var changebookstatus = "UPDATE books SET status = 'apointed' WHERE books.bookid = " + req.body.bookid;
                    pool.query(changebookstatus,function(err,rows,field){
    
                        if(!err){
                            res.send(data);
                        }
                        else{
                            
                            res.send({"succeed":false});
                        }
                    })
                    
                    
                }
            }else{
                
                res.send({"succeed":false, "error":err});
            }
        });
        
    } catch (error) {
        console.log(error);
        res.send({"succeed":false, "error":error});
    }
});

module.exports = router;
