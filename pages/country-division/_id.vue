<template>
    <CountryDivisionForm  :model-id="$route.params.id" />
</template>
<script>
import CountryDivisionForm from "@/components/CountryDivision/CountryDivisionForms.vue";
export default {
  components: { CountryDivisionForm },
  data() {
    return {
      title: "ویرایش شهر و استان"
    };
  },
  beforeMount() {
    this.$store.dispatch("setPageTitle", this.title);
  }
};
</script>
