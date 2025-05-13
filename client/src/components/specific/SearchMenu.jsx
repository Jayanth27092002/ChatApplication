import {
  Dialog,
  DialogTitle,
  InputAdornment,
  inputAdornmentClasses,
  List,
  ListItem,
  Stack,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Search as SearchIcon } from "@mui/icons-material";
import { useInputValidation } from "6pp";
import { Sample_users } from "../../constants/sampleData";
import UserSearchItem from "./UserSearchItem";
import { useDispatch, useSelector } from "react-redux";
import { setIsSearch } from "../../redux/misc";
import {
  useLazySearchUserQuery,
  useSendFriendRequestMutation,
} from "../../redux/api/api";
import { toast } from "react-hot-toast";
import { useAsyncMutation } from "../../hooks/hooks";

const SearchMenu = () => {
  const dispatch = useDispatch();
  const [Users, setUsers] = useState([]);
  const search = useInputValidation("");
  const { isSearch } = useSelector((state) => state.misc);

  const searchUsers = useLazySearchUserQuery(search.value)[0];

  const [sendFriendRequest, isLoadingFriendRequest] = useAsyncMutation(
    useSendFriendRequestMutation
  );

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      console.log(search.value);

      if (search.value != "") {
        searchUsers(search.value).then(({ data }) => setUsers(data.users));
      }
    }, 1000);

    return () => {
      clearTimeout(timeOutId);
    };
  }, [search.value]);

  const addFriendHandler = async (id) => {
    await sendFriendRequest("Sending friend Request", { userId: id });
  };

  const handleSearchClose = () => dispatch(setIsSearch(false));

  return (
    <Dialog open={isSearch} onClose={handleSearchClose}>
      <Stack p={"2rem"} width={"25rem"}>
        <DialogTitle textAlign={"center"}>Find User</DialogTitle>
        <TextField
          variant="outlined"
          size="small"
          label="Find Friends"
          value={search.value}
          onChange={search.changeHandler}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment>
                  <SearchIcon />
                </InputAdornment>
              ),
            },
          }}
        />

        <List>
          {Users.map((user, index) => (
            <UserSearchItem
              key={user._id}
              user={user}
              Handler={addFriendHandler}
              loadingFriendHandler={isLoadingFriendRequest}
            />
          ))}
        </List>
      </Stack>
    </Dialog>
  );
};

export default SearchMenu;
