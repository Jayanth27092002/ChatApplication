import { Button, Dialog, DialogTitle, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import { Sample_users } from "../../constants/sampleData";
import UserSearchItem from "../specific/UserSearchItem";

const AddMemberDialog = ({ closeHandler }) => {
  const [members, setMembers] = useState(Sample_users);
  const [selectedMembers, setSelectedMembers] = useState([]);

  console.log(members);

  const addMemberHandlerChanges = () => {
    setMembers([]);
    setSelectedMembers([]);
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
    <Dialog open onClose={closeHandler}>
      <DialogTitle textAlign={"center"}>Add members</DialogTitle>

      <Stack spacing={"2rem"} margin={"1rem"}>
        {members.length>0 ? (
          members.map((user, index) => (
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
        <Button variant="contained" onClick={addMemberHandlerChanges}>
          Submit Changes
        </Button>
      </Stack>
    </Dialog>
  );
};

export default AddMemberDialog;
