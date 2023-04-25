import React from 'react'
import {Box} from '@mui/material'
import SideBar from '../components/SideBar';
import {Route,Routes} from 'react-router-dom'
import HomeScreenWrapper from '../components/HomeScreen';
import Chat from '../components/Chat';

const AllRoutes = ()=>{
  return(
    <Routes>
      <Route path="/" element={<HomeScreenWrapper/>} />
      <Route path="/:id/:name" element={<Chat />} />
    </Routes>
  )
}


const HomeScreen = ({setloggedIn,loggedIn}) => {
  return (
    <Box
    display="flex"
    >
       <SideBar setloggedIn={setloggedIn} loggedIn={loggedIn} />
       <AllRoutes />
    </Box>
  )
}

export default HomeScreen