var express = require('express');
var app = express();
var router = express.Router();
var mysql = require('mysql');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
//for login/logout (authentication)
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
//use sendgrid
var sgMail = require("@sendgrid/mail");
var keys = require("../key");
sgMail.setApiKey(keys.sendgrid);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(methodOverride('_method'));

var connection = mysql.createConnection({
  host: 'localhost',

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: 'root',

  // Your password
  password: 'password',
  database: 'crypto_db'
});

connection.connect(function(err){
  if(!err) {
      console.log("Database is connected ... signup");
  } else {
      console.log("Error connecting database ... nn");
  }
  });

  router.post("/register", function(req,res){
    // console.log("req",req.body);
    // var today = new Date();
    let users={
      // "first_name":req.body.first_name,
      // "last_name":req.body.last_name,
      "username": req.body.username,
      "email":req.body.email,
      // "created":today,
      // "modified":today
    }

    let password = req.body.password

    connection.query('INSERT INTO users SET ?',users, function (error, results, fields, next) {
    if (error) {
      console.log("error ocurred",error);
      res.send({
        "code":400,
        "failed":"error ocurred"
      })
    }
  
      connection.query('SELECT * FROM users WHERE username = ?',req.body.username, function(error, result) {
        if (result) return res.status(404).json({ error: 'user already exists' });
  
        if (!password) return res.status(401).json({ error: 'you need a password' });
  
        if (password.length <= 5) return res.status(401).json({ error: 'password length must be greater than 5' });
  
        console.log(result)
  
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(password, salt, function(err, hash) {
              connection.query('INSERT INTO users SET password=? WHERE username=? ',[hash, req.body.username], function (error, results, fields, next) {
                if (error) {
                  console.log("error ocurred",error);
                  res.send({
                    "code":400,
                    "failed":"error ocurred"
                  })
                }else{
                  console.log('The solution is: ', results);
                  // Redirect to next page (first user page).
                  res.send({
                    "code":200,
                    "success":"user registered sucessfully"
                      });
                }
                });
            });
        });
    });
    
    });
    
  });

// This doens't work the way it supposed to, yet. Will work on this next. 
// I need to be able to insert info into two diffrent tables simultainously on formSubmit. 

  //   let cryptos = {"crypto_id" :req.body.cryptosProfile
  // }
  // connection.query('INSERT INTO cryptos_id SET ?',cryptos, function (error, results, fields, next) {
  //   if (error) {
  //     console.log("error ocurred",error);
  //     res.send({
  //       "code":400,
  //       "failed":"error ocurred"
  //     })
  //   }else{
  //     console.log('The solution is: ', results);
  //     // Redirect to next page (first user page).
  //     res.send({
  //       "code":200,
  //       "success":"user registered sucessfully"
  //         });
  //   }
  //   });
  
  // router.post('/login',login.login)
  // app.use('/api', router)

/*
Sendgrid Example. Wait for singup to be completed before this can be integrated
const msg = {
  to: 'simonnguyen3054@gmail.com',
  from: 'simon@acceptmycrypto.com',
  subject: 'Email Testing: Generated by our server',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
};
sgMail.send(msg);
*/

module.exports = router;