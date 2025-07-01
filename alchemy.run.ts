import alchemy from "alchemy";
import {
	D1Database,
	DOStateStore,
	KVNamespace,
	TanStackStart,
} from "alchemy/cloudflare";

const APP_NAME = process.env.APP_NAME ?? "tanstack-start";
const STAGE = process.env.STAGE ?? "dev";

const app = await alchemy(`${APP_NAME}-cloudflare`, {
	stage: STAGE,
	phase: process.argv.includes("--destroy") ? "destroy" : "up",
	stateStore:
		process.env.ALCHEMY_STATE_STORE === "cloudflare"
			? (scope) =>
					new DOStateStore(scope, {
						apiKey: alchemy.secret(process.env.CLOUDFLARE_API_KEY),
						email: process.env.CLOUDFLARE_EMAIL,
						worker: {
							name: `${APP_NAME}-state`,
						},
					})
			: undefined,
});

const defaultKv = await KVNamespace(`${APP_NAME}-${STAGE}-kv`, {
	title: `${APP_NAME}-${STAGE}-kv`,
	adopt: true,
});

const db = await D1Database(`${APP_NAME}-${STAGE}-db`, {
	name: `${APP_NAME}-${STAGE}-db`,
	adopt: true,
	migrationsDir: "src/db/migrations",
	primaryLocationHint: "weur",
	readReplication: {
		mode: "disabled",
	},
});

export const website = await TanStackStart(`${APP_NAME}-${STAGE}-website`, {
	bindings: {
		DEFAULT_KV: defaultKv,
		DB: db,
	},
});

console.log({
	url: website.url,
});

await app.finalize();
