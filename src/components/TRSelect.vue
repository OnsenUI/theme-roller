<template>
  <label class="tr-select">
    <div class="tr-select__label">{{ label }}</div>

    <div class="tr-select__input">
      <select
        v-on="$listeners"
      >
        <option
          v-if="options.length === 0"
          value="-1"
          selected
        >
          Loading
        </option>

        <option
          v-for="(option, $index) in options"
          :key="keyPrefix + option"
          :value="$index"
        >
          {{ option }}
        </option>
      </select>
    </div>
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
    keyPrefix: {
      type: String,
      default: '',
    },
  },
};
</script>

<style scoped>
.tr-select__input {
  position: relative;
  margin-top: 4px;

  &:after {
    content: ' ';
    display: block;
    width: 6px;
    height: 6px;
    position: absolute;
    right: 7px;
    bottom: 7px;
    border-color: #666;
    border-style: solid;
    border-width: 0 1px 1px 0;
    transform: rotate(45deg);
  }
}

.tr-select__input select {
  width: 100%;
  appearance: none;
  height: 25px;
  line-height: 25px;
  border: 1px solid #d9d9d9;
  border-radius: 2px;
  padding: 0 20px 0 8px;
  color: #222;
  position: relative;
  background-repeat: no-repeat;
  background-position: right 6px center;
}
</style>
