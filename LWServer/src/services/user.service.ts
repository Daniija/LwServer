import { omit, get } from "lodash";
import { FilterQuery, QueryOptions } from "mongoose";
import config from 'config';
import userModel, { User } from '../models/user.model';
import { excludedFields } from '../controllers/auth.controller';
import { signJwt } from '../middleware/jwt';
import redisClient from "../utils/connectRedis";
import { DocumentType } from "@typegoose/typegoose";

// CreateUser service
export const createUser = async (input: Partial<User>) => {
    const user = await userModel.create(input);
    return omit(user.toJSON(), excludedFields);
};

// Find All Users
export const findAllUsers = async () => {
    return await userModel.find();
}

// Find one user
export const findUserbyId = async (
    query: FilterQuery<User>,
    options: QueryOptions = {} 
) => {
    return await userModel.findOne(query, {}, options).select('password');
};

// Generated access token and the expiration time is in minutes 
export const signToken = async (user: DocumentType<User>) => {
    // Sign the access token
    const access_token = signJwt(
        { sub: user._id },
        {
            expiresIn: `${config.get<number>('accessTokenExpiresIn')}m`,
        }
    );

    // Create a Session by using the user id as a key 
    redisClient.set(user._id, JSON.stringify(user), {
        EX: 60 * 60,
    });

    // Return access token 
    return { access_token };
}