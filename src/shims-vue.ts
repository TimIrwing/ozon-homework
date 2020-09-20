import Vue from 'vue';

type CSSClass = (string | {
    [key: string]: string;
})

export default class VueComponent<Props = {}> extends Vue {
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  public $props: Props & {
        key?: string;
        class?: CSSClass | CSSClass[];
    }
}
