const express = require('express')
const router = express.Router();
const Room = require("../models/Room")

router.post("/addroom", async (req, res) => {
    try {
        const { generatedRoomId } = req.body;
        console.log(generatedRoomId)
        const newRoom= await Room({
            RoomId:generatedRoomId
        })
        await newRoom.save()
        return res.status(200).json({ "message": "Your room is created", "status": true })
    } catch (error) {
        console.log(error)
        return res.status(505).json({ "error": "Internal server error" })
    }
})
router.post("/findroom",async(req,res)=>{
    try {
        const {RoomId}=req.body;
        const roomdata= await Room.findOne({RoomId:RoomId})
        return res.status(200).json({ "message": roomdata,"status": true  })
        
    } catch (error) {
        console.log(error)
        return res.status(505).json({ "error": "Internal server error" })
    }
})
module.exports = router;