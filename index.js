//Import dependencies
const {connection} = require("./Database/connection");
const express = require("express");
const cors = require("cors");
const cron = require("node-cron");
const packetController = require("./Controllers/packet");

//Connection to the database
connection();

//Node server
const app = express();
const port = 3900;

//Configure cors
app.use(cors());

//Convert request info to JSON Objects
app.use(express.json());
app.use(express.urlencoded({extended: true})); 

//Routes
const userRoutes = require("./Routes/user");
const packetRoutes = require("./Routes/packet");
const lockerRoutes = require("./Routes/locker");

app.use("/api/user", userRoutes);
app.use("/api/packet", packetRoutes);
app.use("/api/locker", lockerRoutes);

//Server listens to HTTP Requests
app.listen(port, () => {
    console.log("Server is running at port " + port);
});

//updateStatus is executed every hour
cron.schedule("0 * * * *", async () => {
    await packetController.updateStatus();
});