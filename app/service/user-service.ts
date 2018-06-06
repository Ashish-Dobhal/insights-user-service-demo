import {UserModel }from "../sequelize";
import {User} from "../models/user-model"
export class UserService
{
   async  login(username,password,callback)
{
    // TODO; check only username return no such user exists then the below check return invalid user
    
    let userExists = await UserModel.findAll({where:{username:username}});
 if(userExists.length>0)   
{
    let loggedInUsers = await UserModel.findAll({where:{username:username,password:password}});
    if(loggedInUsers.length>0)
    {

        let user = new User(loggedInUsers[0].username);
       callback(user);
    }
    else
    {
        let error = new Error('Invalid Credentials Please Login again');
        error.name="INVALID_CREDENTIALS";
        callback(null,error);

    }
}
    else
    {
        let error = new Error('Invalid Credentials Please Login again');
        error.name="USER_NOT_FOUND";
        
        callback(null,error);
    }
}
async register(username,password,repassword,callback)
{

    try
    {
        this.validatePassword(password,repassword);
       let savedUser= await UserModel.create({username,password});
       if(savedUser)
       {
           callback(savedUser);
       }
       else
       {
           callback(null,'User could not be created.Please try again later');
       }
}
    catch(error)
    {
        callback(null,error);
    }
}
validatePassword(pass,repass)
{
   if(pass===null || repass===null)
   {
       throw new Error("Please enter the passwords again. Passwird and Repassword cannot be empty");
   }
    if(pass===repass)
    {
        return;
    }
    else
    {
        throw new Error("password do not match.Please try again");
    }
}
}