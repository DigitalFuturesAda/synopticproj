<template>
  <div class="home">
    <Player msg="Welcome to Your Vue.js + TypeScript App"/>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import Player from '@/ui/components/modules/player/Player.vue';

  @Component({
    components: {
      Player,
    },
  })
export default class Home extends Vue {}
</script>
