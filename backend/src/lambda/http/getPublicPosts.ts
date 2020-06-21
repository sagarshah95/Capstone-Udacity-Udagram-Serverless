import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy';
import { cors } from 'middy/middlewares';
import { createLogger } from '../../utils/logger';
import { GetPublicPosts } from '../../businessLogic/posts'
import { ResponseHelper } from '../../helpers/responseHelper'

const logger = createLogger ('Get Public Posts')
const apiResponseHelper = new ResponseHelper()

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    
    try{
      // Get all posts for a current user
      logger.info('Processing event: ', event)
      const posts = await GetPublicPosts()

      return apiResponseHelper.generateSuccessRespose(200, 'items', posts)
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