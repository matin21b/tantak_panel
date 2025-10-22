<template>
  <FeeWithdrawal />
</template>

<script>
import FeeWithdrawal from '@/components/Setting/FeeWithdrawal.vue'
export default {
  components: { FeeWithdrawal },
  data: () => ({
    title: 'ثبت حق برداشت',
  }),
  mounted() {
    this.$store.dispatch('setPageTitle', this.title)
  },
}
</script>
