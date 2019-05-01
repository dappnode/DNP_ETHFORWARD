const multihash = require("multihashes");

/**
 * Used in the CONTENT_INTERFACE_ID = "0xd8389dc5";
 *
 * @param {string} contenthash
 * @returns {string|null} content
 */
function decodeContent(contentEncoded) {
  if (contentEncoded === "0x" || parseInt(contentEncoded) === 0) return;

  const hex = contentEncoded.substring(2);
  const buf = multihash.fromHexString(hex);
  return "/ipfs/" + multihash.toB58String(multihash.encode(buf, "sha2-256"));
}

module.exports = decodeContent;
