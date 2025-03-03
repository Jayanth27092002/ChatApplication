import { Avatar, IconButton, ListItem, Stack, Typography } from "@mui/material";
import React, { memo } from "react";

import { Add as AddIcon,Remove as RemoveIcon } from "@mui/icons-material";

const UserSearchItem = ({
  user,
  Handler,
  loadingFriendHandler,
  isAdded = false,
  styling={},
}) => {
  const { _id, name, avatar } = user;
  return (
    <ListItem>
      <Stack
        direction={"row"}
        alignItems={"center"}
        spacing={"1rem"}
        width={"100%"}
        {...styling}
      >
        <Avatar />

        <Typography
          variant="body1"
          sx={{
            flexGrow: 1,
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {name}
        </Typography>

        <IconButton
          size="small"
          
          sx={{
            bgcolor: isAdded?"error.main":"primary.main",
            color:"black",
            ":hover": {
              color: "black",
              bgcolor: isAdded? "red":"blue",
            },
          }}
          onClick={() => Handler(_id)}
        >
        {
         
         isAdded? <RemoveIcon /> :<AddIcon />
        }
        </IconButton>
      </Stack>
    </ListItem>
  );
};

export default memo(UserSearchItem);
