import { apiEndpoint } from '../config'
import { Todo } from '../types/Todo';
import { CreateTodoRequest } from '../types/CreateTodoRequest';
import Axios from 'axios'
import { UpdateTodoRequest } from '../types/UpdateTodoRequest';
import { RetrieveTodosRequest } from '../types/RetrieveTodoRequest';
import { RetrieveTodosResponse } from '../types/RetrieveTodos';

export async function getTodos(idToken: string): Promise<Todo[]> {
	console.log('Fetching todos')

	const response = await Axios.get(`${apiEndpoint}/todos`, {
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${idToken}`
		},
	})
	console.log('Todos:', response.data)
	return response.data.items
}

export async function retrieveTodos(idToken: string, params: RetrieveTodosRequest): Promise<RetrieveTodosResponse> {
	console.log('Retrive todos with params: ', params)

	const response = await Axios.post(`${apiEndpoint}/todos/retrieve`, JSON.stringify(params), {
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${idToken}`
		},
	})
	console.log('Todos:', response.data)
	return response.data as RetrieveTodosResponse
}


export async function createTodo(
	idToken: string,
	newTodo: CreateTodoRequest
): Promise<Todo> {
	const response = await Axios.post(`${apiEndpoint}/todos`, JSON.stringify(newTodo), {
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${idToken}`
		}
	})
	return response.data.item
}

export async function patchTodo(
	idToken: string,
	todoId: string,
	updatedTodo: UpdateTodoRequest
): Promise<void> {
	await Axios.patch(`${apiEndpoint}/todos/${todoId}`, JSON.stringify(updatedTodo), {
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${idToken}`
		}
	})
}

export async function deleteTodo(
	idToken: string,
	todoId: string
): Promise<void> {
	await Axios.delete(`${apiEndpoint}/todos/${todoId}`, {
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${idToken}`
		}
	})
}

export async function getUploadUrl(
	idToken: string,
	todoId: string
): Promise<string> {
	const response = await Axios.post(`${apiEndpoint}/todos/${todoId}/attachment`, '', {
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${idToken}`
		}
	})
	return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
	await Axios.put(uploadUrl, file)
}
