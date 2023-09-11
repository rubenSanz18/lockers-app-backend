const Locker = require("../Models/locker");

const create = (req, res) => {
    let params = req.body;
    let user = req.user;

    if(!params.name | !params.address | !params.smallCompartments | !params.largeCompartments)
        return res.status(400).json({
            status: "Error",
            message: "Please, complete all fields"
        })
    if(user.role !== "admin_role")
        return res.status(401).json({
            status: "Error",
            message: "You must be an administrator"
        })
    let locker = new Locker(params);
    locker.save().then((lockerCreated) => {
        if(!lockerCreated)
            return res.status(500).json({
                status: "Error",
            })
        return res.status(200).json({
            status: "Success",
            message: "Locker created correctly",
            lockerCreated
        })
    })
    .catch((error) => {
        return res.status(500).json({
            status: "Error",
            error
        })
    })
}

module.exports = {
    create
}