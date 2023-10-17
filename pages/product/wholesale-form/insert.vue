<template>
  <div>
    <WholwsaleForm />
  </div>
</template>
  
  <script>
import WholwsaleForm from "@/components/Product/WholwsaleForm.vue";
export default {
  components: {  WholwsaleForm },
  data: () => ({
    title: "ایجاد فرم",
  }),
  beforeMount() {
    this.$store.dispatch("setPageTitle", this.title);
  },
  methods: {
  },
};
</script>