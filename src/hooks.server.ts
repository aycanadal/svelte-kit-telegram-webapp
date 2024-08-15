import { redirect, type Handle } from "@sveltejs/kit";
import jwt from 'jsonwebtoken';
import { db } from "$lib";
import { env } from "$env/dynamic/private";

const public_paths = [
    '/',
    '/signup',
    '/login'
];

function isPathAllowed(path: string) {
    return public_paths.some(allowedPath =>
        path === allowedPath || path.startsWith(allowedPath + '/')
    );
}

export const handle: Handle = async ({ event, resolve }) => {

    const url = new URL(event.request.url);
    if (isPathAllowed(url.pathname))
        return await resolve(event);

    const bearerAndToken = event.cookies.get("AuthorizationToken")

    if (!bearerAndToken) {
        redirect(307, "/login")
        return await resolve(event);
    }

    if (bearerAndToken) {
        const token = bearerAndToken.split(" ")[1];

        try {
            //const jwtUser = jwt.verify(token, env.JWT_SECRET);
            const jwtUser = jwt.verify(token, "some secret");
            if (typeof jwtUser === "string") {
                throw new Error("Something went wrong");
            }

            const user = await db.user.findUnique({
                where: {
                    telegramId: jwtUser.telegramId,
                },
            });

            if (!user) {
                throw new Error("User not found");
            }

            const sessionUser = {
                id: user.id,
                telegramId: user.telegramId,
                createdAt: user.createdAt
            };

            event.locals.user = sessionUser;

        } catch (exception) {
            if (exception instanceof jwt.TokenExpiredError)
                redirect(303, "/login")
            else
                throw exception

        }

    }

    return await resolve(event);
};


export interface SessionUser {

    id: string;
    telegramId: string;
    createdAt: Date

}