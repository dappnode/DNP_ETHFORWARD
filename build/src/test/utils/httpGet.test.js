const assert = require("assert");
const httpGet = require("../../src/utils/httpGet");

/**
 * Test the custom http GET request util
 */

const url = "http://jsonplaceholder.typicode.com/todos/1";

describe("util > httpGet", () => {
  it("should retrieve data from a sample API", async () => {
    const res = await httpGet(url);
    assert.deepEqual(
      res,
      {
        userId: 1,
        id: 1,
        title: "delectus aut autem",
        completed: false
      },
      "Wrong response"
    );
  });

  it("should return error for a broken url", async () => {
    const error = await httpGet("http://fakeurl.fake").catch(e => e.message);
    assert.equal(
      error,
      "getaddrinfo ENOTFOUND fakeurl.fake fakeurl.fake:80",
      "Wrong error message"
    );
  });
});
