<template>
  <NotSystemProducts />
</template>

<script>
import NotSystemProducts from '@/components/Setting/NotSystemProducts.vue'
export default {
  components: { NotSystemProducts },
  data: () => ({
    title: 'ایجاد محصول غیر سیستمی',
  }),
  mounted() {
    this.$store.dispatch('setPageTitle', this.title)
  },
}
</script>
