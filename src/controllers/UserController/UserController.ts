import { AbstractController } from '../AbstractController'
import asyncHandler from 'express-async-handler'
import { Request, Response } from 'express'
import UnauthorizedException from '../../exceptions/UnauthorizedException'

class UserController extends AbstractController {
    public getProfile = asyncHandler(
        async (req: Request, res: Response): Promise<void> => {
            if(req.user) {
                this.sendSuccess(res, req.user)
                return 
            }

            throw new UnauthorizedException()
        }
    )
}

export default new UserController()