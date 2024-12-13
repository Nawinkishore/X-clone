import React from 'react'
import {Routes,Route, Navigate} from "react-router-dom"
import SignUpPage from './pages/auth/signup/signupPage'
import LoginPage from './pages/auth/login/LoginPage'
import HomePage from './pages/home/HomePage'
import Sidebar from './components/common/SideBar'
import RightPanel from './components/common/RightPanel'
import NotificationPage from './pages/notification/NotificationPage'
import ProfilePage from './pages/profile/ProfilePage'
import { Toaster } from 'react-hot-toast'
import { useQuery } from '@tanstack/react-query'
import LoadingSpinner from './components/common/LoadingSpinner'
import { baseUrl } from './constant/url'
const App = () => {
  const {data:authUser,isLoading} = useQuery({
    queryKey:["authUser"],
    queryFn: async ()=>{
      try {
        const res = await fetch(`${baseUrl}/api/auth/me`, {
          method: "GET",
          credentials: "include",
          headers:{
            "Content-Type":"application/json",
          }
        });
        const data = await res.json();
        if(data.error){
          return null; 
          }
        if (!res.ok) {
          throw new Error(data.error||"Something went wrong");
        }
        return data;
      } catch (error) {
        throw error;
      }
    },
    retry:false
  })
  if(isLoading){
    return(
      <div className='flex items-center justify-center h-screen'>
      <LoadingSpinner/>
   </div>
    )
  }
  return (
    <div className='flex max-w-6xl mx-auto'>
      {authUser && <Sidebar/>}
      <Routes>
        <Route path="/" element={authUser?<HomePage/>:<Navigate to="/login"/>}></Route>
        <Route path="/login" element={!authUser?<LoginPage/>:<Navigate to="/"/>}></Route>
        <Route path="/signup" element={!authUser?<SignUpPage/>:<Navigate to="/"/>}></Route>
        <Route path='/notifications' element={authUser?<NotificationPage/>:<Navigate to="/login"/>}></Route>
        <Route path='/profile/:username' element={authUser?<ProfilePage/>:<Navigate to="/login"/>}></Route>
      </Routes>
      {authUser && <RightPanel/>}
       <Toaster/>

    </div>
  )
}

export default App