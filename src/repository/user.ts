import { Service } from "typedi";
import Config from "../config";
import Database from "../database";
import { PrismaClient } from "@prisma/client";
import { User } from "../domain/user";

@Service()
class UserRepository {
  private db: PrismaClient;

  constructor(database: Database) {
    this.db = database.client;
  }

  public async create(user: User): Promise<any> {
    return await this.db.user.create({
      data: user,
    });
  }

  public async getUser(username: string): Promise<any> {
    return await this.db.user.findFirst({
      where: {
        username,
      },
    });
  }

  public async getUserByID(userId: number): Promise<any> {
    return await this.db.user.findFirst({
      where: { id: userId },
    });
  }
}

export default UserRepository;
