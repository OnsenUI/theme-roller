<template>
  <a
    class="tr-close-button"
    v-on="$listeners"
  >
    <span />
    <span />
  </a>
</template>

<script>
export default {
  name: 'TRCloseButton',
};
</script>

<style scoped>
.tr-close-button {
  width: 20px;
  height: 20px;
  position: absolute;
  right: var(--content-padding);

  & span {
    width: 24px;
    height: 2px;
    background-color: var(--border-color);
    position: absolute;
    left: 0;
    top: 50%;

    &:first-child {
      transform: rotate(45deg);
    }
    &:last-child {
      transform: rotate(-45deg);
    }
  }

  &:hover span {
    background-color: color(var(--border-color) shade(10%));
  }
  &:active span {
    background-color: color(var(--border-color) shade(20%));
  }
}
</style>
