import { Button, Container, Paper, TextField, Typography } from "@mui/material";
import React from "react";

import {useInputValidation} from "6pp"
import { Navigate, redirect, useNavigate } from "react-router-dom";

const AdminLogin = () => {

   

    const secretkey=useInputValidation("");
   
    const isAdmin=true;

    const loginHandler=(e)=>{
        e.preventDefault();
        console.log("admin Logged in");
       
        



    }

    if(isAdmin)  return <Navigate to={"/admin/dashboard"}/>
  return (
    <div
      style={{
        backgroundImage: "linear-gradient(#081c6a, #5c7c63)",
      }}
    >
      <Container
        component={"main"}
        maxWidth="xs"
        sx={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={5}
          sx={{
            padding: 4,
            display: "flex",
            flexDirection: "column",

            alignItems: "center",
          }}
        >
          <Typography variant="h5">Admin Login</Typography>
          <form onSubmit={loginHandler} style={{ width: "100%", marginTop: "1rem" }}>
            
            <TextField
              required
              fullWidth
              label="Secret Key"
              margin="normal"
              type="password"
              variant="outlined"
              value={secretkey.value}
              onChange={secretkey.changeHandler}
            />

            <Button
              sx={{ marginTop: "1rem" }}
              fullWidth
              variant="contained"
              color="primary"
              type="submit"
              
            >
              Login
            </Button>


           
          </form>
        </Paper>
      </Container>
    </div>
  );
};

export default AdminLogin;
