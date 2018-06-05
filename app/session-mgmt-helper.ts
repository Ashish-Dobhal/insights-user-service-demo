import * as session from 'express-session';
const uuidv1 = require('uuid/v1');
 const sessionMgmtHelper =
 {
     expressSession():any
    {
       return session(
           {
    secret: 'insights:learn:share:grow',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: true,
        maxAge:null
    }
});

    },
    validateSession:function(req,res,next)
    {
        if(req.session.user)
        {
            console.log("Session Data Exists");
            next();
        }
        else
        {
            res.setHeader("Content-Type","application/json");
            res.status(401).send(
        JSON.stringify({status:res.status,msg:401,
        session:'Unauthorized'}));
        }

    },
    startSession:function(req:any,user)
    {
     
        req.session.user=user;
        console.log("User Login here"+req.session.user.userName);
    },
    endSession:function(req:any)
    {
        // TODO: end session here
    },
    genuuid()
    {
       return uuidv1();
    }
}

export default sessionMgmtHelper;