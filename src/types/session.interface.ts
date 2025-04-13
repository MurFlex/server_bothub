export interface ISession {
    id: number,
    userId: number,
    botId: number,
    currentBlock: string,
    isFinished: boolean,
    lastInteractionAt: Date
}

export interface ISessionCreate {
    userId: number,
    botId: number,
    currentBlock: string,
    lastInteractionAt?: Date
}