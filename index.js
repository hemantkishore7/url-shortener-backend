const express = require("express")
const node_server = express();
require("dotenv").config()
const connectDb = require("./DB/DbConfig")
const app_server = require("./AppServer")

connectDb();

node_server.use("/",app_server)

const port = process.env.PORT || 6000;

node_server.listen(port,()=>{
    console.log("Application is running on ", port);
})

