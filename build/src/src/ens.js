const Eth = require("ethjs");
const decodeContent = require("./utils/decodeContent");
const decodeContentHash = require("./utils/decodeContentHash");
const computeNode = require("./utils/computeNode");
const axios = require("axios");

/**
 * ENS parameters
 * Last updated January 2019
 */

const resolverAbi = require("./abi/resolverAbi.json");
const ensAbi = require("./abi/ens.json");

const ethProvider = {
  mainnet:
    process.env.WEB3HOSTHTTP || "http://my.ethchain.dnp.dappnode.eth:8545",
  ropsten:
    process.env.WEB3HOSTHTTP_ROPSTEN ||
    "http://my.ropsten.dnp.dappnode.eth:8545"
};

const ensAddrByNetwork = {
  mainnet: "0x314159265dd8dbb310642f98f50c066173c1259b",
  ropsten: "0x112234455c3a32fd11230c42e7bccd4a84e02010"
};

const TEXT_INTERFACE_ID = "0x59d1d43c";
const CONTENTHASH_INTERFACE_ID = "0xbc1c58d1";
const CONTENT_INTERFACE_ID = "0xd8389dc5";
const interfaces = [
  TEXT_INTERFACE_ID,
  CONTENTHASH_INTERFACE_ID,
  CONTENT_INTERFACE_ID
];

const ethByNetwork = {};
const ensByNetwork = {};
for (const [network, providerUrl] of Object.entries(ethProvider)) {
  const provider = new Eth.HttpProvider(providerUrl);
  const eth = new Eth(provider);
  ethByNetwork[network] = eth;
  ensByNetwork[network] = eth.contract(ensAbi).at(ensAddrByNetwork[network]);
  console.log(`Connected web3 to ${network} at ${providerUrl}`);
}

/**
 * Resolves a request for an ENS domain iterating over various methods
 *
 * @param {string} domain
 * @returns {string} content
 * - "0x"
 * - "0x404"
 * - "/ipfs/Qm..."
 */
async function getContent(domain) {
  console.log("Requested: " + domain);

  const network = domain.endsWith(".test") ? "ropsten" : "mainnet";
  const eth = ethByNetwork[network];
  const ens = ensByNetwork[network];

  if (!(await isListening(eth)))
    throw Error(`no-${network}: Network ${network} is not listening`);

  const node = computeNode(domain);
  const resolverAddress = await ens.resolver(node).then(res => res[0]);
  if (parseInt(resolverAddress) === 0) return "0x404";

  const resolver = eth.contract(resolverAbi).at(resolverAddress);
  const interfacesAvailable = await getInterfacesAvailable(resolver);

  /**
   * `contentHash` method
   */
  if (interfacesAvailable[CONTENTHASH_INTERFACE_ID]) {
    const contentHashEncoded = await resolver
      .contenthash(node)
      .then(res => res[0]);
    const content = decodeContentHash(contentHashEncoded);
    if (content) return content;
  }

  /**
   * `text` method
   * This method is deprecated, but it is preserved for compatibility
   */
  if (interfacesAvailable[TEXT_INTERFACE_ID]) {
    const content = await resolver.text(node, "dnslink").then(res => res[0]);
    if ((content || "").startsWith("/ipfs/")) return content;
  }

  /**
   * `content` method
   */
  if (interfacesAvailable[CONTENT_INTERFACE_ID]) {
    const contentEncoded = await resolver.content(node).then(res => res[0]);
    const content = decodeContent(contentEncoded);
    if (content) return content;
  }

  return "0x404";
}

// Utils

/**
 * Iterates over various interfaces to check if they are available
 *
 * @param {object} resolver ethjs contract instance
 * @returns {object} interfacesAvailable = {
 *   TEXT_INTERFACE_ID: true,
 *   CONTENTHASH_INTERFACE_ID: false,
 * }
 */
async function getInterfacesAvailable(resolver) {
  const interfacesAvailable = {};
  await Promise.all(
    interfaces.map(async interface => {
      interfacesAvailable[interface] = await resolver
        .supportsInterface(interface)
        .then(res => res[0]);
    })
  );
  return interfacesAvailable;
}

/**
 * Checks if the provider of the current web3 instance is listening
 *
 * @returns {bool} isListening
 */
function isListening(eth) {
  const ethProvider = eth.currentProvider.host;
  return axios
    .post(
      ethProvider,
      {
        jsonrpc: "2.0",
        method: "net_listening",
        params: [],
        id: 754
      },
      { headers: { "Content-Type": "application/json" } }
    )
    .then(res => {
      if (res.status !== 200) return false;
      return (res.data || {}).result;
    })
    .catch(() => false);
}

module.exports = { getContent };
