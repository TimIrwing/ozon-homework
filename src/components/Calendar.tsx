import { Component } from 'vue-property-decorator';
import { useStore } from 'vuex-simple';
import { RootStore } from '@/store';
import VueComponent from '../shims-vue';

import styles from './Calendar.css?module';

@Component
export default class Calendar extends VueComponent {
  store: RootStore = useStore(this.$store);

  weekDay = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

  monthName = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']

  currentMonth = this.store.calendar.selectedDate.getMonth();

  currentYear = this.store.calendar.selectedDate.getFullYear();

  setMonthToPrev(): void {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear -= 1;
    } else {
      this.currentMonth -= 1;
    }
  }

  setMonthToNext(): void {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear += 1;
    } else {
      this.currentMonth += 1;
    }
  }

  setSelectedDay(day: number) {
    this.store.calendar.setSelectedDate(new Date(this.currentYear, this.currentMonth, day));
  }

  get monthMarkup() {
    const result = [];
    const daysCount = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    const firstDayName = new Date(this.currentYear, this.currentMonth, 1)
      .toLocaleString('ru-RU', { weekday: 'short' });

    // grid padding for days to align with their names
    this.weekDay.some((day) => {
      if (firstDayName === day.toLowerCase()) {
        return true;
      }
      return result.push(<span/>) && false;
    });

    // actual days markup
    for (let i = 1; i <= daysCount; i += 1) {
      result.push(
        <span><button onClick={ this.setSelectedDay.bind(this, i) }>{ i }</button></span>,
      );
    }

    return result;
  }

  render() {
    return (
      <div class={styles.hello}>
        <header>
          <span>{ this.monthName[this.currentMonth] } { this.currentYear }</span>
          <span>
            <button onClick={ this.setMonthToPrev }>{ '<' }</button>
            <button onClick={ this.setMonthToNext }>{ '>' }</button>
          </span>
        </header>
        <section>
          <div>
            { this.weekDay.map((day) => <span>{ day }</span>) }
          </div>
          <div>
            { this.monthMarkup }
          </div>
        </section>
      </div>
    );
  }
}
