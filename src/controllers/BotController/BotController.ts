import { AbstractController } from '../AbstractController'
import asyncHandler from 'express-async-handler'
import { Request, Response } from 'express'
import BotService from '../../services/BotService'

class BotController extends AbstractController {
    public startBot = asyncHandler(
        async (req: Request, res: Response): Promise<void> => {
            const botService = new BotService(process.env.BOT_TOKEN!)
            botService.setupWebhook(process.env.WEBHOOK_URL!)

            res.sendStatus(200)
        }
    )

    public handleTelegramRequest = asyncHandler(
        async (req: Request, res: Response): Promise<void> => {
            const botService = new BotService(process.env.BOT_TOKEN!)
            botService.bot.processUpdate(req.body)

            res.sendStatus(200)
        })
}

export default new BotController()