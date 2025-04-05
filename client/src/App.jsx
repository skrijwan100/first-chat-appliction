import { useEffect, useState } from 'react'
import './App.css'
import {io} from 'socket.io-client'
const socket=io("http://localhost:5000")
function App() {
const [usermessage,setusermessage]= useState({message:"",username:""})
const [allmessage,setallmessage]= useState([])

const onchange=(e)=>{
  e.preventDefault();
  setusermessage({...usermessage,[e.target.name]:e.target.value})

}
useEffect(()=>{
  const name= prompt("Enter your name")
  setusermessage({username:name})
  console.log(usermessage.username)
  socket.on('recivemessage', (data) => {
    setallmessage((prevMessages) => [...prevMessages, data]);
});
console.log(allmessage)
  return () => {
    socket.off('recivemessage'); // Clean up the listener on component unmount
};

},[])
const handlesendmessage=(e)=>{
  e.preventDefault()
  if (usermessage.message.trim() !== "") { // Ensure the message is not empty
    socket.emit("usermessage", usermessage.message,usermessage.username);
    setusermessage({ message: "" }); // Reset usermessage to an empty object
}

}
  return (
    <>
    <h1>HII THIS IS A CHAT APP</h1>
    <div style={{display:"flex",gap:"20px",flexDirection:"column", width:"200px"}}>
    <input name='message' onChange={onchange} type="text" placeholder='Enter your message' value={usermessage.message} />
   <button onClick={handlesendmessage} type="button">SEND MESSAGE</button>

    </div>

    <div className="allmessage">
      {allmessage.map((data,index)=>{

        return(

         <h1 key={index}>{data}</h1> 
        )
      })}
     
    </div>
    </>
  )
}

export default App
