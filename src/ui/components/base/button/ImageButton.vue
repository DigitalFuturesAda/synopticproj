<template>
  <div class = "imageButton">
    <div class = "svgContainer">
      <template v-if = "disabled">
        <div style = "opacity: 0.5">
          <slot></slot>
        </div>
      </template>
      <template v-else>
        <slot></slot>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';

@Component
export default class ImageButton extends Vue {
  @Prop({ default: false }) readonly disabled!: boolean
}
</script>

<style scoped lang="stylus">

  $size = 40px;

  .imageButton
    padding: 7.5px

    .svgContainer
      width: $size;
      height: $size;

      svg
        width: $size;
        height: $size;
        margin: 0
</style>
