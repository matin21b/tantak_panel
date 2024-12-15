<template>
  <DeadlineBackForm />
</template>

<script>
import DeadlineBackForm from '@/components/Setting/DeadlineBackForm.vue'
export default {
  components: { DeadlineBackForm },
  data: () => ({
    title: 'افزودن  مهلت روز برگشت',
  }),
  mounted() {
    this.$store.dispatch('setPageTitle', this.title)
  },
}
</script>
