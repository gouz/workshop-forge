#! /usr/bin/env bun
import { Clipse } from "clipse";
import packagejson from "../package.json";
import userCmd from "./commands/user";
import serveCmd from "./commands/serve";

const forge = new Clipse("forge", packagejson.description, packagejson.version);
forge
  .addSubcommands([userCmd, serveCmd])
  .action(() => {
    console.error("missing subcommand");
    process.exit(1);
  })
  .ready();
