-- --without ARRAY_AGG
-- SELECT title, genre_name FROM books
-- JOIN books_genres
-- ON books.book_id = books_genres.book_id
-- JOIN genres
-- ON books_genres.genre_id = genres.genre_id;

-- --with ARRAY_AGG
-- SELECT title, ARRAY_AGG(genre_name) AS associated_genres
-- FROM books
-- JOIN books_genres
-- ON books.book_id = books_genres.book_id
-- JOIN genres
-- ON books_genres.genre_id = genres.genre_id
-- GROUP BY title;


-- psql -d nc_news_test -f sql-test-pad.sql -o sql-test-pad.txt


-- SELECT articles.id AS article_id, COUNT(comments.article_id) AS comment_count
-- FROM articles
-- LEFT JOIN comments
-- ON  articles.id = comments.article_id
-- GROUP BY 
-- articles.id
-- ORDER BY 
--     articles.id;

-- SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) AS comment_count
-- FROM articles
-- LEFT JOIN comments
-- ON articles.article_id = comments.article_id
-- GROUP BY 
-- articles.article_id;

--select only columns we need from articles
--declare new count column for comment_count, count by commentscomment.id
--left join comments to keep all article_ids which dont have comments
--associate article_id in articles with same in comments
--keep articles.article_id unnique

--CAST(COUNT(comments.comment_id) AS INT) AS comment_count, if need to make comment count integer

-- SELECT * FROM articles;


-- -- SELECT * FROM comments

-- SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count
-- FROM articles
-- LEFT JOIN comments
-- ON articles.article_id = comments.article_id
-- GROUP BY 
-- articles.article_id;

SELECT * FROM comments;

SELECT * FROM comments
WHERE comments.article_id = 2;