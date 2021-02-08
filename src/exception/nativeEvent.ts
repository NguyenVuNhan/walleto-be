import { error, info, warn } from "../provider/logger";

export const cluster = (cluster: typeof import("cluster")) => {
  // Catch cluster listening event...
  cluster.on("listening", (worker) =>
    info(`Server :: Cluster with ProcessID '${worker.process.pid}' Connected!`)
  );

  // Catch cluster once it is back online event...
  cluster.on("online", (worker) =>
    info(
      `Server :: Cluster with ProcessID '${worker.process.pid}' has responded after it was forked! `
    )
  );

  // Catch cluster disconnect event...
  cluster.on("disconnect", (worker) =>
    info(
      `Server :: Cluster with ProcessID '${worker.process.pid}' Disconnected!`
    )
  );

  // Catch cluster exit event...
  cluster.on("exit", (worker, code, signal) => {
    info(
      `Server :: Cluster with ProcessID '${worker.process.pid}' is Dead with Code '${code}, and signal: '${signal}'`
    );
    // Ensuring a new cluster will start if an old one dies
    cluster.fork();
  });
};

export const proc = () => {
  // Catch the Process's uncaught-exception
  process.on("uncaughtException", (exception) => error(exception.stack));

  // Catch the Process's warning event
  process.on("warning", (warning) => warn(warning.stack));
};
