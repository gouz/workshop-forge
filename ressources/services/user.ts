import db from "../utils/db";

export const getRolls = (user_id: number) =>
  [
    ...(db
      .query("SELECT dice, value FROM rolls WHERE user_id = $user_id")
      .all({ user_id }) as { dice: number; value: number }[]),
  ].reduce(
    (a, { dice, value }) => {
      if (!a[dice]) a[dice] = [];
      a[dice].push(value);
      return a;
    },
    {} as { [key: number]: number[] },
  );

export const storeRoll = (user_id: number, dice: number, value: number) => {
  db.query(
    "INSERT INTO rolls (user_id, dice, value) VALUES ($user_id, $dice, $value)",
  ).run({ user_id, dice, value });
};
