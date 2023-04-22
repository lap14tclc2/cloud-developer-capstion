This is capstone project for Udacity Cloud Developer Course. </br>
I reuse the source code of the project 4 and extend some small features on TODO like: </br>

- Pagination: The default number of items is 3. Freely to change it in FE code </br>
- Sort By Name </br>
- Filter By Name </br>
- Toggle the Order By Timestamp </br>

Note: 
- Before test these features, please add more Todo Item for easy testing them. </br>
- Check the screenshots as examples


GIT REPO: https://github.com/lap14tclc2/cloud-developer-capstion <br />

Endpoints:<br />

GET - https://s3c9jodw26.execute-api.us-east-1.amazonaws.com/dev/todos <br />
POST - https://s3c9jodw26.execute-api.us-east-1.amazonaws.com/dev/todos/retrieve<br />
POST - https://s3c9jodw26.execute-api.us-east-1.amazonaws.com/dev/todos<br />
PATCH - https://s3c9jodw26.execute-api.us-east-1.amazonaws.com/dev/todos/{todoId}<br />
DELETE - https://s3c9jodw26.execute-api.us-east-1.amazonaws.com/dev/todos/{todoId}<br />
POST - https://s3c9jodw26.execute-api.us-east-1.amazonaws.com/dev/todos/{todoId}/attachment<br />

functions:<br />
Auth: serverless-todo-app-dev-Auth (14 MB)<br />
GetTodos: serverless-todo-app-dev-GetTodos (14 MB)<br />
RetrieveTodos: serverless-todo-app-dev-RetrieveTodos (14 MB)<br />
CreateTodo: serverless-todo-app-dev-CreateTodo (14 MB)<br />
UpdateTodo: serverless-todo-app-dev-UpdateTodo (14 MB)<br />
DeleteTodo: serverless-todo-app-dev-DeleteTodo (14 MB)<br />
GenerateUploadUrl: serverless-todo-app-dev-GenerateUploadUrl (14 MB)<br />

