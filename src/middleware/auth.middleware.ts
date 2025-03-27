import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import UserModel from '../models/UserModel'
import { getTokenPair, TokenPayload } from '../utils/token-generator'

const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const accessToken = req.headers.authorization?.split(' ')[1]

        if (!accessToken) {
            return res.status(401).json({ message: 'No access token provided' })
        }

        const decoded = jwt.verify(
            accessToken,
			process.env.SECRET_KEY!
        ) as TokenPayload

        const user = await UserModel.getUserById(decoded.userId)

        if (user) {
            req.user = UserModel.formatUserForResponse(user)
            return next()
        }
    } catch (err: unknown) {
        if (err instanceof Error) {
            if (err.name === 'TokenExpiredError') {
                const refreshToken = req.cookies.refresh_token
                if (!refreshToken) {
                    return res.status(401).json({ message: 'Ошибка токена' })
                }

                try {
                    const decodedRefresh = jwt.verify(
                        refreshToken,
                    process.env.SECRET_KEY!
                    ) as TokenPayload

                    const userId = decodedRefresh.userId

                    const user = await UserModel.getUserById(userId)

                    if (!user || user.refresh_token !== refreshToken) {
                    // TODO: Нужно сделать таблицу с токенами, сделать крон на удаление невалидных токенов, чтобы один аккаунт мог иметь несколько токенов, т.к. человек может зайти с разных устройств
                        return res.status(401).json({ message: 'Ошибка токена' })
                    }

                    const tokens = getTokenPair(userId)

                    await UserModel.updateUser({
                        ...user,
                        refresh_token: tokens.refreshToken
                    })

                    // TODO: Вынести в utils
                    res.setHeader('Authorization', `Bearer ${tokens.accessToken}`)

                    res.cookie('refresh_token', tokens.refreshToken, {
                        sameSite: 'strict',
                        secure: process.env.NODE_ENV === 'production',
                        httpOnly: true,
                        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 дней
                    })

                    if (user) {
                        req.user = UserModel.formatUserForResponse(user)
                        return next()
                    }
                } catch (refreshError) {
                    return res.status(401).json(refreshError)
                }
            } else {
                console.error('Unknown error:', err)
            }
        } else {
            return res.status(401).json({ message: 'Ошибка токена' })
        }
        res.json(err)
    }
}

export default authMiddleware
