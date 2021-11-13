const express = require('express');
const app = express();
const cors = require('cors');
// const admin = require("firebase-admin");
require ('dotenv').config();
const { MongoClient } = require('mongodb');
var ObjectId = require('mongodb').ObjectID;

const port = process.env.PORT || 5000;














app.get('/', (req, res) => {
    res.send('Hello Toy Zone')
})

app.listen(port, () => {
    console.log(`listening at ${port}`)
});
