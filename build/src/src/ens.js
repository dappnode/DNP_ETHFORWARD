const Web3 = require("web3");
const decodeContent = require("./utils/decodeContent");
const decodeContentHash = require("./utils/decodeContentHash");
const computeNode = require("./utils/computeNode");

/**
 * ENS parameters
 * Last updated January 2019
 */
const ensAddr = "0x314159265dd8dbb310642f98f50c066173c1259b";
const ensAbi = require("./abi/ens.json");
const resolverAbi = require("./abi/resolverAbi.json");

const WEB3HOSTWS =
  process.env.WEB3HOSTWS || "http://my.ethchain.dnp.dappnode.eth:8545";

const TEXT_INTERFACE_ID = "0x59d1d43c";
const CONTENTHASH_INTERFACE_ID = "0xbc1c58d1";
const CONTENT_INTERFACE_ID = "0xd8389dc5";
const interfaces = [
  TEXT_INTERFACE_ID,
  CONTENTHASH_INTERFACE_ID,
  CONTENT_INTERFACE_ID
];

const web3 = new Web3(WEB3HOSTWS);
console.log("Connected web3 to " + WEB3HOSTWS);

// Cache ENS contract instance
const ens = new web3.eth.Contract(ensAbi, ensAddr);

/**
 * Resolves a request for an ENS domain iterating over various methods
 *
 * @param {string} name
 * @returns {string} content
 * - "0x"
 * - "0x404"
 * - "/ipfs/Qm..."
 */
async function getContent(name) {
  console.log("Requested: " + name);

  try {
    if (!(await isListening())) throw Error("Network is not listening");

    const node = computeNode(name);
    const resolverAddress = await ens.methods.resolver(node).call();
    if (parseInt(resolverAddress) === 0) return "0x404";

    const resolver = new web3.eth.Contract(resolverAbi, resolverAddress);
    const interfacesAvailable = await getInterfacesAvailable(resolver);

    /**
     * `contentHash` method
     */
    if (interfacesAvailable[CONTENTHASH_INTERFACE_ID]) {
      const contentHashEncoded = await resolver.methods
        .contenthash(node)
        .call();
      const content = decodeContentHash(contentHashEncoded);
      if (content) return content;
    }

    /**
     * `text` method
     * This method is deprecated, but it is preserved for compatibility
     */
    if (interfacesAvailable[TEXT_INTERFACE_ID]) {
      const content = await resolver.methods.text(node, "dnslink").call();
      if ((content || "").startsWith("/ipfs/")) return content;
    }

    /**
     * `content` method
     */
    if (interfacesAvailable[CONTENT_INTERFACE_ID]) {
      const contentEncoded = await resolver.methods.content(node).call();
      const content = decodeContent(contentEncoded);
      if (content) return content;
    }

    return "0x404";
  } catch (e) {
    console.log(e.message);
    return "0x";
  }
}

// Utils

/**
 * Iterates over various interfaces to check if they are available
 *
 * @param {object} resolver Web3 contract instance
 * @returns {object} interfacesAvailable = {
 *   TEXT_INTERFACE_ID: true,
 *   CONTENTHASH_INTERFACE_ID: false,
 * }
 */
async function getInterfacesAvailable(resolver) {
  const interfacesAvailable = {};
  await Promise.all(
    interfaces.map(async interface => {
      interfacesAvailable[interface] = await resolver.methods
        .supportsInterface(interface)
        .call();
    })
  );
  return interfacesAvailable;
}

/**
 * Checks if the provider of the current web3 instance is listening
 *
 * @returns {bool} isListening
 */
function isListening() {
  return web3.eth.net.isListening().then(() => true, () => false);
}

module.exports = { getContent };
