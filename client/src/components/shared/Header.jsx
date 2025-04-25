import { AppBar, Backdrop, Box, IconButton, Toolbar, Tooltip, Typography } from '@mui/material'
import React, { lazy, Suspense, useState } from 'react'
import {Menu as MenuIcon,Search as SearchIcon,Add as AddIcon,Group as GroupIcon,Logout as LogoutIcon,Notifications as NotificationIcon} from "@mui/icons-material"
import { useNavigate } from 'react-router-dom'


const SearchMenu=lazy(()=>import("../specific/SearchMenu"))

const NotificationsMenu=lazy(()=>import("../specific/NotificationsMenu"))

const NewGroupMenu=lazy(()=>import("../specific/NewGroupMenu"))
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast'
import { useDispatch } from 'react-redux';
import { userNotExists } from '../../redux/auth'
import { server } from '../../constants/config'


const NavIconButton=({title,icon,Handler})=>{
  return (
    
      <Tooltip title={title}>
      <IconButton color="inherit" size="large" onClick={Handler}>
        {icon}
      </IconButton>

      </Tooltip>
    
  );

}




const Header = () => {

  const dispatch=useDispatch();



  const navigate=useNavigate();
  const [isMobile,setIsMobile]=useState(false);
  const [isSearch,setIsSearch]=useState(false);
  const [isNewGroup,setIsNewGroup]=useState(false);
  const [isNotification,setIsNotification]=useState(false);

  

  const handleMobile=()=>{
    console.log("HandleMobile");
    setIsMobile(prev=>!prev);
  }

 
  const SearchDialog=()=>{
    console.log("SearchDIalog")
    setIsSearch(prev=>!prev);
  }

  const NewgroupOpen=()=>{
    console.log("newGroupOpen")
    setIsNewGroup(prev=>!prev);

  }

  const OpenNotification=()=>{
    setIsNotification(prev=>!prev)
  }



  const NavigateToGroup=()=>{
    navigate("/groups")

  }

  const LogoutHandler=async()=>{
    console.log("Logout")
     
    try{
      const {data}=await axios.get(`${server}/api/v1/users/logout`,{
        withCredentials:true
      });
     
      dispatch(userNotExists());
      toast.success(data.message);

    }
    catch(error){

      toast.error(error.response.data.message);

    }
    


    



  }




  return (
    <>
      <Box sx={{flexGrow:1}} height={"4rem"}  >

      <AppBar position="static" sx={{bgcolor:"grey"}} >

      <Toolbar>

      <Typography variant='h6' sx={{display:{xs:"none",sm:"block"}}}>Chattu</Typography>

      <Box sx={{display:{xs:"block",sm:"none"}}}>
      <IconButton color='inherit' onClick={handleMobile}>
       <MenuIcon/>
        
      </IconButton>


      </Box>

      <Box sx={{flexGrow:1}}/>


      <Box>
        <NavIconButton title={"Search"} icon={<SearchIcon/>} Handler={SearchDialog} />

        <NavIconButton title={"New Group"} icon={  <AddIcon/>} Handler={NewgroupOpen} />
        

        <NavIconButton title={"Manage Group"} icon={ <GroupIcon/>} Handler={NavigateToGroup} />

        <NavIconButton title={"Notifications" } icon={<NotificationIcon/> } Handler={OpenNotification}  />
        

        <NavIconButton title={"Logout"} icon={<LogoutIcon/>} Handler={LogoutHandler} />
        

      </Box>


      
    
    

     
      </Toolbar>



      </AppBar>

      </Box>

      {isSearch && <Suspense fallback={<Backdrop open/>} > 
        <SearchMenu/>
      </Suspense>   }

      {isNotification && <Suspense fallback={<Backdrop open/>} > 
        <NotificationsMenu/>
      </Suspense>   }


      {isNewGroup && <Suspense fallback={<Backdrop open/>} > 
        <NewGroupMenu/>
      </Suspense>   }




    </>
  )
}




export default Header