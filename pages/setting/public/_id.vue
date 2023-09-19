<template>
  <SettinLogo :model-id="$route.params.id" />
</template>

<script>
import SettinLogo from '@/components/Setting/SettinLogo.vue'
export default {
  components: { SettinLogo },
  data: () => ({
    title: 'تنظیمات ',
  }),
  mounted() {
    this.$store.dispatch('setPageTitle', this.title)
  },
}
</script>
