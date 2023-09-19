<template>
  <div>
    <GetHistory />
  </div>
</template>
<script>
import GetHistory from "@/components/CentralBime/GetHistory.vue";
export default {
  components: { GetHistory },
  data() {
    return {
      title: "استعلام بیمه"
    };
  },
  beforeMount() {
    this.$store.dispatch("setPageTitle", this.title);
  }
};
</script>
