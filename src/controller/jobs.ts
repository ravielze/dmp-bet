import { BaseController, Controller } from "./base";
import { Service } from "typedi";
import AuthMiddleware from "../middleware/auth";
import AsyncHandler from "express-async-handler";
import JobsService, { JobsFilter } from "../service/jobs";
import { Request, Response } from "express";
import { CreateResponse, ResponseStatus } from "../utils/transformer";
import { StandardError } from "../error";
import { StatusCodes } from "../utils/http";

@Service()
class JobsController extends BaseController implements Controller {
  constructor(
    private readonly service: JobsService,
    private readonly authMiddleware: AuthMiddleware
  ) {
    super("/jobs");
    this.router.get(
      "/",
      this.authMiddleware.isAuthorized(),
      AsyncHandler(this.jobs.bind(this))
    );
    this.router.get(
      "/:id",
      this.authMiddleware.isAuthorized(),
      AsyncHandler(this.job.bind(this))
    );
  }

  async job(req: Request, res: Response) {
    if (!req.params.id || req.params.id.length === 0) {
      throw new StandardError("id invalid", StatusCodes.BAD_REQUEST);
    }

    const result = await this.service.getJob(req.params.id);
    console.log(result);
    if (result === null) {
      throw new StandardError("id not found", StatusCodes.NOT_FOUND);
    }
    res.return(CreateResponse(ResponseStatus.OK, result));
  }

  async jobs(req: Request, res: Response) {
    const filter: JobsFilter = {};
    const { full_time, description, location, item_per_page, page } = req.query;
    if (full_time && full_time.toString().toLowerCase() === "true") {
      filter.isFulltime = true;
    } else if (full_time && full_time.toString().toLowerCase() === "false") {
      filter.isFulltime = false;
    }
    if (description) {
      filter.description = description as string;
    }
    if (location) {
      filter.location = location as string;
    }
    if (item_per_page) {
      filter.item_per_page = +item_per_page;
    }
    let p = 1;
    if (page) {
      p = +page;
      if (p <= 0) {
        p = 1;
      }
    }
    const result = await this.service.getJobs(filter, p);
    res.return(CreateResponse(ResponseStatus.OK, result));
  }
}

export default JobsController;
