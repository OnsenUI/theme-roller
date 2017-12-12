<template>
  <div class="tr-generator">
    <div class="tr-generator__button">
      <button
        @click="generate"
      >
        Generate and download
      </button>
    </div>

    <div class="tr-generator__message">
      You can also remove the components you don't
      you need from your custom CSS stylesheet.
      What should be included?
    </div>

    <ul class="tr-generator__components">
      <li
        v-for="component in fullComponentsList"
        :key="`${version}-${component}`"
      >
        <label>
          <a>
            <input
              type="checkbox"
              :value="component"
              v-model="selectedComponents"
            >
            <span>{{ component }}</span>
          </a>
        </label>
      </li>
    </ul>
  </div>
</template>

<script>
import CSSProcessor from '@/css-processor';
import { mapMutationState } from '@/store';
import util from '@/util';

const re = /(global|util|combination)/i;

export default {
  name: 'TRGenerator',
  data() {
    return {
      components: null,
    };
  },
  computed: {
    ...mapMutationState([
      'fullComponentsIndex',
      'rootCSS',
      'theme',
      'version',
    ]),
    fullComponentsList() {
      return (this.fullComponentsIndex
        .match(/'([./-\w]+)\.css'/img) || [])
        .filter(m => !re.test(m))
        .map(m => util.toLabel(m.slice(3, -5)))
        .sort();
    },
    selectedComponents: {
      get() {
        return this.components
          ? this.components
          : this.fullComponentsList;
      },
      set(value) {
        this.components = value;
      },
    },
  },

  methods: {
    generate() {
      const includedComponents = this.selectedComponents
        .map(c => `${util.toId(c)}.css`);

      const index = this.fullComponentsIndex
        .split('\n')
        .filter(line => re.test(line)
          || includedComponents.some(c => line.indexOf(c) !== -1))
        .join('\n');

      const precss = CSSProcessor
        .replace(this.rootCSS, this.theme, index);

      CSSProcessor
        .compile(precss)
        .then((css) => {
          this.$log(css);
          alert('Check the console logs.'); // eslint-disable-line
        });
    },
  },
};
</script>

<style scoped>
.tr-generator {
  height: 100%;
  padding: var(--content-padding) calc(var(--content-padding) * 2);
}
.tr-generator__message {
  margin-top: 10px;
  padding-bottom: 0;
}

.tr-generator__button {
  margin-top: 10px;
}

.tr-generator__button button {
  width: 100%;
  text-align: center;
}

.tr-generator__components {
  padding: 0;
  margin-bottom: 10vh;
}

.tr-generator__components label {
  margin-top: 10px;
  display: block;
  width: 100%;
  height: 26px;
  line-height: 26px;
  cursor: pointer;
}

.tr-generator__components li:nth-child(even) {
  background-color: #f0f0f0;
}
</style>
