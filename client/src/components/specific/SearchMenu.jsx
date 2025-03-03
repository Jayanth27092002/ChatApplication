import { Dialog, DialogTitle, InputAdornment, inputAdornmentClasses, List, ListItem, Stack, TextField } from '@mui/material'
import React, { useState } from 'react'
import {Search as SearchIcon} from "@mui/icons-material"
import { useInputValidation } from "6pp"
import { Sample_users } from '../../constants/sampleData'
import UserSearchItem from './UserSearchItem'

const SearchMenu= () => {
  const [Users,setUsers]=useState(Sample_users);
  const search=useInputValidation("")

  let addFriendHandler=false;

  const loadingFriendHandler=(id)=>{
    console.log(id);

  }
  return (
    
    <Dialog open>

    <Stack p={"2rem"} width={"25rem"}>
    <DialogTitle   textAlign={"center"}>Find User</DialogTitle>
    <TextField variant="outlined"
    size='small'
    label='Find Friends'
    value={search.value}
    onChange={search.changeHandler}
    slotProps={
      {
        input:{
          startAdornment:<InputAdornment><SearchIcon/></InputAdornment>
        }
      }
    }/>

    <List>

    {Users.map((user,index)=>(
      <UserSearchItem   key={user._id} user={user} Handler={addFriendHandler} loadingFriendHandler={loadingFriendHandler} />
    ))}

    </List>


   

    </Stack>

    


    </Dialog>
  )
}

export default SearchMenu