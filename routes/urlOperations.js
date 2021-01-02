const express = require("express");
const router = express.Router();
const shortId = require("shortid");
const URL = require("../model/url");
const validUrl = require("valid-url");

router.post("/shorturl/new", async (req, res) => {
  const url = req.body.url;
  const shortUrl = shortId.generate();
  //Check if the url is valid or not
  if (!validUrl.isWebUri(url)) {
    res.status(401).json({
      error: "Not a valid URL"
    });
  } else {
    try {
      //Check whether the URL exists in db or not
      var findOne = await URL.findOne({
        original_url: url
      });
      if (findOne) {
        res.json({
          original_url: findOne.original_url,
          short_url: findOne.short_url
        })
      } else {
        //Create entry in db since this is a new URL
        findOne = new URL({
          original_url: url,
          short_url: shortUrl
        })
        await findOne.save()
        res.json({
          original_url: findOne.original_url,
          short_url: findOne.short_url
        })
      }
    } catch (err) {
      console.error(err);
      res.status(500).json("Server error");
    } 
  }
});

router.get("/shorturl/:shortUrl", async (req, res) => {
  try{
    var shortUrl = req.params.shortUrl.split(":");
    var urlParams = await URL.findOne({
      short_url: shortUrl
    });
    if (urlParams) {
      res.redirect(urlParams.original_url);
    } else {
      res.status(404).json("URL not found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json("Server error");
  }
});

module.exports = router;