const CID = require("cids");
const multihash = require("multihashes");
const multicodec = require("multicodec");

/**
 * Used in the CONTENTHASH_INTERFACE_ID = "0xbc1c58d1"
 *
 * @param {string} contenthash
 * @returns {string|null} content
 */
function decodeContentHash(contenthash) {
  if (!contenthash) throw Error("contenthash must be defined");
  if (typeof contenthash !== "string")
    throw Error("contenthash must be a string");

  if (contenthash === "0x") return null;

  const contentHashEncoded = Buffer.from(contenthash.slice(2), "hex");
  const contentCodec = multicodec.getCodec(contentHashEncoded);

  if (contentCodec.startsWith("ipfs")) {
    const value = multicodec.rmPrefix(contentHashEncoded);
    const cid = new CID(value);
    return "/ipfs/" + multihash.toB58String(cid.multihash);
  } else {
    console.log(`Unsupported codec: ${contenthash}`);
    return null;
  }
}

module.exports = decodeContentHash;
