"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("../sequelize");
const user_model_1 = require("../models/user-model");
class UserService {
    async login(username, password, callback) {
        let userExists = await sequelize_1.UserModel.findAll({ where: { username: username } });
        if (userExists.length > 0) {
            let loggedInUsers = await sequelize_1.UserModel.findAll({ where: { username: username, password: password } });
            if (loggedInUsers.length > 0) {
                let user = new user_model_1.User(loggedInUsers[0].username);
                callback(user);
            }
            else {
                let error = new Error('Invalid Credentials Please Login again');
                error.name = "INVALID_CREDENTIALS";
                callback(null, error);
            }
        }
        else {
            let error = new Error('Invalid Credentials Please Login again');
            error.name = "USER_NOT_FOUND";
            callback(null, error);
        }
    }
    async register(username, password, repassword, callback) {
        try {
            this.validatePassword(password, repassword);
            let savedUser = await sequelize_1.UserModel.create({ username, password });
            if (savedUser) {
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