const express = require('express');
const {default:mongoose} = require('mongoose');
const route = require('../src/routes/routes');
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

app.use(express.json());
app.use(cors());

let url=process.env.MONGO_URL;
let PORT=process.env.PORT||5000;

mongoose.connect(url,{useNewUrlParser:true}).then(()=> console.log("MongoDb is connected")).catch((err)=> console.log(err));

app.use('/', route); 

app.get("/",(req,res)=> {
    res.send("Blogs API from Rahul_Developer")
});

app.listen(PORT,()=>{console.log(`Express is running on ${PORT}`)});
