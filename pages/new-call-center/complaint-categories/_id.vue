<template>
  <ComplaintCategoriesForm :model-id="$route.params.id" />
</template>

<script>
import ComplaintCategoriesForm from '@/components/Setting/ComplaintCategoriesForm.vue'
export default {
  components: { ComplaintCategoriesForm },
  data: () => ({
    title: 'ویرایش دسته بندی نقش',
  }),
  mounted() {
    this.$store.dispatch('setPageTitle', this.title)
  },
}
</script>
