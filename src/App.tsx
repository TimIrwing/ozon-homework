import { Component, Vue } from 'vue-property-decorator';

import './App.css';

import Calendar from '@/components/Calendar';

@Component
export default class App extends Vue {
  // eslint-disable-next-line class-methods-use-this
  render() {
    return (
      <div id="app">
        <Calendar/>
      </div>
    );
  }
}
