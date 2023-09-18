function checkDate (orderDate) {
    const diffInms = Date.now() - orderDate;

    if(diffInms/3600000 < 24)
        return true;
    else   
        return false;
}