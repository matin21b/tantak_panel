<template>
    <BimeReminderForm/>
</template>
<script>
import BimeReminderForm from '@/components/BimeReminder/BimeReminderForm.vue'
export default {
  components: { BimeReminderForm },
  data() {
    return {
      title: "افزودن"
    };
  },
  beforeMount() {
    this.$store.dispatch("setPageTitle", this.title);
  }
};
</script>
