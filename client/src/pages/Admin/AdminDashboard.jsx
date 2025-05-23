import React from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import { Container, Paper, Skeleton, Stack, styled, Typography } from "@mui/material";
import {
  AdminPanelSettings as AdminPanelSettingsIcon,
  Group as GroupIcon,
  Message as MessageIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import moment from "moment";
import {
  AdminSearchField,
  CurveButton,
} from "../../components/Styles/StyledComponent";
import {
  DoughtNutChart,
  LineChart,
} from "../../components/specific/AdminComponents/charts";
import { Last7days } from "../../components/libs/fileformat";

import { useFetchData } from "6pp";
import { server } from "../../constants/config";
import LayoutLoader from "./../../components/loaders/LayoutLoader";
import { useGetStatsQuery } from "../../redux/api/api";
import { useErrors } from "../../hooks/hooks";

const AdminDashboard = () => {
  const { data, isLoading, isError, error } = useGetStatsQuery();

  const { stats } = data || {};

  const errors = [
    {
      isError,
      error,
    },
  ];

  useErrors(errors);

  const Widget = ({ title, value, icon }) => (
    <Paper
      elevation={3}
      sx={{
        padding: "2rem",
        margin: "2rem 0",
        width: "20rem",
        borderRadius: "2rem",
      }}
    >
      <Stack alignItems={"center"} spacing={"1rem"}>
        <Typography
          sx={{
            color: "rgba(0, 0 ,0 ,0.9)",
            border: "solid 5px rgba(0, 0 ,0 ,0.9)",
            borderRadius: "50%",
            padding: "3rem",
            textAlign: "center",
          }}
        >
          {value}
        </Typography>

        <Stack direction={"row"} spacing={"1rem"} alignItems={"center"}>
          {icon}
          <Typography>{title}</Typography>
        </Stack>
      </Stack>
    </Paper>
  );

  const Widgets = (
    <Stack
      direction={{ xs: "column", md: "row" }}
      spacing={"2rem"}
      justifyContent={"space-between"}
      margin={"2rem 0"}
    >
      <Widget title={"Users"} value={stats?.usersCount} icon={<PersonIcon />} />
      <Widget title={"Chats"} value={stats?.totalChatsCount} icon={<GroupIcon />} />
      <Widget title={"Groups"} value={stats?.groupsCount} icon={<MessageIcon />} />
    </Stack>
  );

  const Dashbar = (
    <Paper
      elevation={3}
      sx={{
        margin: "2rem 0rem",
        padding: "2rem",
        borderRadius: "2rem",
      }}
    >
      <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
        <AdminPanelSettingsIcon sx={{ fontSize: "3rem" }} />

        {<AdminSearchField placeholder="Search......" />}

        {<CurveButton>Search</CurveButton>}

        <Typography flexGrow={1} />

        <Typography display={{ xs: "none", md: "block" }}>
          {moment().format("Do, MMMM YYYY")}
        </Typography>
        <NotificationsIcon />
      </Stack>
    </Paper>
  );

  console.log(data);

  return (
    <AdminLayout>

      {
        isLoading ?<Skeleton height={"100vh"}/> :<Container component={"main"}>
        {Dashbar}

        <Stack
          direction={{
            xs: "column",
            lg: "row",
          }}
          flexWrap={"wrap"}
          justifyContent={"center"}
          alignItems={{ xs: "center", lg: "stretch" }}
          sx={{ gap: "2rem" }}
        >
          <Paper
            elevation={3}
            sx={{
              padding: "2rem 3.5rem",
              borderRadius: "2rem",
              width: "100%",
              maxWidth: "45rem",
            }}
          >
            <Typography variant="h4" margin={"2rem 0rem"}>
              Last messages
            </Typography>
            {<LineChart value={stats?.messages} />}
          </Paper>
          <Paper
            elevation={3}
            sx={{
              padding: "1rem",
              width: "100%",
              maxWidth: "25rem",
              borderRadius: "1rem",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: { xs: "100%", sm: "50%" },
              position: "relative",
            }}
          >
            {
              <DoughtNutChart
                value={[stats?.totalChatsCount-stats?.groupsCount, stats?.groupsCount]}
                labels={["Single Chats Chats", "Group Chats"]}
              />
            }
            <Stack
              position={"absolute"}
              justifyContent={"center"}
              alignItems={"center"}
              spacing={".5rem"}
              width={"100%"}
              height={"100%"}
              direction={"row"}
            >
              <GroupIcon />
              <Typography>Vs</Typography>
              <PersonIcon />
            </Stack>
          </Paper>
        </Stack>

        {Widgets}
      </Container>
      }
      
    </AdminLayout>
  );
};

export default AdminDashboard;
