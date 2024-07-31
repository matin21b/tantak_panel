<template>
  <InternalForm :model-id="$route.params.id" />
</template>

<script>
import InternalForm from '@/components/NewCallCenter/InternalForm.vue'
export default {
  components: { InternalForm },
  data: () => ({
    title: 'ویرایش دسته بندی',
  }),
  mounted() {
    this.$store.dispatch('setPageTitle', this.title)
  },
}
</script>
