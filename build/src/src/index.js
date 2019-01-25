require('dotenv').config()
const http = require('http');
const ens = require('./ens');
const httpProxy = require('http-proxy');
const fs = require('fs');
const path = require('path');

// Define params

const responseUnsynced = path.join(__dirname,'unsynced.html');
const response404 = path.join(__dirname,'404.html');
const IPFS_REDIRECT = process.env.IPFS_REDIRECT || "http://my.ipfs.dnp.dappnode.eth:8080";
const port = process.env.DEV_PORT || 80

// Start server

console.log(`IPFS redirect set to: ${IPFS_REDIRECT}`)
console.log(`Http server listening at port: ${port}`)

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
        console.log(`Proxying url: ${url}`);
        proxy.web(req, res, {
            target: url,
        });
    }
}).listen(port);
