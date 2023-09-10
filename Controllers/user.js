const User = require("../Models/user");
const bcrypt = require("bcrypt")
const jwt = require("../Services/jwt")

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

const login = (req, res) => {
    let params = req.body;

    if(!params.email || !params.password)
        return res.status(400).json({
            status: "Error",
            message: "Complete all fields"
        })
    User.findOne({email: params.email})
        .then((user) => {
            if(!user)
                return res.status(400).json({
                    status: "Error",
                    message: "This email hasn't been registered"
                })
            let password = bcrypt.compareSync(params.password, user.password);
            if(!password)
                return res.status(400).json({
                    status: "Error",
                    message: "Please, check your password"
                })
            const token = jwt.createToken(user);
            return res.status(200).json({
                status: "Success",
                message: "Login Process has been completed",
                user: {
                    name: user.firstName,
                    surname: user.lastName,
                    email: user.email,
                    packets: user.packets
                },
                token
            })
        })
}

module.exports = {
    register,
    login
}