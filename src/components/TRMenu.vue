<i18n>
en:
  version: "Version"
  theme: "Theme Preset"
  platforms: "Platforms"
  categories: "Categories"
  customize: "Customize"
ja:
  version: "バージョン"
  theme: "テーマプリセット"
  platforms: "プラットフォーム"
  categories: "カテゴリー"
  customize: "カスタマイズ"
</i18n>

<template>
  <div class="tr-menu">
    <div class="tr-menu__subtitle inverted" :class="{ loader: loading === 'version' }">
      <span>Onsen UI</span> {{ $t('version') }}
    </div>

    <TRSelect
      :options="versions"
      @change="versionChange"
      class="tr-menu__version"
      v-model="versionIndex"
    >
      <option slot="after-options" value="-2">&lt;= 2.1.0</option>
    </TRSelect>

    <div class="tr-menu__subtitle inverted" :class="{ loader: loading === 'theme' }">
      {{ $t('theme') }}
    </div>

    <ul
      class="tr-menu__list themes"
      @change="loading = 'theme'; themeChange($event)"
    >
      <li
        v-for="(label, $index) in themes.map(t => t.label)"
        :key="`${version}-${label}`"
      >
        <label>
          <a>
            <TRRadio
              :value="$index"
              v-model="selectedTheme"
              class="input"
            />
            <span>{{ label }}</span>
          </a>
        </label>
      </li>

      <li @change.stop>
        <label>
          <a class="tr-menu__customizer">
            <TRCheckbox
              v-model="showCustomizer"
              class="input"
            />
            <span>{{ $t('customize') }}</span>
          </a>
        </label>
      </li>
    </ul>

    <div class="tr-menu__subtitle inverted" :class="{ loader: loading === 'platform' }">
      {{ $t('platforms') }}
    </div>

    <ul class="tr-menu__list platforms">
      <li
        v-for="platform in platforms"
        :key="`${version}-${platform}`"
        @change="loading = 'platform'"
      >
        <label>
          <a>
            <TRRadio
              :value="platform"
              v-model="selectedPlatform"
              class="input"
            />
            <span>{{ platform }}</span>
          </a>
        </label>
      </li>
    </ul>

    <div class="tr-menu__subtitle">
      {{ $t('categories') }}
    </div>

    <ul class="tr-menu__list categories">
      <template v-if="categories.length === 0">
        <li v-for="n in 10" :key="n">
          <label>
            <a>
              <vue-content-loading
                :width="26"
                :height="2"
                :speed="2"
                primary="#f3f3f3"
                secondary="#ecebeb"
              >
                <rect
                  x="0"
                  y="0"
                  rx="1"
                  ry="1"
                  width="16"
                  height="2"
                />
              </vue-content-loading>
            </a>
          </label>
        </li>
      </template>
      <li
        v-for="category in categories"
        :key="`${version}-${category}`"
      >
        <label>
          <a
            :href="`#${toId(category)}`"
            @click="selectedCategory = category"
            :class="category === selectedCategory ? 'current' : ''"
          >
            <span>{{ category }}</span>
          </a>
        </label>
      </li>
    </ul>
  </div>
</template>

<script>
import util from '@/util';
import cache from '@/api/cache';
import TRCheckbox from '@/components/TRCheckbox';
import TRRadio from '@/components/TRRadio';
import TRSelect from '@/components/TRSelect';
import { mapMutationState } from '@/store';
import VueContentLoading from 'vue-content-loading';

export default {
  name: 'TRMenu',
  components: {
    TRCheckbox,
    TRRadio,
    TRSelect,
    VueContentLoading,
  },

  data() {
    return {
      platforms: ['All', 'iOS', 'Android'],
      selectedTheme: Number(cache.get('selected-theme')) || 0,
    };
  },
  computed: {
    ...mapMutationState([
      'cssComponents',
      'loading',
      'selectedCategory',
      'selectedPlatform',
      'showCustomizer',
      'version',
      'versionIndex',
      'versions',
      'themes',
    ]),
    categories() {
      return this.$store.getters.categories;
    },
  },

  methods: {
    versionChange(event) {
      const value = Number(event.target.value);
      if (value === -2) { // Redirect to Theme Roller for <= 2.1.0
        window.location.replace('https://components.onsen.io/old-theme-roller.html');
      } else {
        this.loading = 'version';

        this.selectedTheme = 0;
        cache.set('selected-theme', 0, true);

        cache.set('selected-version', this.versions.length - value, true);
        this.$emit('version', this.versions[value] || '');
      }
    },
    themeChange(event) {
      if (event.target.type === 'radio') {
        const { value } = event.target;
        cache.set('selected-theme', value, true);
        this.$emit('theme', this.themes[value].theme.name);
      }
    },
    toId(string) {
      return util.toId(string);
    },
  },
};
</script>

<style scoped>
.tr-menu {
  padding-left: 62px;
  padding-right: 6px;

  & li:hover {
    background-color: var(--list-item-hover);
  }
}

.tr-menu__version {
  padding: var(--list-item-padding);
  display: block;
}

.tr-menu__subtitle {
  @apply --list-title;
  line-height: 18px;

  &:not(:first-child) {
    margin-top: 16px;
  }

  & span {
    text-transform: none;
    font-style: italic;
  }

  &.loader:after {
    float: right;
    margin-right: 16px;
  }
}

.tr-menu__list {
  padding: 0;
  margin: 0;

  & a {
    @apply --list-item;
    display: block;
    position: relative;

    & .input {
      float: right;

      &[checked] + span {
        color: var(--primary);
      }
    }

    &.tr-menu__customizer {
      padding: 12px 16px;
      display: flex;
      justify-content: flex-start;

      & .input {
        float: left;
      }

      & span {
        padding-left: var(--checkbox-padding);
      }

      @media(--mobile) {
        display: none;
      }
    }
  }

  &.categories a:after {
    position: absolute;
    width: 0;
    height: 0;
    border: 3px solid #ff1a33;
    border-radius: 100%;
    right: 20px;
    top: 50%;
    transform: translate3d(0,-50%,0);
  }
  &.categories a.current {
    color: var(--primary);

    &:after {
      content: '';
    }
  }
}
</style>
