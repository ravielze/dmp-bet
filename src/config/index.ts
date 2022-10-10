import * as dotenv from "dotenv";
import { Service } from "typedi";

@Service()
class Config {
  public serverPort: number;
  public jwtSecret: string;
  public jwtExpiresIn: string;
  public saltRound: number = 10;
  public jwtAlgorithm: string;
  public jobsEndpoint: string;

  constructor() {
    dotenv.config();
    this.serverPort = parseInt(process.env.SERVER_PORT || "3000");
    this.jwtSecret = process.env.JWT_SECRET || "jwt_secret";
    this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || "1d";
    if (process.env.SALT_ROUND) {
      this.saltRound = +process.env.SALT_ROUND;
    }
    this.jwtAlgorithm = process.env.JWT_ALGORITHM || "HS256";
    this.jobsEndpoint = process.env.JOBS_ENDPOINT || "";
  }
}

export default Config;
