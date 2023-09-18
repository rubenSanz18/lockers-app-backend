const Packet = require("../Models/packet");
const User = require("../Models/user");
const Locker = require("../Models/locker");
const compValidator = require("../Validation/compartments");
const dateValidator = require("../Validation/date");

const order = (req, res) => {
    let params = req.body;

    if(!params.locker)
        return res.status(400).json({
            status: "Error",
            message: "Please, complete all fields"
        })
    if(compValidator.enoughCompartments(params.locker)){
        params.user = req.user.id;
        let newPacket = new Packet(params);
        newPacket.save().then((savedPacket) => {
            User.findOneAndUpdate({_id: req.user.id}, {$push: {packets: savedPacket.id}}, {new: true}).exec()
                .then((updatedUser) => {
                    Locker.findOneAndUpdate({_id: params.locker}, {$push: {packets: savedPacket.id}, $inc: {compartments: -1}}, {new: true}).exec()
                        .then((updatedLocker) => {
                            return res.status(200).json({
                                status: "Success",
                                message: "New order created",
                                packet: {
                                    orderDate: savedPacket.orderDate,
                                    arrivalDate: savedPacket.arrivalDate,
                                },
                                user: {
                                    email: updatedUser.email,
                                },
                                locker: {
                                    address: updatedLocker.address,
                                    city: updatedLocker.city,
                                    availableCompartments: updatedLocker.compartments
                                }
                            })
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
    else {
        return res.status(400).json({
            status: "Error",
            message: "There is no compartments in this locker. Please find another locker near you"
        })
    }
}

const cancel = (req, res) => {
    Packet.findOne({ $and: [
        {_id: req.params.id},
        {user: req.user.id}
    ]})
    .exec()
    .then((packet) => {
        if(!packet)
            return res.status(400).json({
                status: "Error",
                message: "Packet don't found"
            })
        if(dateValidator.checkDate(packet.arrivalDate)){
            User.findOneAndUpdate({_id: req.user.id}, {$pull: {packets: packet.id}}, {new: true}).exec();
            Locker.findOneAndUpdate({_id: packet.locker}, {$pull: {packets: packet.id}}, {new: true}).exec();
            Packet.deleteOne({_id: packet.id}).exec();
            return res.status(200).json({
                status: "Success",
                user: {
                    name: req.user.firstName,
                    packets: req.user.packets
                }
            })
        } else{
            return res.status(400).json({
                status: "Error",
                message: "This packet can't be cancelled because it passed more than 24h"
            })
        }
    })
}

module.exports = {
    order,
    cancel
}