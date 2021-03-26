const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
console.log("loginModel");
const EmpSchema = mongoose.Schema({  
    UserName: {
        type: String,
        required : [ true, 'UserName is required']
    },
    Password: {
        type: String,
        required : [ true, 'Password is required']
    },
    EmpName: {
        type: String,
        required : [ true, 'Please enter name is required']
    },
   
});

//model name, schema, collection name
module.exports = mongoose.model('Employee', EmpSchema);
  
