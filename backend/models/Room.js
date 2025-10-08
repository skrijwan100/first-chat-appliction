const mongoose = require('mongoose')
const { Schema } = mongoose;
const room = new Schema({
    RoomId: {
        type: String,
        require: true,
    }
}, { timestamps: true })
module.exports=mongoose.model('Room',room);