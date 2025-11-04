import express from 'express'
import { applyMiddleware } from '@/middlewares'

const app = express()

applyMiddleware(app)

app.get('/health', (__, res) => {
    res.status(200).json({ status: 'success' })
})

app.use((req, res) => {
    res.status(404).json({
        status: 'fail',
        message: `Can't find ${req.originalUrl} on this server!`,
    })
})

export default app
