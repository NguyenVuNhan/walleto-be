import { cpus } from "os";
import cluster from "cluster";

// import App from "./providers/App";
// import NativeEvent from "./exception/NativeEvent";

const CPUS: any = cpus();

if (cluster.isMaster) {
  console.log(`This machine has ${CPUS} CPUs.`);
  for (let i = 0; i < CPUS; i++) {
    cluster.fork();
  }

  cluster.on("online", (worker) => {
    console.log(`Worker ${worker.process.pid} is online`);
  });

  cluster.on("exit", (worker, code, signal) => {
    console.log(
      `Worker ${worker.process.pid} died with code: ${code} and signal: ${signal}`
    );
    console.log("Starting a new worker...");
    cluster.fork();
  });
  /**
   * Catches the process events
   */
  // NativeEvent.process();
  /**
   * Clear the console before the app runs
   */
  // App.clearConsole();
  /**
   * Load Configuration
   */
  // App.loadConfiguration();
  /**
   * Find the number of available CPUS
   */
  /**
   * Fork the process, the number of times we have CPUs available
   */
  // CPUS.forEach(() => cluster.fork());
  /**
   * Catches the cluster events
   */
  // NativeEvent.cluster(cluster);
  /**
   * Loads the Queue Monitor iff enabled
   */
  // App.loadQueue();
  /**
   * Run the Worker every minute
   * Note: we normally start worker after
   * the entire app is loaded
   */
  // setTimeout(() => App.loadWorker(), 1000 * 60);
} else {
  /**
   * Run the Database pool
   */
  // App.loadDatabase();
  /**
   * Run the Server on Clusters
   */
  // App.loadServer();
}
