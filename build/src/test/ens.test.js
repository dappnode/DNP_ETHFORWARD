const assert = require("assert");
const ens = require("../src/ens");

/**
 * The purpose of this test is to make sure it retrieves the correct content
 * using the correct ENS access method
 *
 * [NOTE] tests are specified in the `endDomains` object = {
 *   "domain-to-test": "expected content to be returned"
 * }
 */

const ensDomains = {
  "decentral.eth": "/ipfs/QmXufxJH2a14QcWdvaHq3PMmFLK8xmCXoD68NVaxchSEVi",
  "my.admin.dnp.dappnode.eth": "0x404",
  "mycrypto.dappnode.eth":
    "/ipfs/Qmdojo8KAsZu7XTkETYwSiZMCjdUa58YNZCUKmsZ21i8gV",
  "theswarm.eth": "/bzz:/[0-9a-fA-F]{64}", // Use regex for swarm since it changes often
  "eth2dai.eduadiez.eth": "/ipfs/QmZoHo1wi4G9VHX6xLmMBRdFpdHMkHnsqVXqV6Vsng9m8j"
};

describe("ens.getContent", () => {
  for (const [domain, contentRegex] of Object.entries(ensDomains)) {
    it(`should return the IPFS hash of ${domain}`, async () => {
      const content = await ens.getContent(domain);
      assert.ok(
        RegExp(contentRegex).test(content),
        `Expected:\n  ${content}  \nto match:\n  ${contentRegex}`
      );
    }).timeout(10 * 1000);
  }
});
