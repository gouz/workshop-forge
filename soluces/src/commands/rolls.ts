import { Clipse } from "clipse";
import { plot } from "asciichart";
import { getStats } from "../services/roll";

const rollsCmd = new Clipse("rolls", "roll management");
rollsCmd
  .addOptions({
    user: {
      short: "u",
      optional: true,
      type: "string",
      description: "a user name if we want to fetch it only",
    },
    render: {
      type: "string",
      description: "type of rendering (table, asciichart or image)",
      default: "table",
    },
  })
  .action((_, o) => {
    const stats = getStats((o.user as string) ?? "");
    if (o.render === "table") console.table(stats);
    if (o.render === "asciichart") {
      Object.entries(stats).forEach(([dice, values], _) => {
        console.log(`Dice: ${dice}`, values);
        console.log(plot(values, { height: Math.max(...values), min: 0 }));
      });
    }
    process.exit(0);
  });

export default rollsCmd;
