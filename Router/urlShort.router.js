const urlShortRouter = require("express").Router();
const shortid = require("shortid");
const Url = require("../Model/Url.model");

//Get all URL
urlShortRouter.get("/getAll", async (req, res) => {
  let url;
  try {
    url = await Url.find();
  } catch (error) {
    console.log(error);
  }
  if (!url) {
    return res.status(400).json("No more URL");
  }
  res.status(200).json({
    message: "fetched all URL",
    data: url,
  });
});

//generate short Url
urlShortRouter.post("/generate", async (req, res) => {
  const { longUrl } = req.body;
  if (!longUrl) return res.status(404).send({ error: "URL is required" });

  const shortID = shortid();

  const data = await Url.create({
    longUrl: longUrl,
    shortUrl: shortID,
    redirectURL: longUrl,
    clickCount: 0,
  });

  return res.status(200).json({ data: data });
});

//Count how many times click the link
urlShortRouter.get("/:id", async (req, res) => {
  let url;
  try {
    url = await Url.findOne({ _id: req.params.id });
  } catch (error) {
    console.log(error);
  }
});

//Get Url by id
urlShortRouter.get("/get/:id", async (req, res) => {
  let data;
    try {
    const id = req.params.id;
     data = await Url.findOne({ _id: id });
     data = await Url.updateOne({_id:id},{$inc :{clickCount:1}})
  } catch (error) {
    console.log(error)
  }
  if (!data) return res.status(400).send("Cannot able to fetch URL");
  return res.status(200).json(data)

});

//Delete url
urlShortRouter.delete("/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Url.deleteOne({ _id: id });
    if (!data) return res.status(400).send("cannot delete the url");
    return res.status(200).send({ success: true, message: "URL deleted" });
  } catch (error) {
    res.status(500).send("Internal Server Error", err);
  }
});

module.exports = urlShortRouter;
