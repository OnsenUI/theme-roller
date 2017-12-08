<template>
  <div class="tr-header">
    <h1>Theme Roller</h1>
    <div class="tr-toolbar">
      <TRSelect
        width="80px"
        label="Onsen UI Version"
        :options="versions"
        @change="versionChange"
      />
      <TRSelect
        width="120px"
        label="Theme Preset"
        :options="themes.map(t => t.label)"
        :key-prefix="version"
        @change="themeChange"
      />
    </div>
  </div>
</template>

<script>
import TRSelect from '@/components/TRSelect';
import { mapMutationState } from '@/store';

export default {
  name: 'TRHeaderToolbar',

  components: {
    TRSelect,
  },

  computed: {
    ...mapMutationState(['version', 'versions', 'themes']),
  },

  methods: {
    versionChange(event) {
      this.$emit('version', this.versions[event.target.value] || '');
    },
    themeChange(event) {
      this.$emit('theme', this.themes[event.target.value].theme.name);
    },
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
