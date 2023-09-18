const Packet = require("../Models/packet");
const User = require("../Models/user");
const Locker = require("../Models/locker");
const compValidator = require("../Validation/compartments");
const dateValidator = require("../Validation/date");
const mail = require("../Services/nodemailer");

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
                            mail.sendMail(updatedUser.email, "Order completed", "" +updatedUser.firstName+ "\nYour packet will be stored in " +updatedLocker.name+ " in " +updateStatus.address+ " in 48h. We will send you your PIN code to pick up your packet");
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
        if(dateValidator.checkDate(packet.orderDate)){
            User.findOneAndUpdate({_id: req.user.id}, {$pull: {packets: packet.id}}, {new: true}).exec();
            Locker.findOneAndUpdate({_id: packet.locker}, {$pull: {packets: packet.id}}, {new: true}).exec();
            Packet.deleteOne({_id: packet.id}).exec();
            mail.sendMail(req.user.email, "Order cancel", "" +req.user.firstName+ "\nYour order has been cancelled");
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

const updateStatus = async () => {
    const packets = await Packet.find({status: {$nin: ["Ready to pick up", "Picked up", "Timed out"]}});
    packets.forEach(async (packet) => {
        const dateDiff = moment().diff(packet.orderDate, "hours");

        if(dateDiff >= 16){
            let newStatus;
            switch (packet.status) {
                case "Preparing":
                    newStatus = "Ready for delivery";
                    break;
                case "Ready for delivery":
                    newStatus = "On the way to the locker";
                    break;
                case "On the way to the locker":
                    newStatus = "Ready to pick up";
                    const pin = Math.floor(1000 + Math.random() * 9000).toString();
                    packet.pin = pin;
                    Packet.findOne({_id: packet.id})
                        .populate("user")
                        .populate("locker")
                        .exec()
                        .then((packet) => {
                            const user = packet.user;
                            const locker = packet.locker;

                            mail.sendMail(user.email, "Your packet is ready to pick up", "" +user.firstName+ "\nYour packet is stored in " +locker.name+ " in " +locker.address+ ".\nYour PIN code to pick up your packet is: " +pin+ "\nRemember that you have 48h to pick up your packet. If not it will be brought back to our offices");
                        })
                    break;
                default:
                    newStatus = packet.status;
                    break;
              }
            await Packet.findOneAndUpdate({_id: packet.id}, {$set: {status: newStatus}}, {new: true}).exec();
        }
    })
}

const pickUp = (req, res) => {
    if(!req.body.pin)
        return res.status(400).json({
            status: "Error",
            message: "Please insert your PIN Code"
        })
    Packet.findOneAndUpdate({$and: [
        {locker: req.params.id},
        {pin: req.body.pin}
    ]}, {status: "Picked up"}, {new: true}).exec()
        .then((packet) => {
            if(!packet)
                return res.status(400).json({
                    status: "Error",
                    message: "There is no packet in this locker with this PIN Code"
                })
            Locker.findOneAndUpdate({_id: req.params.id}, {$pull: {packets: packet.id}, $inc: {compartments: +1}}, {new: true}).exec();
            return res.status(200).json({
                status: "Success",
                message: "You have picked up your packet correctly"
            })
        })
}

module.exports = {
    order,
    cancel,
    updateStatus,
    pickUp
}