<template>
  <div>
    <CollectiveSellForm :model-id="$route.params.id" />
  </div>
</template>
  
  <script>
import CollectiveSellForm from "@/components/CollectiveSell/CollectiveSellForm.vue";
export default {
  components: { CollectiveSellForm },
  data: () => ({
    title: " ویرایش ناحیه ",
  }),
  beforeMount() {
    this.$store.dispatch("setPageTitle", this.title);
  },
  methods: {},
};
</script>