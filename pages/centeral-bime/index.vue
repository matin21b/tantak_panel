<template>
  <CentralBime />
</template>

<script>
import CentralBime from '@/components/CentralBime/CentralBimeList.vue'
export default {
  components: { CentralBime },
  data: () => ({
    title: "سوابق بیمه"
  }),
  watch: {
    serach() {
        this.main_items= this.SearchItem(this.items_body, this.serach)
    },
  },
  beforeMount() {
    this.$store.dispatch("setPageTitle", this.title);
  },
};
</script>
