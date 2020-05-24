import { Injectable } from '@angular/core';
import { Todo } from 'src/app/interfaces/Todo';
import { TodoListDataService } from '../todo-list-data/todo-list-data.service';
import { delay } from 'rxjs/operators';

@Injectable()
export class TodoListService {

  public isLoading: boolean = true;
  public savedTodoList: Todo[] = [];
  todos: Todo[];
  public todoList: Todo[] = [];
  todoTitle: string;
  idForTodo: number;
  beforeEditCache: string;


  constructor(
    private _todoListDataService: TodoListDataService
  ) {
    this._todoListDataService.todoList$
    .pipe(
      delay(1000)
    )
    .subscribe((todoList: Todo[]) => {
      this.initTodoList(todoList);
    });
    this.todoTitle = '';
    this.idForTodo = 1;
    this.todos = [];
    this.beforeEditCache = '';


   }

   private initTodoList(todoList: Todo[]): void {
    this.todos = todoList;
    this.isLoading = false;
  }

   addTodo(): void {
    if (this.todoTitle.trim().length === 0) {
      return;
    }
    this.todos.push({
      id: this.idForTodo,
      title: this.todoTitle,
      completed: false,
      editing: false
    })
    
    this.todoTitle = '';
    this.idForTodo++;
  }

  public editTodo(todo: Todo): void {
    this.beforeEditCache = todo.title;
    todo.editing = true;
  }

  public doneEdit(todo: Todo): void {
    if (todo.title.trim().length === 0) {
      todo.title = this.beforeEditCache;
    }

    todo.editing = false;
  }

  public cancelEdit(todo: Todo): void {
    todo.title = this.beforeEditCache;
    todo.editing = false;
  }

  public deleteTodo(id: number): void {
    this.todos = this.todos.filter(todo => todo.id !== id);
  }

  public remaining(): number {
    return this.todos.filter(todo => !todo.completed).length;
  }

  public checkAllTodos(): void {
    this.todos.forEach(todo => todo.completed = (<HTMLInputElement>event.target).checked)
  }

  public save(): void {
     this.savedTodoList = this.todos.map((todos: Todo) => {
       const currentTodo: Todo = this.todoList.find((otherTodo: Todo) => otherTodo.id === todos.id);
       return currentTodo || todos;
     });
     this._todoListDataService.saveTodoList(this.savedTodoList);
   }
 
}