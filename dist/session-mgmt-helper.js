"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const session = require("express-session");
const logger_1 = require("./logger");
const uuidv1 = require('uuid/v1');
const sessionMgmtHelper = {
    expressSession() {
        return session({
            secret: 'insights:learn:share:grow',
            resave: false,
            saveUninitialized: false,
            cookie: {
                expires: true,
                maxAge: null
            }
        });
    },
    validateSession: function (req, res, next) {
        if (req.session.user) {
            logger_1.default.info("Session Data Exists");
            next();
        }
        else {
            res.setHeader("Content-Type", "application/json");
            res.status(401).send(JSON.stringify({ status: res.status, msg: 401,
                session: 'Unauthorized' }));
        }
    },
    startSession: function (req, user) {
        req.session.user = user;
        console.log("User Login here" + req.session.user.userName);
    },
    endSession: function (req) {
        req.session.destroy();
    },
    genuuid() {
        return uuidv1();
    }
};
exports.default = sessionMgmtHelper;
//# sourceMappingURL=session-mgmt-helper.js.map