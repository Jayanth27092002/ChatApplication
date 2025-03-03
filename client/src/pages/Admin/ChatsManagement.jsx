import React, { useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import AdminTable from "../../components/specific/AdminComponents/AdminTable";
import { Avatar, Stack } from "@mui/material";
import { useEffect } from "react";
import { DashboardData } from "../../constants/sampleData";
import { transformImage } from "../../components/libs/fileformat";
import AvatarCard from "../../components/shared/AvatarCard";

const columns = [
  {
    field: "id",
    headerName: "ID",
    headerClassName: "table-header",
    width: 200,
  },

  {
    field: "avatar",
    headerName: "Avatar",
    headerClassName: "table-header",
    width: 150,
    renderCell: (params) => <AvatarCard avatar={params.row.avatar} />,
  },
  {
    field: "name",
    headerName: "Name",
    headerClassName: "table-header",
    width: 300,
  },
  {
    field: "totalMembers",
    headerName: "Total Members",
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "members",
    headerName: "Members",
    headerClassName: "table-header",
    width: 400,
    renderCell: (params) => (
      <AvatarCard maxi={100} avatar={params.row.members} />
    ),
  },

  {
    field: "totalMessages",
    headerName: "Total Messages",
    headerClassName: "table-header",
    width: 200,
  },

  {
    field: "creator",
    headerName: "Created by",
    headerClassName: "table-header",
    width: 250,
    renderCell: (params) => (
      <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
        <AvatarCard avatar={params.row.creator.avatar} />
        <span>{params.row.creator.name}</span>
      </Stack>
    ),
  },
];

const ChatManagement = () => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    setRows(
      DashboardData.AdminChats.map((i) => ({
        ...i,
        id: i._id,
        avatar: i.avatar.map((image) => transformImage(image, 50)),
        members: i.members.map((i) => transformImage(i.avatar, 50)),
        creator: {
          name: i.creator.name,
          avatar: transformImage(i.creator.avatar, 50),
        },
      }))
    );
  }, []);

  return (
    <AdminLayout>
      <AdminTable columns={columns} rows={rows} heading={"Chats"} />
    </AdminLayout>
  );
};

export default ChatManagement;
