const express = require("express");
const router = express.Router();
const packetController = require("../Controllers/packet");
const auth = require("../middlewares/auth");

router.post("/order", auth.auth, packetController.order)
router.post("/cancel/:id", auth.auth, packetController.cancel);
router.put("/pickUp/:id", packetController.pickUp);

module.exports = router;