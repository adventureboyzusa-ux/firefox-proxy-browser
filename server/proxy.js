import { URL } from "node:url";

const ALLOWED_PROTOCOLS = new Set(["http:", "https:"]);
const HOP_BY_HOP = new Set(["connection", "keep-alive", "proxy-authenticate", "proxy-authorization", "te", "trailer", "transfer-encoding", "upgrade", "content-length", "content-encoding"]);

function targetFromRequest(req) {
  const raw = req.query.url;
  if (typeof raw !== "string" || raw.length === 0) throw new Error("Missing url");
  const target = new URL(raw);
  if (!ALLOWED_PROTOCOLS.has(target.protocol)) throw new Error("Only HTTP(S) targets are supported");
  return target;
}

function rewriteLocation(value, target) {
  try {
    const absolute = new URL(value, target).toString();
    return `/api/proxy?url=${encodeURIComponent(absolute)}`;
  } catch {
    return value;
  }
}

export async function proxyRequest(req, res) {
  let target;
  try {
    target = targetFromRequest(req);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }

  const proxy = String(req.get("x-proxy") || "ultraviolet");
  const transport = String(req.get("x-transport") || "libcurl");
  try {
    const upstream = await fetch(target, {
      redirect: "manual",
      headers: { "user-agent": "FirefoxProxyBrowser/1.0" }
    });
    res.setHeader("x-proxy-mode", proxy);
    res.setHeader("x-transport-mode", transport);
    res.setHeader("x-proxied-url", target.toString());
    for (const [key, value] of upstream.headers) {
      if (!HOP_BY_HOP.has(key.toLowerCase()) && key.toLowerCase() !== "location") res.setHeader(key, value);
    }
    if (upstream.headers.has("location")) res.setHeader("location", rewriteLocation(upstream.headers.get("location"), target));
    const contentType = upstream.headers.get("content-type") || "";
    const body = await upstream.arrayBuffer();
    if (contentType.includes("text/html")) {
      let html = Buffer.from(body).toString("utf8");
      const base = `<base href="${target.toString().replaceAll('"', "&quot;")}">`;
      html = html.replace(/<head([^>]*)>/i, `<head$1>${base}`);
      html = html.replace(/(href|src|action)=("|')([^"']+)("|')/gi, (match, attr, quote, value) => {
        if (/^(data:|javascript:|#|mailto:|tel:|\/\/)/i.test(value)) return match;
        const absolute = new URL(value, target).toString();
        return `${attr}=${quote}/api/proxy?url=${encodeURIComponent(absolute)}${quote}`;
      });
      return res.status(upstream.status).send(html);
    }
    return res.status(upstream.status).send(Buffer.from(body));
  } catch (error) {
    return res.status(502).json({ error: `Proxy request failed: ${error.message}` });
  }
}
