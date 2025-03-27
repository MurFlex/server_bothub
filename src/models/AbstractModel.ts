import prisma from '../prisma'
import { PrismaClient } from '@prisma/client'

export abstract class AbstractModel {
    protected prisma: PrismaClient

    constructor() {
        this.prisma = prisma
    }
}
