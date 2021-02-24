import { info } from "./provider/logger";
import { cron } from "./provider/cron";
import { cpus } from "os";
import cluster from "cluster";
import * as app from "./provider/app";
import * as nativeEvent from "./exception/nativeEvent";

/**
 * Catches the process events
 */
nativeEvent.proc();
/**
 * Clear the console before the app runs
 */
app.clearConsole();

/**
 * Register cron job to do any action needed
 */
cron.start();

/**
 * Run the Database pool
 */
app.loadDatabase().then(
  /**
   * Run the Server on Clusters
   */
  () => app.loadServer()
);
