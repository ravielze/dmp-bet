import { Service } from "typedi";
import Config from "../config";
import { Algorithm, JsonWebTokenError, sign, verify } from "jsonwebtoken";
import { StandardError } from "../error";
import { StatusCodes } from "../utils/http";

@Service()
class TokenService {
  constructor(private readonly config: Config) {}

  createToken(userId: number, metadata?: any): string {
    const tokenData: any = { id: userId };
    if (metadata) {
      tokenData.metadata = metadata;
    }

    return sign(tokenData, this.config.jwtSecret, {
      algorithm: this.config.jwtAlgorithm as Algorithm,
      expiresIn: this.config.jwtExpiresIn,
    });
  }

  validateToken(token: string): any {
    try {
      return verify(token, this.config.jwtSecret, {
        algorithms: [this.config.jwtAlgorithm as Algorithm],
      });
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        throw new StandardError("not logged in", StatusCodes.FORBIDDEN);
      }
      throw error;
    }
  }
}

export default TokenService;
