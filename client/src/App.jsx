import { useEffect, useState } from 'react'
import './App.css'
import ChatRoom from './components/chatRoom'
import DevChatHomePage from './components/GenarateRoom'
import { ToastContainer } from 'react-toastify'
function App() {


  return (
    <>
      <ToastContainer />
      <DevChatHomePage />
      {/* <ChatRoom/> */}
    </>
  )
}

export default App
