import { createProxyHandler } from "./proxies/router.js";

export function registerProxyRoutes(app) {
  app.get("/api/proxy", createProxyHandler());
}
