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
        if(error)
        {
            console.log("Log In failed");
            res.status(500).end(error);
        }
        else
        {
           sessionMgmtHelper.startSession(req,data);
            res.send("User"+req.session.user.userName+  "has been logged in");
        }
    });
});

app.use('/liveness',function(req,res)
{
    logger.debug("/liveness"); 
    res.send("Insights: learn,share,grow");
});
app.use("/logs",sessionMgmtHelper.validateSession,function(req,res)
{
res.send("Logs EndPoint")
})
// Serve the application at the given port
app.listen(port, () => {
    //TODO: create DB on server startup
    logger.debug("Create Insights DB");
  
    console.log(`Listening at http://localhost:${port}/`);
});