import { Mutation, State } from 'vuex-simple';

export default class Calendar {
  @State()
  public selectedDate = new Date();

  @Mutation()
  setSelectedDate(date: Date) {
    this.selectedDate = date;
  }
}
