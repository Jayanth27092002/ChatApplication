import { Box, Drawer, Grid2, IconButton } from "@mui/material";
import React, { useState } from "react";
import AdminBar from "../specific/AdminComponents/AdminBar";
import { Close as CloseIcon, Menu as MenuIcon } from "@mui/icons-material";

const AdminLayout = ({ children }) => {
  const [isMobile, setisMobile] = useState(false);
  const MobileHandler = () => setisMobile((prev)=>!prev);

  const CloseHandler=()=>setisMobile(false);

  return (
    <div>
      <Grid2 container minHeight={"100vh"} >
        <Box
          position={"fixed"}
          right={"1rem"}
          display={{ xs: "block", md: "none" }}
        >
          <IconButton onClick={MobileHandler}>
           {isMobile ? <CloseIcon/>  : <MenuIcon />}
          </IconButton>
        </Box>
        <Grid2
          item="true"
          size={{ md: 4, lg: 3 }}
          display={{ xs: "none", md: "block" }}
          border={"solid 4px black"}
          borderRadius={"4px"}
        >
          <AdminBar />
        </Grid2>
        <Grid2
          item="true"
          size={{ xs: 12, md: 8, lg: 9 }}
          bgcolor={"#f1f1f1"}
         
        >
          {children}
        </Grid2>
      </Grid2>


      {
        isMobile && <Drawer open onClose={CloseHandler}> <AdminBar w="50vw"/> </Drawer>
      }
    </div>
  );
};

export default AdminLayout;
