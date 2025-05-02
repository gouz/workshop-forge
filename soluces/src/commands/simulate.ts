import { Clipse } from "clipse";
import db from "../utils/db";
import { MultiBar, Presets } from "cli-progress";
import { rollDice } from "../services/roll";
import { storeRoll } from "../services/user";

const simulateCmd = new Clipse("simulate", "simulate rolls");
simulateCmd.action(async () => {
  const user_id = (
    db
      .query("SELECT id FROM users WHERE name = $name")
      .get({ name: "simulate" }) as { id: number }
  ).id;
  const multibar = new MultiBar(
    {
      clearOnComplete: false,
      hideCursor: true,
      format: " {bar} | {model} | ETA: {eta}s | {value}/{total}",
    },
    Presets.shades_grey,
  );

  const dices = [4, 6, 8, 10, 12, 20, 100];
  const nbRolls = 10;

  const b1 = multibar.create(dices.length, 0);
  const b2 = multibar.create(nbRolls, 0);
  b1.update(0, { model: "dices" });
  for await (const i of dices) {
    b1.increment();
    b2.update(0, { model: `d${i}` });
    const rs = new Array(nbRolls).fill(0);
    for await (const _r of rs) {
      const roll = rollDice(i);
      storeRoll(user_id, i, roll);
      await Bun.sleep(1000);
      b2.increment();
    }
  }
  multibar.stop();
});

export default simulateCmd;
