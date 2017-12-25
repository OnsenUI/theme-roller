<template>
  <label
    class="tr-checkbox"
    :checked="model === true"
  >
    <input
      type="checkbox"
      v-bind="$attrs"
      @change="$emit('change', $event.target.checked)"
      class="tr-checkbox__input"
      :checked="model"
    >
    <span class="tr-checkbox__checkmark"/>
  </label>
</template>

<script>
export default {
  name: 'TRCheckbox',
  model: {
    prop: 'model',
    event: 'change',
  },
  props: {
    model: {
      type: Boolean,
      default: undefined,
    },
  },
};
</script>

<style scoped>
.tr-checkbox{
  position: relative;
  display: inline-block;
  vertical-align: top;
  cursor: pointer;
  user-select: none;
  position: relative;
  text-align: left;
  width: 16px;
}

.tr-checkbox__input {
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
  appearance: none;

  user-select: auto;
  -webkit-touch-callout: none;

  &:checked:before {
    box-shadow: 0 0 0 14px #37474f;
    background-color: #37474f;
  }

  &:before {
    content: '';
    opacity: 0;
    position: absolute;
    top: 0;
    left: 0;
    width: 18px;
    height: 18px;
    box-shadow: 0 0 0 11px #717171;
    box-sizing: border-box;
    border-radius: 50%;
    background-color: #717171;
    pointer-events: none;
    display: block;
    transform: scale3d(0.2, 0.2, 0.2);
    transition: opacity 0.25s ease-out, transform 0.1s ease-out;
  }
}

.tr-checkbox__checkmark {
  box-sizing: border-box;
  background-clip: padding-box;
  position: relative;
  display: inline-block;
  vertical-align: top;
  cursor: default;
  user-select: none;
  pointer-events: none;

  width: 18px;
  height: 18px;

  &:before {
    content: '';
    position: absolute;
    box-sizing: border-box;
    background-clip: padding-box;
    background: transparent;
    left: 0;
    border-radius: 2px;
    height: 18px;
    width: 18px;
    border: 1px solid var(--border-color);
    transition: background-color 0.1s linear 0.2s, border-color 0.1s linear 0.2s;
    background-color: transparent;
  }

  &:after {
    content: '';
    position: absolute;
    background: transparent;
    border: 2px solid #fff;
    border-top: none;
    border-right: none;
    border-radius: 0;
    transform: rotate(-45deg);
    opacity: 0;

    transition: transform 0.2s ease 0;
    width: 10px;
    height: 5px;
    top: 4px;
    left: 3px;
    transform: scale(0) rotate(-45deg);
  }
}

:checked + .tr-checkbox__checkmark {

  &:before {
    border: 2px solid var(--red);
    background-color: var(--red);
    transition: background-color 0.1s linear, border-color 0.1s linear;
  }

  &:after {
    transition: -webkit-transform 0.2s ease 0.2s;
    transition: transform 0.2s ease 0.2s;
    width: 10px;
    height: 5px;
    top: 4px;
    left: 3px;
    transform: scale(1) rotate(-45deg);
    border-width: 2px;
    opacity: 1;
  }
}

</style>
