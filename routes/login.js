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


router.post('/check', function (req, res, next) {

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
              res.send(data);
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
              res.send(data);

          }
      });
  }




});

module.exports = router;
