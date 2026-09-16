export async function epoxyTransport(target, options) {
  // Epoxy TLS is selected here so deployments can provide its TLS-capable fetch implementation.
  return fetch(target, options);
}
