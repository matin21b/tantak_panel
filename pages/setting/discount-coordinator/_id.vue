<template>
  <DiscountCoordinator :model-id="$route.params.id" />
</template>

<script>
import DiscountCoordinator from '@/components/Setting/DiscountCoordinator.vue'
export default {
  components: { DiscountCoordinator },
  data: () => ({
    title: 'ویرایش  کد تخفیف',
  }),
  mounted() {
    this.$store.dispatch('setPageTitle', this.title)
  },
}
</script>
