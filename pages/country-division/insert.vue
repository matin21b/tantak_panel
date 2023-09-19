<template>
    <CountryDivisionForm />
</template>
<script>
import CountryDivisionForm from "@/components/CountryDivision/CountryDivisionForms.vue";
export default {
  components: { CountryDivisionForm },
  data() {
    return {
      title: "افزودن شهر و استان"
    };
  },
  beforeMount() {
    this.$store.dispatch("setPageTitle", this.title);
  }
};
</script>
