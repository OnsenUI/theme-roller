<template>
  <a
    class="tr-button"
    :class="{ inverted }"
    v-on="$listeners"
  >
    <i
      v-if="icon && icons[icon]"
      class="tr-button__icon"
      :class="icon"
      v-html="icons[icon]"
    />
    <span class="tr-button__label">
      <slot>{{ label }}</slot>
    </span>
  </a>
</template>

<script>
import pencilIcon from '@/assets/pencil.svg';
import downloadIcon from '@/assets/download.svg';

export default {
  name: 'TRButton',

  props: {
    label: {
      type: String,
      default: 'Empty',
    },
    icon: {
      type: String,
      default: '',
    },
    inverted: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      icons: {
        pencil: pencilIcon,
        download: downloadIcon,
      },
    };
  },

};
</script>

<style scoped>
.tr-button {
  border-radius: 2px;
  padding: 8px 14px;
  white-space: nowrap;
  background-color: var(--red);
  color: #fff;
  transition: all .15s ease;

  &:hover {
    background-color: color(var(--red) shade(10%))
  }

  &:active {
    background-color: color(var(--red) shade(20%))
  }

  &.inverted {
    background-color: #fff;
    color: var(--red);
    border: 1px solid var(--red);
    &:hover {
      background-color: color(var(--red) tint(95%))
    }
    &:active {
      background-color: color(var(--red) tint(80%));
    }
  }
}

.tr-button__label {

}

.tr-button__icon {
  position: relative;
  width: 16px;
  height: 16px;
  display: inline-block;
  vertical-align: middle;

  &.pencil {
    margin-top: -1px;
  }
}
</style>

<style>
.tr-button__icon svg {
  width: 16px;
  position: absolute;
  top: 0;
  left: 0;
}
</style>
