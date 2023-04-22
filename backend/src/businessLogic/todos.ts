import { TodosAccess } from "../dataLayer/todosAccess";
import { AttachmentUtils } from "../helpers/attachmentUtils";
import { TodoItem } from "../models/TodoItem";
import { TodoUpdate } from "../models/TodoUpdate";
import { CreateTodoRequest } from "../requests/CreateTodoRequest";
import { GetTodosRequest } from "../requests/RetrieveTodosRequest";
import { UpdateTodoRequest } from "../requests/UpdateTodoRequest";
import { RetrieveTodosResponse } from "../responses/RetrieveTodosResponse";
import { createLogger } from "../utils/logger";
import * as uuid from 'uuid'

const logger = createLogger('TodosAccess')
const todosAccess = new TodosAccess()
const attachmentUtils = new AttachmentUtils();

export async function getTodosForUser(userId: string): Promise<TodoItem[]> {
	logger.info('Get todos for user ', userId + ' called')

	return await todosAccess.getAllTodos(userId)
}

export async function retrieveTodos(userId: string, params: GetTodosRequest): Promise<RetrieveTodosResponse> {
	logger.info('Retrieve todos for user ', userId + ' called')

	return await todosAccess.retrieveTodos(userId, params)
}

export async function createTodo(newTodo: CreateTodoRequest, userId: string): Promise<TodoItem> {
	logger.info('Create todo function');

	const todoId = uuid.v4();
	const createdAt = new Date().toISOString();
	const s3AttachmentUrl = attachmentUtils.getAttachmentUrl(todoId);
	const newItem = {
		userId,
		todoId,
		createdAt,
		done: false,
		attachmentUrl: s3AttachmentUrl,
		...newTodo
	};

	return await todosAccess.createTodoItem(newItem);

}

export async function updateTodo(userId: string, todoId: string, updateTodo: UpdateTodoRequest): Promise<TodoUpdate> {
	logger.info(`Update todo ${todoId} for user: ${userId} called`)

	return await todosAccess.updateTodoItem(userId, todoId, updateTodo)
}

export async function deleteTodo(userId: string, todoId: string): Promise<void> {
	logger.info(`Delete todo ${todoId} for user: ${userId} called`)

	return await todosAccess.deleteTodoItem(userId, todoId)
}

export function createAttachmentPresignedUrl(userId: string, todoId: string): string {
	logger.info(`Generate attachment of todo ${todoId} for user: ${userId} called`)

	return attachmentUtils.getUploadUrl(todoId)
}