# MUTLI-USER UDAGRAM SERVERLESS APPLICATION

To implement this project, you need to implement a Simple Udagram application done in the previous project-coursework extending it using AWS Lambda and Serverless framework.

# Functionality of the application

This application will allow creating/removing/updating/fetching POST (also called story) items. Each POST item can optionally have an attachment image. Each user only has access to POST items that he/she has created. The application homepage displays the posts which are public and are available to all the users.

# POST items

The application should store POST items, and each POST item contains the following fields:

* `userId` (string) - a unique id for a user
* `postId` (string) - a unique id for a post
* `createdAt` (string) - date and time when an item was created
* `caption` (string) - name of a post
* `isPublic` (string) - if the post should be public/private
* `attachmentUrl` (string) (optional) - a URL pointing to an image attached to a POST

# Functions to be implemented

To implement this project, you need to implement the following functions and configure them in the `serverless.yml` file:

* `Auth` - this function should implement a custom authorizer for API Gateway that should be added to all other functions.

* `GetPosts` - should return all posts for a current user. A user id can be extracted from a JWT token that is sent by the frontend

It should return data that looks like this:

```json
{
  "items": [
    {
      "userId": "don",
      "postId": "123",
      "createdAt": "2020-06-16T20:01:45.424Z",
      "caption": "Image-1",
      "isPublic": "false",
      "attachmentUrl": "http://example.com/image.png"
    }
  ]
}
```

* `GetPostById` - should return a post by the provided ID. A user id can be extracted from a JWT token that is sent by the frontend

It should return data that looks like this:

```json
{
  "item": [
    {
      "userId": "don",
      "postId": "123",
      "createdAt": "2020-06-16T20:01:45.424Z",
      "caption": "Image-1",
      "isPublic": "false",
      "attachmentUrl": "http://example.com/image.png"
    }
  ]
}
```

* `GetPublicPosts` - should return all public posts (i.e. with "isPublic": false). A user id can be extracted from a JWT token that is sent by the frontend

It should return data that looks like this:

```json
{
  "items": [
    {
      "userId": "don",
      "postId": "123",
      "createdAt": "2020-06-16T20:01:45.424Z",
      "caption": "Image-1",
      "isPublic": "true",
      "attachmentUrl": "http://example.com/image.png"
    },
    {
      "userId": "shawn",
      "postId": "234",
      "createdAt": "2020-06-16T20:01:45.424Z",
      "caption": "Image-2",
      "isPublic": "true",
      "attachmentUrl": "http://example.com/image.png"
    }
  ]
}
```

* `CreatePost` - should create a new POST for a current user. A shape of data send by a client application to this function can be found in the `CreatePostRequest.ts` file

It receives a new POST item to be created in JSON format that looks like this:

```json
{
  "caption": "beach",
  "isPublic": false
}
```

It should return a new POST item that looks like this:

```json
{
  "item": {
    "userId": "shawn",
    "postId": "234",
    "createdAt": "2020-06-16T20:01:45.424Z",
    "caption": "Image-2",
    "isPublic": "true",
    "attachmentUrl": "http://example.com/image.png"
  }
}
```

* `UpdatePost` - should update a POST item created by a current user. A shape of data send by a client application to this function can be found in the `UpdatePostRequest.ts` file

It receives an object that contains three fields that can be updated in a POST item:

```json
{
  "caption": "Image-Caption!!",
  "isPublic": true
}
```

The id of a post that should be updated is passed as a URL parameter.

It should return an empty body.

* `DeletePost` - should delete a POST item created by a current user. Expects an id of a POST to remove.

It should return an empty body.

* `GenerateUploadUrl` - returns a pre-signed URL that can be used to upload an attachment file for a POST item.

It should return a JSON object that looks like this:

```json
{
  "uploadUrl": "https://s3-bucket-name.s3.eu-west-1.amazonaws.com/image.png"
}
```

All functions are already connected to appropriate events from API Gateway.

An id of a user can be extracted from a JWT token passed by a client.

You also need to add any necessary resources to the `resources` section of the `serverless.yml` file such as DynamoDB table and S3 bucket.


# Frontend

The `client` folder contains a web application that can use the API that should be developed in the project.

This frontend should work with your serverless application once it is developed, you don't need to make any changes to the code. The only file that you need to edit is the `config.ts` file in the `client` folder. This file configures your client application just as it was done in the course and contains an API endpoint and Auth0 configuration:

```ts
const apiId = '...' API Gateway id
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  domain: '...',    // Domain from Auth0
  clientId: '...',  // Client id from an Auth0 application
  callbackUrl: 'http://localhost:3000/callback'
}
```

## Authentication

To implement authentication in your application, you would have to create an Auth0 application and copy "domain" and "client id" to the `config.ts` file in the `client` folder. We recommend using asymmetrically encrypted JWT tokens.

# Best practices

To complete this exercise, please follow the best practices from the 6th lesson of this course.

## Logging

The starter code comes with a configured [Winston](https://github.com/winstonjs/winston) logger that creates [JSON formatted](https://stackify.com/what-is-structured-logging-and-why-developers-need-it/) log statements. You can use it to write log messages like this:

```ts
import { createLogger } from '../../utils/logger'
const logger = createLogger('auth')

// You can provide additional information with every log statement
// This information can then be used to search for log statements in a log storage system
logger.info('User was authorized', {
  // Additional information stored with a log statement
  key: 'value'
})
```

# How to run the application

## Backend

To deploy an application run the following commands:

```
cd backend
npm install
sls deploy -v
```

## Frontend

To run a client application first edit the `client/src/config.ts` file to set correct parameters. And then run the following commands:

```
cd client
npm install
npm run start
```

This should start a development server with the React application that will interact with the serverless POST application.

## How to use the application
The project screenshots could be found in project-screenshots folder.
- **Login** to the application. The application would not be accessible to any use who is not logged in.
- **Home** tab shows the posts which are public.
- **My Profile** tab displays the posts which are private to a user.
  - **New Post** button is used to create a new post. Caption is mandatory for creating a post.
  - A newly created post has a caption and is private by default.
  - A post can be _edited_ by clicking the _pencil_ icon.
    - Only caption, isPublic and Image could be updated by a user.
    - Return to **My Profile** tab after updating a post to see the changes.
  - A post can be _deleted_ by clicking the _cross_ icon.
  - Here,multiple users can share their images,as similar to Instagram. As well the user has the right to mark the image/post to be public or private according to his choice, allowing the user to maintain the privacy.