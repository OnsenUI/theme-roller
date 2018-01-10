<template>
  <div class="tr-menu">
    <div class="tr-menu__subtitle">
      <span>Onsen UI</span> version
    </div>

    <TRSelect
      :options="versions"
      @change="versionChange"
      class="tr-menu__version"
    />

    <div class="tr-menu__subtitle">
      Theme Preset
    </div>

    <ul
      class="tr-menu__list themes"
      @change="themeChange"
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

      <li>
        <label>
          <a class="tr-menu__customizer">
            <TRCheckbox
              v-model="showCustomizer"
              class="input"
            />
            <span>Customize</span>
          </a>
        </label>
      </li>
    </ul>

    <div class="tr-menu__subtitle">
      Platforms
    </div>

    <ul class="tr-menu__list platforms">
      <li
        v-for="platform in platforms"
        :key="`${version}-${platform}`"
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
      Categories
    </div>

    <ul class="tr-menu__list categories">
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
import TRCheckbox from '@/components/TRCheckbox';
import TRRadio from '@/components/TRRadio';
import TRSelect from '@/components/TRSelect';
import { mapMutationState } from '@/store';

export default {
  name: 'TRMenu',
  components: {
    TRCheckbox,
    TRRadio,
    TRSelect,
  },

  data() {
    return {
      platforms: ['All', 'iOS', 'Android'],
      selectedTheme: 0,
    };
  },
  computed: {
    ...mapMutationState([
      'cssComponents',
      'selectedCategory',
      'selectedPlatform',
      'showCustomizer',
      'version',
      'versions',
      'themes',
    ]),
    categories() {
      return this.$store.getters.categories;
    },
  },

  methods: {
    versionChange(event) {
      this.selectedTheme = 0;
      this.$emit('version', this.versions[event.target.value] || '');
    },
    themeChange(event) {
      if (event.target.type === 'radio') {
        this.$emit('theme', this.themes[event.target.value].theme.name);
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
  padding-left: var(--content-padding);
  padding-right: calc(var(--content-padding) / 4);

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
  margin-top: 16px;

  & span {
    text-transform: none;
    font-style: italic;
  }
}

.tr-menu__button {
  margin: 10px var(--content-padding);
}

.tr-menu__button button {
  width: 100%;
  text-align: center;
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
