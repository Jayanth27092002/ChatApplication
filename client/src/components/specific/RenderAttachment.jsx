import { FileOpen as FileOpenIcon } from '@mui/icons-material'
import React from 'react'
import { transformImage } from '../libs/fileformat'

const RenderAttachment = ({file,url}) => {
  switch (file) {
    case "video":
      return <video src={url} preload='none' width={"200px"} controls/>   
        

    case "audio":

       return <audio src={url} preload='none' controls/>
        
      

    case "image":
        
        return <img src={transformImage(url)} width={"200px"} height={"200px"} style={{objectFit:"contain"}} />
  
    default:
       return  <FileOpenIcon/>;
  }
}

export default RenderAttachment