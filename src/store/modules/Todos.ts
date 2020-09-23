import { Getter, Mutation, State } from 'vuex-simple';

function parseDate(date: Date): string {
  return `${date.getDate()}.${date.getMonth()}.${date.getFullYear()}`;
}

export interface Todo {
  done: boolean;
  text: string;
}

export default class Todos {
  @State()
  private todos: Record<string, Todo[]> = Object.create(null);

  @Getter()
  public get hasTodo(): Function {
    return (date: Date): boolean => parseDate(date) in this.todos;
  }

  @Getter()
  public get getTodos(): Function {
    return (date: Date): Todo[] => {
      if (!this.hasTodo(date)) return [];

      return this.todos[parseDate(date)];
    };
  }

  @Mutation()
  public addTodo(date: Date, todo: Todo): void {
    const key = parseDate(date);

    if (this.hasTodo(date)) {
      this.todos[key].push(todo);
    } else {
      this.todos[key] = [todo];
    }
  }
}
