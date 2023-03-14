const fs = require('node:fs');
require('dotenv').config({ path: '.env' })
const express = require("express");
const bodyParser = require('body-parser');
const app = express();
const path = require("path");
const logger = require("morgan");
const cors = require("cors");
require('dotenv').config()
const http = require('https');

var urlencodedParser = bodyParser.urlencoded({ extended: false })  


const { createUser, getUser } = require('./src/user');
const {updateGame, getGame, annouceWinner } = require('./src/game')






// console.log(process.env.Test)
app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use(cors());



// database
const mongoose = require('mongoose')
const MongoClient = require('mongodb').MongoClient;
const mongourl = process.env['mongourl']
const UserModel = require('./models/userModels')
const GameModel = require('./models/gameModels')


const mongoClient = new MongoClient(mongourl);
const databaseName = "CardGame";

// routes



app.post(`/create_user`, urlencodedParser, async function (req, res) {  
   // Prepare output in JSON format  
   console.log(req.body)
   if(req.body.wallet_address == '' || req.body.wallet_address == null) return;
   response = {  
       name:req.body.name,  
       image:req.body.image,
       wallet_address:req.body.wallet_address  
   };  
   let data = await createUser(response)
   console.log(data)
   return res.end(JSON.stringify(data));  
})  



app.get(`/get_user/:address`,  async function (req, res) {  
    if(!req.params.address || req.params.address == null) return res.end(ERR)
    if(req.params.address == 'NA') return res.end(JSON.stringify([]))
    let data = await getUser(req.params.address)
    return res.end(JSON.stringify(data));  
    
})  


app.post(`/update_game`, urlencodedParser, async function (req, res) {  
   // Prepare output in JSON format  
   const {address, room_Id, winning_address, end_time, host} = req.body
   if(!room_Id) return;
   let start_date = parseInt(Date.now()/1000)
   response = {  
       host:host,
       address:address,  
       room_Id:room_Id,
       start_time:start_date,
       winning_address:winning_address,
       end_time:end_time
   };  
   let data = await updateGame(response)
   return res.end(JSON.stringify(data));  
})  


app.get(`/get_game/:room_id`,  async function (req, res) {  
    if(!req.params.room_id || req.params.room_id == null) return res.end(ERR)
    if(req.params.room_id == 'NA' || req.params.room_id =='') return res.end(JSON.stringify([]))
    let data = await getGame(req.params.room_id)
    return res.end(JSON.stringify(data));  
    
})  

app.post(`/win_game`, urlencodedParser, async function (req, res) {  
   // Prepare output in JSON format  
   const {room_Id, winning_address} = req.body

   console.log(req.body)

   let end_date = parseInt(Date.now()/1000)
   response = {  
       room_Id:room_Id,
       winning_address:winning_address,
       end_time:end_date
   };  
   let data = await annouceWinner(response)
   return res.end(JSON.stringify(data));  
})  

const port = process.env.PORT || 5500;
app.listen(port, () => console.log(`Server Running on port ${port}`));



