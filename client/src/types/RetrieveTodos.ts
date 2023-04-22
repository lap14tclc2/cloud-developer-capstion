import { Key } from "./RetrieveTodoRequest"
import { Todo } from "./Todo"

export interface RetrieveTodosResponse {
	items: Todo[]
	lastItemKey: Key
}