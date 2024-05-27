<template>
  <div>
    <DeliveryTimeForm />
  </div>
</template>

<script>
import DeliveryTimeForm from '@/components/Setting/DeliveryTimeForm.vue'
export default {
  components: { DeliveryTimeForm },
  data: () => ({
    title: "ثبت بازه زمانی",
  }),
  beforeMount() {},
  mounted() {
    this.$store.dispatch("setPageTitle", this.title);
  },
};
</script>