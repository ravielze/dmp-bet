import { Service } from "typedi";
import UserController from "./user";
import { BaseController, Controller } from "./base";
import JobsController from "./jobs";

@Service()
class Controllers {
  constructor(
    public userController: UserController,
    public jobsController: JobsController
  ) {}

  getAll(): Controller[] {
    return Object.values(this).filter((item) => {
      return item instanceof BaseController;
    });
  }
}

export default Controllers;
