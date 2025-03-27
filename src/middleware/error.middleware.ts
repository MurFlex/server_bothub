import { NextFunction, Request, Response } from 'express'
import AbstractException from '../exceptions/AbstractException'

export const notFound = (req: Request, res: Response, next: NextFunction) => {
    const error = new Error('Not found')

    res.status(404)
    next(error)
}

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (res.headersSent) {
        return next(err)
    }

    const statusCode = err instanceof AbstractException ? err.statusCode : 500

    res.status(statusCode)
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    })
}
