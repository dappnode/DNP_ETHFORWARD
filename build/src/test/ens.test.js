const assert = require('assert');
const ens = require('../src/ens')

/**
 * The purpose of this test is to make sure it retrieves the correct content
 * using the correct ENS access method
 */

const timeout = 10 * 1000

describe('ens', () => {
  describe('ens.getContent', () => {
    it('should return the IPFS hash of decentral.eth', async () => {
        const content = await ens.getContent('decentral.eth');
        assert.equal(content, '/ipfs/QmXufxJH2a14QcWdvaHq3PMmFLK8xmCXoD68NVaxchSEVi');
    }).timeout(timeout);

    it('should return the IPFS hash of my.admin.dnp.dappnode.eth', async () => {
        const content = await ens.getContent('my.admin.dnp.dappnode.eth');
        assert.equal(content, '0x404');
    }).timeout(timeout);

    it('should return the IPFS hash of mycrypto.dappnode.eth', async () => {
        const content = await ens.getContent('mycrypto.dappnode.eth');
        assert.equal(content, '/ipfs/Qmdojo8KAsZu7XTkETYwSiZMCjdUa58YNZCUKmsZ21i8gV');
    }).timeout(timeout);

    it('should return the IPFS hash of portalnetwork.eth', async () => {
        const content = await ens.getContent('portalnetwork.eth');
        assert.equal(content, '/ipfs/QmSpuwejUGjREmgsvm8eq3ZdsS7mVTHCRPZmLiUq84S9x8');
    }).timeout(timeout);
  })
});