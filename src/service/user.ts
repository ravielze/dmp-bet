import { Service } from "typedi";
import UserRepository from "../repository/user";
import { User } from "../domain/user";
import { StandardError } from "../error";
import { StatusCodes } from "../utils/http";
import { compare, hash } from "bcrypt";
import Config from "../config";

@Service()
class UserService {
  constructor(
    private readonly config: Config,
    private readonly repo: UserRepository
  ) {}

  async register(user: User): Promise<User> {
    const findUser = await this.repo.getUser(user.username);
    if (findUser) {
      throw new StandardError(
        "username already registered",
        StatusCodes.BAD_REQUEST
      );
    }

    user.password = await hash(user.password, this.config.saltRound);
    const result: any = this.repo.create(user);
    delete result.password;
    return result;
  }

  async login(user: User): Promise<User | null> {
    const findUser = await this.repo.getUser(user.username);
    if (!findUser) {
      return null;
    }

    const passwordValid = await compare(user.password, findUser.password);
    if (!passwordValid) {
      return null;
    }
    delete findUser.password;
    return findUser;
  }

  async findById(id: number): Promise<User> {
    return this.repo.getUserByID(id);
  }
}

export default UserService;
