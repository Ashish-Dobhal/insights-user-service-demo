export declare class UserService {
    login(username: any, password: any, callback: any): Promise<void>;
    register(username: any, password: any, repassword: any, callback: any): Promise<void>;
    validatePassword(pass: any, repass: any): void;
}
