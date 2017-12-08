<template>
  <div class="tr-side">
    <div>Components List</div>
    <button @click="refresh">Refresh</button>
    <ul>
      <li
        v-for="component in componentsList"
        :key="`${version}-${component}`"
      >
        <label>
          <input
            type="checkbox"
            :value="component"
            v-model="selectedComponents"
          >
          <span>{{ component }}</span>
        </label>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapMutationState } from '@/store';
import util from '@/util';

const re = /(global|util|combination)/i;

export default {
  name: 'Placeholder',
  data() {
    return {
      selectedComponents: [],
    };
  },
  computed: {
    ...mapMutationState(['version', 'fullComponentsIndex', 'customComponentsIndex']),
    componentsList() {
      return (this.fullComponentsIndex
        .match(/'([./-\w]+)\.css'/img) || [])
        .filter(m => !re.test(m))
        .map(m => util.toLabel(m.slice(3, -5)))
        .sort();
    },
  },

  watch: {
    componentsList(value) {
      this.selectedComponents = [...value];
    },
  },

  methods: {
    refresh() {
      const includedComponents = this.selectedComponents.map(c => `${util.toId(c)}.css`);
      this.customComponentsIndex = this.fullComponentsIndex
        .split('\n')
        .filter(line => re.test(line) || includedComponents.some(c => line.indexOf(c) !== -1))
        .join('\n');
    },
  },
};
</script>

<style scoped>
.tr-side {

}
</style>
