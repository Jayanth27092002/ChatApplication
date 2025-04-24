import { userSocketIds } from "../app.js";


const otherMember=(members,_id)=>{
    return members.find((member)=>member._id.toString() !=_id.toString());

}



const getSockets=(users=[])=>{
    const sockets=users.map((user)=>userSocketIds.get(user._id.toString()));

    return sockets;
}

export {otherMember,getSockets}