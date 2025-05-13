import { ListItemText, Menu, MenuItem, MenuList, Tooltip } from "@mui/material";
import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setIsFileMenu, setUploadingLoader } from "../../redux/misc";
import { AudioFile as AudioFileIcon, Image as ImageIcon, UploadFile as UploadFileIcon, VideoFile as VideoFileIcon } from "@mui/icons-material";
import { toast } from 'react-hot-toast';
import { useSendAttachmentMutation } from "../../redux/api/api";

const FileMenu = ({ anchorE1,chatId }) => {
  const dispatch = useDispatch();
  const handleClose = () => dispatch(setIsFileMenu(false));
  const { isFileMenu } = useSelector((state) => state.misc);

  const imageRef=useRef(null);
  const audioRef=useRef(null);
  const videoRef=useRef(null);
  const fileRef=useRef(null);



 const selectImageRef=()=>imageRef.current.click();
 const selectVideoRef=()=>videoRef.current.click();
 const selectAudioeRef=()=>audioRef.current.click();
 const selectFileRef=()=>fileRef.current.click();


 const [sendAttachments]=useSendAttachmentMutation();


  const fileChangeHandler =async(e, key) => {

    const files=Array.from(e.target.files);

    if(files.length<=0) return ;

    if(files.length>5)return toast.error(`You cannot send more than 5 ${key}` );

    dispatch(setUploadingLoader(true));

    const toastId=toast.loading(`Sending ${key}...`);

    handleClose();

    try {

      const myForm=new FormData();
      myForm.append("chatId",chatId);

      files.forEach((file)=>myForm.append("files",file));

      const response=await sendAttachments(myForm);


      if(response.data){
         toast.success(`${key} sent successfully`,{id:toastId});
      }
      else{
        toast.error(`Failed to send ${key}`,{id:toastId});
      }


      
    } catch (error) {

      toast.error(error,{id:toastId});
      
    }finally{
      dispatch(setUploadingLoader(false));

    }


  };
  return (
    <div style={{ width: "10rem" }}>
      <Menu anchorEl={anchorE1} open={isFileMenu} onClose={handleClose}>
        <MenuList>
          <MenuItem onClick={selectImageRef}>
            <Tooltip title="Image">
              <ImageIcon />
            </Tooltip>
            <ListItemText style={{ marginLeft: "0.5rem" }}>Image</ListItemText>
            <input
              type="file"
              multiple
              accept="image/png, image/jpeg,image/gif"
              style={{ display: "none" }}
              onChange={(e) => fileChangeHandler(e, "Images")}
              ref={imageRef}
            />
          </MenuItem>
       


        
          <MenuItem onClick={selectAudioeRef}>
            <Tooltip title="Audio">
              <AudioFileIcon />
            </Tooltip>
            <ListItemText style={{ marginLeft: "0.5rem" }}>Audio</ListItemText>
            <input
              type="file"
              multiple
              accept="audio/mpeg, audio/wav"
              style={{ display: "none" }}
              onChange={(e) => fileChangeHandler(e, "Audios")}
              ref={audioRef}
            />
          </MenuItem>
        


        
          <MenuItem onClick={selectVideoRef}>
            <Tooltip title="Video">
              <VideoFileIcon />
            </Tooltip>
            <ListItemText style={{ marginLeft: "0.5rem" }}>Video</ListItemText>
            <input
              type="file"
              multiple
              accept="video/mp4, video/webm,video/ogg"
              style={{ display: "none" }}
              onChange={(e) => fileChangeHandler(e, "Videos")}
              ref={videoRef}
            />
          </MenuItem>
       

        
          <MenuItem onClick={selectFileRef}>
            <Tooltip title="File">
              <UploadFileIcon />
            </Tooltip>
            <ListItemText style={{ marginLeft: "0.5rem" }}>File</ListItemText>
            <input
              type="file"
              multiple
              accept="*"
              style={{ display: "none" }}
              onChange={(e) => fileChangeHandler(e, "Files")}
              ref={fileRef}
            />
          </MenuItem>
        </MenuList>



      </Menu>
    </div>
  );
};

export default FileMenu;
