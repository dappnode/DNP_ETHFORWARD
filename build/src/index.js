require('dotenv').config()

const http = require('http');
const ens = require('./ens');
const httpProxy = require('http-proxy');
const responseUnsynced = 'unsynced.html'
const response404 = '404.html'
const fs = require('fs');
const IPFS_REDIRECT = "http://my.ipfs.dnp.dappnode.eth:8080";

const proxy = httpProxy.createProxyServer({});

http.createServer(async (req, res) => {
    var domain = req.headers.host;
    const content = await ens.getContent(domain);
    
    if (content == "0x404") {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        fs.createReadStream(response404).pipe(res)
    } else if (content == "0x") {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        fs.createReadStream(responseUnsynced).pipe(res)
    } else {
        const url = IPFS_REDIRECT + content;
        console.log(url);
        proxy.web(req, res, {
            target: url,
        });
    }
}).listen(80);
