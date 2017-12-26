<template>
  <div class="tr-preview-item">
    <div
      class="page tr-preview-item__box"
      :class="component.name.toLowerCase().indexOf('material') !== -1 && 'page--material'"
    >
      <div
        style="width: 100%;"
        v-html="component.markup"
        ontouchstart=" "
      />
    </div>

    <a class="tr-preview-item__title">
      {{ component.name }}
      <i
        class="tr-preview-item__icon"
        v-html="icons[/material/i.test(component.name) ? 'android' : 'apple']"
      />
    </a>
  </div>

</template>

<script>
import appleIcon from '@/assets/apple.svg';
import androidIcon from '@/assets/android.svg';

export default {
  name: 'TRPreviewItem',
  props: {
    component: {
      type: Object,
      default() {
        return {};
      },
    },
  },

  data() {
    return {
      icons: {
        apple: appleIcon,
        android: androidIcon,
      },
    };
  },
};
</script>

<style scoped>
.tr-preview-item {
  display: block;
  width: 350px;
  box-sizing: border-box;
  margin: 0px 16px 26px;

  @media (--smallscreen) {
    width: auto;
    margin-right: 0px;
    margin-left: 0px;
  }
}

.tr-preview-item__title {
  color: #999;
  font-size: 14px;
  color: #444;
  font-weight: 500;
  line-height: 1.4;
  text-decoration: none;
  margin: 12px 0 4px 0;
  display: inline-block;
  padding: 0 10px;
  display: block;

  & i {
    float: right;
  }
}

.tr-preview-item__icon {
  width: 16px;
}

.tr-preview-item__box {
  height: 201px;
  text-align: center;
  position: relative;
  z-index: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  border-radius: 3px;
  width: 350px;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.08);
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  box-shadow: 0 1px 3px 1px rgba(0, 0, 0, 0.18);


  @media (--smallscreen) {
    width: auto;
    border-radius: 0;
    margin-right: -10px;
    margin-left: -10px;
    box-shadow: none;
  }
}
</style>
