<template>
  <FinotechForm :model-id="$route.params.id" />
</template>

<script>
import FinotechForm from "@/components/Setting/FinotechForm.vue";
export default {
  components: { FinotechForm },
  data: () => ({
    title: "ویرایش     کلید ",
  }),
  mounted() {
    this.$store.dispatch("setPageTitle", this.title);
  },
};
</script>
