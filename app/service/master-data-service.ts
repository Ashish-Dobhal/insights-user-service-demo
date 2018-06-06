import logger from "../logger";

import * as jsonFile from 'jsonfile'
import { Category } from "../sequelize";
import { transformMasterDataHelper } from "./transform-master-data-helper";
export class MasterDataService
{
    async  saveDataSources(dataSourceName,callback)
    {
        try
        {
            logger.log("MasterDataService.saveDataSources(dataSource:%s)",dataSourceName);
            let dataSources:any= await this.readData("app/data-json/master-data.json",dataSourceName);
            let sqliteModel=this.getSqliteModel(dataSourceName);
           for(let i=0;i<dataSources.length;i++)
             {
         await  sqliteModel.upsert({name:dataSources[i]},{name:dataSources[i]});   
        }
           callback(`${dataSourceName} Created Successully`);
        }
        catch(error)
        {
            logger.log("MasterDataService.saveDataSources(dataSource:%s) error",dataSourceName,error);
            callback(null,new Error("Error creating categories model"+error));
        }
    }
   async readData(fileName,key)
    {
        try
{
   return new Promise((resolve,reject)=>
   {
    jsonFile.readFile(fileName, function(err, jsonData) {
       if(err)
       reject(err);
       else
       {
        resolve(jsonData[key]);
       }
      });
   });
}
catch(error)
{
    logger.error("Error reading json file",error);
    throw new Error("Error reading json file");
}
    }
   async getMasterData(dataSourceName,callback)
    {
        try
        {
            let model = this.getSqliteModel(dataSourceName);
            let dbData = await model.findAll();
            callback(transformMasterDataHelper.generateMasterData(dbData));
        }
        catch(error)
        {
            callback(null,error);
        }
    }
    getSqliteModel(dataSourceName)
    {
        let sqliteModel=null;
        switch(dataSourceName)
        {
            case "categories":
            sqliteModel=Category;
            break;
        }
        return sqliteModel;
    }
}