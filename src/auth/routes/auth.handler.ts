import {LoginInputDto} from "../application/dtos/loginInputDto";
import {Request, Response} from "express";
import {HttpStatus} from "../../core/types/http-statuses";
import {authService} from "../application/auth.service";

export async function authHandler(req: Request <{}, {}, LoginInputDto>, res: Response) {

    const {loginOrEmail, password} = req.body;
    const tokenResult = await authService.loginUser(loginOrEmail, password);
    if(!tokenResult) {
        return res.sendStatus(HttpStatus.Unauthorized);
    }
    return res.status(HttpStatus.Ok).send(tokenResult);
}