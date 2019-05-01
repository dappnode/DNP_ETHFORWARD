const assert = require("assert");
const decodeContent = require("../../src/utils/decodeContent");

/**
 * The purpose of this test is to make sure the returned value of .content
 * is decoded correctly
 * CONTENT_INTERFACE_ID = '0xd8389dc5'
 *
 * [NOTE] tests are specified in the `domains` object = {
 *   "contet-to-test": "expected IPFS hash to be returned"
 * }
 */

const contents = {
  "0x42ac3c26c60ffb14882d3e7fa401e791a069ef589f8d365dde7f241f1e67b095":
    "/ipfs/QmSpuwejUGjREmgsvm8eq3ZdsS7mVTHCRPZmLiUq84S9x8"
};

describe("util > decodeContent (CONTENT_INTERFACE_ID = '0xd8389dc5')", () => {
  for (const [contentEncoded, expectedContent] of Object.entries(contents)) {
    it(`should decode ${contentEncoded}`, async () => {
      const content = decodeContent(contentEncoded);
      assert.equal(content, expectedContent, "Wrong content");
    });
  }
});
