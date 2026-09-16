import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { proxyRequest } from "./proxy.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = Number(process.env.PORT || 3001);

app.use(express.json());
app.get("/api/config", (_req, res) => {
  res.json({
    proxies: ["ultraviolet", "scramjet"],
    transports: ["libcurl", "wisp", "epoxy-tls"],
    note: "Select a supported backend in Settings. The server keeps the selected mode in the request header."
  });
});

app.get("/api/proxy", proxyRequest);
app.use(express.static(path.join(__dirname, "../dist")));
app.get("*", (_req, res) => res.sendFile(path.join(__dirname, "../dist/index.html")));

app.listen(port, () => console.log(`browser server listening on http://localhost:${port}`));
