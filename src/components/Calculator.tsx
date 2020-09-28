import { Component } from 'vue-property-decorator';
import { RootStore } from '@/store';
import { useStore } from 'vuex-simple';
import { actions } from '@/store/modules/Calculator';

import VueComponent from '../shims-vue';

import styles from './Calculator.css?module';

@Component
export default class Calculator extends VueComponent {
  store: RootStore = useStore(this.$store);

  get upperBuffer() {
    return this.store.calculator.upperBuffer;
  }

  get mainBuffer() {
    return this.store.calculator.mainBuffer;
  }

  get loading() {
    return this.store.calculator.loading;
  }

  addDigit = this.store.calculator.addDigit;

  calculatorAction = this.store.calculator.action;

  // eslint-disable-next-line class-methods-use-this
  getBufferMarkup(buffer: string[]): JSX.Element[] {
    return buffer.map((part: string) => <span class={styles.buffer__part}>{part}</span>);
  }

  get actionsMarkup(): JSX.Element[] {
    const actionsArr = Object.entries(actions) as [string, string][];
    return actionsArr.map(([name, action]): JSX.Element => (
      <button
        disabled={this.loading}
        class={[styles.button, styles.button_action, styles[`action_${name}`]]}
        onClick={this.calculatorAction.bind(this, action)}
      >
        {action.toUpperCase()}
      </button>
    ));
  }

  get digitsMarkup(): JSX.Element[] {
    return Array(10).fill(1).map((_, digit) => (
      <button
        disabled={this.loading}
        class={[styles.button, styles[`digit_${digit}`]]}
        onClick={this.addDigit.bind(this, digit)}
      >
        {digit}
      </button>
    ));
  }

  render(): JSX.Element {
    return (
      <section class={styles.container}>
        <span class={[styles.loading, this.loading && styles.loading_visible]}/>
        <div class={styles.screen}>
          <div class={[styles.buffer, styles.buffer_upper]}>
            {this.getBufferMarkup(this.upperBuffer)}
          </div>
          <div class={[styles.buffer, styles.buffer_main]}>
            {this.getBufferMarkup(this.mainBuffer)}
          </div>
        </div>
        <div class={styles.body}>
          {this.actionsMarkup}
          {this.digitsMarkup}
        </div>
      </section>
    );
  }
}
