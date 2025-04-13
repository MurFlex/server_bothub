import { AbstractBlock } from './AbstractBlock'

class MessageBlock extends AbstractBlock {
    async execute() {
        await this.botService.bot.sendMessage(this.chatId, this.data.text)
    }
}

export default MessageBlock