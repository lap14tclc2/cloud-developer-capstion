import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'
import { GetTodosRequest } from '../requests/RetrieveTodosRequest'
import { RetrieveTodosResponse } from '../responses/RetrieveTodosResponse'
//import { TodoUpdate } from '../models/TodoUpdate';

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodosAccess')

// TODO: Implement the dataLayer logic

export class TodosAccess {
	constructor(
		private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
		private readonly todosTable = process.env.TODOS_TABLE,
		private readonly todosIndex = process.env.TODOS_CREATED_AT_INDEX
	) { }

	async getAllTodos(userId: string): Promise<TodoItem[]> {
		logger.info('Get all todos item')

		const result = await this.docClient
			.query({
				TableName: this.todosTable,
				IndexName: this.todosIndex,
				KeyConditionExpression: 'userId = :userId',
				ExpressionAttributeValues: {
					':userId': userId
				}
			}).promise()

		const items = result.Items
		return items as TodoItem[]
	}


	async retrieveTodos(userId: string, params: GetTodosRequest): Promise<RetrieveTodosResponse> {
		logger.info('Get all todos item')
		logger.info('params:', params)

		const FILTER_FIELDS = ['name']
		const SORT_BY_FIELD = 'name'
		const ORDER_BY_DESC = 'desc'

		const query: DocumentClient.QueryInput = {
			TableName: this.todosTable,
			IndexName: this.todosIndex,
			KeyConditionExpression: 'userId = :userId',
			ExpressionAttributeValues: {
				':userId': userId
			},
			Limit: params.pageSize
		}

		query.ScanIndexForward = params.orderBy?.toLocaleLowerCase() == ORDER_BY_DESC

		if (params.lastItemKey) {
			query.ExclusiveStartKey = params.lastItemKey
		}


		if (FILTER_FIELDS.includes(params.filterBy?.key?.toLocaleLowerCase())) {
			query.FilterExpression = 'contains (#name, :name)'
			query.ExpressionAttributeNames = {
				'#name': 'name'
			}

			query.ExpressionAttributeValues = {
				':userId': userId,
				':name': params.filterBy.value
			}
		}

		const result = await this.docClient
			.query(query).promise()

		let items = result.Items as TodoItem[]
		const lastKey = result.LastEvaluatedKey

		if (params.sortBy == SORT_BY_FIELD) {
			items = items.sort((a, b) => a.name.localeCompare(b.name))
		}

		return {
			items: items,
			lastItemKey: lastKey
		}
	}

	async createTodoItem(todoItem: TodoItem): Promise<TodoItem> {
		logger.info('Create new todo')

		const newItem = await this.docClient
			.put({
				TableName: this.todosTable,
				Item: todoItem
			})
			.promise()

		logger.info('Todo item created ', newItem)

		return todoItem
	}

	async updateTodoItem(userId: string, todoId: string, todoUpdate: TodoUpdate): Promise<TodoUpdate> {
		logger.info('update todo ')

		const response = await this.docClient
			.update({
				TableName: this.todosTable,
				Key: {
					todoId,
					userId
				},
				UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done',
				ExpressionAttributeValues: {
					':name': todoUpdate.name,
					':dueDate': todoUpdate.name,
					':done': todoUpdate.done,
				},
				ExpressionAttributeNames: {
					'#name': 'name'
				}
			}).promise()

		const result = response.Attributes

		logger.info(' todo is updated ', result)

		return result as TodoUpdate
	}

	async deleteTodoItem(userId: string, todoId: string): Promise<void> {
		logger.info('delete todo ')

		const result = await this.docClient
			.delete({
				TableName: this.todosTable,
				Key: {
					userId,
					todoId
				}
			}).promise()

		logger.info(' todo is deleted ', result)

	}
}