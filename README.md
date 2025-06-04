# Forger votre application CLI en 2h avec Bun

Workshop pour DevQuest

## Que va faire notre application ?

- Gestion de Personnages Joueurs
- Servir une page web pour que les PJs lancent les dés
- Avoir les lancers de dés d'un PJ
- Faire des statistiques

## Installation

1. Avoir Bun sur sa machine :

```
curl -fsSL https://bun.sh/install | bash
```

```
powershell -c "irm bun.sh/install.ps1 | iex"
```

2. Cloner ce dépôt

## Initialisation

```
bun init
```

On choisit: "Blank"

## Installation Dépendances

```
bun install clipse chalk @inquirer/prompts
```

- https://www.npmjs.com/package/clipse
- https://www.npmjs.com/package/chalk
- https://www.npmjs.com/package/@inquirer/prompts

## Modifier package.json

```
{
  "name": "forge",
  "module": "src/index.ts",
  "description": "gestion de lancer de dés",
  "version": "0.0.1",
  "type": "module",
  ...
  "bin": {
    "forge": "./src/index.ts"
  },
  "scripts": {
      "forge": "bun src/index.ts"
  }
}
```

## Notre première commande

```js
import { Clipse } from "clipse";
import chalk from "chalk";
import packagejson from "../package.json";

const forge = new Clipse("forge", packagejson.description, packagejson.version);
forge
  .action(() => {
    console.log(chalk.bold.green("ezpz"));
  })
  .ready();
```

## Les options

```js
import { Clipse } from "clipse";
import packagejson from "../package.json";
import chalk from "chalk";

const forge = new Clipse("forge", packagejson.description, packagejson.version);
forge
  .addOptions({ test: { type: "string", default: "plop" } })
  .action((_, opts) => {
    console.log(chalk.bold.green(opts.test));
  })
  .ready();
```

## utils/db.ts

```js
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
	return db;
};
const db = initDB();
export default db;
```

## Database

```js
const user = db
  .query("SELECT name FROM users WHERE token = $token")
  .get({ token: args.token ?? "" }) as { name: string };
```

```js
const users = db.query("SELECT name FROM users").all() as {
  name: string;
}[];
```

## Premières commandes : user

```
forge user add <name>: store in db and display token
forge user delete: select name + confirm
forge user list: list of users
```

## C'est à vous !

```
> bun forge user list

┌───┬────┬──────┬───────┐
│   │ id │ name │ token │
├───┼────┼──────┼───────┤
│ 0 │ 1  │ gouz │ test  │
└───┴────┴──────┴───────┘
```

## Bun : un serveur web ?

```js
import loginHTML from "../view/login.html";
import dashboardHTML from "../view/dashboard.html";
import db from "./db";

export default (port: number) => {
  Bun.serve({
    port,
    routes: {
      "/": loginHTML,
      "/login": {
        GET: () => Response.redirect("/"),
        POST: async (req: Bun.BunRequest) => {
          const token = ((await req.formData()).get("token") as string) ?? "";
          if (token !== "") return Response.redirect("/dashboard");
          return Response.redirect("/");
        },
      },
      "/dashboard": dashboardHTML,
    },
    fetch() {
      return new Response("404!", { status: 404 });
    },
  });
};

```

## C'est à vous !

Le port du serveur doit être définissable par une option, avec par défaut la valeur 3000.

## On joue un peu à lancer des dés

Lancer le serveur, connectez vous à un user et lancer les dés !

## Bon, la partie de JdR est terminée

On veut voir un peu les statistiques des lancers

```
> bun forge rolls -u gouz

┌────┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬────┬────┬────┬────┬────┬────┬────┬────┬────┬────┬────┐
│    │ 0 │ 1 │ 2 │ 3 │ 4 │ 5 │ 6 │ 7 │ 8 │ 9 │ 10 │ 11 │ 12 │ 13 │ 14 │ 15 │ 16 │ 17 │ 18 │ 19 │ 20 │
├────┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┤
│  8 │ 0 │ 1 │ 0 │ 1 │ 0 │ 2 │ 3 │ 0 │ 2 │   │    │    │    │    │    │    │    │    │    │    │    │
│ 20 │ 0 │ 0 │ 1 │ 0 │ 0 │ 2 │ 1 │ 1 │ 0 │ 0 │ 1  │ 0  │ 0  │ 0  │ 0  │ 0  │ 0  │ 0  │ 0  │ 1  │ 1  │
└────┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴────┴────┴────┴────┴────┴────┴────┴────┴────┴────┴────┘
```

## C'est à vous !

## Un graphique c'est plus joli non ?

```
bun add asciichart @types/asciichart
```

```js
import { plot } from "asciichart";
console.log(plot(values, { height: Math.max(...values), min: 0 }));
```

## C'est à vous !

On ajoute une option pour faire ça :

```
> bun forge rolls --render asciichart

       3.00 ┼     ╭╮
       2.00 ┤    ╭╯│╭
       1.00 ┤╭╮╭╮│ ││
       0.00 ┼╯╰╯╰╯ ╰╯
```

## Une barre de progression

https://github.com/npkgz/cli-progress

```
██████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ | dices | ETA: 1s | 1/7
███░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ | d4 | ETA: 134s | 7922/100000
```

## Step 1

```
bun add cli-progress @types/cli-progress
```

## Step 2

```
bun forge user add simulate
```

## Step 3

On crée une commande simulate dont l'action est composée de :

```js
const multibar = new MultiBar(
  {
    clearOnComplete: false,
    hideCursor: true,
    format: " {bar} | {model} | ETA: {eta}s | {value}/{total}",
  },
  Presets.shades_grey,
);
const dices = [4, 6, 8, 10, 12, 20, 100];
const b1 = multibar.create(dices.length, 0);
const b2 = multibar.create(10, 0);
b1.update(0, { model: "dices" });
for await (const i of dices) {
  b1.increment();
  b2.update(0, { model: `d${i}` });
  const rs = new Array(10).fill(0);
  for await (const _r of rs) {
	const roll = rollDice(i);
	storeRoll(user_id, i, roll);
	await Bun.sleep(1000);
	b2.increment();
  }
}
multibar.stop();
```

## Builder

```
bun build ./src/index.ts --outfile forge --compile
```

## Cross-compile

https://bun.sh/docs/bundler/executables#cross-compile-to-other-platforms

## Bunfig.toml

### Bunfig.toml > Telemetry

> Bun records bundle timings (so we can answer with data, "is Bun getting faster?") and feature usage (e.g., "are people actually using macros?").

```
telemetry = false
```

### Bunfig.toml > Tests

```
[test]
coverage = true
coverageThreshold = 0.9
coverageReporter = ["text", "lcov"]
```

## Tests

```js
import { describe, it, expect } from "bun:test";
import { rollDice } from "./roll";

describe("We want to test the 'roll' service", () => {
  it("should roll a dice", () => {
    const roll = rollDice(6);
    expect(roll).toBeGreaterThanOrEqual(1);
    expect(roll).toBeLessThanOrEqual(6);
  });
});
```

## On essaye ?

Ecrivez des tests ;)

## Merci à vous
