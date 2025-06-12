import { createServerFn } from "@tanstack/react-start";
import { getWebRequest, setHeader } from "@tanstack/react-start/server";
import { parse, serialize } from "cookie";
import { logMiddleware } from "~/middlewares/logging-middleware";

function getCountFromCookie(cookieHeader: string | null | undefined): number {
	const cookies = parse(cookieHeader || "");
	const raw = cookies.count;
	const parsed = parseInt(raw || "0");

	return Number.isNaN(parsed) ? 0 : parsed;
}

export const getCountCookie = createServerFn({ method: "GET" })
	.middleware([logMiddleware])
	.handler(() => {
		const request = getWebRequest();

		return getCountFromCookie(request.headers.get("cookie"));
	});

export const updateCountCookie = createServerFn({ method: "POST" })
	.middleware([logMiddleware])
	.validator((addBy: number) => addBy)
	.handler(async ({ data }) => {
		const request = getWebRequest();

		const count = await getCountFromCookie(request.headers.get("cookie"));

		setHeader(
			"set-cookie",
			serialize("count", String(count + data), {
				path: "/",
				httpOnly: true,
				maxAge: 60 * 60 * 24 * 30, // 30 days
			}),
		);
	});
