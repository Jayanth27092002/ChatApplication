import React, { useState } from 'react'
import { Button, Dialog, DialogTitle, Stack, TextField, Typography }  from "@mui/material"
import { Sample_users } from '../../constants/sampleData'
import UserSearchItem from './UserSearchItem'
import { useInputValidation } from '6pp'

const NewGroupMenu = () => {

  const groupName=useInputValidation("");

  const [members,setMembers]=useState(Sample_users);
  const [selectedMembers,setSelectedMembers]=useState([]);

  const AddToGroupHandler=(id)=>{
    console.log(id);
    setSelectedMembers((prev)=>(
      prev.includes(id) ? prev.filter((currentId)=>currentId!=id) :[...prev,id]
    ))


     
  }

  const submitHandler=()=>{

  }
  return (
    <Dialog open >
     <Stack  p={{xs:"1rem",sm:"3rem"}} width={"25rem"} spacing={"1rem"} >
     <DialogTitle textAlign={"center"} variant='h4'>Create Group</DialogTitle>


     <TextField label={"Name your group "} value={groupName.value} onChange={groupName.changeHandler} width={"25rem"} >

     </TextField>

     <Typography variant="body1" marginBottom={"1rem"}>Members</Typography>

     <Stack>

     {
        members.map((user,index)=>(
         <UserSearchItem   key={user._id} user={user} Handler={AddToGroupHandler} isAdded={selectedMembers.includes(user._id)}  />
        ))
      }

     </Stack>

     


      <Stack direction={"row"} justifyContent={"space-evenly"} spacing={"1rem"}>
      <Button color='error'>Delete</Button>
      <Button variant='contained' onClick={submitHandler}>Create</Button>
      

      </Stack>
          
          


      

     </Stack>

    </Dialog>

    
    
  )
}

export default NewGroupMenu