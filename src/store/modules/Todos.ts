import Vue from 'vue';
import {
  Action, Getter, Mutation, State,
} from 'vuex-simple';

function parseDate(date: Date): string {
  return `${date.getDate()}.${date.getMonth()}.${date.getFullYear()}`;
}

function formatText(text: string): string {
  return text.trim();
}

export interface Todo {
  text: string;
  done?: boolean;
}

export default class Todos {
  @State()
  private todos: Record<string, Todo[]> = Object.create(null);

  @Getter()
  public get hasTodo(): Function {
    return (date: Date): boolean => {
      const day = parseDate(date);
      return (day in this.todos) && !!this.todos[day].length;
    };
  }

  @Getter()
  public get getTodos(): Function {
    return (date: Date): Todo[] => {
      if (!this.hasTodo(date)) return [];

      return this.todos[parseDate(date)];
    };
  }

  @Action()
  public addTodo(payload: [Date, Todo]): void {
    const [date, todo] = payload;
    const formattedText = formatText(todo.text);
    const dayTodos = this.todos[parseDate(date)];

    if (!formattedText || dayTodos?.some(({ text }) => text === formattedText)) return;

    this.addTodoMutation(payload);
  }

  @Action()
  public toggleTodo(payload: [Date, Todo]): void {
    const [date, todo] = payload;
    const formattedText = formatText(todo.text);
    const dayTodos = this.todos[parseDate(date)];

    if (!dayTodos?.some(({ text }) => text === formattedText)) return;

    this.toggleTodoMutation(payload);
  }

  @Mutation()
  private addTodoMutation([date, todo]: [Date, Todo]) {
    const day = parseDate(date);

    if (!this.hasTodo(date)) {
      Vue.set(this.todos, day, []);
    }

    this.todos[day].push(todo);
  }

  @Mutation()
  private toggleTodoMutation([date, todo]: [Date, Todo]) {
    const dayTodos = this.todos[parseDate(date)];
    const todoInStore: Todo | undefined = dayTodos?.find(({ text }: Todo) => text === todo.text);

    if (todoInStore) {
      Vue.set(todoInStore, 'done', !todoInStore.done);
    }
  }
}
