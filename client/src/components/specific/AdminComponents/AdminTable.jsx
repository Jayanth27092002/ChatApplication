import { Container, Paper, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React from "react";

const AdminTable = ({ rows, columns, heading, rowHeight = 52 }) => {
  return (
    <Container sx={{ height: "100vh" }}>
      <Paper elevation={3}  sx={{

        gap:"2rem",
        padding:"1rem 4rem",
        margin:"auto",
        height:"100%",
        width:"100%",
        borderRadius:"2rem",
        overflow:"hidden",
        
      }}>
        <Typography
          textAlign={"center"}
          variant="h4"
          sx={{
            margin: "2rem",
            textTransform: "uppercase",
          }}
        >
          {heading}
        </Typography>

        <DataGrid
          rows={rows}
          columns={columns}
          rowHeight={rowHeight}
          style={{ height: "80%" }}
          sx={{border:"none",
          ".table-header":{
            bgcolor:"black",
            color:"white"
          }}}
          
        />
      </Paper>
    </Container>
  );
};

export default AdminTable;
