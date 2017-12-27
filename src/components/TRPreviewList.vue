<template>
  <div class="tr-preview-list" @scroll="onScroll">
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
import util from '@/util';

export default {
  name: 'TRPreviewList',
  components: {
    TRPreviewItem,
  },
  computed: {
    ...mapMutationState([
      'cssComponents',
      'selectedCategory',
      'selectedPlatform',
    ]),
    filteredAnnotations() {
      return this.cssComponents
        .map(c => c.annotation)
        // Disable category filter, only scroll
        // .filter(a => ['All', a.category]
        //   .indexOf(this.selectedCategory) !== -1)
        .filter((a) => {
          if (this.selectedPlatform === 'Android') {
            return /Material/i.test(a.name);
          }
          if (this.selectedPlatform === 'iOS') {
            return !/Material/i.test(a.name);
          }
          return true;
        });
    },
    groupedAnnotations() {
      return this.filteredAnnotations
        .reduce((result, annotation) => {
          const { category } = annotation;
          result[category] = [...(result[category] || []), annotation];
          return result;
        }, {});
    },
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

  methods: {
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
}

.tr-preview-list__header-link {
  display: block;
  pointer-events: none;
  color: inherit;
  text-decoration: none;

  & .tr-preview-list__title {
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
