require('dotenv').config()

const http = require('http');
const ens = require('./ens');
const httpProxy = require('http-proxy');

const proxy = httpProxy.createProxyServer({});

const IPFS_REDIRECT = process.env.IPFS_REDIRECT || "http://my.ipfs.dnp.dappnode.eth:8080";
const STANDALONE = process.env.STANDALONE || false;

http.createServer(async (req, res) => {
    var domain = req.headers.host;

    if (STANDALONE) {
        if (req.url.endsWith('.eth')) {
            domain = req.url.slice(1);
            req.url=""
        }
    }

    const content = await ens.getContent(domain);
    if (content != "0x0000000000000000000000000000000000000000000000000000000000000000") {
        const url = IPFS_REDIRECT + content;
        console.log(url);
        proxy.web(req, res, {
            target: url,
        });
    }else if (STANDALONE){
        console.log(IPFS_REDIRECT);
        proxy.web(req, res, {
            target: IPFS_REDIRECT,
        });
    }
}).listen(80);
