import { Stack } from '@mui/material'
import React from 'react'
import { BouncingSkeleton } from '../Styles/StyledComponent'

const TypingLoader = () => {
  return (
    <Stack
    spacing={"0.5rem"} direction={"row"} padding={"0.5rem"} justifyContent={"flex-start"} >

        <BouncingSkeleton variant='circular' width={15} height={15} style={{
            animationDelay:"0.1s"
        }}/>

<BouncingSkeleton variant='circular' width={15} height={15} style={{
            animationDelay:"0.2s"
        }}/>

<BouncingSkeleton variant='circular' width={15} height={15} style={{
            animationDelay:"0.4s"
        }}/>

<BouncingSkeleton variant='circular' width={15} height={15} style={{
            animationDelay:"0.6s"
        }}/>


    </Stack>
  )
}

export default TypingLoader