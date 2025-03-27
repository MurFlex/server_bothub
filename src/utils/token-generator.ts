import jwt, { JwtPayload } from 'jsonwebtoken'

export interface TokenPayload extends JwtPayload {
	userId: number
}

// TODO: Нужно эти длительности вывести куда-то в общее место с AuthController, в cookie приходится передавать число, а в JWT генератор строку, нужно подумать, как свести это к одному способу взаимодействия, возможно сделать функцию, которая примет TokenValidityTypes и вернет сумму, мб сделать парсер строки
export enum TokenValidityTypes {
	RefreshToken = '30d',
	AccessToken = '1h',
}

const token = process.env.SECRET_KEY!

export const getTokenPair = (userId: number) => {
    const refreshToken = jwt.sign({ userId }, token, {
        expiresIn: TokenValidityTypes.RefreshToken
    })
    const accessToken = jwt.sign({ userId }, token, {
        expiresIn: TokenValidityTypes.AccessToken
    })

    return {
        refreshToken,
        accessToken
    }
}

export const verifyToken = (token: string): JwtPayload | string => {
    try {
        return jwt.verify(token, token)
    } catch (error) {
        throw new Error(`Invalid token: ${error}`)
    }
}
