<template>
  <MetabaseLogs />
</template>

<script>
import MetabaseLogs from '@/components/Setting/MetabaseLogs.vue'
export default {
  components: { MetabaseLogs },
  data: () => ({
    title: 'افزودن بابت جدید',
  }),
  mounted() {
    this.$store.dispatch('setPageTitle', this.title)
  },
}
</script>
