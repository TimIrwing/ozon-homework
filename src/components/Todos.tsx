import { Component, Prop } from 'vue-property-decorator';
import { useStore } from 'vuex-simple';
import { RootStore } from '@/store';
import { Todo } from '@/store/modules/Todos';

import Card from '@/components/Card';
import VueComponent from '../shims-vue';

import styles from './Todos.css?module';

@Component
export default class Todos extends VueComponent<{ date: Date }> {
  store: RootStore = useStore(this.$store)

  @Prop({ default: () => new Date() })
  private date!: Date;

  get todos(): Todo[] {
    return this.store.todos.getTodos(this.date);
  }

  addTodo = this.store.todos.addTodo;

  toggleTodo(todo: Todo): void {
    this.store.todos.toggleTodo([this.date, todo]);
  }

  get todosMarkup(): JSX.Element {
    return (
      <ul class={styles.list}>
        {
          this.todos.map((todo: Todo) => (
            <li class={styles.listItem}>
              <label class={styles.label}>
                 <input
                  class={'visuallyhidden'}
                  type="checkbox"
                  checked={todo.done}
                  onChange={this.toggleTodo.bind(this, todo)}
                 />
                 <span class={[
                   styles.fakeCheckbox,
                   todo.done && styles.fakeCheckbox_checked,
                 ]}/>
                 <span class={todo.done && styles.text_done}>{todo.text}</span>
              </label>
            </li>
          ))
        }
      </ul>
    );
  }

  keydownHandler({ key, target }: KeyboardEvent): void {
    if (key.toLowerCase() === 'enter') {
      this.addTodo([
        this.date,
        { text: (target as HTMLInputElement).value },
      ]);

      // eslint-disable-next-line no-param-reassign
      (target as HTMLInputElement).value = '';
    }
  }

  render(): JSX.Element {
    return (
      <Card>
        <p class={styles.title}>События - {this.date.toLocaleDateString('ru-RU')}</p>

        {this.todosMarkup}

        <input class={styles.input} type="text" placeholder="Текст" onKeydown={this.keydownHandler}/>
      </Card>
    );
  }
}
