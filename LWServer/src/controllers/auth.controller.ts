import config from 'config';
import { CookieOptions, NextFunction, Request, Response } from 'express';
import { CreateUserInput, LoginUserInput } from '../schemas/user.schema';
import { createUser, findUser, signToken } from '../services/user.service';
import AppError from '../utils/appError';


// Excludes the password field from the response
export const excludedFields = ['password'];


// Cookie options
const accessTokenCookieOptions: CookieOptions = {
    expires: new Date(
        Date.now() + config.get<number>('accessTokenExpiresIn') * 60 * 1000
    ),
    maxAge: config.get<number>('accessTokenExpiresIn')  * 60 * 1000,
    httpOnly: true,
    sameSite: 'lax', // user will be logged in even if they click on an external link
};

// Only set secure to true in production 
if (process.env.NODE_ENV !== 'production')
    accessTokenCookieOptions.secure = true; 

export const registerHandler = async (
    req: Request<{}, {}, CreateUserInput>,
    res: Response,
    next: NextFunction
)=> {
    try {
        const user = await createUser ({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
        });

        res.status(201).json({
            status: 'success',
            data: {
                user,
            },
        });
    } catch (error: any ) {
        //11000 is Mongodb code for duplicate unique field
        if (error.code === 11000) {
            return res.status(409).json({
                status: 'fail',
                message: 'Email already in use'
            });
        }
        next(error);
    }
};

export const loginHandler = async (
    req: Request<{}, {}, LoginUserInput>,
    res: Response,
    next: NextFunction,
) => {
    try {
        // Get the user from the collection 
        const user = await findUser({
            email: req.body.email
        });

        // Check if the user exist and if the password is correct
        if (
            !user ||
            !(await user.comparePasswords(user.password, req.body.password))
        ) {
            return next(new AppError('Invalid email or password', 401));
        }

        // Create an Access Token
        //! Check the access token validity
        const accessToken = await signToken(user);

        // Send Access Token in cookie form
        res.cookie('accessToken', accessToken, accessTokenCookieOptions);
        res.cookie('logged_in', true, {
            ...accessTokenCookieOptions,
            httpOnly: false,
        });
        res.status(200).json({
            status: 'success',
            accessToken,
        });
    } catch (error: any) {
        next(error);
    }
} 