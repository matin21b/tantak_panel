<template>
  <CategoryContact :model-id="$route.params.id" />
</template>

<script>
import CategoryContact from '@/components/Setting/CategoryContact.vue'
export default {
  components: { CategoryContact },
  data: () => ({
    title: 'ویرایش دسته بندی',
  }),
  mounted() {
    this.$store.dispatch('setPageTitle', this.title)
  },
}
</script>
