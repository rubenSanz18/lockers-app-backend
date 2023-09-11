const User = require("../Models/user");
const Packet = require("../Models/packet");

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
                if(params.email.endsWith("@admin.locker.com"))
                    userToSave.role = "admin_role";
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

const update = (req, res) => {
    let toUpdate = req.body;
    let user = req.user;

    User.find({email: user.email.toLowerCase()})
    .exec()
    .then(async (users) => {
        if(!users)
            return res.status(404).json({
                status: "Error",
                message: "There are not any user using this email"
            })
        if(users.length >= 1){
            if(toUpdate.password){
                let pwd = await bcrypt.hash(toUpdate.password, 10);
                toUpdate.password = pwd;
            }
            User.findByIdAndUpdate(user.id, toUpdate, {new: true})
                .then((newUser) => {
                    return res.status(200).json({
                        status: "OK",
                        user: newUser
                    })
                })
                .catch((error) => {
                    return res.status(500).json({
                        status: "Error",
                        error: error
                    })
                })
        }
    })
}

const getUser = (req, res) => {

    User.findOne({_id: req.user.id})
        .exec()
        .then((user) => {
            if(!user)
                return res.status(400).json({
                    status: "Error",
                    message: "User don't found"
                })
            return res.status(200).json({
                status: "Success",
                user: user
            })
        })
        .catch((error) => {
            return res.status(400).json({
                status: "Error",
                error
            })
        })
}

const deleteUser = (req, res) => {

    User.findOne({_id: req.user.id})
    .exec()
    .then((user) => {
        if(!user)
            return res.status(404).json({
                status: "Error",
                message: "User don't found"
            })
        if(user.packets.length > 0){
            for(let i=0; i<user.packets.length; i++){
                if(user.packets[i].status !== "Preparing")
                    return res.status(400).json({
                        status: "Error",
                        message: "You can't delete your account because you have deliveries that are prepared"
                    })
            }
        }
        User.deleteOne({_id: user.id})
        .exec()
        .then((deletedUser) => {
            if(!deletedUser)
                return res.status(500).json({
                    status: "Error",
                    message: "An error has been ocurred"
                })
            Packet.deleteMany({userMail: deletedUser.email})
            return res.status(200).json({
                status: "Success",
                message: "Deleted"
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

module.exports = {
    register,
    login,
    update,
    getUser,
    deleteUser
}