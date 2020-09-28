import { Component, Emit, Prop } from 'vue-property-decorator';
import { RootStore } from '@/store';
import { useStore } from 'vuex-simple';

import Card from '@/components/Card';
import VueComponent from '../shims-vue';

import styles from './Calendar.css?module';

function isSameDay(date1: Date, date2: Date) {
  return date1.getFullYear() === date2.getFullYear()
      && date1.getMonth() === date2.getMonth()
      && date1.getDate() === date2.getDate();
}

@Component
export default class Calendar extends VueComponent<{ value: Date}> {
  store: RootStore = useStore(this.$store);

  today: Date = new Date();

  @Prop({ required: true })
  value!: Date;

  @Emit('change')
  setSelectedDay(date: Date): void {
    this.currentMonth = date.getMonth();
    this.currentYear = date.getFullYear();
  }

  weekDay: string[] = [
    'Пн',
    'Вт',
    'Ср',
    'Чт',
    'Пт',
    'Сб',
    'Вс',
  ];

  monthName: string[] = [
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь',
  ];

  currentMonth: number = this.value.getMonth();

  currentYear: number = this.value.getFullYear();

  hasTodo(date: Date): boolean {
    return this.store.todos.hasTodo(date);
  }

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

  getDayClasses(date: Date): string[] {
    const dayClasses: string[] = [];

    if (isSameDay(this.today, date)) dayClasses.push(styles.day_today);
    if (isSameDay(this.value, date)) dayClasses.push(styles.day_selected);
    if (this.hasTodo(date)) dayClasses.push(styles.day_hasTodo);
    if (date.getMonth() !== this.currentMonth) dayClasses.push(styles.day_differentMonth);

    return dayClasses;
  }

  get previousMonth(): JSX.Element[] {
    const result: JSX.Element[] = [];
    const date: Date = new Date(this.currentYear, this.currentMonth, 0);
    const daysCount: number = date.getDay();
    const lastDay: number = date.getDate();

    for (let i = 0; i < daysCount; i += 1) {
      result.push(
        this.getDayMarkup(new Date(this.currentYear, this.currentMonth - 1, lastDay - i)),
      );
    }

    return result.reverse();
  }

  get nextMonth(): JSX.Element[] {
    const result: JSX.Element[] = [];
    const date: Date = new Date(this.currentYear, this.currentMonth + 1, 1);
    // getDay() counts weekdays from Sunday, a lil trick to fix that
    let weekday: number = (date.getDay() + 6) % 7;

    for (let i = 1; weekday > 0 && weekday < 7; i += 1, weekday += 1) {
      result.push(
        this.getDayMarkup(new Date(this.currentYear, this.currentMonth + 1, i)),
      );
    }

    return result;
  }

  get weekdayMarkup(): JSX.Element[] {
    return this.weekDay.map(
      (day) => <span class={[styles.day_name, styles.grid__el]}>{day}</span>,
    );
  }

  get monthMarkup(): JSX.Element[] {
    const daysCount: number = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    const result: JSX.Element[] = [...this.previousMonth];

    for (let dayNumber = 1; dayNumber <= daysCount; dayNumber += 1) {
      const dayDate = new Date(this.currentYear, this.currentMonth, dayNumber);
      result.push(this.getDayMarkup(dayDate));
    }

    return result.concat(this.nextMonth);
  }

  getDayMarkup(date: Date): JSX.Element {
    const buttonClasses: string[] = [
      styles.day__button,
      ...this.getDayClasses(date),
    ];

    return (
      <span class={styles.day}>
        <button
          class={buttonClasses}
          onclick={this.setSelectedDay.bind(this, date)}
          key={date.toLocaleDateString('ru-RU')}
        >
            {date.getDate()}
        </button>
      </span>
    );
  }

  render(): JSX.Element {
    return (
      <Card class={styles.container}>
        <header class={styles.header}>
          <span>{this.monthName[this.currentMonth]} {this.currentYear}</span>
          <span>
            <button class={styles.header__button} onclick={this.setMonthToPrev}>{'<'}</button>
            <button class={styles.header__button} onclick={this.setMonthToNext}>{'>'}</button>
          </span>
        </header>
        <section class={styles.grid}>
            {this.weekdayMarkup}
            {this.monthMarkup}
        </section>
      </Card>
    );
  }
}
