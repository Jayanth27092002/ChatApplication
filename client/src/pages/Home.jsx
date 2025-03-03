import React from 'react'
import AppLayout from '../components/layout/AppLayout'
import { Box, Typography } from '@mui/material';

const Home = () => {
  return (
    <Box bgcolor={"lightgray"} height={"100%"} >

    <Typography padding="2rem"    variant="h5" textAlign={"center"} >
      Select a friend to chat
    </Typography>

    </Box>
    
  )
}

export default AppLayout()(Home);