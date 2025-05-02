import { Clipse } from "clipse";
import userAddCmd from "./user/add";
import userDeleteCmd from "./user/delete";
import userListCmd from "./user/list";

const userCmd = new Clipse("user", "user management");
userCmd.addSubcommands([userAddCmd, userDeleteCmd, userListCmd]).action(() => {
  console.error("Missing subcommand");
  process.exit(1);
});

export default userCmd;
