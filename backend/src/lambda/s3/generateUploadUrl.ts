import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { GenerateUploadUrl } from '../../businessLogic/posts'
import * as middy from 'middy';
import { cors } from 'middy/middlewares';
import { createLogger } from '../../utils/logger';
import { ResponseHelper } from '../../helpers/responseHelper'

const logger = createLogger ('Generate Upload URLs')
const apiResponseHelper = new ResponseHelper()

export const handler =  middy(
    async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

        try{
            logger.info('Processing event: ', event)
            const postId = event.pathParameters.postId
            //Return a presigned URL to upload a file for a post with the provided id
            const signedUploadUrl = await GenerateUploadUrl(postId)

            return apiResponseHelper.generateSuccessRespose(200, 'uploadUrl', signedUploadUrl)
        } 
        
        catch (e){
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
