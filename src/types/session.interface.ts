export interface ISession {
    id: number,
    userId: bigint,
    botId: number,
    currentBlock: string,
    isFinished: boolean,
    lastInteractionAt: Date
}

export interface ISessionCreate {
    userId: bigint,
    botId: number,
    currentBlock: string,
    lastInteractionAt?: Date
}