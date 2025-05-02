import loginHTML from "../view/login.html";
import dashboardHTML from "../view/dashboard.html";
import db from "./db";
import type { BunRequest } from "bun";
import { getRolls, storeRoll } from "../services/user";
import { rollDice } from "../services/roll";

export default (port: number) => {
  Bun.serve({
    port,
    routes: {
      "/": loginHTML,
      "/login": {
        GET: () => Response.redirect("/"),
        POST: async (req: Bun.BunRequest) => {
          const token = ((await req.formData()).get("token") as string) ?? "";
          if (token !== "") {
            const user = db
              .query("SELECT id, name FROM users WHERE token = $token")
              .get({ token }) as { id: number; name: string };
            if (user) {
              return new Response(null, {
                status: 301,
                headers: {
                  Location: "/dashboard",
                  "Set-Cookie": `user=${JSON.stringify({
                    ...user,
                    token,
                  })}; Path=/;`,
                },
              });
            }
          }
          return Response.redirect("/");
        },
      },
      "/dashboard": dashboardHTML,
      "/api/user/:id/rolls": {
        GET: (req: BunRequest) => {
          const { id } = req.params as { id: string };
          const rolls = getRolls(Number(id));
          return Response.json({ rolls });
        },
        POST: async (req: BunRequest) => {
          const { id } = req.params as { id: string };
          const { dice, value } = (await req.json()) as {
            dice: number;
            value: number;
          };
          storeRoll(Number(id), dice, value);
          return new Response("Roll stored", { status: 201 });
        },
      },
      "/api/roll/:dice": (req: BunRequest) => {
        const { dice } = req.params as { dice: string };
        return Response.json(rollDice(Number(dice)));
      },
    },
    fetch() {
      return new Response("404!", { status: 404 });
    },
  });
  console.log(`Server is available on http://localhost:${port}`);
};
