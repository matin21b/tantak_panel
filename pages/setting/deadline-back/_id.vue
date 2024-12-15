<template>
  <DeadlineBackForm :model-id="$route.params.id" />
</template>

<script>
import DeadlineBackForm from '@/components/Setting/DeadlineBackForm.vue'
export default {
  components: { DeadlineBackForm },
  data: () => ({
    title: 'ویرایش مهلت روز برکشت',
  }),
  mounted() {
    this.$store.dispatch('setPageTitle', this.title)
  },
}
</script>
