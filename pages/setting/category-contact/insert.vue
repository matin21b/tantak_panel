<template>
  <CategoryContact />
</template>

<script>
import CategoryContact from '@/components/Setting/CategoryContact.vue'
export default {
  components: { CategoryContact },
  data: () => ({
    title: 'افزودن دسته بندی جدید',
  }),
  mounted() {
    this.$store.dispatch('setPageTitle', this.title)
  },
}
</script>
