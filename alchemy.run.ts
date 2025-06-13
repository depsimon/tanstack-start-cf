import alchemy from "alchemy";
import {
	D1Database,
	DOStateStore,
	KVNamespace,
	TanStackStart,
} from "alchemy/cloudflare";

const BRANCH_PREFIX = process.env.BRANCH_PREFIX ?? "dev";

const appName = "tanstack-start";

const app = await alchemy(`${appName}-cloudflare`, {
	stage: BRANCH_PREFIX,
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

const defaultKv = await KVNamespace(`${appName}-${BRANCH_PREFIX}-kv`, {
	title: `${appName}-${BRANCH_PREFIX}-kv`,
	adopt: true,
});

const db = await D1Database(`${appName}-${BRANCH_PREFIX}-db`, {
	name: `${appName}-${BRANCH_PREFIX}-db`,
	adopt: true,
	migrationsDir: "src/db/migrations",
	primaryLocationHint: "weur",
	readReplication: {
		mode: "disabled",
	},
});

export const website = await TanStackStart(
	`${appName}-${BRANCH_PREFIX}-website`,
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
