import Vue from 'vue';

type CSSClass = (string | {
    [key: string]: string;
})

export default class VueComponent<Props = {}> extends Vue {
  public $props!: Props & {
    onChange?: Function;
    key?: string;
    class?: CSSClass | CSSClass[];
  }
}
