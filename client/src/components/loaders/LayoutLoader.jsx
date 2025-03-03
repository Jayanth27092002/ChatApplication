import { Grid2, Skeleton, Stack } from "@mui/material";
import React from "react";

const LayoutLoader = () => {
  return (
    <Grid2 container height={"100vh"} spacing={"1rem"}>
      <Grid2
        item="true"
        size={{ sm: 4, md: 3, lg: 3 }}
        height={"100%"}
        sx={{ display: { xs: "none", sm: "block" } }}
      >   
         <Stack spacing={"1rem"}>
          {Array.from({ length: 10 }).map((_, index) => (
            <Skeleton key={index} variant="rectangular" height={"5rem"} />
          ))}
        </Stack>
       
      </Grid2>
      <Grid2
        item="true"
        size={{
          sm: 8,

          md: 5,
          xs: 12,
          lg: 6,
        }}
        height={"100%"}
      >
        <Skeleton variant="rectangular" height={"100vh"} />
      </Grid2>
      <Grid2
        item="true"
        size={{
          md: 4,
          lg: 3,
        }}
        height={"100%"}
        sx={{
          display: { xs: "none", md: "block" },
        }}
      >
         <Skeleton variant="rectangular" height={"100vh"} />
      </Grid2>
    </Grid2>
  );
};

export default LayoutLoader;
