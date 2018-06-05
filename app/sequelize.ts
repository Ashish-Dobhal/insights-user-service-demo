
//import * as logger from ("winston");
let logger = require('winston');
let Sequelize = require('sequelize');

let sequelize = new Sequelize('insights', null, null, {
    dialect: "sqlite",
    storage: './insights.sqlite',
    operatorsAliases: false
});

//  MODELS
let UserModel = sequelize.define('User', {
    username: Sequelize.STRING,
    password: Sequelize.STRING
  });

  //  SYNC SCHEMA
  sequelize
.sync({ force: true })
.then(function(success:any) 
{
    logger.log('sqlite-con', 'Sqlite db started');
  }, function (err:any) {
    logger.error('sqlite-con-err',err);
});

export  {UserModel,sequelize};
