import { libcurlTransport } from "./libcurl/index.js";
import { wispTransport } from "./wisp/index.js";
import { epoxyTransport } from "./epoxy-tls/index.js";

const transports = { libcurl: libcurlTransport, wisp: wispTransport, "epoxy-tls": epoxyTransport, epoxy: epoxyTransport };

export function selectedTransport(name) {
  return transports[name] || transports.libcurl;
}

export async function fetchWithTransport(target, options, name) {
  return selectedTransport(name)(target, options);
}

export async function proxyHttpRequest(req, res, { proxyName, transportName }) {
  const raw = req.query.url;
  let target;
  try {
    target = new URL(String(raw));
    if (!["http:", "https:"].includes(target.protocol)) throw new Error("Only HTTP(S) destinations are supported");
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }

  try {
    const upstream = await fetchWithTransport(target, { redirect: "manual", headers: { "user-agent": "FirefoxProxyBrowser/1.0" } }, transportName);
    res.setHeader("x-proxy-mode", proxyName);
    res.setHeader("x-transport-mode", transportName);
    res.setHeader("x-proxied-url", target.toString());
    for (const [key, value] of upstream.headers) {
      if (!["connection", "content-length", "content-encoding", "transfer-encoding", "location"].includes(key.toLowerCase())) res.setHeader(key, value);
    }
    if (upstream.headers.has("location")) {
      const location = new URL(upstream.headers.get("location"), target).toString();
      res.setHeader("location", `/api/proxy?proxy=${proxyName}&transport=${transportName}&url=${encodeURIComponent(location)}`);
    }
    const contentType = upstream.headers.get("content-type") || "";
    const body = Buffer.from(await upstream.arrayBuffer());
    if (!contentType.includes("text/html")) return res.status(upstream.status).send(body);

    let html = body.toString("utf8");
    html = html.replace(/<head([^>]*)>/i, `<head$1><base href="${target.toString().replaceAll('"', "&quot;")}">`);
    html = html.replace(/(href|src|action)=("|')([^"']+)("|')/gi, (match, attribute, quote, value) => {
      if (/^(data:|javascript:|#|mailto:|tel:|https?:\/\/)/i.test(value)) {
        if (/^https?:\/\//i.test(value)) return `${attribute}=${quote}/api/proxy?proxy=${proxyName}&transport=${transportName}&url=${encodeURIComponent(value)}${quote}`;
        return match;
      }
      const absolute = new URL(value, target).toString();
      return `${attribute}=${quote}/api/proxy?proxy=${proxyName}&transport=${transportName}&url=${encodeURIComponent(absolute)}${quote}`;
    });
    return res.status(upstream.status).send(html);
  } catch (error) {
    return res.status(502).json({ error: `Proxy request failed: ${error.message}` });
  }
}
