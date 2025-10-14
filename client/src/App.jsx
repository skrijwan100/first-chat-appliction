import { useEffect, useState } from 'react'
import './App.css'
import ChatRoom from './components/chatRoom'
import DevChatHomePage from './components/GenarateRoom'
import { ToastContainer } from 'react-toastify'
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
function App() {


  return (
    <>
    <BrowserRouter>
      <ToastContainer />
    <Routes>
      <Route path='/' element={<DevChatHomePage />}/>
      <Route path='/:id' element={<ChatRoom/>}/>
    </Routes>
    </BrowserRouter>
      
    </>
  )
}

export default App
