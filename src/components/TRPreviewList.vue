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
    ...mapMutationState(['cssComponents']),
    annotations() {
      return this.cssComponents.map(c => c.annotation);
    },
  },
};
</script>

<style scoped>
.tr-preview-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;

  @media (--smallscreen) {
    display: block;
  }
}
</style>
