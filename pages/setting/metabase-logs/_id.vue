<template>
  <MetabaseLogs :model-id="$route.params.id" />
</template>

<script>
import MetabaseLogs from '@/components/Setting/MetabaseLogs.vue'
export default {
  components: { MetabaseLogs },
  data: () => ({
    title: 'ویرایش بابت',
  }),
  mounted() {
    this.$store.dispatch('setPageTitle', this.title)
  },
}
</script>
