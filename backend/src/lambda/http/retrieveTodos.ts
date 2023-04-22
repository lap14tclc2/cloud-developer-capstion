import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { retrieveTodos } from '../../businessLogic/todos'
import { getUserId } from '../utils';
import { GetTodosRequest } from '../../requests/RetrieveTodosRequest'

// TODO: Get all TODO items for a current user
export const handler = middy(
	async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
		// Write your code here
		const params: GetTodosRequest = JSON.parse(event.body)

		const userId = getUserId(event)
		const response = await retrieveTodos(userId, params)

		return {
			statusCode: 200,
			body: JSON.stringify({
				items: response.items,
				lastItemKey: response.lastItemKey
			})
		}
	})

handler.use(
	cors({
		credentials: true
	})
)
