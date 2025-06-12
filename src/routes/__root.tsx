/// <reference types="vite/client" />
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
	createRootRouteWithContext,
	HeadContent,
	Outlet,
	Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import type * as React from "react";
import { Toaster } from "~/components/ui/sonner";
import type { AppContext } from "~/router";
import stylesheetUrl from "~/styles/app.css?url";

export const Route = createRootRouteWithContext<AppContext>()({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "TanStack Start Starter",
			},
		],
		links: [
			{ rel: "stylesheet", href: stylesheetUrl },
			{ rel: "preconnect", href: "https://rsms.me/" },
			{ rel: "stylesheet", href: "https://rsms.me/inter/inter.css" },
		],
	}),
	component: RootComponent,
});

function RootComponent() {
	return (
		<RootDocument>
			<Outlet />
			<TanStackRouterDevtools position="bottom-right" />
			<ReactQueryDevtools buttonPosition="bottom-left" />
			<Toaster />
		</RootDocument>
	);
}

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				{children}
				<Scripts />
			</body>
		</html>
	);
}
