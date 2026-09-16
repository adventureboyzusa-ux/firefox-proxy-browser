export async function wispTransport(target, options) {
  // HTTP fallback keeps local development working; Wisp websocket wiring lives in servers/wisp.
  return fetch(target, options);
}
