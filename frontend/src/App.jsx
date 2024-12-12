import React from 'react'
import {Routes,Route} from "react-router-dom"
import SignUpPage from './pages/auth/signup/signupPage'
import LoginPage from './pages/auth/login/LoginPage'
import HomePage from './pages/home/HomePage'
import Sidebar from './components/common/SideBar'
const App = () => {
  return (
    <div className='flex max-w-6xl mx-auto'>
      <Sidebar/>
      <Routes>
        <Route path="/" element={<HomePage/>}></Route>
        <Route path="/login" element={<LoginPage/>}></Route>
        <Route path="/signup" element={<SignUpPage/>}></Route>

      </Routes>
    </div>
  )
}

export default App