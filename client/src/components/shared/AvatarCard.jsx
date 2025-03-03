import { Avatar, AvatarGroup, Box, Stack } from '@mui/material'
import React from 'react'
import { transformImage } from '../libs/fileformat'

const AvatarCard = ({avatar=[],maxi=4}) => {
  return (
    <Stack direction={'row'} spacing={0.5}>
    <AvatarGroup max={maxi} sx={{position:"relative"}}>
    <Box width={"5rem"} height={"3rem"}>
        {
            avatar.map((i,index)=>{
                return (<Avatar
                key={Math.random()*100}
                src={transformImage(i)}
                alt={`Avatar ${index}`}
                sx={{
                    width:"2rem",
                    height:"2rem",
                    position:"absolute",
                    left:{
                        xs:`${0.5+index}rem`,
                        sm:`${index}rem`

                    }


                }}
                >

                </Avatar>)

            })
        }
    </Box>

    </AvatarGroup>

    </Stack>
  )
}

export default AvatarCard