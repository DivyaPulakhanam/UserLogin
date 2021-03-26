const empModel = require('./employee.model');
const jwt = require('jsonwebtoken');
const configVal = {
    jwtSecret: 'my_secret_key',
    tokenExpireTime: '6h'
}
const axios = require('axios');

const signIn = async (req, res) => {
    console.log("EmployeeService : SignIn");
    try {
        var UserName = '', Password = '';
        if (req.body.UserName != undefined && req.body.Password != undefined) {
            UserName = req.body.UserName;
            Password = req.body.Password;
        } else {
            res.status(401).json({ "message": "UserName and Password fields required!" });

        }
        await empModel.findOne({ UserName: UserName })
            .then(async function (user) {

                return res.status(200).json({
                    user: {
                        userName: user.UserName,
                        userId: user._id,
                        token: jwt.sign({ username: user.UserName, _id: user._id }, configVal.jwtSecret, { expiresIn: configVal.tokenExpireTime })
                    }
                });
            }).then(undefined, async function (err) {
                console.log(err);
                return res.status(err.code).json({ "message": err.message })

            });

    } catch (error) {
        console.log("Error in Signin" + error);
        return res.status(500).json({
            'code': 'SERVER_ERROR',
            'description': 'something went wrong, Please try again' + error
        });
    }
}

const getList = async (req, res) => {
    console.log("EmployeeService : get list");
    try {
      
        await empModel.find({})
            .then(async function (user) {

                return res.status(200).json({'data':user });
            }).then(undefined, async function (err) {
                console.log(err);
                return res.status(err.code).json({ "message": err.message })

            });

    } catch (error) {
        console.log("Error in get list" + error);
        return res.status(500).json({
            'code': 'SERVER_ERROR',
            'description': 'something went wrong, Please try again' + error
        });
    }
}


const empRegister = async (req, res, next) => {
    console.log("EmployeeService :: empRegister ");
    try {

        if (req.body.EmpName === undefined) {
            return res.status(422).json({
                'code': 'REQUIRED_FIELD_MISSING',
                'description': 'Employee Name is required',
                'field': 'EmpName'
            });
        }
        if (req.body.Password === undefined || req.body.Password === '') {
            return res.status(422).json({
                'code': 'REQUIRED_FIELD_MISSING',
                'description': 'Password is required',
                'field': 'Password'
            });
        }

        var query = { "UserName": req.body.UserName }

        await empModel.findOne(query)
            .then(async function (existuser) {
                if (existuser) {
                    return res.status(409).json({
                        'code': 'CONFLICT_REQUEST_DETAILS',
                        'description': 'UserName  found in the system'
                    });

                } else {
                    empModel.create(req.body)
                        .then(function (data) {
                            return res.status(201).json({
                                'message': 'Employee created successfully ',
                                'data': data
                            });
                        }).catch(err => {
                            return res.send(err);
                        })
                }

            }).catch(err => {
                return res.send(err);
            })


    } catch (error) {
        console.log("Error in registering employee" + error);
        return res.status(500).json({
            'code': 'SERVER_ERROR',
            'description': 'something went wrong, Please try again'
        });
    }
}

const searchData = async (req, res) => {
    console.log("EmployeeService : search data");
    // console.log(req.param('keyword')+"---"+req.param.keyword);
    try {
        const url = "https://www.google.com/search?q=" + req.param('keyword')
             
        axios(url)
            .then(response => {

                const html = response.data;
                return res.send(html);
            }).catch(err => {
                return res.send(err);
            });

    } catch (error) {
        console.log("Error in Signin" + error);
        return res.status(500).json({
            'code': 'SERVER_ERROR',
            'description': 'something went wrong, Please try again' + error
        });
    }
}
module.exports = {
    signIn: signIn,
    empRegister: empRegister,
    searchData: searchData,
    getList:getList
}
