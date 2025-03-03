import { Dashboard as DashboardIcon, Group as GroupIcon, Logout as LogoutIcon, ManageAccounts as ManageAccountsIcon, Message as MessageIcon, } from '@mui/icons-material'
import { Button, IconButton, Stack, styled, Typography } from '@mui/material'
import React from 'react'
import { Link, useLocation } from 'react-router-dom'



const CustomLink=styled(Link)`
text-decoration:none;
border-radius:2rem;
padding:1rem 4rem;
color:black;
&:hover{
    color:"white"
}


`

const AdminBar = ({w="100% "}) => {

    const location=useLocation();

    const CustomButton=({btnname,icon,path})=>{

        return (
            <CustomLink  to={path} sx={location.pathname==path && {
                bgcolor:"black",
                color:"white"
            }}>
                <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
                    {icon}
                    <Typography>{btnname}</Typography>
                </Stack>
            </CustomLink>
        )
        
        
    }
  return (
    <Stack width={w} direction={"column"} alignItems={"center"}  marginTop={"10vh"} position={"relative"} >
        <Typography variant="h2" position={"absolute"} >Admin</Typography>
        <Stack spacing={"2rem"} alignItems={"center"} width={"100%"} marginTop={"15vh"}>
        <CustomButton btnname={"Dashboard"} icon={<DashboardIcon/>} path={"/admin/dashboard"} />
        <CustomButton btnname={"User"} icon={<ManageAccountsIcon/>} path={"/admin/users-management"}/>
        <CustomButton btnname={"Chats"} icon={<GroupIcon/>} path={"/admin/chats-management"}  />
        <CustomButton btnname={"Msg"} icon={<MessageIcon/>}  path={"/admin/messages"}/>
        <CustomButton btnname={"Logout"} icon={<LogoutIcon/>} path={"/"}/>
    
         </Stack>

        
        
    </Stack>
  )
}

export default AdminBar