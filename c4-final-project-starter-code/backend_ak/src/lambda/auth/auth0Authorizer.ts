import 'source-map-support/register'
import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda';

import { verify } from 'jsonwebtoken'
import { JwtPayload } from '../../auth/JwtPayload'

// import * as middy from 'middy'
// import { secretsManager } from 'middy/middlewares'

// const secretId = process.env.AUTH_0_SECRET_ID
// const secretId = 'DmTzHmYnZEPg5TP-Z_0-LKffh46mEaoMC1WmmbW1lBpic5Z7_ZgVU5ABxwH-nzvY'
// const secretField = process.env.AUTH_0_SECRET_FIELD


export const handler = async (
    event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
    try {
        // console.log('authorizationToken is ', event.authorizationToken)
        const decodedToken = verifyToken(
            event.authorizationToken,
            'DmTzHmYnZEPg5TP-Z_0-LKffh46mEaoMC1WmmbW1lBpic5Z7_ZgVU5ABxwH-nzvY'
        )
        console.log('User was authorized')
    
        return{
            principalId: decodedToken.sub,
            policyDocument: {
                Version: '2012-10-17',
                Statement: [
                    {
                        Action: 'execute-api:Invoke',
                        Effect: 'Allow',
                        Resource: '*'
                    }
                ]
            }
        }

    }catch(e){
        console.log('User was unauthorized', e.message)

        return{
            principalId: 'user',
            policyDocument: {
                Version: '2012-10-17',
                Statement: [
                    {
                        Action: 'execute-api:Invoke',
                        Effect: 'Deny',
                        Resource: '*'
                    }
                ]
            }
        }

    }
    
}

function verifyToken (authHeader: string, secret: string): JwtPayload {
    if (!authHeader)
        throw new Error('No authorization header')
    
    if (!authHeader.toLocaleLowerCase().startsWith('bearer '))    
        throw new Error('Invalid authorization header')

    const split = authHeader.split(' ')
    const token = split[1]
    console.log('token is ', token)

    
    return verify(token, secret) as JwtPayload
}

// handler.use(
//     secretsManager({
//         cache: true,
//         cacheExpiryMillis: 60000,
//         throwOnFailedCall: true,
//         secrets: {
//             AUTH0_SECRET: secretId
//         }
//     })
// )