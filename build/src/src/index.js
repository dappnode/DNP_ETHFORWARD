const http = require("http");
const httpProxy = require("http-proxy");
const fs = require("fs");
const path = require("path");
// Modules
const httpGet = require("./utils/httpGet");
const ens = require("./ens");

// Define params

const IPFS_REDIRECT =
  process.env.IPFS_REDIRECT || "http://my.ipfs.dnp.dappnode.eth:8080";
const SWARM_REDIRECT = process.env.SWARM_REDIRECT || "http://swarm.dappnode";
const port = process.env.DEV_PORT || 80;

const pinContentOnVisit = process.env.PIN_CONTENT_ON_VISIT;
const IPFS_API = "http://my.ipfs.dnp.dappnode.eth:5001/api/v0";

// HTML pages
const htmlsPath = process.env.HTMLS_PATH || "src/views";
const responseUnsynced = path.join(htmlsPath, "unsynced.html");
const response404 = path.join(htmlsPath, "404.html");
const responseNoSwarm = path.join(htmlsPath, "no-swarm.html");
const responseNoRopsten = path.join(htmlsPath, "no-ropsten.html");

// Start server

console.log(`IPFS redirect set to: ${IPFS_REDIRECT}`);
console.log(`SWARM redirect set to: ${SWARM_REDIRECT}`);
console.log(`Http server listening at port: ${port}`);

const proxy = httpProxy.createProxyServer({});

http
  .createServer(async (req, res) => {
    try {
      const domain = req.headers.host;

      /**
       * - `.eth` domains: Resolve with mainnet
       * - `.test` domains: Resolve with ropsten
       *   - If NETOFF error, return no-ropsten.html
       * - else: return 404.html
       */
      const content = await ens.getContent(domain).catch(e => {
        e.message = `no-content: ${e.message}`;
        throw e;
      });

      if (!content) throw Error("404-not-found");

      if (content.startsWith("/ipfs/")) {
        /**
         * IPFS case:
         * - Pin connent after visit
         */
        const url = IPFS_REDIRECT + content;
        console.log(`Proxying url: ${url}`);
        proxy.web(req, res, { target: url }, function(e) {
          console.error(`Error proxying to ${url}: ${e.message}`);
        });
        // If the user has requested so, pin the content when visiting it
        if (pinContentOnVisit)
          httpGet(`${IPFS_API}/pin/add?arg=${content}`)
            .then(res => console.log(`Pinned ${content}: ${res}`))
            .catch(e => console.log(`Error pinning ${content}: ${e.message}`));
      } else if (content.startsWith("/bzz:/")) {
        /**
         * SWARM (BZZ) case:
         * - If the proxying fails because of an EHOSTUNREACH error, redirect
         *   to a fallback page "install-swarm"
         */
        const url = SWARM_REDIRECT + content;
        console.log(`Proxying url: ${url}`);
        proxy.web(req, res, { target: url }, function(e) {
          if (e.message.includes("EHOSTUNREACH")) {
            res.writeHead(200, { "Content-Type": "text/html" });
            fs.createReadStream(responseNoSwarm).pipe(res);
            console.log(`Redirecting to fallback page no-swarm.html`);
          } else {
            console.error(`Error proxying to ${url}: ${e.message}`);
          }
        });
      }
    } catch (e) {
      res.writeHead(200, { "Content-Type": "text/html" });
      if (e.message.includes("no-ropsten")) {
        fs.createReadStream(responseNoRopsten).pipe(res);
      } else if (e.message.includes("no-content")) {
        fs.createReadStream(responseUnsynced).pipe(res);
      } else if (e.message.includes("404-not-found")) {
        fs.createReadStream(response404).pipe(res);
      } else {
        fs.createReadStream(response404).pipe(res);
      }
      console.error(e.stack);
    }
  })
  .listen(port);
