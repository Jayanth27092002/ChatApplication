import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Sample_users } from "../../constants/sampleData";
import UserSearchItem from "./UserSearchItem";
import { useInputValidation } from "6pp";
import { useDispatch, useSelector } from "react-redux";
import { setIsNewGroup } from "../../redux/misc";
import { useMyFriendsQuery, useNewGroupMutation } from "../../redux/api/api";
import LayoutLoader from "../loaders/LayoutLoader";
import { useAsyncMutation, useErrors } from "../../hooks/hooks";
import toast from "react-hot-toast";

const NewGroupMenu = () => {
  const dispatch = useDispatch();

  const { isNewGroup } = useSelector((state) => state.misc);
  const groupName = useInputValidation("");

  const [selectedMembers, setSelectedMembers] = useState([]);

  const { isLoading, isError, error, data } = useMyFriendsQuery();

  const [newGroup, isLoadingNewGroup] = useAsyncMutation(useNewGroupMutation);

  const errors = [{ isError, error }];

  useErrors(errors);

  const newGroupCloseHandler = () => {
    dispatch(setIsNewGroup(false));
  };

  const AddToGroupHandler = (id) => {
    console.log(id);
    setSelectedMembers((prev) =>
      prev.includes(id)
        ? prev.filter((currentId) => currentId != id)
        : [...prev, id]
    );
  };

  const submitHandler = () => {
    if (!groupName.value) return toast.error("Please Name the group");

    if (selectedMembers.length < 2)
      return toast.error(
        "Atleast three members should be added for a group to exist"
      );

    console.log(groupName.value, selectedMembers);

    newGroup("Creating a New Group", {
      name: groupName.value,
      members: selectedMembers,
    });

    newGroupCloseHandler();
  };



  
  return isLoading ? (
    <LayoutLoader />
  ) : (
    <Dialog open={isNewGroup} onClose={newGroupCloseHandler}>
      <Stack p={{ xs: "1rem", sm: "3rem" }} width={"25rem"} spacing={"1rem"}>
        <DialogTitle textAlign={"center"} variant="h4">
          Create Group
        </DialogTitle>

        <TextField
          label={"Name your group "}
          value={groupName.value}
          onChange={groupName.changeHandler}
          width={"25rem"}
        ></TextField>

        <Typography variant="body1" marginBottom={"1rem"}>
          Members
        </Typography>

        <Stack>
          {data?.friends.map((user, index) => (
            <UserSearchItem
              key={user._id}
              user={user}
              Handler={AddToGroupHandler}
              isAdded={selectedMembers.includes(user._id)}
            />
          ))}
        </Stack>

        <Stack
          direction={"row"}
          justifyContent={"space-evenly"}
          spacing={"1rem"}
        >
          <Button color="error" onClick={newGroupCloseHandler}>
            Delete
          </Button>
          <Button
            variant="contained"
            onClick={submitHandler}
            disabled={isLoadingNewGroup}
          >
            Create
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
};

export default NewGroupMenu;
