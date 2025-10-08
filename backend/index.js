const express= require('express')
const http= require('http')
const app = express()
const server= http.createServer(app)
const {Server}=require('socket.io')
const cors= require('cors')
const { Socket } = require('dgram')
require('dotenv').config()
const PORT = process.env.PORT;
app.use(cors())
const io = new Server(server,{
    cors:{
        origin:'http://localhost:5173',
        methods:['GET','POST']
    }
})

app.get("/",(req,res)=>{
    res.send("hiiiiiiiiiii")
})

io.on('connection',(socket)=>{
    console.log('a new user connected', socket.id)
    socket.on("usermessage",(data)=>{
      io.emit("recivemessage",data)
      console.log(data)
    })
})

server.listen(PORT ,()=>{
    console.log(`The app run in the ${PORT}`)
    console.log(process.env.FRONTEND_ORIGIN)
})