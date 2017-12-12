<template>
  <div class="tr-header">
    <h1 class="tr-header__title">{{ title }}</h1>

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
      <TRButton
        label="3. Customize"
        @click="$emit('customizer')"
      />
      <TRButton
        label="4. Download"
        @click="$emit('generator')"
      />
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

  props: {
    title: {
      type: String,
      default: 'Empty',
    },
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
  position: fixed;
  width: 100%;
  height: var(--toolbar-height);
  position: fixed;
  align-items: center;
  z-index: 10;
  display: flex;

  & > * {
    padding-top: 10px;
  }
}

.tr-header__title {
  width: var(--left-side-width);
  margin: 0;
  padding-left: var(--content-padding);
  box-sizing: border-box;
}

.tr-toolbar {
  margin-left: 30px;
  display: flex;

  & > * {
    margin-right: 30px;
  }
}
</style>
