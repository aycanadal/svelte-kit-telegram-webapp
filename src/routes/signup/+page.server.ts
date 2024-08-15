/** @type {import('./$types').Actions} */
import { db } from '$lib';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { env } from '$env/dynamic/private';

export const actions = {
    default: async (event) => {

        const formData = await event.request.formData()
        const dto = Object.fromEntries(formData);
        const body = JSON.stringify(dto)

        const user = await db.user.findUnique({
            where: {
                telegramId: dto.telegramId as string
            }
        });

        if (user) {
            return {
                error: 'User already exists'
            };
        }

        try {

            const jwtUser = {
                telegramId: dto.telegramId               
            };
        
            const token = jwt.sign(jwtUser, env.JWT_SECRET, {
                expiresIn: '1d'
            });

             const user = await db.user.create({
                data: {
                    telegramId: dto.telegramId as string,
                    password: await bcrypt.hash(dto.password as string, 10),
                    token
                }
            });

            event.cookies.set('AuthorizationToken', `Bearer ${user.token}`, {
                httpOnly: true,
                path: '/',
                secure: true,
                sameSite: 'none',
                maxAge: 60 * 60 * 24 // 1 day
            });
           
            return { token };

        } catch (error) {
            return {
                error: 'Something went wrong'
            };
        }

    }
}