import { Avatar, Button, ListItem, Stack, Typography } from '@mui/material'
import React, { memo } from 'react'

const SingleNotificationItem = ({name,id,avatar,handler}) => {

return (
   <ListItem>

    <Stack  direction={"row"} alignItems={"center"} spacing={"1rem"} width={"100%"} >
   <Avatar src={avatar}/>

   <Typography variant="body1" sx={{
    flexGrow:1,
    display:"-webkit-box",
    WebkitLineClamp:1,
    WebkitBoxOrient:"vertical",
    overflow:"hidden",
    textOverflow:"ellipsis"
   }} >{`${name} sent you a friend request`}</Typography>


   <Stack 
    direction={{
        xs:"column",
        sm:"row"}
    }
   >

   <Button  onClick={()=>handler({_id:id,accept:true})}>Accept</Button>
  <Button color='error'  onClick={()=>handler({_id:id,accept:false})}>Reject</Button>


   </Stack>
  
  




   </Stack>

   </ListItem>
   
  )
}

export default memo(SingleNotificationItem)