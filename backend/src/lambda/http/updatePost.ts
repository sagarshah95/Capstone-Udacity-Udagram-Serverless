import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { UpdatePostRequest } from '../../requests/UpdatePostRequest'
import * as middy from 'middy';
import { cors } from 'middy/middlewares';
import { createLogger } from '../../utils/logger';
import { UpdatePost } from '../../businessLogic/posts'
import { getUserId } from '../utils'
import { ResponseHelper } from '../../helpers/responseHelper'

const logger = createLogger ('Update Todo Item')
const apiResponseHelper = new ResponseHelper()

export const handler = middy(
    async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

        try{
            logger.info("Processing event: " + event)

            // Update a post with the provided id using values in the "updatedPost" object
            const postId = event.pathParameters.postId
            const updatedPost: UpdatePostRequest = JSON.parse(event.body)
            const userId = getUserId(event)

            await UpdatePost(postId, updatedPost, userId)
            return apiResponseHelper.generateEmptySuccessResponse(200)
        } 
        
        catch (e) {
            logger.error("Error: " + e.message)
            return apiResponseHelper.generatErrorResponse(500, e.message)
        }
    }
)

handler.use(
    cors ({
        credentials: true
    })
)