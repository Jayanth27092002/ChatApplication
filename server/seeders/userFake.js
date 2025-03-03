import { faker } from "@faker-js/faker/locale/af_ZA"
import { User } from "../models/userModel.js"


const createFakeUsers=async (userNmb)=>{

    try {
        const userPromise=[]
        for(let i=0;i<userNmb;i++){
            const tempUser=User.create({
                name:faker.person.fullName(),
                username:faker.internet.userName(),
                bio:faker.lorem.sentence(10),
                password:"password",
                avatar:{
                    public_id:faker.system.fileName(),
                    url:faker.image.avatar(),
                }

            });
            userPromise.push(tempUser);


        }
        await Promise.all(userPromise);
        console.log("Users created", userNmb );
        process.exit(1);

        

        
    } catch (error) {

        console.error(error);
        process.exit(1);

        
    }

}

export {createFakeUsers};