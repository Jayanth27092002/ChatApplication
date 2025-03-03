

const otherMember=(members,_id)=>{
    return members.find((member)=>member._id.toString() !=_id.toString());

}


export {otherMember}