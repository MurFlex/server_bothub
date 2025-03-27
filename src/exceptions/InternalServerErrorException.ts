import AbstractException from './AbstractException'

class InternalServerErrorException extends AbstractException {
    constructor(message = 'Internal server error') {
        super(message, 500)
    }
}

export default InternalServerErrorException
