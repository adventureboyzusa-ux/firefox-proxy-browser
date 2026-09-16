export async function libcurlTransport(target, options) {
  // The libcurl package can replace this adapter when native transport is enabled.
  return fetch(target, options);
}
