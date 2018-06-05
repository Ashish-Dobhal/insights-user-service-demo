declare const sessionMgmtHelper: {
    expressSession(): any;
    validateSession: (req: any, res: any, next: any) => void;
    startSession: (req: any, user: any) => void;
    endSession: (req: any) => void;
    genuuid(): any;
};
export default sessionMgmtHelper;
