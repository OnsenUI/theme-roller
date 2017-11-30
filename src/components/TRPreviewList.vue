<template>
  <div class="tr-preview-list">
    <TRPreviewItem
      v-for="component in components"
      :key="component.name"
      :component="component"
    />
  </div>
</template>

<script>
import TRPreviewItem from '@/components/TRPreviewItem';

export default {
  name: 'TRPreviewList',
  components: {
    TRPreviewItem,
  },
  props: {
    components: {
      type: Array,
      default() {
        return [];
      },
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
