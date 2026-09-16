import { ultravioletProxy } from "./ultraviolet/index.js";
import { scramjetProxy } from "./scramjet/index.js";

const adapters = { ultraviolet: ultravioletProxy, scramjet: scramjetProxy };

export function createProxyHandler() {
  return async (req, res) => {
    const proxyName = String(req.query.proxy || req.get("x-proxy") || "ultraviolet").toLowerCase();
    const transportName = String(req.query.transport || req.get("x-transport") || "libcurl").toLowerCase();
    const adapter = adapters[proxyName] || adapters.ultraviolet;
    return adapter(req, res, { proxyName, transportName });
  };
}
