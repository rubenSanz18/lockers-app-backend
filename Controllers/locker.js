const Locker = require("../Models/locker");
const validator = require("../Validation/address");
const Packet = require("../Models/packet");

const create = async (req, res) => {
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
    if(await validator.validateAddress(params.address, params.city)){
        Locker.findOne({ $or: [
            { $and: [
                {city: params.city},
                {name: params.name}
            ]},
            {address: params.address}
        ]}).exec()
        .then((locker) => {
            if(locker)
                return res.status(400).json({
                    status: "Error",
                    message: "There is another locker with the same name in this city, or there is a locker in this street. Please, check it"
                })
            let lockerToSave = new Locker(params);
            lockerToSave.save().then((lockerCreated) => {
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
        })
        .catch((error) => {
            return res.status(500).json({
                status: "Error",
                error
            })
        })
    }
    else{
        return res.status(400).json({
            status: "Error",
            message: "Address don't found"
        })
    }
}

const get = (req, res) => {
    Locker.findOne({_id: req.params.id})
        .exec()
        .then((locker) => {
            if(!locker)
                return res.status(400).json({
                    status: "Error",
                    message: "Locker don't found. Please, check the id"
                })
            return res.status(200).json({
                status: "Success",
                locker
            })
        })
        .catch((error) => {
            res.status(500).json({
                status: "Error",
                error
            })
        })
}

const getAllLockersCity = (req, res) => {
    if(!req.body.city)
        return res.status(400).json({
            status: "Error",
            message: "Please, introduce a city"
        })
    Locker.find({city: req.body.city})
        .exec()
        .then((lockers) => {
            if(lockers.length === 0)
                return res.status(400).json({
                    status: "Success",
                    message: "There is no locker in " +req.body.city
                })
            return res.status(200).json({
                status: "Success",
                lockers
            })
        })
        .catch((error) => {
            return res.status(500).json({
                status: "Error",
                error
            })
        })
}

const deleteLocker = (req, res) => {
    let user = req.user;

    if(user.role !== "admin_role")
        return res.status(400).json({
            status: "Error",
            message: "You must be an admin"
        })
    Locker.findOne({_id: req.params.id})
        .exec()
        .then((locker) => {
            if(!locker)
                return res.status(400).json({
                    status: "Error",
                    message: "Locker don't found"
                })
            Packet.find({locker: req.params.id})
                .exec()
                .then((packets) => {
                    if(packets.length > 0)
                        return res.status(400).json({
                            status: "Error",
                            message: "You can't delete this locker because there are packets there"
                        })
                    Locker.deleteOne({_id: req.params.id})
                        .exec()
                        .then((deletedLocker) => {
                            return res.status(200).json({
                                status: "Success",
                                message: "Locker deleted",
                            })
                        })
                })
        })
        .catch((error) => {
            res.status(500).json({
                status: "Error",
                error
            })
        })
}

module.exports = {
    create,
    get,
    getAllLockersCity,
    deleteLocker
}