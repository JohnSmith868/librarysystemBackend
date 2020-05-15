var express = require('express');
var router = express.Router();
var pool = require('../mysql');
var jwt = require('jsonwebtoken');

/* login */
router.post('/', function (req, res, next) {
  var sql = "SELECT * FROM user, normaluser where email = ? and password = sha1(?) and user.userID = normaluser.userID"
  console.log(req.body.username + " "+ req.body.password);

  try {
    pool.query(sql, [req.body.username, req.body.password], (err, results) => {
      if (!err) {
        console.log("database result"+JSON.stringify(results));
        if (results.length > 0) {
          //jwt token generate
          var token = jwt.sign({
            "userid": results[0].userid,
            "usertype": results[0].usertype,
            "otherid": results[0].normaluserid,
          }, "goodmorning", { expiresIn: 60 * 60 });

          //data sent to respone
          var data = [{
            "userid": results[0].userid,
            "usertype": results[0].usertype,
            "email": results[0].email,
            "otherid": results[0].normaluserid,
            "token": token,
          }]
          res.send(data);
        } else {//username pwd no match
          res.send(results);
        }
      }
    });
  } catch (error) {
    console.log(error);
    res.send(JSON.stringify({"error":true}))
  }
});

module.exports = router;
