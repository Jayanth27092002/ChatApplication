import { userSocketIds } from "../app.js";


const otherMember=(members,_id)=>{
    return members.find((member)=>member._id.toString() !=_id.toString());

}



const getSockets=(users=[])=>{
    const sockets=users.map((user)=>userSocketIds.get(user._id.toString()));

    return sockets;
}


const getBase64=(file)=>{
    return `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

}

export {otherMember,getSockets,getBase64}