import { CronJob } from "cron";
import { config } from "./config";
import { info } from "./logger";

export const cron = new CronJob(config.cronJobExpression, () => {
  info("Starting cron job");
  // TODO: add cron job here

  info("Cron job finished");
});

export default { cron };
