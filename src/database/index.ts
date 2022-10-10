import {Service} from "typedi";
import { PrismaClient } from '@prisma/client'

@Service()
class Database{

    public readonly client: PrismaClient = new PrismaClient();

    constructor() {
    }

    async close() {
        await this.client.$disconnect();
    }

    async connect() {
        await this.client.$connect();
    }


}

export default Database;