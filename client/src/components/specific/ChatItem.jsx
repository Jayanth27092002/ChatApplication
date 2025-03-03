import React, { memo } from 'react'
import { Customlink } from '../Styles/StyledComponent'
import { Box, Stack, Typography } from '@mui/material'
import { Translate } from '@mui/icons-material'
import AvatarCard from '../shared/AvatarCard'

const ChatItem = (
    {
        avatar=[],
        name,
        _id,
        groupChat=false,
        sameSender,
        isOnline,
        newMessageAlert,
        index=0,
        handleDeleteChat
    }
) => {
  return (
    <Customlink to={`/chat/${_id}`} onContextMenu={(e)=>handleDeleteChat(e,_id,groupChat)} sx={{padding:0}}>

    <div style={{
        display:'flex',
        gap:"1rem",
        alignItems:"center",
        padding:"1rem",
        backgroundColor: sameSender ? "black":"unset",
        color:sameSender?"white":"unset",
        position:'relative'
        

    }}>

    <AvatarCard avatar={avatar}/>

    

    <Stack>

    

    
        <Typography>{name}</Typography>
        {
            newMessageAlert && <Typography>
                {newMessageAlert.count} New message
            </Typography>
        }

        {isOnline && <Box sx={{
        width:"10px",
        height:"10px",
        borderRadius:"50%",
        backgroundColor:"green",
        position:"absolute",
        top:"50%",
        right:"1rem",
        transform:"translateX(+50%)"
    }}/> }

    </Stack>

    
    </div>

    </Customlink>
    
  )
}

export default memo(ChatItem)