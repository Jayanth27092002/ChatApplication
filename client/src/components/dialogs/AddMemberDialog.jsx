import { Button, Dialog, DialogTitle, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import { Sample_users } from "../../constants/sampleData";
import UserSearchItem from "../specific/UserSearchItem";
import { useAddMembersToGroupMutation, useMyFriendsQuery } from "../../redux/api/api";
import { useAsyncMutation, useErrors } from "../../hooks/hooks";
import memoTheme from "@mui/material/utils/memoTheme";
import { useDispatch, useSelector } from "react-redux";
import { setIsAddMember } from "../../redux/misc";

const AddMemberDialog = ({ chatId }) => {

  const dispatch=useDispatch();

  const {isAddMember}=useSelector((state)=>state.misc);

  const { isLoading, isError, error, data }=useMyFriendsQuery();

  const errors=[{isError,error}]


  useErrors()

   const [addMemberFunction,addMemberLoader]=useAsyncMutation(useAddMembersToGroupMutation);


  
  const [selectedMembers, setSelectedMembers] = useState([]);


  const closeHandler=()=>{

    setSelectedMembers([]);
    dispatch(setIsAddMember(false));
    
  }




  const addMemberHandlerChanges = () => {
    addMemberFunction("Adding new Members....",{chatId,members:selectedMembers});
    closeHandler();
  };


 
  const AddToGroupHandler = (id) => {
    console.log(id);
    setSelectedMembers((prev) =>
      prev.includes(id)
        ? prev.filter((currentId) => currentId != id)
        : [...prev, id]
    );
  };

  return (
    <Dialog open={isAddMember} onClose={closeHandler}>
      <DialogTitle textAlign={"center"}>Add members</DialogTitle>

      <Stack spacing={"2rem"} margin={"1rem"}>
        {data?.friends.length>0 ? (
          data?.friends.map((user, index) => (
            <UserSearchItem
              key={user._id}
              user={user}
              Handler={AddToGroupHandler}
              isAdded={selectedMembers.includes(user._id)}
            />
          ))
        ) : (
          <Typography variant="caption" fontSize={"1.5rem"} textAlign={"center"}>No friends</Typography>
        )}
      </Stack>

      <Stack
        direction={"row"}
        alignItems={"center"}
        margin={"1rem"}
        spacing={"1rem"}
      >
        <Button color="error" onClick={closeHandler}>
          Cancel
        </Button>
        <Button variant="contained" onClick={addMemberHandlerChanges} disabled={addMemberLoader}>
          Submit Changes
        </Button>
      </Stack>
    </Dialog>
  );
};

export default AddMemberDialog;
