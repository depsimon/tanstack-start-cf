import alchemy from "alchemy";
import {
	D1Database,
	DOStateStore,
	KVNamespace,
	TanStackStart,
} from "alchemy/cloudflare";

const STAGE = process.env.STAGE ?? "dev";

const appName = "tanstack-start";

const app = await alchemy(`${appName}-cloudflare`, {
	stage: STAGE,
	phase: process.argv.includes("--destroy") ? "destroy" : "up",
	stateStore:
		process.env.ALCHEMY_STATE_STORE === "cloudflare"
			? (scope) =>
					new DOStateStore(scope, {
						apiKey: alchemy.secret(process.env.CLOUDFLARE_API_KEY),
						email: process.env.CLOUDFLARE_EMAIL,
						worker: {
							name: `${appName}-state`,
						},
					})
			: undefined,
});

const defaultKv = await KVNamespace(`${appName}-${STAGE}-kv`, {
	title: `${appName}-${STAGE}-kv`,
	adopt: true,
});

const db = await D1Database(`${appName}-${STAGE}-db`, {
	name: `${appName}-${STAGE}-db`,
	adopt: true,
	migrationsDir: "src/db/migrations",
	primaryLocationHint: "weur",
	readReplication: {
		mode: "disabled",
	},
});

export const website = await TanStackStart(`${appName}-${STAGE}-website`, {
	bindings: {
		DEFAULT_KV: defaultKv,
		DB: db,
	},
});

console.log({
	url: website.url,
});

await app.finalize();
