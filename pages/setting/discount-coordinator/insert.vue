<template>
  <DiscountCoordinator />
</template>

<script>
import DiscountCoordinator from '@/components/Setting/DiscountCoordinator.vue'
export default {
  components: { DiscountCoordinator },
  data: () => ({
    title: 'ایجاد  کد تخفیف',
  }),
  mounted() {
    this.$store.dispatch('setPageTitle', this.title)
  },
}
</script>
