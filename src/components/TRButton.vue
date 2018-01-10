<template>
  <a
    class="tr-button"
    :class="{ inverted, loader: loading }"
    v-on="$listeners"
  >
    <div :style="{ opacity: Number(!loading) }">
      <i
        v-if="icon && icons[icon]"
        class="tr-button__icon"
        :class="icon"
        v-html="icons[icon]"
      />
      <span class="tr-button__label">
        <slot>{{ label }}</slot>
      </span>
    </div>
  </a>
</template>

<script>
import pencilIcon from '@/assets/inline/pencil.svg';
import downloadIcon from '@/assets/inline/download.svg';

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
    loading: {
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
  background-color: var(--primary);
  color: #fff;
  transition: all .15s ease;
  position: relative;

  &:hover {
    background-color: color(var(--primary) shade(10%))
  }

  &:active {
    background-color: color(var(--primary) shade(20%))
  }

  &.inverted {
    background-color: #fff;
    color: var(--primary);
    border: 1px solid var(--primary);
    &:hover {
      background-color: color(var(--primary) tint(95%))
    }
    &:active {
      background-color: color(var(--primary) tint(80%));
    }
  }

  &:after {
    position: absolute;
    top: calc(50% - var(--loader-size) / 2 - 1px);
    left: calc(50% - var(--loader-size) / 2 - 1px);
  }

  &[disabled] {
    opacity: 0.8;
    pointer-events: none;
    background-color: rgba(0, 0, 0, 0.05);
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
