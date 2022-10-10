import { StatusCodes } from "../../src/utils/http";
import { User } from "../../src/domain/user";

declare global {
  namespace Express {
    interface Request {
      loggedUser: User | null;
    }

    interface Response {
      return: (responseBody: any) => Response;

      returnError: (code: StatusCodes, responseBody: any) => Response;
    }
  }
}
