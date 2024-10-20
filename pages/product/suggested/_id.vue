<template>
  <div>
      <DeliveryTimeForm :model-id='$route.params.id' />
  </div>
</template>

<script>
import DeliveryTimeForm from '@/components/Setting/DeliveryTimeForm.vue'
export default {
  components:{DeliveryTimeForm},
  data: () => ({
    title: 'ویرایش بازه زمانی',
  }),
  beforeMount() {
  },
  mounted() {
    this.$store.dispatch('setPageTitle', this.title)
  },
}
</script>