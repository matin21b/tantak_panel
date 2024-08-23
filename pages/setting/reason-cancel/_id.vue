<template>
  <ReasonCancel :model-id="$route.params.id" />
</template>

<script>
import ReasonCancel from '@/components/Setting/ReasonCancel.vue'
export default {
  components: { ReasonCancel },
  data: () => ({
    title: 'ویرایش  علت',
  }),
  mounted() {
    this.$store.dispatch('setPageTitle', this.title)
  },
}
</script>
