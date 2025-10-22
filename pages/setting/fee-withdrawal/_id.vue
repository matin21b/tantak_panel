<template>
  <FeeWithdrawal :model-id="$route.params.id" />
</template>

<script>
import FeeWithdrawal from '@/components/Setting/FeeWithdrawal.vue'
export default {
  components: { FeeWithdrawal },
  data: () => ({
     title: 'ویرایش حق برداشت',
  }),
  mounted() {
    this.$store.dispatch('setPageTitle', this.title)
  },
}
</script>
