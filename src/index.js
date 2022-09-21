const express = require('express');
const {default:mongoose} = require('mongoose');
const route = require('../src/routes/routes');
const app = express();

app.use(express.json());

let url="mongodb+srv://mini-blog:zeCdDYkEbu4sZAR8@cluster0.po8g5rr.mongodb.net/blog";
let port=process.env.PORT||3000;

mongoose.connect(url,{useNewUrlParser:true}).then(()=> console.log("MongoDb is connected")).catch((err)=> console.log(err));

app.use('/', route); 
app.listen(port,()=>{console.log(`Express is running on ${port}`)});
