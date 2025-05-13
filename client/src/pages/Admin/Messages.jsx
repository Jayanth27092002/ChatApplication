import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import AdminTable from "../../components/specific/AdminComponents/AdminTable";
import { DashboardData } from "../../constants/sampleData";
import { fileformat, transformImage } from "../../components/libs/fileformat";
import moment from "moment";
import { Avatar, Box, Stack } from "@mui/material";
import RenderAttachment from "../../components/specific/RenderAttachment";
import { useGetAllMessagesQuery } from "../../redux/api/api";
import { useErrors } from "../../hooks/hooks";

const columns = [
  {
    field: "id",
    headerName: "ID",
    headerClassName: "table-header",
    width: 200,
  },

  {
    field: "attachments",
    headerName: "Attachments",
    headerClassName: "table-header",
    width: 200,
    renderCell: (params) => {
      const {attachments}=params.row;
      console.log(attachments);
      return attachments.length>0 ? (
        attachments.map((i)=>{
          const url=i.url;
          const file=fileformat(url);
          return <Box key={i.public_id}>
            <a href={i.url} download target="_blank" style={{
              color:"black"
            }}>
              {<RenderAttachment file={file} url={url}/>}
            </a>
          </Box>
        })
      ):("No Attachments");


      

    }
     
  },
  {
    field: "content",
    headerName: "Content",
    headerClassName: "table-header",
    width: 400,
  },
  {
    field: "sender",
    headerName: "Sent By",
    headerClassName: "table-header",
    width: 200,
    renderCell: (params) => (
      <Stack direction={"row"} alignItems={"center"} spacing={"2rem"}>
        <Avatar alt={params.row.sender.name} src={params.row.sender.avatar} />
        <span>{params.row.sender.name}</span>
      </Stack>
    ),
  },
  {
    field: "chat",
    headerName: "Chats",
    headerClassName: "table-header",
    width: 220,
  },

  {
    field: "groupChat",
    headerName: "Group Chat",
    headerClassName: "table-header",
    width: 100,
  },

  

  {
    field: "createdAt",
    headerName: "Time",
    headerClassName: "table-header",
    width: 300,
  },
];

const Messages = () => {
  const [rows, setRows] = useState([]);

  const {isLoading,data,isError,error}=useGetAllMessagesQuery();
  const {transformedMessages=[]}=data || {};
  const errors=[{isError,error}];
      
  useErrors(errors);
    

  

  useEffect(() => {
   

    setRows(transformedMessages.map((i) => ({ ...i, id: i._id ,
      sender:{
        name:i.sender.name,
        avatar:transformImage(i.sender.avatar,150),
      },
      createdAt:moment(i.createdAt).format("MMMM Do YYYY,h:mm:ss a"),
      

    })));
  }, [transformedMessages]);
  return (
    <AdminLayout>
      <AdminTable rows={rows} columns={columns} heading={"All Messages"} rowHeight={200} />
    </AdminLayout>
  );
};

export default Messages;
