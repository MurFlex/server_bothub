import { AbstractModel } from './AbstractModel'
import { ISession, ISessionCreate } from '../types/session.interface'

class SessionModel extends AbstractModel {
    private model = this.prisma.userSessions

    public async getActiveSession(userId: number, botId: number): Promise<ISession | null> {
        return await this.model.findFirst({
            where: {
                userId,
                botId,
                isFinished: false
            }
        }) as ISession | null
    }

    public async createSession(data: ISessionCreate): Promise<ISession> {
        return await this.model.create({
            data: {
                isFinished: false,
                ...data
            }
        }) as ISession
    }

    public async updateCurrentBlock(sessionId: number, currentBlock: string) {
        await this.model.update({
            where: { id: sessionId },
            data: { currentBlock }
        })
    }
    
    public async finishSession(sessionId: number): Promise<void> {
        await this.model.update({
            where: { id: sessionId },
            data: { isFinished: true }
        })
    }
}

export default new SessionModel()