<template>
  <div class="tr-preview-list">
    <TRPreviewItem
      v-for="component in annotations"
      :key="component.name"
      :component="component"
    />
  </div>
</template>

<script>
import { mapMutationState } from '@/store';
import TRPreviewItem from '@/components/TRPreviewItem';

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
    annotations() {
      return this.cssComponents
        .map(c => c.annotation)
        .filter(a => ['All', a.category]
          .indexOf(this.selectedCategory) !== -1)
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
  },
};
</script>

<style scoped>
.tr-preview-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;

  @media (--smallscreen) {
    display: block;
  }
}
</style>
