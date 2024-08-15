const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')
require('dotenv').config()

const port = process.env.PORT || 3001;
const uri = process.env.MONGODB_URI

const app = express()

app.use(cors({
    origin:"http://localhost:3000",
    credentials:true
}))
app.use(express.json())
app.use(cookieParser())

mongoose.connect(uri)

const db = mongoose.connection;

db.on('error', (err) => {
    console.error('Error connecting to MongoDB:', err);
});
db.once('open', () => {
    console.log('MongoDB connection successful');
    app.listen(port, (err) => {
        if(err){
            console.log(`Server not started`);
        }else{
            console.log(`Server running successfully on port ${port}`);
        }
    });
});