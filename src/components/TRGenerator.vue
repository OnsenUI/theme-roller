<template>
  <div class="tr-generator">
    <div class="tr-generator__message">
      You can also remove the components you don't
      you need from your custom CSS stylesheet.
      What should be included?
    </div>

    <ul class="tr-generator__components" :class="xclass">
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
            <span>{{ component | capitalizeAll }}</span>
          </a>
        </label>
      </li>
    </ul>

    <div class="tr-generator__toolbar">
      <TRButton
        icon="download"
        label="Generate and Download"
        @click="generate"
      />
    </div>

  </div>
</template>

<script>
import CSSProcessor from '@/css-processor';
import TRButton from '@/components/TRButton';
import { mapMutationState } from '@/store';
import util from '@/util';

const re = /(global|util|combination)/i;

export default {
  name: 'TRGenerator',
  components: { TRButton },
  filters: {
    capitalizeAll(string) {
      return util.capitalizeAll(string);
    },
  },
  props: {
    xclass: {
      type: String,
      default: '',
    },
  },
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

}
.tr-generator__message {
  padding: 6px 60px 0 var(--content-padding);
  margin-bottom: calc(var(--content-padding) / 2);
}

.tr-generator__toolbar {
  padding: var(--content-padding);
  display: flex;
  justify-content: flex-end;
}

.tr-generator__components {
  padding: 0;
  margin: 0;
  border-top: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
  padding: calc(var(--content-padding) / 2);
  height: 300px;

  & li:hover {
    background-color: var(--list-item-hover);
  }
}

.tr-generator__components a {
  @apply --list-item;
  justify-content: flex-start;

  & span {
    padding-left: calc(var(--content-padding) / 2);
  }
}
</style>
