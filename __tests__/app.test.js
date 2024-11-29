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

describe("GET 404: for all bad endpoint requests", () => {
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
      expect(topics.length).not.toBe(0)
        topics.forEach((topic)=>{
        expect(topic).toMatchObject({
          slug: expect.any(String),
          description: expect.any(String)
        })
      })
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
      expect(articles.length).not.toBe(0)
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
      expect(comments.length).toBe(2)
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
    })
  })
  test("200: query returns most recent comments first", () => {
    return request(app)
    .get("/api/articles/1/comments")
    .expect(200)
    .then(({body})=>{
      const {comments} = body
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
    const newComment = {username: "lurker", body: "No comment"}
    return request(app)
    .post("/api/articles/1/comments")
    .send(newComment)
    .expect(201)
    .then(({body})=>{
      const {comment} = body
      expect(comment).toEqual(expect.objectContaining({
        author: "lurker",
        body: 'No comment'
      }))
    })
  })
  test("201: comment successfully posts when comment object has extra property keys", () => {
    const newCommentExtraKey = {username: "lurker", body: "No comment", attitude: "ambivalent"}
    return request(app)
    .post("/api/articles/1/comments")
    .send(newCommentExtraKey)
    .expect(201)
    .then(({body}) => {
      const {comment} = body
      expect(comment).toEqual(expect.objectContaining({
        author: "lurker",
        body: 'No comment'
      }))
    })
  })
  test("404: username not valid, does not belong to users database", () => {
    const newComment = {username: "InvalidUser", body: "No comment"}
    return request(app)
    .post("/api/articles/1/comments")
    .send(newComment)
    .expect(404)
    .then(({body})=>{
      const {msg} = body
      expect(msg).toBe('Key (author)=(InvalidUser) is not present in table "users".')
    })
  })
  test("404: article not found when passed parametric request for non-existent article_id", () => {
    const newComment = {username: "lurker", body: "No comment"}
    return request(app)
    .post("/api/articles/999999/comments")
    .send(newComment)
    .expect(404)
    .then(({body})=>{
      const {msg} = body
      expect(msg).toBe('Key (article_id)=(999999) is not present in table \"articles\".')
    })
  })
  test("400: bad parametric request made for article given as string rather than number", () => {
    const newComment = {username: "lurker", body: "No comment"}
    return request(app)
    .post("/api/articles/one/comments")
    .send(newComment)
    .expect(400)
    .then(({body})=>{
      const {msg} = body
      expect(msg).toBe('Bad request')
    })
  })
  test("400: bad request made when comment object does not contain correct keys", () => {
    const newComment = {user: "lurker", bod: "No comment"}
    return request(app)
    .post("/api/articles/1/comments")
    .send(newComment)
    .expect(400)
    .then(({body})=>{
      const {msg} = body
      expect(msg).toBe('Error in structure of request')
    })
  })
})
describe("PATCH /api/articles/:article_id", () => {
  test("200: successfully patches specified article with correct postitve vote increase", () => {
    const newVote = {inc_votes: 1}
    return request(app)
    .patch("/api/articles/1")
    .send(newVote)
    .expect(200)
    .then(({body})=>{
      const {updatedArticle} = body
      expect(updatedArticle.votes).toBe(101)
    })
  })
  test("200: successfully patches specified article with correct negative vote decrease", () => {
    const newVote = {inc_votes: -1}
    return request(app)
    .patch("/api/articles/1")
    .send(newVote)
    .expect(200)
    .then(({body})=>{
      const {updatedArticle} = body
      expect(updatedArticle.votes).toBe(99)
    })
  })
  test("200: successfully patches specified article when resulting votes will be negative", () => {
    const newVote = {inc_votes: -101}
    return request(app)
    .patch("/api/articles/1")
    .send(newVote)
    .expect(200)
    .then(({body})=>{
      const {updatedArticle} = body
      expect(updatedArticle.votes).toBe(-1)
    })
  })
  test("400: bad request given with string of article_id instead of number ", () => {
    const newVote = {inc_votes: -1}
    return request(app)
    .patch("/api/articles/one")
    .send(newVote)
    .expect(400)
    .then(({body})=>{
      const {msg} = body
      expect(msg).toBe('Bad request')
    })
  })
  test("400: bad request given with object with invalid keys", () => {
    const newVote = {votesSchmotes: -1}
    return request(app)
    .patch("/api/articles/1")
    .send(newVote)
    .expect(400)
    .then(({body})=>{
      const {msg} = body
      expect(msg).toBe('Error in structure of request')
    })
  })
  test("400: bad request given with object with valid keys but invalid values", () => {
    const newVote = {inc_votes: "like"}
    return request(app)
    .patch("/api/articles/1")
    .send(newVote)
    .expect(400)
    .then(({body})=>{
      const {msg} = body
      expect(msg).toBe('Bad request')
    })
  })
  test("404: request made to non-existent article", () => {
    const newVote = {inc_votes: -1}
    return request(app)
    .patch("/api/articles/999999")
    .send(newVote)
    .expect(404)
    .then(({body})=>{
      const {msg} = body
      expect(msg).toBe('Article not available or does not exist')
    })
  })
})
describe("DELETE: /api/comments/:comment_id", () => {
  test("204: no content, specified comment successfully deleted", () => {
    return request(app)
    .delete("/api/comments/1")
    .expect(204)
    .then(({body})=>{
    const results = body
    return db.query(`SELECT * FROM comments
      WHERE comment_id = 1;`)
      .then(({rows}) => {
        expect(rows.length).toEqual(0)
        expect(results).toEqual({})
      })
    })
  })
  test("404: request made to delete non-existent comment", () => {
    return request(app)
    .delete("/api/comments/9999999")
    .expect(404)
    .then(({body})=>{
    const {msg} = body
    expect(msg).toBe("Comment not available or does not exist")
    })
  })
  test("400: bad request made to delete invalid comment id", () => {
    return request(app)
    .delete("/api/comments/one")
    .expect(400)
    .then(({body})=>{
    const {msg} = body
    expect(msg).toBe("Bad request")
    })
  })
})
describe("GET /api/users", () => {
  test("200: responds with an array of user objects", () => {
    return request(app)
    .get("/api/users")
    .expect(200)
    .then(({body: {users}})=> {
    expect(users.length).not.toBe(0)
        users.forEach((user)=> {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String)
          })
        })
    })
  })
})
describe("GET /api/articles with sorting queries", () => {
  test("200: retrieves array of article objects ordered by title alphabetically ascending", () => {
    return request(app)
    .get("/api/articles?sort_by=title&order=asc")
    .expect(200)
    .then(({body}) => {
      const {articles} = body
      expect(articles).toBeSortedBy("title")
    })
  })
  test("200: retrieves array of article objects ordered by title alphabetically descending if no order given", () => {
    return request(app)
    .get("/api/articles?sort_by=title")
    .expect(200)
    .then(({body}) => {
      const {articles} = body
      expect(articles).toBeSortedBy("title", {descending: true})
    })
  })
  test("200: retrieves array of article objects without queries, defaulting to created_at descending ", () => {
    return request(app)
    .get("/api/articles")
    .expect(200)
    .then(({body}) => {
      const {articles} = body
      expect(articles).toBeSortedBy("created_at", {descending: true})
    })
  })
  test("200: retrieves array of article objects without sort by queries, defaulting to created_at, but with order query requesting ascending", () => {
    return request(app)
    .get("/api/articles?order=asc")
    .expect(200)
    .then(({body}) => {
      const {articles} = body
      expect(articles).toBeSortedBy("created_at")
    })
  })
  test("400: invalid sort_by query given", () => {
    return request(app)
    .get("/api/articles?sort_by=votesssss")
    .expect(400)
    .then(({body}) => {
      const {msg} = body
      expect(msg).toBe("Bad request")
    })
  })
  test("400: invalid order query given", () => {
    return request(app)
    .get("/api/articles?order=ascending")
    .expect(400)
    .then(({body}) => {
      const {msg} = body
      expect(msg).toBe("Bad request")
    })
  })
})
describe("GET /api/articles topic query", () => {
test("200: retrieves articles belonging to a specific topic value", () => {
  return request(app)
  .get("/api/articles?topic=cats")
  .expect(200)
  .then(({body}) => {
    const {articles} = body
    expect(articles[0].topic).toBe("cats")
  })
})
test("200: request made to a topic which currently has no articles associated returns empty array", () => {
  return request(app)
  .get("/api/articles?topic=paper")
  .expect(200)
  .then(({body}) => {
    const {articles} = body
    expect(articles).toEqual([])
  })
})
test("404: request made for topic that doesn't exist", () => {
  return request(app)
  .get("/api/articles?topic=catxxx")
  .expect(404)
  .then(({body}) => {
    const {msg} = body
    expect(msg).toBe('Topic not available or does not exist')
  })
})
})
describe("GET /api/articles/:article_id comment count", () => {
  test("200: retrieves article with parametric id request, now with updated comment_count key", () => {
    return request(app)
    .get("/api/articles/1")
    .expect(200)
    .then(({body}) => {
      const {article} = body
      expect(article.comment_count).toBe("11")
    })
  })
  test("200: retrieves article with no votes and gives a string of zero", () => {
    return request(app)
    .get("/api/articles/7")
    .expect(200)
    .then(({body}) => {
      const {article} = body
      expect(article.comment_count).toBe("0")
    })
  })
  test("404: request made to non-existent articles_id", () => {
    return request(app)
    .get("/api/articles/999999")
    .expect(404)
    .then(({body}) => {
      const {msg} = body
      expect(msg).toBe('Article not found')
    })
  })
})
describe.only("GET /api/users/:username", () => {
  test("200: responds with an user object from parametric username request", () => {
    return request(app)
    .get("/api/users/lurker")
    .expect(200)
    .then(({body : {user}})=> {
      expect(user.username).toBe("lurker")
    })
  })
  test("200: responds with user object with specific keys", () => {
    return request(app)
    .get("/api/users/lurker")
    .expect(200)
    .then(({body: {user}})=> {
      expect(user).toMatchObject({
        username: expect.any(String),
        name: expect.any(String),
        avatar_url: expect.any(String)
      })
    })
  }) 
 test('404: user not found when given valid but non-existent username', () => {
    return request(app)
    .get("/api/users/tommyg")
    .expect(404)
    .then((response)=>{
      expect(response.body.msg).toBe('User not available or does not exist')
    })
  })
  test('400: bad request when given invalid username (ie. number)', () => {
    return request(app)
    .get("/api/users/69")
    .expect(400)
    .then((response)=>{
      expect(response.body.msg).toBe('Bad request: invalid username format')
    })
  })
})