import { AbstractModel } from './AbstractModel'
import { IBot, IBotCreate } from '../types/bot.interface'
import { IBlock } from '../types/block.interface'

class BotModel extends AbstractModel {
    private bots = this.prisma.bots
    private blocks = this.prisma.botsBlocks // TODO: Вынести в модель

    public async createBot(data: IBotCreate): Promise<void> {
        const { blocks, ...createData } = data
        const bot = await this.bots.create({
            data: createData
        })

        for (const block of blocks) {
            const { type, id, ...config } = block

            await this.blocks.create({
                data: {
                    botId: bot.id,
                    key: id,
                    type,
                    config
                }
            })
        }
    }

    public async getAllBots() {
        return await this.bots.findMany() as IBot[]
    }

    public async getBlockByKey(botId: number, key: string) {
        return await this.blocks.findFirst({
            where: {
                botId,
                key
            }
        }) as IBlock | null
    }

    public async getBotById(id: number) {
        return await this.bots.findUnique({
            where: {
                id
            }
        }) as IBot | null
    }

    public async getRunningBots() {
        return await this.bots.findMany({
            where: {
                isRunning: true
            }
        }) as IBot[]
    }

    public async updateBotStatus(id:  number, isRunning: boolean) {
        await this.bots.update({
            where: { id },
            data: { isRunning }
        })
    }
}

export default new BotModel()