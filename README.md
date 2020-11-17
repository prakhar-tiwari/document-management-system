# Document Management System

## Initial setup - From Git Repository
1. Clone the repo using command "git clone https://github.com/prakhar-tiwari/document-management-system.git"
2. Migrate to the cloned folder and run command "npm install" to install all the dependencies
3. Run command "npm start" and your application will run on "localhost:5000"

## Initial setup - Run from docker image
1. Pull the image using command "docker pull prakhartewari/dms"
2. Execute this command to run the container  - **docker run -p 5000:5000 prakhartewari/dms** or this command to run the image in background **docker run --publish 5000:5000 --detach --name dms prakhartewari/dms**
3. If your are using Docker App your application will run on **localhost:5000**, If you use Docker Toolbox you can access your application on **192.168.99.100:5000**

## User accounts to test
username - user
password - user

## Further instructions
1. /api/signup - you can provide unique userName to create a new user
2. /api/login - on successfull login you will get a token in response.
3. The APIs are authenticated using token based authentication, therefore the token obtained from /api/login is to be passed in Authorization header for other API's to work.
