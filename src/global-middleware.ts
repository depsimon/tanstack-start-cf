import { registerGlobalMiddleware } from "@tanstack/react-start";
import { logMiddleware } from "~/middlewares/logging-middleware";

registerGlobalMiddleware({
	middleware: [logMiddleware],
});
