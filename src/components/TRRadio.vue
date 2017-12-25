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
    >
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
.tr-radio {

}
</style>
