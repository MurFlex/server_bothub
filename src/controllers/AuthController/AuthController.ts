import bcrypt from 'bcrypt'
import { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import jwt from 'jsonwebtoken'
import BadRequestException from '../../exceptions/BadRequestException'
import NotFoundException from '../../exceptions/NotFoundException'
import UserModel from '../../models/UserModel'
import { getTokenPair, TokenPayload } from '../../utils/token-generator'
import { AbstractController } from '../AbstractController'

const SALT_ROUNDS = 10 // TODO: Вывести в какой-нибудь конфиг

class AuthController extends AbstractController {
    public login = asyncHandler(
        async (req: Request, res: Response): Promise<void> => {
            const { email, password } = req.body

            if (!email || !password) {
                throw new BadRequestException()
            }

            let user = await UserModel.getUserByEmail(email)

            if (!user) {
                throw new NotFoundException()
            }

            const isPasswordValid = await bcrypt.compare(password, user.password)

            if (!isPasswordValid) {
                throw new BadRequestException()
            }

            const tokens = getTokenPair(user.id)

            user = await UserModel.updateUser({
                ...user,
                refresh_token: tokens.refreshToken
            })

            // TODO: Вынести в utils
            res.setHeader('Authorization', `Bearer ${tokens.accessToken}`)

            res.cookie('refresh_token', tokens.refreshToken, {
                sameSite: 'strict',
                secure: process.env.NODE_ENV === 'production',
                maxAge: 30 * 24 * 60 * 60 * 1000 // 30 дней
            })

            this.sendSuccess(res, UserModel.formatUserForResponse(user))
        }
    )

    public register = asyncHandler(
        async (req: Request, res: Response): Promise<void> => {
            const { email, password } = req.body

            const isHaveUser = await UserModel.getUserByEmail(email)

            if (isHaveUser) {
                res.status(400)
                throw new Error(`Пользователь с почтой ${email} уже существует`)
            }

            const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

            let user = await UserModel.createUser({
                email,
                password: hashedPassword
            })

            const tokens = getTokenPair(user.id)

            user = await UserModel.updateUser({
                ...user,
                refresh_token: tokens.refreshToken
            })

            // TODO: Вынести в utils
            res.setHeader('Authorization', `Bearer ${tokens.accessToken}`)

            res.cookie('refresh_token', tokens.refreshToken, {
                sameSite: 'strict',
                secure: process.env.NODE_ENV === 'production',
                maxAge: 30 * 24 * 60 * 60 * 1000 // 30 дней
            })

            this.sendSuccess(res, UserModel.formatUserForResponse(user))
        }
    )

    public checkEmailFree = asyncHandler(
        async (req: Request, res: Response): Promise<void> => {
            const { email } = req.body

            const user = await UserModel.getUserByEmail(email)

            if (user) {
                this.sendSuccess(res, false)
            }

            this.sendSuccess(res, true)
        }
    )

    public refreshToken = asyncHandler(
        async (req: Request, res: Response): Promise<void> => {
            const refreshToken = req.cookies.refresh_token

            if (!refreshToken) {
                throw new BadRequestException('Refresh token is missing.')
            }

            const decoded = jwt.verify(
                refreshToken,
				process.env.SECRET_KEY!
            ) as TokenPayload

            const user = await UserModel.getUserById(decoded.userId)

            if (!user) {
                throw new BadRequestException('Invalid refresh token.')
            }

            const tokens = getTokenPair(user.id)

            await UserModel.updateUser({
                ...user,
                refresh_token: tokens.refreshToken
            })

            res.setHeader('Authorization', `Bearer ${tokens.accessToken}`)

            res.cookie('refresh_token', tokens.refreshToken, {
                sameSite: 'strict',
                secure: process.env.NODE_ENV === 'production',
                maxAge: 30 * 24 * 60 * 60 * 1000 // 30 дней
            })

            this.sendSuccess(res, { accessToken: tokens.accessToken })
        }
    )
}

export default new AuthController()
