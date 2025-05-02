import { Database } from "bun:sqlite";

const initDB = () => {
  const db = new Database(`${process.cwd()}/forge.db`, {
    create: true,
    strict: true,
  });

  db.run(`
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    token TEXT NOT NULL UNIQUE
)
    `);

  db.run(`
		CREATE TABLE IF NOT EXISTS rolls (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			user_id INTEGER NOT NULL,
			dice INTEGER NOT NULL,
			value INTEGER NOT NULL,
			FOREIGN KEY(user_id) REFERENCES users(id)
		)
	`);

  return db;
};

const db = initDB();
export default db;
