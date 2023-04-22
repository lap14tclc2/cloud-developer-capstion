import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import {
  createTodo,
  deleteTodo,
  getTodos,
  patchTodo,
  retrieveTodos
} from '../api/todos-api'
import Auth from '../auth/Auth'
import { Todo } from '../types/Todo'
import { RetrieveTodosRequest } from '../types/RetrieveTodoRequest'

interface TodosProps {
  auth: Auth
  history: History
}

interface TodosState {
  todos: Todo[]
  newTodoName: string
  searchTodoKeyword: string
  loadingTodos: boolean
  retrieveTodoParams: RetrieveTodosRequest
}

export class Todos extends React.PureComponent<TodosProps, TodosState> {
  state: TodosState = {
    todos: [],
    newTodoName: '',
    searchTodoKeyword: '',
    retrieveTodoParams: {
      pageSize: 3,
      filterBy: {
        key: '',
        value: ''
      },
      lastItemKey: null,
      orderBy: 'asc',
      sortBy: ''
    },
    loadingTodos: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newTodoName: event.target.value })
  }

  handleSearchKeywordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ searchTodoKeyword: event.target.value })
  }

  onEditButtonClick = (todoId: string) => {
    this.props.history.push(`/todos/${todoId}/edit`)
  }

  onSearchTodoByKeyword = async () => {
    const newParams = {
      lastItemKey: null,
      pageSize: 3,
      sortBy: '',
      filterBy: {
        key: 'name',
        value: this.state.searchTodoKeyword
      },
      orderBy: 'asc'
    } as RetrieveTodosRequest

    await this.setState({
      retrieveTodoParams: newParams
    })

    await this.loadTodoItems(true)
  }

  onChangeOrderTodosByTimestamp = async () => {
    const direction =
      this.state.retrieveTodoParams.orderBy === 'asc' ? 'desc' : 'asc'

    await this.setState({
      retrieveTodoParams: {
        ...this.state.retrieveTodoParams,
        orderBy: direction,
        sortBy: '',
        lastItemKey: null
      }
    })

    await this.loadTodoItems(true)
  }

  onSortTodosByName = async () => {
    await this.setState({
      retrieveTodoParams: {
        ...this.state.retrieveTodoParams,
        sortBy: 'name',
        orderBy: '',
        lastItemKey: null
      }
    })

    await this.loadTodoItems(true)
  }

  onTodoCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const dueDate = this.calculateDueDate()
      const newTodo = await createTodo(this.props.auth.getIdToken(), {
        name: this.state.newTodoName,
        dueDate
      })
      this.setState({
        todos: [...this.state.todos, newTodo],
        newTodoName: ''
      })
    } catch {
      alert('Todo creation failed')
    }
  }

  onTodoDelete = async (todoId: string) => {
    try {
      await deleteTodo(this.props.auth.getIdToken(), todoId)
      this.setState({
        todos: this.state.todos.filter((todo) => todo.todoId !== todoId)
      })
    } catch {
      alert('Todo deletion failed')
    }
  }

  onTodoCheck = async (pos: number) => {
    try {
      const todo = this.state.todos[pos]
      await patchTodo(this.props.auth.getIdToken(), todo.todoId, {
        name: todo.name,
        dueDate: todo.dueDate,
        done: !todo.done
      })
      this.setState({
        todos: update(this.state.todos, {
          [pos]: { done: { $set: !todo.done } }
        })
      })
    } catch {
      alert('Todo deletion failed')
    }
  }

  loadTodoItems = async (firstLoad = true) => {
    const params = this.state.retrieveTodoParams

    let todos: Todo[]

    const data = await retrieveTodos(this.props.auth.getIdToken(), params)
    const lastItemKey = data.items.length > 0 ? data.lastItemKey : null

    todos = firstLoad ? data.items : [...this.state.todos, ...data.items]

    this.setState({
      todos: todos,
      loadingTodos: false,
      retrieveTodoParams: { ...params, lastItemKey: lastItemKey }
    })
  }

  async componentDidMount() {
    try {
      await this.loadTodoItems(true)
    } catch (e) {
      alert(`Failed to fetch todos: ${(e as Error).message}`)
      this.setState({
        loadingTodos: false
      })
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">TODOs</Header>

        {this.renderCreateTodoInput()}

        {this.renderTodoActionButtons()}

        {this.renderTodos()}
      </div>
    )
  }

  renderTodoActionButtons() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'blue',
              labelPosition: 'left',
              icon: 'search',
              content: 'Search Todo By Name',
              onClick: this.onSearchTodoByKeyword
            }}
            fluid
            actionPosition="left"
            placeholder="search todo by name"
            onChange={this.handleSearchKeywordChange}
          />
        </Grid.Column>

        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>

        <Grid.Column textAlign="center" width={16}>
          <Button
            color="orange"
            onClick={() => this.onChangeOrderTodosByTimestamp()}
          >
            Order By Timestamp (ASC or DESC)
          </Button>

          <Button color="green" onClick={() => this.onSortTodosByName()}>
            Sort By Name
          </Button>
        </Grid.Column>

        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderCreateTodoInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'New task',
              onClick: this.onTodoCreate
            }}
            fluid
            actionPosition="left"
            placeholder="To change the world..."
            onChange={this.handleNameChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderTodos() {
    if (this.state.loadingTodos) {
      return this.renderLoading()
    }

    return this.renderTodosList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading TODOs
        </Loader>
      </Grid.Row>
    )
  }

  renderTodosList() {
    return (
      <Grid padded>
        {this.state.todos.map((todo, pos) => {
          return (
            <Grid.Row key={todo.todoId}>
              <Grid.Column width={1} verticalAlign="middle">
                <Checkbox
                  onChange={() => this.onTodoCheck(pos)}
                  checked={todo.done}
                />
              </Grid.Column>
              <Grid.Column width={10} verticalAlign="middle">
                {todo.name}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {todo.dueDate}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(todo.todoId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onTodoDelete(todo.todoId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {todo.attachmentUrl && (
                <Image
                  src={todo.attachmentUrl}
                  size="small"
                  wrapped
                  onError={(event: any) =>
                    (event.target.style.display = 'none')
                  }
                />
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}

        {this.state.retrieveTodoParams.lastItemKey && (
          <Grid.Column textAlign="center" width={16}>
            <Button primary onClick={() => this.loadTodoItems(false)}>
              Load More
            </Button>
          </Grid.Column>
        )}
      </Grid>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
