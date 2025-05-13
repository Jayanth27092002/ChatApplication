import { Avatar } from '@mui/material'
import { useEffect, useState } from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import { transformImage } from '../../components/libs/fileformat'
import AdminTable from '../../components/specific/AdminComponents/AdminTable'
import { useErrors } from '../../hooks/hooks'
import { useGetAllUsersQuery } from '../../redux/api/api'



const columns=[
  {
    field:"id",
    headerName:"ID",
    headerClassName:"table-header",
    width:200
  },

  {
    field:"avatar",
    headerName:"Avatar",
    headerClassName:"table-header",
    width:150,
    renderCell:(params)=><Avatar alt={params.row.name} src={params.row.avatar}/>
  },
  {
    field:"name",
    headerName:"Name",
    headerClassName:"table-header",
    width:200
  },
  {
    field:"username",
    headerName:"Username",
    headerClassName:"table-header",
    width:200
  },
  {
    field:"friends",
    headerName:"Friends",
    headerClassName:"table-header",
    width:200
  },


  {
    field:"groups",
    headerName:"Groups",
    headerClassName:"table-header",
    width:200
  }


]

const UsersManagement = () => {

  const {isLoading,isError,error,data}=useGetAllUsersQuery();
  const {transformedUsers=[]}=data || {};

  const errors=[{isError,error}];
      
    useErrors(errors);
    

  const [rows,setRows]=useState([]);

  useEffect(()=>{


    setRows(transformedUsers?.map((i)=>({...i,id:i._id,avatar:transformImage(i.avatar,250)})));



  },[transformedUsers])

   
  return (
    <AdminLayout>
   
   <AdminTable columns={columns} rows={rows} heading={"All Users"} />

    </AdminLayout>
   
  )
}

export default UsersManagement