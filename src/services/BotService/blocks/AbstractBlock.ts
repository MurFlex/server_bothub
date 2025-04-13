import { IBot } from '../../../types/bot.interface'
import BotService from '../BotService'
import BotServiceManager from '../BotServiceManager'
import { IBlock } from '../../../types/block.interface'

export class AbstractBlock {
    protected data: any
    protected botService: BotService
    protected chatId: number

    constructor(
        data: IBlock,
        bot: IBot,
        chatId: number
    ) {
        this.data = data.config
        this.chatId = chatId

        const botService = BotServiceManager.getBotService(bot.id)

        if(!botService) {
            throw new Error('Bot is not started')
        }

        this.botService = botService
    }

    async execute(): Promise<any> {
        throw new Error('Метод execute() должен быть реализован в подклассе')
    }
}