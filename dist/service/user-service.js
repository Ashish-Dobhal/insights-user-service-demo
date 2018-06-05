"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("../sequelize");
const user_model_1 = require("../models/user-model");
class UserService {
    async login(username, password, callback) {
        let userExists = await sequelize_1.UserModel.findAll({ where: { username: username } });
        if (userExists.length > 0) {
            console.log(`User ${username} exists===========================`);
            let loggedInUsers = await sequelize_1.UserModel.findAll({ where: { username: username, password: password } });
            if (loggedInUsers.length > 0) {
                console.log(`User ${username} exists and right pass===========================`);
                let user = new user_model_1.User(loggedInUsers[0].username);
                console.log("UserNAME===================" + user.userName);
                callback(user);
            }
            else {
                console.log(`User ${username} exists wrong pass ===========================`);
                callback(null, 'Invalid Credentials Please Login again');
            }
        }
        else {
            callback(null, 'User does not exists. Please signup to use the Insights Platform');
        }
    }
    async register(username, password, repassword, callback) {
        try {
            console.log("Register User");
            this.validatePassword(password, repassword);
            let savedUser = await sequelize_1.UserModel.create({ username, password });
            if (savedUser) {
                console.log("Saved User", savedUser);
                callback(savedUser);
            }
            else {
                callback(null, 'User could not be created.Please try again later');
            }
        }
        catch (error) {
            callback(null, error);
        }
    }
    validatePassword(pass, repass) {
        if (pass === repass) {
            return;
        }
        else {
            throw new Error("password do not match.Please try again");
        }
    }
}
exports.UserService = UserService;
//# sourceMappingURL=user-service.js.map