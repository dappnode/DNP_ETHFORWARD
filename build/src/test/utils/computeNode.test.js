const assert = require("assert");
const computeNode = require("../../src/utils/computeNode");

/**
 * The purpose of this test is to make sure the ENS nodes are computed correctly
 *
 * [NOTE] tests are specified in the `domains` object = {
 *   "domain-to-test": "expected node to be returned"
 * }
 */

const domains = {
  "decentral.eth":
    "0x880271a5aa586090a365755936242b05d4a5378eff6aba78f3af81deb0158b0b",
  "my.admin.dnp.dappnode.eth":
    "0x8ee9dcc8fbece2dd5bd100ca63e11ca37e1d1ddedfbb5469dac1ea5e2d889a45",
  "mycrypto.dappnode.eth":
    "0xa447e2756a96e5d76aa44c925dd7a10241836f134b9a4acc432db6c784bd4ea9",
  "portalnetwork.eth":
    "0x05c84f0505a22d7072990fc4dabd7d7028c69c0c55dcdc4d20dac25b36581a7c",
  "eth2dai.eduadiez.eth":
    "0xac3ab696061345d6c2595d7630e38ebae403b8d05e31be5d44aa073ea0f3e447"
};

describe("util > computeNode", () => {
  for (const [domain, expectedNode] of Object.entries(domains)) {
    it(`should compute the node of ${domain}`, async () => {
      const node = computeNode(domain);
      assert.equal(node, expectedNode, "Wrong node");
    });
  }
});
