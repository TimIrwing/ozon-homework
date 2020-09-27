import {
  Action, Getter, Mutation, State,
} from 'vuex-simple';

export enum actions {
  plus = '+',
  minus = '-',
  clear = 'C',
  result = '=',
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

  @State()
  equalSignVisible = false;

  @Getter()
  get bufferToRender(): string[] {
    if (this.equalSignVisible) {
      return [actions.result, ...this.mainBuffer];
    }
    return this.mainBuffer;
  }

  @Getter()
  get lastItemIsAction(): Function {
    return (): boolean => {
      const last = this.mainBuffer[this.mainBuffer.length - 1];
      return Number.isNaN(Number(last));
    };
  }

  @Action()
  addDigit(digit: number) {
    this.hideEqualsSign();

    if (this.lastItemIsAction || !this.mainBuffer.length) {
      this.mainBuffer.push(String(digit));
    } else {
      const number = this.mainBuffer.pop();
      if (number) this.mainBuffer.push(number + digit);
    }
  }

  @Action()
  action(action: string) {
    this.hideEqualsSign();
    switch (action) {
      case actions.plus:
        this.pushAction(actions.plus);
        break;

      case actions.minus:
        this.pushAction(actions.minus);
        break;

      case actions.clear:
        this.upperBuffer = [];
        this.mainBuffer = [];
        break;

      case actions.result:
        this.calculateResult();
        break;

      default:
    }
  }

  @Action()
  async calculateResult(): Promise<void> {
    try {
      this.loading = true;

      const copy = [...this.mainBuffer];

      if (this.lastItemIsAction) copy.pop();

      const result = await someAsyncCalcFunction(copy);

      this.upperBuffer = this.mainBuffer;
      this.mainBuffer = [result];
      this.equalSignVisible = true;
    } catch (e) {
      console.error(e);
    } finally {
      this.loading = false;
    }
  }

  @Mutation()
  pushAction(action: '+' | '-') {
    if (this.lastItemIsAction || !this.mainBuffer.length) return;

    this.mainBuffer.push(action);
  }

  @Mutation()
  hideEqualsSign() {
    this.equalSignVisible = false;
  }
}
