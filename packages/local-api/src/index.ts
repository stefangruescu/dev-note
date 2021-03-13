import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import path from "path";
import { createCellsRouter } from "./routes/cells";

export const serve = (
  port: number,
  filename: string,
  dir: string,
  useProxy: boolean
) => {
  const app = express();

  app.use(createCellsRouter(filename, dir));

  if (!useProxy) {
    // when user execute cli on local machine
    const packagePath = require.resolve(
      "@dev-note/local-client/build/index.html"
    );
    app.use(express.static(path.dirname(packagePath)));
  } else {
    // for development
    app.use(
      createProxyMiddleware({
        target: "http://localhost:3000",
        ws: true,
        logLevel: "silent",
      })
    );
  }

  return new Promise<void>((res, rej) => {
    app.listen(port, res).on("error", rej);
  });
};
