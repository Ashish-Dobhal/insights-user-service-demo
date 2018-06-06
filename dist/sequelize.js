"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let logger = require('winston');
let Sequelize = require('sequelize');
let sequelize = new Sequelize('insights', null, null, {
    dialect: "sqlite",
    storage: './insights.sqlite',
    operatorsAliases: false,
    ifNotExists: true,
    logging: false
});
exports.sequelize = sequelize;
let UserModel = sequelize.define('User', {
    username: Sequelize.STRING,
    password: Sequelize.STRING
});
exports.UserModel = UserModel;
let Category = sequelize.define('Category', {
    name: Sequelize.STRING
});
exports.Category = Category;
sequelize
    .sync()
    .then(function (success) {
    logger.log('sqlite-con', 'Sqlite db started');
}, function (err) {
    logger.error('sqlite-con-err', err);
});
//# sourceMappingURL=sequelize.js.map