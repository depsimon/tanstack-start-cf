import alchemy from "alchemy";
import { D1Database, KVNamespace, TanStackStart } from "alchemy/cloudflare";

const BRANCH_PREFIX = process.env.BRANCH_PREFIX ?? "dev";

const appName = "tanstack-start";

const app = await alchemy("tanstack-start-cloudflare", {
	stage: process.env.USER ?? "dev",
	phase: process.argv.includes("--destroy") ? "destroy" : "up",
});

const defaultKv = await KVNamespace(`${appName}-${BRANCH_PREFIX}-kv`, {
	title: `${appName}-${BRANCH_PREFIX}-kv`,
	adopt: true,
});

const db = await D1Database(`${appName}-${BRANCH_PREFIX}-db`, {
	name: `${appName}-${BRANCH_PREFIX}-kv`,
	adopt: true,
	migrationsDir: "src/db/migrations",
	primaryLocationHint: "weur",
	readReplication: {
		mode: "disabled",
	},
});

export const website = await TanStackStart(
	`tanstack-start-website-${BRANCH_PREFIX}`,
	{
		bindings: {
			DEFAULT_KV: defaultKv,
			DB: db,
		},
	},
);

console.log({
	url: website.url,
});

await app.finalize();
