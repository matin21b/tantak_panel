<template>
  <div>
    <Complaint :model-id="$route.params.id" />
  </div>
</template>

<script>
import Complaint from "@/components/Forms/Complaint.vue";

export default {
  components: { Complaint },
  data: () => ({
    title: "ویرایش فرم"
  }),
  beforeMount() {
    this.$store.dispatch("setPageTitle", this.title);
  },
  methods: {}
};
</script>
