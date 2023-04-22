export interface RetrieveTodosRequest {
	pageSize: number
	lastItemKey: Key | null
	orderBy: string
	sortBy: string
	filterBy: Filter | null
}

export interface Key {
	[key: string]: any
}

interface Filter {
	key: string
	value: string
}