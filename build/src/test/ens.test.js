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
  "portalnetwork.eth": "/ipfs/QmSpuwejUGjREmgsvm8eq3ZdsS7mVTHCRPZmLiUq84S9x8",
  "eth2dai.eduadiez.eth": "/ipfs/QmZoHo1wi4G9VHX6xLmMBRdFpdHMkHnsqVXqV6Vsng9m8j"
};

const timeout = 10 * 1000;

describe("ens", () => {
  describe("ens.getContent", () => {
    for (const [domain, expectedContent] of Object.entries(ensDomains)) {
      it(`should return the IPFS hash of ${domain}`, async () => {
        const content = await ens.getContent(domain);
        assert.equal(content, expectedContent, "Wrong content");
      }).timeout(timeout);
    }
  });
});
