declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}

declare module "xns-seek-bar";

declare module '*.svg' {
  import Vue, {VueConstructor} from 'vue';
  const content: VueConstructor<Vue>;
  export default content;
}