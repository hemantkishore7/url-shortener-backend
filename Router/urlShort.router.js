const urlShortRouter = require("express").Router();
const shortid = require("shortid");
const Url = require("../Model/Url.model")


//generate short Url
urlShortRouter.post("/generate",async(req,res)=>{
    const {longUrl} = req.body;
    if(!longUrl) return res.status(404).send({error:"URL is required"})

    const shortID = shortid();

   const data = await Url.create({
        longUrl:longUrl,
        shortUrl:shortID,
        redirectURL:longUrl,
        clickCount:0
    })

    return res.status(200).json({data:data})
})

//Count how many times click the link
urlShortRouter.get("/:id", async(req,res)=>{
   try {
    await Url.findOne({shortUrl:req.params.id},(err,data)=>{
        if(err) {
            return res.status(400).send('Error while redirect url')
        }
        Url.findByIdAndUpdate({_id:data.id},{$inc : {clickCount:1}},(err,data)=>{
            if(err){
                res.status(400).send('Error while redirect url')
            }
            res.redirect(data.longUrl)
        })
    })
   } catch (error) {
    return res.status(500).json({
        message:'Internal Server Error',
         error:error})
   }
})

//Get all url
urlShortRouter.get("/getAll",async function(req,res){
    let data;
    try {
       const data = await Url.find();
    }
    catch(error) {
        console.log(error);
        // res.status(500).json({
        //     message:'Internal Server Error',
        //      error:error
        //     })

    };
    if(!data) return res.status(400).json("unexcepted error")
    res.status(200).json({
     message:"fetched all the URL",
     data:data
    })
})

//Get Url by id
urlShortRouter.get("/get/:id",async(req,res)=>{
    try {
        const id = req.params.id;
        const data = await Url.findOne({_id:id})
        if(!data) return res.status(400).send("Cannot able to fetch URL")
        return res.status(200).send({success:true,data:data})
    } catch (error) {
        res.status(500).send('Internal Server Error', err)
    }
})

//Delete url
urlShortRouter.delete("/delete/:id",async(req,res)=>{
    try {
       const id = req.params.id;
       const data = await Url.deleteOne({_id:id})
       if(!data) return res.status(400).send("cannot delete the url")
        return res.status(200).send({success:true,message:"URL deleted"})
    } catch (error) {
        res.status(500).send('Internal Server Error', err)
    }
})

module.exports = urlShortRouter