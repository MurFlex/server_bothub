import {
    IUser,
    IUserCreate,
    IUserResponse,
    IUserUpdate
} from '../types/user.interface'
import { AbstractModel } from './AbstractModel'
import badRequestException from '../exceptions/BadRequestException'

class UserModel extends AbstractModel {
    private model = this.prisma.user

    public formatUserForResponse(user: IUser | null): IUserResponse {
        if(!user) {
            throw new badRequestException()
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, createdAt, updatedAt, refresh_token, ...formattedUser } =
			user

        return formattedUser
    }

    public async getUserById(id: number): Promise<IUser | null> {
        return await this.model.findFirst({
            where: {
                id
            }
        }) as IUser | null
    }

    public async getUserByEmail(email: string): Promise<IUser | null> {
        return await this.model.findFirst({
            where: {
                email
            }
        }) as IUser | null
    }

    public async createUser(data: IUserCreate): Promise<IUser> {
        return await this.model.create({ data }) as IUser
    }

    public async updateUser(data: IUserUpdate): Promise<IUser> {
        return await this.model.update({
            where: {
                id: data.id
            },
            data
        }) as IUser
    }
}

export default new UserModel()
