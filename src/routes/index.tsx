import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { getCountCookie, updateCountCookie } from "~/functions/count-cookie";
import { getCountDb, updateCountDb } from "~/functions/count-db";
import { getCountKv, updateCountKv } from "~/functions/count-kv";

export const Route = createFileRoute("/")({
	component: Home,
	loader: async () => {
		const [countCookie, countDb, countKv] = await Promise.all([
			getCountCookie(),
			getCountDb(),
			getCountKv(),
		]);

		return {
			countCookie,
			countDb,
			countKv,
		};
	},
});

function Home() {
	const router = useRouter();
	const { countCookie, countDb, countKv } = Route.useLoaderData();

	return (
		<div className="flex items-center gap-4">
			<button
				type="button"
				onClick={() => {
					updateCountCookie({ data: 1 }).then(() => {
						toast.success("Count updated with success!");
						router.invalidate();
					});
				}}
			>
				Add 1 to {countCookie}? (Cookies)
			</button>
			<button
				type="button"
				onClick={() => {
					updateCountKv({ data: 1 }).then(() => {
						toast.success("Count updated with success!");
						router.invalidate();
					});
				}}
			>
				Add 1 to {countKv}? (KV)
			</button>
			<button
				type="button"
				onClick={() => {
					updateCountDb({ data: 1 }).then(() => {
						toast.success("Count updated with success!");
						router.invalidate();
					});
				}}
			>
				Add 1 to {countDb}? (DB)
			</button>
			|<Link to="/about">ℹ About</Link>
		</div>
	);
}
