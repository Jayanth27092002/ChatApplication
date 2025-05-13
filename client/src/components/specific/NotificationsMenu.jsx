import { Dialog, DialogTitle, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Sample_notifications } from "../../constants/sampleData";
import SingleNotificationItem from "./SingleNotificationItem";
import { useDispatch, useSelector } from "react-redux";
import { setIsNotification } from "../../redux/misc";
import {
  useAcceptFriendRequestMutation,
  useGetNotificationsQuery,
} from "../../redux/api/api";
import toast from "react-hot-toast";
import { useErrors, useAsyncMutation } from "../../hooks/hooks";
import { Skeleton } from "@mui/material";
import { resetNotification } from "../../redux/chat";

const NotificationsMenu = () => {
  const dispatch = useDispatch();

  const { isLoading, data, error, isError } = useGetNotificationsQuery();

  const [acceptRequestFunction, acceptRequestLoading] = useAsyncMutation(
    useAcceptFriendRequestMutation
  );

  useErrors([{ error, isError }]);

  const { isNotification } = useSelector((state) => state.misc);

  const closeNotificationHandler = () => dispatch(setIsNotification(false));

  const NotificationHandler = async ({ _id, accept }) => {
    dispatch(setIsNotification(false));
  
    
      const res = await acceptRequestFunction("Accepting friend's request", {
        requestId: _id,
        accept: accept,
      });

      
  };



  
  return (
    <Dialog open={isNotification} onClose={closeNotificationHandler}>
      <Stack
        p={{ xs: "1rem", sm: "2rem" }}
        maxWidth={"25rem"}
        alignItems={"center"}
      >
        <DialogTitle>Notifications</DialogTitle>

        {isLoading ? (
          <Skeleton />
        ) : (
          <>
            {data?.allRequests.length > 0 ? (
              data?.allRequests.map((notification) => {
                return (
                  <SingleNotificationItem
                    key={notification._id}
                    name={notification.sender.name}
                    id={notification._id}
                    avatar={notification.sender.avatar}
                    handler={NotificationHandler}
                  />
                );
              })
            ) : (
              <Typography>0 Notifications</Typography>
            )}
          </>
        )}
      </Stack>
    </Dialog>
  );
};

export default NotificationsMenu;
