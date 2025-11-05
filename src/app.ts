import express from 'express'
import { applyMiddleware, globalErrorHandler } from '@/middlewares'
import router from './routes'

const app = express()

applyMiddleware(app)

// Hook routes
app.use(router)

app.get('/health', (__, res) => {
    res.status(200).json({ status: 'success' })
})

app.use((req, res) => {
    res.status(404).json({
        status: 'fail',
        message: `Can't find ${req.originalUrl} on this server!`,
    })
})

app.use(globalErrorHandler)

export default app
