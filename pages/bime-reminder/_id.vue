  <template>
      <BimeReminderFomr  :model-id="$route.params.id" />
  </template>
  <script>
  import BimeReminderFomr from '@/components/BimeReminder/BimeReminderForm.vue'
  export default {
    components: { BimeReminderFomr },
    data() {
      return {
        title: "ویرایش"
      };
    },
    beforeMount() {
      this.$store.dispatch("setPageTitle", this.title);
    }
  };
  </script>
