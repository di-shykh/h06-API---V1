import {Router} from "express";
import {loginOrEmailValidation, passwordValidation} from "../../users/routes/user.input-dto.validation-middleware";
import {inputValidationResultMiddleware} from "../../core/middlewares/validation/input-validation.result.middleware";
import {authHandler} from "./auth.handler";
import {AccessTokenGuard} from "../middlewares/access.token.guard";

export const authRouter: Router = Router({});

authRouter
    .post(
    "/login",
        passwordValidation,
        loginOrEmailValidation,
        inputValidationResultMiddleware,
        authHandler
    )
    .get(
        "/me",
        AccessTokenGuard,

    )