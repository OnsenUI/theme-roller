<template>
  <div class="tr-header">
    <h1>Theme Roller</h1>
    <div class="tr-toolbar">
      <TRSelect
        label="Onsen UI Version"
        :options="versions"
      />
      <TRSelect
        label="Theme Preset"
        :options="themeNames"
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
    themeNames() {
      const makeName = n => n.replace('-', ' ').replace(/(^|\s)([a-z])/g, m => m.toUpperCase());
      return this.themes.map((theme) => {
        const name = theme.name.split('.')[0];
        return name === 'theme' ? 'Default' : makeName(name);
      });
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
