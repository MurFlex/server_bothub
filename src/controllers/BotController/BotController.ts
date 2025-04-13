import { AbstractController } from '../AbstractController'
import asyncHandler from 'express-async-handler'
import { Request, Response } from 'express'
import BotModel from '../../models/BotModel'
import { IBotCreate } from '../../types/bot.interface'
import BotServiceManager from '../../services/BotService/BotServiceManager'

class BotController extends AbstractController {
    public startBot = asyncHandler(
        async (req: Request, res: Response): Promise<any> => { // TODO: Поменять any
            const { botId } = req.params
            const bot = await BotModel.getBotById(+botId)

            if (!bot) { // TODO: Добавить проверку на доступ юзера к боту
                return res.sendStatus(404)
            }

            if (BotServiceManager.isBotRunning(bot.id)) {
                return res.status(403).json({ error: 'Бот уже запущен' })
            }

            await BotServiceManager.startBot(bot)

            return res.status(200).json({ message: 'Бот запущен' })
        }
    )

    public stopBot = asyncHandler(
        async (req: Request, res: Response): Promise<any> => { // TODO: Поменять any
            const { botId } = req.params
            const bot = await BotModel.getBotById(+botId)

            if (!bot) { // TODO: Добавить проверку на доступ юзера к боту
                return res.sendStatus(404)
            }

            if (!BotServiceManager.isBotRunning(bot.id)) {
                return res.status(403).json({ error: 'Бот не запущен' })
            }

            await BotServiceManager.stopBot(bot)

            return res.status(200).json({ message: 'Бот остановлен' })
        }
    )

    public createBot = asyncHandler(
        async (req: Request, res: Response): Promise<void> => {
            const data = req.body as IBotCreate
            
            await BotModel.createBot(data)

            res.sendStatus(200)
        }
    )

    public handleTelegramRequest = asyncHandler(
        async (req: Request, res: Response): Promise<void> => {
            const { botId } = req.params
            const update = req.body
            const bot = await BotModel.getBotById(+botId)

            if (!bot) {
                return // TODO: обработки
            }

            const botService = BotServiceManager.getBotService(bot.id)

            if (!botService) {
                return
            }

            if (update.message) {
                await botService.handleMessage(update.message)
            }

            res.sendStatus(200)
        })
}

export default new BotController()