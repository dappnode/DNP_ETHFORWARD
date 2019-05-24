const axios = require("axios");

function httpGet(url) {
  return axios.get(url).then(res => res.data);
}

module.exports = httpGet;
