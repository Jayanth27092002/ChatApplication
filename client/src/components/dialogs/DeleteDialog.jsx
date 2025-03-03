import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack } from '@mui/material'
import React from 'react'

const DeleteDialog = ({deleteHandler,closeHandler}) => {
  return (
    <Dialog open onClose={closeHandler}>
    <DialogTitle>Confirm Delete</DialogTitle>
    <DialogContent>
    <DialogContentText>

    Are you sure you want to delete?

    </DialogContentText>
   </DialogContent>
    
    <DialogActions>

    <Button  color='error' onClick={deleteHandler}>Yes</Button>
    <Button   onClick={closeHandler}>No</Button>

    </DialogActions>

   

   

    </Dialog>
  )
}

export default DeleteDialog