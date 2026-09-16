import { WebSocketServer } from "ws";

export function startWispServer(server) {
  const wss = new WebSocketServer({ server, path: "/wisp" });
  wss.on("connection", (socket) => socket.close(1000, "Wisp transport endpoint ready"));
  return wss;
}
