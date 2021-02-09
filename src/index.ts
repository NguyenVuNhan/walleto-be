import { info } from "./provider/logger";
import { cron } from "./provider/cron";
import { cpus } from "os";
import cluster from "cluster";
import * as app from "./provider/app";
import * as nativeEvent from "./exception/nativeEvent";

if (cluster.isMaster) {
  /**
   * Catches the process events
   */
  nativeEvent.proc();
  /**
   * Clear the console before the app runs
   */
  app.clearConsole();

  /**
   * Find the number of available CPUS
   */
  const CPUS = cpus();
  info(`This machine has ${CPUS.length} CPUs.`);

  /**
   * Fork the process, the number of times we have CPUs available
   */
  CPUS.forEach(() => cluster.fork());

  /**
   * Catches the cluster events
   */
  nativeEvent.cluster(cluster);

  /**
   * Register cron job to do any action needed
   */
  cron.start();
} else {
  /**
   * Run the Database pool
   */
  app.loadDatabase();

  /**
   * Run the Server on Clusters
   */
  app.loadServer();
}
