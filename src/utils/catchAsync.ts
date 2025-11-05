import { RequestHandler } from 'express'

export const catchAsync = (Fn: RequestHandler): RequestHandler => {
    return (req, res, next) => {
        Promise.resolve(Fn(req, res, next)).catch(err => next(err))
    }
}
