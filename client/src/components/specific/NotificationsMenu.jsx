import { Dialog, DialogTitle, Stack, Typography } from '@mui/material'
import React from 'react'
import { Sample_notifications } from '../../constants/sampleData'
import SingleNotificationItem from './SingleNotificationItem'

const NotificationsMenu = () => {
  const NotificationHandler=({_id,accept})=>{


  }
  return (
    <Dialog open>
      <Stack p={{xs:"1rem",sm:"2rem"}} maxWidth={"25rem"} alignItems={"center"}>
      <DialogTitle>Notifications</DialogTitle>

      {
        Sample_notifications.length> 0 ? (
          Sample_notifications.map((notification)=>{
            return (
            <SingleNotificationItem  key={notification._id} name={notification.sender.name} id={notification._id} avatar={notification.sender.avatar}  handler={NotificationHandler}/>
            )
          })
        )
          
          


        :<Typography>0 Notifications</Typography>
      }

      </Stack>
    </Dialog>
  )
}

export default NotificationsMenu