<template>
  <div class="tr-customizer" @wheel="$refs.picker.visible = false">

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

    <ul class="tr-customizer__categories">
      <li
        v-for="(value, key) in presetVariables"
        :key="`${version}-${key}`"
        v-popover:picker.left
        @click="updateColorPicker(key)"
      >
        <label>
          <span
            class="tr-customizer__color"
            :style="{ backgroundColor: customVariables[key] || value }"
          />
          <span class="tr-customizer__label">
            {{ key | toLabel }}
          </span>
        </label>
      </li>
    </ul>

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
      return util.toLabel(string);
    },
  },

  data() {
    return {
      currentVariable: '',
      customVariablesSource: { },
      compiledTheme: '',
      colors: {
        hex: '#194d33',
      },
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
  },

  watch: {
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
    updateColorPicker(variable) {
      this.currentVariable = variable;
      this.colors = this.customVariablesSource[variable]
        || { hex: this.presetVariables[variable] };
    },
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

.tr-customizer__categories {
  padding: 0 10px;
}

.tr-customizer__categories label {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  line-height: 26px;
  cursor: pointer;
}

.tr-customizer__categories li:nth-child(even) {
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
</style>
