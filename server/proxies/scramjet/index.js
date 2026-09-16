import { proxyHttpRequest } from "../../transports/index.js";

export async function scramjetProxy(req, res, options) {
  return proxyHttpRequest(req, res, options);
}
