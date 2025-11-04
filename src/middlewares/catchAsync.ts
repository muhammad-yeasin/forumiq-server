import type { RequestHandler } from 'express'

const catchAsync = (Fn: RequestHandler): RequestHandler => {
    return (req, res, next) => {
        Promise.resolve(Fn(req, res, next)).catch(err => next(err))
    }
}

export default catchAsync
