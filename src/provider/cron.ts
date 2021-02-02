import { CronJob } from "cron";
import { config } from "./config";

const cron = new CronJob(config.cronJobExpression, () => {
  // eslint-disable-next-line no-console
  console.log("Executing cron job once every hour");
});

export { cron };
