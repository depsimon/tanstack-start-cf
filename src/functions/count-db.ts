import { env } from "cloudflare:workers";
import { createServerFn } from "@tanstack/react-start";
import { logMiddleware } from "~/middlewares/logging-middleware";

const COUNT_KEY = "primary";

async function getCountFromDb(): Promise<number> {
	const result = await env.DB.prepare("SELECT value FROM counts WHERE key = ?")
		.bind(COUNT_KEY)
		.first();

	return result ? Number(result.value) : 0;
}

export const getCountDb = createServerFn({ method: "GET" })
	.middleware([logMiddleware])
	.handler(() => {
		return getCountFromDb();
	});

export const updateCountDb = createServerFn({ method: "POST" })
	.middleware([logMiddleware])
	.validator((addBy: number) => addBy)
	.handler(async ({ data }) => {
		const count = await getCountFromDb();

		await env.DB.prepare("UPDATE counts SET value = ? WHERE key = ?")
			.bind(count + data, COUNT_KEY)
			.run();
	});
