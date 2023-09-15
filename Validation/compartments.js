const Locker = require("../Models/locker");

function enoughCompartments (lockerID){
    return Locker.findOne({_id: lockerID})
        .exec()
        .then((locker) => {
            if(locker.compartments > 0)
                return true;
            else
                return false;
        })
        .catch((error) => {
            throw error;
        })
}

module.exports = {
    enoughCompartments
}