<template>
  <div class="tr-customizer" @wheel="$refs.picker.visible = false">

    <ul class="tr-customizer__variables">
      <li
        v-for="(key, index) in sortedVariables"
        :key="`${version}-${key}`"
      >
        <label>
          <input
            type="radio"
            class="tr-customizer__color--input"
            v-popover="{ name: 'picker', position: index > 3 ? 'left' : 'bottom' }"
            :value="key"
            v-model="currentVariable"
          >
          <span
            class="tr-customizer__color"
            :style="{ backgroundColor: customVariables[key] || presetVariables[key] }"
          />
          <span class="tr-customizer__label">
            {{ key | toLabel }}
          </span>
        </label>
      </li>
    </ul>

    <portal to="picker">
      <popover
        ref="picker"
        name="picker"
        style="width: inherit"
      >
        <color-picker
          v-model="colors"
          @input="changeColors"
        />
      </popover>
    </portal>

  </div>
</template>

<script>
import { mapMutationState } from '@/store';
import colorPicker from 'vue-color/src/components/Chrome';
import CSSProcessor from '@/css-processor';
import util from '@/util';

const get = (re, s) => re.exec(s)[1].trim();
const reKey = /(--[-\w]+)\s*:/;
const reVal = /:(.*);\n/;

export default {
  name: 'TRCustomizer',
  components: { colorPicker },

  filters: {
    toLabel(string) {
      return util.toLabel(string).replace('Material', 'MD');
    },
  },

  data() {
    return {
      currentVariable: '',
      customVariablesSource: { },
      compiledTheme: '',
      colors: { },
    };
  },

  computed: {
    ...mapMutationState([
      'theme',
      'customVariables',
      'selectedCategory',
      'selectedPlatform',
      'version',
    ]),
    fixedTheme() {
      // Fix for a wrong Onsen UI CSS variable in <= 2.8.2
      return this.theme.replace('var(--input-border-color)', 'var(--border-color)');
    },
    presetVariables() {
      return (this.compiledTheme
        .match(/\s*--([-\w]+):\s+(.*);\n/img) || [])
        .reduce((result, variable) => ({
          [get(reKey, variable)]: get(reVal, variable),
          ...result,
        }), { });
    },
    categories() {
      return this.$store.getters.categories
        .map(c => c.toLowerCase()
          .replace('search input', 'search')
          .replace('select input', 'select')
          .trim()
          .replace(/\s+/, '-'));
    },
    sortedVariables() {
      const shared = [];
      const other = [];

      Object.keys(this.presetVariables)
        .forEach((v) => {
          const isShared = !this.categories
            .some(c => v.indexOf(c.toLowerCase()) !== -1);
          (isShared ? shared : other).push(v);
        });

      const sort = (arr) => {
        const raw = v => /material-/.test(v)
          ? `${v.replace('material-', '')}-`
          : v;

        return arr
          .map(v => [v, raw(v)])
          .sort((a, b) => a[1].localeCompare(b[1]))
          .map(i => i[0]);
      };

      return sort(shared).concat(sort(other));
    },
  },

  watch: {
    currentVariable(variable) {
      this.colors = this.customVariablesSource[variable]
        || { hex: this.presetVariables[variable] };
    },
    theme: {
      immediate: true,
      handler() {
        CSSProcessor
          .compileVariables(this.fixedTheme)
          .then((theme) => {
            this.compiledTheme = theme;
          });
      },
    },
  },

  methods: {
    changeColors(color) {
      this.customVariablesSource = {
        ...this.customVariablesSource,
        [this.currentVariable]: color,
      };

      const source = /hsv/i.test(color.source)
        ? 'rgba'
        : color.source;

      const value = source === 'hex'
        ? color[source]
        : `${source}(${source.split('')
          .map(l => /s|l/.test(l)
            ? `${(color[source][l] * 100).toFixed(2)}%`
            : +(color[source][l].toFixed(2)))})`;

      this.customVariables = {
        ...this.customVariables,
        [this.currentVariable]: value,
      };

      this.$emit('variable');
    },
  },
};
</script>

<style scoped>
.tr-customizer {

}

.tr-customizer__button {
  margin: 10px var(--content-padding);
}

.tr-customizer__button button {
  width: 100%;
  text-align: center;
}

.tr-customizer__variables {
  padding: 0 10px;
}

.tr-customizer__variables label {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  line-height: 26px;
  cursor: pointer;
  position: relative;
}

.tr-customizer__variables li:nth-child(even) {
  background-color: #f0f0f0;
}

.tr-customizer__label {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  display: inline-block;
  text-align: right;
}

.tr-customizer__color {
  width: 25px;
  height: 25px;
  display: inline-block;
  border: 1px solid #ccc;
  box-sizing: border-box;
}

.tr-customizer__color--input {
  visibility: hidden;
  width: 23px;
  height: 23px;
  position: absolute;
}
</style>
