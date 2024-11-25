const endpointsJson = require("../endpoints.json")
const app = require(`${__dirname}/../db/app.js`)
const request = require("supertest")
//require supertest to run request(app)


/* Set up your test imports here */

/* Set up your beforeEach & afterAll functions here */

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});
