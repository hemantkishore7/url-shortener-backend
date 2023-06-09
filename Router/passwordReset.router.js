const passwordResetRoute = require("express").Router();
const Joi = require("joi");
const { user } = require("../Model/User.model");
const Token = require("../Model/Token.model");
const crypto = require("crypto");
const sendMail = require("../Utils/sendMail");
const passwordComplexity = require("joi-password-complexity");
const bcrypt = require("bcrypt");

//Send password link
passwordResetRoute.post("/password-reset", async (req, res) => {
  try {
    const emailSchema = Joi.object({
      email: Joi.string().email().required().label("Email"),
    });
    const { error } = emailSchema.validate(req.body);
    if (error) {
      return res.status(200).send({
        message: error.details[0].message,
      });
    }

    let User = await user.findOne({ email: req.body.email });
    if (!User) {
      return res.status(400).send({
        message: "User given email id is does not exist",
      });
    }

    let token = await Token.findOne({ userId: User._id });
    console.log("Token", token);

    if (!token) {
      token = await new Token({
        userId: User._id,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();
    }

    const url = `http://localhost:3000/reset/${User._id}/${token.token}/`;

    await sendMail(User.email, "Password Reset", url);
    res.status(200).send({
      message: "Password reset link sent to your email account",
    });
  } catch (error) {
    console.log(error);
  }
});

//Verify the URL
passwordResetRoute.get("/password-reset/:id/:token",async(req,res)=>{
    try {
        const User = await user.findOne({_id:req.params.id})
        if(!User){
          return res.status(400).send({
            message:"INVALID LINK"
          })
        }
        const token = await Token.findOne({
          userId:User._id,
          token:req.params.token,
        })
        if(!token){
          return res.status(400).send({
            message:"INVAKID LINK",
          })
        }
        res.status(200).send("valid url")

    } catch (error) {
        console.log(error);
    }
})

//Reset password
passwordResetRoute.post("/password-reset/:id/:token",async(req,res)=>{
  try {
    const passwordSchema = Joi.object({
      password : passwordComplexity().required().label("Password")
    });

    const {error} = passwordSchema.validate(req.body);
    if(error){
      return res.status(400).send({
        message: error.details[0].message
      })
    }

    const User = await user.findOne({_id:req.params.id})
    if(!User){
      return res.status(400).send({
        message:"Invalid Link"
      })
    }

    const token = await Token.findOne({
      userId:User._id,
      token:req.params.token,
    })

    if(!token){
      return res.status(400).send({
        message:"Invalid Link"
      })
    }

    const salt = 10;
    const hashPassword = await bcrypt.hash(req.body.password, salt)
   
    User.password = hashPassword;
    await User.save();
    await token.deleteOne()
    res.status(200).send({
      message:"Password Reset Successfully"
    })
  } catch (error) {
    console.log(error);
  }
})

module.exports = passwordResetRoute;