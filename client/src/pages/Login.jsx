import React, { useState } from "react";

import {
  Avatar,
  Button,
  Container,
  Icon,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { CameraAlt } from "@mui/icons-material";
import { HiddenStyledComponent } from "../components/Styles/StyledComponent";
import {isValidUsername, useFileHandler, useInputValidation,useStrongPassword} from "6pp"
import { usernameValidator } from "../utils/validators.js";
import axios from "axios";
import { server } from "../constants/config.js";
import { useDispatch  } from "react-redux"
import { userExists } from "../redux/auth.js";
import toast from "react-hot-toast";


const Login = () => {
  
  const [isLogin,setisLogin]=useState(true);
  const dispatch=useDispatch();
  const toggleLogin = () => setisLogin((prev) => !prev);

  const name=useInputValidation("",);
  const bio=useInputValidation("");
  const username=useInputValidation("",usernameValidator);
  const password=useInputValidation("");

  const avatar=useFileHandler("single",1)


  const loginHandler=async(e)=>{
    e.preventDefault();
  

    console.log("hello");

    try {

      const {data}=await axios.post(`${server}/api/v1/users/login`,{username:username.value,password:password.value},{
        withCredentials:true,
        headers:{
        
          'Content-Type':'application/json',
          
        }
      });

      dispatch(userExists(true));
      toast.success(data.message);
  
      
    } catch (error) {

      toast.error(error?.response?.data?.message || "Something Went wrong");
      
    }
   
   

    
    

  }

  const signupHandler=(e)=>{
    e.preventDefault();

  }

  return (
    <div style={{
        backgroundImage:"linear-gradient(#081c6a, #5c7c63)"
    }}>
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
          {isLogin ? (
            <>
              <Typography variant="h5">Login</Typography>
              <form style={{ width: "100%", marginTop: "1rem" }} onSubmit={loginHandler}>
                <TextField
                  required
                  fullWidth
                  label="Username"
                  margin="normal"
                  variant="outlined"
                  value={username.value}
                  onChange={username.changeHandler}
                />
                <TextField
                  required
                  fullWidth
                  label="Password"
                  margin="normal"
                  type="password"
                  variant="outlined"
                  value={password.value}
                  onChange={password.changeHandler}
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

                <Typography textAlign={"center"} m={"1rem"}>
                  OR
                </Typography>

                <Button
                  fullWidth
                  variant="text"
                  color="primary"
                  onClick={toggleLogin}
                >
                  Sign UP instead
                </Button>
              </form>
            </>
          ) : (
            <>
              <Typography variant="h5">Register</Typography>
              <form style={{ width: "100%", marginTop: "1rem" }}>
                <Stack position={"relative"} width={"10rem"} margin={"auto"}>
                  <Avatar
                    sx={{
                      width: "10rem",
                      height: "10rem",
                      objectFit: "contain",
                    }}
                    src={avatar.preview}
                  />

                  <IconButton sx={
                    {
                        position:"absolute",
                        bottom:0,
                        right:0,
                        color:"white",
                        bgcolor:"rgba(0,0,0,0.24)",
                        ":hover":{bgcolor:"rgba(0,0,0,0.7)"}


                    }
                    
                  } component='label'>
                    <>
                      <CameraAlt />
                      <HiddenStyledComponent type="file" onChange={avatar.changeHandler} />
                    </>
                  </IconButton>
                </Stack>

                <TextField
                  required
                  fullWidth
                  label="Name"
                  margin="normal"
                  variant="outlined"
                  value={name.value}
                  onChange={name.changeHandler}
                />

                <TextField
                  required
                  fullWidth
                  label="BIO"
                  margin="normal"
                  variant="outlined"
                  value={bio.value}
                  onChange={bio.changeHandler}
                />
                <TextField
                  required
                  fullWidth
                  label="Username"
                  margin="normal"
                  variant="outlined"
                  value={username.value}
                  onChange={username.changeHandler}
                />

                {
                    username.error && (
                        <Typography color="error" variant="caption">{username.error}</Typography>
                    )
                      
                    
                }

            
                <TextField
                  required
                  fullWidth
                  label="Password"
                  margin="normal"
                  type="password"
                  variant="outlined"
                  value={password.value}
                  onChange={password.changeHandler}
                />


                <Button
                  sx={{ marginTop: "1rem" }}
                  fullWidth
                  variant="contained"
                  color="primary"
                  type="submit"
                  onSubmit={signupHandler}
                >
                  Sign UP
                </Button>

                <Typography textAlign={"center"} m={"1rem"}>
                  OR
                </Typography>

                <Button
                  fullWidth
                  variant="text"
                  color="primary"
                  onClick={toggleLogin}
                >
                  Login instead
                </Button>
              </form>
            </>
          )}
        </Paper>
      </Container>
    </div>
  );
};

export default Login;
