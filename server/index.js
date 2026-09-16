import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import http from "node:http";
import { registerProxyRoutes } from "./proxies/index.js";
import { startWispServer } from "./servers/wisp/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = Number(process.env.PORT || 3001);
app.use(express.json());
app.get("/api/config", (_req, res) => res.json({ proxies: ["ultraviolet", "scramjet"], transports: ["libcurl", "wisp", "epoxy-tls"] }));
registerProxyRoutes(app);
app.use(express.static(path.join(__dirname, "../dist")));
app.get("*", (_req, res) => res.sendFile(path.join(__dirname, "../dist/index.html")));
const server = http.createServer(app);
startWispServer(server);
server.listen(port, () => console.log(`browser server listening on http://localhost:${port}`));
