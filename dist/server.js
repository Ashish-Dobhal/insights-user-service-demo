"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const logger_1 = require("./logger");
const session = require("express-session");
const session_mgmt_helper_1 = require("./session-mgmt-helper");
const user_service_1 = require("./service/user-service");
const app = express();
const port = 3000;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
    genid: function (req) {
        return session_mgmt_helper_1.default.genuuid();
    },
    secret: "cookie_secret",
    name: "cookie_name",
    resave: false,
    saveUninitialized: false
}));
app.post('/api/insights/register', function (req, res) {
    console.log("/api/insights/register starts");
    console.log(req.body.username);
    const userService = new user_service_1.UserService();
    userService.register(req.body.username, req.body.password, req.body.repassword, (data, error) => {
        if (error) {
            res.status(500).end(error.message);
        }
        else {
            console.log(data.username + "User registration success");
            res.send("User " + data.username + "  has been registered");
        }
    });
});
app.post("/api/insights/login", function (req, res) {
    console.log(req.body.username + "\t" + req.body.password);
    let userService = new user_service_1.UserService();
    userService.login(req.body.username, req.body.password, (data, error) => {
        if (error) {
            let errCode = (error.name === "USER_NOT_FOUND") ? 404 : error.code;
            res.status(errCode).end(error.message);
        }
        else {
            session_mgmt_helper_1.default.startSession(req, data);
            res.send("User" + req.session.user.userName + "has been logged in");
        }
    });
});
app.use('/liveness', function (req, res) {
    logger_1.default.debug("/liveness");
    res.send("Insights: learn,share,grow");
});
app.use("/logs", session_mgmt_helper_1.default.validateSession, function (req, res) {
    res.send("Logs EndPoint");
});
app.listen(port, () => {
    logger_1.default.debug("Create Insights DB");
    console.log(`Listening at http://localhost:${port}/`);
});
app.use("/logOut", session_mgmt_helper_1.default.validateSession, function (req, res) {
});
//# sourceMappingURL=server.js.map