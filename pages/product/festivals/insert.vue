<template>
  <FestivalsForm />
</template>

<script>
import FestivalsForm from '~/components/Product/Festival/FestivalsForm.vue'
export default {
  components: { FestivalsForm },
  data: () => ({
    title: 'ثبت  جشنواره جدید',
  }),
  mounted() {
    this.$store.dispatch('setPageTitle', this.title)
  },
}
</script>
