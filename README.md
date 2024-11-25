# Northcoders News API
-Notes for developers

-Environment Variables
In order to successfully connect to both the testing and development databases locally, two new respective .env files will have to be created in the root folder.

Suggested names for these files would be .env.development and .env.test.

These files should contain the respective names for each of the development and test databases prefixed with PGDATABASE, ie. 'PGDATABASE=<data-base-name-here>'

This will give the script in connection.js appropriate data to run either a development or testing database environment when seeding to test functionality. 


--- 

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
