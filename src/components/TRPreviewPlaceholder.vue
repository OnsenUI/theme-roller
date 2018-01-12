<template>
  <div class="tr-preview-placeholder">
    <vue-content-loading
      :width="280"
      :height="236"
      :speed="2"
      primary="#f3f3f3"
      secondary="#ecebeb"
    >

      <circle
        cx="270"
        cy="225"
        r="6.6"
      />
      <rect
        x="12"
        y="221"
        rx="4"
        ry="4"
        width="144.5"
        height="7.52"
      />
      <rect
        x="2"
        y="6"
        rx="5"
        ry="5"
        width="280"
        height="201"
      />

    </vue-content-loading>
  </div>
</template>

<script>
import VueContentLoading from 'vue-content-loading';

export default {
  name: 'TRPreviewPlaceholder',
  components: {
    VueContentLoading,
  },
};
</script>

<style scoped>
.tr-preview-placeholder {
  display: block;
  width: 280px;
  box-sizing: border-box;
  margin: 0px 16px 26px;
}
</style>
