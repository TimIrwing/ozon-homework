import { Component, Vue } from 'vue-property-decorator';

import './App.css';

import Calendar from '@/components/Calendar';
import Todos from '@/components/Todos';

@Component
export default class App extends Vue {
  // eslint-disable-next-line class-methods-use-this
  render() {
    return (
      <div id="app">
        <section class="calendar-container">
          <Calendar/>
          <Todos date={new Date()}/>
        </section>
      </div>
    );
  }
}
