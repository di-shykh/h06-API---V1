
import { Express } from 'express';

declare global {
    namespace Express {
        interface Request {
            userId?: string;
            // можно добавить другие кастомные поля
            // user?: User;
            // token?: string;
        }
    }
}
export {};