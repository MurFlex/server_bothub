export interface IBlock {
    id: number,
    botId: number,
    key: string,
    type: string,
    config: any,

    createdAt: Date,
    updatedAt: Date
}