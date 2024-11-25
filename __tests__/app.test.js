const endpointsJson = require(`${__dirname}/../endpoints.json`)
const app = require(`${__dirname}/../db/app.js`)
const request = require("supertest")
const seed = require(`${__dirname}/../db/seeds/seed.js`)
const data = require(`${__dirname}/../db/data/test-data/index.js`)
const db = require(`${__dirname}/../db/connection.js`)
//require supertest to run request(app)
/* Set up your test imports here */

beforeEach(()=>{
  return seed(data)
})

afterAll(()=>{
  return db.end()
})

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
describe("GET /api/topics", () => {
  test("200: responds with an array of topics with slug and description properties ", () => {
    return request(app)
    .get("/api/topics")
    .expect(200)
    .then(({body}) => {
      const { topics } = body
      topics.forEach((topic)=>{
        expect(topic).toMatchObject({
          slug: expect.any(String),
          description: expect.any(String)
        })
      })
    })
  })
  test("404: responds with a custom error code when get request is made to misspelled api/topics (or miseplled request made to any other api)", () => {
    return request(app)
    .get("/api/topicxxx")
    .expect(404)
    .then(({body})=>{
      const {msg} = body
      expect(msg).toBe("Not available")
    })
  })
  //write some error tests and build error functionality
})
});
