const express = require("express");
const router = express.Router();
const lockerController = require("../Controllers/locker");
const auth = require("../middlewares/auth");
const locker = require("../Models/locker");

router.post("/create", auth.auth, lockerController.create);
router.get("/get/:id", lockerController.get);
router.get("/getLockersCity", lockerController.getAllLockersCity);

module.exports = router;