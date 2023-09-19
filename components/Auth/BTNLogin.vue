<template>
  <div>
    <div>
      <amp-button text="ورود با رمز عبور" color="success" @click="submit(false)" v-if="value" />
      <amp-button text="ورود با کد" color="success" @click="submit(true)" v-else />
    </div>
  </div>
</template>

<script>
export default {
  props: { value: { type: Boolean } },
  methods: {
    submit(value) {
      this.$emit('input', value)
    },
  },
}
</script>
