const multihash = require("multihashes");

/**
 * Used in the CONTENT_INTERFACE_ID = "0xd8389dc5";
 *
 * @param {string} contenthash
 * @returns {string|null} content
 */
function decodeContent(contentEncoded) {
  if (!contentEncoded) throw Error("contentEncoded must be defined");
  if (typeof contentEncoded !== "string")
    throw Error("contentEncoded must be a string");

  if (contentEncoded === "0x" || parseInt(contentEncoded) === 0) return;

  // It is assumed that all the pages that use content instead of contenthash are from swarm
  return "/bzz:/" + contentEncoded.substring(2);
}

module.exports = decodeContent;