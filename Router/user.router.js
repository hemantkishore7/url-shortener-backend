const userRouter = require("express").Router()
const {user,validate} = require("../Model/User.model")
const bcrypt = require("bcrypt");

//Sign-Up
userRouter.post("/signup",async(req,res)=>{
    try {
        const {error} = validate(req.body);
        if(error){return res.status(400).send({
            message: error.details[0].message,
        })}

        let User = await user.findOne({email:req.body.email})
        if(User){
            return res.status(400).send({
                message:"User already have a account",
            })
        }

        const salt = 10;
        const hashPassword = await bcrypt.hash(req.body.password, salt);
        console.log("hashPassword", hashPassword);

        User = await new user({...req.body,password:hashPassword}).save();

        return res.status(200).send({
            data:User,
        })
    } catch (error) {
      console.log(error);  
    }
})

//Signin
userRouter.post("/signin",async(req,res)=>{
    try {
        const{error} = req.body;
        if(error) {return res.status(400).send({
            message: error.details[0].message,
        })
    }

    const User = await user.findOne({email:req.body.email});
    if(!User){
        return res.status(400).send({
            message:"Invalid email",
        })
    }

    const validPassword = await bcrypt.compare(req.body.password, User.password);
    if(!validPassword){
        return res.status(400).send({
            message: "Invalid Password"
        });
    }

    const token = User.generateAuthToken()
    res.status(200).send({
        data:token,
        message:"sign-in successfull"
    })
    } catch (error) {
        console.log(error);
    }
})


module.exports = userRouter;