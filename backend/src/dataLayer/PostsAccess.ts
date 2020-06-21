import * as AWS  from 'aws-sdk'
const AWSXRay = require('aws-xray-sdk')
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { PostItem } from '../models/PostItem'

const XAWS = AWSXRay.captureAWS(AWS)
const logger = createLogger(XAWS)

export class PostAccess {

    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly postsTable = process.env.POSTS_TABLE,
        private readonly IsPublicIndex = process.env.IS_PUBLIC_INDEX,
        private readonly PostIdIndex = process.env.POST_ID_INDEX,
        private readonly s3 = new XAWS.S3({ signatureVersion: 'v4' }),
        private readonly bucketName = process.env.IMAGES_S3_BUCKET,
        private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION
        ) {
    }

    async GetPosts (userId: string): Promise<PostItem[]>{

      logger.info('Getting my posts')

      const result = await this.docClient
      .query({
        TableName: this.postsTable,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId
        },
        ScanIndexForward: false
      })
      .promise()

      return result.Items as PostItem[]
    }

    async GetPostsById (postId: string): Promise<PostItem>{

      logger.info('Getting posts by ID')

      const result = await this.docClient
      .query({
        TableName: this.postsTable,
        IndexName: this.PostIdIndex,
        KeyConditionExpression: 'postId = :postId',
        ExpressionAttributeValues: {
          ':postId': postId
        },
        ScanIndexForward: false
      })
      .promise()
      return result.Items[0] as PostItem
    }

    async GetPublicPosts (): Promise<PostItem[]>{

      logger.info('Getting public posts')

      const result = await this.docClient
      .query({
        TableName: this.postsTable,
        IndexName: this.IsPublicIndex,
        KeyConditionExpression: 'isPublic = :isPublic',
        ExpressionAttributeValues: {
          ':isPublic': "true"
        },
        ScanIndexForward: false
      })
      .promise()

      return result.Items as PostItem[]
    }

    async CreatePost (postItem: PostItem): Promise<PostItem> {

      logger.info('Creating a post item')
      const newPostItem = {
        ...postItem,
        attachmentUrl: `https://${this.bucketName}.s3.amazonaws.com/${postItem.postId}`
      }

      await this.docClient.put({
          TableName: this.postsTable,
          Item: newPostItem
      }).promise()

      return newPostItem
    }

    async UpdatePost (postItem: PostItem): Promise<string> {
      
      logger.info(`Updating a post with ID ${postItem.postId}`)

      await this.docClient.update({
        TableName: this.postsTable,
        Key:{
          "userId": postItem.userId,
          "postId": postItem.postId
        },
        ConditionExpression: "postId = :postId",
        UpdateExpression: "set caption = :caption, isPublic = :isPublic",
        ExpressionAttributeValues: {
          ":caption" : postItem.caption,
          ":isPublic": postItem.isPublic,
          ":postId": postItem.postId
        }
      }).promise()

      return "success"
    }

    async DeletePost (postId: string, userId: string): Promise<string>{

      logger.info(`Updating a post with ID ${postId}`)
      await this.docClient.delete({
        TableName: this.postsTable,
        Key: {
          "userId": userId,
          "postId": postId
        },
        ConditionExpression: "postId = :postId",
        ExpressionAttributeValues: {
          ":postId": postId
        }
      }).promise()

      return "success"
    }

    async GenerateUploadUrl (postId: string): Promise<string> {

      logger.info(`Generating an upload url for ID ${postId}`)
      return this.s3.getSignedUrl('putObject', {
        Bucket: this.bucketName,
        Key: postId,
        Expires: parseInt(this.urlExpiration)
      }) as string
    }

}

function createDynamoDBClient() {
    if (process.env.IS_OFFLINE) {
      logger.info('Creating a local DynamoDB instance')
      return new XAWS.DynamoDB.DocumentClient({
        region: 'localhost',
        endpoint: 'http://localhost:8000'
      })
    }
  
    return new XAWS.DynamoDB.DocumentClient()
  }
  