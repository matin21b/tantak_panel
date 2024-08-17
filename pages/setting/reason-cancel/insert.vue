<template>
  <ReasonCancel />
</template>

<script>
import ReasonCancel from '@/components/Setting/ReasonCancel.vue'
export default {
  components: { ReasonCancel },
  data: () => ({
    title: 'افزودن علت جدید',
  }),
  mounted() {
    this.$store.dispatch('setPageTitle', this.title)
  },
}
</script>
