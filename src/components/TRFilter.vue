<template>
  <div class="tr-filter">
    <div class="tr-filter__subtitle">
      Platforms:
    </div>

    <ul class="tr-filter__categories">
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

    <div class="tr-filter__subtitle">
      Categories:
    </div>

    <ul class="tr-filter__categories">
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
import { mapMutationState } from '@/store';
// import util from '@/util';

export default {
  name: 'TRFilter',
  data() {
    return {
      platforms: ['All', 'iOS', 'Android'],
    };
  },
  computed: {
    ...mapMutationState([
      'cssComponents',
      'selectedCategory',
      'selectedPlatform',
      'version',
    ]),
    categories() {
      return ['All'].concat(this.cssComponents
        .map(c => c.annotation.category)
        .sort()
        .filter((el, i, arr) => el !== arr[i - 1]));
    },
  },

  methods: {
  },
};
</script>

<style scoped>
.tr-filter {
  padding-left: var(--content-padding);
  padding-right: var(--content-padding);
}

.tr-filter__subtitle {
  margin-top: 16px;
  font-weight: 700;
}

.tr-filter__button {
  margin: 10px var(--content-padding);
}

.tr-filter__button button {
  width: 100%;
  text-align: center;
}

.tr-filter__categories {
  padding: 0;
}

.tr-filter__categories label {
  margin-top: 10px;
  display: block;
  width: 100%;
  height: 26px;
  line-height: 26px;
  cursor: pointer;
}

.tr-filter__categories li:nth-child(even) {
  background-color: #f0f0f0;
}
</style>
