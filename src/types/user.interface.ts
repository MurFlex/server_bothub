export interface IUser {
	id: number
	email: string
	password: string
	refresh_token?: string
	createdAt: Date
	updatedAt: Date
}

export interface IUserCreate {
	email: string
	password: string
}

export type IUserUpdate = Omit<IUser, 'createdAt, updatedAt'>

export interface IUserSearch {
	id?: number
	email?: string
	name?: string
}

export interface IUserResponse {
	id?: number
	email?: string
	name?: string
}
