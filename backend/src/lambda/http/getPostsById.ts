import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy';
import { cors } from 'middy/middlewares';
import { createLogger } from '../../utils/logger';
import { GetPostsById } from '../../businessLogic/posts'
import { ResponseHelper } from '../../helpers/responseHelper'

const logger = createLogger ('Get Posts By ID')
const apiResponseHelper = new ResponseHelper()

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    
    try{
      // Get all posts for a current user
      logger.info('Processing event: ', event)
      const postId = event.pathParameters.postId
      const post = await GetPostsById(postId)

      logger.info(`Post by id ${postId}:` + JSON.stringify(post))
      return apiResponseHelper.generateSuccessRespose(200, 'item', post)
    } 
    
    catch (e) {
      logger.error('Error: ' + e.message)

      return apiResponseHelper.generatErrorResponse(500, e.message)
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)