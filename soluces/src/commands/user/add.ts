import { Clipse } from "clipse";
import db from "../../utils/db";
import chalk from "chalk";

const userAddCmd = new Clipse("add", "user add command");
userAddCmd
  .addArguments([
    { name: "name", description: "name of the user we want to add" },
  ])
  .action((a) => {
    if (typeof a.name !== "undefined") {
      const isPresent =
        db
          .query("SELECT id FROM users WHERE name = $name")
          .get({ name: a.name }) !== null;
      if (isPresent) {
        console.error(`User ${a.name} already exists`);
        process.exit(1);
      }
      const token = Bun.randomUUIDv7();
      db.query("INSERT INTO users (name, token) VALUES ($name, $token)").run({
        name: a.name,
        token,
      });
      console.log(`Token for ${a.name}: ${chalk.bgRed.yellow.bold(token)}`);
      process.exit(0);
    } else {
      console.error("Missing argument <name>");
      process.exit(1);
    }
  });

export default userAddCmd;
