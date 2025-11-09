import { Router } from 'express'
import aiController from './ai.controller'

const aiRouter = Router()

aiRouter.route('/summarize-thread/:threadId').get(aiController.summarizeThread)

export default aiRouter
