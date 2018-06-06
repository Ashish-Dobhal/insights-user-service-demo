export declare class MasterDataService {
    saveDataSources(dataSourceName: any, callback: any): Promise<void>;
    readData(fileName: any, key: any): Promise<{}>;
    getMasterData(dataSourceName: any, callback: any): Promise<void>;
    getSqliteModel(dataSourceName: any): any;
}
