import AbstractException from './AbstractException'

class BadRequestException extends AbstractException {
    constructor(message = 'Bad request') {
        super(message, 400)
    }
}

export default BadRequestException
