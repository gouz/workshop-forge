import { Clipse } from "clipse";
import server from "../utils/server";

const serveCmd = new Clipse("serve", "launch the server");
serveCmd
  .addOptions({
    port: {
      short: "p",
      type: "string",
      default: "3000",
      description: "port",
      optional: false,
    },
  })
  .action((_, opts) => {
    server(Number(opts.port));
  });

export default serveCmd;
