import { IUserResponse } from './user.interface'

declare global {
	namespace Express {
		interface Request {
			user?: IUserResponse | null
		}
	}
}

export {}
