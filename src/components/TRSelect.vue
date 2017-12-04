<template>
  <label class="tr-select">
    <span class="tr-select__label">{{ label }}</span>

    <select
      class="tr-select__input"
      v-on="$listeners"
    >
      <option
        v-if="options.length === 0"
        value="-1"
        selected
      >
        Choose
      </option>

      <option
        v-for="(option, $index) in options"
        :key="option"
        :value="$index"
      >
        {{ option }}
      </option>
    </select>
  </label>
</template>

<script>
export default {
  name: 'TRSelect',

  props: {
    label: {
      type: String,
      default: '',
    },
    options: {
      type: Array,
      default() {
        return [];
      },
    },
  },
};
</script>

<style scoped>
.tr-select {
  position: relative;

  &:after {
    content: ' ';
    display: block;
    width: 6px;
    height: 6px;
    position: absolute;
    right: 7px;
    bottom: 10px;
    border-color: #666;
    border-style: solid;
    border-width: 0 1px 1px 0;
    transform: rotate(45deg);
  }
}

.tr-select__input {
  -webkit-appearance: none;
  appearance: none;
  height: 25px;
  line-height: 25px;
  border: 1px solid #d9d9d9;
  border-radius: 2px;
  padding: 0 20px 0 4px;
  color: #222;
  position: relative;
  background-repeat: no-repeat;
  background-position: right 6px center;
}
</style>
