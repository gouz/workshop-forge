import { Clipse } from "clipse";
import db from "../../utils/db";

const userListCmd = new Clipse("list", "list users");
userListCmd.action(() => {
  // @TODO
  process.exit(0);
});

export default userListCmd;
