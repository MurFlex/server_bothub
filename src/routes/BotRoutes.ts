import BotController from '../controllers/BotController/BotController'
import { Router } from 'express'

const router = Router()

router.get('/', BotController.startBot)
router.post('/create', BotController.createBot)

router.post('/:botId/webhook', BotController.handleTelegramRequest)
router.post('/:botId/start', BotController.startBot)
router.post('/:botId/stop', BotController.stopBot)

export default router