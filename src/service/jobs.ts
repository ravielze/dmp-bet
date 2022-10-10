import { Service } from "typedi";
import Config from "../config";
import axios from "axios";
import { Jobs } from "../domain/jobs";

export interface JobsFilter {
  isFulltime?: boolean;
  description?: string;
  location?: string;
  item_per_page?: number;
}

export interface JobsFilterResult {
  jobs: Jobs[];
  page: number;
  total_page: number;
  total_item: number;
}

@Service()
class JobsService {
  constructor(private readonly config: Config) {
    if (
      !(
        this.config.jobsEndpoint.startsWith("https://") ||
        this.config.jobsEndpoint.startsWith("http://")
      )
    ) {
      throw new Error("Jobs API Endpoint is not set or a valid url.");
    }
    this.getAllJobs();
  }

  private async getAllJobs(): Promise<Jobs[]> {
    const result = await axios.get(
      this.config.jobsEndpoint + "/positions.json"
    );
    return result.data as Jobs[];
  }

  private async __getJob(id: string): Promise<Jobs | null> {
    const result = await axios.get(
      this.config.jobsEndpoint + "/positions/" + id
    );
    const jobResult = result.data as Jobs;
    if (!jobResult.id) {
      return null;
    }
    return jobResult;
  }

  async getJob(id: string): Promise<Jobs | null> {
    return this.__getJob(id);
  }

  async getJobs(filter: JobsFilter, page?: number): Promise<JobsFilterResult> {
    if (!page) {
      page = 1;
    }
    let itemPerPage = 10;
    if (filter.item_per_page) {
      itemPerPage = +filter.item_per_page;
    }

    if (itemPerPage <= 0) {
      itemPerPage = 10;
    }

    let result: Jobs[] = await this.getAllJobs();
    if (filter.isFulltime === true) {
      result = result.filter((each) => each.type === "Full Time");
    } else if (filter.isFulltime === false) {
      result = result.filter((each) => each.type !== "Full Time");
    }

    if (filter.description) {
      result = result.filter((each) =>
        each.description
          .toLowerCase()
          .includes(filter.description!.toLowerCase())
      );
    }

    if (filter.location) {
      result = result.filter((each) =>
        each.location.toLowerCase().includes(filter.location!.toLowerCase())
      );
    }
    const total_item = result.length;
    const total_page = Math.ceil(total_item / itemPerPage);
    itemPerPage = Math.min(itemPerPage, result.length);

    return {
      page,
      total_page,
      total_item,
      jobs: result.slice((page - 1) * itemPerPage, page * itemPerPage),
    };
  }
}

export default JobsService;
