# Proxy/server layout

- `public/worker.js`: service worker for same-origin shell caching. It intentionally does not intercept arbitrary third-party pages.
- `server/proxies/ultraviolet`: Ultraviolet adapter boundary.
- `server/proxies/scramjet`: Scramjet adapter boundary.
- `server/transports/libcurl`: libcurl transport boundary.
- `server/transports/wisp`: Wisp transport boundary.
- `server/transports/epoxy-tls`: Epoxy TLS transport boundary.
- `server/servers/wisp`: websocket server endpoint at `/wisp`.

The HTTP fallback uses Node `fetch` so the project remains runnable while the version-specific runtime APIs are wired in. Proxying is restricted to HTTP(S) URLs and should only be used for destinations you are authorized to access. The selected proxy and transport are passed through the proxy URL and response headers.
