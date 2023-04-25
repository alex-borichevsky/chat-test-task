import React, {useState, useEffect, useRef} from 'react'
import { useParams } from 'react-router-dom';
import {AppBar, Toolbar, Avatar, Typography, Box, TextField, Stack} from '@mui/material'
import Message from './Message';
import { useQuery, useMutation, useSubscription } from '@apollo/client';
import { GET_MSG } from '../graphql/queries';
import SendIcon from '@mui/icons-material/Send';
import { SEND_MSG } from '../graphql/mutations';
import { MSG_SUB } from '../graphql/subscriptions';
import jwt_decode from 'jwt-decode'

const Chat = () => {

  const [isTyping, setIsTyping] = useState(false);

  const {id,name} = useParams()
  const [text,setText] = useState("")
  const [messages,setMessages] = useState([])
  const {userId} = jwt_decode(localStorage.getItem('jwt'))
  const messageEndRef = useRef(null);

  const {data,loading,error} = useQuery(GET_MSG,{
        variables:{
            receiverId: +id
        },
        onCompleted(data){
            setMessages(data.messagesByUser)
        }
    })

  useEffect(() => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
  }, [messages]);

  const [sendMessage] = useMutation(SEND_MSG,{
    onCompleted(data){
      setMessages((prevMessages)=>[...prevMessages,data.createMessage])
    }
  })

  const {data:subData} = useSubscription(MSG_SUB,{
    onSubscriptionData({subscriptionData:{data}}){
       if(
         (data.messageAdded.receiverId == +id && data.messageAdded.senderId == userId) ||
         (data.messageAdded.receiverId == userId && data.messageAdded.senderId == +id) 
       ){
          setMessages((prevMessages)=>[...prevMessages,data.messageAdded])  
       }

    }
  })

  return (
    <Box
    flexGrow={1}
    > 
    <AppBar position="static" 
    sx={{backgroundColor:"white",boxShadow:0}}
    >
        <Toolbar sx={{justifyContent: 'center', alignItems: 'center'}}>
            <Typography variant="h6" color="black" >Chat with your friends</Typography>
        </Toolbar>
      </AppBar>
      <Box backgroundColor="#f5f5f5" height="80vh" padding="10px" sx={{overflowY:"auto"}} >
               {
                   loading? <Typography variant="h6">loading chats</Typography>
                       : messages.map(msg=>{
                           return <Message key={msg.createdAt} text={msg.text} date={msg.createdAt} direction={msg.receiverId == +id? "end":"start"} />
                       })
               }
               <div ref={messageEndRef}/>
      </Box>
      <Stack direction="row">

              <TextField
              placeholder="Type a message"
              variant="standard"
              fullWidth
              multiline
              rows={2}
              value={text}
              onChange={e => {
                  setText(e.target.value);
                  setIsTyping(true);
              }}
              onBlur={() => {
                  setIsTyping(false);
              }}
              />
          {isTyping && <Typography variant="body2">You are typing...</Typography>}
          <SendIcon fontSize="large" onClick={()=>{
              sendMessage({
                variables:{
                  receiverId: +id,
                  text:text
                }
              });
              setText("");
            }} />
      </Stack>
    </Box>
  )
}

export default Chat