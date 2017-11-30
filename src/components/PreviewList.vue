<template>
  <div class="tr-preview-list">
    <PreviewItem
      v-for="component in components"
      :key="component.name"
      :component="component"
    />
  </div>
</template>

<script>
import PreviewItem from '@/components/PreviewItem';

export default {
  name: 'PreviewList',
  components: {
    PreviewItem,
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
  clear: both;
  display: flex;
  flex-wrap: wrap;
  margin: 0 0 50vh -10px;
}
</style>
