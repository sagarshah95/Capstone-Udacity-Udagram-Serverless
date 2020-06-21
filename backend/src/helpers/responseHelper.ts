import { APIGatewayProxyResult } from 'aws-lambda'

export class ResponseHelper{
    /**
     * generate success response with custom result object name
     * @param statusCode Response http status code
     * @param key result object name
     * @param items result object
     */

    generateSuccessRespose(statusCode: number, key: string, item: any): APIGatewayProxyResult{
        return {
            statusCode: statusCode,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                [key]: item
            })
        }
    }

    /**
     * @param statusCode Response http status code
     */
    generateEmptySuccessResponse(statusCode: number): APIGatewayProxyResult{
        return {
            statusCode: statusCode,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: ''
        }
    }

    /**
     * @param statusCode Response http status code
     */
    generatErrorResponse(statusCode: number, message: string): APIGatewayProxyResult{
        return {
            statusCode: statusCode,
            headers: {
            'Access-Control-Allow-Origin': '*'
            },  
            body: message
        }
    }

}