import moment from "moment";


export const fileformat=(url="")=>{

    const fileExt=url.split(".").pop()
    console.log(fileExt);

    if(fileExt==="mp4" || fileExt=="webm"|| fileExt=="ogg") return "video"

    if(fileExt==="mp3" || fileExt=="wav") return "audio"

    if(fileExt==="png" || fileExt=="jpg"|| fileExt=="jpeg" || fileExt==="gif") return "image"


    return "file"

}


export const transformImage=(url="",width=100)=>url;





export const  Last7days=()=>{
    const currentDate=moment();
    const last7days=[];

    for(let i=0;i<7;i++){
        const dayDate=currentDate.clone().subtract(i,"days")
        const dayName=dayDate.format("dddd");

        last7days.unshift(dayName);
     }

     return last7days;

     
}