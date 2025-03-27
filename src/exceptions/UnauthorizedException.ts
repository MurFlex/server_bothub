import AbstractException from './AbstractException'

class UnauthorizedException extends AbstractException {
    constructor(message = 'UnauthorizedException') {
        super(message, 401)
    }
}

export default UnauthorizedException
