<template>
  <label
    class="tr-radio"
    :checked="model === value"
  >
    <input
      ref="input"
      type="radio"
      v-bind="$attrs"
      :value="value"
      @change="$event.target.checked && $emit('change', value)"
      class="tr-radio__input"
    >
    <span class="tr-radio__checkmark"/>
  </label>
</template>

<script>
export default {
  name: 'TRRadio',
  model: {
    prop: 'model',
    event: 'change',
  },
  props: {
    model: {
      type: [Number, String],
      default: undefined,
    },
    value: {
      type: [Number, String],
      default: undefined,
    },
  },
  watch: {
    model() {
      this.updateValue();
    },
  },
  mounted() {
    this.updateValue();
  },
  methods: {
    updateValue() {
      this.$refs.input.checked = this.model === this.value;
    },
  },
};
</script>

<style scoped>
.tr-radio{
  position: relative;
  display: inline-block;
  vertical-align: top;
  user-select: none;
  position: relative;
  text-align: left;
  width: 16px;
}

.tr-radio__input {
  position: absolute;
  cursor: pointer;
  right: 0;
  top: 0;
  left: 0;
  bottom: 0;
  padding: 0;
  border: 0;
  background-color: transparent;
  z-index: 1;
  vertical-align: top;
  outline: none;
  width: 100%;
  height: 100%;
  margin: 0;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;

  user-select: auto;
  -webkit-touch-callout: none;

  &:checked:before {


    box-shadow: 0 0 0 14px #37474f;
    background-color: #37474f;
  }

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    box-shadow: 0 0 0 14px #717171;
    border: none;
    box-sizing: border-box;
    border-radius: 50%;
    background-color: #717171;
    pointer-events: none;
    display: block;
    transform: scale3d(0.2, 0.2, 0.2);
    transition: opacity 0.25s ease-out, transform 0.1s ease-out;
  }
}

.tr-radio__checkmark {
  background-clip: padding-box;
  display: inline-block;
  vertical-align: top;
  user-select: none;
  position: relative;
  background: transparent;
  pointer-events: none;
  background: rgba(0, 0, 0, 0);
  overflow: visible;

  &:before {
    left: 0;
    content: '';
    position: absolute;
    background: transparent;
    border: 1px solid var(--border-color);
    box-sizing: border-box;
    border-radius: 50%;
    width: 16px;
    height: 16px;
    transition: border-color 0.2s ease;
  }

  &:after {
    content: '';
    position: absolute;
    background: transparent;
    top: 4px;
    left: 4px;
    width: 8px;
    height: 8px;
    border: none;
    border-radius: 50%;
    transform: scale(0);
    transition: background 0.2s ease, transform 0.2s ease;
  }
}

:checked + .tr-radio__checkmark {

  &:before {
    border-color: var(--primary);
  }

  &:after {
    opacity: 1;
    background: var(--primary);
    transform: scale(1);
  }
}

</style>
