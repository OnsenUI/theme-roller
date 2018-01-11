<template>
  <label class="tr-select">
    <div v-if="!!label" class="tr-select__label">{{ label }}</div>

    <div class="tr-select__input">
      <select
        @change="$emit('change', $event)"
        @input="$emit('input', $event.target.value)"
        ref="select"
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
  model: {
    event: 'input',
    prop: 'model',
  },

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
    model: {
      type: [Number, String],
      default: undefined,
    },
  },

  watch: {
    model() {
      setTimeout(() => { this.$refs.select.value = this.model; }, 0);
    },
  },
};
</script>

<style scoped>
.tr-select__input {
  position: relative;

  &:after {
    content: ' ';
    position: absolute;
    right: 4px;
    bottom: 8px;

    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 6px solid var(--primary);
  }
}

.tr-select__input select {
  @apply --list-item;
  color: var(--primary);
  background-color: transparent;
  appearance: none;
  height: 25px;
  line-height: 25px;
  border: 0;
  padding: 0;
  width: calc(100% + 4px);
  padding-left: 4px;
  margin-left: -4px;
  position: relative;
  background-repeat: no-repeat;
  background-position: right 6px center;
}
</style>
