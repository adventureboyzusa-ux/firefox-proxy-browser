# Firefox Proxy Browser

A dark, Firefox-inspired browser shell with a Yuki/Interstellar-style home page, Simple Icons loaded from jsDelivr, and a settings panel for selecting a proxy and transport.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

## Proxy behavior

Entering a URL sends it through the local `/api/proxy?url=...` endpoint. The address bar shows the local proxied URL while the `x-proxied-url` response header retains the original destination. HTML links and redirects are rewritten to stay inside the proxy endpoint.

The backend exposes the selected proxy and transport as request metadata. The MercuryWorkshop and Ultraviolet repositories are declared as dependencies so a deployment can replace the lightweight fetch/rewrite adapter with the matching runtime integration for its chosen versions.

Only HTTP and HTTPS destinations are accepted. Use this project only for sites and networks you are authorized to access; it does not guarantee access to content blocked by an administrator, provider, or applicable law.
