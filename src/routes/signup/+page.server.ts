/** @type {import('./$types').Actions} */
import { env } from '$env/dynamic/private';
import { db } from '$lib';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

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
        
            const token = jwt.sign(jwtUser, "some super classified secret", {
                expiresIn: '3s'
            });

             const user = await db.user.create({
                data: {
                    telegramId: dto.telegramId as string,
                    password: await bcrypt.hash(dto.password as string, 10),
                    token
                }
            });
           
            return { token };

        } catch (error) {
            return {
                error: 'Something went wrong'
            };
        }

    }
}