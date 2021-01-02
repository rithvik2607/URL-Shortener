const mongoose = require("mongoose");
const express = require("express");

const urlSchema = new mongoose.Schema({
  original_url: String,
  short_url: String
});

const URL = mongoose.model("URL", urlSchema);
module.exports = URL;