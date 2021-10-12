<template>
  <div class="homePage">
    <AudioController/>
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
export default class Home extends Vue {}
</script>
