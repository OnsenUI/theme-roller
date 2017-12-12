<template>
  <button class="tr-button" v-on="$listeners">
    <slot>{{ label }}</slot>
  </button>
</template>

<script>
export default {
  name: 'TRButton',
  props: {
    label: {
      type: String,
      default: 'Empty',
    },
  },
};
</script>

<style scoped>
.tr-button {
  white-space: nowrap;
}
</style>
