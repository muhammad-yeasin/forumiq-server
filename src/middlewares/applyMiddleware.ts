import express, { type Application } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { env } from '@/config/env'

export const applyMiddleware = (app: Application) => {
    app.use(express.json())
    app.use(cookieParser())
    app.use(
        cors({
            origin: env.CORS_ORIGIN,
            credentials: true,
        })
    )
}
