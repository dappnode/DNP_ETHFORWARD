const http = require("http");

function httpGet(url) {
  return new Promise((resolve, reject) => {
    http
      .get(url, resp => {
        let data = "";
        resp.on("data", chunk => {
          data += chunk;
        });
        resp.on("end", () => resolve(data));
      })
      .on("error", reject);
  });
}

module.exports = httpGet;
