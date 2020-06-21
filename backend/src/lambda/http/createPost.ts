import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { CreatePostRequest } from '../../requests/CreatePostRequest'
import { CreatePost } from '../../businessLogic/posts'
import * as middy from 'middy';
import { cors } from 'middy/middlewares';
import { createLogger } from '../../utils/logger';
import { getUserId } from '../utils'
import { ResponseHelper } from '../../helpers/responseHelper'

const logger = createLogger ('Create Post')
const apiResponseHelper = new ResponseHelper()

export const handler = middy(
    async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
        try{
            logger.info('Processing event: ', event)

            const newPost: CreatePostRequest = JSON.parse(event.body)
            const userId = getUserId(event)

            const newItem = await CreatePost(newPost, userId)

            return apiResponseHelper.generateSuccessRespose(201, 'item', newItem)
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
