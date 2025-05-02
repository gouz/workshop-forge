import { Clipse } from "clipse";
import packagejson from "../package.json";
import userCmd from "./commands/user";
import serveCmd from "./commands/serve";
import rollsCmd from "./commands/rolls";
import simulateCmd from "./commands/simulate";

const forge = new Clipse("forge", packagejson.description, packagejson.version);
forge
  .addSubcommands([userCmd, serveCmd, rollsCmd, simulateCmd])
  .action(() => {
    console.error("missing subcommand");
    process.exit(1);
  })
  .ready();
