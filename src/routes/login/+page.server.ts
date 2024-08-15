/** @type {import('./$types').Actions} */

import { db } from "$lib";
import { redirect } from "@sveltejs/kit";
import { Credentials } from "./credentials";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from "$env/dynamic/private";
import { cookieOptions } from "$lib/constants";

export const actions = {

    login: async (event) => {

        const formData = await event.request.formData()
        const formCredentials = new Credentials(Object.fromEntries(formData));

        const user = await db.user.findUnique({
            where: {
                telegramId: formCredentials.telegramId as string
            }
        });

        if (!user)
            return { error: "User doesn't exist." };

        if (!bcrypt.compareSync(formCredentials.password, user.password))
            return { error: "Incorrect password." };

        return { success: "User credentials are correct." }

    },

    token: async (event) => {

        const formData = await event.request.formData()
        const formDataDto = Object.fromEntries(formData)

        let user = await db.user.findUnique({
            where: {
                telegramId: formDataDto.telegramId as string
            }
        });

        if (!user)
            return { error: "No such telegram id." }

        if (user.token != formDataDto.token)
            return { error: "Incorrect token." }

        let jwtUser;
        let token;

        try {
            //jwtUser = jwt.verify(user.token, env.JWT_SECRET);
            const jwtUser = jwt.verify(user.token, "some secret");
        } catch (exception) {

            if (exception instanceof jwt.TokenExpiredError) {
                const jwtUser = {
                    telegramId: user.telegramId
                };

                //token = jwt.sign(jwtUser, env.JWT_SECRET, {
                token = jwt.sign(jwtUser, "some secret", {
                    expiresIn: '30m'
                });
            }

            user = await db.user.update({
                where: { telegramId: formDataDto.telegramId as string },
                data: {
                    token
                }
            });

        }

        if (typeof jwtUser === "string") {
            throw new Error("Something went wrong");
        }

        event.cookies.set('AuthorizationToken', `Bearer ${user.token}`, cookieOptions);

        if (token)
            return { newToken: token }
        else {
            redirect(303, '/profile');
            return { success: "Token is valid." }
        }


    }

}