import { proxyHttpRequest } from "../../transports/index.js";

export async function ultravioletProxy(req, res, options) {
  return proxyHttpRequest(req, res, options);
}
