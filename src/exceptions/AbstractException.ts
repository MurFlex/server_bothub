abstract class AbstractException extends Error {
    public readonly message: string
    public readonly statusCode: number

    constructor(message: string, statusCode: number) {
        super(message)
        this.message = message
        this.statusCode = statusCode
    }
}

export default AbstractException
