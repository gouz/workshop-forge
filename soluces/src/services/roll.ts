import { randomBytes } from "node:crypto";
import db from "../utils/db";
const random = (min: number, max: number) => {
  if (min > max) throw new Error("'min' must be less than 'max'");
  const buffer = randomBytes(
    Math.floor((max - min + 1) / Number.MAX_SAFE_INTEGER) + 1,
  );
  let result = min;
  for (const buf of buffer) {
    result += buf;
  }
  return (result % (max - min + 1)) + min;
};

export const rollDice = (numdice: number) => {
  const allowed = [4, 6, 8, 10, 12, 20, 100];
  if (!allowed.includes(numdice)) throw new Error("Invalid dice type");
  return random(1, numdice);
};

export const getStats = (name: string) => {
  const user_id =
    (
      db.query("SELECT id FROM users WHERE name = $name").get({ name }) as {
        id: number;
      }
    )?.id ?? 0;
  const stats = db
    .query(
      `
					SELECT dice, value, COUNT(value) AS count
					FROM rolls
					${name !== "" ? "WHERE user_id = $user_id" : ""}
					GROUP BY dice, value`,
    )
    .all({ user_id }) as { dice: number; value: number; count: number }[];
  return [...stats].reduce(
    (a, { dice, value, count }) => {
      if (!a[dice]) a[dice] = new Array(dice + 1).fill(0);
      a[dice][value] = count;
      return a;
    },
    {} as { [key: number]: number[] },
  );
};
