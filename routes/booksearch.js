var express = require('express');
var router = express.Router();
var pool = require('../mysql');

/* GET books page. */
router.get('/', function (req, res, next) {//search book
    var sql = "select books.bookname, books.author, books.ISBN, books.status, books.bookid from books where bookname like ? or author like ?"
    try {
        pool.query(sql, ['%' + req.params.keyword + '%', '%' + req.params.keyword + '%'], function (err, rows, field) {
            if (!err) {
                res.send(rows);

            } else {
                console.log(err);
                res.send({ "succeed": false });
            }
        })

    } catch (error) {
        console.log(error);
        res.send({ "succeed": false });
    }

});

router.get('/:bookid', function (req, res, next) {
    var sql = "select books.bookname, books.author, books.ISBN, books.status from books WHERE bookid=?"
    try {
        pool.query(sql, [req.params.bookid], function (err, rows, field) {
            if(!err){
                var data = {
                    "bookname":rows[0].bookname,
                    
                    
                    "author":rows[0].author,
                    
                    "ISBN":rows[0].ISBN,
                    
                    "status":rows[0].status,
                }
                
                res.send(data);
            }
        });
    } catch (error) {

    }
});

module.exports = router;
