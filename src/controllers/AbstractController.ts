import { Response } from 'express'
import AbstractException from '../exceptions/AbstractException'

export abstract class AbstractController {
    protected sendSuccess(res: Response, data: any): Response {
        return res.status(200).json(data)
    }

    protected sendError(res: Response, error: AbstractException): Response {
        return res.status(error.statusCode).json({ error: error.message })
    }
}
