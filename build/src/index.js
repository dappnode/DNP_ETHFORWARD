require('dotenv').config()

const http = require('http');
const ens = require('./ens');
const httpProxy = require('http-proxy');
const defaultResponse = 'unsynced.html'

const proxy = httpProxy.createProxyServer({});

const IPFS_REDIRECT = "http://my.ipfs.dnp.dappnode.eth:8080";

http.createServer(async (req, res) => {
    var domain = req.headers.host;

    const content = await ens.getContent(domain);
    if (content == "0x") {
        fs.readFile(defaultResponse, "binary", function(err, file) {
            if (err) {
                response.writeHead(500, { "Content-Type": "text/plain" });
                response.write(err + "\n");
                response.end();
                return;
            }
            res.writeHead(200, {'Content-Type': 'text/html'});
            fs.createReadStream(defaultResponse).pipe(response)
            response.end();
        });
    }else if (content != "0x0000000000000000000000000000000000000000000000000000000000000000") {
        const url = IPFS_REDIRECT + content;
        console.log(url);
        proxy.web(req, res, {
            target: url,
        });
    }
}).listen(80);
