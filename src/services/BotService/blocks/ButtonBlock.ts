import { AbstractBlock } from './AbstractBlock'
import { InlineKeyboardButton } from 'node-telegram-bot-api'

class ButtonBlock extends AbstractBlock {
    async execute() {
        const text = this.data.text || 'Выбери опцию:'
        const buttons: string[] = this.data.buttons || []

        const keyboard: InlineKeyboardButton[][] = buttons.map((btn) => [
            { text: btn, callback_data: btn }
        ])

        await this.botService.bot.sendMessage(this.chatId, text, {
            reply_markup: {
                inline_keyboard: keyboard
            }
        })
    }
}

export default ButtonBlock