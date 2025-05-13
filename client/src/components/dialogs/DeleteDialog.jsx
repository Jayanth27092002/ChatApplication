import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack } from '@mui/material'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setIsDeleteMenu } from '../../redux/misc';

const DeleteDialog = ({deleteHandler,loadingHandler}) => {
  const {isDeleteMenu}=useSelector((state)=>state.misc);
  const dispatch=useDispatch();


  const closeHandler=()=>{

    dispatch(setIsDeleteMenu(false));
    
  }
  return (
    <Dialog open={isDeleteMenu} onClose={closeHandler}>
    <DialogTitle>Confirm Delete</DialogTitle>
    <DialogContent>
    <DialogContentText>

    Are you sure you want to delete?

    </DialogContentText>
   </DialogContent>
    
    <DialogActions>

    <Button  disabled={loadingHandler} color='error' onClick={deleteHandler}>Yes</Button>
    <Button   onClick={closeHandler} disabled={loadingHandler}>No</Button>

    </DialogActions>

   

   

    </Dialog>
  )
}

export default DeleteDialog