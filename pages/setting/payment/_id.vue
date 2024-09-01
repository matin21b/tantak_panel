<template>
  <PaymentSettings :model-id="$route.params.id" />
</template>

<script>
import PaymentSettings from '@/components/Setting/PaymentSettings.vue'
export default {
  components: { PaymentSettings },
  data: () => ({
    title: 'ویرایش بازه زمانی حذف سبد خرید',
  }),
  mounted() {
    this.$store.dispatch('setPageTitle', this.title)
  },
}
</script>
