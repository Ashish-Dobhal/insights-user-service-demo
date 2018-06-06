import * as express from 'express';
import  {User}  from './models/user-model';
import * as bodyParser from "body-parser";
import {UserModel} from './sequelize';
import {sequelize} from './sequelize';
import logger from "./logger";
import * as cookieParser from "cookie-parser";
import * as session from "express-session";
import sessionMgmtHelper from "./session-mgmt-helper"
import {UserService} from "./service/user-service";
import { MasterDataService } from './service/master-data-service';


//TODO configure winston logger
const app: express.Application = express();
// The port the express app will listen on
const port = 3000;
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(session({
    genid: function(req) {
        return sessionMgmtHelper.genuuid() 
    },
    secret: "cookie_secret",
    name: "cookie_name",
    resave: false,
    saveUninitialized: false
}));

//DONE check with ui this end point
app.post('/api/insights/register',function(req:any,res:any)
{
    console.log("/api/insights/register starts");
    console.log(req.body.username);
    const userService:UserService=new UserService();
    userService.register(req.body.username,req.body.password,req.body.repassword,
    (data,error)=>
    {
        if(error)
        {
            res.status(500).end(error.message);
        }
        else
        {
            console.log(data.username+"User registration success");
            res.send("User "+data.username+"  has been registered");
        }
    });

});

app.post("/api/insights/login",function(req,res)
{
    console.log(req.body.username+"\t"+req.body.password);
    let userService:UserService= new UserService();
    userService.login(req.body.username,req.body.password,(data,error)=>
    {
       //TODO: while login too validate session if present continue else restart Priority
        if(error)
        {
            let errCode=(error.name==="USER_NOT_FOUND")?404:error.code;
          res.status(errCode).end(error.message);
        }
        else
        {
           sessionMgmtHelper.startSession(req,data);
            res.send("User"+req.session.user.userName+  "has been logged in");
        }
    });
});

app.use('/api/insights/liveness',function(req,res)
{
    logger.debug("//api/insights/liveness"); 
    res.send("Insights: learn,share,grow");
});
app.use("/api/insights/testSession",sessionMgmtHelper.validateSession,function(req,res)
{
    logger.log(`Session exists for user: ${req.session.user}`);
    res.send('Session exists for the user');
});
app.use("/api/insights/categories",function(req,res)
{
    logger.log("/categories");
    let masterDataService=new MasterDataService();
    masterDataService.getMasterData("categories",(data,error)=>
    {
        if(error)
        {
            
            res.status(500).end("Server error occurred.Please try again later");
        }
        else
        {
        // return type of this method   [{id:id,name:name}]
        res.send(data);
        }
    });
});
app.post("/api/insights/userCategories",sessionMgmtHelper.startSession,function(req,res)
{
//TODO: save user categories ask team ob db structure
});
app.use("/api/insights/userCategories",sessionMgmtHelper.startSession,function(req,res)
{
//TODO: get User categories here
});


app.use("/api/insights/logout",sessionMgmtHelper.validateSession,function(req,res)
{
    sessionMgmtHelper.endSession(req);
    res.send("User logged out successfully");
})
app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(404).send('Server issue.Please try again later');
  })
app.listen(port, () => {
    //TODO: create DB on server startup
    logger.debug("Create Insights DB");
    let masterDataService= new MasterDataService();
    masterDataService.saveDataSources("categories",(data,err)=>
    {
        if(err)
            logger.error(err.message);
        else
            logger.info(data);
         });
    console.log(`Listening at http://localhost:${port}/`);
});