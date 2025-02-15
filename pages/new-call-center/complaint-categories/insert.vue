<template>
  <ComplaintCategoriesForm />
</template>

<script>
import ComplaintCategoriesForm from '@/components/Setting/ComplaintCategoriesForm.vue'
export default {
  components: { ComplaintCategoriesForm },
  data: () => ({
    title: 'افزودن دسته بندی جدید',
  }),
  mounted() {
    this.$store.dispatch('setPageTitle', this.title)
  },
}
</script>
