const mongoose = require('mongoose')
const { Schema,model } = mongoose;

const GameModel = new Schema({
    host:{type:String, require:true},
    addresses:{type:Object},
    room_Id:{type:String,require:true},
    winner_address:{type:String},
    start_time:{type:String, require:true},
    end_time:{type:String}
})

module.exports = model('games', GameModel); 