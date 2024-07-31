<template>
  <InternalForm />
</template>

<script>
import InternalForm from '@/components/NewCallCenter/InternalForm.vue'
export default {
  components: { InternalForm },
  data: () => ({
    title: 'ایجاد داخلی جدید',
  }),
  mounted() {
    this.$store.dispatch('setPageTitle', this.title)
  },
}
</script>
