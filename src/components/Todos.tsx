import { Component, Prop } from 'vue-property-decorator';
import Card from '@/components/Card';
import VueComponent from '../shims-vue';

import styles from './Todos.css?module';

@Component
export default class Todos extends VueComponent<{ date: Date }> {
  @Prop({ default: () => new Date() })
  private date!: Date;

  render() {
    return (
      <Card>
        <p class={styles.todos__title}>События - { this.date.toLocaleDateString('ru-RU')}</p>
      </Card>
    );
  }
}
