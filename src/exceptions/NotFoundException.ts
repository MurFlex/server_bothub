import AbstractException from './AbstractException'

class NotFoundException extends AbstractException {
    constructor(message = 'Ресурс не найден') {
        super(message, 404)
    }
}

export default NotFoundException
