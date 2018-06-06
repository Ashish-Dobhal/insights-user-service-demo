"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("../logger");
const jsonFile = require("jsonfile");
const sequelize_1 = require("../sequelize");
class CategoryService {
    async createCategories(callback) {
        try {
            let categories = await this.readData("app/data-json/master-data.json", "categories");
            console.log(categories);
            categories.forEach(async (category) => {
                await sequelize_1.Category.upsert({ name: category }, { name: category });
            });
            callback("Categories Created Successully");
        }
        catch (error) {
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
}
exports.CategoryService = CategoryService;
//# sourceMappingURL=category-service.js.map