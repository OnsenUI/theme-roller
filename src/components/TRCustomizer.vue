<template>
  <div
    class="tr-customizer"
    @wheel="$refs.picker && ($refs.picker.visible = false)"
  >
    <div class="tr-customizer__toolbar top">
      <TRButton
        icon="pencil"
        label="Bulk Edit"
        @click="$modal.show('bulk')"
      />

      <TRButton
        label="Clear"
        inverted
        @click="saveVars(null, null); currentVar = ''"
      />

      <TRCloseButton @click="showCustomizer = false" />
    </div>

    <modal
      name="bulk"
      reset
      height="auto"
      width="800px"
    >
      <div class="tr-customizer__bulk">
        <TRCloseButton @click="$modal.hide('bulk')" />

        <div class="tr-customizer__bulk--editor">
          <textarea
            id="bulkEditor"
            v-model="bulkContent"
          />
        </div>

        <div class="tr-customizer__toolbar">
          <span>
            Any <a href="http://cssnext.io/features/" target="_blank">cssnext</a> color feature can be used here.
          </span>

          <TRButton
            label="Restore"
            inverted
            @click="restoreBulk"
          />

          <TRButton
            style="margin-left: 12px;"
            label="Save changes"
            :loading="loading === 4"
            @click="saveBulk()"
          />
        </div>

      </div>
    </modal>

    <div class="tr-customizer__scrollable scrollable">

      <ul class="tr-customizer__variables">
        <li
          v-for="(key, index) in visibleVars"
          :key="`${version}-${key}`"
          :class="{
            'separator-first': index === 0,
            'separator-components': index === commonVars.length
          }"
        >
          <label>
            <a>
              <span
                class="tr-customizer__color"
              >
                <input
                  type="radio"
                  v-popover.left="{ name: 'picker' }"
                  :value="key"
                  v-model="currentVar"
                >

                <span />

                <span
                  :style="{
                    backgroundColor: compiledCustomVars[key]
                      || compiledOriginalVars[key]
                  }"
                />
              </span>

              <span class="tr-customizer__label">
                {{ key | toLabel }}
              </span>

              <span
                class="tr-customizer__indicator tooltip-left"
                :style="{
                  backgroundColor: isLinkedVar(key) ? '#ccc' : '#666'
                }"
                :data-tooltip="isLinkedVar(key)
                  ? 'Normal variable'
                  : 'Reference variable'
                "
              />
            </a>
          </label>
        </li>
      </ul>
    </div>


    <div class="tr-customizer__toolbar bottom">
      <TRButton

        icon="download"
        label="Download"
        class="tr-customizer__download"
        @click="$emit('generator')"
      />
    </div>

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
import TRButton from '@/components/TRButton';
import TRCloseButton from '@/components/TRCloseButton';
import colorPicker from 'vue-color/src/components/Chrome';
import CSSProcessor from '@/css-processor';
import util from '@/util';

const get = (re, s) => re.exec(s)[1].trim();
const reKey = /(--[-\w]+)\s*:/;
const reVal = /:(.*);\n/;

const themeToVars = (string = '') =>
  (string
    .match(/\s*--([-\w]+):\s+(.*);\n/img) || [])
    .reduce((result, variable) => ({
      [get(reKey, variable)]: get(reVal, variable),
      ...result,
    }), { });

export default {
  name: 'TRCustomizer',
  components: {
    colorPicker,
    TRButton,
    TRCloseButton,
  },

  filters: {
    toLabel(string) {
      return util.toLabel(string)
        .replace('material', 'MD');
    },
  },

  data() {
    return {
      bulkContent: '',
      customTheme: '',
      compiledCustomVars: { },
      compiledCustomTheme: '',
      componentsVars: [],
      commonVars: [],
      currentVar: '',
      compiledTheme: '',
      colors: '#fff',
    };
  },

  computed: {
    ...mapMutationState([
      'customVars',
      'loading',
      'selectedCategory',
      'selectedPlatform',
      'showCustomizer',
      'theme',
      'version',
    ]),

    // Fix for a wrong Onsen UI CSS variable in <= 2.8.2
    fixedTheme() {
      return this.theme.replace('var(--input-border-color)', 'var(--border-color)');
    },

    // Uncompiled preset variables
    originalVars() {
      return this.fixedTheme
        ? themeToVars(this.fixedTheme)
        : {};
    },

    // Show colors in squared preview
    compiledOriginalVars() {
      return this.compiledTheme
        ? themeToVars(this.compiledTheme)
        : {};
    },

    // Prerequisite for filtering variables by category
    categories() {
      return this.$store.getters.categories
        .map(c => c.toLowerCase()
          .replace('search input', 'search')
          .replace('select input', 'select')
          .trim()
          .replace(/\s+/, '-'));
    },

    // Filter step 1: categories
    categoryFilteredVars() {
      let category = this.selectedCategory
        .trim().toLowerCase().replace(/\s+/, '-');

      // Fix: search-input and select-input variables
      if (category.indexOf('-input') !== -1 && category !== 'text-input') {
        [category] = category.split('-');
      }

      const categorySet = [category];

      // Fix: add button-bar to segment category
      if (category === 'segment') {
        categorySet.push('button-bar');
      }

      return this.componentsVars
        .filter(v => categorySet
          .some(c => v.indexOf(`--${c}`) !== -1
            || v.indexOf(`--material-${c}`) !== -1));
    },

    // Filter step 2: platform
    filteredVars() {
      return this.selectedPlatform === 'All'
        ? this.categoryFilteredVars
        : this.categoryFilteredVars
          .filter((v) => {
            const md = v.indexOf('material') !== -1;
            return (md && this.selectedPlatform === 'Android')
              || (!md && this.selectedPlatform === 'iOS');
          });
    },

    // Filter step 3: combine variables
    visibleVars() {
      return this.commonVars.concat(this.filteredVars);
    },
  },

  watch: {
    // Split unfilterable and filterable variables
    compiledOriginalVars() {
      this.splitVars();
    },
    categories() {
      this.splitVars();
    },

    // Selected variable showing color picker
    currentVar(variable) {
      this.colors = this.compiledCustomVars[variable]
        || this.compiledOriginalVars[variable];
    },

    // On theme preset change, compile and update
    theme: {
      immediate: true,
      handler() {
        this.customTheme = this.fixedTheme;
        this.bulkContent = this.fixedTheme;
        CSSProcessor
          .compileVariables(this.fixedTheme)
          .then((theme) => {
            this.compiledTheme = theme;
          });
      },
    },
  },

  methods: {
    splitVars() {
      if (Object.keys(this.compiledOriginalVars).length === 0 || this.categories.length === 0) {
        return; // Initial perf
      }

      const common = [];
      const other = [];

      Object.keys(this.compiledOriginalVars)
        .forEach((v) => {
          const isShared = !this.categories
            .some(c => v.indexOf(c.toLowerCase()) !== -1);

          (isShared ? common : other)
            .push(v);
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

      this.commonVars = sort(common); // Unfilterable
      this.componentsVars = sort(other); // Filterable
    },

    // Parse picker color
    changeColors(color) {
      const source = /hsv/i.test(color.source)
        ? 'rgba'
        : color.source;

      const value = source === 'hex'
        ? color[source]
        : `${source}(${source.split('')
          .map(l => /s|l/.test(l)
            ? `${(color[source][l] * 100).toFixed(2)}%`
            : +(color[source][l].toFixed(2)))})`;

      this.saveVars(value);
    },

    // Update or clear variables and compile
    saveVars(value) {
      if (typeof value === 'string') {
        this.customVars = {
          ...this.customVars,
          [this.currentVar]: value,
        };
      } else {
        this.customVars = value || {};
      }

      if (!value) {
        // Clear
        this.customTheme = this.fixedTheme;
        this.bulkContent = this.customTheme;
        this.compiledCustomVars = {};
        this.compiledCustomTheme = '';
        this.$emit('variable');
      } else {
        // Update with new value
        const re = new RegExp(`${this.currentVar}\\s*:.*;\\n`, 'img');
        this.customTheme = (this.customTheme || this.fixedTheme)
          .replace(re, `${this.currentVar}: ${value};\n`);

        CSSProcessor
          .compileVariables(this.customTheme)
          .then((theme) => {
            this.compiledCustomTheme = theme;
            const compiledVars = themeToVars(theme);
            const vars = {};

            Object.keys(compiledVars)
              .forEach((v) => {
                if (compiledVars[v] !== this.compiledOriginalVars[v]) {
                  vars[v] = compiledVars[v];
                }
              });

            this.compiledCustomVars = vars;
            this.bulkContent = this.customTheme;
            this.$emit('variable');
          });
      }
    },

    // Restore button
    restoreBulk() {
      this.bulkContent = this.customTheme;
    },

    // Extract changed variables and compile
    saveBulk() {
      if (this.bulkContent !== this.customTheme) {
        this.loading = 4;
        CSSProcessor
          .compileVariables(this.bulkContent)
          .then((theme) => {
            this.compiledCustomTheme = theme;
            this.compiledCustomVars = themeToVars(theme);
            this.customVars = themeToVars(this.bulkContent);
            this.customTheme = this.bulkContent;
            this.$modal.hide('bulk');
            this.$emit('variable');
          });
      } else {
        this.$modal.hide('bulk');
      }
    },

    isLinkedVar(key) {
      return (this.customVars[key] || this.originalVars[key] || '')
        .indexOf('var') === -1;
    },
  },
};

// ESLint complains about CSS length...
/* eslint-disable max-len */
</script>

<style scoped>
.tr-customizer {
  height: 100%;
  border-left: 1px solid var(--border-color);
}

.tr-customizer__toolbar {
  height: var(--toolbar-height);
  display: flex;
  align-items: center;
  box-sizing: border-box;
  padding: 0 var(--content-padding);
  & > a:not(:first-child) {
    margin-left: 20px;
  }

  /* Modifiers */
  &.top {
    border-bottom: 1px solid var(--border-color);
  }
  &.bottom {
    border-top: 1px solid var(--border-color);
  }
}

.tr-customizer__scrollable {
  height: calc(100% - var(--toolbar-height) * 2 - var(--scroll-extra));
}

.tr-customizer__variables {
  margin: 0;
  padding: 22px 10px 6px;

  & li:hover {
    background-color: var(--list-item-hover);
  }

  & a {
    @apply --list-item;
    line-height: 26px;
    position: relative;
  }

  & .separator-first,
  & .separator-components {
    margin-top: 60px;
    position: relative;

    &:before {
      position: absolute;
      top: -30px;
      @apply --list-title;
    }
  }

  & .separator-first {
    margin-top: 30px;
  }

  & .separator-first:before {
    content: 'General variables';
  }

  & .separator-components:before {
    content: 'Component variables';
  }
}

.tr-customizer__label {
  @apply --list-item;

  width: calc(100% - 40px);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  display: inline-block;
  padding: 0 var(--content-padding);
  box-sizing: border-box;
}

.tr-customizer__indicator {
  width: 13px;
  height: 13px;
  border-radius: 50%;
}

.tr-customizer__color {
  width: 25px;
  height: 25px;
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 3px;
  box-sizing: border-box;

  & input {
    visibility: hidden;
  }

  & span, & input {
    z-index: 1;
    width: 23px;
    height: 23px;
    position: absolute;
    border-radius: 3px;

    &:nth-child(2) {
      background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMElEQVQ4T2N89uzZfwY8QFJSEp80A+OoAcMiDP7//483HTx//hx/Ohg1gIFx6IcBALl+VXknOCvFAAAAAElFTkSuQmCC");
    }
  }
}

.tr-customizer__download {
  width: 100%;
  display: block;
  text-align: center;
}

.tr-customizer__bulk {
  height: 100%;
  padding-top: calc(var(--content-padding) * 2);

  & > a {
    top: 10px;
    right: 12px;
  }

  & .tr-customizer__toolbar {
    justify-content: flex-end;
    padding: 0;
    height: auto;
    padding: var(--content-padding);

    & span {
      position: absolute;
      left: var(--content-padding);
    }
  }
}

.tr-customizer__bulk--editor {
  padding: var(--scroll-margin);
  height: 400px;
  border-top: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);

  & textarea {
    width: 100%;
    max-width: 100%;
    height: 100%;
    color: #333;
    line-height: 22px;
    font-family: monospace;
    white-space: nowrap;
    padding: 12px;
    box-sizing: border-box;
    border: 0;
  }
}
</style>
