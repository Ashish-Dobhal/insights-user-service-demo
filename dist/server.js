"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const logger_1 = require("./logger");
const session = require("express-session");
const session_mgmt_helper_1 = require("./session-mgmt-helper");
const user_service_1 = require("./service/user-service");
const master_data_service_1 = require("./service/master-data-service");
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
app.use('/api/insights/liveness', function (req, res) {
    logger_1.default.debug("//api/insights/liveness");
    res.send("Insights: learn,share,grow");
});
app.use("/api/insights/testSession", session_mgmt_helper_1.default.validateSession, function (req, res) {
    logger_1.default.log(`Session exists for user: ${req.session.user}`);
    res.send('Session exists for the user');
});
app.use("/api/insights/categories", function (req, res) {
    logger_1.default.log("/categories");
    let masterDataService = new master_data_service_1.MasterDataService();
    masterDataService.getMasterData("categories", (data, error) => {
        if (error) {
            res.status(500).end("Server error occurred.Please try again later");
        }
        else {
            res.send(data);
        }
    });
});
app.post("/api/insights/userCategories", session_mgmt_helper_1.default.startSession, function (req, res) {
});
app.use("/api/insights/userCategories", session_mgmt_helper_1.default.startSession, function (req, res) {
});
app.use("/api/insights/logout", session_mgmt_helper_1.default.validateSession, function (req, res) {
    session_mgmt_helper_1.default.endSession(req);
    res.send("User logged out successfully");
});
app.listen(port, () => {
    logger_1.default.debug("Create Insights DB");
    let masterDataService = new master_data_service_1.MasterDataService();
    masterDataService.saveDataSources("categories", (data, err) => {
        if (err)
            logger_1.default.error(err.message);
        else
            logger_1.default.info(data);
    });
    console.log(`Listening at http://localhost:${port}/`);
});
//# sourceMappingURL=server.js.map