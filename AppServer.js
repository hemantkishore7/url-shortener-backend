const express = require('express');
const app = express();
const bodyparser = require("body-parser")

//Middleware
app.use(bodyparser.json());


//Test
app.get("/",(req,res)=>{
   res.status(200).send("Welcome to URL-shortener Application")
})

module.exports = app;