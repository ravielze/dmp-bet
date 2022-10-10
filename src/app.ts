import express, { Application } from "express";
import Helmet from "helmet";
import Cors from "cors";
import { Service } from "typedi";
import "reflect-metadata";
import Config from "./config";
import Database from "./database";
import Controllers from "./controller";
import { RequestResponseManipulator } from "./middleware/manipulator";
import { ErrorMiddleware } from "./middleware/error";

@Service()
class App {
  private expressApplication: Application;

  constructor(
    private readonly config: Config,
    private readonly database: Database,
    private readonly controllers: Controllers
  ) {
    console.info("🌑 Starting Application...");
    this.expressApplication = express();
  }

  private install() {
    if (!this.controllers || !this.expressApplication) {
      throw new Error("☄️ Cannot Instantiate App!");
    }

    console.info("🌗 Initiating...");
    this.expressApplication.use(RequestResponseManipulator);
    this.expressApplication.use(express.json({ strict: true }));
    this.expressApplication.use(Cors());
    this.expressApplication.use(Helmet());

    const controllers = this.controllers.getAll();
    for (const c of controllers) {
      if (!c.basePath.startsWith("/")) {
        continue;
      }

      console.info(
        `\t🔗 ${c.constructor.name.replace("Controller", "")} Routes`
      );
      this.expressApplication.use(`/api${c.basePath}`, c.router);
      c.infoRoutes();
    }

    this.expressApplication.use(ErrorMiddleware);
  }

  async run() {
    await this.database.connect();
    this.install();
    try {
      this.expressApplication?.listen(this.config.serverPort, (): void => {
        console.info("🌕 Application started");
      });
      process.on("SIGINT", () => {
        process.exit();
      });
      process.on("exit", async () => {
        await this.database.close();
        console.info("🛡 Application stopped");
      });
    } catch (error) {
      await this.database.close();
      console.error(error);
    }
  }
}

export default App;
