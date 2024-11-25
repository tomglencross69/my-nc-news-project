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
describe("GET /api/articles/:article_id", () => {
  test("200: responds with an article object from parametric id request", () => {
    return request(app)
    .get("/api/articles/1")
    .expect(200)
    .then(({body : {article}})=> {
      expect(article.article_id).toBe(1)
    })
  })
  test("200: responds with article object with specific keys", () => {
    return request(app)
    .get("/api/articles/1")
    .expect(200)
    .then(({body: {article}})=> {
      expect(article).toMatchObject({
        author: expect.any(String),
        title: expect.any(String),
        article_id: expect.any(Number),
        body: expect.any(String),
        topic: expect.any(String),
        created_at: expect.any(String),
        votes: expect.any(Number),
        article_img_url: expect.any(String)
      })
      console.log(JSON.stringify(article, null, 2), "article for endpoints")
    })
  })
  test("400: bad request, responds with error if given an invalid article id", () => {
    return request(app)
    .get("/api/articles/not-valid")
    .expect(400)
    .then((response) => {
      expect(response.body.msg).toBe('Bad request')
    })
  })
  test('404: article not found, sends error message when given valid but non-existent id', () => {
    return request(app)
    .get("/api/articles/999999999")
    .expect(404)
    .then((response)=>{
      expect(response.body.msg).toBe('Article not found')
    })
  })
})

