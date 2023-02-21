import { NextFunction, Request, Response } from "express";
import { findAllUsers } from "../services/user.service";

// * returns currently logged in user profile information
export const getMeHandler = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = res.locals.user;
        res.status(200).json({
            status: 'success',
            data: {
                user,
            },
        });
    } catch (error: any) {
        next(error);
    }
};

// * Admin gets all users
export const getAllUsersHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const users = await findAllUsers();
        res.status(200).json({
            status: 'success',
            result: users.length,
            data: {
                users,
            },
        });
    } catch (error: any) {
        next(error);
    }
};