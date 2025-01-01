import express, { json } from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose';
import { userRoute } from './route/UserRoute.js';

// const express = require('express');
// const dotenv = require('dotenv');
// const mongoose = require('mongoose');
// const {useRoute} = require('./route/UserRoute.js');
dotenv.config();

const app = express();
app.use(json());
const mongo_uri = process.env.MONGODB_URI
mongoose.connect(mongo_uri);
const database = mongoose.connection;
database.once('connected', () => {
    console.log("Database Connected");
})
database.on("error", () => {
    console.log("Error connecting to MongoDB");

})
const port = process.env.PORT;

app.use('/', userRoute);
app.listen(port, () => {
    console.log(`server connected on ${port}`);

})