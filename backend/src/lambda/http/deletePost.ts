import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy';
import { cors } from 'middy/middlewares';
import { createLogger } from '../../utils/logger';
import { DeletePost } from '../../businessLogic/posts'
import { getUserId } from '../utils'
import { ResponseHelper } from '../../helpers/responseHelper'

const logger = createLogger("Update Post")
const apiResponseHelper = new ResponseHelper()

export const handler = middy(
    async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

        logger.info("Processing event: " + event)

        const postId = event.pathParameters.postId
        //Remove a post by id
        const userId = getUserId(event)

        try {
            await DeletePost(postId, userId)
            return apiResponseHelper.generateEmptySuccessResponse(200)
        } 
        
        catch (e){
            logger.error('Error: ' + e.message)

            return apiResponseHelper.generatErrorResponse(500, e.message)
        }
    }
)

handler.use(
    cors ({
        credentials: true
    })
)