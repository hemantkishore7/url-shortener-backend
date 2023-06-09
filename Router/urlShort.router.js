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
        visitHistry:[]
    })

    return res.status(200).json({data:data})
})

//Count how many times click the link
urlShortRouter.post("/analytics/:id", async(req,res)=>{
    const shortUrl = req.params.id;
    const result = await Url.findOne({shortUrl:shortUrl})

    return res.json({
        totalClicks: result.visitHistry.length,
        analytics:result.visitHistry,
    })
})

//Get all url
urlShortRouter.get("/getAll", async(req,res)=>{
    try {
       const data = await Url.find()
       if(!data) return res.status(400).send("Cannot able to fetch all URL")
       return res.status(200).send({success:true,data:data})
    } catch (error) {
        res.status(500).send('Internal Server Error', err)
    }
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