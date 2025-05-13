import { Avatar, Stack, Typography } from '@mui/material'
import React from 'react'
import moment  from "moment"
import {Face as FaceIcon,AlternateEmail as EmailIcon,CalendarMonth as CalendarIcon } from "@mui/icons-material"
import { useSelector } from 'react-redux';
import LayoutLoader from '../loaders/LayoutLoader';
import { transformImage } from '../libs/fileformat';



const ProfileCard=({text,icon,heading})=>{

  

    return (
        <Stack direction={"row"} spacing={"1rem"} textAlign={"center"} color={"white"} >

        {icon && icon}
        <Stack alignItems={"center"}>
            <Typography variant="body1">{text}</Typography>
            <Typography variant="caption" color="grey" >{heading}</Typography>
        </Stack>

        </Stack>
    )

}


const Profile = ({}) => {
  const {user}=useSelector((state)=>state.auth);

  
  return  ( !user ?<LayoutLoader/> :
    
    <Stack spacing={"2rem"} alignItems={'center'}>
    <Avatar
    src={user.avatar.url}
     sx={{
        height:"10rem",
        width:"10rem",
        border:"2px solid white",
        objectFit:"contain",
        marginBottom:"1rem"
    }} />
     
    <ProfileCard heading={"BIO"} text={user.bio} /> 
    <ProfileCard heading={"name"} text={user.name} icon={<FaceIcon/>}/>
    <ProfileCard heading={"Contact"} text={user.contact} icon={<EmailIcon/>}/> 
    

    <ProfileCard heading={"Joined"} text={moment(user.createdAt).fromNow()} icon={<CalendarIcon/>}/> 

 
    </Stack>
        

  )
}




export default Profile