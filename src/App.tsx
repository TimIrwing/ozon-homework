import { Component, Vue } from 'vue-property-decorator';

import './App.css';

import Calendar from '@/components/Calendar';
import Todos from '@/components/Todos';
import Calculator from '@/components/Calculator';

@Component
export default class App extends Vue {
  selectedDate: Date = new Date();

  render() {
    return (
      <div id="app">
        <section class="calendar-container">
          <Calendar
            value={this.selectedDate}
            onChange={(newDate: Date) => { this.selectedDate = newDate; }}
          />
          <Todos date={this.selectedDate}/>
        </section>
        <Calculator/>
      </div>
    );
  }
}
