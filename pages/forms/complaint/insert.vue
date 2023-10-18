<template>
  <div>
    <Complaint />
  </div>
</template>
  
  <script>
import Complaint from "@/components/Forms/Complaint.vue";
export default {
  components: {  Complaint },
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