<template>
  <NotSystemProducts :model-id="$route.params.id" />
</template>

<script>
import NotSystemProducts from '@/components/Setting/NotSystemProducts.vue'
export default {
  components: { NotSystemProducts },
  data: () => ({
    title: 'ویرایش  محصول',
  }),
  mounted() {
    this.$store.dispatch('setPageTitle', this.title)
  },
}
</script>
