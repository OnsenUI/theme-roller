<template>
  <div class="tr-preview-list" @scroll="onScroll">
    <section v-if="sortedCategories.length === 0">
      <a class="tr-preview-list__header-link">
        <h3 class="tr-preview-list__title">
          <span>Loading</span>
        </h3>
      </a>

      <div class="tr-preview-list__category">
        <TRPreviewPlaceholder
          v-for="n in 10"
          :key="n"
        />
      </div>
    </section>

    <section
      v-for="category in sortedCategories"
      :key="category"
    >

      <a
        class="tr-preview-list__header-link"
        :href="`#${categoryId[category]}`"
      >
        <h3
          class="tr-preview-list__title"
          :id="categoryId[category]"
          :ref="`title.${categoryId[category]}`"
        >
          <span>
            {{ category }}
          </span>
        </h3>
      </a>

      <div
        class="tr-preview-list__category"
      >
        <TRPreviewItem
          v-for="component in groupedAnnotations[category]"
          :key="component.name"
          :component="component"
        />
      </div>
    </section>
  </div>
</template>

<script>
import { mapMutationState } from '@/store';
import TRPreviewItem from '@/components/TRPreviewItem';
import TRPreviewPlaceholder from '@/components/TRPreviewPlaceholder';
import util from '@/util';

export default {
  name: 'TRPreviewList',
  components: {
    TRPreviewItem,
    TRPreviewPlaceholder,
  },

  data() {
    return {
      groupedAnnotations: [],
    };
  },

  computed: {
    ...mapMutationState([
      'cssComponents',
      'loading',
      'selectedCategory',
      'selectedPlatform',
    ]),
    sortedCategories() {
      return Object.keys(this.groupedAnnotations).sort(); // eslint-disable-line
    },
    categoryId() {
      return this.sortedCategories.reduce((result, category) => ({
        ...result,
        [category]: util.toId(category),
      }), {});
    },
  },

  watch: {
    selectedPlatform() {
      this.updateAnnotations();
    },
    cssComponents: {
      immediate: true,
      handler() {
        this.updateAnnotations();
      },
    },
  },

  methods: {
    updateAnnotations() {
      const update = () => {
        const p = this.selectedPlatform;
        this.groupedAnnotations = this.cssComponents
          .reduce((result, component) => {
            const { annotation } = component;
            const md = /Material/i.test(annotation.name);

            if (p === 'All'
              || (p === 'Android' && md)
              || (p === 'iOS' && !md)
            ) {
              const { category } = annotation;
              if (!Object.hasOwnProperty.call(result, category)) {
                result[category] = [];
              }
              result[category].push(annotation);
            }

            return result;
          }, {});

        this.loading = false;
      };

      if (this.loading) {
        setTimeout(update, 100); // Asynchronous on UI click
      } else {
        update(); // Synchronous on initial load
      }
    },

    onScroll() {
      if (!this.lock) {
        this.lock = true;
        setTimeout(() => { this.lock = false; }, 100);

        const offset = 150;
        const categories = this.sortedCategories;
        for (let i = categories.length - 1; i >= 0; i -= 1) {
          const id = this.categoryId[categories[i]];
          if (this.$el.scrollTop > this.$refs[`title.${id}`][0].offsetTop - offset) {
            this.selectedCategory = this.sortedCategories[i];
            return;
          }
        }
      }
    },
  },
};
</script>

<style scoped>
.tr-preview-list {

}

.tr-preview-list__category {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;

  @media (--smallscreen) {
    display: block;
  }

  & svg {
    width: 350px;
  }
}

.tr-preview-list__header-link {
  display: block;
  pointer-events: none;
  color: inherit;
  text-decoration: none;

  & .tr-preview-list__title {
    font-size: 24px;
    padding-left: var(--content-padding);
    margin-top: 10px;

    &:before {
      content: '';
      display: block;
      margin-top: -30px;
      height: 30px;
      visibility: hidden;
    }

    & span {
      pointer-events: auto;

      &:after {
        content: '#';
        color: var(--border-color);
        padding-left: 6px;
        opacity: 0;
      }
    }
  }

  &:hover span:after {
    opacity: 1;
  }
}
</style>
