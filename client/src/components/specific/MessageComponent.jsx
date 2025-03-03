import { Box, Stack, Typography } from '@mui/material';
import { color } from 'chart.js/helpers';
import moment from 'moment';
import React from 'react'
import { fileformat } from '../libs/fileformat';
import RenderAttachment from './RenderAttachment';

const MessageComponent = ({message,user}) => {
  const {attachments,content,sender,createdAt}=message;

  const sameSender=sender?._id==user?._id;
  console.log(sameSender);

  return (
    <div style={{
      alignSelf:sameSender? 'flex-end':'flex-start',
      backgroundColor:'white',
      color:'black',
      borderRadius:"5px",
      padding:"0.5rem",
      width:"fit-content",

    }}>

    <Stack sx={{
    
    }}>
      
      {
       !sameSender && <Typography color='#0e51c1' fontWeight={"600"} variant='caption'>{sender.name}</Typography>
      }

      {
        attachments.length>0 && attachments.map((attachment,index)=>{

          const {url}=attachment;
          const file=fileformat(url);
          return(
            <Box key={index}>
            <a href={url} target='_blank' download style={{color:"black"}}>{
              <RenderAttachment file={file} url={url} />}
              </a>

            </Box>

          )
        })
      }

      {
        content && <Typography>{content}</Typography>
      }

      <Typography variant='caption' color={'text.secondary'}>{moment(createdAt).fromNow()}</Typography>

    </Stack>

    </div>
  )
}

export default MessageComponent