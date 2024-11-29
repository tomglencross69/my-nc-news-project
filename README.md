# Northcoders News API
---

https://tomglencross-nc-news-project.onrender.com/api/

--- 

This project is an API that serves and manages data for articles, topics, users, and comments. The API allows clients to retrieve, update, create, and delete data via endpoints.

Key Features:
Retrieve information about articles, topics, users, and comments.
Post comments on articles.
Update article vote counts.
Delete specific comments.

---

-Notes for developers

Follow these steps to clone the repository, install dependencies, seed the local database, and run tests:

1. Clone the Repository

Use the git clone command to download the project files to your local machine:
git clone <https://github.com/tomglencross69/my-nc-news-project>

2. Install Dependencies

Install all required packages by running:
npm install

3. Environment Variables
In order to successfully connect to either testing or development databases, new respective  .env files should created in the root folder, eg. '.env.development' and '.env.test'.

The testing and development .env files should contain the respective names for each of the databases prefixed with PGDATABASE, ie. 'PGDATABASE=<data-base-name-here>'

This will give the script in connection.js appropriate data to run either a development or testing database environment when seeding to test functionality. 

4. Seed the Local Database

Ensure the latest version of PostgreSQL is running on your machine.
Run the following script to set up and seed the development database:
npm run seed

5. Testing

To verify that the application works as expected, run the test suite:
npm test


6. Node.js and Postgres
Database Configuration: Ensure you have the latest version of PostgreSQL installed.
Scripts: All scripts are contained in the package.json file in the repository root. 

---

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
