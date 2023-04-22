import { TodoItem } from "../models/TodoItem";
import { Key } from "../requests/RetrieveTodosRequest";

export interface RetrieveTodosResponse {
	items: TodoItem[]
	lastItemKey: Key
}