<template>
  <div class="tr-header">
    <h1>Theme Roller</h1>
    <div class="tr-toolbar">
      <TRSelect
        width="80px"
        label="1. Onsen UI Version"
        :options="versions"
        @change="versionChange"
      />
      <TRSelect
        width="120px"
        label="2. Theme Preset"
        :options="themes.map(t => t.label)"
        :key-prefix="version"
        @change="themeChange"
      />
      <TRButton label="3. Customize" />
      <TRButton label="4. Download" />
    </div>
  </div>
</template>

<script>
import TRSelect from '@/components/TRSelect';
import TRButton from '@/components/TRButton';
import { mapMutationState } from '@/store';

export default {
  name: 'TRHeaderToolbar',

  components: {
    TRSelect,
    TRButton,
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
  margin-left: 10px;
}

.tr-toolbar {
  display: flex;

  & > * {
    margin-right: 30px;
  }
}
</style>
