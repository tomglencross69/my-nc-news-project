const endpointsJson = require(`${__dirname}/../endpoints.json`)
const app = require(`${__dirname}/../db/app.js`)
const request = require("supertest")
const seed = require(`${__dirname}/../db/seeds/seed.js`)
const data = require(`${__dirname}/../db/data/test-data/index.js`)
const db = require(`${__dirname}/../db/connection.js`)

beforeEach(()=>{
  return seed(data)
})

afterAll(()=>{
  return db.end()
})

describe("GET 404: for all incorrect URL GET requests", () => {
  test("404: responds with custom 'Not available' message as part of generic error handling middleware", () => {
    return request(app)
    .get("/api/any-incorrect-url-get-request")
    .expect(404)
    .then(({body})=>{
      const {msg} = body
      expect(msg).toBe('Not available')
    })
  })
})
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
      if (topics.length) {
        topics.forEach((topic)=>{
        expect(topic).toMatchObject({
          slug: expect.any(String),
          description: expect.any(String)
        })
      })
    }
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
describe("GET /api/articles", () => {
  test("200: responds with array of article objects each with specific properties, and without body property", () => {
    return request(app)
    .get("/api/articles")
    .expect(200)
    .then(({body})=>{
      const {articles} = body
      if (articles.length){
        articles.forEach((article)=>{
          expect(article).toMatchObject(
            {
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              created_at: expect.any(String),
              article_img_url: expect.any(String),
              article_id: expect.any(Number),
              comment_count: expect.any(String),
              votes: expect.any(Number)
            }
          )
        })
      }
    })
  })
  test("200: responds with array of article objects in ascending order of date created", () => {
    return request(app)
    .get("/api/articles")
    .expect(200)
    .then(({body})=>{
      const {articles} = body
      expect(articles).toBeSortedBy("created_at", {descending: true})
    })
  })
  test("404: endpoint not found when articles typo etc", () => {
    return request(app)
    .get("/api/articlesxxx")
    .expect(404)
    .then(({body})=>{
      const {msg} = body
      expect(msg).toBe('Not available')
    })
  })
})
describe("GET /api/articles/:article_id/comments", () => {
  test ("200: returns an array of all comment objects for a parametric request to an article via article_id, with a single specific comment", () => {
    return request(app)
    .get("/api/articles/6/comments")
    .expect(200)
    .then(({body})=>{
      const {comments} = body
      expect(comments).toEqual([{
        body: "This is a bad article name",
        votes: 1,
        author: "butter_bridge",
        article_id: 6,
        created_at: "2020-10-11T15:23:00.000Z",
        comment_id: 16
      }])
    })
  })
  test("200: checks a parametric request to an article with multiple known number of comments (2) for correct keys", () => {
    return request(app)
    .get("/api/articles/5/comments")
    .expect(200)
    .then(({body})=>{
      const {comments} = body
      console.log(JSON.stringify(comments, null, 2))
      if (comments.length === 2){
        comments.forEach((comment)=>{
          expect(comment).toMatchObject({
            body: expect.any(String),
            votes: expect.any(Number),
            author: expect.any(String),
            article_id: expect.any(Number),
            created_at: expect.any(String),
            comment_id: expect.any(Number)
          })
        })
      }
    })
  })
  test("200: query returns most recent comments first", () => {
    return request(app)
    .get("/api/articles/1/comments")
    .expect(200)
    .then(({body})=>{
      const {comments} = body
      console.log(comments, "<<<<comments in test")
      expect(comments).toBeSortedBy("created_at", {descending: true})
    })
  })
  test("200: if an article has no comments, we still receive a 200 request with an empty array", () => {
    return request(app)
    .get("/api/articles/2/comments")
    .expect(200)
    .then(({body})=>{
    const {comments} = body
    expect(comments).toEqual([])
    })
  })
  test("400: bad request made when incorrect article_id given", () => {
    return request(app)
    .get("/api/articles/xyz/comments")
    .expect(400)
    .then(({body})=>{
      const {msg} = body
      expect(msg).toBe('Bad request')
    })
  })
  test("404: page not found for incorrect comments url slug", () =>{
    return request(app)
    .get("/api/articles/1/commentsxxx")
    .expect(404)
    .then(({body}) => {
      const {msg} = body
      expect(msg).toBe('Not available')
    })
  })
})
describe("POST: api/articles/:article_id/comments", () => {
  test("201: comment successfully posts to a given article", () => {
    const newComment = {username: "Tom", body: "No comment"}
    return request(app)
    .post("/api/articles/1/comments")
    .send(newComment)
    .expect(201)
    .then(({body})=>{
      const {comments} = body
      expect(comments[0]).toEqual(expect.objectContaining({
        author: "Tom",
        body: 'No comment'
      }))
    })
  })
})


//notes at the end of the day
//i think the test above will return a body of an array of comment objects
//because theyre ordered by DESC I'm hoping comments[0] will be my initial recently added comment
//i think the only things i can expect are the author will be Tom and the body will be no comment, because the posted query will be returned from the database, which will give my comment an serial id key, automatically assign votes at 0 and created_at etc... but i dont know
//how will username map to author? is that whats intended here? i think so
//how will my posted body map to the body of the database comment object body?