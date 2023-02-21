import { object, string, TypeOf } from 'zod';

export const createUserSchema = object({
    body: object({
        name: string({ required_error: 'Name is required' }),
        email: string({ required_error: 'Email is required' }).email(
            'Invalid email address'
        ),
        password: string({ required_error: 'Password is required' })
            .min(8, 'Your password should have more than 8 characters')
            .max(32, 'Your password should have less than 32 characters'),
        passwordConfirm: string({ required_error: 'Please Confirm yourPassword'}),
    }).refine((data) => data.password === data.passwordConfirm, {
        path: ['passwordConfirm'],
        message: 'Your password does not match',
    }),
});

export const loginUserSchema = object({
    body: object({
        email: string({ required_error: 'Your email is required'}).email(
            'Invalid email or password'
        ),
        password: string({ required_error: 'Your password is required'}).min(
            8,
            'Invalid email or password'
        ),
    }),
});

export type CreateUserInput = TypeOf<typeof createUserSchema>['body'];
export type LoginUserInput = TypeOf<typeof loginUserSchema>['body'];
