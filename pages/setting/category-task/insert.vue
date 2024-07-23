<template>
  <CategoryTaskForm />
</template>

<script>
import CategoryTaskForm from '@/components/Setting/CategoryTaskForm.vue'
export default {
  components: { CategoryTaskForm },
  data: () => ({
    title: 'ایجاد   دسته بندی جدید',
  }),
  mounted() {
    this.$store.dispatch('setPageTitle', this.title)
  },
}
</script>
