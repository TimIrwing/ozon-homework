import { Mutation, State } from 'vuex-simple';

export default class Calendar {
  @State()
  public today = new Date();

  @State()
  public selectedDate = this.today;

  @Mutation()
  setSelectedDate(date: Date) {
    this.selectedDate = date;
  }
}
