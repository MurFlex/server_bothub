export interface IBot {
    id: number,
    name: string,
    token: string,
    start_block: string,
    isRunning: boolean,
    createdAt: Date,
    updatedAt: Date
}

export interface IBotCreate {
    name: string,
    startBlock: string,
    token: string,
    blocks: any[]
}