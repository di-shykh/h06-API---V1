import {Request, Response} from "express";
import {errorHandler} from "../../../core/errors/error.handler";
import {authService} from "../../application/auth.service";

export async function registrationHandler(req: Request, res: Response) {
    try {
        const {login, password, email} = req.body;
        const result = await authService.createUser({login, email, password});

    } catch (e) {
        errorHandler(e,res);
    }
}