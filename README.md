# librarysystemBackend
# Usage
Installation
```
npm install
npm start
```
Testing
```
npm run test
```
# Backend's control flow
## Example: GET /books?keyword=harry
in ./app.js
```javascript

....
var express = require('express');
var booksearchRouter = require('./routes/booksearch');
var app = express();
...
app.use('/books',booksearchRouter);
....
...
```
in ./routes/booksearch.js
```javascript
var express = require('express');
var router = express.Router();
var pool = require('../mysql');

/* GET books page. */
router.get('/', function (req, res, next) {//search book
    var sql = "select books.bookname, books.author, books.ISBN, books.status, books.bookid from books where bookname like ? or author like ?"
    try {
        pool.query(sql, ['%' + req.query.keyword + '%', '%' + req.query.keyword + '%'], function (err, rows, field) {
            console.log(req.params);
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
```
## Example: POST /login/manager
in ./app.js
```javascript

....
var express = require('express');
var loginRouter = require('./routes/login');
var app = express();
...
app.use('/login',loginRouter);
....
...
```
in ./routes/login.js
```javascript
......
......
router.post('/manager', function (req, res, next) {
  var sql = "SELECT * FROM user, manager where email = ? and password = sha1(?) and user.userID = manager.userID"
  console.log(req.body.username + " "+ req.body.password);
.....
....
...
  })
  
 ....
```
# MySQL config
## in ./mysql.js
```javascript
var mysql = require('mysql');

// Initialize pool

var pool = mysql.createPool({
    connectionLimit: 100,
    host: process.env.RDS_HOSTNAME || 'localhost',
    user: process.env.RDS_USERNAME || 'root',
    password: process.env.RDS_PASSWORD || '',
    port: '3306',
    database: 'agile'
});
module.exports = pool;
```

# Testing
in ./test/test.js
```javascript
  
let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require("../app");
let jwt = require('jsonwebtoken');
let { expect } = chai;
let should = chai.should();

chai.use(chaiHttp);
......
describe("test login, POST /login", () => {
    let user = {
        username: "customer01@gmail.com",
        password: "a123456789"
    }
    it("should login succeed using correct pwd username.", (done) => {
        chai.request(app)
            .post('/login')
            .send(user)
            .end((err, res) => {

                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eq(1);
                done();

            })
    });
 });
 .....
```
