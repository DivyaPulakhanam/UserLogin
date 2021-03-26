const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jsonwebtoken = require("jsonwebtoken");
let cors = require('cors');
var port = 3000, hostname = 'localhost';
const config = { jwtSecret: 'my_secret_key', tokenExpireTime: '6h' };
const employee = require('./employee');
let server = express();
//server.set('env', config.env);
server.set('hostname', 'localhost');

server.use(cors())
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

mongoose.connect("mongodb://localhost:27017/userlogin",
  {
    useNewUrlParser: true,
    useCreateIndex: true
  }
).then(() => {
  console.log("Successfully connected to the database");
}).catch(err => {
  console.log('Could not connect to the database. Exiting now...', err);
  process.exit();
});


var logincheck = function (req, res, next) {
  if (req.url == '/login') {
    req.user = undefined;
    next();
  } else {
    if (req.headers && req.headers.authorization) {
      console.log("req.headers.authorization" + config.jwtSecret);
      jsonwebtoken.verify(req.headers.authorization, config.jwtSecret, function (err, decode) {
        //console.log("req.user" +err);
        if (err)
          req.user = undefined;
        req.user = decode;
        next();
      });
    } else {
      req.user = undefined;
      return res.send("In Vaild User!")
    }
  }
}

server.post('/login', employee.signIn);
server.post('/register', employee.empRegister);
server.get('/search/:keyword', logincheck,employee.searchData)
server.get('/', function (req, res) {
  return res.send("it's working")
})

server.listen(port, () => {
  console.log("server started on " + port);
});
