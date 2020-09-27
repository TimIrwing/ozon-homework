import {
  Action, Getter, Mutation, State,
} from 'vuex-simple';

export enum actions {
  clear = 'c',
  minus = '-',
  plus = '+',
  result = '=',
}

function isAction(input: string) {
  return Number.isNaN(Number(input));
}

function someAsyncCalcFunction(arr: string[]): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      while (arr.length >= 3) {
        const [num1, action, num2] = arr.splice(0, 3);
        let tmp = 0;

        switch (action) {
          case actions.plus:
            tmp = Number(num1) + Number(num2);
            break;

          case actions.minus:
            tmp = Number(num1) - Number(num2);
            break;

          default:
        }

        arr.unshift(String(tmp));
      }

      resolve(arr.shift());
    }, 2000);
  });
}

export default class Calculator {
  @State()
  upperBuffer: string[] = [];

  @State()
  mainBuffer: string[] = [];

  @State()
  loading = false;

  get equalSignVisible(): boolean {
    return this.mainBuffer[0] === actions.result;
  }

  set equalSignVisible(val: boolean) {
    if (val && this.mainBuffer[0] !== actions.result) {
      this.mainBuffer.unshift(actions.result);
    } else if (this.mainBuffer[0] === actions.result) {
      this.mainBuffer.shift();
    }
  }

  @Getter()
  get lastItemIsAction(): boolean {
    const last = this.mainBuffer[this.mainBuffer.length - 1];
    return isAction(last);
  }

  @Action()
  addDigit(digit: number) {
    if (this.equalSignVisible) this.mainBuffer = [];

    if (this.lastItemIsAction || !this.mainBuffer.length) {
      this.mainBuffer.push(String(digit));
    } else {
      const number: string | undefined = this.mainBuffer.pop();
      if (number) this.mainBuffer.push(number + String(digit));
    }
  }

  @Action()
  action(action: string) {
    this.hideEqualSign();
    switch (action) {
      case actions.plus:
        this.pushAction(actions.plus);
        break;

      case actions.minus:
        this.pushAction(actions.minus);
        break;

      case actions.clear:
        this.clearBuffers();
        break;

      case actions.result:
        this.calculateResult();
        break;

      default:
    }
  }

  @Action()
  async calculateResult(): Promise<void> {
    if (this.mainBuffer.length < 3) return;
    try {
      this.loading = true;

      if (this.lastItemIsAction) this.mainBuffer.pop();
      const copy = [...this.mainBuffer];
      const result = await someAsyncCalcFunction(copy);

      this.upperBuffer = this.mainBuffer.map((part) => {
        if (isAction(part)) return part;
        return String(Number(part));
      });
      this.mainBuffer = [result];
      this.equalSignVisible = true;
    } catch (e) {
      console.error(e);
    } finally {
      this.loading = false;
    }
  }

  @Mutation()
  clearBuffers() {
    this.hideEqualSign();
    this.upperBuffer = [];
    this.mainBuffer = [];
  }

  @Mutation()
  pushAction(action: '+' | '-') {
    if (this.lastItemIsAction || !this.mainBuffer.length) return;

    this.mainBuffer.push(action);
  }

  @Mutation()
  hideEqualSign() {
    this.equalSignVisible = false;
  }
}
