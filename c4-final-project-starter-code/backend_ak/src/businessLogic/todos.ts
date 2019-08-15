import * as uuid from 'uuid'

import { TodoItem } from '../models/TodoItem'
import { TodoAccess } from '../dataLayer/todosAccess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest';
import { parseUserId } from '../auth/utils'
// import { Jwt } from '../auth/Jwt';

const bucketName = process.env.ATTACHMENTS_S3_BUCKET

const todoAccess = new TodoAccess()

export async function getAllTodos(): Promise<TodoItem[]> {
  return todoAccess.getAllTodos()
}

export async function createTodo(
  createTodoRequest: CreateTodoRequest,
  jwtToken: string
): Promise<TodoItem> {

  const itemId = uuid.v4()
  const userId = parseUserId(jwtToken)
  // const userId = '123456789' 

  return await todoAccess.createTodo({
    userId: userId,
    todoId: itemId,
    name: createTodoRequest.name,
    createdAt: new Date().toISOString(),
    dueDate: createTodoRequest.dueDate,
    done: createTodoRequest.done,
    attachmentUrl: `https://${bucketName}.s3.amazonaws.com/${itemId}`
  })
}

export async function updateTodo(todoId: string,
    updateTodoRequest: UpdateTodoRequest,
    jwtToken: string
  ): Promise<TodoItem> {
  
    // const userId = getUserId(jwtToken)
    const userId = parseUserId(jwtToken)
    // const userId = '123456789' 
  
    return await todoAccess.updateTodo({
      userId: userId,
      todoId: todoId,
      name: updateTodoRequest.name,
      createdAt: new Date().toISOString(),
      dueDate: updateTodoRequest.dueDate,
      done: updateTodoRequest.done
    })
  }

  export async function deleteTodo(todoId: string) {
    return todoAccess.deleteTodo(todoId)
  }  
