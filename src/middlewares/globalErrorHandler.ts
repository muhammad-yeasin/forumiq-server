import { env } from '@/config/env'
import AppError from '@/utils/AppError'
import { ErrorRequestHandler, Response } from 'express'

const handleCastErrorDB = (err: any) => {
    const message = `Invalid ${err.path}: ${err.value}`
    return new AppError(message, 400)
}

const handleDuplicateKeyError = (err: any) => {
    const field = Object.keys(err.keyValue)
    const data = field.map(key => ({
        field: key,
        message: `${key} '${err.keyValue[key]}' already exist.`,
    }))
    const message = `Duplicate key found`
    return new AppError(message, 400, data)
}

const handleValidationError = (err: any) => {
    const errors = Object.values(err.errors).map((el: any) => ({
        field: el.path,
        message: el.message,
    }))
    const message = `Invalid input data.`
    return new AppError(message, 400, errors)
}
const JWTInvalidError = () => {
    return new AppError('Invalid token! Please login again', 401)
}
const JWTExpiredError = () => {
    return new AppError('Token expired! Please login again', 401)
}

const sendDevError = (err: any, res: Response) => {
    res.status(err.isOperational ? err.statusCode : 500).json({
        status: err.status,
        errors: err,
        message: err.message,
        stack: err.stack,
    })
}

const sendProdError = (err: any, res: Response) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            errors: err.data,
        })
    } else {
        console.error('ERROR 💥', { name: err.name, message: err.message, err })

        res.status(500).json({
            status: 'error',
            message: 'Something went wrong',
            err,
        })
    }
}

const globalErrorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
    if (env.NODE_ENV === 'development') {
        sendDevError(err, res)
    } else if (env.NODE_ENV === 'production') {
        let error = err
        if (error.name === 'CastError') {
            error = handleCastErrorDB(error)
        }
        if (error.code === 11000) {
            error = handleDuplicateKeyError(error)
        }
        if (error.name === 'ValidationError') {
            error = handleValidationError(error)
        }
        if (error.name === 'JsonWebTokenError') {
            error = JWTInvalidError()
        }
        if (error.name === 'TokenExpiredError') {
            error = JWTExpiredError()
        }

        sendProdError(error, res)
    }
}

export default globalErrorHandler
