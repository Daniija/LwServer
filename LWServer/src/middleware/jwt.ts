import jwt, { SignOptions } from 'jsonwebtoken';
import config from 'config';

// this function is responsible for signing a new token
export const signJwt = (payload: Object, options: SignOptions = {}) => {
    const privateKey = Buffer.from(
    config.get<string>('accessTokenPrivateKey'),
    'base64'
    ).toString('ascii');
        return jwt.sign(payload, privateKey, {
    ...(options && options),
    algorithm: 'RS256',
    });
};

// This function is used to return null if the token is invalid or expired
export const verifyJwt = <T>(token: string): T | null => {
    try {
        const publicKey = Buffer.from(
            config.get<string>('accessTokenPublicKey'),
        'base64'
        ).toString('ascii');
        return jwt.verify(token, publicKey) as T;
    } catch (error) {
        return null;
    }
};
