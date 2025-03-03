import { Avatar, Stack, Typography } from '@mui/material'
import React from 'react'
import moment  from "moment"
import {Face as FaceIcon,AlternateEmail as EmailIcon,CalendarMonth as CalendarIcon } from "@mui/icons-material"



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

const Profile = () => {
  return (
    
    <Stack spacing={"2rem"} alignItems={'center'}>
    <Avatar sx={{
        height:"10rem",
        width:"10rem",
        border:"2px solid white",
        objectFit:"contain",
        marginBottom:"1rem"
    }} />
     
    <ProfileCard heading={"BIO"} text={"Fucking my Life"} /> 
    <ProfileCard heading={"name"} text={"Jayanth varma"} icon={<FaceIcon/>}/>
    <ProfileCard heading={"Contact"} text={"dantuurijayanth1@gmail.com"} icon={<EmailIcon/>}/> 
    

    <ProfileCard heading={"Joined"} text={moment('1970-01-01T00:00:02.012Z').fromNow()} icon={<CalendarIcon/>}/> 

 
    </Stack>
        

  )
}




export default Profile