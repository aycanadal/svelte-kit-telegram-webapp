export const cookieOptions = {
    httpOnly: true,
    path: '/',
    secure: true,
    sameSite: 'none' as 'none',
    maxAge: 60 * 60 * 24 // 1 day
}