<template>
  <CategoryTaskForm :model-id="$route.params.id" />
</template>

<script>
import CategoryTaskForm from '@/components/Setting/CategoryTaskForm.vue'
export default {
  components: { CategoryTaskForm },
  data: () => ({
    title: 'ویرایش دسته بندی',
  }),
  mounted() {
    this.$store.dispatch('setPageTitle', this.title)
  },
}
</script>
