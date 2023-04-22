export interface GetTodosRequest {
	pageSize: number
	lastItemKey: Key
	orderBy: string
	sortBy: string
	filterBy: Filter
}

export interface Key {
	[key: string]: any
}

interface Filter {
	key: string
	value: string
}