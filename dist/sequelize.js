"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let logger = require('winston');
let Sequelize = require('sequelize');
let sequelize = new Sequelize('insights', null, null, {
    dialect: "sqlite",
    storage: './insights.sqlite',
    operatorsAliases: false
});
exports.sequelize = sequelize;
let UserModel = sequelize.define('User', {
    username: Sequelize.STRING,
    password: Sequelize.STRING
});
exports.UserModel = UserModel;
sequelize
    .sync({ force: true })
    .then(function (success) {
    logger.log('sqlite-con', 'Sqlite db started');
}, function (err) {
    logger.error('sqlite-con-err', err);
});
//# sourceMappingURL=sequelize.js.map