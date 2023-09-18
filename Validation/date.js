function checkDate (arrivalDate) {
    const diff = Date.now() - arrivalDate;
    if(diff/3600000 < 24)
        return true;
    else
        return false;
}

module.exports = {
    checkDate
}