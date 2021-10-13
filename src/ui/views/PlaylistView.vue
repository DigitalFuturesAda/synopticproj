<template>
  <div class = "playlistView">
    <div class = "playlistViewWrapper">
      <!--
        This component should only contain the Album name, artist,
        the rest should be abstracted away into a PlaylistComponent
        which takes an array of AudioFile's

        The PlaylistComponent should display the:
          - Album art
          - Song name
          - Icon to add to queue (this should be hidden if queue === true)
          - Icon to add to playlist
      -->
    </div>
  </div>
</template>

<script lang="ts">
  import {Vue} from 'vue-property-decorator';

  export default class PlaylistView extends Vue {

  }
</script>

<style scoped lang="stylus">
  $background = #353b48
  $secondary = lighten($background, 20%)
  $background_darken = darken($background, 20%)

  .playlistView
    height: 100%
    width: 100%
    max-height 100%

    .playlistViewWrapper
      padding-top: 30px
      margin-left: 30px;
      margin-right: 30px;
</style>