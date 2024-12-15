<template>
  <div>
    <PersonShoppingForm />
  </div>
</template>

<script>
import PersonShoppingForm from "@/components/Product/PersonShopping/PersonShoppingForm.vue";
export default {
  components: { PersonShoppingForm },
  data: () => ({
    title: "ثبت  فروش",
  }),
  beforeMount() {},
  mounted() {
    this.$store.dispatch("setPageTitle", this.title);
  },
};
</script>
