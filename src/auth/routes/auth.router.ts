import {Router} from "express";
import {
    loginOrEmailValidation,
    passwordValidation,
    userCreateValidation
} from "../../users/routes/user.input-dto.validation-middleware";
import {inputValidationResultMiddleware} from "../../core/middlewares/validation/input-validation.result.middleware";
import {authHandler} from "./handlers/auth.handler";
import {AccessTokenGuard} from "../middlewares/access.token.guard";
import {authGetHandler} from "./handlers/auth.get-user.handler";
import {registrationHandler} from "./handlers/registration.handler";

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
        authGetHandler
    )
    .post(
        "registration",
        userCreateValidation,
        inputValidationResultMiddleware,
        registrationHandler)
    .post(
        "/registration-confirmation",
        inputValidationResultMiddleware,
        registrationConfirmationHandler
    )