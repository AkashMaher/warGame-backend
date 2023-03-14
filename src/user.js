const MongoClient = require("mongodb").MongoClient;
const mongourl = process.env['mongourl']
const mongoClient = new MongoClient(mongourl);

async function createUser(input){
    const {name, wallet_address, image} = input
    let result = await mongoClient.connect();
    let db = result.db("CardGame");
    let collection = db.collection('users');
    const createDate = parseInt(Date.now()/1000)
    let data = await collection.findOne({ wallet_address: wallet_address });
    if(!data){
      await collection.insertOne({user_name:name,image:image, wallet_address:wallet_address, creation_date:createDate})
      data = await collection.findOne({ wallet_address: wallet_address});
    } else {
      await collection.findOneAndUpdate({ wallet_address: wallet_address },{$set:{user_name:name?name:data?.user_name,image:image?image:data?.image,wallet_address:wallet_address}})
    }
    
    data = await collection.findOne({ wallet_address: wallet_address });
    return data;
}


async function getUser(wallet_address){
    let result = await mongoClient.connect();
    let db = result.db("CardGame");
    let collection = db.collection('users');
    
    let data = await collection.findOne({ wallet_address: wallet_address });
    if(!data){
         return {
          message:false
        }
    }
    return {
      message:true,
      data:data
    }
}

module.exports = {createUser, getUser }
