<template>
  <div>
    <WholwsaleForm :model-id="$route.params.id" />
  </div>
</template>

<script>
import WholwsaleForm from "@/components/Product/WholwsaleForm.vue";

export default {
  components: { WholwsaleForm },
  data: () => ({
    title: "ویرایش فرم"
  }),
  beforeMount() {
    this.$store.dispatch("setPageTitle", this.title);
  },
  methods: {}
};
</script>
