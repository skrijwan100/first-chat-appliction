import { useEffect, useState } from 'react'
import './App.css'
import {io} from 'socket.io-client'
const socket=io("http://localhost:5000")
function App() {
const [usermessage,setusermessage]= useState({message:""})
const [allmessage,setallmessage]= useState([])
const onchange=(e)=>{
  e.preventDefault();
  setusermessage({...usermessage,[e.target.name]:e.target.value})

}
useEffect(()=>{
  socket.on('recivemessage',(data)=>{
  
    console.log(data, socket.id)
    setallmessage([data])
  })

},[])
const handlesendmessage=(e)=>{
  e.preventDefault()
  socket.emit("usermessage",usermessage.message)
}
  return (
    <>
    <h1>HII THIS IS A CHAT APP</h1>
    <div style={{display:"flex",gap:"20px",flexDirection:"column", width:"200px"}}>

    <input name='message'  onChange={onchange} type="text" placeholder='Enter your message' value={setusermessage.message} />
    <button onClick={handlesendmessage} type="button">SEND MESSAGE</button>
    </div>

    <div className="allmessage">
      {allmessage}
     {allmessage.map((msg,index)=>{
      <div>
          <h1>{index}</h1>
          <h2>{msg}</h2>
      </div>
    
      
     })}
    </div>
    </>
  )
}

export default App
