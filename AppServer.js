const express = require('express');
const app = express();
const bodyparser = require("body-parser")
const cors = require("cors")

//Importing Routes
const user = require("./Router/user.router")
const passwordReset = require("./Router/passwordReset.router")
const urlShort = require("./Router/urlShort.router")


//Middleware
app.use(bodyparser.json());
app.use(cors())

//inject Router
app.use("/api",user)
app.use("/api",passwordReset)
app.use("/api",urlShort)


//Test
app.get("/",(req,res)=>{
   res.status(200).send("Welcome to URL-shortener Application")
})

module.exports = app;