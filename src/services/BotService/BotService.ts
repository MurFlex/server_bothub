import TelegramBot from 'node-telegram-bot-api'
import { IBot } from '../../types/bot.interface'
import SessionModel from '../../models/SessionModel'
import BotModel from '../../models/BotModel'
import { BlockFactory } from './BlocksFactory'

class BotService {
    public bot: TelegramBot // TODO: Мб переименовать в botApi
    private readonly config: IBot // TODO: Мб переименовать в bot

    constructor(config: IBot) { // TODO: начать передавать бота целиком как экземпляр модели
        this.config = config
        this.bot = new TelegramBot(this.config.token)
    }

    public async start() {
        const webhookUrl = `${process.env.WEBHOOK_URL}/bot/${this.config.id}/webhook`
        this.setupWebhook(webhookUrl)
    }

    public async stop() {
        await this.bot.deleteWebHook()
    }

    public async handleMessage(message: TelegramBot.Message) {
        const chatId = message.chat.id

        if (!message.from?.id) {
            return
        }

        const userId = BigInt(message.from.id)

        let session = await SessionModel.getActiveSession(userId, this.config.id)

        if (!session) {
            session = await SessionModel.createSession({
                userId,
                botId: this.config.id,
                currentBlock: this.config.start_block
            })
        }

        const blockData = await BotModel.getBlockByKey(this.config.id, session.currentBlock)

        if (!blockData) {
            return
        }

        const block = BlockFactory.create(blockData, this.config, chatId)
        await block.execute()

        if (blockData.config.nextBlock) {
            await SessionModel.updateCurrentBlock(session.id, blockData.config.nextBlock)
        } else {
            await SessionModel.finishSession(session.id)
        }
    }

    private setupWebhook(url: string): void { // TODO: Выпилить везде
        this.bot.setWebHook(url)
    }
}

export default BotService
