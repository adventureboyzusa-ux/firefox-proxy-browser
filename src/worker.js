export async function registerWorker() {
  if ("serviceWorker" in navigator) {
    try { return await navigator.serviceWorker.register("/worker.js", { scope: "/" }); }
    catch (error) { console.warn("Service worker unavailable:", error); }
  }
}
