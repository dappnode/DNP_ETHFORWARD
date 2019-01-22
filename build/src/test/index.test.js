const assert = require('assert');
const request = require('request');

// Set process.env variables
process.env.IPFS_REDIRECT = 'http://ipfs.io'
process.env.DEV_PORT = 8088

require('../src/index')

describe('main integration test. Curl the http server', () => {
    it('should return a valid content', (done) => {
        const options = {
            url: 'http://decentral.eth/',
            proxy: `http://localhost:${process.env.DEV_PORT}`
        };
        request(options, function (_, _, body) {
            assert(body.includes('<title>Decentralized Portal</title>'), `Wrong html returned: ${body}`)
            done()
        });
    }).timeout(10*1000)
});