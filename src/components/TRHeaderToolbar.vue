<template>
  <div class="tr-header">
    <h1>Theme Roller</h1>
    <div class="tr-toolbar">
      <TRSelect
        label="Onsen UI Version"
        :options="versions"
        @change="$emit('version', versions[$event.target.value])"
      />
      <TRSelect
        label="Theme Preset"
        :options="themes.map(t => t.label)"
        @change="$emit('theme', themes[$event.target.value].theme)"
      />
    </div>
  </div>
</template>

<script>
import TRSelect from '@/components/TRSelect';
import { mapState } from 'vuex';

export default {
  name: 'TRHeaderToolbar',

  components: {
    TRSelect,
  },

  computed: {
    ...mapState(['versions', 'themes']),
  },
};
</script>

<style scoped>
.tr-header {
  margin: 10px var(--content-padding);
}

.tr-toolbar {
  display: flex;

  & > * {
    margin-right: var(--content-padding);
  }
}
</style>
