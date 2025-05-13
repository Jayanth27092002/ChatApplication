import { Error } from '@mui/icons-material'
import { Container, Stack, Typography } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <Container maxWidth="lg" sx={{height:"100vh"}}>
        <Stack alignContent={"center"} alignItems={"center"}>
            <Error/>
            <Typography variant='h3'>404</Typography>
            <Link to="/">Go back to home</Link>

        </Stack>
    </Container>
  )
}

export default NotFound