<template>
  <div>
    <MoneyRequest />
  </div>
</template>
<script>
import MoneyRequest from "@/components/MoneyRequest/MoneyRequest.vue";
export default {
  components: { MoneyRequest },
  data() {
    return {
      title: "درخواست وجه",
    };
  },
  beforeMount() {
    this.$store.dispatch("setPageTitle", this.title);
  },
};
</script>
