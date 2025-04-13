import BotService from './BotService'
import BotModel from '../../models/BotModel'
import { IBot } from '../../types/bot.interface'

class BotServiceManager {
    private static instance: BotServiceManager
    private bots: Map<number, BotService> = new Map()

    private constructor() {}

    public static getInstance(): BotServiceManager {
        if (!this.instance) {
            this.instance = new BotServiceManager()
        }

        return this.instance
    }

    public getBotService(botId: number): BotService | undefined {
        return this.bots.get(botId)
    }

    public async startBot(bot: IBot) {
        if (this.bots.has(+bot.id)) {
            return
        }

        if (!bot) {
            throw new Error('Бот не найден')
        }

        const botService = new BotService(bot)
        await botService.start()

        await BotModel.updateBotStatus(bot.id, true)
        this.bots.set(bot.id, botService)
    }

    public async stopBot(bot: IBot) {
        const botService = this.bots.get(bot.id)

        if (!botService) {
            return
        }

        await botService.stop()
        await BotModel.updateBotStatus(bot.id, false)
        this.bots.delete(bot.id)
    }

    public async startAllBots() {
        const allBots = await BotModel.getRunningBots()

        for (const bot of allBots) {
            await this.startBot(bot)
        }
    }

    public isBotRunning(botId: number | string): boolean {
        return this.bots.has(+botId)
    }
}

export default BotServiceManager.getInstance()
