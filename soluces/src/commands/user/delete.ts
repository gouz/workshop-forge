import { Clipse } from "clipse";
import { confirm, select } from "@inquirer/prompts";
import db from "../../utils/db";
import chalk from "chalk";

const userDeleteCmd = new Clipse("delete", "delete a user");
userDeleteCmd
  .addArguments([{ name: "user", description: "user name to delete" }])
  .action(async (a) => {
    let user = "";
    if (typeof a.user === "undefined") {
      const users = db.query("SELECT name FROM users ORDER BY name").all() as {
        name: string;
      }[];
      user = await select({
        message: "Select a user to delete",
        choices: users.map((u) => ({ name: u.name, value: u.name })),
      });
    } else user = a.user;
    const sure = await confirm({
      message: `Are you sure you want to delete user ${user}?`,
      default: false,
    });
    if (sure) {
      db.query("DELETE FROM users WHERE name = $name").run({ name: user });
      console.log(`User ${chalk.bold.red(user)} deleted`);
    }
    process.exit(0);
  });

export default userDeleteCmd;
