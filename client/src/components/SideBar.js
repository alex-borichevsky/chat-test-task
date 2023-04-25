import React, {useEffect, useState} from 'react'
import {Box, Typography,Divider,Stack} from '@mui/material'
import UserCard from './UserCard';
import LogoutIcon from '@mui/icons-material/Logout';
import { useQuery } from '@apollo/client';
import { GET_ALL_USERS } from '../graphql/queries';

const SideBar = ({setloggedIn,loggedIn}) => {
    const  {loading,data,error, refetch} =  useQuery(GET_ALL_USERS)
    const [users, setUsers] = useState([]);

    useEffect(() =>{
        refetch();
        setUsers(data?.users);
    }, [data?.users,loggedIn])

    if(loading) return <Typography variant="h6">Loading chats</Typography>

    if(error){
        console.log(error.message)
    }
  return (
    <Box
    backgroundColor="#f7f7f7"
    height="100vh"
    width="250px"
    padding="10px"
    >
        <Stack
         direction="row"
         justifyContent="space-between"
        >
             <Typography variant="h6">All chats</Typography>
             <LogoutIcon onClick={()=>{
                 localStorage.removeItem('jwt')
                 setloggedIn(false)
             }} />    
        </Stack>
   
        <Divider />
        {
            users?.map(item=>{
                return <UserCard key={item.id} item={item} />
            })
        }


    </Box>
  )
}

export default SideBar