import { Clipse } from "clipse";
import db from "../../utils/db";

const userListCmd = new Clipse("list", "list users");
userListCmd.action(() => {
  const users = db.query("SELECT * FROM users").all();
  console.table(users);
  process.exit(0);
});

export default userListCmd;
