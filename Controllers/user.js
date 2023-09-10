const User = require("../Models/user");
const bcrypt = require("bcrypt")

const register = (req, res) => {
    let params = req.body;

    if(!params.firstName | !params.lastName | !params.email | !params.password)
        return res.status(400).json({
            status: "Error",
            message: "Please, complete all fields"
        })
    else{
        let userToSave = new User(params);
        User.find({email: params.email.toLowerCase()})
        .exec()
        .then((user) => {
            if(user && user.length > 0)
                return res.status(400).json({
                    status: "Error",
                    message: "This email is already in use"
                })
            bcrypt.hash(userToSave.password, 10)
            .then((password) => {
                userToSave.password = password;
                userToSave.save().then((userRegistered) => {
                    if(!userRegistered)
                        return res.status(500).json({
                            status: "Error"
                        })
                    return res.status(200).json({
                        status: "Success",
                        message: "The user has been registered",
                        user: userRegistered
                    })
                })
            })
        })
        .catch((error) => {
            return res.status(500).json({
                status: "Error",
                error: error
            })
        })
    }
}

module.exports = {
    register
}