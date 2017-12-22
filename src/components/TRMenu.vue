<template>
  <div class="tr-menu">
    <div class="tr-menu__subtitle">
      <span>Onsen UI</span> version:
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
      class="tr-menu__list"
      @change="themeChange"
    >
      <li
        v-for="(label, $index) in themes.map(t => t.label)"
        :key="`${version}-${label}`"
      >
        <label>
          <a>
            <input
              type="radio"
              :value="$index"
              v-model="selectedTheme"
            >
            <span>{{ label }}</span>
          </a>
        </label>
      </li>

      <li>
        <label>
          <a class="tr-menu__customizer">
            <input
              type="checkbox"
              v-model="showCustomizer"
            >
            <span>Customize</span>
          </a>
        </label>
      </li>
    </ul>

    <div class="tr-menu__subtitle">
      Platforms:
    </div>

    <ul class="tr-menu__list">
      <li
        v-for="platform in platforms"
        :key="`${version}-${platform}`"
      >
        <label>
          <a>
            <input
              type="radio"
              :value="platform"
              v-model="selectedPlatform"
            >
            <span>{{ platform }}</span>
          </a>
        </label>
      </li>
    </ul>

    <div class="tr-menu__subtitle">
      Categories:
    </div>

    <ul class="tr-menu__list">
      <li
        v-for="category in categories"
        :key="`${version}-${category}`"
      >
        <label>
          <a>
            <input
              type="radio"
              :value="category"
              v-model="selectedCategory"
            >
            <span>{{ category }}</span>
          </a>
        </label>
      </li>
    </ul>
  </div>
</template>

<script>
import TRSelect from '@/components/TRSelect';
import { mapMutationState } from '@/store';

export default {
  name: 'TRMenu',
  components: {
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
      return ['All'].concat(this.$store.getters.categories);
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
  },
};
</script>

<style scoped>
.tr-menu {
  padding-left: var(--content-padding);
  padding-right: var(--content-padding);

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

    & input {
      float: right;

      &:checked + span {
        color: var(--red);
      }
    }

    &.tr-menu__customizer {
      padding: 12px 16px;
      display: flex;
      justify-content: flex-start;

      & input {
        float: left;
      }

      & span {
        padding-left: 12px;
      }
    }
  }
}

</style>
