import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Done as DoneIcon,
  Edit as EditIcon,
  KeyboardBackspace as KeyboardBackspaceIcon,
  Menu as MenuIcon,
  MenuOpen,
  MenuOpenRounded,
  Save as SaveIcon,
} from "@mui/icons-material";
import {
  Backdrop,
  Button,
  CircularProgress,
  Drawer,
  Grid2,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { lazy, memo, Suspense, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Customlink } from "../components/Styles/StyledComponent";
import AvatarCard from "../components/shared/AvatarCard";

import DeleteDialog from "../components/dialogs/DeleteDialog";
import UserSearchItem from "../components/specific/UserSearchItem";
import { useChatDetailsQuery, useDeleteChatMutation,  useGetMyGroupsQuery, useRemoveMembersFromGroupMutation, useRenameGroupMutation } from "../redux/api/api";
import { useAsyncMutation, useErrors } from "../hooks/hooks";
import LayoutLoader from "./../components/loaders/LayoutLoader";
import { useDispatch, useSelector } from "react-redux";
import { setIsAddMember, setIsDeleteMenu } from "../redux/misc";

const Groups = () => {
  const DeleteDialog = lazy(() => import("../components/dialogs/DeleteDialog"));

  const AddDialog = lazy(() => import("../components/dialogs/AddMemberDialog"));

  const dispatch=useDispatch();




  const {isAddMember,isDeleteMenu}=useSelector((state)=>state.misc);

 

  /* Group layout parameters         */
  const chatId = useSearchParams()[0].get("group");

  const navigate = useNavigate();

  const navigateBackHandler = () => navigate("/");

 

  const {data,isError,error,isLoading}=useGetMyGroupsQuery();

 





  const groupDetails = useChatDetailsQuery({
    chatId: chatId,
    populate: true,
    skip: !chatId,
  });

 

  const [isMobileMenuOpen, setIsMobileeMenuOpen] = useState(false);
  const handleMobileMenu = () => setIsMobileeMenuOpen((prev) => !prev);
  const closeMobileMenuHandler = () => setIsMobileeMenuOpen(false);

  const [members,setMembers]=useState([]);

  /* Group Name decider parameters       */
  const [isEdit, setIsEdit] = useState(false);
  const [groupName, setgroupName] = useState("");
  const [updatedgroupName, setupdatedgroupName] = useState("");
  const [renameFunction,renameGroupLoader]=useAsyncMutation(useRenameGroupMutation);
 
  const [removeMemberFunction,removeMemberLoader]=useAsyncMutation(useRemoveMembersFromGroupMutation);
  const [deleteGroupFunction,deleteGroupLoader]=useAsyncMutation(useDeleteChatMutation);



  const updateGroupNameHandler = () => {
    setIsEdit(false);
    setgroupName(updatedgroupName);
    renameFunction("Renaming group",{chatId,name:updatedgroupName});

    

   
};
 

  /* Delete group parameter     */



  

  const deletegroupHandler = () => {
    console.log("groupDeleted");

    deleteGroupFunction("The group is being deleted",{chatId});
    navigate("/groups");

    
    dispatch(setIsDeleteMenu(false));
  };

  /* ADD edit  group parameter     */



  /* remove  ggroup member parameter     */
  const removeHandler = (id) => {
    removeMemberFunction("Removing this user.....",{chatId,userId:id});
  };

  /* Different components declaration     */

  /* Icon buttons     */

  const errors = [
    { isError, error },
    {
      isError: groupDetails.isError,
      error: groupDetails.error,
    },
  ];

  useErrors(errors);


  useEffect(()=>{
    setgroupName(groupDetails?.data?.chat?.name);
    setupdatedgroupName(groupDetails?.data?.chat?.name);
    setMembers(groupDetails?.data?.chat?.members);


    return()=>{
      setgroupName("");
      setupdatedgroupName("");
      setMembers([]);
      setIsEdit(false);
    }


  },[groupDetails?.data]);

  const IconBtns = (
    <>
      <IconButton
        onClick={handleMobileMenu}
        sx={{
          position: "fixed",
          display: { xs: "block", sm: "none" },
          right: "2rem",
          top: "2rem",
          bgcolor: "#081049 ",
          color: "white",
          ":hover": {
            bgcolor: "#000108 ",
          },
        }}
      >
        <MenuIcon />
      </IconButton>

      <Tooltip
        title="back"
        sx={{
          position: "absolute",
          top: "2rem",
          left: "2rem",
          bgcolor: "#081049 ",
          color: "white",
          ":hover": {
            bgcolor: "#000108 ",
          },
        }}
      >
        <IconButton onClick={navigateBackHandler}>
          <KeyboardBackspaceIcon />
        </IconButton>
      </Tooltip>
    </>
  );

  /* GroupName    */

  const GroupName = (
    <>
      {isEdit ? (
        <Stack>
          <TextField
            value={updatedgroupName}
            onChange={(e) => setupdatedgroupName(e.target.value)}
          />

          <IconButton onClick={updateGroupNameHandler} disabled={renameGroupLoader}>
            <DoneIcon />
          </IconButton>
        </Stack>
      ) : (
        <Stack>
          <Typography variant="h4">{groupName}</Typography>
          <IconButton onClick={() => setIsEdit(true)}  disabled={renameGroupLoader}>
            <EditIcon />
          </IconButton>
        </Stack>
      )}
    </>
  );

  /* Grp buttons     */

  const GrpButtons = (
    <Stack
      direction={{ xs: "column-reverse", sm: "row" }}
      sx={{
        margin: "3rem",
        spacing: "3rem",
        padding: {
          xs: "0",
          sm: "1rem",
          md: "1rem 4rem",
        },
      }}
    >
      <Button
        size="large"
        color="error"
        onClick={() => dispatch(setIsDeleteMenu(true))}
        startIcon={<DeleteIcon />}
      >
        Delete Group
      </Button>
      <Button
        size="large"
        variant="contained"
        onClick={()=>dispatch(setIsAddMember(true))}
        startIcon={<AddIcon />}
      >
        Add member
      </Button>

      {isDeleteMenu && (
        <Suspense fallback={<Backdrop open />}>
          <DeleteDialog
            deleteHandler={deletegroupHandler}
            loadingHandler={deleteGroupLoader}
           
          />
        </Suspense>
      )}

       
   {isAddMember && (
  <Suspense fallback={<Backdrop open />}>
    <AddDialog chatId={chatId} />
  </Suspense>
)}
      
    </Stack>
  );

  /* returning group layout     */
  return isLoading ? (
    <LayoutLoader />
  ) : (
    <Grid2 container height={"100vh"}>
      <Grid2
        item="true"
        size={{ sm: 3 }}
        height={"100%"}
        overflow={"auto"}
        sx={{
          display: { xs: "none", sm: "block" },
          backgroundImage: " linear-gradient(to right, #FDFCFB, #E2D1C3)",
        }}
      >
        <GroupsList myGroups={data?.message} chatId={chatId} />
      </Grid2>

      <Grid2
        item="true"
        size={{ xs: 12, sm: 9 }}
        height={"100%"}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          padding: "1rem 2rem",
        }}
      >
        {IconBtns}

        {chatId && (
          <>
            {groupName && GroupName}

            <Typography
              variant="body1"
              sx={{
                margin: "2rem",
                alignSelf: "flex-start",
              }}
            >
              Members
            </Typography>

            <Stack
              sx={{
                maxWidth: "45rem",
                height: "50vh",
                width: "100%",
                boxSizing: "border-box",
                width: "100%",
                spacing: "2rem",
                padding: {
                  xs: "0",
                  sm: "1rem",
                  md: "1rem 4rem",
                },
                overflow: "auto",
              }}
            >
              {removeMemberLoader?  <CircularProgress/> :  members?.length > 0 ? (
                members?.map((user, index) => (
                  <UserSearchItem
                    key={user._id}
                    user={user}
                    isAdded
                    styling={{
                      boxShadow: "0 0 0.5rem rgba(0,0,0,0.2)",
                      padding: "1rem 2rem",
                      marginBottom: "1rem",
                    }}
                    Handler={removeHandler}
                    
                  />
                ))
              ) : (
                <Typography>NO Users Found</Typography>
              )}
            </Stack>

            {GrpButtons}
          </>
        )}
      </Grid2>

      <Drawer open={isMobileMenuOpen} onClose={closeMobileMenuHandler}>
        {
          <GroupsList
            myGroups={data?.message}
            w={"50vw"}
            chatId={chatId}
          />
        }
      </Drawer>
    </Grid2>
  );
};

const GroupsList = ({ w = "100%", myGroups = [], chatId }) => {
  return (
    <Stack width={w}>
      {myGroups.length > 0 ? (
        myGroups.map((group, index) => (
          <GroupItem key={group._id} group={group} chatId={chatId} />
        ))
      ) : (
        <Typography>No groups</Typography>
      )}
    </Stack>
  );
};

const GroupItem = memo(({ group, chatId }) => {
  const { name, avatar, _id } = group;

  return (
    <Customlink
      to={`?group=${_id}`}
      onClick={(e) => {
        if (chatId === _id) e.preventDefault();
      }}
    >
      <Stack direction={"row"} spacing={"1rem"} alignItems={"center"}>
        <AvatarCard avatar={avatar} />
        <Typography>{name}</Typography>
      </Stack>
    </Customlink>
  );
});

export default Groups;
