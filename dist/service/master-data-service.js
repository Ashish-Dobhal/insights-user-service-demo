"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("../logger");
const jsonFile = require("jsonfile");
const sequelize_1 = require("../sequelize");
const transform_master_data_helper_1 = require("./transform-master-data-helper");
class MasterDataService {
    async saveDataSources(dataSourceName, callback) {
        try {
            logger_1.default.log("MasterDataService.saveDataSources(dataSource:%s)", dataSourceName);
            let dataSources = await this.readData("app/data-json/master-data.json", dataSourceName);
            let sqliteModel = this.getSqliteModel(dataSourceName);
            for (let i = 0; i < dataSources.length; i++) {
                await sqliteModel.upsert({ name: dataSources[i] }, { name: dataSources[i] });
            }
            callback(`${dataSourceName} Created Successully`);
        }
        catch (error) {
            logger_1.default.log("MasterDataService.saveDataSources(dataSource:%s) error", dataSourceName, error);
            callback(null, new Error("Error creating categories model" + error));
        }
    }
    async readData(fileName, key) {
        try {
            return new Promise((resolve, reject) => {
                jsonFile.readFile(fileName, function (err, jsonData) {
                    if (err)
                        reject(err);
                    else {
                        resolve(jsonData[key]);
                    }
                });
            });
        }
        catch (error) {
            logger_1.default.error("Error reading json file", error);
            throw new Error("Error reading json file");
        }
    }
    async getMasterData(dataSourceName, callback) {
        try {
            let model = this.getSqliteModel(dataSourceName);
            let dbData = await model.findAll();
            callback(transform_master_data_helper_1.transformMasterDataHelper.generateMasterData(dbData));
        }
        catch (error) {
            callback(null, error);
        }
    }
    getSqliteModel(dataSourceName) {
        let sqliteModel = null;
        switch (dataSourceName) {
            case "categories":
                sqliteModel = sequelize_1.Category;
                break;
        }
        return sqliteModel;
    }
}
exports.MasterDataService = MasterDataService;
//# sourceMappingURL=master-data-service.js.map