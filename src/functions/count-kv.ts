import { env } from "cloudflare:workers";
import { createServerFn } from "@tanstack/react-start";
import { logMiddleware } from "~/middlewares/logging-middleware";

const COUNT_KEY = "count";

async function getCountFromKv(): Promise<number> {
	const raw = await env.DEFAULT_KV.get(COUNT_KEY);
	const parsed = parseInt(raw || "0");

	return Number.isNaN(parsed) ? 0 : parsed;
}

export const getCountKv = createServerFn({ method: "GET" })
	.middleware([logMiddleware])
	.handler(() => {
		return getCountFromKv();
	});

export const updateCountKv = createServerFn({ method: "POST" })
	.middleware([logMiddleware])
	.validator((addBy: number) => addBy)
	.handler(async ({ data }) => {
		const count = await getCountFromKv();

		await env.DEFAULT_KV.put(COUNT_KEY, (count + data).toString());
	});
