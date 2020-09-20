import Vue from 'vue';
import Vuex from 'vuex';
import { createVuexStore, Module } from 'vuex-simple';

import Calendar from '@/store/modules/Calendar';
import Todo from '@/store/modules/Todo';
import Calculator from '@/store/modules/Calculator';

Vue.use(Vuex);

class RootStore {
  @Module()
  public calendar = new Calendar();

  @Module()
  public todo = new Todo();

  @Module()
  public calculator = new Calculator();
}

export default createVuexStore(new RootStore(), {
  strict: false,
});
