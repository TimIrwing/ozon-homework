import { Component } from 'vue-property-decorator';
import VueComponent from '../shims-vue';

import styles from './Card.css?module';

@Component
export default class Card extends VueComponent {
  render() {
    return <div class={ styles.card }>{ this.$slots.default }</div>;
  }
}
