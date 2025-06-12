import {
	MutationCache,
	notifyManager,
	QueryCache,
	QueryClient,
} from "@tanstack/react-query";
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { routerWithQueryClient } from "@tanstack/react-router-with-query";
import { toast } from "sonner";
import { routeTree } from "~/routeTree.gen";

export interface AppContext {
	queryClient: QueryClient;
}

export function createRouter() {
	if (typeof document !== "undefined") {
		notifyManager.setScheduler(window.requestAnimationFrame);
	}

	const queryClient: QueryClient = new QueryClient({
		defaultOptions: {
			queries: {
				refetchOnReconnect: () => !queryClient.isMutating(),
				staleTime: 60_000,
			},
		},
		mutationCache: new MutationCache({
			onError: (error) => {
				if ("message" in error) {
					toast.error(error.message);
				}
			},
			onSettled: () => {
				if (queryClient.isMutating() === 1) {
					return queryClient.invalidateQueries();
				}
			},
		}),
		queryCache: new QueryCache({
			onError: (error) => {
				toast.error(error.message, {
					action: {
						label: "Retry",
						onClick: () => {
							queryClient.invalidateQueries();
						},
					},
				});
			},
		}),
	});

	const router = routerWithQueryClient(
		createTanStackRouter({
			routeTree,
			context: { queryClient },
			scrollRestoration: true,
		}),
		queryClient,
	);

	return router;
}

declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof createRouter>;
	}
}
