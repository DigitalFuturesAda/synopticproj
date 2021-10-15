<template>
  <div id="app">
    <div class = "routerView">
      <router-view/>
    </div>

    <div class = "bottomElements">
      <audio-controller></audio-controller>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import AudioController from '@/ui/components/modules/player/AudioController.vue';

@Component({
  components: {
    AudioController,
  },
})
export default class AppRoot extends Vue {}
</script>

<style lang="stylus">
  @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=block');
  @import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:ital,wght@0,100;0,200;0,300;0,400;0,600;0,700;1,100;1,200;1,300;1,400&display=block');
  @import "~@/ui/config.styl"

  html, body
    margin 0
    padding 0
    background: $white
    font-family Poppins

  .swal2-confirm
    background-color: $orangePrimary !important
    border-left-color: $orangeSecondary !important
    border-right-color: $orangeSecondary !important

  .swal2-cancel
    background-color: $darkWhite !important
    color: $grey !important

  .swal2-input
    border-radius: 50px !important

  .swal2-content
    color: $darkSecondary !important
    font-family Poppins !important;
    font-size: $mediumFontSize !important
    font-weight: 400 !important
    margin: 0 !important

  html
    height: 100%

  body
    min-height: 100%

  #app
    display: grid
    grid-template-columns 1fr
    grid-template-rows auto min-content
    height: 100vh

    .routerView
      height: 100%
      overflow: scroll
</style>
