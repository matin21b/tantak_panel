<template>
  <FestivalsForm :model-id="$route.params.id" />
</template>

<script>
import FestivalsForm from '~/components/Product/Festival/FestivalsForm.vue'
export default {
  components: { FestivalsForm },
  data: () => ({
    title: 'ویرایش جشنواره ',
  }),
  mounted() {
    this.$store.dispatch('setPageTitle', this.title)
  },
}
</script>
