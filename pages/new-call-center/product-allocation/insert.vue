<template>
  <div>
    <!-- <MessageForm /> -->
  </div>
</template>

<script>
import MessageForm from "@/components/NewCallCenter/MessageForm.vue";
export default {
  components: { MessageForm },
  data: () => ({
    title: "",
  }),
  beforeMount() {
    if (this.$route.query.type == "Product") {
      this.title = "ایجاد محصول";
    } else {
      this.title = "ایجاد پکیج";
    }
  },
  mounted() {
    this.$store.dispatch("setPageTitle", this.title);
  },
};
</script>
