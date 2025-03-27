import BotController from '../controllers/BotController/BotController'
import { Router } from 'express'

const router = Router()

router.get('/', BotController.startBot)
router.post('/webhook', BotController.handleTelegramRequest)

export default router