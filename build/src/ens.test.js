var assert = require('assert');

var ens = require('./ens')

describe('ens', function() {
  describe('ens.getContent', function() {
    it('should return the IPFS hash of decentral.eth', async function() {
        const content = await ens.getContent('decentral.eth');
        assert.equal(content, '/ipfs/QmXufxJH2a14QcWdvaHq3PMmFLK8xmCXoD68NVaxchSEVi');
    });

    it('should return the IPFS hash of my.admin.dnp.dappnode.eth', async function() {
        const content = await ens.getContent('my.admin.dnp.dappnode.eth');
        assert.equal(content, '0x404');
    });

    it('should return the IPFS hash of mycrypto.dappnode.eth', async function() {
        const content = await ens.getContent('mycrypto.dappnode.eth');
        assert.equal(content, '/ipfs/Qmdojo8KAsZu7XTkETYwSiZMCjdUa58YNZCUKmsZ21i8gV');
    });

    it('should return the IPFS hash of portalnetwork.eth', async function() {
        const content = await ens.getContent('portalnetwork.eth');
        assert.equal(content, '/ipfs/QmSpuwejUGjREmgsvm8eq3ZdsS7mVTHCRPZmLiUq84S9x8');
    });
  });
});