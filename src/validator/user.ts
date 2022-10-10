import { IsAscii, MaxLength, MinLength } from "class-validator";
import { User } from "../domain/user";
import { BaseValidatorConstructor as ParseAndOmit } from "./index";

export class AuthValidator {
  @MinLength(4, { message: "Username is too short. Minimum 4 characters." })
  @MaxLength(128, { message: "Username is too long. Maximum 64 characters." })
  username = "";

  @MinLength(8, { message: "Password is too short. Minimum 8 characters." })
  @MaxLength(64, { message: "Password is too long. Maximum 64 characters." })
  @IsAscii({
    message: "Password contains disallowed characters. Only ascii allowed.",
  })
  password = "";

  constructor(item: any) {
    ParseAndOmit(item, this);
  }

  ToUser(): User {
    return {
      username: this.username,
      password: this.password,
    };
  }
}
