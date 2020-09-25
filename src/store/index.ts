import Vue from 'vue';
import Vuex from 'vuex';
import { createVuexStore, Module } from 'vuex-simple';

import Todos from '@/store/modules/Todos';
import Calculator from '@/store/modules/Calculator';

Vue.use(Vuex);

export class RootStore {
  @Module()
  public todos = new Todos();

  @Module()
  public calculator = new Calculator();
}

export default createVuexStore(new RootStore(), {
  strict: false,
});
