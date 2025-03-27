import TelegramBot from 'node-telegram-bot-api'

class BotService {
    public bot: TelegramBot
    private readonly token: string

    constructor(token: string) {
        this.token = token
        this.bot = new TelegramBot(this.token, { polling: true })

        this.bot.on('message', (msg) => {
            const chatId = msg.chat.id
            this.bot.sendMessage(chatId, 'Hello, world')
        })
    }

    public setupWebhook(url: string): void {
        this.bot.setWebHook(url)
    }
}

export default BotService
