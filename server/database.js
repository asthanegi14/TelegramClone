const express = require("express");
const mongoose = require("mongoose");

database = express();
require("dotenv").config();

const url = process.env.mongoUrl;

mongoose.connect(url).then(()=>{
    console.log("database connected");
})
.catch(()=>{
    console.log("connection failed");
})

const schema = new mongoose.Schema({
    email:{
        type: String,
        required: true
    },
    username:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    phone:{
        type: String,
        required: true
    },
    address:{
        type: String,
        required: true
    }
})

const collection = mongoose.model("userData", schema)

module.exports = collection