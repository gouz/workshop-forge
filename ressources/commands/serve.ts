import { Clipse } from "clipse";
import server from "../utils/server";

const serveCmd = new Clipse("serve", "launch the server");
serveCmd.action((_, opts) => {
  server(3000);
});

export default serveCmd;
