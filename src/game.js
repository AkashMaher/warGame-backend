const MongoClient = require("mongodb").MongoClient;
const mongourl = process.env['mongourl']
const mongoClient = new MongoClient(mongourl);

async function updateGame(input){
    const {host, address, room_Id, winning_address, start_time, end_time} = input
    let result = await mongoClient.connect();
    let db = result.db("CardGame");
    let collection = db.collection('games');
    
    let data = await collection.findOne({ room_Id:room_Id});
    if(!data){
        await collection.insertOne({room_Id, host,addresses:{player1:address,player2:''}, start_time})
        data = await collection.findOne({ room_Id:room_Id});
    } else {
        if(data?.addresses?.player1 !== address) {
            await collection.findOneAndUpdate({ room_Id:room_Id},{$set:{addresses:{player1:data?.addresses?.player1,player2:address}}})
        } else return {state:false, message:'same user'}
    }
    
    data = await collection.findOne({ room_Id:room_Id});
    return data;
}


async function getGame(room_Id){
    let result = await mongoClient.connect();
    let db = result.db("CardGame");
    let collection = db.collection('games');
    
    let data = await collection.findOne({ room_Id: room_Id});
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

async function annouceWinner(input){
    const {room_Id, winning_address, end_time} = input
    let result = await mongoClient.connect();
    let db = result.db("CardGame");
    let collection = db.collection('games');
    
    let data = await collection.findOne({ room_Id:room_Id});
    if(!data){
        return {state:false}
    } else {
        if(data?.winning_address =='' || !data?.winning_address || !data?.winning_address == null ) {
            await collection.findOneAndUpdate({ room_Id:room_Id},{$set:{winning_address, end_time}})
        } else {
            return {state:false}
        }
    }
    
    data = await collection.findOne({ room_Id:room_Id});
    return data;
}

module.exports = {updateGame, getGame, annouceWinner }
