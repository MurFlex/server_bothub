import fs from 'fs'
import path from 'path'
import { IBot } from '../../types/bot.interface'
import { AbstractBlock } from './blocks/AbstractBlock'
import MessageBlock from './blocks/MessageBlock'
import { IBlock } from '../../types/block.interface'
import ButtonBlock from './blocks/ButtonBlock'

const blocks: Record<string, any> = {}

// TODO: Идея на потом
async function loadBlocks() {
    const blocksDir = path.join(__dirname, './blocks')
    const files = fs.readdirSync(blocksDir)

    const imports = files
        .filter((file) => file.endsWith('.ts')
            && file !== 'AbstractBlock.ts'
        )
        .map(async (file) => {
            const blockName = file.replace('.ts', '')
            const module = await import(`./${file}`)
            blocks[blockName.toLowerCase()] = module.default
        })

    await Promise.all(imports)
}

// loadBlocks().then(() => console.log('Блоки загружены:', Object.keys(blocks)))

export class BlockFactory {
    static create(
        block: IBlock,
        bot: IBot,
        chatId: number
    ): AbstractBlock {
        switch (block.type) {
            case 'message':
                return new MessageBlock(block, bot, chatId)

            case 'button':
                return new ButtonBlock(block, bot, chatId)

            default:
                throw new Error(`Неизвестный тип блока: ${block.type}`)
        }
    }
}
