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

const timeout = 10 * 1000;

describe("ens", () => {
  describe("ens.getContent with mainnet domains", () => {
    const ensDomains = {
      "decentral.eth": "/ipfs/QmXufxJH2a14QcWdvaHq3PMmFLK8xmCXoD68NVaxchSEVi",
      "my.admin.dnp.dappnode.eth": "0x404",
      "mycrypto.dappnode.eth":
        "/ipfs/Qmdojo8KAsZu7XTkETYwSiZMCjdUa58YNZCUKmsZ21i8gV",
      "theswarm.eth":
        "/bzz:/7027b30fa1702e5badb0d5a0378e01566da7798c9b2bf054b7e1f3168480ef96",
      "eth2dai.eduadiez.eth":
        "/ipfs/QmZoHo1wi4G9VHX6xLmMBRdFpdHMkHnsqVXqV6Vsng9m8j"
    };

    for (const [domain, expectedContent] of Object.entries(ensDomains)) {
      it(`should return the IPFS hash of ${domain}`, async () => {
        const content = await ens.getContent(domain);
        assert.equal(content, expectedContent, "Wrong content");
      }).timeout(timeout);
    }
  });

  describe("ens.getContent with ropsten domains", () => {
    const ensDomains = {
      "test202.test":
        "/bzz:/4d0e578e9861301664c90d19ffad1acc3b3c17bc03b16827ab306a4e625bb705"
    };

    for (const [domain, expectedContent] of Object.entries(ensDomains)) {
      it(`should return the IPFS hash of ${domain}`, async () => {
        const content = await ens.getContent(domain, { network: "ropsten" });
        assert.equal(content, expectedContent, "Wrong content");
      }).timeout(timeout);
    }
  });
});
