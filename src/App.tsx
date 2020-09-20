import { Component, Vue } from 'vue-property-decorator';

import logo from '@/assets/logo.png';
import './App.css';

import HelloWorld from './components/HelloWorld';

@Component
export default class App extends Vue {
  // eslint-disable-next-line class-methods-use-this
  render() {
    return (
      <div id="app">
        <img alt="Vue logo" src={logo} />
        <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/>
      </div>
    );
  }
}
