const assert = require("assert");
const decodeContentHash = require("../../src/utils/decodeContentHash");

/**
 * The purpose of this test is to make sure the returned value of .contentHash
 * is decoded correctly
 * CONTENTHASH_INTERFACE_ID = '0xbc1c58d1'
 *
 * [NOTE] tests are specified in the `domains` object = {
 *   "contetHash-to-test": "expected IPFS hash to be returned"
 * }
 */

const contentHashes = {
  "0xe30101701220aa4396c7e54ce85638b1f5a66f83b0b698a80e6ca3511ccc7e8551c6ae89ab40":
    "/ipfs/QmZoHo1wi4G9VHX6xLmMBRdFpdHMkHnsqVXqV6Vsng9m8j"
};

describe("util > decodeContentHash (CONTENTHASH_INTERFACE_ID = '0xbc1c58d1')", () => {
  for (const [contentHashEncoded, expectedContent] of Object.entries(
    contentHashes
  )) {
    it(`should decode ${contentHashEncoded}`, async () => {
      const content = decodeContentHash(contentHashEncoded);
      assert.equal(content, expectedContent, "Wrong content");
    });
  }
});
