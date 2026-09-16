# Firefox Proxy Browser

Firefox-inspired browser UI with a dark, rounded Firefox-like chrome, white borders/high-contrast text, and a proxy-powered home page that loads websites through a local `/api/proxy` layer.

This project is designed to look like a Firefox clone and behave like a lightweight proxied browser shell. It is meant as a local browser prototype for experimenting with web-proxy routing and transport switching.

## What it does

- Renders a Firefox-like browser window with a white border and white text
- Uses Simple Icons from jsDelivr for the UI icons
- Lets you type a URL and load it through a local proxy endpoint
- Uses `/api/proxy?url=...` to fetch pages through the backend
- Includes a settings panel for switching the proxy and transport mode
- Shows a home page similar to the reference design with a clock, search box, and shortcut buttons

## Local setup

1. Install Node.js 18+.
2. Open the project folder.
3. Install dependencies:

```bash
npm install
```

4. Start the app:

```bash
npm run dev
```

5. Open the browser:

```text
http://localhost:5173
```

## Project layout

- `src/App.jsx` - browser UI and home page
- `src/styles.css` - Firefox-inspired styling with white borders and white text
- `server/index.js` - Express server entry point
- `server/proxies/` - proxy adapters
- `server/transports/` - transport adapters
- `server/servers/wisp/` - Wisp WebSocket server setup
- `public/worker.js` - service worker for shell caching

## Supported proxy / transport modes

The settings panel includes:

- Proxy: `ultraviolet`, `scramjet`
- Transport: `libcurl`, `wisp`, `epoxy-tls`

These are exposed via the proxy route and request headers so the app can route requests through different proxy/transport implementations.

## About the websites

The homepage is built around a set of commonly used websites, including:

- YouTube
- GitHub
- Discord
- X/Twitter
- Netflix
- Twitch

These appear as quick-access shortcuts in the home page and can be opened in the browser shell. The browser is intended as a front-end prototype, not a full production browser engine.

## Notes

- The app uses a local proxy endpoint for web access and rewriting.
- Only HTTP and HTTPS URLs are supported.
- Do not expose this app publicly without access restrictions and proper deployment controls.
- The project is designed for local development and learning, not as a full unrestricted internet browser.
